import React, { useState, useEffect } from "react";
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Camera, 
  Briefcase, 
  ChevronRight, 
  TreePine,
  ExternalLink,
  Github,
  Twitter,
  Linkedin,
  Globe,
  MoreHorizontal,
  MessageSquare,
  Video
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { profileService, EnrichedProfile } from "@/services/profileService";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { HierarchyStatusView } from "./HierarchyStatusView";

export function ProfileView() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<EnrichedProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [orgData, setOrgData] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      loadProfile();
      loadOrgData();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    const { data, error } = await profileService.getEnrichedProfile(user.id);
    if (!error) setProfile(data);
    setLoading(false);
  };

  const loadOrgData = async () => {
    const { data } = await profileService.getOrgChart();
    if (data) setOrgData(data);
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !profile) return;
    setUpdating(true);
    
    const formData = new FormData(e.currentTarget);
    const updates = {
      full_name: formData.get("full_name") as string,
      phone: formData.get("phone") as string,
      bio: formData.get("bio") as string,
      avatar_url: formData.get("avatar_url") as string,
      cover_url: formData.get("cover_url") as string,
    };

    const result = await profileService.updateProfile(user.id, updates);
    
    if (result) {
      toast({
        title: "Profile Updated",
        description: "Your changes have been saved successfully.",
      });
      loadProfile();
    } else {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
    setUpdating(false);
  };

  if (loading) {
    return (
      <div className="p-8 space-y-8 animate-in fade-in duration-500">
        <Skeleton className="h-48 w-full rounded-xl" />
        <div className="flex gap-6">
          <Skeleton className="h-32 w-32 rounded-full -mt-16 ml-8 border-4 border-white" />
          <div className="mt-4 space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>
    );
  }

  const initials = profile?.full_name?.split(" ").map(n => n[0]).join("").toUpperCase() || "??";

  return (
    <div className="max-w-6xl mx-auto pb-12">
      {/* MS Teams Style Header */}
      <div className="relative h-48 w-full overflow-hidden rounded-b-xl shadow-sm">
        <img 
          src={profile?.cover_url || "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=1200"} 
          className="w-full h-full object-cover"
          alt="Cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      <div className="px-8 -mt-16 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end gap-6">
          <div className="relative">
            <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
              <AvatarImage src={profile?.avatar_url || ""} />
              <AvatarFallback className="text-2xl bg-primary text-primary-foreground">{initials}</AvatarFallback>
            </Avatar>
            <div className="absolute bottom-1 right-1 h-6 w-6 rounded-full bg-green-500 border-4 border-white shadow-sm" title="Available" />
          </div>
          <div className="flex-1 pb-2">
            <h1 className="text-3xl font-bold tracking-tight">{profile?.full_name || "User Name"}</h1>
            <div className="flex items-center gap-2 text-muted-foreground mt-1">
              <Badge variant="outline" className="font-medium">
                <Shield className="h-3 w-3 mr-1" />
                {profile?.role?.name || "Member"}
              </Badge>
              <span>•</span>
              <span className="text-sm">Orchestrix Network</span>
            </div>
          </div>
          <div className="flex gap-2 pb-2">
            <Button variant="secondary" size="sm" className="bg-white/80 hover:bg-white shadow-sm border border-slate-200">
              <MessageSquare className="h-4 w-4 mr-2" /> Message
            </Button>
            <Button variant="secondary" size="sm" className="bg-white/80 hover:bg-white shadow-sm border border-slate-200">
              <Video className="h-4 w-4 mr-2" /> Call
            </Button>
            <Button size="sm" className="shadow-sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="hierarchy">Role & Hierarchy</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="md:col-span-2 space-y-6">
              <Card className="border-none shadow-sm bg-slate-50/50">
                <CardHeader>
                  <CardTitle className="text-lg">About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {profile?.bio || "No bio information provided yet. Tell your team a bit about yourself!"}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm bg-slate-50/50">
                <CardHeader>
                  <CardTitle className="text-lg">Roles & Permissions</CardTitle>
                  <CardDescription>Your current access levels within the server</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 p-3 bg-white rounded-lg border border-slate-100">
                    <div className="bg-indigo-100 p-2 rounded-md">
                      <Briefcase className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{profile?.role?.name}</p>
                      <p className="text-xs text-muted-foreground">{profile?.role?.description}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    {["Dashboard", "Finance", "Events", "CRM"].map(mod => (
                      <div key={mod} className="flex items-center gap-2 text-xs text-slate-500">
                        <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                        {mod} Access Enabled
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border-none shadow-sm bg-slate-50/50">
                <CardHeader>
                  <CardTitle className="text-lg">Contact Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <div className="text-sm">
                      <p className="text-muted-foreground text-xs">Email</p>
                      <p className="font-medium">{profile?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <div className="text-sm">
                      <p className="text-muted-foreground text-xs">Phone</p>
                      <p className="font-medium">{profile?.phone || "Not set"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-center gap-4 py-4">
                <Github className="h-5 w-5 text-slate-400 hover:text-slate-900 cursor-pointer transition-colors" />
                <Twitter className="h-5 w-5 text-slate-400 hover:text-sky-500 cursor-pointer transition-colors" />
                <Linkedin className="h-5 w-5 text-slate-400 hover:text-blue-700 cursor-pointer transition-colors" />
                <Globe className="h-5 w-5 text-slate-400 hover:text-emerald-500 cursor-pointer transition-colors" />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your password and account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" onClick={() => window.location.href = '/forgot-password'}>
                Change Password
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hierarchy">
          <HierarchyStatusView />
        </TabsContent>
      </Tabs>
    </div>
  );
}