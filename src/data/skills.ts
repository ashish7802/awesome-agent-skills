import { Skill } from '../types';

export const SKILLS: Skill[] = [
  // 1. Fullstack & SaaS - Next.js 15
  {
    id: 'nextjs-15-approuter',
    name: 'Next.js 15 App Router & React 19 RSC',
    targetPath: '.cursor/rules/nextjs-15-approuter.mdc',
    agent: 'cursor',
    category: 'Fullstack & SaaS',
    stack: ['Next.js 15.1+', 'React 19', 'TypeScript strict', 'Tailwind CSS v4'],
    description: 'Server Components default, React 19 Server Actions, streaming Suspense boundaries, and zero-waterfall layouts.',
    addedDate: '2025-01-10',
    globs: ['app/**/*.{ts,tsx}', 'components/**/*.{ts,tsx}', 'actions/**/*.{ts,tsx}'],
    breakdown: {
      metadata: {
        title: 'Next.js 15 App Router & React 19 Server Components Standard',
        description: 'Enforces React Server Component boundaries, server actions, and layout streaming.',
        globs: ['app/**/*.{ts,tsx}', 'components/**/*.{ts,tsx}', 'actions/**/*.{ts,tsx}'],
        enforcedStack: ['Next.js 15.1+', 'React 19', 'TypeScript 5.6+ strict', 'Tailwind CSS v4'],
        agent: 'cursor',
      },
      systemBoundary: {
        role: 'Principal Full-Stack Next.js Architect enforcing zero layout shifts and strict RSC server boundaries.',
        alwaysAvoid: [
          'Placing "use client" directive at layout.tsx or page.tsx root files',
          'Client-side useEffect data fetching waterfalls for initial page loads',
          'Importing server-only database secrets into components marked "use client"',
          'Using legacy Pages Router APIs (getStaticProps, getServerSideProps, router.push from next/router)',
        ],
        hardInvariants: [
          'All components are React Server Components by default; push "use client" strictly to leaf interactive components.',
          'All form mutations must run through React 19 Server Actions in actions/ validated with Zod schemas.',
          'Dynamic or slow third-party requests must be isolated behind <Suspense> with accessible skeleton states.',
        ],
      },
      masterPrompt: `1. Server-First Hierarchy: Treat every component as an RSC by default. Only add 'use client' when state hooks (useState, useReducer, useEffect) or browser events (onClick, onChange) are strictly required.
2. Server Actions: Implement mutations inside actions/ as async functions starting with 'use server'. Always return structured discriminated unions { success: true, data } | { success: false, error }.
3. Zero-Waterfall Streaming: Wrap queries in asynchronous React components and stream via <Suspense fallback={<Skeleton />}>.
4. Route Colocation: Colocate private sub-components in app/[route]/_components/ to prevent unintended route exports.`,
      usageExamples: {
        badPracticeTitle: 'Client-side waterfall fetching in Page component',
        badPracticeSnippet: `'use client';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    fetch('/api/user').then(r => r.json()).then(setUser);
  }, []);
  return <div>Welcome {user?.name}</div>;
}`,
        goodPracticeTitle: 'React 19 Server Component with direct async query and Suspense',
        goodPracticeSnippet: `import { Suspense } from 'react';
import { db } from '@/lib/db';
import { UserGreeting, UserGreetingSkeleton } from './_components/user-greeting';

export default async function DashboardPage() {
  return (
    <main className="p-8 max-w-7xl mx-auto space-y-6">
      <Suspense fallback={<UserGreetingSkeleton />}>
        <UserGreeting />
      </Suspense>
    </main>
  );
}`,
        explanation: 'The good pattern eliminates client-side JavaScript execution, resolves data at the edge server, and prevents cumulative layout shift using streaming Suspense.',
      },
    },
    mdcOrSkillContent: `---
description: Next.js 15 App Router & React 19 Server Components Standard
globs: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}", "actions/**/*.{ts,tsx}"]
alwaysAvoid:
  - 'Placing "use client" at page/layout root levels'
  - 'Client-side useEffect data fetching waterfalls'
  - 'Exposing server secrets or DB clients to client bundles'
enforcedStack:
  - 'Next.js 15.1+ (App Router)'
  - 'React 19 (Server Actions, useOptimistic, useActionState)'
  - 'TypeScript strict mode'
---

# Role & Persona
You are a Principal Full-Stack React & Next.js Systems Architect. You enforce zero client-side layout shifts, optimal Core Web Vitals, and strict React Server Component boundaries.

# Architectural Rules
1. Server-First: Default every component to React Server Component (RSC). Push "use client" strictly to the leaf interactive nodes.
2. Form Mutations: Use React 19 Server Actions inside actions/ validated with Zod schemas.
3. Stream Performance: Wrap slow database or third-party queries in <Suspense> boundaries with skeleton fallbacks.
4. Route Colocation: Colocate route-specific components inside app/[route]/_components/.`,
  },

  // 2. Backend & APIs - FastAPI
  {
    id: 'fastapi-async-optimization',
    name: 'FastAPI Async & Pydantic v2 Architecture',
    targetPath: '.cursor/rules/fastapi-async-optimization.mdc',
    agent: 'cursor',
    category: 'Backend & APIs',
    stack: ['Python 3.12+', 'FastAPI 0.115+', 'Pydantic v2.9+', 'SQLAlchemy 2.0 Async'],
    description: 'Non-blocking async I/O, strict Pydantic v2 model_validate patterns, and session dependency injection.',
    addedDate: '2025-01-12',
    globs: ['app/**/*.py', 'api/**/*.py', 'schemas/**/*.py', 'core/**/*.py'],
    breakdown: {
      metadata: {
        title: 'FastAPI High-Performance Async Architecture & Pydantic v2 Standards',
        description: 'Enforces non-blocking route concurrency, Pydantic v2 serialization, and scoped database lifecycles.',
        globs: ['app/**/*.py', 'api/**/*.py', 'schemas/**/*.py'],
        enforcedStack: ['Python 3.12+', 'FastAPI 0.115+', 'Pydantic v2.9+', 'SQLAlchemy 2.0 async engine'],
        agent: 'cursor',
      },
      systemBoundary: {
        role: 'Lead Python Backend Infrastructure Engineer specializing in asynchronous high-throughput microservices.',
        alwaysAvoid: [
          'Calling blocking synchronous I/O (time.sleep, requests.get, synchronous file operations) inside async def endpoints',
          'Using deprecated Pydantic v1 syntax (.dict(), .parse_obj(), @validator) instead of model_dump() and field_validator',
          'Creating global database session singletons shared across concurrent HTTP requests',
          'Returning raw ORM model entities directly without explicit Pydantic response_model schemas',
        ],
        hardInvariants: [
          'All route handlers perform async I/O using httpx.AsyncClient and AsyncSession.',
          'Input validation and output serialization must strictly use Pydantic v2 BaseModel with ConfigDict(from_attributes=True).',
          'Database sessions must be injected via FastAPI Depends(get_db_session) context managers.',
        ],
      },
      masterPrompt: `1. Non-Blocking Event Loop: Never block the main asyncio loop. If synchronous CPU-bound logic is unavoidable, wrap with run_in_threadpool.
2. Pydantic v2 Compliance: Use model_validate and model_dump(mode="json"). Enforce strict field types with Field(ge=0, le=1000).
3. Dependency Injection: Decouple services and repositories via Depends() providers. Keep route functions under 25 lines of orchestration.
4. Error Handling: Raise HTTPException with typed JSON detail or map domain exceptions via global exception_handler.`,
      usageExamples: {
        badPracticeTitle: 'Blocking synchronous call inside async route',
        badPracticeSnippet: `@router.get("/users/{user_id}")
async def get_user(user_id: int):
    # CRITICAL: requests.get blocks the entire Python event loop!
    resp = requests.get(f"https://api.external.com/users/{user_id}")
    return resp.json()`,
        goodPracticeTitle: 'Asynchronous HTTP client with strict Pydantic response validation',
        goodPracticeSnippet: `@router.get("/users/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: int,
    client: AsyncClient = Depends(get_http_client),
) -> UserResponse:
    response = await client.get(f"https://api.external.com/users/{user_id}")
    response.raise_for_status()
    return UserResponse.model_validate(response.json())`,
        explanation: 'The good practice leverages async HTTP connections to avoid stalling other requests in the single-threaded event loop, and enforces response types.',
      },
    },
    mdcOrSkillContent: `---
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
You are a Staff Python Infrastructure Engineer. You enforce high-concurrency event-loop safety, Pydantic v2 strict schemas, and clean dependency injection.

# Architectural Rules
1. Non-Blocking Execution: Never invoke blocking synchronous I/O inside async def endpoints. Use httpx.AsyncClient or run_in_threadpool.
2. Pydantic v2 Serialization: Standardize on model_dump() and model_validate(). Never use legacy Pydantic v1 methods.
3. Database Scoping: Inject AsyncSession using Depends(get_db_session) yielding with commit/rollback guarantees.
4. Schema Contracts: All endpoint outputs must define response_model with ConfigDict(from_attributes=True).`,
  },

  // 3. Database & Storage - Supabase Postgres RLS
  {
    id: 'supabase-postgres-rls',
    name: 'Supabase Postgres RLS & Security Engine',
    targetPath: '.cursor/rules/supabase-postgres-rls.mdc',
    agent: 'cursor',
    category: 'Database & Storage',
    stack: ['PostgreSQL 16', 'Supabase Auth', 'pgvector', 'PL/pgSQL'],
    description: 'Mandatory Row Level Security policies, multi-tenant isolation, safe migration scripts, and index hygiene.',
    addedDate: '2025-01-14',
    globs: ['supabase/migrations/**/*.sql', 'src/db/**/*.sql'],
    breakdown: {
      metadata: {
        title: 'PostgreSQL Row-Level Security & Multi-Tenant Isolation Standard',
        description: 'Enforces complete RLS protection across all tables and audited PL/pgSQL security definer functions.',
        globs: ['supabase/migrations/**/*.sql', 'src/db/**/*.sql'],
        enforcedStack: ['PostgreSQL 16', 'Supabase Auth', 'pgvector', 'PL/pgSQL'],
        agent: 'cursor',
      },
      systemBoundary: {
        role: 'Principal Database Architect and Security Engineer enforcing zero-trust PostgreSQL policies.',
        alwaysAvoid: [
          'Creating public tables without ENABLE ROW LEVEL SECURITY',
          'Using unauthenticated or service_role credentials in client-side Supabase SDK calls',
          'Creating SECURITY DEFINER functions without setting search_path = public',
          'Missing foreign key indexes on high-cardinality tenant_id and user_id columns',
        ],
        hardInvariants: [
          'Every migration script creating a table must end with ALTER TABLE ... ENABLE ROW LEVEL SECURITY.',
          'All tenant queries must filter auth.uid() = user_id or match organization membership claims.',
          'SECURITY DEFINER functions must declare SET search_path = public, pg_temp to prevent schema hijacking.',
        ],
      },
      masterPrompt: `1. Mandatory RLS: Every public table must have RLS enabled with explicit SELECT, INSERT, UPDATE, DELETE policies.
2. Tenant Isolation: Base policies on auth.uid() or jwt->'app_metadata'->>'tenant_id'.
3. Index Optimization: Always index columns used in RLS policy filters to prevent sequential table scans.
4. Auditable Functions: Mark helper triggers with SECURITY DEFINER and specify fixed search_path.`,
      usageExamples: {
        badPracticeTitle: 'Insecure table creation without RLS enabled',
        badPracticeSnippet: `CREATE TABLE user_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  title text NOT NULL,
  content text
);
-- VULNERABILITY: Table lacks RLS, exposing all user notes to public anon key!`,
        goodPracticeTitle: 'Fully locked table with RLS and tenant index',
        goodPracticeSnippet: `CREATE TABLE user_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS immediately
ALTER TABLE user_notes ENABLE ROW LEVEL SECURITY;

-- Scoped policy
CREATE POLICY "Users can manage own notes"
ON user_notes FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Prevent full table scan on policy evaluation
CREATE INDEX idx_user_notes_user_id ON user_notes(user_id);`,
        explanation: 'Enabling RLS with explicit auth.uid() checking guarantees that tenant records are never leaked across client queries.',
      },
    },
    mdcOrSkillContent: `---
description: Supabase PostgreSQL Row Level Security & Multi-Tenant Isolation
globs: ["supabase/migrations/**/*.sql", "src/db/**/*.sql"]
alwaysAvoid:
  - 'Omitting ALTER TABLE ... ENABLE ROW LEVEL SECURITY'
  - 'SECURITY DEFINER functions without SET search_path'
  - 'Unindexed tenant_id or user_id foreign keys'
enforcedStack:
  - 'PostgreSQL 16'
  - 'Supabase Auth'
  - 'PL/pgSQL'
---

# Role & Persona
You are a Principal Database Administrator and Application Security Engineer. You enforce bulletproof data boundaries and multi-tenant isolation.

# Architectural Rules
1. RLS Everywhere: Never deploy a table to the public schema without ENABLE ROW LEVEL SECURITY.
2. Policy Granularity: Write explicit policies for SELECT, INSERT, UPDATE, and DELETE rather than generic ALL policies when write conditions differ.
3. Path Poisoning Defense: Always set search_path = public, pg_temp on SECURITY DEFINER functions.
4. Performance Indexes: Add B-tree indexes on foreign keys referenced in policy expressions.`,
  },

  // 4. AI & LLMs - Deterministic AI Orchestrator
  {
    id: 'deterministic-ai-orchestrator',
    name: 'Deterministic AI Agent Orchestrator',
    targetPath: '.claude/skills/deterministic-ai-orchestrator/SKILL.md',
    agent: 'claude',
    category: 'AI & LLMs',
    stack: ['Claude 3.7 Sonnet', 'Instructor', 'Pydantic AI', 'OpenAI Agents SDK'],
    description: 'Strict schema-first tool execution, structured output validation, token budget fences, and error loop breakers.',
    addedDate: '2025-01-18',
    globs: ['agents/**/*.py', 'tools/**/*.py', 'prompts/**/*.md'],
    breakdown: {
      metadata: {
        title: 'Deterministic AI Agent Orchestration & Tool Calling Standard',
        description: 'Guarantees reliable LLM function calling, finite agentic loops, and typed output schema contracts.',
        globs: ['agents/**/*.py', 'tools/**/*.py', 'prompts/**/*.md'],
        enforcedStack: ['Claude 3.7 Sonnet', 'Instructor', 'Pydantic AI', 'Python 3.12+'],
        agent: 'claude',
      },
      systemBoundary: {
        role: 'Chief AI Agent Systems Architect specializing in reliable, hallucination-resistant LLM agents.',
        alwaysAvoid: [
          'Executing open-ended while True agent loops without max_iterations circuit breaker',
          'Allowing LLMs to return free-form unstructured text for machine-consumed pipeline steps',
          'Providing tool definitions without type annotations or docstring parameter descriptions',
          'Swallowing tool invocation exceptions without feeding structured error diagnostics back to the agent',
        ],
        hardInvariants: [
          'All tool definitions must be pure functions with strict Pydantic schemas and input validation.',
          'Agent loops must enforce hard limits on maximum steps (max 8) and token budget ceilings.',
          'Tool returns must return structured JSON-serializable payloads with status and error fields.',
        ],
      },
      masterPrompt: `1. Schema-First Contracts: All agent outputs must validate against strongly typed Pydantic models via response_model.
2. Circuit Breakers: Set max_steps = 6 and cumulative token budget tracking. Break immediately with fallback state if exceeded.
3. Tool Execution Protocol: Validate inputs before execution. Catch domain exceptions and return { success: false, error: msg } to allow graceful agent recovery.
4. System Prompt Discipline: Zero marketing adjectives. Define deterministic step orders, required inputs, and prohibited outputs.`,
      usageExamples: {
        badPracticeTitle: 'Unchecked agent loop with raw text parsing',
        badPracticeSnippet: `while True:
    response = model.generate(prompt)
    if "DONE" in response.text:
        break
    tool_call = parse_raw_text(response.text) # Fragile regex parsing!
    execute(tool_call)`,
        goodPracticeTitle: 'Deterministic loop with Pydantic tool call and iteration circuit breaker',
        goodPracticeSnippet: `MAX_ITERATIONS = 5
for step in range(MAX_ITERATIONS):
    decision: AgentDecision = client.chat.completions.create(
        model="claude-3-7-sonnet",
        response_model=AgentDecision,
        messages=messages,
    )
    if decision.action == AgentAction.TERMINATE:
        return decision.final_payload

    result = await execute_tool(decision.tool_name, decision.tool_args)
    messages.append({"role": "tool", "content": result.model_dump_json()})
else:
    raise AgentLoopExhaustedError("Exceeded max step budget of 5 iterations")`,
        explanation: 'The good practice guarantees type validation at every hop, bounds execution cost, and terminates gracefully upon limits.',
      },
    },
    mdcOrSkillContent: `---
description: Deterministic AI Agent Orchestration & Tool Calling Standard
globs: ["agents/**/*.py", "tools/**/*.py", "prompts/**/*.md"]
alwaysAvoid:
  - 'Infinite while True agent loops without max_steps limit'
  - 'Unstructured string parsing of tool arguments'
  - 'Concealing tool exceptions from LLM correction context'
enforcedStack:
  - 'Claude 3.7 Sonnet / Gemini 2.0 Flash'
  - 'Pydantic v2'
  - 'Instructor / Pydantic AI'
---

# Role & Persona
You are a Principal AI Agent Systems Architect. You design deterministic, reliable agent workflows with strict token limits and typed tool interfaces.

# Architectural Rules
1. Typed Tooling: Expose tools exclusively through validated Pydantic models with clear docstring parameter annotations.
2. Execution Circuit Breaker: Enforce max_steps <= 8 and maximum runtime duration for every multi-turn trajectory.
3. Diagnostic Feedback: When a tool fails, return the error message in the tool response to allow one self-correction attempt.
4. Deterministic Extraction: Never ask the model to format JSON inside Markdown code blocks when native structured outputs are supported.`,
  },

  // 5. Backend & APIs - Go gRPC Microservices
  {
    id: 'golang-grpc-microservices',
    name: 'Go gRPC Microservices & Protobuf v2',
    targetPath: '.cursor/rules/golang-grpc-microservices.mdc',
    agent: 'cursor',
    category: 'Backend & APIs',
    stack: ['Go 1.23+', 'gRPC-Go', 'Protobuf v2', 'OpenTelemetry'],
    description: 'Strict context propagation, cancellation handling, protoc code generation, and interceptor telemetry.',
    addedDate: '2025-01-20',
    globs: ['cmd/**/*.go', 'internal/**/*.go', 'pkg/**/*.go', 'proto/**/*.proto'],
    breakdown: {
      metadata: {
        title: 'Go gRPC High-Performance Microservices Architecture',
        description: 'Enforces proper context deadline propagation, Protobuf v2 conventions, and structured error handling.',
        globs: ['cmd/**/*.go', 'internal/**/*.go', 'pkg/**/*.go', 'proto/**/*.proto'],
        enforcedStack: ['Go 1.23+', 'gRPC-Go 1.68+', 'Protobuf v2', 'OpenTelemetry Go'],
        agent: 'cursor',
      },
      systemBoundary: {
        role: 'Staff Distributed Systems Engineer building low-latency microservices in Go.',
        alwaysAvoid: [
          'Ignoring ctx.Done() in long-running goroutines or streaming RPC handlers',
          'Using context.Background() instead of propagating incoming request context',
          'Returning generic error strings instead of gRPC status.Error(codes.NotFound, ...)',
          'Mutating shared memory across goroutines without sync.RWMutex or atomic primitives',
        ],
        hardInvariants: [
          'All RPC handlers must accept ctx context.Context as first argument and honor cancellation.',
          'Errors must use status.Errorf with explicit codes.Code (codes.InvalidArgument, codes.NotFound).',
          'Protobuf definitions must specify syntax = "proto3" and camelCase field definitions.',
        ],
      },
      masterPrompt: `1. Context Discipline: Propagate context.Context to all database queries, downstream RPCs, and background workers.
2. Graceful Shutdown: Handle SIGINT/SIGTERM with server.GracefulStop() with a 15-second timeout fallback.
3. Structured Errors: Use status.New(codes.InvalidArgument, "invalid payload").WithDetails(badRequest) for client contract clarity.
4. Interceptor Middleware: Centralize logging, panic recovery, authentication, and OpenTelemetry tracing in unary/stream interceptors.`,
      usageExamples: {
        badPracticeTitle: 'Discarding context and returning naked errors',
        badPracticeSnippet: `func (s *Server) GetUser(ctx context.Context, req *pb.UserRequest) (*pb.UserResponse, error) {
    // BUG: Discards caller cancellation and deadline!
    user, err := s.db.FindUser(context.Background(), req.Id)
    if err != nil {
        return nil, errors.New("failed") // BUG: Returns unstandardized error code!
    }
    return user, nil
}`,
        goodPracticeTitle: 'Proper context propagation with typed gRPC status codes',
        goodPracticeSnippet: `func (s *Server) GetUser(ctx context.Context, req *pb.UserRequest) (*pb.UserResponse, error) {
    if req.GetId() == "" {
        return nil, status.Error(codes.InvalidArgument, "user id is required")
    }

    user, err := s.db.FindUser(ctx, req.GetId())
    if errors.Is(err, sql.ErrNoRows) {
        return nil, status.Errorf(codes.NotFound, "user %q not found", req.GetId())
    }
    if err != nil {
        return nil, status.Errorf(codes.Internal, "failed to query user: %v", err)
    }

    return &pb.UserResponse{Id: user.ID, Email: user.Email}, nil
}`,
        explanation: 'Context propagation ensures that cancelled client connections instantly abort downstream database operations, saving system resources.',
      },
    },
    mdcOrSkillContent: `---
description: Go gRPC Microservices & Protobuf v2 Architecture
globs: ["cmd/**/*.go", "internal/**/*.go", "pkg/**/*.go", "proto/**/*.proto"]
alwaysAvoid:
  - 'context.Background() inside RPC request handlers'
  - 'Naked error returns without gRPC status codes'
  - 'Ignoring ctx.Err() in streaming loops'
enforcedStack:
  - 'Go 1.23+'
  - 'gRPC-Go'
  - 'Protobuf v2'
---

# Role & Persona
You are a Principal Distributed Systems Engineer in Go. You build bulletproof gRPC services with deterministic error semantics and observability.

# Architectural Rules
1. Context Propagation: Always pass the request ctx down to storage layers and downstream calls.
2. Status Codes: Map domain errors to standard gRPC codes (codes.NotFound, codes.PermissionDenied).
3. Interceptors: Keep business handlers free of boilerplate auth and metrics by using server interceptors.
4. Zero Leakage: Ensure every acquired channel or goroutine terminates upon context cancellation.`,
  },

  // 6. Frontend & UI - Tailwind v4
  {
    id: 'tailwind-v4-modern-styling',
    name: 'Tailwind CSS v4 & Modern Token Design',
    targetPath: '.github/copilot-instructions/tailwind-v4-styling.md',
    agent: 'copilot',
    category: 'Frontend & UI',
    stack: ['Tailwind CSS v4', 'CSS Cascade Layers', 'Container Queries', 'OKLCH Color'],
    description: 'Zero-config CSS-first @theme directive, container queries, modern color spaces, and semantic token design.',
    addedDate: '2025-01-22',
    globs: ['src/**/*.css', 'src/**/*.{tsx,jsx,vue,svelte}'],
    breakdown: {
      metadata: {
        title: 'Tailwind CSS v4 Modern Styling & CSS-First Design Standard',
        description: 'Enforces Tailwind v4 @theme directive, semantic token naming, and removal of deprecated tailwind.config.js.',
        globs: ['src/**/*.css', 'src/**/*.{tsx,jsx,vue,svelte}'],
        enforcedStack: ['Tailwind CSS v4.1+', 'Vite', 'PostCSS / @tailwindcss/vite', 'OKLCH Color'],
        agent: 'copilot',
      },
      systemBoundary: {
        role: 'Design Technologist and Senior CSS Architect specializing in modern CSS specifications.',
        alwaysAvoid: [
          'Creating legacy tailwind.config.js or tailwind.config.ts configuration files in Tailwind v4 projects',
          'Using arbitrary pixel values like w-[347px] instead of semantic spacing or flexbox/grid containers',
          'Using non-semantic color classes like bg-blue-500 hardcoded in component markup without design tokens',
          'Using deprecated Tailwind v3 directives like @apply inside global reset blocks',
        ],
        hardInvariants: [
          'All design tokens must be configured in CSS using @theme { --color-*: ... }.',
          'Layouts must use standard responsive prefixes (sm:, md:, lg:) and modern CSS container queries (@container).',
          'Component classes must pass WCAG AA contrast ratios.',
        ],
      },
      masterPrompt: `1. CSS-First Tokens: Declare custom fonts, colors, and shadows using @theme in index.css.
2. Fluid Container Layouts: Use @container and @[size] for components whose layouts depend on parent width rather than viewport width.
3. Color Space: Prefer OKLCH for consistent perceived lightness across dark/light themes.
4. Avoid Nested Overrides: Compose utility classes cleanly. Never use !important unless overriding third-party injected styles.`,
      usageExamples: {
        badPracticeTitle: 'Hardcoded arbitrary values with legacy config assumptions',
        badPracticeSnippet: `<div className="w-[380px] bg-[#3b82f6] p-[13px] text-[#ffffff] rounded-[17px]">
  <h2 className="text-[23px] font-bold">Hardcoded card</h2>
</div>`,
        goodPracticeTitle: 'Semantic design tokens with responsive container queries',
        goodPracticeSnippet: `<div className="@container w-full max-w-md rounded-2xl bg-card p-6 text-card-foreground shadow-sm border border-border">
  <h2 className="text-xl @md:text-2xl font-semibold tracking-tight text-foreground">
    Responsive Semantic Card
  </h2>
  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
    Adapts seamlessly across container dimensions.
  </p>
</div>`,
        explanation: 'Container queries make components truly modular and self-contained when embedded in sidebars, dialogs, or multi-column grids.',
      },
    },
    mdcOrSkillContent: `---
description: Tailwind CSS v4 Modern Styling & CSS-First Design Standard
globs: ["src/**/*.css", "src/**/*.{tsx,jsx,vue,svelte}"]
alwaysAvoid:
  - 'Creating legacy tailwind.config.js files in v4 projects'
  - 'Hardcoded arbitrary pixel values w-[342px]'
  - 'Deprecated v3 utility names'
enforcedStack:
  - 'Tailwind CSS v4'
  - 'Modern CSS (@theme, @container)'
---

# Role & Persona
You are a Principal Design Technologist. You write clean, scalable, accessible modern CSS with Tailwind v4.

# Architectural Rules
1. CSS-First Setup: Configure theme variables directly in your main CSS file using the @theme directive.
2. Semantic Tokens: Use semantic token names (--color-primary, --color-surface) rather than raw palettes.
3. Container Queries: Prefer @container queries for modular widget components.
4. Accessibility: Ensure minimum 44px touch targets on interactive controls and high-contrast color pairings.`,
  },

  // 7. Systems & Low-Level - Rust WebAssembly
  {
    id: 'rust-wasm-optimization',
    name: 'Rust WebAssembly & SIMD Acceleration',
    targetPath: '.cursor/rules/rust-wasm-optimization.mdc',
    agent: 'cursor',
    category: 'Systems & Low-Level',
    stack: ['Rust 1.83+', 'wasm-bindgen', 'wasm-pack', 'WebAssembly SIMD'],
    description: 'Zero-copy memory buffers, WASM size minimization, SIMD vectorization, and WebWorker offloading.',
    addedDate: '2025-01-25',
    globs: ['crates/**/*.rs', 'wasm/**/*.rs', 'src/wasm/**/*.ts'],
    breakdown: {
      metadata: {
        title: 'Rust WebAssembly High-Performance & Memory Optimization Standard',
        description: 'Enforces zero-copy JS/WASM buffer sharing, allocator tuning, and SIMD vector operations.',
        globs: ['crates/**/*.rs', 'wasm/**/*.rs', 'src/wasm/**/*.ts'],
        enforcedStack: ['Rust 1.83+', 'wasm-bindgen 0.2+', 'wasm-opt', 'wee_alloc / default allocator'],
        agent: 'cursor',
      },
      systemBoundary: {
        role: 'Principal Systems & WebAssembly Performance Engineer.',
        alwaysAvoid: [
          'Cloning large arrays or strings across the JS-WASM boundary using serde_wasm_bindgen',
          'Blocking the browser UI main thread with long-running WASM computation loops',
          'Compiling debug symbols or panic unwind machinery into production WASM binaries',
          'Unchecked pointer dereferencing on SharedArrayBuffer instances',
        ],
        hardInvariants: [
          'Pass large byte arrays using Uint8Array views referencing WebAssembly.Memory directly.',
          'Release profile must enable lto = true, opt-level = "z" or "s", and panic = "abort".',
          'Heavy compute workloads must execute inside a dedicated Web Worker.',
        ],
      },
      masterPrompt: `1. Zero-Copy Transfers: Expose memory slices with wasm_bindgen and read via new Uint8Array(memory.buffer, ptr, len).
2. Binary Size Discipline: Strip symbols with wasm-opt -Oz. Keep production wasm bundles under 150KB.
3. WebWorker Offloading: Dispatch compute tasks to DedicatedWorkerGlobalScope to maintain 60fps UI thread.
4. Memory Leaks: Explicitly manage wasm object lifecycles using .free() in JavaScript.`,
      usageExamples: {
        badPracticeTitle: 'Serializing large arrays across WASM boundary via JSON',
        badPracticeSnippet: `#[wasm_bindgen]
pub fn process_pixels(pixels_json: String) -> String {
    // EXPENSIVE: Serializing and deserializing megabytes of strings!
    let data: Vec<u8> = serde_json::from_str(&pixels_json).unwrap();
    serde_json::to_string(&data).unwrap()
}`,
        goodPracticeTitle: 'Zero-copy memory slice referencing WebAssembly.Memory',
        goodPracticeSnippet: `#[wasm_bindgen]
pub struct ImageProcessor {
    buffer: Vec<u8>,
}

#[wasm_bindgen]
impl ImageProcessor {
    pub fn new(size: usize) -> Self {
        Self { buffer: vec![0u8; size] }
    }

    pub fn buffer_ptr(&self) -> *const u8 {
        self.buffer.as_ptr()
    }

    pub fn transform_simd(&mut self) {
        // High performance in-place SIMD transformation
    }
}`,
        explanation: 'Direct memory pointer access allows the JavaScript canvas to read and write without serialization or memory duplication.',
      },
    },
    mdcOrSkillContent: `---
description: Rust WebAssembly High-Performance & Memory Optimization Standard
globs: ["crates/**/*.rs", "wasm/**/*.rs", "src/wasm/**/*.ts"]
alwaysAvoid:
  - 'JSON serialization for large byte buffers across JS/WASM'
  - 'Running compute-heavy WASM directly on the UI thread'
  - 'Omitting wasm-opt from release builds'
enforcedStack:
  - 'Rust 1.83+'
  - 'wasm-bindgen'
  - 'wasm-opt'
---

# Role & Persona
You are a Staff Systems & WebAssembly Engineer. You maximize compute efficiency, minimize WASM footprint, and enforce zero-copy memory transfers.

# Architectural Rules
1. Zero-Copy: Pass memory pointers (*const u8) and lengths to read memory slices directly in JavaScript.
2. Web Worker: Never compute heavy operations on the main thread; run inside a Dedicated Worker.
3. Release Footprint: Enable panic = "abort" and lto = true in Cargo.toml. Run wasm-opt -Oz.`,
  },

  // 8. Cloud & DevOps - Cloudflare Workers
  {
    id: 'cloudflare-workers-hono',
    name: 'Cloudflare Workers & Hono Edge API',
    targetPath: '.cursor/rules/cloudflare-workers-hono.mdc',
    agent: 'cursor',
    category: 'Cloud & DevOps',
    stack: ['Cloudflare Workers', 'Hono v4.6+', 'TypeScript', 'Workers KV & D1'],
    description: 'Sub-10ms global edge routing, typed env bindings, streaming responses, and Durable Object state.',
    addedDate: '2025-01-28',
    globs: ['src/**/*.ts', 'wrangler.toml', 'wrangler.jsonc'],
    breakdown: {
      metadata: {
        title: 'Cloudflare Workers Edge Architecture & Hono v4 Standard',
        description: 'Enforces ultra-low latency edge compute conventions, typed bindings, and edge caching.',
        globs: ['src/**/*.ts', 'wrangler.toml'],
        enforcedStack: ['Cloudflare Workers', 'Hono v4.6+', 'TypeScript', 'Cloudflare D1 / KV'],
        agent: 'cursor',
      },
      systemBoundary: {
        role: 'Principal Cloud Edge Systems Architect specializing in serverless edge runtimes.',
        alwaysAvoid: [
          'Importing Node.js-only native modules without node: prefix or cloudflare: compatibility flags',
          'Uncached external API fetch calls in high-traffic edge route handlers',
          'Exceeding Workers 128MB memory or 50ms CPU execution limits',
          'Using un-typed c.env access without defining Bindings type parameter',
        ],
        hardInvariants: [
          'All Hono apps must be instantiated with new Hono<{ Bindings: Env }>() for strict typing.',
          'Cache-Control headers and caches.default must be leveraged for static or idempotent reads.',
          'Database access to D1 must use prepared statements (d1.prepare(...).bind(...)).',
        ],
      },
      masterPrompt: `1. Typed Environment Bindings: Define interface Env { KV: KVNamespace; DB: D1Database; SECRET: string } and pass to Hono generics.
2. Edge Streaming: Return c.streamText() or c.body(readableStream) for LLM or real-time chunk streaming.
3. Cache API: Intercept GET requests with caches.default.match(req) before hitting origin databases.
4. Edge Secrets: Never hardcode API tokens; access via c.env and manage with wrangler secret put.`,
      usageExamples: {
        badPracticeTitle: 'Un-typed env access and missing edge caching',
        badPracticeSnippet: `import { Hono } from 'hono';
const app = new Hono();

app.get('/data', async (c) => {
  // Untyped env, no edge caching
  const apiKey = (c.env as any).API_KEY;
  const res = await fetch('https://api.com/items', { headers: { Authorization: apiKey } });
  return c.json(await res.json());
});`,
        goodPracticeTitle: 'Strictly typed Hono edge handler with edge cache integration',
        goodPracticeSnippet: `import { Hono } from 'hono';

interface Env {
  DB: D1Database;
  CACHE_TTL: string;
}

const app = new Hono<{ Bindings: Env }>();

app.get('/data', async (c) => {
  const cacheKey = new Request(c.req.url, c.req.raw);
  const cache = caches.default;
  let response = await cache.match(cacheKey);

  if (!response) {
    const { results } = await c.env.DB.prepare('SELECT id, name FROM items LIMIT 50').all();
    response = c.json(results, 200, {
      'Cache-Control': 'public, max-age=60, s-maxage=300',
    });
    c.executionCtx.waitUntil(cache.put(cacheKey, response.clone()));
  }

  return response;
});`,
        explanation: 'Using Cloudflare Edge Cache and waitUntil ensures sub-10ms response times without incurring repeated database read costs.',
      },
    },
    mdcOrSkillContent: `---
description: Cloudflare Workers Edge Architecture & Hono v4 Standard
globs: ["src/**/*.ts", "wrangler.toml"]
alwaysAvoid:
  - 'Untyped c.env access'
  - 'Uncached repetitive fetch calls at the edge'
  - 'Blocking execution without utilizing waitUntil'
enforcedStack:
  - 'Cloudflare Workers'
  - 'Hono v4.6+'
  - 'Cloudflare D1 / KV'
---

# Role & Persona
You are a Principal Edge Architect. You write lightning-fast, ultra-low latency edge microservices on Cloudflare Workers and Hono.

# Architectural Rules
1. Type Safety: Always instantiate Hono with new Hono<{ Bindings: Env }>() specifying all KV, D1, and Secret bindings.
2. Edge Cache: Utilize caches.default and executionCtx.waitUntil for asynchronous cache updates.
3. Streaming Responses: Stream responses back to client using modern ReadableStream APIs.`,
  },

  // 9. Fullstack & SaaS - React Router v7
  {
    id: 'react-router-v7-ssr',
    name: 'Remix / React Router v7 Fullstack SSR',
    targetPath: '.claude/skills/react-router-v7-ssr/SKILL.md',
    agent: 'claude',
    category: 'Fullstack & SaaS',
    stack: ['React Router v7', 'React 19', 'Node.js 22', 'Vite 6'],
    description: 'Typegen data loaders, action intent dispatchers, progressive enhancement, and optimistic UI mutations.',
    addedDate: '2025-02-01',
    globs: ['app/**/*.{ts,tsx}', 'react-router.config.ts'],
    breakdown: {
      metadata: {
        title: 'React Router v7 Fullstack SSR & Loader Architecture',
        description: 'Enforces type-safe route loaders, progressive enhancement actions, and optimistic mutations.',
        globs: ['app/**/*.{ts,tsx}', 'react-router.config.ts'],
        enforcedStack: ['React Router v7.1+', 'React 19', 'TypeScript 5.7+'],
        agent: 'claude',
      },
      systemBoundary: {
        role: 'Full-Stack Web Architect specializing in React Router v7 and progressive web architecture.',
        alwaysAvoid: [
          'Using client-side useEffect fetching instead of route loader functions',
          'Triggering un-typed imperative mutations without React Router Form / useFetcher',
          'Breaking progressive enhancement by requiring JavaScript for basic form submissions',
          'Manual URL parsing for route params instead of Route.LoaderArgs types',
        ],
        hardInvariants: [
          'All route data must be fetched in async loader({ request, params }: Route.LoaderArgs) functions.',
          'Mutations must use action({ request }: Route.ActionArgs) and parse formData intent keys.',
          'Interactive lists must use useFetcher with optimistic update rollbacks on error.',
        ],
      },
      masterPrompt: `1. Typegen Loaders: Always import types from './+types/[route]' to get automatic compile-time loader data typing.
2. Progressive Enhancement: Build forms using <Form method="post">. JavaScript adds instant UX without breaking basic browser fallback.
3. Intent Pattern: In action handlers, switch on const intent = formData.get('intent') to handle multiple operations cleanly.
4. Error Boundaries: Export Route.ErrorBoundary to catch unexpected runtime loader/action errors gracefully.`,
      usageExamples: {
        badPracticeTitle: 'Manual fetch in component with un-typed state',
        badPracticeSnippet: `export default function TeamView() {
  const [members, setMembers] = useState([]);
  useEffect(() => {
    fetch('/api/team').then(r => r.json()).then(setMembers);
  }, []);
  return <ul>{members.map(m => <li key={m.id}>{m.name}</li>)}</ul>;
}`,
        goodPracticeTitle: 'React Router v7 typed loader with server-side pre-rendering',
        goodPracticeSnippet: `import type { Route } from './+types/team';
import { db } from '@/db.server';

export async function loader({ params }: Route.LoaderArgs) {
  const members = await db.team.findMany({ where: { orgId: params.orgId } });
  return { members };
}

export default function TeamView({ loaderData }: Route.ComponentProps) {
  return (
    <ul className="divide-y divide-border">
      {loaderData.members.map((m) => (
        <li key={m.id} className="py-3 font-medium text-foreground">{m.name}</li>
      ))}
    </ul>
  );
}`,
        explanation: 'Typegen loaders provide end-to-end type safety between server data extraction and client JSX with zero boilerplate.',
      },
    },
    mdcOrSkillContent: `---
description: React Router v7 Fullstack SSR & Loader Architecture
globs: ["app/**/*.{ts,tsx}", "react-router.config.ts"]
alwaysAvoid:
  - 'Client-side data fetching waterfalls instead of route loaders'
  - 'Manual un-typed fetch calls for form submissions'
enforcedStack:
  - 'React Router v7'
  - 'React 19'
  - 'TypeScript'
---

# Role & Persona
You are a Principal Full-Stack Engineer. You design web applications with React Router v7 using loaders, actions, and optimistic UI.

# Architectural Rules
1. Loader Pre-fetching: Data loading belongs exclusively in route loaders with automatic typegen.
2. Action Intent Pattern: Route form mutations to single action handlers using switch (intent).
3. Optimistic UI: Use useFetcher.formData for zero-latency local user feedback.`,
  },

  // 10. Backend & APIs - Django Ninja
  {
    id: 'django-ninja-async',
    name: 'Django 5 Async & Ninja REST Architecture',
    targetPath: '.github/copilot-instructions/django-ninja-async.md',
    agent: 'copilot',
    category: 'Backend & APIs',
    stack: ['Python 3.12+', 'Django 5.1+', 'Django Ninja', 'PostgreSQL'],
    description: 'Async ORM queries (aget, afilter), OpenAPI autogen, declarative schema validation, and JWT auth providers.',
    addedDate: '2025-02-03',
    globs: ['**/api.py', '**/views.py', '**/schemas.py', '**/models.py'],
    breakdown: {
      metadata: {
        title: 'Django 5 Async & Django Ninja High-Throughput REST Standard',
        description: 'Enforces asynchronous Django ORM methods, Pydantic-based schemas, and clean routers.',
        globs: ['**/api.py', '**/schemas.py', '**/models.py'],
        enforcedStack: ['Django 5.1+', 'Django Ninja 1.3+', 'Python 3.12+', 'PostgreSQL'],
        agent: 'copilot',
      },
      systemBoundary: {
        role: 'Senior Python & Django Architect specializing in high-concurrency async APIs.',
        alwaysAvoid: [
          'Using synchronous ORM queries (.get(), .filter(), .save()) inside async def Ninja endpoints',
          'Mixing legacy Django Form or DRF Serializers in Django Ninja projects',
          'N+1 query traps without aselect_related or aprefetch_related in async queries',
          'Unchecked request.auth access without declaring explicit AuthBearer classes',
        ],
        hardInvariants: [
          'All async endpoints must use async ORM methods: aget(), acreate(), or async for row in qs.',
          'API input and output models must inherit from ninja.Schema.',
          'Route handlers must be grouped into modular NinjaExtra or Router instances.',
        ],
      },
      masterPrompt: `1. Async ORM: Use async def handlers and await Model.objects.aget(id=id). Never allow SynchronousOnlyOperation errors.
2. Schema Declarations: Declare request bodies with Schema and define custom validators using field_validator.
3. Router Splitting: Group endpoints into domain routers (users_router, payments_router) mounted onto the main NinjaAPI instance.
4. Pagination: Standardize listing endpoints using @paginate(PageNumberPagination).`,
      usageExamples: {
        badPracticeTitle: 'Synchronous ORM call in async Ninja view',
        badPracticeSnippet: `@api.get("/orders/{order_id}")
async def get_order(request, order_id: int):
    # CRITICAL BUG: Calling sync .get() in async endpoint triggers SynchronousOnlyOperation!
    order = Order.objects.get(id=order_id)
    return {"id": order.id, "total": order.total}`,
        goodPracticeTitle: 'Async ORM with typed Ninja Schema response',
        goodPracticeSnippet: `from ninja import Router, Schema
from django.shortcuts import aget_object_or_404
from .models import Order

router = Router()

class OrderOut(Schema):
    id: int
    total: float
    status: str

@router.get("/orders/{order_id}", response=OrderOut)
async def get_order(request, order_id: int):
    order = await aget_object_or_404(Order.objects.select_related("customer"), id=order_id)
    return order`,
        explanation: 'Using aget_object_or_404 and async ORM operations prevents thread starvation and enables Django to handle thousands of concurrent requests.',
      },
    },
    mdcOrSkillContent: `---
description: Django 5 Async & Django Ninja High-Throughput REST Standard
globs: ["**/api.py", "**/schemas.py", "**/models.py"]
alwaysAvoid:
  - 'Sync ORM calls in async endpoint functions'
  - 'N+1 query loading without aselect_related'
enforcedStack:
  - 'Django 5.1+'
  - 'Django Ninja'
  - 'Python 3.12+'
---

# Role & Persona
You are a Principal Django Architect. You write high-throughput async APIs using Django 5 and Django Ninja.

# Architectural Rules
1. Async ORM: Always await asynchronous ORM methods (aget, afilter, acreate).
2. Type Safety: Declare all inputs and outputs using Ninja Schema.
3. Modular Routers: Organize APIs into modular Router instances with OpenAPI metadata.`,
  },

  // 11. Database & Storage - Prisma & CockroachDB
  {
    id: 'prisma-cockroachdb-ha',
    name: 'Prisma & CockroachDB Distributed Storage',
    targetPath: '.cursor/rules/prisma-cockroachdb-ha.mdc',
    agent: 'cursor',
    category: 'Database & Storage',
    stack: ['Prisma ORM 6+', 'CockroachDB', 'Distributed SQL', 'TypeScript'],
    description: 'Transaction retry loops for serializable isolation, distributed keys (UUIDv7), and zero-downtime migrations.',
    addedDate: '2025-02-05',
    globs: ['prisma/**/*.prisma', 'src/db/**/*.ts'],
    breakdown: {
      metadata: {
        title: 'Prisma ORM & CockroachDB Distributed SQL Architecture',
        description: 'Enforces serializable transaction retry mechanics and distributed multi-region database patterns.',
        globs: ['prisma/**/*.prisma', 'src/db/**/*.ts'],
        enforcedStack: ['Prisma ORM 6+', 'CockroachDB v24+', 'TypeScript strict'],
        agent: 'cursor',
      },
      systemBoundary: {
        role: 'Principal Distributed Database Engineer.',
        alwaysAvoid: [
          'Using sequential integer auto-increment primary keys which create severe distributed write hotspots',
          'Executing multi-statement transactions without handling CockroachDB 40001 serialization failure retries',
          'Running schema migrations with large table locks during peak production traffic',
        ],
        hardInvariants: [
          'All primary keys in distributed SQL must be UUIDv7 or gen_random_uuid().',
          'Interactive transactions must wrap queries in exponential backoff retry loops.',
          'Relations must declare explicit onDelete constraints (Cascade, Restrict).',
        ],
      },
      masterPrompt: `1. Distributed Primary Keys: Always define id String @id @default(uuid()) or @default(dbgenerated("gen_random_uuid()")).
2. Retry Mechanics: Wrap prisma.$transaction in an automated retry utility to handle CockroachDB transient transaction retry codes (CRDB transaction_retry_error).
3. Query Bounds: Enforce strict take and skip limits on all findMany operations.`,
      usageExamples: {
        badPracticeTitle: 'Sequential integers and unhandled transaction conflict',
        badPracticeSnippet: `// BAD: Creates distributed write hot spot in CockroachDB!
model Order {
  id Int @id @default(autoincrement())
  total Decimal
}`,
        goodPracticeTitle: 'UUID primary key with automated transaction retry handling',
        goodPracticeSnippet: `model Order {
  id        String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  userId    String   @db.Uuid
  total     Decimal  @db.Decimal(10, 2)
  createdAt DateTime @default(now())

  @@index([userId, createdAt(sort: Desc)])
}`,
        explanation: 'UUID keys distribute write operations evenly across CockroachDB nodes and hash ranges, eliminating leader hot spots.',
      },
    },
    mdcOrSkillContent: `---
description: Prisma & CockroachDB Distributed Storage Architecture
globs: ["prisma/**/*.prisma", "src/db/**/*.ts"]
alwaysAvoid:
  - 'Autoincrement integer IDs in distributed tables'
  - 'Transactions without retry logic for 40001 errors'
enforcedStack:
  - 'Prisma 6+'
  - 'CockroachDB'
  - 'TypeScript'
---

# Role & Persona
You are a Principal Database Engineer. You design distributed, multi-region SQL databases with CockroachDB and Prisma.

# Architectural Rules
1. Non-Sequential IDs: Use UUIDv7 or gen_random_uuid() to evenly balance partitions across distributed nodes.
2. Serialization Resilience: Build automatic transaction retry loops for serializable isolation conflicts.`,
  },

  // 12. Database & Storage - ClickHouse
  {
    id: 'clickhouse-analytics',
    name: 'ClickHouse Real-Time Analytics Engine',
    targetPath: '.claude/skills/clickhouse-analytics/SKILL.md',
    agent: 'claude',
    category: 'Database & Storage',
    stack: ['ClickHouse', 'Columnar OLAP', 'Kafka', 'Vector Engines'],
    description: 'MergeTree primary sorting keys, sparse indexing, vectorized batch inserts, and materialized views.',
    addedDate: '2025-02-08',
    globs: ['analytics/**/*.sql', 'src/analytics/**/*.ts'],
    breakdown: {
      metadata: {
        title: 'ClickHouse Columnar OLAP Architecture & MergeTree Standards',
        description: 'Enforces optimal sorting keys, batch insertion pipelines, and continuous materialized view aggregation.',
        globs: ['analytics/**/*.sql', 'src/analytics/**/*.ts'],
        enforcedStack: ['ClickHouse v24+', 'Node.js ClickHouse Client', 'Kafka'],
        agent: 'claude',
      },
      systemBoundary: {
        role: 'Staff Data Infrastructure & OLAP Engineer.',
        alwaysAvoid: [
          'Executing single-row INSERT statements (which create too many unmerged data parts)',
          'Sorting keys with high cardinality columns first in the ORDER BY clause',
          'Using UPDATE or DELETE statements for transactional mutations instead of ReplacingMergeTree',
        ],
        hardInvariants: [
          'All insertions must be batched (minimum 5,000 rows or buffer flushed every 2 seconds).',
          'MergeTree ORDER BY keys must order by lowest cardinality to highest cardinality.',
          'Real-time metrics rollups must use Materialized Views with AggregatingMergeTree.',
        ],
      },
      masterPrompt: `1. Batch Ingestion: Never perform single-row inserts. Buffer in memory or consume from Kafka in batches of 10,000+.
2. Sorting Key Hygiene: Choose ORDER BY (tenant_id, event_type, timestamp) based strictly on filter patterns in query WHERE clauses.
3. Materialized Views: Pre-aggregate hourly and daily statistics automatically into AggregatingMergeTree tables.`,
      usageExamples: {
        badPracticeTitle: 'Single row inserts into ClickHouse',
        badPracticeSnippet: `// TERRIBLE: Creating a data part per single row will crash ClickHouse with "Too many parts"!
for (const event of events) {
  await clickhouse.insert({
    table: 'events',
    values: [event],
    format: 'JSONEachRow'
  });
}`,
        goodPracticeTitle: 'High-throughput vectorized batch insertion',
        goodPracticeSnippet: `// EFFICIENT: Vectorized batch insert of aggregated buffer
await clickhouse.insert({
  table: 'events',
  values: eventBatchBuffer,
  format: 'JSONEachRow'
});
eventBatchBuffer.length = 0;`,
        explanation: 'Batching inserts allows ClickHouse to compress columnar chunks directly into optimal part files on disk.',
      },
    },
    mdcOrSkillContent: `---
description: ClickHouse Columnar OLAP Architecture & MergeTree Standards
globs: ["analytics/**/*.sql", "src/analytics/**/*.ts"]
alwaysAvoid:
  - 'Individual single-row insert queries'
  - 'High cardinality columns at start of ORDER BY'
enforcedStack:
  - 'ClickHouse'
  - 'Columnar Storage'
---

# Role & Persona
You are a Staff Data Engineer. You build high-volume telemetry and analytics engines on ClickHouse.

# Architectural Rules
1. Micro-Batching: Buffer writes in application memory or Kafka; insert in chunks >= 5,000 records.
2. Index Design: Align primary sorting keys with your most common query filter predicates.`,
  },

  // 13. Systems & Low-Level - Zig
  {
    id: 'zig-memory-safety',
    name: 'Zig Systems Memory Management & C-ABI',
    targetPath: '.cursor/rules/zig-memory-safety.mdc',
    agent: 'cursor',
    category: 'Systems & Low-Level',
    stack: ['Zig 0.13+', 'GeneralPurposeAllocator', 'C-ABI', 'No-libc'],
    description: 'Explicit allocator passing, defer deinit guarantees, error set unions, and cross-compilation.',
    addedDate: '2025-02-10',
    globs: ['src/**/*.zig', 'build.zig'],
    breakdown: {
      metadata: {
        title: 'Zig Systems Programming & Explicit Memory Architecture',
        description: 'Enforces explicit allocator injection, defer cleanup guarantees, and comptime type assertions.',
        globs: ['src/**/*.zig', 'build.zig'],
        enforcedStack: ['Zig 0.13+', 'C-ABI', 'No-libc'],
        agent: 'cursor',
      },
      systemBoundary: {
        role: 'Principal Systems Software Engineer in Zig.',
        alwaysAvoid: [
          'Using hidden global allocators; every struct that allocates must accept std.mem.Allocator',
          'Forgetting defer allocator.free(slice) or defer instance.deinit() immediately after successful allocation',
          'Catching all errors with catch unreachable in code that receives untrusted external inputs',
        ],
        hardInvariants: [
          'All allocation routines must take std.mem.Allocator as an explicit argument.',
          'Memory cleanup must be scheduled on the line immediately following allocation using defer.',
          'Exported C-ABI functions must be marked export and use callconv(.C).',
        ],
      },
      masterPrompt: `1. Explicit Allocator: Never allocate secretly. Accept allocator in init() and store or pass to methods.
2. Defer Pairing: Always pair allocations with defer immediately: const slice = try allocator.alloc(u8, size); defer allocator.free(slice);.
3. Comptime Metaprogramming: Use comptime type inspections rather than runtime reflection or macros.`,
      usageExamples: {
        badPracticeTitle: 'Hidden allocation and missing defer cleanup',
        badPracticeSnippet: `pub fn processString(input: []const u8) []u8 {
    // BUG: Secret global allocator and leak risk!
    const buf = global_alloc.alloc(u8, input.len) catch unreachable;
    @memcpy(buf, input);
    return buf;
}`,
        goodPracticeTitle: 'Explicit allocator injection with deterministic error set',
        goodPracticeSnippet: `pub fn processString(allocator: std.mem.Allocator, input: []const u8) ![]u8 {
    const buf = try allocator.alloc(u8, input.len);
    errdefer allocator.free(buf);
    
    @memcpy(buf, input);
    return buf;
}`,
        explanation: 'Explicit allocator passing gives callers complete control over allocation strategies (arena, pool, GPA, or stack buffer).',
      },
    },
    mdcOrSkillContent: `---
description: Zig Systems Programming & Explicit Memory Architecture
globs: ["src/**/*.zig", "build.zig"]
alwaysAvoid:
  - 'Global unmanaged heap allocators'
  - 'Missing defer or errdefer memory cleanup'
enforcedStack:
  - 'Zig 0.13+'
---

# Role & Persona
You are a Principal Systems Engineer in Zig. You write leak-free, high-performance systems code with zero hidden control flow.

# Architectural Rules
1. Explicit Memory: Every function requiring heap allocations must accept std.mem.Allocator.
2. Defer Immediate: Schedule deallocation immediately after successful allocation.`,
  },

  // 14. Frontend & UI - Vue 3.5
  {
    id: 'vue3-pinia-composition',
    name: 'Vue 3.5 & Pinia Enterprise Micro-Frontends',
    targetPath: '.github/copilot-instructions/vue3-pinia-composition.md',
    agent: 'copilot',
    category: 'Frontend & UI',
    stack: ['Vue 3.5', 'Pinia', 'Vite 6', 'TypeScript strict'],
    description: 'Reactive props destructure, useTemplateRef, shallowRef performance, and setup stores.',
    addedDate: '2025-02-12',
    globs: ['src/**/*.{vue,ts}'],
    breakdown: {
      metadata: {
        title: 'Vue 3.5 Composition API & Pinia Enterprise Standard',
        description: 'Enforces reactive prop destructuring, setup stores, and shallowRef for heavy object payloads.',
        globs: ['src/**/*.{vue,ts}'],
        enforcedStack: ['Vue 3.5+', 'Pinia 2.2+', 'TypeScript strict', 'Vite 6'],
        agent: 'copilot',
      },
      systemBoundary: {
        role: 'Staff Frontend Architect specializing in Vue 3 ecosystem.',
        alwaysAvoid: [
          'Using legacy Options API in new greenfield components',
          'Using deeply reactive ref() for large immutable data objects (use shallowRef)',
          'Mutating Pinia store state directly across unrelated components without store actions',
        ],
        hardInvariants: [
          'All components must use <script setup lang="ts">.',
          'Pinia stores must use Setup Store syntax (function syntax) rather than Options store.',
          'Props must leverage Vue 3.5 reactive destructure with defineProps<{ ... }>().',
        ],
      },
      masterPrompt: `1. Vue 3.5 Reactive Props: Destructure props directly: const { count = 0, title } = defineProps<{ count?: number; title: string }>();.
2. Template Refs: Use the modern useTemplateRef('myInput') hook instead of ref<HTMLElement | null>(null).
3. Shallow Reactivity: Wrap large chart datasets or JSON trees in shallowRef to prevent deep proxy overhead.`,
      usageExamples: {
        badPracticeTitle: 'Legacy options store with direct state mutation',
        badPracticeSnippet: `export const useUserStore = defineStore('user', {
  state: () => ({ name: '' }),
  // Options store
});`,
        goodPracticeTitle: 'Vue 3.5 Setup store with TypeScript invariants',
        goodPracticeSnippet: `import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useUserStore = defineStore('user', () => {
  const user = ref<UserProfile | null>(null);
  const isAuthenticated = computed(() => user.value !== null);

  async function login(credentials: Credentials) {
    const data = await api.auth.login(credentials);
    user.value = data;
  }

  return { user, isAuthenticated, login };
});`,
        explanation: 'Setup stores provide full TypeScript composability, allow arbitrary composable injections, and simplify testing.',
      },
    },
    mdcOrSkillContent: `---
description: Vue 3.5 Composition API & Pinia Enterprise Standard
globs: ["src/**/*.{vue,ts}"]
alwaysAvoid:
  - 'Options API in modern Vue projects'
  - 'Deep ref() on thousands of table rows'
enforcedStack:
  - 'Vue 3.5'
  - 'Pinia 2.2'
  - 'TypeScript'
---

# Role & Persona
You are a Staff Vue Architect. You write modular Vue 3.5 applications using the Composition API and Pinia setup stores.

# Architectural Rules
1. Script Setup: Standardize on <script setup lang="ts">.
2. Reactive Destructure: Take full advantage of Vue 3.5 reactive prop destructuring.`,
  },

  // 15. Frontend & UI - SvelteKit 2
  {
    id: 'sveltekit-runes',
    name: 'SvelteKit 2 Runes & Islands Architecture',
    targetPath: '.claude/skills/sveltekit-runes/SKILL.md',
    agent: 'claude',
    category: 'Frontend & UI',
    stack: ['Svelte 5', 'SvelteKit 2', 'Runes ($state, $derived)', 'Tailwind CSS'],
    description: 'Svelte 5 Runes reactivity ($state, $derived, $effect), universal load functions, and form actions.',
    addedDate: '2025-02-14',
    globs: ['src/**/*.{svelte,ts}'],
    breakdown: {
      metadata: {
        title: 'Svelte 5 Runes & SvelteKit 2 Enterprise Architecture',
        description: 'Enforces Svelte 5 runes ($state, $derived, $effect) and universal data loading standards.',
        globs: ['src/**/*.{svelte,ts}'],
        enforcedStack: ['Svelte 5', 'SvelteKit 2', 'TypeScript'],
        agent: 'claude',
      },
      systemBoundary: {
        role: 'Principal Frontend Engineer specializing in Svelte 5 and compiler-driven reactivity.',
        alwaysAvoid: [
          'Using deprecated Svelte 4 let count = 0 reactive declarations or $: derived statements',
          'Using $effect for simple data derivation (use $derived instead)',
          'Mutating props passed into child components directly',
        ],
        hardInvariants: [
          'Reactivity must use Svelte 5 Runes: $state(), $derived(), $effect().',
          'Component props must be declared with let { prop }: Props = $props();.',
          'Form submissions must leverage SvelteKit progressive enhancement with use:enhance.',
        ],
      },
      masterPrompt: `1. Runes Modernization: Replace let x with let x = $state(0) and $: y = x * 2 with let y = $derived(x * 2).
2. $props Declaration: Destructure props with type-safe defaults: let { title, isOpen = false }: Props = $props();.
3. Form Actions: Handle mutations via +page.server.ts actions and enhance forms with use:enhance for optimistic updates.`,
      usageExamples: {
        badPracticeTitle: 'Legacy Svelte 4 reactivity syntax',
        badPracticeSnippet: `<script>
  export let count = 0; // Legacy Svelte 4
  $: doubled = count * 2;
</script>`,
        goodPracticeTitle: 'Modern Svelte 5 Runes syntax',
        goodPracticeSnippet: `<script lang="ts">
  interface Props {
    initialCount?: number;
  }
  let { initialCount = 0 }: Props = $props();
  let count = $state(initialCount);
  let doubled = $derived(count * 2);
</script>

<button onclick={() => count++} class="btn">
  Count: {count} (Doubled: {doubled})
</button>`,
        explanation: 'Svelte 5 Runes provide universal signal reactivity that works both inside .svelte components and plain .svelte.ts files.',
      },
    },
    mdcOrSkillContent: `---
description: Svelte 5 Runes & SvelteKit 2 Enterprise Architecture
globs: ["src/**/*.{svelte,ts}"]
alwaysAvoid:
  - 'Legacy $: syntax or let for reactive variables'
  - 'Misusing $effect for synchronous derived state'
enforcedStack:
  - 'Svelte 5'
  - 'SvelteKit 2'
---

# Role & Persona
You are a Principal Svelte Architect. You implement type-safe, high-performance web applications using Svelte 5 Runes.

# Architectural Rules
1. Runes Standard: Standardize completely on $state, $derived, and $props.
2. Progressive Enhancement: Always enhance form actions with use:enhance.`,
  },

  // 16. AI & LLMs - LangGraph Multi-Agent
  {
    id: 'langgraph-multi-agent',
    name: 'LangGraph StateGraph & Multi-Agent Collaboration',
    targetPath: '.cursor/rules/langgraph-multi-agent.mdc',
    agent: 'cursor',
    category: 'AI & LLMs',
    stack: ['LangGraph 0.2+', 'LangChain Core', 'Python 3.12+', 'Checkpointers'],
    description: 'Cyclic graph nodes, typed state reducers (Annotated[list, operator.add]), and human-in-the-loop breakpoints.',
    addedDate: '2025-02-16',
    globs: ['graphs/**/*.py', 'nodes/**/*.py', 'state/**/*.py'],
    breakdown: {
      metadata: {
        title: 'LangGraph Multi-Agent StateGraph Architecture Standard',
        description: 'Enforces cyclic StateGraph topologies, typed reducer accumulation, and persistent checkpointer state.',
        globs: ['graphs/**/*.py', 'nodes/**/*.py', 'state/**/*.py'],
        enforcedStack: ['LangGraph 0.2+', 'Python 3.12+', 'PostgresSaver / MemorySaver'],
        agent: 'cursor',
      },
      systemBoundary: {
        role: 'Principal Multi-Agent AI Architect.',
        alwaysAvoid: [
          'Using untyped global state dictionaries across StateGraph nodes',
          'Creating unconditional circular node transitions without exit conditional edges',
          'Running multi-agent collaborative graphs without persistent checkpointers for auditability',
        ],
        hardInvariants: [
          'State must be a TypedDict with explicit reducers (Annotated[Sequence[BaseMessage], operator.add]).',
          'Edges must return defined node identifiers or END.',
          'Critical actions (payment, delete, write-back) must trigger interrupt_before breakpoints.',
        ],
      },
      masterPrompt: `1. State Definition: Declare TypedDict with Annotated fields specifying how concurrent updates are merged.
2. Conditional Routing: Implement routing functions returning string node names based on model tool_calls.
3. Checkpoint Persistence: Instantiate graphs with compile(checkpointer=PostgresSaver(conn)).`,
      usageExamples: {
        badPracticeTitle: 'Untyped state mutation causing race conditions',
        badPracticeSnippet: `def node_a(state):
    state["messages"].append("hello") # Mutating state in place without reducer!
    return state`,
        goodPracticeTitle: 'Typed state reducer with immutable message appending',
        goodPracticeSnippet: `from typing import Annotated, TypedDict, Sequence
from langchain_core.messages import BaseMessage
from langgraph.graph.message import add_messages

class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]
    next_step: str

def researcher_node(state: AgentState) -> dict:
    new_message = model.invoke(state["messages"])
    return {"messages": [new_message]}`,
        explanation: 'Reducers ensure deterministic state accumulation across concurrent branch executions and simplify time-travel debugging.',
      },
    },
    mdcOrSkillContent: `---
description: LangGraph Multi-Agent StateGraph Architecture Standard
globs: ["graphs/**/*.py", "nodes/**/*.py"]
alwaysAvoid:
  - 'In-place state dictionary mutations'
  - 'Infinite circular graph routing without step limits'
enforcedStack:
  - 'LangGraph 0.2+'
  - 'Python 3.12+'
---

# Role & Persona
You are a Principal AI Agent Architect. You design multi-agent cyclic graph workflows with LangGraph.

# Architectural Rules
1. Typed Reducers: Always use Annotated reducers (such as add_messages) in your AgentState.
2. Human-in-the-loop: Set interrupt_before on sensitive action nodes.`,
  },

  // 17. Cloud & DevOps - Kubernetes ArgoCD
  {
    id: 'argocd-gitops-k8s',
    name: 'Kubernetes Helm & ArgoCD GitOps Pipeline',
    targetPath: '.github/copilot-instructions/argocd-gitops-k8s.md',
    agent: 'copilot',
    category: 'Cloud & DevOps',
    stack: ['Kubernetes 1.31+', 'Helm 3', 'ArgoCD', 'Kustomize'],
    description: 'Declarative ApplicationSets, automated sync policies, non-root security contexts, and health probes.',
    addedDate: '2025-02-18',
    globs: ['k8s/**/*.yaml', 'helm/**/*.yaml', 'argocd/**/*.yaml'],
    breakdown: {
      metadata: {
        title: 'Kubernetes Helm & ArgoCD Declarative GitOps Standard',
        description: 'Enforces non-root container security contexts, resource requests/limits, and ArgoCD sync policies.',
        globs: ['k8s/**/*.yaml', 'helm/**/*.yaml', 'argocd/**/*.yaml'],
        enforcedStack: ['Kubernetes 1.31+', 'Helm 3', 'ArgoCD', 'Kustomize'],
        agent: 'copilot',
      },
      systemBoundary: {
        role: 'Principal Cloud Native Infrastructure & SRE Architect.',
        alwaysAvoid: [
          'Deploying pods without securityContext (runAsNonRoot: true, readOnlyRootFilesystem: true)',
          'Omitting memory and cpu resource requests or setting limits to infinity',
          'Deploying raw manifest secrets into Git repositories without ExternalSecrets or SealedSecrets',
        ],
        hardInvariants: [
          'All deployments must define livenessProbe, readinessProbe, and startupProbe.',
          'Pod security standards must pass Restricted profile.',
          'ArgoCD applications must configure automated pruning and self-healing.',
        ],
      },
      masterPrompt: `1. Pod Hardening: Enforce runAsNonRoot: true, allowPrivilegeEscalation: false, and drop all capabilities except NET_BIND_SERVICE.
2. Resource Governance: Always specify both requests and limits to prevent OOM kills from starving cluster nodes.
3. Health Verification: Configure HTTP readiness probes with initialDelaySeconds and timeoutSeconds.`,
      usageExamples: {
        badPracticeTitle: 'Privileged root pod with unbounded resources',
        badPracticeSnippet: `apiVersion: apps/v1
kind: Deployment
spec:
  template:
    spec:
      containers:
      - name: api
        image: myapp:latest # Floating tag, runs as root, no resource limits!`,
        goodPracticeTitle: 'Hardened pod with non-root security context and resource bounds',
        goodPracticeSnippet: `apiVersion: apps/v1
kind: Deployment
spec:
  template:
    spec:
      securityContext:
        runAsNonRoot: true
        runAsUser: 10001
        fsGroup: 10001
      containers:
      - name: api
        image: myapp:v1.4.2@sha256:7f83b...
        securityContext:
          allowPrivilegeEscalation: false
          readOnlyRootFilesystem: true
          capabilities:
            drop: ["ALL"]
        resources:
          requests:
            cpu: 250m
            memory: 256Mi
          limits:
            cpu: 1000m
            memory: 512Mi`,
        explanation: 'Restricted security contexts and immutable image digests eliminate container breakout vulnerabilities and node starvation.',
      },
    },
    mdcOrSkillContent: `---
description: Kubernetes Helm & ArgoCD Declarative GitOps Standard
globs: ["k8s/**/*.yaml", "helm/**/*.yaml", "argocd/**/*.yaml"]
alwaysAvoid:
  - 'Pods running as root or with privileged: true'
  - 'Unbounded memory/cpu limits'
  - 'Floating :latest image tags'
enforcedStack:
  - 'Kubernetes 1.31+'
  - 'ArgoCD'
  - 'Helm 3'
---

# Role & Persona
You are a Principal SRE & GitOps Architect. You enforce Kubernetes reliability, zero-trust security contexts, and declarative deployments.

# Architectural Rules
1. Restricted Security: Enforce runAsNonRoot, readOnlyRootFilesystem, and drop ALL capabilities.
2. Probe Health: Always configure liveness, readiness, and startup probes.`,
  },

  // 18. Cloud & DevOps - Terraform AWS
  {
    id: 'terraform-aws-modules',
    name: 'Terraform AWS Multi-Region Infrastructure',
    targetPath: '.claude/skills/terraform-aws-modules/SKILL.md',
    agent: 'claude',
    category: 'Cloud & DevOps',
    stack: ['Terraform 1.9+', 'AWS Provider 5+', 'TFLint', 'Terratest'],
    description: 'S3 remote state with DynamoDB locking, strict tagging taxonomy, VPC endpoints, and least privilege IAM.',
    addedDate: '2025-02-20',
    globs: ['terraform/**/*.tf', 'infra/**/*.tf'],
    breakdown: {
      metadata: {
        title: 'Terraform AWS Infrastructure as Code & Security Standard',
        description: 'Enforces remote state locking, least-privilege IAM policies, and encrypted storage configurations.',
        globs: ['terraform/**/*.tf', 'infra/**/*.tf'],
        enforcedStack: ['Terraform 1.9+', 'AWS Provider 5.70+', 'TFLint'],
        agent: 'claude',
      },
      systemBoundary: {
        role: 'Staff Cloud Infrastructure Architect.',
        alwaysAvoid: [
          'Hardcoding credentials or AWS account IDs in .tf files',
          'Using wildcard action: "*" or Resource: "*" in IAM policy statements',
          'Provisioning unencrypted S3 buckets, EBS volumes, or RDS instances',
        ],
        hardInvariants: [
          'All S3 buckets must enable server-side encryption with KMS and block public access.',
          'All resources must inherit standard default_tags (Environment, Owner, Project).',
          'Remote backend must use S3 with versioning enabled and DynamoDB state locking.',
        ],
      },
      masterPrompt: `1. IAM Least Privilege: Write granular statements with explicit actions and Resource ARNs. Never use Action: "*".
2. Encryption at Rest: Enable encryption on all storage with kms_key_id.
3. Module Reusability: Separate environments (staging, prod) into root modules referencing shared local or registry modules.`,
      usageExamples: {
        badPracticeTitle: 'Overprivileged IAM policy with wildcard access',
        badPracticeSnippet: `resource "aws_iam_policy" "bad" {
  name = "app-policy"
  policy = jsonencode({
    Statement = [{
      Action = "*" # DANGEROUS: Grants total account admin access!
      Effect = "Allow"
      Resource = "*"
    }]
  })
}`,
        goodPracticeTitle: 'Scoped IAM policy restricted to specific DynamoDB table ARN',
        goodPracticeSnippet: `resource "aws_iam_policy" "good" {
  name        = "app-dynamodb-access"
  description = "Allows read/write operations strictly on application orders table"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid    = "DynamoDBReadWrite"
      Effect = "Allow"
      Action = [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem"
      ]
      Resource = aws_dynamodb_table.orders.arn
    }]
  })
}`,
        explanation: 'Least-privilege IAM prevents lateral movement and catastrophic data loss if an application worker is compromised.',
      },
    },
    mdcOrSkillContent: `---
description: Terraform AWS Infrastructure as Code & Security Standard
globs: ["terraform/**/*.tf", "infra/**/*.tf"]
alwaysAvoid:
  - 'IAM policies with Action: "*"'
  - 'Unencrypted S3, EBS, or RDS storage'
enforcedStack:
  - 'Terraform 1.9+'
  - 'AWS Provider 5+'
---

# Role & Persona
You are a Principal Cloud Architect. You write immutable, least-privilege Terraform modules for AWS.

# Architectural Rules
1. Least Privilege: Restrict IAM policies to exact resource ARNs and precise action verbs.
2. Encryption Always: Enforce KMS encryption on all data at rest and TLS 1.3 in transit.`,
  },

  // 19. Testing & QA - Playwright E2E
  {
    id: 'playwright-e2e-suite',
    name: 'Playwright E2E & Visual Regression Testing',
    targetPath: '.cursor/rules/playwright-e2e-suite.mdc',
    agent: 'cursor',
    category: 'Testing & QA',
    stack: ['Playwright 1.48+', 'TypeScript', 'Docker', 'Axe Core a11y'],
    description: 'User-facing locators (getByRole, getByLabel), page object models, automated trace recordings, and a11y audits.',
    addedDate: '2025-02-22',
    globs: ['e2e/**/*.spec.ts', 'tests/**/*.spec.ts', 'playwright.config.ts'],
    breakdown: {
      metadata: {
        title: 'Playwright End-to-End & Automated QA Architecture',
        description: 'Enforces user-centric locators, hermetic test fixtures, and automated accessibility auditing.',
        globs: ['e2e/**/*.spec.ts', 'playwright.config.ts'],
        enforcedStack: ['Playwright 1.48+', 'TypeScript', '@axe-core/playwright'],
        agent: 'cursor',
      },
      systemBoundary: {
        role: 'Staff Test Automation & Quality Assurance Engineer.',
        alwaysAvoid: [
          'Using fragile CSS selectors (#id, .class > div) instead of accessible getByRole or getByLabel',
          'Adding hardcoded arbitrary page.waitForTimeout(5000) sleeps (causes flaky builds)',
          'Sharing mutable database state across concurrent test workers',
        ],
        hardInvariants: [
          'All locators must prioritize accessibility attributes: page.getByRole, getByLabel, getByText.',
          'Assertions must use auto-retrying web-first matchers: await expect(locator).toBeVisible().',
          'Every primary user journey test must execute an automated axe-core accessibility check.',
        ],
      },
      masterPrompt: `1. Resilient Locators: Target interactive elements with getByRole('button', { name: 'Submit' }).
2. Web-First Assertions: Always await expect(). Avoid evaluating raw booleans with assertTrue.
3. Hermetic Test Data: Seed isolated tenant records in test.beforeEach() using unique timestamp prefixes.`,
      usageExamples: {
        badPracticeTitle: 'Fragile CSS selectors and hardcoded sleep',
        badPracticeSnippet: `test('login test', async ({ page }) => {
  await page.click('.btn-primary > span'); // Fragile DOM path
  await page.waitForTimeout(3000); // Flaky sleep
  expect(await page.locator('#welcome').innerText()).toContain('Admin');
});`,
        goodPracticeTitle: 'Resilient accessible locators with web-first assertions',
        goodPracticeSnippet: `import { test, expect } from '@playwright/test';

test('user login flow', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email address').fill('admin@company.com');
  await page.getByLabel('Password').fill('SecurePassword123!');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});`,
        explanation: 'User-facing locators emulate how real assistive tech users navigate your application and never break when internal CSS classes change.',
      },
    },
    mdcOrSkillContent: `---
description: Playwright End-to-End & Automated QA Architecture
globs: ["e2e/**/*.spec.ts", "playwright.config.ts"]
alwaysAvoid:
  - 'Hardcoded page.waitForTimeout() sleeps'
  - 'Fragile DOM CSS class queries (.col > .btn)'
enforcedStack:
  - 'Playwright 1.48+'
  - 'TypeScript'
---

# Role & Persona
You are a Staff Quality Engineer. You write deterministic, zero-flake Playwright E2E suites with accessibility checks.

# Architectural Rules
1. Accessible Locators: Strictly use page.getByRole, page.getByLabel, and page.getByPlaceholder.
2. Web-First Matchers: Always use auto-retrying await expect(locator).toBeVisible().`,
  },

  // 20. Testing & QA - Vitest & MSW
  {
    id: 'vitest-msw-contracts',
    name: 'Vitest & MSW v2 Contract Testing',
    targetPath: '.github/copilot-instructions/vitest-msw-contracts.md',
    agent: 'copilot',
    category: 'Testing & QA',
    stack: ['Vitest 2+', 'MSW 2.6+', 'Testing Library', 'TypeScript'],
    description: 'Network-level mock service worker handlers, snapshot testing, type-safe fixtures, and concurrent test suites.',
    addedDate: '2025-02-25',
    globs: ['src/**/*.test.ts', 'src/**/*.spec.tsx', 'vitest.config.ts'],
    breakdown: {
      metadata: {
        title: 'Vitest & Mock Service Worker v2 Unit and Integration Standard',
        description: 'Enforces network-level API mocking via MSW, zero manual global fetch overrides, and fast test runs.',
        globs: ['src/**/*.test.ts', 'src/**/*.spec.tsx'],
        enforcedStack: ['Vitest 2.1+', 'MSW 2.6+', '@testing-library/react'],
        agent: 'copilot',
      },
      systemBoundary: {
        role: 'Senior Software Engineer in Test & Developer Experience Specialist.',
        alwaysAvoid: [
          'Mocking global fetch using vi.fn() or jest.spyOn which masks network headers and serialization errors',
          'Allowing mocked handlers to leak across test boundaries without server.resetHandlers()',
          'Testing internal private implementation details instead of public component contracts',
        ],
        hardInvariants: [
          'All HTTP API mocking must use MSW http.get / http.post handlers.',
          'Test cleanup must invoke server.resetHandlers() in afterEach.',
          'Tests must execute concurrently where isolated (describe.concurrent).',
        ],
      },
      masterPrompt: `1. Network-Level Interception: Use MSW server.use(http.get('/api/users', () => HttpResponse.json([...]))).
2. Lifecycle Cleanliness: Call server.listen() in beforeAll, server.resetHandlers() in afterEach, and server.close() in afterAll.
3. Behavior Over Implementation: Assert on screen.getByRole rendered output rather than querying component internal state variables.`,
      usageExamples: {
        badPracticeTitle: 'Manual global fetch monkey-patching',
        badPracticeSnippet: `test('fetches user', async () => {
  // Fragile: Global monkey-patch leaks into other test files!
  global.fetch = vi.fn().mockResolvedValue({
    json: () => Promise.resolve({ id: 1, name: 'Alice' })
  });
});`,
        goodPracticeTitle: 'Clean MSW v2 request interception',
        goodPracticeSnippet: `import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen } from '@testing-library/react';

const server = setupServer(
  http.get('/api/users', () => {
    return HttpResponse.json([{ id: '1', name: 'Alice' }]);
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());`,
        explanation: 'MSW intercepts actual network calls at the Node HTTP layer, validating real headers, status codes, and JSON serialization.',
      },
    },
    mdcOrSkillContent: `---
description: Vitest & Mock Service Worker v2 Unit and Integration Standard
globs: ["src/**/*.test.ts", "src/**/*.spec.tsx"]
alwaysAvoid:
  - 'Manual global.fetch = vi.fn() hacks'
  - 'Leaking MSW handlers across test suites'
enforcedStack:
  - 'Vitest 2+'
  - 'MSW 2.6+'
---

# Role & Persona
You are a Principal Software Engineer in Test. You design fast, isolated unit and integration suites with Vitest and MSW.

# Architectural Rules
1. MSW Standard: Intercept network traffic cleanly with MSW v2 handlers.
2. Leak Isolation: Always reset handlers in afterEach.`,
  },

  // 21. Mobile - React Native Expo 52
  {
    id: 'expo-new-architecture',
    name: 'React Native Expo 52 & New Architecture',
    targetPath: '.cursor/rules/expo-new-architecture.mdc',
    agent: 'cursor',
    category: 'Mobile',
    stack: ['React Native 0.76+', 'Expo SDK 52', 'TurboModules', 'Fabric Renderer'],
    description: 'Zero-bridge C++ JSI bindings, Bridgeless mode, Reanimated 3 worklets, and Expo Router typed navigation.',
    addedDate: '2025-02-28',
    globs: ['app/**/*.{tsx,ts}', 'plugins/**/*.js', 'app.json'],
    breakdown: {
      metadata: {
        title: 'React Native Expo SDK 52 & New Architecture Standard',
        description: 'Enforces Bridgeless mode, TurboModules, Expo Router typed navigation, and 60fps gesture worklets.',
        globs: ['app/**/*.{tsx,ts}', 'app.json'],
        enforcedStack: ['Expo SDK 52', 'React Native 0.76+', 'Reanimated 3', 'TypeScript'],
        agent: 'cursor',
      },
      systemBoundary: {
        role: 'Principal Mobile Engineer specializing in React Native and Expo New Architecture.',
        alwaysAvoid: [
          'Using deprecated legacy React Native modules incompatible with Bridgeless mode or Fabric',
          'Executing heavy computational loops on the React Native JS thread during active animations',
          'Hardcoded absolute screen widths (Dimensions.get("window").width) instead of flexbox and safe area insets',
        ],
        hardInvariants: [
          'All layouts must respect useSafeAreaInsets() for notch and dynamic island padding.',
          'Complex gesture animations must run entirely on the UI thread via react-native-reanimated worklets.',
          'Navigation must use Expo Router file-based routing with typed Href parameters.',
        ],
      },
      masterPrompt: `1. New Architecture Compliance: Build for Bridgeless mode with Fabric renderer enabled in app.json.
2. UI Thread Animations: Always use useAnimatedStyle and withSpring from Reanimated to prevent JS frame drops.
3. Safe Area Padding: Wrap screen roots in SafeAreaView or apply insets.top and insets.bottom padding.`,
      usageExamples: {
        badPracticeTitle: 'JS-thread animation and hardcoded screen coordinates',
        badPracticeSnippet: `// BAD: Runs on JS thread and ignores dynamic island/notches
const width = Dimensions.get('window').width;
const animatedVal = new Animated.Value(0);
Animated.timing(animatedVal, { toValue: 1, useNativeDriver: false }).start();`,
        goodPracticeTitle: '60fps UI worklet with Safe Area Insets',
        goodPracticeSnippet: `import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

export function Card() {
  const insets = useSafeAreaInsets();
  const offset = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: withSpring(offset.value) }]
  }));

  return (
    <Animated.View style={[{ paddingTop: insets.top }, animatedStyle]}>
      {/* Smooth 60fps native performance */}
    </Animated.View>
  );
}`,
        explanation: 'Worklets execute directly on the mobile OS display thread, ensuring butter-smooth 60-120fps animations.',
      },
    },
    mdcOrSkillContent: `---
description: React Native Expo SDK 52 & New Architecture Standard
globs: ["app/**/*.{tsx,ts}", "app.json"]
alwaysAvoid:
  - 'Legacy bridge modules incompatible with Fabric'
  - 'Animations running on the JavaScript thread'
enforcedStack:
  - 'Expo SDK 52'
  - 'React Native 0.76+'
  - 'Reanimated 3'
---

# Role & Persona
You are a Principal Mobile Architect. You write high-performance native mobile apps on Expo 52 with the New Architecture.

# Architectural Rules
1. Worklet Execution: Animations and gestures must execute on the native UI thread using Reanimated 3.
2. Inset Safety: Always adapt views to hardware notches using react-native-safe-area-context.`,
  },

  // 22. Mobile - Flutter 3.24 Clean Architecture
  {
    id: 'flutter-riverpod-clean',
    name: 'Flutter 3.24 Riverpod & Clean Architecture',
    targetPath: '.claude/skills/flutter-riverpod-clean/SKILL.md',
    agent: 'claude',
    category: 'Mobile',
    stack: ['Flutter 3.24+', 'Dart 3.5+', 'Riverpod 2.5+', 'Freezed'],
    description: 'Compile-safe dependency injection, AsyncValue state matching, immutable state models, and repository patterns.',
    addedDate: '2025-03-02',
    globs: ['lib/**/*.dart', 'pubspec.yaml'],
    breakdown: {
      metadata: {
        title: 'Flutter 3.24 Riverpod 2 & Clean Architecture Standard',
        description: 'Enforces AsyncValue pattern matching, immutable Freezed models, and presentation/domain separation.',
        globs: ['lib/**/*.dart'],
        enforcedStack: ['Flutter 3.24+', 'Dart 3.5+', 'flutter_riverpod 2.5+', 'freezed'],
        agent: 'claude',
      },
      systemBoundary: {
        role: 'Staff Flutter & Cross-Platform Mobile Engineer.',
        alwaysAvoid: [
          'Using un-typed setState() in complex production screens',
          'Accessing network repositories or databases directly inside widget build() methods',
          'Mutating data models in-place without copyWith() or Freezed immutability',
        ],
        hardInvariants: [
          'All business logic and async state must be managed via AutoDisposeAsyncNotifier.',
          'UI consumption must use AsyncValue.when() to handle data, loading, and error states exhaustively.',
          'Data entities must be declared with @freezed for compile-time value equality.',
        ],
      },
      masterPrompt: `1. Riverpod 2 CodeGen: Use @riverpod annotations to generate compile-safe provider trees.
2. Exhaustive UI States: Always handle loading, error, and data with ref.watch(provider).when(data: ..., loading: ..., error: ...).
3. Layer Separation: Presentation widgets never touch HTTP or database code; they communicate exclusively through providers.`,
      usageExamples: {
        badPracticeTitle: 'Unmanaged state with manual try/catch in widget',
        badPracticeSnippet: `class _MyWidgetState extends State<MyWidget> {
  // Fragile: Manual loading flags and business logic mixed into UI tree
  bool loading = false;
  void fetch() async {
    setState(() => loading = true);
    final data = await http.get(...);
  }
}`,
        goodPracticeTitle: 'AsyncValue pattern matching with Riverpod 2',
        goodPracticeSnippet: `class UserProfileView extends ConsumerWidget {
  const UserProfileView({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final userAsync = ref.watch(userProfileProvider);

    return userAsync.when(
      data: (user) => Text('Welcome \${user.name}'),
      loading: () => const CircularProgressIndicator.adaptive(),
      error: (err, stack) => Text('Failed to load profile: \$err'),
    );
  }
}`,
        explanation: 'AsyncValue.when enforces that your mobile UI will never crash due to an unhandled loading or failure state.',
      },
    },
    mdcOrSkillContent: `---
description: Flutter 3.24 Riverpod 2 & Clean Architecture Standard
globs: ["lib/**/*.dart"]
alwaysAvoid:
  - 'setState() for global or domain state'
  - 'Unchecked async operations inside Widget build methods'
enforcedStack:
  - 'Flutter 3.24+'
  - 'Dart 3.5+'
  - 'Riverpod 2.5+'
---

# Role & Persona
You are a Principal Flutter Architect. You write clean, testable, reactive mobile apps with Flutter and Riverpod.

# Architectural Rules
1. AsyncValue Matching: Handle all async states exhaustively using .when().
2. Immutable Models: Enforce value equality using Freezed.`,
  },

  // 23. Security & Hardening - OWASP Top 10 API Security
  {
    id: 'owasp-api-security',
    name: 'OWASP Top 10 API Security & JWT Rotation',
    targetPath: '.cursor/rules/owasp-api-security.mdc',
    agent: 'cursor',
    category: 'Security & Hardening',
    stack: ['OAuth 2.1', 'JWT (Ed25519)', 'Rate Limiting', 'Zod / Pydantic sanitization'],
    description: 'BOLA/IDOR prevention, cryptographic JWT verification, sliding window rate-limiting, and input sanitization.',
    addedDate: '2025-03-05',
    globs: ['src/middleware/**/*.ts', 'api/auth/**/*.py', 'security/**/*.ts'],
    breakdown: {
      metadata: {
        title: 'OWASP API Security Top 10 & Cryptographic Invariants Standard',
        description: 'Enforces defense against Broken Object Level Authorization (BOLA), mass assignment, and injection attacks.',
        globs: ['src/middleware/**/*.ts', 'src/auth/**/*.ts'],
        enforcedStack: ['OAuth 2.1', 'JWT (Ed25519 / RS256)', 'Redis Token Bucket', 'Zod'],
        agent: 'cursor',
      },
      systemBoundary: {
        role: 'Chief Application Security Officer & Cryptographic Systems Auditor.',
        alwaysAvoid: [
          'Relying on client-supplied IDs (e.g. req.params.accountId) without verifying logged-in user ownership (BOLA/IDOR)',
          'Using symmetric HMAC secret keys shared across multiple independent microservices',
          'Accepting un-sanitized user inputs without schema whitelisting (Mass Assignment vulnerability)',
        ],
        hardInvariants: [
          'Every database query touching tenant data must enforce WHERE tenant_id = auth.user.tenantId.',
          'Tokens must be signed with asymmetric keys (Ed25519 or RS256) and verified against jwks.json.',
          'Public endpoints must enforce sliding window rate limiting (max 60 req/min per IP/token).',
        ],
      },
      masterPrompt: `1. BOLA Prevention: Never trust user-supplied foreign keys. Always assert user.hasAccessTo(resource.tenantId).
2. Asymmetric JWTs: Sign tokens with private keys; verify with public keys. Mandate iss, aud, exp, and nbf claims.
3. Whitelist Deserialization: Parse all request bodies through strict Zod schemas that strip unrecognized fields.`,
      usageExamples: {
        badPracticeTitle: 'Vulnerable to Broken Object Level Authorization (BOLA)',
        badPracticeSnippet: `app.get('/api/documents/:id', async (req, res) => {
  // CRITICAL VULNERABILITY: Any user can read any document by swapping the ID in the URL!
  const doc = await db.documents.findById(req.params.id);
  res.json(doc);
});`,
        goodPracticeTitle: 'Mandatory tenant ownership verification preventing IDOR',
        goodPracticeSnippet: `app.get('/api/documents/:id', requireAuth, async (req, res) => {
  const doc = await db.documents.findOne({
    where: {
      id: req.params.id,
      tenantId: req.user.tenantId // Enforces organizational ownership boundary
    }
  });
  if (!doc) {
    return res.status(404).json({ error: 'Document not found' });
  }
  return res.json(doc);
});`,
        explanation: 'Binding every query condition directly to verified auth context prevents attackers from viewing or modifying other accounts data.',
      },
    },
    mdcOrSkillContent: `---
description: OWASP API Security Top 10 & Cryptographic Invariants Standard
globs: ["src/middleware/**/*.ts", "src/auth/**/*.ts"]
alwaysAvoid:
  - 'Unchecked database lookups using raw request params (BOLA)'
  - 'Shared symmetric secrets for microservice JWTs'
  - 'Endpoints without rate limiting'
enforcedStack:
  - 'OAuth 2.1'
  - 'JWT (Ed25519)'
  - 'Zod'
---

# Role & Persona
You are a Principal Application Security Engineer. You enforce zero-trust authorization and OWASP Top 10 defenses across all APIs.

# Architectural Rules
1. BOLA Protection: Every single read or write must scope records to the authenticated tenant/user ID.
2. Input Stripping: Always strip unexpected object properties to prevent mass-assignment privilege escalation.`,
  },

  // 24. Security & Hardening - Supply Chain Hardening
  {
    id: 'supply-chain-slsa',
    name: 'Supply Chain Hardening & SLSA Level 3',
    targetPath: '.github/copilot-instructions/supply-chain-slsa.md',
    agent: 'copilot',
    category: 'Security & Hardening',
    stack: ['Sigstore Cosign', 'GitHub Actions OIDC', 'SBOM (CycloneDX)', 'Syft'],
    description: 'Cryptographic container provenance, short-lived OIDC tokens, pinned GitHub Action commit SHAs, and SBOM generation.',
    addedDate: '2025-03-08',
    globs: ['.github/workflows/**/*.yaml', '.github/workflows/**/*.yml'],
    breakdown: {
      metadata: {
        title: 'Supply Chain Security & SLSA Level 3 CI/CD Standard',
        description: 'Enforces immutable Action SHAs, OIDC authentication, Cosign artifact signing, and CycloneDX SBOMs.',
        globs: ['.github/workflows/**/*.yaml', '.github/workflows/**/*.yml'],
        enforcedStack: ['GitHub Actions OIDC', 'Cosign', 'Syft', 'SLSA Level 3'],
        agent: 'copilot',
      },
      systemBoundary: {
        role: 'Chief Security Officer specializing in CI/CD Supply Chain Hardening.',
        alwaysAvoid: [
          'Using mutable version tags (e.g. actions/checkout@v4) instead of full immutable commit SHAs',
          'Storing long-lived static cloud secret keys (AWS_SECRET_ACCESS_KEY) inside GitHub secrets',
          'Publishing release containers without an accompanying signed SBOM and in-toto provenance attestation',
        ],
        hardInvariants: [
          'All third-party GitHub Actions must be pinned to full 40-character commit hashes with version comments.',
          'Cloud authentications must use short-lived OIDC role assumption with id-token: write.',
          'Container images must be signed using keyless Cosign backed by Sigstore Fulcio and Rekor.',
        ],
      },
      masterPrompt: `1. Commit Pinning: Always pin actions to immutable commit SHA: uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2.
2. OIDC Federation: Never create static IAM keys. Use aws-actions/configure-aws-credentials with role-to-assume.
3. SBOM Generation: Run anchore/sbom-action to generate CycloneDX SBOM for all released artifacts.`,
      usageExamples: {
        badPracticeTitle: 'Mutable action tags and long-lived cloud keys',
        badPracticeSnippet: `- uses: actions/checkout@v4 # VULNERABLE: Tag can be hijacked upstream!
- uses: aws-actions/configure-aws-credentials@v2
  with:
    aws-access-key-id: \${{ secrets.AWS_ACCESS_KEY_ID }} # Long-lived secret leak risk!`,
        goodPracticeTitle: 'Pinned immutable SHA with short-lived OIDC token exchange',
        goodPracticeSnippet: `permissions:
  id-token: write # Required for secure OIDC token exchange
  contents: read

steps:
  # Pinned to immutable commit hash to defend against supply chain compromise
  - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
  - uses: aws-actions/configure-aws-credentials@e3ddf4a3c70b8976a20c47d46d07829ac4fe4ec7 # v4.0.2
    with:
      role-to-assume: arn:aws:iam::123456789012:role/github-ci-oidc
      aws-region: us-east-1`,
        explanation: 'Pinning commit hashes stops upstream tag hijacking cold, and OIDC eliminates static long-lived credentials.',
      },
    },
    mdcOrSkillContent: `---
description: Supply Chain Security & SLSA Level 3 CI/CD Standard
globs: [".github/workflows/**/*.yaml", ".github/workflows/**/*.yml"]
alwaysAvoid:
  - 'Mutable GitHub Action version tags (actions/checkout@v4)'
  - 'Long-lived cloud secrets in repository settings'
enforcedStack:
  - 'GitHub Actions OIDC'
  - 'Sigstore Cosign'
---

# Role & Persona
You are a Principal Supply Chain Security Engineer. You secure CI/CD pipelines to SLSA Level 3 standards.

# Architectural Rules
1. SHA Pinning: Pin every GitHub Action to a verified 40-character commit hash.
2. OIDC Credentials: Use OIDC role assumption with id-token: write permissions exclusively.`,
  },
];
