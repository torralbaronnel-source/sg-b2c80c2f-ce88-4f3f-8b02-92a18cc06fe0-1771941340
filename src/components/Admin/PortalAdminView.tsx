import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  ShieldCheck, 
  UserPlus, 
  Mail, 
  Settings,
  MoreVertical,
  CheckCircle2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";

export function PortalAdminView() {
  const { currentOrganization: activeOrg } = useAuth();
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const MOCK_MEMBERS = [
    { id: "1", name: "Admin User", email: "admin@orchestrix.com", role: "Owner", status: "Active" },
    { id: "2", name: "Jane Coordinator", email: "jane@orchestrix.com", role: "Coordinator", status: "Active" },
    { id: "3", name: "Mark Stylist", email: "mark@orchestrix.com", role: "Staff", status: "Pending" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
            Portal Admin
            <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">
              {activeOrg?.name || "Company Management"}
            </Badge>
          </h1>
          <p className="text-slate-500 mt-1">Manage your team members, roles, and organization settings.</p>
        </div>
        <Button className="bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20 gap-2">
          <UserPlus className="w-4 h-4" /> Invite Member
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Users className="w-4 h-4" /> Total Team
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-slate-900">12</div>
            <p className="text-xs text-emerald-500 font-bold mt-1">+2 this month</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Active Roles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-slate-900">4</div>
            <p className="text-xs text-slate-400 font-bold mt-1">Standard preset</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Mail className="w-4 h-4" /> Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-rose-500">3</div>
            <p className="text-xs text-slate-400 font-bold mt-1">Awaiting confirmation</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm bg-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-black">Team Members</CardTitle>
            <CardDescription>Manage user access and assign responsibilities.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Input placeholder="Search members..." className="h-9 w-[250px] bg-slate-50 border-none" />
            </div>
            <Button variant="outline" size="icon" className="h-9 w-9">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-slate-100">
                <TableHead className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Name</TableHead>
                <TableHead className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Email</TableHead>
                <TableHead className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Role</TableHead>
                <TableHead className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_MEMBERS.map((member) => (
                <TableRow key={member.id} className="border-slate-50 group hover:bg-slate-50/50 transition-colors">
                  <TableCell className="font-bold text-slate-900">{member.name}</TableCell>
                  <TableCell className="text-slate-500 font-medium">{member.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn(
                      "font-bold text-[10px] tracking-widest uppercase border-none px-0",
                      member.role === 'Owner' ? "text-primary" : "text-slate-400"
                    )}>
                      {member.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        member.status === 'Active' ? "bg-emerald-500" : "bg-amber-500"
                      )} />
                      <span className="text-xs font-bold text-slate-600">{member.status}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}