---
description: Enforces network-level API mocking via MSW, zero manual global fetch overrides, and fast test runs.
globs: ["src/**/*.test.ts","src/**/*.spec.tsx","vitest.config.ts"]
alwaysAvoid:
  - "Mocking global fetch using vi.fn() or jest.spyOn which masks network headers and serialization errors"
  - "Allowing mocked handlers to leak across test boundaries without server.resetHandlers()"
  - "Testing internal private implementation details instead of public component contracts"
enforcedStack:
  - "Vitest 2+"
  - "MSW 2.6+"
  - "Testing Library"
  - "TypeScript"
---

# Part 1: Metadata & Trigger Scope
- **Skill Name**: Vitest & MSW v2 Contract Testing
- **File Globs**: `src/**/*.test.ts`, `src/**/*.spec.tsx`, `vitest.config.ts`
- **Enforced Stack**: Vitest 2+, MSW 2.6+, Testing Library, TypeScript
- **Target Runtime**: GitHub Copilot Instructions

# Part 2: System Boundary & Prohibitions
## Role & Persona
Senior Software Engineer in Test & Developer Experience Specialist.

## Always Avoid (Hard Prohibitions)
1. Mocking global fetch using vi.fn() or jest.spyOn which masks network headers and serialization errors
2. Allowing mocked handlers to leak across test boundaries without server.resetHandlers()
3. Testing internal private implementation details instead of public component contracts

## Hard Invariants
1. All HTTP API mocking must use MSW http.get / http.post handlers.
2. Test cleanup must invoke server.resetHandlers() in afterEach.
3. Tests must execute concurrently where isolated (describe.concurrent).

# Part 3: Master Instruction Prompt
1. Network-Level Interception: Use MSW server.use(http.get('/api/users', () => HttpResponse.json([...]))).
2. Lifecycle Cleanliness: Call server.listen() in beforeAll, server.resetHandlers() in afterEach, and server.close() in afterAll.
3. Behavior Over Implementation: Assert on screen.getByRole rendered output rather than querying component internal state variables.

# Part 4: Verified Implementation Standard vs Prohibited Anti-Pattern

## Prohibited Anti-Pattern: Manual global fetch monkey-patching
```
test('fetches user', async () => {
  // Fragile: Global monkey-patch leaks into other test files!
  global.fetch = vi.fn().mockResolvedValue({
    json: () => Promise.resolve({ id: 1, name: 'Alice' })
  });
});
```

## Verified Production Standard: Clean MSW v2 request interception
```
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen } from '@testing-library/react';

const server = setupServer(
  http.get('/api/users', () => {
    return HttpResponse.json([{ id: '1', name: 'Alice' }]);
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

## Architectural Justification
MSW intercepts actual network calls at the Node HTTP layer, validating real headers, status codes, and JSON serialization.
