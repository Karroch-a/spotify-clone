import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { MainContent } from "@/components/main-content";
import { SignupBanner } from "@/components/signup-banner";
import { MusicPlayer } from "@/components/music-player";

export default function Home() {
  return (
    <div className="h-screen bg-black text-white overflow-hidden">
      <div className="flex h-[calc(100vh-64px)]">
        <Sidebar />

        <div className="flex-1 overflow-hidden">
          <MainContent />
        </div>
      </div>

      <SignupBanner />
    </div>
  );
}
