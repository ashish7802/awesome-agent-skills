import React from 'react';
import { ShieldCheck, AlertTriangle, XCircle, CheckCircle, Info } from 'lucide-react';
import { CategoryScores } from '../types';

interface ScoreGaugeProps {
  score: number;
  summary: string;
  categoryScores: CategoryScores;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, summary, categoryScores }) => {
  const getScoreColor = (val: number) => {
    if (val >= 80) return { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', bar: 'bg-emerald-400' };
    if (val >= 60) return { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', bar: 'bg-amber-400' };
    return { text: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30', bar: 'bg-rose-400' };
  };

  const getVerdictBadge = (val: number) => {
    if (val >= 80) return { label: 'PRODUCTION READY', icon: CheckCircle, style: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' };
    if (val >= 60) return { label: 'NEEDS REFACTORING', icon: AlertTriangle, style: 'bg-amber-500/15 text-amber-400 border-amber-500/30' };
    return { label: 'CRITICAL DEFECTS FOUND', icon: XCircle, style: 'bg-rose-500/15 text-rose-400 border-rose-500/30' };
  };

  const mainColor = getScoreColor(score);
  const verdict = getVerdictBadge(score);
  const VerdictIcon = verdict.icon;

  const categories = [
    { key: 'trigger_clarity', label: 'Trigger Clarity', desc: 'Precise file globs & use-when conditions', score: categoryScores.trigger_clarity },
    { key: 'fabrication_check', label: 'Fabrication & Hype Check', desc: 'Zero unverified stats or marketing claims', score: categoryScores.fabrication_check },
    { key: 'duplication', label: 'Duplication & Density', desc: 'No repetitive boilerplate wasting context', score: categoryScores.duplication },
    { key: 'actionability', label: 'Actionability', desc: 'Concrete technical rules vs vague fluff', score: categoryScores.actionability },
    { key: 'anti_pattern_completeness', label: 'Anti-Pattern Completeness', desc: 'Explicit negative constraints & bans', score: categoryScores.anti_pattern_completeness },
  ];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 space-y-6">
      
      {/* Top Main Score and Verdict */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-4">
          {/* Big Score Badge */}
          <div className={`h-20 w-20 rounded-2xl flex flex-col items-center justify-center border font-mono font-black ${mainColor.bg} ${mainColor.border}`}>
            <span className={`text-2xl sm:text-3xl ${mainColor.text}`}>{score}</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-sans">/ 100</span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Quality Audit Score</span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold border font-mono ${verdict.style}`}>
                <VerdictIcon className="w-3 h-3" />
                <span>{verdict.label}</span>
              </span>
            </div>
            <p className="text-sm text-slate-200 font-medium max-w-xl">
              {summary}
            </p>
          </div>
        </div>
      </div>

      {/* 5-Category Breakdown Grid */}
      <div className="space-y-3">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Audit Dimension Breakdown
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {categories.map((cat) => {
            const catColor = getScoreColor(cat.score);
            return (
              <div
                key={cat.key}
                className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col justify-between gap-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-semibold text-slate-200 block">{cat.label}</span>
                    <span className="text-[11px] text-slate-400 block">{cat.desc}</span>
                  </div>
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${catColor.bg} ${catColor.text}`}>
                    {cat.score}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${catColor.bar}`}
                    style={{ width: `${cat.score}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
