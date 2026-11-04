/**
 * Game configuration constants derived from reference reverse-engineering.
 */

export const GAME_CONFIG = {
  // Native per-screen resolution in reference Construct 3 export
  SCREEN_WIDTH: 480,
  SCREEN_HEIGHT: 360,

  // Total world layout dimensions (42 vertical screens)
  LAYOUT_WIDTH: 1708,
  LAYOUT_HEIGHT: 15120,
  TOTAL_SCREENS: 42,

  // Camera settings
  CAMERA: {
    WIDTH: 480,
    HEIGHT: 360,
    LERP: 0.15, // Smooth room transition
  },

  // Player initial spawn point (Screen 0 courtyard ground)
  PLAYER_START: {
    X: 241.83,
    Y: 15071.11,
    WIDTH: 32,
    HEIGHT: 32,
  },

  // Target portrait viewport ratio (9:16)
  PORTRAIT_ASPECT_RATIO: 9 / 16,
} as const;
