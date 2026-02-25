import React, { useEffect, useMemo, useState } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SEO } from "@/components/SEO";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { serverService } from "@/services/serverService";
import { useToast } from "@/hooks/use-toast";
import {
  Server as ServerIcon,
  Globe,
  Shield,
  Zap,
  ChevronRight,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  X
} from "lucide-react";

type SortBy = "name" | "created_at" | "updated_at";
type SortDir = "asc" | "desc";
type StatusFilter = "all" | "active" | "available";

export default function ServersPage() {
  const { currentServer, setCurrentServer } = useAuth();
  const [servers, setServers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingServer, setLoadingServer] = useState<string | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [regionFilter, setRegionFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  // Sorting
  const [sortBy, setSortBy] = useState<SortBy>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  // Create Server State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newServerName, setNewServerName] = useState("");
  const [newServerRegion, setNewServerRegion] = useState("Global");

  const { toast } = useToast();

  useEffect(() => {
    loadServers();
  }, []);

  async function loadServers() {
    try {
      const response = await serverService.getMyServers();
      const items = response?.servers || response || [];
      setServers(Array.isArray(items) ? items : []);
    } catch (error) {
      console.error("Failed to load servers", error);
      toast({
        title: "Load Failed",
        description: "Unable to fetch production nodes. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }

  const regions = useMemo(() => {
    const set = new Set<string>();
    (servers || []).forEach((s) => {
      if (s?.region) set.add(s.region);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [servers]);

  const hasActiveFilters = useMemo(() => {
    return Boolean(searchTerm.trim()) || regionFilter !== "all" || statusFilter !== "all" || sortBy !== "name" || sortDir !== "asc";
  }, [searchTerm, regionFilter, statusFilter, sortBy, sortDir]);

  const filteredServers = useMemo(() => {
    let list = [...(servers || [])];

    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      list = list.filter((s) => (s?.name || "").toLowerCase().includes(q));
    }

    if (regionFilter !== "all") {
      list = list.filter((s) => (s?.region || "Global") === regionFilter);
    }

    if (statusFilter !== "all") {
      list = list.filter((s) => {
        const isActive = currentServer?.id && s?.id === currentServer.id;
        return statusFilter === "active" ? isActive : !isActive;
      });
    }

    list.sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortBy === "name") {
        return (a?.name || "").localeCompare(b?.name || "") * dir;
      }
      if (sortBy === "created_at") {
        const av = a?.created_at ? new Date(a.created_at).getTime() : 0;
        const bv = b?.created_at ? new Date(b.created_at).getTime() : 0;
        return (av - bv) * dir;
      }
      if (sortBy === "updated_at") {
        const av = a?.updated_at ? new Date(a.updated_at).getTime() : 0;
        const bv = b?.updated_at ? new Date(b.updated_at).getTime() : 0;
        return (av - bv) * dir;
      }
      return 0;
    });

    return list;
  }, [servers, searchTerm, regionFilter, statusFilter, sortBy, sortDir, currentServer?.id]);

  async function handleSelectServer(server: any) {
    if (currentServer?.id === server.id) return;

    setLoadingServer(server.id);
    // Optimistic update
    setCurrentServer({ id: server.id, name: server.name });

    try {
      await serverService.setSelectedServer(server.id);
      toast({
        title: "Node Switched",
        description: `Connected to ${server.name} production node.`
      });
    } catch (error) {
      toast({
        title: "Switch Failed",
        description: "Could not establish connection. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoadingServer(null);
    }
  }

  async function handleCreateServer() {
    if (!newServerName.trim()) return;
    try {
      const server = await serverService.deployComplexServer({
        name: newServerName,
        industry: "Event Production",
        blueprint: {
          modules: {
            crm: true,
            events: true,
            finance: true,
            communication: true,
            whatsapp: false
          },
          rules: {
            autoArchive: false,
            requireContract: true,
            enableRealtime: true,
            strictBudgeting: false
          }
        }
      });

      setServers((prev) => [...prev, server]);
      setIsCreateOpen(false);
      setNewServerName("");
      toast({
        title: "Node Provisioned",
        description: `${newServerName} is now online.`
      });
    } catch (error) {
      toast({ title: "Provisioning Failed", variant: "destructive" });
    }
  }

  function clearFilters() {
    setSearchTerm("");
    setRegionFilter("all");
    setStatusFilter("all");
    setSortBy("name");
    setSortDir("asc");
  }

  return (
    <ProtectedRoute>
      <SEO title="Mission Control | Orchestrix" />
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Mission Control</h1>
            <p className="text-muted-foreground mt-1">Manage your active production nodes and global infrastructure.</p>
          </div>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-white gap-2">
                <Plus className="h-4 w-4" />
                Provision New Node
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Deploy New Production Node</DialogTitle>
                <DialogDescription>
                  Provision a new dedicated node for your events and coordination.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Node Name</Label>
                  <Input
                    placeholder="e.g. Manila Production Hub"
                    value={newServerName}
                    onChange={(e) => setNewServerName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Region</Label>
                  <Input
                    placeholder="e.g. South East Asia"
                    value={newServerRegion}
                    onChange={(e) => setNewServerRegion(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateServer}>Deploy Node</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-lg border bg-white p-3 md:p-4">
          <div className="flex flex-col gap-3 md:gap-4">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <div className="relative w-full md:max-w-sm">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search nodes by name..."
                  className="pl-9"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={regionFilter} onValueChange={setRegionFilter}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All regions</SelectItem>
                    {regions.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={(v: StatusFilter) => setStatusFilter(v)}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2 md:ml-auto">
                <Select value={sortBy} onValueChange={(v: SortBy) => setSortBy(v)}>
                  <SelectTrigger className="w-[170px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="created_at">Created</SelectItem>
                    <SelectItem value="updated_at">Updated</SelectItem>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array(6)
              .fill(0)
              .map((_, i) => <Card key={i} className="animate-pulse bg-gray-50 h-[200px]" />)
          ) : filteredServers.length === 0 ? (
            <Card className="col-span-full">
              <CardHeader>
                <CardTitle>No nodes found</CardTitle>
                <CardDescription>Try adjusting your filters or provisioning a new node.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  You can search by name, filter by region or status, and sort the results using the controls above.
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredServers.map((server) => {
              const isActive = currentServer?.id === server.id;
              return (
                <Card
                  key={server.id}
                  className={`group relative overflow-hidden transition-all duration-300 hover:shadow-lg border-2 ${
                    isActive ? "border-primary bg-primary/5" : "border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className={`p-2 rounded-lg ${isActive ? "bg-primary text-white" : "bg-gray-100 text-gray-500"}`}>
                        <ServerIcon className="h-5 w-5" />
                      </div>
                      <Badge variant={isActive ? "default" : "secondary"} className={isActive ? "bg-primary" : ""}>
                        {isActive ? "Active Node" : "Available"}
                      </Badge>
                    </div>
                    <CardTitle className="mt-4 text-xl">{server.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1.5">
                      <Globe className="h-3 w-3" />
                      {server.region || "Global"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-6">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Shield className="h-3.5 w-3.5" />
                        SECURE
                      </div>
                      <div className="flex items-center gap-1">
                        <Zap className="h-3.5 w-3.5" />
                        99.9%
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button
                      onClick={() => handleSelectServer(server)}
                      disabled={isActive || loadingServer === server.id}
                      variant={isActive ? "outline" : "default"}
                      className="w-full transition-all group-hover:gap-3"
                    >
                      {loadingServer === server.id ? "Connecting..." : isActive ? "Connected" : "Switch to Node"}
                      {!isActive && <ChevronRight className="h-4 w-4 transition-all group-hover:translate-x-1" />}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}