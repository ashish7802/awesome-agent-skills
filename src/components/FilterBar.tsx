import React from 'react';
import { AgentType, SkillCategory } from '../types';
import { Sparkles, Terminal, Bot, Cpu, Layers, RotateCcw } from 'lucide-react';

interface FilterBarProps {
  selectedAgent: 'all' | AgentType;
  onSelectAgent: (agent: 'all' | AgentType) => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  categories: string[];
  agentCounts: Record<'all' | AgentType, number>;
  totalCount: number;
  filteredCount: number;
  onReset: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedAgent,
  onSelectAgent,
  selectedCategory,
  onSelectCategory,
  categories,
  agentCounts,
  totalCount,
  filteredCount,
  onReset,
}) => {
  const isFiltered = selectedAgent !== 'all' || selectedCategory !== 'All';

  const agentOptions: Array<{ id: 'all' | AgentType; label: string; icon: React.ReactNode }> = [
    { id: 'all', label: 'All Agents', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'cursor', label: 'Cursor (.mdc)', icon: <Terminal className="w-3.5 h-3.5" /> },
    { id: 'claude', label: 'Claude Code', icon: <Bot className="w-3.5 h-3.5" /> },
    { id: 'copilot', label: 'Copilot', icon: <Cpu className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="space-y-4">
      {/* Agent Selector Tabs & Results Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Agent Filter Group */}
        <div
          role="group"
          aria-label="Filter by target agent"
          className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs overflow-x-auto"
        >
          {agentOptions.map((opt) => {
            const isActive = selectedAgent === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onSelectAgent(opt.id)}
                aria-pressed={isActive}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-sky-500 text-slate-950 font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
                }`}
              >
                {opt.icon}
                <span>{opt.label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                    isActive
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {agentCounts[opt.id] ?? 0}
                </span>
              </button>
            );
          })}
        </div>

        {/* Results Counter & Reset Action */}
        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 self-end sm:self-center font-mono">
          <span>
            Showing <strong className="text-slate-900 dark:text-slate-100">{filteredCount}</strong> of{' '}
            <span>{totalCount}</span> skills
          </span>

          {isFiltered && (
            <button
              type="button"
              onClick={onReset}
              className="flex items-center gap-1 px-2 py-1 rounded text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/40 border border-sky-200 dark:border-sky-900/50 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Pills Group */}
      <div
        role="group"
        aria-label="Filter by skill category"
        className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar"
      >
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onSelectCategory(cat)}
              aria-pressed={isActive}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer font-medium text-xs ${
                isActive
                  ? 'bg-slate-900 dark:bg-sky-500 text-white dark:text-slate-950 font-bold shadow-xs'
                  : 'bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
};
