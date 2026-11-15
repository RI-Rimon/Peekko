/* ========================================================
   Peekko - Custom Room Real-Time Multiplayer (v13.1)
   Cross-Network Mobile Data (4G/5G) & Wi-Fi Relay over WSS MQTT
   20 Hz Network Sync, 60 FPS LERP Remote Interpolation,
   Instant Catch Revelation, Fair Hider Elimination / Spectator,
   Clean Disconnect / Mid-Game Exit Handling & Leaderboards
   ======================================================== */

(function () {
  'use strict';

  const MP_CFG = (typeof window !== 'undefined' && window.PEEKKO_CONFIG && window.PEEKKO_CONFIG.multiplayer) || {
    hidingPhaseSeconds: 20,
    minPlayers: 2,
    maxPlayers: 5,
    defaultAttempts: 10,
    allowedAttempts: [7, 10, 15, 20],
    hiderPalette: ['#38bdf8', '#10b981', '#a855f7', '#ec4899', '#f43f5e'],
    seekerColor: '#f59e0b',
    syncHz: 12
  };

  // Pre-calculated, 100% collision-free spawn nodes across distinct rooms for maps 1-5
  const MP_SPAWN_NODES = {
    1: { // Skyglass Penthouse
      seeker: { x: 680, y: 610, angle: Math.PI / 2 },
      hiders: [
        { x: 680, y: 400, angle: -Math.PI / 2 }, // Living Room
        { x: 285, y: 380, angle: 0 },             // Master Bedroom
        { x: 1040, y: 200, angle: Math.PI },      // Study Room
        { x: 220, y: 616, angle: 0 }              // Lounge / Balcony
      ]
    },
    2: { // Midnight Manor
      seeker: { x: 680, y: 640, angle: Math.PI / 2 },
      hiders: [
        { x: 680, y: 350, angle: -Math.PI / 2 }, // Central Great Hall
        { x: 260, y: 250, angle: 0 },             // Library / Study
        { x: 1080, y: 250, angle: Math.PI },      // Dining Room
        { x: 330, y: 690, angle: 0 }              // West Gallery
      ]
    },
    3: { // Warehouse Basement
      seeker: { x: 740, y: 674, angle: Math.PI / 2 },
      hiders: [
        { x: 730, y: 270, angle: -Math.PI / 2 }, // Central Vault
        { x: 240, y: 270, angle: 0 },             // West Storage Bay
        { x: 1080, y: 260, angle: Math.PI },      // East Generator Room
        { x: 335, y: 635, angle: 0 }              // Loading Dock
      ]
    },
    4: { // Grand Shopping Mall
      seeker: { x: 780, y: 825, angle: Math.PI / 2 },
      hiders: [
        { x: 780, y: 400, angle: -Math.PI / 2 }, // Central Plaza
        { x: 215, y: 245, angle: 0 },             // West Retail Wing
        { x: 1260, y: 245, angle: Math.PI },      // East Food Court
        { x: 780, y: 145, angle: 0 }              // North Electronics Promenade
      ]
    },
    5: { // Wonderland Park
      seeker: { x: 920, y: 930, angle: Math.PI / 2 },
      hiders: [
        { x: 920, y: 745, angle: -Math.PI / 2 }, // Central Fountain Plaza
        { x: 300, y: 810, angle: 0 },             // West Carnival Midway
        { x: 620, y: 345, angle: 0 },             // North Picnic Meadow
        { x: 1480, y: 925, angle: Math.PI }       // East Amusement Arcade
      ]
    }
  };

  function generateRoomCode() {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = 'PK';
    for (let i = 0; i < 3; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  function normalizeRoomCode(raw) {
    if (!raw) return '';
    let code = raw.toUpperCase().trim();
    if (code.length === 3 && !code.startsWith('PK')) {
      code = 'PK' + code;
    }
    return code;
  }

  class MultiplayerManager {
    constructor(game) {
      this.game = game;
      this.isHost = false;
      this.roomCode = null;
      this.localPlayerId = null;
      this.localPlayerName = 'Agent';
      this.status = 'idle'; // 'idle' | 'creating' | 'joining' | 'lobby' | 'in_game'

      // Room Settings
      this.settings = {
        mapId: 1,
        lightingMode: 'dark',
        attemptsLimit: 10
      };

      // Live Room Players
      this.players = [];

      // Match State
      this.phase = 'lobby'; // 'lobby' | 'mp_hiding_countdown' | 'mp_hunting' | 'mp_ended'
      this.countdown = MP_CFG.hidingPhaseSeconds;
      this.countdownEndTime = 0;
      this.attemptsLeft = 10;
      this.checkedSpots = [];
      this.rankings = [];
      this.revealSpotId = null;

      // Intervals & Timers
      this.syncInterval = null;
      this.inputInterval = null;
      this.lobbyPingInterval = null;
      this.handshakeRetryTimer = null;
      this.connectTimeout = null;
      this.mqttReconnectTimer = null;
      this.matchEndTimeout = null;
      this.autoReturnTimer = null;
      this.joinBrokerFailoverTimer = null;
      this.joinBrokerFailoverTimer2 = null;
      this.lastSyncTime = 0;
      this.lastInputTimes = new Map();

      // MQTT state
      this.mqtt = null;
      this.mqttConnected = false;
      this.activeBrokerIndex = 0;
      this.brokers = [
        { host: 'broker.hivemq.com', port: 8884, path: '/mqtt' },
        { host: 'broker.emqx.io', port: 8084, path: '/mqtt' }
      ];

      this.bindDOM();

      // Check for ?room=PKXYZ in URL to auto-join
      try {
        if (typeof window !== 'undefined' && window.location) {
          const urlParams = new URLSearchParams(window.location.search);
          const roomParam = urlParams.get('room');
          if (roomParam) {
            setTimeout(() => {
              this.openModal();
              this.switchTab('join');
              if (this.inputJoinCode) {
                this.inputJoinCode.value = roomParam.toUpperCase().slice(0, 5);
                if (this.inputJoinName) this.inputJoinName.focus();
              }
              if (this.game && this.game.showToast) {
                this.game.showToast(`Room '${roomParam.toUpperCase()}' detected! Click Join Room.`);
              }
            }, 350);
          }
        }
      } catch (e) {}
    }

    bindDOM() {
      // Modals & Panels
      this.btnOpenMultiplayer = document.getElementById('btn-open-multiplayer');
      this.modal = document.getElementById('custom-room-modal');
      this.btnCloseModal = document.getElementById('btn-close-mp-modal');

      // Tabs
      this.tabCreate = document.getElementById('mp-tab-create');
      this.tabJoin = document.getElementById('mp-tab-join');
      this.panelCreate = document.getElementById('mp-panel-create');
      this.panelJoin = document.getElementById('mp-panel-join');

      // Create View inputs
      this.inputHostName = document.getElementById('mp-host-name');
      this.btnCreateSubmit = document.getElementById('btn-create-room-submit');
      this.createError = document.getElementById('mp-create-error');

      // Join View inputs
      this.inputJoinName = document.getElementById('mp-join-name');
      this.inputJoinCode = document.getElementById('mp-join-code');
      this.btnPasteCode = document.getElementById('btn-paste-code');
      this.btnJoinSubmit = document.getElementById('btn-join-room-submit');
      this.joinError = document.getElementById('mp-join-error');

      // Lobby View
      this.lobbyView = document.getElementById('mp-lobby-view');
      this.lobbyRoomCode = document.getElementById('lobby-room-code');
      this.btnCopyCode = document.getElementById('btn-copy-code');
      this.btnCopyLink = document.getElementById('btn-copy-link');
      this.lobbyMapName = document.getElementById('lobby-map-name');
      this.lobbyLighting = document.getElementById('lobby-lighting');
      this.lobbyAttempts = document.getElementById('lobby-attempts');
      this.lobbyTbody = document.getElementById('lobby-players-tbody');
      this.lobbyCount = document.getElementById('lobby-count');
      this.lobbyStatusMsg = document.getElementById('lobby-status-msg');
      this.btnStartMatch = document.getElementById('btn-mp-start-match');
      this.btnLeaveLobby = document.getElementById('btn-mp-leave-lobby');

      // Lobby Quick Role Selector for Local Player
      this.btnMyRoleHider = document.getElementById('btn-my-role-hider');
      this.btnMyRoleSeeker = document.getElementById('btn-my-role-seeker');

      // In-Game Countdown & Status Overlays
      this.countdownOverlay = document.getElementById('mp-countdown-overlay');
      this.countdownHiderBadge = document.getElementById('mp-countdown-hider-badge');
      this.countdownHiderSeconds = document.getElementById('mp-countdown-hider-seconds');
      this.countdownSeekerBanner = document.getElementById('mp-countdown-seeker-banner');
      this.countdownSeekerSeconds = document.getElementById('mp-countdown-seeker-seconds');
      this.spectatorBanner = document.getElementById('mp-spectator-banner');

      // Result Modal
      this.resultModal = document.getElementById('mp-result-modal');
      this.resultTitle = document.getElementById('mp-result-title');
      this.resultSubtitle = document.getElementById('mp-result-subtitle');
      this.resultTbody = document.getElementById('mp-result-tbody');
      this.btnReturnLobby = document.getElementById('btn-mp-return-lobby');
      this.btnLeaveGame = document.getElementById('btn-mp-leave-game');

      this.bindEvents();
    }

    bindEvents() {
      if (this.btnOpenMultiplayer) {
        this.btnOpenMultiplayer.addEventListener('click', () => this.openModal());
      }
      if (this.btnCloseModal) {
        this.btnCloseModal.addEventListener('click', () => this.closeModal());
      }
      if (this.modal) {
        this.modal.addEventListener('click', (e) => {
          if (e.target === this.modal) this.closeModal();
        });
      }

      // Tab switching
      if (this.tabCreate && this.tabJoin) {
        this.tabCreate.addEventListener('click', () => this.switchTab('create'));
        this.tabJoin.addEventListener('click', () => this.switchTab('join'));
      }

      // Create Room Settings Selection
      const mapOptions = document.querySelectorAll('.mp-setting-map');
      mapOptions.forEach(btn => {
        btn.addEventListener('click', () => {
          mapOptions.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.settings.mapId = Number(btn.dataset.map) || 1;
        });
      });

      const roleOptions = document.querySelectorAll('.mp-setting-role');
      roleOptions.forEach(btn => {
        btn.addEventListener('click', () => {
          roleOptions.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.hostInitialRole = btn.dataset.role || 'hider';
        });
      });

      const attemptOptions = document.querySelectorAll('.mp-setting-attempts');
      attemptOptions.forEach(btn => {
        btn.addEventListener('click', () => {
          attemptOptions.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.settings.attemptsLimit = Number(btn.dataset.attempts) || 10;
        });
      });

      const lightOptions = document.querySelectorAll('.mp-setting-light');
      lightOptions.forEach(btn => {
        btn.addEventListener('click', () => {
          lightOptions.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.settings.lightingMode = btn.dataset.light || 'dark';
        });
      });

      // Submit Create
      if (this.btnCreateSubmit) {
        this.btnCreateSubmit.addEventListener('click', () => {
          const name = (this.inputHostName && this.inputHostName.value.trim()) || 'Host';
          this.createRoom(name);
        });
      }
      if (this.inputHostName) {
        this.inputHostName.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            if (this.btnCreateSubmit) this.btnCreateSubmit.click();
          }
        });
      }

      // Submit Join
      if (this.btnJoinSubmit) {
        this.btnJoinSubmit.addEventListener('click', () => {
          const name = (this.inputJoinName && this.inputJoinName.value.trim()) || 'Guest';
          const rawCode = (this.inputJoinCode && this.inputJoinCode.value.trim().toUpperCase()) || '';
          const code = normalizeRoomCode(rawCode);
          if (!code || code.length < 3) {
            this.showJoinError('Please enter a valid room code (e.g. PK22A).');
            return;
          }
          this.joinRoom(name, code);
        });
      }
      if (this.inputJoinCode) {
        this.inputJoinCode.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            if (this.btnJoinSubmit) this.btnJoinSubmit.click();
          }
        });
      }
      if (this.inputJoinName) {
        this.inputJoinName.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            if (this.btnJoinSubmit) this.btnJoinSubmit.click();
          }
        });
      }

      // Paste Code
      if (this.btnPasteCode) {
        this.btnPasteCode.addEventListener('click', async () => {
          try {
            const text = await navigator.clipboard.readText();
            if (text) {
              const clean = text.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 5);
              if (this.inputJoinCode) {
                this.inputJoinCode.value = clean;
                this.showJoinError('');
              }
            }
          } catch (e) {
            this.game.showToast('Please type the Room Code manually.');
          }
        });
      }

      // Copy Code
      if (this.btnCopyCode) {
        this.btnCopyCode.addEventListener('click', () => this.copyRoomCode());
      }

      // Copy Invite Link
      if (this.btnCopyLink) {
        this.btnCopyLink.addEventListener('click', () => {
          const url = `${window.location.origin}${window.location.pathname}?room=${this.roomCode}`;
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(url).then(() => {
              this.btnCopyLink.classList.add('copied');
              this.btnCopyLink.textContent = '✓ Copied!';
              setTimeout(() => {
                this.btnCopyLink.classList.remove('copied');
                this.btnCopyLink.textContent = '🔗 Invite Link';
              }, 2000);
              this.game.showToast('Invite link copied! Share with friends to join room.');
            }).catch(() => {
              this.game.showToast(`Invite code: ${this.roomCode}`);
            });
          } else {
            this.game.showToast(`Invite code: ${this.roomCode}`);
          }
        });
      }

      // Quick Role Selectors for Local Player
      if (this.btnMyRoleHider) {
        this.btnMyRoleHider.addEventListener('click', () => this.requestRoleChange('hider'));
      }
      if (this.btnMyRoleSeeker) {
        this.btnMyRoleSeeker.addEventListener('click', () => this.requestRoleChange('seeker'));
      }

      // Start Match (Host Only)
      if (this.btnStartMatch) {
        this.btnStartMatch.addEventListener('click', () => this.startMatch());
      }

      // Leave Lobby
      if (this.btnLeaveLobby) {
        this.btnLeaveLobby.addEventListener('click', () => this.leaveRoom());
      }

      // Result Modal Actions
      if (this.btnReturnLobby) {
        this.btnReturnLobby.addEventListener('click', () => {
          if (this.isHost) {
            this.hostReturnToLobby();
          } else {
            this.game.showToast('Waiting for Host to return to lobby...');
          }
        });
      }
      if (this.btnLeaveGame) {
        this.btnLeaveGame.addEventListener('click', () => this.leaveRoom());
      }
    }

    openModal() {
      if (this.modal) {
        this.modal.classList.remove('hidden');
        this.modal.style.display = '';
        const tabBar = document.querySelector('.mp-tab-bar');
        if (tabBar) {
          tabBar.classList.remove('hidden');
          tabBar.style.display = 'flex';
        }
        this.switchTab('create');
        if (this.lobbyView) {
          this.lobbyView.classList.add('hidden');
          this.lobbyView.style.display = 'none';
        }
        if (this.panelCreate) {
          this.panelCreate.classList.remove('hidden');
          this.panelCreate.style.display = '';
        }
      }
    }

    closeModal() {
      if (this.modal) {
        this.modal.classList.add('hidden');
        this.modal.style.display = 'none';
      }
      if (this.createError) this.createError.textContent = '';
      if (this.joinError) this.joinError.textContent = '';
    }

    switchTab(tab) {
      if (tab === 'create') {
        if (this.tabCreate) this.tabCreate.classList.add('active');
        if (this.tabJoin) this.tabJoin.classList.remove('active');
        if (this.panelCreate) {
          this.panelCreate.classList.remove('hidden');
          this.panelCreate.style.display = '';
        }
        if (this.panelJoin) {
          this.panelJoin.classList.add('hidden');
          this.panelJoin.style.display = 'none';
        }
      } else {
        if (this.tabCreate) this.tabCreate.classList.remove('active');
        if (this.tabJoin) this.tabJoin.classList.add('active');
        if (this.panelCreate) {
          this.panelCreate.classList.add('hidden');
          this.panelCreate.style.display = 'none';
        }
        if (this.panelJoin) {
          this.panelJoin.classList.remove('hidden');
          this.panelJoin.style.display = '';
        }
      }
      if (this.lobbyView) {
        this.lobbyView.classList.add('hidden');
        this.lobbyView.style.display = 'none';
      }
      if (this.createError) this.createError.textContent = '';
      if (this.joinError) this.joinError.textContent = '';
    }

    showCreateError(msg) {
      if (this.createError) this.createError.textContent = msg;
    }

    showJoinError(msg) {
      if (this.joinError) this.joinError.textContent = msg;
    }

    copyRoomCode() {
      if (!this.roomCode) return;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(this.roomCode).then(() => {
          if (this.btnCopyCode) {
            const orig = this.btnCopyCode.innerHTML;
            this.btnCopyCode.innerHTML = '✓ Copied!';
            this.btnCopyCode.classList.add('copied');
            setTimeout(() => {
              if (this.btnCopyCode) {
                this.btnCopyCode.innerHTML = orig;
                this.btnCopyCode.classList.remove('copied');
              }
            }, 1800);
          }
        }).catch(() => {});
      } else {
        const temp = document.createElement('input');
        temp.value = this.roomCode;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
        if (this.btnCopyCode) {
          this.btnCopyCode.textContent = '✓ Copied!';
          setTimeout(() => { if (this.btnCopyCode) this.btnCopyCode.textContent = '📋 Copy Code'; }, 1800);
        }
      }
    }

    /* ========================================================
       CROSS-NETWORK WSS MQTT RELAY TRANSPORT (20 Hz)
       Strict Topic Separation:
         - Base:   peekko/v12/room/<ROOM_CODE>
         - Host:   Subscribes ONLY to 'c2h'; Publishes to 'h2c' & 'client/<id>'
         - Client: Subscribes to 'h2c' & 'client/<id>'; Publishes ONLY to 'c2h'
       ======================================================== */
    scheduleMqttReconnect(isHost) {
      if (this.mqttReconnectTimer) return;
      if (!this.roomCode || this.status === 'idle') return;

      this.mqttReconnectTimer = setTimeout(() => {
        this.mqttReconnectTimer = null;
        if (this.roomCode && !this.mqttConnected) {
          this.activeBrokerIndex = (this.activeBrokerIndex + 1) % this.brokers.length;
          this.initMqtt(isHost);
        }
      }, 3000);
    }

    initMqtt(isHost) {
      if (typeof Paho === 'undefined' || !Paho.MQTT) {
        console.error('Paho MQTT library not available.');
        return;
      }

      if (this.mqtt) {
        try {
          if (this.mqtt.isConnected && this.mqtt.isConnected()) {
            this.mqtt.disconnect();
          }
        } catch (_) {}
        this.mqtt = null;
        this.mqttConnected = false;
      }

      const broker = this.brokers[this.activeBrokerIndex] || this.brokers[0];
      const mqttClientId = 'pk_' + (isHost ? 'h_' : 'c_') + Math.random().toString(36).slice(2, 10);

      try {
        this.mqtt = new Paho.MQTT.Client(broker.host, broker.port, broker.path, mqttClientId);

        this.mqtt.onConnectionLost = (resp) => {
          this.mqttConnected = false;
          if (resp && resp.errorCode !== 0) {
            console.warn('MQTT Connection lost:', resp.errorMessage);
            this.scheduleMqttReconnect(isHost);
          }
        };

        this.mqtt.onMessageArrived = (message) => {
          try {
            const data = JSON.parse(message.payloadString);
            if (!data || !data.type) return;
            if (data.senderId && data.senderId === this.localPlayerId) return;

            if (this.isHost) {
              this.handleHostMessage(data);
            } else {
              this.handleClientMessage(data);
            }
          } catch (e) {
            console.error('MQTT payload parsing error:', e);
          }
        };

        this.connectMqtt(isHost);
      } catch (err) {
        console.warn('Could not initialize MQTT client:', err);
        this.scheduleMqttReconnect(isHost);
      }
    }

    connectMqtt(isHost) {
      if (!this.mqtt) return;

      this.mqtt.connect({
        useSSL: true,
        timeout: 6,
        keepAliveInterval: 12,
        cleanSession: true,
        onSuccess: () => {
          this.mqttConnected = true;
          const topicPrefix = `peekko/v12/room/${this.roomCode}`;

          if (isHost) {
            this.mqtt.subscribe(`${topicPrefix}/c2h`, { qos: 0 });
          } else {
            this.mqtt.subscribe(`${topicPrefix}/h2c`, { qos: 0 });
            this.mqtt.subscribe(`${topicPrefix}/client/${this.localPlayerId}`, { qos: 0 });
            this.startHandshakeRetry();
          }
        },
        onFailure: (err) => {
          console.warn('MQTT broker connect failed:', err);
          this.scheduleMqttReconnect(isHost);
        }
      });
    }

    startHandshakeRetry() {
      if (this.handshakeRetryTimer) clearInterval(this.handshakeRetryTimer);

      const sendJoin = () => {
        if (this.status === 'lobby' || this.phase !== 'lobby') {
          if (this.handshakeRetryTimer) {
            clearInterval(this.handshakeRetryTimer);
            this.handshakeRetryTimer = null;
          }
          return;
        }
        this.sendToHost({
          type: 'JOIN',
          id: this.localPlayerId,
          name: this.localPlayerName
        });
      };

      sendJoin();
      this.handshakeRetryTimer = setInterval(sendJoin, 1000);
    }

    mqttPublish(subTopic, payloadObj) {
      if (this.mqtt && this.mqttConnected) {
        try {
          if (!payloadObj.senderId) payloadObj.senderId = this.localPlayerId;
          if (!payloadObj.t) payloadObj.t = Date.now();
          const msg = new Paho.MQTT.Message(JSON.stringify(payloadObj));
          msg.destinationName = `peekko/v12/room/${this.roomCode}/${subTopic}`;
          msg.qos = 0;
          this.mqtt.send(msg);
        } catch (e) {
          console.warn('MQTT publish error:', e);
        }
      }
    }

    sendToHost(msg) {
      if (this.isHost) return;
      msg.senderId = this.localPlayerId;
      this.mqttPublish('c2h', msg);
    }

    broadcast(msg) {
      if (!this.isHost) return;
      msg.senderId = this.localPlayerId;
      this.mqttPublish('h2c', msg);
    }

    sendToClient(clientId, msg) {
      if (!this.isHost) return;
      msg.senderId = this.localPlayerId;
      msg.targetId = clientId;
      this.mqttPublish('client/' + clientId, msg);
      if (msg.type === 'WELCOME' || msg.type === 'REJECT') {
        this.mqttPublish('h2c', msg);
      }
    }

    /* ========================================================
       HOST: CREATE ROOM
       ======================================================== */
    createRoom(hostName) {
      this.showCreateError('');
      if (this.btnCreateSubmit) {
        this.btnCreateSubmit.disabled = true;
        this.btnCreateSubmit.textContent = 'Generating Room...';
      }

      this.cleanup();
      this.activeBrokerIndex = 0;
      this.isHost = true;
      this.localPlayerName = hostName || 'Host';
      this.roomCode = generateRoomCode();
      this.localPlayerId = 'host_' + Math.random().toString(36).slice(2, 10);

      this.initMqtt(true);

      const hostRole = this.hostInitialRole || 'hider';
      const hostColor = hostRole === 'seeker' ? MP_CFG.seekerColor : MP_CFG.hiderPalette[0];

      this.players = [{
        id: this.localPlayerId,
        name: this.localPlayerName,
        isHost: true,
        role: hostRole,
        color: hostColor,
        ready: true,
        x: 680,
        y: 610,
        angle: Math.PI / 2,
        isMoving: false,
        isHidden: false,
        hiddenSpotId: null,
        isReady: false,
        eliminated: false,
        eliminatedAt: 0,
        eliminatedReason: '',
        hasRelocated: false
      }];
      this.status = 'lobby';

      if (this.btnCreateSubmit) {
        this.btnCreateSubmit.disabled = false;
        this.btnCreateSubmit.textContent = 'GENERATE ROOM CODE';
      }
      this.showLobbyView();

      if (this.lobbyPingInterval) clearInterval(this.lobbyPingInterval);
      this.lobbyPingInterval = setInterval(() => {
        if (this.isHost && this.phase === 'lobby' && this.mqttConnected) {
          this.broadcast({ type: 'LOBBY_PING', t: Date.now() });
        }
      }, 2500);
    }

    /* ========================================================
       CLIENT: JOIN ROOM
       ======================================================== */
    joinRoom(clientName, roomCode) {
      this.showJoinError('');
      if (!roomCode || roomCode.trim().length === 0) {
        this.showJoinError('Please enter a 5-character Room Code (e.g. PK492).');
        return;
      }

      if (this.btnJoinSubmit) {
        this.btnJoinSubmit.disabled = true;
        this.btnJoinSubmit.textContent = 'Connecting to Room...';
      }

      this.cleanup();
      this.activeBrokerIndex = 0;
      this.isHost = false;
      this.localPlayerName = clientName || 'Guest';
      this.roomCode = roomCode.toUpperCase().trim();
      this.localPlayerId = 'usr_' + Math.random().toString(36).slice(2, 10);

      // Auto broker discovery: if Broker 0 gives no response within 3.5s, probe Broker 1
      this.joinBrokerFailoverTimer = setTimeout(() => {
        if (this.status !== 'lobby' && !this.isHost && this.roomCode) {
          this.activeBrokerIndex = (this.activeBrokerIndex + 1) % this.brokers.length;
          this.initMqtt(false);
        }
      }, 3500);

      this.joinBrokerFailoverTimer2 = setTimeout(() => {
        if (this.status !== 'lobby' && !this.isHost && this.roomCode) {
          this.activeBrokerIndex = 0;
          this.initMqtt(false);
        }
      }, 7500);

      this.connectTimeout = setTimeout(() => {
        if (this.status !== 'lobby') {
          this.showJoinError(`Could not reach Room '${this.roomCode}'. Please verify the Room Code and ensure Host is currently in the lobby.`);
          if (this.btnJoinSubmit) {
            this.btnJoinSubmit.disabled = false;
            this.btnJoinSubmit.textContent = 'JOIN ROOM';
          }
          this.cleanup();
        }
      }, 15000);

      this.initMqtt(false);
    }

    /* ========================================================
       HOST: INCOMING MESSAGE HANDLER (c2h)
       ======================================================== */
    handleHostMessage(msg) {
      if (!msg || !msg.type) return;

      if (msg.type === 'JOIN') {
        const clientId = msg.id || msg.senderId || ('guest_' + Math.random().toString(36).slice(2, 8));

        // Reconnection: Only match by unique player ID! NEVER match an incoming client to host or existing players by name!
        const existingPlayer = this.players.find(p => p.id === clientId);
        if (existingPlayer) {
          existingPlayer.name = msg.name || existingPlayer.name;
          this.sendToClient(clientId, {
            type: 'WELCOME',
            roomCode: this.roomCode,
            localId: clientId,
            targetId: clientId,
            settings: this.settings,
            players: this.players
          });
          this.broadcastLobbyUpdate();
          return;
        }

        if (this.players.length >= MP_CFG.maxPlayers) {
          this.sendToClient(clientId, { type: 'REJECT', targetId: clientId, reason: 'Room is full (max 5 players).' });
          return;
        }
        if (this.phase !== 'lobby') {
          this.sendToClient(clientId, { type: 'REJECT', targetId: clientId, reason: 'Match is already in progress.' });
          return;
        }

        // Disambiguate duplicate player names if both players entered the same name (e.g. "Rimon")
        let clientName = (msg.name || `Player ${this.players.length + 1}`).trim();
        if (this.players.some(p => p.name.toLowerCase() === clientName.toLowerCase())) {
          clientName += ` (${this.players.length + 1})`;
        }

        const usedColors = this.players.filter(p => p.role === 'hider').map(p => p.color);
        const freeColor = MP_CFG.hiderPalette.find(c => !usedColors.includes(c)) || MP_CFG.hiderPalette[0];

        const newPlayer = {
          id: clientId,
          name: clientName,
          isHost: false,
          role: 'hider',
          color: freeColor,
          ready: true,
          x: 680,
          y: 400,
          angle: -Math.PI / 2,
          isMoving: false,
          isHidden: false,
          hiddenSpotId: null,
          isReady: false,
          eliminated: false,
          eliminatedAt: 0,
          eliminatedReason: '',
          hasRelocated: false
        };

        this.players.push(newPlayer);
        this.autoBalanceRoles();

        this.sendToClient(clientId, {
          type: 'WELCOME',
          roomCode: this.roomCode,
          localId: clientId,
          targetId: clientId,
          settings: this.settings,
          players: this.players
        });

        this.broadcastLobbyUpdate();
        this.renderLobbyUI();
      } else if (msg.type === 'PLAYER_INPUT') {
        const p = this.players.find(pl => pl.id === msg.id || pl.id === msg.senderId);
        if (p && !p.eliminated) {
          if (msg.t) {
            const lastT = this.lastInputTimes.get(p.id) || 0;
            if (msg.t < lastT) return; // Drop stale out-of-order packet
            this.lastInputTimes.set(p.id, msg.t);
          }
          p.x = msg.x !== undefined ? msg.x : p.x;
          p.y = msg.y !== undefined ? msg.y : p.y;
          p.angle = msg.angle !== undefined ? msg.angle : p.angle;
          p.isMoving = !!msg.isMoving;
          p.isHidden = !!msg.isHidden;
          p.hiddenSpotId = msg.hiddenSpotId !== undefined ? msg.hiddenSpotId : p.hiddenSpotId;
          p.isReady = !!msg.isReady;
          if (msg.hasRelocated) p.hasRelocated = true;
        }
      } else if (msg.type === 'SEEKER_SEARCH') {
        this.processSeekerSearch(msg.spotId, msg.seekerId || msg.senderId);
      } else if (msg.type === 'HIDER_READY') {
        const p = this.players.find(pl => pl.id === msg.id || pl.id === msg.senderId);
        if (p) p.isReady = true;
        this.checkAllHidersReady();
      } else if (msg.type === 'REQUEST_ROLE') {
        this.applyRoleChange(msg.id || msg.senderId, msg.role || msg.requestedRole);
      } else if (msg.type === 'PLAYER_LEFT') {
        const leavingId = msg.id || msg.senderId;
        const p = this.players.find(pl => pl.id === leavingId);
        const name = (p && p.name) || msg.name || 'A player';
        this.game.showToast(`⚠️ ${name} left the match.`);

        if (p) {
          p.eliminated = true;
          p.eliminatedReason = 'Left match';
        }

        this.broadcast({
          type: 'PLAYER_LEFT',
          id: leavingId,
          name: name
        });

        if (this.phase === 'lobby') {
          const idx = this.players.findIndex(pl => pl.id === leavingId);
          if (idx !== -1) this.players.splice(idx, 1);
          this.autoBalanceRoles();
          this.broadcastLobbyUpdate();
          this.renderLobbyUI();
        } else if (this.phase === 'mp_hunting' || this.phase === 'mp_hiding_countdown') {
          if (p && p.role === 'seeker') {
            this.game.showToast('Seeker left the match! Surviving Hiders WIN!');
            this.endMatch('hider_win');
          } else {
            const living = this.players.filter(pl => pl.role === 'hider' && !pl.eliminated);
            if (living.length === 0) {
              this.game.showToast('All Hiders left or caught! Seeker WINS!');
              this.endMatch('seeker_win');
            }
          }
        }
      }
    }

    /* ========================================================
       CLIENT: INCOMING MESSAGE HANDLER (h2c & client/<id>)
       ======================================================== */
    handleClientMessage(msg) {
      if (!msg || !msg.type) return;

      if (msg.targetId && msg.targetId !== this.localPlayerId) {
        return; // Message is for another specific client
      }

      if (msg.type === 'WELCOME') {
        if (this.connectTimeout) {
          clearTimeout(this.connectTimeout);
          this.connectTimeout = null;
        }
        if (this.joinBrokerFailoverTimer) {
          clearTimeout(this.joinBrokerFailoverTimer);
          this.joinBrokerFailoverTimer = null;
        }
        if (this.joinBrokerFailoverTimer2) {
          clearTimeout(this.joinBrokerFailoverTimer2);
          this.joinBrokerFailoverTimer2 = null;
        }
        if (this.handshakeRetryTimer) {
          clearInterval(this.handshakeRetryTimer);
          this.handshakeRetryTimer = null;
        }
        if (msg.localId) this.localPlayerId = msg.localId;
        this.roomCode = msg.roomCode;
        this.settings = msg.settings;
        this.players = msg.players;
        this.status = 'lobby';
        if (this.btnJoinSubmit) {
          this.btnJoinSubmit.disabled = false;
          this.btnJoinSubmit.textContent = 'JOIN ROOM';
        }
        this.showLobbyView();
      } else if (msg.type === 'LOBBY_UPDATE') {
        this.players = msg.players;
        this.settings = msg.settings;
        this.status = 'lobby';
        if (this.btnJoinSubmit) {
          this.btnJoinSubmit.disabled = false;
          this.btnJoinSubmit.textContent = 'JOIN ROOM';
        }
        if (this.panelJoin && !this.panelJoin.classList.contains('hidden')) {
          this.showLobbyView();
        }
        this.renderLobbyUI();
      } else if (msg.type === 'REJECT') {
        if (this.connectTimeout) {
          clearTimeout(this.connectTimeout);
          this.connectTimeout = null;
        }
        if (this.joinBrokerFailoverTimer) {
          clearTimeout(this.joinBrokerFailoverTimer);
          this.joinBrokerFailoverTimer = null;
        }
        if (this.joinBrokerFailoverTimer2) {
          clearTimeout(this.joinBrokerFailoverTimer2);
          this.joinBrokerFailoverTimer2 = null;
        }
        this.showJoinError(msg.reason || 'Join rejected');
        this.leaveRoom();
      } else if (msg.type === 'MATCH_START') {
        this.settings = msg.settings;
        this.players = msg.players;
        this.countdown = msg.countdown;
        this.countdownEndTime = msg.countdownEndTime || (Date.now() + (msg.countdown * 1000));
        this.attemptsLeft = msg.attemptsLimit;
        this.checkedSpots = [];
        this.revealSpotId = null;
        this.phase = 'mp_hiding_countdown';
        if (this.game) this.game.phase = 'mp_hiding_countdown';
        this.clientStartMatch();
      } else if (msg.type === 'GAME_SYNC') {
        this.applyGameSync(msg);
      } else if (msg.type === 'HIDER_CAUGHT') {
        this.revealSpotId = msg.spotId;
        const caughtNames = [];
        this.players.forEach(p => {
          if (msg.caughtPlayerIds && msg.caughtPlayerIds.includes(p.id)) {
            p.eliminated = true;
            p.isHidden = false;
            p.revealedSpotId = msg.spotId;
            caughtNames.push(p.name);
          }
        });

        const me = this.players.find(p => p.id === this.localPlayerId);
        if (me && msg.caughtPlayerIds && msg.caughtPlayerIds.includes(me.id)) {
          this.game.player.speed = 0;
          this.game.player.isMoving = false;
          if (typeof Sound !== 'undefined' && Sound.playCaught) Sound.playCaught();
          this.game.showToast(`🚨 You were CAUGHT in ${msg.spotName}!`);
          if (this.spectatorBanner) this.spectatorBanner.classList.remove('hidden');
        } else {
          if (typeof Sound !== 'undefined' && Sound.playCaught) Sound.playCaught();
          this.game.showToast(`🚨 ${caughtNames.join(', ')} was CAUGHT in ${msg.spotName}!`);
        }
      } else if (msg.type === 'PROXIMITY_HINT') {
        const me = this.players.find(p => p.id === this.localPlayerId);
        if (me && me.role === 'seeker' && msg.hint) {
          this.game.proximityHint = msg.hint;
          if (typeof Sound !== 'undefined' && Sound.playEmpty) Sound.playEmpty();
        }
      } else if (msg.type === 'MATCH_END') {
        this.phase = 'mp_ended';
        if (this.game) this.game.phase = 'mp_ended';
        if (msg.revealSpotId) this.revealSpotId = msg.revealSpotId;
        this.rankings = msg.rankings;
        this.showResultModal(msg);
      } else if (msg.type === 'RETURN_LOBBY') {
        this.clientReturnToLobby();
      } else if (msg.type === 'PLAYER_LEFT') {
        const leavingId = msg.id || msg.senderId;
        const name = msg.name || 'A player';
        this.game.showToast(`⚠️ ${name} left the game.`);

        const p = this.players.find(pl => pl.id === leavingId);
        if (p) {
          p.eliminated = true;
          p.eliminatedReason = 'Left match';
        }

        if (msg.isHost) {
          this.game.showToast('Host left the room. Game ended.');
          const me = this.players.find(pl => pl.id === this.localPlayerId);
          const iWon = me && ((me.role === 'hider' && p && p.role === 'seeker') || (me.role === 'seeker' && p && p.role === 'hider'));
          this.endMatch(iWon ? (me.role === 'seeker' ? 'seeker_win' : 'hider_win') : 'hider_win');
        }
      }
    }

    /* ========================================================
       ROLE CHANGE & AUTO BALANCING
       ======================================================== */
    requestRoleChange(newRole) {
      if (this.phase !== 'lobby') return;
      if (this.isHost) {
        this.applyRoleChange(this.localPlayerId, newRole);
      } else {
        this.sendToHost({
          type: 'REQUEST_ROLE',
          id: this.localPlayerId,
          requestedRole: newRole
        });
      }
    }

    applyRoleChange(targetId, newRole) {
      if (!this.isHost) return;
      const target = this.players.find(p => p.id === targetId);
      if (!target) return;

      if (newRole === 'seeker') {
        this.players.forEach(p => {
          if (p.id === targetId) {
            p.role = 'seeker';
            p.color = MP_CFG.seekerColor;
          } else {
            p.role = 'hider';
          }
        });
      } else {
        target.role = 'hider';
        const hasSeeker = this.players.some(p => p.role === 'seeker');
        if (!hasSeeker && this.players.length > 0) {
          const nextSeeker = this.players.find(p => p.id !== targetId) || this.players[0];
          nextSeeker.role = 'seeker';
          nextSeeker.color = MP_CFG.seekerColor;
        }
      }

      this.autoBalanceRoles();
      this.broadcastLobbyUpdate();
      this.renderLobbyUI();
    }

    autoBalanceRoles() {
      const seekers = this.players.filter(p => p.role === 'seeker');
      if (seekers.length === 0 && this.players.length > 0) {
        this.players[0].role = 'seeker';
        this.players[0].color = MP_CFG.seekerColor;
      } else if (seekers.length > 1) {
        for (let i = 1; i < seekers.length; i++) {
          seekers[i].role = 'hider';
        }
      }

      let colorIdx = 0;
      this.players.forEach(p => {
        if (p.role === 'seeker') {
          p.color = MP_CFG.seekerColor;
        } else {
          p.color = MP_CFG.hiderPalette[colorIdx % MP_CFG.hiderPalette.length];
          colorIdx++;
        }
      });
    }

    broadcastLobbyUpdate() {
      if (!this.isHost) return;
      const payload = {
        type: 'LOBBY_UPDATE',
        players: this.players,
        settings: this.settings
      };
      this.broadcast(payload);
    }

    /* ========================================================
       LOBBY UI RENDERING
       ======================================================== */
    showLobbyView() {
      if (this.modal) {
        this.modal.classList.remove('hidden');
        this.modal.style.display = '';
      }
      const tabBar = document.querySelector('.mp-tab-bar');
      if (tabBar) {
        tabBar.classList.add('hidden');
        tabBar.style.display = 'none';
      }
      if (this.panelCreate) {
        this.panelCreate.classList.add('hidden');
        this.panelCreate.style.display = 'none';
      }
      if (this.panelJoin) {
        this.panelJoin.classList.add('hidden');
        this.panelJoin.style.display = 'none';
      }
      if (this.lobbyView) {
        this.lobbyView.classList.remove('hidden');
        this.lobbyView.style.display = 'flex';
      }

      if (this.lobbyRoomCode) this.lobbyRoomCode.textContent = this.roomCode;
      this.renderLobbyUI();
    }

    renderLobbyUI() {
      if (!this.lobbyTbody) return;
      this.lobbyTbody.innerHTML = '';

      const mapNames = {
        1: 'Skyglass Penthouse',
        2: 'Midnight Manor',
        3: 'Warehouse Basement',
        4: 'Grand Shopping Mall',
        5: 'Wonderland Park'
      };
      if (this.lobbyMapName) this.lobbyMapName.textContent = mapNames[this.settings.mapId] || 'Map 1';
      if (this.lobbyLighting) this.lobbyLighting.textContent = this.settings.lightingMode === 'light' ? 'Day (Light)' : 'Night (Dark)';
      if (this.lobbyAttempts) this.lobbyAttempts.textContent = `${this.settings.attemptsLimit} Checks`;

      const seekerCount = this.players.filter(p => p.role === 'seeker').length;
      const count = this.players.length;

      if (this.lobbyCount) {
        this.lobbyCount.textContent = `Players: ${count} / ${MP_CFG.maxPlayers} (Min 2 required)`;
      }

      const me = this.players.find(p => p.id === this.localPlayerId);
      if (me) {
        if (this.btnMyRoleHider) this.btnMyRoleHider.classList.toggle('active', me.role === 'hider');
        if (this.btnMyRoleSeeker) this.btnMyRoleSeeker.classList.toggle('active', me.role === 'seeker');
      }

      this.players.forEach(p => {
        const tr = document.createElement('tr');
        const isMe = p.id === this.localPlayerId;
        tr.className = `lobby-player-row ${isMe ? 'local-player' : ''}`;

        const tdName = document.createElement('td');
        tdName.innerHTML = `
          <div class="lobby-name-cell">
            <strong>${this.escapeHtml(p.name)}</strong>
            ${p.isHost ? '<span class="lobby-badge host">HOST</span>' : ''}
            ${isMe ? '<span class="lobby-badge you">YOU</span>' : ''}
          </div>
        `;

        const tdColor = document.createElement('td');
        tdColor.innerHTML = `
          <div class="color-badge-wrap">
            <span class="color-dot" style="background:${p.color}; box-shadow:0 0 10px ${p.color};"></span>
          </div>
        `;

        const tdRole = document.createElement('td');
        if (this.isHost || isMe) {
          const btnRole = document.createElement('button');
          btnRole.className = `role-toggle-btn ${p.role === 'seeker' ? 'is-seeker' : 'is-hider'}`;
          btnRole.textContent = p.role === 'seeker' ? 'Seeker (Hunter)' : 'Hider (Stealth)';
          btnRole.title = isMe ? 'Click to switch your role' : "Click to change this player's role";
          btnRole.addEventListener('click', () => {
            const nextRole = p.role === 'seeker' ? 'hider' : 'seeker';
            if (this.isHost) {
              this.applyRoleChange(p.id, nextRole);
            } else {
              this.requestRoleChange(nextRole);
            }
          });
          tdRole.appendChild(btnRole);
        } else {
          tdRole.innerHTML = `
            <span class="role-badge ${p.role === 'seeker' ? 'seeker' : 'hider'}">
              ${p.role === 'seeker' ? 'Seeker (Hunter)' : 'Hider (Stealth)'}
            </span>
          `;
        }

        const tdStatus = document.createElement('td');
        tdStatus.innerHTML = `<span class="status-connected">● Ready</span>`;

        tr.appendChild(tdName);
        tr.appendChild(tdColor);
        tr.appendChild(tdRole);
        tr.appendChild(tdStatus);
        this.lobbyTbody.appendChild(tr);
      });

      if (this.btnStartMatch) {
        if (!this.isHost) {
          this.btnStartMatch.classList.add('hidden');
          if (this.lobbyStatusMsg) {
            this.lobbyStatusMsg.textContent = 'Waiting for Host to start the match... You can choose your role above anytime.';
          }
        } else {
          this.btnStartMatch.classList.remove('hidden');
          const canStart = count >= MP_CFG.minPlayers && count <= MP_CFG.maxPlayers && seekerCount === 1;
          this.btnStartMatch.disabled = !canStart;
          if (this.lobbyStatusMsg) {
            if (count < MP_CFG.minPlayers) {
              this.lobbyStatusMsg.textContent = `Need at least ${MP_CFG.minPlayers} players to start (Currently ${count}). Share Code: ${this.roomCode}`;
            } else if (seekerCount !== 1) {
              this.lobbyStatusMsg.textContent = 'Assign exactly 1 Seeker before starting.';
            } else {
              this.lobbyStatusMsg.textContent = 'Lobby ready! Click Start Match to begin.';
            }
          }
        }
      }
    }

    /* ========================================================
       MATCH START & 20-SECOND HIDING PHASE
       ======================================================== */
    updateCountdownFromClock() {
      if (this.phase !== 'mp_hiding_countdown') return;
      if (!this.countdownEndTime) {
        this.countdownEndTime = Date.now() + (MP_CFG.hidingPhaseSeconds * 1000);
      }
      const remaining = Math.max(0, (this.countdownEndTime - Date.now()) / 1000);
      this.countdown = remaining;
      if (this.isHost && remaining <= 0) {
        this.transitionToHuntPhase();
      }
    }

    startMatch() {
      if (!this.isHost || this.players.length < MP_CFG.minPlayers) return;

      if (this.lobbyPingInterval) {
        clearInterval(this.lobbyPingInterval);
        this.lobbyPingInterval = null;
      }

      this.phase = 'mp_hiding_countdown';
      if (this.game) this.game.phase = 'mp_hiding_countdown';
      this.countdownEndTime = Date.now() + (MP_CFG.hidingPhaseSeconds * 1000);
      this.countdown = MP_CFG.hidingPhaseSeconds;
      this.attemptsLeft = this.settings.attemptsLimit;
      this.checkedSpots = [];
      this.revealSpotId = null;

      this.game.apt.loadMap(this.settings.mapId);

      // Dedicated Collision-Free Spawns: Separate Seeker & Hiders across distinct rooms
      const mapNodes = MP_SPAWN_NODES[this.settings.mapId] || MP_SPAWN_NODES[1];
      let hiderNodeIdx = 0;

      this.players.forEach((p) => {
        if (p.role === 'seeker') {
          p.x = mapNodes.seeker.x;
          p.y = mapNodes.seeker.y;
          p.angle = mapNodes.seeker.angle || (Math.PI / 2);
        } else {
          const node = mapNodes.hiders[hiderNodeIdx % mapNodes.hiders.length];
          p.x = node.x;
          p.y = node.y;
          p.angle = node.angle || (-Math.PI / 2);
          hiderNodeIdx++;
        }
        p.isMoving = false;
        p.isHidden = false;
        p.hiddenSpotId = null;
        p.isReady = false;
        p.eliminated = false;
        p.eliminatedAt = 0;
        p.eliminatedReason = '';
        p.revealedSpotId = null;
        p.hasRelocated = false;
      });

      const startPayload = {
        type: 'MATCH_START',
        phase: 'mp_hiding_countdown',
        settings: this.settings,
        players: this.players,
        countdown: this.countdown,
        countdownEndTime: this.countdownEndTime,
        matchActive: true,
        attemptsLimit: this.attemptsLeft
      };

      const sendStartPulses = () => {
        if (this.phase !== 'mp_hiding_countdown') return;
        this.broadcast(startPayload);
        this.players.forEach(p => {
          if (!p.isHost) {
            this.sendToClient(p.id, startPayload);
          }
        });
      };

      sendStartPulses();
      setTimeout(sendStartPulses, 120);
      setTimeout(sendStartPulses, 300);
      setTimeout(sendStartPulses, 600);
      setTimeout(sendStartPulses, 1000);

      this.clientStartMatch();
      this.startHostAuthoritativeLoop();
    }

    clientStartMatch() {
      try {
        if (this.modal) {
          this.modal.classList.add('hidden');
          this.modal.style.display = 'none';
        }
        if (this.lobbyView) {
          this.lobbyView.classList.add('hidden');
          this.lobbyView.style.display = 'none';
        }
        if (this.panelJoin) {
          this.panelJoin.classList.add('hidden');
          this.panelJoin.style.display = 'none';
        }
        if (this.panelCreate) {
          this.panelCreate.classList.add('hidden');
          this.panelCreate.style.display = 'none';
        }
        if (this.resultModal) {
          this.resultModal.classList.add('hidden');
          this.resultModal.style.display = 'none';
        }
        if (this.game.pauseModal) {
          this.game.pauseModal.classList.add('hidden');
          this.game.pauseModal.style.display = 'none';
        }
        if (this.game.menuScreen) {
          this.game.menuScreen.classList.add('hidden');
          this.game.menuScreen.style.display = 'none';
        }
      } catch (err) {
        console.warn('Overlay hide notice:', err);
      }

      if (this.autoReturnTimer) {
        clearInterval(this.autoReturnTimer);
        this.autoReturnTimer = null;
      }
      this.revealSpotId = null;

      this.game.isMultiplayer = true;
      this.game.mpManager = this;
      this.game.selectedMapId = this.settings.mapId;
      this.game.apt.loadMap(this.settings.mapId);
      this.game.apt.resetSpots();
      this.game.renderer.setTheme(this.settings.lightingMode);
      this.game.applyTheme(this.settings.lightingMode);

      let me = this.players.find(p => p.id === this.localPlayerId);
      if (!me) {
        me = this.players.find(p => p.name === this.localPlayerName);
      }
      if (!me) {
        me = this.isHost ? this.players.find(p => p.isHost) : this.players.find(p => !p.isHost);
      }
      if (me) {
        this.localPlayerId = me.id;
        this.game.role = me.role;
        this.game.player.x = me.x;
        this.game.player.y = me.y;
        this.game.player.angle = me.angle;
        this.game.player.isHidden = false;
        this.game.player.hiddenSpot = null;
        this.game.player.speed = (typeof CFG !== 'undefined' && CFG.playerSpeed) ? CFG.playerSpeed : 3.5;
      } else {
        this.game.role = this.isHost ? 'seeker' : 'hider';
        this.game.player.speed = (typeof CFG !== 'undefined' && CFG.playerSpeed) ? CFG.playerSpeed : 3.5;
      }

      this.game.phase = this.phase || 'mp_hiding_countdown';
      this.game.lastTime = performance.now();
      this.game.topHud.classList.remove('hidden');
      this.game.topHud.style.display = 'flex';
      this.game.attemptsBox.classList.remove('hidden');
      this.game.attemptsLabel.textContent = 'SEEKER CHECKS';
      this.game.attemptsValue.textContent = `${this.attemptsLeft} / ${this.settings.attemptsLimit}`;

      this.game.tryFullscreenAndLandscape();
      if (this.game.touchPad) this.game.touchPad.classList.remove('hidden');
      if (this.game.actionBar) this.game.actionBar.classList.remove('hidden');
      if (this.game.controlsFooter) this.game.controlsFooter.classList.remove('hidden');

      if (this.game.role === 'hider') {
        if (this.game.btnTouchReady) this.game.btnTouchReady.classList.remove('hidden');
        if (this.game.btnReady) this.game.btnReady.classList.remove('hidden');
      } else {
        if (this.game.btnTouchReady) this.game.btnTouchReady.classList.add('hidden');
        if (this.game.btnReady) this.game.btnReady.classList.add('hidden');
      }

      this.game.renderer.resize();

      if (typeof Sound !== 'undefined' && Sound.init) {
        Sound.init();
      }

      this.updateCountdownFromClock();
      this.startClientInputLoop();
      this.updateMultiplayerHUD();
    }

    /* ========================================================
       HOST AUTHORITATIVE LOOP (20 Hz Network Sync)
       ======================================================== */
    startHostAuthoritativeLoop() {
      if (!this.isHost) return;
      clearInterval(this.syncInterval);

      const intervalMs = Math.round(1000 / MP_CFG.syncHz);
      this.syncInterval = setInterval(() => {
        this.tickHostAuthoritative();
      }, intervalMs);
    }

    tickHostAuthoritative() {
      // 1. Update host local player FIRST before creating syncData so coordinates are always fresh
      const me = this.players.find(p => p.id === this.localPlayerId);
      if (me) {
        me.x = this.game.player.x;
        me.y = this.game.player.y;
        me.angle = this.game.player.angle;
        me.isMoving = this.game.player.isMoving;
        me.isHidden = this.game.player.isHidden;
        me.hiddenSpotId = this.game.player.hiddenSpot ? this.game.player.hiddenSpot.id : null;
      }

      if (this.phase === 'mp_hiding_countdown') {
        this.updateCountdownFromClock();
      } else if (this.phase === 'mp_hunting') {
        this.checkHuntLineOfSightCatches();
        this.checkMatchEndConditions();
      }

      // 2. Broadcast GAME_SYNC snapshot
      const syncData = {
        type: 'GAME_SYNC',
        t: Date.now(),
        phase: this.phase,
        matchActive: this.phase === 'mp_hiding_countdown' || this.phase === 'mp_hunting',
        countdown: Math.max(0, Math.round(this.countdown * 10) / 10),
        countdownEndTime: this.countdownEndTime || 0,
        attemptsLeft: this.attemptsLeft,
        settings: this.settings,
        revealSpotId: this.revealSpotId || null,
        players: this.players.map(p => ({
          id: p.id,
          name: p.name,
          role: p.role,
          color: p.color,
          isHost: p.isHost,
          x: Math.round(p.x * 10) / 10,
          y: Math.round(p.y * 10) / 10,
          angle: Math.round(p.angle * 100) / 100,
          isMoving: p.isMoving,
          isHidden: p.isHidden,
          hiddenSpotId: p.hiddenSpotId,
          isReady: p.isReady,
          eliminated: p.eliminated,
          eliminatedReason: p.eliminatedReason,
          revealedSpotId: p.revealedSpotId || null,
          hasRelocated: p.hasRelocated
        })),
        checkedSpots: this.checkedSpots,
        proximityHint: (this.hostProximityHint && this.hostProximityHint.timer > 0) ? this.hostProximityHint : null
      };

      if (this.hostProximityHint) {
        this.hostProximityHint.timer -= 7;
        if (this.hostProximityHint.timer <= 0) {
          this.hostProximityHint = null;
        }
      }

      this.broadcast(syncData);
      this.updateMultiplayerHUD();
    }

    transitionToHuntPhase() {
      this.phase = 'mp_hunting';
      if (this.game) this.game.phase = 'mp_hunting';
      this.countdown = 0;
      this.countdownEndTime = 0;
      if (typeof Sound !== 'undefined' && Sound.playAlert) {
        Sound.playAlert();
      }
      this.game.showToast('Hunt Phase Activated! Seeker released!');
      if (this.countdownSeekerBanner) this.countdownSeekerBanner.classList.add('hidden');
      if (this.game.btnTouchReady) this.game.btnTouchReady.classList.add('hidden');
      if (this.game.btnReady) this.game.btnReady.classList.add('hidden');
    }

    checkAllHidersReady() {
      if (this.phase !== 'mp_hiding_countdown') return;
      const hiders = this.players.filter(p => p.role === 'hider');
      const allReady = hiders.length > 0 && hiders.every(h => h.isReady);
      if (allReady) {
        this.transitionToHuntPhase();
      }
    }

    /* ========================================================
       SEEKER ACTIONS & FAIR LINE-OF-SIGHT RULES
       ======================================================== */
    processSeekerSearch(spotId, seekerId) {
      if (!this.isHost || this.phase !== 'mp_hunting') return;
      if (this.attemptsLeft <= 0) return;

      const spot = this.game.apt.hidingSpots.find(s => s.id === spotId);
      if (!spot) return;

      this.attemptsLeft = Math.max(0, this.attemptsLeft - 1);
      if (!this.checkedSpots.includes(spotId)) {
        this.checkedSpots.push(spotId);
      }

      // Check if any Hider is hiding in this spot
      const caughtHiders = this.players.filter(p =>
        p.role === 'hider' &&
        !p.eliminated &&
        p.isHidden &&
        p.hiddenSpotId === spotId
      );

      if (caughtHiders.length > 0) {
        caughtHiders.forEach(h => {
          h.eliminated = true;
          h.eliminatedAt = this.attemptsLeft;
          h.eliminatedReason = `Found in ${spot.name}`;
          h.isHidden = false;
          h.revealedSpotId = spot.id;
        });
        this.revealSpotId = spot.id;

        // Broadcast HIDER_CAUGHT immediately across channels so all players see the reveal
        const caughtPayload = {
          type: 'HIDER_CAUGHT',
          spotId: spot.id,
          spotName: spot.name,
          caughtPlayerIds: caughtHiders.map(h => h.id)
        };
        this.broadcast(caughtPayload);

        const caughtNames = caughtHiders.map(h => h.name).join(', ');
        this.game.showToast(`🚨 ${caughtNames} was CAUGHT in ${spot.name}!`);
        if (typeof Sound !== 'undefined' && Sound.playCaught) Sound.playCaught();

        const me = this.players.find(p => p.id === this.localPlayerId);
        if (me && me.eliminated) {
          this.game.player.speed = 0;
          this.game.player.isMoving = false;
          if (this.spectatorBanner) this.spectatorBanner.classList.remove('hidden');
        }
      } else {
        if (typeof Sound !== 'undefined' && Sound.playEmpty) Sound.playEmpty();
        this.calculateProximityHint(spot);
      }

      this.checkMatchEndConditions();
    }

    calculateProximityHint(spot) {
      const livingHiders = this.players.filter(p => p.role === 'hider' && !p.eliminated);
      if (livingHiders.length === 0) return;

      const spotCenterX = spot.x + (spot.w || 40) / 2;
      const spotCenterY = spot.y + (spot.h || 40) / 2;

      let minDist = Infinity;
      livingHiders.forEach(h => {
        let hx = h.x;
        let hy = h.y;
        if (h.isHidden && h.hiddenSpotId) {
          const s = this.game.apt.hidingSpots.find(sp => sp.id === h.hiddenSpotId);
          if (s) {
            hx = (s.hideX !== undefined) ? s.hideX : (s.x + (s.w || 40) / 2);
            hy = (s.hideY !== undefined) ? s.hideY : (s.y + (s.h || 40) / 2);
          }
        }
        const d = Math.hypot(hx - spotCenterX, hy - spotCenterY);
        if (d < minDist) minDist = d;
      });

      let type = 'cool';
      let text = 'COOL (Far Away)';
      if (minDist <= 180) {
        type = 'hot';
        text = 'HOT! (Very Close!)';
      } else if (minDist <= 380) {
        type = 'warm';
        text = 'WARM (Nearby)';
      }

      const hintObj = {
        x: spotCenterX,
        y: spotCenterY,
        type: type,
        text: text,
        timer: 80
      };

      this.hostProximityHint = hintObj;

      // 1. If local player is the seeker (Host Seeker, e.g. on Laptop), display immediately!
      const me = this.players.find(p => p.id === this.localPlayerId);
      if (me && me.role === 'seeker') {
        this.game.proximityHint = Object.assign({}, hintObj);
      }

      // 2. If seeker is a remote client (e.g. Mobile Seeker), send an instant direct PROXIMITY_HINT packet!
      const seeker = this.players.find(p => p.role === 'seeker');
      if (seeker && !seeker.isHost) {
        this.sendToClient(seeker.id, {
          type: 'PROXIMITY_HINT',
          hint: hintObj
        });
      }
    }

    checkHuntLineOfSightCatches() {
      if (!this.isHost || this.phase !== 'mp_hunting') return;

      const seeker = this.players.find(p => p.role === 'seeker');
      if (!seeker) return;

      const livingUnhiddenHiders = this.players.filter(p =>
        p.role === 'hider' &&
        !p.eliminated &&
        !p.isHidden
      );

      livingUnhiddenHiders.forEach(h => {
        const dx = h.x - seeker.x;
        const dy = h.y - seeker.y;
        const dist = Math.hypot(dx, dy);

        if (!this.game.apt.hasLineOfSight(seeker.x, seeker.y, h.x, h.y)) return;

        // Instant catch distance (34px proximity)
        if (dist <= 34) {
          h.eliminated = true;
          h.eliminatedAt = this.attemptsLeft;
          h.eliminatedReason = 'Spotted in the Open';
          this.game.showToast(`🚨 ${h.name} was caught in the open!`);
          if (typeof Sound !== 'undefined' && Sound.playCaught) Sound.playCaught();

          this.broadcast({
            type: 'HIDER_CAUGHT',
            spotId: null,
            spotName: 'the open corridor',
            caughtPlayerIds: [h.id]
          });
          return;
        }

        // Vision cone check (175px distance + cone)
        if (dist <= 175) {
          const angleToHider = Math.atan2(dy, dx);
          let diff = Math.abs(angleToHider - seeker.angle);
          if (diff > Math.PI) diff = Math.PI * 2 - diff;
          if (diff < 0.78) {
            h.eliminated = true;
            h.eliminatedAt = this.attemptsLeft;
            h.eliminatedReason = 'Spotted in the Open';
            this.game.showToast(`🚨 ${h.name} was spotted in the open!`);
            if (typeof Sound !== 'undefined' && Sound.playCaught) Sound.playCaught();

            this.broadcast({
              type: 'HIDER_CAUGHT',
              spotId: null,
              spotName: 'the open corridor',
              caughtPlayerIds: [h.id]
            });
          }
        }
      });
    }

    checkMatchEndConditions() {
      if (!this.isHost || this.phase === 'mp_ended' || this.phase === 'lobby') return;

      const livingHiders = this.players.filter(p => p.role === 'hider' && !p.eliminated);
      const seeker = this.players.find(p => p.role === 'seeker');

      // Condition 1: All Hiders eliminated -> Seeker wins!
      // Add a 1.8-second display window so all players see the reveal animation on the canvas before modal pops up!
      if (livingHiders.length === 0) {
        if (!this.matchEndTimeout) {
          this.matchEndTimeout = setTimeout(() => {
            this.endMatch('seeker_win');
          }, 1800);
        }
        return;
      }

      // Condition 2: Seeker exhausted attempts -> Surviving Hiders win!
      if (this.attemptsLeft <= 0) {
        if (!this.matchEndTimeout) {
          this.matchEndTimeout = setTimeout(() => {
            this.endMatch('hider_win');
          }, 1800);
        }
        return;
      }

      // Condition 3: Seeker disconnected
      if (!seeker) {
        this.endMatch('hider_win');
        return;
      }
    }

    endMatch(outcome) {
      if (this.matchEndTimeout) {
        clearTimeout(this.matchEndTimeout);
        this.matchEndTimeout = null;
      }
      this.phase = 'mp_ended';
      if (this.game) this.game.phase = 'mp_ended';
      this.rankings = this.computeFinalRankings(outcome);

      const endPayload = {
        type: 'MATCH_END',
        outcome: outcome,
        rankings: this.rankings,
        revealSpotId: this.revealSpotId || null
      };

      // Broadcast redundancy pulses so all players receive match end reliably
      this.broadcast(endPayload);
      setTimeout(() => this.broadcast(endPayload), 250);
      setTimeout(() => this.broadcast(endPayload), 600);

      this.showResultModal(endPayload);
    }

    /* ========================================================
       DETAILED RANKING SYSTEM (1st, 2nd, 3rd...)
       ======================================================== */
    computeFinalRankings(outcome) {
      const seeker = this.players.find(p => p.role === 'seeker') || { name: 'Seeker', id: 'seeker' };
      const hiders = this.players.filter(p => p.role === 'hider');
      const rankings = [];

      if (outcome === 'seeker_win') {
        rankings.push({
          rank: 1,
          name: seeker.name,
          role: 'seeker',
          color: MP_CFG.seekerColor,
          status: 'VICTORY',
          badge: 'Apex Hunter',
          justification: 'Successfully caught all Hiders before running out of attempts.'
        });

        const sortedHiders = [...hiders].sort((a, b) => (a.eliminatedAt || 0) - (b.eliminatedAt || 0));
        sortedHiders.forEach((h, idx) => {
          rankings.push({
            rank: idx + 2,
            name: h.name,
            role: 'hider',
            color: h.color,
            status: 'ELIMINATED',
            badge: idx === 0 ? 'Last Hider Standing' : 'Caught in Search',
            justification: h.eliminatedReason || 'Caught by Seeker'
          });
        });
      } else {
        const survivors = hiders.filter(h => !h.eliminated);
        const caught = hiders.filter(h => h.eliminated).sort((a, b) => (a.eliminatedAt || 0) - (b.eliminatedAt || 0));

        const unmovedSurvivors = survivors.filter(h => !h.hasRelocated);
        const movedSurvivors = survivors.filter(h => h.hasRelocated);

        let currentRank = 1;

        unmovedSurvivors.forEach(h => {
          rankings.push({
            rank: currentRank,
            name: h.name,
            role: 'hider',
            color: h.color,
            status: 'SURVIVED',
            badge: 'Unmoved Stealth Master (+25 Bonus)',
            justification: 'Remained undisturbed in original hiding spot throughout the entire hunt!'
          });
        });

        if (unmovedSurvivors.length > 0) currentRank++;

        movedSurvivors.forEach(h => {
          rankings.push({
            rank: currentRank,
            name: h.name,
            role: 'hider',
            color: h.color,
            status: 'SURVIVED',
            badge: 'Tactical Survivor',
            justification: 'Successfully evaded all Seeker attempts with strategic mid-hunt relocation.'
          });
        });

        currentRank++;

        caught.forEach(h => {
          rankings.push({
            rank: currentRank,
            name: h.name,
            role: 'hider',
            color: h.color,
            status: 'ELIMINATED',
            badge: 'Caught',
            justification: h.eliminatedReason || 'Eliminated during search'
          });
          currentRank++;
        });

        const caughtCount = hiders.length - survivors.length;
        rankings.push({
          rank: currentRank,
          name: seeker.name,
          role: 'seeker',
          color: MP_CFG.seekerColor,
          status: 'OUT OF ATTEMPTS',
          badge: 'Exhausted Search',
          justification: `Found ${caughtCount} / ${hiders.length} Hiders before search attempts ran out.`
        });
      }

      return rankings;
    }

    showResultModal(data) {
      if (!this.resultModal) return;
      this.resultModal.classList.remove('hidden');
      this.resultModal.style.display = 'flex';

      if (this.countdownOverlay) this.countdownOverlay.classList.add('hidden');
      if (this.countdownSeekerBanner) this.countdownSeekerBanner.classList.add('hidden');
      if (this.spectatorBanner) this.spectatorBanner.classList.add('hidden');

      const isSeekerWin = data.outcome === 'seeker_win';
      if (this.resultTitle) {
        this.resultTitle.textContent = isSeekerWin ? 'SEEKER VICTORY' : 'HIDERS EVADED';
        this.resultTitle.className = isSeekerWin ? 'result-title seeker' : 'result-title hider';
      }
      if (this.resultSubtitle) {
        this.resultSubtitle.textContent = isSeekerWin
          ? 'The Seeker successfully tracked down all Hiders!'
          : 'The Seeker ran out of checks! Surviving Hiders claimed victory.';
      }

      if (this.resultTbody) {
        this.resultTbody.innerHTML = '';
        data.rankings.forEach(item => {
          const tr = document.createElement('tr');
          const isWinner = item.rank === 1;
          tr.className = `mp-rank-row ${isWinner ? 'rank-winner' : ''}`;
          tr.innerHTML = `
            <td class="rank-cell">
              <span class="rank-badge rank-${item.rank}">#${item.rank}</span>
            </td>
            <td class="player-cell">
              <span class="color-dot-inline" style="background:${item.color};"></span>
              <strong>${this.escapeHtml(item.name)}</strong>
            </td>
            <td class="role-cell">
              <span class="role-tag-sm ${item.role}">${item.role.toUpperCase()}</span>
            </td>
            <td class="status-cell">
              <span class="status-tag ${item.status.toLowerCase().replace(/\s+/g, '-')}">${item.status}</span>
            </td>
            <td class="just-cell">
              <span class="just-badge">${this.escapeHtml(item.badge)}</span>
              <p class="just-desc">${this.escapeHtml(item.justification)}</p>
            </td>
          `;
          this.resultTbody.appendChild(tr);
        });
      }

      const me = this.players.find(p => p.id === this.localPlayerId);
      if (me) {
        const iWon = (isSeekerWin && me.role === 'seeker') || (!isSeekerWin && me.role === 'hider' && !me.eliminated);
        if (typeof Sound !== 'undefined') {
          if (iWon && Sound.playWin) Sound.playWin();
          else if (Sound.playLose) Sound.playLose();
        }
      }

      // Automated 6-second auto-return to lobby
      if (this.autoReturnTimer) {
        clearInterval(this.autoReturnTimer);
        this.autoReturnTimer = null;
      }
      let autoReturnSecs = 6;
      if (this.btnReturnLobby) {
        this.btnReturnLobby.textContent = `Return to Lobby (${autoReturnSecs}s)`;
      }
      this.autoReturnTimer = setInterval(() => {
        autoReturnSecs--;
        if (autoReturnSecs > 0) {
          if (this.btnReturnLobby) {
            this.btnReturnLobby.textContent = `Return to Lobby (${autoReturnSecs}s)`;
          }
        } else {
          clearInterval(this.autoReturnTimer);
          this.autoReturnTimer = null;
          if (this.isHost) {
            this.hostReturnToLobby();
          } else {
            this.clientReturnToLobby();
          }
        }
      }, 1000);
    }

    /* ========================================================
       CLIENT INPUT TRANSMISSION LOOP (20 Hz)
       ======================================================== */
    startClientInputLoop() {
      clearInterval(this.inputInterval);
      const intervalMs = Math.round(1000 / MP_CFG.syncHz);
      this.inputInterval = setInterval(() => {
        if (this.phase === 'lobby' || this.phase === 'mp_ended') return;

        if (!this.isHost && this.phase === 'mp_hiding_countdown') {
          this.updateCountdownFromClock();
          this.updateMultiplayerHUD();
        }

        const me = this.players.find(p => p.id === this.localPlayerId);
        if (!me) return;

        me.x = this.game.player.x;
        me.y = this.game.player.y;
        me.angle = this.game.player.angle;
        me.isMoving = this.game.player.isMoving;
        me.isHidden = this.game.player.isHidden;
        me.hiddenSpotId = this.game.player.hiddenSpot ? this.game.player.hiddenSpot.id : null;
        if (this.game.hasRelocatedDuringSeek) me.hasRelocated = true;

        if (!this.isHost) {
          this.sendToHost({
            type: 'PLAYER_INPUT',
            t: Date.now(),
            id: this.localPlayerId,
            x: me.x,
            y: me.y,
            angle: me.angle,
            isMoving: me.isMoving,
            isHidden: me.isHidden,
            hiddenSpotId: me.hiddenSpotId,
            isReady: me.isReady,
            hasRelocated: me.hasRelocated
          });
        }
      }, intervalMs);
    }

    sendSeekerSearch(spotId) {
      if (this.phase !== 'mp_hunting') return;
      if (this.isHost) {
        this.processSeekerSearch(spotId, this.localPlayerId);
      } else {
        this.sendToHost({
          type: 'SEEKER_SEARCH',
          spotId: spotId,
          seekerId: this.localPlayerId
        });
      }
    }

    sendHiderReady() {
      const me = this.players.find(p => p.id === this.localPlayerId);
      if (me) me.isReady = true;

      if (this.isHost) {
        this.checkAllHidersReady();
      } else {
        this.sendToHost({
          type: 'HIDER_READY',
          id: this.localPlayerId
        });
      }
    }

    applyGameSync(sync) {
      if (!sync || this.isHost) return;

      if (sync.t) {
        if (this.lastSyncTime && sync.t < this.lastSyncTime) return;
        this.lastSyncTime = sync.t;
      }

      const clientNotInGame = !this.game.isMultiplayer || this.phase === 'lobby' || this.game.phase === 'menu' || (this.modal && (!this.modal.classList.contains('hidden') || this.modal.style.display !== 'none'));
      const serverMatchActive = !!(sync.matchActive || sync.phase === 'mp_hiding_countdown' || sync.phase === 'mp_hunting');

      if (clientNotInGame && serverMatchActive) {
        if (sync.settings) this.settings = sync.settings;
        if (sync.players && sync.players.length > 0) {
          sync.players.forEach(sp => {
            const ep = this.players.find(p => p.id === sp.id || (sp.name && p.name === sp.name));
            if (ep) {
              Object.assign(ep, sp);
            } else {
              this.players.push(sp);
            }
          });
        }
        this.phase = sync.phase;
        if (this.game) this.game.phase = sync.phase;
        if (sync.countdownEndTime) {
          this.countdownEndTime = sync.countdownEndTime;
        }
        this.countdown = sync.countdown;
        this.attemptsLeft = sync.attemptsLeft;
        this.checkedSpots = sync.checkedSpots || [];
        this.clientStartMatch();
      }

      this.phase = sync.phase;
      if (this.game) this.game.phase = sync.phase;
      if (sync.countdownEndTime) {
        this.countdownEndTime = sync.countdownEndTime;
      }
      this.attemptsLeft = sync.attemptsLeft;
      this.checkedSpots = sync.checkedSpots || [];
      if (sync.revealSpotId) this.revealSpotId = sync.revealSpotId;
      this.updateCountdownFromClock();

      if (this.game && this.game.apt) {
        this.game.apt.hidingSpots.forEach(s => {
          s.checked = this.checkedSpots.includes(s.id);
        });
      }

      if (sync.proximityHint) {
        const me = this.players.find(p => p.id === this.localPlayerId);
        if (me && me.role === 'seeker') {
          if (!this.game.proximityHint || this.game.proximityHint.timer <= 15) {
            this.game.proximityHint = Object.assign({}, sync.proximityHint);
          }
        }
      }

      if (sync.players) {
        sync.players.forEach(remote => {
          let localP = this.players.find(p => p.id === remote.id);
          if (!localP && remote.name) {
            localP = this.players.find(p => p.name === remote.name);
            if (localP) localP.id = remote.id;
          }
          if (localP) {
            localP.isMoving = remote.isMoving;
            localP.isHidden = remote.isHidden;
            localP.hiddenSpotId = remote.hiddenSpotId;
            localP.isReady = remote.isReady;
            localP.eliminated = remote.eliminated;
            localP.eliminatedReason = remote.eliminatedReason;
            if (remote.revealedSpotId) localP.revealedSpotId = remote.revealedSpotId;
            localP.hasRelocated = remote.hasRelocated;

            if (remote.id !== this.localPlayerId) {
              localP.x = remote.x;
              localP.y = remote.y;
              localP.angle = remote.angle;
            }
          } else {
            this.players.push(remote);
          }
        });
      }

      this.updateMultiplayerHUD();
      this.checkLocalPlayerElimination();
    }

    checkLocalPlayerElimination() {
      const me = this.players.find(p => p.id === this.localPlayerId);
      if (me && me.eliminated && !this.wasEliminatedAnnounced) {
        this.wasEliminatedAnnounced = true;
        this.game.showToast('You were eliminated! Now spectating remaining players...');
        if (this.spectatorBanner) this.spectatorBanner.classList.remove('hidden');
      }
    }

    updateMultiplayerHUD() {
      let me = this.players.find(p => p.id === this.localPlayerId);
      if (!me && this.localPlayerName) {
        me = this.players.find(p => p.name === this.localPlayerName);
      }
      if (!me) {
        me = this.isHost ? this.players.find(p => p.isHost) : this.players.find(p => !p.isHost);
      }
      const myRole = (me && me.role) || this.game.role || (this.isHost ? 'seeker' : 'hider');

      if (this.game.attemptsValue) {
        this.game.attemptsValue.textContent = `${this.attemptsLeft} / ${this.settings.attemptsLimit}`;
      }

      if (this.phase === 'mp_hiding_countdown') {
        const sec = Math.max(0, Math.ceil(this.countdown));

        if (myRole === 'seeker') {
          if (this.countdownOverlay) this.countdownOverlay.classList.add('hidden');
          if (this.countdownSeekerBanner) this.countdownSeekerBanner.classList.remove('hidden');
          if (this.countdownSeekerSeconds) this.countdownSeekerSeconds.textContent = `${sec}s`;
        } else {
          if (this.countdownSeekerBanner) this.countdownSeekerBanner.classList.add('hidden');
          if (this.countdownOverlay) this.countdownOverlay.classList.remove('hidden');
          if (this.countdownHiderBadge) this.countdownHiderBadge.classList.remove('hidden');
          if (this.countdownHiderSeconds) this.countdownHiderSeconds.textContent = `${sec}s`;
        }
      } else {
        if (this.countdownOverlay) this.countdownOverlay.classList.add('hidden');
        if (this.countdownSeekerBanner) this.countdownSeekerBanner.classList.add('hidden');
        if (this.game.btnTouchReady) this.game.btnTouchReady.classList.add('hidden');
        if (this.game.btnReady) this.game.btnReady.classList.add('hidden');
      }

      if (me && me.eliminated && this.phase === 'mp_hunting') {
        if (this.spectatorBanner) this.spectatorBanner.classList.remove('hidden');
      } else {
        if (this.spectatorBanner) this.spectatorBanner.classList.add('hidden');
      }

      if (this.phase === 'mp_hunting' && myRole === 'hider' && me && !me.eliminated) {
        const seeker = this.players.find(p => p.role === 'seeker');
        if (seeker) {
          const d = Math.hypot((me.x || this.game.player.x) - seeker.x, (me.y || this.game.player.y) - seeker.y);
          if (d < 230 && typeof Sound !== 'undefined' && Sound.playHeartbeat) {
            Sound.playHeartbeat(d, 230);
          }
        }
      }
    }

    hostReturnToLobby() {
      if (!this.isHost) return;
      this.phase = 'lobby';
      this.checkedSpots = [];
      this.revealSpotId = null;
      this.wasEliminatedAnnounced = false;

      this.players.forEach(p => {
        p.eliminated = false;
        p.isHidden = false;
        p.hiddenSpotId = null;
        p.isReady = false;
        p.revealedSpotId = null;
        p.hasRelocated = false;
      });

      const payload = {
        type: 'RETURN_LOBBY',
        players: this.players,
        settings: this.settings
      };

      this.broadcast(payload);
      this.clientReturnToLobby();
    }

    clientReturnToLobby() {
      if (this.autoReturnTimer) {
        clearInterval(this.autoReturnTimer);
        this.autoReturnTimer = null;
      }
      if (this.btnReturnLobby) {
        this.btnReturnLobby.textContent = 'Return to Lobby';
      }
      this.phase = 'lobby';
      this.wasEliminatedAnnounced = false;
      this.revealSpotId = null;

      if (this.resultModal) {
        this.resultModal.classList.add('hidden');
        this.resultModal.style.display = 'none';
      }
      if (this.spectatorBanner) this.spectatorBanner.classList.add('hidden');
      if (this.countdownOverlay) this.countdownOverlay.classList.add('hidden');
      if (this.countdownSeekerBanner) this.countdownSeekerBanner.classList.add('hidden');

      this.players.forEach(p => {
        p.eliminated = false;
        p.isHidden = false;
        p.hiddenSpotId = null;
        p.isReady = false;
        p.revealedSpotId = null;
        p.hasRelocated = false;
        p.isMoving = false;
      });

      if (this.game && this.game.player) {
        this.game.player.isMoving = false;
        this.game.player.isHidden = false;
        this.game.player.hiddenSpot = null;
        this.game.player.speed = (typeof CFG !== 'undefined' && CFG.playerSpeed) ? CFG.playerSpeed : 3.5;
      }

      this.game.isMultiplayer = false;
      this.game.phase = 'menu';
      this.game.menuScreen.classList.remove('hidden');
      this.game.menuScreen.style.display = '';
      this.game.topHud.classList.add('hidden');
      if (this.game.touchPad) this.game.touchPad.classList.add('hidden');
      if (this.game.actionBar) this.game.actionBar.classList.add('hidden');
      if (this.game.controlsFooter) this.game.controlsFooter.classList.add('hidden');

      this.showLobbyView();
    }

    /* ========================================================
       CLEAN ROOM EXIT / DISCONNECT (Prevents Freezes & Crashes)
       ======================================================== */
    leaveRoom() {
      // 1. Notify other players before severing MQTT connection
      if (this.mqttConnected && this.roomCode) {
        try {
          const leavePayload = {
            type: 'PLAYER_LEFT',
            id: this.localPlayerId,
            name: this.localPlayerName,
            isHost: this.isHost
          };
          if (this.isHost) {
            this.broadcast(leavePayload);
          } else {
            this.sendToHost(leavePayload);
          }
        } catch (_) {}
      }

      // 2. Clear all internal timers and MQTT client
      this.cleanup();

      // 3. Reset Game State to Menu
      this.game.isMultiplayer = false;
      this.game.phase = 'menu';
      this.game.isPaused = false;
      this.phase = 'lobby';
      this.revealSpotId = null;

      // 4. Force hide all multiplayer and pause modals
      if (this.modal) {
        this.modal.classList.add('hidden');
        this.modal.style.display = 'none';
      }
      const tabBar = document.querySelector('.mp-tab-bar');
      if (tabBar) {
        tabBar.classList.remove('hidden');
        tabBar.style.display = 'flex';
      }
      if (this.lobbyView) {
        this.lobbyView.classList.add('hidden');
        this.lobbyView.style.display = 'none';
      }
      if (this.panelJoin) {
        this.panelJoin.classList.add('hidden');
        this.panelJoin.style.display = 'none';
      }
      if (this.panelCreate) {
        this.panelCreate.classList.add('hidden');
        this.panelCreate.style.display = 'none';
      }
      if (this.resultModal) {
        this.resultModal.classList.add('hidden');
        this.resultModal.style.display = 'none';
      }
      if (this.game.pauseModal) {
        this.game.pauseModal.classList.add('hidden');
        this.game.pauseModal.style.display = 'none';
      }
      if (this.spectatorBanner) {
        this.spectatorBanner.classList.add('hidden');
        this.spectatorBanner.style.display = 'none';
      }
      if (this.countdownOverlay) {
        this.countdownOverlay.classList.add('hidden');
        this.countdownOverlay.style.display = 'none';
      }
      if (this.countdownSeekerBanner) {
        this.countdownSeekerBanner.classList.add('hidden');
        this.countdownSeekerBanner.style.display = 'none';
      }

      // 5. Restore Main Menu Screen & Interactive Options
      if (this.game.menuScreen) {
        this.game.menuScreen.classList.remove('hidden');
        this.game.menuScreen.style.display = '';
      }
      if (this.game.revealMenuOptions) {
        this.game.revealMenuOptions();
      }

      this.game.topHud.classList.add('hidden');
      this.game.topHud.style.display = 'none';
      if (this.game.touchPad) this.game.touchPad.classList.add('hidden');
      if (this.game.actionBar) this.game.actionBar.classList.add('hidden');
      if (this.game.controlsFooter) this.game.controlsFooter.classList.add('hidden');

      if (this.game.renderer && this.game.renderer.resize) {
        this.game.renderer.resize();
      }
    }

    cleanup() {
      if (this.autoReturnTimer) {
        clearInterval(this.autoReturnTimer);
        this.autoReturnTimer = null;
      }
      if (this.joinBrokerFailoverTimer) {
        clearTimeout(this.joinBrokerFailoverTimer);
        this.joinBrokerFailoverTimer = null;
      }
      if (this.joinBrokerFailoverTimer2) {
        clearTimeout(this.joinBrokerFailoverTimer2);
        this.joinBrokerFailoverTimer2 = null;
      }
      if (this.lobbyPingInterval) {
        clearInterval(this.lobbyPingInterval);
        this.lobbyPingInterval = null;
      }
      if (this.handshakeRetryTimer) {
        clearInterval(this.handshakeRetryTimer);
        this.handshakeRetryTimer = null;
      }
      if (this.connectTimeout) {
        clearTimeout(this.connectTimeout);
        this.connectTimeout = null;
      }
      if (this.mqttReconnectTimer) {
        clearTimeout(this.mqttReconnectTimer);
        this.mqttReconnectTimer = null;
      }
      if (this.matchEndTimeout) {
        clearTimeout(this.matchEndTimeout);
        this.matchEndTimeout = null;
      }
      clearInterval(this.syncInterval);
      clearInterval(this.inputInterval);

      if (this.mqtt) {
        try {
          if (this.mqtt.isConnected && this.mqtt.isConnected()) {
            this.mqtt.disconnect();
          }
        } catch (e) {}
        this.mqtt = null;
        this.mqttConnected = false;
      }

      this.players = [];
      this.isHost = false;
      this.status = 'idle';
      this.wasEliminatedAnnounced = false;
      this.countdownEndTime = 0;
      this.revealSpotId = null;
    }

    escapeHtml(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }
  }

  if (typeof window !== 'undefined') {
    window.MultiplayerManager = MultiplayerManager;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = MultiplayerManager;
  }
})();
