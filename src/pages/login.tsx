import React, { useState, useEffect } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Loader2, ShieldCheck, Lock, Mail, User, Building2 } from "lucide-react";
import { authService } from "@/services/authService";
import { SEO } from "@/components/SEO";

const LoginPage: NextPage = () => {
  const router = useRouter();
  const { signIn } = useAuth();
  const { toast } = useToast();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState<"team" | "client">("team");
  
  // Security: Honeypot
  const [honeypot, setHoneypot] = useState("");
  
  // Security: Brute Force Prevention
  const [attempts, setAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState(0);

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
    
    // Bot blocking: Honeypot check
    if (honeypot) {
      console.warn("Bot detected via honeypot.");
      return;
    }

    if (lockoutTime > 0) {
      toast({
        title: "Security Lockout",
        description: `Too many attempts. Please wait ${lockoutTime} seconds.`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Track attempt
      await authService.trackLoginAttempt(email, false, "login_page");
      
      const { error } = await signIn(email, password);
      
      if (error) {
        setAttempts((prev) => prev + 1);
        if (attempts >= 4) {
          setLockoutTime(30 * (attempts - 3));
        }
        throw error;
      }

      // Successful login
      await authService.trackLoginAttempt(email, true, "login_page");
      
      toast({
        title: "Welcome back",
        description: "Secure session established.",
      });
      
      router.push("/dashboard");
    } catch (error: any) {
      toast({
        title: "Access Denied",
        description: error.message || "Invalid credentials.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafafa] dark:bg-[#09090b] p-4 font-sans">
      <SEO title="Secure Login | Orchestrix" description="Authorized access to Orchestrix event infrastructure." />
      
      <div className="w-full max-w-[440px] space-y-8">
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="w-16 h-16 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 flex items-center justify-center mb-4 transition-transform hover:scale-105">
            <Building2 className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Orchestrix
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
            Authorized Event Infrastructure
          </p>
        </div>

        <Card className="border-zinc-200 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-none bg-white dark:bg-zinc-900/50 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-8">
            <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
            <CardDescription className="text-center text-zinc-500 dark:text-zinc-400">
              Enter your credentials to access your workspace
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
              <button
                onClick={() => setUserType("team")}
                className={`flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${
                  userType === "team"
                    ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                }`}
              >
                <User className="w-4 h-4" />
                Team Member
              </button>
              <button
                onClick={() => setUserType("client")}
                className={`flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${
                  userType === "client"
                    ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                }`}
              >
                <Building2 className="w-4 h-4" />
                Client / Vendor
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Honeypot field - hidden from users */}
              <input
                type="text"
                className="hidden"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
              
              <div className="space-y-2">
                <Label htmlFor="email">Work Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11 bg-zinc-50/50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-11 bg-zinc-50/50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 focus:ring-indigo-500"
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

              <Button
                type="submit"
                className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg shadow-indigo-600/20"
                disabled={isLoading || lockoutTime > 0}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  "Sign In to Workspace"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pt-4 pb-8 border-t border-zinc-100 dark:border-zinc-800">
            <p className="text-sm text-center text-zinc-500 dark:text-zinc-400">
              New team member?{" "}
              <Link
                href="/signup"
                className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
              >
                Create an account
              </Link>
            </p>
          </CardFooter>
        </Card>

        <div className="flex flex-col items-center space-y-4 text-center px-4">
          <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-500 text-xs font-medium uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4" />
            SECURED END-TO-END
          </div>
          <p className="text-[11px] leading-relaxed text-zinc-400 dark:text-zinc-600 max-w-sm">
            Orchestrix uses AES-256 encryption for data at rest. Access is governed by strict Data Privacy and Anti-Money Laundering protocols. All sessions are monitored for security and compliance purposes.
          </p>
          <div className="flex gap-4 text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
            <Link href="/terms" className="hover:text-indigo-600 transition-colors">Terms of Service</Link>
            <span className="text-zinc-300 dark:text-zinc-800">•</span>
            <Link href="/privacy" className="hover:text-indigo-600 transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;