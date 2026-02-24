import React from "react";
import { AppLayout } from "@/components/Layout/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { CRMDashboardView } from "@/components/CRM/CRMDashboardView";

export default function CompanyCRM() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="p-6">
          <CRMDashboardView />
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}