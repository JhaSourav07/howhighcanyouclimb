import Phaser from 'phaser';
import { CharacterId, TouchControlsState } from '../types/game';
import { audioSynth } from '../utils/SoundSynthesizer';

export class Player extends Phaser.Physics.Arcade.Sprite {
  private characterId: CharacterId;
  private moveSpeed: number = 380;
  private jumpVelocity: number = -760; // Snappy jump clearing platform gaps with ease
  private wasInAir: boolean = false;
  private airHighestY: number = 0;
  private dustEmitter?: Phaser.GameObjects.Particles.ParticleEmitter;
  
  public touchState: TouchControlsState = { left: false, right: false, jump: false };
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keyA!: Phaser.Input.Keyboard.Key;
  private keyD!: Phaser.Input.Keyboard.Key;
  private keyW!: Phaser.Input.Keyboard.Key;
  private keySpace!: Phaser.Input.Keyboard.Key;

  constructor(scene: Phaser.Scene, x: number, y: number, characterId: CharacterId) {
    const textureKey = characterId === 'male' ? 'male_climber' : 'female_climber';
    super(scene, x, y, textureKey);

    this.characterId = characterId;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setDisplaySize(60, 90);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setGravityY(900);
    body.setBounce(0.0);
    body.setCollideWorldBounds(false);

    const texWidth = this.texture.source[0]?.width || 512;
    const texHeight = this.texture.source[0]?.height || 512;

    body.setSize(texWidth * 0.55, texHeight * 0.85);
    body.setOffset(texWidth * 0.225, texHeight * 0.1);

    this.setupControls();
    this.setupDustParticles();
  }

  private setupControls() {
    if (!this.scene.input.keyboard) return;
    
    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.keyA = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keyW = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keySpace = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }

  private setupDustParticles() {
    const graphics = this.scene.make.graphics({ x: 0, y: 0 }, false);
    graphics.fillStyle(0x38bdf8, 0.9);
    graphics.fillCircle(4, 4, 4);
    graphics.generateTexture('dust_dot', 8, 8);
    graphics.destroy();

    this.dustEmitter = this.scene.add.particles(0, 0, 'dust_dot', {
      speed: { min: 50, max: 140 },
      angle: { min: 200, max: 340 },
      scale: { start: 1.2, end: 0 },
      alpha: { start: 0.9, end: 0 },
      lifespan: 380,
      emitting: false
    });
  }

  public updatePlayer() {
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (!body) return;

    const isGrounded = body.blocked.down || body.touching.down;

    // Movement logic (Keyboard + Touch)
    const moveLeft = (this.cursors?.left?.isDown) || (this.keyA?.isDown) || this.touchState.left;
    const moveRight = (this.cursors?.right?.isDown) || (this.keyD?.isDown) || this.touchState.right;
    const wantJump = (this.cursors?.up?.isDown) || (this.keyW?.isDown) || (this.keySpace?.isDown) || this.touchState.jump;

    if (moveLeft) {
      body.setVelocityX(-this.moveSpeed);
      this.setFlipX(true);
    } else if (moveRight) {
      body.setVelocityX(this.moveSpeed);
      this.setFlipX(false);
    } else {
      body.setVelocityX(body.velocity.x * 0.78);
    }

    // Screen Boundary Wrap (so player smoothly wraps around left/right screen edges)
    const gameWidth = this.scene.scale.width;
    if (this.x < -30) {
      this.x = gameWidth + 15;
    } else if (this.x > gameWidth + 30) {
      this.x = -15;
    }

    // Fixed uniform jump impulse
    if (wantJump && isGrounded) {
      body.setVelocityY(this.jumpVelocity);
      audioSynth.playJump();
      this.emitDust(14);
    }

    // Impact landing calculation
    if (!isGrounded) {
      if (!this.wasInAir) {
        this.wasInAir = true;
        this.airHighestY = this.y;
      } else {
        if (this.y < this.airHighestY) {
          this.airHighestY = this.y;
        }
      }
    } else if (this.wasInAir) {
      this.wasInAir = false;
      const fallDistance = this.y - this.airHighestY;

      if (fallDistance > 45) {
        const impactIntensity = Math.min(fallDistance / 260, 2.2);
        audioSynth.playLand(impactIntensity);
        this.emitDust(Math.floor(12 * impactIntensity));

        if (fallDistance > 220) {
          this.scene.cameras.main.shake(160, 0.008);
        }
      }
    }
  }

  public emitDust(count: number = 8) {
    if (this.dustEmitter) {
      this.dustEmitter.explode(count, this.x, this.y + 40);
    }
  }
}
