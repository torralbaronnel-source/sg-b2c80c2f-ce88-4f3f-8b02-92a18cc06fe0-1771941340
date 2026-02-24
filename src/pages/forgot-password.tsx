import React, { useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { Mail, ArrowLeft, ShieldCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ForgotPasswordPage: NextPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const { toast } = useToast();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return; // Silent block for bots

    setLoading(true);
    try {
      // In a real environment, Supabase handles the email sending
      // The redirect URL is configured in the Supabase dashboard
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setSubmitted(true);
      toast({
        title: "Reset link sent",
        description: "If an account exists with this email, you will receive a reset link.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to send reset link",
      });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-4">
        <Head>
          <title>Check Your Email | Orchestrix Security</title>
        </Head>
        <Card className="w-full max-w-md border-t-4 border-t-primary shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">Check your email</CardTitle>
            <CardDescription className="text-sm">
              We've sent a password reset link to <span className="font-semibold text-foreground">{email}</span>.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center text-sm text-muted-foreground space-y-4">
            <p>
              Please check your inbox and follow the instructions to reset your password. The link will expire in 1 hour for your security.
            </p>
            <div className="p-3 bg-amber-50 border border-amber-100 rounded-md text-amber-800 text-xs flex items-start gap-2 text-left">
              <ShieldCheck className="h-4 w-4 mt-0.5 shrink-0" />
              <span>If you don't see the email, check your spam folder or try again in 5 minutes.</span>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button variant="outline" className="w-full" onClick={() => setSubmitted(false)}>
              Try a different email
            </Button>
            <Link href="/login" className="text-sm text-primary hover:underline flex items-center justify-center gap-1">
              <ArrowLeft className="h-3 w-3" /> Back to Login
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-4">
      <Head>
        <title>Forgot Password | Orchestrix Security</title>
      </Head>
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-6">
            <div className="bg-primary px-3 py-1 rounded text-white font-bold tracking-tighter text-xl">
              ORCHESTRIX
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Reset your password</h1>
          <p className="text-muted-foreground">
            Enter your email and we'll send you a secure link to get back into your account.
          </p>
        </div>

        <Card className="shadow-xl border-t-4 border-t-primary">
          <form onSubmit={handleReset}>
            <CardHeader>
              <CardTitle className="text-lg">Security Verification</CardTitle>
              <CardDescription>
                We protect your data with enterprise-grade encryption.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Bot Honeypot */}
              <div className="hidden" aria-hidden="true">
                <input
                  type="text"
                  name="bot_field"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Work Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full font-semibold h-11" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending link...
                  </>
                ) : (
                  "Send reset link"
                )}
              </Button>
              <div className="text-center">
                <Link href="/login" className="text-sm text-primary hover:underline flex items-center justify-center gap-1">
                  <ArrowLeft className="h-3 w-3" /> Back to Login
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>

        <div className="text-center space-y-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-muted-foreground px-4">
            For security reasons, we do not confirm if an email exists in our system. If the email is valid, you will receive instructions shortly.
          </p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
            SECURED BY ORCHESTRIX INFRASTRUCTURE
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;