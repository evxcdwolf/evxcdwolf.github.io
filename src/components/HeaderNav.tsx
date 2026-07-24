import React from 'react';
import { UserProfile, ThemeMode } from '../types';
import { Settings, SlidersHorizontal, Moon, Sun, Monitor, Code2, Sparkles, Download, ExternalLink, Music } from 'lucide-react';

interface HeaderNavProps {
  profile: UserProfile;
  themeMode: ThemeMode;
  onSelectTheme: (theme: ThemeMode) => void;
  onOpenCustomizer: () => void;
  onOpenGitLabExport: () => void;
  activeSection: string;
  onNavigateSection: (sectionId: string) => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  profile,
  themeMode,
  onSelectTheme,
  onOpenCustomizer,
  onOpenGitLabExport,
  activeSection,
  onNavigateSection,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-zinc-800/80 px-4 md:px-8 py-3 transition-all duration-200">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left Brand / Logo */}
        <div 
          onClick={() => onNavigateSection('hero')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-700/80 flex items-center justify-center text-lg shadow-inner group-hover:border-zinc-500 transition-colors">
            <span>{profile.statusEmoji || '🦊'}</span>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-zinc-950 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-tight text-zinc-100 group-hover:text-white transition-colors">
                {profile.name}
              </span>
              <span className="text-xs text-zinc-500 font-mono hidden sm:inline">
                {profile.username}
              </span>
            </div>
            <div className="text-[11px] text-zinc-400 font-mono truncate max-w-[140px] sm:max-w-xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>{profile.statusText}</span>
            </div>
          </div>
        </div>

        {/* Middle Quick Links / Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-zinc-900/70 p-1 rounded-xl border border-zinc-800 text-xs font-mono">
          {[
            { id: 'hero', label: 'Main Card' },
            { id: 'about', label: 'About Me' },
            { id: 'contacts', label: 'Contacts' },
            { id: 'projects', label: 'Projects' },
            { id: 'player', label: 'Lofi Audio' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => onNavigateSection(tab.id)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeSection === tab.id
                  ? 'bg-zinc-800 text-white font-medium border border-zinc-700 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          
          {/* GitLab Deploy Guide Button */}
          <button
            onClick={onOpenGitLabExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-mono border border-zinc-800 hover:border-zinc-700 transition-all shadow-sm"
            title="Export for GitLab Pages deployment"
          >
            <svg className="w-3.5 h-3.5 fill-current text-orange-400" viewBox="0 0 24 24">
              <path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 4.82 2a.43.43 0 0 1 .58 0l2.56 7.88h8.08l2.56-7.88a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.21l2.44 7.51 1.22 3.78a.84.84 0 0 1-.3.94z"/>
            </svg>
            <span className="hidden sm:inline font-medium">GitLab Deploy</span>
          </button>

          {/* Theme Mode Toggle Button */}
          <div className="relative group/theme">
            <button
              onClick={() => {
                const modes: ThemeMode[] = ['dark', 'monochrome-high-contrast', 'charcoal-soft', 'light-minimal'];
                const nextIndex = (modes.indexOf(themeMode) + 1) % modes.length;
                onSelectTheme(modes[nextIndex]);
              }}
              className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700 transition-all"
              title={`Theme: ${themeMode}`}
            >
              <Moon className="w-4 h-4" />
            </button>
          </div>

          {/* Customize Homepage Modal Toggle */}
          <button
            onClick={onOpenCustomizer}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-medium text-xs border border-white transition-all shadow-md active:scale-95"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-900" />
            <span className="font-semibold">Customize</span>
          </button>

        </div>
      </div>
    </header>
  );
};
