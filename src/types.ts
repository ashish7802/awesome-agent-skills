export type AgentTool = 'Cursor AI' | 'Claude Code' | 'Windsurf' | 'GitHub Copilot Workspace' | 'Cline' | 'All Agents';

export type SkillCategory =
  | 'Frontend & Web'
  | 'Backend & APIs'
  | 'Fullstack & SaaS'
  | 'AI & LLM Orchestration'
  | 'Mobile & Edge'
  | 'Systems & DevOps'
  | 'Database & Security';

export interface FileMetadata {
  fileNameSuggestion: string;
  targetPath: string;
  compatibleAgents: AgentTool[];
  version: string;
  author: string;
  license: string;
}

export interface SystemBoundary {
  globs: string[];
  alwaysAvoid: string[];
  enforcedStack: string[];
  strictMode: boolean;
}

export interface MasterInstruction {
  roleAndPersona: string;
  architecturalRules: string[];
  stateManagementAndDataFlow: string[];
  debuggingAndErrorPrevention: string[];
  rawMarkdownPrompt: string;
}

export interface UsageComparison {
  title: string;
  description: string;
  beforeCode: string;
  beforeExplanation: string;
  afterCode: string;
  afterExplanation: string;
  language: string;
}

export interface AgentSkill {
  id: string;
  title: string;
  tagline: string;
  category: SkillCategory;
  starsCount?: number;
  popular?: boolean;
  metadata: FileMetadata;
  boundary: SystemBoundary;
  masterInstruction: MasterInstruction;
  comparison: UsageComparison;
}

export interface GenerationRequest {
  topic: string;
  techStack: string;
  targetTool: AgentTool;
  fileType: string;
  extraRules: string;
}
