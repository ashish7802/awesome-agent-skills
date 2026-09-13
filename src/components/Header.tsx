import React from 'react';
import { ShieldCheck, FileSearch, Library, PlusCircle, Github, ExternalLink } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  activeTab: 'browse' | 'auditor';
  setActiveTab: (tab: 'browse' | 'auditor') => void;
  repoSkillCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  repoSkillCount,
}) => {
  const submitIssueUrl =
    'https://github.com/ashish7802/awesome-agent-skills/issues/new?template=new-skill.yml';

  return (
    <header className="border-b border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md sticky top-0 z-30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
          {/* Brand & Subtitle */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-500 shrink-0 shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  Awesome Agent Skills
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                  v2.0
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                Production-grade rules for Cursor (<code className="text-sky-600 dark:text-sky-400 font-mono">.mdc</code>), Claude Code (<code className="text-sky-600 dark:text-sky-400 font-mono">SKILL.md</code>), &amp; Copilot
              </p>
            </div>
          </div>

          {/* Navigation Controls & Actions */}
          <div className="flex items-center justify-between sm:justify-end gap-2 flex-wrap">
            {/* View Tabs */}
            <div
              role="tablist"
              className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800"
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'browse'}
                onClick={() => setActiveTab('browse')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'browse'
                    ? 'bg-sky-500 text-slate-950 font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
                }`}
              >
                <Library className="w-3.5 h-3.5" />
                <span>Browse Catalog</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {repoSkillCount}
                </span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'auditor'}
                onClick={() => setActiveTab('auditor')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'auditor'
                    ? 'bg-sky-500 text-slate-950 font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
                }`}
              >
                <FileSearch className="w-3.5 h-3.5" />
                <span>AI Rule Auditor</span>
              </button>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-1.5">
              <a
                href={submitIssueUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Submit a new agent skill"
                className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5 text-sky-500" />
                <span>Submit Skill</span>
              </a>

              <a
                href="https://github.com/ashish7802/awesome-agent-skills"
                target="_blank"
                rel="noopener noreferrer"
                title="View on GitHub"
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-sky-500 transition-colors"
              >
                <Github className="w-4 h-4" />
                <span className="sr-only">GitHub</span>
              </a>

              {/* Theme Toggle Button */}
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
