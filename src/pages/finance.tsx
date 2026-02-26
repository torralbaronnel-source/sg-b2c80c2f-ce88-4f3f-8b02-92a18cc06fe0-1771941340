import React from "react";
import { AppLayout } from "@/components/Layout/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SEO } from "@/components/SEO";
import { FinanceDashboardView } from "@/components/Finance/FinanceDashboardView";

export default function FinancePage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <SEO title="Finance Dashboard | Orchestrix" />
        <FinanceDashboardView />
      </AppLayout>
    </ProtectedRoute>
  );
}