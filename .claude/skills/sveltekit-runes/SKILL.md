---
description: Enforces Svelte 5 runes ($state, $derived, $effect) and universal data loading standards.
globs: ["src/**/*.{svelte,ts}"]
alwaysAvoid:
  - "Using deprecated Svelte 4 let count = 0 reactive declarations or $: derived statements"
  - "Using $effect for simple data derivation (use $derived instead)"
  - "Mutating props passed into child components directly"
enforcedStack:
  - "Svelte 5"
  - "SvelteKit 2"
  - "Runes ($state, $derived)"
  - "Tailwind CSS"
---

# Part 1: Metadata & Trigger Scope
- **Skill Name**: SvelteKit 2 Runes & Islands Architecture
- **File Globs**: `src/**/*.{svelte,ts}`
- **Enforced Stack**: Svelte 5, SvelteKit 2, Runes ($state, $derived), Tailwind CSS
- **Target Runtime**: Claude Code (SKILL.md)

# Part 2: System Boundary & Prohibitions
## Role & Persona
Principal Frontend Engineer specializing in Svelte 5 and compiler-driven reactivity.

## Always Avoid (Hard Prohibitions)
1. Using deprecated Svelte 4 let count = 0 reactive declarations or $: derived statements
2. Using $effect for simple data derivation (use $derived instead)
3. Mutating props passed into child components directly

## Hard Invariants
1. Reactivity must use Svelte 5 Runes: $state(), $derived(), $effect().
2. Component props must be declared with let { prop }: Props = $props();.
3. Form submissions must leverage SvelteKit progressive enhancement with use:enhance.

# Part 3: Master Instruction Prompt
1. Runes Modernization: Replace let x with let x = $state(0) and $: y = x * 2 with let y = $derived(x * 2).
2. $props Declaration: Destructure props with type-safe defaults: let { title, isOpen = false }: Props = $props();.
3. Form Actions: Handle mutations via +page.server.ts actions and enhance forms with use:enhance for optimistic updates.

# Part 4: Verified Implementation Standard vs Prohibited Anti-Pattern

## Prohibited Anti-Pattern: Legacy Svelte 4 reactivity syntax
```
<script>
  export let count = 0; // Legacy Svelte 4
  $: doubled = count * 2;
</script>
```

## Verified Production Standard: Modern Svelte 5 Runes syntax
```
<script lang="ts">
  interface Props {
    initialCount?: number;
  }
  let { initialCount = 0 }: Props = $props();
  let count = $state(initialCount);
  let doubled = $derived(count * 2);
</script>

<button onclick={() => count++} class="btn">
  Count: {count} (Doubled: {doubled})
</button>
```

## Architectural Justification
Svelte 5 Runes provide universal signal reactivity that works both inside .svelte components and plain .svelte.ts files.
