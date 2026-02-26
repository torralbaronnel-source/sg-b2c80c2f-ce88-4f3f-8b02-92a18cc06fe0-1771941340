import React, { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { clientService } from "@/services/clientService";
import { lifecycleService, type ProjectStage } from "@/services/lifecycleService";
import {
  Search,
  Plus,
  Filter,
  ArrowUpDown,
  X,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  Users,
  Target,
  Activity,
  FileText,
  Clock,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Circle,
  Building2,
  Globe,
  MessageSquare,
  Briefcase,
  Heart,
  Zap,
  BarChart3,
  Settings,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

type SortBy = "full_name" | "created_at" | "total_spent";
type SortDir = "asc" | "desc";
type StatusFilter = "all" | "Lead" | "Prospect" | "Active" | "Completed" | "Archived";

export function CRMDashboardView() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ 
    total: 0, 
    byStatus: {} as Record<string, number>, 
    totalSpent: 0, 
    totalEvents: 0,
    conversionRate: 0,
    avgEventValue: 0
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortBy>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createStep, setCreateStep] = useState(1);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [clientDetails, setClientDetails] = useState<any>(null);
  const [detailsTab, setDetailsTab] = useState("profile");

  const [formData, setFormData] = useState({
    full_name: "",
    company_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    notes: "",
    source: "Direct" as const,
    status: "Lead" as const,
  });

  const { toast } = useToast();

  useEffect(() => {
    loadClients();
  }, []);

  async function loadClients() {
    try {
      setLoading(true);
      const response = await clientService.getClients();
      setClients(Array.isArray(response) ? response : []);
      
      const statsData = await clientService.getClientStats();
      setStats(statsData);
    } catch (error) {
      console.error("Failed to load clients", error);
      toast({
        title: "Load Failed",
        description: "Unable to fetch clients. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function loadClientDetails(clientId: string) {
    try {
      const details = await clientService.getClientDetails(clientId);
      setClientDetails(details);
    } catch (error) {
      console.error("Failed to load client details", error);
    }
  }

  const sources = useMemo(() => {
    const set = new Set<string>();
    (clients || []).forEach((c) => {
      if (c?.source) set.add(c.source);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [clients]);

  const hasActiveFilters = useMemo(() => {
    return (
      Boolean(searchTerm.trim()) ||
      statusFilter !== "all" ||
      sourceFilter !== "all" ||
      sortBy !== "created_at" ||
      sortDir !== "desc"
    );
  }, [searchTerm, statusFilter, sourceFilter, sortBy, sortDir]);

  const filteredClients = useMemo(() => {
    let list = [...(clients || [])];

    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      list = list.filter(
        (c) =>
          (c?.full_name || "").toLowerCase().includes(q) ||
          (c?.company_name || "").toLowerCase().includes(q) ||
          (c?.email || "").toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "all") {
      list = list.filter((c) => c?.status === statusFilter);
    }

    if (sourceFilter !== "all") {
      list = list.filter((c) => c?.source === sourceFilter);
    }

    list.sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortBy === "full_name") {
        const aName = a?.full_name || "";
        const bName = b?.full_name || "";
        return aName.localeCompare(bName) * dir;
      }
      if (sortBy === "created_at") {
        const av = a?.created_at ? new Date(a.created_at).getTime() : 0;
        const bv = b?.created_at ? new Date(b.created_at).getTime() : 0;
        return (av - bv) * dir;
      }
      if (sortBy === "total_spent") {
        const av = a?.total_spent || 0;
        const bv = b?.total_spent || 0;
        return (av - bv) * dir;
      }
      return 0;
    });

    return list;
  }, [clients, searchTerm, statusFilter, sourceFilter, sortBy, sortDir]);

  async function handleCreateClient() {
    if (!formData.full_name.trim()) {
      toast({
        title: "Validation Error",
        description: "Full name is required.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.email.trim()) {
      toast({
        title: "Validation Error",
        description: "Email is required.",
        variant: "destructive",
      });
      return;
    }

    try {
      const newClient = await clientService.createClient(formData);
      setClients((prev) => [newClient, ...prev]);
      setIsCreateOpen(false);
      setCreateStep(1);
      resetForm();
      toast({
        title: "Client Added",
        description: `${formData.full_name} has been added to your CRM.`,
      });
    } catch (error) {
      console.error("Error creating client:", error);
      toast({
        title: "Creation Failed",
        description: "Could not create client. Please try again.",
        variant: "destructive",
      });
    }
  }

  async function handleDeleteClient(clientId: string) {
    try {
      await clientService.deleteClient(clientId);
      setClients((prev) => prev.filter((c) => c.id !== clientId));
      setIsDetailsOpen(false);
      toast({
        title: "Client Deleted",
        description: "The client has been removed from your CRM.",
      });
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Could not delete client. Please try again.",
        variant: "destructive",
      });
    }
  }

  function resetForm() {
    setFormData({
      full_name: "",
      company_name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      country: "",
      notes: "",
      source: "Direct",
      status: "Lead",
    });
  }

  function clearFilters() {
    setSearchTerm("");
    setStatusFilter("all");
    setSourceFilter("all");
    setSortBy("created_at");
    setSortDir("desc");
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Lead":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "Prospect":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "Active":
        return "bg-green-100 text-green-800 border-green-300";
      case "Completed":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "Archived":
        return "bg-gray-100 text-gray-800 border-gray-300";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Lead":
        return <Circle className="h-2 w-2" />;
      case "Prospect":
        return <AlertCircle className="h-2 w-2" />;
      case "Active":
        return <CheckCircle2 className="h-2 w-2" />;
      case "Completed":
        return <Heart className="h-2 w-2" />;
      default:
        return <Circle className="h-2 w-2" />;
    }
  };

  const getPipelineStages = () => [
    { label: "Leads", value: "Lead", count: stats.byStatus["Lead"] || 0, color: "bg-blue-500" },
    { label: "Prospects", value: "Prospect", count: stats.byStatus["Prospect"] || 0, color: "bg-yellow-500" },
    { label: "Active", value: "Active", count: stats.byStatus["Active"] || 0, color: "bg-green-500" },
    { label: "Completed", value: "Completed", count: stats.byStatus["Completed"] || 0, color: "bg-emerald-500" },
  ];

  const [selectedStage, setSelectedStage] = useState<ProjectStage | 'All'>('All');
  const stages: ProjectStage[] = ['Discovery', 'Proposal', 'Contract', 'Pre-Production', 'Live', 'Post-Show', 'Archived'];

  function LifecycleTracker({ currentStage }: { currentStage: ProjectStage }) {
    const currentIndex = stages.indexOf(currentStage);

    return (
      <div className="flex items-center justify-between w-full px-4 py-6 bg-slate-50 rounded-xl mb-6">
        {stages.map((stage, index) => (
          <React.Fragment key={stage}>
            <div className="flex flex-col items-center gap-2">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                index <= currentIndex ? "bg-blue-600 text-white shadow-md" : "bg-slate-200 text-slate-500"
              )}>
                {index < currentIndex ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
              </div>
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-wider",
                index <= currentIndex ? "text-blue-600" : "text-slate-400"
              )}>
                {stage}
              </span>
            </div>
            {index < stages.length - 1 && (
              <div className={cn(
                "h-[2px] flex-1 mx-2",
                index < currentIndex ? "bg-blue-600" : "bg-slate-200"
              )} />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Client Relationship Management</h1>
            <p className="text-muted-foreground">Manage your client lifecycle and communications.</p>
          </div>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white gap-2 shadow-lg hover:shadow-xl transition-shadow">
                <Plus className="h-4 w-4" />
                Add New Client
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl">Create New Client Profile</DialogTitle>
                <DialogDescription>
                  Step {createStep} of 3: Add complete client information for your CRM system
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Step 1: Basic Information */}
                {createStep === 1 && (
                  <div className="space-y-4 animate-in fade-in-50 duration-300">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2 col-span-2 md:col-span-1">
                        <Label className="font-semibold text-gray-700">Full Name *</Label>
                        <Input
                          value={formData.full_name}
                          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                          placeholder="John Doe"
                          className="border-gray-300"
                        />
                      </div>
                      <div className="space-y-2 col-span-2 md:col-span-1">
                        <Label className="font-semibold text-gray-700">Email *</Label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="john@example.com"
                          className="border-gray-300"
                        />
                      </div>
                      <div className="space-y-2 col-span-2 md:col-span-1">
                        <Label className="font-semibold text-gray-700">Phone</Label>
                        <Input
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+63 XXX XXX XXXX"
                          className="border-gray-300"
                        />
                      </div>
                      <div className="space-y-2 col-span-2 md:col-span-1">
                        <Label className="font-semibold text-gray-700">Company</Label>
                        <Input
                          value={formData.company_name}
                          onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                          placeholder="Company Name (if applicable)"
                          className="border-gray-300"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Location & Source */}
                {createStep === 2 && (
                  <div className="space-y-4 animate-in fade-in-50 duration-300">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Location & Lead Source
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="font-semibold text-gray-700">City</Label>
                        <Input
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          placeholder="Manila"
                          className="border-gray-300"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-semibold text-gray-700">Country</Label>
                        <Input
                          value={formData.country}
                          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                          placeholder="Philippines"
                          className="border-gray-300"
                        />
                      </div>
                      <div className="space-y-2 col-span-2">
                        <Label className="font-semibold text-gray-700">Address</Label>
                        <Input
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          placeholder="Street address"
                          className="border-gray-300"
                        />
                      </div>
                      <div className="space-y-2 col-span-2 md:col-span-1">
                        <Label className="font-semibold text-gray-700">Lead Source</Label>
                        <Select value={formData.source} onValueChange={(v) => setFormData({ ...formData, source: v as any })}>
                          <SelectTrigger className="border-gray-300">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Facebook">Facebook</SelectItem>
                            <SelectItem value="Instagram">Instagram</SelectItem>
                            <SelectItem value="Referral">Referral</SelectItem>
                            <SelectItem value="Website">Website</SelectItem>
                            <SelectItem value="Event">Event</SelectItem>
                            <SelectItem value="Direct">Direct</SelectItem>
                            <SelectItem value="Search">Search Engine</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2 col-span-2 md:col-span-1">
                        <Label className="font-semibold text-gray-700">Initial Status</Label>
                        <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v as any })}>
                          <SelectTrigger className="border-gray-300">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Lead">Lead</SelectItem>
                            <SelectItem value="Prospect">Prospect</SelectItem>
                            <SelectItem value="Active">Active Client</SelectItem>
                            <SelectItem value="Completed">Completed Project</SelectItem>
                            <SelectItem value="Archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Notes & Summary */}
                {createStep === 3 && (
                  <div className="space-y-4 animate-in fade-in-50 duration-300">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Notes & Summary
                    </h3>
                    <div className="space-y-2">
                      <Label className="font-semibold text-gray-700">Notes & Preferences</Label>
                      <Textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Add special preferences, event type preferences, budget range, event dates, or any important notes..."
                        rows={5}
                        className="border-gray-300"
                      />
                    </div>

                    {/* Summary */}
                    <div className="border rounded-lg p-4 bg-gray-50 space-y-3">
                      <h4 className="font-semibold text-gray-900">Client Summary</h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-gray-600">Name</p>
                          <p className="font-semibold text-gray-900">{formData.full_name}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Email</p>
                          <p className="font-semibold text-gray-900">{formData.email}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Company</p>
                          <p className="font-semibold text-gray-900">{formData.company_name || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Location</p>
                          <p className="font-semibold text-gray-900">{formData.city}, {formData.country}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Lead Source</p>
                          <p className="font-semibold text-gray-900">{formData.source}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Status</p>
                          <Badge className={getStatusBadgeVariant(formData.status)}>{formData.status}</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (createStep > 1) {
                      setCreateStep(createStep - 1);
                    } else {
                      setIsCreateOpen(false);
                      setCreateStep(1);
                      resetForm();
                    }
                  }}
                >
                  {createStep > 1 ? "Back" : "Cancel"}
                </Button>
                <div className="flex gap-2">
                  {createStep < 3 ? (
                    <Button onClick={() => setCreateStep(createStep + 1)} className="bg-blue-600 hover:bg-blue-700">
                      Next
                    </Button>
                  ) : (
                    <Button onClick={handleCreateClient} className="bg-green-600 hover:bg-green-700">
                      Create Client
                    </Button>
                  )}
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, company..."
              className="pl-9 border-gray-300"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={(v: StatusFilter) => setStatusFilter(v)}>
              <SelectTrigger className="w-[150px] border-gray-300">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="Lead">Lead</SelectItem>
                <SelectItem value="Prospect">Prospect</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Archived">Archived</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-[150px] border-gray-300">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All sources</SelectItem>
                {sources.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 md:ml-auto">
            <Select value={sortBy} onValueChange={(v: SortBy) => setSortBy(v)}>
              <SelectTrigger className="w-[140px] border-gray-300">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at">Date Added</SelectItem>
                <SelectItem value="full_name">Name</SelectItem>
                <SelectItem value="total_spent">Revenue</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
              className="border-gray-300"
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
                <X className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Clients Table - Desktop */}
      <div className="hidden md:block rounded-lg border bg-white overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full"></div>
            <p className="mt-4 text-muted-foreground">Loading clients...</p>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">No clients found</p>
            <p className="text-sm text-gray-500 mt-1">Create your first client to start managing your pipeline.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-gray-200 bg-gray-50">
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">Email</TableHead>
                <TableHead className="font-semibold">Company</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Source</TableHead>
                <TableHead className="text-right font-semibold">Revenue</TableHead>
                <TableHead className="text-center font-semibold">Events</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id} className="border-gray-100 hover:bg-blue-50 transition-colors">
                  <TableCell className="font-semibold text-gray-900">{client.full_name}</TableCell>
                  <TableCell className="text-sm text-gray-600">{client.email}</TableCell>
                  <TableCell className="text-sm text-gray-600">{client.company_name || "-"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(client.status)}
                      <Badge className={`border ${getStatusBadgeVariant(client.status)}`}>
                        {client.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">{client.source || "-"}</TableCell>
                  <TableCell className="text-right font-semibold text-gray-900">
                    ₱{(client.total_spent || 0).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">{client.total_events || 0}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Dialog open={isDetailsOpen && selectedClient?.id === client.id} onOpenChange={setIsDetailsOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedClient(client);
                            loadClientDetails(client.id);
                            setDetailsTab("profile");
                          }}
                          className="gap-1"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-2xl">{selectedClient?.full_name}</DialogTitle>
                          <DialogDescription>
                            Complete client profile with integrated event, financial, and communication data
                          </DialogDescription>
                        </DialogHeader>

                        <Tabs value={detailsTab} onValueChange={setDetailsTab} className="w-full">
                          <TabsList className="grid w-full grid-cols-6">
                            <TabsTrigger value="profile" className="text-xs">Profile</TabsTrigger>
                            <TabsTrigger value="events" className="text-xs">
                              Events {selectedClient?.events?.length > 0 && <Badge variant="secondary" className="ml-1 text-xs">{selectedClient.events.length}</Badge>}
                            </TabsTrigger>
                            <TabsTrigger value="quotes" className="text-xs">
                              Quotes {selectedClient?.quotes?.length > 0 && <Badge variant="secondary" className="ml-1 text-xs">{selectedClient.quotes.length}</Badge>}
                            </TabsTrigger>
                            <TabsTrigger value="invoices" className="text-xs">
                              Invoices {selectedClient?.invoices?.length > 0 && <Badge variant="secondary" className="ml-1 text-xs">{selectedClient.invoices.length}</Badge>}
                            </TabsTrigger>
                            <TabsTrigger value="communications" className="text-xs">
                              Comms {selectedClient?.communications?.length > 0 && <Badge variant="secondary" className="ml-1 text-xs">{selectedClient.communications.length}</Badge>}
                            </TabsTrigger>
                            <TabsTrigger value="tasks" className="text-xs">
                              Tasks {selectedClient?.tasks?.length > 0 && <Badge variant="secondary" className="ml-1 text-xs">{selectedClient.tasks.length}</Badge>}
                            </TabsTrigger>
                          </TabsList>

                          <TabsContent value="profile" className="space-y-6 mt-6">
                            <LifecycleTracker currentStage={selectedClient?.current_stage || "Client"} />
                            <div className="grid grid-cols-2 gap-6">
                              <Card className="col-span-2 md:col-span-1 border-gray-200">
                                <CardHeader className="pb-3">
                                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    Personal Information
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                  <div>
                                    <Label className="text-xs font-semibold text-gray-500 uppercase">Full Name</Label>
                                    <p className="text-sm font-semibold text-gray-900">{selectedClient?.full_name}</p>
                                  </div>
                                  <div>
                                    <Label className="text-xs font-semibold text-gray-500 uppercase">Email</Label>
                                    <p className="flex items-center gap-2 text-sm text-gray-600">
                                      <Mail className="h-4 w-4" />
                                      {selectedClient?.email}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-xs font-semibold text-gray-500 uppercase">Phone</Label>
                                    <p className="flex items-center gap-2 text-sm text-gray-600">
                                      <Phone className="h-4 w-4" />
                                      {selectedClient?.phone || "-"}
                                    </p>
                                  </div>
                                </CardContent>
                              </Card>

                              <Card className="col-span-2 md:col-span-1 border-gray-200">
                                <CardHeader className="pb-3">
                                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                    <Building2 className="h-4 w-4" />
                                    Business Information
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                  <div>
                                    <Label className="text-xs font-semibold text-gray-500 uppercase">Company</Label>
                                    <p className="text-sm font-semibold text-gray-900">{selectedClient?.company_name || "-"}</p>
                                  </div>
                                  <div>
                                    <Label className="text-xs font-semibold text-gray-500 uppercase">Status</Label>
                                    <Badge className={`border ${getStatusBadgeVariant(selectedClient?.status)} mt-1`}>
                                      {selectedClient?.status}
                                    </Badge>
                                  </div>
                                  <div>
                                    <Label className="text-xs font-semibold text-gray-500 uppercase">Lead Source</Label>
                                    <p className="text-sm text-gray-600">{selectedClient?.source || "-"}</p>
                                  </div>
                                </CardContent>
                              </Card>

                              <Card className="col-span-2 md:col-span-1 border-gray-200">
                                <CardHeader className="pb-3">
                                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    Location
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                  <div>
                                    <Label className="text-xs font-semibold text-gray-500 uppercase">City</Label>
                                    <p className="text-sm text-gray-600">{selectedClient?.city || "-"}</p>
                                  </div>
                                  <div>
                                    <Label className="text-xs font-semibold text-gray-500 uppercase">Country</Label>
                                    <p className="text-sm text-gray-600">{selectedClient?.country || "-"}</p>
                                  </div>
                                  <div>
                                    <Label className="text-xs font-semibold text-gray-500 uppercase">Address</Label>
                                    <p className="text-xs text-gray-600">{selectedClient?.address || "-"}</p>
                                  </div>
                                </CardContent>
                              </Card>

                              <Card className="col-span-2 md:col-span-1 border-gray-200">
                                <CardHeader className="pb-3">
                                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                    <DollarSign className="h-4 w-4" />
                                    Financial Overview
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                  <div>
                                    <Label className="text-xs font-semibold text-gray-500 uppercase">Total Spent</Label>
                                    <p className="text-lg font-bold text-green-600">₱{(selectedClient?.total_spent || 0).toLocaleString()}</p>
                                  </div>
                                  <div>
                                    <Label className="text-xs font-semibold text-gray-500 uppercase">Total Events</Label>
                                    <p className="text-lg font-bold text-blue-600">{selectedClient?.total_events || 0}</p>
                                  </div>
                                </CardContent>
                              </Card>

                              <Card className="col-span-2 border-gray-200">
                                <CardHeader className="pb-3">
                                  <CardTitle className="text-sm font-semibold">Notes</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{selectedClient?.notes || "No notes added"}</p>
                                </CardContent>
                              </Card>
                            </div>
                          </TabsContent>

                          <TabsContent value="events" className="space-y-4 mt-6">
                            {selectedClient?.events?.length === 0 ? (
                              <div className="text-center py-8 text-gray-500">
                                <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                                <p>No events yet</p>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                {selectedClient?.events?.map((event: any) => (
                                  <Card key={event.id} className="border-gray-200 hover:shadow-md transition-shadow">
                                    <CardContent className="p-4">
                                      <div className="flex justify-between items-start">
                                        <div>
                                          <p className="font-semibold text-gray-900">{event.event_name}</p>
                                          <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(event.start_datetime).toLocaleDateString()}
                                          </p>
                                          <p className="text-xs text-gray-500 mt-1">{event.event_type}</p>
                                        </div>
                                        <Badge>{event.status}</Badge>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            )}
                          </TabsContent>

                          <TabsContent value="quotes" className="space-y-4 mt-6">
                            {selectedClient?.quotes?.length === 0 ? (
                              <div className="text-center py-8 text-gray-500">
                                <FileText className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                                <p>No quotes yet</p>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                {selectedClient?.quotes?.map((quote: any) => (
                                  <Card key={quote.id} className="border-gray-200">
                                    <CardContent className="p-4">
                                      <div className="flex justify-between items-start">
                                        <div>
                                          <p className="font-semibold text-gray-900">Quote #{quote.quote_number}</p>
                                          <p className="text-sm text-gray-600 mt-1">₱{(quote.total || 0).toLocaleString()}</p>
                                        </div>
                                        <Badge>{quote.status}</Badge>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            )}
                          </TabsContent>

                          <TabsContent value="invoices" className="space-y-4 mt-6">
                            {selectedClient?.invoices?.length === 0 ? (
                              <div className="text-center py-8 text-gray-500">
                                <DollarSign className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                                <p>No invoices yet</p>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                {selectedClient?.invoices?.map((invoice: any) => (
                                  <Card key={invoice.id} className="border-gray-200">
                                    <CardContent className="p-4">
                                      <div className="flex justify-between items-start">
                                        <div>
                                          <p className="font-semibold text-gray-900">Invoice #{invoice.invoice_number}</p>
                                          <p className="text-sm text-gray-600 mt-1">₱{(invoice.total || 0).toLocaleString()}</p>
                                        </div>
                                        <Badge>{invoice.status}</Badge>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            )}
                          </TabsContent>

                          <TabsContent value="communications" className="space-y-4 mt-6">
                            {selectedClient?.communications?.length === 0 ? (
                              <div className="text-center py-8 text-gray-500">
                                <MessageSquare className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                                <p>No communications yet</p>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                {selectedClient?.communications?.map((comm: any) => (
                                  <Card key={comm.id} className="border-gray-200">
                                    <CardContent className="p-4">
                                      <div className="flex justify-between items-start">
                                        <div>
                                          <p className="font-semibold text-gray-900">{comm.type}</p>
                                          <p className="text-sm text-gray-600 mt-1">{comm.subject || comm.message}</p>
                                          <p className="text-xs text-gray-500 mt-2">
                                            {new Date(comm.created_at).toLocaleDateString()}
                                          </p>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            )}
                          </TabsContent>

                          <TabsContent value="tasks" className="space-y-4 mt-6">
                            {selectedClient?.tasks?.length === 0 ? (
                              <div className="text-center py-8 text-gray-500">
                                <Clock className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                                <p>No tasks yet</p>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                {selectedClient?.tasks?.map((task: any) => (
                                  <Card key={task.id} className="border-gray-200">
                                    <CardContent className="p-4">
                                      <div className="flex justify-between items-start">
                                        <div>
                                          <p className="font-semibold text-gray-900">{task.title}</p>
                                          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                                          <p className="text-xs text-gray-500 mt-2">
                                            <Calendar className="inline h-3 w-3 mr-1" />
                                            {new Date(task.due_date).toLocaleDateString()}
                                          </p>
                                        </div>
                                        <Badge>{task.status}</Badge>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            )}
                          </TabsContent>
                        </Tabs>

                        <DialogFooter className="mt-6">
                          <Button
                            variant="destructive"
                            onClick={() => handleDeleteClient(selectedClient?.id)}
                          >
                            Delete Client
                          </Button>
                          <Button onClick={() => setIsDetailsOpen(false)}>Close</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Clients Card List - Mobile */}
      <div className="md:hidden space-y-4">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full"></div>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-xl border border-dashed">
            <Users className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No clients found</p>
          </div>
        ) : (
          filteredClients.map((client) => (
            <Card key={client.id} className="border-slate-200 shadow-sm overflow-hidden">
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base font-bold text-slate-900">{client.full_name}</CardTitle>
                    <CardDescription className="text-xs truncate max-w-[200px]">{client.email}</CardDescription>
                  </div>
                  <Badge className={cn("text-[10px] px-2", getStatusBadgeVariant(client.status))}>
                    {client.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-3">
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block font-medium uppercase tracking-wider">Company</span>
                    <span className="text-slate-700 font-semibold">{client.company_name || "-"}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block font-medium uppercase tracking-wider">Revenue</span>
                    <span className="text-emerald-600 font-bold">₱{(client.total_spent || 0).toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                   <div className="flex items-center gap-1.5 text-slate-500">
                     <Calendar className="h-3 w-3" />
                     <span className="text-[10px] font-medium">{client.total_events || 0} Events</span>
                   </div>
                   <Button 
                     variant="ghost" 
                     size="sm" 
                     className="h-8 text-xs text-blue-600 font-bold gap-1"
                     onClick={() => {
                        setSelectedClient(client);
                        loadClientDetails(client.id);
                        setDetailsTab("profile");
                        setIsDetailsOpen(true);
                     }}
                   >
                     View Profile
                     <ChevronRight className="h-3 w-3" />
                   </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Card className="border-none shadow-sm bg-white overflow-hidden">
        <div className="relative aspect-video w-full bg-slate-100">
          <img 
            src="/uploads/image_b60488ac-6356-4d38-9686-277964237a3b.png" 
            alt="CRM Overview" 
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">CRM Overview</CardTitle>
          <CardDescription className="text-xs">Manage your client pipeline with ease</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}