import { FacingDirection, InputState, PlayerState, Vector2D } from '@/types/game';
import { PHYSICS_CONFIG } from '@/game/config/physicsConfig';
import { GAME_CONFIG } from '@/game/config/gameConfig';
import { JumpController, JumpResult } from './JumpController';
import { CollisionResult, CollisionSystem } from './CollisionSystem';

export interface PlayerPhysicsCallbacks {
  onJump?: (result: JumpResult) => void;
  onBump?: () => void;
  onLand?: () => void;
  onSplat?: () => void;
  onStateChange?: (newState: PlayerState, prevState: PlayerState) => void;
}

export class PlayerPhysics {
  public position: Vector2D;
  public velocity: Vector2D;
  public state: PlayerState = 'idle';
  public facing: FacingDirection = 'right';

  public jumpController: JumpController;
  public collisionSystem: CollisionSystem;

  private isGrounded: boolean = true;
  private isSlippery: boolean = false;
  private splatTimer: number = 0;
  private callbacks: PlayerPhysicsCallbacks;

  constructor(
    startX: number = GAME_CONFIG.PLAYER_START.X,
    startY: number = GAME_CONFIG.PLAYER_START.Y,
    collisionSystem: CollisionSystem,
    callbacks: PlayerPhysicsCallbacks = {}
  ) {
    this.position = { x: startX, y: startY };
    this.velocity = { x: 0, y: 0 };
    this.collisionSystem = collisionSystem;
    this.jumpController = new JumpController();
    this.callbacks = callbacks;
  }

  public setState(newState: PlayerState): void {
    if (this.state !== newState) {
      const prev = this.state;
      this.state = newState;
      this.callbacks.onStateChange?.(newState, prev);
    }
  }

  public update(dt: number, input: InputState): void {
    // 1. Recover from splat / stun
    if (this.state === 'splat') {
      this.splatTimer -= dt;
      this.velocity.x = 0;
      this.velocity.y = 0;
      if (this.splatTimer <= 0) {
        this.setState('idle');
      }
      return;
    }

    // 2. Grounded logic
    if (this.isGrounded) {
      this.handleGrounded(dt, input);
    } else {
      // 3. Airborne logic (zero air-steering!)
      this.handleAirborne(dt);
    }

    // 4. Position integration
    const prevPos: Vector2D = { x: this.position.x, y: this.position.y };
    this.position.x += this.velocity.x * dt;
    this.position.y += this.velocity.y * dt;

    // 5. Collision resolution
    const col: CollisionResult = this.collisionSystem.resolve(
      this.position,
      this.velocity,
      prevPos,
      PHYSICS_CONFIG.PLAYER_BODY.WIDTH,
      PHYSICS_CONFIG.PLAYER_BODY.HEIGHT
    );

    this.isSlippery = col.slipperyGround;

    // Wall bounce handling
    if (col.hitWall && !this.isGrounded) {
      this.setState('bouncing');
      this.facing = col.wallNormalX > 0 ? 'right' : 'left';
      this.callbacks.onBump?.();
    }

    // Ceiling hit handling
    if (col.hitCeiling) {
      this.callbacks.onBump?.();
    }

    // Landing transition
    if (col.grounded && !this.isGrounded) {
      this.isGrounded = true;

      // Check for splat/stun from great height
      if (col.landingVelocityY > PHYSICS_CONFIG.HIGH_FALL_SPLAT_THRESHOLD) {
        this.setState('splat');
        this.splatTimer = 1.0; // 1 second stun
        this.velocity.x = 0;
        this.callbacks.onSplat?.();
      } else {
        this.setState('landing');
        this.callbacks.onLand?.();
        // Return to idle next tick
        setTimeout(() => {
          if (this.state === 'landing') this.setState('idle');
        }, 120);
      }
    } else if (!col.grounded && this.isGrounded) {
      // Walked off platform edge
      this.isGrounded = false;
      this.setState('falling');
    }
  }

  private handleGrounded(dt: number, input: InputState): void {
    // Jump initiation: start charging whenever jump is held while grounded
    if (input.jump && !this.jumpController.getIsCharging()) {
      this.jumpController.startCharging();
      this.setState('charging');
      this.velocity.x = 0;
      return;
    }

    // Jump charging
    if (this.jumpController.getIsCharging()) {
      this.velocity.x = 0;
      const reachedMax = this.jumpController.updateCharge(dt);

      // Facing while charging
      if (input.left && !input.right) {
        this.facing = 'left';
      } else if (input.right && !input.left) {
        this.facing = 'right';
      }

      // Execute jump on release (!input.jump) or max charge
      if (!input.jump || reachedMax) {
        this.executeJump(input);
      }
      return;
    }

    // Grounded walking
    const friction = this.isSlippery ? PHYSICS_CONFIG.ICE_FRICTION : PHYSICS_CONFIG.GROUND_FRICTION;

    if (input.left && !input.right) {
      this.facing = 'left';
      this.velocity.x -= PHYSICS_CONFIG.WALK_ACCELERATION * dt;
      if (this.velocity.x < -PHYSICS_CONFIG.WALK_SPEED_MAX) {
        this.velocity.x = -PHYSICS_CONFIG.WALK_SPEED_MAX;
      }
      this.setState('walking');
    } else if (input.right && !input.left) {
      this.facing = 'right';
      this.velocity.x += PHYSICS_CONFIG.WALK_ACCELERATION * dt;
      if (this.velocity.x > PHYSICS_CONFIG.WALK_SPEED_MAX) {
        this.velocity.x = PHYSICS_CONFIG.WALK_SPEED_MAX;
      }
      this.setState('walking');
    } else {
      // Decelerate to idle stop
      if (this.velocity.x > 0) {
        this.velocity.x = Math.max(0, this.velocity.x - friction * dt);
      } else if (this.velocity.x < 0) {
        this.velocity.x = Math.min(0, this.velocity.x + friction * dt);
      }

      if (Math.abs(this.velocity.x) < 5) {
        this.velocity.x = 0;
        if (this.state !== 'landing') {
          this.setState('idle');
        }
      }
    }
  }

  private executeJump(input: InputState): void {
    const result = this.jumpController.releaseJump(input.left, input.right, this.facing);
    this.velocity.x = result.velocity.x;
    this.velocity.y = result.velocity.y;
    this.isGrounded = false;
    this.setState('jumping');
    this.callbacks.onJump?.(result);
  }

  private handleAirborne(dt: number): void {
    // Gravity application: Vy += G * dt
    this.velocity.y += PHYSICS_CONFIG.GRAVITY_Y * dt;

    // Terminal falling velocity clamp (e.g. 900 px/s)
    if (this.velocity.y > 900) {
      this.velocity.y = 900;
    }

    // State updates based on velocity direction
    if (this.velocity.y > 0 && this.state !== 'falling' && this.state !== 'bouncing') {
      this.setState('falling');
    }
  }
}
