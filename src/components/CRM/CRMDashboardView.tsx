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
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { clientService } from "@/services/clientService";
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
} from "lucide-react";

type SortBy = "name" | "created_at" | "total_spent";
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
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [clientDetails, setClientDetails] = useState<any>(null);

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
      if (sortBy === "name") {
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
        return "bg-blue-100 text-blue-800";
      case "Prospect":
        return "bg-yellow-100 text-yellow-800";
      case "Active":
        return "bg-green-100 text-green-800";
      case "Completed":
        return "bg-emerald-100 text-emerald-800";
      case "Archived":
        return "bg-gray-100 text-gray-800";
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
        return <CheckCircle2 className="h-2 w-2" />;
      default:
        return <Circle className="h-2 w-2" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">CRM & Clients</h1>
          <p className="text-muted-foreground mt-2">Manage client relationships, track pipeline, and monitor event history.</p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white gap-2 shadow-lg hover:shadow-xl transition-shadow">
              <Plus className="h-4 w-4" />
              Add New Client
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl">Create New Client Profile</DialogTitle>
              <DialogDescription>
                Add a new client to your CRM system with complete contact and business information.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2">
                    <Label className="font-semibold">Full Name *</Label>
                    <Input
                      value={formData.full_name}
                      onChange={(e) =>
                        setFormData({ ...formData, full_name: e.target.value })
                      }
                      placeholder="John Doe"
                      className="border-gray-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-semibold">Email *</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="john@example.com"
                      className="border-gray-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-semibold">Phone</Label>
                    <Input
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="+63 XXX XXX XXXX"
                      className="border-gray-300"
                    />
                  </div>
                </div>
              </div>

              {/* Business Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Business Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2">
                    <Label className="font-semibold">Company Name</Label>
                    <Input
                      value={formData.company_name}
                      onChange={(e) =>
                        setFormData({ ...formData, company_name: e.target.value })
                      }
                      placeholder="Company Name (if applicable)"
                      className="border-gray-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-semibold">Source</Label>
                    <Select
                      value={formData.source}
                      onValueChange={(v) =>
                        setFormData({ ...formData, source: v as any })
                      }
                    >
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
                  <div className="space-y-2">
                    <Label className="font-semibold">Lead Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(v) =>
                        setFormData({ ...formData, status: v as any })
                      }
                    >
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

              {/* Location Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Location Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="font-semibold">City</Label>
                    <Input
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      placeholder="Manila"
                      className="border-gray-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-semibold">Country</Label>
                    <Input
                      value={formData.country}
                      onChange={(e) =>
                        setFormData({ ...formData, country: e.target.value })
                      }
                      placeholder="Philippines"
                      className="border-gray-300"
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label className="font-semibold">Address</Label>
                    <Input
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      placeholder="Street address"
                      className="border-gray-300"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Additional Information</h3>
                <div className="space-y-2">
                  <Label className="font-semibold">Notes & Preferences</Label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    placeholder="Add any special notes, preferences, or important information about this client..."
                    rows={4}
                    className="border-gray-300"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateClient} className="bg-blue-600 hover:bg-blue-700">
                Create Client
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-blue-900">
              <Users className="h-4 w-4" />
              Total Clients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900">{stats.total}</div>
            <p className="text-xs text-blue-700 mt-1">All clients</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-purple-900">
              <Target className="h-4 w-4" />
              Active Pipeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900">{stats.byStatus["Active"] || 0}</div>
            <p className="text-xs text-purple-700 mt-1">Active projects</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-green-900">
              <DollarSign className="h-4 w-4" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900">₱{(stats.totalSpent / 1000).toFixed(1)}k</div>
            <p className="text-xs text-green-700 mt-1">All time</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-amber-50 to-amber-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-amber-900">
              <TrendingUp className="h-4 w-4" />
              Conversion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-900">{stats.conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-amber-700 mt-1">Lead to booking</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-rose-50 to-rose-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-rose-900">
              <Calendar className="h-4 w-4" />
              Avg Event Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-rose-900">₱{(stats.avgEventValue / 1000).toFixed(1)}k</div>
            <p className="text-xs text-rose-700 mt-1">Per event</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
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
                  <SelectItem value="name">Name</SelectItem>
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
      </div>

      {/* Clients Table */}
      <div className="rounded-lg border bg-white overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full"></div>
            <p className="mt-4 text-muted-foreground">Loading clients...</p>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">No clients found</p>
            <p className="text-sm text-gray-500 mt-1">Create your first client to get started managing your pipeline.</p>
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
                      <Badge className={getStatusBadgeVariant(client.status)}>
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
                          }}
                          className="gap-1"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-2xl">{selectedClient?.full_name}</DialogTitle>
                          <DialogDescription>
                            Complete client profile and relationship history
                          </DialogDescription>
                        </DialogHeader>

                        <Tabs defaultValue="profile" className="w-full">
                          <TabsList className="grid w-full grid-cols-5">
                            <TabsTrigger value="profile">Profile</TabsTrigger>
                            <TabsTrigger value="events">
                              Events
                              {clientDetails?.events?.length > 0 && (
                                <Badge variant="secondary" className="ml-2">
                                  {clientDetails.events.length}
                                </Badge>
                              )}
                            </TabsTrigger>
                            <TabsTrigger value="quotes">
                              Quotes
                              {clientDetails?.quotes?.length > 0 && (
                                <Badge variant="secondary" className="ml-2">
                                  {clientDetails.quotes.length}
                                </Badge>
                              )}
                            </TabsTrigger>
                            <TabsTrigger value="invoices">
                              Invoices
                              {clientDetails?.invoices?.length > 0 && (
                                <Badge variant="secondary" className="ml-2">
                                  {clientDetails.invoices.length}
                                </Badge>
                              )}
                            </TabsTrigger>
                            <TabsTrigger value="communications">
                              Communications
                              {clientDetails?.communications?.length > 0 && (
                                <Badge variant="secondary" className="ml-2">
                                  {clientDetails.communications.length}
                                </Badge>
                              )}
                            </TabsTrigger>
                          </TabsList>

                          <TabsContent value="profile" className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label className="text-xs font-semibold text-gray-500 uppercase">Full Name</Label>
                                <p className="text-sm font-semibold text-gray-900">{selectedClient?.full_name}</p>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-xs font-semibold text-gray-500 uppercase">Email</Label>
                                <p className="flex items-center gap-2 text-sm text-gray-600">
                                  <Mail className="h-4 w-4" />
                                  {selectedClient?.email}
                                </p>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-xs font-semibold text-gray-500 uppercase">Phone</Label>
                                <p className="flex items-center gap-2 text-sm text-gray-600">
                                  <Phone className="h-4 w-4" />
                                  {selectedClient?.phone || "-"}
                                </p>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-xs font-semibold text-gray-500 uppercase">Company</Label>
                                <p className="text-sm font-semibold text-gray-900">{selectedClient?.company_name || "-"}</p>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-xs font-semibold text-gray-500 uppercase">City</Label>
                                <p className="flex items-center gap-2 text-sm text-gray-600">
                                  <MapPin className="h-4 w-4" />
                                  {selectedClient?.city || "-"}
                                </p>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-xs font-semibold text-gray-500 uppercase">Status</Label>
                                <Badge className={getStatusBadgeVariant(selectedClient?.status)}>
                                  {selectedClient?.status}
                                </Badge>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-xs font-semibold text-gray-500 uppercase">Total Spent</Label>
                                <p className="text-lg font-bold text-green-600">₱{(selectedClient?.total_spent || 0).toLocaleString()}</p>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-xs font-semibold text-gray-500 uppercase">Total Events</Label>
                                <p className="text-lg font-bold text-blue-600">{selectedClient?.total_events || 0}</p>
                              </div>
                              <div className="space-y-2 col-span-2">
                                <Label className="text-xs font-semibold text-gray-500 uppercase">Notes</Label>
                                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{selectedClient?.notes || "No notes"}</p>
                              </div>
                            </div>
                          </TabsContent>

                          <TabsContent value="events" className="space-y-4">
                            {clientDetails?.events?.length === 0 ? (
                              <p className="text-center text-gray-500 py-8">No events yet</p>
                            ) : (
                              <div className="space-y-2">
                                {clientDetails?.events?.map((event: any) => (
                                  <Card key={event.id} className="border-gray-200">
                                    <CardContent className="p-4">
                                      <div className="flex justify-between items-start">
                                        <div>
                                          <p className="font-semibold text-gray-900">{event.event_name}</p>
                                          <p className="text-xs text-gray-500 mt-1">
                                            <Calendar className="inline h-3 w-3 mr-1" />
                                            {new Date(event.start_datetime).toLocaleDateString()}
                                          </p>
                                        </div>
                                        <Badge>{event.status}</Badge>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            )}
                          </TabsContent>

                          <TabsContent value="quotes" className="space-y-4">
                            {clientDetails?.quotes?.length === 0 ? (
                              <p className="text-center text-gray-500 py-8">No quotes yet</p>
                            ) : (
                              <div className="space-y-2">
                                {clientDetails?.quotes?.map((quote: any) => (
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

                          <TabsContent value="invoices" className="space-y-4">
                            {clientDetails?.invoices?.length === 0 ? (
                              <p className="text-center text-gray-500 py-8">No invoices yet</p>
                            ) : (
                              <div className="space-y-2">
                                {clientDetails?.invoices?.map((invoice: any) => (
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

                          <TabsContent value="communications" className="space-y-4">
                            {clientDetails?.communications?.length === 0 ? (
                              <p className="text-center text-gray-500 py-8">No communications yet</p>
                            ) : (
                              <div className="space-y-2">
                                {clientDetails?.communications?.map((comm: any) => (
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
    </div>
  );
}