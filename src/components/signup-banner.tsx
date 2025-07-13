"use client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";

export function SignupBanner() {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoggedIn || isLoading) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-gradient-to-r from-purple-900 via-blue-800 to-purple-900 flex items-center justify-between px-6 z-50">
      <div className="flex-1">
        <h3 className="text-white font-bold text-lg">Preview of Spotify</h3>
        <p className="text-white/80 text-sm">
          Sign up to get unlimited songs and podcasts with occasional ads. No
          credit card needed.
        </p>
      </div>

      <Button className="bg-white text-black hover:bg-gray-200 rounded-full px-8 py-3 font-bold">
        Sign up free
      </Button>
    </div>
  );
}
