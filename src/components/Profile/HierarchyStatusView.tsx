import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, TreePine, Lock, CheckCircle2, XCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function HierarchyStatusView() {
  const { role, profile } = useAuth();
  
  if (!role) return null;

  // Cast to any to access the JSON permissions field which may not be in the base generated type
  const roleData = role as any;
  const permissions = roleData.permissions || {};
  const hierarchyLevel = roleData.hierarchy_level ?? 10;
  // Calculate "Power Level" percentage (0 is 100%, 10 is 10%)
  const powerLevel = Math.max(0, (10 - hierarchyLevel) * 10);

  const getTierLabel = (level: number) => {
    if (level === 0) return "Absolute Root (Owner)";
    if (level <= 2) return "Executive Leadership";
    if (level <= 5) return "Management";
    if (level <= 8) return "Specialist / Staff";
    return "Support / Entry";
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tier Card */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Current Tier
              </CardTitle>
              <Badge variant="outline" className="text-primary border-primary">
                Tier {hierarchyLevel}
              </Badge>
            </div>
            <CardDescription>{getTierLabel(hierarchyLevel)}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span>Authority Rank</span>
                <span>{powerLevel}% Access</span>
              </div>
              <Progress value={powerLevel} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Role Identity */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              Role Identity
            </CardTitle>
            <CardDescription>System classification</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Type</span>
                <Badge variant="secondary" className="capitalize">{role.role_type || 'Internal'}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Title</span>
                <span className="text-sm font-semibold">{role.name}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Structure Status */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <TreePine className="h-5 w-5 text-green-500" />
              Org Presence
            </CardTitle>
            <CardDescription>Reporting visibility</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-sm">Visible in Org Chart</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Your profile is indexed in the Top-Down hierarchy for your department.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Permission Matrix Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Active Permission Matrix
          </CardTitle>
          <CardDescription>Your current functional access across the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(permissions).map(([page, perms]: [string, any]) => (
              <div key={page} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                <div className="flex flex-col">
                  <span className="text-sm font-medium capitalize">{page.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className="text-xs text-muted-foreground">
                    {perms.view ? 'Access Granted' : 'Restricted'}
                  </span>
                </div>
                <div className="flex gap-1">
                  {perms.view ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}