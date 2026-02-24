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
import { Eye, EyeOff, Mail, Lock, CheckCircle2, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Minimum 8 characters, at least one uppercase, one lowercase, one number, one symbol.
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const SignupPage: NextPage = () => {
  const router = useRouter();
  const { toast } = useToast();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const passwordMeetsLength = password.length >= 8;
  const passwordHasUpper = /[A-Z]/.test(password);
  const passwordHasLower = /[a-z]/.test(password);
  const passwordHasNumber = /\d/.test(password);
  const passwordHasSymbol = /[^A-Za-z0-9]/.test(password);
  const passwordValid =
    passwordRegex.test(password) && password === confirmPassword;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    if (!passwordValid) {
      setError(
        "Please ensure your password meets all requirements and matches the confirmation."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const { user, error: authError } = await authService.signUp(email, password);

      if (authError || !user) {
        setIsSubmitting(false);
        setError("Could not create account. Please check your details or try again.");
        return;
      }

      setIsSubmitting(false);
      setSuccessMessage(
        "Account created. Please check your email and verify your address before logging in."
      );
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        router.push("/dashboard");
      }, 3000);
    } catch {
      setIsSubmitting(false);
      setError("Unable to create account at the moment. Please try again.");
    }
  };

  const renderRequirement = (met: boolean, text: string) => {
    return (
      <div className="flex items-center space-x-2 text-xs">
        {met ? (
          <CheckCircle2 className="h-3 w-3 text-green-600" />
        ) : (
          <XCircle className="h-3 w-3 text-gray-400" />
        )}
        <span className={met ? "text-green-700" : "text-gray-600"}>{text}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Card className="border border-gray-200 shadow-sm bg-white">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Create a team account
            </CardTitle>
            <p className="text-sm text-gray-600">
              For Orchestrix coordinators and internal team members only.
            </p>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {successMessage && (
              <Alert className="mb-4">
                <AlertDescription className="text-sm text-gray-800">
                  {successMessage}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Work email
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
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                    <Lock className="h-4 w-4" />
                  </span>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Create a strong password"
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
                <div className="mt-1 space-y-1">
                  {renderRequirement(passwordMeetsLength, "At least 8 characters")}
                  {renderRequirement(
                    passwordHasUpper,
                    "At least one uppercase letter"
                  )}
                  {renderRequirement(
                    passwordHasLower,
                    "At least one lowercase letter"
                  )}
                  {renderRequirement(passwordHasNumber, "At least one number")}
                  {renderRequirement(passwordHasSymbol, "At least one symbol")}
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="confirm-password"
                  className="text-sm font-medium text-gray-700"
                >
                  Confirm password
                </Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                    <Lock className="h-4 w-4" />
                  </span>
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Re-enter your password"
                    className="pl-9 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword((prev) => !prev)
                    }
                    className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {confirmPassword.length > 0 && (
                  <p
                    className={`text-xs ${
                      password === confirmPassword
                        ? "text-green-700"
                        : "text-red-600"
                    }`}
                  >
                    {password === confirmPassword
                      ? "Passwords match."
                      : "Passwords do not match."}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="text-gray-600">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Sign in
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating account..." : "Create account"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignupPage;