export type ThemeMode = 'dark' | 'monochrome-high-contrast' | 'charcoal-soft' | 'light-minimal';
export type ParticleEffect = 'snow' | 'dots' | 'grid' | 'none';
export type StickerPosition = 'left-panel' | 'top-right' | 'top-left' | 'hero-corner' | 'floating-center' | 'bottom-right' | 'bottom-left';

export interface BackgroundConfig {
  activeBgUrl: string;
  backgroundPool: string[];
  randomBgOnReload: boolean;
  overlayOpacity: number; // e.g. 0.4 to 0.95
  blurAmount: number; // e.g. 0 to 10px
}

export interface UserProfile {
  name: string;
  username: string;
  title: string;
  subtitle: string;
  location: string;
  statusText: string;
  statusEmoji: string;
  bio: string;
  quote: string;
  quoteAuthor: string;
  avatarUrl: string;
  bannerUrl: string;
  backgroundPattern: 'grid' | 'dots' | 'custom' | 'dark-solid' | 'gradient';
  customBgUrl?: string;
  skillsText: string[];
}

export interface StickerConfig {
  enabled: boolean;
  presetId: string;
  imageUrl: string;
  stickerPool: string[];
  randomOnReload: boolean;
  position: StickerPosition;
  sizeScale: number; // 0.6 to 1.8
  opacity: number; // 0.3 to 1
  floatingAnimation: boolean;
  glowEffect: boolean;
  whiteOutline: boolean;
  rotateDeg: number;
}

export interface LifeIndexData {
  projects: { id: string; name: string; url?: string; description?: string }[];
  games: { id: string; name: string }[];
  interests: { id: string; name: string }[];
  credits: { id: string; name: string; url?: string }[];
}

export interface ContactLink {
  id: string;
  platform: 'gitlab' | 'github' | 'telegram' | 'discord' | 'email' | 'spotify' | 'steam' | 'twitter' | 'custom';
  title: string;
  value: string;
  url: string;
  description?: string;
  isPrimary?: boolean;
  copyable?: boolean;
  iconName?: string;
}

export interface TechStackItem {
  id: string;
  name: string;
  category: 'Languages' | 'Frontend' | 'Backend' | 'Tools & DevOps' | 'Favorites';
  iconName: string;
  experienceLevel?: string;
}

export interface ProjectCard {
  id: string;
  title: string;
  description: string;
  tags: string[];
  repoUrl?: string;
  liveUrl?: string;
  stars?: number;
  featured?: boolean;
}

export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration?: string;
}

export interface FoxgirlPreset {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
}
