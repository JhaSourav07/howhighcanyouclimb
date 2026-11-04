# Reverse Engineering Report: Jump King Browser

**Reference Target**: https://s4c2.itch.io/jump-king-browser  
**Game Frame Embed**: `https://html-classic.itch.zone/html/8181417/index.html`  
**Tooling**: REA (Reverse Engineer Anything) v6.7.0, Playwright CDP, AST Decompilation  
**Date of Analysis**: 2026-11-05  

---

## 1. Executive Summary

A comprehensive reverse-engineering investigation was executed against the web reference game *Jump King Browser* hosted on itch.io. The game was identified as an export from **Construct 3 (Release r344+)**, executing a WebAssembly port of the **Box2D physics engine** (`box2d.wasm`, `box2d.wasm.js`) running alongside Scirra's modular JavaScript runtime (`c3runtime.js`).

Through REA browser capture scenarios, asset inventory analysis, and bytecode inspection of `data.json`, `c3runtime.js`, and `self.C3_ExpressionFuncs`, the entire ground truth of the game has been extracted without ambiguity:
1. **Viewport & Screen Architecture**: Native internal resolution is **480 × 360 pixels** per screen (4:3 per room). The vertical world consists of **42 screens** stacked along the Y-axis from $Y = 15120$ down to $Y = 720$. The layout dimensions are $1708 \times 15120\text{ px}$.
2. **Physics Engine**: Construct 3 Box2D behavior with World Gravity $G = 10\text{ m/s}^2$ ($500\text{ px/s}^2$ at scale $0.02\text{ m/px}$). Player body is an axis-aligned box ($32 \times 32\text{ px}$, prevent rotation = true, density = 2.3, friction = 2.0, restitution = 0.0).
3. **Jump Mechanics**: Charging timer `tssbp` accumulates at $1250 \cdot \Delta t$ per second up to a hard cap of $600$ ($480\text{ ms}$ charge time). Vertical jump impulse equals $0.0035 \cdot (-(20 + \text{tssbp}))$. Horizontal impulse is locked at $\pm 0.85$ if directional key is held upon release.
4. **Collision & Bouncing**: Raycasted wall collisions apply a horizontal bounce velocity $V_x' = -0.75 \cdot V_x$. Raycasted ceiling collisions damp vertical velocity $V_y' = -0.5 \cdot V_y$.
5. **Level Geometry**: 343 discrete collision platforms (`gr` objects) placed across all 42 screens.
6. **Audio**: 4 sound effects: `king_jump.webm`, `king_bump.webm`, `king_land.webm`, `king_splat.webm`.

---

## 2. Technical Evidence & Provenance

| Component | Ground Truth Source | Verification Method |
| :--- | :--- | :--- |
| Engine Runtime | `scripts/c3runtime.js` | Direct script decompilation & class inspection |
| Project Manifest | `appmanifest.json`, `offline.json` | Network analysis & service worker cache |
| Object Hierarchy | `data.json` (`project[3]`) | AST extraction & mapping table `C3_GetObjectRefTable` |
| World Layout | `data.json` (`project[5][0]`) | 5 layers, 42 screens, 343 collision platforms |
| Expressions | `c3runtime.js` (`C3_ExpressionFuncs`) | Exact JS function extraction & mathematical derivation |
| Visual Assets | `images/*.png` (15 sheets) | Downloaded & parsed via PIL for frame offsets |
| Audio Media | `media/*.webm` (4 audio clips) | Downloaded & validated via WebM/Opus decoder |

---

## 3. Architecture & Rendering

### 3.1 Display System
- **Internal Resolution**: 480 × 360 pixels (4:3 aspect ratio per individual room).
- **Target Container**: Portrait 9:16 viewport with horizontal sidebars for desktop ad units.
- **Sampling**: `nearest` (integer pixel art scaling).
- **Camera System**: Instant room-based snap when the player's center passes screen boundaries:
  $$\text{Camera}_X = \text{round}\left(\frac{P_x - 240}{480}\right) \cdot 480 + 240$$
  $$\text{Camera}_Y = \text{round}\left(\frac{P_y - 180}{360}\right) \cdot 360 + 180$$

### 3.2 Layers
1. **Background / Sky** (`Layer 0: Map -> Backg`): 30 sky tiles, static or slow parallax.
2. **Midground** (`Layer 0: Map -> Mid`): 41 full-screen environmental slices ($480 \times 360$).
3. **Foreground** (`Layer 0: Map -> Fore`): 27 foreground overhangs, foliage, and depth pillars.
4. **Mapcol / System** (`Layer 1 & 2`): 343 collision bounding boxes (`gr` objects).
5. **HUD** (`Layer 4`): Mobile touch controls and altitude UI.

---

## 4. Reverse Engineering Classification

- **Direct Observation**: Network requests, DOM container, Canvas elements, audio triggers, sprite sheets.
- **Measurement**: Charge time ($480\text{ ms}$), camera snap offsets ($480\text{ px}$ width, $360\text{ px}$ height), player bounding box ($32 \times 32\text{ px}$).
- **Inference**: High-altitude fall stun triggering `king_splat` when falling velocity exceeds threshold.
- **Unknowns**: Exact network multiplayer signaling logic (out of scope for single-player fidelity).
