import React from "react";
import { NanoCommandCenter } from "@/components/NANO/NanoCommandCenter";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppLayout } from "@/components/Layout/AppLayout";
import { SEO } from "@/components/SEO";

export default function NanoPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <SEO title="NANO Core | Orchestrix" />
        <NanoCommandCenter />
      </AppLayout>
    </ProtectedRoute>
  );
}