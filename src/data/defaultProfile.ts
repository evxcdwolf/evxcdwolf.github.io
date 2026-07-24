import { UserProfile, StickerConfig, BackgroundConfig, LifeIndexData, ContactLink, TechStackItem, ProjectCard, AudioTrack, FoxgirlPreset } from '../types';

// Dynamically auto-discover all background images in /src/assets/bg/
const bgModules = import.meta.glob('../assets/bg/*.{jpg,jpeg,png,webp,svg,gif}', { eager: true, import: 'default' });
export const DYNAMIC_BACKGROUND_POOL = Object.values(bgModules) as string[];

// Dynamically auto-discover all PNG mascot stickers in /src/assets/png/
const pngModules = import.meta.glob('../assets/png/*.{jpg,jpeg,png,webp,svg,gif}', { eager: true, import: 'default' });
export const DYNAMIC_STICKER_POOL = Object.values(pngModules) as string[];

// Helper to pick a random item from an array
const getRandomItem = <T>(array: T[], fallback: T): T => {
  if (!array || array.length === 0) return fallback;
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};

const initialBg = getRandomItem(DYNAMIC_BACKGROUND_POOL, '');
const initialMascot = getRandomItem(DYNAMIC_STICKER_POOL, '');

export const DEFAULT_BACKGROUND_CONFIG: BackgroundConfig = {
  activeBgUrl: initialBg,
  backgroundPool: DYNAMIC_BACKGROUND_POOL,
  randomBgOnReload: true,
  overlayOpacity: 0.65,
  blurAmount: 2,
};

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: 'Evxcdwolf',
  username: '@evxcdwolf',
  title: 'Art collector & Fox lover',
  subtitle: 'Welcome to Evxcdwolf life index.',
  location: 'Cyberpunk District • Online 24/7',
  statusText: 'Art collector & Fox lover',
  statusEmoji: '🦊',
  bio: 'Personal index and gallery showcase. Lover of dark aesthetic themes, anime mascots, C#, Rust, Go and rhythm games.',
  quote: 'Welcome to my digital sanctuary. Explore my favorite games and links below.',
  quoteAuthor: 'Evxcdwolf',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
  bannerUrl: initialBg,
  backgroundPattern: 'custom',
  customBgUrl: initialBg,
  skillsText: ['C#', 'Rust', 'Go', 'TypeScript', 'React', 'Linux', 'GitLab'],
};

export const DEFAULT_LIFE_INDEX_DATA: LifeIndexData = {
  projects: [],
  games: [
    { id: 'g1', name: 'Rimworld' },
    { id: 'g2', name: 'Left 4 Dead 2' },
    { id: 'g3', name: 'Arknights Endfield' },
    { id: 'g4', name: 'Wuthering Waves' },
    { id: 'g5', name: 'Assetto Corsa' },
  ],
  interests: [
    { id: 'i1', name: 'Art collecting' },
    { id: 'i2', name: 'AI generation & Roleplay' },
    { id: 'i3', name: 'Linux\\NixOS building' },
    { id: 'i4', name: 'Playing games' },
  ],
  credits: [
    { id: 'c1', name: 'Nagishiro Mito ▶', url: 'https://x.com/lemon_mito' },
    { id: 'c2', name: 'Haku Yukishiro ▶', url: 'https://x.com/haku_yukishiro' },
    { id: 'c3', name: 'Milfaaaaa ▶', url: 'https://x.com/milfaaaaa' },
  ],
};

export const FOXGIRL_PRESETS: FoxgirlPreset[] = DYNAMIC_STICKER_POOL.map((img, idx) => ({
  id: `fox-${idx + 1}`,
  name: `Mascot ${idx + 1}`,
  imageUrl: img,
  description: `Auto-loaded mascot from /src/assets/png/ #${idx + 1}`,
}));

export const DEFAULT_STICKER_CONFIG: StickerConfig = {
  enabled: true,
  presetId: 'fox-1',
  imageUrl: initialMascot,
  stickerPool: DYNAMIC_STICKER_POOL,
  randomOnReload: true,
  position: 'left-panel',
  sizeScale: 1.0,
  opacity: 0.98,
  floatingAnimation: true,
  glowEffect: true,
  whiteOutline: false,
  rotateDeg: 0,
};

export const DEFAULT_CONTACTS: ContactLink[] = [
  {
    id: 'steam',
    platform: 'steam',
    title: 'Steam',
    value: 'evxcdwolf',
    url: 'https://steamcommunity.com/id/evxcdwolf/',
    description: 'Steam Profile',
    isPrimary: true,
    copyable: false,
  },
  {
    id: 'x',
    platform: 'custom',
    title: 'x.com',
    value: '@evxcdwolf',
    url: 'https://x.com/evxcdwolf',
    description: 'X / Twitter Profile',
    isPrimary: true,
    copyable: false,
  },
  {
    id: 'discord',
    platform: 'discord',
    title: 'Discord',
    value: '@evxcdwolf',
    url: 'https://discord.com',
    description: 'Discord Handle',
    isPrimary: true,
    copyable: true,
  },
  {
    id: 'email',
    platform: 'email',
    title: 'Proton Mail',
    value: 'kyuii8053@protonmail.com',
    url: 'mailto:kyuii8053@protonmail.com',
    description: 'Proton Encrypted Email',
    isPrimary: true,
    copyable: true,
  },
];

export const DEFAULT_TECH_STACK: TechStackItem[] = [
  { id: '1', name: 'TypeScript', category: 'Languages', iconName: 'Code2', experienceLevel: 'Advanced' },
  { id: '2', name: 'React 19', category: 'Frontend', iconName: 'Atom', experienceLevel: 'Advanced' },
  { id: '3', name: 'Tailwind CSS', category: 'Frontend', iconName: 'Palette', experienceLevel: 'Expert' },
  { id: '4', name: 'Node.js & Express', category: 'Backend', iconName: 'Server', experienceLevel: 'Intermediate' },
  { id: '5', name: 'GitLab CI / CD', category: 'Tools & DevOps', iconName: 'GitBranch', experienceLevel: 'Advanced' },
  { id: '6', name: 'Vite', category: 'Tools & DevOps', iconName: 'Zap', experienceLevel: 'Expert' },
  { id: '7', name: 'Linux / Bash', category: 'Tools & DevOps', iconName: 'Terminal', experienceLevel: 'Advanced' },
  { id: '8', name: 'Motion / Framer', category: 'Frontend', iconName: 'Sparkles', experienceLevel: 'Advanced' },
];

export const DEFAULT_PROJECTS: ProjectCard[] = [
  {
    id: 'p1',
    title: 'gokoururi-homepage-v2',
    description: 'Ultra-stylish, customizable monochrome homepage for developers with foxgirl stickers, audio player, and GitLab Pages deployment.',
    tags: ['React', 'TypeScript', 'Tailwind', 'GitLab Pages'],
    repoUrl: 'https://gitlab.com',
    liveUrl: '#',
    stars: 128,
    featured: true,
  },
  {
    id: 'p2',
    title: 'kitsune-monochrome-theme',
    description: 'Minimalist high-contrast dark theme preset for VS Code and web dashboards with charcoal grays.',
    tags: ['Theme', 'CSS', 'VS Code'],
    repoUrl: 'https://gitlab.com',
    stars: 84,
    featured: true,
  },
  {
    id: 'p3',
    title: 'lofi-background-synth',
    description: 'Web Audio API ambient noise generator producing relaxing rain and vinyl crackle soundscapes.',
    tags: ['Web Audio API', 'React', 'Audio'],
    repoUrl: 'https://gitlab.com',
    stars: 42,
    featured: false,
  },
];

export const DEFAULT_AUDIO_TRACKS: AudioTrack[] = [
  {
    id: 't1',
    title: 'Midnight Kitsune Rain',
    artist: 'Lofi Chill Vibes',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
    duration: '2:40',
  },
  {
    id: 't2',
    title: 'Monochrome City Walk',
    artist: 'Chilled Fox',
    url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=ambient-piano-10781.mp3',
    duration: '3:15',
  },
  {
    id: 't3',
    title: 'GitLab Pipeline Green',
    artist: 'Synth Beat',
    url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a2b5b3.mp3?filename=chill-lofi-song-8444.mp3',
    duration: '2:18',
  },
];
