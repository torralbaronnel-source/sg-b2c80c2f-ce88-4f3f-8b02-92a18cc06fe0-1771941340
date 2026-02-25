import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function QuotesPage() {
  return (
    <ProtectedRoute>
      <div className="p-8">
        <h1 className="text-3xl font-bold">Quotes</h1>
        <p className="text-muted-foreground">Create and manage client proposals.</p>
      </div>
    </ProtectedRoute>
  );
}