"""
Unified CLI for the Python Skill Auditor toolchain.
"""

import sys
import json
import argparse
from pathlib import Path
from .evaluator import evaluate_skill_content
from .generator import generate_all_rules


def run_audit(file_path: Path, output_json: bool = False):
    if not file_path.exists():
        print(f"Error: File '{file_path}' does not exist.", file=sys.stderr)
        sys.exit(1)

    content = file_path.read_text(encoding="utf-8")
    report = evaluate_skill_content(content, file_name=file_path.name)

    if output_json:
        print(json.dumps(report.to_dict(), indent=2))
        return

    # Formatted terminal output
    score = report.overall_score
    color = "\033[92m" if score >= 90 else "\033[93m" if score >= 75 else "\033[91m"
    reset = "\033[0m"

    print("=" * 60)
    print(f"Skill Audit Report: {report.file_name}")
    print("=" * 60)
    print(f"Overall Quality Score: {color}{score}/100{reset}")
    print(f"Summary: {report.summary}\n")

    scores = report.category_scores
    print("Category Breakdown:")
    print(f"  • Trigger Clarity:           {scores.trigger_clarity}/100")
    print(f"  • Fabrication Check:         {scores.fabrication_check}/100")
    print(f"  • Duplication Check:         {scores.duplication}/100")
    print(f"  • Actionability Check:       {scores.actionability}/100")
    print(f"  • Anti-Pattern Completeness: {scores.anti_pattern_completeness}/100\n")

    if report.issues:
        print(f"Detected Issues ({len(report.issues)}):")
        for i, issue in enumerate(report.issues, 1):
            sev_color = "\033[91m" if issue.severity == "critical" else "\033[93m" if issue.severity == "warning" else "\033[94m"
            print(f"  {i}. [{sev_color}{issue.severity.upper()}{reset}] {issue.title}")
            print(f"     Explanation: {issue.explanation}")
            print(f"     Suggested Fix: {issue.fix_suggestion}")
    else:
        print("\033[92m✓ Clean rule: zero anti-patterns, no vague platitudes, explicit triggers verified.\033[0m")

    print("=" * 60)


def run_audit_stdin():
    content = sys.stdin.read()
    report = evaluate_skill_content(content, file_name="stdin.mdc")
    print(json.dumps(report.to_dict()))


def main():
    parser = argparse.ArgumentParser(description="Skill Auditor Python Engine & CLI")
    subparsers = parser.add_subparsers(dest="command", required=True)

    # audit command
    audit_parser = subparsers.add_parser("audit", help="Audit a skill or rule file")
    audit_parser.add_argument("file", type=Path, help="Path to the rule file (.mdc, SKILL.md, .md)")
    audit_parser.add_argument("--json", action="store_true", help="Output raw JSON report")

    # audit-stdin command (for integration with node/server)
    subparsers.add_parser("audit-stdin", help="Audit content passed via standard input")

    # generate command
    subparsers.add_parser("generate", help="Generate all 24 physical rule files on disk")

    # validate command
    subparsers.add_parser("validate", help="Validate all repository rule files")

    args = parser.parse_args()
    project_root = Path.cwd()

    if args.command == "audit":
        run_audit(args.file, output_json=args.json)
    elif args.command == "audit-stdin":
        run_audit_stdin()
    elif args.command == "generate":
        generate_all_rules(project_root)
    elif args.command == "validate":
        # Validate all managed rules
        dirs = [
            project_root / ".cursor" / "rules",
            project_root / ".claude" / "skills",
            project_root / ".github" / "copilot-instructions",
        ]
        total_files = 0
        passed_files = 0

        for d in dirs:
            if not d.exists():
                continue
            for p in d.rglob("*"):
                if p.is_file() and p.suffix in (".mdc", ".md"):
                    total_files += 1
                    rep = evaluate_skill_content(p.read_text(encoding="utf-8"), file_name=p.name)
                    if rep.overall_score >= 90 and not rep.issues:
                        passed_files += 1
                        print(f"  \033[92m✓\033[0m {p.relative_to(project_root)}: {rep.overall_score}/100")
                    else:
                        print(f"  \033[91m✗\033[0m {p.relative_to(project_root)}: {rep.overall_score}/100 ({len(rep.issues)} issues)")

        print(f"\nValidation Result: {passed_files}/{total_files} rules passed production audit standard.")
        if passed_files < total_files:
            sys.exit(1)


if __name__ == "__main__":
    main()
