import { PlatformData, Vector2D } from '@/types/game';
import { PHYSICS_CONFIG } from '@/game/config/physicsConfig';
import { GAME_CONFIG } from '@/game/config/gameConfig';

export interface CollisionResult {
  grounded: boolean;
  hitCeiling: boolean;
  hitWall: boolean;
  wallNormalX: number;
  slipperyGround: boolean;
  landingVelocityY: number;
}

export class CollisionSystem {
  private platforms: PlatformData[] = [];
  private platformsByScreen: Map<number, PlatformData[]> = new Map();

  constructor(platforms: PlatformData[]) {
    this.setPlatforms(platforms);
  }

  public setPlatforms(platforms: PlatformData[]): void {
    this.platforms = platforms;
    this.platformsByScreen.clear();

    for (const plat of platforms) {
      const list = this.platformsByScreen.get(plat.screenIndex) || [];
      list.push(plat);
      this.platformsByScreen.set(plat.screenIndex, list);
    }
  }

  /**
   * Get candidates near the player across current and adjacent vertical screens.
   */
  public getNearbyPlatforms(playerY: number): PlatformData[] {
    const currentScreen = Math.floor((GAME_CONFIG.LAYOUT_HEIGHT - playerY) / GAME_CONFIG.SCREEN_HEIGHT);
    const candidates: PlatformData[] = [];

    for (let s = currentScreen - 1; s <= currentScreen + 1; s++) {
      const plats = this.platformsByScreen.get(s);
      if (plats) {
        candidates.push(...plats);
      }
    }

    return candidates;
  }

  /**
   * Resolves player position and velocity against world boundaries and platforms.
   */
  public resolve(
    pos: Vector2D,
    vel: Vector2D,
    prevPos: Vector2D,
    bodyWidth: number,
    bodyHeight: number
  ): CollisionResult {
    const result: CollisionResult = {
      grounded: false,
      hitCeiling: false,
      hitWall: false,
      wallNormalX: 0,
      slipperyGround: false,
      landingVelocityY: vel.y,
    };

    const halfW = bodyWidth / 2;
    const halfH = bodyHeight / 2;

    // 1. World boundary collision (Screen edges: X = 0 and X = 480)
    const minX = halfW;
    const maxX = GAME_CONFIG.SCREEN_WIDTH - halfW;

    if (pos.x <= minX) {
      pos.x = minX;
      if (vel.x < 0) {
        vel.x = -vel.x * PHYSICS_CONFIG.WALL_BOUNCE_RESTITUTION;
        result.hitWall = true;
        result.wallNormalX = 1;
      }
    } else if (pos.x >= maxX) {
      pos.x = maxX;
      if (vel.x > 0) {
        vel.x = -vel.x * PHYSICS_CONFIG.WALL_BOUNCE_RESTITUTION;
        result.hitWall = true;
        result.wallNormalX = -1;
      }
    }

    // 2. Platform collision queries
    const platforms = this.getNearbyPlatforms(pos.y);

    for (const plat of platforms) {
      const pLeft = plat.x - plat.width / 2;
      const pRight = plat.x + plat.width / 2;
      const pTop = plat.y - plat.height / 2;
      const pBottom = plat.y + plat.height / 2;

      const playerLeft = pos.x - halfW;
      const playerRight = pos.x + halfW;
      const playerTop = pos.y - halfH;
      const playerBottom = pos.y + halfH;

      const prevPlayerBottom = prevPos.y + halfH;
      const prevPlayerTop = prevPos.y - halfH;

      // Check AABB overlap
      const horizontalOverlap = playerRight > pLeft + 1 && playerLeft < pRight - 1;
      const verticalOverlap = playerBottom > pTop + 1 && playerTop < pBottom - 1;

      // Floor collision (moving downwards and crossed the top of platform)
      if (horizontalOverlap && vel.y >= 0) {
        if (playerBottom >= pTop && prevPlayerBottom <= pTop + 12) {
          pos.y = pTop - halfH;
          result.landingVelocityY = vel.y;
          vel.y = 0;
          result.grounded = true;
          if (plat.isSlippery) {
            result.slipperyGround = true;
          }
          continue;
        }
      }

      // Ceiling collision (moving upwards and hit bottom of platform)
      if (horizontalOverlap && vel.y < 0) {
        if (playerTop <= pBottom && prevPlayerTop >= pBottom - 12) {
          pos.y = pBottom + halfH;
          vel.y = -vel.y * PHYSICS_CONFIG.CEILING_DAMPING;
          result.hitCeiling = true;
          continue;
        }
      }

      // Vertical wall collision on platform sides
      if (verticalOverlap) {
        // Player hitting left wall of platform (moving right)
        if (vel.x > 0 && playerRight >= pLeft && prevPos.x + halfW <= pLeft + 8) {
          pos.x = pLeft - halfW;
          vel.x = -vel.x * PHYSICS_CONFIG.WALL_BOUNCE_RESTITUTION;
          result.hitWall = true;
          result.wallNormalX = -1;
        }
        // Player hitting right wall of platform (moving left)
        else if (vel.x < 0 && playerLeft <= pRight && prevPos.x - halfW >= pRight - 8) {
          pos.x = pRight + halfW;
          vel.x = -vel.x * PHYSICS_CONFIG.WALL_BOUNCE_RESTITUTION;
          result.hitWall = true;
          result.wallNormalX = 1;
        }
      }
    }

    return result;
  }
}
