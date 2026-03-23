"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useTheme } from "@/components/providers/theme-provider";
import { useAuth } from "@/components/providers/auth-provider";
import {
  MessageCircle,
  X,
  Send,
  Loader2,
  Bot,
  User,
  Trash2,
} from "lucide-react";

interface ChatMessage {
  role: string;
  content: string;
}

const STORAGE_KEY = "greenlight_chat_history";

export function ChatWidget() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const userId = user?._id;

  // Live data from Convex for AI context
  const coachees = useQuery(api.coachees.list, userId ? { userId: userId as any } : "skip");
  const allActions = useQuery(api.actions.listByUser, userId ? { userId: userId as any } : "skip");
  const speakers = useQuery(api.speakers.list, userId ? { userId: userId as any } : "skip");

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setMessages(JSON.parse(saved));
    } catch {}
    setMounted(true);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages, mounted]);

  // Try to sync with Convex if available — upgrade path for when mate deploys
  const [convexReady, setConvexReady] = useState(false);
  useEffect(() => {
    if (!userId) return;
    // Test if chat functions exist by doing a fetch
    fetch(`${process.env.NEXT_PUBLIC_CONVEX_URL}/api/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: "chat:list", args: { userId } }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.status === "success") {
          setConvexReady(true);
          // Load messages from Convex if we have none locally
          if (d.value?.length > 0 && messages.length === 0) {
            const convexMsgs = d.value.map((m: any) => ({ role: m.role, content: m.content }));
            setMessages(convexMsgs);
          }
        }
      })
      .catch(() => {});
  }, [userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  function buildContext() {
    const coacheeMap = new Map<string, string>();
    if (coachees) {
      for (const c of coachees) coacheeMap.set(c._id, c.name);
    }
    return {
      coachees: coachees || [],
      actions: allActions?.map((a: any) => ({ ...a, coacheeName: coacheeMap.get(a.coacheeId) || "Unknown" })) || [],
      speakers: speakers || [],
    };
  }

  // Save to Convex in background (fire-and-forget)
  function saveToConvex(role: string, content: string) {
    if (!convexReady || !userId) return;
    fetch(`${process.env.NEXT_PUBLIC_CONVEX_URL}/api/mutation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: "chat:send", args: { userId, role, content } }),
    }).catch(() => {});
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = { role: "user", content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);

    saveToConvex("user", text);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated, context: buildContext() }),
      });
      const data = await res.json();
      const reply = data.error ? `Error: ${data.error}` : data.reply;
      setMessages([...updated, { role: "assistant", content: reply }]);
      saveToConvex("assistant", reply);
    } catch {
      const errMsg = "Network error. Please try again.";
      setMessages([...updated, { role: "assistant", content: errMsg }]);
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
    if (convexReady && userId) {
      fetch(`${process.env.NEXT_PUBLIC_CONVEX_URL}/api/mutation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: "chat:clear", args: { userId } }),
      }).catch(() => {});
    }
  }

  if (!mounted) return null;

  const pendingCount = allActions?.filter((a: any) => !a.done).length ?? 0;
  const coacheeCount = coachees?.length ?? 0;

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-105 active:scale-95 animate-fade-in safe-bottom"
          style={{
            background: `linear-gradient(135deg, ${colors.preview}, ${colors.preview}cc)`,
            boxShadow: `0 4px 24px ${colors.preview}40, 0 0 48px ${colors.preview}15`,
          }}
        >
          <MessageCircle className="w-6 h-6" />
          {messages.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {messages.filter((m) => m.role === "assistant").length}
            </span>
          )}
        </button>
      )}

      {open && (
        <div
          className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-50 w-full sm:w-[400px] sm:max-w-[calc(100vw-2rem)] h-[100dvh] sm:h-[580px] sm:max-h-[calc(100vh-4rem)] sm:rounded-2xl flex flex-col overflow-hidden animate-scale-in"
          style={{
            background: "rgba(14, 14, 14, 0.95)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: `1px solid rgba(${colors.accentRgb}, 0.15)`,
            boxShadow: `0 8px 48px rgba(0,0,0,0.5), 0 0 48px ${colors.preview}10`,
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 shrink-0"
            style={{
              borderBottom: `1px solid rgba(${colors.accentRgb}, 0.12)`,
              background: `linear-gradient(135deg, rgba(${colors.accentRgb}, 0.08), transparent)`,
            }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: `rgba(${colors.accentRgb}, 0.15)` }}
              >
                <Bot className="w-4 h-4" style={{ color: colors.preview }} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-100">Greenlight AI</p>
                <p className="text-[10px] text-gray-500">
                  {coacheeCount} coachees &middot; {pendingCount} pending actions
                  {convexReady && " · synced"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button
                  onClick={handleClear}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-red-400 hover:bg-white/[0.04] transition-all"
                  title="Clear history"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-200 hover:bg-white/[0.04] transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.length === 0 && !loading && (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: `rgba(${colors.accentRgb}, 0.1)` }}
                >
                  <Bot className="w-6 h-6" style={{ color: colors.preview }} />
                </div>
                <p className="text-sm font-medium text-gray-300 mb-1">Hi, I'm Greenlight AI</p>
                <p className="text-xs text-gray-500 max-w-[280px]">
                  I know your {coacheeCount} coachees and their {pendingCount} pending
                  actions. Ask me anything about your coaching programme.
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {[
                    "Who needs attention?",
                    "Prep a GROW session",
                    "Summarise pending actions",
                    "Draft a meeting recap",
                    "Suggest speaker topics",
                  ].map((s) => (
                    <button
                      key={s}
                      onClick={() => { setInput(s); inputRef.current?.focus(); }}
                      className="text-[11px] px-3 py-1.5 rounded-full border text-gray-400 hover:text-gray-200 transition-all hover:scale-[1.02]"
                      style={{
                        borderColor: `rgba(${colors.accentRgb}, 0.2)`,
                        background: `rgba(${colors.accentRgb}, 0.04)`,
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: `rgba(${colors.accentRgb}, 0.12)` }}>
                    <Bot className="w-3.5 h-3.5" style={{ color: colors.preview }} />
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                    msg.role === "user"
                      ? "text-white rounded-br-sm"
                      : "bg-white/[0.04] text-gray-200 border border-white/[0.06] rounded-bl-sm"
                  }`}
                  style={msg.role === "user" ? { background: `linear-gradient(135deg, ${colors.preview}, ${colors.preview}bb)` } : undefined}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>
                {msg.role === "user" && (
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 bg-white/[0.06]">
                    <User className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: `rgba(${colors.accentRgb}, 0.12)` }}>
                  <Bot className="w-3.5 h-3.5" style={{ color: colors.preview }} />
                </div>
                <div className="bg-white/[0.04] border border-white/[0.06] rounded-xl rounded-bl-sm px-4 py-3">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: colors.preview, animationDelay: "0ms" }} />
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: colors.preview, animationDelay: "150ms" }} />
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: colors.preview, animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="px-3 py-3 shrink-0" style={{ borderTop: `1px solid rgba(${colors.accentRgb}, 0.08)` }}>
            <div
              className="flex items-center gap-2 rounded-xl px-3 py-1.5 transition-all"
              style={{ background: "rgba(255,255,255,0.03)", border: `1px solid rgba(${colors.accentRgb}, 0.1)` }}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your coachees, actions, prep..."
                disabled={loading}
                className="flex-1 bg-transparent text-sm text-gray-200 placeholder:text-gray-600 outline-none disabled:opacity-50 py-1.5"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30 hover:scale-105 active:scale-95"
                style={{ background: input.trim() ? `rgba(${colors.accentRgb}, 0.2)` : "transparent", color: colors.preview }}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
