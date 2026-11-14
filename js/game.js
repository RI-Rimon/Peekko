/* ========================================================
   Peekko - Main Game Controller
   4 Distinct Maps, Upper-Medium Bot (Dynamic Re-checks,
   Alert State & Spatial Audio), Difficulty Tuning,
   Proximity Heartbeat, Tactile Seeker Hints & Pause Menu
   ======================================================== */

(() => {
  'use strict';

  const CFG = (typeof window !== 'undefined' && window.PEEKKO_CONFIG) || {
    version: '6.0',
    difficulties: {
      easy: {
        label: 'Easy',
        botSpeed: 3.5,
        losMaxDist: 150,
        losConeHalfAngle: 0.65,
        maxAttemptsSeeker: 13,
        maxAttemptsHider: 7,
        hearingRadius: 200,
        hintBands: ['hot', 'warm', 'cool']
      },
      normal: {
        label: 'Normal',
        botSpeed: 4.15,
        losMaxDist: 175,
        losConeHalfAngle: 0.78,
        maxAttemptsSeeker: 10,
        maxAttemptsHider: 10,
        hearingRadius: 260,
        hintBands: ['hot', 'warm', 'cool']
      },
      hard: {
        label: 'Hard',
        botSpeed: 4.55,
        losMaxDist: 210,
        losConeHalfAngle: 0.90,
        maxAttemptsSeeker: 7,
        maxAttemptsHider: 13,
        hearingRadius: 320,
        hintBands: ['hot']
      }
    },
    playerSpeed: 3.4,
    losInstantCatchDist: 34,
    heartbeatMaxDist: 230,
    scanDuration: 38,
    pointsWinBase: 100,
    pointsUnmovedBonus: 25,
    pointsCaughtPenalty: -50,
    pointsSeekerBonusPerAttempt: 15,
    botRecheckChance: 0.20,
    hintDistances: {
      hot: 180,
      warm: 380
    }
  };

  class PeekkoGame {
    constructor() {
      this.apt = new ApartmentMap();
      this.canvas = document.getElementById('gameCanvas');
      this.renderer = new ApartmentRenderer(this.canvas, this.apt);

      // Load saved theme, map, difficulty, volume & stats
      this.stats = this.loadStats();
      this.theme = this.stats.theme || 'dark';
      this.selectedMapId = this.stats.mapId || 1;
      this.selectedRole = 'hider';
      this.selectedDifficulty = this.stats.difficulty || 'normal';
      this.applyTheme(this.theme);

      // Initialize Master Volume
      if (typeof Sound !== 'undefined' && Sound.setVolume) {
        Sound.setVolume(this.stats.volume !== undefined ? this.stats.volume : 0.75);
      }

      // Game State
      this.role = null;        // 'hider' | 'seeker'
      this.phase = 'menu';     // 'menu' | 'hider_move' | 'hider_ready' | 'bot_seeking' | 'seeker_hunt' | 'ended'
      this.keys = {};
      this.isPaused = false;
      this.lastBotHiddenSpotId = null;

      // Active tuning applied from difficulty
      this.botSpeed = CFG.difficulties[this.selectedDifficulty].botSpeed;
      this.losMaxDist = CFG.difficulties[this.selectedDifficulty].losMaxDist;
      this.losConeHalfAngle = CFG.difficulties[this.selectedDifficulty].losConeHalfAngle;
      this.hearingRadius = CFG.difficulties[this.selectedDifficulty].hearingRadius;
      this.hintBands = CFG.difficulties[this.selectedDifficulty].hintBands;

      this.player = {
        x: 680,
        y: 725,
        radius: 13,
        speed: CFG.playerSpeed,
        angle: -Math.PI / 2,
        isHidden: false,
        hiddenSpot: null,
        isMoving: false
      };

      this.nearestSpot = null;
      this.maxAttempts = CFG.difficulties[this.selectedDifficulty].maxAttemptsHider;
      this.attemptsLeft = this.maxAttempts;
      this.hasRelocatedDuringSeek = false;
      this.lastRelocateRoomId = null;
      this.proximityHint = null;

      // Bot State
      this.botHiddenSpot = null;
      this.revealBotSpot = false;
      this.botSeeker = {
        active: false,
        x: 680,
        y: 755,
        angle: -Math.PI / 2,
        speed: this.botSpeed,
        targets: [],
        checkedHistory: [],
        currentTargetIndex: 0,
        waypoints: [],
        waypointIndex: 0,
        scanningSpotId: null,
        scanTimer: 0,
        stuckTimer: 0,
        stuckTimerMs: 0,
        stuckFrames: 0,
        stuckOriginX: 680,
        stuckOriginY: 755,
        isMoving: false,
        isAlerted: false,
        alertTimer: 0
      };

      this.toastTimeout = null;
      this.introTimer = null;

      // Multiplayer Room Manager
      this.isMultiplayer = false;
      this.mpManager = (typeof MultiplayerManager !== 'undefined') ? new MultiplayerManager(this) : null;

      this.bindDOM();
      this.bindEvents();
      this.selectMap(this.selectedMapId);
      this.selectRole(this.selectedRole);
      this.selectDifficulty(this.selectedDifficulty);
      this.updateScoreUI();
      this.playIntroBlink();

      this.lastTime = performance.now();
      requestAnimationFrame((t) => this.loop(t));
    }

    loadStats() {
      try {
        const raw = localStorage.getItem('peekko_stats_v6') || localStorage.getItem('peekko_stats_v3');
        if (raw) {
          const parsed = JSON.parse(raw);
          const score = Math.max(0, Math.floor(Number(parsed.score) || 0));
          const wins = Math.max(0, Math.floor(Number(parsed.wins) || 0));
          const losses = Math.max(0, Math.floor(Number(parsed.losses) || 0));
          const theme = parsed.theme === 'light' ? 'light' : 'dark';
          const mapId = [1, 2, 3, 4].includes(Number(parsed.mapId)) ? Number(parsed.mapId) : 1;
          const difficulty = ['easy', 'normal', 'hard'].includes(parsed.difficulty) ? parsed.difficulty : 'normal';
          const volume = typeof parsed.volume === 'number' && !isNaN(parsed.volume)
            ? Math.max(0, Math.min(1, parsed.volume))
            : 0.75;
          return { score, wins, losses, theme, mapId, difficulty, volume, version: '6.0' };
        }
      } catch (e) {}
      return { score: 0, wins: 0, losses: 0, theme: 'dark', mapId: 1, difficulty: 'normal', volume: 0.75, version: '6.0' };
    }

    saveStats() {
      try {
        this.stats.theme = this.theme;
        this.stats.mapId = this.selectedMapId;
        this.stats.difficulty = this.selectedDifficulty;
        if (typeof Sound !== 'undefined' && Sound.masterVolume !== undefined) {
          this.stats.volume = Sound.masterVolume;
        }
        localStorage.setItem('peekko_stats_v6', JSON.stringify(this.stats));
      } catch (e) {}
    }

    bindDOM() {
      this.topHud = document.getElementById('top-hud');
      this.menuScreen = document.getElementById('menu-screen');
      this.menuOptionsPanel = document.getElementById('menu-options-panel');
      this.introLogoWrap = document.getElementById('intro-logo-wrap');
      this.creatorModal = document.getElementById('creator-modal');
      this.pauseModal = document.getElementById('pause-modal');
      this.resultModal = document.getElementById('result-modal');

      this.mapPill = document.getElementById('map-pill');
      this.rolePill = document.getElementById('role-pill');
      this.phasePill = document.getElementById('phase-pill');
      this.scoreValue = document.getElementById('score-value');
      this.winsValue = document.getElementById('wins-value');
      this.attemptsBox = document.getElementById('attempts-box');
      this.attemptsLabel = document.getElementById('attempts-label');
      this.attemptsValue = document.getElementById('attempts-value');

      this.actionBar = document.getElementById('action-bar');
      this.interactionPrompt = document.getElementById('interaction-prompt');
      this.promptText = document.getElementById('prompt-text');
      this.btnReady = document.getElementById('btn-ready');
      this.btnTouchReady = document.getElementById('btn-touch-ready');
      this.statusToast = document.getElementById('status-toast');
      this.controlsFooter = document.getElementById('controls-footer');
      this.spaceLegend = document.getElementById('space-legend');
      this.enterLegendWrap = document.getElementById('enter-legend-wrap');
      this.touchPad = document.getElementById('touch-pad');

      this.menuScore = document.getElementById('menu-score');
      this.menuWins = document.getElementById('menu-wins');
      this.menuLosses = document.getElementById('menu-losses');

      this.volumeSlider = document.getElementById('volume-slider');
      this.volumeValDisplay = document.getElementById('volume-val-display');
      if (this.volumeSlider) {
        this.volumeSlider.value = this.stats.volume !== undefined ? this.stats.volume : 0.75;
        if (this.volumeValDisplay) {
          this.volumeValDisplay.textContent = `${Math.round(this.volumeSlider.value * 100)}%`;
        }
      }
    }

    playIntroBlink() {
      this.introLogoWrap.classList.add('blinking');
      this.menuOptionsPanel.classList.add('pre-reveal');

      clearTimeout(this.introTimer);
      this.introTimer = setTimeout(() => {
        this.revealMenuOptions();
      }, 500);
    }

    revealMenuOptions() {
      clearTimeout(this.introTimer);
      this.introLogoWrap.classList.remove('blinking');
      this.menuOptionsPanel.classList.remove('pre-reveal');
    }

    bindEvents() {
      window.addEventListener('keydown', (e) => {
        // Escape toggles Pause modal during active gameplay, or closes modals
        if (e.code === 'Escape') {
          if (!this.creatorModal.classList.contains('hidden')) {
            this.creatorModal.classList.add('hidden');
            return;
          }
          if (this.isPaused) {
            this.resumeGame();
            return;
          }
          if (['hider_move', 'hider_ready', 'bot_seeking', 'seeker_hunt'].includes(this.phase)) {
            this.pauseGame();
            return;
          }
        }

        // Prevent default scrolling for arrows and space only during active unpaused play
        const isGamePlaying = (['hider_move', 'hider_ready', 'bot_seeking', 'seeker_hunt'].includes(this.phase) || (this.isMultiplayer && ['mp_hiding_countdown', 'mp_hunting'].includes(this.phase))) && !this.isPaused;
        if (isGamePlaying && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
          e.preventDefault();
        }

        Sound.init();
        this.keys[e.code] = true;

        if (isGamePlaying && e.code === 'Space' && !e.repeat) {
          this.handleSpaceAction();
        } else if (isGamePlaying && e.code === 'Enter' && !e.repeat) {
          if (this.isMultiplayer && this.role === 'hider' && this.phase === 'mp_hiding_countdown') {
            this.confirmHiderReady();
          } else if (this.role === 'hider' && this.phase === 'hider_ready') {
            this.confirmHiderReady();
          }
        }
      });

      window.addEventListener('keyup', (e) => {
        this.keys[e.code] = false;
      });

      // Clear stuck keys and auto-pause when window loses focus or tab changes
      const handleFocusLoss = () => {
        this.keys = {};
        if (['hider_move', 'hider_ready', 'bot_seeking', 'seeker_hunt'].includes(this.phase) && !this.isPaused) {
          this.pauseGame();
        }
      };
      window.addEventListener('blur', handleFocusLoss);
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) handleFocusLoss();
      });

      // Clicking intro skips right to menu options
      this.menuScreen.addEventListener('click', () => {
        this.revealMenuOptions();
      });

      // High-performance Mobile Touch D-pad & Actions
      document.querySelectorAll('.dpad-btn').forEach(btn => {
        const code = btn.dataset.key;
        const pressStart = (e) => {
          e.preventDefault();
          Sound.init();
          this.keys[code] = true;
          btn.classList.add('active');
        };
        const pressEnd = (e) => {
          e.preventDefault();
          this.keys[code] = false;
          btn.classList.remove('active');
        };

        btn.addEventListener('touchstart', pressStart, { passive: false });
        btn.addEventListener('touchend', pressEnd, { passive: false });
        btn.addEventListener('touchcancel', pressEnd, { passive: false });

        btn.addEventListener('pointerdown', (e) => {
          try { e.target.setPointerCapture(e.pointerId); } catch (_) {}
          pressStart(e);
        });
        btn.addEventListener('pointerup', pressEnd);
        btn.addEventListener('pointercancel', pressEnd);
      });

      const touchSpace = document.getElementById('btn-touch-space');
      if (touchSpace) {
        touchSpace.addEventListener('touchstart', (e) => {
          e.preventDefault();
          Sound.init();
          touchSpace.classList.add('active');
          if (!this.isPaused) this.handleSpaceAction();
        }, { passive: false });
        touchSpace.addEventListener('touchend', (e) => {
          e.preventDefault();
          touchSpace.classList.remove('active');
        }, { passive: false });
        touchSpace.addEventListener('click', (e) => {
          e.preventDefault();
          Sound.init();
          if (!this.isPaused) this.handleSpaceAction();
        });
      }

      if (this.btnTouchReady) {
        this.btnTouchReady.addEventListener('touchstart', (e) => {
          e.preventDefault();
          this.btnTouchReady.classList.add('active');
          if (this.isPaused) return;
          if (this.isMultiplayer && this.role === 'hider' && this.phase === 'mp_hiding_countdown') {
            this.confirmHiderReady();
          } else if (this.role === 'hider' && this.phase === 'hider_ready') {
            this.confirmHiderReady();
          }
        }, { passive: false });
        this.btnTouchReady.addEventListener('touchend', (e) => {
          e.preventDefault();
          this.btnTouchReady.classList.remove('active');
        }, { passive: false });
        this.btnTouchReady.addEventListener('click', (e) => {
          e.preventDefault();
          if (this.isPaused) return;
          if (this.isMultiplayer && this.role === 'hider' && this.phase === 'mp_hiding_countdown') {
            this.confirmHiderReady();
          } else if (this.role === 'hider' && this.phase === 'hider_ready') {
            this.confirmHiderReady();
          }
        });
      }

      // Map selection cards
      document.querySelectorAll('.map-option').forEach(card => {
        card.addEventListener('click', () => {
          Sound.init();
          this.selectMap(Number(card.dataset.map));
        });
      });

      // Role selection cards
      document.getElementById('btn-choose-hider').addEventListener('click', () => {
        Sound.init();
        this.selectRole('hider');
      });

      document.getElementById('btn-choose-seeker').addEventListener('click', () => {
        Sound.init();
        this.selectRole('seeker');
      });

      // Difficulty selector buttons
      document.querySelectorAll('.diff-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          Sound.init();
          this.selectDifficulty(btn.dataset.diff);
        });
      });

      // Dedicated Start Button
      document.getElementById('btn-start-game').addEventListener('click', () => {
        Sound.init();
        this.tryFullscreenAndLandscape();
        this.startRound(this.selectedRole);
      });

      // Multiplayer Custom Rooms Button
      const btnMp = document.getElementById('btn-open-multiplayer');
      if (btnMp) {
        btnMp.addEventListener('click', () => {
          Sound.init();
          if (this.mpManager) {
            this.mpManager.openModal();
          } else {
            const modal = document.getElementById('custom-room-modal');
            if (modal) modal.classList.remove('hidden');
          }
        });
      }

      // Ready button
      this.btnReady.addEventListener('click', () => {
        if (this.role === 'hider' && this.phase === 'hider_ready' && !this.isPaused) {
          this.confirmHiderReady();
        }
      });

      // Pause button on HUD
      const pauseHudBtn = document.getElementById('btn-pause-hud');
      if (pauseHudBtn) {
        pauseHudBtn.addEventListener('click', () => {
          if (this.isPaused) this.resumeGame();
          else if (['hider_move', 'hider_ready', 'bot_seeking', 'seeker_hunt'].includes(this.phase)) {
            this.pauseGame();
          }
        });
      }

      // Pause modal actions
      document.getElementById('btn-pause-resume').addEventListener('click', () => this.resumeGame());
      document.getElementById('btn-pause-restart').addEventListener('click', () => this.restartRound());
      document.getElementById('btn-pause-menu').addEventListener('click', () => {
        this.resumeGame();
        this.openMenu();
      });

      // Volume slider in Pause Modal
      if (this.volumeSlider) {
        this.volumeSlider.addEventListener('input', (e) => {
          const val = parseFloat(e.target.value);
          Sound.init();
          Sound.setVolume(val);
          if (this.volumeValDisplay) {
            this.volumeValDisplay.textContent = `${Math.round(val * 100)}%`;
          }
          this.saveStats();
        });
      }

      // Fullscreen, Theme & Sound
      const btnFs = document.getElementById('btn-fullscreen');
      if (btnFs) btnFs.addEventListener('click', () => this.toggleFullscreen());
      const btnMenuFs = document.getElementById('btn-menu-fullscreen');
      if (btnMenuFs) btnMenuFs.addEventListener('click', () => this.toggleFullscreen());

      document.getElementById('btn-theme-toggle').addEventListener('click', () => this.toggleTheme());
      document.getElementById('btn-modal-theme').addEventListener('click', () => this.toggleTheme());

      document.getElementById('btn-sound-toggle').addEventListener('click', () => {
        const muted = Sound.toggleMute();
        document.getElementById('sound-icon').textContent = muted ? '🔇' : '🔊';
      });

      // Orientation Prompt Overlay
      this.rotatePrompt = document.getElementById('rotate-device-prompt');
      this.btnForceLandscape = document.getElementById('btn-force-landscape');
      this.btnDismissRotate = document.getElementById('btn-dismiss-rotate');
      this.rotatePromptDismissed = false;

      if (this.btnForceLandscape) {
        this.btnForceLandscape.addEventListener('click', () => {
          this.tryFullscreenAndLandscape();
          if (this.rotatePrompt) this.rotatePrompt.classList.add('hidden');
        });
      }
      if (this.btnDismissRotate) {
        this.btnDismissRotate.addEventListener('click', () => {
          this.rotatePromptDismissed = true;
          if (this.rotatePrompt) this.rotatePrompt.classList.add('hidden');
        });
      }

      window.addEventListener('resize', () => this.checkOrientationPrompt());
      window.addEventListener('orientationchange', () => {
        setTimeout(() => this.checkOrientationPrompt(), 150);
      });
      setTimeout(() => this.checkOrientationPrompt(), 300);

      // Creator Modal
      document.getElementById('btn-about-creator').addEventListener('click', () => {
        this.creatorModal.classList.remove('hidden');
      });
      document.getElementById('btn-close-creator').addEventListener('click', () => {
        this.creatorModal.classList.add('hidden');
      });
      this.creatorModal.addEventListener('click', (e) => {
        if (e.target === this.creatorModal) this.creatorModal.classList.add('hidden');
      });

      // Menu & Result buttons
      document.getElementById('btn-menu').addEventListener('click', () => this.openMenu());
      document.getElementById('btn-play-again').addEventListener('click', () => {
        this.resultModal.classList.add('hidden');
        this.startRound(this.role);
      });
      document.getElementById('btn-switch-role').addEventListener('click', () => {
        this.resultModal.classList.add('hidden');
        const nextRole = this.role === 'hider' ? 'seeker' : 'hider';
        this.selectRole(nextRole);
        this.startRound(nextRole);
      });
      document.getElementById('btn-result-menu').addEventListener('click', () => {
        this.resultModal.classList.add('hidden');
        this.openMenu();
      });
    }

    pauseGame() {
      if (this.phase === 'menu' || this.phase === 'ended') return;
      this.isPaused = true;
      this.keys = {};
      this.pauseModal.classList.remove('hidden');
    }

    resumeGame() {
      this.isPaused = false;
      this.pauseModal.classList.add('hidden');
    }

    restartRound() {
      this.resumeGame();
      this.startRound(this.role);
    }

    checkOrientationPrompt() {
      if (!this.rotatePrompt) return;
      const isMobileDevice = ('ontouchstart' in window) || (window.innerWidth < 960);
      const isPortrait = window.innerHeight > window.innerWidth;
      if (isMobileDevice && isPortrait && !this.rotatePromptDismissed) {
        this.rotatePrompt.classList.remove('hidden');
      } else {
        this.rotatePrompt.classList.add('hidden');
      }
    }

    tryFullscreenAndLandscape() {
      try {
        const el = document.documentElement;
        const requestFS = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen;
        if (requestFS && !document.fullscreenElement) {
          const res = requestFS.call(el);
          if (res && res.then) {
            res.then(() => {
              if (screen.orientation && screen.orientation.lock) {
                screen.orientation.lock('landscape').catch(() => {});
              }
              if (this.renderer) this.renderer.resize();
            }).catch(() => {});
          }
        } else if (screen.orientation && screen.orientation.lock) {
          screen.orientation.lock('landscape').catch(() => {});
        }
      } catch (_) {}
    }

    toggleFullscreen() {
      try {
        const el = document.documentElement;
        if (!document.fullscreenElement) {
          const req = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen;
          if (req) {
            const res = req.call(el);
            if (res && res.then) {
              res.then(() => {
                if (screen.orientation && screen.orientation.lock) {
                  screen.orientation.lock('landscape').catch(() => {});
                }
                if (this.renderer) this.renderer.resize();
              }).catch(() => {});
            }
          } else if (screen.orientation && screen.orientation.lock) {
            screen.orientation.lock('landscape').catch(() => {});
          }
        } else {
          const exitFS = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;
          if (exitFS) {
            const res = exitFS.call(document);
            if (res && res.then) {
              res.then(() => {
                if (this.renderer) this.renderer.resize();
              }).catch(() => {});
            }
          }
        }
      } catch (_) {}
    }

    selectMap(mapId) {
      this.selectedMapId = mapId;
      this.apt.loadMap(mapId);
      this.renderer.resize();
      this.saveStats();

      document.querySelectorAll('.map-option').forEach(el => {
        el.classList.toggle('active', Number(el.dataset.map) === mapId);
      });
      this.mapPill.textContent = this.apt.mapName.toUpperCase();
    }

    selectRole(role) {
      this.selectedRole = role;
      document.getElementById('btn-choose-hider').classList.toggle('active', role === 'hider');
      document.getElementById('btn-choose-seeker').classList.toggle('active', role === 'seeker');
    }

    selectDifficulty(diff) {
      if (!CFG.difficulties[diff]) return;
      this.selectedDifficulty = diff;
      this.stats.difficulty = diff;
      this.saveStats();

      const diffCfg = CFG.difficulties[diff];
      this.botSpeed = diffCfg.botSpeed;
      this.losMaxDist = diffCfg.losMaxDist;
      this.losConeHalfAngle = diffCfg.losConeHalfAngle;
      this.hearingRadius = diffCfg.hearingRadius;
      this.hintBands = diffCfg.hintBands;

      document.querySelectorAll('.diff-btn').forEach(btn => {
        const matches = btn.dataset.diff === diff;
        btn.classList.toggle('active', matches);
        btn.setAttribute('aria-checked', matches ? 'true' : 'false');
      });
    }

    toggleTheme() {
      this.applyTheme(this.theme === 'dark' ? 'light' : 'dark');
      this.saveStats();
    }

    applyTheme(theme) {
      this.theme = theme;
      document.documentElement.setAttribute('data-theme', theme);
      this.renderer.setTheme(theme);

      const isDark = theme === 'dark';
      document.getElementById('theme-icon').textContent = isDark ? '☀️' : '🌙';
      document.getElementById('theme-text').textContent = isDark ? 'Light' : 'Dark';
      document.getElementById('modal-theme-icon').textContent = isDark ? '☀️' : '🌙';
      document.getElementById('modal-theme-label').textContent = isDark ? 'Light Mode' : 'Dark Mode';
    }

    openMenu() {
      if (this.isMultiplayer && this.mpManager) {
        this.mpManager.leaveRoom();
        return;
      }
      this.isMultiplayer = false;
      this.phase = 'menu';
      this.isPaused = false;
      this.botSeeker.active = false;
      this.topHud.classList.add('hidden');
      this.menuScreen.classList.remove('hidden');
      this.revealMenuOptions();
      this.resultModal.classList.add('hidden');
      this.pauseModal.classList.add('hidden');
      this.actionBar.classList.add('hidden');
      this.controlsFooter.classList.add('hidden');
      this.touchPad.classList.add('hidden');
      this.updateScoreUI();
    }

    startRound(role) {
      this.role = role;
      this.isPaused = false;
      this.proximityHint = null;
      this.apt.loadMap(this.selectedMapId);
      this.apt.resetSpots();

      this.menuScreen.classList.add('hidden');
      this.resultModal.classList.add('hidden');
      this.pauseModal.classList.add('hidden');
      this.topHud.classList.remove('hidden');
      this.controlsFooter.classList.remove('hidden');
      this.touchPad.classList.remove('hidden');
      this.actionBar.classList.remove('hidden');

      // Update difficulty tuning for this role
      const diffCfg = CFG.difficulties[this.selectedDifficulty];
      this.botSpeed = diffCfg.botSpeed;
      this.losMaxDist = diffCfg.losMaxDist;
      this.losConeHalfAngle = diffCfg.losConeHalfAngle;
      this.hearingRadius = diffCfg.hearingRadius;
      this.hintBands = diffCfg.hintBands;
      this.maxAttempts = role === 'seeker' ? diffCfg.maxAttemptsSeeker : diffCfg.maxAttemptsHider;
      this.attemptsLeft = this.maxAttempts;

      // Resize after HUD becomes visible so canvas fits exact stage dimensions
      this.renderer.resize();

      // Reset player at map spawn
      this.player.x = this.apt.spawn.x;
      this.player.y = this.apt.spawn.y;
      this.player.angle = -Math.PI / 2;
      this.player.isHidden = false;
      this.player.hiddenSpot = null;
      this.player.isMoving = false;
      this.nearestSpot = null;
      this.hasRelocatedDuringSeek = false;
      this.lastRelocateRoomId = null;

      // Reset bot seeker
      this.botSeeker.active = false;
      this.botSeeker.speed = this.botSpeed;
      this.botSeeker.checkedHistory = [];
      this.botSeeker.scanningSpotId = null;
      this.botSeeker.isAlerted = false;
      this.botSeeker.alertTimer = 0;
      this.botHiddenSpot = null;
      this.revealBotSpot = false;

      this.mapPill.textContent = this.apt.mapName.toUpperCase();
      this.mapPill.classList.remove('hidden');
      this.rolePill.classList.remove('hidden', 'seeker');
      this.phasePill.classList.remove('hidden');
      this.attemptsBox.classList.remove('hidden');
      this.btnTouchReady.classList.add('hidden');

      if (role === 'hider') {
        this.rolePill.textContent = 'ROLE: HIDER';
        this.phase = 'hider_move';
        this.phasePill.textContent = 'PICK A SPOT';
        this.attemptsLabel.textContent = 'BOT CHECKS';
        this.attemptsValue.textContent = `${this.maxAttempts} / ${this.maxAttempts}`;
        this.spaceLegend.textContent = 'Hide / Switch Spot';
        this.enterLegendWrap.classList.remove('hidden');
        this.btnReady.classList.add('hidden');
        this.showToast(`${this.apt.mapName}: Move with Arrow Keys & press SPACE to hide.`);
      } else {
        this.rolePill.textContent = 'ROLE: SEEKER';
        this.rolePill.classList.add('seeker');
        this.phase = 'seeker_hunt';
        this.phasePill.textContent = 'FIND THE BOT';
        this.attemptsLabel.textContent = 'ATTEMPTS LEFT';
        this.attemptsValue.textContent = `${this.attemptsLeft} / ${this.maxAttempts}`;
        this.spaceLegend.textContent = 'Search Spot';
        this.enterLegendWrap.classList.add('hidden');
        this.btnReady.classList.add('hidden');

        // Skill-based bot spot selection (weighted by stealth, avoiding identical consecutive spot)
        this.botHiddenSpot = this.pickSkillfulBotHidingSpot();
        this.lastBotHiddenSpotId = this.botHiddenSpot.id;

        this.showToast(`${this.apt.mapName}: Bot hidden! You have ${this.maxAttempts} attempts across ${this.apt.hidingSpots.length} spots.`);
      }
    }

    pickSkillfulBotHidingSpot() {
      const spots = this.apt.hidingSpots;
      const candidates = spots.length > 1 && this.lastBotHiddenSpotId
        ? spots.filter(s => s.id !== this.lastBotHiddenSpotId)
        : spots;

      let totalWeight = 0;
      for (const s of candidates) {
        totalWeight += (s.stealthWeight || 1.0);
      }

      let roll = Math.random() * totalWeight;
      for (const s of candidates) {
        roll -= (s.stealthWeight || 1.0);
        if (roll <= 0) return s;
      }
      return candidates[candidates.length - 1];
    }

    handleSpaceAction() {
      if (this.isMultiplayer) {
        this.handleMultiplayerSpaceAction();
        return;
      }

      if (this.role === 'hider') {
        if (this.phase === 'hider_move') {
          if (this.nearestSpot) {
            this.player.isHidden = true;
            this.player.hiddenSpot = this.nearestSpot;
            this.phase = 'hider_ready';
            this.phasePill.textContent = 'HIDDEN';
            this.btnReady.classList.remove('hidden');
            this.btnTouchReady.classList.remove('hidden');
            Sound.playHide();
            this.showToast(`Hidden: ${this.nearestSpot.name}. Press Ready when set.`);
          } else {
            this.showToast('Move closer to an object first.');
          }
        } else if (this.phase === 'hider_ready') {
          this.player.isHidden = false;
          this.player.hiddenSpot = null;
          this.phase = 'hider_move';
          this.phasePill.textContent = 'PICK A SPOT';
          this.btnReady.classList.add('hidden');
          this.btnTouchReady.classList.add('hidden');
          Sound.playUnhide();
        } else if (this.phase === 'bot_seeking') {
          if (this.player.isHidden && this.player.hiddenSpot) {
            const prevRoomId = this.player.hiddenSpot.roomId;
            this.player.x = this.player.hiddenSpot.ix;
            this.player.y = this.player.hiddenSpot.iy;
            this.player.isHidden = false;
            this.player.hiddenSpot = null;
            this.hasRelocatedDuringSeek = true;
            this.lastRelocateRoomId = prevRoomId;
            this.nearestSpot = this.apt.getNearestSpot(this.player.x, this.player.y);
            this.phasePill.textContent = 'EXPOSED';
            Sound.playUnhide();
            this.scheduleBotRecheck(prevRoomId);
            this.showToast('Left spot mid-search! Find a new hiding place quickly.');
          } else if (!this.player.isHidden && this.nearestSpot) {
            this.player.isHidden = true;
            this.player.hiddenSpot = this.nearestSpot;
            this.hasRelocatedDuringSeek = true;
            this.lastRelocateRoomId = this.nearestSpot.roomId;
            this.phasePill.textContent = 'RELOCATED';
            Sound.playHide();
            this.scheduleBotRecheck(this.nearestSpot.roomId);
            this.showToast(`Switched to ${this.nearestSpot.name}.`);
          } else if (!this.player.isHidden) {
            this.showToast('Move close to an object and press SPACE to hide.');
          }
        }
      } else if (this.role === 'seeker' && this.phase === 'seeker_hunt') {
        if (!this.nearestSpot) {
          this.showToast('Move near an object and press SPACE to search.');
          return;
        }

        this.inspectSpotAsSeeker(this.nearestSpot);
      }
    }

    handleMultiplayerSpaceAction() {
      const me = this.mpManager ? this.mpManager.players.find(p => p.id === this.mpManager.localPlayerId) : null;
      if (!me || me.eliminated) return;

      if (this.role === 'hider') {
        if (this.player.isHidden && this.player.hiddenSpot) {
          // Unhide / Exit spot
          this.player.x = this.player.hiddenSpot.ix;
          this.player.y = this.player.hiddenSpot.iy;
          this.player.isHidden = false;
          this.player.hiddenSpot = null;
          this.hasRelocatedDuringSeek = true;
          this.nearestSpot = this.apt.getNearestSpot(this.player.x, this.player.y);
          this.phasePill.textContent = 'EXPOSED';
          Sound.playUnhide();
          this.showToast('Left hiding spot! Relocating...');
        } else if (!this.player.isHidden && this.nearestSpot) {
          // Hide in nearest spot
          this.player.isHidden = true;
          this.player.hiddenSpot = this.nearestSpot;
          this.hasRelocatedDuringSeek = true;
          this.phasePill.textContent = 'HIDDEN';
          Sound.playHide();
          this.showToast(`Hidden in ${this.nearestSpot.name}.`);
        } else if (!this.player.isHidden) {
          this.showToast('Move close to an object and press SPACE to hide.');
        }
      } else if (this.role === 'seeker') {
        if (this.phase === 'mp_hiding_countdown') {
          this.showToast('Hunters must wait for the 25-second hiding phase to end!');
          return;
        }
        if (!this.nearestSpot) {
          this.showToast('Move near an object and press SPACE to inspect.');
          return;
        }
        if (this.mpManager) {
          this.mpManager.sendSeekerSearch(this.nearestSpot.id);
        }
      }
    }

    inspectSpotAsSeeker(spot) {
      const wasChecked = spot.checked;
      this.attemptsLeft--;
      this.attemptsValue.textContent = `${this.attemptsLeft} / ${this.maxAttempts}`;

      if (spot.id === this.botHiddenSpot.id) {
        this.revealBotSpot = true;
        const bonus = this.attemptsLeft * CFG.pointsSeekerBonusPerAttempt;
        const gained = CFG.pointsWinBase + bonus;
        this.endRound(
          true,
          'You Found the Bot',
          `Caught the Bot hiding ${spot.name} (${spot.roomName}) with ${this.attemptsLeft} attempt(s) left.`,
          gained
        );
        return;
      }

      spot.checked = true;
      Sound.playEmpty();

      // Proximity distance feedback (Hot / Warm / Cool)
      const dist = Math.hypot(spot.ix - this.botHiddenSpot.ix, spot.iy - this.botHiddenSpot.iy);
      let hintText = 'COOL (Far Away)';
      let hintType = 'cool';

      if (dist <= CFG.hintDistances.hot) {
        hintText = 'HOT (Very Close!)';
        hintType = 'hot';
      } else if (dist <= CFG.hintDistances.warm && this.hintBands.includes('warm')) {
        hintText = 'WARM (Nearby)';
        hintType = 'warm';
      }

      this.proximityHint = {
        text: hintText,
        type: hintType,
        x: spot.ix,
        y: spot.iy,
        timer: 80
      };

      if (this.attemptsLeft <= 0) {
        this.revealBotSpot = true;
        this.endRound(
          false,
          'Out of Attempts',
          `You searched ${this.maxAttempts} spots and missed the Bot. It was hiding ${this.botHiddenSpot.name} (${this.botHiddenSpot.roomName}).`,
          CFG.pointsCaughtPenalty
        );
      } else {
        const prefix = wasChecked ? 'Still empty!' : 'Empty!';
        this.showToast(`${prefix} [${hintText}] Nothing ${spot.name}. (${this.attemptsLeft} left)`);
      }
    }

    confirmHiderReady() {
      if (this.isMultiplayer) {
        if (this.mpManager) this.mpManager.sendHiderReady();
        this.btnReady.classList.add('hidden');
        this.btnTouchReady.classList.add('hidden');
        this.showToast('Ready locked in! Waiting for other hiders or timer.');
        return;
      }

      this.phase = 'bot_seeking';
      this.hasRelocatedDuringSeek = false;
      this.lastRelocateRoomId = null;
      this.phasePill.textContent = 'SEEKER HUNTING';
      this.btnReady.classList.add('hidden');
      this.btnTouchReady.classList.add('hidden');
      Sound.playReady();

      const chosenSpots = this.pickBotSearchSpots(this.maxAttempts);

      this.botSeeker.active = true;
      this.botSeeker.speed = this.botSpeed;
      this.botSeeker.x = this.apt.botSpawn.x;
      this.botSeeker.y = this.apt.botSpawn.y;
      this.botSeeker.angle = -Math.PI / 2;
      this.botSeeker.targets = chosenSpots;
      this.botSeeker.checkedHistory = [];
      this.botSeeker.currentTargetIndex = 0;
      this.botSeeker.scanningSpotId = null;
      this.botSeeker.scanTimer = 0;
      this.botSeeker.stuckTimer = 0;
      this.botSeeker.stuckTimerMs = 0;
      this.botSeeker.stuckFrames = 0;
      this.botSeeker.stuckOriginX = this.botSeeker.x;
      this.botSeeker.stuckOriginY = this.botSeeker.y;
      this.botSeeker.isAlerted = false;
      this.botSeeker.alertTimer = 0;
      this.botSeeker.waypoints = this.apt.findPathToSpot(this.botSeeker.x, this.botSeeker.y, chosenSpots[0]);
      this.botSeeker.waypointIndex = 0;

      this.attemptsValue.textContent = `${this.maxAttempts} / ${this.maxAttempts}`;
      this.showToast(`Seeker entered! Stay still for +${CFG.pointsUnmovedBonus} bonus, or press SPACE to relocate.`);
    }

    pickBotSearchSpots(count) {
      const byRoom = {};
      for (const s of this.apt.hidingSpots) {
        if (!byRoom[s.roomId]) byRoom[s.roomId] = [];
        byRoom[s.roomId].push(s);
      }

      const roomIds = Object.keys(byRoom);
      for (let i = roomIds.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [roomIds[i], roomIds[j]] = [roomIds[j], roomIds[i]];
      }

      const orderedCandidates = [];
      const queuedIds = new Set();

      for (const rid of roomIds) {
        const roomPool = [...byRoom[rid]];
        roomPool.sort((a, b) => (b.stealthWeight * (0.6 + Math.random())) - (a.stealthWeight * (0.6 + Math.random())));
        const checksInRoom = Math.min(roomPool.length, 2 + (Math.random() < 0.45 ? 1 : 0));

        for (let k = 0; k < checksInRoom; k++) {
          orderedCandidates.push(roomPool[k]);
          queuedIds.add(roomPool[k].id);
        }
      }

      const remaining = this.apt.hidingSpots.filter(s => !queuedIds.has(s.id));
      while (remaining.length > 0) {
        const idx = Math.floor(Math.random() * remaining.length);
        orderedCandidates.push(remaining.splice(idx, 1)[0]);
      }

      const selected = [];
      let cursor = 0;

      while (selected.length < count) {
        const prevSpot = selected[selected.length - 1];
        const recheckPool = selected.filter(s => !prevSpot || s.id !== prevSpot.id);

        if (selected.length >= 2 && recheckPool.length > 0 && (cursor >= orderedCandidates.length || Math.random() < CFG.botRecheckChance)) {
          let totalWeight = 0;
          for (const s of recheckPool) totalWeight += (s.stealthWeight || 1);
          let roll = Math.random() * totalWeight;
          let picked = recheckPool[recheckPool.length - 1];
          for (const s of recheckPool) {
            roll -= (s.stealthWeight || 1);
            if (roll <= 0) {
              picked = s;
              break;
            }
          }
          selected.push(picked);
        } else if (cursor < orderedCandidates.length) {
          selected.push(orderedCandidates[cursor++]);
        } else {
          const allSpots = this.apt.hidingSpots;
          selected.push(allSpots[Math.floor(Math.random() * allSpots.length)]);
        }
      }

      return selected;
    }

    pickWeightedRecheckCandidate(pool, currentSpotId, preferredRoomId) {
      const filtered = pool.filter(s => s.id !== currentSpotId);
      if (filtered.length === 0) return null;

      let totalWeight = 0;
      const weights = filtered.map(s => {
        let w = s.stealthWeight || 1;
        if (preferredRoomId && s.roomId === preferredRoomId) w *= 3.5;
        totalWeight += w;
        return w;
      });

      let roll = Math.random() * totalWeight;
      for (let i = 0; i < filtered.length; i++) {
        roll -= weights[i];
        if (roll <= 0) return filtered[i];
      }
      return filtered[filtered.length - 1];
    }

    scheduleBotRecheck(activityRoomId) {
      const bot = this.botSeeker;
      if (this.role !== 'hider' || this.phase !== 'bot_seeking' || !bot.active) return;
      if (!bot.checkedHistory || bot.checkedHistory.length === 0) return;

      const nextIdx = bot.currentTargetIndex + 1;
      if (nextIdx >= bot.targets.length) return;

      const currentSpot = bot.targets[bot.currentTargetIndex];
      const currentId = currentSpot ? currentSpot.id : null;
      const alreadyQueued = new Set(bot.targets.slice(nextIdx, nextIdx + 2).map(s => s.id));
      const candidates = bot.checkedHistory.filter(s => s.id !== currentId && !alreadyQueued.has(s.id));
      const chosen = this.pickWeightedRecheckCandidate(
        candidates.length > 0 ? candidates : bot.checkedHistory,
        currentId,
        activityRoomId
      );
      if (!chosen) return;

      bot.targets[nextIdx] = chosen;
    }

    endRound(won, title, desc, delta) {
      this.phase = 'ended';
      this.isPaused = false;
      this.stats.score = Math.max(0, this.stats.score + delta);
      if (won) {
        this.stats.wins++;
        Sound.playWin();
      } else {
        this.stats.losses++;
        Sound.playLose();
      }
      this.saveStats();
      this.updateScoreUI();

      const badge = document.getElementById('result-badge');
      badge.textContent = won ? 'VICTORY' : 'CAUGHT';
      badge.className = `result-badge ${won ? 'win' : 'lose'}`;

      document.getElementById('result-title').textContent = title;
      document.getElementById('result-desc').textContent = desc;

      const deltaEl = document.getElementById('result-delta');
      deltaEl.textContent = delta >= 0 ? `+${delta}` : `${delta}`;
      deltaEl.className = delta >= 0 ? 'positive' : 'negative';

      document.getElementById('result-total').textContent = this.stats.score;

      setTimeout(() => {
        if (this.phase === 'ended') {
          this.resultModal.classList.remove('hidden');
        }
      }, 550);
    }

    updateScoreUI() {
      this.scoreValue.textContent = this.stats.score;
      this.winsValue.textContent = this.stats.wins;
      this.menuScore.textContent = this.stats.score;
      this.menuWins.textContent = this.stats.wins;
      this.menuLosses.textContent = this.stats.losses;
    }

    showToast(msg) {
      this.statusToast.textContent = msg;
      this.statusToast.classList.remove('hidden');
      clearTimeout(this.toastTimeout);
      this.toastTimeout = setTimeout(() => {
        this.statusToast.classList.add('hidden');
      }, 2800);
    }

    loop(now) {
      const dt = Math.min(32, now - this.lastTime) / 16.67;
      this.lastTime = now;

      if (!this.isPaused) {
        this.update(dt);
      }

      this.renderer.render({
        role: this.role,
        phase: this.phase,
        player: this.player,
        nearestSpot: this.nearestSpot,
        botSeeker: this.botSeeker,
        botHiddenSpot: this.botHiddenSpot,
        revealBotSpot: this.revealBotSpot,
        proximityHint: this.proximityHint,
        isMultiplayer: this.isMultiplayer,
        mpPlayers: this.mpManager ? this.mpManager.players : null,
        mpLocalId: this.mpManager ? this.mpManager.localPlayerId : null,
        mpPhase: this.mpManager ? this.mpManager.phase : null,
        mpRole: this.role
      });

      requestAnimationFrame((t) => this.loop(t));
    }

    update(dt) {
      if (this.proximityHint && this.proximityHint.timer > 0) {
        this.proximityHint.timer -= dt;
        if (this.proximityHint.timer <= 0) this.proximityHint = null;
      }

      if (this.isMultiplayer) {
        if (this.phase === 'mp_hiding_countdown' || this.phase === 'mp_hunting') {
          this.updatePlayerMovement(dt);
          this.updateInteractionPrompt();
        }
        return;
      }

      if (this.phase === 'hider_move' || this.phase === 'seeker_hunt') {
        this.updatePlayerMovement(dt);
        this.updateInteractionPrompt();
      } else if (this.phase === 'hider_ready') {
        this.updateInteractionPrompt();
      } else if (this.phase === 'bot_seeking') {
        if (!this.player.isHidden) {
          this.updatePlayerMovement(dt);
        } else {
          this.player.isMoving = false;
        }
        this.updateInteractionPrompt();
        this.updateBotSeeker(dt);
      }
    }

    updatePlayerMovement(dt) {
      if (this.isMultiplayer) {
        const me = this.mpManager ? this.mpManager.players.find(p => p.id === this.mpManager.localPlayerId) : null;
        if (me && me.eliminated) {
          this.player.isMoving = false;
          return;
        }
        if (this.role === 'seeker' && this.phase === 'mp_hiding_countdown') {
          this.player.isMoving = false;
          return;
        }
      }

      let dx = 0;
      let dy = 0;

      if (this.keys['ArrowLeft'] || this.keys['KeyA']) dx -= 1;
      if (this.keys['ArrowRight'] || this.keys['KeyD']) dx += 1;
      if (this.keys['ArrowUp'] || this.keys['KeyW']) dy -= 1;
      if (this.keys['ArrowDown'] || this.keys['KeyS']) dy += 1;

      if (dx !== 0 || dy !== 0) {
        const len = Math.hypot(dx, dy);
        dx = (dx / len) * this.player.speed * dt;
        dy = (dy / len) * this.player.speed * dt;

        const nextPos = this.apt.resolveMovement(this.player.x, this.player.y, this.player.radius, dx, dy);
        this.player.x = nextPos.x;
        this.player.y = nextPos.y;
        this.player.angle = Math.atan2(dy, dx);
        this.player.isMoving = true;

        const currentRoom = this.apt.getRoomAt(this.player.x, this.player.y);
        Sound.playStep(currentRoom ? currentRoom.floor : 'wood', false);

        // Alert Bot if player moves unhidden within Hearing Radius
        if (this.role === 'hider' && this.phase === 'bot_seeking' && this.botSeeker.active && !this.player.isHidden) {
          const distToBot = Math.hypot(this.player.x - this.botSeeker.x, this.player.y - this.botSeeker.y);
          const hasLOS = this.apt.hasLineOfSight(this.player.x, this.player.y, this.botSeeker.x, this.botSeeker.y);
          const effectiveRadius = hasLOS ? this.hearingRadius : this.hearingRadius * 0.65;

          if (distToBot < effectiveRadius && (!this.botSeeker.isAlerted || this.botSeeker.alertTimer <= 0)) {
            this.botSeeker.isAlerted = true;
            this.botSeeker.alertTimer = 65; // ~1.1s alert pause with '?'
            Sound.playAlert();
            this.botSeeker.angle = Math.atan2(this.player.y - this.botSeeker.y, this.player.x - this.botSeeker.x);

            const nearest = this.apt.getNearestSpot(this.player.x, this.player.y);
            if (nearest) {
              this.botSeeker.targets.splice(this.botSeeker.currentTargetIndex + 1, 0, nearest);
            }
            this.showToast('The Seeker heard your footsteps!');
          }
        }
      } else {
        this.player.isMoving = false;
      }

      this.nearestSpot = this.apt.getNearestSpot(this.player.x, this.player.y);
    }

    updateInteractionPrompt() {
      if (this.isMultiplayer) {
        const me = this.mpManager ? this.mpManager.players.find(p => p.id === this.mpManager.localPlayerId) : null;
        if (!me || me.eliminated) {
          this.interactionPrompt.classList.add('hidden');
          return;
        }

        if (this.role === 'hider') {
          if (this.player.isHidden && this.player.hiddenSpot) {
            this.interactionPrompt.classList.remove('hidden');
            this.promptText.textContent = `Exit ${this.player.hiddenSpot.name} to Switch`;
          } else if (!this.player.isHidden && this.nearestSpot) {
            this.interactionPrompt.classList.remove('hidden');
            this.promptText.textContent = `Hide: ${this.nearestSpot.name}`;
          } else {
            this.interactionPrompt.classList.add('hidden');
          }
        } else if (this.role === 'seeker') {
          if (this.phase === 'mp_hiding_countdown') {
            this.interactionPrompt.classList.add('hidden');
          } else if (this.nearestSpot) {
            this.interactionPrompt.classList.remove('hidden');
            const isChecked = this.mpManager && this.mpManager.checkedSpots.includes(this.nearestSpot.id);
            this.promptText.textContent = isChecked
              ? `Re-check: ${this.nearestSpot.name}`
              : `Search: ${this.nearestSpot.name}`;
          } else {
            this.interactionPrompt.classList.add('hidden');
          }
        }
        return;
      }

      if (this.role === 'hider') {
        if (this.phase === 'hider_ready' && this.player.hiddenSpot) {
          this.interactionPrompt.classList.remove('hidden');
          this.promptText.textContent = `Leave ${this.player.hiddenSpot.name}`;
        } else if (this.phase === 'bot_seeking') {
          if (this.player.isHidden && this.player.hiddenSpot) {
            this.interactionPrompt.classList.remove('hidden');
            this.promptText.textContent = `Exit ${this.player.hiddenSpot.name} to Switch`;
          } else if (!this.player.isHidden && this.nearestSpot) {
            this.interactionPrompt.classList.remove('hidden');
            this.promptText.textContent = `Hide: ${this.nearestSpot.name}`;
          } else {
            this.interactionPrompt.classList.add('hidden');
          }
        } else if (this.nearestSpot) {
          this.interactionPrompt.classList.remove('hidden');
          this.promptText.textContent = `Hide: ${this.nearestSpot.name}`;
        } else {
          this.interactionPrompt.classList.add('hidden');
        }
      } else if (this.role === 'seeker' && this.phase === 'seeker_hunt') {
        if (this.nearestSpot) {
          this.interactionPrompt.classList.remove('hidden');
          this.promptText.textContent = this.nearestSpot.checked
            ? `Re-check: ${this.nearestSpot.name}`
            : `Search: ${this.nearestSpot.name}`;
        } else {
          this.interactionPrompt.classList.add('hidden');
        }
      }
    }

    checkSeekerLineOfSight() {
      if (this.player.isHidden) return false;
      const bot = this.botSeeker;
      const dx = this.player.x - bot.x;
      const dy = this.player.y - bot.y;
      const dist = Math.hypot(dx, dy);

      if (dist > this.losMaxDist) return false;
      if (!this.apt.hasLineOfSight(bot.x, bot.y, this.player.x, this.player.y)) return false;

      if (dist < CFG.losInstantCatchDist) return true;

      const angleToPlayer = Math.atan2(dy, dx);
      let angleDiff = Math.abs(angleToPlayer - bot.angle);
      if (angleDiff > Math.PI) angleDiff = Math.PI * 2 - angleDiff;
      return angleDiff < this.losConeHalfAngle;
    }

    updateBotSeeker(dt) {
      const bot = this.botSeeker;
      if (!bot.active) return;

      // Hider-only proximity double-thump heartbeat
      if (this.role === 'hider' && this.phase === 'bot_seeking') {
        const distToPlayer = Math.hypot(this.player.x - bot.x, this.player.y - bot.y);
        if (distToPlayer < CFG.heartbeatMaxDist) {
          Sound.playHeartbeat(distToPlayer, CFG.heartbeatMaxDist);
        }
      }

      if (this.checkSeekerLineOfSight()) {
        this.endRound(
          false,
          'Spotted in the Open',
          'The Seeker caught sight of you moving out of cover before you could hide.',
          CFG.pointsCaughtPenalty
        );
        return;
      }

      // If Bot is in alerted state, pause and orient towards the noise
      if (bot.alertTimer > 0) {
        bot.alertTimer -= dt;
        bot.isMoving = false;
        if (bot.alertTimer <= 0) {
          bot.isAlerted = false;
          const nextTarget = bot.targets[bot.currentTargetIndex];
          if (nextTarget) {
            bot.waypoints = this.apt.findPathToSpot(bot.x, bot.y, nextTarget);
            bot.waypointIndex = 0;
          }
        }
        return;
      }

      const currentSpot = bot.targets[bot.currentTargetIndex];
      if (!currentSpot) return;

      if (bot.scanningSpotId) {
        bot.isMoving = false;
        bot.scanTimer -= dt;
        const targetAngle = Math.atan2(currentSpot.hideY - bot.y, currentSpot.hideX - bot.x);
        bot.angle = targetAngle + Math.sin(performance.now() * 0.015) * 0.25;

        if (bot.scanTimer <= 0) {
          bot.scanningSpotId = null;

          if (this.player.isHidden && this.player.hiddenSpot && currentSpot.id === this.player.hiddenSpot.id) {
            this.player.isHidden = false;
            this.endRound(
              false,
              'You Were Found',
              `The Seeker checked ${currentSpot.name} (${currentSpot.roomName}) and caught you hiding there.`,
              CFG.pointsCaughtPenalty
            );
            return;
          }

          // In Hider mode, do not lock spot.checked permanently so Bot can re-check spots
          if (!bot.checkedHistory.some(s => s.id === currentSpot.id)) {
            bot.checkedHistory.push(currentSpot);
          }
          Sound.playEmpty();

          const remaining = bot.targets.length - (bot.currentTargetIndex + 1);
          this.attemptsValue.textContent = `${remaining} / ${this.maxAttempts}`;

          bot.currentTargetIndex++;
          if (bot.currentTargetIndex >= bot.targets.length) {
            const stayedStillBonus = !this.hasRelocatedDuringSeek ? CFG.pointsUnmovedBonus : 0;
            const totalGain = CFG.pointsWinBase + stayedStillBonus;
            const desc = stayedStillBonus > 0
              ? `The Seeker searched ${this.maxAttempts} spots and missed you! You earned +${CFG.pointsUnmovedBonus} extra points for staying in your original spot.`
              : `The Seeker searched ${this.maxAttempts} spots and missed you after you switched spots mid-search.`;

            this.endRound(true, 'You Outsmarted the Seeker', desc, totalGain);
            return;
          }

          let nextSpot = bot.targets[bot.currentTargetIndex];
          if (this.hasRelocatedDuringSeek && bot.checkedHistory.length >= 2) {
            const isNextAlreadyRecheck = bot.checkedHistory.some(s => s.id === nextSpot.id);
            if (!isNextAlreadyRecheck && Math.random() < CFG.botRecheckChance) {
              const recheck = this.pickWeightedRecheckCandidate(
                bot.checkedHistory,
                currentSpot.id,
                this.lastRelocateRoomId || currentSpot.roomId
              );
              if (recheck) {
                bot.targets[bot.currentTargetIndex] = recheck;
                nextSpot = recheck;
              }
            }
          }
          bot.waypoints = this.apt.findPathToSpot(bot.x, bot.y, nextSpot);
          bot.waypointIndex = 0;
          bot.stuckTimer = 0;
          bot.stuckTimerMs = 0;
          bot.stuckFrames = 0;
          bot.stuckOriginX = bot.x;
          bot.stuckOriginY = bot.y;
        }
        return;
      }

      // Smooth corner-cutting: skip intermediate waypoint early if line-of-clearance to next exists
      if (bot.waypointIndex + 1 < bot.waypoints.length) {
        const nextWp = bot.waypoints[bot.waypointIndex + 1];
        if (this.apt.hasWalkClearance(bot.x, bot.y, nextWp.x, nextWp.y, 9.5)) {
          bot.waypointIndex++;
        }
      }

      const wp = bot.waypoints[bot.waypointIndex];
      const distToSpotIx = Math.hypot(currentSpot.ix - bot.x, currentSpot.iy - bot.y);
      const distToSpotHide = Math.hypot(currentSpot.hideX - bot.x, currentSpot.hideY - bot.y);

      // If no more waypoints or bot has reached the spot directly, start scanning
      if (!wp || distToSpotIx < 28 || distToSpotHide < 36) {
        bot.scanningSpotId = currentSpot.id;
        bot.scanTimer = CFG.scanDuration;
        bot.stuckTimer = 0;
        bot.stuckTimerMs = 0;
        bot.stuckFrames = 0;
        Sound.playSpatialPing(bot.x, bot.y, this.player.x, this.player.y, this.apt);
        this.showToast(`Seeker checking ${currentSpot.name} (${currentSpot.roomName})...`);
        return;
      }

      const dx = wp.x - bot.x;
      const dy = wp.y - bot.y;
      const dist = Math.hypot(dx, dy);
      const isLastWp = (bot.waypointIndex === bot.waypoints.length - 1);
      const arrivalRadius = isLastWp ? 22 : 22;

      if (dist < arrivalRadius) {
        bot.waypointIndex++;
        bot.stuckTimer = 0;
        bot.stuckTimerMs = 0;
        bot.stuckFrames = 0;
        bot.stuckOriginX = bot.x;
        bot.stuckOriginY = bot.y;
      } else {
        const step = Math.min(dist, bot.speed * dt);
        const moveX = (dx / dist) * step;
        const moveY = (dy / dist) * step;
        const prevX = bot.x;
        const prevY = bot.y;

        // Collision radius reduced to 9.5 for smooth gliding through all doorways
        let resolved = this.apt.resolveMovement(bot.x, bot.y, 9.5, moveX, moveY);
        let moved = Math.hypot(resolved.x - prevX, resolved.y - prevY);

        // Slide along wall if forward path is partially blocked
        if (moved < step * 0.25) {
          const perpX = -moveY;
          const perpY = moveX;
          const slideA = this.apt.resolveMovement(bot.x, bot.y, 9.5, moveX * 0.5 + perpX * 0.85, moveY * 0.5 + perpY * 0.85);
          const slideB = this.apt.resolveMovement(bot.x, bot.y, 9.5, moveX * 0.5 - perpX * 0.85, moveY * 0.5 - perpY * 0.85);
          const movedA = Math.hypot(slideA.x - prevX, slideA.y - prevY);
          const movedB = Math.hypot(slideB.x - prevX, slideB.y - prevY);
          if (movedA >= movedB && movedA > moved) {
            resolved = slideA;
            moved = movedA;
          } else if (movedB > moved) {
            resolved = slideB;
            moved = movedB;
          }
        }

        bot.x = resolved.x;
        bot.y = resolved.y;
        bot.angle = Math.atan2(dy, dx);
        bot.isMoving = moved > 0.05;

        // Guaranteed Unstuck Fail-Safe: Max stuck duration strictly <= 0.35 seconds
        // Also tracks real displacement to detect corner oscillation and wall scraping
        bot.displacementTimer = (bot.displacementTimer || 0) + (dt * 0.01667);
        if (bot.displacementTimer >= 0.20) {
          const distDisplaced = Math.hypot(bot.x - (bot.lastTrackedX ?? bot.x), bot.y - (bot.lastTrackedY ?? bot.y));
          if (distDisplaced < 10) {
            bot.stuckTimer = (bot.stuckTimer || 0) + 0.20;
          } else {
            bot.stuckTimer = Math.max(0, (bot.stuckTimer || 0) - 0.12);
          }
          bot.lastTrackedX = bot.x;
          bot.lastTrackedY = bot.y;
          bot.displacementTimer = 0;
        }

        if (moved < 0.35 * step) {
          bot.stuckTimer = (bot.stuckTimer || 0) + (dt * 0.01667);
        }

        if (bot.stuckTimer >= 0.35) {
          // If already in the general vicinity of the target spot (< 55px), trigger scan
          if (distToSpotIx < 55 || distToSpotHide < 55 || isLastWp) {
            bot.scanningSpotId = currentSpot.id;
            bot.scanTimer = CFG.scanDuration;
            bot.stuckTimer = 0;
            bot.waypoints = [];
            bot.waypointIndex = 0;
            Sound.playSpatialPing(bot.x, bot.y, this.player.x, this.player.y, this.apt);
            return;
          }

          // Hard recovery: snap smoothly to closest valid corridor node and re-path
          const closestNodeId = this.apt.findClosestNode(bot.x, bot.y);
          const node = closestNodeId ? this.apt.navNodes[closestNodeId] : null;
          if (node) {
            bot.x = node.x;
            bot.y = node.y;
          }
          if (bot.waypointIndex + 1 < bot.waypoints.length) {
            bot.waypointIndex++;
          } else {
            bot.waypoints = this.apt.findPathToSpot(bot.x, bot.y, currentSpot);
            bot.waypointIndex = 0;
          }
          bot.stuckTimer = 0;
        } else if (bot.stuckTimer >= 0.16) {
          // Minor snag recovery: try skipping intermediate waypoint if close
          if (bot.waypointIndex + 1 < bot.waypoints.length) {
            const nextWp = bot.waypoints[bot.waypointIndex + 1];
            const dNext = Math.hypot(nextWp.x - bot.x, nextWp.y - bot.y);
            if (dNext < 80) {
              bot.waypointIndex++;
              bot.stuckTimer = 0;
            }
          }

          // Perpendicular sidestep nudge (90 degrees left or right relative to target direction)
          const nudgeDist = step * 2.5;
          const nudgeLeft = this.apt.resolveMovement(bot.x, bot.y, 9.5, (-dy / dist) * nudgeDist, (dx / dist) * nudgeDist);
          const nudgeRight = this.apt.resolveMovement(bot.x, bot.y, 9.5, (dy / dist) * nudgeDist, (-dx / dist) * nudgeDist);
          const distLeft = Math.hypot(nudgeLeft.x - prevX, nudgeLeft.y - prevY);
          const distRight = Math.hypot(nudgeRight.x - prevX, nudgeRight.y - prevY);

          if (distLeft >= distRight && distLeft > 0.25) {
            bot.x = nudgeLeft.x;
            bot.y = nudgeLeft.y;
          } else if (distRight > 0.25) {
            bot.x = nudgeRight.x;
            bot.y = nudgeRight.y;
          }
        }

        const botRoom = this.apt.getRoomAt(bot.x, bot.y);
        Sound.playSpatialStep(botRoom ? botRoom.floor : 'wood', bot.x, bot.y, this.player.x, this.player.y, this.apt);
      }
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    new PeekkoGame();
  });
})();
