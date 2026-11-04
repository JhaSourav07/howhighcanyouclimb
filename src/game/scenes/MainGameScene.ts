import Phaser from 'phaser';
import { GAME_CONFIG } from '@/game/config/gameConfig';
import { PHYSICS_CONFIG } from '@/game/config/physicsConfig';
import { PLATFORMS_DATA } from '@/game/data/levels';
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
  private accumulator: number = 0;
  private prevScreenIndex: number = 0;

  constructor() {
    super({ key: 'MainGameScene' });
  }

  public preload(): void {
    // Load player spritesheet
    this.load.image('player_atlas', '/assets/images/pla-sheet0.png');
    this.load.image('sky_sheet', '/assets/images/sky-sheet0.png');
    this.load.image('mid_sheet', '/assets/images/midground-sheet0.png');
    this.load.image('col_sheet', '/assets/images/col-sheet0.png');
  }

  public create(): void {
    // 1. Setup sprite frames from pla-sheet0.png
    this.setupPlayerTextureFrames();

    // 2. Systems initialization
    this.collisionSystem = new CollisionSystem(PLATFORMS_DATA);
    this.audioSystem = new AudioSystem();
    this.inputSystem = new InputSystem();
    this.cameraSystem = new CameraSystem();
    this.levelManager = new LevelManager();

    // 3. Audio & Physics callbacks
    this.playerPhysics = new PlayerPhysics(
      GAME_CONFIG.PLAYER_START.X,
      GAME_CONFIG.PLAYER_START.Y,
      this.collisionSystem,
      {
        onJump: () => {
          this.audioSystem.playJump();
          useGameStore.getState().incrementJump();
        },
        onBump: () => {
          this.audioSystem.playBump();
        },
        onLand: () => {
          this.audioSystem.playLand();
        },
        onSplat: () => {
          this.audioSystem.playSplat();
          useGameStore.getState().incrementFall();
        },
      }
    );

    // 4. Create entities
    this.player = new Player(this, this.playerPhysics);

    // 5. Render visible platforms
    for (const data of PLATFORMS_DATA) {
      const plat = new Platform(this, data);
      this.platforms.push(plat);
    }

    // 6. Camera setup
    this.cameras.main.setSize(GAME_CONFIG.SCREEN_WIDTH, GAME_CONFIG.SCREEN_HEIGHT);
    this.cameraSystem.update(this.playerPhysics.position, true);
    this.cameras.main.centerOn(this.cameraSystem.currentX, this.cameraSystem.currentY);

    // Initial HUD update
    this.updateHUD();
  }

  private setupPlayerTextureFrames(): void {
    if (!this.textures.exists('player_atlas')) return;

    const texture = this.textures.get('player_atlas');

    // Add named frames based on reverse-engineered frame coordinates:
    // Frame definitions: [x, y, w, h]
    texture.add('idle', 0, 69, 193, 32, 32);
    texture.add('walk_0', 0, 1, 193, 32, 32);
    texture.add('walk_1', 0, 69, 129, 32, 32);
    texture.add('walk_2', 0, 35, 193, 32, 32);
    texture.add('jump', 0, 69, 65, 32, 32);
    texture.add('fall', 0, 35, 129, 32, 32);
    texture.add('charge', 0, 65, 1, 32, 32);
    texture.add('splat', 0, 35, 65, 32, 32);
  }

  public update(_time: number, delta: number): void {
    if (useGameStore.getState().isPaused) return;

    const dt = delta / 1000;
    this.accumulator += Math.min(dt, 0.1); // Prevent spiral of death

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

    // Detect screen transition
    const curScreen = this.cameraSystem.getScreenIndex();
    if (curScreen !== this.prevScreenIndex) {
      this.prevScreenIndex = curScreen;
    }

    // Synchronize HUD state with React store
    this.updateHUD();
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
    this.inputSystem.detach();
    for (const p of this.platforms) {
      p.destroy();
    }
    this.player.destroy();
  }
}
