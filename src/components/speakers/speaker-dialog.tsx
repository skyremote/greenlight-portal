"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface SpeakerFormData {
  name: string;
  topic: string;
  date: string;
  profile: string;
  bio: string;
}

interface SpeakerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: SpeakerFormData) => void;
  initialData?: Partial<SpeakerFormData>;
  mode: "add" | "edit";
}

export function SpeakerDialog({
  open,
  onOpenChange,
  onSave,
  initialData,
  mode,
}: SpeakerDialogProps) {
  const [form, setForm] = useState<SpeakerFormData>({
    name: "",
    topic: "",
    date: "",
    profile: "",
    bio: "",
  });

  useEffect(() => {
    if (open) {
      setForm({
        name: initialData?.name ?? "",
        topic: initialData?.topic ?? "",
        date: initialData?.date ?? "",
        profile: initialData?.profile ?? "",
        bio: initialData?.bio ?? "",
      });
    }
  }, [open, initialData]);

  const handleSave = () => {
    if (!form.name.trim()) return;
    onSave(form);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add Speaker" : "Edit Speaker"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Enter the details for the new speaker."
              : "Update the speaker details."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Name <span className="text-red-400">*</span>
            </label>
            <Input
              value={form.name}
              onChange={(e) =>
                setForm((p) => ({ ...p, name: e.target.value }))
              }
              placeholder="Speaker name"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Topic</label>
            <Input
              value={form.topic}
              onChange={(e) =>
                setForm((p) => ({ ...p, topic: e.target.value }))
              }
              placeholder="Talk topic or subject"
            />
          </div>
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
              Profile Link
            </label>
            <Input
              value={form.profile}
              onChange={(e) =>
                setForm((p) => ({ ...p, profile: e.target.value }))
              }
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Bio</label>
            <Textarea
              value={form.bio}
              onChange={(e) =>
                setForm((p) => ({ ...p, bio: e.target.value }))
              }
              placeholder="Speaker bio..."
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!form.name.trim()}>
            {mode === "add" ? "Add Speaker" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
