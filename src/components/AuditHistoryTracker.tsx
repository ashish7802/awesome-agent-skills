import React from 'react';
import { Clock, History, Trash2, CheckCircle2, AlertTriangle, AlertCircle, FileCode, ArrowRight } from 'lucide-react';
import { AuditHistoryItem } from '../types';

interface AuditHistoryTrackerProps {
  history: AuditHistoryItem[];
  activeHistoryId: string | null;
  onSelectHistoryItem: (item: AuditHistoryItem) => void;
  onClearHistory: () => void;
}

export const AuditHistoryTracker: React.FC<AuditHistoryTrackerProps> = ({
  history,
  activeHistoryId,
  onSelectHistoryItem,
  onClearHistory,
}) => {
  if (history.length === 0) return null;

  return (
    <div
      id="audit-history-tracker"
      className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/90 shadow-lg p-4 transition-all"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400">
            <History className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-100 uppercase tracking-wider">
                Audit History Tracker
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-slate-800 text-sky-300 border border-slate-700">
                {history.length}/5 Cached
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Switch back to previous results instantly without re-running the audit
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClearHistory}
          className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-rose-400 transition-colors self-start sm:self-center px-2 py-1 rounded-md hover:bg-rose-500/10 cursor-pointer"
          title="Clear all 5 cached audit reports"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear History</span>
        </button>
      </div>

      {/* Grid of the up to 5 history items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
        {history.map((item, index) => {
          const isActive = activeHistoryId === item.id;
          const isHigh = item.overallScore >= 90;
          const isMid = item.overallScore >= 75;

          const badgeClasses = isHigh
            ? 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40'
            : isMid
            ? 'text-amber-400 bg-amber-950/60 border-amber-500/40'
            : 'text-rose-400 bg-rose-950/60 border-rose-500/40';

          const timeFormatted = new Date(item.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          });

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectHistoryItem(item)}
              title={`Switch back to audit report for ${item.fileName} (${item.overallScore}/100)`}
              className={`group text-left p-3 rounded-xl border transition-all duration-150 cursor-pointer flex flex-col justify-between gap-2 relative ${
                isActive
                  ? 'border-sky-500 bg-sky-950/30 shadow-md ring-1 ring-sky-500/50'
                  : 'border-slate-800 bg-slate-950/60 hover:bg-slate-800/70 hover:border-slate-700'
              }`}
            >
              {/* Item Header */}
              <div className="flex items-start justify-between gap-1.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-[10px] font-mono text-slate-500 font-semibold shrink-0">
                    #{index + 1}
                  </span>
                  <span
                    className={`font-mono text-xs font-semibold truncate transition-colors ${
                      isActive ? 'text-sky-300' : 'text-slate-200 group-hover:text-sky-300'
                    }`}
                  >
                    {item.fileName}
                  </span>
                </div>

                <span
                  className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border shrink-0 ${badgeClasses}`}
                >
                  {item.overallScore}/100
                </span>
              </div>

              {/* Item Details */}
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/60">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span>{timeFormatted}</span>
                </div>

                {isActive ? (
                  <span className="text-[9px] font-semibold tracking-wide uppercase text-sky-400 bg-sky-950/80 px-1.5 py-0.5 rounded border border-sky-500/30">
                    Viewing
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-500 group-hover:text-sky-400 flex items-center gap-0.5 transition-colors">
                    <span>Load</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
