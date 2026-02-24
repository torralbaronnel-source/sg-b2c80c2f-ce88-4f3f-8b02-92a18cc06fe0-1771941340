import React, { useState, useEffect } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { Lock, ShieldCheck, Loader2, CheckCircle2, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ResetPasswordPage: NextPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Check if we have a valid session (Supabase handles password reset by starting a special session)
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setErrorMsg("Your reset link has expired or is invalid. Please request a new one.");
      }
    };
    
    checkSession();
  }, []);

  const passwordSecurity = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const isStrong = Object.values(passwordSecurity).every(Boolean);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Passwords do not match.",
      });
      return;
    }

    if (!isStrong) {
      toast({
        variant: "destructive",
        title: "Security Weakness",
        description: "Password does not meet our high-security standards.",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      setSuccess(true);
      toast({
        title: "Password updated",
        description: "Your security credentials have been successfully refreshed.",
      });

      // Redirect to login after a short delay
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message || "Could not update password. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (errorMsg) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-4">
        <Head>
          <title>Invalid Link | Orchestrix Security</title>
        </Head>
        <Card className="w-full max-w-md border-t-4 border-t-destructive shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-sm text-muted-foreground">
            <p className="mb-6">{errorMsg}</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => router.push("/forgot-password")}>
              Request new link
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-4">
        <Head>
          <title>Success | Orchestrix Security</title>
        </Head>
        <Card className="w-full max-w-md border-t-4 border-t-green-500 shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">Security Updated</CardTitle>
            <CardDescription>
              Your password has been successfully reset.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center text-sm text-muted-foreground">
            <p>
              Redirecting you to the secure login gateway...
            </p>
            <div className="mt-4 flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => router.push("/login")}>
              Go to Login now
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-4">
      <Head>
        <title>New Password | Orchestrix Security</title>
      </Head>
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-6">
            <div className="bg-primary px-3 py-1 rounded text-white font-bold tracking-tighter text-xl">
              ORCHESTRIX
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Choose new password</h1>
          <p className="text-muted-foreground">
            Update your credentials to maintain platform security.
          </p>
        </div>

        <Card className="shadow-xl border-t-4 border-t-primary">
          <form onSubmit={handleReset}>
            <CardHeader>
              <CardTitle className="text-lg">Security Upgrade</CardTitle>
              <CardDescription>
                Passwords must meet AML and DPA complexity requirements.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    className="pl-10"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 p-3 bg-gray-50 rounded-lg border text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className={`h-3 w-3 ${passwordSecurity.length ? "text-green-500" : "text-gray-300"}`} />
                  <span className={passwordSecurity.length ? "text-green-700" : "text-gray-500"}>8+ Characters</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className={`h-3 w-3 ${passwordSecurity.uppercase ? "text-green-500" : "text-gray-300"}`} />
                  <span className={passwordSecurity.uppercase ? "text-green-700" : "text-gray-500"}>Uppercase</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className={`h-3 w-3 ${passwordSecurity.number ? "text-green-500" : "text-gray-300"}`} />
                  <span className={passwordSecurity.number ? "text-green-700" : "text-gray-500"}>Number</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className={`h-3 w-3 ${passwordSecurity.special ? "text-green-500" : "text-gray-300"}`} />
                  <span className={passwordSecurity.special ? "text-green-700" : "text-gray-500"}>Special Char</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full font-semibold h-11" disabled={loading || !isStrong}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating security...
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <div className="p-4 bg-primary/5 rounded-lg border border-primary/10 flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-primary mt-0.5 shrink-0" />
          <div className="space-y-1">
            <p className="text-sm font-semibold">Automatic Session Termination</p>
            <p className="text-xs text-muted-foreground">
              Updating your password will immediately terminate all other active sessions for this account to prevent unauthorized access.
            </p>
          </div>
        </div>

        <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest font-semibold pt-4">
          ORCHESTRIX SECURITY INFRASTRUCTURE
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;