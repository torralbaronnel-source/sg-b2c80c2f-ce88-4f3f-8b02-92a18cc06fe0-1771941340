import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function InvoicesPage() {
  return (
    <ProtectedRoute>
      <div className="p-8">
        <h1 className="text-3xl font-bold">Invoices</h1>
        <p className="text-muted-foreground">Billing and payment tracking.</p>
      </div>
    </ProtectedRoute>
  );
}