import React from "react";
import { AppLayout } from "@/components/Layout/AppLayout";
import { FinanceDashboardView } from "@/components/Finance/FinanceDashboardView";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function FinancePage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="p-6 lg:p-8">
          <FinanceDashboardView />
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}