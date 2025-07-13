"use client";

import { Header } from "@/components/header";
import { MusicPlayer } from "@/components/music-player";
import { Sidebar } from "@/components/sidebar";
import { SignupBanner } from "@/components/signup-banner";
import { AuthProvider } from "@/contexts/auth-context";
import { useEffect } from "react";

export default function ClientBody({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    document.body.className = "antialiased";
  }, []);

  return (
    <div className="antialiased">
      <AuthProvider>
        <Header />
        <div className="flex h-[calc(100vh-64px)]">
          <Sidebar />
          <div className="flex-1 overflow-y-auto">{children}</div>
        </div>
        <SignupBanner />
        <MusicPlayer />
      </AuthProvider>
    </div>
  );
}
