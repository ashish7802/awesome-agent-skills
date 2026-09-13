import React, { useState, useRef, useEffect } from 'react';
import {
  UploadCloud,
  FileCode,
  Play,
  RotateCcw,
  Sparkles,
  Download,
  CheckCircle2,
  AlertCircle,
  FileText,
  Copy,
  Check,
  ShieldCheck,
  Zap,
  History,
  Trash2,
  Clock,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AuditReport, AuditHistoryItem } from '../types';
import { SAMPLE_PRESETS, SamplePreset } from '../data/samplePresets';
import { ScoreGauge } from './ScoreGauge';
import { IssuesList } from './IssuesList';
import { RewrittenSnippet } from './RewrittenSnippet';

interface AuditorViewProps {
  content: string;
  setContent: (val: string) => void;
  fileName: string;
  setFileName: (val: string) => void;
  report: AuditReport | null;
  setReport: (rep: AuditReport | null) => void;
  isLoading: boolean;
  onRunAudit: (overrideContent?: string, overrideFileName?: string) => Promise<void>;
  error: string | null;
}

export const AuditorView: React.FC<AuditorViewProps> = ({
  content,
  setContent,
  fileName,
  setFileName,
  report,
  setReport,
  isLoading,
  onRunAudit,
  error,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [copiedReport, setCopiedReport] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Audit history tracking
  const [history, setHistory] = useState<AuditHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('skill_audit_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showHistory, setShowHistory] = useState(false);

  // Sync new reports into audit history
  useEffect(() => {
    if (!report) return;
    setHistory((prev) => {
      // Check if top item is identical
      if (
        prev.length > 0 &&
        prev[0].fileName === (report.file_name || fileName) &&
        prev[0].overallScore === report.overall_score
      ) {
        return prev;
      }
      const newItem: AuditHistoryItem = {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        timestamp: report.timestamp || new Date().toISOString(),
        fileName: report.file_name || fileName,
        overallScore: report.overall_score,
        charCount: report.char_count || content.length,
        report,
        content,
      };
      const updated = [newItem, ...prev.filter((h) => h.id !== newItem.id)].slice(0, 10);
      try {
        localStorage.setItem('skill_audit_history', JSON.stringify(updated));
      } catch (err) {
        console.warn('Failed to persist audit history:', err);
      }
      return updated;
    });
  }, [report, fileName, content]);

  const handleRestoreHistory = (item: AuditHistoryItem) => {
    setContent(item.content);
    setFileName(item.fileName);
    setReport(item.report);
    setShowHistory(false);
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('skill_audit_history');
    } catch (err) {
      console.warn('Failed to clear audit history:', err);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setContent(text || '');
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setContent(text || '');
    };
    reader.readAsText(file);
  };

  const handleLoadPreset = (preset: SamplePreset) => {
    setContent(preset.content);
    setFileName(preset.fileName);
    setReport(null);
  };

  const handleClear = () => {
    setContent('');
    setFileName('custom-rule.mdc');
    setReport(null);
  };

  const handleExportMarkdown = () => {
    if (!report) return;

    const mdContent = `# Skill Audit Report: ${report.file_name || fileName}
Generated: ${new Date().toISOString()}
Overall Score: ${report.overall_score}/100

## Summary
${report.summary}

## Category Scores
- Trigger Clarity: ${report.category_scores.trigger_clarity}/100
- Fabrication Check: ${report.category_scores.fabrication_check}/100
- Duplication & Density: ${report.category_scores.duplication}/100
- Actionability: ${report.category_scores.actionability}/100
- Anti-Pattern Completeness: ${report.category_scores.anti_pattern_completeness}/100

## Detected Issues (${report.issues.length})
${report.issues
  .map(
    (i, idx) =>
      `### ${idx + 1}. [${i.severity.toUpperCase()}] ${i.title} (${i.category})
- **Explanation**: ${i.explanation}
- **Actionable Fix**: \`${i.fix_suggestion}\`
`
  )
  .join('\n')}

${
  report.rewritten_snippet
    ? `## Refactored Snippet
\`\`\`markdown
${report.rewritten_snippet}
\`\`\`
`
    : ''
}
`;

    const blob = new Blob([mdContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-report-${fileName.replace(/\.[^/.]+$/, '')}.md`;
    a.click();
    URL.revokeObjectURL(url);

    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.8 },
    });
  };

  const lineCount = content ? content.split('\n').length : 0;
  const charCount = content ? content.length : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Workspace Input Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 space-y-5">
        
        {/* Header & File Preset Quick Loader */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FileCode className="w-4 h-4 text-sky-400" />
              <span>Skill &amp; Rule File Input</span>
            </h2>
            <p className="text-xs text-slate-400">
              Paste or upload Cursor (<code className="text-sky-300 font-mono">.mdc</code>), Claude Code (<code className="text-sky-300 font-mono">SKILL.md</code>), or Copilot instructions.
            </p>
          </div>

          {/* Quick Preset Buttons & History Toggle */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-slate-500 font-medium mr-1">Sample Presets:</span>
              {SAMPLE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleLoadPreset(preset)}
                  className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
                  title={preset.description}
                >
                  {preset.badge}
                </button>
              ))}
            </div>

            {history.length > 0 && (
              <button
                type="button"
                onClick={() => setShowHistory(!showHistory)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                  showHistory
                    ? 'bg-sky-500/20 text-sky-300 border-sky-500/50'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
                }`}
                title="View recent audit reports"
              >
                <History className="w-3.5 h-3.5 text-sky-400" />
                <span>History ({history.length})</span>
              </button>
            )}
          </div>
        </div>

        {/* History Dropdown / Panel */}
        {showHistory && history.length > 0 && (
          <div className="p-4 rounded-xl border border-sky-500/30 bg-slate-950/80 space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                <Clock className="w-3.5 h-3.5 text-sky-400" />
                <span>Recent Audit History ({history.length} saved)</span>
              </div>
              <button
                type="button"
                onClick={handleClearHistory}
                className="flex items-center gap-1 text-[11px] text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                title="Clear all saved audit history"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear History</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto pr-1">
              {history.map((item) => {
                const isHigh = item.overallScore >= 90;
                const isMid = item.overallScore >= 75;
                const badgeColor = isHigh
                  ? 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40'
                  : isMid
                  ? 'text-amber-400 border-amber-500/30 bg-amber-950/40'
                  : 'text-rose-400 border-rose-500/30 bg-rose-950/40';

                return (
                  <div
                    key={item.id}
                    onClick={() => handleRestoreHistory(item)}
                    className="group p-2.5 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800/60 hover:border-sky-500/40 transition-all cursor-pointer flex flex-col justify-between gap-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-medium text-slate-200 truncate group-hover:text-sky-300 transition-colors">
                        {item.fileName}
                      </span>
                      <span
                        className={`text-[11px] font-bold font-mono px-1.5 py-0.5 rounded border ${badgeColor}`}
                      >
                        {item.overallScore}/100
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span>{item.charCount} chars</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Drag & Drop or Paste Container */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`relative rounded-xl border transition-all ${
            dragOver
              ? 'border-sky-400 bg-sky-950/20'
              : 'border-slate-800 bg-slate-950 hover:border-slate-700'
          }`}
        >
          {/* File Name Header Bar */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800/80 bg-slate-950/90 text-xs font-mono">
            <div className="flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-sky-400" />
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="filename.mdc"
                className="bg-transparent text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-sky-400 px-1 rounded"
              />
            </div>

            <div className="flex items-center gap-3 text-slate-500 text-[11px]">
              <span>{lineCount} lines</span>
              <span>•</span>
              <span>{charCount} chars</span>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-sky-400 hover:text-sky-300 font-sans cursor-pointer ml-2 flex items-center gap-1"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Upload File</span>
              </button>
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".md,.mdc,.txt,.yaml,.yml,.json"
            className="hidden"
          />

          {/* Text Area */}
          <textarea
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`Paste your rule file content here, e.g.:\n\n---\ndescription: Production rule for Next.js App Router\nglobs: ["app/**/*.{ts,tsx}"]\nalwaysAvoid:\n  - "Using client-side useEffect for data fetching"\n---\n\n# Role & Persona\nYou are a Principal Architect...`}
            className="w-full p-4 bg-transparent text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-hidden resize-y min-h-[220px]"
          />
        </div>

        {/* Error Message if any */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleClear}
              disabled={!content && !report}
              className="px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800 transition-colors disabled:opacity-40 cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>

          <button
            onClick={() => onRunAudit()}
            disabled={isLoading || !content.trim()}
            className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-40 cursor-pointer shadow-md shadow-sky-500/10"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Auditing File Invariants with Gemini...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-current" />
                <span>Run Production Audit</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Audit Report Results */}
      {report && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Action Bar for Report */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono text-slate-300">
                Audited: <strong className="text-white">{report.file_name}</strong> ({report.char_count} chars)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportMarkdown}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-medium transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-sky-400" />
                <span>Export Report (.md)</span>
              </button>
            </div>
          </div>

          {/* 1. Score Gauge & Category Breakdown */}
          <ScoreGauge
            score={report.overall_score}
            summary={report.summary}
            categoryScores={report.category_scores}
          />

          {/* 2. Issues List with One-line Fixes */}
          <IssuesList issues={report.issues} />

          {/* 3. Rewritten Snippet (if available) */}
          {report.rewritten_snippet && (
            <RewrittenSnippet
              snippet={report.rewritten_snippet}
              originalFileName={report.file_name}
            />
          )}

        </div>
      )}

    </div>
  );
};
