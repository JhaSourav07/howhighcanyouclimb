/**
 * SoundSynthesizer - Real-time procedural audio engine using Web Audio API.
 * Provides crisp arcade audio out-of-the-box without requiring external audio downloads.
 * Modular structure allows easy swapping with HTML5 Audio / Howler if custom MP3 files are provided.
 */
export class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterVolume: number = 0.8;
  private windOsc: OscillatorNode | null = null;
  private windGain: GainNode | null = null;

  constructor() {
    // Lazily initialize AudioContext on user gesture
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.windGain) {
      this.windGain.gain.value = muted ? 0 : 0.05 * this.masterVolume;
    }
  }

  public isSoundMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Sound 1: Jump - Upward pitch frequency sweep
   */
  public playJump() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(480, now + 0.18);

    gain.gain.setValueAtTime(0.3 * this.masterVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.18);
  }

  /**
   * Sound 2: Land - Heavy impact thud with low-pass filtered punch
   */
  public playLand(impactIntensity: number = 1.0) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const intensity = Math.min(Math.max(impactIntensity, 0.5), 2.0);
    const duration = 0.15 * intensity;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120 * intensity, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + duration);

    gain.gain.setValueAtTime(0.4 * intensity * this.masterVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
  }

  /**
   * Sound 3: Button Click - Quick high frequency pop
   */
  public playClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.06);

    gain.gain.setValueAtTime(0.25 * this.masterVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  /**
   * Sound 4: Platform Crumble / Break
   */
  public playCrumble() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(90, now);
    osc.frequency.linearRampToValueAtTime(40, now + 0.25);

    gain.gain.setValueAtTime(0.2 * this.masterVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  /**
   * Ambient Wind - Low filtered noise loop
   */
  public startWind() {
    if (this.windOsc || typeof window === 'undefined') return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;
      whiteNoise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 350;

      this.windGain = this.ctx.createGain();
      this.windGain.gain.value = this.isMuted ? 0 : 0.04 * this.masterVolume;

      whiteNoise.connect(filter);
      filter.connect(this.windGain);
      this.windGain.connect(this.ctx.destination);

      whiteNoise.start();
    } catch {
      // AudioContext autostart prevented or not supported
    }
  }
}

export const audioSynth = new SoundSynthesizer();
