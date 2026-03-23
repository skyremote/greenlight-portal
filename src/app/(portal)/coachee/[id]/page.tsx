"use client";

import { useParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useAuth } from "@/components/providers/auth-provider";
import { useState } from "react";
import { toast } from "sonner";
import { formatDate, initials, avatarColor } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorBoundary } from "@/components/shared/error-boundary";
import {
  ExternalLink,
  Mail,
  Save,
  CalendarDays,
  RefreshCw,
  Lightbulb,
  Plus,
  CheckCircle2,
  Circle,
  Trash2,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";

export default function CoacheePage() {
  const params = useParams();
  const id = params.id as string;
  const { user } = useAuth();

  const coachee = useQuery(api.coachees.get, id ? { id: id as any } : "skip");
  const meetings = useQuery(api.meetings.listByCoachee, id ? { coacheeId: id as any } : "skip");
  const actions = useQuery(api.actions.listByCoachee, id ? { coacheeId: id as any } : "skip");
  const schedule = useQuery(api.schedules.getByCoachee, id ? { coacheeId: id as any } : "skip");
  const insights = useQuery(api.insights.listByCoachee, id ? { coacheeId: id as any } : "skip");

  const updateCoachee = useMutation(api.coachees.update);
  const createMeeting = useMutation(api.meetings.create);
  const removeMeeting = useMutation(api.meetings.remove);
  const createAction = useMutation(api.actions.create);
  const toggleAction = useMutation(api.actions.toggle);
  const removeAction = useMutation(api.actions.remove);
  const upsertSchedule = useMutation(api.schedules.upsert);
  const refreshInsights = useMutation(api.insights.refresh);

  if (!coachee) {
    return <CoacheeLoadingSkeleton />;
  }

  return (
    <ErrorBoundary>
      <div>
        {/* Hero */}
        <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-6">
          <div
            className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-white text-xl sm:text-2xl font-bold ring-2 ring-white/[0.08] shadow-lg flex-shrink-0"
            style={{ background: coachee.photo ? undefined : avatarColor(0) }}
          >
            {coachee.photo ? (
              <img
                src={coachee.photo}
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl object-cover"
                alt={coachee.name}
              />
            ) : (
              initials(coachee.name)
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h1
              className="text-xl sm:text-2xl font-bold text-gray-100 font-heading break-words"
            >
              {coachee.name}
            </h1>
            {(coachee.jobTitle || coachee.company) && (
              <p className="text-sm text-gray-400">
                {coachee.jobTitle}
                {coachee.company ? ` at ${coachee.company}` : ""}
              </p>
            )}
            {coachee.email && (
              <p className="text-xs text-gray-500">{coachee.email}</p>
            )}
            <div className="flex gap-2 mt-1.5 flex-wrap">
              {coachee.linkedin && (
                <a
                  href={coachee.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Badge
                    variant="secondary"
                    className="gap-1 cursor-pointer hover:bg-[#444] transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    LinkedIn
                  </Badge>
                </a>
              )}
              {coachee.industry && (
                <Badge variant="outline">{coachee.industry}</Badge>
              )}
              {coachee.location && (
                <Badge variant="secondary">{coachee.location}</Badge>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="w-full justify-start bg-white/[0.03] border border-white/[0.06] rounded-lg p-1 mb-6 overflow-x-auto flex-nowrap">
            <TabsTrigger value="profile" className="text-xs sm:text-sm">Profile</TabsTrigger>
            <TabsTrigger value="meetings" className="text-xs sm:text-sm">Meetings</TabsTrigger>
            <TabsTrigger value="actions" className="text-xs sm:text-sm">Actions</TabsTrigger>
            <TabsTrigger value="schedule" className="text-xs sm:text-sm">Schedule</TabsTrigger>
            <TabsTrigger value="insights" className="text-xs sm:text-sm">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfileTab coachee={coachee} onSave={updateCoachee} />
          </TabsContent>
          <TabsContent value="meetings">
            <MeetingsTab
              meetings={meetings}
              coacheeId={id}
              userId={user?._id}
              onCreate={createMeeting}
              onRemove={removeMeeting}
            />
          </TabsContent>
          <TabsContent value="actions">
            <ActionsTab
              actions={actions}
              coacheeId={id}
              coacheeName={coachee.name}
              userId={user?._id}
              onCreate={createAction}
              onToggle={toggleAction}
              onRemove={removeAction}
            />
          </TabsContent>
          <TabsContent value="schedule">
            <ScheduleTab
              schedule={schedule}
              coachee={coachee}
              coacheeId={id}
              userId={user?._id}
              onSave={upsertSchedule}
              actions={actions}
            />
          </TabsContent>
          <TabsContent value="insights">
            <InsightsTab
              insights={insights}
              coachee={coachee}
              coacheeId={id}
              userId={user?._id}
              onRefresh={refreshInsights}
            />
          </TabsContent>
        </Tabs>
      </div>
    </ErrorBoundary>
  );
}

function CoacheeLoadingSkeleton() {
  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Skeleton className="w-16 h-16 rounded-2xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-40" />
        </div>
      </div>
      <Skeleton className="h-10 w-full mb-6 rounded-lg" />
      <div className="space-y-4">
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    </div>
  );
}

function ProfileTab({ coachee, onSave }: { coachee: any; onSave: any }) {
  const [form, setForm] = useState({ ...coachee });
  const [saving, setSaving] = useState(false);
  const set = (k: string, v: string) =>
    setForm((f: any) => ({ ...f, [k]: v }));

  async function save() {
    setSaving(true);
    try {
      await onSave({
        id: coachee._id,
        name: form.name,
        email: form.email,
        jobTitle: form.jobTitle,
        company: form.company,
        phone: form.phone,
        location: form.location,
        linkedin: form.linkedin,
        industry: form.industry,
        specialisation: form.specialisation,
        interests: form.interests,
        businessProfile: form.businessProfile,
        notes: form.notes,
      });
      toast.success("Profile saved", {
        description: "Coachee details have been updated.",
      });
    } catch (e) {
      console.error(e);
      toast.error("Failed to save", {
        description: "An error occurred while saving the profile.",
      });
    }
    setSaving(false);
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Personal Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Full Name"
              value={form.name}
              onChange={(v) => set("name", v)}
            />
            <FormField
              label="Job Title"
              value={form.jobTitle}
              onChange={(v) => set("jobTitle", v)}
            />
            <FormField
              label="Company"
              value={form.company}
              onChange={(v) => set("company", v)}
            />
            <FormField
              label="Email"
              value={form.email}
              onChange={(v) => set("email", v)}
              type="email"
            />
            <FormField
              label="Phone"
              value={form.phone}
              onChange={(v) => set("phone", v)}
              placeholder="e.g. +44 7700 900000"
            />
            <FormField
              label="Location"
              value={form.location}
              onChange={(v) => set("location", v)}
              placeholder="e.g. London, UK"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Professional Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="LinkedIn URL"
              value={form.linkedin}
              onChange={(v) => set("linkedin", v)}
              placeholder="https://linkedin.com/in/..."
            />
            <FormField
              label="Industry"
              value={form.industry}
              onChange={(v) => set("industry", v)}
              placeholder="e.g. Technology"
            />
            <FormField
              label="Specialisation"
              value={form.specialisation}
              onChange={(v) => set("specialisation", v)}
              placeholder="e.g. SaaS, B2B Sales"
            />
            <FormField
              label="Interests"
              value={form.interests}
              onChange={(v) => set("interests", v)}
              placeholder="e.g. Leadership, Growth Strategy"
            />
          </div>
          <FormField
            label="Business Profile"
            value={form.businessProfile}
            onChange={(v) => set("businessProfile", v)}
            textarea
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Coach&apos;s Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            label=""
            value={form.notes}
            onChange={(v) => set("notes", v)}
            textarea
            placeholder="Private notes about this coachee..."
          />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={save} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save All Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

function MeetingsTab({
  meetings,
  coacheeId,
  userId,
  onCreate,
  onRemove,
}: any) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    date: "",
    duration: "60",
    location: "",
    notes: "",
  });

  async function add() {
    await onCreate({
      coacheeId: coacheeId as any,
      userId: userId as any,
      ...form,
    });
    toast.success("Meeting added", {
      description: "The meeting has been recorded.",
    });
    setForm({ date: "", duration: "60", location: "", notes: "" });
    setDialogOpen(false);
  }

  const sorted = meetings
    ? [...meetings].sort((a: any, b: any) =>
        (b.date || "").localeCompare(a.date || "")
      )
    : [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Meeting History</CardTitle>
        <Button size="sm" onClick={() => setDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-1" />
          Add Meeting
        </Button>
      </CardHeader>
      <CardContent>
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CalendarDays className="w-10 h-10 text-gray-600 mb-3" />
            <p className="text-gray-400 text-sm">No meetings recorded yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sorted.map((m: any) => (
              <div
                key={m._id}
                className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] group transition-all duration-200 hover:border-white/[0.1] hover:bg-white/[0.04]"
              >
                <div className="bg-green-500/15 rounded-lg px-3 py-2 text-center min-w-[48px] shrink-0">
                  <div className="text-[10px] uppercase text-green-400 font-bold">
                    {m.date
                      ? new Date(m.date).toLocaleDateString("en-GB", {
                          month: "short",
                        })
                      : ""}
                  </div>
                  <div className="text-lg font-bold text-green-300">
                    {m.date ? new Date(m.date).getDate() : ""}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-200">
                    1-to-1 Session
                  </div>
                  <div className="text-xs text-gray-500">
                    {m.duration ? m.duration + " mins" : ""}
                    {m.location ? " \u00b7 " + m.location : ""}
                  </div>
                  {m.notes && (
                    <div className="text-sm text-gray-400 mt-1">{m.notes}</div>
                  )}
                </div>
                <ConfirmDialog
                  title="Delete Meeting"
                  message="Are you sure you want to delete this meeting?"
                  onConfirm={async () => {
                    await onRemove({ id: m._id });
                    toast.success("Meeting deleted");
                  }}
                  trigger={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  }
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Meeting</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <FormField
                label="Date"
                value={form.date}
                onChange={(v) => setForm((f) => ({ ...f, date: v }))}
                type="date"
              />
              <FormField
                label="Duration (mins)"
                value={form.duration}
                onChange={(v) => setForm((f) => ({ ...f, duration: v }))}
              />
            </div>
            <FormField
              label="Location"
              value={form.location}
              onChange={(v) => setForm((f) => ({ ...f, location: v }))}
              placeholder="e.g. Zoom, Office"
            />
            <FormField
              label="Notes"
              value={form.notes}
              onChange={(v) => setForm((f) => ({ ...f, notes: v }))}
              textarea
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={add} disabled={!form.date}>
              Add Meeting
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function ActionsTab({
  actions,
  coacheeId,
  coacheeName,
  userId,
  onCreate,
  onToggle,
  onRemove,
}: any) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ text: "", assignee: "", due: "" });

  async function add() {
    if (!form.text.trim()) return;
    await onCreate({
      coacheeId: coacheeId as any,
      userId: userId as any,
      text: form.text,
      assignee: form.assignee || coacheeName,
      due: form.due || undefined,
      done: false,
      status: "todo",
    });
    toast.success("Action added", {
      description: "New action item has been created.",
    });
    setForm({ text: "", assignee: "", due: "" });
    setDialogOpen(false);
  }

  const pending = actions?.filter((a: any) => !a.done) || [];
  const done = actions?.filter((a: any) => a.done) || [];
  const allItems = [...pending, ...done];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Action Items</CardTitle>
        <Button size="sm" onClick={() => setDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-1" />
          Add Action
        </Button>
      </CardHeader>
      <CardContent>
        {allItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CheckCircle2 className="w-10 h-10 text-gray-600 mb-3" />
            <p className="text-gray-400 text-sm">No action items yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {allItems.map((a: any) => (
              <div
                key={a._id}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] group transition-all duration-200 hover:border-white/[0.1] hover:bg-white/[0.04]"
              >
                <button
                  onClick={async () => {
                    await onToggle({ id: a._id });
                    toast.success(
                      a.done ? "Action reopened" : "Action completed"
                    );
                  }}
                  className="shrink-0 text-green-500 hover:text-green-400 transition-colors"
                >
                  {a.done ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <div
                    className={`text-sm ${a.done ? "line-through text-gray-500" : "text-gray-200"}`}
                  >
                    {a.text}
                  </div>
                  <div className="text-xs text-gray-500">
                    {a.assignee}
                    {a.due ? " \u00b7 Due " + formatDate(a.due) : ""}
                  </div>
                </div>
                {a.due && !a.done && (
                  <Badge
                    variant={
                      new Date(a.due) < new Date()
                        ? "destructive"
                        : "secondary"
                    }
                    className={
                      new Date(a.due) >= new Date()
                        ? "bg-green-600/20 text-green-400 border-green-600/30"
                        : ""
                    }
                  >
                    {new Date(a.due) < new Date()
                      ? "Overdue"
                      : formatDate(a.due)}
                  </Badge>
                )}
                <ConfirmDialog
                  title="Delete Action"
                  message="Are you sure you want to delete this action item?"
                  onConfirm={async () => {
                    await onRemove({ id: a._id });
                    toast.success("Action deleted");
                  }}
                  trigger={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  }
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Action Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <FormField
              label="Action Item"
              value={form.text}
              onChange={(v) => setForm((f) => ({ ...f, text: v }))}
              placeholder="Describe the action item..."
            />
            <div className="grid grid-cols-2 gap-3">
              <FormField
                label="Assigned To"
                value={form.assignee}
                onChange={(v) => setForm((f) => ({ ...f, assignee: v }))}
                placeholder={coacheeName}
              />
              <FormField
                label="Due Date"
                value={form.due}
                onChange={(v) => setForm((f) => ({ ...f, due: v }))}
                type="date"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={add} disabled={!form.text.trim()}>
              Add Action
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function ScheduleTab({
  schedule,
  coachee,
  coacheeId,
  userId,
  onSave,
  actions,
}: any) {
  const [form, setForm] = useState({
    date: schedule?.date || "",
    time: schedule?.time || "",
    location: schedule?.location || "",
    duration: schedule?.duration || "60",
    agenda: schedule?.agenda || "",
  });
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    await onSave({
      coacheeId: coacheeId as any,
      userId: userId as any,
      ...form,
    });
    toast.success("Schedule saved", {
      description: "The next meeting details have been updated.",
    });
    setSaving(false);
  }

  function downloadICS() {
    if (!form.date) return;
    const start =
      form.date.replace(/-/g, "") +
      "T" +
      (form.time || "09:00").replace(/:/g, "") +
      "00";
    const dur = parseInt(form.duration) || 60;
    const sm =
      parseInt((form.time || "09:00").split(":")[0]) * 60 +
      parseInt((form.time || "09:00").split(":")[1]);
    const end =
      form.date.replace(/-/g, "") +
      "T" +
      String(Math.floor((sm + dur) / 60)).padStart(2, "0") +
      String((sm + dur) % 60).padStart(2, "0") +
      "00";
    const ics = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nBEGIN:VEVENT\r\nDTSTART:${start}\r\nDTEND:${end}\r\nSUMMARY:Coaching - ${coachee.name}\r\nLOCATION:${form.location}\r\nEND:VEVENT\r\nEND:VCALENDAR`;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(
      new Blob([ics], { type: "text/calendar" })
    );
    a.download = `coaching-${coachee.name.replace(/\s+/g, "-").toLowerCase()}.ics`;
    a.click();
    toast.success("Calendar invite downloaded");
  }

  function emailRecap() {
    const pend = (actions || []).filter((a: any) => !a.done);
    let body = `Hi ${coachee.name.split(" ")[0]},\n\nRecap:\n\n`;
    pend.forEach((a: any, i: number) => {
      body += `${i + 1}. ${a.text}\n`;
    });
    if (form.date)
      body += `\nNext meeting: ${form.date} at ${form.time || "TBC"}\n`;
    window.open(
      `mailto:${coachee.email || ""}?subject=${encodeURIComponent("Coaching Recap")}&body=${encodeURIComponent(body)}`
    );
    toast.success("Email client opened", {
      description: "Your email recap has been prepared.",
    });
  }

  return (
    <Card className="border-green-500/20 bg-gradient-to-br from-[#2A2A2A] to-green-950/10 ring-1 ring-green-500/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-green-500" />
          Next Meeting
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Date"
            value={form.date}
            onChange={(v) => setForm((f) => ({ ...f, date: v }))}
            type="date"
          />
          <FormField
            label="Time"
            value={form.time}
            onChange={(v) => setForm((f) => ({ ...f, time: v }))}
            type="time"
          />
          <FormField
            label="Location"
            value={form.location}
            onChange={(v) => setForm((f) => ({ ...f, location: v }))}
            placeholder="e.g. Zoom, Office"
          />
          <FormField
            label="Duration (mins)"
            value={form.duration}
            onChange={(v) => setForm((f) => ({ ...f, duration: v }))}
          />
        </div>
        <FormField
          label="Agenda"
          value={form.agenda}
          onChange={(v) => setForm((f) => ({ ...f, agenda: v }))}
          textarea
          placeholder="Topics to cover in the next session..."
        />
        <Separator />
        <div className="flex flex-wrap gap-3">
          <Button onClick={save} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Schedule
              </>
            )}
          </Button>
          <Button
            variant="secondary"
            onClick={downloadICS}
            disabled={!form.date}
          >
            <CalendarDays className="w-4 h-4 mr-2" />
            Calendar Invite
          </Button>
          <Button variant="secondary" onClick={emailRecap}>
            <Mail className="w-4 h-4 mr-2" />
            Email Recap
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function InsightsTab({
  insights,
  coachee,
  coacheeId,
  userId,
  onRefresh,
}: any) {
  const [refreshing, setRefreshing] = useState(false);

  async function refresh() {
    setRefreshing(true);
    try {
      await onRefresh({
        coacheeId: coacheeId as any,
        userId: userId as any,
      });
      toast.success("Insights refreshed", {
        description: "New industry insights have been generated.",
      });
    } catch (e) {
      toast.error("Failed to refresh insights");
    }
    setRefreshing(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-green-500" />
          <span className="text-sm text-gray-400">
            Industry:{" "}
            <strong className="text-gray-200">
              {coachee.industry || "General"}
            </strong>
          </span>
        </div>
        <Button
          size="sm"
          variant="secondary"
          onClick={refresh}
          disabled={refreshing}
        >
          {refreshing ? (
            <>
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-1" />
              Refresh Insights
            </>
          )}
        </Button>
      </div>

      {!insights || insights.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center text-center">
              <Lightbulb className="w-10 h-10 text-gray-600 mb-3" />
              <p className="text-gray-400 text-sm">
                Click &quot;Refresh Insights&quot; to load industry trends
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {insights.map((ins: any) => (
            <Card
              key={ins._id}
              className="border-green-500/20 bg-gradient-to-br from-[#2A2A2A] via-[#2A2A2A] to-green-950/10"
            >
              <CardHeader className="pb-2">
                <Badge
                  variant="outline"
                  className="text-green-400 border-green-500/30 w-fit"
                >
                  {ins.source}
                </Badge>
                <CardTitle className="text-base">{ins.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {ins.summary}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  type,
  textarea,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  textarea?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      {label && (
        <label className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1.5 block">
          {label}
        </label>
      )}
      {textarea ? (
        <Textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-h-[80px]"
        />
      ) : (
        <Input
          type={type || "text"}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}
