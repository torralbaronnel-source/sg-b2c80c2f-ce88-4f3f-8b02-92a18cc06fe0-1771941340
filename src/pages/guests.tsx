import React from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SEO } from "@/components/SEO";

export default function GuestsPage() {
  return (
    <ProtectedRoute>
      <SEO title="Guest Lists | Orchestrix" />
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Guest Lists</h1>
          <p className="text-muted-foreground">Manage guest lists, RSVPs, and seating arrangements</p>
        </div>
        {/* Guest management interface will be built here */}
      </div>
    </ProtectedRoute>
  );
}