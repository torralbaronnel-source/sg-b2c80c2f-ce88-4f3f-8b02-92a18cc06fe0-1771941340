import React from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SEO } from "@/components/SEO";

export default function VenuesPage() {
  return (
    <ProtectedRoute>
      <SEO title="Venues | Orchestrix" />
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Venues</h1>
          <p className="text-muted-foreground">Manage venue database and availability</p>
        </div>
        {/* Venue management interface will be built here */}
      </div>
    </ProtectedRoute>
  );
}