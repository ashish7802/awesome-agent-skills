import React, { useState } from 'react';
import { X, Copy, Check, Terminal, FolderPlus, Bot, Sparkles, BookOpen } from 'lucide-react';

interface QuickStartGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickStartGuide: React.FC<QuickStartGuideProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copySnippet = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="bg-card text-card-foreground border border-border/80 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        <div className="p-5 border-b border-border/80 flex items-center justify-between bg-muted/30">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">
              Drop-In Setup & Agent Compatibility Guide
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm text-foreground flex-1">
          {/* Cursor Rules */}
          <div className="p-4 rounded-xl border border-border/80 bg-muted/20 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground flex items-center gap-2 text-sm">
                <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-mono text-xs">Cursor AI</span>
                <span>.cursor/rules/*.mdc</span>
              </span>
              <button
                onClick={() => copySnippet('mkdir -p .cursor/rules', 'cursor')}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer"
              >
                {copiedId === 'cursor' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === 'cursor' ? 'Copied' : 'Copy mkdir'}</span>
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Create a <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-foreground">.cursor/rules/</code> directory in the root of your project. Drop any <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-foreground">.mdc</code> blueprint file into that folder. Cursor will automatically trigger the rule whenever matching globs are active in your editor.
            </p>
          </div>

          {/* Claude Code Skills */}
          <div className="p-4 rounded-xl border border-border/80 bg-muted/20 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground flex items-center gap-2 text-sm">
                <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono text-xs">Claude Code</span>
                <span>.claude/skills/SKILL.md</span>
              </span>
              <button
                onClick={() => copySnippet('mkdir -p .claude/skills', 'claude')}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer"
              >
                {copiedId === 'claude' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === 'claude' ? 'Copied' : 'Copy mkdir'}</span>
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Save your agent capability instructions inside <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-foreground">.claude/skills/[skill-name]/SKILL.md</code>. Claude Code will load and enforce the master instructions during multi-step reasoning.
            </p>
          </div>

          {/* GitHub Copilot Workspace */}
          <div className="p-4 rounded-xl border border-border/80 bg-muted/20 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground flex items-center gap-2 text-sm">
                <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 font-mono text-xs">GitHub Copilot</span>
                <span>.github/copilot-instructions.md</span>
              </span>
              <button
                onClick={() => copySnippet('mkdir -p .github', 'copilot')}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer"
              >
                {copiedId === 'copilot' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === 'copilot' ? 'Copied' : 'Copy mkdir'}</span>
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Place the master instruction prompt directly into <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-foreground">.github/copilot-instructions.md</code> to guide all repository completions and PR suggestions.
            </p>
          </div>

          {/* Repository 4-Part Standard */}
          <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-2">
            <h4 className="font-bold text-foreground flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Standard for ashish7802 / awesome-agent-skills</span>
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Every blueprint in this repository strictly implements the 4-part architectural blueprint:
              <br />
              <strong>1. File Metadata</strong> &bull; <strong>2. System Boundary (MDC)</strong> &bull; <strong>3. Master Instruction Prompt</strong> &bull; <strong>4. Live Interactive Usage Examples</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
