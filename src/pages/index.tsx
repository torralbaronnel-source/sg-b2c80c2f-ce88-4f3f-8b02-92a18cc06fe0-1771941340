import React from "react";
import { AppLayout } from "@/components/Layout/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { OverviewDashboardView } from "@/components/Dashboard/OverviewDashboardView";

export default function IndexPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <OverviewDashboardView />
      </AppLayout>
    </ProtectedRoute>
  );
}