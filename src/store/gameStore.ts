import { create } from 'zustand';
import { GameHUDState } from '@/types/game';

interface GameStore extends GameHUDState {
  isMuted: boolean;
  isPaused: boolean;
  toggleMute: () => void;
  togglePause: () => void;
  updateHUD: (update: Partial<GameHUDState>) => void;
  incrementJump: () => void;
  incrementFall: () => void;
  resetGame: () => void;
}

const getInitialMuteState = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem('jump_king_muted') === 'true';
  } catch {
    return false;
  }
};

export const useGameStore = create<GameStore>((set) => ({
  screenIndex: 0,
  totalScreens: 42,
  jumpChargePercent: 0,
  isCharging: false,
  altitudeMeters: 0,
  jumpCount: 0,
  fallsCount: 0,
  isMuted: getInitialMuteState(),
  isPaused: false,

  toggleMute: () =>
    set((state) => {
      const nextMuted = !state.isMuted;
      try {
        localStorage.setItem('jump_king_muted', String(nextMuted));
      } catch {
        // Ignore storage errors
      }
      return { isMuted: nextMuted };
    }),
  togglePause: () => set((state) => ({ isPaused: !state.isPaused })),
  updateHUD: (update) => set((state) => ({ ...state, ...update })),
  incrementJump: () => set((state) => ({ jumpCount: state.jumpCount + 1 })),
  incrementFall: () => set((state) => ({ fallsCount: state.fallsCount + 1 })),
  resetGame: () =>
    set({
      screenIndex: 0,
      jumpChargePercent: 0,
      isCharging: false,
      altitudeMeters: 0,
      jumpCount: 0,
      fallsCount: 0,
      isPaused: false,
    }),
}));
