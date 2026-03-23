"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useAuth } from "@/components/providers/auth-provider";
import { SpeakerCard } from "@/components/speakers/speaker-card";
import { SpeakerDialog } from "@/components/speakers/speaker-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function SpeakersPage() {
  const { user } = useAuth();
  const [addOpen, setAddOpen] = useState(false);

  const speakers = useQuery(
    api.speakers.list,
    user ? { userId: user._id } : "skip"
  );
  const createSpeaker = useMutation(api.speakers.create);

  const handleAdd = (data: {
    name: string;
    topic: string;
    date: string;
    profile: string;
    bio: string;
  }) => {
    if (!user) return;
    createSpeaker({
      name: data.name,
      topic: data.topic || undefined,
      date: data.date || undefined,
      profile: data.profile || undefined,
      bio: data.bio || undefined,
      userId: user._id,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-2xl text-gray-100"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
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

      {!speakers || speakers.length === 0 ? (
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
