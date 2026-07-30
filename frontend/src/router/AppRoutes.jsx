import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { LandingPage } from '../pages/LandingPage';
import { DashboardPage } from '../pages/DashboardPage';
import { CreateBatchPage } from '../pages/CreateBatchPage';
import { InspectionSummaryPage } from '../pages/InspectionSummaryPage';
import { HumanReviewPage } from '../pages/HumanReviewPage';
import { ReportsPage } from '../pages/ReportsPage';
import { AIAssistantPage } from '../pages/AIAssistantPage';

export function AppRoutes() {
  return (
    <Routes>
      {/* Standalone Landing Page */}
      <Route path="/landing" element={<LandingPage />} />

      {/* Main Enterprise App Shell Routes */}
      <Route path="/" element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="create-batch" element={<CreateBatchPage />} />
        <Route path="inspection-summary" element={<InspectionSummaryPage />} />
        <Route path="human-review" element={<HumanReviewPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="ai-assistant" element={<AIAssistantPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
