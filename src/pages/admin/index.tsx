import { PortalAdminView } from "@/components/Admin/PortalAdminView";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SEO } from "@/components/SEO";

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <SEO title="Portal Admin | Orchestrix" />
      <PortalAdminView />
    </ProtectedRoute>
  );
}