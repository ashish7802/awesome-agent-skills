#!/usr/bin/env python3
"""
Python script to generate and synchronize all 24 skill rules on disk.
Run via: python3 scripts/generate_rules.py or npm run generate:rules
"""

import sys
from pathlib import Path

# Add root directory to sys.path so skill_auditor module is importable
project_root = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(project_root))

from skill_auditor.generator import generate_all_rules

if __name__ == "__main__":
    count = generate_all_rules(project_root)
    print(f"[generate_rules.py] Successfully generated and verified {count} rule files.")
