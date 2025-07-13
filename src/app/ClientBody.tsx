"use client";

import { Header } from "@/components/header";
import { MusicPlayer } from "@/components/music-player";
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
        {children}
        <MusicPlayer />
      </AuthProvider>
    </div>
  );
}
