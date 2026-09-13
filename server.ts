import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { performAudit } from "./src/server/auditService";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "5mb" }));

  // Health endpoint
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      service: "skill-auditor",
      pythonEngine: "Python 3.10 (skill_auditor)",
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

      const result = await performAudit(content, fileName);
      return res.json(result);
    } catch (err: unknown) {
      console.error("Error during skill audit:", err);
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
