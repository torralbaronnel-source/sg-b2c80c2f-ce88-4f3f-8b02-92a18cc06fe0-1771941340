import React, { useEffect, useState, useMemo } from "react";
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer, 
  Tooltip,
  Legend
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Shield, Info, Filter, Check, ChevronDown, Save, Bookmark, Trash2, Plus } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ChartData {
  module: string;
  [key: string]: string | number;
}

interface Preset {
  id: string;
  name: string;
  selected_roles: string[];
  selected_modules: string[];
}

export function RoleAnalyticsView() {
  const [rawData, setRawData] = useState<ChartData[]>([]);
  const [allRoles, setAllRoles] = useState<string[]>([]);
  const [allModules, setAllModules] = useState<string[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Presets state
  const [presets, setPresets] = useState<Preset[]>([]);
  const [newPresetName, setNewPresetName] = useState("");
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchAnalyticsData(),
        fetchPresets()
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPresets = async () => {
    try {
      const { data, error } = await supabase
        .from("role_analytics_presets")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPresets(data || []);
    } catch (err) {
      console.error("Error fetching presets:", err);
    }
  };

  const fetchAnalyticsData = async () => {
    try {
      const { data: rolesData, error: rolesError } = await supabase
        .from("roles")
        .select(`
          id, 
          name, 
          role_permissions (
            module, 
            can_view, 
            can_create, 
            can_update, 
            can_delete
          )
        `);

      if (rolesError) throw rolesError;

      const modulesSet = new Set<string>();
      rolesData?.forEach(r => {
        if (r.role_permissions) {
          r.role_permissions.forEach(p => modulesSet.add(p.module));
        }
      });

      const roleNames = rolesData?.map(r => r.name) || [];
      const moduleNames = Array.from(modulesSet);

      const processedData: ChartData[] = moduleNames.map(module => {
        const entry: ChartData = { module };
        rolesData?.forEach(role => {
          const perm = role.role_permissions?.find(p => p.module === module);
          let score = 0;
          if (perm?.can_view) score += 1;
          if (perm?.can_create) score += 1;
          if (perm?.can_update) score += 1;
          if (perm?.can_delete) score += 1;
          entry[role.name] = score;
        });
        return entry;
      });

      setRawData(processedData);
      setAllRoles(roleNames);
      setAllModules(moduleNames);
      
      // Initially select all if no presets or previous state
      if (selectedRoles.length === 0) setSelectedRoles(roleNames);
      if (selectedModules.length === 0) setSelectedModules(moduleNames);
    } catch (err) {
      console.error("Error fetching role analytics:", err);
    }
  };

  const filteredData = useMemo(() => {
    return rawData
      .filter(item => selectedModules.includes(item.module))
      .map(item => {
        const filteredItem: ChartData = { module: item.module };
        selectedRoles.forEach(role => {
          filteredItem[role] = item[role];
        });
        return filteredItem;
      });
  }, [rawData, selectedRoles, selectedModules]);

  const roleColors = [
    "#059669", // Emerald 600
    "#2563eb", // Blue 600
    "#d97706", // Amber 600
    "#dc2626", // Red 600
    "#7c3aed", // Violet 600
    "#db2777", // Pink 600
  ];

  const handleSavePreset = async () => {
    if (!newPresetName.trim()) return;

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("role_analytics_presets")
        .insert({
          name: newPresetName,
          user_id: userData.user.id,
          selected_roles: selectedRoles,
          selected_modules: selectedModules
        })
        .select()
        .single();

      if (error) throw error;

      setPresets([data, ...presets]);
      setNewPresetName("");
      setIsSaveDialogOpen(false);
      toast({
        title: "Preset Saved",
        description: `Successfully saved "${newPresetName}" preset.`
      });
    } catch (err) {
      console.error("Error saving preset:", err);
      toast({
        title: "Error",
        description: "Failed to save preset. Please try again.",
        variant: "destructive"
      });
    }
  };

  const applyPreset = (preset: Preset) => {
    // Filter out roles/modules that might no longer exist
    const validRoles = preset.selected_roles.filter(r => allRoles.includes(r));
    const validModules = preset.selected_modules.filter(m => allModules.includes(m));
    
    setSelectedRoles(validRoles);
    setSelectedModules(validModules);
    
    toast({
      title: "Preset Applied",
      description: `Loaded filter configuration: ${preset.name}`
    });
  };

  const deletePreset = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      const { error } = await supabase
        .from("role_analytics_presets")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setPresets(presets.filter(p => p.id !== id));
      toast({
        title: "Preset Deleted",
        description: "The custom preset has been removed."
      });
    } catch (err) {
      console.error("Error deleting preset:", err);
    }
  };

  const toggleRole = (role: string) => {
    setSelectedRoles(prev => 
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };

  const toggleModule = (module: string) => {
    setSelectedModules(prev => 
      prev.includes(module) ? prev.filter(m => m !== module) : [...prev, module]
    );
  };

  if (loading) {
    return (
      <Card className="border-slate-200">
        <CardHeader>
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-4 w-[300px]" />
        </CardHeader>
        <CardContent className="h-[400px]">
          <Skeleton className="h-full w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex flex-wrap gap-2">
          {/* Preset Management */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1 bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100">
                <Bookmark className="h-3.5 w-3.5" />
                Presets
                <ChevronDown className="h-3.5 w-3.5 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Saved Configurations</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {presets.length === 0 ? (
                <div className="p-4 text-center text-xs text-muted-foreground italic">
                  No saved presets yet
                </div>
              ) : (
                <ScrollArea className="max-h-60">
                  {presets.map(preset => (
                    <DropdownMenuItem 
                      key={preset.id} 
                      onClick={() => applyPreset(preset)}
                      className="flex justify-between items-center group"
                    >
                      <span className="truncate mr-2">{preset.name}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:text-red-600"
                        onClick={(e) => deletePreset(e, preset.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </DropdownMenuItem>
                  ))}
                </ScrollArea>
              )}
              <DropdownMenuSeparator />
              <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
                <DialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-emerald-600 font-medium">
                    <Plus className="h-3.5 w-3.5 mr-2" />
                    Save Current View
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Save Analytics Preset</DialogTitle>
                    <DialogDescription>
                      Save your current selection of {selectedRoles.length} roles and {selectedModules.length} modules for future use.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Input 
                      placeholder="e.g., Executive Audit 2024" 
                      value={newPresetName}
                      onChange={(e) => setNewPresetName(e.target.value)}
                    />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsSaveDialogOpen(false)}>Cancel</Button>
                    <Button 
                      className="bg-emerald-600 hover:bg-emerald-700" 
                      onClick={handleSavePreset}
                      disabled={!newPresetName.trim()}
                    >
                      Save Preset
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Role Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <Filter className="h-3.5 w-3.5" />
                Roles
                <Badge variant="secondary" className="ml-1 px-1 h-5 text-[10px]">
                  {selectedRoles.length}
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Visible Roles</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <ScrollArea className="h-72">
                {allRoles.map(role => (
                  <DropdownMenuCheckboxItem
                    key={role}
                    checked={selectedRoles.includes(role)}
                    onCheckedChange={() => toggleRole(role)}
                  >
                    {role}
                  </DropdownMenuCheckboxItem>
                ))}
              </ScrollArea>
              <DropdownMenuSeparator />
              <div className="flex p-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full text-xs" 
                  onClick={() => setSelectedRoles(allRoles)}
                >
                  Select All
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full text-xs" 
                  onClick={() => setSelectedRoles([])}
                >
                  Clear
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Module Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <Shield className="h-3.5 w-3.5" />
                Modules
                <Badge variant="secondary" className="ml-1 px-1 h-5 text-[10px]">
                  {selectedModules.length}
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Visible Modules</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <ScrollArea className="h-72">
                {allModules.map(module => (
                  <DropdownMenuCheckboxItem
                    key={module}
                    checked={selectedModules.includes(module)}
                    onCheckedChange={() => toggleModule(module)}
                  >
                    {module}
                  </DropdownMenuCheckboxItem>
                ))}
              </ScrollArea>
              <DropdownMenuSeparator />
              <div className="flex p-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full text-xs" 
                  onClick={() => setSelectedModules(allModules)}
                >
                  Select All
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full text-xs" 
                  onClick={() => setSelectedModules([])}
                >
                  Clear
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="text-xs text-muted-foreground">
          Showing {filteredData.length} modules across {selectedRoles.length} roles
        </div>
      </div>

      <Card className="border-slate-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5 text-emerald-600" />
            Authority Distribution Analysis
          </CardTitle>
          <CardDescription>
            Radar view of system-wide privileges based on active filters.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredData.length > 0 && selectedRoles.length > 0 ? (
            <div className="h-[550px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={filteredData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis 
                    dataKey="module" 
                    tick={{ fill: "#64748b", fontSize: 11 }} 
                  />
                  <PolarRadiusAxis 
                    angle={30} 
                    domain={[0, 4]} 
                    tick={{ fill: "#94a3b8", fontSize: 10 }}
                  />
                  {selectedRoles.map((roleName) => {
                    const colorIndex = allRoles.indexOf(roleName);
                    return (
                      <Radar
                        key={roleName}
                        name={roleName}
                        dataKey={roleName}
                        stroke={roleColors[colorIndex % roleColors.length]}
                        fill={roleColors[colorIndex % roleColors.length]}
                        fillOpacity={0.15}
                      />
                    );
                  })}
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "rgba(255, 255, 255, 0.95)", 
                      borderRadius: "12px", 
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    iconType="circle" 
                    wrapperStyle={{ paddingTop: "30px" }} 
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50 text-muted-foreground italic">
              Select at least one role and one module to generate analysis
            </div>
          )}
        </CardContent>
      </Card>

      <Alert variant="default" className="bg-emerald-50/50 border-emerald-100">
        <Info className="h-4 w-4 text-emerald-600" />
        <AlertTitle className="text-emerald-900 font-semibold">Security Insight</AlertTitle>
        <AlertDescription className="text-emerald-800 text-sm">
          <strong>How to read:</strong> The radar "spike" for a specific module represents the depth of authority. A score of 4 means full CRUD access, while 1 indicates read-only. Comparing shapes helps identify privilege escalation or restrictive bottlenecks in your workflow.
        </AlertDescription>
      </Alert>
    </div>
  );
}