import { NanoCommandCenter } from "@/components/NANO/NanoCommandCenter";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function NanoPage() {
  return (
    <ProtectedRoute>
      <div className="p-6 max-w-7xl mx-auto w-full min-h-screen">
        <NanoCommandCenter />
      </div>
    </ProtectedRoute>
  );
}