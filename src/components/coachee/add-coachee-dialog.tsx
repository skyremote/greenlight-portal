"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface AddCoacheeDialogProps {
  userId: Id<"users">;
}

export function AddCoacheeDialog({ userId }: AddCoacheeDialogProps) {
  const [open, setOpen] = useState(false);
  const createCoachee = useMutation(api.coachees.create);
  const coachees = useQuery(api.coachees.list, { userId });

  const [form, setForm] = useState({
    name: "",
    jobTitle: "",
    company: "",
    email: "",
    industry: "",
    specialisation: "",
    linkedin: "",
  });

  const resetForm = () => {
    setForm({
      name: "",
      jobTitle: "",
      company: "",
      email: "",
      industry: "",
      specialisation: "",
      linkedin: "",
    });
  };

  const handleCreate = async () => {
    if (!form.name.trim() || !form.email.trim()) return;

    const nextOrder = coachees ? coachees.length : 0;

    await createCoachee({
      name: form.name.trim(),
      email: form.email.trim(),
      jobTitle: form.jobTitle || undefined,
      company: form.company || undefined,
      industry: form.industry || undefined,
      specialisation: form.specialisation || undefined,
      linkedin: form.linkedin || undefined,
      order: nextOrder,
      userId,
    });

    toast.success("Coachee created", {
      description: `${form.name.trim()} has been added to your coachees.`,
    });
    setOpen(false);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" onClick={resetForm}>
          <Plus className="w-4 h-4 mr-1" />
          Add Coachee
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Coachee</DialogTitle>
          <DialogDescription>
            Enter the details for the new coachee.
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
              placeholder="Full name"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Email <span className="text-red-400">*</span>
            </label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((p) => ({ ...p, email: e.target.value }))
              }
              placeholder="email@example.com"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Job Title
              </label>
              <Input
                value={form.jobTitle}
                onChange={(e) =>
                  setForm((p) => ({ ...p, jobTitle: e.target.value }))
                }
                placeholder="e.g. CEO"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Company
              </label>
              <Input
                value={form.company}
                onChange={(e) =>
                  setForm((p) => ({ ...p, company: e.target.value }))
                }
                placeholder="e.g. Acme Ltd"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Industry
              </label>
              <Input
                value={form.industry}
                onChange={(e) =>
                  setForm((p) => ({ ...p, industry: e.target.value }))
                }
                placeholder="e.g. Technology"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Specialisation
              </label>
              <Input
                value={form.specialisation}
                onChange={(e) =>
                  setForm((p) => ({ ...p, specialisation: e.target.value }))
                }
                placeholder="e.g. SaaS"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              LinkedIn URL
            </label>
            <Input
              value={form.linkedin}
              onChange={(e) =>
                setForm((p) => ({ ...p, linkedin: e.target.value }))
              }
              placeholder="https://linkedin.com/in/..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!form.name.trim() || !form.email.trim()}
          >
            Create Coachee
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
