import React from "react";
import { AppLayout } from "@/components/Layout/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { FinanceDashboardView } from "@/components/Finance/FinanceDashboardView";

export default function CompanyFinance() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="p-6">
          <FinanceDashboardView />
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}