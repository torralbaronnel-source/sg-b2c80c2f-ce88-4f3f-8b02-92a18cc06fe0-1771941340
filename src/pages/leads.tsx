import { AppLayout } from "@/components/Layout/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function LeadsPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="p-8">
          <h1 className="text-3xl font-bold">Leads & Pipeline</h1>
          <p className="text-muted-foreground mt-2">Manage your lead stages and sales pipeline.</p>
          <div className="mt-8 border-2 border-dashed rounded-lg h-96 flex items-center justify-center text-muted-foreground">
            Pipeline Module (Coming Soon)
          </div>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}