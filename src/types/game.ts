/**
 * TypeScript types for Jump King recreation.
 */

export type PlayerState =
  | 'idle'
  | 'walking'
  | 'charging'
  | 'jumping'
  | 'falling'
  | 'bouncing'
  | 'landing'
  | 'splat';

export type FacingDirection = 'left' | 'right';

export interface Vector2D {
  x: number;
  y: number;
}

export interface PlatformData {
  id: number;
  screenIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
  isSlippery: boolean;
  noMovement: boolean;
}

export interface ScreenMetadata {
  index: number;
  topY: number;
  bottomY: number;
  centerY: number;
  name?: string;
  theme: 'castle' | 'forest' | 'mountain' | 'spire' | 'clouds' | 'summit';
}

export interface InputState {
  left: boolean;
  right: boolean;
  jump: boolean;
  jumpJustPressed: boolean;
  jumpJustReleased: boolean;
}

export interface GameHUDState {
  screenIndex: number;
  totalScreens: number;
  jumpChargePercent: number;
  isCharging: boolean;
  altitudeMeters: number;
  jumpCount: number;
  fallsCount: number;
}
