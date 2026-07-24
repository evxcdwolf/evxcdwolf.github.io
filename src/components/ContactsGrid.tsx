import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { ContactLink } from '../types';
import { Copy, Check, ExternalLink, Send, Mail, MessageSquare, Globe, Music, Gamepad2, ArrowUpRight, ShieldCheck } from 'lucide-react';

interface ContactsGridProps {
  contacts: ContactLink[];
}

export const ContactsGrid: React.FC<ContactsGridProps> = ({ contacts }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, textToCopy: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(id);

    confetti({
      particleCount: 18,
      spread: 50,
      colors: ['#ffffff', '#a1a1aa', '#52525b'],
    });

    setTimeout(() => setCopiedId(null), 2000);
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'gitlab':
        return (
          <svg className="w-5 h-5 fill-current text-orange-500" viewBox="0 0 24 24">
            <path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 4.82 2a.43.43 0 0 1 .58 0l2.56 7.88h8.08l2.56-7.88a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.21l2.44 7.51 1.22 3.78a.84.84 0 0 1-.3.94z"/>
          </svg>
        );
      case 'github':
        return (
          <svg className="w-5 h-5 fill-current text-zinc-100" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
        );
      case 'telegram':
        return <Send className="w-5 h-5 text-sky-400" />;
      case 'discord':
        return <MessageSquare className="w-5 h-5 text-indigo-400" />;
      case 'email':
        return <Mail className="w-5 h-5 text-purple-400" />;
      case 'steam':
        return <Gamepad2 className="w-5 h-5 text-blue-400" />;
      case 'spotify':
        return <Music className="w-5 h-5 text-emerald-400" />;
      default:
        return <Globe className="w-5 h-5 text-zinc-400" />;
    }
  };

  return (
    <section id="contacts" className="w-full py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Section Title */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-100 tracking-tight">
                Connect & Socials
              </h2>
              <p className="text-xs text-zinc-400 font-mono">
                Get in touch or check out my profiles
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 bg-zinc-900/80 px-3 py-1 rounded-full border border-zinc-800">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Encrypted & Verified</span>
          </div>
        </div>

        {/* Contacts Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {contacts.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all duration-200 group relative flex flex-col justify-between ${
                item.isPrimary
                  ? 'bg-zinc-900/80 border-zinc-700/80 hover:border-zinc-500 shadow-xl'
                  : 'bg-zinc-900/40 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-zinc-950 border border-zinc-800 group-hover:border-zinc-700 transition-colors">
                      {getPlatformIcon(item.platform)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-zinc-100 group-hover:text-white flex items-center gap-1.5">
                        <span>{item.title}</span>
                        {item.isPrimary && (
                          <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 bg-zinc-800 text-zinc-300 rounded border border-zinc-700">
                            Primary
                          </span>
                        )}
                      </h3>
                      <div className="text-xs font-mono text-zinc-400 font-medium">
                        {item.value}
                      </div>
                    </div>
                  </div>

                  {/* Actions: Copy and Open Link */}
                  <div className="flex items-center gap-1">
                    {item.copyable && (
                      <button
                        onClick={(e) => handleCopy(item.id, item.value, e)}
                        className="p-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors"
                        title="Copy handle/value"
                      >
                        {copiedId === item.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}

                    {item.url && item.url !== '#' && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors"
                        title="Open external link"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>

                {item.description && (
                  <p className="text-xs text-zinc-400 font-sans mt-2 leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>

              <div className="mt-3 pt-2.5 border-t border-zinc-800/60 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                <span>Status: Active</span>
                <span className="text-zinc-400 group-hover:text-zinc-200 transition-colors flex items-center gap-1">
                  <span>Connect</span>
                  <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
