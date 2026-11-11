/**
 * Event-Driven Web Audio Synthesizer
 * 
 * Provides responsive sound effects for button clicks, correct answers,
 * mistakes, timer warnings, power-ups, and victory fanfares.
 */

class SoundManager {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMuted(muted) {
    this.muted = muted;
  }

  isMuted() {
    return this.muted;
  }

  playTone(freq, type = 'sine', duration = 0.15, gainVal = 0.1) {
    if (this.muted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio errors silently ignored if user hasn't interacted with DOM yet
    }
  }

  playClick() {
    this.playTone(600, 'triangle', 0.05, 0.05);
  }

  playCorrect() {
    if (this.muted) return;
    this.initContext();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 arpeggio
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'sine', 0.18, 0.12);
      }, idx * 70);
    });
  }

  playWrong() {
    if (this.muted) return;
    this.initContext();
    this.playTone(180, 'sawtooth', 0.25, 0.15);
    setTimeout(() => {
      this.playTone(140, 'sawtooth', 0.35, 0.15);
    }, 120);
  }

  playFreeze() {
    if (this.muted) return;
    this.initContext();
    const notes = [800, 1000, 1200, 1500, 1800];
    notes.forEach((f, i) => {
      setTimeout(() => this.playTone(f, 'sine', 0.1, 0.08), i * 40);
    });
  }

  playTick() {
    this.playTone(900, 'triangle', 0.03, 0.03);
  }

  playVictory() {
    if (this.muted) return;
    this.initContext();
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    notes.forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 'triangle', 0.3, 0.15);
      }, i * 110);
    });
  }
}

export const sounds = new SoundManager();
