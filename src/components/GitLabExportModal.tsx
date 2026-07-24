import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, Download, FileCode, Rocket, Sparkles, Terminal } from 'lucide-react';

interface GitLabExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
}

export const GitLabExportModal: React.FC<GitLabExportModalProps> = ({ isOpen, onClose, username }) => {
  const [copiedCi, setCopiedCi] = useState(false);
  const [copiedPkg, setCopiedPkg] = useState(false);

  if (!isOpen) return null;

  const gitlabCiYaml = `# .gitlab-ci.yml configuration for Vite React + GitLab Pages
image: node:20-alpine

cache:
  paths:
    - node_modules/

pages:
  stage: deploy
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - public
  rules:
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
`;

  const packageJsonScript = `"scripts": {
  "dev": "vite",
  "build": "vite build --outDir public",
  "preview": "vite preview"
}`;

  const handleCopyCi = () => {
    navigator.clipboard.writeText(gitlabCiYaml);
    setCopiedCi(true);
    setTimeout(() => setCopiedCi(false), 2000);
  };

  const handleCopyPkg = () => {
    navigator.clipboard.writeText(packageJsonScript);
    setCopiedPkg(true);
    setTimeout(() => setCopiedPkg(false), 2000);
  };

  const cleanUsername = username.replace('@', '').toLowerCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-2xl max-h-[90vh] rounded-3xl border border-zinc-800/90 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-800 bg-zinc-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 4.82 2a.43.43 0 0 1 .58 0l2.56 7.88h8.08l2.56-7.88a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.21l2.44 7.51 1.22 3.78a.84.84 0 0 1-.3.94z"/>
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Deploy Homepage to GitLab Pages</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-orange-500/20 text-orange-300 border border-orange-500/30">
                  Ready
                </span>
              </h2>
              <p className="text-xs text-zinc-400 font-mono">
                Automated CI/CD config & static build output guide
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs text-zinc-300 font-sans">
          
          {/* Target URL Info */}
          <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between gap-4">
            <div>
              <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Your Live GitLab Pages URL:</div>
              <div className="text-sm font-bold font-mono text-emerald-400 mt-0.5">
                https://{cleanUsername}.gitlab.io/
              </div>
            </div>
            <a
              href={`https://gitlab.com/${cleanUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 font-mono text-xs flex items-center gap-1.5 transition-colors"
            >
              <span>Go to GitLab</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Quick Steps */}
          <div className="space-y-3">
            <h3 className="font-mono font-bold text-zinc-100 flex items-center gap-2">
              <Rocket className="w-4 h-4 text-zinc-300" />
              <span>3-Step GitLab Deployment Checklist</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
                <div className="font-mono font-bold text-white text-xs">1. Create Repo</div>
                <p className="text-[11px] text-zinc-400">
                  Create a new GitLab project named <span className="font-mono text-zinc-200">{cleanUsername}.gitlab.io</span> or <span className="font-mono text-zinc-200">homepage</span>.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
                <div className="font-mono font-bold text-white text-xs">2. Add CI Config</div>
                <p className="text-[11px] text-zinc-400">
                  Add <span className="font-mono text-zinc-200">.gitlab-ci.yml</span> to your project root (see template below).
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
                <div className="font-mono font-bold text-white text-xs">3. Push & Deploy</div>
                <p className="text-[11px] text-zinc-400">
                  GitLab CI will automatically compile Vite into <span className="font-mono text-zinc-200">public/</span> and publish!
                </p>
              </div>
            </div>
          </div>

          {/* Code Snippet 1: .gitlab-ci.yml */}
          <div className="space-y-2">
            <div className="flex items-center justify-between font-mono">
              <span className="font-bold text-zinc-200 flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-orange-400" />
                <span>.gitlab-ci.yml Template</span>
              </span>
              <button
                onClick={handleCopyCi}
                className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs flex items-center gap-1 transition-colors"
              >
                {copiedCi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCi ? 'Copied!' : 'Copy YAML'}</span>
              </button>
            </div>

            <pre className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 font-mono text-[11px] text-zinc-300 overflow-x-auto leading-relaxed">
              {gitlabCiYaml}
            </pre>
          </div>

          {/* Code Snippet 2: package.json script tip */}
          <div className="space-y-2">
            <div className="flex items-center justify-between font-mono">
              <span className="font-bold text-zinc-200 flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-sky-400" />
                <span>package.json Build Script (Output to public/)</span>
              </span>
              <button
                onClick={handleCopyPkg}
                className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs flex items-center gap-1 transition-colors"
              >
                {copiedPkg ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPkg ? 'Copied!' : 'Copy Script'}</span>
              </button>
            </div>

            <pre className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 font-mono text-[11px] text-zinc-300 overflow-x-auto">
              {packageJsonScript}
            </pre>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/80 flex items-center justify-between">
          <span className="text-[11px] font-mono text-zinc-500">
            Fully compatible with GitLab Pages static hosting
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs transition-all shadow-md"
          >
            Got it!
          </button>
        </div>

      </div>
    </div>
  );
};
