---
description: Enforces reactive prop destructuring, setup stores, and shallowRef for heavy object payloads.
globs: ["src/**/*.{vue,ts}"]
alwaysAvoid:
  - "Using legacy Options API in new greenfield components"
  - "Using deeply reactive ref() for large immutable data objects (use shallowRef)"
  - "Mutating Pinia store state directly across unrelated components without store actions"
enforcedStack:
  - "Vue 3.5"
  - "Pinia"
  - "Vite 6"
  - "TypeScript strict"
---

# Part 1: Metadata & Trigger Scope
- **Skill Name**: Vue 3.5 & Pinia Enterprise Micro-Frontends
- **File Globs**: `src/**/*.{vue,ts}`
- **Enforced Stack**: Vue 3.5, Pinia, Vite 6, TypeScript strict
- **Target Runtime**: GitHub Copilot Instructions

# Part 2: System Boundary & Prohibitions
## Role & Persona
Staff Frontend Architect specializing in Vue 3 ecosystem.

## Always Avoid (Hard Prohibitions)
1. Using legacy Options API in new greenfield components
2. Using deeply reactive ref() for large immutable data objects (use shallowRef)
3. Mutating Pinia store state directly across unrelated components without store actions

## Hard Invariants
1. All components must use <script setup lang="ts">.
2. Pinia stores must use Setup Store syntax (function syntax) rather than Options store.
3. Props must leverage Vue 3.5 reactive destructure with defineProps<{ ... }>().

# Part 3: Master Instruction Prompt
1. Vue 3.5 Reactive Props: Destructure props directly: const { count = 0, title } = defineProps<{ count?: number; title: string }>();.
2. Template Refs: Use the modern useTemplateRef('myInput') hook instead of ref<HTMLElement | null>(null).
3. Shallow Reactivity: Wrap large chart datasets or JSON trees in shallowRef to prevent deep proxy overhead.

# Part 4: Verified Implementation Standard vs Prohibited Anti-Pattern

## Prohibited Anti-Pattern: Legacy options store with direct state mutation
```
export const useUserStore = defineStore('user', {
  state: () => ({ name: '' }),
  // Options store
});
```

## Verified Production Standard: Vue 3.5 Setup store with TypeScript invariants
```
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useUserStore = defineStore('user', () => {
  const user = ref<UserProfile | null>(null);
  const isAuthenticated = computed(() => user.value !== null);

  async function login(credentials: Credentials) {
    const data = await api.auth.login(credentials);
    user.value = data;
  }

  return { user, isAuthenticated, login };
});
```

## Architectural Justification
Setup stores provide full TypeScript composability, allow arbitrary composable injections, and simplify testing.
