export type AuditCategory =
  | 'trigger_clarity'
  | 'fabrication_check'
  | 'duplication'
  | 'actionability'
  | 'anti_pattern_completeness';

export type IssueSeverity = 'critical' | 'warning' | 'nit';

export interface AuditIssue {
  category: AuditCategory;
  severity: IssueSeverity;
  title: string;
  explanation: string;
  fix_suggestion: string;
}

export interface CategoryScores {
  trigger_clarity: number;
  fabrication_check: number;
  duplication: number;
  actionability: number;
  anti_pattern_completeness: number;
}

export interface AuditReport {
  overall_score: number;
  summary: string;
  category_scores: CategoryScores;
  issues: AuditIssue[];
  rewritten_snippet?: string;
  timestamp?: string;
  file_name?: string;
  char_count?: number;
}

export type SkillCategory =
  | 'Fullstack & SaaS'
  | 'Backend & APIs'
  | 'Database & Storage'
  | 'Systems & Low-Level'
  | 'Frontend & UI'
  | 'AI & LLMs'
  | 'Cloud & DevOps'
  | 'Testing & QA'
  | 'Mobile'
  | 'Security & Hardening';

export type AgentType = 'cursor' | 'claude' | 'copilot';

export interface UsageExample {
  badPracticeTitle: string;
  badPracticeSnippet: string;
  goodPracticeTitle: string;
  goodPracticeSnippet: string;
  explanation: string;
}

export interface SkillArchitectureBreakdown {
  metadata: {
    title: string;
    description: string;
    globs?: string[];
    enforcedStack: string[];
    agent: AgentType;
  };
  systemBoundary: {
    role: string;
    alwaysAvoid: string[];
    hardInvariants: string[];
  };
  masterPrompt: string;
  usageExamples: UsageExample;
}

export interface Skill {
  id: string;
  name: string;
  targetPath: string;
  agent: AgentType;
  stack: string[];
  category: SkillCategory;
  description: string;
  mdcOrSkillContent: string;
  addedDate: string;
  globs?: string[];
  breakdown?: SkillArchitectureBreakdown;
}

// Backward compatibility alias for RepoSkill
export interface RepoSkill {
  id: string;
  title: string;
  description: string;
  category: SkillCategory | string;
  fileName: string;
  targetPath: string;
  globs: string[];
  enforcedStack: string[];
  prohibitedPatterns: string[];
  rawContent: string;
  agent?: AgentType;
}

