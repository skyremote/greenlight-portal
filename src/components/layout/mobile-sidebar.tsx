"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Sidebar } from "./sidebar";
import { Button } from "@/components/ui/button";

interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function MobileSidebar({ open, onClose }: MobileSidebarProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop with blur */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sidebar panel */}
      <div className="absolute inset-y-0 left-0 w-[280px] shadow-2xl shadow-black/50 animate-in slide-in-from-left duration-200">
        <div className="absolute top-3 right-3 z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        <Sidebar onNavigate={onClose} />
      </div>
    </div>
  );
}
