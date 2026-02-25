import { AppLayout } from "@/components/Layout/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

export default function TimelinesPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Event Timelines</h1>
            <p className="text-slate-500 text-lg">Schedule and track production flows for all events.</p>
          </div>
          <Card className="border-none shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center h-96 border-2 border-dashed rounded-lg bg-slate-50">
                <div className="text-center text-slate-500">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p className="font-medium text-lg">Master Timeline Builder</p>
                  <p className="text-sm">Configure event programs and cue sheets here.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}