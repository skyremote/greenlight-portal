"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Badge } from "@/components/ui/badge";
import { Id } from "../../../convex/_generated/dataModel";

interface KanbanCardProps {
  id: Id<"actionItems">;
  text: string;
  coacheeName: string;
  due?: string;
  assignee?: string;
}

export function KanbanCard({
  id,
  text,
  coacheeName,
  due,
  assignee,
}: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
    });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  const getDueBadge = () => {
    if (!due) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(due);
    dueDate.setHours(0, 0, 0, 0);
    const diff = (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

    if (diff < 0) {
      return <Badge variant="destructive" className="text-[10px]">Overdue</Badge>;
    } else if (diff <= 7) {
      return (
        <Badge className="text-[10px] bg-amber-600/20 text-amber-400 border-amber-600/30">
          Due soon
        </Badge>
      );
    }
    return null;
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="p-3 rounded-lg bg-[#1E1E1E] border border-[#333] shadow-sm cursor-grab active:cursor-grabbing hover:border-[#444] transition-colors"
    >
      <p className="text-sm text-gray-200 mb-2 line-clamp-3">{text}</p>
      <div className="flex items-center justify-between gap-2">
        <Badge variant="secondary" className="text-[10px] shrink-0">
          {coacheeName}
        </Badge>
        <div className="flex items-center gap-1.5">
          {getDueBadge()}
          {assignee && (
            <span className="text-[10px] text-gray-500">{assignee}</span>
          )}
        </div>
      </div>
      {due && (
        <p className="text-[10px] text-gray-500 mt-1.5">{due}</p>
      )}
    </div>
  );
}
