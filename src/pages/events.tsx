import React from "react";
import { AppLayout } from "@/components/Layout/AppLayout";
import { EventsDashboardView } from "@/components/Events/EventsDashboardView";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function EventsPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="p-6 lg:p-8">
          <EventsDashboardView />
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}