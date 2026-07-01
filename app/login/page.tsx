"use client";

import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

async function signIn(provider: "google" | "github") {
  await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${location.origin}/auth/callback`,
    },
  });
}

export default function LoginPage() {
  const searchParams = useSearchParams();
  const hasError = searchParams.get("error") === "auth_failed";

  return (
    <div className="min-h-screen bg-background-light flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-sm border border-mosque/10 p-8 w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-lg bg-nordic-dark flex items-center justify-center">
            <span className="material-icons text-white text-lg">apartment</span>
          </div>
          <span className="text-xl font-semibold tracking-tight text-nordic-dark">LuxeEstate</span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-nordic-dark tracking-tight mb-1">
          Welcome back
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          Sign in to access your saved homes and preferences.
        </p>

        {hasError && (
          <div className="mb-6 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            Authentication failed. Please try again.
          </div>
        )}

        {/* Social sign-in buttons */}
        <div className="space-y-3">
          <button
            onClick={() => signIn("google")}
            className="w-full bg-white border border-gray-200 text-nordic-dark hover:bg-gray-50 px-5 py-3 rounded-lg text-sm font-medium flex items-center justify-center gap-3 transition-colors shadow-sm"
          >
            {/* Google logo */}
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>

          <button
            onClick={() => signIn("github")}
            className="w-full bg-nordic-dark hover:bg-nordic-dark/90 text-white px-5 py-3 rounded-lg text-sm font-medium flex items-center justify-center gap-3 shadow-md transition-all transform hover:-translate-y-0.5"
          >
            {/* GitHub logo */}
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              />
            </svg>
            Continue with GitHub
          </button>
        </div>

        {/* Divider */}
        <div className="mt-8 pt-6 border-t border-mosque/10">
          <p className="text-xs text-gray-400 text-center">
            By signing in, you agree to our{" "}
            <span className="text-mosque hover:underline cursor-pointer">Terms of Service</span>
            {" "}and{" "}
            <span className="text-mosque hover:underline cursor-pointer">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
