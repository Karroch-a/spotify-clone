"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";

export interface User {
  email: string;
  name: string;
  avatar: string;
  premium: boolean;
}

export interface Playlist {
  id: string;
  name: string;
  image: string;
  description: string;
  songs: Song[];
  isLiked?: boolean;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  image: string;
  duration: number;
  isLiked?: boolean;
  audioUrl?: string;
  releaseYear?: number;
  plays?: number;
  lyrics?: string[];
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  userPlaylists: Playlist[];
  likedSongs: Song[];
  toggleLikeSong: (song: Song) => void;
  currentSong: Song | null;
  setCurrentSong: (song: Song) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  playSong: (song: Song) => void;
  isLiked: (songId: string) => boolean;
  isLoading: boolean;
  audioRef: React.RefObject<HTMLAudioElement>;
  currentTime: number;
  progress: number;
  handleTimeUpdate: () => void;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
  setCurrentTime: React.Dispatch<React.SetStateAction<number>>;
  duration: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USER: User = {
  email: "datoli8133@hosintoy.com",
  name: "Music Lover",
  avatar:
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face",
  premium: true,
};

const MOCK_PLAYLISTS: Playlist[] = [
  {
    id: "chart2",
    name: "Chill Vibes",
    image: "https://i.scdn.co/image/ab67616d0000b273d72fb55710a95c1c15622f8c",
    description: "Perfect for relaxing",
    songs: [],
  },
  {
    id: "chart3",
    name: "Workout Mix",
    image: "https://i.scdn.co/image/ab67616d0000b27371d62ea7ea86a1ed0550f67f",
    description: "High energy tracks",
    songs: [],
  },
  {
    id: "chart4",
    name: "Road Trip",
    image: "https://i.scdn.co/image/ab67616d0000b273bb54dde68cd23e2a268ae0f5",
    description: "Songs for the journey",
    songs: [],
  },
];

const DEFAULT_AUDIO_URL = "/audio/Ed Sheeran.mp3";
const LOCAL_STORAGE_KEYS = {
  USER: "spotify-user",
  LIKED_SONGS: "spotify-liked-songs",
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userPlaylists, setUserPlaylists] = useState<Playlist[]>([]);
  const [likedSongs, setLikedSongs] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(
    typeof Audio !== "undefined" ? new Audio() : null
  );

  const configureAudioElement = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.preload = "auto";

    const handleCanPlay = () => {
      if (isPlaying && audio) {
        audio.play().catch((error) => {
          console.error("Play failed after canplay event:", error);
          setIsPlaying(false);
        });
      }
    };

    audio.addEventListener("canplay", handleCanPlay);

    return () => {
      audio.removeEventListener("canplay", handleCanPlay);
    };
  }, [isPlaying]);

  const handleTimeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    const current = audio.currentTime;
    const songDuration = audio.duration || currentSong.duration;
    setCurrentTime(current);
    setProgress((current / songDuration) * 100);
  }, [currentSong]);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handleMetadata = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    setDuration(audio.duration);
  }, []);

  useEffect(() => {
    return configureAudioElement();
  }, [configureAudioElement]);

  // Load user data from localStorage
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(LOCAL_STORAGE_KEYS.USER);
      if (savedUser) {
        setUser(JSON.parse(savedUser));
        setUserPlaylists(MOCK_PLAYLISTS);

        const savedLikedSongs = localStorage.getItem(
          LOCAL_STORAGE_KEYS.LIKED_SONGS
        );
        if (savedLikedSongs) {
          setLikedSongs(JSON.parse(savedLikedSongs));
        }
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Set up audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.removeEventListener("timeupdate", handleTimeUpdate);
    audio.removeEventListener("ended", handleEnded);
    audio.removeEventListener("loadedmetadata", handleMetadata);

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("loadedmetadata", handleMetadata);

    const updateInterval = setInterval(() => {
      if (audio && currentSong && isPlaying) {
        const current = audio.currentTime;
        const songDuration = audio.duration || currentSong.duration;
        setCurrentTime(current);
        setProgress((current / songDuration) * 100);
      }
    }, 250);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("loadedmetadata", handleMetadata);
      clearInterval(updateInterval);
    };
  }, [handleTimeUpdate, handleEnded, handleMetadata, currentSong, isPlaying]);

  // Handle play/pause
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    if (isPlaying) {
      if (audio.readyState >= 3) {
        audio.play().catch((error) => {
          console.error("Playback failed in isPlaying effect:", error);
          setIsPlaying(false);
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, currentSong]);

  // Handle audio source updates
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong?.audioUrl) return;

    const shouldUpdateSource =
      !audio.src || !audio.src.includes(currentSong.audioUrl);
    if (!shouldUpdateSource) return;

    const audioSource = currentSong.audioUrl || DEFAULT_AUDIO_URL;
    audio.src = audioSource;
    audio.currentTime = 0;
    setCurrentTime(0);
    setProgress(0);
  }, [currentSong]);

  const login = async (email: string, password: string): Promise<boolean> => {
    if (email === "abdo@test.com" && password === "123456") {
      setUser(MOCK_USER);
      setUserPlaylists(MOCK_PLAYLISTS);
      localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(MOCK_USER));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setUserPlaylists([]);
    setLikedSongs([]);
    setCurrentSong(null);
    setIsPlaying(false);

    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.src = "";
    }

    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.LIKED_SONGS);
  };

  const toggleLikeSong = (song: Song) => {
    const isCurrentlyLiked = likedSongs.some((s) => s.id === song.id);
    const newLikedSongs = isCurrentlyLiked
      ? likedSongs.filter((s) => s.id !== song.id)
      : [...likedSongs, { ...song, isLiked: true }];

    setLikedSongs(newLikedSongs);
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.LIKED_SONGS,
      JSON.stringify(newLikedSongs)
    );
  };

  const isLiked = (songId: string): boolean => {
    return likedSongs.some((s) => s.id === songId);
  };

  const playSong = (song: Song): void => {
    const audio = audioRef.current;
    if (!audio) return;

    if (currentSong?.id === song.id) {
      setIsPlaying(!isPlaying);
    } else {
      audio.pause();
      setCurrentSong(song);

      const audioSource = song.audioUrl || DEFAULT_AUDIO_URL;
      audio.src = audioSource;
      audio.currentTime = 0;
      setCurrentTime(0);
      setProgress(0);
      setIsPlaying(true);
    }
  };

  const contextValue: AuthContextType = {
    user,
    isLoggedIn: !!user,
    login,
    logout,
    userPlaylists,
    likedSongs,
    toggleLikeSong,
    currentSong,
    setCurrentSong,
    isPlaying,
    setIsPlaying,
    playSong,
    isLiked,
    isLoading,
    audioRef,
    currentTime,
    progress,
    handleTimeUpdate,
    setProgress,
    setCurrentTime,
    duration,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
