import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, TreePine, Lock, CheckCircle2, XCircle, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  const { role } = useAuth();
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  
  const roleData = role as unknown as ExtendedRole;
  const hierarchyLevel = roleData?.hierarchy_level ?? 10;
  const powerLevel = Math.max(0, (10 - hierarchyLevel) * 10);

  useEffect(() => {
    // Small delay to ensure the tab transition is smooth before filling the bar
    const timer = setTimeout(() => {
      setAnimatedProgress(powerLevel);
    }, 300);
    return () => clearTimeout(timer);
  }, [powerLevel]);

  if (!role) return null;

  const permissions = roleData.permissions || {};
  const permissionEntries = Object.entries(permissions);

  const filteredPermissions = permissionEntries.filter(([key, value]: [string, any]) => {
    const matchesSearch = key.toLowerCase().includes(searchQuery.toLowerCase());
    const isAuthorized = value?.view !== false;
    
    if (statusFilter === "authorized") return matchesSearch && isAuthorized;
    if (statusFilter === "restricted") return matchesSearch && !isAuthorized;
    return matchesSearch;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredPermissions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPermissions = filteredPermissions.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset page when filtering changes
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
        {/* Tier Card */}
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
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              >
                <Badge variant="outline" className="text-primary border-primary bg-primary/10">
                  Tier {hierarchyLevel}
                </Badge>
              </motion.div>
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
              <div className="relative pt-1">
                <Progress value={animatedProgress} className="h-3 transition-all duration-1000 ease-out" />
                {/* Glow effect for high authority tiers */}
                {powerLevel > 70 && (
                  <motion.div 
                    className="absolute inset-0 bg-primary/20 blur-md -z-10 rounded-full"
                    animate={{ opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </div>
              <p className="text-[10px] text-muted-foreground italic">
                {hierarchyLevel === 0 ? "You have unrestricted system-wide overrides." : `Level ${hierarchyLevel} clearance active.`}
              </p>
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
              {paginatedPermissions.length > 0 ? (
                paginatedPermissions.map(([key, value]: [string, any]) => {
                  const isAuthorized = value?.view !== false;
                  return (
                    <motion.div
                      key={key}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
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
                        <span className="text-[10px] opacity-70">
                          {isAuthorized ? "View & Access Enabled" : "Access Restricted"}
                        </span>
                      </div>
                      {isAuthorized ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                      ) : (
                        <XCircle className="h-4 w-4 shrink-0" />
                      )}
                    </motion.div>
                  );
                })
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full py-8 text-center text-muted-foreground text-sm flex flex-col items-center gap-2"
                >
                  <Filter className="h-8 w-8 opacity-20" />
                  No modules match your current filters.
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filteredPermissions.length)} of {filteredPermissions.length} modules
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-xs font-medium w-12 text-center">
                  {currentPage} / {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
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