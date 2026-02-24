import React, { useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import { authService } from "@/services/authService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type UserRoleChoice = "team" | "external";

const LoginPage: NextPage = () => {
  const router = useRouter();
  const { toast } = useToast();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [userRole, setUserRole] = useState<UserRoleChoice>("team");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [externalNoteVisible, setExternalNoteVisible] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    // If user selected Client / Vendor, block this flow for now.
    if (userRole === "external") {
      setExternalNoteVisible(true);
      setError(
        "This sign-in is for Orchestrix team members only. The Client / Vendor portal will have its own dedicated login link shared by your coordinator."
      );
      return;
    }

    setExternalNoteVisible(false);
    setIsSubmitting(true);

    try {
      // Defensive: clear any existing session before new login
      const session = await authService.getCurrentSession();
      if (session) {
        await authService.signOut();
      }

      const { user, error: authError } = await authService.signIn(email, password);

      if (authError || !user) {
        setError("Invalid email or password, or email not yet verified.");
        setIsSubmitting(false);
        return;
      }

      // Enforce email verification explicitly.
      if (!user.email_confirmed_at) {
        setIsSubmitting(false);
        await authService.signOut();
        setError("Your email address has not been verified yet. Please check your inbox for a verification link.");
        return;
      }

      setIsSubmitting(false);
      if (error) throw error;
      
      toast({
        title: "Welcome back!",
        description: "Successfully signed in.",
      });

      router.push("/dashboard");
    } catch (error: any) {
      setIsSubmitting(false);
      setError("Unable to sign in at the moment. Please try again.");
    }
  };

  const handleRoleChange = (value: string) => {
    const role = value === "external" ? "external" : "team";
    setUserRole(role);
    if (role === "external") {
      setExternalNoteVisible(true);
    } else {
      setExternalNoteVisible(false);
      setError(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Card className="border border-gray-200 shadow-sm bg-white">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Sign in to Orchestrix
            </CardTitle>
            <p className="text-sm text-gray-600">
              Access the internal coordination workspace for your team.
            </p>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {externalNoteVisible && (
              <Alert className="mb-4">
                <AlertDescription className="text-sm text-gray-700">
                  <span className="font-medium">Client / Vendor access</span> will use a{" "}
                  dedicated external portal. Once it is live, your coordinator will send you
                  a separate login link. This page is only for Orchestrix team members.
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Sign in as</Label>
                <RadioGroup
                  value={userRole}
                  onValueChange={handleRoleChange}
                  className="flex gap-3"
                >
                  <div className="flex items-center space-x-2 rounded-md border border-gray-200 px-3 py-2 cursor-pointer">
                    <RadioGroupItem value="team" id="role-team" />
                    <Label
                      htmlFor="role-team"
                      className="text-sm font-medium text-gray-800 cursor-pointer"
                    >
                      Team Member
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 rounded-md border border-gray-200 px-3 py-2 cursor-pointer">
                    <RadioGroupItem value="external" id="role-external" />
                    <Label
                      htmlFor="role-external"
                      className="text-sm font-medium text-gray-800 cursor-pointer"
                    >
                      Client / Vendor
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                    <Mail className="h-4 w-4" />
                  </span>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@company.com"
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                    <Lock className="h-4 w-4" />
                  </span>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    className="pl-9 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-slate-600">
                  New team member? <Link href="/signup" className="ml-1 font-medium text-blue-600 hover:text-blue-500 hover:underline">Create an account</Link>
                </div>
                <Link href="/forgot-password" className="font-medium text-slate-600 hover:text-blue-600 hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;