import { InputState } from '@/types/game';

export class InputSystem {
  private state: InputState = {
    left: false,
    right: false,
    jump: false,
    jumpJustPressed: false,
    jumpJustReleased: false,
  };

  private prevJump: boolean = false;

  // External virtual button triggers (mobile overlay)
  private virtualLeft: boolean = false;
  private virtualRight: boolean = false;
  private virtualJump: boolean = false;

  private boundKeyDown: (e: KeyboardEvent) => void;
  private boundKeyUp: (e: KeyboardEvent) => void;

  constructor() {
    this.boundKeyDown = this.handleKeyDown.bind(this);
    this.boundKeyUp = this.handleKeyUp.bind(this);
    this.attach();
  }

  public attach(): void {
    if (typeof window === 'undefined') return;
    window.addEventListener('keydown', this.boundKeyDown);
    window.addEventListener('keyup', this.boundKeyUp);
  }

  public detach(): void {
    if (typeof window === 'undefined') return;
    window.removeEventListener('keydown', this.boundKeyDown);
    window.removeEventListener('keyup', this.boundKeyUp);
  }

  private handleKeyDown(e: KeyboardEvent): void {
    // Prevent default scroll on Space and Arrows
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
      e.preventDefault();
    }

    if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
      this.state.left = true;
    }
    if (e.code === 'ArrowRight' || e.code === 'KeyD') {
      this.state.right = true;
    }
    if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
      this.state.jump = true;
    }
  }

  private handleKeyUp(e: KeyboardEvent): void {
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
      this.state.left = false;
    }
    if (e.code === 'ArrowRight' || e.code === 'KeyD') {
      this.state.right = false;
    }
    if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
      this.state.jump = false;
    }
  }

  public setVirtualInput(left: boolean, right: boolean, jump: boolean): void {
    this.virtualLeft = left;
    this.virtualRight = right;
    this.virtualJump = jump;
  }

  public poll(): InputState {
    const isJumpActive = this.state.jump || this.virtualJump;

    const justPressed = isJumpActive && !this.prevJump;
    const justReleased = !isJumpActive && this.prevJump;

    this.prevJump = isJumpActive;

    return {
      left: this.state.left || this.virtualLeft,
      right: this.state.right || this.virtualRight,
      jump: isJumpActive,
      jumpJustPressed: justPressed,
      jumpJustReleased: justReleased,
    };
  }
}
