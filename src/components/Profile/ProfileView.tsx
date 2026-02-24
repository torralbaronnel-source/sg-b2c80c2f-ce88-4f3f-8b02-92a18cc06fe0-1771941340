import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { profileService, type Profile } from "@/services/profileService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Camera, User, Mail, ShieldCheck, Building2, Upload, Palette } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Image from "next/image";

export function ProfileView() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState("");
  const { activeOrg, setActiveOrg } = useAuth();
  const [isEditingOrg, setIsEditingOrg] = useState(false);
  const [orgName, setOrgName] = useState(activeOrg?.name || "");
  const [orgLogo, setOrgLogo] = useState(activeOrg?.logo_url || "");
  const [loadingOrg, setLoadingOrg] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  async function fetchProfile() {
    try {
      setLoading(true);
      const data = await profileService.getProfile(user!.id);
      if (data) {
        setProfile(data);
        setFullName(data.full_name || "");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    try {
      setUpdating(true);
      await profileService.updateProfile(user.id, {
        full_name: fullName,
      });
      toast({
        title: "Profile updated",
        description: "Your personal information has been saved successfully.",
      });
      fetchProfile();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.message || "An error occurred while saving.",
      });
    } finally {
      setUpdating(false);
    }
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      setUpdating(true);
      // Ensure bucket exists or handle error (usually avatars bucket is public)
      const avatarUrl = await profileService.uploadAvatar(user.id, file);
      await profileService.updateProfile(user.id, { avatar_url: avatarUrl });
      
      toast({
        title: "Avatar updated",
        description: "Your profile picture has been changed.",
      });
      fetchProfile();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "Make sure you have an 'avatars' bucket created in Supabase Storage.",
      });
    } finally {
      setUpdating(false);
    }
  }

  const handleUpdateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrg) return;
    
    setLoadingOrg(true);
    try {
      const { data, error } = await supabase
        .from('organizations')
        .update({ 
          name: orgName, 
          logo_url: orgLogo 
        })
        .eq('id', activeOrg.id)
        .select()
        .single();

      if (error) throw error;
      setActiveOrg(data);
      setIsEditingOrg(false);
      toast({
        title: "Branding updated",
        description: "Company details have been saved.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.message,
      });
    } finally {
      setLoadingOrg(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground">Manage your personal information and preferences.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Left Col - Avatar */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
            <CardDescription>Your public avatar</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <div className="relative group">
              <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                <AvatarImage src={profile?.avatar_url || ""} />
                <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                  {profile?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <label 
                htmlFor="avatar-upload" 
                className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <Camera className="h-8 w-8 text-white" />
                <input 
                  id="avatar-upload" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleAvatarUpload}
                  disabled={updating}
                />
              </label>
            </div>
            <p className="text-xs text-center text-muted-foreground">
              Click to upload a new photo. JPG, GIF or PNG. Max size 2MB.
            </p>
          </CardContent>
        </Card>

        {/* Right Col - Details */}
        <Card className="md:col-span-2">
          <form onSubmit={handleUpdateProfile}>
            <CardHeader>
              <CardTitle>Personal Details</CardTitle>
              <CardDescription>Update your name and email address.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="email" 
                    value={user?.email || ""} 
                    disabled 
                    className="pl-10 bg-muted/50" 
                  />
                </div>
                <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" /> Managed by your organization
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="fullName" 
                    placeholder="Enter your full name" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6">
              <Button type="submit" disabled={updating}>
                {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Organization Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                <CardTitle>Organization Settings</CardTitle>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsEditingOrg(!isEditingOrg)}
              >
                {isEditingOrg ? "Cancel" : "Edit"}
              </Button>
            </div>
            <CardDescription>Manage your company branding and details.</CardDescription>
          </CardHeader>
          <CardContent>
            {isEditingOrg ? (
              <form onSubmit={handleUpdateOrg} className="space-y-4">
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input 
                    value={orgName} 
                    onChange={(e) => setOrgName(e.target.value)} 
                    placeholder="Enter company name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Logo URL</Label>
                  <Input 
                    value={orgLogo} 
                    onChange={(e) => setOrgLogo(e.target.value)} 
                    placeholder="https://..."
                  />
                  <p className="text-[10px] text-muted-foreground">Tip: Use a URL for a transparent PNG logo.</p>
                </div>
                <Button type="submit" className="w-full" disabled={loadingOrg}>
                  {loadingOrg ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 border border-border/50">
                  <div className="h-16 w-16 rounded-lg bg-background border flex items-center justify-center overflow-hidden">
                    {activeOrg?.logo_url ? (
                      <Image src={activeOrg.logo_url} alt="Logo" width={64} height={64} className="object-contain mix-blend-multiply" />
                    ) : (
                      <Building2 className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{activeOrg?.name}</h3>
                    <p className="text-sm text-muted-foreground capitalize">{activeOrg?.subscription_plan} Plan</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-md bg-muted/20 border">
                    <p className="text-xs text-muted-foreground">Member Since</p>
                    <p className="text-sm font-medium">
                      {activeOrg?.created_at ? new Date(activeOrg.created_at).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div className="p-3 rounded-md bg-muted/20 border">
                    <p className="text-xs text-muted-foreground">Organization ID</p>
                    <p className="text-sm font-mono truncate">{activeOrg?.id.substring(0, 8)}...</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}