import { ProtectedRoute } from "@/components/ProtectedRoute";
import { InventoryManager } from "@/components/Production/InventoryManager";
import { SEO } from "@/components/SEO";

export default function InventoryPage() {
  return (
    <ProtectedRoute>
      <SEO title="Inventory Manager | Orchestrix" description="Track and manage production assets, equipment, and rentals." />
      <div className="p-4 md:p-8">
        <InventoryManager />
      </div>
    </ProtectedRoute>
  );
}