import React, { useState } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Calendar, 
  MessageSquare, 
  Wallet, 
  Settings, 
  Zap, 
  Plus, 
  CheckCircle2, 
  Layout, 
  ShieldCheck,
  Package,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { ModuleLightbox } from "@/components/Modules/ModuleLightbox";
import { useToast } from "@/hooks/use-toast";

const availableModules = [
  {
    id: "crm",
    title: "Client CRM",
    description: "Manage inquiries, bookings, and client relationships in one place.",
    icon: Users,
    category: "Business",
    status: "active",
    features: ["Lead Tracking", "Client Portal", "Contract Management"]
  },
  {
    id: "events",
    title: "Event Hub",
    description: "Live production timelines, task lists, and milestone tracking.",
    icon: Calendar,
    category: "Production",
    status: "active",
    features: ["Master Timeline", "Task Manager", "Live Dashboard"]
  },
  {
    id: "finance",
    title: "Finance Engine",
    description: "Budget tracking, payment schedules, and expense management.",
    icon: Wallet,
    category: "Finance",
    status: "active",
    features: ["Budget Tracker", "Payment Reminders", "Expense Reports"]
  },
  {
    id: "communication",
    title: "Comm Center",
    description: "Unified messaging hub for clients, vendors, and your team.",
    icon: MessageSquare,
    category: "Communication",
    status: "active",
    features: ["WhatsApp Sync", "Team Chat", "Broadcasts"]
  },
  {
    id: "vendor",
    title: "Vendor Network",
    description: "Database of trusted vendors with ratings and contracts.",
    icon: ShieldCheck,
    category: "Production",
    status: "coming-soon",
    features: ["Vendor Directory", "Contract Archive", "Availability Check"]
  },
  {
    id: "design",
    title: "Floor Plan Designer",
    description: "Interactive seating charts and floor plan builder.",
    icon: Layout,
    category: "Creative",
    status: "coming-soon",
    features: ["Drag & Drop Seating", "Venue Templates", "VIP Mapping"]
  }
];

export default function ModulesPage() {
  const [selectedModule, setSelectedModule] = useState<any>(null);
  const { toast } = useToast();

  const handleInstall = (module: any) => {
    toast({
      title: "Module Updated",
      description: `${module.title} has been configured for your current node.`,
    });
  };

  return (
    <ProtectedRoute>
      <SEO title="Modules Marketplace | Orchestrix" />
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl text-white shadow-xl">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="h-5 w-5 fill-primary" />
              <span className="font-bold tracking-widest uppercase text-xs">Customizable OS</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight">Capabilities Library</h1>
            <p className="text-gray-400 max-w-lg">Extend your production environment with specialized modules designed for high-end events.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-2xl font-bold">4/12</div>
              <div className="text-xs text-gray-400 uppercase tracking-widest">Active Modules</div>
            </div>
            <Button className="bg-white text-gray-900 hover:bg-gray-100 font-bold px-6">
              Request Custom Build
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {availableModules.map((module) => (
            <Card key={module.id} className="flex flex-col border-gray-100 hover:border-primary/20 transition-all duration-300 hover:shadow-xl group">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-3 bg-gray-50 rounded-xl text-gray-600 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <module.icon className="h-6 w-6" />
                  </div>
                  <Badge variant={module.status === "active" ? "default" : "secondary"}>
                    {module.status === "active" ? "INSTALLED" : "COMING SOON"}
                  </Badge>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">{module.title}</CardTitle>
                <CardDescription className="line-clamp-2 leading-relaxed">{module.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <div className="space-y-2">
                  {module.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                      {feature}
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <div className="flex gap-2 w-full">
                  <Button 
                    variant="outline" 
                    className="flex-1 font-semibold"
                    onClick={() => setSelectedModule(module)}
                  >
                    View Docs
                  </Button>
                  <Button 
                    className="flex-1 bg-gray-900 text-white hover:bg-gray-800 font-semibold gap-2"
                    disabled={module.status !== "active"}
                    onClick={() => handleInstall(module)}
                  >
                    Manage
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        {selectedModule && (
          <ModuleLightbox 
            module={selectedModule} 
            isOpen={!!selectedModule} 
            onClose={() => setSelectedModule(null)} 
          />
        )}
      </div>
    </ProtectedRoute>
  );
}