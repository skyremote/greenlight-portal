"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "./logo";
import { useAuth } from "@/components/providers/auth-provider";
import { useTheme } from "@/components/providers/theme-provider";
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
  const { colors } = useTheme();

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

  const activeStyle = {
    backgroundColor: colors.sidebarActive,
  };

  const hoverBg = colors.sidebarHover;

  return (
    <div
      className="flex flex-col h-full text-gray-200 backdrop-blur-xl"
      style={{ background: colors.sidebarBg }}
    >
      {/* Logo */}
      <div className="p-5" style={{ borderBottom: `1px solid rgba(${colors.accentRgb}, 0.15)` }}>
        <Logo />
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <button
          onClick={() => navigate("/dashboard")}
          style={isActive("/dashboard") ? activeStyle : undefined}
          className={`w-full flex items-center gap-3 px-5 py-2.5 text-sm transition-all duration-200 ${
            isActive("/dashboard")
              ? `${colors.accent} nav-active-indicator`
              : "text-gray-300 hover:text-gray-100 hover:translate-x-0.5"
          }`}
          onMouseEnter={(e) => {
            if (!isActive("/dashboard")) e.currentTarget.style.backgroundColor = hoverBg;
          }}
          onMouseLeave={(e) => {
            if (!isActive("/dashboard")) e.currentTarget.style.backgroundColor = "";
          }}
        >
          <LayoutDashboard className="w-4 h-4" />
          Dashboard
        </button>

        {/* Coachees Section */}
        <div className="mt-6">
          <div className="px-5 mb-2 flex items-center gap-3">
            <span
              className="text-[10px] font-semibold uppercase tracking-widest"
              style={{ color: colors.sidebarSection }}
            >
              Coachees
            </span>
            <div
              className="flex-1 h-px"
              style={{ background: `linear-gradient(90deg, transparent, rgba(${colors.accentRgb}, 0.15), transparent)` }}
            />
          </div>

          <div className="space-y-0.5">
            {sortedCoachees.map((coachee, idx) => {
              const pending = pendingByCoachee.get(coachee._id) || 0;
              const active = isCoacheeActive(coachee._id);

              return (
                <button
                  key={coachee._id}
                  onClick={() => navigate(`/coachee/${coachee._id}`)}
                  style={active ? activeStyle : undefined}
                  className={`w-full flex items-center gap-3 px-5 py-2 text-sm transition-all duration-200 ${
                    active
                      ? `${colors.accent} nav-active-indicator`
                      : "text-gray-300 hover:text-gray-100 hover:translate-x-0.5"
                  }`}
                  onMouseEnter={(e) => {
                    if (!active) e.currentTarget.style.backgroundColor = hoverBg;
                  }}
                  onMouseLeave={(e) => {
                    if (!active) e.currentTarget.style.backgroundColor = "";
                  }}
                >
                  {coachee.photo ? (
                    <img
                      src={coachee.photo}
                      alt={coachee.name}
                      className="w-7 h-7 rounded-full object-cover flex-shrink-0 ring-1 ring-white/10"
                    />
                  ) : (
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 ring-1 ring-white/10"
                      style={{ backgroundColor: avatarColor(idx) }}
                    >
                      {initials(coachee.name)}
                    </div>
                  )}

                  <span className="truncate flex-1 text-left">
                    {coachee.name}
                  </span>

                  {pending > 0 && (
                    <span
                      className={`${colors.badge} text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0`}
                      style={{ boxShadow: `0 2px 8px rgba(${colors.accentRgb}, 0.3)` }}
                    >
                      {pending}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => navigate("/dashboard?add=true")}
            className={`w-full flex items-center gap-3 px-5 py-2.5 mt-1 text-sm ${colors.accentMuted} hover:${colors.accentHover} transition-all duration-200 hover:translate-x-0.5`}
          >
            <div
              className="w-7 h-7 rounded-full border-2 border-dashed flex items-center justify-center transition-colors"
              style={{ borderColor: `rgba(${colors.accentRgb}, 0.3)` }}
            >
              <Plus className="w-3.5 h-3.5" />
            </div>
            <span>Add Person</span>
          </button>
        </div>

        {/* Resources Section */}
        <div className="mt-6">
          <div className="px-5 mb-2 flex items-center gap-3">
            <span
              className="text-[10px] font-semibold uppercase tracking-widest"
              style={{ color: colors.sidebarSection }}
            >
              Resources
            </span>
            <div
              className="flex-1 h-px"
              style={{ background: `linear-gradient(90deg, transparent, rgba(${colors.accentRgb}, 0.15), transparent)` }}
            />
          </div>

          <button
            onClick={() => navigate("/speakers")}
            style={pathname.startsWith("/speakers") ? activeStyle : undefined}
            className={`w-full flex items-center gap-3 px-5 py-2.5 text-sm transition-all duration-200 ${
              pathname.startsWith("/speakers")
                ? `${colors.accent} nav-active-indicator`
                : "text-gray-300 hover:text-gray-100 hover:translate-x-0.5"
            }`}
            onMouseEnter={(e) => {
              if (!pathname.startsWith("/speakers")) e.currentTarget.style.backgroundColor = hoverBg;
            }}
            onMouseLeave={(e) => {
              if (!pathname.startsWith("/speakers")) e.currentTarget.style.backgroundColor = "";
            }}
          >
            <Mic2 className="w-4 h-4" />
            Speaker Notes
          </button>

          <button
            onClick={() => navigate("/kanban")}
            style={pathname.startsWith("/kanban") ? activeStyle : undefined}
            className={`w-full flex items-center gap-3 px-5 py-2.5 text-sm transition-all duration-200 ${
              pathname.startsWith("/kanban")
                ? `${colors.accent} nav-active-indicator`
                : "text-gray-300 hover:text-gray-100 hover:translate-x-0.5"
            }`}
            onMouseEnter={(e) => {
              if (!pathname.startsWith("/kanban")) e.currentTarget.style.backgroundColor = hoverBg;
            }}
            onMouseLeave={(e) => {
              if (!pathname.startsWith("/kanban")) e.currentTarget.style.backgroundColor = "";
            }}
          >
            <Columns3 className="w-4 h-4" />
            Kanban Board
          </button>
        </div>
      </div>

      {/* Logout */}
      <div className="p-4" style={{ borderTop: `1px solid rgba(${colors.accentRgb}, 0.15)` }}>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-400 hover:text-gray-200 transition-all duration-200 rounded-lg hover:bg-white/[0.04]"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
