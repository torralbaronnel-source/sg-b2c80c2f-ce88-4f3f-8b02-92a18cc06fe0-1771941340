import React from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { EventsDashboardView } from "@/components/Events/EventsDashboardView";
import { SEO } from "@/components/SEO";

export default function EventsPage() {
  return (
    <ProtectedRoute>
      <SEO title="Events | Orchestrix" />
      <EventsDashboardView />
    </ProtectedRoute>
  );
}