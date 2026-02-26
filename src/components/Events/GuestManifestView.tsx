import React, { useState, useEffect } from "react";
import { useEvent } from "@/contexts/EventContext";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  Search, 
  Plus, 
  MoreHorizontal, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Filter, 
  Download, 
  Mail,
  Smartphone,
  MapPin,
  Calendar,
  Ticket
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock data for guests
const mockGuests = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 234 567 8901",
    type: "VIP",
    status: "Checked In",
    table: "12",
    checkedInAt: "2024-05-20T18:30:00Z",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+1 234 567 8902",
    type: "Standard",
    status: "Confirmed",
    table: "8",
    checkedInAt: null,
  },
  {
    id: "3",
    name: "Robert Johnson",
    email: "robert@example.com",
    phone: "+1 234 567 8903",
    type: "Speaker",
    status: "Pending",
    table: "1",
    checkedInAt: null,
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily@example.com",
    phone: "+1 234 567 8904",
    type: "VIP",
    status: "Checked In",
    table: "12",
    checkedInAt: "2024-05-20T18:45:00Z",
  },
  {
    id: "5",
    name: "Michael Wilson",
    email: "michael@example.com",
    phone: "+1 234 567 8905",
    type: "Staff",
    status: "Checked In",
    table: "Staff Table",
    checkedInAt: "2024-05-20T17:00:00Z",
  }
];

export function GuestManifestView() {
  const context = useEvent();
  // Falling back to a safe check since the linter is reporting a mismatch
  const selectedEvent = (context as any).state?.selectedEvent || (context as any).selectedEvent;
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [guests, setGuests] = useState(mockGuests);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newGuest, setNewGuest] = useState({
    name: "",
    email: "",
    type: "Standard",
    table: ""
  });

  const filteredGuests = guests.filter(guest => {
    const matchesSearch = guest.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          guest.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "checked-in") return matchesSearch && guest.status === "Checked In";
    if (activeTab === "pending") return matchesSearch && (guest.status === "Pending" || guest.status === "Confirmed");
    if (activeTab === "vip") return matchesSearch && guest.type === "VIP";
    
    return matchesSearch;
  });

  const stats = {
    total: guests.length,
    checkedIn: guests.filter(g => g.status === "Checked In").length,
    pending: guests.filter(g => g.status !== "Checked In").length,
    percentage: Math.round((guests.filter(g => g.status === "Checked In").length / guests.length) * 100)
  };

  const handleCheckIn = (guestId: string) => {
    setGuests(prev => prev.map(g => 
      g.id === guestId ? { ...g, status: "Checked In", checkedInAt: new Date().toISOString() } : g
    ));
    toast({
      title: "Guest Checked In",
      description: "Neural handshake confirmed.",
    });
  };

  const handleAddGuest = () => {
    if (!newGuest.name || !newGuest.email) return;
    
    const guest = {
      id: Math.random().toString(36).substr(2, 9),
      name: newGuest.name,
      email: newGuest.email,
      phone: "",
      type: newGuest.type,
      status: "Confirmed",
      table: newGuest.table,
      checkedInAt: null,
    };
    
    setGuests([guest, ...guests]);
    setIsAddDialogOpen(false);
    setNewGuest({ name: "", email: "", type: "Standard", table: "" });
    
    toast({
      title: "Guest Added",
      description: `${guest.name} has been added to the manifest.`,
    });
  };

  return (
    <div className="flex flex-col space-y-6 p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Guest Manifest</h1>
          <p className="text-muted-foreground">Manage attendees and check-in status for {selectedEvent?.title || "your event"}.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                Add Guest
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] border-border/40">
              <DialogHeader>
                <DialogTitle>Add New Guest</DialogTitle>
                <DialogDescription>
                  Enter the guest's details to add them to the mission manifest.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    value={newGuest.name} 
                    onChange={(e) => setNewGuest({...newGuest, name: e.target.value})}
                    placeholder="John Doe" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={newGuest.email} 
                    onChange={(e) => setNewGuest({...newGuest, email: e.target.value})}
                    placeholder="john@example.com" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">Guest Type</Label>
                  <Select 
                    value={newGuest.type} 
                    onValueChange={(value) => setNewGuest({...newGuest, type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Standard">Standard</SelectItem>
                      <SelectItem value="VIP">VIP</SelectItem>
                      <SelectItem value="Speaker">Speaker</SelectItem>
                      <SelectItem value="Staff">Staff</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="table">Table / Section</Label>
                  <Input 
                    id="table" 
                    value={newGuest.table} 
                    onChange={(e) => setNewGuest({...newGuest, table: e.target.value})}
                    placeholder="Table 12" 
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddGuest}>Deploy Guest Node</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Guests</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Neural nodes in manifest</p>
          </CardContent>
        </Card>
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Checked In</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.checkedIn}</div>
            <div className="mt-2 h-2 w-full bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500" 
                style={{ width: `${stats.percentage}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{stats.percentage}% arrival rate</p>
          </CardContent>
        </Card>
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">VIPs</CardTitle>
            <Ticket className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{guests.filter(g => g.type === "VIP").length}</div>
            <p className="text-xs text-muted-foreground">High-clearance attendees</p>
          </CardContent>
        </Card>
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Expecting arrival</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
              <TabsList className="bg-background/50 border border-border/40">
                <TabsTrigger value="all">All Guests</TabsTrigger>
                <TabsTrigger value="checked-in">Checked In</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="vip">VIP Only</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search manifest..."
                className="pl-8 bg-background/50 border-border/40"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border/40 overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[250px]">Guest</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Table / Section</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGuests.length > 0 ? (
                  filteredGuests.map((guest) => (
                    <TableRow key={guest.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 border border-border/40">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${guest.name}`} />
                            <AvatarFallback>{guest.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium">{guest.name}</span>
                            <span className="text-xs text-muted-foreground">{guest.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={
                            guest.type === 'VIP' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                            guest.type === 'Speaker' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' :
                            'bg-blue-500/10 text-blue-500 border-blue-500/20'
                          }
                        >
                          {guest.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {guest.status === "Checked In" ? (
                            <Badge className="bg-emerald-500 hover:bg-emerald-600">
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                              Checked In
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <Clock className="mr-1 h-3 w-3" />
                              {guest.status}
                            </Badge>
                          )}
                          {guest.checkedInAt && (
                            <span className="text-[10px] text-muted-foreground">
                              {new Date(guest.checkedInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span>{guest.table || "Unassigned"}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {guest.status !== "Checked In" && (
                            <Button size="sm" onClick={() => handleCheckIn(guest.id)} className="h-8 bg-primary hover:bg-primary/90">
                              Check In
                            </Button>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 border-border/40">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Smartphone className="mr-2 h-4 w-4" />
                                Send SMS Alert
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Mail className="mr-2 h-4 w-4" />
                                Resend Ticket
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive focus:text-destructive">
                                <XCircle className="mr-2 h-4 w-4" />
                                Remove Guest
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                      No guests found in this neural sector.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}