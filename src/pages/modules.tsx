import React, { useState } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Users, 
  MessageSquare, 
  DollarSign, 
  Package,
  Settings,
  Plus,
  Eye
} from "lucide-react";
import { ModuleLightbox } from "@/components/Modules/ModuleLightbox";

interface Module {
  id: string;
  name: string;
  description: string;
  icon: any;
  category: string;
  status: "active" | "inactive" | "coming-soon";
  title: string;
  tagline: string;
  features: string[];
  interfaceTitle: string;
}

const globalModules: Module[] = [
  {
    id: "events",
    name: "Event Management",
    description: "Comprehensive event planning and coordination tools",
    icon: Calendar,
    category: "Core",
    status: "active",
    title: "Event Management Suite",
    tagline: "Master your event timelines and logistics",
    features: ["Timeline Builder", "Run of Show", "Vendor Portal"],
    interfaceTitle: "Events Dashboard"
  },
  {
    id: "crm",
    name: "Client Relationship",
    description: "Manage clients, leads, and communication",
    icon: Users,
    category: "Core",
    status: "active",
    title: "Client Relationship Manager",
    tagline: "Turn leads into loyal clients",
    features: ["Lead Pipeline", "Contract Signing", "Client Portal"],
    interfaceTitle: "CRM Overview"
  },
  {
    id: "communication",
    name: "Team Chats",
    description: "Real-time team collaboration and messaging",
    icon: MessageSquare,
    category: "Communication",
    status: "active",
    title: "Team Communication Hub",
    tagline: "Centralized chat for seamless coordination",
    features: ["Channel Management", "Direct Messaging", "File Sharing"],
    interfaceTitle: "Team Chats"
  },
  {
    id: "finance",
    name: "Financial Management",
    description: "Invoicing, payments, and financial tracking",
    icon: DollarSign,
    category: "Finance",
    status: "active",
    title: "Financial Control Center",
    tagline: "Track every penny of your event budget",
    features: ["Invoice Generation", "Expense Tracking", "Payment Gateway"],
    interfaceTitle: "Finance Dashboard"
  },
  {
    id: "resources",
    name: "Resource Management",
    description: "Staff, vendors, and inventory management",
    icon: Package,
    category: "Operations",
    status: "coming-soon",
    title: "Resource Manager",
    tagline: "Optimize your team and inventory",
    features: ["Staff Scheduling", "Inventory Tracking", "Vendor Directory"],
    interfaceTitle: "Resource Hub"
  },
  {
    id: "settings",
    name: "System Settings",
    description: "Configure system preferences and integrations",
    icon: Settings,
    category: "System",
    status: "active",
    title: "System Configuration",
    tagline: "Customize your Orchestrix experience",
    features: ["User Management", "Integrations", "Audit Logs"],
    interfaceTitle: "Settings"
  },
];

export default function ModulesPage() {
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);

  return (
    <ProtectedRoute>
      <SEO title="Global Modules | Orchestrix" />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Global Modules</h1>
            <p className="text-muted-foreground">Manage and configure system modules</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Module
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {globalModules.map((module) => (
            <Card key={module.id} className="relative overflow-hidden">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <module.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{module.name}</CardTitle>
                      <Badge 
                        variant={
                          module.status === "active" ? "default" : 
                          module.status === "inactive" ? "secondary" : 
                          "outline"
                        }
                        className="mt-1"
                      >
                        {module.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">{module.description}</CardDescription>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setSelectedModule(module)}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <ModuleLightbox
        module={selectedModule}
        isOpen={!!selectedModule}
        onClose={() => setSelectedModule(null)}
      />
    </ProtectedRoute>
  );
}