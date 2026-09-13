import { RepoSkill, Skill } from '../types';
import { SKILLS } from './skills';

export { SKILLS };

export const REPO_SKILLS: RepoSkill[] = SKILLS.map((skill: Skill): RepoSkill => ({
  id: skill.id,
  title: skill.name,
  description: skill.description,
  category: skill.category,
  fileName: skill.targetPath.split('/').pop() || `${skill.id}.mdc`,
  targetPath: skill.targetPath,
  globs: skill.globs || skill.breakdown?.metadata.globs || ['**/*'],
  enforcedStack: skill.stack,
  prohibitedPatterns: skill.breakdown?.systemBoundary.alwaysAvoid || [],
  rawContent: skill.mdcOrSkillContent,
  agent: skill.agent,
}));
