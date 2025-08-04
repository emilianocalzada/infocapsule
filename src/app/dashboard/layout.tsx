"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();
  const router = useRouter();
  const pathname = usePathname();

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth");
    }
  }, [isLoading, isAuthenticated, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render dashboard if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 sm:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-14 h-8 rounded-lg flex items-center justify-center">
                <img src="/logo.png" alt="InfoCapsule Logo" />
              </div>
              <span className="text-xl font-semibold text-gray-900">InfoCapsule</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link 
                href="/dashboard" 
                className={`font-medium transition-colors ${
                  pathname === "/dashboard" 
                    ? "text-orange-600" 
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Home
              </Link>
              <Link 
                href="/dashboard/digests" 
                className={`font-medium transition-colors ${
                  pathname === "/dashboard/digests" 
                    ? "text-orange-600" 
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Digests
              </Link>
              <Link 
                href="/dashboard/settings" 
                className={`font-medium transition-colors ${
                  pathname === "/dashboard/settings" 
                    ? "text-orange-600" 
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Settings
              </Link>
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSignOut}
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                Sign out
              </button>
              <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">U</span>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <nav className="md:hidden mt-4 flex items-center space-x-6 border-t border-gray-200 pt-4">
            <Link 
              href="/dashboard" 
              className={`font-medium transition-colors ${
                pathname === "/dashboard" 
                  ? "text-orange-600" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Dashboard
            </Link>
            <Link 
              href="/dashboard/sources" 
              className={`font-medium transition-colors ${
                pathname === "/dashboard/sources" 
                  ? "text-orange-600" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Sources
            </Link>
            <Link 
              href="/dashboard/digests" 
              className={`font-medium transition-colors ${
                pathname === "/dashboard/digests" 
                  ? "text-orange-600" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Digests
            </Link>
            <Link 
              href="/dashboard/settings" 
              className={`font-medium transition-colors ${
                pathname === "/dashboard/settings" 
                  ? "text-orange-600" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Settings
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 sm:px-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-gray-50 px-6 py-8 sm:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-gray-500 mb-4">
            © 2025 InfoCapsule. Made with ❤️ using
          </p>
          <div className="flex items-center justify-center space-x-6">
            <a href="https://convex.dev" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity">
              <img src="https://dashboard.convex.dev/convex-logo-only.svg" alt="Convex" className="h-6" />
            </a>
            <span className="text-gray-300">×</span>
            <a href="https://resend.com" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity">
              <img src="https://resend.com/static/brand/resend-wordmark-black.svg" alt="Resend" className="h-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
