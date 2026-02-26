import React, { useEffect, useState } from "react";
import { 
  Building2, 
  Users, 
  Calendar, 
  ShieldCheck, 
  Search,
  CheckCircle2,
  Activity,
  Settings,
  Wand2,
  Terminal,
  Database,
  Cpu,
  Bug,
  ChevronRight,
  ChevronDown,
  RefreshCcw,
  ShieldAlert
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
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { RolesManagementView } from "./RolesManagementView";
import { UserManagementView } from "./UserManagementView";
import { OrgManagementView } from "./OrgManagementView";
import { RoleAnalyticsView } from "./RoleAnalyticsView";
import { bugService, type BugReport } from "@/services/bugService";
import { format } from "date-fns";

export function SuperAdminView() {
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    users: 0,
    events: 0,
    organizations: 0,
    activeEvents: 0
  });
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [blueprintData, setBlueprintData] = useState({
    business_name: "",
    operational_needs: ""
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedBlueprint, setGeneratedBlueprint] = useState<any>(null);
  const { role } = useAuth();
  
  const [bugs, setBugs] = useState<BugReport[]>([]);
  const [isLoadingBugs, setIsLoadingBugs] = useState(true);
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [expandedBug, setExpandedBug] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
    fetchOrganizations();
    loadBugs();
  }, []);

  const fetchStats = async () => {
    try {
      const { count: userCount } = await supabase.from("profiles").select("*", { count: "exact", head: true });
      const { count: eventCount } = await supabase.from("events").select("*", { count: "exact", head: true });
      const { count: orgCount } = await supabase.from("organizations").select("*", { count: "exact", head: true });
      
      setStats({
        users: userCount || 0,
        events: eventCount || 0,
        organizations: orgCount || 0,
        activeEvents: eventCount || 0
      });
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
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

  const loadBugs = async () => {
    try {
      setIsLoadingBugs(true);
      const data = await bugService.getBugReports();
      setBugs(data);
    } catch (error) {
      console.error("Error loading bugs:", error);
    } finally {
      setIsLoadingBugs(false);
    }
  };

  const handleResolve = async (id: string) => {
    try {
      await bugService.resolveBug(id);
      toast({
        title: "Insight Archived",
        description: "Interaction pattern has been noted.",
      });
      loadBugs();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resolve bug.",
        variant: "destructive",
      });
    }
  };

  const handleGenerateBlueprint = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-server-blueprint', {
        body: blueprintData
      });
      if (error) throw error;
      setGeneratedBlueprint(data.blueprint);
      setWizardStep(3);
    } catch (err) {
      console.error("Error generating blueprint:", err);
      toast({
        title: "Generation failed",
        description: "Could not connect to NANO Core engine.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredBugs = bugs.filter(bug => {
    const matchesSearch = 
      bug.error_message?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      bug.url?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === "all" || bug.priority === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const isDev = (role as any)?.hierarchy_level === 0;

  if (!isDev) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-lg border-2 border-dashed border-red-100 bg-red-50 p-12 text-center">
        <div className="flex flex-col items-center gap-2">
          <ShieldAlert className="h-10 w-10 text-red-600" />
          <h3 className="text-lg font-bold text-red-900">Access Restricted</h3>
          <p className="max-w-xs text-sm text-red-600">This console is reserved for System Researchers only. Unauthorized access is logged.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Behavioral Insights Core</h1>
          <p className="text-muted-foreground">AI-Driven User Research & Behavioral Pattern Analysis.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={fetchOrganizations} variant="outline" size="sm">
            <RefreshCcw className="mr-2 h-4 w-4" />
            Sync Nodes
          </Button>
          <Button size="sm" onClick={() => setIsWizardOpen(true)} className="bg-purple-600 hover:bg-purple-700">
            <Wand2 className="mr-2 h-4 w-4" />
            Research Intake
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Research Tenants</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.organizations}</div>
            <p className="text-xs text-muted-foreground">Active production nodes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User Cohorts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.users}</div>
            <p className="text-xs text-muted-foreground">Global behavior pool</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interaction Flags</CardTitle>
            <Bug className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{bugs.filter(b => b.status === "new").length}</div>
            <p className="text-xs text-muted-foreground">Patterns needing review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Core Integrity</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Optimal</div>
            <p className="text-xs text-green-500">Neural paths established</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-slate-100 p-1">
          <TabsTrigger value="overview">Executive View</TabsTrigger>
          <TabsTrigger value="research" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Interaction Research
            {bugs.filter(b => b.status === "new").length > 0 && (
              <Badge variant="destructive" className="ml-1 h-5 min-w-[20px] px-1 justify-center">
                {bugs.filter(b => b.status === "new").length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="tenants">Tenants</TabsTrigger>
          <TabsTrigger value="users">Global Users</TabsTrigger>
          <TabsTrigger value="roles">Permissions</TabsTrigger>
          <TabsTrigger value="analytics">Research Data</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recent Research Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bugs.slice(0, 5).map((bug) => (
                    <div key={bug.id} className="flex items-center gap-4 border-b pb-4 last:border-0 last:pb-0">
                      <div className={`p-2 rounded-full ${bug.priority === 'critical' ? 'bg-red-100' : 'bg-slate-100'}`}>
                        <Bug className={`h-4 w-4 ${bug.priority === 'critical' ? 'text-red-600' : 'text-slate-600'}`} />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none truncate w-64">{bug.error_message}</p>
                        <p className="text-xs text-muted-foreground">{bug.url}</p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(bug.created_at!), "HH:mm")}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Neural Infrastructure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2"><Database className="h-4 w-4" /> Cognitive Storage</span>
                    <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Stable</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2"><Cpu className="h-4 w-4" /> Processing Nodes</span>
                    <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Online</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2"><Terminal className="h-4 w-4" /> Research Engine</span>
                    <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="research" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle>Interaction Research Logs</CardTitle>
                  <CardDescription>Studying user behavior and friction points across the ecosystem.</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search patterns..." 
                      className="pl-8" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={severityFilter} onValueChange={setSeverityFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon" onClick={loadBugs} disabled={isLoadingBugs}>
                    <RefreshCcw className={`h-4 w-4 ${isLoadingBugs ? "animate-spin" : ""}`} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingBugs ? (
                <div className="flex h-64 items-center justify-center">
                  <RefreshCcw className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : filteredBugs.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center text-center">
                  <CheckCircle2 className="mb-2 h-10 w-10 text-green-500" />
                  <h3 className="text-lg font-medium">System in Equilibrium</h3>
                  <p className="text-sm text-muted-foreground">No irregular interaction patterns detected.</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[40px]"></TableHead>
                        <TableHead>Research Priority</TableHead>
                        <TableHead>Behavior Observation</TableHead>
                        <TableHead>Context URL</TableHead>
                        <TableHead>Timestamp</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBugs.map((bug) => (
                        <React.Fragment key={bug.id}>
                          <TableRow 
                            className={`cursor-pointer transition-colors hover:bg-muted/50 ${bug.status === 'resolved' ? 'opacity-50' : ''}`}
                            onClick={() => setExpandedBug(expandedBug === bug.id ? null : bug.id)}
                          >
                            <TableCell>
                              {expandedBug === bug.id ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={bug.priority === "critical" ? "destructive" : "secondary"}
                              >
                                {bug.priority?.toUpperCase()}
                              </Badge>
                            </TableCell>
                            <TableCell className="max-w-[300px] truncate font-medium">
                              {bug.error_message}
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate text-xs text-muted-foreground">
                              {bug.url}
                            </TableCell>
                            <TableCell className="text-xs">
                              {format(new Date(bug.created_at!), "MMM d, HH:mm")}
                            </TableCell>
                            <TableCell className="text-right">
                              {bug.status !== "resolved" && (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 text-green-600 hover:bg-green-50 hover:text-green-700"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleResolve(bug.id!);
                                  }}
                                >
                                  Note Pattern
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                          {expandedBug === bug.id && (
                            <TableRow className="bg-slate-50">
                              <TableCell colSpan={6} className="p-4">
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4 text-xs">
                                    <div>
                                      <span className="font-bold text-slate-500">CLIENT AGENT:</span>
                                      <p className="mt-1 break-all">{bug.user_agent || "N/A"}</p>
                                    </div>
                                    <div>
                                      <span className="font-bold text-slate-500">SUBJECT ID:</span>
                                      <p className="mt-1 font-mono">{bug.user_id || "Anonymous"}</p>
                                    </div>
                                  </div>
                                  <div>
                                    <span className="text-xs font-bold text-slate-500">BEHAVIORAL TRACE:</span>
                                    <pre className="mt-2 max-h-60 overflow-auto rounded bg-slate-950 p-3 font-mono text-[10px] text-purple-400">
                                      {bug.stack_trace || "No detailed trace provided."}
                                    </pre>
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tenants" className="space-y-4">
          <OrgManagementView />
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <UserManagementView />
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <RolesManagementView />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <RoleAnalyticsView />
        </TabsContent>
      </Tabs>

      <Dialog open={isWizardOpen} onOpenChange={setIsWizardOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Research Intake</DialogTitle>
            <DialogDescription>Analyzing client requirements for new nodes.</DialogDescription>
          </DialogHeader>

          {wizardStep === 1 && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Research Subject (Business Name)</Label>
                <Input 
                  value={blueprintData.business_name}
                  onChange={(e) => setBlueprintData({...blueprintData, business_name: e.target.value})}
                  placeholder="e.g., Elegance Events Manila"
                />
              </div>
              <div className="space-y-2">
                <Label>Operational Parameters</Label>
                <Textarea 
                  value={blueprintData.operational_needs}
                  onChange={(e) => setBlueprintData({...blueprintData, operational_needs: e.target.value})}
                  placeholder="What behaviors should NANO observe?"
                />
              </div>
              <Button onClick={() => setWizardStep(2)} className="w-full">Initialize Research</Button>
            </div>
          )}

          {wizardStep === 2 && (
            <div className="py-12 flex flex-col items-center justify-center space-y-4">
              <div className="h-12 w-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-muted-foreground">Synthesizing behavioral patterns...</p>
              <Button onClick={handleGenerateBlueprint} disabled={isGenerating}>
                {isGenerating ? "Synthesizing..." : "Generate Analysis"}
              </Button>
            </div>
          )}

          {wizardStep === 3 && generatedBlueprint && (
            <div className="space-y-4 py-4">
              <div className="bg-slate-950 p-4 rounded-lg overflow-auto max-h-[300px]">
                <pre className="text-xs text-purple-400">
                  {JSON.stringify(generatedBlueprint, null, 2)}
                </pre>
              </div>
              <Button onClick={() => setIsWizardOpen(false)} className="w-full">Close Research</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}