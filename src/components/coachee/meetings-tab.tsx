"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { formatDate } from "@/lib/utils";
import { Plus, Pencil, Trash2, MapPin, Clock } from "lucide-react";
import { toast } from "sonner";

interface MeetingsTabProps {
  coacheeId: Id<"coachees">;
  userId: Id<"users">;
}

export function MeetingsTab({ coacheeId, userId }: MeetingsTabProps) {
  const meetings = useQuery(api.meetings.listByCoachee, { coacheeId });
  const createMeeting = useMutation(api.meetings.create);
  const updateMeeting = useMutation(api.meetings.update);
  const removeMeeting = useMutation(api.meetings.remove);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<Id<"meetings"> | null>(null);
  const [form, setForm] = useState({
    date: "",
    duration: "",
    location: "",
    notes: "",
  });

  const resetForm = () => {
    setForm({ date: "", duration: "", location: "", notes: "" });
    setEditingId(null);
  };

  const openAdd = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (meeting: {
    _id: Id<"meetings">;
    date: string;
    duration?: string;
    location?: string;
    notes?: string;
  }) => {
    setEditingId(meeting._id);
    setForm({
      date: meeting.date,
      duration: meeting.duration ?? "",
      location: meeting.location ?? "",
      notes: meeting.notes ?? "",
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.date) return;
    if (editingId) {
      await updateMeeting({
        id: editingId,
        date: form.date,
        duration: form.duration || undefined,
        location: form.location || undefined,
        notes: form.notes || undefined,
      });
      toast.success("Meeting updated");
    } else {
      await createMeeting({
        coacheeId,
        date: form.date,
        duration: form.duration || undefined,
        location: form.location || undefined,
        notes: form.notes || undefined,
        userId,
      });
      toast.success("Meeting added", { description: "The meeting has been recorded." });
    }
    setDialogOpen(false);
    resetForm();
  };

  const sorted = meetings
    ? [...meetings].sort((a, b) => b.date.localeCompare(a.date))
    : [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Meeting History</CardTitle>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={openAdd}>
              <Plus className="w-4 h-4 mr-1" />
              Add Meeting
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit Meeting" : "Add Meeting"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Date</label>
                <Input
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, date: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Duration
                </label>
                <Input
                  value={form.duration}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, duration: e.target.value }))
                  }
                  placeholder="e.g. 60 mins"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Location
                </label>
                <Input
                  value={form.location}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, location: e.target.value }))
                  }
                  placeholder="e.g. Zoom, Office"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Notes
                </label>
                <Textarea
                  value={form.notes}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, notes: e.target.value }))
                  }
                  placeholder="Meeting notes..."
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={!form.date}>
                {editingId ? "Update" : "Add"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {sorted.length === 0 ? (
          <EmptyState icon="📅" message="No meetings recorded yet. Add your first meeting above." />
        ) : (
          <div className="space-y-3">
            {sorted.map((meeting) => (
              <div
                key={meeting._id}
                className="flex items-start gap-4 p-4 rounded-lg bg-[#1E1E1E] border border-[#333]"
              >
                <Badge className="shrink-0 mt-0.5">
                  {formatDate(meeting.date)}
                </Badge>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-100">
                    1-to-1 Session
                  </p>
                  <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-400">
                    {meeting.duration && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {meeting.duration}
                      </span>
                    )}
                    {meeting.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {meeting.location}
                      </span>
                    )}
                  </div>
                  {meeting.notes && (
                    <p className="text-sm text-gray-400 mt-2 whitespace-pre-wrap">
                      {meeting.notes}
                    </p>
                  )}
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => openEdit(meeting)}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <ConfirmDialog
                    title="Delete Meeting"
                    message="Are you sure you want to delete this meeting? This action cannot be undone."
                    onConfirm={() => removeMeeting({ id: meeting._id })}
                    trigger={
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-300">
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
