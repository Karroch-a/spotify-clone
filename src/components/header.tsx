"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Home,
  Search,
  Download,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
  ChevronDown,
  User,
  Settings,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { LoginModal } from "@/components/login-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavButtonProps {
  icon: React.ReactNode;
  onClick?: () => void;
  isActive?: boolean;
  disabled?: boolean;
  className?: string;
}

function NavButton({
  icon,
  onClick,
  isActive,
  disabled,
  className = "",
}: NavButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      disabled={disabled}
      className={`w-8 h-8 rounded-full transition-all duration-200 ${
        isActive
          ? "bg-zinc-800 text-white"
          : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white"
      } ${
        disabled ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
      } ${className}`}
    >
      {icon}
    </Button>
  );
}

const navItems = [
  {
    label: "Premium",
    href: "/premium",
    className:
      "text-zinc-400 hover:text-white hover:scale-105 transition-all duration-200",
  },
  {
    label: "Support",
    href: "/support",
    className:
      "text-zinc-400 hover:text-white hover:scale-105 transition-all duration-200",
  },
  {
    label: "Download",
    href: "/download",
    className:
      "text-zinc-400 hover:text-white hover:scale-105 transition-all duration-200",
  },
];

interface UserMenuProps {
  user: any;
  onLogout: () => void;
}

function UserMenu({ user, onLogout }: UserMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 rounded-full px-2 py-1 h-8 transition-all duration-200"
        >
          <img
            src={user?.avatar || "/default-avatar.png"}
            alt={user?.name || "User"}
            className="w-6 h-6 rounded-full"
          />
          <span className="text-white text-sm font-medium hidden md:block max-w-24 truncate">
            {user?.name || "User"}
          </span>
          <ChevronDown className="w-4 h-4 text-zinc-400" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 bg-zinc-800 border-zinc-700 text-white"
      >
        <DropdownMenuLabel className="text-zinc-400">Account</DropdownMenuLabel>
        <DropdownMenuItem className="hover:bg-zinc-700 cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="hover:bg-zinc-700 cursor-pointer">
          <ExternalLink className="mr-2 h-4 w-4" />
          <span>Upgrade to Premium</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="hover:bg-zinc-700 cursor-pointer">
          <ExternalLink className="mr-2 h-4 w-4" />
          <span>Support</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="hover:bg-zinc-700 cursor-pointer">
          <Download className="mr-2 h-4 w-4" />
          <span>Download</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="hover:bg-zinc-700 cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-zinc-700" />
        <DropdownMenuItem
          onClick={onLogout}
          className="hover:bg-zinc-700 cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function LoadingSkeleton() {
  return (
    <div className="flex items-center gap-3 animate-pulse">
      <div className="w-8 h-8 bg-zinc-800 rounded-full" />
      <div className="w-16 h-4 bg-zinc-800 rounded hidden md:block" />
    </div>
  );
}

export function Header() {
  const { isLoggedIn, user, logout, isLoading } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const navigateHome = useCallback(() => {
    router.push("/");
  }, [router]);

  const goBack = useCallback(() => {
    router.back();
  }, [router]);

  const goForward = useCallback(() => {
    router.forward();
  }, [router]);

  const openLoginModal = useCallback(() => {
    setShowLoginModal(true);
  }, []);

  const closeLoginModal = useCallback(() => {
    setShowLoginModal(false);
  }, []);

  const isHomePage = useMemo(() => pathname === "/", [pathname]);
  const isSearchPage = useMemo(() => pathname === "/search", [pathname]);

  return (
    <>
      <header className="h-16 bg-black border-b border-zinc-800 flex items-center justify-between px-6 relative z-30">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-200"
              onClick={navigateHome}
            >
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 text-black fill-current"
              >
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
              </svg>
            </div>

            <div className="flex items-center gap-2">
              <NavButton
                icon={<ChevronLeft className="w-4 h-4" />}
                onClick={goBack}
                className="bg-zinc-900 hover:bg-zinc-800"
              />
              <NavButton
                icon={<ChevronRight className="w-4 h-4" />}
                onClick={goForward}
                className="bg-zinc-900 hover:bg-zinc-800"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <NavButton
              icon={<Home className="w-5 h-5" />}
              onClick={navigateHome}
              isActive={isHomePage}
            />
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <Button
              key={item.label}
              variant="ghost"
              className={`font-medium ${item.className}`}
            >
              {item.label}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {isLoading ? (
            <LoadingSkeleton />
          ) : !isLoggedIn ? (
            <>
              <Button
                variant="ghost"
                className="text-zinc-400 hover:text-white hover:scale-105 transition-all duration-200 hidden md:flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Install App
              </Button>
              <Button
                variant="ghost"
                className="text-zinc-400 hover:text-white hover:scale-105 transition-all duration-200 font-medium"
                onClick={openLoginModal}
              >
                Sign up
              </Button>
              <Button
                className="bg-white text-black hover:bg-gray-200 hover:scale-105 rounded-full px-8 py-2 font-bold transition-all duration-200"
                onClick={openLoginModal}
              >
                Log in
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                className="text-zinc-400 hover:text-white hover:scale-105 transition-all duration-200 hidden md:flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Install App
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 text-zinc-400 hover:text-white hover:scale-105 transition-all duration-200 hidden md:flex"
              >
                <Bell className="w-4 h-4" />
              </Button>

              <UserMenu user={user} onLogout={logout} />
            </>
          )}
        </div>
      </header>

      <LoginModal isOpen={showLoginModal} onClose={closeLoginModal} />
    </>
  );
}
