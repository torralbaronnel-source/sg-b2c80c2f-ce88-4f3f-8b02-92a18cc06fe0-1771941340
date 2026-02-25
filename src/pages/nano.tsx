import { NanoCommandCenter } from "@/components/NANO/NanoCommandCenter";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppLayout } from "@/components/Layout/AppLayout";

export default function NanoPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="flex-1 w-full h-[calc(100vh-4rem)] overflow-hidden">
          <NanoCommandCenter />
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}