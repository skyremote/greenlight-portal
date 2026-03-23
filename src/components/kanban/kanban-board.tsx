"use client";

import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { KanbanColumn } from "./kanban-column";

interface ActionItem {
  _id: Id<"actionItems">;
  text: string;
  coacheeName: string;
  due?: string;
  assignee?: string;
  status?: string;
  done: boolean;
}

interface KanbanBoardProps {
  items: ActionItem[];
}

export function KanbanBoard({ items }: KanbanBoardProps) {
  const updateStatus = useMutation(api.actions.updateStatus);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const columns = {
    todo: items.filter(
      (i) => !i.status || i.status === "todo"
    ),
    inprogress: items.filter((i) => i.status === "inprogress"),
    done: items.filter((i) => i.status === "done" || (i.done && (!i.status || i.status === "done"))),
  };

  // Remove duplicates: if an item is done=true but status is not "done", it was already filtered to its status column
  // Re-categorize cleanly
  const categorized = {
    todo: [] as ActionItem[],
    inprogress: [] as ActionItem[],
    done: [] as ActionItem[],
  };

  for (const item of items) {
    if (item.status === "done" || (item.done && !item.status)) {
      categorized.done.push(item);
    } else if (item.status === "inprogress") {
      categorized.inprogress.push(item);
    } else {
      categorized.todo.push(item);
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const itemId = active.id as Id<"actionItems">;
    const newStatus = over.id as string;

    // Find the item to check current status
    const item = items.find((i) => i._id === itemId);
    if (!item) return;

    const currentStatus = item.status || (item.done ? "done" : "todo");
    if (currentStatus === newStatus) return;

    updateStatus({ id: itemId, status: newStatus });
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        <KanbanColumn
          id="todo"
          title="To Do"
          items={categorized.todo}
          color="bg-gray-400"
        />
        <KanbanColumn
          id="inprogress"
          title="In Progress"
          items={categorized.inprogress}
          color="bg-amber-400"
        />
        <KanbanColumn
          id="done"
          title="Done"
          items={categorized.done}
          color="bg-green-500"
        />
      </div>
    </DndContext>
  );
}
