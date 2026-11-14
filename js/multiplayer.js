/* ========================================================
   Peekko - PeerJS Host-Authoritative Custom Room Multiplayer
   Real-Time P2P WebRTC mesh for 2 to 5 Players with STUN/TURN
   Cross-Network Mobile Data & Wi-Fi NAT Traversal Support,
   Every-Player Lobby Role Switching, 25s Hiding Countdown,
   Mobile Touch Controls & Detailed End-of-Match Leaderboard
   ======================================================== */

(function () {
  'use strict';

  const MP_CFG = (typeof window !== 'undefined' && window.PEEKKO_CONFIG && window.PEEKKO_CONFIG.multiplayer) || {
    hidingPhaseSeconds: 25,
    minPlayers: 2,
    maxPlayers: 5,
    defaultAttempts: 10,
    allowedAttempts: [7, 10, 15, 20],
    hiderPalette: ['#38bdf8', '#10b981', '#a855f7', '#ec4899', '#f43f5e'],
    seekerColor: '#f59e0b',
    syncHz: 25
  };

  // Cross-Network Global STUN & Metered TURN Relay Configuration
  // Enables seamless P2P WebRTC traversal across Cellular 4G/5G Mobile Data (CGNAT/Symmetric NAT) & Wi-Fi
  const PEER_CONFIG = {
    debug: 1,
    config: {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        { urls: 'stun:stun3.l.google.com:19302' },
        { urls: 'stun:stun4.l.google.com:19302' },
        { urls: 'stun:stun.cloudflare.com:3478' },
        { urls: 'stun:openrelay.metered.ca:80' },
        {
          urls: 'turn:openrelay.metered.ca:80',
          username: 'openrelayproject',
          credential: 'openrelayproject'
        },
        {
          urls: 'turn:openrelay.metered.ca:443',
          username: 'openrelayproject',
          credential: 'openrelayproject'
        },
        {
          urls: 'turn:openrelay.metered.ca:443?transport=tcp',
          username: 'openrelayproject',
          credential: 'openrelayproject'
        },
        {
          urls: 'turns:openrelay.metered.ca:443?transport=tcp',
          username: 'openrelayproject',
          credential: 'openrelayproject'
        }
      ],
      iceCandidatePoolSize: 10,
      iceTransportPolicy: 'all'
    }
  };

  // Dynamically refresh TURN relay tokens from Metered API if reachable
  let turnCredentialsRefreshed = false;
  async function refreshTurnCredentials() {
    if (turnCredentialsRefreshed) return;
    try {
      const res = await fetch('https://openrelay.metered.ca/api/v1/turn/credentials?apiKey=openrelayproject');
      if (res.ok) {
        const dynamicServers = await res.json();
        if (Array.isArray(dynamicServers) && dynamicServers.length > 0) {
          PEER_CONFIG.config.iceServers = [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            ...dynamicServers
          ];
          turnCredentialsRefreshed = true;
          console.log('[PeerJS WebRTC] Acquired fresh TURN relay credentials for CGNAT traversal.');
        }
      }
    } catch (_) {
      // Fallback: static Metered OpenRelay servers in PEER_CONFIG remain active
    }
  }

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

  function getHostPeerId(code) {
    return 'peekko-v8-' + normalizeRoomCode(code);
  }

  class MultiplayerManager {
    constructor(game) {
      this.game = game;
      this.peer = null;
      this.isHost = false;
      this.roomCode = null;
      this.localPlayerId = null;
      this.localPlayerName = 'Agent';
      this.status = 'idle'; // 'idle' | 'creating' | 'joining' | 'lobby' | 'in_game'

      // Host connection storage
      this.connections = new Map(); // peerId -> DataConnection (host side)
      this.hostConn = null;         // DataConnection to host (client side)

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
      this.attemptsLeft = 10;
      this.checkedSpots = [];
      this.rankings = [];

      // Intervals & Timers
      this.syncInterval = null;
      this.inputInterval = null;

      this.bindDOM();
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
      this.btnJoinSubmit = document.getElementById('btn-join-room-submit');
      this.joinError = document.getElementById('mp-join-error');

      // Lobby View
      this.lobbyView = document.getElementById('mp-lobby-view');
      this.lobbyRoomCode = document.getElementById('lobby-room-code');
      this.btnCopyCode = document.getElementById('btn-copy-code');
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
            this.showJoinError('Please enter a valid room code.');
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

      // Copy Code
      if (this.btnCopyCode) {
        this.btnCopyCode.addEventListener('click', () => this.copyRoomCode());
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
        this.switchTab('create');
        if (this.lobbyView) this.lobbyView.classList.add('hidden');
        if (this.panelCreate) this.panelCreate.classList.remove('hidden');
      }
      refreshTurnCredentials();
    }
    }

    closeModal() {
      if (this.modal) this.modal.classList.add('hidden');
      if (this.createError) this.createError.textContent = '';
      if (this.joinError) this.joinError.textContent = '';
    }

    switchTab(tab) {
      if (tab === 'create') {
        this.tabCreate.classList.add('active');
        this.tabJoin.classList.remove('active');
        this.panelCreate.classList.remove('hidden');
        this.panelJoin.classList.add('hidden');
      } else {
        this.tabCreate.classList.remove('active');
        this.tabJoin.classList.add('active');
        this.panelCreate.classList.add('hidden');
        this.panelJoin.classList.remove('hidden');
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
        // Fallback
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
       HOST: CREATE ROOM
       ======================================================== */
    createRoom(hostName) {
      if (typeof Peer === 'undefined') {
        this.showCreateError('PeerJS library not loaded. Check internet connection.');
        return;
      }

      refreshTurnCredentials();
      this.showCreateError('');
      if (this.btnCreateSubmit) {
        this.btnCreateSubmit.disabled = true;
        this.btnCreateSubmit.textContent = 'Generating Room...';
      }

      this.cleanup();
      this.isHost = true;
      this.localPlayerName = hostName || 'Host';
      this.roomCode = generateRoomCode();
      const peerId = getHostPeerId(this.roomCode);

      try {
        this.peer = new Peer(peerId, PEER_CONFIG);
      } catch (err) {
        this.showCreateError('Failed to initialize Peer: ' + err.message);
        if (this.btnCreateSubmit) {
          this.btnCreateSubmit.disabled = false;
          this.btnCreateSubmit.textContent = 'GENERATE ROOM CODE';
        }
        return;
      }

      this.peer.on('open', (id) => {
        this.localPlayerId = id;
        this.status = 'lobby';

        // Initialize Host Player
        const hostRole = this.hostInitialRole || 'hider';
        const hostColor = hostRole === 'seeker' ? MP_CFG.seekerColor : MP_CFG.hiderPalette[0];

        this.players = [{
          id: id,
          name: this.localPlayerName,
          isHost: true,
          role: hostRole,
          color: hostColor,
          ready: true,
          x: 680,
          y: 725,
          angle: -Math.PI / 2,
          isMoving: false,
          isHidden: false,
          hiddenSpotId: null,
          isReady: false,
          eliminated: false,
          eliminatedAt: 0,
          eliminatedReason: '',
          hasRelocated: false
        }];

        if (this.btnCreateSubmit) {
          this.btnCreateSubmit.disabled = false;
          this.btnCreateSubmit.textContent = 'GENERATE ROOM CODE';
        }

        this.showLobbyView();
      });

      this.peer.on('connection', (conn) => {
        conn.serialization = 'json';

        // Monitor underlying RTCPeerConnection for ICE logging and recovery
        const checkPeerConnection = () => {
          if (conn.peerConnection) {
            conn.peerConnection.addEventListener('iceconnectionstatechange', () => {
              console.log('[Host WebRTC] ICE state with ' + conn.peer + ':', conn.peerConnection.iceConnectionState);
            });
          }
        };
        setTimeout(checkPeerConnection, 100);

        // Attach data listener immediately to avoid race conditions
        conn.on('data', (data) => this.handleHostMessage(conn, data));

        conn.on('open', () => {
          if (this.phase === 'lobby') {
            this.broadcastLobbyUpdate();
          }
        });

        conn.on('close', () => {
          this.handlePlayerDisconnect(conn.peer);
        });

        conn.on('error', (err) => {
          console.warn('Connection error with peer:', conn.peer, err);
          this.handlePlayerDisconnect(conn.peer);
        });
      });

      this.peer.on('error', (err) => {
        console.error('PeerJS Host Error:', err);
        if (err.type === 'unavailable-id') {
          // Collision on room code, retry with new code
          this.cleanup();
          this.createRoom(hostName);
        } else {
          this.showCreateError('Network error: ' + (err.message || err.type));
          if (this.btnCreateSubmit) {
            this.btnCreateSubmit.disabled = false;
            this.btnCreateSubmit.textContent = 'GENERATE ROOM CODE';
          }
        }
      });
    }

    /* ========================================================
       CLIENT: JOIN ROOM
       ======================================================== */
    joinRoom(clientName, roomCode) {
      if (typeof Peer === 'undefined') {
        this.showJoinError('PeerJS library not loaded. Check internet connection.');
        return;
      }

      refreshTurnCredentials();
      this.showJoinError('');
      if (this.btnJoinSubmit) {
        this.btnJoinSubmit.disabled = true;
        this.btnJoinSubmit.textContent = 'Locating Room & Relay...';
      }

      this.cleanup();
      this.isHost = false;
      this.localPlayerName = clientName || 'Guest';
      this.roomCode = roomCode.toUpperCase().trim();
      const hostPeerId = getHostPeerId(this.roomCode);

      try {
        this.peer = new Peer(PEER_CONFIG);
      } catch (err) {
        this.showJoinError('Failed to initialize Peer: ' + err.message);
        if (this.btnJoinSubmit) {
          this.btnJoinSubmit.disabled = false;
          this.btnJoinSubmit.textContent = 'JOIN ROOM';
        }
        return;
      }

      let connected = false;
      const connectTimeout = setTimeout(() => {
        if (!connected) {
          this.showJoinError('Connection timeout. Please verify Room Code and ensure Host is currently in the lobby.');
          if (this.btnJoinSubmit) {
            this.btnJoinSubmit.disabled = false;
            this.btnJoinSubmit.textContent = 'JOIN ROOM';
          }
          this.cleanup();
        }
      }, 26000); // 26s for cellular symmetric CGNAT STUN/TURN negotiation

      this.peer.on('open', (id) => {
        this.localPlayerId = id;
        if (this.btnJoinSubmit) {
          this.btnJoinSubmit.textContent = 'Traversing NAT / TURN...';
        }

        this.hostConn = this.peer.connect(hostPeerId, {
          reliable: true,
          serialization: 'json'
        });

        // Monitor ICE connection state changes for live feedback and automatic recovery
        const monitorICE = () => {
          if (this.hostConn && this.hostConn.peerConnection) {
            const pc = this.hostConn.peerConnection;
            pc.addEventListener('iceconnectionstatechange', () => {
              const state = pc.iceConnectionState;
              console.log('[Client WebRTC] ICE state:', state);
              if (!connected && this.btnJoinSubmit) {
                if (state === 'checking') {
                  this.btnJoinSubmit.textContent = 'Crossing NAT / TURN Relay...';
                } else if (state === 'connected' || state === 'completed') {
                  this.btnJoinSubmit.textContent = 'Synchronizing Lobby...';
                } else if (state === 'failed') {
                  console.warn('[Client WebRTC] ICE failed. Retrying candidate pair via TURN...');
                  if (pc.restartIce) pc.restartIce();
                }
              }
            });
          }
        };
        setTimeout(monitorICE, 120);

        // Attach data listener immediately so incoming responses are never missed
        this.hostConn.on('data', (data) => this.handleClientMessage(data));

        this.hostConn.on('open', () => {
          connected = true;
          clearTimeout(connectTimeout);
          this.status = 'lobby';

          const sendHandshake = () => {
            if (this.hostConn && this.hostConn.open) {
              this.hostConn.send({
                type: 'JOIN',
                id: id,
                name: this.localPlayerName
              });
            }
          };

          sendHandshake();
          // Retry handshake after 1s if host update not yet received
          this.handshakeRetryTimer = setTimeout(() => {
            if (this.status === 'lobby' && (!this.players || this.players.length === 0)) {
              sendHandshake();
            }
          }, 1000);

          if (this.btnJoinSubmit) {
            this.btnJoinSubmit.disabled = false;
            this.btnJoinSubmit.textContent = 'JOIN ROOM';
          }
        });

        this.hostConn.on('close', () => {
          this.game.showToast('Disconnected from Host.');
          this.leaveRoom();
        });

        this.hostConn.on('error', (err) => {
          console.warn('Host connection error:', err);
          this.showJoinError('Could not reach Host: ' + (err.message || 'Check room code'));
          if (this.btnJoinSubmit) {
            this.btnJoinSubmit.disabled = false;
            this.btnJoinSubmit.textContent = 'JOIN ROOM';
          }
        });
      });

      this.peer.on('error', (err) => {
        clearTimeout(connectTimeout);
        console.error('PeerJS Client Error:', err);
        let errorMsg = 'Connection error: ' + (err.message || err.type);
        if (err.type === 'peer-unavailable') {
          errorMsg = `Room '${this.roomCode}' not found. Make sure Host created the room first and is in the lobby.`;
        } else if (err.type === 'network') {
          errorMsg = 'Network connectivity issue. Please check your data/Wi-Fi connection.';
        }
        this.showJoinError(errorMsg);
        if (this.btnJoinSubmit) {
          this.btnJoinSubmit.disabled = false;
          this.btnJoinSubmit.textContent = 'JOIN ROOM';
        }
      });
    }

    /* ========================================================
       HOST: INCOMING MESSAGE HANDLER
       ======================================================== */
    handleHostMessage(conn, msg) {
      if (!msg || !msg.type) return;

      if (msg.type === 'JOIN') {
        if (this.players.length >= MP_CFG.maxPlayers) {
          conn.send({ type: 'REJECT', reason: 'Room is full (max 5 players).' });
          conn.close();
          return;
        }
        if (this.phase !== 'lobby') {
          conn.send({ type: 'REJECT', reason: 'Match is already in progress.' });
          conn.close();
          return;
        }

        // Register connection
        this.connections.set(conn.peer, conn);

        // Assign player role and color
        const usedColors = this.players.filter(p => p.role === 'hider').map(p => p.color);
        const freeColor = MP_CFG.hiderPalette.find(c => !usedColors.includes(c)) || MP_CFG.hiderPalette[0];

        const newPlayer = {
          id: conn.peer,
          name: msg.name || `Player ${this.players.length + 1}`,
          isHost: false,
          role: 'hider',
          color: freeColor,
          ready: true,
          x: 680,
          y: 725,
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

        // Send Welcome to new player
        conn.send({
          type: 'WELCOME',
          roomCode: this.roomCode,
          localId: conn.peer,
          settings: this.settings,
          players: this.players
        });

        // Broadcast updated lobby to all
        this.broadcastLobbyUpdate();
        this.renderLobbyUI();
      } else if (msg.type === 'PLAYER_INPUT') {
        const p = this.players.find(pl => pl.id === msg.id);
        if (p && !p.eliminated) {
          p.x = msg.x;
          p.y = msg.y;
          p.angle = msg.angle;
          p.isMoving = msg.isMoving;
          p.isHidden = msg.isHidden;
          p.hiddenSpotId = msg.hiddenSpotId;
          p.isReady = !!msg.isReady;
          if (msg.hasRelocated) p.hasRelocated = true;
        }
      } else if (msg.type === 'SEEKER_SEARCH') {
        this.processSeekerSearch(msg.spotId, msg.seekerId);
      } else if (msg.type === 'HIDER_READY') {
        const p = this.players.find(pl => pl.id === msg.id);
        if (p) p.isReady = true;
        this.checkAllHidersReady();
      } else if (msg.type === 'REQUEST_ROLE') {
        this.applyRoleChange(msg.id, msg.role);
      }
    }

    /* ========================================================
       CLIENT: INCOMING MESSAGE HANDLER
       ======================================================== */
    handleClientMessage(msg) {
      if (!msg || !msg.type) return;

      if (this.handshakeRetryTimer) {
        clearTimeout(this.handshakeRetryTimer);
        this.handshakeRetryTimer = null;
      }

      if (msg.type === 'WELCOME') {
        this.roomCode = msg.roomCode;
        this.settings = msg.settings;
        this.players = msg.players;
        this.showLobbyView();
      } else if (msg.type === 'LOBBY_UPDATE') {
        this.players = msg.players;
        this.settings = msg.settings;
        this.renderLobbyUI();
      } else if (msg.type === 'REJECT') {
        this.showJoinError(msg.reason || 'Join rejected');
        this.leaveRoom();
      } else if (msg.type === 'MATCH_START') {
        this.settings = msg.settings;
        this.players = msg.players;
        this.countdown = msg.countdown;
        this.attemptsLeft = msg.attemptsLimit;
        this.checkedSpots = [];
        this.phase = 'mp_hiding_countdown';
        this.clientStartMatch();
      } else if (msg.type === 'GAME_SYNC') {
        this.applyGameSync(msg);
      } else if (msg.type === 'MATCH_END') {
        this.phase = 'mp_ended';
        this.rankings = msg.rankings;
        this.showResultModal(msg);
      } else if (msg.type === 'RETURN_LOBBY') {
        this.clientReturnToLobby();
      }
    }

    handlePlayerDisconnect(peerId) {
      this.connections.delete(peerId);
      const idx = this.players.findIndex(p => p.id === peerId);
      if (idx !== -1) {
        const removed = this.players[idx];
        this.players.splice(idx, 1);
        this.game.showToast(`${removed.name} left the room.`);
        if (this.phase === 'lobby') {
          this.autoBalanceRoles();
          this.broadcastLobbyUpdate();
          this.renderLobbyUI();
        } else if (this.phase === 'mp_hunting' || this.phase === 'mp_hiding_countdown') {
          this.checkMatchEndConditions();
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
      } else if (this.hostConn && this.hostConn.open) {
        this.hostConn.send({
          type: 'REQUEST_ROLE',
          id: this.localPlayerId,
          role: newRole
        });
      }
    }

    applyRoleChange(targetId, newRole) {
      if (!this.isHost) return;
      const target = this.players.find(p => p.id === targetId);
      if (!target) return;

      if (newRole === 'seeker') {
        // Target becomes seeker, all other players become hiders
        this.players.forEach(p => {
          if (p.id === targetId) {
            p.role = 'seeker';
            p.color = MP_CFG.seekerColor;
          } else {
            p.role = 'hider';
          }
        });
      } else {
        // Target becomes hider
        target.role = 'hider';
        // Ensure there is still 1 seeker; if none, make the other player or host seeker
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
      // Ensure exactly 1 seeker exists
      const seekers = this.players.filter(p => p.role === 'seeker');
      if (seekers.length === 0 && this.players.length > 0) {
        this.players[0].role = 'seeker';
        this.players[0].color = MP_CFG.seekerColor;
      } else if (seekers.length > 1) {
        for (let i = 1; i < seekers.length; i++) {
          seekers[i].role = 'hider';
        }
      }

      // Re-assign distinct high-contrast colors to hiders
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
      this.connections.forEach(conn => {
        if (conn.open) conn.send(payload);
      });
    }

    /* ========================================================
       LOBBY UI RENDERING
       ======================================================== */
    showLobbyView() {
      if (this.panelCreate) this.panelCreate.classList.add('hidden');
      if (this.panelJoin) this.panelJoin.classList.add('hidden');
      if (this.lobbyView) this.lobbyView.classList.remove('hidden');

      if (this.lobbyRoomCode) this.lobbyRoomCode.textContent = this.roomCode;
      this.renderLobbyUI();
    }

    renderLobbyUI() {
      if (!this.lobbyTbody) return;
      this.lobbyTbody.innerHTML = '';

      const mapNames = {
        1: 'Skyglass Penthouse',
        2: 'Heritage Manor',
        3: 'Underground Basement',
        4: 'Grand Shopping Mall'
      };
      if (this.lobbyMapName) this.lobbyMapName.textContent = mapNames[this.settings.mapId] || 'Map 1';
      if (this.lobbyLighting) this.lobbyLighting.textContent = this.settings.lightingMode === 'light' ? 'Day (Light)' : 'Night (Dark)';
      if (this.lobbyAttempts) this.lobbyAttempts.textContent = `${this.settings.attemptsLimit} Checks`;

      const seekerCount = this.players.filter(p => p.role === 'seeker').length;
      const count = this.players.length;

      if (this.lobbyCount) {
        this.lobbyCount.textContent = `Players: ${count} / ${MP_CFG.maxPlayers} (Min 2 required)`;
      }

      // Update Quick Role Selector Pills for Local Player
      const me = this.players.find(p => p.id === this.localPlayerId);
      if (me) {
        if (this.btnMyRoleHider) this.btnMyRoleHider.classList.toggle('active', me.role === 'hider');
        if (this.btnMyRoleSeeker) this.btnMyRoleSeeker.classList.toggle('active', me.role === 'seeker');
      }

      this.players.forEach(p => {
        const tr = document.createElement('tr');
        const isMe = p.id === this.localPlayerId;
        tr.className = `lobby-player-row ${isMe ? 'local-player' : ''}`;

        // Player Name + Host / You tag
        const tdName = document.createElement('td');
        tdName.innerHTML = `
          <div class="lobby-name-cell">
            <strong>${this.escapeHtml(p.name)}</strong>
            ${p.isHost ? '<span class="lobby-badge host">HOST</span>' : ''}
            ${isMe ? '<span class="lobby-badge you">YOU</span>' : ''}
          </div>
        `;

        // Color badge
        const tdColor = document.createElement('td');
        tdColor.innerHTML = `
          <div class="color-badge-wrap">
            <span class="color-dot" style="background:${p.color}; box-shadow:0 0 10px ${p.color};"></span>
          </div>
        `;

        // Role: Host can toggle ANY player, Guest can toggle THEMSELVES!
        const tdRole = document.createElement('td');
        if (this.isHost || isMe) {
          const btnRole = document.createElement('button');
          btnRole.className = `role-toggle-btn ${p.role === 'seeker' ? 'is-seeker' : 'is-hider'}`;
          btnRole.textContent = p.role === 'seeker' ? 'Seeker (Hunter)' : 'Hider (Stealth)';
          btnRole.title = isMe ? 'Click to switch your role' : 'Click to change this player\'s role';
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

        // Status
        const tdStatus = document.createElement('td');
        tdStatus.innerHTML = `<span class="status-connected">● Ready</span>`;

        tr.appendChild(tdName);
        tr.appendChild(tdColor);
        tr.appendChild(tdRole);
        tr.appendChild(tdStatus);
        this.lobbyTbody.appendChild(tr);
      });

      // Start match button rules: Host only, count >= 2, exactly 1 seeker
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
       MATCH START & 25-SECOND HIDING PHASE
       ======================================================== */
    startMatch() {
      if (!this.isHost || this.players.length < MP_CFG.minPlayers) return;

      this.phase = 'mp_hiding_countdown';
      this.countdown = MP_CFG.hidingPhaseSeconds;
      this.attemptsLeft = this.settings.attemptsLimit;
      this.checkedSpots = [];

      // Set spawn coordinates in map foyer with offset
      this.players.forEach((p, i) => {
        p.x = 640 + (i * 28 - (this.players.length * 14));
        p.y = 725;
        p.angle = -Math.PI / 2;
        p.isMoving = false;
        p.isHidden = false;
        p.hiddenSpotId = null;
        p.isReady = false;
        p.eliminated = false;
        p.eliminatedAt = 0;
        p.eliminatedReason = '';
        p.hasRelocated = false;
      });

      // Broadcast MATCH_START
      const startPayload = {
        type: 'MATCH_START',
        settings: this.settings,
        players: this.players,
        countdown: this.countdown,
        attemptsLimit: this.attemptsLeft
      };
      this.connections.forEach(conn => {
        if (conn.open) conn.send(startPayload);
      });

      this.clientStartMatch();
      this.startHostAuthoritativeLoop();
    }

    clientStartMatch() {
      this.closeModal();
      if (this.resultModal) this.resultModal.classList.add('hidden');

      // Setup game instance
      this.game.isMultiplayer = true;
      this.game.mpManager = this;
      this.game.selectedMapId = this.settings.mapId;
      this.game.apt.loadMap(this.settings.mapId);
      this.game.renderer.setTheme(this.settings.lightingMode);
      this.game.applyTheme(this.settings.lightingMode);

      // Find local player
      const me = this.players.find(p => p.id === this.localPlayerId);
      if (me) {
        this.game.role = me.role;
        this.game.player.x = me.x;
        this.game.player.y = me.y;
        this.game.player.angle = me.angle;
        this.game.player.isHidden = false;
        this.game.player.hiddenSpot = null;
      }

      this.game.phase = 'mp_hiding_countdown';
      this.game.menuScreen.classList.add('hidden');
      this.game.topHud.classList.remove('hidden');
      this.game.attemptsBox.classList.remove('hidden');
      this.game.attemptsLabel.textContent = 'SEEKER CHECKS';
      this.game.attemptsValue.textContent = `${this.attemptsLeft} / ${this.settings.attemptsLimit}`;

      // SHOW MOBILE CONTROLS & HUD IN MULTIPLAYER
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

      // Audio init
      if (typeof Sound !== 'undefined' && Sound.init) {
        Sound.init();
      }

      this.startClientInputLoop();
      this.updateMultiplayerHUD();
    }

    /* ========================================================
       HOST AUTHORITATIVE LOOP (25 Hz)
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
      const dt = 1 / MP_CFG.syncHz;

      if (this.phase === 'mp_hiding_countdown') {
        this.countdown -= dt;
        if (this.countdown <= 0) {
          this.transitionToHuntPhase();
        }
      } else if (this.phase === 'mp_hunting') {
        this.checkHuntLineOfSightCatches();
        this.checkMatchEndConditions();
      }

      // Broadcast GAME_SYNC snapshot
      const syncData = {
        type: 'GAME_SYNC',
        phase: this.phase,
        countdown: Math.max(0, this.countdown),
        attemptsLeft: this.attemptsLeft,
        players: this.players.map(p => ({
          id: p.id,
          x: Math.round(p.x * 10) / 10,
          y: Math.round(p.y * 10) / 10,
          angle: Math.round(p.angle * 100) / 100,
          isMoving: p.isMoving,
          isHidden: p.isHidden,
          hiddenSpotId: p.hiddenSpotId,
          isReady: p.isReady,
          eliminated: p.eliminated,
          hasRelocated: p.hasRelocated
        })),
        checkedSpots: this.checkedSpots,
        proximityHint: this.hostProximityHint || null
      };

      this.connections.forEach(conn => {
        if (conn.open) conn.send(syncData);
      });

      this.applyGameSync(syncData);
    }

    transitionToHuntPhase() {
      this.phase = 'mp_hunting';
      this.countdown = 0;
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
        });

        const caughtNames = caughtHiders.map(h => h.name).join(', ');
        this.game.showToast(`🚨 ${caughtNames} was CAUGHT in ${spot.name}!`);
        if (typeof Sound !== 'undefined' && Sound.playCaught) Sound.playCaught();
      } else {
        if (typeof Sound !== 'undefined' && Sound.playEmpty) Sound.playEmpty();
        this.calculateProximityHint(spot);
      }

      this.checkMatchEndConditions();
    }

    calculateProximityHint(spot) {
      const livingHiddenHiders = this.players.filter(p => p.role === 'hider' && !p.eliminated && p.isHidden);
      if (livingHiddenHiders.length === 0) return;

      let minDist = Infinity;
      livingHiddenHiders.forEach(h => {
        const d = Math.hypot(h.x - (spot.x + spot.w / 2), h.y - (spot.y + spot.h / 2));
        if (d < minDist) minDist = d;
      });

      let type = 'cool';
      let text = 'Cool (Opponent Far Away)';
      if (minDist <= 180) {
        type = 'hot';
        text = 'HOT! Opponent is Very Close!';
      } else if (minDist <= 380) {
        type = 'warm';
        text = 'Warm — Opponent is Nearby';
      }

      this.hostProximityHint = {
        x: spot.x + spot.w / 2,
        y: spot.y + spot.h / 2,
        type: type,
        text: text,
        timer: 35
      };
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
          }
        }
      });
    }

    checkMatchEndConditions() {
      if (!this.isHost || this.phase === 'mp_ended' || this.phase === 'lobby') return;

      const livingHiders = this.players.filter(p => p.role === 'hider' && !p.eliminated);
      const seeker = this.players.find(p => p.role === 'seeker');

      // Condition 1: All Hiders eliminated -> Seeker wins
      if (livingHiders.length === 0) {
        this.endMatch('seeker_win');
        return;
      }

      // Condition 2: Seeker exhausted attempts -> Surviving Hiders win
      if (this.attemptsLeft <= 0) {
        this.endMatch('hider_win');
        return;
      }

      // Condition 3: Seeker disconnected
      if (!seeker) {
        this.endMatch('hider_win');
        return;
      }
    }

    endMatch(outcome) {
      this.phase = 'mp_ended';
      this.rankings = this.computeFinalRankings(outcome);

      const endPayload = {
        type: 'MATCH_END',
        outcome: outcome,
        rankings: this.rankings
      };

      this.connections.forEach(conn => {
        if (conn.open) conn.send(endPayload);
      });

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
          if (iWon) Sound.playWin();
          else Sound.playLose();
        }
      }
    }

    /* ========================================================
       CLIENT INPUT TRANSMISSION LOOP
       ======================================================== */
    startClientInputLoop() {
      clearInterval(this.inputInterval);
      this.inputInterval = setInterval(() => {
        if (this.phase === 'lobby' || this.phase === 'mp_ended') return;

        const me = this.players.find(p => p.id === this.localPlayerId);
        if (!me) return;

        me.x = this.game.player.x;
        me.y = this.game.player.y;
        me.angle = this.game.player.angle;
        me.isMoving = this.game.player.isMoving;
        me.isHidden = this.game.player.isHidden;
        me.hiddenSpotId = this.game.player.hiddenSpot ? this.game.player.hiddenSpot.id : null;
        if (this.game.hasRelocatedDuringSeek) me.hasRelocated = true;

        if (!this.isHost && this.hostConn && this.hostConn.open) {
          this.hostConn.send({
            type: 'PLAYER_INPUT',
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
      }, 40); // 25Hz
    }

    sendSeekerSearch(spotId) {
      if (this.phase !== 'mp_hunting') return;
      if (this.isHost) {
        this.processSeekerSearch(spotId, this.localPlayerId);
      } else if (this.hostConn && this.hostConn.open) {
        this.hostConn.send({
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
      } else if (this.hostConn && this.hostConn.open) {
        this.hostConn.send({
          type: 'HIDER_READY',
          id: this.localPlayerId
        });
      }
    }

    applyGameSync(sync) {
      this.phase = sync.phase;
      this.countdown = sync.countdown;
      this.attemptsLeft = sync.attemptsLeft;
      this.checkedSpots = sync.checkedSpots || [];

      if (this.game && this.game.apt) {
        this.game.apt.hidingSpots.forEach(s => {
          s.checked = this.checkedSpots.includes(s.id);
        });
      }

      if (sync.proximityHint) {
        const me = this.players.find(p => p.id === this.localPlayerId);
        if (me && me.role === 'seeker') {
          this.game.proximityHint = sync.proximityHint;
        }
      }

      sync.players.forEach(remote => {
        const localP = this.players.find(p => p.id === remote.id);
        if (localP) {
          localP.isMoving = remote.isMoving;
          localP.isHidden = remote.isHidden;
          localP.hiddenSpotId = remote.hiddenSpotId;
          localP.isReady = remote.isReady;
          localP.eliminated = remote.eliminated;
          localP.hasRelocated = remote.hasRelocated;

          if (remote.id !== this.localPlayerId) {
            localP.x = remote.x;
            localP.y = remote.y;
            localP.angle = remote.angle;
          }
        }
      });

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
      const me = this.players.find(p => p.id === this.localPlayerId);
      if (!me) return;

      if (this.game.attemptsValue) {
        this.game.attemptsValue.textContent = `${this.attemptsLeft} / ${this.settings.attemptsLimit}`;
      }

      // 25s Countdown Phase Overlays
      if (this.phase === 'mp_hiding_countdown') {
        const sec = Math.ceil(this.countdown);

        if (me.role === 'seeker') {
          // Seeker sees centered lock banner
          if (this.countdownOverlay) this.countdownOverlay.classList.add('hidden');
          if (this.countdownSeekerBanner) this.countdownSeekerBanner.classList.remove('hidden');
          if (this.countdownSeekerSeconds) this.countdownSeekerSeconds.textContent = `${sec}s`;
        } else {
          // Hider sees live countdown badge
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

      // Spectator mode banner
      if (me.eliminated && this.phase === 'mp_hunting') {
        if (this.spectatorBanner) this.spectatorBanner.classList.remove('hidden');
      } else {
        if (this.spectatorBanner) this.spectatorBanner.classList.add('hidden');
      }

      // Proximity heartbeat sound for living Hiders
      if (this.phase === 'mp_hunting' && me.role === 'hider' && !me.eliminated) {
        const seeker = this.players.find(p => p.role === 'seeker');
        if (seeker) {
          const d = Math.hypot(me.x - seeker.x, me.y - seeker.y);
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
      this.wasEliminatedAnnounced = false;

      this.players.forEach(p => {
        p.eliminated = false;
        p.isHidden = false;
        p.hiddenSpotId = null;
        p.isReady = false;
        p.hasRelocated = false;
      });

      const payload = {
        type: 'RETURN_LOBBY',
        players: this.players,
        settings: this.settings
      };

      this.connections.forEach(conn => {
        if (conn.open) conn.send(payload);
      });

      this.clientReturnToLobby();
    }

    clientReturnToLobby() {
      this.phase = 'lobby';
      this.wasEliminatedAnnounced = false;
      if (this.resultModal) this.resultModal.classList.add('hidden');
      if (this.spectatorBanner) this.spectatorBanner.classList.add('hidden');
      if (this.countdownOverlay) this.countdownOverlay.classList.add('hidden');
      if (this.countdownSeekerBanner) this.countdownSeekerBanner.classList.add('hidden');

      this.game.isMultiplayer = false;
      this.game.phase = 'menu';
      this.game.menuScreen.classList.remove('hidden');
      this.game.topHud.classList.add('hidden');
      if (this.game.touchPad) this.game.touchPad.classList.add('hidden');
      if (this.game.actionBar) this.game.actionBar.classList.add('hidden');
      if (this.game.controlsFooter) this.game.controlsFooter.classList.add('hidden');

      this.showLobbyView();
    }

    leaveRoom() {
      this.cleanup();
      this.game.isMultiplayer = false;
      this.game.phase = 'menu';
      this.phase = 'lobby';

      if (this.modal) this.modal.classList.add('hidden');
      if (this.lobbyView) this.lobbyView.classList.add('hidden');
      if (this.resultModal) this.resultModal.classList.add('hidden');
      if (this.spectatorBanner) this.spectatorBanner.classList.add('hidden');
      if (this.countdownOverlay) this.countdownOverlay.classList.add('hidden');
      if (this.countdownSeekerBanner) this.countdownSeekerBanner.classList.add('hidden');

      this.game.menuScreen.classList.remove('hidden');
      this.game.topHud.classList.add('hidden');
      if (this.game.touchPad) this.game.touchPad.classList.add('hidden');
      if (this.game.actionBar) this.game.actionBar.classList.add('hidden');
      if (this.game.controlsFooter) this.game.controlsFooter.classList.add('hidden');
    }

    cleanup() {
      clearInterval(this.syncInterval);
      clearInterval(this.inputInterval);

      if (this.hostConn) {
        this.hostConn.close();
        this.hostConn = null;
      }
      this.connections.forEach(conn => conn.close());
      this.connections.clear();

      if (this.peer) {
        this.peer.destroy();
        this.peer = null;
      }

      this.players = [];
      this.isHost = false;
      this.status = 'idle';
      this.wasEliminatedAnnounced = false;
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
