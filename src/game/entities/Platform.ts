import * as Phaser from 'phaser';
import { PlatformData } from '@/types/game';
import { PHYSICS_CONFIG } from '@/game/config/physicsConfig';

export class Platform {
  public data: PlatformData;
  public gameObject: Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene, data: PlatformData) {
    this.data = data;

    // Distinct color palette with crisp outline for high visual readability
    const color = data.isSlippery ? 0x90caf9 : 0x5d4037; // Ice blue or stone brown
    const alpha = 0.75;

    this.gameObject = scene.add.rectangle(
      data.x,
      data.y,
      data.width,
      data.height,
      color,
      alpha
    );
    this.gameObject.setOrigin(0.5, 0.5);
    // Depth 4 renders above foreground background tiles (depth 3) and below player (depth 10)
    this.gameObject.setDepth(4);
    this.gameObject.setStrokeStyle(1.5, data.isSlippery ? 0xbbdefb : 0x8d6e63, 0.9);
    this.gameObject.setVisible(true);
  }

  public setVisible(visible: boolean): void {
    this.gameObject.setVisible(visible);
  }

  public destroy(): void {
    this.gameObject.destroy();
  }
}
