"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "./star-rating";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { SpeakerDialog } from "./speaker-dialog";
import { initials, avatarColor, formatDate } from "@/lib/utils";
import {
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

interface SpeakerCardProps {
  speaker: {
    _id: Id<"speakers">;
    name: string;
    topic?: string;
    date?: string;
    profile?: string;
    bio?: string;
    notes?: string;
    userId: Id<"users">;
  };
  index: number;
  userId: Id<"users">;
}

export function SpeakerCard({ speaker, index, userId }: SpeakerCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [notesValue, setNotesValue] = useState(speaker.notes ?? "");

  const ratings = useQuery(api.speakers.getRatings, {
    speakerId: speaker._id,
  });
  const avgData = useQuery(api.speakers.getAverageRating, {
    speakerId: speaker._id,
  });
  const coachees = useQuery(api.coachees.list, { userId });
  const rateSpeaker = useMutation(api.speakers.rate);
  const updateSpeaker = useMutation(api.speakers.update);
  const removeSpeaker = useMutation(api.speakers.remove);

  const avgRating = avgData?.average ?? 0;
  const bgColor = avatarColor(index);

  const handleEdit = (data: {
    name: string;
    topic: string;
    date: string;
    profile: string;
    bio: string;
  }) => {
    updateSpeaker({
      id: speaker._id,
      name: data.name,
      topic: data.topic || undefined,
      date: data.date || undefined,
      profile: data.profile || undefined,
      bio: data.bio || undefined,
    });
  };

  const handleSaveNotes = () => {
    updateSpeaker({
      id: speaker._id,
      notes: notesValue || undefined,
    });
    toast.success("Notes saved");
  };

  const getRatingForCoachee = (coacheeId: Id<"coachees">) => {
    if (!ratings) return 0;
    const r = ratings.find((r) => r.coacheeId === coacheeId);
    return r?.score ?? 0;
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shrink-0"
              style={{ backgroundColor: bgColor }}
            >
              {initials(speaker.name)}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-lg font-medium text-gray-100">
                    {speaker.name}
                  </h3>
                  {speaker.topic && (
                    <p className="text-sm text-gray-400">{speaker.topic}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    {speaker.date && (
                      <Badge variant="secondary" className="text-xs">
                        {formatDate(speaker.date)}
                      </Badge>
                    )}
                    {speaker.profile && (
                      <a
                        href={speaker.profile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-400 hover:text-green-300"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Average Rating */}
                <div className="text-right shrink-0">
                  <span
                    className="text-3xl font-bold font-heading text-gold"
                  >
                    {avgRating > 0 ? avgRating.toFixed(1) : "--"}
                  </span>
                  {avgData && avgData.count > 0 && (
                    <p className="text-xs text-gray-500">
                      {avgData.count} rating{avgData.count !== 1 ? "s" : ""}
                    </p>
                  )}
                </div>
              </div>

              {speaker.bio && (
                <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                  {speaker.bio}
                </p>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Action bar */}
          <div className="flex items-center justify-between border-t border-white/[0.06] pt-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="gap-1"
            >
              {expanded ? (
                <>
                  <ChevronUp className="w-4 h-4" /> Hide Details
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" /> Show Details
                </>
              )}
            </Button>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setEditOpen(true)}
              >
                <Pencil className="w-3.5 h-3.5" />
              </Button>
              <ConfirmDialog
                title="Delete Speaker"
                message="Are you sure you want to delete this speaker and all their ratings? This cannot be undone."
                onConfirm={() => removeSpeaker({ id: speaker._id })}
                trigger={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                }
              />
            </div>
          </div>

          {/* Expanded details */}
          {expanded && (
            <div className="mt-4 space-y-4 border-t border-white/[0.06] pt-4">
              {/* Individual ratings */}
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-3">
                  Coachee Ratings
                </h4>
                {coachees && coachees.length > 0 ? (
                  <div className="space-y-2">
                    {coachees.map((coachee) => (
                      <div
                        key={coachee._id}
                        className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-white/[0.02]"
                      >
                        <span className="text-sm text-gray-300">
                          {coachee.name}
                        </span>
                        <StarRating
                          value={getRatingForCoachee(coachee._id)}
                          onChange={(score) =>
                            rateSpeaker({
                              speakerId: speaker._id,
                              coacheeId: coachee._id,
                              score,
                              userId,
                            })
                          }
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    No coachees to rate this speaker.
                  </p>
                )}
              </div>

              {/* Notes */}
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">
                  Notes
                </h4>
                <Textarea
                  value={notesValue}
                  onChange={(e) => setNotesValue(e.target.value)}
                  placeholder="Notes about this speaker..."
                  rows={3}
                />
                <div className="flex justify-end mt-2">
                  <Button size="sm" onClick={handleSaveNotes}>
                    Save Notes
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <SpeakerDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        onSave={handleEdit}
        initialData={speaker}
        mode="edit"
      />
    </>
  );
}
