# Jump King Browser — High-Fidelity Recreation

> A browser-based recreation of the tactical jumping platformer **[Jump King Browser](https://s4c2.itch.io/jump-king-browser)**, reverse-engineered with **REA (Reverse Engineer Anything)** and reconstructed in **TypeScript**, **Next.js 15**, and **Phaser 3**.

---

## 🎮 Gameplay & Core Mechanics

The game recreates the exact mechanics and physics of the reference game:

* **Direct Access**: Launching the web application takes the player directly into the game — no landing pages, no marketing fluff, no unnecessary UI.
* **9:16 Portrait Viewport**: True-to-spec portrait framing centered on desktop with non-intrusive left and right skyscraper ad placeholders outside the playable area; full-bleed on mobile with virtual touch controls.
* **Accurate Jump Charging**:
  * Jump charge timer accumulates at $1250 \cdot \Delta t\text{ / second}$ up to a maximum cap of $600$ ($480\text{ ms}$ charge time).
  * Auto-releases upon hitting max charge.
  * Vertical launch impulse follows $J_y = 0.0035 \cdot (-(20 + \text{charge}))$.
* **Zero Air Control**:
  * Trajectory is locked the instant the king leaves the ground.
  * Horizontal launch impulse is fixed at $\pm 0.85$ ($V_x \approx \pm 220\text{ px/s}$) if holding left or right.
* **Wall Ricochets & Ceiling Damping**:
  * Vertical wall impacts invert horizontal velocity with $75\%$ conservation: $V_x' = -0.75 \cdot V_x$.
  * Ceiling collisions damp upward velocity: $V_y' = -0.50 \cdot V_y$.
  * Plays authentic `king_bump.webm` audio on collision.
* **Screen-Based Camera Snapping**:
  * 42 discrete vertical screens ($480 \times 360\text{ px}$ each) stacked from $Y = 15120$ down to $Y = 720$.
  * Camera snaps automatically as the player crosses room boundaries:
    $$\text{Camera}_Y = \text{round}\left(\frac{P_y - 180}{360}\right) \cdot 360 + 180$$
* **343 Reconstructed Collision Platforms**:
  * Extracted platform geometry across all 42 screens, including slippery ice surfaces (`isSlippery`).

---

## ⌨️ Controls

### Desktop
| Action | Keybinding |
| :--- | :--- |
| **Walk Left / Right** | `A` / `D` or `Arrow Left` / `Arrow Right` |
| **Charge Jump** | Hold `Space` (or `W` / `Arrow Up`) |
| **Execute Jump** | Release `Space` |
| **Pause / Resume** | `Escape` |
| **Instant Restart** | `R` |

### Mobile
* **Directional Buttons**: On-screen `◀` and `▶` pads.
* **Jump Button**: Hold `JUMP` to charge, release to leap.

---

## 🛠️ Technology Stack

* **Application Shell**: Next.js 15 (App Router), React 19, TypeScript
* **Styling**: Tailwind CSS
* **Game Engine**: Phaser 3 (WebGL / Canvas with nearest-neighbor integer scaling)
* **Audio**: Reference WebM audio with Web Audio API procedural synthesis fallback
* **State Management**: Zustand
* **Testing**: Vitest (unit tests) & Playwright (E2E browser tests)

---

## 📁 Repository Structure

```
howhighcanyouclimb/
├── docs/
│   ├── reverse-engineering-report.md # Reverse-engineering findings & provenance
│   ├── gameplay-mechanics.md         # State machine & input rules
│   ├── physics-analysis.md           # Box2D formulas & parameters
│   ├── level-analysis.md             # 42-screen vertical progression
│   ├── asset-inventory.md            # Spritesheet & audio ledger
│   ├── implementation-progress.md    # Milestones & completion tracker
│   └── known-differences.md          # Architectural improvements
├── src/
│   ├── app/                          # Next.js App Router entrypoints
│   ├── components/                   # React UI (GameContainer, HUD, Controls, Ads)
│   ├── game/
│   │   ├── config/                   # Game & physics constants
│   │   ├── core/                     # GameManager lifecycle
│   │   ├── data/                     # Levels & physics presets (343 platforms)
│   │   ├── entities/                 # Player & Platform entities
│   │   ├── physics/                  # PlayerPhysics, JumpController, CollisionSystem
│   │   ├── scenes/                   # Phaser MainGameScene
│   │   └── systems/                  # Camera, Audio, Input, Level systems
│   └── store/                        # Zustand game state
└── tests/
    ├── unit/                         # Vitest physics & calibration tests
    └── e2e/                          # Playwright browser interaction tests
```

---

## 🧪 Testing & Verification

### Unit Tests (Vitest)
Verifies mathematical physics formulas, charge accumulation, launch impulse, and trajectory apex heights:
```bash
npm run test:unit
```

### End-to-End Tests (Playwright)
Executes real browser scenarios verifying direct game access, 9:16 viewport, desktop ad units, mobile touch controls, spacebar jump charging, pause modal, and restart flow:
```bash
npm run test:e2e
```

### Production Build
Verifies static page generation and SSR safety:
```bash
npm run build
npm run start
```
