import React from 'react';
import { ProjectCard } from '../types';
import { FolderGit2, Star, ExternalLink, GitBranch, ArrowUpRight, Sparkles } from 'lucide-react';

interface ProjectsGridProps {
  projects: ProjectCard[];
}

export const ProjectsGrid: React.FC<ProjectsGridProps> = ({ projects }) => {
  return (
    <section id="projects" className="w-full py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Section Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300">
              <FolderGit2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-100 tracking-tight">
                Featured Projects
              </h2>
              <p className="text-xs text-zinc-400 font-mono">
                Open source repositories & side projects
              </p>
            </div>
          </div>

          <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400">
            {projects.length} Repositories
          </span>
        </div>

        {/* Projects Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700/80 transition-all duration-200 flex flex-col justify-between group hover:bg-zinc-900/80 shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300">
                      <GitBranch className="w-3.5 h-3.5" />
                    </div>
                    <h3 className="font-bold text-sm text-zinc-100 group-hover:text-white transition-colors">
                      {proj.title}
                    </h3>
                  </div>

                  {proj.stars !== undefined && (
                    <div className="flex items-center gap-1 text-xs font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{proj.stars}</span>
                    </div>
                  )}
                </div>

                <p className="text-xs text-zinc-400 font-sans leading-relaxed mb-4">
                  {proj.description}
                </p>
              </div>

              <div>
                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {proj.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-950 text-zinc-400 border border-zinc-850"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Footer Links */}
                <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80 text-xs font-mono">
                  {proj.repoUrl && (
                    <a
                      href={proj.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
                    >
                      <span>Repository</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  )}

                  {proj.liveUrl && proj.liveUrl !== '#' && (
                    <a
                      href={proj.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 transition-colors"
                    >
                      <span>Live Demo</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
