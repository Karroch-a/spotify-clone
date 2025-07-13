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
  Maximize2,
  Minimize2,
} from "lucide-react";

const MIN_VOLUME = 0;
const MAX_VOLUME = 100;
const VOLUME_THRESHOLD = 50;

export function MusicPlayer({ isMobile }: { isMobile: boolean }) {
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
  const [isExpanded, setIsExpanded] = useState(false);

  const volumeBarRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const isLiked = currentSong
    ? likedSongs.some((s) => s.id === currentSong.id)
    : false;

  const togglePlayPause = useCallback(() => {
    if (currentSong) {
      playSong(currentSong);
    }
  }, [currentSong, playSong]);

  const toggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  useEffect(() => {
    if (!isDraggingProgress) {
      setLocalProgress(progress);
    }
  }, [progress, isDraggingProgress]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = isMuted ? 0 : volume / 100;
  }, [volume, isMuted, audioRef]);

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
  }, [togglePlayPause]);

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

  const formatTime = (time: number) => {
    if (!time) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (!currentSong) return null;

  if (isMobile && isExpanded) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col p-4">
        <div className="flex justify-end mb-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-white"
            onClick={toggleExpand}
          >
            <Minimize2 className="w-6 h-6" />
          </Button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-64 h-64 mb-8 bg-zinc-800 rounded-md overflow-hidden">
            <img
              src={currentSong.image}
              alt={currentSong.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="text-center mb-8 w-full px-4">
            <h3 className="text-white font-bold text-xl truncate">
              {currentSong.title}
            </h3>
            <p className="text-zinc-400 text-sm truncate">
              {currentSong.artist}
            </p>
          </div>

          <div className="w-full px-4 mb-4">
            <div
              className="h-1 bg-zinc-700 rounded-full w-full cursor-pointer relative"
              ref={progressBarRef}
              onClick={handleProgressClick}
              onMouseDown={handleProgressMouseDown}
            >
              <div
                className="absolute top-0 left-0 h-full bg-white rounded-full"
                style={{ width: `${localProgress}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-zinc-400">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration || currentSong.duration)}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-8 mb-8">
            <Button
              variant="ghost"
              size="icon"
              className="text-zinc-400 hover:text-white"
            >
              <Shuffle className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-zinc-400 hover:text-white"
            >
              <SkipBack className="w-6 h-6" />
            </Button>
            <Button
              onClick={togglePlayPause}
              className="w-14 h-14 rounded-full bg-white text-black hover:bg-gray-200 flex items-center justify-center"
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 text-black fill-current" />
              ) : (
                <Play className="w-8 h-8 text-black fill-current" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-zinc-400 hover:text-white"
            >
              <SkipForward className="w-6 h-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-zinc-400 hover:text-white"
            >
              <Repeat className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex items-center justify-between w-full px-4">
            <Button
              variant="ghost"
              size="icon"
              className={`text-zinc-400 hover:text-white ${
                isLiked ? "text-green-500" : ""
              }`}
              onClick={() => toggleLikeSong(currentSong)}
            >
              <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-zinc-400 hover:text-white"
                onClick={() => {
                  if (isMuted || volume === 0) {
                    setIsMuted(false);
                    setVolume(previousVolume || 70);
                  } else {
                    setPreviousVolume(volume);
                    setIsMuted(true);
                  }
                }}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-5 h-5" />
                ) : volume < VOLUME_THRESHOLD ? (
                  <Volume1 className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </Button>

              <div
                className="w-24 h-1 bg-zinc-700 rounded-full cursor-pointer relative"
                ref={volumeBarRef}
                onClick={(e) => {
                  const rect = volumeBarRef.current?.getBoundingClientRect();
                  if (!rect) return;
                  const clickX = e.clientX - rect.left;
                  const percentage = (clickX / rect.width) * 100;
                  setVolume(
                    Math.max(MIN_VOLUME, Math.min(MAX_VOLUME, percentage))
                  );
                  if (isMuted) setIsMuted(false);
                }}
              >
                <div
                  className="absolute top-0 left-0 h-full bg-white rounded-full"
                  style={{ width: `${isMuted ? 0 : volume}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-zinc-900 border-t border-zinc-800 px-4 flex items-center justify-between z-40">
      <div className="flex items-center gap-3 w-1/4 min-w-0">
        {currentSong && (
          <>
            <div className="w-12 h-12 bg-zinc-800 rounded-md overflow-hidden flex-shrink-0">
              <img
                src={currentSong.image}
                alt={currentSong.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 hidden sm:block">
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
              className={`text-zinc-400 hover:text-white ${
                isLiked ? "text-green-500" : ""
              } hidden sm:flex`}
              onClick={() => toggleLikeSong(currentSong)}
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
            </Button>
          </>
        )}
      </div>

      <div className="flex flex-col items-center justify-center flex-1 max-w-md">
        <div className="flex items-center gap-2 md:gap-4 mb-1">
          <Button
            variant="ghost"
            size="icon"
            className="text-zinc-400 hover:text-white w-8 h-8 hidden sm:flex"
          >
            <Shuffle className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-zinc-400 hover:text-white w-8 h-8"
          >
            <SkipBack className="w-4 h-4" />
          </Button>
          <Button
            onClick={togglePlayPause}
            className="w-8 h-8 rounded-full bg-white text-black hover:bg-gray-200 flex items-center justify-center"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 text-black fill-current" />
            ) : (
              <Play className="w-4 h-4 text-black fill-current" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-zinc-400 hover:text-white w-8 h-8"
          >
            <SkipForward className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-zinc-400 hover:text-white w-8 h-8 hidden sm:flex"
          >
            <Repeat className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2 w-full">
          <span className="text-xs text-zinc-400 hidden sm:block">
            {formatTime(currentTime)}
          </span>
          <div
            className="h-1 bg-zinc-700 rounded-full flex-1 cursor-pointer relative"
            ref={progressBarRef}
            onClick={handleProgressClick}
            onMouseDown={handleProgressMouseDown}
          >
            <div
              className="absolute top-0 left-0 h-full bg-white rounded-full"
              style={{ width: `${localProgress}%` }}
            />
          </div>
          <span className="text-xs text-zinc-400 hidden sm:block">
            {formatTime(duration || currentSong.duration)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 justify-end w-1/4">
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="text-zinc-400 hover:text-white"
            onClick={toggleExpand}
          >
            <Maximize2 className="w-5 h-5" />
          </Button>
        )}

        <div className="hidden md:flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-zinc-400 hover:text-white w-8 h-8"
            onClick={() => {
              if (isMuted || volume === 0) {
                setIsMuted(false);
                setVolume(previousVolume || 70);
              } else {
                setPreviousVolume(volume);
                setIsMuted(true);
              }
            }}
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
            className="w-24 h-1 bg-zinc-700 rounded-full cursor-pointer relative"
            ref={volumeBarRef}
            onClick={(e) => {
              const rect = volumeBarRef.current?.getBoundingClientRect();
              if (!rect) return;
              const clickX = e.clientX - rect.left;
              const percentage = (clickX / rect.width) * 100;
              setVolume(Math.max(MIN_VOLUME, Math.min(MAX_VOLUME, percentage)));
              if (isMuted) setIsMuted(false);
            }}
            onMouseDown={(e) => {
              setIsDraggingVolume(true);
              const rect = volumeBarRef.current?.getBoundingClientRect();
              if (!rect) return;
              const clickX = e.clientX - rect.left;
              const percentage = (clickX / rect.width) * 100;
              setVolume(Math.max(MIN_VOLUME, Math.min(MAX_VOLUME, percentage)));
              if (isMuted) setIsMuted(false);
            }}
          >
            <div
              className="absolute top-0 left-0 h-full bg-white rounded-full"
              style={{ width: `${isMuted ? 0 : volume}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
