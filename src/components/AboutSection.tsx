import React, { useState } from 'react';
import { UserProfile, TechStackItem } from '../types';
import { Code2, Server, Terminal, Cpu, Zap, Heart, Check, Copy, Laptop, Flame } from 'lucide-react';

interface AboutSectionProps {
  profile: UserProfile;
  techStack: TechStackItem[];
}

export const AboutSection: React.FC<AboutSectionProps> = ({ profile, techStack }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedCurl, setCopiedCurl] = useState(false);

  const categories = ['All', 'Frontend', 'Backend', 'Tools & DevOps', 'Languages'];

  const filteredStack = selectedCategory === 'All'
    ? techStack
    : techStack.filter((item) => item.category === selectedCategory);

  const curlCommand = `curl -s https://gitlab.com/${profile.username.replace('@', '')}/about.json`;

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(curlCommand);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  return (
    <section id="about" className="w-full py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Section Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-100 tracking-tight">
                About & Tech Stack
              </h2>
              <p className="text-xs text-zinc-400 font-mono">
                Tools, technologies & personal development environment
              </p>
            </div>
          </div>

          <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hidden sm:inline">
            {techStack.length} Technologies
          </span>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all border ${
                selectedCategory === cat
                  ? 'bg-zinc-100 text-zinc-950 font-semibold border-white shadow-sm'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:border-zinc-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tech Stack Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {filteredStack.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700/80 transition-all group hover:bg-zinc-900"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-300 group-hover:text-white group-hover:border-zinc-600 transition-colors">
                  <Cpu className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono text-zinc-500 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-850">
                  {item.category}
                </span>
              </div>
              
              <div className="font-semibold text-xs text-zinc-200 group-hover:text-white">
                {item.name}
              </div>
              <div className="text-[11px] text-zinc-400 font-mono mt-0.5">
                {item.experienceLevel || 'Proficient'}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Setup / Terminal Snippet */}
        <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-300 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-[11px] text-zinc-400 pl-2">bash — fetch-profile.sh</span>
            </div>

            <button
              onClick={handleCopyCurl}
              className="px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 text-[10px] flex items-center gap-1 transition-colors"
            >
              {copiedCurl ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy curl</span>
                </>
              )}
            </button>
          </div>

          <div className="pt-1 text-zinc-400 overflow-x-auto space-y-1">
            <div className="text-zinc-300">
              <span className="text-emerald-400">$</span> {curlCommand}
            </div>
            <div className="text-zinc-400 text-[11px]">
              &#123; "status": "200 OK", "user": "{profile.name}", "theme": "monochrome", "foxgirl_sticker": "active" &#125;
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
