import { PHYSICS_CONFIG } from '@/game/config/physicsConfig';

/**
 * Jump King Reference Physics Preset.
 * Matches Box2D parameters extracted from Construct 3 runtime.
 */
export const JUMP_KING_PHYSICS_PRESET = {
  gravityY: PHYSICS_CONFIG.GRAVITY_Y,
  fixedTimeStep: PHYSICS_CONFIG.FIXED_TIMESTEP,

  walkSpeedMax: PHYSICS_CONFIG.WALK_SPEED_MAX,
  walkAcceleration: PHYSICS_CONFIG.WALK_ACCELERATION,
  groundFriction: PHYSICS_CONFIG.GROUND_FRICTION,
  iceFriction: PHYSICS_CONFIG.ICE_FRICTION,

  jumpChargeRate: PHYSICS_CONFIG.JUMP_CHARGE_RATE,
  jumpChargeMax: PHYSICS_CONFIG.JUMP_CHARGE_MAX,

  launchVyBase: PHYSICS_CONFIG.LAUNCH_VY_BASE,
  launchVyMax: PHYSICS_CONFIG.LAUNCH_VY_MAX,
  launchVxDiagonal: PHYSICS_CONFIG.LAUNCH_VX_DIAGONAL,

  wallBounceRestitution: PHYSICS_CONFIG.WALL_BOUNCE_RESTITUTION,
  ceilingDamping: PHYSICS_CONFIG.CEILING_DAMPING,
  highFallSplatThreshold: PHYSICS_CONFIG.HIGH_FALL_SPLAT_THRESHOLD,
};
