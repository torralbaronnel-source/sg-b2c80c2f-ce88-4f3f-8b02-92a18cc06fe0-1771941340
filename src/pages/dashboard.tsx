import React from "react";
import { AppLayout } from "@/components/Layout/AppLayout";
import { OverviewDashboardView } from "@/components/Dashboard/OverviewDashboardView";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="p-6 lg:p-8">
          <OverviewDashboardView />
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}