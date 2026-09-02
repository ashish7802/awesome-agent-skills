import React, { useState } from 'react';
import { Check, Copy, XCircle, CheckCircle2, SplitSquareVertical, Columns } from 'lucide-react';

interface DiffViewerProps {
  beforeCode: string;
  beforeExplanation: string;
  afterCode: string;
  afterExplanation: string;
  language: string;
}

export const DiffViewer: React.FC<DiffViewerProps> = ({
  beforeCode,
  beforeExplanation,
  afterCode,
  afterExplanation,
  language,
}) => {
  const [viewMode, setViewMode] = useState<'split' | 'tabbed'>('split');
  const [activeTab, setActiveTab] = useState<'after' | 'before'>('after');
  const [copiedBefore, setCopiedBefore] = useState(false);
  const [copiedAfter, setCopiedAfter] = useState(false);

  const copyToClipboard = (text: string, isAfter: boolean) => {
    navigator.clipboard.writeText(text);
    if (isAfter) {
      setCopiedAfter(true);
      setTimeout(() => setCopiedAfter(false), 2000);
    } else {
      setCopiedBefore(true);
      setTimeout(() => setCopiedBefore(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header controls */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Interactive Live Comparison
          </span>
          <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded text-foreground">
            {language}
          </span>
        </div>

        <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border/60 text-xs">
          <button
            onClick={() => setViewMode('split')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${
              viewMode === 'split' ? 'bg-card text-foreground font-semibold shadow-xs' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Side by Side</span>
          </button>
          <button
            onClick={() => setViewMode('tabbed')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${
              viewMode === 'tabbed' ? 'bg-card text-foreground font-semibold shadow-xs' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <SplitSquareVertical className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tabs</span>
          </button>
        </div>
      </div>

      {viewMode === 'split' ? (
        /* Split view */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Before Column */}
          <div className="rounded-xl border border-red-500/20 bg-red-950/5 overflow-hidden flex flex-col">
            <div className="bg-red-500/10 px-4 py-2.5 border-b border-red-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-500" />
                <span className="text-xs font-bold text-red-600 dark:text-red-400">
                  ❌ Before (Standard AI Output)
                </span>
              </div>
              <button
                onClick={() => copyToClipboard(beforeCode, false)}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                title="Copy code"
              >
                {copiedBefore ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedBefore ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="p-3 bg-muted/20 border-b border-red-500/10 text-xs text-muted-foreground leading-relaxed">
              {beforeExplanation}
            </div>
            <div className="p-4 font-mono text-xs overflow-x-auto bg-card/80 text-foreground/90 leading-relaxed max-h-[380px] overflow-y-auto">
              <pre className="whitespace-pre">{beforeCode}</pre>
            </div>
          </div>

          {/* After Column */}
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/5 overflow-hidden flex flex-col shadow-xs">
            <div className="bg-emerald-500/10 px-4 py-2.5 border-b border-emerald-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  ✅ After (With This Skill Active)
                </span>
              </div>
              <button
                onClick={() => copyToClipboard(afterCode, true)}
                className="text-xs text-emerald-600 dark:text-emerald-400 hover:opacity-80 flex items-center gap-1 font-medium"
                title="Copy code"
              >
                {copiedAfter ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedAfter ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="p-3 bg-emerald-500/5 border-b border-emerald-500/10 text-xs text-emerald-700 dark:text-emerald-300/90 leading-relaxed font-medium">
              {afterExplanation}
            </div>
            <div className="p-4 font-mono text-xs overflow-x-auto bg-card text-foreground leading-relaxed max-h-[380px] overflow-y-auto">
              <pre className="whitespace-pre">{afterCode}</pre>
            </div>
          </div>
        </div>
      ) : (
        /* Tabbed view */
        <div className="rounded-xl border border-border/80 bg-card overflow-hidden">
          <div className="flex items-center border-b border-border/80 bg-muted/40 p-1.5 gap-2">
            <button
              onClick={() => setActiveTab('after')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'after'
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>✅ After (Enforced Skill)</span>
            </button>
            <button
              onClick={() => setActiveTab('before')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'before'
                  ? 'bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <XCircle className="w-4 h-4 text-red-500" />
              <span>❌ Before (Standard AI)</span>
            </button>
          </div>

          {activeTab === 'after' ? (
            <div>
              <div className="p-3 bg-emerald-500/5 border-b border-border/60 text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                {afterExplanation}
              </div>
              <div className="p-4 font-mono text-xs overflow-x-auto bg-card text-foreground max-h-[420px] overflow-y-auto">
                <pre className="whitespace-pre">{afterCode}</pre>
              </div>
            </div>
          ) : (
            <div>
              <div className="p-3 bg-red-500/5 border-b border-border/60 text-xs text-red-600 dark:text-red-400">
                {beforeExplanation}
              </div>
              <div className="p-4 font-mono text-xs overflow-x-auto bg-card text-foreground/80 max-h-[420px] overflow-y-auto">
                <pre className="whitespace-pre">{beforeCode}</pre>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
