"""
Skill Auditor: Enterprise Rule Validator & Multi-Agent Skill Generator.
Implemented in Python 3.10.
"""

from .evaluator import evaluate_skill_content, AuditReport, AuditIssue, CategoryScores
from .generator import generate_all_rules, format_skill_content

__version__ = "1.0.0"
__all__ = [
    "evaluate_skill_content",
    "AuditReport",
    "AuditIssue",
    "CategoryScores",
    "generate_all_rules",
    "format_skill_content",
]
