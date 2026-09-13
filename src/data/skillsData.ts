import { RepoSkill, Skill } from '../types';
import { SKILLS } from './skills';

export { SKILLS };

export function formatFullSkillContent(skill: Skill): string {
  const b = skill.breakdown;
  const globs = skill.globs || b?.metadata.globs || ['**/*'];
  const alwaysAvoid = b?.systemBoundary.alwaysAvoid || [];
  const hardInvariants = b?.systemBoundary.hardInvariants || [];
  const enforcedStack = skill.stack || b?.metadata.enforcedStack || [];

  const lines: string[] = [
    '---',
    `description: ${b?.metadata.description || skill.description}`,
    `globs: ${JSON.stringify(globs)}`,
    'alwaysAvoid:',
    ...alwaysAvoid.map((item) => `  - ${JSON.stringify(item)}`),
    'enforcedStack:',
    ...enforcedStack.map((item) => `  - ${JSON.stringify(item)}`),
    '---',
    '',
    '# Part 1: Metadata & Trigger Scope',
    `- **Skill Name**: ${skill.name}`,
    `- **File Globs**: ${globs.map((g) => `\`${g}\``).join(', ')}`,
    `- **Enforced Stack**: ${enforcedStack.join(', ')}`,
    `- **Target Runtime**: ${
      skill.agent === 'cursor'
        ? 'Cursor (.mdc)'
        : skill.agent === 'claude'
        ? 'Claude Code (SKILL.md)'
        : 'GitHub Copilot Instructions'
    }`,
    '',
    '# Part 2: System Boundary & Prohibitions',
    '## Role & Persona',
    b?.systemBoundary.role || 'Senior Software Engineer',
    '',
    '## Always Avoid (Hard Prohibitions)',
    ...(alwaysAvoid.length > 0
      ? alwaysAvoid.map((a, i) => `${i + 1}. ${a}`)
      : ['1. Deprecated framework APIs or unvetted external dependencies.']),
    '',
    '## Hard Invariants',
    ...(hardInvariants.length > 0
      ? hardInvariants.map((h, i) => `${i + 1}. ${h}`)
      : ['1. Follow strict typing and modular architecture.']),
    '',
    '# Part 3: Master Instruction Prompt',
    b?.masterPrompt || skill.mdcOrSkillContent,
    '',
  ];

  if (b?.usageExamples) {
    lines.push(
      '# Part 4: Verified Implementation Standard vs Prohibited Anti-Pattern',
      '',
      `## Prohibited Anti-Pattern: ${b.usageExamples.badPracticeTitle}`,
      '```',
      b.usageExamples.badPracticeSnippet,
      '```',
      '',
      `## Verified Production Standard: ${b.usageExamples.goodPracticeTitle}`,
      '```',
      b.usageExamples.goodPracticeSnippet,
      '```',
      '',
      '## Architectural Justification',
      b.usageExamples.explanation,
      ''
    );
  }

  return lines.join('\n');
}

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
  rawContent: formatFullSkillContent(skill),
  agent: skill.agent,
}));
