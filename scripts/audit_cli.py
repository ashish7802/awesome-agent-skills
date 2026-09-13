#!/usr/bin/env python3
"""
Python CLI tool for auditing AI agent skill rules against enterprise standards.
Usage:
  python3 scripts/audit_cli.py <path-to-rule-file> [--json]
"""

import sys
from pathlib import Path

project_root = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(project_root))

from skill_auditor.cli import main

if __name__ == "__main__":
    if len(sys.argv) == 1:
        sys.argv.append("validate")
    elif sys.argv[1] not in ("audit", "audit-stdin", "generate", "validate", "-h", "--help"):
        # Auto-insert audit subcommand
        sys.argv.insert(1, "audit")
    main()
