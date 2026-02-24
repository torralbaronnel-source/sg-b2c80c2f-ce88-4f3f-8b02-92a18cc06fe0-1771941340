import React from "react";
import { AppLayout } from "@/components/Layout/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SuperAdminView } from "@/components/Admin/SuperAdminView";
import { SEO } from "@/components/SEO";

export default function SuperAdminPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <SEO title="Super Admin | Orchestrix" />
        <SuperAdminView />
      </AppLayout>
    </ProtectedRoute>
  );
}