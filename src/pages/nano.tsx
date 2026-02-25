import { NanoCommandCenter } from "@/components/NANO/NanoCommandCenter";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function NanoPage() {
  return (
    <ProtectedRoute>
      <div className="w-full">
        <NanoCommandCenter />
      </div>
    </ProtectedRoute>
  );
}