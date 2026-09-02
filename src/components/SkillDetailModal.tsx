import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Download,
  FileCode,
  ShieldCheck,
  Terminal,
  Layers,
  Sparkles,
  ExternalLink,
  Bot,
  Code2,
  CheckCircle2,
  AlertTriangle,
  FolderGit2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AgentSkill } from '../types';
import { DiffViewer } from './DiffViewer';

interface SkillDetailModalProps {
  skill: AgentSkill | null;
  onClose: () => void;
}

export const SkillDetailModal: React.FC<SkillDetailModalProps> = ({ skill, onClose }) => {
  if (!skill) return null;

  const [activeTab, setActiveTab] = useState<'full' | 'part1' | 'part2' | 'part3' | 'part4'>('full');
  const [copiedPart, setCopiedPart] = useState<string | null>(null);

  const handleCopy = (text: string, partId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPart(partId);
    confetti({
      particleCount: 40,
      spread: 55,
      origin: { y: 0.7 },
      colors: ['#3b82f6', '#10b981', '#a855f7'],
    });
    setTimeout(() => setCopiedPart(null), 2000);
  };

  const handleDownload = (format: 'mdc' | 'skill_md' | 'instructions_md') => {
    let filename = skill.metadata.fileNameSuggestion;
    if (format === 'skill_md') filename = 'SKILL.md';
    if (format === 'instructions_md') filename = 'copilot-instructions.md';

    const blob = new Blob([skill.masterInstruction.rawMarkdownPrompt], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="bg-card text-card-foreground border border-border/80 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Modal Top Header */}
        <div className="p-5 border-b border-border/80 flex items-start justify-between gap-4 bg-muted/30">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                {skill.category}
              </span>
              <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
                Repo: ashish7802 / awesome-agent-skills
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {skill.title}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {skill.tagline}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopy(skill.masterInstruction.rawMarkdownPrompt, 'all')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all shadow-xs cursor-pointer"
            >
              {copiedPart === 'all' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedPart === 'all' ? 'Copied All 4 Parts' : 'Copy Entire 4-Part'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 px-5 py-2.5 border-b border-border/60 bg-card overflow-x-auto text-xs font-medium scrollbar-none">
          <button
            onClick={() => setActiveTab('full')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'full'
                ? 'bg-foreground text-background font-semibold shadow-xs'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            📋 Complete 4-Part Blueprint
          </button>
          <button
            onClick={() => setActiveTab('part1')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'part1'
                ? 'bg-foreground text-background font-semibold shadow-xs'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            1. Metadata Block
          </button>
          <button
            onClick={() => setActiveTab('part2')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'part2'
                ? 'bg-foreground text-background font-semibold shadow-xs'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            2. System Boundary (MDC)
          </button>
          <button
            onClick={() => setActiveTab('part3')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'part3'
                ? 'bg-foreground text-background font-semibold shadow-xs'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            3. Master System Prompt
          </button>
          <button
            onClick={() => setActiveTab('part4')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'part4'
                ? 'bg-foreground text-background font-semibold shadow-xs'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            4. Before vs After
          </button>
        </div>

        {/* Modal Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 max-h-[calc(92vh-180px)]">
          {/* Quick Drop-in / Download Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-muted/40 rounded-xl border border-border/70 text-xs">
            <div className="flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-primary" />
              <span className="font-semibold text-foreground">Drop-in Target:</span>
              <code className="bg-card px-2 py-0.5 rounded font-mono font-medium text-foreground border border-border/50">
                {skill.metadata.targetPath}
              </code>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-muted-foreground hidden sm:inline">Export format:</span>
              <button
                onClick={() => handleDownload('mdc')}
                className="px-2.5 py-1 rounded bg-card hover:bg-muted border border-border text-foreground font-mono text-[11px] font-medium transition-colors cursor-pointer"
              >
                .mdc (Cursor)
              </button>
              <button
                onClick={() => handleDownload('skill_md')}
                className="px-2.5 py-1 rounded bg-card hover:bg-muted border border-border text-foreground font-mono text-[11px] font-medium transition-colors cursor-pointer"
              >
                SKILL.md (Claude)
              </button>
              <button
                onClick={() => handleDownload('instructions_md')}
                className="px-2.5 py-1 rounded bg-card hover:bg-muted border border-border text-foreground font-mono text-[11px] font-medium transition-colors cursor-pointer"
              >
                .md (Copilot/Windsurf)
              </button>
            </div>
          </div>

          {/* PART 1: FILE METADATA BLOCK */}
          {(activeTab === 'full' || activeTab === 'part1') && (
            <section className="space-y-3 rounded-xl border border-border/80 bg-card p-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
                    1
                  </span>
                  <h3 className="text-base font-bold text-foreground">FILE METADATA BLOCK</h3>
                </div>
                <button
                  onClick={() =>
                    handleCopy(
                      `### 1. FILE METADATA BLOCK\n- **File Name Suggestion**: \`${skill.metadata.fileNameSuggestion}\`\n- **Target Path**: \`${skill.metadata.targetPath}\`\n- **Compatible Agents**: [${skill.metadata.compatibleAgents.join(', ')}]`,
                      'part1'
                    )
                  }
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer"
                >
                  {copiedPart === 'part1' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPart === 'part1' ? 'Copied' : 'Copy Block'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-3 bg-muted/40 rounded-lg border border-border/50 space-y-1">
                  <span className="text-muted-foreground font-medium">File Name Suggestion</span>
                  <p className="font-mono font-bold text-foreground">{skill.metadata.fileNameSuggestion}</p>
                </div>
                <div className="p-3 bg-muted/40 rounded-lg border border-border/50 space-y-1">
                  <span className="text-muted-foreground font-medium">Target Path</span>
                  <p className="font-mono font-bold text-primary truncate">{skill.metadata.targetPath}</p>
                </div>
                <div className="p-3 bg-muted/40 rounded-lg border border-border/50 space-y-1">
                  <span className="text-muted-foreground font-medium">Compatible Agents</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {skill.metadata.compatibleAgents.map((agent) => (
                      <span key={agent} className="px-1.5 py-0.5 rounded bg-card text-[10px] font-medium text-foreground border border-border/60">
                        {agent}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* PART 2: SYSTEM BOUNDARY & CONTEXT SPEC */}
          {(activeTab === 'full' || activeTab === 'part2') && (
            <section className="space-y-3 rounded-xl border border-border/80 bg-card p-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
                    2
                  </span>
                  <h3 className="text-base font-bold text-foreground">
                    SYSTEM BOUNDARY & CONTEXT SPEC (The "MDC" Layout)
                  </h3>
                </div>
                <button
                  onClick={() =>
                    handleCopy(
                      `### 2. SYSTEM BOUNDARY & CONTEXT SPEC\n- **Globs / File Triggers**: ${skill.boundary.globs.join(', ')}\n- **Always Avoid**:\n${skill.boundary.alwaysAvoid.map((a) => `  - ${a}`).join('\n')}\n- **Enforced Stack**: ${skill.boundary.enforcedStack.join(', ')}`,
                      'part2'
                    )
                  }
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer"
                >
                  {copiedPart === 'part2' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPart === 'part2' ? 'Copied' : 'Copy Block'}</span>
                </button>
              </div>

              <div className="space-y-3 text-xs">
                {/* Globs */}
                <div>
                  <span className="font-semibold text-muted-foreground block mb-1">
                    🎯 Globs / File Triggers:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {skill.boundary.globs.map((glob) => (
                      <code key={glob} className="px-2 py-1 rounded bg-muted font-mono text-foreground font-semibold border border-border/60">
                        {glob}
                      </code>
                    ))}
                  </div>
                </div>

                {/* Always Avoid */}
                <div>
                  <span className="font-semibold text-red-600 dark:text-red-400 block mb-1.5">
                    ⛔ Always Avoid (Strict Anti-Patterns):
                  </span>
                  <ul className="space-y-1 bg-red-500/5 p-3 rounded-lg border border-red-500/10 text-muted-foreground">
                    {skill.boundary.alwaysAvoid.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                        <span className="text-foreground/90">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Enforced Stack */}
                <div>
                  <span className="font-semibold text-muted-foreground block mb-1">
                    📦 Enforced Stack:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {skill.boundary.enforcedStack.map((tech, idx) => (
                      <span key={idx} className="px-2 py-1 rounded bg-secondary text-secondary-foreground font-medium border border-border/50">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* PART 3: THE MASTER INSTRUCTION PROMPT */}
          {(activeTab === 'full' || activeTab === 'part3') && (
            <section className="space-y-3 rounded-xl border border-border/80 bg-card p-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
                    3
                  </span>
                  <h3 className="text-base font-bold text-foreground">
                    THE MASTER INSTRUCTION PROMPT (System Level)
                  </h3>
                </div>
                <button
                  onClick={() => handleCopy(skill.masterInstruction.rawMarkdownPrompt, 'part3')}
                  className="text-xs text-primary font-semibold hover:opacity-80 flex items-center gap-1 cursor-pointer"
                >
                  {copiedPart === 'part3' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPart === 'part3' ? 'Copied Prompt' : 'Copy System Block'}</span>
                </button>
              </div>

              {/* Persona */}
              <div className="p-3.5 bg-primary/5 rounded-lg border border-primary/15 text-xs">
                <span className="font-bold text-primary block mb-1 uppercase tracking-wider text-[11px]">
                  Role & Persona
                </span>
                <p className="text-foreground/90 leading-relaxed">{skill.masterInstruction.roleAndPersona}</p>
              </div>

              {/* Architectural Rules */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-foreground block">Architectural Rules</span>
                <div className="space-y-1.5 text-xs text-muted-foreground">
                  {skill.masterInstruction.architecturalRules.map((rule, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-muted/30 p-2.5 rounded-lg border border-border/40">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                      <span className="text-foreground/90">{rule}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* State & Data Flow */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-foreground block">State Management & Data Flow</span>
                <div className="space-y-1.5 text-xs text-muted-foreground">
                  {skill.masterInstruction.stateManagementAndDataFlow.map((flow, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-muted/30 p-2.5 rounded-lg border border-border/40">
                      <Layers className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-foreground/90">{flow}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Debugging & Error Prevention Protocol */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-foreground block">Debugging & Error Prevention Protocol</span>
                <div className="space-y-1.5 text-xs text-muted-foreground">
                  {skill.masterInstruction.debuggingAndErrorPrevention.map((proto, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-muted/30 p-2.5 rounded-lg border border-border/40">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                      <span className="text-foreground/90">{proto}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Raw Markdown Output Block */}
              <div className="mt-4">
                <span className="text-xs font-mono text-muted-foreground block mb-1">
                  Raw Output Markdown:
                </span>
                <div className="p-3.5 rounded-lg bg-muted/60 border border-border/70 font-mono text-xs overflow-x-auto max-h-56 overflow-y-auto">
                  <pre className="whitespace-pre">{skill.masterInstruction.rawMarkdownPrompt}</pre>
                </div>
              </div>
            </section>
          )}

          {/* PART 4: LIVE INTERACTIVE USAGE EXAMPLES */}
          {(activeTab === 'full' || activeTab === 'part4') && (
            <section className="space-y-3 rounded-xl border border-border/80 bg-card p-5 shadow-xs">
              <div className="border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
                    4
                  </span>
                  <h3 className="text-base font-bold text-foreground">
                    LIVE INTERACTIVE USAGE EXAMPLES
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {skill.comparison.description}
                </p>
              </div>

              <DiffViewer
                beforeCode={skill.comparison.beforeCode}
                beforeExplanation={skill.comparison.beforeExplanation}
                afterCode={skill.comparison.afterCode}
                afterExplanation={skill.comparison.afterExplanation}
                language={skill.comparison.language}
              />
            </section>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div className="p-4 border-t border-border/80 bg-muted/30 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span>Standardized for</span>
            <code className="font-mono text-foreground font-semibold">ashish7802/awesome-agent-skills</code>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopy(skill.masterInstruction.rawMarkdownPrompt, 'all-bottom')}
              className="px-3.5 py-1.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              {copiedPart === 'all-bottom' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedPart === 'all-bottom' ? 'Copied!' : 'Copy Entire 4-Part Prompt'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
