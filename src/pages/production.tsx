import React from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ProductionHubView } from "@/components/Production/ProductionHubView";
import { SEO } from "@/components/SEO";

export default function ProductionPage() {
  return (
    <ProtectedRoute>
      <SEO title="Production Hub | Orchestrix" />
      <ProductionHubView />
    </ProtectedRoute>
  );
}