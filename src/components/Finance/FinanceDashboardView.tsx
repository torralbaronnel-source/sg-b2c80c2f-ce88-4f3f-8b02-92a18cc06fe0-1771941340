import React from "react";
import { 
  Wallet, 
  Receipt, 
  TrendingUp, 
  ShieldAlert, 
  ArrowRight,
  Clock,
  Lock,
  Calendar,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const upcomingModules = [
  {
    title: "Automated Invoicing",
    description: "Generate and send professional invoices based on event service tiers automatically.",
    icon: Receipt,
    status: "In Development",
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    title: "Budget Reconciliation",
    description: "Real-time tracking of event expenses vs projections with automated variance alerts.",
    icon: Wallet,
    status: "Alpha Testing",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10"
  },
  {
    title: "Vendor Payouts",
    description: "Secure gateway for managing multiple vendor contracts and scheduled payments.",
    icon: ShieldAlert,
    status: "Backlog",
    color: "text-purple-500",
    bg: "bg-purple-500/10"
  },
  {
    title: "Financial Analytics",
    description: "Deep dive into profit margins, event ROI, and historical revenue trends.",
    icon: TrendingUp,
    status: "Planning",
    color: "text-orange-500",
    bg: "bg-orange-500/10"
  }
];

export function FinanceDashboardView() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 md:p-8 space-y-12">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-2xl space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary mb-4">
          <Clock className="w-4 h-4 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider">Module Under Construction</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Next-Gen Finance Engine <span className="text-primary">Incoming</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          We're building a high-precision financial ecosystem for Orchestrix. 
          Manage quotes, invoices, and budgets with enterprise-grade reliability.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Button size="lg" className="rounded-full shadow-lg shadow-primary/20">
            Notify Me on Launch
          </Button>
          <Button variant="outline" size="lg" className="rounded-full">
            View Roadmap <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </motion.div>

      {/* Feature Preview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl">
        {upcomingModules.map((module, index) => (
          <motion.div
            key={module.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full border-muted/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300">
              <CardHeader>
                <div className={`w-12 h-12 rounded-xl ${module.bg} flex items-center justify-center mb-2`}>
                  <module.icon className={`w-6 h-6 ${module.color}`} />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-lg">{module.title}</CardTitle>
                  <Badge variant="outline" className="text-[10px] font-medium opacity-70">
                    {module.status}
                  </Badge>
                </div>
                <CardDescription className="text-sm pt-2">
                  {module.description}
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Security & Trust Footer */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="pt-12 border-t border-muted/30 w-full max-w-4xl text-center"
      >
        <div className="flex flex-wrap justify-center gap-8 text-muted-foreground/60 grayscale opacity-70">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            <span className="text-sm font-medium">Bank-Level Encryption</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5" />
            <span className="text-sm font-medium">Auto-Audit Ready</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            <span className="text-sm font-medium">High-Performance Sync</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            <span className="text-sm font-medium">Target Release: Q2 2026</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}