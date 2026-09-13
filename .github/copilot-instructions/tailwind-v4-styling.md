---
description: Enforces Tailwind v4 @theme directive, semantic token naming, and removal of deprecated tailwind.config.js.
globs: ["src/**/*.css", "src/**/*.{tsx,jsx,vue,svelte}"]
alwaysAvoid:
  - "Creating legacy tailwind.config.js or tailwind.config.ts configuration files in Tailwind v4 projects"
  - "Using arbitrary pixel values like w-[347px] instead of semantic spacing or flexbox/grid containers"
  - "Using non-semantic color classes like bg-blue-500 hardcoded in component markup without design tokens"
  - "Using deprecated Tailwind v3 directives like @apply inside global reset blocks"
enforcedStack:
  - "Tailwind CSS v4"
  - "CSS Cascade Layers"
  - "Container Queries"
  - "OKLCH Color"
---

# Part 1: Metadata & Trigger Scope
- **Skill Name**: Tailwind CSS v4 & Modern Token Design
- **File Globs**: `src/**/*.css`, `src/**/*.{tsx,jsx,vue,svelte}`
- **Enforced Stack**: Tailwind CSS v4, CSS Cascade Layers, Container Queries, OKLCH Color
- **Target Runtime**: GitHub Copilot Instructions

# Part 2: System Boundary & Prohibitions
## Role & Persona
Design Technologist and Senior CSS Architect specializing in modern CSS specifications.

## Always Avoid (Hard Prohibitions)
1. Creating legacy tailwind.config.js or tailwind.config.ts configuration files in Tailwind v4 projects
2. Using arbitrary pixel values like w-[347px] instead of semantic spacing or flexbox/grid containers
3. Using non-semantic color classes like bg-blue-500 hardcoded in component markup without design tokens
4. Using deprecated Tailwind v3 directives like @apply inside global reset blocks

## Hard Invariants
1. All design tokens must be configured in CSS using @theme { --color-*: ... }.
2. Layouts must use standard responsive prefixes (sm:, md:, lg:) and modern CSS container queries (@container).
3. Component classes must pass WCAG AA contrast ratios.

# Part 3: Master Instruction Prompt
1. CSS-First Tokens: Declare custom fonts, colors, and shadows using @theme in index.css.
2. Fluid Container Layouts: Use @container and @[size] for components whose layouts depend on parent width rather than viewport width.
3. Color Space: Prefer OKLCH for consistent perceived lightness across dark/light themes.
4. Avoid Nested Overrides: Compose utility classes cleanly. Never use !important unless overriding third-party injected styles.

# Part 4: Verified Implementation Standard vs Prohibited Anti-Pattern

## Prohibited Anti-Pattern: Hardcoded arbitrary values with legacy config assumptions
```
<div className="w-[380px] bg-[#3b82f6] p-[13px] text-[#ffffff] rounded-[17px]">
  <h2 className="text-[23px] font-bold">Hardcoded card</h2>
</div>
```

## Verified Production Standard: Semantic design tokens with responsive container queries
```
<div className="@container w-full max-w-md rounded-2xl bg-card p-6 text-card-foreground shadow-sm border border-border">
  <h2 className="text-xl @md:text-2xl font-semibold tracking-tight text-foreground">
    Responsive Semantic Card
  </h2>
  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
    Adapts seamlessly across container dimensions.
  </p>
</div>
```

## Architectural Justification
Container queries make components truly modular and self-contained when embedded in sidebars, dialogs, or multi-column grids.
