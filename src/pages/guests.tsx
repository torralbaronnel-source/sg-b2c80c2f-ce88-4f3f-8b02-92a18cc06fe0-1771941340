import { AppLayout } from "@/components/Layout/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { GuestManifestView } from "@/components/Events/GuestManifestView";
import { Users } from "lucide-react";

export default function GuestsPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="p-6 max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 rounded-xl">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Front of House</h1>
                <p className="text-sm font-medium text-slate-500">Live Guest Manifest & Attendance Tracking</p>
              </div>
            </div>
          </div>
          
          <GuestManifestView />
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}