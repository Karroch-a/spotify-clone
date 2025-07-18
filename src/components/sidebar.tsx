"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Library,
  ExternalLink,
  Music,
  Heart,
  X,
  Menu,
  Download,
} from "lucide-react";
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

export interface SidebarProps {
  isMobile?: boolean;
}

export function Sidebar({ isMobile = false }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLibraryHovered, setIsLibraryHovered] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isLoggedIn, userPlaylists, likedSongs, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(true);
    }
  }, [isMobile]);

  const navigateToPlaylist = useCallback(
    (playlistId: string) => {
      router.push(`/playlist/${playlistId}`);
      if (isMobile) {
        setIsMobileMenuOpen(false);
      }
    },
    [router, isMobile]
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

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  if (isMobile) {
    return (
      <>
        <Button
          variant="ghost"
          size="icon"
          className="fixed bottom-20 left-4 z-50 bg-green-500 text-black rounded-full shadow-lg md:hidden"
          onClick={toggleMobileMenu}
        >
          <Menu className="w-6 h-6" />
        </Button>

        <div
          className={cn(
            "fixed inset-y-0 left-0 z-40 bg-black w-80 transform transition-transform duration-300 ease-in-out md:hidden",
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex justify-between items-center p-4 border-b border-zinc-800">
            <h2 className="text-white text-lg font-bold">Your Library</h2>
            <Button
              variant="ghost"
              size="icon"
              className="text-zinc-400"
              onClick={toggleMobileMenu}
            >
              <X className="w-6 h-6" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-2">
              {isLoggedIn && (
                <div
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-zinc-800/50 cursor-pointer"
                  onClick={() => navigateToPlaylist("liked-songs")}
                >
                  <div className="w-12 h-12 rounded bg-gradient-to-br from-purple-700 to-blue-300 flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white fill-current" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium text-sm">
                      Liked Songs
                    </h4>
                    <p className="text-zinc-400 text-xs">
                      {likedSongs.length} songs
                    </p>
                  </div>
                </div>
              )}

              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <PlaylistSkeleton key={i} isCollapsed={false} />
                ))
              ) : (
                <>
                  {visiblePlaylists.map((playlist) => (
                    <PlaylistItem
                      key={playlist.id}
                      id={playlist.id}
                      name={playlist.name}
                      description={playlist.description}
                      onClick={navigateToPlaylist}
                      isCollapsed={false}
                    />
                  ))}
                </>
              )}
            </div>

            {showCreatePlaylistSection && (
              <div className="p-4">
                <CreatePlaylistCard
                  title="Create your first playlist"
                  description="It's easy, we'll help you"
                  buttonText="Create playlist"
                  onButtonClick={handleCreatePlaylist}
                  isCollapsed={false}
                />
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

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
                <div className="absolute left-full ml-2 px-3 py-1.5 bg-zinc-800 rounded text-sm text-white whitespace-nowrap">
                  Expand Your Library
                </div>
              )}
            </div>
          ) : (
            <>
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={toggleSidebar}
              >
                <Library className="w-6 h-6 text-zinc-400" />
                <span className="text-white font-bold">Your Library</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-full"
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>
            </>
          )}
        </div>

        {!isCollapsed && (
          <div className="flex flex-wrap gap-2 mt-4">
            <Button
              variant="secondary"
              className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs rounded-full h-7 px-3"
            >
              Playlists
            </Button>
            <Button
              variant="secondary"
              className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs rounded-full h-7 px-3"
            >
              Artists
            </Button>
            <Button
              variant="secondary"
              className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs rounded-full h-7 px-3"
            >
              Albums
            </Button>
          </div>
        )}
      </div>

      <div
        className={cn(
          "flex-1 overflow-y-auto scrollbar-hide",
          isCollapsed ? "p-2" : "p-2"
        )}
      >
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <PlaylistSkeleton key={i} isCollapsed={isCollapsed} />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {isLoggedIn && (
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
        )}

        {showCreatePlaylistSection && !isLoading && (
          <div className="mt-4">
            <CreatePlaylistCard
              title="Create your first playlist"
              description="It's easy, we'll help you"
              buttonText="Create playlist"
              onButtonClick={handleCreatePlaylist}
              isCollapsed={isCollapsed}
            />

            <CreatePlaylistCard
              title="Browse podcasts"
              description="We'll keep you updated on new episodes"
              buttonText="Browse podcasts"
              onButtonClick={handleBrowsePodcasts}
              isCollapsed={isCollapsed}
            />
          </div>
        )}
      </div>

      {!isCollapsed && isLoggedIn && (
        <div className="p-6 border-t border-zinc-800">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              className="text-zinc-400 hover:text-white text-sm flex items-center gap-2"
              asChild
            >
              <Link href="/download">
                <Download className="w-5 h-5" />
                <span>Install App</span>
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
