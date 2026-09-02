import React, { useState, useMemo } from 'react';
import { Sparkles, Terminal, Code2, Layers, ShieldCheck, Filter, ArrowUpRight, Plus, Star, Github } from 'lucide-react';
import { SKILLS_CATALOG } from './data/skillsData';
import { AgentSkill, AgentTool, SkillCategory } from './types';
import { Header } from './components/Header';
import { SkillCard } from './components/SkillCard';
import { SkillDetailModal } from './components/SkillDetailModal';
import { CustomGeneratorModal } from './components/CustomGeneratorModal';
import { QuickStartGuide } from './components/QuickStartGuide';

export default function App() {
  const [skills, setSkills] = useState<AgentSkill[]>(SKILLS_CATALOG);
  const [selectedSkill, setSelectedSkill] = useState<AgentSkill | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | 'All'>('All');
  const [selectedTool, setSelectedTool] = useState<AgentTool>('All Agents');
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Filter skills by search, category, and target tool
  const filteredSkills = useMemo(() => {
    return skills.filter((skill) => {
      // Category filter
      if (selectedCategory !== 'All' && skill.category !== selectedCategory) {
        return false;
      }

      // Tool filter
      if (
        selectedTool !== 'All Agents' &&
        !skill.metadata.compatibleAgents.includes(selectedTool)
      ) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = skill.title.toLowerCase().includes(query);
        const matchesTagline = skill.tagline.toLowerCase().includes(query);
        const matchesGlobs = skill.boundary.globs.some((g) => g.toLowerCase().includes(query));
        const matchesStack = skill.boundary.enforcedStack.some((s) => s.toLowerCase().includes(query));
        const matchesPath = skill.metadata.targetPath.toLowerCase().includes(query);

        return matchesTitle || matchesTagline || matchesGlobs || matchesStack || matchesPath;
      }

      return true;
    });
  }, [skills, searchQuery, selectedCategory, selectedTool]);

  const handleAddNewSkill = (newSkill: AgentSkill) => {
    setSkills((prev) => [newSkill, ...prev]);
    setSelectedSkill(newSkill);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20">
      {/* Header */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedTool={selectedTool}
        setSelectedTool={setSelectedTool}
        onOpenGenerator={() => setIsGeneratorOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
        totalSkillsCount={skills.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Core Engine Status & Blueprint Banner */}
        <section className="rounded-2xl border border-border/80 bg-gradient-to-br from-card via-card to-muted/40 p-6 sm:p-8 shadow-xs relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                <ShieldCheck className="w-4 h-4" />
                <span>Elite AI Agent Architecture Engine Online</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                The Standard for Agent Skills & MDC Rules
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Empowering <strong className="text-foreground font-semibold">ashish7802/awesome-agent-skills</strong> with production-tested Cursor Rules (<code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded text-foreground">.mdc</code>), Claude Code capabilities (<code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded text-foreground">SKILL.md</code>), and Copilot instructions following the 4-part architectural blueprint.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => setIsGeneratorOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Architect Custom Blueprint</span>
              </button>
              <button
                onClick={() => setIsGuideOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium text-sm border border-border/60 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Layers className="w-4 h-4" />
                <span>Drop-in Instructions</span>
              </button>
            </div>
          </div>

          {/* Quick 4-Part Blueprint Spec Badges */}
          <div className="mt-6 pt-6 border-t border-border/60 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                1
              </div>
              <div>
                <span className="font-bold text-foreground block">File Metadata</span>
                <span className="text-[11px] text-muted-foreground">Standard target headers</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                2
              </div>
              <div>
                <span className="font-bold text-foreground block">System Boundary</span>
                <span className="text-[11px] text-muted-foreground">Globs, avoids & stacks</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                3
              </div>
              <div>
                <span className="font-bold text-foreground block">Master Prompt</span>
                <span className="text-[11px] text-muted-foreground">Persona & protocols</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                4
              </div>
              <div>
                <span className="font-bold text-foreground block">Live Examples</span>
                <span className="text-[11px] text-muted-foreground">Before ❌ vs After ✅</span>
              </div>
            </div>
          </div>
        </section>

        {/* Catalog Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-foreground">
                Repository Catalog
              </h3>
              <span className="text-xs font-medium text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full">
                {filteredSkills.length} {filteredSkills.length === 1 ? 'Blueprint' : 'Blueprints'}
              </span>
            </div>

            {(selectedCategory !== 'All' || selectedTool !== 'All Agents' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedTool('All Agents');
                  setSearchQuery('');
                }}
                className="text-xs text-primary hover:underline cursor-pointer"
              >
                Reset all filters
              </button>
            )}
          </div>

          {filteredSkills.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-border/80 bg-muted/20 space-y-3">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
                <Filter className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-foreground">No matching agent skills found</h4>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                No blueprints match your filter criteria. Try clearing search terms or create a custom blueprint with the generator.
              </p>
              <button
                onClick={() => setIsGeneratorOpen(true)}
                className="mt-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate This Blueprint</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredSkills.map((skill) => (
                <SkillCard
                  key={skill.id}
                  skill={skill}
                  onSelect={(s) => setSelectedSkill(s)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-card py-6 mt-12 text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">awesome-agent-skills</span>
            <span>•</span>
            <span>Managed by <strong className="text-foreground">ashish7802</strong></span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span>Built for Cursor AI, Claude Code, Windsurf, Copilot, Cline</span>
          </div>
        </div>
      </footer>

      {/* Detail Modal */}
      <SkillDetailModal
        skill={selectedSkill}
        onClose={() => setSelectedSkill(null)}
      />

      {/* Custom Generator Modal */}
      <CustomGeneratorModal
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        onSkillGenerated={handleAddNewSkill}
      />

      {/* Quick Start Guide Modal */}
      <QuickStartGuide
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}
