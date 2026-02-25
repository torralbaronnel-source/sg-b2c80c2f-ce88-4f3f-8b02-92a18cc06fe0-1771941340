import { AppLayout } from "@/components/Layout/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function QuotesPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Quotes & Proposals</h1>
            <p className="text-slate-500 text-lg">Generate and track formal production estimates.</p>
          </div>
          <Card className="border-none shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center h-96 border-2 border-dashed rounded-lg bg-slate-50">
                <div className="text-center text-slate-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p className="font-medium text-lg">Quote Generator</p>
                  <p className="text-sm">Create detailed cost breakdowns for clients.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}