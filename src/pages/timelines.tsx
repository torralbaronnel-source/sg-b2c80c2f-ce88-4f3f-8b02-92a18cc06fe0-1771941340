import React from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SEO } from "@/components/SEO";

export default function TimelinesPage() {
  return (
    <ProtectedRoute>
      <SEO title="Event Timelines | Orchestrix" />
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Event Timelines</h1>
          <p className="text-muted-foreground">Manage event schedules and production timelines</p>
        </div>
        {/* Timeline management interface will be built here */}
      </div>
    </ProtectedRoute>
  );
}