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
import { Eye, EyeOff, Loader2, ShieldCheck, Mail, User, Building2, CheckCircle2, Circle } from "lucide-react";
import { SEO } from "@/components/SEO";

const SignupPage: NextPage = () => {
  const router = useRouter();
  const { signUp } = useAuth();
  const { toast } = useToast();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  
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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreed) {
      toast({
        title: "Compliance Error",
        description: "You must agree to the Terms and Data Privacy Policy.",
        variant: "destructive",
      });
      return;
    }

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
      const { error } = await signUp(email, password, fullName);
      if (error) throw error;
      
      toast({
        title: "Account Created",
        description: "Please check your email to verify your identity.",
      });
      
      router.push("/login");
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafafa] dark:bg-[#09090b] p-4 font-sans">
      <SEO title="Create Account | Orchestrix" description="Register for Orchestrix professional event workspace." />
      
      <div className="w-full max-w-[480px] space-y-8">
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="w-16 h-16 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 flex items-center justify-center mb-4 transition-transform hover:scale-105">
            <Building2 className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Orchestrix
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
            Join the Professional Network
          </p>
        </div>

        <Card className="border-zinc-200 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-none bg-white dark:bg-zinc-900/50 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-8">
            <CardTitle className="text-2xl font-bold text-center">Get Started</CardTitle>
            <CardDescription className="text-center text-zinc-500 dark:text-zinc-400">
              Create your coordinator or vendor profile
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                    <Input
                      id="fullName"
                      placeholder="Juan Dela Cruz"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-10 h-11 bg-zinc-50/50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800"
                      required
                    />
                  </div>
                </div>

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
                      className="pl-10 h-11 bg-zinc-50/50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Security Password</Label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Choose a strong password"
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

              <div className="flex items-start space-x-3 p-1">
                <Checkbox
                  id="agreed"
                  checked={agreed}
                  onCheckedChange={(checked) => setAgreed(checked as boolean)}
                  className="mt-1 border-zinc-300 dark:border-zinc-700 data-[state=checked]:bg-indigo-600"
                />
                <Label
                  htmlFor="agreed"
                  className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400 font-normal cursor-pointer"
                >
                  I certify that I have read and agree to the{" "}
                  <Link href="/terms" className="text-indigo-600 hover:underline font-medium">Terms of Service</Link>
                  {" "}and{" "}
                  <Link href="/privacy" className="text-indigo-600 hover:underline font-medium">Data Privacy Policy</Link>.
                  I understand that my identity may be verified for compliance.
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg shadow-indigo-600/20"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Profile...
                  </>
                ) : (
                  "Initialize Account"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pt-4 pb-8 border-t border-zinc-100 dark:border-zinc-800">
            <p className="text-sm text-center text-zinc-500 dark:text-zinc-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>

        <div className="flex flex-col items-center space-y-4 text-center px-4">
          <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-500 text-xs font-medium uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4" />
            GOVERNMENT LEVEL SECURITY
          </div>
          <p className="text-[11px] leading-relaxed text-zinc-400 dark:text-zinc-600 max-w-sm">
            By creating an account, you acknowledge that Orchestrix operates under strict Anti-Money Laundering (AML) and Data Privacy laws. Unauthorized account usage is strictly prohibited.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;