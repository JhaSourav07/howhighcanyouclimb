# Known Differences & Technical Boundaries: Jump King Browser

---

## 1. Intentional Exclusions

1. **Scirra Multiplayer Signaling**:
   - The reference Construct 3 export included unused or experimental Scirra signaling multiplayer blocks (`wss://multiplayer.scirra.com`).
   - *Rationale*: Jump King is inherently a single-player tactical climbing challenge. The recreation deliberately focuses on 100% single-player mechanical fidelity and excludes extraneous multiplayer networking.

2. **Construct 3 Modding Menu**:
   - The reference had placeholder groups for "Lava mod" and "Drunk mod".
   - *Rationale*: Excluded to preserve pure canonical Jump King gameplay without cluttering the UI.

---

## 2. Intentional Modern Improvements

1. **Architecture & Technology**:
   - Replaced heavy 1.6MB monolithic Construct 3 runtime with a clean, modular TypeScript + Phaser 3 + Next.js App Router stack.
   - Decoupled high-frequency 60fps game physics loop from React rendering.
2. **Audio Fallback**:
   - Implemented Web Audio API synthesis fallback so game sound effects play even in browsers or environments where external WebM files are blocked or offline.
3. **Responsive 9:16 Framing**:
   - Responsive container strictly locks the 9:16 portrait viewport on mobile and centers it on desktop with dedicated non-intrusive advertising containers on the left and right.
