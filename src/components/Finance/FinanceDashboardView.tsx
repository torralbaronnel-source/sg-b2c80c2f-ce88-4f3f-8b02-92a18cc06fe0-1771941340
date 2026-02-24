import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Receipt, CreditCard, TrendingUp } from "lucide-react";

export function FinanceDashboardView() {
  const metrics = [
    { label: "Total Revenue", value: "₱1,250,000", icon: DollarSign, color: "text-emerald-600" },
    { label: "Total Expenses", value: "₱450,000", icon: Receipt, color: "text-red-600" },
    { label: "Pending Invoices", value: "15", icon: CreditCard, color: "text-amber-600" },
    { label: "Profit Margin", value: "64%", icon: TrendingUp, color: "text-blue-600" },
  ];

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-2xl font-bold text-slate-900">Finance & Budget</h1>
        <p className="text-slate-500 text-sm">Track payments, expenses, and profitability.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{metric.label}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{metric.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-slate-50 ${metric.color}`}>
                  <metric.icon size={20} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}