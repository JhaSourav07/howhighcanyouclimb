import { describe, it, expect } from 'vitest';
import { PHYSICS_CONFIG } from '@/game/config/physicsConfig';
import { JumpController } from '@/game/physics/JumpController';

describe('Physics Trajectory & Apex Calibration', () => {
  const simulateTrajectory = (vx0: number, vy0: number, dt: number = 1 / 60) => {
    let x = 0;
    let y = 0;
    let vx = vx0;
    let vy = vy0;
    let peakHeight = 0;
    let timeToApex = 0;
    let totalTime = 0;

    while (totalTime < 3.0) {
      x += vx * dt;
      y += vy * dt;
      vy += PHYSICS_CONFIG.GRAVITY_Y * dt;
      totalTime += dt;

      // Track peak upward displacement (-y)
      if (-y > peakHeight) {
        peakHeight = -y;
        timeToApex = totalTime;
      }

      // Returned to ground baseline
      if (y >= 0 && totalTime > 0.05) {
        break;
      }
    }

    return { peakHeight, timeToApex, totalDistanceX: Math.abs(x), totalAirTime: totalTime };
  };

  it('calibrates minimum uncharged jump trajectory', () => {
    const jump = new JumpController();
    jump.startCharging();
    const result = jump.releaseJump(false, false, 'right');

    const traj = simulateTrajectory(result.velocity.x, result.velocity.y);

    // Peak height: Vy0 = -180, G = 500 -> H ≈ 32-35 px
    expect(Math.round(traj.peakHeight)).toBeGreaterThanOrEqual(32);
    expect(Math.round(traj.peakHeight)).toBeLessThanOrEqual(35);
    // Time to apex: Vy0 / G ≈ 0.36-0.38 s
    expect(Number(traj.timeToApex.toFixed(2))).toBeGreaterThanOrEqual(0.35);
    expect(Number(traj.timeToApex.toFixed(2))).toBeLessThanOrEqual(0.38);
  });

  it('calibrates maximum charged jump trajectory', () => {
    const jump = new JumpController();
    jump.startCharging();
    jump.updateCharge(1.0); // full 600 charge
    const result = jump.releaseJump(false, false, 'right');

    const traj = simulateTrajectory(result.velocity.x, result.velocity.y);

    // Peak height: Vy0 = -680, G = 500 -> H ≈ 460-472 px
    expect(Math.round(traj.peakHeight)).toBeGreaterThanOrEqual(460);
    expect(Math.round(traj.peakHeight)).toBeLessThanOrEqual(472);
    // Time to apex: Vy0 / G ≈ 1.36-1.38 s
    expect(Number(traj.timeToApex.toFixed(2))).toBeGreaterThanOrEqual(1.35);
    expect(Number(traj.timeToApex.toFixed(2))).toBeLessThanOrEqual(1.38);
  });

  it('calibrates maximum diagonal jump flight distance', () => {
    const jump = new JumpController();
    jump.startCharging();
    jump.updateCharge(1.0); // full 600 charge
    const result = jump.releaseJump(true, false, 'left');

    const traj = simulateTrajectory(result.velocity.x, result.velocity.y);

    // Total X distance: Vx * 2.72s = 220 * 2.72 = ~580-620 px
    expect(Math.round(traj.totalDistanceX)).toBeGreaterThan(580);
    expect(Math.round(traj.totalDistanceX)).toBeLessThan(620);
  });
});
