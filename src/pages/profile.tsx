import React from "react";
import { SEO } from "@/components/SEO";
import { ProfileView } from "@/components/Profile/ProfileView";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <SEO title="My Profile | Orchestrix" />
      <ProfileView />
    </ProtectedRoute>
  );
}