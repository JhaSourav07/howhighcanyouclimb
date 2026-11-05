import { describe, it, expect, beforeEach } from 'vitest';
import { BIOME_CATALOG } from '@/game/data/biomes';
import { getPlatformsForBiome, getScreensForBiome } from '@/game/data/levels';
import { useGameStore } from '@/store/gameStore';
import { BiomeId } from '@/types/game';

describe('Multi-Biome System', () => {
  beforeEach(() => {
    useGameStore.setState({
      selectedBiomeId: 'default',
      isBiomeSelectorOpen: false,
      isPaused: false,
      isTutorialActive: true,
      tutorialStep: 0,
    });
  });

  it('contains all 11 distinct biomes in BIOME_CATALOG', () => {
    const biomeIds: BiomeId[] = [
      'default',
      'volcano',
      'worldtree',
      'glacier',
      'cyberpunk',
      'atlantis',
      'steampunk',
      'necropolis',
      'cosmic',
      'gothic',
      'candyland',
    ];

    expect(Object.keys(BIOME_CATALOG)).toHaveLength(11);
    for (const id of biomeIds) {
      expect(BIOME_CATALOG[id]).toBeDefined();
      expect(BIOME_CATALOG[id].name).toBeTruthy();
      expect(BIOME_CATALOG[id].subtitle).toBeTruthy();
      expect(BIOME_CATALOG[id].previewImage).toBeTruthy();
      expect(BIOME_CATALOG[id].accentColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(BIOME_CATALOG[id].tiers.length).toBeGreaterThanOrEqual(4);
    }
  });

  it('configures 42 screens for default and 50 screens for all custom biomes', () => {
    expect(BIOME_CATALOG.default.totalScreens).toBe(42);
    expect(BIOME_CATALOG.default.layoutHeight).toBe(15120);

    const customIds: BiomeId[] = [
      'volcano',
      'worldtree',
      'glacier',
      'cyberpunk',
      'atlantis',
      'steampunk',
      'necropolis',
      'cosmic',
      'gothic',
      'candyland',
    ];

    for (const id of customIds) {
      expect(BIOME_CATALOG[id].totalScreens).toBe(50);
      expect(BIOME_CATALOG[id].layoutHeight).toBe(18000);
    }
  });

  it('returns appropriate platforms and screen bounds for default vs custom biomes', () => {
    const defaultPlatforms = getPlatformsForBiome('default');
    const defaultScreens = getScreensForBiome('default');
    expect(defaultPlatforms).toHaveLength(343);
    expect(defaultScreens).toHaveLength(42);

    const volcanoPlatforms = getPlatformsForBiome('volcano');
    const volcanoScreens = getScreensForBiome('volcano');
    expect(volcanoPlatforms.length).toBeGreaterThan(defaultPlatforms.length);
    expect(volcanoScreens).toHaveLength(50);
    expect(volcanoScreens[49].name).toContain('Dragon’s Maw');
  });

  it('manages biome selection and modal state in useGameStore', () => {
    const store = useGameStore.getState();

    store.openBiomeSelector();
    expect(useGameStore.getState().isBiomeSelectorOpen).toBe(true);
    expect(useGameStore.getState().isPaused).toBe(true);

    store.closeBiomeSelector();
    expect(useGameStore.getState().isBiomeSelectorOpen).toBe(false);

    store.selectBiome('cyberpunk');
    expect(useGameStore.getState().selectedBiomeId).toBe('cyberpunk');
    expect(useGameStore.getState().totalScreens).toBe(50);
    expect(useGameStore.getState().isBiomeSelectorOpen).toBe(false);
  });

  it('triggers biome selector automatically upon completing tutorial', () => {
    const store = useGameStore.getState();
    store.completeTutorial();

    const updated = useGameStore.getState();
    expect(updated.isTutorialActive).toBe(false);
    expect(updated.isBiomeSelectorOpen).toBe(true);
  });
});
