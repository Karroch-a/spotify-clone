"use client";

import { Header } from "@/components/header";
import { MusicPlayer } from "@/components/music-player";
import { Sidebar } from "@/components/sidebar";
import { SignupBanner } from "@/components/signup-banner";
import { AuthProvider } from "@/contexts/auth-context";
import { useEffect, useState } from "react";

export default function ClientBody({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    document.body.className = "antialiased";

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();

    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="antialiased">
      <AuthProvider>
        <Header />
        <div className="flex flex-col md:flex-row h-[calc(100vh-64px)]">
          <Sidebar isMobile={isMobile} />
          <div className="flex-1 overflow-y-auto w-full">{children}</div>
        </div>
        <SignupBanner />
        <MusicPlayer isMobile={isMobile} />
      </AuthProvider>
    </div>
  );
}
