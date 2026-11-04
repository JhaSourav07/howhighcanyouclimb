# Level Architecture & Geometry Analysis: Jump King Browser

**Reference**: Construct 3 Layout `main` ($1708 \times 15120\text{ px}$)  
**Total Screens**: 42 vertical screens  
**Total Collision Platforms**: 343 discrete `gr` instances  

---

## 1. World Coordinate System

- **Layout Dimensions**: Width $W = 1708\text{ px}$, Height $H = 15120\text{ px}$.
- **Screen Dimensions**: Width $S_w = 480\text{ px}$, Height $S_h = 360\text{ px}$.
- **Horizontal Framing**: Playable viewport is centered horizontally at $X = [0, 480]$ (center $X = 240$).
- **Vertical Indexing**:
  - The game world is arranged as a vertical tower starting at the bottom floor:
    - **Screen 0 (Starting Room)**: $Y \in [14760, 15120]$, Center $Y = 14940$.
    - **Screen 1**: $Y \in [14400, 14760]$, Center $Y = 14580$.
    - **Screen 2**: $Y \in [14040, 14400]$, Center $Y = 14220$.
    - ...
    - **Screen 41 (The Summit)**: $Y \in [0, 360]$, Center $Y = 180$.

$$\text{Screen Index } k = \left\lfloor \frac{15120 - Y}{360} \right\rfloor$$
$$\text{Screen Top } Y = 15120 - (k + 1) \cdot 360$$
$$\text{Screen Bottom } Y = 15120 - k \cdot 360$$

---

## 2. Spawn Points & Checkpoints

- **Player Starting Position**:
  $$X_0 = 241.83\text{ px}, \quad Y_0 = 15071.11\text{ px}$$
  (Located centered on the bottom stone ground of Screen 0).
- **Checkpoints**: True to Jump King's design, there are **no arbitrary checkpoints or save states**. If the player falls, they tumble all the way down until colliding with a lower platform.

---

## 3. Platform Distribution Across Screens

| Screen Range | Theme / Environment | Platform Density | Hazard / Special Features |
| :--- | :--- | :--- | :--- |
| **0 – 3** | Castle Courtyard / Lower Bastion | 4–9 platforms/screen | Wide tutorial ledges, zero bounce traps |
| **4 – 9** | Forest & Overgrown Ramparts | 10–27 platforms/screen | Narrow pillars, diagonal ricochet walls |
| **10 – 19** | Mountain Ascents & Caves | 8–15 platforms/screen | Slippery ice ledges (`slipry = 1`), wind gusts |
| **20 – 29** | Storm Peaks & Ruined Spires | 6–12 platforms/screen | High punishment drops back down 5+ screens |
| **30 – 39** | Tower Clouds & Citadel Spire | 5–10 platforms/screen | Maximum precision horizontal gaps |
| **40 – 41** | The Summit / The Smoking Hot Babe | 3–6 platforms/screen | Final victory platform (`end` object) |

---

## 4. Platform Data Format

Each platform in the extracted dataset is defined by:
```typescript
interface PlatformGeometry {
  id: number;
  screenIndex: number;
  x: number;      // Center X coordinate
  y: number;      // Center Y coordinate
  width: number;  // Bounding width
  height: number; // Bounding height
  isSlippery: boolean; // slipry property (ice)
  noMovement: boolean; // nomv property
}
```
All 343 platform objects are preserved in `src/game/data/levels.ts`.
