# awesome-agent-skills ⚡

> **The Definitive Collection of 4-Part Production-Grade Cursor Rules (`.mdc`), Claude Code Skills (`SKILL.md`), and GitHub Copilot Instructions.**
> Built by [ashish7802](https://github.com/ashish7802).

[![Stars](https://img.shields.io/github/stars/ashish7802/awesome-agent-skills?style=for-the-badge&logo=github&color=38bdf8)](https://github.com/ashish7802/awesome-agent-skills)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Supported Agents](https://img.shields.io/badge/Agents-Cursor%20|%20Claude%20Code%20|%20Windsurf%20|%20Copilot-indigo.svg?style=for-the-badge)](#supported-agents)

---

## 🚀 Quick Start & CLI Sync

Install or export rules directly to your workspace:

```bash
# Sync via NPX CLI
npx awesome-agent-skills init

# Direct Cursor .mdc sync
curl -fsSL https://raw.githubusercontent.com/ashish7802/awesome-agent-skills/main/install.sh | bash -s -- --agent=cursor

# Direct Claude Code SKILL.md sync
curl -fsSL https://raw.githubusercontent.com/ashish7802/awesome-agent-skills/main/install.sh | bash -s -- --agent=claude
```

---

## 📂 The Mandatory 4-Part Architectural Standard

Every skill in this repository strictly adheres to our zero-slop 4-part architectural blueprint:

1. **PART 1: FILE METADATA BLOCK** — File name suggestions, target repository paths (`.cursor/rules/`, `.claude/skills/`, `.github/`), and compatibility matrix.
2. **PART 2: SYSTEM BOUNDARY & CONTEXT SPEC** — Precise glob triggers, exhaustive anti-pattern bans, and strict version constraints.
3. **PART 3: THE MASTER INSTRUCTION PROMPT** — Specialist persona, architectural routing rules, state management, and defensive error prevention protocols.
4. **PART 4: LIVE INTERACTIVE USAGE EXAMPLES** — High-contrast ❌ Before vs. ✅ After code diffs demonstrating tangible bug prevention.

---

## 🛠️ Active Skill Blueprints Catalog

| Skill Name | Target Path | Enforced Stack | Category |
| :--- | :--- | :--- | :--- |
| **Next.js 15 & React 19 Fullstack** | `.cursor/rules/nextjs-15-approuter.mdc` | Next.js 15, React 19, RSC, Actions | Fullstack & SaaS |
| **FastAPI Async & Pydantic v2** | `.cursor/rules/fastapi-async-optimization.mdc` | Python 3.12, FastAPI 0.115+, SQLAlchemy 2.0 | Backend & APIs |
| **Supabase PostgreSQL RLS Engine** | `.cursor/rules/supabase-postgres-rls.mdc` | PostgreSQL 15+, Supabase JS v2, Row-Level-Security | Database & Storage |
| **Rust WASM & Memory Optimization** | `.cursor/rules/rust-wasm-optimization.mdc` | Rust 2021, wasm-bindgen, zero-copy | Systems & Low-Level |
| **Tailwind CSS v4 & Design Tokens** | `.cursor/rules/tailwind-v4-modern-styling.mdc` | Tailwind CSS v4, CSS Variables, OKLCH | Frontend & UI |
| **Deterministic AI Agent Orchestrator** | `.cursor/rules/deterministic-ai-orchestrator.mdc` | Gemini 2.5, LangGraph, Zod schemas | AI & LLMs |
| **Cloudflare Workers & Hono D1** | `.cursor/rules/cloudflare-workers-hono.mdc` | Cloudflare Workers, Hono v4, D1 | Cloud & DevOps |
| **Go 1.23 & gRPC Microservices** | `.cursor/rules/golang-grpc-microservices.mdc` | Go 1.23, Google gRPC, Protobuf v3, slog | Backend & APIs |

---

## 🤝 Contributing

We welcome community contributions that follow our strict 4-part architectural blueprint:

1. Fork the repository `ashish7802/awesome-agent-skills`.
2. Create your rule file following the standard template in `.cursor/rules/` or `.claude/skills/`.
3. Verify compliance with the interactive auditor.
4. Submit a Pull Request.

---

## 📄 License

MIT © [ashish7802](https://github.com/ashish7802)
