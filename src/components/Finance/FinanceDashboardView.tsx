import React from "react";
import { 
  Wallet, 
  Receipt, 
  TrendingUp, 
  ShieldAlert, 
  Clock, 
  ArrowRight,
  Calculator,
  FileSpreadsheet,
  Lock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export function FinanceDashboardView() {
  const upcomingFeatures = [
    {
      title: "Automated Invoicing",
      description: "Generate and track client payments directly from event quotes.",
      icon: Receipt,
      status: "In Development"
    },
    {
      title: "Budget Reconciliation",
      description: "Real-time tracking of production expenses vs. event budget.",
      icon: Calculator,
      status: "Alpha"
    },
    {
      title: "Vendor Payouts",
      description: "Secure, audited payment workflows for event contractors.",
      icon: Wallet,
      status: "Backlog"
    }
  ];

  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl w-full text-center space-y-8"
      >
        {/* Main Status Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-widest mb-4">
            <Lock className="h-3 w-3" /> Under Development
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground">
            Financial <span className="text-primary">Intelligence</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            We're currently fine-tuning our fiscal management engine to ensure bank-grade security and precision for your event budgets.
          </p>
        </div>

        {/* Feature Preview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          {upcomingFeatures.map((feature, i) => (
            <Card key={i} className="bg-background/50 backdrop-blur-sm border-dashed relative group overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                <feature.icon className="h-12 w-12" />
              </div>
              <CardHeader className="pb-2">
                <Badge variant="outline" className="w-fit text-[10px] mb-2 border-primary/20 bg-primary/5">
                  {feature.status}
                </Badge>
                <CardTitle className="text-base font-bold">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Callouts */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button size="lg" className="w-full sm:w-auto font-bold shadow-lg shadow-primary/20">
            Notify Me on Launch
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" size="lg" className="w-full sm:w-auto border-dashed">
            View Roadmap
          </Button>
        </div>

        {/* Live Status Ticker */}
        <div className="pt-8 flex items-center justify-center gap-6 border-t border-border/50">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-emerald-500" />
            <span className="text-xs font-medium text-muted-foreground">Security Audited</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-500" />
            <span className="text-xs font-medium text-muted-foreground">Q3 2026 Target</span>
          </div>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4 text-purple-500" />
            <span className="text-xs font-medium text-muted-foreground">Beta Phase</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}