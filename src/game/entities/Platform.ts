import * as Phaser from 'phaser';
import { PlatformData } from '@/types/game';

export class Platform {
  public data: PlatformData;
  public gameObject: Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene, data: PlatformData) {
    this.data = data;

    // Distinct color palette based on surface properties
    const color = data.isSlippery ? 0x90caf9 : 0x5d4037; // Ice blue or stone brown
    const alpha = 0.85;

    this.gameObject = scene.add.rectangle(
      data.x,
      data.y,
      data.width,
      data.height,
      color,
      alpha
    );
    this.gameObject.setOrigin(0.5, 0.5);
    this.gameObject.setDepth(2);
  }

  public setVisible(visible: boolean): void {
    this.gameObject.setVisible(visible);
  }

  public destroy(): void {
    this.gameObject.destroy();
  }
}
