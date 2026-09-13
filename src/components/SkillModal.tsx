import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Skill } from '../types';
import {
  X,
  Copy,
  Play,
  Check,
  Terminal,
  ShieldAlert,
  FileCode,
  Sparkles,
  Layers,
  ArrowRight,
  AlertOctagon,
  CheckCircle2,
} from 'lucide-react';

interface SkillModalProps {
  skill: Skill | null;
  onClose: () => void;
  onAudit: (content: string, fileName: string) => void;
  onCopyText: (text: string, label: string) => void;
}

export const SkillModal: React.FC<SkillModalProps> = ({
  skill,
  onClose,
  onAudit,
  onCopyText,
}) => {
  const [activeTab, setActiveTab] = useState<'4-part' | 'raw'>('4-part');

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (skill) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [skill, onClose]);

  if (!skill) return null;

  const installCommand = `curl -fsSL https://raw.githubusercontent.com/ashish7802/awesome-agent-skills/main/${skill.targetPath} --create-dirs -o ${skill.targetPath} # agent: ${skill.agent}`;

  const fileName = skill.targetPath.split('/').pop() || `${skill.id}.mdc`;
  const breakdown = skill.breakdown;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-skill-title"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-4xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl shadow-slate-950/50 flex flex-col max-h-[90vh] z-10 overflow-hidden"
        >
          {/* Modal Header */}
          <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/90 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono font-bold uppercase px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-800">
                    {skill.agent.toUpperCase()}
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {skill.category}
                  </span>
                  <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
                    Added: {skill.addedDate}
                  </span>
                </div>
                <h2
                  id="modal-skill-title"
                  className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100"
                >
                  {skill.name}
                </h2>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target file path & quick copy */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-mono">Target:</span>
                <code className="px-2 py-1 rounded bg-slate-200/70 dark:bg-slate-950 text-slate-800 dark:text-sky-300 font-mono border border-slate-300 dark:border-slate-800">
                  {skill.targetPath}
                </code>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onCopyText(installCommand, 'Install command')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-mono text-xs font-medium transition-colors cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy Install Command</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onAudit(skill.mdcOrSkillContent, fileName);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer shadow-xs"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Run Audit</span>
                </button>
              </div>
            </div>

            {/* View Switcher Tabs */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-800/80">
              <button
                type="button"
                onClick={() => setActiveTab('4-part')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === '4-part'
                    ? 'bg-sky-500 text-slate-950 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                4-Part Architecture Breakdown
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('raw')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'raw'
                    ? 'bg-sky-500 text-slate-950 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                Raw File Content ({fileName})
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6 text-slate-800 dark:text-slate-200 text-sm leading-relaxed font-sans">
            {activeTab === '4-part' && breakdown ? (
              <div className="space-y-6">
                {/* Part 1: Metadata Block */}
                <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-sky-600 dark:text-sky-400 font-bold flex items-center gap-2">
                      <Layers className="w-4 h-4" />
                      <span>Part 1: Specification Metadata</span>
                    </h4>
                    <span className="text-[10px] font-mono bg-sky-500/10 text-sky-500 px-2 py-0.5 rounded">
                      Frontmatter &amp; Globs
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {breakdown.metadata.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                        File Trigger Globs
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {(breakdown.metadata.globs || ['**/*']).map((g, idx) => (
                          <code
                            key={idx}
                            className="text-[11px] font-mono px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                          >
                            {g}
                          </code>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                        Enforced Tech Stack
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {breakdown.metadata.enforcedStack.map((s, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] font-medium px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                {/* Part 2: System Boundary */}
                <section className="rounded-xl border border-rose-200 dark:border-rose-950/60 bg-rose-50/40 dark:bg-rose-950/20 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-rose-600 dark:text-rose-400 font-bold flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4" />
                      <span>Part 2: System Boundary &amp; Negative Constraints</span>
                    </h4>
                    <span className="text-[10px] font-mono bg-rose-500/10 text-rose-500 px-2 py-0.5 rounded">
                      Invariants &amp; Prohibitions
                    </span>
                  </div>

                  <div className="text-xs bg-white/60 dark:bg-slate-900/60 p-3 rounded-lg border border-rose-200 dark:border-rose-900/40">
                    <strong className="text-slate-900 dark:text-slate-100 block mb-1">
                      Assigned Persona &amp; Responsibility:
                    </strong>
                    <p className="text-slate-600 dark:text-slate-300">
                      {breakdown.systemBoundary.role}
                    </p>
                  </div>

                  <div className="space-y-2 pt-1">
                    <span className="text-[11px] font-mono font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wide flex items-center gap-1.5">
                      <AlertOctagon className="w-3.5 h-3.5" />
                      <span>Strict Negative Constraints (Always Avoid):</span>
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                      {breakdown.systemBoundary.alwaysAvoid.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-rose-500 font-bold mt-0.5">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {breakdown.systemBoundary.hardInvariants && (
                    <div className="space-y-2 pt-2 border-t border-rose-200 dark:border-rose-900/40">
                      <span className="text-[11px] font-mono font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Hard System Invariants:</span>
                      </span>
                      <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                        {breakdown.systemBoundary.hardInvariants.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </section>

                {/* Part 3: Master Instruction Prompt */}
                <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-sky-600 dark:text-sky-400 font-bold flex items-center gap-2">
                      <Terminal className="w-4 h-4" />
                      <span>Part 3: Master Instruction Prompt</span>
                    </h4>
                    <button
                      type="button"
                      onClick={() => onCopyText(breakdown.masterPrompt, 'Master Prompt')}
                      className="text-[11px] font-mono text-slate-500 hover:text-sky-400 flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </button>
                  </div>

                  <div className="bg-slate-900 text-slate-200 p-4 rounded-xl text-xs font-mono whitespace-pre-wrap leading-relaxed border border-slate-800">
                    {breakdown.masterPrompt}
                  </div>
                </section>

                {/* Part 4: Before / After Usage Example */}
                <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      <span>Part 4: Before &amp; After Usage Examples</span>
                    </h4>
                    <span className="text-[10px] font-mono bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded">
                      Real-World Quality Verification
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Anti-pattern */}
                    <div className="rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/30 dark:bg-rose-950/30 p-3.5 space-y-2">
                      <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-semibold text-xs">
                        <AlertOctagon className="w-3.5 h-3.5" />
                        <span>Anti-Pattern: {breakdown.usageExamples.badPracticeTitle}</span>
                      </div>
                      <pre className="p-3 rounded-lg bg-slate-950 text-rose-300 font-mono text-[11px] overflow-x-auto leading-relaxed border border-rose-900/40">
                        {breakdown.usageExamples.badPracticeSnippet}
                      </pre>
                    </div>

                    {/* Production Grade */}
                    <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/30 dark:bg-emerald-950/30 p-3.5 space-y-2">
                      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Production Standard: {breakdown.usageExamples.goodPracticeTitle}</span>
                      </div>
                      <pre className="p-3 rounded-lg bg-slate-950 text-emerald-300 font-mono text-[11px] overflow-x-auto leading-relaxed border border-emerald-900/40">
                        {breakdown.usageExamples.goodPracticeSnippet}
                      </pre>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                    <strong className="text-slate-700 dark:text-slate-300">Why this matters: </strong>
                    {breakdown.usageExamples.explanation}
                  </p>
                </section>
              </div>
            ) : (
              /* Raw File View */
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>Full file content formatted for agent runtime ingestion:</span>
                  <button
                    type="button"
                    onClick={() => onCopyText(skill.mdcOrSkillContent, fileName)}
                    className="flex items-center gap-1.5 text-sky-400 hover:text-sky-300 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Full File</span>
                  </button>
                </div>
                <pre className="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed border border-slate-800">
                  {skill.mdcOrSkillContent}
                </pre>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-slate-500 font-mono">
              Ready for immediate production ingestion in Cursor, Claude Code, or Copilot.
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onAudit(skill.mdcOrSkillContent, fileName);
                }}
                className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run Through Auditor</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
