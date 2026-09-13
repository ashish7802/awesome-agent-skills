# Awesome Agent Skills &amp; Skill Auditor

> **Production-grade AI agent skills and rules for Cursor (`.mdc`), Claude Code (`SKILL.md`), and GitHub Copilot instructions — powered by a built-in AI Quality Auditor.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Skills Count](https://img.shields.io/badge/Skills-24%20Verified-brightgreen.svg)](#skills-catalog)
[![Runtimes](https://img.shields.io/badge/Runtimes-Cursor%20%7C%20Claude%20Code%20%7C%20Copilot-blueviolet.svg)](#skills-catalog)

---

## 🏛 The 4-Part Skill Architecture

Every skill in this repository strictly adheres to the **4-Part Architecture Standard** to eliminate hallucinations, enforce negative boundaries, and preserve model token limits:

1. **Part 1: Metadata Block** — Precise trigger globs, explicit runtime targets (`cursor`, `claude`, `copilot`), and enforced framework versions.
2. **Part 2: System Boundary** — Concrete role persona, hard invariants, and strict negative constraints (`Always Avoid`) prohibiting deprecated APIs and anti-patterns.
3. **Part 3: Master Instruction Prompt** — Production architectural rules, type-safe invariants, and deterministic requirements.
4. **Part 4: Before / After Usage Examples** — Real-world anti-pattern vs. production-grade code comparison with justification.

---

## 📚 Skills Catalog (24 Production Rules)

All 24 skills are synchronized to disk and ready for direct consumption:

| Skill | Agent | Category | Enforced Stack | Target Path |
| :--- | :--- | :--- | :--- | :--- |
| **Next.js 15 App Router & Server Actions** | Cursor | Full-Stack & SSR | Next.js 15, React 19, TypeScript 5.6 | `.cursor/rules/nextjs-15-approuter.mdc` |
| **FastAPI Async & Pydantic V2** | Cursor | Backend & Microservices | FastAPI 0.115+, Pydantic V2, Python 3.12 | `.cursor/rules/fastapi-async-optimization.mdc` |
| **Supabase PostgreSQL & Row Level Security** | Cursor | Database & Storage | Supabase, PostgreSQL 16, pgvector | `.cursor/rules/supabase-postgres-rls.mdc` |
| **Deterministic AI Agent Orchestration** | Claude Code | AI & Agent Orchestration | Anthropic Claude 3.5, LangChain | `.claude/skills/deterministic-ai-orchestrator/SKILL.md` |
| **Golang gRPC & High-Throughput Services** | Cursor | Backend & Microservices | Go 1.23, gRPC, Protobuf v3 | `.cursor/rules/golang-grpc-microservices.mdc` |
| **Tailwind CSS v4 Modern Styling** | GitHub Copilot | Frontend & UI | Tailwind CSS v4, CSS @theme | `.github/copilot-instructions/tailwind-v4-styling.md` |
| **Rust WebAssembly & SIMD Acceleration** | Cursor | Systems & Performance | Rust 1.82+, wasm-bindgen, SIMD | `.cursor/rules/rust-wasm-optimization.mdc` |
| **Cloudflare Workers & Hono Edge API** | Cursor | Full-Stack & SSR | Cloudflare Workers, Hono v4, D1 | `.cursor/rules/cloudflare-workers-hono.mdc` |
| **React Router v7 Full-Stack SSR** | Claude Code | Full-Stack & SSR | React Router v7, Vite, React 19 | `.claude/skills/react-router-v7-ssr/SKILL.md` |
| **Django Ninja Async API & Pydantic** | GitHub Copilot | Backend & Microservices | Django 5.1+, Django Ninja, PostgreSQL | `.github/copilot-instructions/django-ninja-async.md` |
| **CockroachDB & Prisma Distributed HA** | Cursor | Database & Storage | CockroachDB, Prisma ORM, Node.js 22 | `.cursor/rules/prisma-cockroachdb-ha.mdc` |
| **ClickHouse Analytical Pipelines** | Claude Code | Database & Storage | ClickHouse, Parquet, MergeTree | `.claude/skills/clickhouse-analytics/SKILL.md` |
| **Zig Systems Programming & Memory Safety** | Cursor | Systems & Performance | Zig 0.13+, GeneralPurposeAllocator | `.cursor/rules/zig-memory-safety.mdc` |
| **Vue 3 Composition API & Pinia** | GitHub Copilot | Frontend & UI | Vue 3.5+, Pinia 2.2+, Vite | `.github/copilot-instructions/vue3-pinia-composition.md` |
| **SvelteKit 2 & Svelte 5 Runes** | Claude Code | Frontend & UI | Svelte 5 ($state), SvelteKit 2 | `.claude/skills/sveltekit-runes/SKILL.md` |
| **LangGraph Multi-Agent Orchestration** | Cursor | AI & Agent Orchestration | LangGraph, Python 3.12, Checkpointers | `.cursor/rules/langgraph-multi-agent.mdc` |
| **ArgoCD GitOps & Kubernetes Delivery** | GitHub Copilot | Cloud & DevOps | ArgoCD, Kubernetes 1.31+, Helm | `.github/copilot-instructions/argocd-gitops-k8s.md` |
| **Terraform AWS Scalable Infrastructure** | Claude Code | Cloud & DevOps | Terraform 1.9+, AWS Provider v5 | `.claude/skills/terraform-aws-modules/SKILL.md` |
| **Playwright Comprehensive E2E Testing** | Cursor | Testing & QA | Playwright Test, Page Object Model | `.cursor/rules/playwright-e2e-suite.mdc` |
| **Vitest & MSW Contract Testing** | GitHub Copilot | Testing & QA | Vitest, Mock Service Worker (MSW) 2 | `.github/copilot-instructions/vitest-msw-contracts.md` |
| **React Native & Expo New Architecture** | Cursor | Mobile & Cross-Platform | Expo SDK 52+, React Native 0.76+ | `.cursor/rules/expo-new-architecture.mdc` |
| **Flutter & Riverpod Clean Architecture** | Claude Code | Mobile & Cross-Platform | Flutter 3.24+, Dart 3.5, Riverpod 2.5 | `.claude/skills/flutter-riverpod-clean/SKILL.md` |
| **OWASP API Security Hardening** | Cursor | Security & Compliance | Node.js, OWASP API Top 10, JWT | `.cursor/rules/owasp-api-security.mdc` |
| **SLSA Level 3 Supply Chain Security** | GitHub Copilot | Security & Compliance | GitHub Actions, Sigstore / Cosign | `.github/copilot-instructions/supply-chain-slsa.md` |

---

## ⚡️ Quick Installation

Install any rule into your repository with one command:

```bash
# Example: Install Next.js 15 rule for Cursor
curl -fsSL https://raw.githubusercontent.com/ashish7802/awesome-agent-skills/main/.cursor/rules/nextjs-15-approuter.mdc --create-dirs -o .cursor/rules/nextjs-15-approuter.mdc

# Example: Install Claude Code skill
curl -fsSL https://raw.githubusercontent.com/ashish7802/awesome-agent-skills/main/.claude/skills/deterministic-ai-orchestrator/SKILL.md --create-dirs -o .claude/skills/deterministic-ai-orchestrator/SKILL.md

# Example: Install GitHub Copilot instructions
curl -fsSL https://raw.githubusercontent.com/ashish7802/awesome-agent-skills/main/.github/copilot-instructions/tailwind-v4-styling.md --create-dirs -o .github/copilot-instructions/tailwind-v4-styling.md
```

---

## 🔍 Built-In AI Quality Auditor & Python Engine

The repository includes an enterprise **Rule Quality Auditor** implemented with a dual-engine architecture:
- **Server API**: Powered by Gemini (`gemini-flash-latest`) with automatic fallback.
- **Python Core (`skill_auditor/`)**: Written in Python 3.10 standard library, providing deterministic evaluation, 5-dimension scoring, CLI commands, and automated file generation.

It scores rule files across 5 dimensions:
1. **Trigger Clarity**: Validates narrow globs and use-when conditions.
2. **Fabrication Check**: Detects hallucinated APIs, fake multipliers, and hype.
3. **Duplication & Density**: Prevents context-wasting boilerplate.
4. **Actionability**: Replaces vague suggestions with deterministic code.
5. **Anti-Pattern Completeness**: Mandates strict `Always Avoid` prohibitions.

### 🐍 Python CLI Usage

You can run the Python auditor and validator directly from the terminal:

```bash
# Audit any rule file with colored terminal report
python3 scripts/audit_cli.py .cursor/rules/nextjs-15-approuter.mdc

# Output audit results as raw JSON
python3 scripts/audit_cli.py .cursor/rules/nextjs-15-approuter.mdc --json

# Validate all 24 skills across the repository
python3 scripts/validate_repo.py
# or: npm run validate:skills

# Regenerate all 24 rule files on disk from specification
python3 scripts/generate_rules.py
# or: npm run generate:rules
```

---

## 🤝 Contributing a Skill

We welcome new production-grade skills! All submissions must use the 4-part architecture.

👉 **[Submit a New Skill](https://github.com/ashish7802/awesome-agent-skills/issues/new?template=new-skill.yml)**

---

## 🛠 Local Development

```bash
# 1. Install dependencies
npm install

# 2. Synchronize all skill files to disk
npm run generate:rules

# 3. Start development server
npm run dev

# 4. Build production bundle
npm run build
```

---

## License

MIT © [Ashish](https://github.com/ashish7802)
