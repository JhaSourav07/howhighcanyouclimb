import { create } from 'zustand';
import { GameHUDState, BiomeId } from '@/types/game';
import { JumpResult } from '@/game/physics/JumpController';
import { BIOME_CATALOG } from '@/game/data/biomes';

export interface TutorialState {
  isTutorialActive: boolean;
  tutorialStep: number; // 0: move, 1: tap jump, 2: charged jump, 3: directional/bounce, 4: complete
  hasMovedLeft: boolean;
  hasMovedRight: boolean;
  hasTappedJump: boolean;
  hasChargedJump: boolean;
  hasDiagonalJump: boolean;
  hasBumpedWall: boolean;
}

export interface BiomeStoreState {
  selectedBiomeId: BiomeId;
  isBiomeSelectorOpen: boolean;
  openBiomeSelector: () => void;
  closeBiomeSelector: () => void;
  selectBiome: (biomeId: BiomeId) => void;
}

interface GameStore extends GameHUDState, TutorialState, BiomeStoreState {
  isMuted: boolean;
  isPaused: boolean;
  isVictory: boolean;
  showPlatformGuides: boolean;
  toggleMute: () => void;
  togglePause: () => void;
  togglePlatformGuides: () => void;
  triggerVictory: () => void;
  updateHUD: (update: Partial<GameHUDState>) => void;
  incrementJump: () => void;
  incrementFall: () => void;
  resetGame: () => void;

  // Tutorial Actions
  startTutorial: () => void;
  skipTutorial: () => void;
  completeTutorial: () => void;
  nextTutorialStep: () => void;
  reportMoveEvent: (left: boolean, right: boolean) => void;
  reportJumpEvent: (jump: JumpResult) => void;
  reportBumpEvent: () => void;
}

const getInitialMuteState = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem('jump_king_muted') === 'true';
  } catch {
    return false;
  }
};

const getInitialTutorialState = (): boolean => {
  if (typeof window === 'undefined') return true;
  try {
    return localStorage.getItem('jump_king_tutorial_done') !== 'true';
  } catch {
    return true;
  }
};

const getInitialBiomeState = (): BiomeId => {
  if (typeof window === 'undefined') return 'default';
  try {
    const saved = localStorage.getItem('jump_king_selected_biome') as BiomeId;
    if (saved && BIOME_CATALOG[saved]) {
      return saved;
    }
    return 'default';
  } catch {
    return 'default';
  }
};

const initialBiomeId = getInitialBiomeState();
const initialTotalScreens = BIOME_CATALOG[initialBiomeId]?.totalScreens || 42;

export const useGameStore = create<GameStore>((set, get) => ({
  screenIndex: 0,
  totalScreens: initialTotalScreens,
  jumpChargePercent: 0,
  isCharging: false,
  altitudeMeters: 0,
  jumpCount: 0,
  fallsCount: 0,
  isMuted: getInitialMuteState(),
  isPaused: false,
  isVictory: false,
  showPlatformGuides: true,

  // Biome state
  selectedBiomeId: initialBiomeId,
  isBiomeSelectorOpen: false,
  openBiomeSelector: () => set({ isBiomeSelectorOpen: true, isPaused: true }),
  closeBiomeSelector: () => set({ isBiomeSelectorOpen: false, isPaused: false }),
  selectBiome: (biomeId: BiomeId) => {
    try {
      localStorage.setItem('jump_king_selected_biome', biomeId);
    } catch {}
    const biome = BIOME_CATALOG[biomeId];
    set({
      selectedBiomeId: biomeId,
      totalScreens: biome ? biome.totalScreens : 42,
      isBiomeSelectorOpen: false,
      isPaused: false,
      screenIndex: 0,
      altitudeMeters: 0,
    });
  },

  // Tutorial initial state
  isTutorialActive: getInitialTutorialState(),
  tutorialStep: 0,
  hasMovedLeft: false,
  hasMovedRight: false,
  hasTappedJump: false,
  hasChargedJump: false,
  hasDiagonalJump: false,
  hasBumpedWall: false,

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
  togglePlatformGuides: () =>
    set((state) => ({ showPlatformGuides: !state.showPlatformGuides })),
  triggerVictory: () => set({ isVictory: true }),
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
      isVictory: false,
    }),

  // Tutorial handlers
  startTutorial: () =>
    set({
      isTutorialActive: true,
      tutorialStep: 0,
      hasMovedLeft: false,
      hasMovedRight: false,
      hasTappedJump: false,
      hasChargedJump: false,
      hasDiagonalJump: false,
      hasBumpedWall: false,
    }),
  skipTutorial: () => {
    try {
      localStorage.setItem('jump_king_tutorial_done', 'true');
    } catch {}
    set({ isTutorialActive: false });
  },
  completeTutorial: () => {
    try {
      localStorage.setItem('jump_king_tutorial_done', 'true');
    } catch {}
    set({ isTutorialActive: false, isBiomeSelectorOpen: true, isPaused: true });
  },
  nextTutorialStep: () =>
    set((state) => ({ tutorialStep: Math.min(4, state.tutorialStep + 1) })),

  reportMoveEvent: (left: boolean, right: boolean) => {
    const state = get();
    if (!state.isTutorialActive || state.tutorialStep !== 0) return;

    let updatedLeft = state.hasMovedLeft || left;
    let updatedRight = state.hasMovedRight || right;

    if (updatedLeft && updatedRight) {
      set({
        hasMovedLeft: true,
        hasMovedRight: true,
        tutorialStep: 1, // Advance to tap jump
      });
    } else {
      set({
        hasMovedLeft: updatedLeft,
        hasMovedRight: updatedRight,
      });
    }
  },

  reportJumpEvent: (jump: JumpResult) => {
    const state = get();
    if (!state.isTutorialActive) return;

    if (state.tutorialStep === 1) {
      // Step 1: Tap jump (low charge)
      if (jump.chargePercent < 35) {
        set({ hasTappedJump: true, tutorialStep: 2 });
      }
    } else if (state.tutorialStep === 2) {
      // Step 2: Charged jump (high charge)
      if (jump.chargePercent >= 45) {
        set({ hasChargedJump: true, tutorialStep: 3 });
      }
    } else if (state.tutorialStep === 3) {
      // Step 3: Directional jump or wall bounce
      if (jump.direction !== 'straight') {
        set({ hasDiagonalJump: true, tutorialStep: 4 });
      }
    }
  },

  reportBumpEvent: () => {
    const state = get();
    if (!state.isTutorialActive) return;

    if (state.tutorialStep === 3) {
      set({ hasBumpedWall: true, tutorialStep: 4 });
    }
  },
}));
