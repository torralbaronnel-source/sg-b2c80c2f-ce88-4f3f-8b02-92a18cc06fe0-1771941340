import React, { useEffect, useState } from "react";
import { 
  Building2, 
  Users, 
  Calendar, 
  ShieldCheck, 
  Search,
  MoreVertical,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Zap,
  CreditCard,
  PlusCircle,
  LayoutDashboard,
  Star
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { ConciergeManager } from "./ConciergeManager";

interface Organization {
  id: string;
  name: string;
  logo_url: string | null;
  subscription_tier: string;
  subscription_status: string;
  created_at: string;
}

export function SuperAdminView() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    users: 0,
    events: 0,
    organizations: 0,
    activeEvents: 0
  });

  const tabs = [
    { id: "overview", label: "System Overview", icon: LayoutDashboard },
    { id: "users", label: "User Management", icon: Users },
    { id: "concierge", label: "Private Concierge", icon: Star },
    { id: "events", label: "Global Events", icon: Calendar },
    { id: "settings", label: "Infrastructure", icon: ShieldCheck },
  ];

  useEffect(() => {
    fetchStats();
    fetchOrganizations();
  }, []);

  const fetchStats = async () => {
    const { count: userCount } = await supabase.from("profiles").select("*", { count: "exact", head: true });
    const { count: eventCount } = await supabase.from("events").select("*", { count: "exact", head: true });
    const { count: orgCount } = await supabase.from("organizations").select("*", { count: "exact", head: true });
    
    setStats({
      users: userCount || 0,
      events: eventCount || 0,
      organizations: orgCount || 0,
      activeEvents: eventCount || 0
    });
  };

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("organizations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrganizations(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching organizations",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSubscription = async (orgId: string, tier: string) => {
    try {
      const { error } = await supabase
        .from("organizations")
        .update({ subscription_tier: tier })
        .eq("id", orgId);

      if (error) throw error;
      
      toast({
        title: "Subscription updated",
        description: `Organization tier changed to ${tier.toUpperCase()}`,
      });
      
      fetchOrganizations();
    } catch (error: any) {
      toast({
        title: "Failed to update subscription",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredOrgs = organizations.filter(org => 
    org.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Super Admin Panel</h1>
          <p className="text-muted-foreground">Platform-wide tenant management and oversight.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={fetchOrganizations} variant="outline" size="sm">
            Refresh Data
          </Button>
          <Button size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            Provision Tenant
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.organizations}</div>
            <p className="text-xs text-muted-foreground">Across all regions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{organizations.filter(o => o.subscription_status === "active").length}</div>
            <p className="text-xs text-green-500 font-medium">Healthy MRR</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enterprise Clients</CardTitle>
            <Zap className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{organizations.filter(o => o.subscription_tier === "enterprise").length}</div>
            <p className="text-xs text-muted-foreground">High-value contracts</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tenant Management</CardTitle>
          <CardDescription>Manage organization accounts, billing, and access.</CardDescription>
          <div className="flex items-center pt-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search organizations..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organization</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                    Loading tenants...
                  </TableCell>
                </TableRow>
              ) : filteredOrgs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                    No organizations found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrgs.map((org) => (
                  <TableRow key={org.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded bg-muted flex items-center justify-center overflow-hidden">
                          {org.logo_url ? (
                            <img src={org.logo_url} alt={org.name} className="h-full w-full object-contain" />
                          ) : (
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium">{org.name}</span>
                          <span className="text-xs text-muted-foreground truncate w-32">{org.id}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={org.subscription_status === "active" ? "default" : "secondary"}>
                        {org.subscription_status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={
                          org.subscription_tier === "enterprise" ? "border-yellow-500 text-yellow-500" :
                          org.subscription_tier === "pro" ? "border-blue-500 text-blue-500" : ""
                        }
                      >
                        {org.subscription_tier.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(org.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => updateSubscription(org.id, "free")}>
                            Set to FREE
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateSubscription(org.id, "pro")}>
                            Upgrade to PRO
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateSubscription(org.id, "enterprise")}>
                            Upgrade to ENTERPRISE
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            Suspend Tenant
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <TabsContent value="concierge" className="mt-6">
        <ConciergeManager />
      </TabsContent>

      <TabsContent value="users" className="mt-6">
      </TabsContent>
    </div>
  );
}