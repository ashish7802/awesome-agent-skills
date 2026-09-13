import React from 'react';
import { motion } from 'motion/react';
import { Skill, AgentType } from '../types';
import { Terminal, Bot, Cpu, Copy, ExternalLink, Play, ArrowUpRight, Check } from 'lucide-react';

interface SkillCardProps {
  skill: Skill;
  onSelectSkill: (skill: Skill) => void;
  onAuditSkill: (content: string, fileName: string) => void;
  onCopyInstall: (command: string, skillName: string) => void;
}

export const SkillCard: React.FC<SkillCardProps> = ({
  skill,
  onSelectSkill,
  onAuditSkill,
  onCopyInstall,
}) => {
  const getAgentBadge = (agent: AgentType) => {
    switch (agent) {
      case 'cursor':
        return {
          label: 'Cursor .mdc',
          icon: <Terminal className="w-3 h-3 text-sky-500" />,
          classes: 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800',
        };
      case 'claude':
        return {
          label: 'Claude SKILL.md',
          icon: <Bot className="w-3 h-3 text-amber-500" />,
          classes: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
        };
      case 'copilot':
        return {
          label: 'GitHub Copilot',
          icon: <Cpu className="w-3 h-3 text-violet-500" />,
          classes: 'bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800',
        };
    }
  };

  const agentBadge = getAgentBadge(skill.agent);

  // Generate copyable install command
  const installCommand = `curl -fsSL https://raw.githubusercontent.com/ashish7802/awesome-agent-skills/main/${skill.targetPath} --create-dirs -o ${skill.targetPath} # agent: ${skill.agent}`;

  const handleCopyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCopyInstall(installCommand, skill.name);
  };

  const handleAuditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const fileName = skill.targetPath.split('/').pop() || `${skill.id}.mdc`;
    onAuditSkill(skill.mdcOrSkillContent, fileName);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.2 }}
      onClick={() => onSelectSkill(skill)}
      tabIndex={0}
      role="button"
      aria-label={`View full specification for ${skill.name}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelectSkill(skill);
        }
      }}
      className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/90 p-5 sm:p-6 hover:border-sky-500/50 dark:hover:border-sky-500/40 hover:shadow-lg hover:shadow-sky-500/5 transition-all cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-sky-400"
    >
      <div className="space-y-3.5">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-md border font-medium ${agentBadge.classes}`}
            >
              {agentBadge.icon}
              <span>{agentBadge.label}</span>
            </span>

            <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {skill.category}
            </span>
          </div>

          <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 flex items-center gap-1 group-hover:text-sky-500 transition-colors">
            <span>View 4-Part Spec</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>

        {/* Skill Title */}
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors leading-snug">
            {skill.name}
          </h3>
          <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
            {skill.description}
          </p>
        </div>

        {/* Tech Stack Chips */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold block">
            Enforced Stack
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {skill.stack.map((item, idx) => (
              <span
                key={idx}
                className="text-[10px] bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded font-medium border border-slate-200/60 dark:border-slate-700/60"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Target Path Snippet */}
        <div className="pt-1">
          <code className="text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 px-2 py-1 rounded border border-slate-200 dark:border-slate-800 block truncate">
            {skill.targetPath}
          </code>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={handleCopyClick}
          title="Copy install command"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-mono font-medium transition-all cursor-pointer"
        >
          <Copy className="w-3 h-3 text-slate-500 dark:text-slate-400" />
          <span>Copy Install</span>
        </button>

        <button
          type="button"
          onClick={handleAuditClick}
          title="Run this rule through the AI Quality Auditor"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/50 hover:bg-sky-500 text-sky-600 dark:text-sky-400 hover:text-slate-950 border border-sky-200 dark:border-sky-800/60 text-xs font-bold transition-all cursor-pointer"
        >
          <Play className="w-3 h-3 fill-current" />
          <span>Audit Rule</span>
        </button>
      </div>
    </motion.div>
  );
};
