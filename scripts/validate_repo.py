#!/usr/bin/env python3
"""
Python script to validate all 24 skills in the repository.
Checks:
1. Exact presence of all 24 rule files
2. Strict 4-part architecture completeness
3. Absence of anti-patterns, vague platitudes, or unverified claims
4. Quality score >= 90/100
"""

import sys
from pathlib import Path

project_root = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(project_root))

from skill_auditor.cli import main

if __name__ == "__main__":
    sys.argv = [sys.argv[0], "validate"]
    main()
