import { PHYSICS_CONFIG } from '@/game/config/physicsConfig';
import { FacingDirection, Vector2D } from '@/types/game';

export interface JumpResult {
  velocity: Vector2D;
  charge: number;
  chargePercent: number;
  direction: 'left' | 'right' | 'straight';
}

export class JumpController {
  private charge: number = 0;
  private isCharging: boolean = false;

  public startCharging(): void {
    this.isCharging = true;
    this.charge = 0;
  }

  public updateCharge(deltaSeconds: number): boolean {
    if (!this.isCharging) return false;

    this.charge += PHYSICS_CONFIG.JUMP_CHARGE_RATE * deltaSeconds;

    if (this.charge >= PHYSICS_CONFIG.JUMP_CHARGE_MAX) {
      this.charge = PHYSICS_CONFIG.JUMP_CHARGE_MAX;
      return true; // Auto-trigger jump at max charge
    }

    return false;
  }

  public getCharge(): number {
    return this.charge;
  }

  public getChargePercent(): number {
    return Math.min(100, (this.charge / PHYSICS_CONFIG.JUMP_CHARGE_MAX) * 100);
  }

  public getIsCharging(): boolean {
    return this.isCharging;
  }

  public releaseJump(
    holdingLeft: boolean,
    holdingRight: boolean,
    facing: FacingDirection
  ): JumpResult {
    const finalCharge = Math.min(this.charge, PHYSICS_CONFIG.JUMP_CHARGE_MAX);
    const chargeRatio = finalCharge / PHYSICS_CONFIG.JUMP_CHARGE_MAX;

    // Linear mapping matching Box2D impulse: 0.0035 * -(20 + charge)
    const vy =
      PHYSICS_CONFIG.LAUNCH_VY_BASE +
      chargeRatio * (PHYSICS_CONFIG.LAUNCH_VY_MAX - PHYSICS_CONFIG.LAUNCH_VY_BASE);

    let vx = 0;
    let direction: 'left' | 'right' | 'straight' = 'straight';

    if (holdingLeft && !holdingRight) {
      vx = -PHYSICS_CONFIG.LAUNCH_VX_DIAGONAL;
      direction = 'left';
    } else if (holdingRight && !holdingLeft) {
      vx = PHYSICS_CONFIG.LAUNCH_VX_DIAGONAL;
      direction = 'right';
    }

    // Reset state
    this.charge = 0;
    this.isCharging = false;

    return {
      velocity: { x: vx, y: vy },
      charge: finalCharge,
      chargePercent: chargeRatio * 100,
      direction,
    };
  }

  public cancelCharge(): void {
    this.charge = 0;
    this.isCharging = false;
  }
}
