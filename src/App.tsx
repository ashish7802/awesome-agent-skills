import React, { useState } from 'react';
import { Header } from './components/Header';
import { AuditorView } from './components/AuditorView';
import { BrowseSkillsView } from './components/BrowseSkillsView';
import { SKILLS } from './data/skills';
import { AuditReport, Skill } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'browse' | 'auditor'>('browse');
  const [content, setContent] = useState<string>('');
  const [fileName, setFileName] = useState<string>('custom-rule.mdc');
  const [report, setReport] = useState<AuditReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleRunAudit = async (overrideContent?: string, overrideFileName?: string) => {
    const textToAudit = overrideContent ?? content;
    const fileToAudit = overrideFileName ?? fileName;

    if (!textToAudit.trim()) {
      setError('Please paste or upload a skill/rules file before running the audit.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: textToAudit,
          fileName: fileToAudit,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Audit request failed');
      }

      if (data.report) {
        setReport(data.report);
      } else {
        throw new Error('No audit report returned from server');
      }
    } catch (err: unknown) {
      console.error('Error running audit:', err);
      const msg = err instanceof Error ? err.message : 'Failed to connect to audit server';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSkillForAudit = (skillContent: string, skillFileName: string) => {
    setContent(skillContent);
    setFileName(skillFileName);
    setReport(null);
    setActiveTab('auditor');
    // Run audit automatically
    handleRunAudit(skillContent, skillFileName);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-sky-500/30 selection:text-sky-300 transition-colors">
      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        repoSkillCount={SKILLS.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'browse' ? (
          <BrowseSkillsView
            skills={SKILLS}
            onSelectForAudit={handleSelectSkillForAudit}
          />
        ) : (
          <AuditorView
            content={content}
            setContent={setContent}
            fileName={fileName}
            setFileName={setFileName}
            report={report}
            setReport={setReport}
            isLoading={isLoading}
            onRunAudit={handleRunAudit}
            error={error}
          />
        )}
      </main>

      {/* Minimalist Accessible Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-900 bg-white/60 dark:bg-slate-950/80 py-6 text-center text-xs text-slate-500 font-mono transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Awesome Agent Skills
            </span>
            <span>•</span>
            <span>4-Part Architecture for Cursor, Claude Code, and Copilot</span>
          </div>

          <div className="flex items-center gap-4">
            <span>{SKILLS.length} Production Rule Files</span>
            <span>•</span>
            <a
              href="https://github.com/ashish7802/awesome-agent-skills"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-600 dark:text-sky-400 hover:underline"
            >
              GitHub Repository
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
