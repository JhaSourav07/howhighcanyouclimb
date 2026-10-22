export type CharacterId = 'male' | 'female';

export interface CharacterConfig {
  id: CharacterId;
  name: string;
  title: string;
  spriteKey: string;
  portraitUrl: string;
  description: string;
  stats: {
    agility: number;
    jumpPower: number;
    stamina: number;
  };
}

export type PlatformType = 'grass' | 'stone' | 'ice' | 'moving' | 'crumbling';

export interface PlatformData {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: PlatformType;
  moveSpeed?: number;
  moveRange?: number;
  initialX?: number;
  isCrumbling?: boolean;
}

export interface GameAudioSettings {
  muted: boolean;
  sfxVolume: number;
  musicVolume: number;
}

export interface GameState {
  currentHeight: number;
  bestHeight: number;
  score: number;
  isPlaying: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  selectedCharacter: CharacterId;
  seed: number;
}

export interface TouchControlsState {
  left: boolean;
  right: boolean;
  jump: boolean;
}
