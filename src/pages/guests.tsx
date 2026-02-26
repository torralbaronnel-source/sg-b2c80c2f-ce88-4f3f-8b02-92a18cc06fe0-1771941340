import React from "react";
import { AppLayout } from "@/components/Layout/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SEO } from "@/components/SEO";
import { GuestManifestView } from "@/components/Events/GuestManifestView";

export default function GuestManifestPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <SEO title="Guest Manifest | Orchestrix" />
        <GuestManifestView />
      </AppLayout>
    </ProtectedRoute>
  );
}