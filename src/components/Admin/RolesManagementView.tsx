import React, { useState, useEffect } from "react";
import { 
  Shield, 
  Users, 
  Lock, 
  Plus, 
  Save, 
  Trash2, 
  ChevronRight,
  CheckCircle2,
  XCircle,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Role {
  id: string;
  name: string;
  description: string;
  is_system: boolean;
}

interface Permission {
  module: string;
  can_view: boolean;
  can_create: boolean;
  can_update: boolean;
  can_delete: boolean;
}

const MODULES = [
  "CRM",
  "Events",
  "Finance",
  "Production",
  "Communication",
  "Admin",
  "Inventory"
];

export function RolesManagementView() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadRoles();
  }, []);

  useEffect(() => {
    if (selectedRoleId) {
      loadPermissions(selectedRoleId);
    }
  }, [selectedRoleId]);

  async function loadRoles() {
    // Using any cast to bypass temporary type generation lag
    const { data, error } = await (supabase.from("roles") as any).select("*").order("name");
    if (data) {
      setRoles(data as Role[]);
      if (data.length > 0 && !selectedRoleId) setSelectedRoleId(data[0].id);
    }
    setLoading(false);
  }

  async function loadPermissions(roleId: string) {
    const { data, error } = await (supabase
      .from("role_permissions") as any)
      .select("*")
      .eq("role_id", roleId);

    if (data) {
      const dbPerms = data as any[];
      // Map existing or create defaults for all modules
      const fullPerms = MODULES.map(m => {
        const existing = dbPerms.find(p => p.module === m);
        return existing || {
          module: m,
          can_view: false,
          can_create: false,
          can_update: false,
          can_delete: false
        };
      });
      setPermissions(fullPerms);
    }
  }

  const handlePermissionChange = (module: string, field: keyof Permission, value: boolean) => {
    setPermissions(prev => prev.map(p => 
      p.module === module ? { ...p, [field]: value } : p
    ));
  };

  async function savePermissions() {
    if (!selectedRoleId) return;
    setSaving(true);
    
    try {
      const permsToSave = permissions.map(p => ({
        role_id: selectedRoleId,
        module: p.module,
        can_view: p.can_view,
        can_create: p.can_create,
        can_update: p.can_update,
        can_delete: p.can_delete
      }));

      const { error } = await (supabase
        .from("role_permissions") as any)
        .upsert(permsToSave, { onConflict: "role_id,module" });

      if (error) throw error;

      toast({
        title: "Permissions Updated",
        description: "Access levels have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error Saving",
        description: "Failed to update role permissions.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading access control...</div>;

  const selectedRole = roles.find(r => r.id === selectedRoleId);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[calc(100vh-12rem)]">
      {/* Roles List */}
      <Card className="md:col-span-4 lg:col-span-3 flex flex-col h-full overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Roles</CardTitle>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>System access levels</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-2">
          <div className="space-y-1">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => setSelectedRoleId(role.id)}
                className={`w-full text-left px-3 py-3 rounded-lg transition-all flex items-center justify-between group ${
                  selectedRoleId === role.id 
                    ? "bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100" 
                    : "hover:bg-slate-50 text-slate-600"
                }`}
              >
                <div className="flex flex-col gap-0.5">
                  <span className={`text-sm font-bold ${selectedRoleId === role.id ? "text-blue-700" : "text-slate-900"}`}>
                    {role.name}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium truncate w-40">
                    {role.description}
                  </span>
                </div>
                {role.is_system && <Shield className="h-3 w-3 text-slate-300" />}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Permissions Editor */}
      <Card className="md:col-span-8 lg:col-span-9 flex flex-col h-full overflow-hidden">
        <CardHeader className="border-b bg-slate-50/50 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                {selectedRole?.name}
                {selectedRole?.is_system && (
                  <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    System Protected
                  </span>
                )}
              </CardTitle>
              <CardDescription>{selectedRole?.description}</CardDescription>
            </div>
            <Button onClick={savePermissions} disabled={saving} className="bg-blue-600 hover:bg-blue-700 gap-2">
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save Permissions"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-0">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="sticky top-0 bg-white border-b z-10">
              <tr className="text-slate-400 uppercase text-[10px] font-bold tracking-widest">
                <th className="px-6 py-4">Module / Feature</th>
                <th className="px-4 py-4 text-center">View</th>
                <th className="px-4 py-4 text-center">Create</th>
                <th className="px-4 py-4 text-center">Update</th>
                <th className="px-4 py-4 text-center">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {permissions.map((perm) => (
                <tr key={perm.module} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900">{perm.module} Access</span>
                      <span className="text-[11px] text-slate-400 font-medium">Global permissions for {perm.module.toLowerCase()}</span>
                    </div>
                  </td>
                  {["view", "create", "update", "delete"].map((action) => {
                    const field = `can_${action}` as keyof Permission;
                    return (
                      <td key={action} className="px-4 py-5 text-center">
                        <div className="flex justify-center">
                          <Checkbox
                            checked={perm[field] as boolean}
                            onCheckedChange={(val) => 
                              handlePermissionChange(perm.module, field, val as boolean)
                            }
                            disabled={selectedRole?.name === "Super Admin"}
                            className="h-5 w-5 border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                          />
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="p-8 bg-slate-50/50 border-t">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-50 border border-blue-100">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-bold text-blue-900">Permission Hierarchy</p>
                <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                  Permissions are additive. If a user is assigned multiple roles, they gain the highest level of access available. 
                  Super Admin permissions are hardcoded and cannot be modified via this dashboard.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}