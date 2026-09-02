import React from 'react';
import { Sparkles, Terminal, Code2, Bot, Layers, Search, PlusCircle, ExternalLink, ShieldCheck } from 'lucide-react';
import { AgentTool, SkillCategory } from '../types';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: SkillCategory | 'All';
  setSelectedCategory: (cat: SkillCategory | 'All') => void;
  selectedTool: AgentTool;
  setSelectedTool: (tool: AgentTool) => void;
  onOpenGenerator: () => void;
  onOpenGuide: () => void;
  totalSkillsCount: number;
}

const CATEGORIES: (SkillCategory | 'All')[] = [
  'All',
  'Fullstack & SaaS',
  'Frontend & Web',
  'Backend & APIs',
  'AI & LLM Orchestration',
  'Database & Security',
  'Mobile & Edge',
  'Systems & DevOps',
];

const AGENT_TOOLS: AgentTool[] = [
  'All Agents',
  'Cursor AI',
  'Claude Code',
  'Windsurf',
  'GitHub Copilot Workspace',
  'Cline',
];

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedTool,
  setSelectedTool,
  onOpenGenerator,
  onOpenGuide,
  totalSkillsCount,
}) => {
  return (
    <header className="border-b border-border/80 bg-card/60 backdrop-blur-md sticky top-0 z-30 transition-all">
      {/* Top Banner with Repo Metadata */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b border-border/40 text-xs">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 text-primary font-medium border border-primary/20">
            <Bot className="w-3.5 h-3.5" />
            <span>Repository:</span>
            <strong className="font-mono text-foreground">ashish7802 / awesome-agent-skills</strong>
          </div>
          <span className="text-muted-foreground hidden sm:inline">•</span>
          <div className="flex items-center gap-1 text-muted-foreground">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Strict 4-Part MDC & SKILL.md Standard</span>
          </div>
          <span className="text-muted-foreground hidden sm:inline">•</span>
          <span className="text-muted-foreground font-mono">{totalSkillsCount} Production Blueprints</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-secondary hover:bg-secondary/80 text-foreground text-xs font-medium border border-border/60 transition-colors cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-primary" />
            <span>Drop-in Instructions</span>
          </button>
          <button
            onClick={onOpenGenerator}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shadow-xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>New Blueprint</span>
          </button>
        </div>
      </div>

      {/* Main Hero / Title Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <Code2 className="w-5 h-5" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-sans">
                Awesome Agent Skills Architect
              </h1>
            </div>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Production-grade Cursor Rule Templates (<code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono text-foreground">.mdc</code>) and Claude Code Custom Instructions (<code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono text-foreground">SKILL.md</code>) built with strict 4-part architectural discipline.
            </p>
          </div>

          {/* Quick Search and Tool Selector */}
          <div className="flex flex-col sm:flex-row gap-2.5 w-full lg:w-auto">
            <div className="relative flex-1 sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search skills, globs, stacks..."
                className="w-full pl-9 pr-3.5 py-2 text-sm bg-muted/60 border border-border/80 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:bg-background transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Target Agent Filter */}
            <select
              value={selectedTool}
              onChange={(e) => setSelectedTool(e.target.value as AgentTool)}
              className="px-3 py-2 text-sm bg-card border border-border/80 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-primary/40 text-foreground font-medium cursor-pointer"
            >
              {AGENT_TOOLS.map((tool) => (
                <option key={tool} value={tool}>
                  {tool === 'All Agents' ? '🤖 Target: All AI Agents' : `⚡ ${tool}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="mt-5 flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-xs font-semibold'
                    : 'bg-muted/70 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/40'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
