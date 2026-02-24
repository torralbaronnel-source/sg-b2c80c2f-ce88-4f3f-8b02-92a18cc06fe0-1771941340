import React, { useState, useEffect } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import { Shield, Mail, Lock, Eye, EyeOff, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const LoginPage: NextPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("team");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState(0);
  const [honeypot, setHoneypot] = useState(""); // Bot protection
  
  const router = useRouter();
  const { toast } = useToast();

  // Load failed attempts on mount
  useEffect(() => {
    const checkAttempts = async () => {
      if (email && email.includes("@")) {
        const count = await authService.getRecentFailedAttempts(email);
        setFailedAttempts(count);
        if (count >= 5) {
          setLockoutTime(30); // 30 seconds cooldown
        }
      }
    };
    checkAttempts();
  }, [email]);

  // Handle cooldown timer
  useEffect(() => {
    if (lockoutTime > 0) {
      const timer = setInterval(() => {
        setLockoutTime((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [lockoutTime]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Bot Protection: If honeypot is filled, silent fail (likely a bot)
    if (honeypot) {
      console.warn("Bot attempt detected via honeypot.");
      return;
    }

    // 2. Cooldown Protection
    if (lockoutTime > 0) {
      toast({
        title: "Too many attempts",
        description: `Please wait ${lockoutTime} seconds before trying again.`,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { data, error } = await authService.signIn(email, password);

      if (error) {
        const newCount = failedAttempts + 1;
        setFailedAttempts(newCount);
        
        if (newCount >= 5) {
          setLockoutTime(60); // Escalated cooldown
          toast({
            title: "Security Lockout",
            description: "Too many failed attempts. Cooldown activated.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Login failed",
            description: "Invalid email or password.",
            variant: "destructive",
          });
        }
      } else if (data.user) {
        toast({
          title: "Welcome back!",
          description: "Signed in to Orchestrix secure infrastructure.",
        });
        router.push("/dashboard");
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
      <div className="mb-8 flex items-center gap-2">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
          <Shield className="w-6 h-6" />
        </div>
        <span className="text-2xl font-bold text-slate-900 tracking-tight">Orchestrix</span>
      </div>

      <Card className="w-full max-w-md shadow-xl border-slate-200">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Sign in to Orchestrix</CardTitle>
          <CardDescription>
            Access the internal coordination workspace for your team.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Honeypot field - Hidden from users, only visible to bots */}
            <div className="sr-only" aria-hidden="true">
              <Input 
                type="text" 
                name="user_nickname" 
                value={honeypot} 
                onChange={(e) => setHoneypot(e.target.value)} 
                tabIndex={-1} 
                autoComplete="off"
              />
            </div>

            <div className="space-y-3">
              <Label>Sign in as</Label>
              <RadioGroup value={role} onValueChange={setRole} className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="team" id="team" />
                  <Label htmlFor="team" className="font-normal cursor-pointer">Team Member</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="client" id="client" />
                  <Label htmlFor="client" className="font-normal cursor-pointer">Client / Vendor</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting || lockoutTime > 0}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-primary hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pl-10 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isSubmitting || lockoutTime > 0}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {lockoutTime > 0 && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-3 text-red-700 text-sm animate-pulse">
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                <span>Security cooldown: {lockoutTime}s remaining</span>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all active:scale-[0.98]" 
              disabled={isSubmitting || lockoutTime > 0}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 border-t border-slate-100 pt-6">
          <div className="text-sm text-center text-slate-600">
            New team member?{" "}
            <Link href="/signup" className="text-indigo-600 hover:text-indigo-500 font-bold">
              Create an account
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
            <Link href="/terms" className="text-xs text-slate-400 hover:text-slate-600 underline">Terms & Conditions</Link>
            <Link href="/privacy" className="text-xs text-slate-400 hover:text-slate-600 underline">Data Privacy Policy</Link>
          </div>
        </CardFooter>
      </Card>

      <div className="mt-8 max-w-md text-center">
        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold flex items-center justify-center gap-2">
          <Shield className="w-3 h-3" /> Secured Orchestrix Infrastructure
        </p>
        <p className="text-[10px] text-slate-400 mt-2 px-6">
          Authorized use only. Unauthorized access attempts are monitored and logged to ensure compliance with Data Privacy and Anti-Money Laundering standards.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;