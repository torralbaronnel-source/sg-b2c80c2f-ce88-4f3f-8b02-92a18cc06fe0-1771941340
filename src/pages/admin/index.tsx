import React from "react";
import { SEO } from "@/components/SEO";
import { PortalAdminView } from "@/components/Admin/PortalAdminView";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <SEO title="Portal Admin | Orchestrix" />
      <PortalAdminView />
    </ProtectedRoute>
  );
}