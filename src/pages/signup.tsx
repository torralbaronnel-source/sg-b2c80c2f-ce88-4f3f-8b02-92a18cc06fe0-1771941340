import React, { useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import { authService } from "@/services/authService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Mail, Lock, CheckCircle2, XCircle, ShieldAlert } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const SignupPage: NextPage = () => {
  const router = useRouter();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const passwordMeetsLength = password.length >= 8;
  const passwordHasUpper = /[A-Z]/.test(password);
  const passwordHasLower = /[a-z]/.test(password);
  const passwordHasNumber = /\d/.test(password);
  const passwordHasSymbol = /[^A-Za-z0-9]/.test(password);
  const passwordValid = passwordRegex.test(password) && password === confirmPassword;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!agreedToTerms) {
      setError("You must agree to the Terms of Service and Privacy Policy.");
      return;
    }

    if (!passwordValid) {
      setError("Please ensure your password meets all requirements.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await authService.signUp(email, password);
      if (error) throw error;

      if (data.user) {
        toast({
          title: "Account created!",
          description: "Please check your email for a verification link.",
        });
        router.push("/login");
      }
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderRequirement = (met: boolean, text: string) => (
    <div className="flex items-center space-x-2 text-xs">
      {met ? <CheckCircle2 className="h-3 w-3 text-green-600" /> : <XCircle className="h-3 w-3 text-gray-400" />}
      <span className={met ? "text-green-700" : "text-gray-600"}>{text}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-white md:bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">Join Orchestrix</h1>
          <p className="text-sm text-gray-600">Enterprise Event Coordination Hub</p>
        </div>

        <Card className="border shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Create your professional account</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <ShieldAlert className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Work Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@company.com" 
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    className="pl-10 pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-2">
                  {renderRequirement(passwordMeetsLength, "8+ characters")}
                  {renderRequirement(passwordHasUpper, "Uppercase")}
                  {renderRequirement(passwordHasLower, "Lowercase")}
                  {renderRequirement(passwordHasNumber, "Number")}
                  {renderRequirement(passwordHasSymbol, "Symbol")}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required 
                />
              </div>

              <div className="flex items-start space-x-2 pt-2">
                <Checkbox 
                  id="terms" 
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                />
                <label 
                  htmlFor="terms" 
                  className="text-xs text-gray-600 leading-tight"
                >
                  I agree to the{" "}
                  <Link href="/terms" className="text-blue-600 hover:underline font-medium">Terms of Service</Link>
                  {" "}and{" "}
                  <Link href="/privacy" className="text-blue-600 hover:underline font-medium">Data Privacy Policy</Link>. 
                  I understand this platform contains sensitive coordination and financial data.
                </label>
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                {isSubmitting ? "Securing Account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600">Already a member?</span>{" "}
              <Link href="/login" className="text-blue-600 hover:underline font-medium">Sign in</Link>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-[10px] text-gray-400 uppercase tracking-widest">
          Secured by Orchestrix Infrastructure
        </p>
      </div>
    </div>
  );
};

export default SignupPage;