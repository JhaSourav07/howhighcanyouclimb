# How High Can You Climb ?

> A tactical high-stakes vertical climbing platformer featuring **Sir Hopsalot** (the Frog Adventurer) and **11 distinct handcrafted biomes**, built with **TypeScript**, **Next.js 15**, and **Phaser 3**.

---

## 🐸 Highlights & Features

* **Sir Hopsalot (The Frog Adventurer)**:
  * Full 8-state animation suite: `idle`, 3-frame waddle cycle (`walk_0`, `walk_1`, `walk_2`), spring-coiled `charge`, high vertical `jump`, flailing `fall`, and comic pancake `splat`.
  * Native $32 \times 32\text{ px}$ pixel art with exact $24 \times 32\text{ px}$ collision box.
  * Preserved original King sprite backup in `pla-sheet0-original.png`.

* **11 Unique Handcrafted Biomes**:
  1. **King’s Citadel & Bog (Default)**: Authentic 42-screen reverse-engineered castle tower ($15,120\text{ px}$ layout).
  2. **The Infernal Caldera (50 Screens)**: Molten basalt basin $\to$ sulfur vents $\to$ magma citadel $\to$ ash chasm $\to$ dragon's maw summit (embers particle emitter).
  3. **The Overgrown World-Tree (50 Screens)**: Root loam $\to$ hollow bark heartwood $\to$ emerald canopy $\to$ blossom reaches $\to$ celestial crown (pollen spores).
  4. **The Frostbitten Glacier (50 Screens)**: Frosted pine taiga $\to$ slippery blue glacial ice $\to$ avalanche ridge $\to$ blizzard spires $\to$ aurora borealis peak (snowfall particle emitter).
  5. **The Cyberpunk Megacity (50 Screens)**: Rain-soaked neon underbelly $\to$ transit skyways $\to$ corporate mid-tiers $\to$ server core $\to$ apex helipad (neon rain).
  6. **The Sunken Atlantis (50 Screens)**: Abyssal floor $\to$ sunken marble temple $\to$ giant kelp forest $\to$ coral reef $\to$ sunny tropical atoll (aquatic bubbles).
  7. **The Steampunk Engine (50 Screens)**: Combustion boiler firebox $\to$ interlocking brass cogs $\to$ steam catwalks $\to$ chronometer pendulums $\to$ great belfry (steam plumes).
  8. **The Desert Necropolis (50 Screens)**: Dune oasis $\to$ hieroglyphic sarcophagus tomb $\to$ lapis hall of Anubis $\to$ colossus statues $\to$ gilded pyramidion (desert dust motes).
  9. **The Cosmic Void (50 Screens)**: Forgotten observatory $\to$ nebula marble falls $\to$ asteroid drift $\to$ constellation bridges $\to$ radiant galaxy core (starlight particles).
  10. **The Gothic Catacombs (50 Screens)**: Misty cemetery $\to$ skull niches $\to$ stained-glass cathedral nave $\to$ gargoyle rafters $\to$ blood-moon eclipse belfry (graveyard fog).
  11. **The Candyland Fantasy Spire (50 Screens)**: Marshmallow foothills $\to$ peppermint candy cane canyon $\to$ bouncy gelatin gummy caverns $\to$ cotton candy clouds $\to$ royal gingerbread castle (sugar sparkles).

* **Interactive Biome Selector**:
  * Automatically pops up when the player finishes the interactive tutorial.
  * Accessible on-demand via the HUD Compass button or the Pause Menu ("Change Biome").
  * Animated carousel with full preview artwork, altitude tiers, screen counts, and keyboard arrow navigation.

* **Authentic Tactical Physics**:
  * **Jump Charge**: $1250 \cdot \Delta t\text{ / second}$ charge rate capped at $600$ ($480\text{ ms}$). Auto-releases at max charge.
  * **Zero Air Control**: Trajectory locked upon ground departure ($V_x \approx \pm 220\text{ px/s}$).
  * **Wall Ricochets & Ceiling Damping**: $75\%$ horizontal restitution on wall collisions; $50\%$ upward damping on ceiling hits.
  * **Dynamic Screen Snapping**: Screen-by-screen camera tracking across all 42 or 50 vertical screens.

* **Responsive Framing**:
  * 4:3 native aspect ratio centered on laptop and desktop with skyscraper ad units outside the play area.
  * Full-bleed on mobile with on-screen virtual directional and jump touchpads.

---

## ⌨️ Controls

### Desktop
| Action | Primary Key | Secondary Key |
| :--- | :--- | :--- |
| **Walk Left / Right** | `A` / `D` | `Arrow Left` / `Arrow Right` |
| **Charge Jump** | Hold `Space` | Hold `W` / `Arrow Up` |
| **Execute Jump** | Release `Space` | Release `W` / `Arrow Up` |
| **Pause / Resume** | `Escape` | — |
| **Select Biome** | Click HUD Compass | Pause Menu $\to$ "Change Biome" |
| **Toggle Platform Guides** | `B` | Click HUD Layer icon |
| **Instant Restart** | `R` | Click HUD Reset icon |

### Mobile
* **Directional Buttons**: On-screen `◀` and `▶` pads.
* **Jump Button**: Hold `JUMP` to charge, release to leap.

---

## 🛠️ Technology Stack

* **Framework**: Next.js 15 (App Router), React 19, TypeScript
* **Styling**: Tailwind CSS
* **Game Engine**: Phaser 3 (WebGL / Canvas with nearest-neighbor integer scaling)
* **Audio**: Authentic reference WebM Opus audio with Web Audio API procedural synthesis fallback
* **State Management**: Zustand with `localStorage` persistence
* **Testing**: Vitest (unit tests) & Playwright (E2E browser tests)

---

## 📁 Repository Structure

```
howhighcanyouclimb/
├── docs/                             # Engineering documentation
│   ├── asset-inventory.md            # Spritesheet, biomes, and audio manifest
│   ├── gameplay-mechanics.md         # State machine & input rules
│   └── physics-analysis.md           # Impulse formulas & friction parameters
├── public/
│   └── assets/
│       ├── images/
│       │   ├── biomes/               # 11 high-res biome preview cards
│       │   ├── pla-sheet0.png        # Sir Hopsalot 8-state sprite atlas
│       │   └── pla-sheet0-original.png # Original king backup
│       └── media/                    # WebM jump, bump, land, and splat audio
├── src/
│   ├── app/                          # Next.js App Router (layout, page, globals)
│   ├── components/                   # React UI (GameContainer, BiomeSelectionModal, HUD, Pause)
│   ├── game/
│   │   ├── config/                   # Game & physics constants
│   │   ├── core/                     # GameManager lifecycle
│   │   ├── data/                     # Biomes catalog, levels, platform data
│   │   ├── entities/                 # Player & Platform entities
│   │   ├── physics/                  # PlayerPhysics, JumpController, CollisionSystem
│   │   ├── scenes/                   # Phaser MainGameScene
│   │   └── systems/                  # Camera, Audio, Input, Level, BiomeThemeEngine, BiomeParticleSystem
│   ├── store/                        # Zustand gameStore (biomes, HUD, tutorial)
│   └── types/                        # TypeScript interfaces & BiomeId definitions
└── tests/
    ├── unit/                         # Vitest tests (biomes, physics, calibration, tutorial)
    └── e2e/                          # Playwright browser integration tests
```

---

## 🧪 Testing & Verification

### Unit Tests (Vitest)
Executes all 24 unit tests covering physics formulas, calibration, tutorial progression, and multi-biome grounding:
```bash
npm run test:unit
```

### Production Build
Verifies static page generation and TypeScript type safety:
```bash
npm run build
npm run start
```
