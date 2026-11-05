import { GAME_CONFIG } from '@/game/config/gameConfig';
import { Vector2D } from '@/types/game';

export class CameraSystem {
  public currentX: number = 240;
  public currentY: number = 14940; // Screen 0 center
  public targetX: number = 240;
  public targetY: number = 14940;

  public currentScreenIndex: number = 0;
  public layoutHeight: number = GAME_CONFIG.LAYOUT_HEIGHT;
  public totalScreens: number = GAME_CONFIG.TOTAL_SCREENS;
  private groundCenterY: number = 14940;

  public setLayoutBounds(layoutHeight: number, totalScreens: number): void {
    this.layoutHeight = layoutHeight;
    this.totalScreens = totalScreens;
    this.groundCenterY = layoutHeight - 180;
  }

  /**
   * Updates camera target based on player position.
   * Matches Construct 3 expression: Math.round((py - 180) / 360) * 360 + 180
   */
  public update(playerPos: Vector2D, instant: boolean = false): void {
    // Exact room center calculation
    this.targetX = Math.round((playerPos.x - 240) / 480) * 480 + 240;
    this.targetY = Math.round((playerPos.y - 180) / 360) * 360 + 180;

    // Calculate screen index (0 at bottom, totalScreens - 1 at top)
    const rawIndex = Math.floor((this.layoutHeight - playerPos.y) / GAME_CONFIG.SCREEN_HEIGHT);
    this.currentScreenIndex = Math.max(0, Math.min(this.totalScreens - 1, rawIndex));

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
    const distanceClimbedPx = this.groundCenterY - this.currentY;
    return Math.max(0, Math.round(distanceClimbedPx * 0.02));
  }
}
