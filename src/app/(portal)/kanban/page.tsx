"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useAuth } from "@/components/providers/auth-provider";
import { KanbanBoard } from "@/components/kanban/kanban-board";
import { EmptyState } from "@/components/shared/empty-state";

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
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading...</div>
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
