import React from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { OverviewDashboardView } from "@/components/Dashboard/OverviewDashboardView";
import { SEO } from "@/components/SEO";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <SEO title="Dashboard | Orchestrix" />
      <OverviewDashboardView />
    </ProtectedRoute>
  );
}