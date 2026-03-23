"use client";

import { useTheme } from "@/components/providers/theme-provider";

export function Logo({ compact = false }: { compact?: boolean }) {
  // Safe fallback when used outside ThemeProvider (e.g. loading screen)
  let preview = "#22c55e";
  try {
    const { colors } = useTheme();
    preview = colors.preview;
  } catch {
    // Outside provider, use default green
  }

  return (
    <div className="flex items-center gap-3">
      <div className="relative w-10 h-10 flex-shrink-0 group">
        <div
          className="absolute inset-0 rounded-full opacity-15 transition-opacity duration-500 group-hover:opacity-25"
          style={{ backgroundColor: preview }}
        />
        <div
          className="absolute inset-1.5 rounded-full opacity-30 transition-opacity duration-500 group-hover:opacity-45"
          style={{ backgroundColor: preview }}
        />
        <div
          className="absolute inset-3 rounded-full transition-shadow duration-500"
          style={{
            backgroundColor: preview,
            boxShadow: `0 1px 3px ${preview}4d`,
          }}
        />
      </div>

      {!compact && (
        <div className="flex flex-col">
          <span className="font-heading text-xl font-semibold text-gray-100 leading-tight">
            Greenlight
          </span>
          <span
            className="text-[11px] tracking-wider uppercase leading-tight opacity-70"
            style={{ color: preview }}
          >
            Coaching Portal
          </span>
        </div>
      )}
    </div>
  );
}
