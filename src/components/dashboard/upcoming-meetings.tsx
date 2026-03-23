"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuth } from "@/components/providers/auth-provider";
import { useRouter } from "next/navigation";
import { Clock, MapPin } from "lucide-react";

export function UpcomingMeetings() {
  const { user } = useAuth();
  const router = useRouter();

  const upcoming = useQuery(
    api.schedules.listUpcoming,
    user ? { userId: user._id as any } : "skip"
  );

  if (!upcoming) {
    return (
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-base font-semibold text-gray-100 mb-4">
          Upcoming Meetings
        </h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-white/[0.06] rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="text-base font-semibold text-gray-100 mb-4">
        Upcoming Meetings
      </h3>

      {upcoming.length === 0 ? (
        <p className="text-sm text-gray-500 py-4 text-center">
          No upcoming meetings scheduled
        </p>
      ) : (
        <div className="space-y-3">
          {upcoming.slice(0, 6).map((meeting) => {
            const dateObj = meeting.date
              ? new Date(meeting.date + "T00:00:00")
              : null;
            const day = dateObj
              ? dateObj.toLocaleDateString("en-GB", { day: "numeric" })
              : "--";
            const month = dateObj
              ? dateObj
                  .toLocaleDateString("en-GB", { month: "short" })
                  .toUpperCase()
              : "";

            return (
              <button
                key={meeting._id}
                onClick={() => router.push(`/coachee/${meeting.coacheeId}`)}
                className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-white/[0.04] transition-colors text-left"
              >
                {/* Date badge */}
                <div className="w-12 h-12 rounded-lg bg-green-900/30 border border-green-800/40 flex flex-col items-center justify-center flex-shrink-0">
                  <span className="text-lg font-heading font-bold text-green-300 leading-none">
                    {day}
                  </span>
                  <span className="text-[9px] text-green-400/70 font-semibold">
                    {month}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-200 truncate">
                    {meeting.coacheeName}
                  </p>
                  <div className="flex items-center gap-3 mt-0.5">
                    {meeting.time && (
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {meeting.time}
                      </span>
                    )}
                    {meeting.location && (
                      <span className="flex items-center gap-1 text-xs text-gray-500 truncate">
                        <MapPin className="w-3 h-3" />
                        {meeting.location}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
