import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { profileService, type Profile } from "@/services/profileService";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardFooter,
  CardDescription
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Shield, LogOut } from "lucide-react";

export function ProfileView() {
  const { user, profile: authProfile, signOut } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<Partial<Profile>>({
    full_name: "",
    avatar_url: ""
  });

  useEffect(() => {
    if (authProfile) {
      setProfile({
        full_name: authProfile.full_name || "",
        avatar_url: authProfile.avatar_url || ""
      });
    }
  }, [authProfile]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      const { error } = await profileService.updateProfile(user.id, profile);
      
      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your changes have been saved successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "Could not update profile.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences.</p>
        </div>
        <Button variant="destructive" onClick={signOut} className="flex items-center gap-2">
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Account Overview</CardTitle>
            <CardDescription>Your public presence.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile.avatar_url} />
              <AvatarFallback className="text-xl bg-blue-100 text-blue-700">
                {profile.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <p className="font-bold text-lg">{profile.full_name || "New User"}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <form onSubmit={handleUpdate}>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your name and profile details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="fullName" 
                    className="pl-9"
                    value={profile.full_name} 
                    onChange={(e) => setProfile({...profile, full_name: e.target.value})} 
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
              <div className="grid gap-2 opacity-70">
                <Label htmlFor="email">Email Address (Locked)</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="email" className="pl-9 bg-muted" value={user?.email || ""} readOnly />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="avatarUrl">Avatar URL</Label>
                <Input 
                  id="avatarUrl" 
                  value={profile.avatar_url} 
                  onChange={(e) => setProfile({...profile, avatar_url: e.target.value})} 
                  placeholder="https://example.com/image.png"
                />
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6">
              <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                {loading ? "Saving Changes..." : "Save Changes"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}