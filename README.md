# Skill Auditor

> **AI-powered auditor and actionable fix report generator for AI agent skill files, Cursor `.mdc` rules, Claude Code `SKILL.md`, and GitHub Copilot instructions.**

![Skill Auditor Screenshot Placeholder](./docs/screenshot-placeholder.png)

---

## What is Skill Auditor?

Agent rules and skill files (such as Cursor `.mdc` and Claude Code `SKILL.md`) frequently suffer from production-quality defects:
- Overly broad or missing file triggers (`globs`) that exhaust agent context windows.
- Unverifiable marketing hype, fake badges, and benchmark claims that mislead reasoning models.
- Repeated boilerplate instructions that increase token latency.
- Vague platitudes ("write clean code") instead of deterministic programmatic invariants.
- Missing negative constraints (`Always Avoid`) that allow models to use deprecated syntax.

**Skill Auditor** analyzes any skill or rule file using Google Gemini (with an automated deterministic fallback) and generates an actionable quality report with concrete one-line fix suggestions and auto-refactored snippets.

---

## Key Audit Dimensions

| Dimension | Description |
| :--- | :--- |
| **Trigger Clarity** | Validates that file globs and "use when" conditions are specific and non-overlapping. |
| **Fabrication Check** | Flags unverified benchmark multipliers, social proof claims, and marketing hype. |
| **Duplication & Density** | Detects redundant instructions that waste prompt tokens. |
| **Actionability** | Ensures directives are concrete, type-safe, and verifiable rather than conversational fluff. |
| **Anti-Pattern Completeness** | Verifies that explicit negative constraints and prohibited conventions are defined. |

---

## Features

- **Direct File Upload & Paste**: Drag and drop `.mdc`, `SKILL.md`, `.md`, or `.txt` files or paste directly into the workspace.
- **Actionable Issues Report**: Grouped by severity (Critical, Warning, Nit) with one-click copyable fix actions.
- **Refactored Snippet Generator**: Generates clean, production-ready replacement blocks for severe defects.
- **Repository Skill Explorer**: Browse and test all active skill files directly in the auditor.
- **Export Capabilities**: Download full audit reports as Markdown or JSON.

---

## Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment (optional, for Gemini-powered audits):
   ```bash
   # Add your Gemini API key to .env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

---

## License

MIT
