import React, { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Users,
  UserPlus,
  FileText,
  CheckCircle2,
  Search,
  Filter,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Trash2,
  Edit2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { clientService } from "@/services/clientService";
import { useToast } from "@/hooks/use-toast";

const statusColors = {
  Lead: "bg-blue-100 text-blue-800",
  Prospect: "bg-purple-100 text-purple-800",
  Active: "bg-green-100 text-green-800",
  Completed: "bg-gray-100 text-gray-800",
  Archived: "bg-red-100 text-red-800",
};

const statusOptions = ["Lead", "Prospect", "Active", "Completed", "Archived"];

export function CRMDashboardView() {
  const { currentServer, profile } = useAuth();
  const { toast } = useToast();

  const [clients, setClients] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, byStatus: {} as Record<string, number>, totalSpent: 0, totalEvents: 0 });
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Create Client Dialog
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newClient, setNewClient] = useState({
    full_name: "",
    email: "",
    phone: "",
    company_name: "",
    address: "",
    city: "",
    country: "",
    status: "Lead",
    notes: "",
  });

  // Edit Client Dialog
  const [editingClient, setEditingClient] = useState<any>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    if (currentServer?.id) {
      loadClients();
    }
  }, [currentServer?.id]);

  async function loadClients() {
    if (!currentServer?.id) return;
    setLoading(true);

    try {
      const [clientList, clientStats] = await Promise.all([
        clientService.getClients(currentServer.id, { search: searchTerm, status: statusFilter }),
        clientService.getClientStats(currentServer.id),
      ]);

      setClients(clientList);
      setStats(clientStats);
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

  async function handleCreateClient() {
    if (!newClient.full_name.trim() || !currentServer?.id || !profile?.id) {
      toast({
        title: "Validation Error",
        description: "Please fill in the client name.",
        variant: "destructive",
      });
      return;
    }

    try {
      await clientService.createClient({
        server_id: currentServer.id,
        coordinator_id: profile.id,
        ...newClient,
      });

      toast({
        title: "Client Added",
        description: `${newClient.full_name} has been added to your client list.`,
      });

      setNewClient({
        full_name: "",
        email: "",
        phone: "",
        company_name: "",
        address: "",
        city: "",
        country: "",
        status: "Lead",
        notes: "",
      });
      setIsCreateOpen(false);
      await loadClients();
    } catch (error) {
      toast({
        title: "Creation Failed",
        description: "Could not create client. Please try again.",
        variant: "destructive",
      });
    }
  }

  async function handleUpdateClient() {
    if (!editingClient?.id) return;

    try {
      await clientService.updateClient(editingClient.id, editingClient);

      toast({
        title: "Client Updated",
        description: `${editingClient.full_name} has been updated.`,
      });

      setIsEditOpen(false);
      setEditingClient(null);
      await loadClients();
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Could not update client. Please try again.",
        variant: "destructive",
      });
    }
  }

  async function handleDeleteClient(clientId: string) {
    if (confirm("Are you sure you want to delete this client?")) {
      try {
        await clientService.deleteClient(clientId);
        toast({
          title: "Client Deleted",
          description: "Client has been removed from your list.",
        });
        await loadClients();
      } catch (error) {
        toast({
          title: "Delete Failed",
          description: "Could not delete client. Please try again.",
          variant: "destructive",
        });
      }
    }
  }

  const filteredClients = useMemo(() => {
    let list = [...clients];

    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      list = list.filter(
        (c) =>
          (c?.full_name || "").toLowerCase().includes(q) ||
          (c?.email || "").toLowerCase().includes(q) ||
          (c?.company_name || "").toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "all") {
      list = list.filter((c) => c?.status === statusFilter);
    }

    return list;
  }, [clients, searchTerm, statusFilter]);

  const dashboardStats = [
    {
      label: "Total Clients",
      value: stats.total.toString(),
      icon: Users,
      color: "text-blue-600",
    },
    {
      label: "Active Projects",
      value: (stats.byStatus?.Active || 0).toString(),
      icon: CheckCircle2,
      color: "text-green-600",
    },
    {
      label: "Pipeline Value",
      value: `₱${(stats.totalSpent || 0).toLocaleString()}`,
      icon: FileText,
      color: "text-amber-600",
    },
    {
      label: "Total Events",
      value: (stats.totalEvents || 0).toString(),
      icon: Calendar,
      color: "text-indigo-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">CRM & Clients</h1>
          <p className="text-muted-foreground mt-1">
            Manage client relationships, track inquiries, and monitor project pipelines.
          </p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-white gap-2">
              <UserPlus className="h-4 w-4" />
              Add Client
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
              <DialogDescription>
                Create a new client profile to start managing their projects and communications.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input
                    placeholder="Client name"
                    value={newClient.full_name}
                    onChange={(e) => setNewClient({ ...newClient, full_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="client@example.com"
                    value={newClient.email}
                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    placeholder="+63 9XX XXX XXXX"
                    value={newClient.phone}
                    onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Company</Label>
                  <Input
                    placeholder="Company name (optional)"
                    value={newClient.company_name}
                    onChange={(e) => setNewClient({ ...newClient, company_name: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input
                    placeholder="City"
                    value={newClient.city}
                    onChange={(e) => setNewClient({ ...newClient, city: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Country</Label>
                  <Input
                    placeholder="Country"
                    value={newClient.country}
                    onChange={(e) => setNewClient({ ...newClient, country: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={newClient.status} onValueChange={(v) => setNewClient({ ...newClient, status: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  placeholder="Add notes about this client..."
                  value={newClient.notes}
                  onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })}
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateClient}>Add Client</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardStats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-slate-50 ${stat.color}`}>
                  <stat.icon size={20} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="rounded-lg border bg-white p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search clients by name, email, company..."
              className="pl-9"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {statusOptions.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("all");
            }}
            className="md:ml-auto"
          >
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Client List */}
      <div className="rounded-lg border bg-white overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Loading clients...</div>
        ) : filteredClients.length === 0 ? (
          <div className="p-8 text-center">
            <Users className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <p className="text-sm text-muted-foreground">No clients found. Add your first client to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left font-medium text-gray-700">Name</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-700">Contact</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-700">Company</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-700">Total Spent</th>
                  <th className="px-6 py-3 text-right font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{client.full_name}</p>
                      {client.city && <p className="text-xs text-gray-500 flex items-center gap-1 mt-1"><MapPin className="h-3 w-3" /> {client.city}</p>}
                    </td>
                    <td className="px-6 py-4">
                      {client.email && <p className="text-xs text-gray-600 flex items-center gap-1"><Mail className="h-3 w-3" /> {client.email}</p>}
                      {client.phone && <p className="text-xs text-gray-600 flex items-center gap-1 mt-1"><Phone className="h-3 w-3" /> {client.phone}</p>}
                    </td>
                    <td className="px-6 py-4">{client.company_name || "—"}</td>
                    <td className="px-6 py-4">
                      <Badge className={statusColors[client.status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}>
                        {client.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-medium">₱{(client.total_spent || 0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingClient(client);
                            setIsEditOpen(true);
                          }}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteClient(client.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Client Dialog */}
      {editingClient && (
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Client</DialogTitle>
              <DialogDescription>Update client information and details.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input
                    value={editingClient.full_name || ""}
                    onChange={(e) => setEditingClient({ ...editingClient, full_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={editingClient.email || ""}
                    onChange={(e) => setEditingClient({ ...editingClient, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={editingClient.phone || ""}
                    onChange={(e) => setEditingClient({ ...editingClient, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Company</Label>
                  <Input
                    value={editingClient.company_name || ""}
                    onChange={(e) => setEditingClient({ ...editingClient, company_name: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={editingClient.status || "Lead"}
                  onValueChange={(v) => setEditingClient({ ...editingClient, status: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  value={editingClient.notes || ""}
                  onChange={(e) => setEditingClient({ ...editingClient, notes: e.target.value })}
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateClient}>Save Changes</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}