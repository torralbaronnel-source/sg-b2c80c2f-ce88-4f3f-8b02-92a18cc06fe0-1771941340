import React from "react";
import { SEO } from "@/components/SEO";
import { WhatsAppManagerView } from "@/components/WhatsApp/WhatsAppManagerView";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function WhatsAppPage() {
  return (
    <ProtectedRoute>
      <SEO title="AI Assistant | Orchestrix" />
      <WhatsAppManagerView />
    </ProtectedRoute>
  );
}