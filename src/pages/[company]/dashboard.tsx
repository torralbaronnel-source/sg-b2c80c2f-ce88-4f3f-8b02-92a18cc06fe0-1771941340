import React from "react";
import { AppLayout } from "@/components/Layout/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { OverviewDashboardView } from "@/components/Dashboard/OverviewDashboardView";

export default function CompanyDashboard() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="p-6">
          <OverviewDashboardView />
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}