/**
 * Audio system handling reference sound playback and Web Audio API synthesis fallback.
 */

export class AudioSystem {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private soundCache: Map<string, HTMLAudioElement> = new Map();

  constructor() {
    this.initAudio();
  }

  private initAudio(): void {
    if (typeof window === 'undefined') return;

    // Preload audio elements
    const sounds = ['king_jump', 'king_bump', 'king_land', 'king_splat'];
    for (const s of sounds) {
      try {
        const audio = new Audio(`/assets/media/${s}.webm`);
        audio.preload = 'auto';
        this.soundCache.set(s, audio);
      } catch {
        // Fallback to synthesis
      }
    }
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
  }

  public playJump(): void {
    if (this.isMuted) return;
    this.playAudioFile('king_jump', () => this.synthJump());
  }

  public playBump(): void {
    if (this.isMuted) return;
    this.playAudioFile('king_bump', () => this.synthBump());
  }

  public playLand(): void {
    if (this.isMuted) return;
    this.playAudioFile('king_land', () => this.synthLand());
  }

  public playSplat(): void {
    if (this.isMuted) return;
    this.playAudioFile('king_splat', () => this.synthSplat());
  }

  private playAudioFile(name: string, fallback: () => void): void {
    const audio = this.soundCache.get(name);
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {
        fallback();
      });
    } else {
      fallback();
    }
  }

  /**
   * Procedural Audio Synthesis Fallbacks
   */
  private synthJump(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  }

  private synthBump(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(110, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  }

  private synthLand(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(90, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  }

  private synthSplat(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.35);

    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  }
}
