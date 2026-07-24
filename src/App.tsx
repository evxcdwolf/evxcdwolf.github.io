/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserProfile, StickerConfig, BackgroundConfig, LifeIndexData, ContactLink, ThemeMode } from './types';
import {
  DEFAULT_USER_PROFILE,
  DEFAULT_STICKER_CONFIG,
  DEFAULT_BACKGROUND_CONFIG,
  DEFAULT_LIFE_INDEX_DATA,
  DEFAULT_CONTACTS,
  DEFAULT_TECH_STACK,
  DEFAULT_PROJECTS,
  DEFAULT_AUDIO_TRACKS,
  FOXGIRL_PRESETS,
  DYNAMIC_BACKGROUND_POOL,
  DYNAMIC_STICKER_POOL,
} from './data/defaultProfile';
import { HeaderNav } from './components/HeaderNav';
import { HeroCard } from './components/HeroCard';
import { FoxgirlStickerOverlay } from './components/FoxgirlStickerOverlay';
import { AboutSection } from './components/AboutSection';
import { ContactsGrid } from './components/ContactsGrid';
import { ProjectsGrid } from './components/ProjectsGrid';
import { LofiPlayer } from './components/LofiPlayer';
import { CustomizerModal } from './components/CustomizerModal';
import { GitLabExportModal } from './components/GitLabExportModal';
import { BackgroundCanvas } from './components/BackgroundCanvas';
import { Heart, ArrowUp } from 'lucide-react';

export default function App() {
  // Local storage state initialization
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);

  const [stickerConfig, setStickerConfig] = useState<StickerConfig>(() => {
    const saved = localStorage.getItem('homepage_sticker');
    return saved ? JSON.parse(saved) : DEFAULT_STICKER_CONFIG;
  });

  const [bgConfig, setBgConfig] = useState<BackgroundConfig>(() => {
    const saved = localStorage.getItem('homepage_bgconfig');
    return saved ? JSON.parse(saved) : DEFAULT_BACKGROUND_CONFIG;
  });

  const [lifeIndexData, setLifeIndexData] = useState<LifeIndexData>(DEFAULT_LIFE_INDEX_DATA);

  const [contacts, setContacts] = useState<ContactLink[]>(DEFAULT_CONTACTS);

  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    return (localStorage.getItem('homepage_theme') as ThemeMode) || 'dark';
  });

  const [activeSection, setActiveSection] = useState<string>('hero');
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isGitLabExportOpen, setIsGitLabExportOpen] = useState(false);

  // Auto-save to LocalStorage safely
  useEffect(() => {
    try {
      localStorage.setItem('homepage_profile', JSON.stringify(profile));
    } catch (e) {
      console.warn('LocalStorage save profile failed', e);
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem('homepage_sticker', JSON.stringify(stickerConfig));
    } catch (e) {
      console.warn('LocalStorage save sticker failed', e);
    }
  }, [stickerConfig]);

  useEffect(() => {
    try {
      localStorage.setItem('homepage_bgconfig', JSON.stringify(bgConfig));
    } catch (e) {
      console.warn('LocalStorage save bgconfig failed', e);
    }
  }, [bgConfig]);

  useEffect(() => {
    try {
      localStorage.setItem('homepage_lifeindex', JSON.stringify(lifeIndexData));
    } catch (e) {
      console.warn('LocalStorage save lifeindex failed', e);
    }
  }, [lifeIndexData]);

  useEffect(() => {
    try {
      localStorage.setItem('homepage_contacts', JSON.stringify(contacts));
    } catch (e) {
      console.warn('LocalStorage save contacts failed', e);
    }
  }, [contacts]);

  useEffect(() => {
    try {
      localStorage.setItem('homepage_theme', themeMode);
    } catch (e) {
      console.warn('LocalStorage save theme failed', e);
    }
  }, [themeMode]);

  // ON PAGE LOAD / RELOAD: Always merge dynamic folders and pick a random BG & random mascot sticker
  useEffect(() => {
    // 1. Randomize Background Wallpaper from merged pool
    setBgConfig((prev) => {
      const mergedPool = Array.from(new Set([...DYNAMIC_BACKGROUND_POOL, ...(prev.backgroundPool || [])])).filter(Boolean);
      const chosenBg = mergedPool.length > 0 ? mergedPool[Math.floor(Math.random() * mergedPool.length)] : prev.activeBgUrl;
      return {
        ...prev,
        backgroundPool: mergedPool,
        activeBgUrl: chosenBg,
      };
    });

    // 2. Randomize Foxgirl Mascot PNG from merged pool
    setStickerConfig((prev) => {
      const mergedPool = Array.from(new Set([...DYNAMIC_STICKER_POOL, ...(prev.stickerPool || [])])).filter(Boolean);
      const chosenSticker = mergedPool.length > 0 ? mergedPool[Math.floor(Math.random() * mergedPool.length)] : prev.imageUrl;
      return {
        ...prev,
        stickerPool: mergedPool,
        imageUrl: chosenSticker,
      };
    });
  }, []);

  // Reset function
  const handleResetAll = () => {
    setProfile(DEFAULT_USER_PROFILE);
    setStickerConfig(DEFAULT_STICKER_CONFIG);
    setBgConfig(DEFAULT_BACKGROUND_CONFIG);
    setLifeIndexData(DEFAULT_LIFE_INDEX_DATA);
    setContacts(DEFAULT_CONTACTS);
    setThemeMode('dark');
    localStorage.clear();
    setIsCustomizerOpen(false);
  };

  const handleNavigateSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen relative font-sans text-zinc-100 bg-zinc-950 overflow-x-hidden selection:bg-pink-500 selection:text-white flex flex-col justify-center items-center">
      
      {/* Background Atmosphere Wallpaper & Particle Canvas */}
      <BackgroundCanvas bgConfig={bgConfig} />

      {/* Floating Viewport Foxgirl Mascot (if floating position mode selected) */}
      {stickerConfig.enabled && stickerConfig.position !== 'left-panel' && stickerConfig.position !== 'hero-corner' && (
        <FoxgirlStickerOverlay config={stickerConfig} />
      )}

      {/* Main Content Layout */}
      <main className="relative z-10 w-full max-w-full px-2 sm:px-6 py-4 sm:py-8 my-auto flex items-center justify-center overflow-x-hidden">
        
        {/* Main Life Index Central Card */}
        <HeroCard
          profile={profile}
          stickerConfig={stickerConfig}
          bgConfig={bgConfig}
          lifeIndexData={lifeIndexData}
          contacts={contacts}
          onOpenCustomizer={() => setIsCustomizerOpen(true)}
          onUpdateStickerConfig={setStickerConfig}
          onUpdateBgConfig={setBgConfig}
        />

      </main>

      {/* Modals */}
      <CustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        profile={profile}
        onUpdateProfile={setProfile}
        stickerConfig={stickerConfig}
        onUpdateStickerConfig={setStickerConfig}
        bgConfig={bgConfig}
        onUpdateBgConfig={setBgConfig}
        lifeIndexData={lifeIndexData}
        onUpdateLifeIndexData={setLifeIndexData}
        presets={FOXGIRL_PRESETS}
        contacts={contacts}
        onUpdateContacts={setContacts}
        themeMode={themeMode}
        onSelectTheme={setThemeMode}
        onResetAll={handleResetAll}
      />

      <GitLabExportModal
        isOpen={isGitLabExportOpen}
        onClose={() => setIsGitLabExportOpen(false)}
        username={profile.username}
      />

    </div>
  );
}

