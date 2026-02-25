import React, { useEffect, useState } from "react";
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
import { Shield, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

interface ChartData {
  module: string;
  [key: string]: string | number;
}

export function RoleAnalyticsView() {
  const [data, setData] = useState<ChartData[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Fetch all roles and their permissions
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

      // Process data for Recharts
      const modulesSet = new Set<string>();
      rolesData?.forEach(r => {
        if (r.role_permissions) {
          r.role_permissions.forEach(p => modulesSet.add(p.module));
        }
      });

      const processedData: ChartData[] = Array.from(modulesSet).map(module => {
        const entry: ChartData = { module };
        rolesData?.forEach(role => {
          const perm = role.role_permissions?.find(p => p.module === module);
          // Calculate authority score (0-4 based on CRUD)
          let score = 0;
          if (perm?.can_view) score += 1;
          if (perm?.can_create) score += 1;
          if (perm?.can_update) score += 1;
          if (perm?.can_delete) score += 1;
          
          entry[role.name] = score;
        });
        return entry;
      });

      setData(processedData);
      setRoles(rolesData?.map(r => r.name) || []);
    } catch (err) {
      console.error("Error fetching role analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  const roleColors = [
    "#059669", // Emerald 600
    "#2563eb", // Blue 600
    "#d97706", // Amber 600
    "#dc2626", // Red 600
    "#7c3aed", // Violet 600
    "#db2777", // Pink 600
  ];

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

  if (data.length === 0) {
    return (
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle>Security Analytics</CardTitle>
          <CardDescription>No permission data available to analyze.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-slate-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-emerald-600" />
            <div>
              <CardTitle>Permission Distribution Radar</CardTitle>
              <CardDescription>
                Visual comparison of authority scores (CRUD density) across modules.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[500px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis 
                  dataKey="module" 
                  tick={{ fill: "#64748b", fontSize: 12 }} 
                />
                <PolarRadiusAxis 
                  angle={30} 
                  domain={[0, 4]} 
                  tick={{ fill: "#94a3b8" }}
                />
                {roles.map((roleName, index) => (
                  <Radar
                    key={roleName}
                    name={roleName}
                    dataKey={roleName}
                    stroke={roleColors[index % roleColors.length]}
                    fill={roleColors[index % roleColors.length]}
                    fillOpacity={0.2}
                  />
                ))}
                <Tooltip 
                  contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e2e8f0" }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: "20px" }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Analytics Insight</AlertTitle>
        <AlertDescription>
          The authority score (0-4) is calculated based on Create, Read, Update, and Delete capabilities. A wider area on the chart indicates higher system-wide privilege.
        </AlertDescription>
      </Alert>
    </div>
  );
}