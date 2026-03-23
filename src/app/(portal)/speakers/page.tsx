"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useAuth } from "@/components/providers/auth-provider";
import { SpeakerCard } from "@/components/speakers/speaker-card";
import { SpeakerDialog } from "@/components/speakers/speaker-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function SpeakersPage() {
  const { user } = useAuth();
  const [addOpen, setAddOpen] = useState(false);

  const speakers = useQuery(
    api.speakers.list,
    user ? { userId: user._id } : "skip"
  );
  const createSpeaker = useMutation(api.speakers.create);

  const handleAdd = async (data: {
    name: string;
    topic: string;
    date: string;
    profile: string;
    bio: string;
  }) => {
    if (!user) return;
    await createSpeaker({
      name: data.name,
      topic: data.topic || undefined,
      date: data.date || undefined,
      profile: data.profile || undefined,
      bio: data.bio || undefined,
      userId: user._id,
    });
    toast.success("Speaker added", {
      description: `${data.name} has been added to your speakers.`,
    });
  };

  if (!speakers) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-40 mb-2" />
            <Skeleton className="h-4 w-56" />
          </div>
          <Skeleton className="h-9 w-32 rounded-md" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card rounded-xl p-6">
              <div className="flex items-start gap-4">
                <Skeleton className="w-12 h-12 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-60" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-10 w-10" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-gray-100 font-heading">
            Speaker Notes
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Track guest speakers and coachee ratings
          </p>
        </div>
        <Button size="sm" onClick={() => setAddOpen(true)}>
          <Plus className="w-4 h-4 mr-1" />
          Add Speaker
        </Button>
      </div>

      {speakers.length === 0 ? (
        <EmptyState
          icon="🎤"
          message="No speakers added yet. Click 'Add Speaker' to get started."
        />
      ) : (
        <div className="space-y-4">
          {speakers.map((speaker, index) => (
            <SpeakerCard
              key={speaker._id}
              speaker={speaker}
              index={index}
              userId={user!._id as any}
            />
          ))}
        </div>
      )}

      <SpeakerDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onSave={handleAdd}
        mode="add"
      />
    </div>
  );
}
