import { AppLayout } from "@/components/Layout/AppLayout";
import { NanoCommandCenter } from "@/components/NANO/NanoCommandCenter";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SEO } from "@/components/SEO";

export default function NanoPage() {
  return (
    <ProtectedRoute>
      <SEO title="NANO Core | Orchestrix" />
      <AppLayout>
        <div className="container mx-auto p-6">
          <NanoCommandCenter />
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}