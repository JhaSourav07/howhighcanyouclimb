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

  // Latch fast sub-frame taps so inputs are never dropped
  private latchedLeft: boolean = false;
  private latchedRight: boolean = false;
  private latchedJump: boolean = false;

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
    // Prevent default browser scroll / page down on Space and Arrows
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
      e.preventDefault();
    }

    if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
      this.state.left = true;
      this.latchedLeft = true;
    }
    if (e.code === 'ArrowRight' || e.code === 'KeyD') {
      this.state.right = true;
      this.latchedRight = true;
    }
    // Only Space triggers Jump (ArrowUp and KeyW excluded to prevent accidental jumps)
    if (e.code === 'Space') {
      this.state.jump = true;
      this.latchedJump = true;
    }
  }

  private handleKeyUp(e: KeyboardEvent): void {
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
      e.preventDefault();
    }

    if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
      this.state.left = false;
    }
    if (e.code === 'ArrowRight' || e.code === 'KeyD') {
      this.state.right = false;
    }
    if (e.code === 'Space') {
      this.state.jump = false;
    }
  }

  public setVirtualInput(left: boolean, right: boolean, jump: boolean): void {
    this.virtualLeft = left;
    this.virtualRight = right;
    this.virtualJump = jump;
  }

  public poll(): InputState {
    const isJumpActive = this.state.jump || this.latchedJump || this.virtualJump;
    const isLeftActive = this.state.left || this.latchedLeft || this.virtualLeft;
    const isRightActive = this.state.right || this.latchedRight || this.virtualRight;

    this.latchedLeft = false;
    this.latchedRight = false;
    this.latchedJump = false;

    const justPressed = isJumpActive && !this.prevJump;
    const justReleased = !isJumpActive && this.prevJump;

    this.prevJump = isJumpActive;

    return {
      left: isLeftActive,
      right: isRightActive,
      jump: isJumpActive,
      jumpJustPressed: justPressed,
      jumpJustReleased: justReleased,
    };
  }
}
