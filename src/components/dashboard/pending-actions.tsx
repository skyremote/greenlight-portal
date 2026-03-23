"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuth } from "@/components/providers/auth-provider";
import { CircleDot, Calendar } from "lucide-react";

export function PendingActions() {
  const { user } = useAuth();

  const allActions = useQuery(
    api.actions.listByUser,
    user ? { userId: user._id as any } : "skip"
  );

  const coachees = useQuery(
    api.coachees.list,
    user ? { userId: user._id as any } : "skip"
  );

  if (!allActions || !coachees) {
    return (
      <div className="bg-[#2A2A2A] border border-[#333] rounded-xl p-6">
        <h3 className="text-base font-semibold text-gray-100 mb-4">
          Pending Actions
        </h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 bg-[#333] rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // Build coachee name lookup
  const coacheeNames = new Map<string, string>();
  for (const c of coachees) {
    coacheeNames.set(c._id, c.name);
  }

  const pending = allActions.filter((a) => !a.done);

  return (
    <div className="bg-[#2A2A2A] border border-[#333] rounded-xl p-6">
      <h3 className="text-base font-semibold text-gray-100 mb-4">
        Pending Actions
      </h3>

      {pending.length === 0 ? (
        <p className="text-sm text-gray-500 py-4 text-center">
          All actions completed
        </p>
      ) : (
        <div className="space-y-2">
          {pending.slice(0, 8).map((action) => (
            <div
              key={action._id}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#333] transition-colors"
            >
              <CircleDot className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-200 line-clamp-1">
                  {action.text}
                </p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-xs text-gray-500">
                    {coacheeNames.get(action.coacheeId) || "Unknown"}
                  </span>
                  {action.due && (
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {action.due}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
