import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Heuristic fallback analyzer when Gemini API key is absent or offline
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

  let triggerScore = 80;
  let fabScore = 95;
  let dupScore = 85;
  let actScore = 80;
  let antiScore = 75;

  // 1. Trigger Clarity Check
  const hasGlobs = /globs|file_triggers|target_files|\.mdc|match/i.test(content);
  const hasCatchAll = /\*\*\/\*\.\*/.test(content) || /apply to all files/i.test(content);
  if (!hasGlobs) {
    triggerScore -= 30;
    issues.push({
      category: 'trigger_clarity',
      severity: 'warning',
      title: 'Missing Explicit File Globs / Trigger Scope',
      explanation: 'The skill does not explicitly declare file globs (e.g., `globs: ["src/**/*.ts"]`), causing the agent to either activate globally or fail to invoke when needed.',
      fix_suggestion: 'Define a precise `globs` array matching only relevant file paths.',
    });
  } else if (hasCatchAll) {
    triggerScore -= 20;
    issues.push({
      category: 'trigger_clarity',
      severity: 'warning',
      title: 'Broad Wildcard Glob Triggers',
      explanation: 'Glob pattern uses unrestricted wildcards which could trigger the rule during unrelated edits and exhaust context windows.',
      fix_suggestion: 'Narrow the globs to specific directory extensions, e.g. `src/api/**/*.{ts,js}`.',
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
      fabScore -= 25;
      issues.push({
        category: 'fabrication_check',
        severity: 'critical',
        title: 'Unverifiable Claim / Marketing Boilerplate',
        explanation: `${item.reason} Agent rule files should only contain operational constraints, not vanity text.`,
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
      actScore -= 15;
      issues.push({
        category: 'actionability',
        severity: 'warning',
        title: `Vague Directive: "${item.phrase}"`,
        explanation: 'AI agents interpret vague platitudes unpredictably. Rules must specify exact programmatic invariants.',
        fix_suggestion: item.fix,
      });
    }
  }

  // 4. Anti-pattern Completeness
  const hasAntiPatterns = /never|avoid|do not|don't|prohibited|anti-pattern|always avoid/i.test(content);
  if (!hasAntiPatterns) {
    antiScore -= 35;
    issues.push({
      category: 'anti_pattern_completeness',
      severity: 'critical',
      title: 'No Explicit Anti-Patterns or Prohibitions Defined',
      explanation: 'Negative constraints are essential for preventing hallucinations and outdated library syntax. The rule lacks an explicit "Always Avoid" section.',
      fix_suggestion: 'Add an "Always Avoid" section listing 3-5 deprecated methods or high-risk conventions.',
    });
  }

  // 5. Duplication Check
  const duplicates = lines.filter((l, i) => l.trim().length > 30 && lines.indexOf(l) !== i);
  if (duplicates.length > 2) {
    dupScore -= 20;
    issues.push({
      category: 'duplication',
      severity: 'nit',
      title: 'Repeated Text Blocks Detected',
      explanation: 'Several identical instruction lines appear across multiple sections, consuming agent context unnecessarily.',
      fix_suggestion: 'Consolidate redundant rules into single bullet points.',
    });
  }

  // Clamp scores
  triggerScore = Math.max(20, Math.min(100, triggerScore));
  fabScore = Math.max(20, Math.min(100, fabScore));
  dupScore = Math.max(20, Math.min(100, dupScore));
  actScore = Math.max(20, Math.min(100, actScore));
  antiScore = Math.max(20, Math.min(100, antiScore));

  const overall = Math.round((triggerScore + fabScore + dupScore + actScore + antiScore) / 5);

  let rewrittenSnippet: string | undefined;
  if (issues.some(i => i.severity === 'critical')) {
    rewrittenSnippet = `---
# Refactored Clean Specification
globs: ["src/**/*.{ts,tsx}"]
alwaysAvoid:
  - "Using 'any' type assertions without explicit justification"
  - "Calling client-side mutations without error boundaries"
  - "Unvalidated external API payloads"
enforcedStack:
  - "TypeScript 5.6+ strict"
---

## Role & Technical Boundaries
You are a Principal Software Engineer. Provide type-safe, tested code adhering to strict structural boundaries.`;
  }

  return {
    overall_score: overall,
    summary:
      overall >= 85
        ? 'High quality production rule. Clear boundaries, actionable directives, and zero marketing fluff.'
        : overall >= 65
        ? 'Moderate quality rule with minor ambiguities or missing negative constraints that can be resolved easily.'
        : 'Significant quality issues found. Requires refactoring of vague directives, unverified claims, or missing anti-patterns.',
    category_scores: {
      trigger_clarity: triggerScore,
      fabrication_check: fabScore,
      duplication: dupScore,
      actionability: actScore,
      anti_pattern_completeness: antiScore,
    },
    issues,
    rewritten_snippet: rewrittenSnippet,
    file_name: fileName || 'input-skill.mdc',
    char_count: content.length,
  };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "5mb" }));

  // Health endpoint
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      service: "skill-auditor",
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  // Main Audit endpoint
  app.post("/api/audit", async (req, res) => {
    try {
      const { content, fileName } = req.body;

      if (!content || typeof content !== "string" || content.trim().length === 0) {
        return res.status(400).json({ error: "Skill content is required for auditing." });
      }

      const apiKey = process.env.GEMINI_API_KEY;

      // If no API key is available, execute the deterministic heuristic auditor
      if (!apiKey) {
        const heuristicReport = runHeuristicAudit(content, fileName);
        return res.json({
          success: true,
          report: heuristicReport,
          engine: "heuristic-fallback",
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const systemPrompt = `You are a Principal AI Agent System Auditor and Prompt Security Engineer.
Your task is to critically audit AI agent skill/rule files (Cursor .mdc, Claude Code SKILL.md, Copilot instructions, Cline rules) for production-quality defects.

You MUST rigorously score the file across these 5 dimensions (0-100 each):
1. **trigger_clarity**: Are the "use when" conditions and file glob triggers specific, non-overlapping, and unambiguous? (Penalize missing globs, catch-all wildcards, or vague triggers).
2. **fabrication_check**: Does the file contain unverifiable benchmark numbers (e.g. "10x speedup"), fake badges, invented stats, social proof (e.g. "100k stars"), or marketing fluff? (Score 100 if completely free of hype; penalize heavily if hype is found).
3. **duplication**: Are there repeated boilerplates, redundant phrases, or copy-pasted sections that waste context window tokens?
4. **actionability**: Are the instructions concrete, technical, and enforceable vs vague platitudes (e.g. "write good code", "be helpful")?
5. **anti_pattern_completeness**: Does it clearly declare failure modes, prohibited syntax, and explicit "Always Avoid" constraints?

Calculate overall_score as the weighted average of these 5 categories (0-100).

Return ONLY valid JSON matching this schema:
{
  "overall_score": number,
  "summary": "1-2 concise sentences summarizing the audit verdict",
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
      "title": "Short descriptive title of the issue",
      "explanation": "Why this causes agent misbehavior or context waste",
      "fix_suggestion": "Single concrete one-line fix action"
    }
  ],
  "rewritten_snippet": "Optional string: A clean, production-ready refactored version of the worst offending section or whole file if severe issues exist"
}`;

      const userMessage = `Audit the following AI agent skill/rule file (Filename: ${fileName || 'unnamed-rule.mdc'}):\n\n\`\`\`markdown\n${content}\n\`\`\``;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: [
          { role: "user", parts: [{ text: `${systemPrompt}\n\n${userMessage}` }] },
        ],
        config: {
          temperature: 0.1,
          responseMimeType: "application/json",
        },
      });

      const responseText = response.text || "";
      
      // Clean JSON if needed
      let parsedReport;
      try {
        const cleaned = responseText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
        parsedReport = JSON.parse(cleaned);
      } catch (parseErr) {
        console.warn("Failed to parse Gemini JSON output, using heuristic fallback:", parseErr);
        parsedReport = runHeuristicAudit(content, fileName);
      }

      parsedReport.file_name = fileName || 'input-skill.mdc';
      parsedReport.char_count = content.length;
      parsedReport.timestamp = new Date().toISOString();

      return res.json({
        success: true,
        report: parsedReport,
        engine: "gemini-3.7-flash",
      });
    } catch (err: unknown) {
      console.error("Error during skill audit:", err);
      // Fallback on error to ensure user experience never breaks
      const { content, fileName } = req.body || {};
      if (content && typeof content === "string") {
        const fallbackReport = runHeuristicAudit(content, fileName);
        return res.json({
          success: true,
          report: fallbackReport,
          engine: "heuristic-fallback",
        });
      }
      const errorMessage = err instanceof Error ? err.message : "Audit processing failed";
      return res.status(500).json({ error: errorMessage });
    }
  });

  // Vite middleware in dev or static serving in prod
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Skill Auditor server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
