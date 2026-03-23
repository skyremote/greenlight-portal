"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CalendarDays, Mail, Save } from "lucide-react";

interface ScheduleTabProps {
  coacheeId: Id<"coachees">;
  userId: Id<"users">;
  coacheeName: string;
  coacheeEmail: string;
}

export function ScheduleTab({
  coacheeId,
  userId,
  coacheeName,
  coacheeEmail,
}: ScheduleTabProps) {
  const schedule = useQuery(api.schedules.getByCoachee, { coacheeId });
  const upsertSchedule = useMutation(api.schedules.upsert);

  const [form, setForm] = useState({
    date: "",
    time: "",
    location: "",
    duration: "",
    agenda: "",
  });

  useEffect(() => {
    if (schedule) {
      setForm({
        date: schedule.date ?? "",
        time: schedule.time ?? "",
        location: schedule.location ?? "",
        duration: schedule.duration ?? "",
        agenda: schedule.agenda ?? "",
      });
    }
  }, [schedule]);

  const handleSave = async () => {
    await upsertSchedule({
      coacheeId,
      date: form.date || undefined,
      time: form.time || undefined,
      location: form.location || undefined,
      duration: form.duration || undefined,
      agenda: form.agenda || undefined,
      userId,
    });
  };

  const handleDownloadICS = () => {
    if (!form.date) return;

    const startDate = form.date.replace(/-/g, "");
    const startTime = form.time
      ? form.time.replace(":", "") + "00"
      : "090000";
    const dtStart = `${startDate}T${startTime}`;

    // Calculate end time based on duration
    const durationMins = parseInt(form.duration) || 60;
    const start = new Date(`${form.date}T${form.time || "09:00"}`);
    const end = new Date(start.getTime() + durationMins * 60000);
    const endDate = end.toISOString().split("T")[0].replace(/-/g, "");
    const endTime =
      String(end.getHours()).padStart(2, "0") +
      String(end.getMinutes()).padStart(2, "0") +
      "00";
    const dtEnd = `${endDate}T${endTime}`;

    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Greenlight Portal//EN",
      "BEGIN:VEVENT",
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      `SUMMARY:Coaching Session - ${coacheeName}`,
      `LOCATION:${form.location || "TBC"}`,
      `DESCRIPTION:${form.agenda || "Coaching session"}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([ics], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `coaching-${coacheeName.replace(/\s+/g, "-").toLowerCase()}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleEmailRecap = () => {
    const subject = encodeURIComponent(
      `Action Recap - Coaching Session ${form.date || ""}`
    );
    const body = encodeURIComponent(
      `Hi ${coacheeName},\n\nHere is a recap of our coaching session:\n\nDate: ${form.date || "TBC"}\nTime: ${form.time || "TBC"}\nLocation: ${form.location || "TBC"}\n\nAgenda:\n${form.agenda || "N/A"}\n\nBest regards`
    );
    window.open(`mailto:${coacheeEmail}?subject=${subject}&body=${body}`);
  };

  return (
    <Card className="border-green-500/20 bg-gradient-to-br from-[#2A2A2A] to-[#2A2A2A] ring-1 ring-green-500/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-green-500" />
          Next Meeting
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <label className="block text-sm text-gray-400 mb-1">Time</label>
            <Input
              type="time"
              value={form.time}
              onChange={(e) =>
                setForm((p) => ({ ...p, time: e.target.value }))
              }
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
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Agenda</label>
          <Textarea
            value={form.agenda}
            onChange={(e) =>
              setForm((p) => ({ ...p, agenda: e.target.value }))
            }
            placeholder="Topics to cover in the next session..."
            rows={4}
          />
        </div>
        <div className="flex flex-wrap gap-3 pt-2">
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-1" />
            Save Schedule
          </Button>
          <Button
            variant="secondary"
            onClick={handleDownloadICS}
            disabled={!form.date}
          >
            <CalendarDays className="w-4 h-4 mr-1" />
            Send Calendar Invite
          </Button>
          <Button variant="secondary" onClick={handleEmailRecap}>
            <Mail className="w-4 h-4 mr-1" />
            Email Action Recap
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
