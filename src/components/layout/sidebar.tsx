"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "./logo";
import { useAuth } from "@/components/providers/auth-provider";
import { initials, avatarColor } from "@/lib/utils";
import {
  LayoutDashboard,
  Mic2,
  Columns3,
  Plus,
  LogOut,
} from "lucide-react";

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const userId = user?._id;

  const coachees = useQuery(
    api.coachees.list,
    userId ? { userId: userId as any } : "skip"
  );

  const allActions = useQuery(
    api.actions.listByUser,
    userId ? { userId: userId as any } : "skip"
  );

  const navigate = (path: string) => {
    router.push(path);
    onNavigate?.();
  };

  const isActive = (path: string) => pathname === path;
  const isCoacheeActive = (id: string) =>
    pathname.startsWith(`/coachee/${id}`);

  // Count pending actions per coachee
  const pendingByCoachee = new Map<string, number>();
  if (allActions) {
    for (const action of allActions) {
      if (!action.done) {
        const count = pendingByCoachee.get(action.coacheeId) || 0;
        pendingByCoachee.set(action.coacheeId, count + 1);
      }
    }
  }

  const sortedCoachees = coachees
    ? [...coachees].sort((a, b) => a.order - b.order)
    : [];

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="flex flex-col h-full bg-[#0D3B1A] text-gray-200">
      {/* Logo */}
      <div className="p-5 border-b border-green-900/50">
        <Logo />
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        {/* Dashboard */}
        <button
          onClick={() => navigate("/dashboard")}
          className={`w-full flex items-center gap-3 px-5 py-2.5 text-sm transition-colors ${
            isActive("/dashboard")
              ? "bg-green-900/40 text-green-300 border-l-3 border-green-400"
              : "text-gray-300 hover:bg-green-900/20 hover:text-gray-100 border-l-3 border-transparent"
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          Dashboard
        </button>

        {/* Coachees Section */}
        <div className="mt-6">
          <div className="px-5 mb-2">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-green-500/60">
              Coachees
            </span>
          </div>

          <div className="space-y-0.5">
            {sortedCoachees.map((coachee, idx) => {
              const pending = pendingByCoachee.get(coachee._id) || 0;
              const active = isCoacheeActive(coachee._id);

              return (
                <button
                  key={coachee._id}
                  onClick={() => navigate(`/coachee/${coachee._id}`)}
                  className={`w-full flex items-center gap-3 px-5 py-2 text-sm transition-colors ${
                    active
                      ? "bg-green-900/40 text-green-300 border-l-3 border-green-400"
                      : "text-gray-300 hover:bg-green-900/20 hover:text-gray-100 border-l-3 border-transparent"
                  }`}
                >
                  {/* Avatar */}
                  {coachee.photo ? (
                    <img
                      src={coachee.photo}
                      alt={coachee.name}
                      className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                      style={{ backgroundColor: avatarColor(idx) }}
                    >
                      {initials(coachee.name)}
                    </div>
                  )}

                  <span className="truncate flex-1 text-left">
                    {coachee.name}
                  </span>

                  {pending > 0 && (
                    <span className="bg-green-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                      {pending}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Add Person Button */}
          <button
            onClick={() => navigate("/dashboard?add=true")}
            className="w-full flex items-center gap-3 px-5 py-2.5 mt-1 text-sm text-green-400/70 hover:text-green-300 transition-colors border-l-3 border-transparent"
          >
            <div className="w-7 h-7 rounded-full border-2 border-dashed border-green-500/40 flex items-center justify-center">
              <Plus className="w-3.5 h-3.5" />
            </div>
            <span>Add Person</span>
          </button>
        </div>

        {/* Resources Section */}
        <div className="mt-6">
          <div className="px-5 mb-2">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-green-500/60">
              Resources
            </span>
          </div>

          <button
            onClick={() => navigate("/speakers")}
            className={`w-full flex items-center gap-3 px-5 py-2.5 text-sm transition-colors ${
              pathname.startsWith("/speakers")
                ? "bg-green-900/40 text-green-300 border-l-3 border-green-400"
                : "text-gray-300 hover:bg-green-900/20 hover:text-gray-100 border-l-3 border-transparent"
            }`}
          >
            <Mic2 className="w-4 h-4" />
            Speaker Notes
          </button>

          <button
            onClick={() => navigate("/kanban")}
            className={`w-full flex items-center gap-3 px-5 py-2.5 text-sm transition-colors ${
              pathname.startsWith("/kanban")
                ? "bg-green-900/40 text-green-300 border-l-3 border-green-400"
                : "text-gray-300 hover:bg-green-900/20 hover:text-gray-100 border-l-3 border-transparent"
            }`}
          >
            <Columns3 className="w-4 h-4" />
            Kanban Board
          </button>
        </div>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-green-900/50">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-400 hover:text-gray-200 transition-colors rounded-lg hover:bg-green-900/20"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
