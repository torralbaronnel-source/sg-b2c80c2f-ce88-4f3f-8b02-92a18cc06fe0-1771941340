import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, TreePine, Lock, CheckCircle2, XCircle, Zap, ChevronLeft, ChevronRight, Search, Filter } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

const ITEMS_PER_PAGE = 12;

interface RolePermissions {
  [key: string]: {
    view: boolean;
    edit: boolean;
  };
}

interface ExtendedRole {
  id: string;
  name: string;
  hierarchy_level: number;
  permissions: RolePermissions;
  role_type: string;
}

export function HierarchyStatusView() {
  const { user, profile } = useAuth();
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  
  // Safely derive role data
  const roleData = (profile?.role as unknown as ExtendedRole) || {
    name: "Guest",
    hierarchy_level: 10,
    permissions: {},
    role_type: "Internal"
  };

  const hierarchyLevel = roleData?.hierarchy_level ?? 10;
  const powerLevel = Math.max(0, (10 - hierarchyLevel) * 10);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(powerLevel);
    }, 300);
    return () => clearTimeout(timer);
  }, [powerLevel]);

  if (!user) return null;

  const permissions = roleData.permissions || {};
  const permissionEntries = Object.entries(permissions);

  const filteredPermissions = permissionEntries.filter(([key, value]: [string, any]) => {
    const matchesSearch = key.toLowerCase().includes(searchQuery.toLowerCase());
    const isAuthorized = value?.view !== false;
    
    if (statusFilter === "authorized") return matchesSearch && isAuthorized;
    if (statusFilter === "restricted") return matchesSearch && !isAuthorized;
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredPermissions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPermissions = filteredPermissions.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const getTierLabel = (level: number) => {
    if (level === 0) return "Absolute Root (Owner)";
    if (level <= 2) return "Executive Leadership";
    if (level <= 5) return "Management";
    if (level <= 8) return "Specialist / Staff";
    return "Support / Entry";
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-primary/20 bg-primary/5 overflow-hidden relative">
          <motion.div 
            className="absolute top-0 right-0 p-4 opacity-10"
            animate={{ rotate: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Shield className="h-24 w-24" />
          </motion.div>
          
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Current Tier
              </CardTitle>
              <Badge variant="outline" className="text-primary border-primary bg-primary/10">
                Tier {hierarchyLevel}
              </Badge>
            </div>
            <CardDescription>{getTierLabel(hierarchyLevel)}</CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-primary/70">
                <span className="flex items-center gap-1">
                  <Zap className="h-3 w-3" /> Authority Rank
                </span>
                <span>{powerLevel}% Access</span>
              </div>
              <Progress value={animatedProgress} className="h-3 transition-all duration-1000 ease-out" />
            </div>
          </CardContent>
        </Card>

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
                <Badge variant="secondary" className="capitalize">{roleData.role_type || 'Internal'}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Title</span>
                <span className="text-sm font-semibold">{roleData.name}</span>
              </div>
            </div>
          </CardContent>
        </Card>

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

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                Live Permission Matrix
              </CardTitle>
              <CardDescription>
                Real-time access status for your current Tier {hierarchyLevel} clearance.
              </CardDescription>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <div className="relative w-full sm:w-48">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search modules..."
                  className="pl-9 h-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full sm:w-auto">
                <TabsList className="grid grid-cols-3 h-9">
                  <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                  <TabsTrigger value="authorized" className="text-xs">Allowed</TabsTrigger>
                  <TabsTrigger value="restricted" className="text-xs">Denied</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 min-h-[200px]">
            <AnimatePresence mode="popLayout" initial={false}>
              {paginatedPermissions.map(([key, value]: [string, any]) => {
                const isAuthorized = value?.view !== false;
                return (
                  <motion.div
                    key={key}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                      isAuthorized 
                        ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-700 dark:text-emerald-400" 
                        : "bg-destructive/5 border-destructive/20 text-destructive"
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </div>
                    {isAuthorized ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <XCircle className="h-4 w-4 shrink-0" />}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
          
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <p className="text-xs text-muted-foreground">Page {currentPage} of {totalPages}</p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}