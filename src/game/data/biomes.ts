import { BiomeId } from '@/types/game';

export interface AltitudeTier {
  range: [number, number]; // [startScreen, endScreen] inclusive
  name: string;
  subtheme: string;
  ambientColor: string;
  skyGradient: [string, string]; // Top color, Bottom color
}

export interface PlatformVisualTheme {
  surfaceColor: number; // Hex integer for Phaser
  borderColor: number;
  glowColor?: number;
  pattern: 'brick' | 'obsidian' | 'bark' | 'ice' | 'neon' | 'marble' | 'brass' | 'sandstone' | 'crystal' | 'gothic' | 'candy';
  isSlipperyByDefault?: boolean;
  iceScreens?: number[];
  bouncyScreens?: number[];
}

export interface BiomeDefinition {
  id: BiomeId;
  name: string;
  subtitle: string;
  description: string;
  previewImage: string;
  accentColor: string;
  badgeColor: string;
  particleType:
    | 'none'
    | 'embers'
    | 'pollen'
    | 'snow'
    | 'neon'
    | 'bubbles'
    | 'steam'
    | 'sand'
    | 'starlight'
    | 'fog'
    | 'candysparkle';
  totalScreens: number;
  layoutHeight: number;
  tiers: AltitudeTier[];
  platformTheme: PlatformVisualTheme;
}

export const BIOME_CATALOG: Record<BiomeId, BiomeDefinition> = {
  default: {
    id: 'default',
    name: 'King’s Citadel & Bog',
    subtitle: 'The Classic Jump King Climb',
    description: 'The authentic original reverse-engineered 42-screen vertical castle tower climb, from the misty bog courtyard up to the royal summit.',
    previewImage: '/assets/images/biomes/biome0_default.jpg',
    accentColor: '#F59E0B',
    badgeColor: '#78350F',
    particleType: 'none',
    totalScreens: 42,
    layoutHeight: 15120,
    tiers: [
      { range: [0, 3], name: 'Courtyard & Bog', subtheme: 'Misty Stone', ambientColor: '#3E4A3D', skyGradient: ['#2A342B', '#485746'] },
      { range: [4, 9], name: 'Overgrown Bastion', subtheme: 'Forest Foliage', ambientColor: '#2D4436', skyGradient: ['#1C3024', '#3F5E4C'] },
      { range: [10, 19], name: 'Mountain Spire', subtheme: 'Granite Crags', ambientColor: '#3B414B', skyGradient: ['#232830', '#4A5361'] },
      { range: [20, 29], name: 'Storm Tower', subtheme: 'Thunder Bastion', ambientColor: '#2E3547', skyGradient: ['#1B2030', '#434D69'] },
      { range: [30, 41], name: 'Citadel Clouds & Summit', subtheme: 'Royal Apex', ambientColor: '#4A3B4E', skyGradient: ['#2F2433', '#68506E'] },
    ],
    platformTheme: {
      surfaceColor: 0x5a6351,
      borderColor: 0x2d3429,
      pattern: 'brick',
      iceScreens: [33, 34, 35],
    },
  },

  volcano: {
    id: 'volcano',
    name: 'The Infernal Caldera',
    subtitle: 'Subterranean Magma Spire',
    description: 'Climb a high-tension active volcano from bubbling molten obsidian pits past sulfur caverns and iron citadel ruins to the dragon’s crater summit.',
    previewImage: '/assets/images/biomes/biome1_volcano.jpg',
    accentColor: '#FF3D00',
    badgeColor: '#7F1D1D',
    particleType: 'embers',
    totalScreens: 50,
    layoutHeight: 18000,
    tiers: [
      { range: [0, 9], name: 'Obsidian Molten Basin', subtheme: 'Lava Floors', ambientColor: '#2D0A05', skyGradient: ['#1F0503', '#4A1108'] },
      { range: [10, 19], name: 'Sulfur Caverns', subtheme: 'Toxic Vents', ambientColor: '#382205', skyGradient: ['#241503', '#523408'] },
      { range: [20, 29], name: 'Magma Citadel', subtheme: 'Iron Ramparts', ambientColor: '#300D09', skyGradient: ['#1C0705', '#45150F'] },
      { range: [30, 39], name: 'Ash Chasm', subtheme: 'Pumice Bridges', ambientColor: '#261215', skyGradient: ['#14080A', '#3D1C22'] },
      { range: [40, 49], name: 'The Dragon’s Maw', subtheme: 'Volcano Apex', ambientColor: '#400803', skyGradient: ['#260401', '#5C0F07'] },
    ],
    platformTheme: {
      surfaceColor: 0x2b1c1c,
      borderColor: 0xff4500,
      glowColor: 0xff2200,
      pattern: 'obsidian',
    },
  },

  worldtree: {
    id: 'worldtree',
    name: 'The Overgrown World-Tree',
    subtitle: 'Yggdrasil Primordial Ascent',
    description: 'Leap through an ancient colossal world tree, scaling bioluminescent root loam, hollow bark tunnels, broad canopy boughs, and starry celestial branches.',
    previewImage: '/assets/images/biomes/biome2_worldtree.jpg',
    accentColor: '#4ADE80',
    badgeColor: '#14532D',
    particleType: 'pollen',
    totalScreens: 50,
    layoutHeight: 18000,
    tiers: [
      { range: [0, 9], name: 'Primordial Root Loam', subtheme: 'Glowing Fungi', ambientColor: '#0E2E1B', skyGradient: ['#071A0E', '#164227'] },
      { range: [10, 19], name: 'Hollow Bark Tunnels', subtheme: 'Amber Heartwood', ambientColor: '#2A1F0D', skyGradient: ['#171107', '#3D2D13'] },
      { range: [20, 29], name: 'Emerald Canopy', subtheme: 'Ivy & Leaf Pads', ambientColor: '#113B22', skyGradient: ['#0A2415', '#1B5432'] },
      { range: [30, 39], name: 'Blossom Reaches', subtheme: 'Pink Flora Winds', ambientColor: '#2E192B', skyGradient: ['#1B0E19', '#42243E'] },
      { range: [40, 49], name: 'Celestial Crown', subtheme: 'Stratosphere Boughs', ambientColor: '#0A2738', skyGradient: ['#04141D', '#113E59'] },
    ],
    platformTheme: {
      surfaceColor: 0x3e2723,
      borderColor: 0x4caf50,
      glowColor: 0x81c784,
      pattern: 'bark',
    },
  },

  glacier: {
    id: 'glacier',
    name: 'The Frostbitten Glacier',
    subtitle: 'Sub-Zero Permafrost Peak',
    description: 'An icy expedition across snowdrifts, ultra-slick blue glacial crevices, timber huts, blizzard ridges, and the shimmering aurora borealis summit.',
    previewImage: '/assets/images/biomes/biome3_glacier.jpg',
    accentColor: '#38BDF8',
    badgeColor: '#0C4A6E',
    particleType: 'snow',
    totalScreens: 50,
    layoutHeight: 18000,
    tiers: [
      { range: [0, 9], name: 'Frosted Pine Taiga', subtheme: 'Snowdrifts', ambientColor: '#152433', skyGradient: ['#0B151F', '#20364C'] },
      { range: [10, 19], name: 'Glacial Crevasses', subtheme: 'Pure Ice', ambientColor: '#0C2D42', skyGradient: ['#061926', '#144666'] },
      { range: [20, 29], name: 'Avalanche Ridge', subtheme: 'Granite & Timber', ambientColor: '#1C2938', skyGradient: ['#0E1721', '#2C3E52'] },
      { range: [30, 39], name: 'Blizzard Spires', subtheme: 'Icicle Bridges', ambientColor: '#12263A', skyGradient: ['#081421', '#1D3B59'] },
      { range: [40, 49], name: 'Aurora Borealis Peak', subtheme: 'Polar Lights', ambientColor: '#1B143A', skyGradient: ['#0D0821', '#2C1F5E'] },
    ],
    platformTheme: {
      surfaceColor: 0x1e3a5f,
      borderColor: 0x38bdf8,
      glowColor: 0x7dd3fc,
      pattern: 'ice',
      isSlipperyByDefault: false,
      iceScreens: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 35, 36, 37],
    },
  },

  cyberpunk: {
    id: 'cyberpunk',
    name: 'The Cyberpunk Megacity',
    subtitle: 'Neo-Kyoto Skyline Ascent',
    description: 'Scale a vertical dystopian megalopolis from rain-soaked neon alleyways and monorail skyways up past massive data server spires to the apex helipad.',
    previewImage: '/assets/images/biomes/biome4_cyberpunk.jpg',
    accentColor: '#F43F5E',
    badgeColor: '#881337',
    particleType: 'neon',
    totalScreens: 50,
    layoutHeight: 18000,
    tiers: [
      { range: [0, 9], name: 'Neon Underbelly', subtheme: 'Rain & Alleyways', ambientColor: '#181124', skyGradient: ['#0C0714', '#26183B'] },
      { range: [10, 19], name: 'Transit Skyways', subtheme: 'Holographic Rails', ambientColor: '#0E1C2B', skyGradient: ['#070E17', '#172C42'] },
      { range: [20, 29], name: 'Corporate Mid-Tiers', subtheme: 'Glass Catwalks', ambientColor: '#121F24', skyGradient: ['#081014', '#1E323A'] },
      { range: [30, 39], name: 'Server Core Spires', subtheme: 'Cooling Fans', ambientColor: '#240F1F', skyGradient: ['#140711', '#3B1832'] },
      { range: [40, 49], name: 'Apex Helipad Penthouse', subtheme: 'Twilight Clouds', ambientColor: '#1A0E2E', skyGradient: ['#0D0619', '#2C164D'] },
    ],
    platformTheme: {
      surfaceColor: 0x1f1b2e,
      borderColor: 0xf43f5e,
      glowColor: 0x00f0ff,
      pattern: 'neon',
    },
  },

  atlantis: {
    id: 'atlantis',
    name: 'The Sunken Atlantis',
    subtitle: 'Abyssal Trench to Surface Atoll',
    description: 'Ascend from pitch-black hydrothermal abyssal trenches through barnacle-encrusted marble temples, kelp forests, and coral reefs to a sunny tropical lagoon.',
    previewImage: '/assets/images/biomes/biome5_atlantis.jpg',
    accentColor: '#14B8A6',
    badgeColor: '#134E4A',
    particleType: 'bubbles',
    totalScreens: 50,
    layoutHeight: 18000,
    tiers: [
      { range: [0, 9], name: 'Abyssal Sea Floor', subtheme: 'Hydrothermal Vents', ambientColor: '#06131F', skyGradient: ['#02080D', '#0B2236'] },
      { range: [10, 19], name: 'Sunken Temple Ruins', subtheme: 'Marble Columns', ambientColor: '#0B252E', skyGradient: ['#051317', '#133E4D'] },
      { range: [20, 29], name: 'Giant Kelp Forest', subtheme: 'Swaying Stalks', ambientColor: '#0C2E24', skyGradient: ['#051712', '#144A3A'] },
      { range: [30, 39], name: 'Vibrant Coral Reef', subtheme: 'Sunbeams & Flora', ambientColor: '#0F3842', skyGradient: ['#071C21', '#195666'] },
      { range: [40, 49], name: 'Tropical Atoll Surface', subtheme: 'Turquoise Lagoon', ambientColor: '#124859', skyGradient: ['#08242D', '#1E6E87'] },
    ],
    platformTheme: {
      surfaceColor: 0x133e4d,
      borderColor: 0x14b8a6,
      glowColor: 0x2dd4bf,
      pattern: 'marble',
    },
  },

  steampunk: {
    id: 'steampunk',
    name: 'The Steampunk Engine',
    subtitle: 'The Great Gear Spire',
    description: 'A colossal kinetic Victorian clockwork tower powered by roaring boiler fires, interlocking brass gears, copper steam ducts, and swinging pendulums.',
    previewImage: '/assets/images/biomes/biome6_steampunk.jpg',
    accentColor: '#F59E0B',
    badgeColor: '#78350F',
    particleType: 'steam',
    totalScreens: 50,
    layoutHeight: 18000,
    tiers: [
      { range: [0, 9], name: 'Boiler & Furnace Core', subtheme: 'Firebox Combustion', ambientColor: '#2B160C', skyGradient: ['#170B05', '#422314'] },
      { range: [10, 19], name: 'Interlocking Cogs', subtheme: 'Brass Gears', ambientColor: '#2B220C', skyGradient: ['#171205', '#453512'] },
      { range: [20, 29], name: 'Steam Conduits', subtheme: 'Pressure Catwalks', ambientColor: '#1F2429', skyGradient: ['#0F1214', '#323A42'] },
      { range: [30, 39], name: 'Chronometer Gallery', subtheme: 'Pendulums & Dials', ambientColor: '#2E2211', skyGradient: ['#171107', '#47351A'] },
      { range: [40, 49], name: 'The Great Belfry Pinnacle', subtheme: 'Foggy Skyline', ambientColor: '#262429', skyGradient: ['#121114', '#3D3A42'] },
    ],
    platformTheme: {
      surfaceColor: 0x3d2b1f,
      borderColor: 0xd4af37,
      glowColor: 0xfbbf24,
      pattern: 'brass',
    },
  },

  necropolis: {
    id: 'necropolis',
    name: 'The Desert Necropolis',
    subtitle: 'Pyramid of the Sun King',
    description: 'Climb an ancient Egyptian necropolis from desert dunes and torchlit sarcophagus chambers through royal lapis lazuli halls to the solid gold apex pyramidion.',
    previewImage: '/assets/images/biomes/biome7_necropolis.jpg',
    accentColor: '#EAB308',
    badgeColor: '#713F12',
    particleType: 'sand',
    totalScreens: 50,
    layoutHeight: 18000,
    tiers: [
      { range: [0, 9], name: 'Dune Oasis Base', subtheme: 'Desert Sands', ambientColor: '#2E200C', skyGradient: ['#170F05', '#473213'] },
      { range: [10, 19], name: 'Sarcophagus Vault', subtheme: 'Hieroglyphic Walls', ambientColor: '#301E11', skyGradient: ['#170E07', '#4C301B'] },
      { range: [20, 29], name: 'Lapis Hall of Anubis', subtheme: 'Royal Blue Columns', ambientColor: '#101B36', skyGradient: ['#070C1A', '#192C59'] },
      { range: [30, 39], name: 'Colossus Statues', subtheme: 'Pharaoh Carvings', ambientColor: '#33230F', skyGradient: ['#1A1107', '#523817'] },
      { range: [40, 49], name: 'The Gilded Pyramidion', subtheme: 'Solar Eclipse Peak', ambientColor: '#3B2A08', skyGradient: ['#1F1503', '#5E430B'] },
    ],
    platformTheme: {
      surfaceColor: 0x42311c,
      borderColor: 0xeab308,
      glowColor: 0xfde047,
      pattern: 'sandstone',
    },
  },

  cosmic: {
    id: 'cosmic',
    name: 'The Cosmic Void',
    subtitle: 'Staircase to the Stars',
    description: 'Ascend beyond gravity across ancient brass astronomical observatories, floating nebula marble stairs, asteroid drifts, and hard-light constellation bridges.',
    previewImage: '/assets/images/biomes/biome8_cosmic.jpg',
    accentColor: '#A855F7',
    badgeColor: '#581C87',
    particleType: 'starlight',
    totalScreens: 50,
    layoutHeight: 18000,
    tiers: [
      { range: [0, 9], name: 'Forgotten Star Observatory', subtheme: 'Brass Telescopes', ambientColor: '#171126', skyGradient: ['#0A0712', '#261C3D'] },
      { range: [10, 19], name: 'Nebula Mist Falls', subtheme: 'Floating Marble', ambientColor: '#210F33', skyGradient: ['#10061A', '#381A54'] },
      { range: [20, 29], name: 'Asteroid Drift', subtheme: 'Comet Ice Rocks', ambientColor: '#0E172E', skyGradient: ['#060B17', '#17264A'] },
      { range: [30, 39], name: 'Constellation Bridges', subtheme: 'Hard-Light Nodes', ambientColor: '#1A0E38', skyGradient: ['#0C061C', '#2F1963'] },
      { range: [40, 49], name: 'The Galaxy Core', subtheme: 'Swirling Supernova', ambientColor: '#280A3D', skyGradient: ['#140321', '#47106B'] },
    ],
    platformTheme: {
      surfaceColor: 0x1d1430,
      borderColor: 0xa855f7,
      glowColor: 0xc084fc,
      pattern: 'crystal',
    },
  },

  gothic: {
    id: 'gothic',
    name: 'The Gothic Catacombs',
    subtitle: 'Belfry of the Damned',
    description: 'A dark gothic horror climb from misty tombstones and skull catacombs through towering cathedral stained-glass naves and high gargoyle rafters to the blood-moon belfry.',
    previewImage: '/assets/images/biomes/biome9_gothic.jpg',
    accentColor: '#E11D48',
    badgeColor: '#4C0519',
    particleType: 'fog',
    totalScreens: 50,
    layoutHeight: 18000,
    tiers: [
      { range: [0, 9], name: 'Misty Graveyard & Crypt', subtheme: 'Tombstones & Fog', ambientColor: '#121A16', skyGradient: ['#080C0B', '#1E2B24'] },
      { range: [10, 19], name: 'Skull Catacombs', subtheme: 'Bone Niches', ambientColor: '#1A1414', skyGradient: ['#0D0A0A', '#2E2222'] },
      { range: [20, 29], name: 'Cathedral Nave', subtheme: 'Stained Glass Arches', ambientColor: '#1C1224', skyGradient: ['#0D0812', '#301F3D'] },
      { range: [30, 39], name: 'Gargoyle Rafters', subtheme: 'High Timber Beams', ambientColor: '#14141A', skyGradient: ['#09090D', '#22222E'] },
      { range: [40, 49], name: 'The Eclipse Belfry', subtheme: 'Blood Moon Spire', ambientColor: '#260B12', skyGradient: ['#140408', '#42121E'] },
    ],
    platformTheme: {
      surfaceColor: 0x212124,
      borderColor: 0xe11d48,
      glowColor: 0x881337,
      pattern: 'gothic',
    },
  },

  candyland: {
    id: 'candyland',
    name: 'The Candyland Fantasy Spire',
    subtitle: 'Confectionery Mountain Peak',
    description: 'A whimsical retro sugar wonderland climbing past marshmallow foothills, candy cane spiral canyon columns, bouncy gelatin gummy caves, and royal gingerbread palaces.',
    previewImage: '/assets/images/biomes/biome10_candyland.jpg',
    accentColor: '#EC4899',
    badgeColor: '#831843',
    particleType: 'candysparkle',
    totalScreens: 50,
    layoutHeight: 18000,
    tiers: [
      { range: [0, 9], name: 'Marshmallow Foothills', subtheme: 'Chocolate Fudge', ambientColor: '#29141E', skyGradient: ['#170A10', '#422030'] },
      { range: [10, 19], name: 'Candy Cane Canyon', subtheme: 'Peppermint Columns', ambientColor: '#2B161B', skyGradient: ['#170A0E', '#45222B'] },
      { range: [20, 29], name: 'Gummy Bear Caverns', subtheme: 'Bouncy Gelatin', ambientColor: '#142922', skyGradient: ['#091712', '#214539'] },
      { range: [30, 39], name: 'Cotton Candy Clouds', subtheme: 'Sugar Fluff & Pops', ambientColor: '#291730', skyGradient: ['#140A1A', '#452552'] },
      { range: [40, 49], name: 'Royal Gingerbread Castle', subtheme: 'Icing Spire Apex', ambientColor: '#301D11', skyGradient: ['#1A0F08', '#4D2E1B'] },
    ],
    platformTheme: {
      surfaceColor: 0x4a2e2b,
      borderColor: 0xec4899,
      glowColor: 0xf472b6,
      pattern: 'candy',
      bouncyScreens: [20, 21, 22, 23, 24],
    },
  },
};
