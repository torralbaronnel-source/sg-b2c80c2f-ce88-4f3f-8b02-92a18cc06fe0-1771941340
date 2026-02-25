import { AppLayout } from "@/components/Layout/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function VenuesPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="p-8">
          <h1 className="text-3xl font-bold">Venue Directory</h1>
          <p className="text-muted-foreground mt-2">Manage event spaces, capacity, and contact info.</p>
          <div className="mt-8 border-2 border-dashed rounded-lg h-96 flex items-center justify-center text-muted-foreground">
            Venues Module (Coming Soon)
          </div>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}