"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import {
  Play,
  Pause,
  Heart,
  MoreHorizontal,
  Download,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Song } from "@/contexts/auth-context";
import { getSongById, getAllSongs } from "@/data/music-data";

const LYRICS_PREVIEW_LINES = 12;

export default function SongPage() {
  const params = useParams();
  const songId = params.id as string;
  const { currentSong, isPlaying, playSong, toggleLikeSong, isLiked } =
    useAuth();
  const [song, setSong] = useState<Song>();
  const [showAllLyrics, setShowAllLyrics] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSong = async () => {
      setIsLoading(true);
      try {
        const foundSong = getSongById(songId);
        setSong(foundSong);
      } catch (error) {
        console.error("Error loading song:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (songId) {
      loadSong();
    }
  }, [songId]);

  const handleLikeSong = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (song) {
        toggleLikeSong(song);
      }
    },
    [song, toggleLikeSong]
  );

  const formatDuration = useCallback((seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }, []);

  const formatPlays = useCallback((plays: number): string => {
    if (plays >= 1000000) {
      return `${(plays / 1000000).toFixed(0).replace(/\.0$/, "")}M`;
    }
    if (plays >= 1000) {
      return `${(plays / 1000).toFixed(0).replace(/\.0$/, "")}K`;
    }
    return plays.toString();
  }, []);

  const isCurrentSong = useMemo(
    () => currentSong?.id === song?.id,
    [currentSong?.id, song?.id]
  );
  const songIsLiked = useMemo(
    () => (song ? isLiked(song.id) : false),
    [song, isLiked]
  );
  const relatedSongs = useMemo(() => getAllSongs().slice(0, 5), []);

  const lyricsToShow = useMemo(() => {
    if (!song?.lyrics) return [];
    return showAllLyrics
      ? song.lyrics
      : song.lyrics.slice(0, LYRICS_PREVIEW_LINES);
  }, [song?.lyrics, showAllLyrics]);

  const hasMoreLyrics = useMemo(() => {
    return song?.lyrics && song.lyrics.length > LYRICS_PREVIEW_LINES;
  }, [song?.lyrics]);

  if (isLoading) {
    return (
      <div className="h-screen bg-black text-white overflow-hidden">
        <div className="flex h-[calc(100vh-64px)]">
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-pulse">
              <div className="h-8 bg-zinc-800 rounded w-48 mb-4"></div>
              <div className="h-4 bg-zinc-800 rounded w-32"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!song) {
    return (
      <div className="h-screen bg-black text-white overflow-hidden">
        <div className="flex h-[calc(100vh-64px)]">
          <div className="flex-1 flex items-center justify-center">
            <p className="text-zinc-400 text-lg">Song not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-black text-white overflow-hidden">
      <div className="flex h-[calc(100vh-64px)]">
        <div className="flex-1 overflow-y-auto">
          <div className="bg-gradient-to-b from-blue-900 via-blue-900/70 to-black p-8">
            <div className="flex items-end gap-6 max-w-screen-xl mx-auto">
              <div className="w-60 h-60 flex-shrink-0 shadow-2xl">
                <img
                  src={song.image}
                  alt={`${song.title} album cover`}
                  className="w-full h-full object-cover shadow-2xl"
                  loading="eager"
                />
              </div>

              <div className="flex flex-col gap-2 pb-4 min-w-0">
                <span className="text-sm font-medium text-white/90">Song</span>
                <h1 className="text-6xl lg:text-7xl font-black mb-4 leading-tight break-words">
                  {song.title}
                </h1>

                <div className="flex items-center gap-2 text-sm">
                  <img
                    src="/images/ed_sheeran.jpg"
                    alt={song.artist}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="font-medium">
                    <span className="hover:underline cursor-pointer text-white">
                      {song.artist}
                    </span>
                    {song.releaseYear && (
                      <span className="text-white/70">
                        {" "}
                        • {song.releaseYear}
                      </span>
                    )}
                    {song.duration && (
                      <span className="text-white/70">
                        {" "}
                        • {formatDuration(song.duration)}
                      </span>
                    )}
                    {song.plays && (
                      <span className="text-white/70">
                        {" "}
                        • {formatPlays(song.plays)} plays
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-b from-black/50 to-black px-8 py-6">
            <div className="max-w-screen-xl mx-auto flex items-center gap-6">
              <Button
                onClick={() => playSong(song)}
                className="w-14 h-14 bg-green-500 hover:bg-green-400 hover:scale-105 rounded-full transition-all duration-200 shadow-lg"
              >
                {isCurrentSong && isPlaying ? (
                  <Pause className="w-6 h-6 text-black fill-current" />
                ) : (
                  <Play className="w-6 h-6 text-black fill-current ml-0.5" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleLikeSong}
                className={`w-12 h-12 transition-all duration-200 ${
                  songIsLiked
                    ? "text-green-500 hover:text-green-400"
                    : "text-zinc-400 hover:text-white hover:scale-105"
                }`}
              >
                <Heart
                  className={`w-6 h-6 ${songIsLiked ? "fill-current" : ""}`}
                />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="w-12 h-12 text-zinc-400 hover:text-white hover:scale-105 transition-all duration-200"
              >
                <Download className="w-6 h-6" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="w-12 h-12 text-zinc-400 hover:text-white hover:scale-105 transition-all duration-200"
              >
                <MoreHorizontal className="w-6 h-6" />
              </Button>
            </div>
          </div>

          {song.lyrics && song.lyrics.length > 0 && (
            <div className="px-8 py-8 bg-black">
              <div className="max-w-screen-xl mx-auto">
                <h2 className="text-2xl font-bold mb-6 text-white">Lyrics</h2>
                <div className="text-lg leading-relaxed text-zinc-200 space-y-2">
                  {lyricsToShow.map((line, index) => (
                    <p
                      key={index}
                      className="hover:text-white transition-colors duration-200"
                    >
                      {line}
                    </p>
                  ))}

                  {hasMoreLyrics && (
                    <Button
                      variant="ghost"
                      onClick={() => setShowAllLyrics(!showAllLyrics)}
                      className="text-zinc-400 hover:text-white mt-6 font-medium p-0 h-auto"
                    >
                      {showAllLyrics ? (
                        <>
                          <ChevronUp className="w-4 h-4 mr-1" />
                          Show less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4 mr-1" />
                          Show more
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="px-8 py-8 bg-black">
            <div className="max-w-screen-xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-white">
                Recommended
              </h2>
              <div className="space-y-1">
                {relatedSongs.map((relatedSong) => (
                  <div
                    key={relatedSong.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-zinc-800/50 cursor-pointer group transition-all duration-200"
                    onClick={() => playSong(relatedSong)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 relative flex-shrink-0">
                        <img
                          src={relatedSong.image}
                          alt={relatedSong.title}
                          className="w-full h-full object-cover rounded"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded transition-opacity duration-200">
                          <Play className="w-4 h-4 text-white" />
                        </div>
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-white truncate">
                          {relatedSong.title}
                        </p>
                        <p className="text-xs text-zinc-400 truncate">
                          {relatedSong.artist}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLikeSong(relatedSong);
                        }}
                        className={`w-8 h-8 opacity-0 group-hover:opacity-100 transition-all duration-200 ${
                          isLiked(relatedSong.id)
                            ? "text-green-500 opacity-100"
                            : "text-zinc-400 hover:text-white"
                        }`}
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            isLiked(relatedSong.id) ? "fill-current" : ""
                          }`}
                        />
                      </Button>

                      <span className="text-sm text-zinc-400 w-12 text-right">
                        {formatDuration(relatedSong.duration)}
                      </span>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8 text-zinc-400 hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-200"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="h-32" />
        </div>
      </div>
    </div>
  );
}
