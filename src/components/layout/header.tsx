"use client";

import { usePathname } from "next/navigation";
import { Menu, KeyRound, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  title?: string;
  onMenuClick?: () => void;
}

function getTitleFromPath(pathname: string): string {
  if (pathname === "/dashboard") return "Dashboard";
  if (pathname.startsWith("/coachee/")) return "Coachee Profile";
  if (pathname.startsWith("/speakers")) return "Speaker Notes";
  if (pathname.startsWith("/kanban")) return "Kanban Board";
  if (pathname.startsWith("/settings")) return "Settings";
  return "Dashboard";
}

export function Header({ title, onMenuClick }: HeaderProps) {
  const pathname = usePathname();
  const pageTitle = title || getTitleFromPath(pathname);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-4 md:px-6 bg-[#222] border-b border-[#333]">
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-gray-400 hover:text-gray-200"
          onClick={onMenuClick}
        >
          <Menu className="w-5 h-5" />
        </Button>

        <h1 className="text-lg font-heading font-semibold text-gray-100">
          {pageTitle}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-gray-200"
          title="API Key Settings"
        >
          <KeyRound className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}
