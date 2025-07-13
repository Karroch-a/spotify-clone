"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";

export function SignupBanner() {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoggedIn || isLoading) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-purple-700 to-pink-500 py-3 px-4 md:px-8 z-30">
      <div className="flex flex-col sm:flex-row items-center justify-between max-w-screen-xl mx-auto">
        <div className="mb-3 sm:mb-0 text-center sm:text-left">
          <h3 className="text-white font-bold text-sm md:text-base">
            Preview of Spotify
          </h3>
          <p className="text-white/80 text-xs md:text-sm">
            Sign up to get unlimited songs and podcasts with occasional ads. No
            credit card needed.
          </p>
        </div>
        <Button className="bg-white text-black hover:bg-gray-200 hover:scale-105 rounded-full px-6 py-2 font-bold transition-all duration-200 w-full sm:w-auto">
          Sign up free
        </Button>
      </div>
    </div>
  );
}
