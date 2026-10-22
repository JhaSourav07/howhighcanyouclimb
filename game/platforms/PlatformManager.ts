import Phaser from 'phaser';
import { SeedRandom } from '../utils/SeedRandom';
import { PlatformType } from '../types/game';
import { audioSynth } from '../utils/SoundSynthesizer';

export interface ExtendedPlatform extends Phaser.Physics.Arcade.Sprite {
  platformType: PlatformType;
  moveSpeed?: number;
  moveRange?: number;
  startX?: number;
  moveDirection?: number;
  isCrumbling?: boolean;
}

export class PlatformManager {
  private scene: Phaser.Scene;
  private rng: SeedRandom;
  public group: Phaser.Physics.Arcade.StaticGroup;
  public dynamicGroup: Phaser.Physics.Arcade.Group;
  
  private highestGeneratedY: number;
  private lastPlatformX: number;
  private nextPlatformId: number = 0;
  private screenWidth: number;
  private screenHeight: number;

  constructor(scene: Phaser.Scene, seed: number) {
    this.scene = scene;
    this.rng = new SeedRandom(seed);
    this.screenWidth = scene.scale.width;
    this.screenHeight = scene.scale.height;

    this.ensurePlatformTextures();

    this.group = scene.physics.add.staticGroup();
    this.dynamicGroup = scene.physics.add.group({
      allowGravity: false,
      immovable: true
    });

    this.highestGeneratedY = this.screenHeight - 60;
    this.lastPlatformX = this.screenWidth / 2;

    // Spawn starting floor platform
    this.spawnStartingFloor();

    // Pre-generate initial stack of platforms up to top of screen view
    this.generateUpTo(this.screenHeight - 1400);
  }

  private ensurePlatformTextures() {
    if (!this.scene.textures.exists('plat_hd_grass')) {
      const g = this.scene.make.graphics({ x: 0, y: 0 }, false);
      g.fillStyle(0x1e293b, 1);
      g.fillRoundedRect(0, 0, 256, 36, 10);
      g.fillStyle(0x22c55e, 1);
      g.fillRoundedRect(0, 0, 256, 12, { tl: 10, tr: 10, bl: 0, br: 0 });
      g.fillStyle(0x86efac, 0.7);
      g.fillRect(8, 2, 240, 3);
      g.generateTexture('plat_hd_grass', 256, 36);
      g.destroy();
    }

    if (!this.scene.textures.exists('plat_hd_stone')) {
      const g = this.scene.make.graphics({ x: 0, y: 0 }, false);
      g.fillStyle(0x334155, 1);
      g.fillRoundedRect(0, 0, 256, 36, 10);
      g.fillStyle(0x64748b, 1);
      g.fillRoundedRect(0, 0, 256, 12, { tl: 10, tr: 10, bl: 0, br: 0 });
      g.fillStyle(0x94a3b8, 0.8);
      g.fillRect(8, 2, 240, 3);
      g.generateTexture('plat_hd_stone', 256, 36);
      g.destroy();
    }

    if (!this.scene.textures.exists('plat_hd_ice')) {
      const g = this.scene.make.graphics({ x: 0, y: 0 }, false);
      g.fillStyle(0x0284c7, 0.9);
      g.fillRoundedRect(0, 0, 256, 36, 10);
      g.fillStyle(0x38bdf8, 1);
      g.fillRoundedRect(0, 0, 256, 12, { tl: 10, tr: 10, bl: 0, br: 0 });
      g.fillStyle(0xe0f2fe, 0.9);
      g.fillRect(8, 2, 240, 4);
      g.generateTexture('plat_hd_ice', 256, 36);
      g.destroy();
    }
  }

  private spawnStartingFloor() {
    const floorY = this.screenHeight - 24;
    const floor = this.group.create(this.screenWidth / 2, floorY, 'plat_hd_grass') as ExtendedPlatform;
    floor.setDisplaySize(this.screenWidth + 300, 48);
    floor.refreshBody();
    floor.platformType = 'grass';
  }

  public generateUpTo(targetY: number) {
    while (this.highestGeneratedY > targetY) {
      const currentHeightMeters = Math.max(0, Math.floor((this.screenHeight - this.highestGeneratedY) / 40));
      const difficulty = Math.min(currentHeightMeters / 600, 1.0);

      // Guaranteed reachable Vertical Gap Y (65px - 95px early game up to 125px high altitude)
      const minGap = 65 + difficulty * 30;
      const maxGap = 95 + difficulty * 35;
      const gapY = this.rng.range(minGap, maxGap);
      
      const newY = this.highestGeneratedY - gapY;

      // Platform Width (Generous early game: 200px - 280px)
      const minWidth = Math.max(130, 240 - difficulty * 100);
      const maxWidth = Math.max(170, 320 - difficulty * 120);
      const width = this.rng.range(minWidth, maxWidth);

      // Guaranteed reachable Horizontal X calculation relative to last platform
      const maxJumpReachX = 180 + difficulty * 40; // Max horizontal reach per jump
      const offsetX = this.rng.range(-maxJumpReachX, maxJumpReachX);
      
      let newX = this.lastPlatformX + offsetX;
      const margin = width / 2 + 20;

      // Wrap or clamp within screen bounds
      if (newX < margin) {
        newX = margin + Math.abs(newX - margin);
      } else if (newX > this.screenWidth - margin) {
        newX = (this.screenWidth - margin) - Math.abs(newX - (this.screenWidth - margin));
      }

      this.lastPlatformX = newX;

      // Platform Type Selection
      let type: PlatformType = 'grass';
      const typeRoll = this.rng.next();

      if (difficulty < 0.2) {
        type = 'grass';
      } else if (difficulty < 0.45) {
        type = typeRoll < 0.65 ? 'grass' : 'stone';
      } else {
        if (typeRoll < 0.35) type = 'grass';
        else if (typeRoll < 0.60) type = 'stone';
        else if (typeRoll < 0.82) type = 'moving';
        else if (typeRoll < 0.92) type = 'ice';
        else type = 'crumbling';
      }

      this.createPlatform(newX, newY, width, type);
      this.highestGeneratedY = newY;
    }
  }

  private createPlatform(x: number, y: number, width: number, type: PlatformType) {
    this.nextPlatformId++;
    let textureKey = 'plat_hd_grass';
    if (type === 'stone') textureKey = 'plat_hd_stone';
    if (type === 'ice') textureKey = 'plat_hd_ice';
    if (type === 'moving') textureKey = 'plat_hd_stone';
    if (type === 'crumbling') textureKey = 'plat_hd_grass';

    if (type === 'moving') {
      const plat = this.dynamicGroup.create(x, y, textureKey) as ExtendedPlatform;
      plat.setDisplaySize(width, 36);
      plat.platformType = type;
      plat.startX = x;
      plat.moveRange = this.rng.range(60, 160);
      plat.moveSpeed = this.rng.range(80, 150);
      plat.moveDirection = this.rng.next() > 0.5 ? 1 : -1;

      const dynBody = plat.body as Phaser.Physics.Arcade.Body;
      if (dynBody) {
        dynBody.setSize(256, 36);
      }
    } else {
      const plat = this.group.create(x, y, textureKey) as ExtendedPlatform;
      plat.setDisplaySize(width, 36);
      plat.refreshBody();
      plat.platformType = type;

      if (type === 'crumbling') {
        plat.setTint(0xfca5a5);
        plat.isCrumbling = true;
      }
    }
  }

  public updatePlatforms(cameraY: number) {
    // 1. Move dynamic platforms
    const dynamicChildren = this.dynamicGroup.getChildren() as ExtendedPlatform[];
    for (const plat of dynamicChildren) {
      if (plat.active && plat.moveSpeed && plat.moveRange && plat.startX) {
        plat.x += plat.moveSpeed * (plat.moveDirection || 1) * (1 / 60);
        if (Math.abs(plat.x - plat.startX) > plat.moveRange) {
          plat.moveDirection = (plat.moveDirection || 1) * -1;
        }
      }
    }

    // 2. Recycle platforms far below camera view
    const cleanupYThreshold = cameraY + this.screenHeight + 300;

    const staticChildren = this.group.getChildren() as ExtendedPlatform[];
    for (let i = staticChildren.length - 1; i >= 0; i--) {
      const plat = staticChildren[i];
      if (plat.y > cleanupYThreshold) {
        plat.destroy();
      }
    }

    for (let i = dynamicChildren.length - 1; i >= 0; i--) {
      const plat = dynamicChildren[i];
      if (plat.y > cleanupYThreshold) {
        plat.destroy();
      }
    }

    // 3. Generate new platforms ahead of camera
    this.generateUpTo(cameraY - 600);
  }

  public handlePlayerCollision(player: any, platformObj: any) {
    const plat = platformObj as ExtendedPlatform;
    if (plat.isCrumbling && plat.active) {
      plat.isCrumbling = false;
      audioSynth.playCrumble();

      this.scene.tweens.add({
        targets: plat,
        x: plat.x + 4,
        duration: 40,
        yoyo: true,
        repeat: 5,
        onComplete: () => {
          this.scene.tweens.add({
            targets: plat,
            alpha: 0,
            y: plat.y + 40,
            duration: 200,
            onComplete: () => {
              plat.destroy();
            }
          });
        }
      });
    }
  }
}
