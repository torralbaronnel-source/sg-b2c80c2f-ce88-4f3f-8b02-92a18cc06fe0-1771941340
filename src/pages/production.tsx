import { AppLayout } from "@/components/Layout/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ProductionHubView } from "@/components/Production/ProductionHubView";
import { SEO } from "@/components/SEO";

export default function ProductionPage() {
  return (
    <ProtectedRoute>
      <SEO title="Production Hub | Orchestrix" />
      <AppLayout>
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Production Hub</h1>
            <p className="text-muted-foreground">
              Command center for live event execution and field operations.
            </p>
          </div>
          <ProductionHubView />
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}