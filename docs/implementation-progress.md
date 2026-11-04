# Implementation Progress & Milestone Tracker: Jump King Browser

---

## Roadmap & Status

- [x] **PHASE 1: REVERSE ENGINEERING**
  - [x] Configure and validate REA v6.7.0 environment.
  - [x] Extract project files, manifest, and runtime scripts from itch.io target.
  - [x] Decompile Construct 3 AST and expression function table.
  - [x] Extract exact Box2D physics parameters ($G=10\text{ m/s}^2$, density, friction).
  - [x] Extract jump charging formulas ($1250\cdot \Delta t$, max 600, vertical impulse $0.0035\cdot -(20+\text{charge})$).
  - [x] Extract horizontal jump impulses ($\pm 0.85$) and wall bounce restitution ($75\%$).
  - [x] Extract all 343 platform coordinates across 42 screens.
  - [x] Download reference spritesheets, textures, and audio files.
  - [x] Produce complete technical reverse-engineering documentation.

- [ ] **PHASE 2: PROJECT INITIALIZATION**
  - [ ] Initialize Next.js 15 App Router with TypeScript & Tailwind CSS.
  - [ ] Install Phaser 3 and supporting libraries.
  - [ ] Establish 9:16 portrait viewport container with centered framing.
  - [ ] Set up desktop side advertising containers.
  - [ ] Configure Phaser game mounting and clean unmounting lifecycle.

- [ ] **PHASE 3: PHYSICS ENGINE & JUMP CONTROLLER**
  - [ ] Implement deterministic fixed timestep physics integrator.
  - [ ] Implement AABB & polygon collision detection against platform geometry.
  - [ ] Implement JumpController with identical charge accumulation and impulse math.
  - [ ] Implement locked horizontal jump trajectories with zero air-steering.
  - [ ] Implement wall bounce velocity inversion ($-0.75 \cdot V_x$).
  - [ ] Implement ceiling damping ($-0.50 \cdot V_y$).

- [ ] **PHASE 4: GAME WORLD & SCREENS**
  - [ ] Reconstruct 42 screens with data-driven platform loaders.
  - [ ] Implement room-snapping camera transitions ($480 \times 360\text{ px}$).
  - [ ] Implement fall physics through screen transitions.
  - [ ] Integrate multi-layered parallax backgrounds (Sky, Midground, Foreground).

- [ ] **PHASE 5: VISUAL FIDELITY & ANIMATION**
  - [ ] Integrate 8-state player sprite animation system.
  - [ ] Configure sprite mirroring based on facing direction.
  - [ ] Add dust and jump launch particle effects.
  - [ ] Implement pixel-art nearest neighbor scaling filter.

- [ ] **PHASE 6: AUDIO & CONTROLS**
  - [ ] Implement AudioSystem for `king_jump`, `king_bump`, `king_land`, `king_splat`.
  - [ ] Desktop keyboard inputs (Space, WASD, Arrow keys).
  - [ ] Mobile responsive touch controls.

- [ ] **PHASE 7: TESTING & VALIDATION**
  - [ ] Physics unit tests verifying exact formula outputs.
  - [ ] Playwright E2E browser tests.
  - [ ] Visual regression test comparisons.
