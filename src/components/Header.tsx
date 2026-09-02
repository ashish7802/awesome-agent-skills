import React from 'react';
import { ShieldCheck, FileSearch, Library, Terminal, Sparkles, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  activeTab: 'auditor' | 'browse';
  setActiveTab: (tab: 'auditor' | 'browse') => void;
  repoSkillCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  repoSkillCount,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Skill Auditor
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                  AI Rule Linter
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Actionable quality analyzer for Cursor <code className="text-sky-300 font-mono">.mdc</code> &amp; Claude <code className="text-sky-300 font-mono">SKILL.md</code> files
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('auditor')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'auditor'
                  ? 'bg-sky-500 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <FileSearch className="w-3.5 h-3.5" />
              <span>Audit Tool</span>
            </button>

            <button
              onClick={() => setActiveTab('browse')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'browse'
                  ? 'bg-sky-500 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Library className="w-3.5 h-3.5" />
              <span>Browse Repository ({repoSkillCount})</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
