import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { UserProfile, StickerConfig, BackgroundConfig, LifeIndexData, ContactLink } from '../types';
import {
  Sparkles,
  Shuffle,
  Sliders,
  ExternalLink,
  Github,
  Gamepad2,
  Code,
  Music,
  Heart,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RefreshCw,
  Image as ImageIcon,
  Check,
  Copy,
  Mail,
  MessageSquare,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface HeroCardProps {
  profile: UserProfile;
  stickerConfig: StickerConfig;
  bgConfig: BackgroundConfig;
  lifeIndexData: LifeIndexData;
  contacts: ContactLink[];
  onOpenCustomizer: () => void;
  onUpdateStickerConfig: (updated: StickerConfig) => void;
  onUpdateBgConfig: (updated: BackgroundConfig) => void;
}

const FOX_QUOTES = [
  "Konkon! 🦊 Welcome to my life index!",
  "C#, Rust, Go and Lofi beats~ 🎧",
  "Osu! & Stepmania master level 💯",
  "Click buttons for a living 💻",
  "Reload to see random BG & mascot! 🎲",
  "Foxgirl power activated! 🐾",
];

export const HeroCard: React.FC<HeroCardProps> = ({
  profile,
  stickerConfig,
  bgConfig,
  lifeIndexData,
  contacts,
  onOpenCustomizer,
  onUpdateStickerConfig,
  onUpdateBgConfig,
}) => {
  const [isPlayingEmoticonTrack, setIsPlayingEmoticonTrack] = useState(false);
  const [showEmoticonDropdown, setShowEmoticonDropdown] = useState(false);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(label);
    setTimeout(() => setCopiedItem(null), 2500);
  };

  // Audio ref for emoticon music button
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const handleShuffleMascot = () => {
    if (stickerConfig.stickerPool && stickerConfig.stickerPool.length > 0) {
      const currentIndex = stickerConfig.stickerPool.indexOf(stickerConfig.imageUrl);
      let nextIndex = Math.floor(Math.random() * stickerConfig.stickerPool.length);
      if (nextIndex === currentIndex && stickerConfig.stickerPool.length > 1) {
        nextIndex = (currentIndex + 1) % stickerConfig.stickerPool.length;
      }
      onUpdateStickerConfig({
        ...stickerConfig,
        imageUrl: stickerConfig.stickerPool[nextIndex],
      });
    }
  };

  const handleShuffleBackground = () => {
    if (bgConfig.backgroundPool && bgConfig.backgroundPool.length > 0) {
      const currentIndex = bgConfig.backgroundPool.indexOf(bgConfig.activeBgUrl);
      let nextIndex = Math.floor(Math.random() * bgConfig.backgroundPool.length);
      if (nextIndex === currentIndex && bgConfig.backgroundPool.length > 1) {
        nextIndex = (currentIndex + 1) % bgConfig.backgroundPool.length;
      }
      onUpdateBgConfig({
        ...bgConfig,
        activeBgUrl: bgConfig.backgroundPool[nextIndex],
      });
    }
  };

  const toggleEmoticonTrack = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio('https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3');
      audioRef.current.loop = true;
    }

    if (isPlayingEmoticonTrack) {
      audioRef.current.pause();
      setIsPlayingEmoticonTrack(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlayingEmoticonTrack(true);
    }
  };

  const githubContact = contacts.find((c) => c.platform === 'github') || {
    url: 'https://github.com',
    title: 'Github',
  };
  const steamContact = contacts.find((c) => c.platform === 'steam') || {
    url: 'https://store.steampowered.com',
    title: 'Steam',
  };

  // Base sticker width and dynamic container width calculation for large/square artwork
  const baseStickerWidth = 480;
  const currentStickerWidth = stickerConfig.enabled 
    ? Math.round(baseStickerWidth * (stickerConfig.sizeScale || 1.0))
    : 0;
  
  // Calculate dynamic card container max width so the main div smoothly expands up to 1650px for large artwork
  const calculatedCardWidth = stickerConfig.enabled
    ? Math.max(1080, Math.min(1650, currentStickerWidth + 560))
    : 1080;

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center px-3 sm:px-6 py-6 sm:py-10 z-10 w-full max-w-full overflow-x-hidden">
      
      {/* CENTERED LIFE INDEX CARD CONTAINER */}
      <div 
        className="relative w-full max-w-full bg-black/80 backdrop-blur-md border border-zinc-700/90 rounded-2xl shadow-2xl p-4 sm:p-6 md:p-10 text-zinc-200 my-auto overflow-hidden transition-all duration-300"
        style={{
          maxWidth: `min(100%, ${calculatedCardWidth}px)`,
        }}
      >
        
        {/* HEADER TITLE SECTION */}
        <div className="text-center space-y-2 mb-6 sm:mb-8 relative z-20 w-full max-w-full">
          <h1 className="text-xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white font-sans break-words px-1">
            Welcome to{' '}
            <span className="text-pink-400 font-serif italic tracking-normal hover:text-pink-300 transition-colors">
              {profile.name}
            </span>{' '}
            life index.
          </h1>
          <p className="text-xs sm:text-sm font-mono text-zinc-400 tracking-wide">
            {profile.title || 'Art collector & Fox lover'}
          </p>
        </div>

        {/* TOP BUTTON ROW (Steam, x.com, Discord, Proton Mail) */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mb-6 sm:mb-8 relative z-20 w-full max-w-full">
          
          {/* Steam Button */}
          <a
            href="https://steamcommunity.com/id/evxcdwolf/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 sm:px-5 py-2 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 hover:border-zinc-500 text-zinc-100 font-mono text-xs sm:text-sm tracking-wide shadow-md transition-all flex items-center gap-1.5 sm:gap-2 group max-w-full min-w-0"
          >
            <Gamepad2 className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform flex-shrink-0" />
            <span>Steam</span>
            <ExternalLink className="w-3 h-3 text-zinc-500 group-hover:text-zinc-300 flex-shrink-0" />
          </a>

          {/* x.com Button */}
          <a
            href="https://x.com/evxcdwolf"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 sm:px-5 py-2 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 hover:border-zinc-500 text-zinc-100 font-mono text-xs sm:text-sm tracking-wide shadow-md transition-all flex items-center gap-1.5 sm:gap-2 group max-w-full min-w-0"
          >
            <span className="font-bold text-zinc-300 text-sm sm:text-base leading-none">𝕏</span>
            <span>x.com</span>
            <ExternalLink className="w-3 h-3 text-zinc-500 group-hover:text-zinc-300 flex-shrink-0" />
          </a>

          {/* Discord Button (Copy to clipboard on click) */}
          <button
            type="button"
            onClick={() => handleCopyText('@evxcdwolf', 'Discord')}
            className="px-3.5 sm:px-5 py-2 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 hover:border-zinc-500 text-zinc-100 font-mono text-xs sm:text-sm tracking-wide shadow-md transition-all flex items-center gap-1.5 sm:gap-2 group max-w-full min-w-0"
            title="Click to copy Discord username: @evxcdwolf"
          >
            <MessageSquare className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform flex-shrink-0" />
            <span className="hidden xs:inline">Discord</span>
            <span className="text-xs text-zinc-400 font-mono truncate max-w-[90px] sm:max-w-none">@evxcdwolf</span>
            {copiedItem === 'Discord' ? (
              <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            ) : (
              <Copy className="w-3 h-3 text-zinc-500 group-hover:text-zinc-300 flex-shrink-0" />
            )}
          </button>

          {/* Proton Mail Button */}
          <a
            href="mailto:kyuii8053@protonmail.com"
            onClick={(e) => {
              handleCopyText('kyuii8053@protonmail.com', 'Proton Mail');
            }}
            className="px-3.5 sm:px-5 py-2 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 hover:border-zinc-500 text-zinc-100 font-mono text-xs sm:text-sm tracking-wide shadow-md transition-all flex items-center gap-1.5 sm:gap-2 group max-w-full min-w-0"
            title="Click to copy email or open mail client: kyuii8053@protonmail.com"
          >
            <Mail className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform flex-shrink-0" />
            <span className="hidden xs:inline">Proton Mail</span>
            <span className="text-xs text-zinc-400 font-mono truncate max-w-[110px] sm:max-w-none">kyuii8053@protonmail.com</span>
            {copiedItem === 'Proton Mail' ? (
              <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            ) : (
              <Copy className="w-3 h-3 text-zinc-500 group-hover:text-zinc-300 flex-shrink-0" />
            )}
          </a>

        </div>

        {/* TOP DIVIDER LINE */}
        <div className="w-full h-px bg-zinc-800/80 mb-6 sm:mb-8 relative z-20" />

        {/* MAIN DATA COLUMNS */}
        <div className="flex flex-col md:flex-row gap-6 sm:gap-8 relative z-20 items-center md:items-start w-full max-w-full">
          
          {/* MASCOT / STICKER COLUMN (LEFT) */}
          <div className="w-full md:w-auto md:flex-shrink-0 flex flex-col items-center justify-start mx-auto md:mx-0 max-w-full min-w-0">
            {stickerConfig.enabled && (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="cursor-pointer relative flex items-center justify-center transition-all duration-300 w-full max-w-full"
                style={{
                  width: '100%',
                  maxWidth: `${currentStickerWidth}px`,
                  opacity: stickerConfig.opacity ?? 0.98,
                  transform: `rotate(${stickerConfig.rotateDeg || 0}deg)`,
                }}
              >
                <img
                  src={stickerConfig.imageUrl}
                  alt="Foxgirl Mascot"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto max-w-full object-contain filter drop-shadow-[0_12px_28px_rgba(0,0,0,0.9)] transition-all duration-300 transform-gpu rounded-lg"
                />
              </motion.div>
            )}

            {/* PROJECTS SECTION (if any exist) */}
            {lifeIndexData.projects && lifeIndexData.projects.length > 0 && (
              <div className="space-y-3 w-full mt-4">
                <h2 className="text-xl sm:text-2xl font-bold text-white font-sans border-b border-zinc-800/80 pb-1">
                  Projects
                </h2>
                <ul className="space-y-1.5 font-sans text-sm sm:text-base">
                  {lifeIndexData.projects.map((proj) => (
                    <li key={proj.id}>
                      <a
                        href={proj.url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:text-cyan-200 hover:underline transition-colors flex items-center gap-1.5"
                      >
                        <span>{proj.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* RIGHT CONTENT COLUMN */}
          <div className="flex-1 space-y-6 w-full min-w-0 max-w-full transition-all duration-300">
            
            {/* ABOUT ME SECTION (Collapsible) */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setIsAboutExpanded(!isAboutExpanded)}
                className="w-full text-left group flex items-center justify-between border-b border-zinc-800/80 pb-1 focus:outline-none cursor-pointer"
              >
                <div className="flex items-baseline gap-2.5">
                  <h2 className="text-xl sm:text-2xl font-bold text-white font-sans group-hover:text-amber-400 transition-colors">
                    About me
                  </h2>
                  <span className="text-xs text-zinc-400 group-hover:text-amber-300/90 transition-colors font-mono">
                    ({isAboutExpanded ? 'click to collapse' : 'click me to see more'})
                  </span>
                </div>
                <div className="text-zinc-400 group-hover:text-amber-400 transition-colors p-1">
                  {isAboutExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              <AnimatePresence>
                {isAboutExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="pt-2 space-y-3 font-sans text-sm sm:text-base text-zinc-300 leading-relaxed">
                      <p>
                        My name is Woofy. I'm 23+ years old, a free person with a free life. I don't have a career, I just enjoy life xd. I love collecting arts with foxgirls and sometimes wolfgirls on my computer. I already have 50 GB of images on my disk xd. I love artists like Nagishiro Mito, Haku Yukishiro, and Haku Yukishiro. And I love white haired foxgirls with blue eyes. &lt;3
                      </p>
                      <div className="pt-1 space-y-2">
                        <p className="font-semibold text-zinc-200">
                          My stance on AI training:
                        </p>
                        <p className="text-zinc-300">
                          I do not support or condone the training of AI models on the works or artistic styles of creators without their explicit consent.
                        </p>
                        <p className="text-zinc-300">
                          I also do not approve of any commercial activities involving generative AI that use the data of authors and artists without their permission.
                        </p>
                        <p className="text-zinc-300">
                          However, I consider it acceptable to use generative AI to create works in styles that are generally similar or inspired by existing artists, as long as those models were not trained on the original creators’ personal data or works.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* INTEREST SECTION */}
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-white font-sans border-b border-zinc-800/80 pb-1">
                Interest
              </h2>
              <ul className="space-y-1 font-sans text-sm sm:text-base text-zinc-300">
                {lifeIndexData.interests.map((item) => (
                  <li key={item.id} className="text-zinc-300">
                    {item.name}
                  </li>
                ))}
              </ul>
            </div>

            {/* MOST PLAYED GAMES SECTION */}
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-white font-sans border-b border-zinc-800/80 pb-1">
                Most Played Games
              </h2>
              <ul className="space-y-1.5 font-sans text-sm sm:text-base text-zinc-300">
                {lifeIndexData.games.map((game) => (
                  <li key={game.id} className="text-zinc-300">
                    {game.name}
                  </li>
                ))}
              </ul>
            </div>

            {/* CREDITS MASCOT SECTION */}
            <div className="space-y-3 pt-2">
              <h2 className="text-xl sm:text-2xl font-bold text-white font-sans border-b border-zinc-800/80 pb-1">
                Credits Mascot
              </h2>
              <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs sm:text-sm">
                {lifeIndexData.credits.map((cred) => (
                  <a
                    key={cred.id}
                    href={cred.url && cred.url !== '#' ? cred.url : '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-zinc-500 text-zinc-200 transition-colors flex items-center gap-1.5 shadow-sm group"
                  >
                    <span>{cred.name}</span>
                  </a>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* BOTTOM FOOTER STATUS */}
        <div className="mt-12 pt-6 border-t border-zinc-800/80 flex flex-wrap items-center justify-between text-xs font-mono text-zinc-500 gap-2 relative z-20">
          <div>
            <span>SYSTEM // {profile.name} Life Index</span>
          </div>
          <div className="flex items-center gap-2">
            <span>RANDOM BG & MASCOT ON RELOAD</span>
          </div>
        </div>

      </div>

    </div>
  );
};

