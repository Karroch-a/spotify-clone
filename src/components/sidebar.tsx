"use client";

import { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Library, ExternalLink, Music, Heart } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Tooltip } from "@/components/ui/tooltip";

interface PlaylistItemProps {
  id: string;
  name: string;
  description?: string;
  onClick: (id: string) => void;
  isLikedSongs?: boolean;
  songCount?: number;
  isCollapsed?: boolean;
}

function PlaylistItem({
  id,
  name,
  description,
  onClick,
  isLikedSongs = false,
  songCount,
  isCollapsed = false,
}: PlaylistItemProps) {
  const handleClick = useCallback(() => {
    onClick(id);
  }, [id, onClick]);

  if (isCollapsed) {
    return (
      <Tooltip content={name}>
        <div
          className="flex items-center justify-center p-2 rounded-md hover:bg-zinc-800/50 cursor-pointer group transition-colors duration-200"
          onClick={handleClick}
        >
          <div
            className={`w-12 h-12 rounded flex items-center justify-center flex-shrink-0 ${
              isLikedSongs
                ? "bg-gradient-to-br from-purple-700 to-blue-300"
                : "bg-zinc-700"
            }`}
          >
            {isLikedSongs ? (
              <Heart className="w-6 h-6 text-white fill-current" />
            ) : (
              <Music className="w-6 h-6 text-zinc-400" />
            )}
          </div>
        </div>
      </Tooltip>
    );
  }

  return (
    <div
      className="flex items-center gap-3 p-2 rounded-md hover:bg-zinc-800/50 cursor-pointer group transition-colors duration-200"
      onClick={handleClick}
    >
      <div
        className={`w-12 h-12 rounded flex items-center justify-center flex-shrink-0 ${
          isLikedSongs
            ? "bg-gradient-to-br from-purple-700 to-blue-300"
            : "bg-zinc-700"
        }`}
      >
        {isLikedSongs ? (
          <Heart className="w-6 h-6 text-white fill-current" />
        ) : (
          <Music className="w-6 h-6 text-zinc-400" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-white font-medium text-sm truncate hover:underline">
          {name}
        </h4>
        <p className="text-zinc-400 text-xs truncate">
          {isLikedSongs ? `${songCount} songs` : description || "Playlist"}
        </p>
      </div>
    </div>
  );
}

function PlaylistSkeleton({ isCollapsed = false }) {
  if (isCollapsed) {
    return (
      <div className="flex items-center justify-center p-2 animate-pulse">
        <div className="w-12 h-12 bg-zinc-700 rounded flex-shrink-0" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 p-2 animate-pulse">
      <div className="w-12 h-12 bg-zinc-700 rounded flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="h-4 bg-zinc-700 rounded w-3/4 mb-1" />
        <div className="h-3 bg-zinc-700 rounded w-1/2" />
      </div>
    </div>
  );
}

function CreatePlaylistCard({
  title,
  description,
  buttonText,
  onButtonClick,
  isCollapsed = false,
}: {
  title: string;
  description: string;
  buttonText: string;
  onButtonClick?: () => void;
  isCollapsed?: boolean;
}) {
  if (isCollapsed) {
    return null;
  }

  return (
    <div className="bg-zinc-900 p-4 rounded-lg">
      <h3 className="text-white font-bold text-base mb-2">{title}</h3>
      <p className="text-zinc-400 text-sm mb-4 leading-relaxed">
        {description}
      </p>
      <Button
        className="bg-white text-black hover:bg-gray-200 hover:scale-105 rounded-full px-6 py-2 font-medium transition-all duration-200"
        onClick={onButtonClick}
      >
        {buttonText}
      </Button>
    </div>
  );
}

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLibraryHovered, setIsLibraryHovered] = useState(false);
  const { isLoggedIn, userPlaylists, likedSongs, isLoading } = useAuth();
  const router = useRouter();

  const navigateToPlaylist = useCallback(
    (playlistId: string) => {
      router.push(`/playlist/${playlistId}`);
    },
    [router]
  );

  const handleCreatePlaylist = useCallback(() => {
    console.log("Create playlist clicked");
  }, []);

  const handleBrowsePodcasts = useCallback(() => {
    console.log("Browse podcasts clicked");
  }, []);

  const visiblePlaylists = useMemo(() => {
    return userPlaylists.filter((playlist) => playlist.id !== "liked-songs");
  }, [userPlaylists]);

  const showCreatePlaylistSection = useMemo(() => {
    return !isLoggedIn || userPlaylists.length === 0;
  }, [isLoggedIn, userPlaylists.length]);

  const toggleSidebar = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  return (
    <div
      className={cn(
        "bg-black border-r border-zinc-800 flex flex-col h-full transition-all duration-300",
        isCollapsed ? "w-20" : "w-80"
      )}
    >
      <div
        className={cn("border-b border-zinc-800", isCollapsed ? "p-3" : "p-6")}
      >
        <div className="flex items-center justify-between mb-2">
          {isCollapsed ? (
            <div
              className="relative"
              onMouseEnter={() => setIsLibraryHovered(true)}
              onMouseLeave={() => setIsLibraryHovered(false)}
            >
              <div
                className="flex items-center justify-center cursor-pointer p-2 rounded-md hover:bg-zinc-800/50"
                onClick={toggleSidebar}
              >
                <Library className="w-6 h-6 text-zinc-400 hover:text-white transition-colors" />
              </div>
              {isLibraryHovered && (
                <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-zinc-800 text-white text-sm py-1 px-3 rounded-md whitespace-nowrap z-50">
                  Open Your Library
                </div>
              )}
            </div>
          ) : (
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={toggleSidebar}
            >
              <Library className="w-6 h-6 text-zinc-400 hover:text-white transition-colors" />
              <span className="text-lg font-semibold text-white">
                Your Library
              </span>
            </div>
          )}

          {!isCollapsed && (
            <Tooltip content="Create playlist">
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 text-zinc-400 hover:text-white hover:bg-zinc-800 hover:scale-105 transition-all duration-200"
                onClick={handleCreatePlaylist}
              >
                <Plus className="w-5 h-5" />
              </Button>
            </Tooltip>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className={cn("space-y-3", isCollapsed ? "px-3 py-4" : "p-6")}>
            {[...Array(5)].map((_, i) => (
              <PlaylistSkeleton key={i} isCollapsed={isCollapsed} />
            ))}
          </div>
        ) : (
          <>
            {isLoggedIn &&
              (userPlaylists.length > 0 || likedSongs.length > 0) && (
                <div
                  className={cn(
                    "border-b border-zinc-800",
                    isCollapsed ? "px-3 py-4" : "p-6"
                  )}
                >
                  <div className="space-y-2">
                    {likedSongs.length > 0 && (
                      <PlaylistItem
                        id="liked-songs"
                        name="Liked Songs"
                        onClick={navigateToPlaylist}
                        isLikedSongs={true}
                        songCount={likedSongs.length}
                        isCollapsed={isCollapsed}
                      />
                    )}

                    {visiblePlaylists.map((playlist) => (
                      <PlaylistItem
                        key={playlist.id}
                        id={playlist.id}
                        name={playlist.name}
                        description={playlist.description}
                        onClick={navigateToPlaylist}
                        isCollapsed={isCollapsed}
                      />
                    ))}
                  </div>
                </div>
              )}

            {showCreatePlaylistSection && (
              <div
                className={cn(
                  "border-b border-zinc-800",
                  isCollapsed ? "px-3 py-4" : "p-6"
                )}
              >
                <CreatePlaylistCard
                  title="Create your first playlist"
                  description="It's easy, we'll help you"
                  buttonText="Create playlist"
                  onButtonClick={handleCreatePlaylist}
                  isCollapsed={isCollapsed}
                />
              </div>
            )}

            <div
              className={cn(
                "border-b border-zinc-800",
                isCollapsed ? "px-3 py-4" : "p-6"
              )}
            >
              <CreatePlaylistCard
                title="Let's find some podcasts to follow"
                description="We'll keep you updated on new episodes"
                buttonText="Browse podcasts"
                onButtonClick={handleBrowsePodcasts}
                isCollapsed={isCollapsed}
              />
            </div>
          </>
        )}
      </div>

      {!isCollapsed && (
        <div className="p-6 border-t border-zinc-800">
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-zinc-400 mb-6">
            {[
              "Legal",
              "Privacy Center",
              "Privacy Policy",
              "Cookies",
              "About Ads",
              "Accessibility",
            ].map((link) => (
              <Link
                key={link}
                href="#"
                className="hover:text-white hover:underline transition-colors duration-200"
              >
                {link}
              </Link>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            className="border-zinc-700 text-white hover:border-white hover:bg-zinc-800 hover:scale-105 transition-all duration-200"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            English
          </Button>
        </div>
      )}
    </div>
  );
}
