import React, { useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, ArrowLeft, ShieldCheck, Building2 } from "lucide-react";
import { authService } from "@/services/authService";
import { SEO } from "@/components/SEO";

const ForgotPasswordPage: NextPage = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return;

    setIsLoading(true);
    try {
      const { error } = await authService.resetPasswordRequest(email);
      if (error) throw error;
      
      setIsSubmitted(true);
      toast({
        title: "Recovery Link Sent",
        description: "If an account exists, you will receive an email shortly.",
      });
    } catch (error: any) {
      toast({
        title: "Request Failed",
        description: error.message || "An error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafafa] dark:bg-[#09090b] p-4 font-sans">
      <SEO title="Reset Security Access | Orchestrix" description="Secure password recovery for Orchestrix platform." />
      
      <div className="w-full max-w-[440px] space-y-8">
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="w-16 h-16 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 flex items-center justify-center mb-4 transition-transform hover:scale-105">
            <Building2 className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Orchestrix
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
            Security Access Recovery
          </p>
        </div>

        <Card className="border-zinc-200 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-none bg-white dark:bg-zinc-900/50 backdrop-blur-sm">
          {!isSubmitted ? (
            <>
              <CardHeader className="space-y-1 pb-8">
                <CardTitle className="text-2xl font-bold text-center">Forgot Password?</CardTitle>
                <CardDescription className="text-center text-zinc-500 dark:text-zinc-400 px-4">
                  Enter your verified work email and we'll send you a secure recovery link.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <input
                    type="text"
                    className="hidden"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    tabIndex={-1}
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
                        className="pl-10 h-11 bg-zinc-50/50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800"
                        required
                      />
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
                        Generating Link...
                      </>
                    ) : (
                      "Send Recovery Link"
                    )}
                  </Button>
                </form>
              </CardContent>
            </>
          ) : (
            <CardContent className="py-12 flex flex-col items-center text-center space-y-6">
              <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Check your email</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs">
                  We've sent a recovery link to <span className="font-semibold text-zinc-900 dark:text-zinc-100">{email}</span>. Please check your inbox and spam folder.
                </p>
              </div>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setIsSubmitted(false)}
              >
                Try a different email
              </Button>
            </CardContent>
          )}
          <CardFooter className="flex flex-col space-y-4 pt-4 pb-8 border-t border-zinc-100 dark:border-zinc-800">
            <Link
              href="/login"
              className="flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to login
            </Link>
          </CardFooter>
        </Card>

        <div className="flex flex-col items-center space-y-4 text-center px-4">
          <div className="flex items-center gap-2 text-zinc-400 dark:text-zinc-500 text-xs font-medium uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4" />
            ENCRYPTED RECOVERY
          </div>
          <p className="text-[11px] leading-relaxed text-zinc-400 dark:text-zinc-600 max-w-sm">
            Recovery links expire after 15 minutes for your protection. If you didn't request this, please contact your organization's security administrator immediately.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;