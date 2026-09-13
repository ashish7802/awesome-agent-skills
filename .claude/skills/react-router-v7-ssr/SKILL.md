---
description: Enforces type-safe route loaders, progressive enhancement actions, and optimistic mutations.
globs: ["app/**/*.{ts,tsx}", "react-router.config.ts"]
alwaysAvoid:
  - "Using client-side useEffect fetching instead of route loader functions"
  - "Triggering un-typed imperative mutations without React Router Form / useFetcher"
  - "Breaking progressive enhancement by requiring JavaScript for basic form submissions"
  - "Manual URL parsing for route params instead of Route.LoaderArgs types"
enforcedStack:
  - "React Router v7"
  - "React 19"
  - "Node.js 22"
  - "Vite 6"
---

# Part 1: Metadata & Trigger Scope
- **Skill Name**: Remix / React Router v7 Fullstack SSR
- **File Globs**: `app/**/*.{ts,tsx}`, `react-router.config.ts`
- **Enforced Stack**: React Router v7, React 19, Node.js 22, Vite 6
- **Target Runtime**: Claude Code (SKILL.md)

# Part 2: System Boundary & Prohibitions
## Role & Persona
Full-Stack Web Architect specializing in React Router v7 and progressive web architecture.

## Always Avoid (Hard Prohibitions)
1. Using client-side useEffect fetching instead of route loader functions
2. Triggering un-typed imperative mutations without React Router Form / useFetcher
3. Breaking progressive enhancement by requiring JavaScript for basic form submissions
4. Manual URL parsing for route params instead of Route.LoaderArgs types

## Hard Invariants
1. All route data must be fetched in async loader({ request, params }: Route.LoaderArgs) functions.
2. Mutations must use action({ request }: Route.ActionArgs) and parse formData intent keys.
3. Interactive lists must use useFetcher with optimistic update rollbacks on error.

# Part 3: Master Instruction Prompt
1. Typegen Loaders: Always import types from './+types/[route]' to get automatic compile-time loader data typing.
2. Progressive Enhancement: Build forms using <Form method="post">. JavaScript adds instant UX without breaking basic browser fallback.
3. Intent Pattern: In action handlers, switch on const intent = formData.get('intent') to handle multiple operations cleanly.
4. Error Boundaries: Export Route.ErrorBoundary to catch unexpected runtime loader/action errors gracefully.

# Part 4: Verified Implementation Standard vs Prohibited Anti-Pattern

## Prohibited Anti-Pattern: Manual fetch in component with un-typed state
```
export default function TeamView() {
  const [members, setMembers] = useState([]);
  useEffect(() => {
    fetch('/api/team').then(r => r.json()).then(setMembers);
  }, []);
  return <ul>{members.map(m => <li key={m.id}>{m.name}</li>)}</ul>;
}
```

## Verified Production Standard: React Router v7 typed loader with server-side pre-rendering
```
import type { Route } from './+types/team';
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
}
```

## Architectural Justification
Typegen loaders provide end-to-end type safety between server data extraction and client JSX with zero boilerplate.
