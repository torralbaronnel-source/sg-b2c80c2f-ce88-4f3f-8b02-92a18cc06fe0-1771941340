import React from "react";
import { AppLayout } from "@/components/Layout/AppLayout";
import { ProfileView } from "@/components/Profile/ProfileView";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="container py-10 px-4 md:px-8">
          <ProfileView />
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}