import { PlatformData, ScreenMetadata } from '@/types/game';
import { PLATFORMS_DATA, SCREENS_DATA } from '@/game/data/levels';
import { GAME_CONFIG } from '@/game/config/gameConfig';

export class LevelManager {
  public readonly allPlatforms: PlatformData[] = PLATFORMS_DATA;
  public readonly allScreens: ScreenMetadata[] = SCREENS_DATA;

  public getScreenMetadata(screenIndex: number): ScreenMetadata {
    const clamped = Math.max(0, Math.min(this.allScreens.length - 1, screenIndex));
    return this.allScreens[clamped];
  }

  public getPlatformsForScreen(screenIndex: number): PlatformData[] {
    return this.allPlatforms.filter((p) => p.screenIndex === screenIndex);
  }

  public getVisiblePlatforms(cameraY: number): PlatformData[] {
    const halfH = GAME_CONFIG.SCREEN_HEIGHT / 2 + 50; // Add buffer
    const topY = cameraY - halfH;
    const bottomY = cameraY + halfH;

    return this.allPlatforms.filter((p) => {
      const pTop = p.y - p.height / 2;
      const pBottom = p.y + p.height / 2;
      return pBottom >= topY && pTop <= bottomY;
    });
  }

  public isSummitReached(playerY: number): boolean {
    return playerY <= 360;
  }
}
