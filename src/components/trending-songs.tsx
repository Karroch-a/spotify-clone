"use client";

import { Button } from "@/components/ui/button";
import { Play, Heart, Pause } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { trendingSongs } from "@/data/music-data";

export function TrendingSongs() {
  const { currentSong, isPlaying, toggleLikeSong, playSong, isLiked } =
    useAuth();
  const router = useRouter();

  const handlePlaySong = (
    song: (typeof trendingSongs)[0],
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    playSong(song);
  };

  const handleLikeSong = (
    e: React.MouseEvent,
    song: (typeof trendingSongs)[0]
  ) => {
    e.stopPropagation();
    toggleLikeSong(song);
  };

  const navigateToSong = (song: (typeof trendingSongs)[0]) => {
    router.push(`/song/${song.id}`);
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Trending songs</h2>
        <Button
          variant="ghost"
          className="text-zinc-400 hover:text-white hover:bg-transparent"
        >
          Show all
        </Button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {trendingSongs.map((song) => {
          const isCurrentSong = currentSong?.id === song.id;
          const songIsLiked = isLiked(song.id);

          return (
            <div
              key={song.id}
              className="group relative min-w-[180px] bg-zinc-900/40 p-4 rounded-md hover:bg-zinc-800/60 transition-all cursor-pointer"
              onClick={() => navigateToSong(song)}
            >
              <div className="relative mb-4">
                <img
                  src={song.image}
                  alt={song.title}
                  className="w-full aspect-square object-cover rounded-md"
                />
                <Button
                  size="icon"
                  className="absolute bottom-2 right-2 w-12 h-12 bg-green-500 hover:bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0"
                  onClick={(e) => handlePlaySong(song, e)}
                >
                  {isCurrentSong && isPlaying ? (
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
                  onClick={(e) => handleLikeSong(e, song)}
                >
                  <Heart
                    className={`w-4 h-4 ${songIsLiked ? "fill-current" : ""}`}
                  />
                </Button>
              </div>
              <div>
                <h3 className="font-bold text-white text-sm truncate mb-1">
                  {song.title}
                </h3>
                <p className="text-zinc-400 text-xs truncate">{song.artist}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
