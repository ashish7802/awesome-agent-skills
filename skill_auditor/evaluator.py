"""
Enterprise 5-dimension rule evaluation engine in Python.
"""

import re
from datetime import datetime
from typing import Optional, List
from .models import AuditReport, AuditIssue, CategoryScores


def evaluate_skill_content(content: str, file_name: Optional[str] = None) -> AuditReport:
    """
    Evaluates rule or skill content across 5 core dimensions:
    1. trigger_clarity (use-when conditions, file globs)
    2. fabrication_check (unverified claims, vanity stats, hype)
    3. duplication (redundant boilerplate lines)
    4. actionability (concrete technical invariants vs vague platitudes)
    5. anti_pattern_completeness (negative constraints, explicit Always Avoid)
    """
    issues: List[AuditIssue] = []
    lower = content.lower()
    lines = content.split("\n")

    trigger_score = 95
    fab_score = 100
    dup_score = 95
    act_score = 95
    anti_score = 95

    # 1. Trigger Clarity Check
    has_globs = bool(re.search(r"globs|file_triggers|target_files|\.mdc|match", content, re.IGNORECASE))
    has_catch_all = bool(re.search(r"\*\*/\*\.\*", content) or re.search(r"apply to all files", content, re.IGNORECASE))

    if not has_globs:
        trigger_score -= 40
        issues.append(
            AuditIssue(
                category="trigger_clarity",
                severity="warning",
                title="Missing Explicit File Globs / Trigger Scope",
                explanation="The skill does not explicitly declare file globs (e.g., `globs: [\"src/**/*.ts\"]`), causing the agent to either activate globally or fail to invoke when needed.",
                fix_suggestion="Define a precise `globs` array matching only relevant file paths.",
            )
        )
    elif has_catch_all:
        trigger_score -= 25
        issues.append(
            AuditIssue(
                category="trigger_clarity",
                severity="warning",
                title="Broad Wildcard Glob Triggers",
                explanation="Glob pattern uses unrestricted wildcards which could trigger the rule during unrelated edits and exhaust context windows.",
                fix_suggestion="Narrow the globs to specific directory extensions, e.g. `src/api/**/*.{ts,js}`.",
            )
        )

    # 2. Fabrication Check
    fabrication_keywords = [
        (re.compile(r"100k\+?\s*stars", re.IGNORECASE), "Claims unverified star metrics or social proof."),
        (re.compile(r"\b(10x|50x|100x)\s+(faster|speedup|productivity)\b", re.IGNORECASE), "Claims unverified performance multipliers."),
        (re.compile(r"guaranteed\s+(zero|100%)\s+bugs", re.IGNORECASE), "Contains unverifiable absolute accuracy claims."),
        (re.compile(r"\[!\[.*?badge.*?\]\]", re.IGNORECASE), "Contains decorative marketing badges inside system prompt instructions."),
    ]

    for pattern, reason in fabrication_keywords:
        if pattern.search(content):
            fab_score -= 30
            issues.append(
                AuditIssue(
                    category="fabrication_check",
                    severity="critical",
                    title="Unverifiable Claim / Marketing Boilerplate",
                    explanation=f"{reason} Agent rule files should only contain operational constraints, not vanity text.",
                    fix_suggestion="Strip all promotional slogans, fake badge URLs, and unscientific performance multipliers.",
                )
            )

    # 3. Actionability Check
    vague_phrases = [
        ("write clean code", "Specify concrete formatting rules, naming conventions, and lint configurations."),
        ("make it fast", "Define algorithmic constraints, memory thresholds, or cache strategies."),
        ("be helpful and polite", "Replace conversational tone padding with deterministic architectural boundaries."),
        ("follow best practices", "Enumerate the explicit design patterns or library idioms to adopt."),
    ]

    for phrase, fix in vague_phrases:
        if phrase in lower:
            act_score -= 20
            issues.append(
                AuditIssue(
                    category="actionability",
                    severity="warning",
                    title=f'Vague Directive: "{phrase}"',
                    explanation="AI agents interpret vague platitudes unpredictably. Rules must specify exact programmatic invariants.",
                    fix_suggestion=fix,
                )
            )

    # 4. Anti-pattern Completeness
    has_anti_patterns = bool(
        re.search(r"never|avoid|do not|don't|prohibited|anti-pattern|always avoid", content, re.IGNORECASE)
    )
    if not has_anti_patterns:
        anti_score -= 45
        issues.append(
            AuditIssue(
                category="anti_pattern_completeness",
                severity="critical",
                title="No Explicit Anti-Patterns or Prohibitions Defined",
                explanation='Negative constraints are essential for preventing hallucinations and outdated library syntax. The rule lacks an explicit "Always Avoid" section.',
                fix_suggestion='Add an "Always Avoid" section listing 3-5 deprecated methods or high-risk conventions.',
            )
        )

    # 5. Duplication Check
    duplicates = [l for i, l in enumerate(lines) if len(l.strip()) > 30 and l in lines[:i]]
    if len(duplicates) > 2:
        dup_score -= 25
        issues.append(
            AuditIssue(
                category="duplication",
                severity="nit",
                title="Repeated Text Blocks Detected",
                explanation="Several identical instruction lines appear across multiple sections, consuming agent context unnecessarily.",
                fix_suggestion="Consolidate redundant rules into single bullet points.",
            )
        )

    # Clamp scores
    trigger_score = max(20, min(100, trigger_score))
    fab_score = max(20, min(100, fab_score))
    dup_score = max(20, min(100, dup_score))
    act_score = max(20, min(100, act_score))
    anti_score = max(20, min(100, anti_score))

    overall = round((trigger_score + fab_score + dup_score + act_score + anti_score) / 5)

    rewritten_snippet: Optional[str] = None
    if any(i.severity == "critical" for i in issues):
        rewritten_snippet = """---
# Refactored Clean Specification
globs: ["src/**/*.{ts,tsx}"]
alwaysAvoid:
  - "Using 'any' type assertions without explicit justification"
  - "Calling client-side mutations without error boundaries"
  - "Unvalidated external API payloads"
enforcedStack:
  - "TypeScript 5.6+ strict"
---

## Role & Technical Boundaries
You are a Principal Software Engineer. Provide type-safe, tested code adhering to strict structural boundaries."""

    summary = (
        "High quality production rule. Clear boundaries, actionable directives, and zero marketing fluff."
        if overall >= 85
        else (
            "Moderate quality rule with minor ambiguities or missing negative constraints that can be resolved easily."
            if overall >= 65
            else "Significant quality issues found. Requires refactoring of vague directives, unverified claims, or missing anti-patterns."
        )
    )

    return AuditReport(
        overall_score=overall,
        summary=summary,
        category_scores=CategoryScores(
            trigger_clarity=trigger_score,
            fabrication_check=fab_score,
            duplication=dup_score,
            actionability=act_score,
            anti_pattern_completeness=anti_score,
        ),
        issues=issues,
        rewritten_snippet=rewritten_snippet,
        file_name=file_name or "input-skill.mdc",
        char_count=len(content),
        engine="python-heuristic-engine",
        timestamp=datetime.utcnow().isoformat() + "Z",
    )
