// frontend/src/utils/soundEffects.js

class SoundManager {
  constructor() {
    this.audioCtx = null;
    this.isMuted = localStorage.getItem('bluffhunt_muted') === 'true';
  }

  getAudioContext() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem('bluffhunt_muted', String(this.isMuted));
    return this.isMuted;
  }

  getMuted() {
    return this.isMuted;
  }

  // Play a simple synthesized frequency with envelope
  playTone(frequency, type = 'sine', duration = 0.2, gainValue = 0.15) {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);

      gain.gain.setValueAtTime(gainValue, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Ignore audio context errors gracefully
    }
  }

  // Turn alert chime (pleasant high two-tone)
  playTurnChime() {
    if (this.isMuted) return;
    this.playTone(587.33, 'triangle', 0.15, 0.2); // D5
    setTimeout(() => {
      this.playTone(880.0, 'sine', 0.35, 0.25); // A5
    }, 120);
    this.vibrate([80, 40, 80]);
  }

  // Reveal secret word dramatic tension sweep
  playRevealSound() {
    if (this.isMuted) return;
    this.playTone(329.63, 'sine', 0.3, 0.2); // E4
    setTimeout(() => {
      this.playTone(493.88, 'triangle', 0.45, 0.2); // B4
    }, 150);
    this.vibrate(100);
  }

  // Vote confirmation ding
  playVoteSound() {
    if (this.isMuted) return;
    this.playTone(523.25, 'sine', 0.15, 0.2); // C5
    setTimeout(() => {
      this.playTone(659.25, 'sine', 0.25, 0.2); // E5
    }, 100);
    this.vibrate(50);
  }

  // Imposter Caught fanfare (Major chord progression)
  playImposterCaughtSound() {
    if (this.isMuted) return;
    this.playTone(440.0, 'triangle', 0.2, 0.2); // A4
    setTimeout(() => this.playTone(554.37, 'triangle', 0.2, 0.2), 150); // C#5
    setTimeout(() => this.playTone(659.25, 'triangle', 0.2, 0.2), 300); // E5
    setTimeout(() => this.playTone(880.0, 'sine', 0.5, 0.3), 450); // A5
    this.vibrate([100, 50, 100, 50, 200]);
  }

  // Imposter Escaped sound (Sneaky descending tone)
  playImposterEscapedSound() {
    if (this.isMuted) return;
    this.playTone(500, 'sawtooth', 0.2, 0.15);
    setTimeout(() => this.playTone(420, 'sawtooth', 0.25, 0.15), 180);
    setTimeout(() => this.playTone(330, 'sawtooth', 0.45, 0.15), 360);
    this.vibrate([150, 100, 250]);
  }

  // Native mobile vibration helper
  vibrate(pattern) {
    if (typeof window !== 'undefined' && 'navigator' in window && navigator.vibrate) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Vibration not allowed or supported
      }
    }
  }
}

export const soundEffects = new SoundManager();
