import React from "react";
import { SEO } from "@/components/SEO";
import { EventsDashboardView } from "@/components/Events/EventsDashboardView";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function EventsPage() {
  return (
    <ProtectedRoute>
      <SEO title="Production Hub | Orchestrix" />
      <EventsDashboardView />
    </ProtectedRoute>
  );
}