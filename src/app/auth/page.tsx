"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthPage() {
  const { signIn } = useAuthActions();
  const { isLoading: authLoading, isAuthenticated } = useConvexAuth();
  const router = useRouter();
  const [step, setStep] = useState<"signIn" | { email: string }>("signIn");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [authLoading, isAuthenticated, router]);

  const handleEmailSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    
    try {
      await signIn("resend-otp", formData);
      setStep({ email });
    } catch (err) {
      setError("Failed to send verification code. Please try again.");
      console.error("Email submission error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);

    try {
      await signIn("resend-otp", formData);
      // Success - redirect to dashboard
      router.push("/dashboard");
    } catch (err) {
      setError("Invalid verification code. Please try again.");
      console.error("OTP verification error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render auth form if already authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-14 h-8 rounded-lg flex items-center justify-center">
              <img src="/logo.png" alt="InfoCapsule Logo" />
            </div>
            <span className="text-xl font-semibold text-gray-900">InfoCapsule</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {step === "signIn" ? "Welcome back" : "Check your email"}
          </h1>
          <p className="text-gray-600">
            {step === "signIn" 
              ? "Sign in to your account to continue" 
              : `We sent a verification code to ${step.email}`
            }
          </p>
        </div>

        {/* Auth Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {step === "signIn" ? (
            <form key="email-form" onSubmit={handleEmailSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                  placeholder="Enter your email address"
                  disabled={isLoading}
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-orange-400 to-amber-400 text-white py-3 px-4 rounded-xl hover:from-orange-500 hover:to-amber-500 focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Sending code...
                  </div>
                ) : (
                  "Send verification code"
                )}
              </button>
            </form>
          ) : (
            <form key="otp-form" onSubmit={handleOTPSubmit} className="space-y-6">
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                  Verification code
                </label>
                <input
                  id="code"
                  name="code"
                  type="text"
                  required
                  maxLength={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 text-center text-lg font-mono tracking-widest"
                  placeholder="000000"
                  disabled={isLoading}
                  autoComplete="one-time-code"
                  autoFocus
                />
                <input name="email" value={step.email} type="hidden" readOnly />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-orange-400 to-amber-400 text-white py-3 px-4 rounded-xl hover:from-orange-500 hover:to-amber-500 focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Verifying...
                    </div>
                  ) : (
                    "Verify and sign in"
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setStep("signIn");
                    setError(null);
                  }}
                  disabled={isLoading}
                  className="w-full border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Use different email
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            By signing in, you agree to our{" "}
            <a target="_blank" href="https://www.termsfeed.com/live/4236cf0a-26bf-4906-a2f7-2ed657504e30" className="text-orange-500 hover:text-orange-600 font-medium">
              Terms of Service
            </a>{" "}
            and{" "}
            <a target="_blank" href="https://www.termsfeed.com/live/2c454b58-1ec2-4d67-b41c-1e48d53985e8" className="text-orange-500 hover:text-orange-600 font-medium">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
