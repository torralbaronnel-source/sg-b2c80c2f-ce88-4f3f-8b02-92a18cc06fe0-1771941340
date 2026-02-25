import React from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { CommunicationDashboardView } from "@/components/Communication/CommunicationDashboardView";
import { SEO } from "@/components/SEO";

export default function CommunicationPage() {
  return (
    <ProtectedRoute>
      <SEO title="Team Chats | Orchestrix" />
      <CommunicationDashboardView />
    </ProtectedRoute>
  );
}