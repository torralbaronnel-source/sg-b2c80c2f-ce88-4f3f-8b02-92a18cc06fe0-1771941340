import { AppLayout } from "@/components/Layout/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

export default function VenuesPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Venue Management</h1>
            <p className="text-slate-500 text-lg">Track locations, floor plans, and venue contacts.</p>
          </div>
          <Card className="border-none shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center h-96 border-2 border-dashed rounded-lg bg-slate-50">
                <div className="text-center text-slate-500">
                  <MapPin className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p className="font-medium text-lg">Venue Database & Maps</p>
                  <p className="text-sm">Manage logistics and seating charts per location.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}