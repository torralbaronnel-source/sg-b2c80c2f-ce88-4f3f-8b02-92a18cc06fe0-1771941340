import React from "react";
import { AppLayout } from "@/components/Layout/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SEO } from "@/components/SEO";
import { EventsDashboardView } from "@/components/Events/EventsDashboardView";

export default function EventsPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <SEO title="Events | Orchestrix" />
        <EventsDashboardView />
      </AppLayout>
    </ProtectedRoute>
  );
}