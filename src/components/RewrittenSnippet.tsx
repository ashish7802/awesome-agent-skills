import React, { useState } from 'react';
import { FileCode, Copy, Check, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RewrittenSnippetProps {
  snippet: string;
  originalFileName?: string;
}

export const RewrittenSnippet: React.FC<RewrittenSnippetProps> = ({ snippet, originalFileName }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.8 },
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-sky-500/30 bg-slate-900/90 p-5 sm:p-6 space-y-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span>Auditor Rewritten Production Snippet</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-sky-500/10 text-sky-300 border border-sky-500/20">
                Auto-Refactored
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Clean, hardened revision of the worst offending section with explicit globs and zero anti-patterns.
            </p>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer self-start sm:self-auto shadow-xs"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied to Clipboard' : 'Copy Fixed Snippet'}</span>
        </button>
      </div>

      {/* Code Area */}
      <div className="relative rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-slate-200 overflow-x-auto max-h-96">
        <pre className="whitespace-pre-wrap leading-relaxed">{snippet}</pre>
      </div>
    </div>
  );
};
