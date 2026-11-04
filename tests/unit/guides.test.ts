import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '@/store/gameStore';

describe('Platform Guides / Blocks State', () => {
  beforeEach(() => {
    useGameStore.setState({ showPlatformGuides: true });
  });

  it('defaults to showPlatformGuides = true for high visibility', () => {
    expect(useGameStore.getState().showPlatformGuides).toBe(true);
  });

  it('toggles platform guides on demand', () => {
    useGameStore.getState().togglePlatformGuides();
    expect(useGameStore.getState().showPlatformGuides).toBe(false);

    useGameStore.getState().togglePlatformGuides();
    expect(useGameStore.getState().showPlatformGuides).toBe(true);
  });
});
