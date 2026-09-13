import React, { useState, useMemo } from 'react';
import { Skill, AgentType } from '../types';
import { SearchBar } from './SearchBar';
import { FilterBar } from './FilterBar';
import { SkillCard } from './SkillCard';
import { SkillModal } from './SkillModal';
import { Toast } from './Toast';
import {
  Layers,
  PlusCircle,
  FolderTree,
  ExternalLink,
  SearchX,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface BrowseSkillsViewProps {
  skills: Skill[];
  onSelectForAudit: (content: string, fileName: string) => void;
}

export const BrowseSkillsView: React.FC<BrowseSkillsViewProps> = ({
  skills,
  onSelectForAudit,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<'all' | AgentType>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeModalSkill, setActiveModalSkill] = useState<Skill | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleCopyText = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast(`Copied ${label} to clipboard!`);
    } catch {
      showToast(`Failed to copy to clipboard`);
    }
  };

  // Compute unique categories dynamically from skill records
  const categories = useMemo(() => {
    const set = new Set<string>();
    skills.forEach((s) => set.add(s.category));
    return ['All', ...Array.from(set)];
  }, [skills]);

  // Compute agent counts
  const agentCounts = useMemo(() => {
    const counts: Record<'all' | AgentType, number> = {
      all: skills.length,
      cursor: 0,
      claude: 0,
      copilot: 0,
    };
    skills.forEach((s) => {
      if (s.agent) {
        counts[s.agent] = (counts[s.agent] || 0) + 1;
      }
    });
    return counts;
  }, [skills]);

  // Dynamic filter matching search, agent, and category
  const filteredSkills = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return skills.filter((skill) => {
      // Agent filter
      if (selectedAgent !== 'all' && skill.agent !== selectedAgent) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'All' && skill.category !== selectedCategory) {
        return false;
      }

      // Search filter across name, description, stack, category, and target path
      if (query !== '') {
        const matchesName = skill.name.toLowerCase().includes(query);
        const matchesDesc = skill.description.toLowerCase().includes(query);
        const matchesCategory = skill.category.toLowerCase().includes(query);
        const matchesPath = skill.targetPath.toLowerCase().includes(query);
        const matchesStack = skill.stack.some((s) => s.toLowerCase().includes(query));
        const matchesGlobs = (skill.globs || []).some((g) => g.toLowerCase().includes(query));

        if (!matchesName && !matchesDesc && !matchesCategory && !matchesPath && !matchesStack && !matchesGlobs) {
          return false;
        }
      }

      return true;
    });
  }, [skills, searchTerm, selectedAgent, selectedCategory]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedAgent('all');
    setSelectedCategory('All');
  };

  const submitIssueUrl =
    'https://github.com/ashish7802/awesome-agent-skills/issues/new?template=new-skill.yml';

  return (
    <div className="space-y-6">
      {/* Header Banner & Contribution Action */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Layers className="w-5 h-5 text-sky-500" />
              <span>Agent Skills Catalog</span>
            </h2>
            <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
              {skills.length} Production Rules
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Curated, 4-part architectural AI agent rules for <strong>Cursor (.mdc)</strong>,{' '}
            <strong>Claude Code (SKILL.md)</strong>, and <strong>GitHub Copilot</strong>. Click any card to inspect the full specification or audit with AI.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href={submitIssueUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-950 text-xs sm:text-sm font-bold shadow-xs transition-all hover:scale-[1.02] cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-sky-400 dark:text-sky-600" />
            <span>Submit a Skill</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </a>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 p-5 space-y-4 shadow-xs">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Filter skills by name, technology (Next.js, FastAPI, Rust), globs, or role..."
        />

        <FilterBar
          selectedAgent={selectedAgent}
          onSelectAgent={setSelectedAgent}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          categories={categories}
          agentCounts={agentCounts}
          totalCount={skills.length}
          filteredCount={filteredSkills.length}
          onReset={handleResetFilters}
        />
      </div>

      {/* Skills Grid or Empty State */}
      {filteredSkills.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSkills.map((skill) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              onSelectSkill={(s) => setActiveModalSkill(s)}
              onAuditSkill={onSelectForAudit}
              onCopyInstall={(cmd, name) => handleCopyText(cmd, `install command for ${name}`)}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-12 text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
            <SearchX className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              No matching agent skills found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              No skills match your current search query <em>"{searchTerm}"</em> or active filter
              combination. Try broadening your criteria or reset your filters.
            </p>
          </div>
          <div>
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        </div>
      )}

      {/* 4-Part Detail Modal */}
      <SkillModal
        skill={activeModalSkill}
        onClose={() => setActiveModalSkill(null)}
        onAudit={onSelectForAudit}
        onCopyText={handleCopyText}
      />

      {/* Toast Notification */}
      <Toast message={toastMessage} />
    </div>
  );
};
