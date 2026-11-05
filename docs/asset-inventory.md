# Asset Inventory & Provenance Ledger: Jump King Browser

**Reference Origin**: `https://html-classic.itch.zone/html/8181417/`  
**License / Preservation**: Reverse-engineered for high-fidelity research & recreation  

---

## 1. Visual Spritesheets & Tiles

| Asset Path | Resolution / Size | Role & Contents |
| :--- | :--- | :--- |
| `images/pla-sheet0.png` | $128 \times 256\text{ px}$ (8.8 KB) | Player character spritesheet: Sir Hopsalot (Frog Adventurer) with 8 states: Idle, Walk (3 frames), Charge, Jump, Fall, Splat. Original king backed up in `pla-sheet0-original.png`. |
| `images/col-sheet0.png` | $480 \times 360\text{ px}$ (54.5 KB) | Static collision mask overlay |
| `images/lava-sheet0.png` | $500 \times 100\text{ px}$ (3.5 KB) | Lava hazard texture slice |
| `images/midground-sheet0.png` | $2048 \times 2048\text{ px}$ (9.6 MB) | Full-color environmental screen slices 0–19 |
| `images/midground-sheet1.png` | $2048 \times 2048\text{ px}$ (6.1 MB) | Full-color environmental screen slices 20–39 |
| `images/midground-sheet2.png` | $202\text{ bytes}$ | Transparent fill tile |
| `images/foreground-sheet0.png`| $2048 \times 2048\text{ px}$ (3.3 MB) | Foreground arches, foliage, columns |
| `images/sky-sheet0.png` | $2048 \times 2048\text{ px}$ (7.4 MB) | Sky backgrounds & atmospheric gradients |
| `images/shared-0-sheet0.png` | $451\text{ KB}$ | UI icons, HUD controls, button sprites |

---

## 2. Audio SFX Manifest

| Audio File | Format / Codec | Duration | Gameplay Trigger |
| :--- | :--- | :--- | :--- |
| `media/king_jump.webm` | Opus in WebM (4.2 KB) | 0.28s | Triggered on jump execution release |
| `media/king_bump.webm` | Opus in WebM (6.4 KB) | 0.42s | Triggered on wall ricochet or ceiling bump |
| `media/king_land.webm` | Opus in WebM (4.3 KB) | 0.31s | Triggered on safe platform landing |
| `media/king_splat.webm` | Opus in WebM (3.0 KB) | 0.65s | Triggered on high-velocity fall stun |

---

## 3. Pixel Framing of Player Sprites (`pla-sheet0.png`)

All player frames are framed with origin $(0.5, 0.5)$ within a $32 \times 32\text{ px}$ bounding box:

| Animation | Frame | Atlas Offset $(X, Y)$ | Box Size $(W, H)$ | Meaning |
| :--- | :--- | :--- | :--- | :--- |
| **Idle** | 0 | $(69, 193)$ | $32 \times 32$ | Standing breathing idle |
| **Walk** | 0 | $(1, 193)$ | $32 \times 32$ | Step forward |
| **Walk** | 1 | $(69, 129)$ | $32 \times 32$ | Mid stride |
| **Walk** | 2 | $(35, 193)$ | $32 \times 32$ | Push off step |
| **Jump** | 0 | $(69, 65)$ | $32 \times 32$ | Upward reach / ascend |
| **Fall** | 0 | $(35, 129)$ | $32 \times 32$ | Arms tucked downward |
| **Charge** | 0 | $(65, 1)$ | $32 \times 32$ | Deep crouch charge |
| **Splat** | 0 | $(35, 65)$ | $32 \times 32$ | Faceplant ground impact |
