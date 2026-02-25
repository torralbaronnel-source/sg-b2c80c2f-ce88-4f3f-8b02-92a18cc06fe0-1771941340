import React from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SEO } from "@/components/SEO";

export default function InvoicesPage() {
  return (
    <ProtectedRoute>
      <SEO title="Invoices | Orchestrix" />
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
          <p className="text-muted-foreground">Manage invoices and payment tracking</p>
        </div>
        {/* Invoice management interface will be built here */}
      </div>
    </ProtectedRoute>
  );
}