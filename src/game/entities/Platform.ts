import * as Phaser from 'phaser';
import { PlatformData } from '@/types/game';
import { PHYSICS_CONFIG } from '@/game/config/physicsConfig';

export class Platform {
  public data: PlatformData;
  public gameObject: Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene, data: PlatformData) {
    this.data = data;

    // In authentic gameplay, platforms are rendered by the background pixel art.
    // Collision rectangles are invisible unless debug hitboxes are enabled.
    const color = data.isSlippery ? 0x90caf9 : 0x5d4037;
    const alpha = PHYSICS_CONFIG.DEBUG_DRAW_HITBOXES ? 0.6 : 0;

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
    if (!PHYSICS_CONFIG.DEBUG_DRAW_HITBOXES) {
      this.gameObject.setVisible(false);
    }
  }

  public setVisible(visible: boolean): void {
    this.gameObject.setVisible(visible);
  }

  public destroy(): void {
    this.gameObject.destroy();
  }
}
