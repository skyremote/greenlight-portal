"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useAuth } from "@/components/providers/auth-provider";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorBoundary } from "@/components/shared/error-boundary";
import { Users, CheckCircle2, Clock, Mic2 } from "lucide-react";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const userId = user?._id;

  const coachees = useQuery(api.coachees.list, userId ? { userId: userId as any } : "skip");
  const allActions = useQuery(api.actions.listByUser, userId ? { userId: userId as any } : "skip");
  const speakers = useQuery(api.speakers.list, userId ? { userId: userId as any } : "skip");

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const activeCoachees = coachees?.length ?? 0;
  const pendingActions = allActions?.filter((a: any) => !a.done).length ?? 0;
  const completedActions = allActions?.filter((a: any) => a.done).length ?? 0;
  const totalSpeakers = speakers?.length ?? 0;

  return (
    <ErrorBoundary>
      <div>
        <h1 className="text-2xl font-semibold text-gray-100 mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Dashboard
        </h1>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Active Coachees"
            value={activeCoachees}
            sub="People in programme"
            color="#388E3C"
            icon={<Users className="w-5 h-5" />}
          />
          <StatCard
            label="Completed Actions"
            value={completedActions}
            sub="Items done"
            color="#1565C0"
            icon={<CheckCircle2 className="w-5 h-5" />}
          />
          <StatCard
            label="Pending Actions"
            value={pendingActions}
            sub="Awaiting completion"
            color="#DAA520"
            icon={<Clock className="w-5 h-5" />}
          />
          <StatCard
            label="Speakers"
            value={totalSpeakers}
            sub="Guest speakers tracked"
            color="#C62828"
            icon={<Mic2 className="w-5 h-5" />}
          />
        </div>

        {/* Coachee List */}
        <Card>
          <div className="px-6 py-4 border-b border-[#333]">
            <h2 className="text-lg font-semibold text-gray-100" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Your Coachees
            </h2>
          </div>
          <CardContent className="p-4">
            {!coachees ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3 p-3">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="space-y-1.5 flex-1">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-3 w-36" />
                    </div>
                  </div>
                ))}
              </div>
            ) : coachees.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Users className="w-10 h-10 text-gray-600 mb-3" />
                <p className="text-gray-400 text-sm">No coachees yet. They will appear after registration completes.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {coachees.map((c: any) => (
                  <a key={c._id} href={`/coachee/${c._id}`}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#333] transition-colors group">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold ring-2 ring-transparent group-hover:ring-green-500/30 transition-all"
                      style={{ background: c.photo ? undefined : '#1B5E20' }}>
                      {c.photo ? <img src={c.photo} className="w-10 h-10 rounded-full object-cover" alt={c.name} /> : c.name?.split(' ').map((w: string) => w[0]).join('').slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-gray-200 truncate">{c.name}</div>
                      <div className="text-xs text-gray-500 truncate">{c.jobTitle}{c.company ? ` at ${c.company}` : ''}</div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
}

function DashboardSkeleton() {
  return (
    <div>
      <Skeleton className="h-8 w-36 mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-[#2A2A2A] border border-[#333] rounded-xl p-5">
            <Skeleton className="h-3 w-24 mb-3" />
            <Skeleton className="h-8 w-12 mb-2" />
            <Skeleton className="h-3 w-28" />
          </div>
        ))}
      </div>
      <Card>
        <div className="px-6 py-4 border-b border-[#333]">
          <Skeleton className="h-6 w-32" />
        </div>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-36" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  color,
  icon,
}: {
  label: string;
  value: number;
  sub: string;
  color: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-[#2A2A2A] border border-[#333] rounded-xl p-5 relative overflow-hidden group hover:border-[#444] transition-colors">
      <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: color }} />
      <div className="flex items-start justify-between mb-2">
        <div className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">{label}</div>
        <div className="p-1.5 rounded-lg bg-[#1E1E1E] text-gray-500" style={{ color }}>
          {icon}
        </div>
      </div>
      <div className="text-3xl font-bold text-gray-100" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{value}</div>
      <div className="text-xs text-gray-500 mt-1">{sub}</div>
    </div>
  );
}
