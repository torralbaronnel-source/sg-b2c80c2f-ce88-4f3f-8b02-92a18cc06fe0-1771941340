import { AppLayout } from "@/components/Layout/AppLayout";
import { ProductionHubView } from "@/components/Production/ProductionHubView";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SEO } from "@/components/SEO";

export default function ProductionPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <SEO title="Production Hub | Orchestrix" description="Manage your production workflows and technical assets." />
        <div className="p-4 md:p-6">
          <ProductionHubView />
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}