// frontend/src/utils/soundEffects.js

class SoundManager {
  constructor() {
    this.audioCtx = null;
    this.isMuted = false;

    if (typeof window !== 'undefined') {
      try {
        this.isMuted = localStorage.getItem('bluffhunt_muted') === 'true';
      } catch {
        this.isMuted = false;
      }

      // Early unlock listener: resumes or initializes AudioContext on the first user interaction
      const unlockAudio = () => {
        try {
          const ctx = this.getAudioContext();
          if (ctx && ctx.state === 'suspended') {
            ctx.resume().catch(() => {});
          }
        } catch {
          // ignore
        }
      };

      ['pointerdown', 'touchstart', 'click', 'keydown'].forEach((eventName) => {
        window.addEventListener(eventName, unlockAudio, { once: false, passive: true });
      });
    }
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
    try {
      localStorage.setItem('bluffhunt_muted', String(this.isMuted));
    } catch {
      // ignore
    }
    return this.isMuted;
  }

  getMuted() {
    return this.isMuted;
  }

  // Play a synthesized frequency with envelope
  playTone(frequency, type = 'sine', duration = 0.2, gainValue = 0.15) {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);

      gain.gain.setValueAtTime(gainValue, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Ignore audio context errors gracefully
    }
  }

  // Reveal secret word dramatic tension sweep
  playRevealSound() {
    if (this.isMuted) return;
    this.playTone(329.63, 'sine', 0.25, 0.22); // E4
    setTimeout(() => {
      this.playTone(493.88, 'triangle', 0.4, 0.22); // B4
    }, 120);
    this.vibrate(100);
  }
  playReveal() {
    this.playRevealSound();
  }

  // Turn alert chime (pleasant high two-tone alert)
  playTurnChime() {
    if (this.isMuted) return;
    this.playTone(587.33, 'triangle', 0.15, 0.22); // D5
    setTimeout(() => {
      this.playTone(880.0, 'sine', 0.35, 0.25); // A5
    }, 110);
    this.vibrate([80, 40, 80]);
  }
  playTurn() {
    this.playTurnChime();
  }

  // Ready to vote confirmation chime
  playReadySound() {
    if (this.isMuted) return;
    this.playTone(440.0, 'sine', 0.12, 0.18); // A4
    setTimeout(() => {
      this.playTone(554.37, 'sine', 0.12, 0.2); // C#5
    }, 90);
    setTimeout(() => {
      this.playTone(659.25, 'sine', 0.28, 0.24); // E5
    }, 180);
    this.vibrate(60);
  }

  // Vote confirmation ding (both aliases supported)
  playVoteSound() {
    if (this.isMuted) return;
    this.playTone(523.25, 'sine', 0.12, 0.22); // C5
    setTimeout(() => {
      this.playTone(783.99, 'sine', 0.3, 0.26); // G5
    }, 90);
    this.vibrate(50);
  }
  playVoteCast() {
    this.playVoteSound();
  }

  // Imposter Caught fanfare (Major chord progression, both aliases supported)
  playImposterCaughtSound() {
    if (this.isMuted) return;
    this.playTone(440.0, 'triangle', 0.18, 0.22); // A4
    setTimeout(() => this.playTone(554.37, 'triangle', 0.18, 0.22), 140); // C#5
    setTimeout(() => this.playTone(659.25, 'triangle', 0.2, 0.24), 280); // E5
    setTimeout(() => this.playTone(880.0, 'sine', 0.5, 0.3), 420); // A5
    this.vibrate([100, 50, 100, 50, 200]);
  }
  playImposterCaught() {
    this.playImposterCaughtSound();
  }

  // Imposter Escaped sound (Sneaky descending tone, both aliases supported)
  playImposterEscapedSound() {
    if (this.isMuted) return;
    this.playTone(520, 'sawtooth', 0.2, 0.15);
    setTimeout(() => this.playTone(440, 'sawtooth', 0.22, 0.15), 160);
    setTimeout(() => this.playTone(340, 'sawtooth', 0.45, 0.16), 340);
    this.vibrate([150, 100, 250]);
  }
  playImposterEscaped() {
    this.playImposterEscapedSound();
  }

  // Start next round / game fanfare
  playStartGameSound() {
    if (this.isMuted) return;
    this.playTone(392.0, 'sine', 0.12, 0.2); // G4
    setTimeout(() => this.playTone(523.25, 'sine', 0.12, 0.22), 100); // C5
    setTimeout(() => this.playTone(659.25, 'sine', 0.15, 0.24), 200); // E5
    setTimeout(() => this.playTone(1046.5, 'sine', 0.35, 0.26), 300); // C6
    this.vibrate([80, 50, 120]);
  }

  // Suspect selection tick
  playSelectSound() {
    if (this.isMuted) return;
    this.playTone(800, 'triangle', 0.05, 0.12);
  }

  // Mic toggle sound
  playMicToggleSound(isOn) {
    if (this.isMuted) return;
    if (isOn) {
      this.playTone(600, 'sine', 0.08, 0.15);
      setTimeout(() => this.playTone(800, 'sine', 0.1, 0.18), 70);
    } else {
      this.playTone(750, 'sine', 0.08, 0.15);
      setTimeout(() => this.playTone(500, 'sine', 0.1, 0.15), 70);
    }
  }

  // Tie alert
  playTieSound() {
    if (this.isMuted) return;
    this.playTone(350, 'sawtooth', 0.15, 0.18);
    setTimeout(() => this.playTone(440, 'sawtooth', 0.25, 0.2), 150);
    this.vibrate([100, 100, 100]);
  }

  // General click / button tap
  playClickSound() {
    if (this.isMuted) return;
    this.playTone(700, 'sine', 0.04, 0.1);
  }

  // Grand finale podium fanfare
  playPodiumFanfare() {
    if (this.isMuted) return;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'triangle', 0.3, 0.25);
      }, idx * 140);
    });
    setTimeout(() => {
      this.playTone(1046.5, 'sine', 0.7, 0.3);
    }, 600);
    this.vibrate([100, 50, 100, 50, 300]);
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
