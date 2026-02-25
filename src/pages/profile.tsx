import React from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ProfileView } from "@/components/Profile/ProfileView";
import { SEO } from "@/components/SEO";

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <SEO title="Profile | Orchestrix" />
      <ProfileView />
    </ProtectedRoute>
  );
}