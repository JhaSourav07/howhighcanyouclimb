import { PlatformData, ScreenMetadata, BiomeId } from '@/types/game';
import { getPlatformsForBiome, getScreensForBiome } from '@/game/data/levels';
import { GAME_CONFIG } from '@/game/config/gameConfig';
import { BIOME_CATALOG } from '@/game/data/biomes';

export class LevelManager {
  private currentBiomeId: BiomeId = 'default';
  public allPlatforms: PlatformData[] = getPlatformsForBiome('default');
  public allScreens: ScreenMetadata[] = getScreensForBiome('default');

  constructor(initialBiome: BiomeId = 'default') {
    this.setBiome(initialBiome);
  }

  public setBiome(biomeId: BiomeId): void {
    this.currentBiomeId = biomeId;
    this.allPlatforms = getPlatformsForBiome(biomeId);
    this.allScreens = getScreensForBiome(biomeId);
  }

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
