"use client";

import { useTheme, themes, ThemeKey } from "@/components/providers/theme-provider";
import { Palette } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const themeKeys: ThemeKey[] = ["greenlight", "midnight", "ember", "ocean", "violet"];

export function ThemePicker() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center w-9 h-9 rounded-md text-gray-400 hover:text-gray-200 hover:bg-white/[0.06] transition-all duration-200"
        title="Change theme"
      >
        <Palette className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-[#141414]/95 backdrop-blur-xl border border-white/[0.08] shadow-2xl shadow-black/50 p-2 animate-scale-in z-50">
          <p className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold px-2 py-1.5">
            Colour Scheme
          </p>
          {themeKeys.map((key) => {
            const t = themes[key];
            const active = theme === key;
            return (
              <button
                key={key}
                onClick={() => {
                  setTheme(key);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg text-sm transition-all duration-200 ${
                  active
                    ? "bg-white/[0.08] text-gray-100"
                    : "text-gray-400 hover:bg-white/[0.04] hover:text-gray-200"
                }`}
              >
                <div
                  className="w-5 h-5 rounded-full shrink-0 ring-2 transition-all duration-200"
                  style={{
                    backgroundColor: t.preview,
                    boxShadow: active ? `0 0 12px ${t.preview}40` : "none",
                    ringColor: active ? t.preview : "transparent",
                  }}
                />
                <span className="flex-1 text-left">{t.name}</span>
                {active && (
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: t.preview }} />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
