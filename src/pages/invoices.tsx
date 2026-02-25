import { AppLayout } from "@/components/Layout/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReceiptText } from "lucide-react";

export default function InvoicesPage() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Invoices & Payments</h1>
            <p className="text-slate-500 text-lg">Track billing, deposits, and financial statuses.</p>
          </div>
          <Card className="border-none shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center h-96 border-2 border-dashed rounded-lg bg-slate-50">
                <div className="text-center text-slate-500">
                  <ReceiptText className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p className="font-medium text-lg">Billing Center</p>
                  <p className="text-sm">Manage accounts receivable and payment reminders.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}