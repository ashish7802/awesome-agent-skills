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
  | 'Frontend & Web'
  | 'Backend & APIs'
  | 'Fullstack & SaaS'
  | 'AI & LLM Orchestration'
  | 'Systems & DevOps'
  | 'Database & Security';

export interface RepoSkill {
  id: string;
  title: string;
  description: string;
  category: SkillCategory;
  fileName: string;
  targetPath: string;
  globs: string[];
  enforcedStack: string[];
  prohibitedPatterns: string[];
  rawContent: string;
}
