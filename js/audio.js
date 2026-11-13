/* ========================================================
   Peekko - Web Audio Sound Effects Engine
   Realistic Footsteps (Wood / Tile), Spatial Audio,
   Master Volume, Proximity Heartbeat & Stealth Cues
   ======================================================== */

class SoundManager {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.masterVolume = 0.75;
    this.muted = false;
    this.lastPlayerStepTime = 0;
    this.lastBotStepTime = 0;
    this.lastHeartbeatTime = 0;
    this.stepToggle = false;
    this.noiseBuffer = null;
  }

  init() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return;
    }
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.muted ? 0 : this.masterVolume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Pre-generate short white noise buffer for crisp footstep textures
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.08);
      this.noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = this.noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.28));
      }
    }
  }

  setVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, Number(volume) || 0));
    if (this.ctx && this.masterGain && !this.muted) {
      this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.ctx && this.masterGain) {
      const target = this.muted ? 0 : this.masterVolume;
      this.masterGain.gain.setValueAtTime(target, this.ctx.currentTime);
    }
    return this.muted;
  }

  _routeOutput(sourceNode, pan = 0, muffle = false) {
    if (!this.ctx || !this.masterGain) return sourceNode;
    let node = sourceNode;

    // Optional wall muffling lowpass filter
    if (muffle) {
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(380, this.ctx.currentTime);
      filter.Q.value = 1.0;
      node.connect(filter);
      node = filter;
    }

    // Stereo panning
    if (this.ctx.createStereoPanner && typeof pan === 'number' && pan !== 0) {
      const panner = this.ctx.createStereoPanner();
      panner.pan.setValueAtTime(Math.max(-1, Math.min(1, pan)), this.ctx.currentTime);
      node.connect(panner);
      panner.connect(this.masterGain);
      return panner;
    }

    node.connect(this.masterGain);
    return node;
  }

  playTone(freq, type = 'sine', duration = 0.12, volume = 0.15, endFreq = null) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (endFreq !== null) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), now + duration);
    }

    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(this.masterGain || this.ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  playStep(surface = 'wood', isBot = false) {
    if (this.muted) return;
    const nowMs = performance.now();
    const interval = isBot ? 280 : 210;
    if (isBot) {
      if (nowMs - this.lastBotStepTime < interval) return;
      this.lastBotStepTime = nowMs;
    } else {
      if (nowMs - this.lastPlayerStepTime < interval) return;
      this.lastPlayerStepTime = nowMs;
    }

    this.init();
    if (!this.ctx) return;

    this.stepToggle = !this.stepToggle;
    const now = this.ctx.currentTime;
    const pitchShift = this.stepToggle ? 1.0 : 0.91;
    const isTile = surface && surface.includes('tile');
    const vol = isBot ? 0.08 : 0.13;

    // 1. Soft heel thump (low-frequency body)
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    const baseFreq = (isTile ? 165 : 125) * pitchShift;
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(42, now + 0.065);
    oscGain.gain.setValueAtTime(vol, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
    osc.connect(oscGain);
    oscGain.connect(this.masterGain || this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.075);

    // 2. Filtered shoe tap noise burst
    if (this.noiseBuffer) {
      const noise = this.ctx.createBufferSource();
      noise.buffer = this.noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = (isTile ? 1450 : 780) * pitchShift;
      filter.Q.value = isTile ? 2.4 : 1.4;

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(vol * 0.75, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.055);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.masterGain || this.ctx.destination);
      noise.start(now);
    }
  }

  playSpatialStep(surface, botX, botY, playerX, playerY, apt) {
    if (this.muted) return;
    const nowMs = performance.now();
    if (nowMs - this.lastBotStepTime < 280) return;
    this.lastBotStepTime = nowMs;

    this.init();
    if (!this.ctx) return;

    const dx = botX - playerX;
    const dy = botY - playerY;
    const dist = Math.hypot(dx, dy);
    const maxHearingDist = 650;
    if (dist > maxHearingDist) return;

    const attenuation = Math.max(0.05, 1 - dist / maxHearingDist);
    const hasLOS = apt && typeof apt.hasLineOfSight === 'function' ? apt.hasLineOfSight(playerX, playerY, botX, botY) : true;
    const muffle = !hasLOS;
    const pan = Math.max(-1, Math.min(1, dx / 400));

    this.stepToggle = !this.stepToggle;
    const now = this.ctx.currentTime;
    const pitchShift = this.stepToggle ? 1.0 : 0.91;
    const isTile = surface && surface.includes('tile');
    const baseVol = (isTile ? 0.09 : 0.075) * attenuation * (muffle ? 0.6 : 1.0);

    // Heel thump
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    const baseFreq = (isTile ? 165 : 125) * pitchShift;
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(42, now + 0.065);
    oscGain.gain.setValueAtTime(baseVol, now);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);
    osc.connect(oscGain);
    this._routeOutput(oscGain, pan, muffle);
    osc.start(now);
    osc.stop(now + 0.075);

    // Shoe tap noise burst
    if (this.noiseBuffer && !muffle) {
      const noise = this.ctx.createBufferSource();
      noise.buffer = this.noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = (isTile ? 1450 : 780) * pitchShift;
      filter.Q.value = isTile ? 2.4 : 1.4;

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(baseVol * 0.7, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.055);

      noise.connect(filter);
      filter.connect(noiseGain);
      this._routeOutput(noiseGain, pan, false);
      noise.start(now);
    }
  }

  playSpatialPing(botX, botY, playerX, playerY, apt) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const dx = botX - playerX;
    const dy = botY - playerY;
    const dist = Math.hypot(dx, dy);
    const maxHearingDist = 700;
    if (dist > maxHearingDist) return;

    const attenuation = Math.max(0.1, 1 - dist / maxHearingDist);
    const hasLOS = apt && typeof apt.hasLineOfSight === 'function' ? apt.hasLineOfSight(playerX, playerY, botX, botY) : true;
    const muffle = !hasLOS;
    const pan = Math.max(-1, Math.min(1, dx / 400));

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(540, now);
    osc.frequency.exponentialRampToValueAtTime(480, now + 0.14);

    gain.gain.setValueAtTime(0.11 * attenuation * (muffle ? 0.6 : 1.0), now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(gain);
    this._routeOutput(gain, pan, muffle);

    osc.start(now);
    osc.stop(now + 0.16);
  }

  playAlert() {
    if (this.muted) return;
    this.playTone(320, 'sine', 0.12, 0.14, 520);
  }

  playHide() {
    this.playTone(210, 'sine', 0.14, 0.13, 350);
  }

  playUnhide() {
    this.playTone(350, 'sine', 0.13, 0.12, 195);
  }

  playReady() {
    this.playTone(440, 'triangle', 0.1, 0.14);
    setTimeout(() => this.playTone(660, 'triangle', 0.18, 0.16), 90);
  }

  playSearchPing() {
    this.playTone(540, 'sine', 0.14, 0.1, 480);
  }

  playEmpty() {
    this.playTone(190, 'triangle', 0.14, 0.11, 130);
  }

  playWin() {
    [440, 554.37, 659.25, 880].forEach((f, idx) => {
      setTimeout(() => this.playTone(f, 'triangle', 0.25, 0.14), idx * 90);
    });
  }

  playLose() {
    [310, 260, 195].forEach((f, idx) => {
      setTimeout(() => this.playTone(f, 'sawtooth', 0.22, 0.12), idx * 120);
    });
  }

  _playHeartThump(delaySec, freqStart, freqEnd, gainPeak, durationSec) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime + delaySec;

    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freqStart, t);
    osc.frequency.exponentialRampToValueAtTime(freqEnd, t + durationSec);

    const sub = this.ctx.createOscillator();
    sub.type = 'triangle';
    sub.frequency.setValueAtTime(freqStart * 1.15, t);
    sub.frequency.exponentialRampToValueAtTime(freqEnd * 0.9, t + durationSec);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(135, t);
    filter.Q.value = 1.6;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(gainPeak, t + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + durationSec);

    osc.connect(filter);
    sub.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain || this.ctx.destination);

    osc.start(t);
    sub.start(t);
    osc.stop(t + durationSec + 0.02);
    sub.stop(t + durationSec + 0.02);
  }

  playHeartbeat(distance, maxDist = 230) {
    if (this.muted || distance >= maxDist) return;
    this.init();
    if (!this.ctx) return;

    const proximity = Math.max(0, Math.min(1, 1 - distance / maxDist));
    const intervalMs = 880 - proximity * 540; // ~880ms slow -> ~340ms frantic
    const now = performance.now();
    if (now - this.lastHeartbeatTime < intervalMs) return;
    this.lastHeartbeatTime = now;

    const vol = 0.04 + proximity * 0.24;
    // Double-thump "lub-dub"
    this._playHeartThump(0, 74, 38, vol, 0.12);
    this._playHeartThump(0.14 - proximity * 0.035, 62, 34, vol * 0.72, 0.10);
  }
}

const Sound = new SoundManager();

if (typeof window !== 'undefined') {
  window.Sound = Sound;
  window.SoundManager = SoundManager;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SoundManager, Sound };
}
