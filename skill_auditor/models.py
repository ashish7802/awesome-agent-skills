"""
Data models and dataclasses for the Skill Auditor Python engine.
"""

from dataclasses import dataclass, field, asdict
from typing import List, Optional, Dict, Any


@dataclass
class AuditIssue:
    category: str
    severity: str  # 'critical' | 'warning' | 'nit'
    title: str
    explanation: str
    fix_suggestion: str

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class CategoryScores:
    trigger_clarity: int = 95
    fabrication_check: int = 100
    duplication: int = 95
    actionability: int = 95
    anti_pattern_completeness: int = 95

    def to_dict(self) -> Dict[str, int]:
        return asdict(self)


@dataclass
class AuditReport:
    overall_score: int
    summary: str
    category_scores: CategoryScores
    issues: List[AuditIssue] = field(default_factory=list)
    rewritten_snippet: Optional[str] = None
    file_name: str = "input-skill.mdc"
    char_count: int = 0
    engine: str = "python-heuristic-engine"
    timestamp: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        data = asdict(self)
        data["category_scores"] = self.category_scores.to_dict()
        data["issues"] = [i.to_dict() for i in self.issues]
        return data
