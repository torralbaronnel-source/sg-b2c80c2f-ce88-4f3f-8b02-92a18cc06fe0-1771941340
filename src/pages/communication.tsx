import React from "react";
import { AppLayout } from "@/components/Layout/AppLayout";
import { CommunicationDashboardView } from "@/components/Communication/CommunicationDashboardView";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function CommunicationPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="p-6 lg:p-8">
          <CommunicationDashboardView />
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}