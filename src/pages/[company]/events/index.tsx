import React from "react";
import { AppLayout } from "@/components/Layout/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { EventsDashboardView } from "@/components/Events/EventsDashboardView";

export default function CompanyEvents() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="p-6">
          <EventsDashboardView />
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}