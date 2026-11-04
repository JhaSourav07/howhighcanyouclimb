import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '@/store/gameStore';

describe('Interactive Tutorial State Machine', () => {
  beforeEach(() => {
    useGameStore.getState().startTutorial();
  });

  it('starts at step 0 (Ground Movement)', () => {
    const state = useGameStore.getState();
    expect(state.isTutorialActive).toBe(true);
    expect(state.tutorialStep).toBe(0);
    expect(state.hasMovedLeft).toBe(false);
    expect(state.hasMovedRight).toBe(false);
  });

  it('advances to step 1 after walking both left and right', () => {
    useGameStore.getState().reportMoveEvent(true, false);
    expect(useGameStore.getState().hasMovedLeft).toBe(true);
    expect(useGameStore.getState().tutorialStep).toBe(0);

    useGameStore.getState().reportMoveEvent(false, true);
    expect(useGameStore.getState().hasMovedRight).toBe(true);
    expect(useGameStore.getState().tutorialStep).toBe(1);
  });

  it('advances from step 1 to step 2 on a quick tap jump (<35% charge)', () => {
    useGameStore.setState({ tutorialStep: 1 });
    useGameStore.getState().reportJumpEvent({
      velocity: { x: 0, y: -200 },
      charge: 50,
      chargePercent: 20,
      direction: 'straight',
    });

    expect(useGameStore.getState().hasTappedJump).toBe(true);
    expect(useGameStore.getState().tutorialStep).toBe(2);
  });

  it('advances from step 2 to step 3 on a high charged jump (>=45% charge)', () => {
    useGameStore.setState({ tutorialStep: 2 });
    useGameStore.getState().reportJumpEvent({
      velocity: { x: 0, y: -500 },
      charge: 350,
      chargePercent: 60,
      direction: 'straight',
    });

    expect(useGameStore.getState().hasChargedJump).toBe(true);
    expect(useGameStore.getState().tutorialStep).toBe(3);
  });

  it('advances from step 3 to step 4 on directional jump or wall bounce', () => {
    useGameStore.setState({ tutorialStep: 3 });
    useGameStore.getState().reportJumpEvent({
      velocity: { x: 220, y: -400 },
      charge: 200,
      chargePercent: 40,
      direction: 'right',
    });

    expect(useGameStore.getState().hasDiagonalJump).toBe(true);
    expect(useGameStore.getState().tutorialStep).toBe(4);
  });

  it('allows skipping the tutorial at any time', () => {
    useGameStore.getState().skipTutorial();
    expect(useGameStore.getState().isTutorialActive).toBe(false);
  });
});
