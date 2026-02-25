import React from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SEO } from "@/components/SEO";

export default function LeadsPage() {
  return (
    <ProtectedRoute>
      <SEO title="Leads & Pipeline | Orchestrix" />
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leads & Pipeline</h1>
          <p className="text-muted-foreground">Manage your sales pipeline and lead tracking</p>
        </div>
        {/* Lead management interface will be built here */}
      </div>
    </ProtectedRoute>
  );
}