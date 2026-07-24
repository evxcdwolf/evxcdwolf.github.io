import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { StickerConfig } from '../types';
import { Sparkles, Heart, Move, Eye, RotateCw } from 'lucide-react';

interface FoxgirlStickerOverlayProps {
  config: StickerConfig;
  onUpdateConfig?: (updated: Partial<StickerConfig>) => void;
  isHeroEmbedded?: boolean;
}

export const FoxgirlStickerOverlay: React.FC<FoxgirlStickerOverlayProps> = ({
  config,
  onUpdateConfig,
  isHeroEmbedded = false,
}) => {
  if (!config.enabled) return null;

  // Determine CSS position classes based on sticker position choice
  const getPositionStyle = () => {
    if (isHeroEmbedded) {
      return 'absolute -top-12 -right-8 z-20 md:-top-16 md:-right-12';
    }

    switch (config.position) {
      case 'top-right':
        return 'fixed top-20 right-6 z-40';
      case 'top-left':
        return 'fixed top-20 left-6 z-40';
      case 'bottom-right':
        return 'fixed bottom-8 right-6 z-40';
      case 'bottom-left':
        return 'fixed bottom-8 left-6 z-40';
      case 'floating-center':
        return 'fixed top-1/3 right-10 z-40 hidden lg:block';
      case 'hero-corner':
      default:
        return 'absolute -top-14 -right-10 z-20 md:-top-16 md:-right-12';
    }
  };

  return (
    <div className={`${getPositionStyle()} transition-all duration-300 select-none`}>
      <div className="relative group">
        {/* Sticker Image Container */}
        <motion.div
          whileHover={{ scale: (config.sizeScale || 1) * 1.05, rotate: (config.rotateDeg || 0) + 3 }}
          whileTap={{ scale: (config.sizeScale || 1) * 0.92 }}
          animate={{
            y: config.floatingAnimation ? [0, -8, 0] : 0,
          }}
          transition={{
            y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
          }}
          className="aria-button cursor-pointer relative"
          style={{
            transform: `scale(${config.sizeScale || 1}) rotate(${config.rotateDeg || 0}deg)`,
            opacity: config.opacity ?? 0.95,
          }}
        >
          {/* Sticker Glow background */}
          {config.glowEffect && (
            <div className="absolute inset-0 rounded-full bg-white/10 blur-xl scale-110 pointer-events-none animate-pulse" />
          )}

          {/* Sticker Image */}
          <div
            className={`relative rounded-2xl overflow-hidden p-1 transition-all ${
              config.whiteOutline
                ? 'bg-zinc-100/90 p-[3px] shadow-[0_10px_30px_rgba(0,0,0,0.8)] border border-white'
                : 'shadow-2xl'
            }`}
          >
            <img
              src={config.imageUrl}
              alt="Foxgirl Sticker"
              referrerPolicy="no-referrer"
              className="w-28 h-28 md:w-36 md:h-36 object-cover rounded-xl filter contrast-[1.05] grayscale brightness-95 hover:grayscale-0 transition-all duration-300"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};
