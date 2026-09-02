import React, { useState } from 'react';
import { AlertCircle, AlertTriangle, Info, Copy, Check, Wrench, Filter, ShieldAlert } from 'lucide-react';
import { AuditIssue, IssueSeverity, AuditCategory } from '../types';

interface IssuesListProps {
  issues: AuditIssue[];
}

export const IssuesList: React.FC<IssuesListProps> = ({ issues }) => {
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyFix = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const criticalCount = issues.filter((i) => i.severity === 'critical').length;
  const warningCount = issues.filter((i) => i.severity === 'warning').length;
  const nitCount = issues.filter((i) => i.severity === 'nit').length;

  const filteredIssues = issues.filter((issue) => {
    const matchesSeverity = selectedSeverity === 'all' || issue.severity === selectedSeverity;
    const matchesCategory = selectedCategory === 'all' || issue.category === selectedCategory;
    return matchesSeverity && matchesCategory;
  });

  const getSeverityBadge = (sev: IssueSeverity) => {
    switch (sev) {
      case 'critical':
        return {
          label: 'CRITICAL',
          icon: AlertCircle,
          badge: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
        };
      case 'warning':
        return {
          label: 'WARNING',
          icon: AlertTriangle,
          badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
        };
      case 'nit':
        return {
          label: 'NIT',
          icon: Info,
          badge: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
        };
    }
  };

  const getCategoryLabel = (cat: AuditCategory) => {
    switch (cat) {
      case 'trigger_clarity':
        return 'Trigger Clarity';
      case 'fabrication_check':
        return 'Fabrication Check';
      case 'duplication':
        return 'Duplication';
      case 'actionability':
        return 'Actionability';
      case 'anti_pattern_completeness':
        return 'Anti-Patterns';
      default:
        return cat;
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 space-y-5">
      
      {/* Header and Severity Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-sky-400" />
            <span>Actionable Fix Report</span>
            <span className="text-xs font-mono font-normal text-slate-400">
              ({issues.length} detected)
            </span>
          </h3>
          <p className="text-xs text-slate-400">
            Issues ranked by production severity with deterministic fix instructions.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setSelectedSeverity('all')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              selectedSeverity === 'all'
                ? 'bg-slate-800 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({issues.length})
          </button>
          <button
            onClick={() => setSelectedSeverity('critical')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
              selectedSeverity === 'critical'
                ? 'bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30'
                : 'text-rose-400/80 hover:text-rose-300'
            }`}
          >
            <span>Critical</span>
            <span className="font-mono text-[10px]">({criticalCount})</span>
          </button>
          <button
            onClick={() => setSelectedSeverity('warning')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
              selectedSeverity === 'warning'
                ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30'
                : 'text-amber-400/80 hover:text-amber-300'
            }`}
          >
            <span>Warning</span>
            <span className="font-mono text-[10px]">({warningCount})</span>
          </button>
          <button
            onClick={() => setSelectedSeverity('nit')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
              selectedSeverity === 'nit'
                ? 'bg-sky-500/20 text-sky-300 font-semibold border border-sky-500/30'
                : 'text-sky-400/80 hover:text-sky-300'
            }`}
          >
            <span>Nit</span>
            <span className="font-mono text-[10px]">({nitCount})</span>
          </button>
        </div>
      </div>

      {/* Issues Listing */}
      {filteredIssues.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-slate-800 rounded-xl space-y-2">
          <p className="text-sm text-emerald-400 font-medium">
            No issues found for the selected filter!
          </p>
          <p className="text-xs text-slate-500">
            This category is clean of detected anti-patterns or ambiguities.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredIssues.map((issue, idx) => {
            const sevInfo = getSeverityBadge(issue.severity);
            const SevIcon = sevInfo.icon;

            return (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 space-y-3 transition-all hover:border-slate-700"
              >
                {/* Issue Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${sevInfo.badge}`}
                    >
                      <SevIcon className="w-3 h-3" />
                      <span>{sevInfo.label}</span>
                    </span>

                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 text-slate-300 border border-slate-800">
                      {getCategoryLabel(issue.category)}
                    </span>

                    <span className="text-xs font-semibold text-white">
                      {issue.title}
                    </span>
                  </div>
                </div>

                {/* Explanation */}
                <p className="text-xs text-slate-300 leading-relaxed">
                  {issue.explanation}
                </p>

                {/* Concrete Fix Suggestion Card */}
                <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-start justify-between gap-3 text-xs">
                  <div className="flex items-start gap-2 min-w-0">
                    <Wrench className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-mono uppercase text-sky-400 block font-bold">
                        Actionable Fix
                      </span>
                      <span className="text-slate-200 font-mono text-[11px] break-words">
                        {issue.fix_suggestion}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopyFix(issue.fix_suggestion, idx)}
                    className="shrink-0 p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors cursor-pointer"
                    title="Copy fix suggestion"
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
