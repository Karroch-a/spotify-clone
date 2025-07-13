"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Heart,
  Shuffle,
  Repeat,
  VolumeX,
  Volume1,
} from "lucide-react";

const MIN_VOLUME = 0;
const MAX_VOLUME = 100;
const VOLUME_THRESHOLD = 50;

export function MusicPlayer() {
  const {
    currentSong,
    isPlaying,
    setIsPlaying,
    toggleLikeSong,
    likedSongs,
    audioRef,
    currentTime,
    progress,
    setProgress,
    setCurrentTime,
    duration,
    playSong,
  } = useAuth();

  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(70);
  const [isDraggingVolume, setIsDraggingVolume] = useState(false);
  const [isDraggingProgress, setIsDraggingProgress] = useState(false);
  const [localProgress, setLocalProgress] = useState(0);

  const volumeBarRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const isLiked = currentSong
    ? likedSongs.some((s) => s.id === currentSong.id)
    : false;

  // Update local progress when global progress changes (if not dragging)
  useEffect(() => {
    if (!isDraggingProgress) {
      setLocalProgress(progress);
    }
  }, [progress, isDraggingProgress]);

  // Update audio volume when volume state changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = isMuted ? 0 : volume / 100;
  }, [volume, isMuted, audioRef]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const isTypingInFormElement = () => {
      const activeElement = document.activeElement;
      return (
        activeElement?.tagName === "INPUT" ||
        activeElement?.tagName === "TEXTAREA" ||
        activeElement?.getAttribute("role") === "textbox"
      );
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !isTypingInFormElement()) {
        e.preventDefault();
        togglePlayPause();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Handle volume slider dragging
  useEffect(() => {
    if (!isDraggingVolume) return;

    const handleMouseMove = (e: MouseEvent) => {
      const volumeBar = volumeBarRef.current;
      if (!volumeBar) return;

      const rect = volumeBar.getBoundingClientRect();
      const clickX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const newVolume = Math.round((clickX / rect.width) * 100);

      setVolume(Math.max(MIN_VOLUME, Math.min(MAX_VOLUME, newVolume)));
      if (isMuted) setIsMuted(false);
    };

    const handleMouseUp = () => {
      setIsDraggingVolume(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDraggingVolume, isMuted]);

  // Handle progress slider dragging
  useEffect(() => {
    if (!isDraggingProgress) return;

    const handleProgressMove = (e: MouseEvent) => {
      const progressBar = progressBarRef.current;
      if (!progressBar || !currentSong) return;

      const rect = progressBar.getBoundingClientRect();
      const clickX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const percentage = (clickX / rect.width) * 100;

      setLocalProgress(percentage);
    };

    const handleProgressUp = (e: MouseEvent) => {
      const progressBar = progressBarRef.current;
      const audio = audioRef.current;

      if (progressBar && currentSong && audio) {
        const rect = progressBar.getBoundingClientRect();
        const clickX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        const percentage = clickX / rect.width;
        const actualDuration = duration || currentSong.duration;
        const newTime = percentage * actualDuration;

        audio.currentTime = newTime;
        setCurrentTime(newTime);
        setProgress(percentage * 100);
        setLocalProgress(percentage * 100);
      }

      setIsDraggingProgress(false);
    };

    document.addEventListener("mousemove", handleProgressMove);
    document.addEventListener("mouseup", handleProgressUp);

    return () => {
      document.removeEventListener("mousemove", handleProgressMove);
      document.removeEventListener("mouseup", handleProgressUp);
    };
  }, [
    isDraggingProgress,
    currentSong,
    audioRef,
    setCurrentTime,
    setProgress,
    duration,
  ]);

  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const audio = audioRef.current;
      if (!audio || !currentSong) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = clickX / rect.width;
      const actualDuration = duration || currentSong.duration;
      const newTime = percentage * actualDuration;

      audio.currentTime = newTime;
      setCurrentTime(newTime);
      setProgress(percentage * 100);
      setLocalProgress(percentage * 100);
    },
    [audioRef, currentSong, duration, setCurrentTime, setProgress]
  );

  const handleProgressMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      setIsDraggingProgress(true);
      handleProgressClick(e);
    },
    [handleProgressClick]
  );

  const handleVolumeClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!audioRef.current) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newVolume = Math.round((clickX / rect.width) * 100);

      setVolume(Math.max(MIN_VOLUME, Math.min(MAX_VOLUME, newVolume)));
      if (isMuted) setIsMuted(false);
    },
    [audioRef, isMuted]
  );

  const handleVolumeMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      setIsDraggingVolume(true);
      handleVolumeClick(e);
    },
    [handleVolumeClick]
  );

  const toggleMute = useCallback(() => {
    if (isMuted) {
      setIsMuted(false);
      setVolume(previousVolume);
    } else {
      setPreviousVolume(volume);
      setIsMuted(true);
    }
  }, [isMuted, volume, previousVolume]);

  const formatTime = useCallback((seconds: number): string => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, []);

  const togglePlayPause = useCallback(() => {
    if (currentSong) {
      playSong(currentSong);
    }
  }, [currentSong, playSong]);

  const handleLike = useCallback(() => {
    if (currentSong) {
      toggleLikeSong(currentSong);
    }
  }, [currentSong, toggleLikeSong]);

  if (!currentSong) {
    return null;
  }

  const actualDuration = duration || currentSong.duration;
  const displayProgress = isDraggingProgress ? localProgress : progress;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-700 px-4 py-3 z-50">
      <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-4 min-w-0 w-80">
          <img
            src={currentSong.image}
            alt={currentSong.title}
            className="w-14 h-14 rounded object-cover"
          />
          <div className="min-w-0 flex-1">
            <h4 className="text-white font-medium text-sm truncate">
              {currentSong.title}
            </h4>
            <p className="text-zinc-400 text-xs truncate">
              {currentSong.artist}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLike}
            className={`w-8 h-8 ${
              isLiked ? "text-green-500" : "text-zinc-400 hover:text-white"
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
          </Button>
        </div>

        <div className="flex flex-col items-center gap-2 flex-1 max-w-2xl">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 text-zinc-400 hover:text-white"
            >
              <Shuffle className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 text-zinc-400 hover:text-white"
            >
              <SkipBack className="w-4 h-4" />
            </Button>
            <Button
              onClick={togglePlayPause}
              className="w-10 h-10 bg-white hover:bg-gray-200 text-black rounded-full"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-1" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 text-zinc-400 hover:text-white"
            >
              <SkipForward className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 text-zinc-400 hover:text-white"
            >
              <Repeat className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2 w-full max-w-md">
            <span className="text-xs text-zinc-400 w-10 text-right">
              {formatTime(currentTime)}
            </span>
            <div
              ref={progressBarRef}
              className="flex-1 h-1 bg-zinc-600 rounded-full cursor-pointer group"
              onClick={handleProgressClick}
              onMouseDown={handleProgressMouseDown}
            >
              <div
                className="h-full bg-white hover:bg-green-500 rounded-full relative"
                style={{ width: `${displayProgress}%` }}
              >
                <div
                  className={`absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full ${
                    isDraggingProgress
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100"
                  } transition-opacity`}
                />
              </div>
            </div>
            <span className="text-xs text-zinc-400 w-10">
              {formatTime(actualDuration)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 w-80 justify-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            className="w-8 h-8 text-zinc-400 hover:text-white"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4" />
            ) : volume < VOLUME_THRESHOLD ? (
              <Volume1 className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </Button>
          <div
            ref={volumeBarRef}
            className="w-24 h-5 flex items-center cursor-pointer "
            onClick={handleVolumeClick}
            onMouseDown={handleVolumeMouseDown}
          >
            <div className="w-full h-1 bg-zinc-600 rounded-full relative">
              <div
                className="h-full bg-white  rounded-full"
                style={{ width: `${isMuted ? 0 : volume}%` }}
              />
              <div
                className={`absolute h-3 w-3 bg-white  rounded-full top-1/2 -translate-y-1/2 ${
                  isDraggingVolume
                    ? "opacity-100"
                    : "group-hover:opacity-100 opacity-0"
                } transition-opacity`}
                style={{
                  left: `${isMuted ? 0 : volume}%`,
                  transform: "translate(-50%, -50%)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
