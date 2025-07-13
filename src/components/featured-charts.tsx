"use client";

import { Button } from "@/components/ui/button";
import { Play, Heart, Pause } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { Song } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { featuredCharts } from "@/data/music-data";

export function FeaturedCharts() {
  const { currentSong, isPlaying, playSong, toggleLikeSong, isLiked } =
    useAuth();
  const router = useRouter();

  const handlePlayChart = (
    chart: (typeof featuredCharts)[0],
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    playSong(chart.featuredSong);
  };

  const handleLikeSong = (e: React.MouseEvent, song: Song) => {
    e.stopPropagation();
    toggleLikeSong(song);
  };

  const navigateToPlaylist = (chart: (typeof featuredCharts)[0]) => {
    router.push(`/playlist/${chart.id}`);
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Featured Charts</h2>
        <Button
          variant="ghost"
          className="text-zinc-400 hover:text-white hover:bg-transparent"
        >
          Show all
        </Button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {featuredCharts.map((chart) => {
          const isCurrentChart = currentSong?.id === chart.featuredSong.id;
          const songIsLiked = isLiked(chart.featuredSong.id);

          return (
            <div
              key={chart.id}
              className="group relative min-w-[180px] bg-zinc-900/40 p-4 rounded-md hover:bg-zinc-800/60 transition-all cursor-pointer"
              onClick={() => navigateToPlaylist(chart)}
            >
              <div className="relative mb-4">
                <img
                  src={chart.image}
                  alt={chart.title}
                  className="w-full aspect-square object-cover rounded-md"
                />
                <Button
                  size="icon"
                  className="absolute bottom-2 right-2 w-12 h-12 bg-green-500 hover:bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0"
                  onClick={(e) => handlePlayChart(chart, e)}
                >
                  {isCurrentChart && isPlaying ? (
                    <Pause className="w-5 h-5 text-black fill-current" />
                  ) : (
                    <Play className="w-5 h-5 text-black fill-current ml-1" />
                  )}
                </Button>
                <Button
                  size="icon"
                  className={`absolute top-2 right-2 w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-all ${
                    songIsLiked
                      ? "text-green-500"
                      : "text-white hover:text-green-500"
                  }`}
                  onClick={(e) => handleLikeSong(e, chart.featuredSong)}
                >
                  <Heart
                    className={`w-4 h-4 ${songIsLiked ? "fill-current" : ""}`}
                  />
                </Button>
              </div>
              <div>
                <h3 className="font-bold text-white text-sm truncate mb-1">
                  {chart.title}
                </h3>
                <p className="text-zinc-400 text-xs line-clamp-2">
                  {chart.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
