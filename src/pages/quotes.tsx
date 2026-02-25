import React from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SEO } from "@/components/SEO";

export default function QuotesPage() {
  return (
    <ProtectedRoute>
      <SEO title="Quotes | Orchestrix" />
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quotes</h1>
          <p className="text-muted-foreground">Create and manage client quotes</p>
        </div>
        {/* Quote management interface will be built here */}
      </div>
    </ProtectedRoute>
  );
}