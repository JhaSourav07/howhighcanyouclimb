/**
 * Exact physics parameters extracted from decompiled Construct 3 Box2D configuration.
 */

export const PHYSICS_CONFIG = {
  // World gravity: 10 m/s^2 in Box2D with 0.02 m/px scale -> 500 px/s^2
  GRAVITY_Y: 500,

  // Fixed physics timestep for deterministic simulation
  FIXED_TIMESTEP: 1 / 60,

  // Walking dynamics
  WALK_SPEED_MAX: 150, // maxspeed variable
  WALK_ACCELERATION: 900, // px/s^2
  GROUND_FRICTION: 1200, // px/s^2 deceleration to idle stop
  ICE_FRICTION: 40, // slippery surface friction

  // Jump charging dynamics
  JUMP_CHARGE_RATE: 1250, // tssbp accumulation per second
  JUMP_CHARGE_MAX: 600,   // max tssbp cap -> 480ms to full charge
  JUMP_CHARGE_MIN: 0,

  // Launch impulse coefficients
  // In reference: 0.0035 * -(20 + tssbp). With mass ~ 3.1kg -> launch Vy:
  LAUNCH_VY_BASE: -180,   // px/s at zero charge
  LAUNCH_VY_MAX: -680,    // px/s at 600 max charge
  LAUNCH_VX_DIAGONAL: 220, // px/s when horizontal direction held

  // Collision response
  WALL_BOUNCE_RESTITUTION: 0.75, // Vx = -0.75 * Vx upon vertical wall hit
  CEILING_DAMPING: 0.50,         // Vy = -0.50 * Vy upon ceiling bump
  HIGH_FALL_SPLAT_THRESHOLD: 450, // Vy threshold to trigger splat/stun

  // Debug visual hitboxes toggle (default false for authentic pixel art)
  DEBUG_DRAW_HITBOXES: false,

  // Player physical dimensions
  PLAYER_BODY: {
    WIDTH: 24,  // Inner collision width (centered in 32px sprite)
    HEIGHT: 32, // Collision height
    OFFSET_X: 4,
    OFFSET_Y: 0,
  },
} as const;
