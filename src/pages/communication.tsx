import React from "react";
import { SEO } from "@/components/SEO";
import { CommunicationDashboardView } from "@/components/Communication/CommunicationDashboardView";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function CommunicationPage() {
  return (
    <ProtectedRoute>
      <SEO title="Communication | Orchestrix" />
      <CommunicationDashboardView />
    </ProtectedRoute>
  );
}