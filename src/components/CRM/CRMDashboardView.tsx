import React, { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

type SortBy = "name" | "created_at" | "total_spent";
type SortDir = "asc" | "desc";
type StatusFilter = "all" | "new" | "contacted" | "interested" | "booked" | "completed" | "lost" | "archived";

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

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");

  // Sorting
  const [sortBy, setSortBy] = useState<SortBy>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  // Create Client Dialog
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    company_name: "",
    email: "",
    phone: "",
    alternate_contact: "",
    address: "",
    city: "",
    country: "",
    notes: "",
    source: "website" as const,
    lead_status: "new" as const,
    type: "individual" as const,
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
          (c?.first_name || "").toLowerCase().includes(q) ||
          (c?.last_name || "").toLowerCase().includes(q) ||
          (c?.company_name || "").toLowerCase().includes(q) ||
          (c?.email || "").toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "all") {
      list = list.filter((c) => c?.lead_status === statusFilter);
    }

    if (sourceFilter !== "all") {
      list = list.filter((c) => c?.source === sourceFilter);
    }

    list.sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortBy === "name") {
        const aName = `${a?.first_name || ""} ${a?.last_name || ""}`;
        const bName = `${b?.first_name || ""} ${b?.last_name || ""}`;
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
        description: `${formData.first_name} ${formData.last_name} has been added to your CRM.`,
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
      first_name: "",
      last_name: "",
      company_name: "",
      email: "",
      phone: "",
      alternate_contact: "",
      address: "",
      city: "",
      country: "",
      notes: "",
      source: "website",
      lead_status: "new",
      type: "individual",
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
      case "new":
        return "bg-blue-100 text-blue-800";
      case "contacted":
        return "bg-yellow-100 text-yellow-800";
      case "interested":
        return "bg-purple-100 text-purple-800";
      case "booked":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-emerald-100 text-emerald-800";
      case "lost":
        return "bg-red-100 text-red-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">CRM & Clients</h1>
          <p className="text-muted-foreground mt-1">Manage your client relationships and pipeline.</p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-white gap-2">
              <Plus className="h-4 w-4" />
              Add Client
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
              <DialogDescription>
                Create a new client profile in your CRM system.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input
                  value={formData.first_name}
                  onChange={(e) =>
                    setFormData({ ...formData, first_name: e.target.value })
                  }
                  placeholder="First name"
                />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input
                  value={formData.last_name}
                  onChange={(e) =>
                    setFormData({ ...formData, last_name: e.target.value })
                  }
                  placeholder="Last name"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Company Name (Optional)</Label>
                <Input
                  value={formData.company_name}
                  onChange={(e) =>
                    setFormData({ ...formData, company_name: e.target.value })
                  }
                  placeholder="Company name"
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="email@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="+63..."
                />
              </div>
              <div className="space-y-2">
                <Label>Alternate Contact</Label>
                <Input
                  value={formData.alternate_contact}
                  onChange={(e) =>
                    setFormData({ ...formData, alternate_contact: e.target.value })
                  }
                  placeholder="Secondary contact"
                />
              </div>
              <div className="space-y-2">
                <Label>City</Label>
                <Input
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  placeholder="City"
                />
              </div>
              <div className="space-y-2">
                <Label>Country</Label>
                <Input
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                  placeholder="Country"
                />
              </div>
              <div className="space-y-2">
                <Label>Source</Label>
                <Select
                  value={formData.source}
                  onValueChange={(v) =>
                    setFormData({ ...formData, source: v as any })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="referral">Referral</SelectItem>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Lead Status</Label>
                <Select
                  value={formData.lead_status}
                  onValueChange={(v) =>
                    setFormData({ ...formData, lead_status: v as any })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New Lead</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="interested">Interested</SelectItem>
                    <SelectItem value="booked">Booked</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="lost">Lost</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Notes</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Add any additional notes..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateClient}>Add Client</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              Total Clients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">In your pipeline</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-green-600" />
              Active Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEvents}</div>
            <p className="text-xs text-muted-foreground mt-1">Ongoing events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-amber-600" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₱{(stats.totalSpent / 1000).toFixed(1)}k</div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              Conversion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">Leads to bookings</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Controls */}
      <div className="rounded-lg border bg-white p-3 md:p-4">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search clients by name, email..."
                className="pl-9"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={(v: StatusFilter) => setStatusFilter(v)}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="new">New Lead</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="interested">Interested</SelectItem>
                  <SelectItem value="booked">Booked</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All sources</SelectItem>
                  {sources.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2 md:ml-auto">
              <Select value={sortBy} onValueChange={(v: SortBy) => setSortBy(v)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at">Date Added</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="total_spent">Spent</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
                title={`Toggle ${sortDir === "asc" ? "descending" : "ascending"}`}
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
      <div className="rounded-lg border bg-white overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full"></div>
            <p className="mt-4 text-muted-foreground">Loading clients...</p>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">No clients found. Create your first client to get started.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Source</TableHead>
                <TableHead className="text-right">Total Spent</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    {client.first_name} {client.last_name}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">{client.email}</TableCell>
                  <TableCell className="text-sm text-gray-600">{client.phone || "-"}</TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeVariant(client.lead_status)}>
                      {client.lead_status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm capitalize">{client.source || "-"}</TableCell>
                  <TableCell className="text-right font-medium">
                    ₱{(client.total_spent || 0).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Dialog open={isDetailsOpen && selectedClient?.id === client.id} onOpenChange={setIsDetailsOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedClient(client)}
                        >
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>
                            {selectedClient?.first_name} {selectedClient?.last_name}
                          </DialogTitle>
                          <DialogDescription>
                            Client profile and interaction history
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-4 py-4">
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-gray-500 uppercase">Email</p>
                            <p className="flex items-center gap-2 text-sm">
                              <Mail className="h-4 w-4" />
                              {selectedClient?.email}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-gray-500 uppercase">Phone</p>
                            <p className="flex items-center gap-2 text-sm">
                              <Phone className="h-4 w-4" />
                              {selectedClient?.phone || "-"}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-gray-500 uppercase">City</p>
                            <p className="flex items-center gap-2 text-sm">
                              <MapPin className="h-4 w-4" />
                              {selectedClient?.city || "-"}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-gray-500 uppercase">Status</p>
                            <Badge className={getStatusBadgeVariant(selectedClient?.lead_status)}>
                              {selectedClient?.lead_status}
                            </Badge>
                          </div>
                          <div className="space-y-1 col-span-2">
                            <p className="text-xs font-medium text-gray-500 uppercase">Notes</p>
                            <p className="text-sm text-gray-600">{selectedClient?.notes || "No notes"}</p>
                          </div>
                        </div>
                        <DialogFooter>
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