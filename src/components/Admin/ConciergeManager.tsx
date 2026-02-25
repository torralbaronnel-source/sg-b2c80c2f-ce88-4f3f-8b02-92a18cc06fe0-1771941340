import React, { useState, useEffect } from "react";
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from "@/components/ui/card";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { 
  conciergeService, 
  ConciergeRequest, 
  ConciergeStatus, 
  ConciergePriority 
} from "@/services/conciergeService";
import { useToast } from "@/hooks/use-toast";
import { 
  User, Mail, Phone, Building, Layers, 
  MoreVertical, CheckCircle2, Clock, ShieldAlert,
  Star, MessageSquare, Edit3
} from "lucide-react";
import { format } from "date-fns";

export function ConciergeManager() {
  const [requests, setRequests] = useState<ConciergeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await conciergeService.getAllRequests();
      setRequests(data);
    } catch (error) {
      console.error("Error fetching concierge requests:", error);
      toast({
        title: "Error",
        description: "Failed to load concierge requests.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: ConciergeStatus) => {
    try {
      await conciergeService.updateRequestStatus(id, status);
      toast({
        title: "Status Updated",
        description: `Request status changed to ${status}.`,
      });
      fetchRequests();
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Could not update status.",
        variant: "destructive",
      });
    }
  };

  const handlePriorityUpdate = async (id: string, priority: ConciergePriority) => {
    try {
      await conciergeService.updateRequestPriority(id, priority);
      toast({
        title: "Priority Updated",
        description: `Request priority set to ${priority}.`,
      });
      fetchRequests();
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Could not update priority.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: ConciergeStatus) => {
    switch (status) {
      case "New": return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">New</Badge>;
      case "Contacted": return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Contacted</Badge>;
      case "Scheduled": return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">Scheduled</Badge>;
      case "In Progress": return <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100">In Progress</Badge>;
      case "Completed": return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Completed</Badge>;
      case "Archived": return <Badge variant="secondary">Archived</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: ConciergePriority) => {
    switch (priority) {
      case "VIP": return <Badge className="bg-rose-500 text-white hover:bg-rose-500"><Star className="w-3 h-3 mr-1" /> VIP</Badge>;
      case "High": return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">High</Badge>;
      case "Medium": return <Badge className="bg-stone-100 text-stone-700 hover:bg-stone-100">Medium</Badge>;
      case "Low": return <Badge variant="outline">Low</Badge>;
      default: return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getRequestTypeIcon = (type: string) => {
    switch (type) {
      case "Private Demo": return <Layers className="w-4 h-4 text-blue-500" />;
      case "Business Consultation": return <MessageSquare className="w-4 h-4 text-amber-500" />;
      case "Portal Customization": return <Edit3 className="w-4 h-4 text-purple-500" />;
      default: return null;
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-stone-400">Loading requests...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-serif text-stone-800">Private Concierge</h2>
          <p className="text-stone-500">Manage demo requests, consultations, and portal customizations.</p>
        </div>
        <Button onClick={fetchRequests} variant="outline" size="sm">
          <Clock className="w-4 h-4 mr-2" /> Refresh
        </Button>
      </div>

      <Card className="border-stone-100 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-stone-50">
              <TableRow>
                <TableHead>Client & Contact</TableHead>
                <TableHead>Request Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-stone-400">
                    No concierge requests found.
                  </TableCell>
                </TableRow>
              ) : (
                requests.map((req) => (
                  <TableRow key={req.id} className="hover:bg-stone-50/50 transition-colors">
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-stone-900 flex items-center">
                          {req.full_name}
                          {req.company_name && <span className="ml-2 text-xs text-stone-400 font-normal">at {req.company_name}</span>}
                        </span>
                        <div className="flex flex-col text-xs text-stone-500 space-y-0.5">
                          <span className="flex items-center"><Mail className="w-3 h-3 mr-1.5" /> {req.email}</span>
                          {req.phone && <span className="flex items-center"><Phone className="w-3 h-3 mr-1.5" /> {req.phone}</span>}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          {getRequestTypeIcon(req.request_type)}
                          {req.request_type}
                        </div>
                        {req.interested_modules && req.interested_modules.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {req.interested_modules.slice(0, 2).map(m => (
                              <span key={m} className="px-1.5 py-0.5 bg-stone-100 rounded text-[10px] text-stone-600 uppercase tracking-wider font-semibold">
                                {m}
                              </span>
                            ))}
                            {req.interested_modules.length > 2 && (
                              <span className="text-[10px] text-stone-400">+{req.interested_modules.length - 2} more</span>
                            )}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(req.status!)}</TableCell>
                    <TableCell>{getPriorityBadge(req.priority!)}</TableCell>
                    <TableCell className="text-xs text-stone-500">
                      {req.created_at ? format(new Date(req.created_at), "MMM d, yyyy") : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <div className="px-2 py-1.5 text-xs font-semibold text-stone-500">Set Status</div>
                          <DropdownMenuItem onClick={() => handleStatusUpdate(req.id!, "Contacted")}>Contacted</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusUpdate(req.id!, "Scheduled")}>Scheduled</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusUpdate(req.id!, "In Progress")}>Mark In Progress</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusUpdate(req.id!, "Completed")}>Mark Completed</DropdownMenuItem>
                          
                          <DropdownMenuSeparator />
                          <div className="px-2 py-1.5 text-xs font-semibold text-stone-500">Set Priority</div>
                          <DropdownMenuItem onClick={() => handlePriorityUpdate(req.id!, "VIP")}>Mark as VIP</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handlePriorityUpdate(req.id!, "High")}>High Priority</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handlePriorityUpdate(req.id!, "Medium")}>Medium Priority</DropdownMenuItem>
                          
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-rose-600" onClick={() => handleStatusUpdate(req.id!, "Archived")}>
                            Archive Request
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Details Panel - To be expanded for "speaking" / notes */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-stone-100">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-500" /> 
              Recent Customizations
            </CardTitle>
            <CardDescription>Requested portal edits and unique feature requirements.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {requests.filter(r => r.request_type === "Portal Customization").slice(0, 3).map(r => (
                <div key={r.id} className="p-3 bg-stone-50 rounded-lg border border-stone-100">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-sm">{r.full_name}</span>
                    <Badge variant="outline" className="text-[10px] uppercase">Custom Edit</Badge>
                  </div>
                  <p className="text-xs text-stone-600 line-clamp-2 italic">"{r.customization_details}"</p>
                </div>
              ))}
              {requests.filter(r => r.request_type === "Portal Customization").length === 0 && (
                <div className="text-center py-6 text-stone-400 text-sm italic">No custom portal requests yet.</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-stone-100">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              Module Interest Analysis
            </CardTitle>
            <CardDescription>Which modules are high-end clients looking for?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Simple count logic could go here */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-stone-600 font-medium">Finances & Payment</span>
                <span className="px-2 py-0.5 bg-stone-100 rounded text-xs">High Demand</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-stone-600 font-medium">Live Orchestration</span>
                <span className="px-2 py-0.5 bg-stone-100 rounded text-xs">Trending</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-stone-600 font-medium">CRM & Leads</span>
                <span className="px-2 py-0.5 bg-stone-100 rounded text-xs">Moderate</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}