"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { Plus, Trash2, CheckCircle2, Circle } from "lucide-react";
import { toast } from "sonner";

interface ActionsTabProps {
  coacheeId: Id<"coachees">;
  userId: Id<"users">;
}

function dueBadge(due: string | undefined) {
  if (!due) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(due);
  dueDate.setHours(0, 0, 0, 0);
  const diff = (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

  if (diff < 0) {
    return <Badge variant="destructive">Overdue</Badge>;
  } else if (diff <= 7) {
    return (
      <Badge className="bg-amber-600/20 text-amber-400 border-amber-600/30">
        Due soon
      </Badge>
    );
  }
  return (
    <Badge className="bg-green-600/20 text-green-400 border-green-600/30">
      On track
    </Badge>
  );
}

export function ActionsTab({ coacheeId, userId }: ActionsTabProps) {
  const actions = useQuery(api.actions.listByCoachee, { coacheeId });
  const createAction = useMutation(api.actions.create);
  const toggleAction = useMutation(api.actions.toggle);
  const removeAction = useMutation(api.actions.remove);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    text: "",
    assignee: "",
    due: "",
  });

  const resetForm = () => {
    setForm({ text: "", assignee: "", due: "" });
  };

  const handleAdd = async () => {
    if (!form.text.trim()) return;
    await createAction({
      coacheeId,
      text: form.text.trim(),
      assignee: form.assignee || undefined,
      due: form.due || undefined,
      done: false,
      status: "todo",
      userId,
    });
    toast.success("Action added", { description: "New action item has been created." });
    setDialogOpen(false);
    resetForm();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Action Items</CardTitle>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={resetForm}>
              <Plus className="w-4 h-4 mr-1" />
              Add Action
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Action Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Action
                </label>
                <Input
                  value={form.text}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, text: e.target.value }))
                  }
                  placeholder="Describe the action item..."
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Assignee
                </label>
                <Input
                  value={form.assignee}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, assignee: e.target.value }))
                  }
                  placeholder="e.g. Coach, Coachee"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Due Date
                </label>
                <Input
                  type="date"
                  value={form.due}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, due: e.target.value }))
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAdd} disabled={!form.text.trim()}>
                Add
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {!actions || actions.length === 0 ? (
          <EmptyState
            icon="✅"
            message="No action items yet. Add one to get started."
          />
        ) : (
          <div className="space-y-2">
            {actions.map((action) => (
              <div
                key={action._id}
                className="flex items-center gap-3 p-3 rounded-lg bg-[#1E1E1E] border border-[#333] group"
              >
                <button
                  onClick={() => toggleAction({ id: action._id })}
                  className="shrink-0 text-green-500 hover:text-green-400 transition-colors"
                >
                  {action.done ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm ${
                      action.done
                        ? "line-through text-gray-500"
                        : "text-gray-200"
                    }`}
                  >
                    {action.text}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {action.assignee && (
                      <span className="text-xs text-gray-500">
                        {action.assignee}
                      </span>
                    )}
                    {action.due && (
                      <span className="text-xs text-gray-500">
                        Due: {action.due}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {!action.done && dueBadge(action.due)}
                  <ConfirmDialog
                    title="Delete Action"
                    message="Are you sure you want to delete this action item?"
                    onConfirm={() => removeAction({ id: action._id })}
                    trigger={
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
