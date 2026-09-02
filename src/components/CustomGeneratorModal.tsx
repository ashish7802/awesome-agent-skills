import React, { useState } from 'react';
import { X, Sparkles, Loader2, Copy, Check, Download, Wand2, Terminal, Layers } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AgentSkill, AgentTool } from '../types';

interface CustomGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSkillGenerated: (newSkill: AgentSkill) => void;
}

const SAMPLE_TEMPLATES = [
  {
    topic: 'Full-Stack SaaS with Next.js 15, Prisma, & Stripe Webhooks',
    stack: 'Next.js 15, React 19, TypeScript, Prisma, Stripe SDK, Tailwind v4',
    tool: 'Cursor AI' as AgentTool,
    fileType: '.mdc',
  },
  {
    topic: 'High-Throughput Go (Golang) Microservices with gRPC & Kafka',
    stack: 'Go 1.23, gRPC, Protocol Buffers, Kafka, PostgreSQL, Docker',
    tool: 'Claude Code' as AgentTool,
    fileType: 'SKILL.md',
  },
  {
    topic: 'Solana Anchor Smart Contracts & Rust Security Auditing',
    stack: 'Solana Toolsuite, Anchor Framework 0.30+, Rust 2021, TypeScript SDK',
    tool: 'Cursor AI' as AgentTool,
    fileType: '.mdc',
  },
  {
    topic: 'Multi-Modal AI Agent with Live Audio Streaming & Tool Use',
    stack: 'Gemini 2.5 Flash, WebSockets, WebRTC, TypeScript, Node.js 22',
    tool: 'All Agents' as AgentTool,
    fileType: 'SKILL.md',
  },
];

export const CustomGeneratorModal: React.FC<CustomGeneratorModalProps> = ({
  isOpen,
  onClose,
  onSkillGenerated,
}) => {
  if (!isOpen) return null;

  const [topic, setTopic] = useState('');
  const [techStack, setTechStack] = useState('');
  const [targetTool, setTargetTool] = useState<AgentTool>('Cursor AI');
  const [fileType, setFileType] = useState('.mdc');
  const [extraRules, setExtraRules] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedOutput, setGeneratedOutput] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleApplyPreset = (sample: typeof SAMPLE_TEMPLATES[0]) => {
    setTopic(sample.topic);
    setTechStack(sample.stack);
    setTargetTool(sample.tool);
    setFileType(sample.fileType);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsGenerating(true);
    setGeneratedOutput(null);

    try {
      const response = await fetch('/api/generate-blueprint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          techStack,
          targetTool,
          fileType,
          extraRules,
        }),
      });

      const data = await response.json();

      if (data.blueprint) {
        setGeneratedOutput(data.blueprint);
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
        });
      } else {
        // Fallback generator synthesizer
        const fallback = generateSyntheticBlueprint(topic, techStack, targetTool, fileType, extraRules);
        setGeneratedOutput(fallback);
      }
    } catch (err) {
      console.warn('API call failed, generating via client-side architect synthesizer:', err);
      const fallback = generateSyntheticBlueprint(topic, techStack, targetTool, fileType, extraRules);
      setGeneratedOutput(fallback);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyResult = () => {
    if (!generatedOutput) return;
    navigator.clipboard.writeText(generatedOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadResult = () => {
    if (!generatedOutput) return;
    const cleanTopic = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30);
    const filename = `${cleanTopic}${fileType === 'SKILL.md' ? '.SKILL.md' : fileType}`;
    const blob = new Blob([generatedOutput], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="bg-card text-card-foreground border border-border/80 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="p-5 border-b border-border/80 flex items-center justify-between bg-muted/30">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                AI Agent Skill Blueprint Architect
              </h2>
              <p className="text-xs text-muted-foreground">
                Generate production-grade 4-part rules for <strong className="text-foreground">ashish7802/awesome-agent-skills</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Quick presets */}
          <div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
              Popular Preset Inspiration:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SAMPLE_TEMPLATES.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(sample)}
                  className="text-left p-2.5 rounded-lg border border-border/60 bg-muted/30 hover:bg-muted/70 hover:border-primary/40 transition-all text-xs cursor-pointer group"
                >
                  <p className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                    {sample.topic}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate mt-0.5">{sample.stack}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Topic / Framework / Domain <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Next.js 15 Fullstack SaaS with Prisma & Stripe"
                  className="w-full px-3.5 py-2 text-sm bg-muted/40 border border-border/80 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:bg-card text-foreground"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Enforced Tech Stack
                </label>
                <input
                  type="text"
                  value={techStack}
                  onChange={(e) => setTechStack(e.target.value)}
                  placeholder="e.g. Next.js 15, TypeScript strict, Tailwind v4, Zod"
                  className="w-full px-3.5 py-2 text-sm bg-muted/40 border border-border/80 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:bg-card text-foreground"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Target AI Tool
                </label>
                <select
                  value={targetTool}
                  onChange={(e) => setTargetTool(e.target.value as AgentTool)}
                  className="w-full px-3 py-2 text-sm bg-muted/40 border border-border/80 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-primary/40 text-foreground cursor-pointer"
                >
                  <option value="Cursor AI">Cursor AI (.cursor/rules/)</option>
                  <option value="Claude Code">Claude Code (.claude/skills/)</option>
                  <option value="Windsurf">Windsurf (.windsurfrules)</option>
                  <option value="GitHub Copilot Workspace">GitHub Copilot (.github/copilot-instructions.md)</option>
                  <option value="Cline">Cline (.clinerules)</option>
                  <option value="All Agents">Universal (All Agents)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  File Format Extension
                </label>
                <select
                  value={fileType}
                  onChange={(e) => setFileType(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-muted/40 border border-border/80 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-primary/40 text-foreground cursor-pointer"
                >
                  <option value=".mdc">.mdc (Cursor Rule Template)</option>
                  <option value="SKILL.md">SKILL.md (Claude Code / Agent Skill)</option>
                  <option value=".instructions.md">.instructions.md (Copilot / General)</option>
                  <option value=".md">.md (Standard Markdown)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Specific Anti-Patterns or Extra Constraints
              </label>
              <textarea
                rows={2}
                value={extraRules}
                onChange={(e) => setExtraRules(e.target.value)}
                placeholder="e.g. Never use client components for queries, enforce strict Zod schemas, zero useEffect data fetching..."
                className="w-full px-3.5 py-2 text-sm bg-muted/40 border border-border/80 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:bg-card text-foreground resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isGenerating || !topic.trim()}
              className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-xs cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing 4-Part Production Blueprint...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>Generate Production Blueprint</span>
                </>
              )}
            </button>
          </form>

          {/* Generated Result Output */}
          {generatedOutput && (
            <div className="space-y-3 pt-4 border-t border-border/80 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  <span>4-Part Blueprint Generated Successfully</span>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyResult}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy 4-Part Output'}</span>
                  </button>
                  <button
                    onClick={handleDownloadResult}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 text-foreground text-xs font-medium border border-border/60 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download File</span>
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-muted/60 border border-border/80 font-mono text-xs overflow-x-auto max-h-[380px] overflow-y-auto leading-relaxed text-foreground">
                <pre className="whitespace-pre">{generatedOutput}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function generateSyntheticBlueprint(
  topic: string,
  techStack: string,
  targetTool: AgentTool,
  fileType: string,
  extraRules: string
): string {
  const cleanName = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30);
  const targetPath =
    targetTool === 'Cursor AI'
      ? `.cursor/rules/${cleanName}.mdc`
      : targetTool === 'Claude Code'
      ? `.claude/skills/${cleanName}.SKILL.md`
      : `.github/copilot-instructions.md`;

  return `### 1. FILE METADATA BLOCK
- **File Name Suggestion**: \`${cleanName}${fileType}\`
- **Target Path**: \`${targetPath}\`
- **Compatible Agents**: [Cursor AI, Claude Code, Windsurf, GitHub Copilot Workspace, Cline]

### 2. SYSTEM BOUNDARY & CONTEXT SPEC (The "MDC" Layout)
- **Globs / File Triggers**: \`**/*.{ts,tsx,py,rs,go}\`, \`src/**/*\`
- **Always Avoid**:
  - Writing generic, untyped AI boilerplate without defensive validations
  - Mixing presentation concerns directly with asynchronous mutations
  - Ignoring error handling, boundary boundaries, or memory leaks
  ${extraRules ? `- ${extraRules}` : ''}
- **Enforced Stack**: ${techStack || 'TypeScript strict mode, modern runtime'}

### 3. THE MASTER INSTRUCTION PROMPT (System Level)
\`\`\`markdown
# Role & Persona
You are an Elite Principal Systems Architect and Code Reviewer for ${topic}. You construct resilient, modular, type-safe, and self-documenting code adhering strictly to zero-slop architectural discipline.

# Architectural Rules
- Separate domain layers cleanly: Interface / UI -> Business Services -> Data Persistence.
- Enforce strict schemas (Zod/Pydantic/TypeBox) across all public boundaries.
- Adhere to single-responsibility principle and eliminate circular dependencies.

# State Management & Data Flow
- Ensure unidirectional data flow with explicit mutation checkpoints.
- Guard against race conditions and handle optimistic updates with rollback states.

# Debugging & Error Prevention Protocol
- Verify all edge cases (nullability, network timeouts, invalid payloads) before returning code.
- Provide comprehensive unit tests and RFC 7807 compliant error details.
\`\`\`

### 4. LIVE INTERACTIVE USAGE EXAMPLES
- ❌ **Before (Standard AI output)**:
  Unstructured monolithic script lacking typing, error bounds, and proper separation of concerns.
- ✅ **After (With this Skill Active)**:
  Decoupled, strictly validated, and production-hardened implementation with exhaustive error recovery and modern idioms.`;
}
