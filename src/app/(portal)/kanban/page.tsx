"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useAuth } from "@/components/providers/auth-provider";
import { KanbanBoard } from "@/components/kanban/kanban-board";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

export default function KanbanPage() {
  const { user } = useAuth();

  const coachees = useQuery(
    api.coachees.list,
    user ? { userId: user._id } : "skip"
  );
  const allActions = useQuery(
    api.actions.listByUser,
    user ? { userId: user._id } : "skip"
  );

  if (!coachees || !allActions) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-40 mb-2" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="flex gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-1 min-w-[280px]">
              <div className="flex items-center gap-2 mb-3">
                <Skeleton className="w-2.5 h-2.5 rounded-full" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="space-y-2 p-2 rounded-lg border border-[#333] bg-[#2A2A2A] min-h-[200px]">
                {[1, 2].map((j) => (
                  <Skeleton key={j} className="h-24 rounded-lg" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Build a map of coachee IDs to names
  const coacheeMap = new Map(coachees.map((c) => [c._id, c.name]));

  // Enrich action items with coachee names
  const enrichedActions = allActions.map((action) => ({
    ...action,
    coacheeName: coacheeMap.get(action.coacheeId) ?? "Unknown",
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1
          className="text-2xl text-gray-100"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Action Board
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Drag and drop action items across columns to update their status
        </p>
      </div>

      {enrichedActions.length === 0 ? (
        <EmptyState
          icon="📋"
          message="No action items yet. Create action items from a coachee's profile to see them here."
        />
      ) : (
        <KanbanBoard items={enrichedActions} />
      )}
    </div>
  );
}
