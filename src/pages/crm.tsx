import React from "react";
import { AppLayout } from "@/components/Layout/AppLayout";
import { CRMDashboardView } from "@/components/CRM/CRMDashboardView";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function CRMPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="p-6 lg:p-8">
          <CRMDashboardView />
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}