/* ========================================================
   Peekko - Central Game Configuration
   Tuning parameters for difficulty, gameplay, physics & multiplayer
   ======================================================== */

const PEEKKO_CONFIG = Object.freeze({
  version: '7.0',
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
  },
  multiplayer: {
    hidingPhaseSeconds: 25,
    minPlayers: 2,
    maxPlayers: 5,
    defaultAttempts: 10,
    allowedAttempts: [7, 10, 15, 20],
    hiderPalette: ['#38bdf8', '#10b981', '#a855f7', '#ec4899', '#f43f5e'],
    seekerColor: '#f59e0b',
    syncHz: 25
  }
});

if (typeof window !== 'undefined') {
  window.PEEKKO_CONFIG = PEEKKO_CONFIG;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PEEKKO_CONFIG;
}
