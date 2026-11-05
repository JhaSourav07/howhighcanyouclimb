import * as Phaser from 'phaser';
import { BiomeDefinition, AltitudeTier } from '@/game/data/biomes';
import { GAME_CONFIG } from '@/game/config/gameConfig';
import { Platform } from '@/game/entities/Platform';

export class BiomeThemeEngine {
  private scene: Phaser.Scene;
  private customBackgrounds: Phaser.GameObjects.Graphics[] = [];
  private activeBiome: BiomeDefinition | null = null;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public applyBiome(
    biome: BiomeDefinition,
    defaultEnvironmentSprites: { sprite: Phaser.GameObjects.Sprite; screenIndex: number }[],
    platforms: Platform[]
  ): void {
    this.activeBiome = biome;
    this.clearCustomBackgrounds();

    if (biome.id === 'default') {
      // Restore authentic Construct 3 sprite screens
      for (const item of defaultEnvironmentSprites) {
        item.sprite.setVisible(true);
      }
      this.reskinPlatforms(platforms, biome);
      return;
    }

    // Hide default sprites for custom biomes
    for (const item of defaultEnvironmentSprites) {
      item.sprite.setVisible(false);
    }

    // Build procedural 50-screen atmospheric environments
    this.createCustomBiomeScreens(biome);
    this.reskinPlatforms(platforms, biome);
  }

  private createCustomBiomeScreens(biome: BiomeDefinition): void {
    const totalScreens = biome.totalScreens;
    const screenH = GAME_CONFIG.SCREEN_HEIGHT;
    const screenW = GAME_CONFIG.SCREEN_WIDTH;
    const layoutH = biome.layoutHeight;

    for (let sIdx = 0; sIdx < totalScreens; sIdx++) {
      const bottomY = layoutH - sIdx * screenH;
      const topY = bottomY - screenH;
      const tier = this.getTierForScreen(sIdx, biome);

      const gfx = this.scene.add.graphics();
      gfx.setDepth(0); // Deep background

      // 1. Draw atmospheric gradient background
      const [topColorHex, bottomColorHex] = tier.skyGradient;
      const topColor = parseInt(topColorHex.replace('#', '0x'), 16);
      const bottomColor = parseInt(bottomColorHex.replace('#', '0x'), 16);

      gfx.fillGradientStyle(topColor, topColor, bottomColor, bottomColor, 1);
      gfx.fillRect(0, topY, screenW, screenH);

      // 2. Draw thematic midground architectural silhouettes
      this.drawThematicMidground(gfx, sIdx, topY, screenW, screenH, biome, tier);

      this.customBackgrounds.push(gfx);
    }
  }

  private drawThematicMidground(
    gfx: Phaser.GameObjects.Graphics,
    screenIndex: number,
    topY: number,
    w: number,
    h: number,
    biome: BiomeDefinition,
    tier: AltitudeTier
  ): void {
    const ambientInt = parseInt(tier.ambientColor.replace('#', '0x'), 16);

    switch (biome.id) {
      case 'volcano':
        // Jagged volcanic rock walls & glowing lava cracks
        gfx.fillStyle(ambientInt, 0.8);
        gfx.beginPath();
        gfx.moveTo(0, topY + h);
        gfx.lineTo(0, topY + 40);
        gfx.lineTo(70, topY + 90);
        gfx.lineTo(130, topY + 30);
        gfx.lineTo(190, topY + 110);
        gfx.lineTo(310, topY + 20);
        gfx.lineTo(410, topY + 100);
        gfx.lineTo(w, topY + 50);
        gfx.lineTo(w, topY + h);
        gfx.closePath();
        gfx.fillPath();

        // Molten lava glow at base of screens
        gfx.fillStyle(0xff3d00, 0.25);
        gfx.fillRect(0, topY + h - 16, w, 16);
        break;

      case 'worldtree':
        // Colossal tree trunk silhouettes and branching boughs
        gfx.fillStyle(ambientInt, 0.85);
        // Left trunk flank
        gfx.fillRect(0, topY, 45, h);
        // Right trunk flank
        gfx.fillRect(w - 45, topY, 45, h);
        // Cross branches
        gfx.fillRect(30, topY + (screenIndex % 3) * 110 + 40, w - 60, 24);
        // Hanging leaves / ivy
        gfx.fillStyle(0x4ade80, 0.3);
        gfx.fillCircle(w / 2, topY + 40, 60);
        break;

      case 'glacier':
        // Angular ice crystals and stalactites
        gfx.fillStyle(ambientInt, 0.75);
        for (let i = 0; i < 6; i++) {
          const x = i * 80 + 20;
          gfx.fillTriangle(x - 20, topY, x + 20, topY, x, topY + 50 + (i % 3) * 30);
        }
        // Shimmering snow mist
        gfx.fillStyle(0xe0f2fe, 0.15);
        gfx.fillRect(0, topY + h - 30, w, 30);
        break;

      case 'cyberpunk':
        // Distant high-rise silhouettes and glowing windows
        gfx.fillStyle(ambientInt, 0.85);
        gfx.fillRect(30, topY + 30, 80, h);
        gfx.fillRect(150, topY + 60, 110, h);
        gfx.fillRect(310, topY + 10, 90, h);
        gfx.fillRect(430, topY + 70, 50, h);

        // Neon antenna lights
        gfx.fillStyle(0x00f0ff, 0.8);
        gfx.fillCircle(70, topY + 25, 2);
        gfx.fillCircle(200, topY + 55, 2);
        gfx.fillCircle(350, topY + 5, 2);
        break;

      case 'atlantis':
        // Fluted underwater Greek temple pillars and coral arches
        gfx.fillStyle(ambientInt, 0.8);
        gfx.fillRect(50, topY, 32, h);
        gfx.fillRect(w - 82, topY, 32, h);
        gfx.fillRoundedRect(40, topY + 20, 52, 16, 4);
        gfx.fillRoundedRect(w - 92, topY + 20, 52, 16, 4);
        // Sunlight water shaft
        gfx.fillStyle(0x5eead4, 0.12);
        gfx.fillTriangle(120, topY, 260, topY, 340, topY + h);
        break;

      case 'steampunk':
        // Giant interlocking gear silhouettes and steam pipes
        gfx.fillStyle(ambientInt, 0.85);
        gfx.fillCircle(90, topY + h / 2, 80);
        gfx.fillCircle(w - 90, topY + h / 2, 70);
        // Copper ductwork
        gfx.fillRect(20, topY, 18, h);
        gfx.fillRect(w - 38, topY, 18, h);
        break;

      case 'necropolis':
        // Sandstone tomb walls, hieroglyphs, and pyramid slopes
        gfx.fillStyle(ambientInt, 0.85);
        gfx.fillTriangle(0, topY + h, w / 2, topY + 30, w, topY + h);
        // Torchlight warm glow
        gfx.fillStyle(0xfde047, 0.2);
        gfx.fillCircle(60, topY + 120, 40);
        gfx.fillCircle(w - 60, topY + 120, 40);
        break;

      case 'cosmic':
        // Distant twinkling stars and floating celestial rings
        gfx.fillStyle(0xffffff, 0.7);
        for (let i = 0; i < 15; i++) {
          const sx = (i * 37 + (screenIndex * 53)) % w;
          const sy = topY + ((i * 29 + (screenIndex * 41)) % h);
          gfx.fillCircle(sx, sy, 1.2);
        }
        // Planetary orbital rings
        gfx.lineStyle(2, 0xc084fc, 0.25);
        gfx.strokeCircle(w / 2, topY + h / 2, 110);
        break;

      case 'gothic':
        // Pointed gothic arches, gargoyles, and cathedral windows
        gfx.fillStyle(ambientInt, 0.9);
        gfx.fillRect(0, topY, 40, h);
        gfx.fillRect(w - 40, topY, 40, h);
        // Archway peak
        gfx.fillTriangle(w / 2 - 80, topY + 90, w / 2 + 80, topY + 90, w / 2, topY + 10);
        // Stained glass glow
        gfx.fillStyle(0xe11d48, 0.2);
        gfx.fillCircle(w / 2, topY + 130, 45);
        break;

      case 'candyland':
        // Peppermint candy cane striped columns and sugar hills
        gfx.fillStyle(ambientInt, 0.8);
        gfx.fillCircle(90, topY + h, 100);
        gfx.fillCircle(w - 90, topY + h, 120);
        // Striped candy cane borders
        gfx.fillStyle(0xffffff, 0.9);
        gfx.fillRect(10, topY, 16, h);
        gfx.fillRect(w - 26, topY, 16, h);
        gfx.fillStyle(0xec4899, 0.9);
        for (let y = 0; y < h; y += 30) {
          gfx.fillRect(10, topY + y, 16, 15);
          gfx.fillRect(w - 26, topY + y, 16, 15);
        }
        break;
    }
  }

  private reskinPlatforms(platforms: Platform[], biome: BiomeDefinition): void {
    const { surfaceColor, borderColor, isSlipperyByDefault, iceScreens, bouncyScreens } = biome.platformTheme;

    for (const plat of platforms) {
      const sIdx = plat.data.screenIndex;
      const isIce = isSlipperyByDefault || (iceScreens && iceScreens.includes(sIdx));
      const isBouncy = bouncyScreens && bouncyScreens.includes(sIdx);

      // Update physics data flags
      plat.data.isSlippery = !!isIce;

      // Reskin rectangle object
      const fill = isIce ? 0x1e3a5f : surfaceColor;
      const stroke = isIce ? 0x38bdf8 : isBouncy ? 0xf472b6 : borderColor;

      plat.gameObject.setFillStyle(fill, 0.85);
      plat.gameObject.setStrokeStyle(1.5, stroke, 0.95);
    }
  }

  public getTierForScreen(screenIndex: number, biome: BiomeDefinition): AltitudeTier {
    for (const tier of biome.tiers) {
      if (screenIndex >= tier.range[0] && screenIndex <= tier.range[1]) {
        return tier;
      }
    }
    return biome.tiers[biome.tiers.length - 1];
  }

  public clearCustomBackgrounds(): void {
    for (const bg of this.customBackgrounds) {
      bg.destroy();
    }
    this.customBackgrounds = [];
  }

  public destroy(): void {
    this.clearCustomBackgrounds();
  }
}
