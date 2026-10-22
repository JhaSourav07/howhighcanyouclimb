import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { PlatformManager } from '../platforms/PlatformManager';
import { CharacterId, TouchControlsState } from '../types/game';
import { audioSynth } from '../utils/SoundSynthesizer';

export interface GameSceneConfig {
  characterId: CharacterId;
  seed: number;
  onHeightUpdate: (height: number) => void;
  onGameOver: (finalHeight: number) => void;
}

export class GameScene extends Phaser.Scene {
  private player!: Player;
  private platformManager!: PlatformManager;
  private characterId: CharacterId = 'male';
  private seed: number = 1337;

  private bgSky!: Phaser.GameObjects.Rectangle;
  private bgMountains!: Phaser.GameObjects.TileSprite;
  private bgClouds!: Phaser.GameObjects.TileSprite;

  private currentMaxHeight: number = 0;
  private isGameOver: boolean = false;
  private highestYReached: number = 0;

  private onHeightUpdate?: (height: number) => void;
  private onGameOver?: (finalHeight: number) => void;

  constructor() {
    super({ key: 'GameScene' });
  }

  public init(data: GameSceneConfig) {
    if (data.characterId) this.characterId = data.characterId;
    if (data.seed) this.seed = data.seed;
    this.onHeightUpdate = data.onHeightUpdate;
    this.onGameOver = data.onGameOver;
    this.isGameOver = false;
    this.currentMaxHeight = 0;
  }

  public preload() {
    this.load.image('male_climber', '/assets/male_climber.png');
    this.load.image('female_climber', '/assets/female_climber.png');
    this.load.image('bg_mountains', '/assets/bg_mountains.png');
    this.load.image('bg_clouds', '/assets/bg_clouds.png');
    this.load.image('platform_grass', '/assets/platform_grass.png');
    this.load.image('platform_stone', '/assets/platform_stone.png');
    this.load.image('platform_ice', '/assets/platform_ice.png');
  }

  public create() {
    const width = this.scale.width;
    const height = this.scale.height;

    // Create procedural fallback textures if needed
    this.createFallbackTextures();

    // 1. Sky Gradient Background
    this.bgSky = this.add.rectangle(width / 2, height / 2, width, height * 10, 0x090d16)
      .setScrollFactor(0)
      .setDepth(-100);

    // 2. Parallax Mountain Range
    const mtnTexture = this.textures.exists('bg_mountains') ? 'bg_mountains' : 'fallback_mtn';
    this.bgMountains = this.add.tileSprite(width / 2, height - 250, width, 500, mtnTexture)
      .setScrollFactor(0, 0.15)
      .setDepth(-90);

    // 3. Parallax Floating Clouds Layer
    const cloudTexture = this.textures.exists('bg_clouds') ? 'bg_clouds' : 'fallback_cloud';
    this.bgClouds = this.add.tileSprite(width / 2, height / 2, width, height * 2, cloudTexture)
      .setScrollFactor(0, 0.35)
      .setAlpha(0.4)
      .setDepth(-80);

    // 4. Platform Manager
    this.platformManager = new PlatformManager(this, this.seed);

    // 5. Player Entity
    const startX = width / 2;
    const startY = height - 100;
    this.player = new Player(this, startX, startY, this.characterId);
    this.highestYReached = startY;

    // Collisions
    this.physics.add.collider(
      this.player,
      this.platformManager.group,
      (player, platform) => this.platformManager.handlePlayerCollision(player, platform)
    );

    this.physics.add.collider(
      this.player,
      this.platformManager.dynamicGroup,
      (player, platform) => this.platformManager.handlePlayerCollision(player, platform)
    );

    // Camera setup - Smooth Y follow
    this.cameras.main.startFollow(this.player, false, 0, 0.08, 0, 120);

    // Start background wind ambiance
    audioSynth.startWind();
  }

  private createFallbackTextures() {
    if (!this.textures.exists('fallback_mtn')) {
      const g = this.make.graphics({ x: 0, y: 0 }, false);
      g.fillStyle(0x1e293b, 1);
      g.fillRect(0, 0, 512, 512);
      g.generateTexture('fallback_mtn', 512, 512);
      g.destroy();
    }
    if (!this.textures.exists('fallback_cloud')) {
      const g = this.make.graphics({ x: 0, y: 0 }, false);
      g.fillStyle(0x38bdf8, 0.2);
      g.fillCircle(128, 128, 90);
      g.generateTexture('fallback_cloud', 256, 256);
      g.destroy();
    }
  }

  public setTouchControls(state: TouchControlsState) {
    if (this.player) {
      this.player.touchState = state;
    }
  }

  public update() {
    if (this.isGameOver) return;

    this.player.updatePlayer();

    const camY = this.cameras.main.scrollY;
    
    this.bgMountains.tilePositionY = camY * 0.15;
    this.bgClouds.tilePositionY = camY * 0.35;
    this.bgClouds.tilePositionX += 0.2;

    if (this.player.y < this.highestYReached) {
      this.highestYReached = this.player.y;
    }

    const currentHeightMeters = Math.max(0, Math.floor((this.scale.height - 100 - this.highestYReached) / 40));

    if (currentHeightMeters > this.currentMaxHeight) {
      this.currentMaxHeight = currentHeightMeters;
      if (this.onHeightUpdate) {
        this.onHeightUpdate(this.currentMaxHeight);
      }
    }

    const playerBody = this.player.body as Phaser.Physics.Arcade.Body;
    if (playerBody && playerBody.velocity.y < -300) {
      this.cameras.main.setZoom(0.96);
    } else {
      this.cameras.main.setZoom(1.0);
    }

    this.platformManager.updatePlatforms(camY);

    const fallThreshold = camY + this.scale.height + 250;
    if (this.player.y > fallThreshold) {
      this.triggerGameOver();
    }
  }

  private triggerGameOver() {
    if (this.isGameOver) return;
    this.isGameOver = true;
    audioSynth.playLand(2.5);
    this.cameras.main.shake(300, 0.015);

    if (this.onGameOver) {
      this.onGameOver(this.currentMaxHeight);
    }
  }
}
