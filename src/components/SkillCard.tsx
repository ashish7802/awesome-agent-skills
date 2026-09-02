import React, { useState } from 'react';
import { FileCode2, Copy, Check, ArrowRight, Download, Terminal, ShieldAlert, Sparkles, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AgentSkill } from '../types';

interface SkillCardProps {
  skill: AgentSkill;
  onSelect: (skill: AgentSkill) => void;
}

export const SkillCard: React.FC<SkillCardProps> = ({ skill, onSelect }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyRaw = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(skill.masterInstruction.rawMarkdownPrompt);
    setCopied(true);
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#3b82f6', '#10b981', '#8b5cf6'],
    });
    setTimeout(() => setCopied(false), 2200);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const blob = new Blob([skill.masterInstruction.rawMarkdownPrompt], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = skill.metadata.fileNameSuggestion;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      onClick={() => onSelect(skill)}
      className="group relative rounded-xl border border-border/80 bg-card p-5 shadow-xs transition-all duration-200 hover:border-primary/50 hover:shadow-md cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20">
              {skill.category}
            </span>
            {skill.popular && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                <span>Featured</span>
              </span>
            )}
          </div>
          <span className="text-[11px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
            v{skill.metadata.version}
          </span>
        </div>

        {/* Title & Tagline */}
        <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
          {skill.title}
        </h3>
        <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
          {skill.tagline}
        </p>

        {/* Target File & Globs */}
        <div className="mt-4 space-y-2 bg-muted/40 p-2.5 rounded-lg border border-border/50 text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <FileCode2 className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="font-mono text-foreground font-medium truncate">{skill.metadata.targetPath}</span>
          </div>

          <div className="flex items-center gap-1.5 text-muted-foreground flex-wrap">
            <Terminal className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <span className="text-[11px] text-muted-foreground font-mono truncate">
              {skill.boundary.globs.join(', ')}
            </span>
          </div>
        </div>

        {/* Quick Avoid Rule preview */}
        {skill.boundary.alwaysAvoid.length > 0 && (
          <div className="mt-3 flex items-start gap-1.5 text-[11px] text-red-600/90 dark:text-red-400/90 bg-red-500/5 p-2 rounded-md border border-red-500/10">
            <ShieldAlert className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span className="line-clamp-1">{skill.boundary.alwaysAvoid[0]}</span>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="mt-5 pt-3.5 border-t border-border/60 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopyRaw}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              copied
                ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'bg-muted hover:bg-muted/80 text-foreground'
            }`}
            title="Copy entire 4-part prompt"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied 4-Part' : 'Copy'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="p-1.5 rounded-lg text-xs bg-muted hover:bg-muted/80 text-foreground transition-colors"
            title={`Download ${skill.metadata.fileNameSuggestion}`}
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          onClick={() => onSelect(skill)}
          className="flex items-center gap-1 text-xs font-semibold text-primary group-hover:translate-x-0.5 transition-transform"
        >
          <span>Inspect Spec</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
