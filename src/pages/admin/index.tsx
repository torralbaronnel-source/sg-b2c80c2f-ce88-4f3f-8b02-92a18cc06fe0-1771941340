import React from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SuperAdminView } from "@/components/Admin/SuperAdminView";
import { SEO } from "@/components/SEO";

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <SEO title="Admin Portal | Orchestrix" />
      <SuperAdminView />
    </ProtectedRoute>
  );
}