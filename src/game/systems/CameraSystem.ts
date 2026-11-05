import { GAME_CONFIG } from '@/game/config/gameConfig';
import { Vector2D } from '@/types/game';

export class CameraSystem {
  public currentX: number = 240;
  public currentY: number = 14940; // Screen 0 center
  public targetX: number = 240;
  public targetY: number = 14940;

  public currentScreenIndex: number = 0;

  /**
   * Updates camera target based on player position.
   * Matches Construct 3 expression: Math.round((py - 180) / 360) * 360 + 180
   */
  public update(playerPos: Vector2D, instant: boolean = false): void {
    // Exact room center calculation
    this.targetX = Math.round((playerPos.x - 240) / 480) * 480 + 240;
    this.targetY = Math.round((playerPos.y - 180) / 360) * 360 + 180;

    // Calculate screen index (0 at bottom, 41 at top)
    const rawIndex = Math.floor((GAME_CONFIG.LAYOUT_HEIGHT - playerPos.y) / GAME_CONFIG.SCREEN_HEIGHT);
    this.currentScreenIndex = Math.max(0, Math.min(GAME_CONFIG.TOTAL_SCREENS - 1, rawIndex));

    if (instant) {
      this.currentX = this.targetX;
      this.currentY = this.targetY;
    } else {
      // Smooth lerp room transition
      this.currentX += (this.targetX - this.currentX) * GAME_CONFIG.CAMERA.LERP;
      this.currentY += (this.targetY - this.currentY) * GAME_CONFIG.CAMERA.LERP;
    }
  }

  public getScreenIndex(): number {
    return this.currentScreenIndex;
  }

  public getAltitudeMeters(): number {
    // Each screen is 360px -> ~7.2 meters (0.02 m/px)
    // Screen 0 room center is 14940, representing 0m ground altitude
    const distanceClimbedPx = 14940 - this.currentY;
    return Math.max(0, Math.round(distanceClimbedPx * 0.02));
  }
}
