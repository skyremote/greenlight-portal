"use client";

import { Badge } from "@/components/ui/badge";
import { initials, avatarColor } from "@/lib/utils";
import { PhotoUpload } from "./photo-upload";
import { ExternalLink, Mail } from "lucide-react";
import { Id } from "../../../convex/_generated/dataModel";

interface ProfileHeroProps {
  coachee: {
    _id: Id<"coachees">;
    name: string;
    email: string;
    jobTitle?: string;
    company?: string;
    linkedin?: string;
    industry?: string;
    specialisation?: string;
    location?: string;
    photo?: string;
    order: number;
  };
}

export function ProfileHero({ coachee }: ProfileHeroProps) {
  const bgColor = avatarColor(coachee.order ?? 0);

  return (
    <div className="flex items-start gap-6 p-6 rounded-xl bg-[#2A2A2A] border border-[#333]">
      <PhotoUpload coacheeId={coachee._id}>
        {coachee.photo ? (
          <img
            src={coachee.photo}
            alt={coachee.name}
            className="w-[72px] h-[72px] rounded-xl object-cover ring-2 ring-[#333] hover:ring-green-500 transition-all"
          />
        ) : (
          <div
            className="w-[72px] h-[72px] rounded-xl flex items-center justify-center text-white text-xl font-bold ring-2 ring-[#333] hover:ring-green-500 transition-all"
            style={{ backgroundColor: bgColor }}
          >
            {initials(coachee.name)}
          </div>
        )}
      </PhotoUpload>

      <div className="flex-1 min-w-0">
        <h1
          className="text-2xl text-gray-100 mb-1"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          {coachee.name}
        </h1>

        {(coachee.jobTitle || coachee.company) && (
          <p className="text-gray-400 text-sm mb-2">
            {coachee.jobTitle}
            {coachee.jobTitle && coachee.company && " at "}
            {coachee.company}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3 mb-3">
          {coachee.email && (
            <a
              href={`mailto:${coachee.email}`}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-green-400 transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              {coachee.email}
            </a>
          )}

          {coachee.linkedin && (
            <a
              href={coachee.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-green-400 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              LinkedIn
            </a>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {coachee.industry && (
            <Badge variant="secondary">{coachee.industry}</Badge>
          )}
          {coachee.specialisation && (
            <Badge variant="outline">{coachee.specialisation}</Badge>
          )}
          {coachee.location && (
            <Badge variant="secondary">{coachee.location}</Badge>
          )}
        </div>
      </div>
    </div>
  );
}
