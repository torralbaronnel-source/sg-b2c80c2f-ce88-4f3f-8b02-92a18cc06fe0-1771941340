import React, { useState, useEffect } from "react";
import { 
  Users, 
  Search, 
  Mail, 
  Shield, 
  MoreVertical, 
  UserPlus, 
  CheckCircle2, 
  XCircle,
  Clock
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  role_id: string | null;
  created_at: string;
  roles?: {
    name: string;
  };
}

interface Role {
  id: string;
  name: string;
}

export function UserManagementView() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      // Fetch users with their roles
      const { data: userData, error: userError } = await (supabase
        .from("profiles") as any)
        .select(`
          id,
          email,
          full_name,
          role_id,
          created_at,
          roles (name)
        `)
        .order("created_at", { ascending: false });

      if (userError) throw userError;
      setUsers(userData || []);

      // Fetch available roles
      const { data: roleData, error: roleError } = await (supabase
        .from("roles") as any)
        .select("id, name");

      if (roleError) throw roleError;
      setRoles(roleData || []);
    } catch (error: any) {
      toast({
        title: "Error loading users",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function updateUserRole(userId: string, roleId: string | null) {
    try {
      const { error } = await (supabase
        .from("profiles") as any)
        .update({ role_id: roleId })
        .eq("id", userId);

      if (error) throw error;

      toast({
        title: "Role Updated",
        description: "User access level has been modified.",
      });
      loadData();
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  }

  const filteredUsers = users.filter(user => 
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search staff by name or email..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <UserPlus className="mr-2 h-4 w-4" />
          Invite Staff
        </Button>
      </div>

      {/* Users Table - Desktop */}
      <div className="hidden md:block rounded-lg border bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50">
              <TableHead className="w-[300px]">User / Email</TableHead>
              <TableHead>Role / Permissions</TableHead>
              <TableHead>Account Status</TableHead>
              <TableHead>Joined Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-slate-400">
                  Syncing user database...
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-slate-400">
                  No matching users found.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-slate-50/30">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                        {user.full_name?.charAt(0) || "U"}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{user.full_name || "New User"}</span>
                        <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                          <Mail className="h-2.5 w-2.5" />
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="secondary" 
                      className={`font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 ${
                        user.roles?.name === "Super Admin" 
                          ? "bg-purple-50 text-purple-700 border-purple-100" 
                          : "bg-blue-50 text-blue-700 border-blue-100"
                      }`}
                    >
                      <Shield className="h-3 w-3 mr-1" />
                      {user.roles?.name || "Unassigned"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-green-600 font-bold text-[11px]">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      ACTIVE
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium">
                      <Clock className="h-3.5 w-3.5" />
                      {new Date(user.created_at).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Manage Access</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {roles.map((role) => (
                          <DropdownMenuItem 
                            key={role.id}
                            onClick={() => updateUserRole(user.id, role.id)}
                            className="text-xs"
                          >
                            Assign {role.name}
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600 focus:text-red-600 text-xs">
                          Suspend Account
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Users Card List - Mobile */}
      <div className="md:hidden space-y-4">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full"></div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-xl border border-dashed">
            <p className="text-sm text-muted-foreground">No users found</p>
          </div>
        ) : (
          filteredUsers.map((user) => (
            <Card key={user.id} className="border-slate-200 shadow-sm overflow-hidden">
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" />
                      <AvatarFallback className="text-[10px]">{user.full_name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-sm font-bold text-slate-900">{user.full_name || "New User"}</CardTitle>
                      <CardDescription className="text-[10px] truncate max-w-[150px]">{user.email}</CardDescription>
                    </div>
                  </div>
                  <Badge className="text-[10px] px-2" variant="outline">
                    {user.roles?.name || "Unassigned"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-3">
                <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                   <div className="text-[10px] text-slate-500 font-medium">
                     Joined {new Date(user.created_at).toLocaleDateString()}
                   </div>
                   <div className="flex gap-2">
                     <Button variant="ghost" size="sm" className="h-7 text-[10px] px-2">Edit</Button>
                     <Button variant="ghost" size="sm" className="h-7 text-[10px] px-2 text-destructive">Delete</Button>
                   </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}