import React, { useState, useEffect } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Loader2, ShieldCheck, Lock, Building2, CheckCircle2, Circle } from "lucide-react";
import { authService } from "@/services/authService";
import { SEO } from "@/components/SEO";

const ResetPasswordPage: NextPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Password Strength
  const [strength, setStrength] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false
  });

  useEffect(() => {
    setStrength({
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    });
  }, [password]);

  const isPasswordStrong = Object.values(strength).every(Boolean);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isPasswordStrong) {
      toast({
        title: "Security Requirement",
        description: "Please fulfill all password security requirements.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await authService.updatePassword(password);
      if (error) throw error;
      
      toast({
        title: "Password Secured",
        description: "Your new credentials have been activated.",
      });
      
      router.push("/login");
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "The recovery link may have expired.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafafa] dark:bg-[#09090b] p-4 font-sans">
      <SEO title="Set New Password | Orchestrix" description="Secure your Orchestrix account with a new password." />
      
      <div className="w-full max-w-[480px] space-y-8">
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="w-16 h-16 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 flex items-center justify-center mb-4 transition-transform hover:scale-105">
            <Building2 className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Orchestrix
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
            Authorized Access Reset
          </p>
        </div>

        <Card className="border-zinc-200 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-none bg-white dark:bg-zinc-900/50 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-8">
            <CardTitle className="text-2xl font-bold text-center">New Password</CardTitle>
            <CardDescription className="text-center text-zinc-500 dark:text-zinc-400">
              Create a secure password to restore access to your workspace.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleReset} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="password">New Security Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-11 bg-zinc-50/50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Password Strength Meter */}
              <div className="bg-zinc-50 dark:bg-zinc-950/50 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 space-y-3">
                <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Security Requirements</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: "length", label: "8+ characters" },
                    { key: "upper", label: "Uppercase" },
                    { key: "lower", label: "Lowercase" },
                    { key: "number", label: "Number" },
                    { key: "special", label: "Symbol" }
                  ].map((req) => (
                    <div key={req.key} className="flex items-center gap-2">
                      {strength[req.key as keyof typeof strength] ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Circle className="w-3.5 h-3.5 text-zinc-300 dark:text-zinc-700" />
                      )}
                      <span className={`text-[11px] ${strength[req.key as keyof typeof strength] ? "text-zinc-900 dark:text-zinc-200 font-medium" : "text-zinc-400"}`}>
                        {req.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg shadow-indigo-600/20"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating Security...
                  </>
                ) : (
                  "Reset Password & Sign In"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pt-4 pb-8 border-t border-zinc-100 dark:border-zinc-800">
            <p className="text-xs text-center text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto">
              Setting a new password will invalidate all previous sessions for security compliance.
            </p>
          </CardFooter>
        </Card>

        <div className="flex flex-col items-center space-y-4 text-center px-4">
          <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-500 text-xs font-medium uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4" />
            SECURE INFRASTRUCTURE
          </div>
          <p className="text-[11px] leading-relaxed text-zinc-400 dark:text-zinc-600 max-w-sm">
            All password updates are cryptographically hashed and logged for audit purposes under Data Privacy regulations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;