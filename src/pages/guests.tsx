import { AppLayout } from "@/components/Layout/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users2 } from "lucide-react";

export default function GuestsPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Guest List & RSVPs</h1>
            <p className="text-slate-500 text-lg">Manage attendee lists, seating, and dietary needs.</p>
          </div>
          <Card className="border-none shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center h-96 border-2 border-dashed rounded-lg bg-slate-50">
                <div className="text-center text-slate-500">
                  <Users2 className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p className="font-medium text-lg">RSVP Tracking System</p>
                  <p className="text-sm">Monitor responses and meal preferences in real-time.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}