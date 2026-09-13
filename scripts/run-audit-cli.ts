import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { REPO_SKILLS } from '../src/data/skillsData';

dotenv.config();

// The exact heuristic auditor from server.ts
function runHeuristicAudit(content: string, fileName?: string) {
  const issues: Array<{
    category: 'trigger_clarity' | 'fabrication_check' | 'duplication' | 'actionability' | 'anti_pattern_completeness';
    severity: 'critical' | 'warning' | 'nit';
    title: string;
    explanation: string;
    fix_suggestion: string;
  }> = [];

  const lower = content.toLowerCase();
  const lines = content.split('\n');

  let triggerScore = 95;
  let fabScore = 100;
  let dupScore = 95;
  let actScore = 95;
  let antiScore = 95;

  // 1. Trigger Clarity Check
  const hasGlobs = /globs|file_triggers|target_files|\.mdc|match/i.test(content);
  const hasCatchAll = /\*\*\/\*\.\*/.test(content) || /apply to all files/i.test(content);
  if (!hasGlobs) {
    triggerScore -= 40;
    issues.push({
      category: 'trigger_clarity',
      severity: 'warning',
      title: 'Missing Explicit File Globs / Trigger Scope',
      explanation: 'The skill does not explicitly declare file globs.',
      fix_suggestion: 'Define a precise `globs` array matching only relevant file paths.',
    });
  } else if (hasCatchAll) {
    triggerScore -= 25;
    issues.push({
      category: 'trigger_clarity',
      severity: 'warning',
      title: 'Broad Wildcard Glob Triggers',
      explanation: 'Glob pattern uses unrestricted wildcards.',
      fix_suggestion: 'Narrow the globs to specific directory extensions.',
    });
  }

  // 2. Fabrication Check
  const fabricationKeywords = [
    { regex: /100k\+?\s*stars/i, reason: 'Claims unverified star metrics or social proof.' },
    { regex: /\b(10x|50x|100x)\s+(faster|speedup|productivity)\b/i, reason: 'Claims unverified performance multipliers.' },
    { regex: /guaranteed\s+(zero|100%)\s+bugs/i, reason: 'Contains unverifiable absolute accuracy claims.' },
    { regex: /\[!\[.*?badge.*?\]\]/i, reason: 'Contains decorative marketing badges inside system prompt instructions.' },
  ];

  for (const item of fabricationKeywords) {
    if (item.regex.test(content)) {
      fabScore -= 30;
      issues.push({
        category: 'fabrication_check',
        severity: 'critical',
        title: 'Unverifiable Claim / Marketing Boilerplate',
        explanation: `${item.reason} Agent rule files should only contain operational constraints.`,
        fix_suggestion: 'Strip all promotional slogans, fake badge URLs, and unscientific performance multipliers.',
      });
    }
  }

  // 3. Actionability Check
  const vaguePhrases = [
    { phrase: 'write clean code', fix: 'Specify concrete formatting rules, naming conventions, and lint configurations.' },
    { phrase: 'make it fast', fix: 'Define algorithmic constraints, memory thresholds, or cache strategies.' },
    { phrase: 'be helpful and polite', fix: 'Replace conversational tone padding with deterministic architectural boundaries.' },
    { phrase: 'follow best practices', fix: 'Enumerate the explicit design patterns or library idioms to adopt.' },
  ];

  for (const item of vaguePhrases) {
    if (lower.includes(item.phrase)) {
      actScore -= 20;
      issues.push({
        category: 'actionability',
        severity: 'warning',
        title: `Vague Directive: "${item.phrase}"`,
        explanation: 'AI agents interpret vague platitudes unpredictably.',
        fix_suggestion: item.fix,
      });
    }
  }

  // 4. Anti-pattern Completeness
  const hasAntiPatterns = /never|avoid|do not|don't|prohibited|anti-pattern|always avoid/i.test(content);
  if (!hasAntiPatterns) {
    antiScore -= 45;
    issues.push({
      category: 'anti_pattern_completeness',
      severity: 'critical',
      title: 'No Explicit Anti-Patterns or Prohibitions Defined',
      explanation: 'The rule lacks an explicit "Always Avoid" section.',
      fix_suggestion: 'Add an "Always Avoid" section listing 3-5 deprecated methods or high-risk conventions.',
    });
  }

  // 5. Duplication Check
  const duplicates = lines.filter((l, i) => l.trim().length > 30 && lines.indexOf(l) !== i);
  if (duplicates.length > 2) {
    dupScore -= 25;
    issues.push({
      category: 'duplication',
      severity: 'nit',
      title: 'Repeated Text Blocks Detected',
      explanation: 'Several identical instruction lines appear across multiple sections.',
      fix_suggestion: 'Consolidate redundant rules into single bullet points.',
    });
  }

  triggerScore = Math.max(20, Math.min(100, triggerScore));
  fabScore = Math.max(20, Math.min(100, fabScore));
  dupScore = Math.max(20, Math.min(100, dupScore));
  actScore = Math.max(20, Math.min(100, actScore));
  antiScore = Math.max(20, Math.min(100, antiScore));

  const overall = Math.round((triggerScore + fabScore + dupScore + actScore + antiScore) / 5);

  return {
    overall_score: overall,
    category_scores: {
      trigger_clarity: triggerScore,
      fabrication_check: fabScore,
      duplication: dupScore,
      actionability: actScore,
      anti_pattern_completeness: antiScore,
    },
    issues,
  };
}

async function auditSkillWithGemini(ai: GoogleGenAI, content: string, fileName: string) {
  const systemPrompt = `You are a Principal AI Agent System Auditor and Prompt Security Engineer.
Audit this AI agent skill/rule file across these 5 dimensions (0-100 each):
1. trigger_clarity: Are use-when conditions and file globs specific, non-overlapping, unambiguous?
2. fabrication_check: Are there unverifiable benchmark numbers (e.g. "10x speedup"), fake badges, invented stats, social proof, or marketing fluff? (100 if completely free of hype).
3. duplication: Are there repeated boilerplates or redundant phrases?
4. actionability: Are instructions concrete, technical, enforceable vs vague platitudes?
5. anti_pattern_completeness: Does it declare failure modes, prohibited syntax, and explicit "Always Avoid" constraints?

Calculate overall_score as the weighted average of these 5 categories (0-100).
Return ONLY valid JSON matching this schema:
{
  "overall_score": number,
  "summary": string,
  "category_scores": {
    "trigger_clarity": number,
    "fabrication_check": number,
    "duplication": number,
    "actionability": number,
    "anti_pattern_completeness": number
  },
  "issues": [
    {
      "category": "trigger_clarity" | "fabrication_check" | "duplication" | "actionability" | "anti_pattern_completeness",
      "severity": "critical" | "warning" | "nit",
      "title": string,
      "explanation": string,
      "fix_suggestion": string
    }
  ]
}`;

  const response = await ai.models.generateContent({
    model: "gemini-3.7-flash",
    contents: [
      { role: "user", parts: [{ text: `${systemPrompt}\n\nAudit file (${fileName}):\n\n\`\`\`markdown\n${content}\n\`\`\`` }] },
    ],
    config: {
      temperature: 0.1,
      responseMimeType: "application/json",
    },
  });

  const cleaned = (response.text || "").replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
  return JSON.parse(cleaned);
}

async function runAudit() {
  const projectRoot = process.cwd();
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = apiKey ? new GoogleGenAI({ apiKey, httpOptions: { headers: { 'User-Agent': 'aistudio-build' } } }) : null;

  console.log(`Auditing ${REPO_SKILLS.length} skill files (Gemini API available: ${Boolean(ai)})...`);
  console.log('='.repeat(100));

  const results: any[] = [];

  for (const skill of REPO_SKILLS) {
    const fullPath = path.resolve(projectRoot, skill.targetPath);
    if (!fs.existsSync(fullPath)) {
      console.error(`MISSING FILE: ${skill.targetPath}`);
      continue;
    }

    const content = fs.readFileSync(fullPath, 'utf8');
    const heuristic = runHeuristicAudit(content, skill.targetPath);

    results.push({
      id: skill.id,
      path: skill.targetPath,
      heuristic,
      contentLength: content.length,
    });
  }

  console.log(JSON.stringify(results, null, 2));
}

runAudit();
