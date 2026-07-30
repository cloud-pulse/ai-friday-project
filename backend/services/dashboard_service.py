"""Dashboard metric aggregation service."""

from datetime import datetime, timedelta
from typing import Any

from database.lancedb.repositories import BatchRepository, ResultRepository
from schemas.dashboard import DashboardDefects, DashboardMetrics, DashboardTrends, DefectBreakdown, TrendDataPoint


class DashboardService:
    def __init__(self, batch_repository: BatchRepository, result_repository: ResultRepository) -> None:
        self._batches = batch_repository
        self._results = result_repository

    def get_metrics(self) -> DashboardMetrics:
        batches = self._batches.history()
        total_batches = len(batches)
        
        all_results = []
        for batch in batches:
            all_results.extend(self._results.list_by_batch(batch.id, limit=10000))
            
        total_packages = len(all_results)
        passed_packages = sum(1 for r in all_results if r.decision == "passed")
        
        overall_pass_rate = round((passed_packages / total_packages) * 100, 1) if total_packages > 0 else 0.0
        
        active_defects = sum(len(r.defects) for r in all_results if r.decision != "passed")
        human_reviews_pending = sum(1 for b in batches if b.status.value == "ready_for_review")

        return DashboardMetrics(
            total_batches=total_batches,
            total_packages_inspected=total_packages,
            overall_pass_rate=overall_pass_rate,
            pass_rate_change="+1.2%",  # Static placeholder for now, would be calculated from historical diff
            active_defects_count=active_defects,
            avg_inspection_time="2.4s", # Mock for now
            human_reviews_pending=human_reviews_pending
        )

    def get_trends(self) -> DashboardTrends:
        # Mocking the 7 day trend for now as the db might not have 7 days of data
        days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        trends = [
            TrendDataPoint(day=day, pass_rate=95.0 + (i * 0.3), target=95.0, total_inspected=5000 + i*100)
            for i, day in enumerate(days)
        ]
        return DashboardTrends(trends=trends)

    def get_defects(self) -> DashboardDefects:
        all_results = []
        for batch in self._batches.history():
            all_results.extend(self._results.list_by_batch(batch.id, limit=10000))
            
        defect_counts = {}
        for result in all_results:
            for defect in result.defects:
                defect_counts[defect.category] = defect_counts.get(defect.category, 0) + 1
                
        total_defects = sum(defect_counts.values())
        colors = ["#EF4444", "#F59E0B", "#0EA5E9", "#38BDF8", "#64748B"]
        
        breakdown = []
        for i, (category, count) in enumerate(sorted(defect_counts.items(), key=lambda x: x[1], reverse=True)):
            percentage = int((count / total_defects) * 100) if total_defects > 0 else 0
            color = colors[i % len(colors)]
            breakdown.append(DefectBreakdown(category=category, count=count, percentage=percentage, color=color))
            
        return DashboardDefects(breakdown=breakdown)
