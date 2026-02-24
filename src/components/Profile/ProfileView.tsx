import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { profileService } from "@/services/profileService";
import { authService } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, User, Mail, Shield, Save, Key, Camera } from "lucide-react";

export function ProfileView() {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    bio: "",
    avatar_url: ""
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        bio: (profile as any).bio || "",
        avatar_url: profile.avatar_url || ""
      });
    }
  }, [profile]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    try {
      const success = await profileService.updateProfile(user.id, {
        full_name: formData.full_name,
        bio: formData.bio,
        avatar_url: formData.avatar_url
      });

      if (success) {
        await refreshProfile();
        toast({
          title: "Profile Updated",
          description: "Your profile information has been saved successfully.",
        });
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem updating your profile.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    setIsChangingPassword(true);
    try {
      const { error } = await authService.updatePassword(passwordData.newPassword);
      if (error) throw error;

      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to change password.",
        variant: "destructive",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Side: Avatar and Quick Info */}
        <div className="md:w-1/3 flex flex-col items-center gap-6">
          <Card className="w-full">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="relative group">
                <Avatar className="h-32 w-32 border-4 border-brand-primary/10">
                  <AvatarImage src={formData.avatar_url} />
                  <AvatarFallback className="text-3xl bg-brand-primary/5 text-brand-primary">
                    {formData.full_name?.charAt(0).toUpperCase() || <User />}
                  </AvatarFallback>
                </Avatar>
                <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 rounded-full shadow-lg">
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              
              <h2 className="mt-4 text-xl font-bold">{profile.full_name}</h2>
              <p className="text-sm text-muted-foreground mb-4">{user?.email}</p>
              
              <Badge variant="secondary" className="px-3 py-1 capitalize">
                <Shield className="h-3 w-3 mr-1" />
                {profile.role || "User"}
              </Badge>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Account Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Member Since</span>
                <span className="font-medium">
                  {new Date(profile.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Status</span>
                <Badge className="bg-green-500 hover:bg-green-600 border-none">Active</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Detailed Tabs */}
        <div className="md:w-2/3">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="general">General Info</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <form onSubmit={handleProfileUpdate}>
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your public profile details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input 
                        id="fullName" 
                        value={formData.full_name} 
                        onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="email" 
                          value={user?.email || ""} 
                          disabled 
                          className="pl-10 bg-muted cursor-not-allowed"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">Email cannot be changed manually.</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio / Note</Label>
                      <Textarea 
                        id="bio" 
                        value={formData.bio} 
                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                        placeholder="Tell us about yourself..."
                        className="min-h-[100px]"
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </form>
            </TabsContent>

            <TabsContent value="security">
              <form onSubmit={handlePasswordChange}>
                <Card>
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>Ensure your account is using a long, random password to stay secure.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input 
                        id="newPassword" 
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input 
                        id="confirmPassword" 
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button type="submit" disabled={isChangingPassword}>
                      {isChangingPassword ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Key className="mr-2 h-4 w-4" />
                          Update Password
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}