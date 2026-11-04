import * as Phaser from 'phaser';
import { PlayerPhysics } from '@/game/physics/PlayerPhysics';
import { PlayerState } from '@/types/game';

export class Player {
  public sprite: Phaser.GameObjects.Sprite;
  public physics: PlayerPhysics;
  private scene: Phaser.Scene;
  private walkFrameTimer: number = 0;
  private walkFrameIndex: number = 0;

  constructor(scene: Phaser.Scene, physics: PlayerPhysics) {
    this.scene = scene;
    this.physics = physics;

    // Create player sprite
    this.sprite = scene.add.sprite(physics.position.x, physics.position.y, 'player');
    this.sprite.setOrigin(0.5, 0.5);
    this.sprite.setDepth(10);
  }

  public update(dt: number): void {
    // Synchronize sprite position with physical simulation
    this.sprite.setPosition(this.physics.position.x, this.physics.position.y);

    // Orientation mirroring
    this.sprite.setFlipX(this.physics.facing === 'left');

    // Visual animation frames
    this.updateAnimation(dt);
  }

  private updateAnimation(dt: number): void {
    const state = this.physics.state;

    switch (state) {
      case 'idle':
      case 'landing':
        this.sprite.setFrame('idle');
        break;

      case 'walking':
        this.walkFrameTimer += dt;
        if (this.walkFrameTimer >= 0.12) {
          this.walkFrameTimer = 0;
          this.walkFrameIndex = (this.walkFrameIndex + 1) % 3;
        }
        this.sprite.setFrame(`walk_${this.walkFrameIndex}`);
        break;

      case 'charging':
        this.sprite.setFrame('charge');
        break;

      case 'jumping':
        this.sprite.setFrame('jump');
        break;

      case 'falling':
        this.sprite.setFrame('fall');
        break;

      case 'bouncing':
      case 'splat':
        this.sprite.setFrame('splat');
        break;

      default:
        this.sprite.setFrame('idle');
        break;
    }
  }

  public destroy(): void {
    this.sprite.destroy();
  }
}
