import { describe, it, expect } from 'vitest';
import { JumpController } from '@/game/physics/JumpController';
import { PHYSICS_CONFIG } from '@/game/config/physicsConfig';
import { GAME_CONFIG } from '@/game/config/gameConfig';

describe('Jump King Physics Formulas', () => {
  it('accumulates jump charge at exactly 1250 units/second', () => {
    const jump = new JumpController();
    jump.startCharging();

    // After 0.1 seconds -> 125 units
    jump.updateCharge(0.1);
    expect(Math.round(jump.getCharge())).toBe(125);

    // After 0.24 seconds total (additional 0.14) -> 300 units (50%)
    jump.updateCharge(0.14);
    expect(Math.round(jump.getCharge())).toBe(300);
    expect(Math.round(jump.getChargePercent())).toBe(50);
  });

  it('hard-caps jump charge at exactly 600 (480ms)', () => {
    const jump = new JumpController();
    jump.startCharging();

    // After 1 full second -> capped at 600
    const maxTriggered = jump.updateCharge(1.0);
    expect(maxTriggered).toBe(true);
    expect(jump.getCharge()).toBe(600);
    expect(jump.getChargePercent()).toBe(100);
  });

  it('calculates minimum and maximum vertical launch impulses correctly', () => {
    const jumpMin = new JumpController();
    jumpMin.startCharging();
    const resultMin = jumpMin.releaseJump(false, false, 'right');
    expect(resultMin.velocity.y).toBe(PHYSICS_CONFIG.LAUNCH_VY_BASE); // -180 px/s
    expect(resultMin.velocity.x).toBe(0);

    const jumpMax = new JumpController();
    jumpMax.startCharging();
    jumpMax.updateCharge(0.5); // reached 600
    const resultMax = jumpMax.releaseJump(false, false, 'right');
    expect(resultMax.velocity.y).toBe(PHYSICS_CONFIG.LAUNCH_VY_MAX); // -680 px/s
  });

  it('applies locked diagonal velocities based on direction held', () => {
    const jumpLeft = new JumpController();
    jumpLeft.startCharging();
    const resultLeft = jumpLeft.releaseJump(true, false, 'left');
    expect(resultLeft.velocity.x).toBe(-PHYSICS_CONFIG.LAUNCH_VX_DIAGONAL); // -220 px/s
    expect(resultLeft.direction).toBe('left');

    const jumpRight = new JumpController();
    jumpRight.startCharging();
    const resultRight = jumpRight.releaseJump(false, true, 'right');
    expect(resultRight.velocity.x).toBe(PHYSICS_CONFIG.LAUNCH_VX_DIAGONAL); // +220 px/s
    expect(resultRight.direction).toBe('right');
  });

  it('matches reference camera room snapping formula', () => {
    // Math.round((py - 180) / 360) * 360 + 180
    const calcCameraY = (py: number) => Math.round((py - 180) / 360) * 360 + 180;

    // Bottom screen (Screen 0): Center 14940, Y in [14760, 15120]
    expect(calcCameraY(15071.11)).toBe(14940);
    expect(calcCameraY(14800)).toBe(14940);

    // Cross into Screen 1 (Y in [14400, 14760], Center 14580)
    expect(calcCameraY(14600)).toBe(14580);

    // Cross into Screen 41 (Summit, Center 180)
    expect(calcCameraY(200)).toBe(180);
  });

  it('verifies wall bounce velocity restitution is exactly -0.75 * Vx', () => {
    const vx = 220;
    const bouncedVx = -vx * PHYSICS_CONFIG.WALL_BOUNCE_RESTITUTION;
    expect(bouncedVx).toBe(-165);
  });

  it('verifies ceiling bounce velocity damping is exactly -0.50 * Vy', () => {
    const vy = -400;
    const bumpedVy = -vy * PHYSICS_CONFIG.CEILING_DAMPING;
    expect(bumpedVy).toBe(200);
  });
});
