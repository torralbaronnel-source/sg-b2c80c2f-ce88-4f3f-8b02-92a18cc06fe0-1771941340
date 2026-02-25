import { AppLayout } from "@/components/Layout/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function InvoicesPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="p-8">
          <h1 className="text-3xl font-bold">Invoices</h1>
          <p className="text-muted-foreground mt-2">Manage billing and payment status.</p>
          <div className="mt-8 border-2 border-dashed rounded-lg h-96 flex items-center justify-center text-muted-foreground">
            Invoices Module (Coming Soon)
          </div>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}