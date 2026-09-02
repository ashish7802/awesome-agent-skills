export interface SamplePreset {
  id: string;
  name: string;
  badge: string;
  description: string;
  fileName: string;
  content: string;
}

export const SAMPLE_PRESETS: SamplePreset[] = [
  {
    id: 'flawed-vague-rule',
    name: 'Flawed Rule (Vague + Fake Stats + Bad Globs)',
    badge: 'High Defects',
    description: 'Contains marketing fluff (100k stars, 10x speedup), broad globs, and no anti-patterns.',
    fileName: 'flawed-frontend-rule.mdc',
    content: `---
description: The Ultimate 10x Frontend Rule for 100k Stars Repositories
globs: ["**/*.*"]
---

# Role & Persona
You are a 10x rockstar developer. Guaranteed 100% bug-free delivery with 50x speedup!
Always follow best practices and write clean code.

# Rules
- Be helpful, polite, and thorough.
- Make the UI super fast and nice looking.
- Write good code that works well on all browsers.
- Always follow best practices and write clean code.`,
  },
  {
    id: 'missing-antipatterns',
    name: 'Incomplete Rule (Missing Anti-Patterns & Globs)',
    badge: 'Moderate Defects',
    description: 'Lacks explicit file triggers and negative constraints (Always Avoid).',
    fileName: 'api-service.mdc',
    content: `---
description: Backend REST API architecture guidelines
---

# Architecture
1. Group routes by feature in src/routes/.
2. Use async/await for database operations.
3. Validate user input with schema objects before querying the database.
4. Return 404 when resources are not found.`,
  },
  {
    id: 'production-ready-rule',
    name: 'Production Grade Rule (Clean & Bounded)',
    badge: 'Clean Spec',
    description: 'Clear globs, explicit anti-patterns, actionable technical rules, and zero fluff.',
    fileName: 'fastapi-async-optimization.mdc',
    content: `---
description: FastAPI High-Performance Async Architecture & Pydantic v2 Standards
globs: ["app/**/*.py", "api/**/*.py", "schemas/**/*.py"]
alwaysAvoid:
  - 'Blocking sync calls (requests.get, time.sleep) inside async def routes'
  - 'Deprecated Pydantic v1 syntax (.dict(), @validator)'
  - 'Global unmanaged database session variables'
enforcedStack:
  - 'Python 3.12+ with strict type hints'
  - 'FastAPI 0.115+'
  - 'Pydantic v2.9+ (model_dump, field_validator)'
  - 'SQLAlchemy 2.0 async engine'
---

# Role & Persona
You are a Principal Python Backend Architect specializing in high-concurrency, asynchronous API systems with zero event-loop blocking.

# Architectural Rules
1. Async Purity: All I/O operations (database queries, Redis, HTTP calls) must use async/await with async drivers (e.g. httpx.AsyncClient, asyncpg).
2. Schema Validation: Route request and response models must inherit from pydantic.BaseModel with explicit Field constraints.
3. Dependency Injection: Inject database sessions, current users, and configuration using FastAPI Depends().`,
  },
];
