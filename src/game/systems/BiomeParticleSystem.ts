import * as Phaser from 'phaser';
import { BiomeDefinition } from '@/game/data/biomes';
import { GAME_CONFIG } from '@/game/config/gameConfig';

export class BiomeParticleSystem {
  private scene: Phaser.Scene;
  private particles: Phaser.GameObjects.Arc[] = [];
  private particleType: BiomeDefinition['particleType'] = 'none';
  private timer: number = 0;
  private maxParticles: number = 35;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public setBiome(biome: BiomeDefinition): void {
    this.clear();
    this.particleType = biome.particleType;
  }

  public update(dt: number, cameraX: number, cameraY: number): void {
    if (this.particleType === 'none') return;

    this.timer += dt;

    // Spawn new particles periodically
    if (this.timer >= 0.08 && this.particles.length < this.maxParticles) {
      this.timer = 0;
      this.spawnParticle(cameraX, cameraY);
    }

    // Update existing particles
    const halfW = GAME_CONFIG.SCREEN_WIDTH / 2 + 40;
    const halfH = GAME_CONFIG.SCREEN_HEIGHT / 2 + 40;

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      const data = p.data.values;

      p.x += data.vx * dt;
      p.y += data.vy * dt;
      p.alpha += data.alphaDelta * dt;

      // Wrap or destroy if out of camera viewport
      const dx = p.x - cameraX;
      const dy = p.y - cameraY;

      if (p.alpha <= 0.02 || Math.abs(dx) > halfW || Math.abs(dy) > halfH) {
        p.destroy();
        this.particles.splice(i, 1);
      }
    }
  }

  private spawnParticle(cameraX: number, cameraY: number): void {
    const halfW = GAME_CONFIG.SCREEN_WIDTH / 2;
    const halfH = GAME_CONFIG.SCREEN_HEIGHT / 2;

    let x = cameraX + (Math.random() * 2 - 1) * halfW;
    let y = cameraY + (Math.random() * 2 - 1) * halfH;
    let radius = 1.5 + Math.random() * 2;
    let color = 0xffffff;
    let alpha = 0.6 + Math.random() * 0.4;
    let vx = (Math.random() - 0.5) * 15;
    let vy = -20 - Math.random() * 30; // Float upwards by default
    let alphaDelta = -0.15 - Math.random() * 0.1;

    switch (this.particleType) {
      case 'embers':
        color = Math.random() > 0.4 ? 0xff4500 : 0xffa500;
        y = cameraY + halfH + 10;
        vy = -35 - Math.random() * 45;
        vx = (Math.random() - 0.5) * 35;
        radius = 1.5 + Math.random() * 2.5;
        break;

      case 'snow':
        color = 0xe0f2fe;
        y = cameraY - halfH - 10;
        vy = 25 + Math.random() * 35; // Fall downward
        vx = -15 - Math.random() * 20; // Drift with wind
        radius = 1 + Math.random() * 2;
        break;

      case 'pollen':
        color = Math.random() > 0.5 ? 0x86efac : 0xfef08a;
        vy = (Math.random() - 0.5) * 12;
        vx = (Math.random() - 0.5) * 20;
        alphaDelta = -0.08;
        break;

      case 'neon':
        color = Math.random() > 0.5 ? 0x00f0ff : 0xf43f5e;
        y = cameraY - halfH - 10;
        vy = 90 + Math.random() * 60; // Cyberpunk rain
        vx = -15;
        radius = 1;
        break;

      case 'bubbles':
        color = 0x5eead4;
        y = cameraY + halfH + 10;
        vy = -20 - Math.random() * 25;
        vx = Math.sin(Date.now() / 200) * 10;
        radius = 1.5 + Math.random() * 2;
        break;

      case 'steam':
        color = 0xd1d5db;
        y = cameraY + halfH;
        vy = -30 - Math.random() * 20;
        vx = (Math.random() - 0.5) * 10;
        radius = 2.5 + Math.random() * 3;
        alphaDelta = -0.25;
        break;

      case 'sand':
        color = 0xfde047;
        vx = 40 + Math.random() * 30; // Desert wind
        vy = 5 + Math.random() * 10;
        radius = 1;
        break;

      case 'starlight':
        color = Math.random() > 0.5 ? 0xc084fc : 0x67e8f9;
        vy = (Math.random() - 0.5) * 6;
        vx = (Math.random() - 0.5) * 6;
        alphaDelta = Math.random() > 0.5 ? -0.2 : 0.2;
        radius = 1 + Math.random() * 2;
        break;

      case 'fog':
        color = 0x64748b;
        y = cameraY + halfH - 20;
        vx = 10 + Math.random() * 15;
        vy = (Math.random() - 0.5) * 5;
        radius = 4 + Math.random() * 4;
        alphaDelta = -0.1;
        break;

      case 'candysparkle':
        color = Math.random() > 0.5 ? 0xf472b6 : 0xfde047;
        vy = -15 - Math.random() * 20;
        vx = (Math.random() - 0.5) * 20;
        radius = 1.5 + Math.random() * 2;
        break;
    }

    const arc = this.scene.add.circle(x, y, radius, color, alpha);
    arc.setDepth(15); // Above platforms, behind HUD
    arc.setDataEnabled();
    arc.data.set('vx', vx);
    arc.data.set('vy', vy);
    arc.data.set('alphaDelta', alphaDelta);

    this.particles.push(arc);
  }

  public clear(): void {
    for (const p of this.particles) {
      p.destroy();
    }
    this.particles = [];
    this.timer = 0;
  }
}
