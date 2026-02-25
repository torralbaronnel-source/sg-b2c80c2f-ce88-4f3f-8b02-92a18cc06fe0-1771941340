import { ProfileView } from "@/components/Profile/ProfileView";
import { AppLayout } from "@/components/Layout/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SEO } from "@/components/SEO";

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <SEO title="Profile | Orchestrix" />
        <ProfileView />
      </AppLayout>
    </ProtectedRoute>
  );
}