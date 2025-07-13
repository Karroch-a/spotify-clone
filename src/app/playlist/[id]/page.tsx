"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { SignupBanner } from "@/components/signup-banner";
import { MusicPlayer } from "@/components/music-player";
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
      <div className="h-screen bg-gradient-to-b from-slate-900 to-black text-white overflow-hidden">
        <div className="flex h-[calc(100vh-64px)]">
          <Sidebar />
          <div className="flex-1 overflow-y-auto">
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
            </div>
          </div>
        </div>
        <SignupBanner />
        <MusicPlayer />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="h-screen bg-gradient-to-b from-slate-900 to-black text-white overflow-hidden">
        <div className="flex h-[calc(100vh-64px)]">
          <Sidebar />
          <div className="flex-1 overflow-y-auto">
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
          </div>
        </div>
        <SignupBanner />
        <MusicPlayer />
      </div>
    );
  }

  if (playlist && playlist.songs.length === 0) {
    return (
      <div className="h-screen bg-gradient-to-b from-slate-900 to-black text-white overflow-hidden">
        <div className="flex h-[calc(100vh-64px)]">
          <Sidebar />
          <div className="flex-1 overflow-y-auto">
            <div className="bg-gradient-to-b from-slate-700 to-slate-900 px-8 py-6">
              <div className="flex items-end gap-6">
                <div className="w-60 h-60 bg-gradient-to-br from-purple-700 to-blue-300 flex items-center justify-center text-8xl font-bold text-white shadow-2xl">
                  ♫
                </div>
                <div className="pb-8">
                  <p className="text-sm font-medium mb-2">PUBLIC PLAYLIST</p>
                  <h1 className="text-6xl font-black mb-6 tracking-tight">
                    {playlist.name}
                  </h1>
                  <p className="text-gray-300 text-lg mb-4">
                    {playlist.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold">Spotify</span>
                    <span className="text-gray-400">• 0 songs</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-8 py-16 text-center">
              <h2 className="text-2xl font-bold mb-4">
                {playlist.id === "liked-songs"
                  ? "Songs you like will appear here"
                  : "Start by adding some songs"}
              </h2>
              <p className="text-gray-400 text-lg">
                {playlist.id === "liked-songs"
                  ? "Save songs by tapping the heart icon."
                  : "Search for songs and albums to add to this playlist."}
              </p>
            </div>
          </div>
        </div>
        <SignupBanner />
        <MusicPlayer />
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-b from-slate-900 to-black text-white overflow-hidden">
      <div className="flex h-[calc(100vh-64px)]">
        <Sidebar />
        <div className="flex-1 overflow-y-auto">
          {playlist && (
            <div>
              <div className="bg-gradient-to-b from-slate-700 to-slate-900 px-8 py-6">
                <div className="flex items-end gap-6">
                  <div className="w-60 h-60 flex-shrink-0 shadow-2xl">
                    <img
                      src={playlist.image}
                      alt={playlist.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="pb-8">
                    <p className="text-sm font-medium mb-2">PUBLIC PLAYLIST</p>
                    <h1 className="text-6xl font-black mb-6 tracking-tight">
                      {playlist.name}
                    </h1>
                    <p className="text-gray-300 text-lg mb-4">
                      {playlist.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-semibold">Spotify</span>
                      <span className="text-gray-400">
                        • {playlist.songs.length} songs,{" "}
                        {getTotalDuration(playlist.songs)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-b from-slate-900/60 to-black px-8 py-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <Button
                      onClick={handlePlayPlaylist}
                      className="w-14 h-14 bg-green-500 hover:bg-green-400 hover:scale-105 transition-all duration-200 rounded-full shadow-lg"
                      disabled={playlist.songs.length === 0}
                    >
                      {isPlaying &&
                      playlist.songs.some(
                        (song) => song.id === currentSong?.id
                      ) ? (
                        <Pause className="w-6 h-6 text-black" />
                      ) : (
                        <Play className="w-6 h-6 text-black ml-1" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-10 h-10 text-zinc-400 hover:text-white"
                    >
                      <Download className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-10 h-10 text-zinc-400 hover:text-white"
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      className="text-zinc-400 hover:text-white text-sm"
                    >
                      <List className="w-4 h-4 mr-2" />
                      List view
                    </Button>
                  </div>
                </div>

                <div className="mt-8">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-zinc-700/50">
                        <th className="pb-2 pl-4 w-12">#</th>
                        <th className="pb-2">Title</th>
                        <th className="pb-2">Album</th>
                        <th className="pb-2 text-right pr-8">
                          <Clock className="w-4 h-4" />
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
                            className="group hover:bg-white/10 transition-colors"
                            onClick={() => handlePlaySong(song)}
                          >
                            <td className="py-3 pl-4 w-12">
                              <div className="w-4 text-center">
                                {isCurrentlyPlaying ? (
                                  <div className="w-3 h-3 bg-green-500 rounded-sm animate-pulse mx-auto" />
                                ) : (
                                  <span className="text-zinc-400 group-hover:hidden">
                                    {index + 1}
                                  </span>
                                )}
                                {!isCurrentlyPlaying && (
                                  <Play className="w-3 h-3 text-white hidden group-hover:block" />
                                )}
                              </div>
                            </td>
                            <td className="py-3">
                              <div className="flex items-center gap-4">
                                <img
                                  src={song.image}
                                  alt={song.title}
                                  className="w-10 h-10 rounded"
                                />
                                <div>
                                  <p
                                    className={`font-medium ${
                                      isCurrentlyPlaying
                                        ? "text-green-500"
                                        : "text-white"
                                    }`}
                                  >
                                    {song.title}
                                  </p>
                                  <p className="text-zinc-400">{song.artist}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 text-zinc-400">{song.album}</td>
                            <td className="py-3 text-right pr-8">
                              <div className="flex items-center justify-end gap-4">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className={`w-8 h-8 ${
                                    songIsLiked
                                      ? "text-green-500"
                                      : "text-zinc-400 opacity-0 group-hover:opacity-100"
                                  } hover:text-white transition-all`}
                                  onClick={(e) => handleLikeSong(e, song)}
                                >
                                  <Heart
                                    className={`w-4 h-4 ${
                                      songIsLiked ? "fill-current" : ""
                                    }`}
                                  />
                                </Button>
                                <span className="text-zinc-400">
                                  {formatDuration(song.duration)}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="w-8 h-8 text-zinc-400 opacity-0 group-hover:opacity-100 hover:text-white transition-all"
                                >
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <SignupBanner />
      <MusicPlayer />
    </div>
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
