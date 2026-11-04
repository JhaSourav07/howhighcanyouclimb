import * as Phaser from 'phaser';
import { GAME_CONFIG } from '@/game/config/gameConfig';
import { PHYSICS_CONFIG } from '@/game/config/physicsConfig';
import { PLATFORMS_DATA } from '@/game/data/levels';
import midgroundFrames from '@/game/data/midgroundFrames.json';
import { CollisionSystem } from '@/game/physics/CollisionSystem';
import { PlayerPhysics } from '@/game/physics/PlayerPhysics';
import { Player } from '@/game/entities/Player';
import { Platform } from '@/game/entities/Platform';
import { AudioSystem } from '@/game/systems/AudioSystem';
import { InputSystem } from '@/game/systems/InputSystem';
import { CameraSystem } from '@/game/systems/CameraSystem';
import { LevelManager } from '@/game/systems/LevelManager';
import { useGameStore } from '@/store/gameStore';

export class MainGameScene extends Phaser.Scene {
  private player!: Player;
  private playerPhysics!: PlayerPhysics;
  private collisionSystem!: CollisionSystem;
  private audioSystem!: AudioSystem;
  private inputSystem!: InputSystem;
  private cameraSystem!: CameraSystem;
  private levelManager!: LevelManager;

  private platforms: Platform[] = [];
  private backgroundSprites: Phaser.GameObjects.Sprite[] = [];
  private accumulator: number = 0;
  private prevScreenIndex: number = 0;

  constructor() {
    super({ key: 'MainGameScene' });
  }

  public preload(): void {
    // Load player spritesheet
    this.load.image('player_atlas', '/assets/images/pla-sheet0.png');
    this.load.image('mid_sheet_0', '/assets/images/midground-sheet0.png');
    this.load.image('mid_sheet_1', '/assets/images/midground-sheet1.png');
    this.load.image('col_sheet', '/assets/images/col-sheet0.png');
  }

  public create(): void {
    // 1. Setup sprite frames from pla-sheet0.png
    this.setupPlayerTextureFrames();

    // 2. Setup midground room textures
    this.setupMidgroundTextureFrames();

    // 3. Systems initialization
    this.collisionSystem = new CollisionSystem(PLATFORMS_DATA);
    this.audioSystem = new AudioSystem();
    this.inputSystem = new InputSystem();
    this.cameraSystem = new CameraSystem();
    this.levelManager = new LevelManager();

    // 4. Create particle textures
    this.createParticleTextures();

    // 5. Audio & Physics callbacks
    this.playerPhysics = new PlayerPhysics(
      GAME_CONFIG.PLAYER_START.X,
      GAME_CONFIG.PLAYER_START.Y,
      this.collisionSystem,
      {
        onJump: () => {
          this.audioSystem.playJump();
          this.spawnDust(this.playerPhysics.position.x, this.playerPhysics.position.y + 16, 8);
          useGameStore.getState().incrementJump();
        },
        onBump: () => {
          this.audioSystem.playBump();
        },
        onLand: () => {
          this.audioSystem.playLand();
          this.spawnDust(this.playerPhysics.position.x, this.playerPhysics.position.y + 16, 6);
        },
        onSplat: () => {
          this.audioSystem.playSplat();
          this.spawnDust(this.playerPhysics.position.x, this.playerPhysics.position.y + 16, 14);
          useGameStore.getState().incrementFall();
        },
      }
    );

    // 5. Render midground environment screens (depth 1)
    this.createEnvironmentScreens();

    // 6. Create player entity (depth 10)
    this.player = new Player(this, this.playerPhysics);

    // 7. Render collision platforms (depth 5)
    for (const data of PLATFORMS_DATA) {
      const plat = new Platform(this, data);
      this.platforms.push(plat);
    }

    // 8. Camera setup
    this.cameras.main.setSize(GAME_CONFIG.SCREEN_WIDTH, GAME_CONFIG.SCREEN_HEIGHT);
    this.cameraSystem.update(this.playerPhysics.position, true);
    this.cameras.main.centerOn(this.cameraSystem.currentX, this.cameraSystem.currentY);

    // Initial HUD update & offscreen culling
    this.cullOffscreenObjects(0);
    this.updateHUD();
  }

  private createParticleTextures(): void {
    if (!this.textures.exists('dust_particle')) {
      const canvas = document.createElement('canvas');
      canvas.width = 3;
      canvas.height = 3;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#d7ccc8';
        ctx.fillRect(0, 0, 3, 3);
      }
      this.textures.addCanvas('dust_particle', canvas);
    }
  }

  private spawnDust(x: number, y: number, count: number): void {
    for (let i = 0; i < count; i++) {
      const p = this.add.sprite(x + (Math.random() * 16 - 8), y, 'dust_particle');
      p.setDepth(15);
      const angle = Math.random() * Math.PI - Math.PI; // Upwards spread
      const speed = 20 + Math.random() * 40;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;

      this.tweens.add({
        targets: p,
        x: p.x + vx * 0.3,
        y: p.y + vy * 0.3,
        alpha: 0,
        scale: 0.2,
        duration: 250 + Math.random() * 150,
        ease: 'Cubic.easeOut',
        onComplete: () => {
          p.destroy();
        },
      });
    }
  }

  private setupPlayerTextureFrames(): void {
    if (!this.textures.exists('player_atlas')) return;
    const texture = this.textures.get('player_atlas');

    texture.add('idle', 0, 69, 193, 32, 32);
    texture.add('walk_0', 0, 1, 193, 32, 32);
    texture.add('walk_1', 0, 69, 129, 32, 32);
    texture.add('walk_2', 0, 35, 193, 32, 32);
    texture.add('jump', 0, 69, 65, 32, 32);
    texture.add('fall', 0, 35, 129, 32, 32);
    texture.add('charge', 0, 65, 1, 32, 32);
    texture.add('splat', 0, 35, 65, 32, 32);
  }

  private setupMidgroundTextureFrames(): void {
    for (const f of midgroundFrames) {
      const textureKey = f.sheet;
      if (this.textures.exists(textureKey)) {
        const texture = this.textures.get(textureKey);
        const frameKey = `room_bg_${f.frameIndex}`;
        if (!texture.has(frameKey)) {
          texture.add(frameKey, 0, f.x, f.y, f.w, f.h);
        }
      }
    }
  }

  private createEnvironmentScreens(): void {
    for (let k = 0; k < GAME_CONFIG.TOTAL_SCREENS; k++) {
      const frameDef = midgroundFrames[k];
      if (!frameDef) continue;

      const textureKey = frameDef.sheet;
      const frameKey = `room_bg_${k}`;

      if (this.textures.exists(textureKey) && this.textures.get(textureKey).has(frameKey)) {
        // Center of screen k: x=240, y=15120 - k * 360 - 180
        const screenCenterY = GAME_CONFIG.LAYOUT_HEIGHT - k * GAME_CONFIG.SCREEN_HEIGHT - GAME_CONFIG.SCREEN_HEIGHT / 2;
        const bg = this.add.sprite(GAME_CONFIG.SCREEN_WIDTH / 2, screenCenterY, textureKey, frameKey);
        bg.setOrigin(0.5, 0.5);
        bg.setDepth(1);
        this.backgroundSprites.push(bg);
      }
    }
  }

  public update(_time: number, delta: number): void {
    if (useGameStore.getState().isPaused) return;

    const dt = delta / 1000;
    this.accumulator += Math.min(dt, 0.1);

    const input = this.inputSystem.poll();

    // Fixed timestep loop for 100% deterministic physics
    while (this.accumulator >= PHYSICS_CONFIG.FIXED_TIMESTEP) {
      this.playerPhysics.update(PHYSICS_CONFIG.FIXED_TIMESTEP, input);
      this.accumulator -= PHYSICS_CONFIG.FIXED_TIMESTEP;
    }

    // Update entity visuals
    this.player.update(dt);

    // Update camera to snap to current screen
    this.cameraSystem.update(this.playerPhysics.position);
    this.cameras.main.centerOn(this.cameraSystem.currentX, this.cameraSystem.currentY);

    // Detect screen transition & optimize offscreen visibility
    const curScreen = this.cameraSystem.getScreenIndex();
    if (curScreen !== this.prevScreenIndex) {
      this.prevScreenIndex = curScreen;
      this.cullOffscreenObjects(curScreen);
    }

    // Check for summit victory
    if (this.levelManager.isSummitReached(this.playerPhysics.position.y)) {
      useGameStore.getState().triggerVictory();
    }

    // Synchronize HUD state with React store
    this.updateHUD();
  }

  private cullOffscreenObjects(currentScreen: number): void {
    // Only render background slices and platforms within +-1 screen of active room
    for (let k = 0; k < this.backgroundSprites.length; k++) {
      const isVisible = Math.abs(k - currentScreen) <= 1;
      this.backgroundSprites[k].setVisible(isVisible);
    }

    for (const plat of this.platforms) {
      const isVisible = Math.abs(plat.data.screenIndex - currentScreen) <= 1;
      plat.setVisible(isVisible);
    }
  }

  private updateHUD(): void {
    const isCharging = this.playerPhysics.jumpController.getIsCharging();
    const chargePercent = this.playerPhysics.jumpController.getChargePercent();
    const screenIndex = this.cameraSystem.getScreenIndex();
    const altitude = this.cameraSystem.getAltitudeMeters();

    useGameStore.getState().updateHUD({
      screenIndex,
      jumpChargePercent: chargePercent,
      isCharging,
      altitudeMeters: altitude,
    });
  }

  public setVirtualInput(left: boolean, right: boolean, jump: boolean): void {
    this.inputSystem.setVirtualInput(left, right, jump);
  }

  public resetPlayer(): void {
    this.playerPhysics.position = {
      x: GAME_CONFIG.PLAYER_START.X,
      y: GAME_CONFIG.PLAYER_START.Y,
    };
    this.playerPhysics.velocity = { x: 0, y: 0 };
    this.playerPhysics.setState('idle');
    this.cameraSystem.update(this.playerPhysics.position, true);
    useGameStore.getState().resetGame();
  }

  public destroyScene(): void {
    this.inputSystem?.detach();
    if (this.backgroundSprites) {
      for (const bg of this.backgroundSprites) {
        bg?.destroy();
      }
      this.backgroundSprites = [];
    }
    if (this.platforms) {
      for (const p of this.platforms) {
        p?.destroy();
      }
      this.platforms = [];
    }
    this.player?.destroy();
  }
}
