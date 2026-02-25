import React, { useState, useEffect } from "react";
import { 
  Users, 
  Settings2, 
  ShieldCheck, 
  Network, 
  Save, 
  Plus, 
  Trash2,
  Lock,
  Eye,
  Edit3,
  Search,
  ChevronRight,
  UserPlus,
  Globe
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function OrgManagementView() {
  const { toast } = useToast();
  const [roles, setRoles] = useState<any[]>([]);
  const [pages, setPages] = useState<any[]>([]);
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [rolePermissions, setRolePermissions] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [isNewRoleOpen, setIsNewRoleOpen] = useState(false);
  const [newRoleData, setNewRoleData] = useState({ name: '', level: 10 });

  useEffect(() => {
    fetchBaseData();
  }, []);

  const fetchBaseData = async () => {
    const [rolesRes, pagesRes] = await Promise.all([
      supabase.from("roles").select("*").order("hierarchy_level", { ascending: true }),
      supabase.from("app_pages").select("*").order("module", { ascending: true })
    ]);

    if (rolesRes.data) setRoles(rolesRes.data);
    if (pagesRes.data) setPages(pagesRes.data);
    setLoading(false);
  };

  const loadRolePermissions = async (roleId: string) => {
    const { data } = await supabase
      .from("role_page_permissions")
      .select("*")
      .eq("role_id", roleId);
    
    const permMap: Record<string, any> = {};
    data?.forEach(p => {
      permMap[p.page_id] = p;
    });
    setRolePermissions(permMap);
  };

  const handleRoleSelect = (role: any) => {
    setSelectedRole(role);
    loadRolePermissions(role.id);
  };

  const togglePermission = async (pageId: string, field: string) => {
    if (!selectedRole) return;

    const current = rolePermissions[pageId] || { 
      role_id: selectedRole.id, 
      page_id: pageId, 
      can_view: false, 
      can_edit: false, 
      can_delete: false 
    };

    const updated = { ...current, [field]: !current[field] };

    const { error } = await supabase
      .from("role_page_permissions")
      .upsert(updated);

    if (error) {
      toast({ title: "Update Failed", description: error.message, variant: "destructive" });
    } else {
      setRolePermissions(prev => ({ ...prev, [pageId]: updated }));
    }
  };

  const createRole = async () => {
    if (!newRoleData.name) return;
    
    const { data, error } = await supabase
      .from("roles")
      .insert({
        name: newRoleData.name,
        hierarchy_level: newRoleData.level,
        status: 'active',
        is_system_role: false
      })
      .select()
      .single();

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setRoles(prev => [...prev, data].sort((a, b) => a.hierarchy_level - b.hierarchy_level));
      setIsNewRoleOpen(false);
      setNewRoleData({ name: '', level: 10 });
      toast({ title: "Success", description: "Role created successfully" });
    }
  };

  const deleteRole = async (roleId: string) => {
    const { error } = await supabase.from("roles").delete().eq("id", roleId);
    if (error) {
      toast({ title: "Delete Failed", description: "Cannot delete a role assigned to users", variant: "destructive" });
    } else {
      setRoles(prev => prev.filter(r => r.id !== roleId));
      setSelectedRole(null);
    }
  };

  // Group roles by type
  const internalRoles = roles.filter(r => r.role_type === 'internal').sort((a, b) => a.hierarchy_level - b.hierarchy_level);
  const externalRoles = roles.filter(r => r.role_type === 'external');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Portal Configuration</h2>
          <p className="text-muted-foreground text-sm">Define your custom organization structure and page-level rules</p>
        </div>
        
        <Dialog open={isNewRoleOpen} onOpenChange={setIsNewRoleOpen}>
          <DialogTrigger asChild>
            <Button className="shadow-sm">
              <Plus className="h-4 w-4 mr-2" /> Create Custom Role
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Role</DialogTitle>
              <DialogDescription>Define a new position within your organization.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Role Name</label>
                <Input 
                  placeholder="e.g. Senior Event Planner" 
                  value={newRoleData.name} 
                  onChange={e => setNewRoleData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Hierarchy Tier (0-10)</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={newRoleData.level}
                  onChange={(e) => setNewRoleData({ ...newRoleData, level: Math.min(10, Math.max(0, parseInt(e.target.value) || 0)) })}
                  className="w-full p-2 border rounded-md bg-background"
                />
                <p className="text-[11px] text-muted-foreground italic">
                  0 = Root Authority (Owner). 10 = Entry/Support Level. 
                  Internal tiers define the reporting structure for the Org Chart.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewRoleOpen(false)}>Cancel</Button>
              <Button onClick={createRole}>Create Role</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1 p-4 space-y-6 overflow-y-auto max-h-[800px]">
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" /> Internal Team
            </h3>
            <div className="space-y-1">
              {internalRoles.map(role => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex justify-between items-center",
                    selectedRole?.id === role.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  )}
                >
                  <span>{role.name}</span>
                  <span className="text-[10px] opacity-70">Lvl {role.hierarchy_level}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Globe className="h-4 w-4 text-blue-500" /> External Partners
            </h3>
            <div className="space-y-1">
              {externalRoles.map(role => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                    selectedRole?.id === role.id ? "bg-blue-600 text-white" : "hover:bg-muted"
                  )}
                >
                  {role.name}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Permissions Editor */}
        <Card className="md:col-span-3 border-none shadow-sm">
          {selectedRole ? (
            <>
              <CardHeader className="border-b bg-slate-50/30">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Permissions: {selectedRole.name}</CardTitle>
                    <CardDescription>Configure page-level access and data visibility rules</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {!selectedRole.is_system_role && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => deleteRole(selectedRole.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" /> Delete Role
                      </Button>
                    )}
                    <Select defaultValue={selectedRole.status}>
                      <SelectTrigger className="w-[140px] h-8 text-xs">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                        <SelectItem value="restricted">Restricted</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-slate-50/50">
                    <TableRow>
                      <TableHead className="w-[250px]">Page / Module</TableHead>
                      <TableHead className="text-center">View</TableHead>
                      <TableHead className="text-center">Edit</TableHead>
                      <TableHead className="text-center">Delete</TableHead>
                      <TableHead className="w-[180px]">Data Scope</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pages.map((page) => {
                      const perm = rolePermissions[page.id] || { can_view: false, can_edit: false, can_delete: false, data_scope: 'self' };
                      return (
                        <TableRow key={page.id} className="hover:bg-slate-50/30 transition-colors">
                          <TableCell>
                            <div>
                              <p className="font-medium text-sm">{page.name}</p>
                              <p className="text-[10px] text-muted-foreground">{page.module} • {page.route}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Switch 
                              checked={perm.can_view} 
                              onCheckedChange={() => togglePermission(page.id, 'can_view')} 
                              className="scale-75"
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <Switch 
                              checked={perm.can_edit} 
                              disabled={!perm.can_view}
                              onCheckedChange={() => togglePermission(page.id, 'can_edit')}
                              className="scale-75"
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <Switch 
                              checked={perm.can_delete} 
                              disabled={!perm.can_edit}
                              onCheckedChange={() => togglePermission(page.id, 'can_delete')}
                              className="scale-75"
                            />
                          </TableCell>
                          <TableCell>
                            <Select 
                              disabled={!perm.can_view}
                              value={perm.data_scope}
                              onValueChange={(val) => {
                                const updated = { ...perm, data_scope: val, role_id: selectedRole.id, page_id: page.id };
                                supabase.from("role_page_permissions").upsert(updated).then(() => {
                                  setRolePermissions(prev => ({ ...prev, [page.id]: updated }));
                                });
                              }}
                            >
                              <SelectTrigger className="h-8 text-[11px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">Global (All Data)</SelectItem>
                                <SelectItem value="team">Hierarchy (Managed Team)</SelectItem>
                                <SelectItem value="self">Owner Only (Assigned)</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </>
          ) : (
            <div className="h-[500px] flex flex-col items-center justify-center text-muted-foreground bg-slate-50/20 rounded-xl border border-dashed m-6">
              <Network className="h-12 w-12 mb-4 opacity-20" />
              <p>Select a role from the sidebar to configure SaaS permissions</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}