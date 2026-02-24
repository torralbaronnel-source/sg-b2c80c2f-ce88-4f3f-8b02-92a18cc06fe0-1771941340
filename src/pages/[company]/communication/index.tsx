import React from "react";
import { AppLayout } from "@/components/Layout/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { CommunicationDashboardView } from "@/components/Communication/CommunicationDashboardView";

export default function CompanyCommunication() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="p-6">
          <CommunicationDashboardView />
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}