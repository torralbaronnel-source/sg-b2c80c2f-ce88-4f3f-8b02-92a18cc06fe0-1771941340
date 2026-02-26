import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Users, Building, Activity, Lock, AlertTriangle } from "lucide-react";
import { UserManagementView } from "./UserManagementView";
import { OrgManagementView } from "./OrgManagementView";
import { RolesManagementView } from "./RolesManagementView";
import { RoleAnalyticsView } from "./RoleAnalyticsView";

export function SuperAdminView() {
  const { profile } = useAuth();

  // Standardize the "Neural Gate" for super_admin access
  if (!profile || profile.role !== "super_admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center p-8">
        <div className="bg-destructive/10 p-6 rounded-full">
          <Shield className="w-16 h-16 text-destructive" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-destructive">Access Restricted</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            This command node is reserved for <strong>Super Administrators</strong> only. 
            Unauthorized access attempts are logged to the Neural Ledger.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            Super Admin Console
          </h1>
          <p className="text-muted-foreground">
            Global system orchestration and high-level node management.
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 border">
          <TabsTrigger value="overview" className="gap-2">
            <Activity className="w-4 h-4" /> Overview
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-2">
            <Users className="w-4 h-4" /> Users
          </TabsTrigger>
          <TabsTrigger value="orgs" className="gap-2">
            <Building className="w-4 h-4" /> Organizations
          </TabsTrigger>
          <TabsTrigger value="roles" className="gap-2">
            <Lock className="w-4 h-4" /> Permissions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">OPERATIONAL</div>
                <p className="text-xs text-muted-foreground mt-1">All neural pathways active</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Total Nodes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,284</div>
                <p className="text-xs text-muted-foreground mt-1">+12 in the last 24h</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Active Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42</div>
                <p className="text-xs text-muted-foreground mt-1">Real-time telemetry active</p>
              </CardContent>
            </Card>
          </div>
          <RoleAnalyticsView />
        </TabsContent>

        <TabsContent value="users">
          <UserManagementView />
        </TabsContent>

        <TabsContent value="orgs">
          <OrgManagementView />
        </TabsContent>

        <TabsContent value="roles">
          <RolesManagementView />
        </TabsContent>
      </Tabs>
    </div>
  );
}