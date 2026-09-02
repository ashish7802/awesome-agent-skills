import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "awesome-agent-skills-architect" });
  });

  // AI Generation endpoint for custom Agent Skill Blueprints
  app.post("/api/generate-blueprint", async (req, res) => {
    try {
      const { topic, techStack, targetTool, fileType, extraRules } = req.body;

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: "GEMINI_API_KEY is not configured. Using fallback local architect engine.",
        });
      }

      const ai = new GoogleGenAI({ apiKey });

      const prompt = `You are an Elite AI Agent System Architect and Principal Prompt Engineer acting as the core automation engine for the "awesome-agent-skills" repository (managed by user: ashish7802).
Generate a production-grade, ultra-high-quality, complete Agent Skill Blueprint / Cursor Rule / Claude Code instruction.

TOPIC / DOMAIN: ${topic || "Next.js 15 Fullstack SaaS with Tailwind v4 & Shadcn"}
TECH STACK: ${techStack || "Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, Prisma, PostgreSQL"}
PRIMARY TARGET TOOL: ${targetTool || "Cursor AI (.mdc)"}
FILE FORMAT: ${fileType || ".mdc"}
EXTRA CONSTRAINTS: ${extraRules || "None"}

You MUST strictly follow the exact 4-Part Structure below:

### 1. FILE METADATA BLOCK
- **File Name Suggestion**: (e.g. \`nextjs-approuter.mdc\` or \`claude-code-architect.SKILL.md\`)
- **Target Path**: (e.g. \`.cursor/rules/\` or \`.claude/skills/\` or \`.github/copilot-instructions.md\`)
- **Compatible Agents**: [Cursor AI, Claude Code, Windsurf, GitHub Copilot Workspace, Cline]

### 2. SYSTEM BOUNDARY & CONTEXT SPEC (The "MDC" Layout)
- **Globs / File Triggers**: (e.g. \`**/*.{ts,tsx}\`, \`app/**/*\`)
- **Always Avoid**: Bullet points of exact anti-patterns, bad imports, deprecated methods, hallucination traps, or lazy AI boilerplate to strictly NEVER use.
- **Enforced Stack**: Technical prerequisites and specific library versions.

### 3. THE MASTER INSTRUCTION PROMPT (System Level)
Inside a clean Markdown code block, provide the system prompt with these authoritative structural headers:
- **Role & Persona**: The specialized senior engineering mindset and precision standards.
- **Architectural Rules**: Directory strictness, file organization rules, naming conventions, zero-circular-deps.
- **State Management & Data Flow**: Exact guidelines on server vs client boundaries, mutations, caching, optimistic updates.
- **Debugging & Error Prevention Protocol**: How the agent must double-check types, verify edge cases, prevent infinite renders, ensure accessibility and error boundaries before outputting code.

### 4. LIVE INTERACTIVE USAGE EXAMPLES
- ❌ **Before (Standard AI output)**: Concrete example of typical chaotic, generic, or buggy AI-generated code.
- ✅ **After (With this Skill Active)**: The beautifully structured, type-safe, resilient, and modern code produced under this prompt's enforcement.

Return clean, markdown-formatted text that can be copied directly.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const text = response.text || "";
      return res.json({ success: true, blueprint: text });
    } catch (err: unknown) {
      console.error("Error generating skill blueprint:", err);
      const errorMessage = err instanceof Error ? err.message : "Generation failed";
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
    console.log(`Awesome Agent Skills Architect server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
