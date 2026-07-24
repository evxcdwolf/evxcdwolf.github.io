import React, { useState } from 'react';
import { UserProfile, StickerConfig, BackgroundConfig, LifeIndexData, ContactLink, FoxgirlPreset, StickerPosition, ThemeMode } from '../types';
import { X, Sliders, Image as ImageIcon, Sparkles, User, Link as LinkIcon, Download, Upload, RotateCcw, Plus, Trash2, List } from 'lucide-react';

interface CustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  stickerConfig: StickerConfig;
  onUpdateStickerConfig: (updated: StickerConfig) => void;
  bgConfig: BackgroundConfig;
  onUpdateBgConfig: (updated: BackgroundConfig) => void;
  lifeIndexData: LifeIndexData;
  onUpdateLifeIndexData: (updated: LifeIndexData) => void;
  presets: FoxgirlPreset[];
  contacts: ContactLink[];
  onUpdateContacts: (contacts: ContactLink[]) => void;
  themeMode: ThemeMode;
  onSelectTheme: (theme: ThemeMode) => void;
  onResetAll: () => void;
}

export const CustomizerModal: React.FC<CustomizerModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  stickerConfig,
  onUpdateStickerConfig,
  bgConfig,
  onUpdateBgConfig,
  lifeIndexData,
  onUpdateLifeIndexData,
  presets,
  contacts,
  onUpdateContacts,
  themeMode,
  onSelectTheme,
  onResetAll,
}) => {
  const [activeTab, setActiveTab] = useState<'sticker' | 'background' | 'content' | 'profile' | 'contacts' | 'json'>('sticker');

  if (!isOpen) return null;

  // Helper to compress/scale uploaded image to fit in browser memory and localStorage
  const compressImage = (
    file: File,
    maxWidth: number,
    maxHeight: number,
    quality: number,
    isPng: boolean,
    onSuccess: (dataUrl: string) => void
  ) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const rawDataUrl = e.target?.result as string;
      const img = new Image();
      img.onerror = () => {
        onSuccess(rawDataUrl);
      };
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          try {
            const compressed = canvas.toDataURL(isPng ? 'image/png' : 'image/jpeg', quality);
            onSuccess(compressed);
          } catch (err) {
            onSuccess(rawDataUrl);
          }
        } else {
          onSuccess(rawDataUrl);
        }
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  };

  // Handle Foxgirl sticker upload (adds to sticker pool)
  const handleFoxgirlFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      compressImage(file, 900, 900, 0.95, true, (newUrl) => {
        const currentPool = stickerConfig.stickerPool || [];
        const updatedPool = currentPool.includes(newUrl) ? currentPool : [...currentPool, newUrl];
        onUpdateStickerConfig({
          ...stickerConfig,
          imageUrl: newUrl,
          stickerPool: updatedPool,
          presetId: 'custom-upload',
        });
      });
    }
  };

  // Handle Background image upload (adds to background pool)
  const handleBgFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      compressImage(file, 1920, 1080, 0.82, false, (newUrl) => {
        const currentPool = bgConfig.backgroundPool || [];
        const updatedPool = currentPool.includes(newUrl) ? currentPool : [...currentPool, newUrl];
        onUpdateBgConfig({
          ...bgConfig,
          activeBgUrl: newUrl,
          backgroundPool: updatedPool,
        });
      });
    }
  };

  // JSON Config Export
  const handleExportJSON = () => {
    const data = {
      profile,
      stickerConfig,
      bgConfig,
      lifeIndexData,
      contacts,
      themeMode,
      exportedAt: new Date().toISOString(),
    };
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'insomnyawolf-life-index-config.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // JSON Config Import
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.profile) onUpdateProfile(parsed.profile);
          if (parsed.stickerConfig) onUpdateStickerConfig(parsed.stickerConfig);
          if (parsed.bgConfig) onUpdateBgConfig(parsed.bgConfig);
          if (parsed.lifeIndexData) onUpdateLifeIndexData(parsed.lifeIndexData);
          if (parsed.contacts) onUpdateContacts(parsed.contacts);
          if (parsed.themeMode) onSelectTheme(parsed.themeMode);
          alert('Config imported successfully! ✨');
        } catch (err) {
          alert('Invalid JSON configuration file.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-2xl max-h-[90vh] rounded-3xl border border-zinc-800/90 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-800 bg-zinc-900/60">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Homepage & Pools Editor</h2>
              <p className="text-xs text-zinc-400 font-mono">Customize backgrounds pool, foxgirl PNGs pool, and index links</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex items-center gap-1 px-5 pt-3 border-b border-zinc-800/80 bg-zinc-900/30 overflow-x-auto text-xs font-mono">
          {[
            { id: 'sticker', label: '🦊 Foxgirl PNGs Pool', icon: Sparkles },
            { id: 'background', label: '🌆 Backgrounds Pool', icon: ImageIcon },
            { id: 'content', label: '📋 Index Projects & Games', icon: List },
            { id: 'profile', label: '👤 Profile & Title', icon: User },
            { id: 'contacts', label: '🔗 Links & Socials', icon: LinkIcon },
            { id: 'json', label: '💾 Backup / Export', icon: Download },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-2 rounded-t-xl transition-all whitespace-nowrap flex items-center gap-1.5 border-t border-x ${
                activeTab === tab.id
                  ? 'bg-zinc-950 text-white font-semibold border-zinc-700'
                  : 'bg-transparent text-zinc-400 border-transparent hover:text-zinc-200'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs text-zinc-300 font-sans">
          
          {/* TAB 1: FOXGIRL STICKER POOL */}
          {activeTab === 'sticker' && (
            <div className="space-y-5">
              
              {/* Enable Sticker & Random Reload Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800">
                  <div>
                    <div className="font-bold text-zinc-100">Display Foxgirl Mascot</div>
                    <div className="text-[11px] text-zinc-400 font-mono">Show PNG mascot on card</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={stickerConfig.enabled}
                    onChange={(e) => onUpdateStickerConfig({ ...stickerConfig, enabled: e.target.checked })}
                    className="w-5 h-5 accent-pink-500 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800">
                  <div>
                    <div className="font-bold text-zinc-100">Random Mascot on Reload 🎲</div>
                    <div className="text-[11px] text-zinc-400 font-mono">Picks random PNG on page refresh</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={stickerConfig.randomOnReload ?? true}
                    onChange={(e) => onUpdateStickerConfig({ ...stickerConfig, randomOnReload: e.target.checked })}
                    className="w-5 h-5 accent-pink-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Current Active & Sticker Pool Collection */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-mono font-bold text-zinc-200 block">
                    Foxgirl Mascot Pool ({stickerConfig.stickerPool?.length || presets.length} images):
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      if (stickerConfig.stickerPool && stickerConfig.stickerPool.length > 0) {
                        const nextIndex = Math.floor(Math.random() * stickerConfig.stickerPool.length);
                        onUpdateStickerConfig({
                          ...stickerConfig,
                          imageUrl: stickerConfig.stickerPool[nextIndex],
                        });
                      }
                    }}
                    className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 flex items-center gap-1"
                  >
                    <span>🎲 Shuffle Mascot</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {(stickerConfig.stickerPool && stickerConfig.stickerPool.length > 0
                    ? stickerConfig.stickerPool
                    : presets.map((p) => p.imageUrl)
                  ).map((imgUrl, idx) => {
                    const isActive = stickerConfig.imageUrl === imgUrl;
                    return (
                      <div
                        key={idx}
                        onClick={() =>
                          onUpdateStickerConfig({
                            ...stickerConfig,
                            imageUrl: imgUrl,
                          })
                        }
                        className={`relative p-2 rounded-xl border transition-all cursor-pointer flex flex-col items-center gap-1.5 group ${
                          isActive
                            ? 'bg-pink-950 text-pink-100 font-bold border-pink-400 ring-2 ring-pink-500/50 shadow-lg'
                            : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        <img
                          src={imgUrl}
                          alt={`Mascot ${idx + 1}`}
                          referrerPolicy="no-referrer"
                          className="w-20 h-20 object-contain rounded-lg border border-zinc-800 bg-black/40"
                        />
                        <div className="text-[10px] font-mono truncate max-w-full">
                          {isActive ? '✓ Active Mascot' : `Foxgirl #${idx + 1}`}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Upload New Foxgirl PNG & Scale Controls */}
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4 font-mono">
                <div className="space-y-2">
                  <label className="font-bold text-zinc-200 block">Sticker Scale (Size multiplier):</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="0.5"
                      max="2.5"
                      step="0.05"
                      value={stickerConfig.sizeScale || 1.0}
                      onChange={(e) =>
                        onUpdateStickerConfig({
                          ...stickerConfig,
                          sizeScale: parseFloat(e.target.value),
                        })
                      }
                      className="flex-1 accent-pink-500 cursor-pointer"
                    />
                    <span className="text-pink-400 font-bold w-12 text-right">
                      {((stickerConfig.sizeScale || 1.0) * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-bold text-zinc-200 block">Add New Foxgirl PNG to Pool:</label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="url"
                      placeholder="https://example.com/foxgirl.png"
                      value={stickerConfig.imageUrl}
                      onChange={(e) => {
                        const val = e.target.value;
                        const updatedPool = stickerConfig.stickerPool?.includes(val)
                          ? stickerConfig.stickerPool
                          : [...(stickerConfig.stickerPool || []), val];
                        onUpdateStickerConfig({
                          ...stickerConfig,
                          imageUrl: val,
                          stickerPool: updatedPool,
                          presetId: 'custom-url',
                        });
                      }}
                      className="flex-1 px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-zinc-600"
                    />
                    <label className="px-4 py-2 rounded-xl bg-pink-900/60 hover:bg-pink-800/80 text-pink-100 cursor-pointer text-center font-sans font-medium flex items-center justify-center gap-1.5 border border-pink-700/80 shadow-md transition-all">
                      <Upload className="w-4 h-4" />
                      <span>Upload Local PNG</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFoxgirlFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: BACKGROUNDS POOL */}
          {activeTab === 'background' && (
            <div className="space-y-5 font-mono">
              
              {/* Random Background Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800">
                <div>
                  <div className="font-bold text-zinc-100">Random Background on Reload 🎲</div>
                  <div className="text-[11px] text-zinc-400">Selects random background wallpaper on page refresh</div>
                </div>
                <input
                  type="checkbox"
                  checked={bgConfig.randomBgOnReload ?? true}
                  onChange={(e) => onUpdateBgConfig({ ...bgConfig, randomBgOnReload: e.target.checked })}
                  className="w-5 h-5 accent-blue-500 cursor-pointer"
                />
              </div>

              {/* Backgrounds Pool Grid */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-mono font-bold text-zinc-200 block">
                    Background Wallpapers Pool ({bgConfig.backgroundPool?.length || 0} wallpapers):
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      if (bgConfig.backgroundPool && bgConfig.backgroundPool.length > 0) {
                        const nextIndex = Math.floor(Math.random() * bgConfig.backgroundPool.length);
                        onUpdateBgConfig({
                          ...bgConfig,
                          activeBgUrl: bgConfig.backgroundPool[nextIndex],
                        });
                      }
                    }}
                    className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 flex items-center gap-1"
                  >
                    <span>🎲 Shuffle BG Wallpaper</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {bgConfig.backgroundPool?.map((bgUrl, idx) => {
                    const isActive = bgConfig.activeBgUrl === bgUrl;
                    return (
                      <div
                        key={idx}
                        onClick={() =>
                          onUpdateBgConfig({
                            ...bgConfig,
                            activeBgUrl: bgUrl,
                          })
                        }
                        className={`relative p-2 rounded-xl border transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                          isActive
                            ? 'bg-blue-950 text-blue-100 font-bold border-blue-400 ring-2 ring-blue-500/50 shadow-lg'
                            : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        <img
                          src={bgUrl}
                          alt={`Background ${idx + 1}`}
                          referrerPolicy="no-referrer"
                          className="w-full h-24 object-cover rounded-lg border border-zinc-800"
                        />
                        <div className="text-[10px] font-mono truncate max-w-full">
                          {isActive ? '✓ Active Wallpaper' : `Wallpaper #${idx + 1}`}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Add Custom Wallpaper */}
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3 font-mono">
                <label className="font-bold text-zinc-200 block">Add New Background Wallpaper to Project Pool:</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="url"
                    placeholder="https://example.com/cyberpunk-city.jpg"
                    value={bgConfig.activeBgUrl}
                    onChange={(e) => {
                      const val = e.target.value;
                      const updatedPool = bgConfig.backgroundPool?.includes(val)
                        ? bgConfig.backgroundPool
                        : [...(bgConfig.backgroundPool || []), val];
                      onUpdateBgConfig({
                        ...bgConfig,
                        activeBgUrl: val,
                        backgroundPool: updatedPool,
                      });
                    }}
                    className="flex-1 px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-zinc-600"
                  />
                  <label className="px-3 py-2 rounded-xl bg-blue-900/60 hover:bg-blue-800/80 text-blue-100 cursor-pointer text-center font-sans font-medium flex items-center justify-center gap-1.5 border border-blue-700/80">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Wallpaper</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBgFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Overlay Opacity Slider */}
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                <div className="flex justify-between text-xs text-zinc-200 font-bold">
                  <span>Dark Overlay Tint Strength:</span>
                  <span>{Math.round((bgConfig.overlayOpacity ?? 0.65) * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="0.9"
                  step="0.05"
                  value={bgConfig.overlayOpacity ?? 0.65}
                  onChange={(e) =>
                    onUpdateBgConfig({
                      ...bgConfig,
                      overlayOpacity: parseFloat(e.target.value),
                    })
                  }
                  className="w-full accent-blue-400 cursor-pointer"
                />
              </div>

            </div>
          )}

          {/* TAB 3: LIFE INDEX CONTENT */}
          {activeTab === 'content' && (
            <div className="space-y-6 font-mono">
              
              {/* EDIT PROJECTS */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <span className="font-bold text-white text-sm">Projects List:</span>
                  <button
                    onClick={() => {
                      const newProj = {
                        id: String(Date.now()),
                        name: 'NewProject',
                        url: 'https://github.com',
                      };
                      onUpdateLifeIndexData({
                        ...lifeIndexData,
                        projects: [...lifeIndexData.projects, newProj],
                      });
                    }}
                    className="px-2.5 py-1 rounded bg-emerald-950 hover:bg-emerald-900 text-emerald-300 text-xs flex items-center gap-1 border border-emerald-800"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Project</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {lifeIndexData.projects.map((proj, idx) => (
                    <div key={proj.id} className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center gap-2">
                      <input
                        type="text"
                        value={proj.name}
                        onChange={(e) => {
                          const updated = [...lifeIndexData.projects];
                          updated[idx].name = e.target.value;
                          onUpdateLifeIndexData({ ...lifeIndexData, projects: updated });
                        }}
                        className="flex-1 px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-cyan-300 font-bold"
                      />
                      <input
                        type="text"
                        value={proj.url || ''}
                        onChange={(e) => {
                          const updated = [...lifeIndexData.projects];
                          updated[idx].url = e.target.value;
                          onUpdateLifeIndexData({ ...lifeIndexData, projects: updated });
                        }}
                        placeholder="https://github.com/..."
                        className="flex-1 px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-400 text-xs"
                      />
                      <button
                        onClick={() => {
                          const updated = lifeIndexData.projects.filter((_, i) => i !== idx);
                          onUpdateLifeIndexData({ ...lifeIndexData, projects: updated });
                        }}
                        className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-400 border border-red-800"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* EDIT MOST PLAYED GAMES */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <span className="font-bold text-white text-sm">Most Played Games:</span>
                  <button
                    onClick={() => {
                      const newGame = {
                        id: String(Date.now()),
                        name: 'New Game',
                      };
                      onUpdateLifeIndexData({
                        ...lifeIndexData,
                        games: [...lifeIndexData.games, newGame],
                      });
                    }}
                    className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs flex items-center gap-1 border border-zinc-700"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Game</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {lifeIndexData.games.map((game, idx) => (
                    <div key={game.id} className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center gap-2">
                      <input
                        type="text"
                        value={game.name}
                        onChange={(e) => {
                          const updated = [...lifeIndexData.games];
                          updated[idx].name = e.target.value;
                          onUpdateLifeIndexData({ ...lifeIndexData, games: updated });
                        }}
                        className="flex-1 px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200"
                      />
                      <button
                        onClick={() => {
                          const updated = lifeIndexData.games.filter((_, i) => i !== idx);
                          onUpdateLifeIndexData({ ...lifeIndexData, games: updated });
                        }}
                        className="p-1 rounded bg-red-950/60 text-red-400"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* EDIT INTERESTS */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <span className="font-bold text-white text-sm">Interests / Languages:</span>
                  <button
                    onClick={() => {
                      const newItem = {
                        id: String(Date.now()),
                        name: 'New Interest',
                      };
                      onUpdateLifeIndexData({
                        ...lifeIndexData,
                        interests: [...lifeIndexData.interests, newItem],
                      });
                    }}
                    className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs flex items-center gap-1 border border-zinc-700"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Interest</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {lifeIndexData.interests.map((item, idx) => (
                    <div key={item.id} className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center gap-2">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => {
                          const updated = [...lifeIndexData.interests];
                          updated[idx].name = e.target.value;
                          onUpdateLifeIndexData({ ...lifeIndexData, interests: updated });
                        }}
                        className="flex-1 px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200"
                      />
                      <button
                        onClick={() => {
                          const updated = lifeIndexData.interests.filter((_, i) => i !== idx);
                          onUpdateLifeIndexData({ ...lifeIndexData, interests: updated });
                        }}
                        className="p-1 rounded bg-red-950/60 text-red-400"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: PROFILE & TITLE */}
          {activeTab === 'profile' && (
            <div className="space-y-4 font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 font-bold block mb-1">Index Username (Highlight):</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => onUpdateProfile({ ...profile, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-pink-300 font-bold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 font-bold block mb-1">Tagline / Subtitle:</label>
                  <input
                    type="text"
                    value={profile.title}
                    onChange={(e) => onUpdateProfile({ ...profile, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CONTACTS & LINKS */}
          {activeTab === 'contacts' && (
            <div className="space-y-4 font-mono">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-zinc-200">Socials & Contact Cards:</span>
                <button
                  type="button"
                  onClick={() => {
                    const newContact: ContactLink = {
                      id: `c-${Date.now()}`,
                      platform: 'custom',
                      title: 'New Social',
                      value: '@handle',
                      url: 'https://',
                      isPrimary: false,
                      copyable: true,
                    };
                    onUpdateContacts([...contacts, newContact]);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs flex items-center gap-1 border border-zinc-700"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Link</span>
                </button>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {contacts.map((c, idx) => (
                  <div key={c.id} className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2 font-mono">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Title (e.g. Github)"
                        value={c.title}
                        onChange={(e) => {
                          const updated = [...contacts];
                          updated[idx].title = e.target.value;
                          onUpdateContacts(updated);
                        }}
                        className="flex-1 px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-white font-bold"
                      />
                      <input
                        type="text"
                        placeholder="Handle / Value"
                        value={c.value}
                        onChange={(e) => {
                          const updated = [...contacts];
                          updated[idx].value = e.target.value;
                          onUpdateContacts(updated);
                        }}
                        className="flex-1 px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = contacts.filter((_, i) => i !== idx);
                          onUpdateContacts(updated);
                        }}
                        className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-400 border border-red-800"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <input
                      type="text"
                      placeholder="URL (e.g. https://github.com/username)"
                      value={c.url}
                      onChange={(e) => {
                        const updated = [...contacts];
                        updated[idx].url = e.target.value;
                        onUpdateContacts(updated);
                      }}
                      className="w-full px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-400 text-[11px]"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: JSON EXPORT & IMPORT */}
          {activeTab === 'json' && (
            <div className="space-y-4 font-mono">
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                <div className="font-bold text-zinc-200">Export Life Index Settings to JSON:</div>
                <p className="text-zinc-400 font-sans">
                  Save all background pools, foxgirl mascot pools, projects list, and links to a portable configuration file.
                </p>
                <button
                  type="button"
                  onClick={handleExportJSON}
                  className="px-4 py-2 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-bold flex items-center gap-2 shadow-lg"
                >
                  <Download className="w-4 h-4" />
                  <span>Download insomnyawolf-life-index-config.json</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                <div className="font-bold text-zinc-200">Import Configuration:</div>
                <p className="text-zinc-400 font-sans">
                  Load an existing configuration file to restore all pools and links.
                </p>
                <label className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold cursor-pointer inline-flex items-center gap-2 border border-zinc-700">
                  <Upload className="w-4 h-4" />
                  <span>Upload config.json</span>
                  <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
                </label>
              </div>

              <div className="pt-2 flex justify-between items-center border-t border-zinc-800">
                <span className="text-zinc-500">Need to start fresh?</span>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Reset all pools and links to default?')) {
                      onResetAll();
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-900 text-red-300 font-bold flex items-center gap-1.5 border border-red-800"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Defaults</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/80 flex items-center justify-between">
          <span className="text-[11px] font-mono text-zinc-500">
            Saved automatically to local storage
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs transition-all shadow-md"
          >
            Done Editing
          </button>
        </div>

      </div>
    </div>
  );
};
