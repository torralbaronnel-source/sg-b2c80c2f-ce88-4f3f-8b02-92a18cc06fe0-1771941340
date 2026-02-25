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

      <Tabs defaultValue="contact" className="mt-8 px-8">
        <TabsList className="bg-transparent border-b rounded-none w-full justify-start h-auto p-0 gap-8">
          <TabsTrigger value="contact" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 pb-4 pt-0 font-semibold shadow-none">
            Contact & Info
          </TabsTrigger>
          <TabsTrigger value="organization" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 pb-4 pt-0 font-semibold shadow-none">
            Organization
          </TabsTrigger>
          <TabsTrigger value="settings" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 pb-4 pt-0 font-semibold shadow-none">
            Edit Profile
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contact" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        <TabsContent value="organization" className="mt-6">
          <Card className="border-none shadow-sm bg-slate-50/50">
            <CardHeader>
              <CardTitle>Organizational Chart</CardTitle>
              <CardDescription>Visual hierarchy of your team and reporting lines</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center py-10 space-y-12">
                {/* Manager Level */}
                {profile?.manager && (
                  <div className="flex flex-col items-center">
                    <div className="bg-white p-4 rounded-xl border-2 border-slate-100 shadow-sm w-64 text-center">
                      <Avatar className="h-12 w-12 mx-auto mb-2 border-2 border-indigo-100">
                        <AvatarImage src={profile.manager.avatar_url || ""} />
                        <AvatarFallback>{profile.manager.full_name?.[0]}</AvatarFallback>
                      </Avatar>
                      <p className="font-bold text-sm">{profile.manager.full_name}</p>
                      <p className="text-xs text-indigo-600 font-medium">Direct Manager</p>
                    </div>
                    <div className="h-12 w-0.5 bg-slate-200 mt-2" />
                  </div>
                )}

                {/* Current User */}
                <div className="flex flex-col items-center">
                  <div className="bg-indigo-50 p-4 rounded-xl border-2 border-indigo-200 shadow-md w-72 text-center relative">
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600">YOU</Badge>
                    <Avatar className="h-16 w-16 mx-auto mb-3 border-4 border-white">
                      <AvatarImage src={profile?.avatar_url || ""} />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <p className="font-bold text-lg">{profile?.full_name}</p>
                    <p className="text-sm text-slate-600 font-medium">{profile?.role?.name}</p>
                  </div>
                </div>

                {/* Direct Reports (Mock/Placeholder for logic) */}
                <div className="flex gap-8">
                  {orgData.filter(p => p.reports_to === profile?.id).length > 0 ? (
                    orgData.filter(p => p.reports_to === profile?.id).map((report, idx) => (
                      <div key={idx} className="flex flex-col items-center">
                        <div className="h-12 w-0.5 bg-slate-200 mb-2" />
                        <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm w-48 text-center">
                          <Avatar className="h-10 w-10 mx-auto mb-2">
                            <AvatarImage src={report.avatar_url || ""} />
                            <AvatarFallback>{report.full_name?.[0]}</AvatarFallback>
                          </Avatar>
                          <p className="font-semibold text-xs">{report.full_name}</p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-tight">{report.role?.name}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center p-8 bg-white/50 rounded-xl border border-dashed border-slate-300">
                      <p className="text-sm text-slate-400 italic">No direct reports found</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card className="border-none shadow-sm bg-slate-50/50">
            <CardHeader>
              <CardTitle>Edit Your Profile</CardTitle>
              <CardDescription>Keep your contact details and visuals up to date</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdate} className="space-y-6 max-w-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input id="full_name" name="full_name" defaultValue={profile?.full_name || ""} placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" name="phone" defaultValue={profile?.phone || ""} placeholder="+1 (555) 000-0000" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">About Me</Label>
                  <Textarea id="bio" name="bio" defaultValue={profile?.bio || ""} placeholder="Tell your team about your background..." className="min-h-[120px]" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="avatar_url">Profile Picture URL</Label>
                    <div className="flex gap-2">
                      <Input id="avatar_url" name="avatar_url" defaultValue={profile?.avatar_url || ""} placeholder="https://..." />
                      <Button type="button" size="icon" variant="outline">
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cover_url">Cover Image URL</Label>
                    <Input id="cover_url" name="cover_url" defaultValue={profile?.cover_url || ""} placeholder="https://..." />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={updating}>
                    {updating ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}