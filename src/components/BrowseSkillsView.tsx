import React, { useState, useMemo } from 'react';
import { Search, FileCode, Play, ShieldAlert, CheckCircle2, Filter, Layers, ExternalLink } from 'lucide-react';
import { RepoSkill, SkillCategory } from '../types';

interface BrowseSkillsViewProps {
  skills: RepoSkill[];
  onSelectForAudit: (content: string, fileName: string) => void;
}

export const BrowseSkillsView: React.FC<BrowseSkillsViewProps> = ({ skills, onSelectForAudit }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Compute categories dynamically from actual data
  const categories = useMemo(() => {
    const set = new Set<string>();
    skills.forEach((s) => set.add(s.category));
    return ['All', ...Array.from(set)];
  }, [skills]);

  // Dynamic filtering
  const filteredSkills = useMemo(() => {
    return skills.filter((skill) => {
      const matchesSearch =
        searchTerm === '' ||
        skill.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.globs.some((g) => g.toLowerCase().includes(searchTerm.toLowerCase())) ||
        skill.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCat = selectedCategory === 'All' || skill.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [skills, searchTerm, selectedCategory]);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Controls: Search & Category Pills */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-400" />
              <span>Repository Skill Rules Catalog</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {skills.length} Loaded
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Verified local rule files. Run any rule through the AI auditor to inspect its compliance score.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, glob, stack..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-sky-400 font-mono"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg whitespace-nowrap transition-all cursor-pointer font-medium ${
                selectedCategory === cat
                  ? 'bg-sky-500 text-slate-950 font-bold'
                  : 'bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Skill Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSkills.map((skill) => (
          <div
            key={skill.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 flex flex-col justify-between gap-4 hover:border-slate-700 transition-all group"
          >
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-sky-400 border border-slate-700 inline-block mb-1.5">
                    {skill.category}
                  </span>
                  <h3 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors">
                    {skill.title}
                  </h3>
                </div>

                <div className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                  {skill.fileName}
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-400 leading-relaxed">
                {skill.description}
              </p>

              {/* Globs */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">
                  Globs &amp; File Triggers
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {skill.globs.map((g, idx) => (
                    <code
                      key={idx}
                      className="text-[10px] font-mono bg-slate-950 text-slate-300 px-1.5 py-0.5 rounded border border-slate-800"
                    >
                      {g}
                    </code>
                  ))}
                </div>
              </div>

              {/* Enforced Stack */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">
                  Enforced Stack
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {skill.enforcedStack.map((stk, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded font-medium"
                    >
                      {stk}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-500 truncate max-w-[200px]">
                {skill.targetPath}
              </span>

              <button
                onClick={() => onSelectForAudit(skill.rawContent, skill.fileName)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500 text-sky-400 hover:text-slate-950 border border-sky-500/30 text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run Through Auditor</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
