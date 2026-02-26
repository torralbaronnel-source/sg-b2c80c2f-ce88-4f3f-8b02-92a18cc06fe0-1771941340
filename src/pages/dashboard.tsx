import React from "react";
import { AppLayout } from "@/components/Layout/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SEO } from "@/components/SEO";
import { OverviewDashboardView } from "@/components/Dashboard/OverviewDashboardView";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <SEO title="Dashboard | Orchestrix" />
        <OverviewDashboardView />
      </AppLayout>
    </ProtectedRoute>
  );
}