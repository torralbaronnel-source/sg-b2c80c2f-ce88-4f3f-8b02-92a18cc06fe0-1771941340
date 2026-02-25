import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, Wallet, Receipt, ArrowUpRight } from "lucide-react";

const formatPHP = (amount: number) => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(amount);
};

export function FinanceDashboardView() {
  const stats = [
    { title: "Total Revenue", value: formatPHP(1250000), icon: Wallet, trend: "+12.5%", color: "text-emerald-600" },
    { title: "Pending Invoices", value: formatPHP(450000), icon: Receipt, trend: "5 items", color: "text-amber-600" },
    { title: "Operating Expenses", value: formatPHP(280000), icon: TrendingDown, trend: "-4.2%", color: "text-rose-600" },
    { title: "Net Profit", value: formatPHP(970000), icon: TrendingUp, trend: "+18.2%", color: "text-blue-600" },
  ];

  const transactions = [
    { id: "TX-001", client: "Solaire Resort", event: "Grand Ballroom Gala", amount: 450000, status: "Paid", date: "2026-02-20" },
    { id: "TX-002", client: "Ayala Land", event: "Corporate Launch", amount: 250000, status: "Pending", date: "2026-02-22" },
    { id: "TX-003", client: "Okada Manila", event: "Wedding Production", amount: 180000, status: "Paid", date: "2026-02-18" },
    { id: "TX-004", client: "Marriott Clark", event: "Tech Summit", amount: 320000, status: "Overdue", date: "2026-02-10" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-stone-100 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className="h-5 w-5 text-stone-400" />
                <span className={`text-xs font-bold ${stat.color}`}>{stat.trend}</span>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-stone-500 uppercase tracking-wider">{stat.title}</p>
                <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-stone-100 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-bold uppercase tracking-widest text-brand-primary">Recent Transactions</CardTitle>
          <Badge variant="outline" className="text-[10px] font-bold tracking-widest uppercase">All Activities (PHP)</Badge>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-stone-100">
                <TableHead className="text-xs uppercase font-bold text-stone-400">Transaction ID</TableHead>
                <TableHead className="text-xs uppercase font-bold text-stone-400">Client / Event</TableHead>
                <TableHead className="text-xs uppercase font-bold text-stone-400 text-right">Amount</TableHead>
                <TableHead className="text-xs uppercase font-bold text-stone-400 text-center">Status</TableHead>
                <TableHead className="text-xs uppercase font-bold text-stone-400 text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.id} className="group hover:bg-stone-50/50 border-stone-100 transition-colors">
                  <TableCell className="font-mono text-xs text-stone-500">{tx.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-brand-primary">{tx.client}</span>
                      <span className="text-xs text-stone-400">{tx.event}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-bold text-brand-primary">
                    {formatPHP(tx.amount)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge 
                      className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full ${
                        tx.status === "Paid" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                        tx.status === "Pending" ? "bg-amber-50 text-amber-700 border-amber-100" :
                        "bg-rose-50 text-rose-700 border-rose-100"
                      }`}
                    >
                      {tx.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-xs text-stone-500">{tx.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}