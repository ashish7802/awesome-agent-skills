"""
Generates physical rule files on disk based on skills.json or Python definitions.
Enforces the strict 4-part architecture.
"""

import os
import json
from pathlib import Path
from typing import Dict, Any, List


def format_skill_content(skill: Dict[str, Any]) -> str:
    """Formats a skill object into the verified 4-part specification markdown."""
    b = skill.get("breakdown") or {}
    metadata = b.get("metadata") or {}
    sys_bound = b.get("systemBoundary") or {}

    globs: List[str] = skill.get("globs") or metadata.get("globs") or ["**/*"]
    always_avoid: List[str] = sys_bound.get("alwaysAvoid") or []
    hard_invariants: List[str] = sys_bound.get("hardInvariants") or []
    enforced_stack: List[str] = skill.get("stack") or metadata.get("enforcedStack") or []

    lines: List[str] = [
        "---",
        f"description: {metadata.get('description') or skill.get('description', '')}",
        f"globs: {json.dumps(globs)}",
        "alwaysAvoid:",
    ]
    for item in always_avoid:
        lines.append(f"  - {json.dumps(item)}")

    lines.append("enforcedStack:")
    for item in enforced_stack:
        lines.append(f"  - {json.dumps(item)}")

    agent = skill.get("agent")
    runtime_name = (
        "Cursor (.mdc)"
        if agent == "cursor"
        else "Claude Code (SKILL.md)"
        if agent == "claude"
        else "GitHub Copilot Instructions"
    )

    lines.extend([
        "---",
        "",
        "# Part 1: Metadata & Trigger Scope",
        f"- **Skill Name**: {skill.get('name', '')}",
        f"- **File Globs**: {', '.join(f'`{g}`' for g in globs)}",
        f"- **Enforced Stack**: {', '.join(enforced_stack)}",
        f"- **Target Runtime**: {runtime_name}",
        "",
        "# Part 2: System Boundary & Prohibitions",
        "## Role & Persona",
        sys_bound.get("role") or "Senior Software Engineer",
        "",
        "## Always Avoid (Hard Prohibitions)",
    ])

    if always_avoid:
        for i, a in enumerate(always_avoid, start=1):
            lines.append(f"{i}. {a}")
    else:
        lines.append("1. Deprecated framework APIs or unvetted external dependencies.")

    lines.extend([
        "",
        "## Hard Invariants",
    ])

    if hard_invariants:
        for i, h in enumerate(hard_invariants, start=1):
            lines.append(f"{i}. {h}")
    else:
        lines.append("1. Follow strict typing and modular architecture.")

    lines.extend([
        "",
        "# Part 3: Master Instruction Prompt",
        b.get("masterPrompt") or skill.get("mdcOrSkillContent", ""),
        "",
    ])

    usage_examples = b.get("usageExamples")
    if usage_examples:
        lines.extend([
            "# Part 4: Verified Implementation Standard vs Prohibited Anti-Pattern",
            "",
            f"## Prohibited Anti-Pattern: {usage_examples.get('badPracticeTitle', 'Deprecated Pattern')}",
            "```",
            usage_examples.get("badPracticeSnippet", "").strip(),
            "```",
            "",
            f"## Verified Production Standard: {usage_examples.get('goodPracticeTitle', 'Production Pattern')}",
            "```",
            usage_examples.get("goodPracticeSnippet", "").strip(),
            "```",
            "",
            "## Architectural Justification",
            usage_examples.get("explanation", "").strip(),
            "",
        ])

    return "\n".join(lines).strip() + "\n"


def generate_all_rules(project_root: Path) -> int:
    """Generates all 24 rule files and cleans up orphaned files."""
    skills_json_path = project_root / "skills.json"
    if not skills_json_path.exists():
        raise FileNotFoundError(f"Missing {skills_json_path}")

    with open(skills_json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    skills = data.get("skills", [])
    valid_target_paths = set()
    created_count = 0

    print(f"[python-generator] Generating {len(skills)} skill rule files from skills.json...")

    for skill in skills:
        target_path = skill.get("targetPath")
        if not target_path:
            continue

        full_path = (project_root / target_path).resolve()
        valid_target_paths.add(str(full_path))
        full_path.parent.mkdir(parents=True, exist_ok=True)

        content = format_skill_content(skill)
        full_path.write_text(content, encoding="utf-8")
        created_count += 1
        print(f"  ✓ Generated: {target_path}")

    # Prune orphaned files
    managed_dirs = [
        project_root / ".cursor" / "rules",
        project_root / ".claude" / "skills",
        project_root / ".github" / "copilot-instructions",
    ]

    for d in managed_dirs:
        if not d.exists():
            continue
        for root, dirs, files in os.walk(d, topdown=False):
            for file_name in files:
                p = Path(root) / file_name
                if str(p.resolve()) not in valid_target_paths:
                    print(f"  ✗ Pruned stale file: {p.relative_to(project_root)}")
                    p.unlink()
            if not os.listdir(root):
                os.rmdir(root)

    print(f"[python-generator] Completed successfully. {created_count} rule files synchronized.")
    return created_count
