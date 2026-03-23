"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useAuth } from "@/components/providers/auth-provider";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const userId = user?._id;

  const coachees = useQuery(api.coachees.list, userId ? { userId: userId as any } : "skip");
  const allActions = useQuery(api.actions.listByUser, userId ? { userId: userId as any } : "skip");
  const speakers = useQuery(api.speakers.list, userId ? { userId: userId as any } : "skip");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-green-500 border-t-transparent" />
      </div>
    );
  }

  const activeCoachees = coachees?.length ?? 0;
  const pendingActions = allActions?.filter((a: any) => !a.done).length ?? 0;
  const completedActions = allActions?.filter((a: any) => a.done).length ?? 0;
  const totalSpeakers = speakers?.length ?? 0;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-100 mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        Dashboard
      </h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Active Coachees" value={activeCoachees} sub="People in programme" color="#388E3C" />
        <StatCard label="Completed Actions" value={completedActions} sub="Items done" color="#1565C0" />
        <StatCard label="Pending Actions" value={pendingActions} sub="Awaiting completion" color="#DAA520" />
        <StatCard label="Speakers" value={totalSpeakers} sub="Guest speakers tracked" color="#C62828" />
      </div>

      {/* Coachee List */}
      <div className="bg-[#2A2A2A] border border-[#333] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#333]">
          <h2 className="text-lg font-semibold text-gray-100" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Your Coachees
          </h2>
        </div>
        <div className="p-4">
          {!coachees ? (
            <p className="text-gray-500 text-center py-8">Loading...</p>
          ) : coachees.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No coachees yet. They will appear after registration completes.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {coachees.map((c: any) => (
                <a key={c._id} href={`/coachee/${c._id}`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#333] transition">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                    style={{ background: c.photo ? undefined : '#1B5E20' }}>
                    {c.photo ? <img src={c.photo} className="w-10 h-10 rounded-full object-cover" /> : c.name?.split(' ').map((w: string) => w[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-200">{c.name}</div>
                    <div className="text-xs text-gray-500">{c.jobTitle}{c.company ? ` at ${c.company}` : ''}</div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, color }: { label: string; value: number; sub: string; color: string }) {
  return (
    <div className="bg-[#2A2A2A] border border-[#333] rounded-xl p-5 relative overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: color }} />
      <div className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold mb-2">{label}</div>
      <div className="text-3xl font-bold text-gray-100" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{value}</div>
      <div className="text-xs text-gray-500 mt-1">{sub}</div>
    </div>
  );
}
