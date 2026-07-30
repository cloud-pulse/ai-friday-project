"""Dashboard schemas."""

from pydantic import BaseModel

class DashboardMetrics(BaseModel):
    total_batches: int
    total_packages_inspected: int
    overall_pass_rate: float
    pass_rate_change: str
    active_defects_count: int
    avg_inspection_time: str
    human_reviews_pending: int

class TrendDataPoint(BaseModel):
    day: str
    pass_rate: float
    target: float
    total_inspected: int

class DashboardTrends(BaseModel):
    trends: list[TrendDataPoint]

class DefectBreakdown(BaseModel):
    category: str
    count: int
    percentage: int
    color: str

class DashboardDefects(BaseModel):
    breakdown: list[DefectBreakdown]
