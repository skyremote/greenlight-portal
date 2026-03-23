"use client";

import { useDroppable } from "@dnd-kit/core";
import { KanbanCard } from "./kanban-card";
import { Id } from "../../../convex/_generated/dataModel";

interface ActionItem {
  _id: Id<"actionItems">;
  text: string;
  coacheeName: string;
  due?: string;
  assignee?: string;
}

interface KanbanColumnProps {
  id: string;
  title: string;
  items: ActionItem[];
  color: string;
}

export function KanbanColumn({ id, title, items, color }: KanbanColumnProps) {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div className="flex-1 min-w-[280px]">
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
        <h3 className="text-sm font-medium text-gray-200">{title}</h3>
        <span className="text-xs text-gray-500 bg-[#333] px-1.5 py-0.5 rounded-full">
          {items.length}
        </span>
      </div>
      <div
        ref={setNodeRef}
        className={`space-y-2 min-h-[200px] p-2 rounded-lg border transition-colors ${
          isOver
            ? "border-green-500/40 bg-green-500/5"
            : "border-[#333] bg-[#2A2A2A]"
        }`}
      >
        {items.map((item) => (
          <KanbanCard
            key={item._id}
            id={item._id}
            text={item.text}
            coacheeName={item.coacheeName}
            due={item.due}
            assignee={item.assignee}
          />
        ))}
        {items.length === 0 && (
          <div className="flex items-center justify-center h-24 text-xs text-gray-500">
            Drop items here
          </div>
        )}
      </div>
    </div>
  );
}
