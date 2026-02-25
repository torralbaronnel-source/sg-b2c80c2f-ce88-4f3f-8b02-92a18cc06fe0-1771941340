import React from "react";
import { SEO } from "@/components/SEO";
import { OverviewDashboardView } from "@/components/Dashboard/OverviewDashboardView";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <SEO title="Overview | Orchestrix" />
      <OverviewDashboardView />
    </ProtectedRoute>
  );
}