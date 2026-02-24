import React from "react";
import { AppLayout } from "@/components/Layout/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { OverviewDashboardView } from "@/components/Dashboard/OverviewDashboardView";
import { SEO } from "@/components/SEO";

export default function HomePage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <SEO title="Overview | Orchestrix" />
        <div className="container mx-auto py-6">
          <OverviewDashboardView />
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}