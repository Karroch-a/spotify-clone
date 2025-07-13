"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import {
  Play,
  Pause,
  Heart,
  Clock,
  MoreHorizontal,
  Download,
  List,
} from "lucide-react";
import { Playlist, Song } from "@/contexts/auth-context";
import { getPlaylistById } from "@/data/music-data";

export default function PlaylistPage() {
  const params = useParams();
  const router = useRouter();
  const playlistId = params.id as string;
  const {
    currentSong,
    isPlaying,
    playSong,
    toggleLikeSong,
    isLiked,
    likedSongs,
  } = useAuth();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setNotFound(false);

    if (!playlistId) {
      setNotFound(true);
      setIsLoading(false);
      return;
    }

    if (playlistId === "liked-songs") {
      const likedSongsPlaylist: Playlist = {
        id: "liked-songs",
        name: "Liked Songs",
        image: "https://misc.scdn.co/liked-songs/liked-songs-300.png",
        description: "Songs you've liked",
        songs: likedSongs,
      };
      setPlaylist(likedSongsPlaylist);
      setIsLoading(false);
      return;
    }

    const foundPlaylist = getPlaylistById(playlistId);

    if (foundPlaylist) {
      const randomSongs = generateRandomSongs(playlistId, 15);
      const playlistWithSongs = {
        ...foundPlaylist,
        songs: [...foundPlaylist.songs, ...randomSongs],
      };
      setPlaylist(playlistWithSongs);
      setIsLoading(false);
    } else {
      setNotFound(true);
      setIsLoading(false);
    }
  }, [playlistId, likedSongs]);

  const handlePlayPlaylist = () => {
    if (playlist?.songs.length) {
      playSong(playlist.songs[0]);
    }
  };

  const handlePlaySong = (song: Song) => {
    playSong(song);
  };

  const handleLikeSong = (e: React.MouseEvent, song: Song) => {
    e.stopPropagation();
    toggleLikeSong(song);
  };

  const handleGoBack = () => {
    router.back();
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getTotalDuration = (songs: Song[]) => {
    const totalSeconds = songs.reduce(
      (total, song) => total + song.duration,
      0
    );
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return hours > 0 ? `${hours} hr ${minutes} min` : `${minutes} min`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Playlist not found</h1>
          <p className="text-gray-400 text-lg mb-8">
            We can't find the playlist you're looking for.
          </p>
          <Button
            onClick={handleGoBack}
            className="bg-white text-black hover:bg-gray-200 font-semibold px-8 py-3 rounded-full"
          >
            Go back
          </Button>
        </div>
      </div>
    );
  }

  if (playlist && playlist.songs.length === 0) {
    return (
      <>
        <div className="bg-gradient-to-b from-slate-700 to-slate-900 px-4 sm:px-6 md:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-end gap-6">
            <div className="w-40 h-40 md:w-60 md:h-60 mx-auto md:mx-0 bg-gradient-to-br from-purple-700 to-blue-300 flex items-center justify-center text-6xl md:text-8xl font-bold text-white shadow-2xl">
              ♫
            </div>
            <div className="text-center md:text-left md:pb-8">
              <p className="text-xs md:text-sm font-medium mb-2">
                PUBLIC PLAYLIST
              </p>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mb-4 md:mb-6 tracking-tight">
                {playlist.name}
              </h1>
              <p className="text-gray-300 text-base md:text-lg mb-4">
                {playlist.description}
              </p>
              <div className="flex items-center justify-center md:justify-start gap-2 text-xs md:text-sm">
                <span className="font-semibold">Spotify</span>
                <span className="text-gray-400">• 0 songs</span>
              </div>
            </div>
          </div>
        </div>
        <div className="px-4 sm:px-6 md:px-8 py-16 text-center">
          <h2 className="text-xl md:text-2xl font-bold mb-4">
            {playlist.id === "liked-songs"
              ? "Songs you like will appear here"
              : "Start by adding some songs"}
          </h2>
          <p className="text-gray-400 text-base md:text-lg">
            {playlist.id === "liked-songs"
              ? "Save songs by tapping the heart icon."
              : "Search for songs and albums to add to this playlist."}
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      {playlist && (
        <div>
          <div className="bg-gradient-to-b from-slate-700 to-slate-900 px-4 sm:px-6 md:px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-end gap-6">
              <div className="w-40 h-40 md:w-60 md:h-60 mx-auto md:mx-0 flex-shrink-0 shadow-2xl">
                <img
                  src={playlist.image}
                  alt={playlist.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center md:text-left md:pb-8">
                <p className="text-xs md:text-sm font-medium mb-2">
                  PUBLIC PLAYLIST
                </p>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mb-4 md:mb-6 tracking-tight">
                  {playlist.name}
                </h1>
                <p className="text-gray-300 text-base md:text-lg mb-4">
                  {playlist.description}
                </p>
                <div className="flex items-center justify-center md:justify-start gap-2 text-xs md:text-sm">
                  <span className="font-semibold">Spotify</span>
                  <span className="text-gray-400">
                    • {playlist.songs.length} songs,{" "}
                    {getTotalDuration(playlist.songs)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-b from-black/50 to-black px-4 sm:px-6 md:px-8 py-6">
            <div className="flex items-center gap-4">
              <Button
                onClick={handlePlayPlaylist}
                className="w-12 h-12 md:w-14 md:h-14 bg-green-500 hover:bg-green-400 hover:scale-105 rounded-full transition-all duration-200 shadow-lg"
              >
                {isPlaying &&
                currentSong &&
                playlist.songs.some((song) => song.id === currentSong.id) ? (
                  <Pause className="w-5 h-5 md:w-6 md:h-6 text-black fill-current" />
                ) : (
                  <Play className="w-5 h-5 md:w-6 md:h-6 text-black fill-current ml-0.5" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 md:w-12 md:h-12 text-zinc-400 hover:text-white hover:scale-105 transition-all duration-200"
              >
                <Download className="w-5 h-5 md:w-6 md:h-6" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 md:w-12 md:h-12 text-zinc-400 hover:text-white hover:scale-105 transition-all duration-200"
              >
                <MoreHorizontal className="w-5 h-5 md:w-6 md:h-6" />
              </Button>
            </div>
          </div>

          <div className="px-4 sm:px-6 md:px-8 py-4">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left text-xs text-zinc-400 border-b border-zinc-700">
                  <th className="px-4 py-2 w-10">#</th>
                  <th className="px-4 py-2">Title</th>
                  <th className="px-4 py-2 hidden md:table-cell">Album</th>
                  <th className="px-4 py-2 hidden lg:table-cell">Date added</th>
                  <th className="px-4 py-2 text-right">
                    <Clock className="w-4 h-4 inline" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {playlist.songs.map((song, index) => {
                  const isCurrentlyPlaying =
                    isPlaying && currentSong?.id === song.id;
                  const songIsLiked = isLiked(song.id);

                  return (
                    <tr
                      key={song.id}
                      className="group hover:bg-white/10 text-zinc-300 hover:text-white cursor-pointer"
                      onClick={() => handlePlaySong(song)}
                    >
                      <td className="px-4 py-3 w-10 text-center">
                        {isCurrentlyPlaying ? (
                          <div className="w-4 h-4 text-green-500">
                            <svg
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-full h-full"
                            >
                              <path d="M8 5.14v14l11-7-11-7z" />
                            </svg>
                          </div>
                        ) : (
                          <span className="text-zinc-400 group-hover:hidden">
                            {index + 1}
                          </span>
                        )}
                        {!isCurrentlyPlaying && (
                          <div className="w-4 h-4 text-white hidden group-hover:block">
                            <svg
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-full h-full"
                            >
                              <path d="M8 5.14v14l11-7-11-7z" />
                            </svg>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-zinc-800 flex-shrink-0">
                            <img
                              src={song.image}
                              alt={song.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div
                              className={`font-medium ${
                                isCurrentlyPlaying ? "text-green-500" : ""
                              }`}
                            >
                              {song.title}
                            </div>
                            <div className="text-xs text-zinc-400">
                              {song.artist}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        {song.album || "-"}
                      </td>
                      <td className="px-4 py-3 text-zinc-400 text-sm hidden lg:table-cell">
                        {new Date().toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right text-zinc-400 text-sm">
                        <div className="flex items-center justify-end gap-4">
                          <button
                            onClick={(e) => handleLikeSong(e, song)}
                            className={`opacity-0 group-hover:opacity-100 transition-opacity ${
                              songIsLiked ? "text-green-500 opacity-100" : ""
                            }`}
                          >
                            <Heart
                              className={`w-4 h-4 ${
                                songIsLiked ? "fill-current" : ""
                              }`}
                            />
                          </button>
                          <span>{formatDuration(song.duration)}</span>
                          <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

function generateRandomSongs(playlistId: string, count: number): Song[] {
  const songs: Song[] = [];
  const artists = [
    "The Weeknd",
    "Dua Lipa",
    "Kendrick Lamar",
    "Billie Eilish",
    "Drake",
    "Taylor Swift",
    "Post Malone",
    "Ariana Grande",
  ];
  const albums = [
    "After Hours",
    "Future Nostalgia",
    "DAMN.",
    "Happier Than Ever",
    "Certified Lover Boy",
    "Midnights",
    "Hollywood's Bleeding",
    "Positions",
  ];

  for (let i = 0; i < count; i++) {
    const artist = artists[Math.floor(Math.random() * artists.length)];
    const album = albums[Math.floor(Math.random() * albums.length)];
    const duration = Math.floor(Math.random() * 120) + 120; // 2-4 minutes

    songs.push({
      id: `${playlistId}-random-${i}`,
      title: `Random Song ${i + 1}`,
      artist,
      album,
      duration,
      image: `https://picsum.photos/seed/${playlistId}-${i}/200/200`,
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    });
  }

  return songs;
}
