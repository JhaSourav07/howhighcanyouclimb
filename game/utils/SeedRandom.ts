/**
 * Mulberry32 PRNG - Fast, deterministic 32-bit random number generator.
 * Ensures that given the same seed, the world will always generate identically.
 */
export class SeedRandom {
  private state: number;

  constructor(seed: number = 1337) {
    this.state = seed >>> 0;
  }

  /**
   * Returns a pseudo-random floating point number between 0 (inclusive) and 1 (exclusive)
   */
  public next(): number {
    let t = (this.state += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /**
   * Returns a random float between min and max
   */
  public range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  /**
   * Returns a random integer between min (inclusive) and max (inclusive)
   */
  public rangeInt(min: number, max: number): number {
    return Math.floor(this.range(min, max + 1));
  }

  /**
   * Chance helper (e.g. 0.35 returns true 35% of the time)
   */
  public chance(probability: number): number {
    return this.next() < probability ? 1 : 0;
  }

  /**
   * Resets the seed
   */
  public setSeed(seed: number): void {
    this.state = seed >>> 0;
  }
}
