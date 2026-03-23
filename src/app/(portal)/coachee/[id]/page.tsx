"use client";

import { useParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useAuth } from "@/components/providers/auth-provider";
import { useState } from "react";
import { formatDate, initials, avatarColor } from "@/lib/utils";

export default function CoacheePage() {
  const params = useParams();
  const id = params.id as string;
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

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
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-green-500 border-t-transparent" />
      </div>
    );
  }

  const tabs = ["profile", "meetings", "actions", "schedule", "insights"];

  return (
    <div>
      {/* Hero */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold"
          style={{ background: coachee.photo ? undefined : avatarColor(0) }}>
          {coachee.photo
            ? <img src={coachee.photo} className="w-16 h-16 rounded-2xl object-cover" alt="" />
            : initials(coachee.name)}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-100" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{coachee.name}</h1>
          {(coachee.jobTitle || coachee.company) && (
            <p className="text-sm text-gray-400">{coachee.jobTitle}{coachee.company ? ` at ${coachee.company}` : ''}</p>
          )}
          {coachee.email && <p className="text-xs text-gray-500">{coachee.email}</p>}
          <div className="flex gap-2 mt-1 flex-wrap">
            {coachee.linkedin && <a href={coachee.linkedin} target="_blank" className="text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded">LinkedIn</a>}
            {coachee.industry && <span className="text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded">{coachee.industry}</span>}
            {coachee.location && <span className="text-xs text-gray-400 bg-gray-400/10 px-2 py-0.5 rounded">{coachee.location}</span>}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b-2 border-[#333] mb-6 overflow-x-auto">
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-5 py-2.5 text-sm font-medium capitalize border-b-2 -mb-[2px] transition whitespace-nowrap ${activeTab === t ? 'text-green-400 border-green-500' : 'text-gray-500 border-transparent hover:text-gray-300'}`}>
            {t}
          </button>
        ))}
      </div>

      {activeTab === "profile" && <ProfileTab coachee={coachee} onSave={updateCoachee} />}
      {activeTab === "meetings" && <MeetingsTab meetings={meetings} coacheeId={id} userId={user?._id} onCreate={createMeeting} onRemove={removeMeeting} />}
      {activeTab === "actions" && <ActionsTab actions={actions} coacheeId={id} coacheeName={coachee.name} userId={user?._id} onCreate={createAction} onToggle={toggleAction} onRemove={removeAction} />}
      {activeTab === "schedule" && <ScheduleTab schedule={schedule} coachee={coachee} coacheeId={id} userId={user?._id} onSave={upsertSchedule} actions={actions} />}
      {activeTab === "insights" && <InsightsTab insights={insights} coachee={coachee} coacheeId={id} userId={user?._id} onRefresh={refreshInsights} />}
    </div>
  );
}

function ProfileTab({ coachee, onSave }: { coachee: any; onSave: any }) {
  const [form, setForm] = useState({ ...coachee });
  const [saving, setSaving] = useState(false);
  const set = (k: string, v: string) => setForm((f: any) => ({ ...f, [k]: v }));

  async function save() {
    setSaving(true);
    try { await onSave({ id: coachee._id, name: form.name, email: form.email, jobTitle: form.jobTitle, company: form.company, phone: form.phone, location: form.location, linkedin: form.linkedin, industry: form.industry, specialisation: form.specialisation, interests: form.interests, businessProfile: form.businessProfile, notes: form.notes }); }
    catch (e) { console.error(e); }
    setSaving(false);
  }

  return (
    <div className="space-y-4">
      <Card title="Personal Details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Full Name" value={form.name} onChange={v => set('name', v)} />
          <Field label="Job Title" value={form.jobTitle} onChange={v => set('jobTitle', v)} />
          <Field label="Company" value={form.company} onChange={v => set('company', v)} />
          <Field label="Email" value={form.email} onChange={v => set('email', v)} />
          <Field label="Phone" value={form.phone} onChange={v => set('phone', v)} />
          <Field label="Location" value={form.location} onChange={v => set('location', v)} />
        </div>
      </Card>
      <Card title="Professional Profile">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="LinkedIn URL" value={form.linkedin} onChange={v => set('linkedin', v)} />
          <Field label="Industry" value={form.industry} onChange={v => set('industry', v)} />
          <Field label="Specialisation" value={form.specialisation} onChange={v => set('specialisation', v)} />
          <Field label="Interests" value={form.interests} onChange={v => set('interests', v)} />
        </div>
        <div className="mt-4">
          <Field label="Business Profile" value={form.businessProfile} onChange={v => set('businessProfile', v)} textarea />
        </div>
      </Card>
      <Card title="Coach's Notes">
        <Field label="" value={form.notes} onChange={v => set('notes', v)} textarea />
      </Card>
      <button onClick={save} disabled={saving} className="px-6 py-2 bg-green-700 hover:bg-green-600 text-white rounded-lg font-medium transition disabled:opacity-50">
        {saving ? 'Saving...' : 'Save All Changes'}
      </button>
    </div>
  );
}

function MeetingsTab({ meetings, coacheeId, userId, onCreate, onRemove }: any) {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ date: '', duration: '60', location: '', notes: '' });

  async function add() {
    await onCreate({ coacheeId: coacheeId as any, userId: userId as any, ...form });
    setForm({ date: '', duration: '60', location: '', notes: '' });
    setAdding(false);
  }

  const sorted = meetings ? [...meetings].sort((a: any, b: any) => (b.date || '').localeCompare(a.date || '')) : [];

  return (
    <Card title="Meeting History" action={<button onClick={() => setAdding(true)} className="text-sm text-green-400 hover:text-green-300">+ Add Meeting</button>}>
      {adding && (
        <div className="mb-4 p-4 bg-[#1E1E1E] rounded-lg space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date" value={form.date} onChange={v => setForm(f => ({ ...f, date: v }))} type="date" />
            <Field label="Duration (mins)" value={form.duration} onChange={v => setForm(f => ({ ...f, duration: v }))} />
          </div>
          <Field label="Location" value={form.location} onChange={v => setForm(f => ({ ...f, location: v }))} />
          <Field label="Notes" value={form.notes} onChange={v => setForm(f => ({ ...f, notes: v }))} textarea />
          <div className="flex gap-2">
            <button onClick={add} className="px-4 py-1.5 bg-green-700 text-white text-sm rounded-lg">Save</button>
            <button onClick={() => setAdding(false)} className="px-4 py-1.5 bg-[#333] text-gray-300 text-sm rounded-lg">Cancel</button>
          </div>
        </div>
      )}
      {sorted.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No meetings recorded yet</p>
      ) : sorted.map((m: any) => (
        <div key={m._id} className="flex items-start gap-3 py-3 border-b border-[#333] last:border-0">
          <div className="bg-green-500/15 rounded-lg px-3 py-2 text-center min-w-[48px]">
            <div className="text-[10px] uppercase text-green-400 font-bold">{m.date ? new Date(m.date).toLocaleDateString('en-GB', { month: 'short' }) : ''}</div>
            <div className="text-lg font-bold text-green-300">{m.date ? new Date(m.date).getDate() : ''}</div>
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-200">1-to-1 Session</div>
            <div className="text-xs text-gray-500">{m.duration ? m.duration + ' mins' : ''}{m.location ? ' · ' + m.location : ''}</div>
            {m.notes && <div className="text-sm text-gray-400 mt-1">{m.notes}</div>}
          </div>
          <button onClick={() => onRemove({ id: m._id })} className="text-gray-600 hover:text-red-400 text-sm">✕</button>
        </div>
      ))}
    </Card>
  );
}

function ActionsTab({ actions, coacheeId, coacheeName, userId, onCreate, onToggle, onRemove }: any) {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ text: '', assignee: '', due: '' });

  async function add() {
    if (!form.text.trim()) return;
    await onCreate({ coacheeId: coacheeId as any, userId: userId as any, text: form.text, assignee: form.assignee || coacheeName, due: form.due || undefined, done: false, status: 'todo' });
    setForm({ text: '', assignee: '', due: '' });
    setAdding(false);
  }

  const pending = actions?.filter((a: any) => !a.done) || [];
  const done = actions?.filter((a: any) => a.done) || [];

  return (
    <Card title="Action Items" action={<button onClick={() => setAdding(true)} className="text-sm text-green-400 hover:text-green-300">+ Add Action</button>}>
      {adding && (
        <div className="mb-4 p-4 bg-[#1E1E1E] rounded-lg space-y-3">
          <Field label="Action Item" value={form.text} onChange={v => setForm(f => ({ ...f, text: v }))} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Assigned To" value={form.assignee} onChange={v => setForm(f => ({ ...f, assignee: v }))} placeholder={coacheeName} />
            <Field label="Due Date" value={form.due} onChange={v => setForm(f => ({ ...f, due: v }))} type="date" />
          </div>
          <div className="flex gap-2">
            <button onClick={add} className="px-4 py-1.5 bg-green-700 text-white text-sm rounded-lg">Add</button>
            <button onClick={() => setAdding(false)} className="px-4 py-1.5 bg-[#333] text-gray-300 text-sm rounded-lg">Cancel</button>
          </div>
        </div>
      )}
      {[...pending, ...done].length === 0 ? (
        <p className="text-gray-500 text-center py-8">No action items yet</p>
      ) : [...pending, ...done].map((a: any) => (
        <div key={a._id} className="flex items-center gap-3 py-3 border-b border-[#333] last:border-0">
          <button onClick={() => onToggle({ id: a._id })}
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] transition ${a.done ? 'bg-green-500 border-green-500 text-white' : 'border-green-300 bg-green-500/10 text-transparent hover:text-green-400'}`}>
            ✓
          </button>
          <div className="flex-1">
            <div className={`text-sm ${a.done ? 'line-through text-gray-500' : 'text-gray-200'}`}>{a.text}</div>
            <div className="text-xs text-gray-500">{a.assignee}{a.due ? ' · Due ' + formatDate(a.due) : ''}</div>
          </div>
          {a.due && !a.done && (
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${new Date(a.due) < new Date() ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
              {new Date(a.due) < new Date() ? 'Overdue' : formatDate(a.due)}
            </span>
          )}
          <button onClick={() => onRemove({ id: a._id })} className="text-gray-600 hover:text-red-400 text-sm">✕</button>
        </div>
      ))}
    </Card>
  );
}

function ScheduleTab({ schedule, coachee, coacheeId, userId, onSave, actions }: any) {
  const [form, setForm] = useState({
    date: schedule?.date || '', time: schedule?.time || '', location: schedule?.location || '',
    duration: schedule?.duration || '60', agenda: schedule?.agenda || '',
  });
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    await onSave({ coacheeId: coacheeId as any, userId: userId as any, ...form });
    setSaving(false);
  }

  function downloadICS() {
    if (!form.date) return;
    const start = form.date.replace(/-/g, '') + 'T' + (form.time || '09:00').replace(/:/g, '') + '00';
    const dur = parseInt(form.duration) || 60;
    const sm = parseInt((form.time || '09:00').split(':')[0]) * 60 + parseInt((form.time || '09:00').split(':')[1]);
    const end = form.date.replace(/-/g, '') + 'T' + String(Math.floor((sm + dur) / 60)).padStart(2, '0') + String((sm + dur) % 60).padStart(2, '0') + '00';
    const ics = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nBEGIN:VEVENT\r\nDTSTART:${start}\r\nDTEND:${end}\r\nSUMMARY:Coaching - ${coachee.name}\r\nLOCATION:${form.location}\r\nEND:VEVENT\r\nEND:VCALENDAR`;
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
    a.download = `coaching-${coachee.name.replace(/\s+/g, '-').toLowerCase()}.ics`; a.click();
  }

  function emailRecap() {
    const pend = (actions || []).filter((a: any) => !a.done);
    let body = `Hi ${coachee.name.split(' ')[0]},\n\nRecap:\n\n`;
    pend.forEach((a: any, i: number) => { body += `${i + 1}. ${a.text}\n`; });
    if (form.date) body += `\nNext meeting: ${form.date} at ${form.time || 'TBC'}\n`;
    window.open(`mailto:${coachee.email || ''}?subject=${encodeURIComponent('Coaching Recap')}&body=${encodeURIComponent(body)}`);
  }

  return (
    <div className="bg-gradient-to-br from-green-500/10 to-[#2A2A2A] border border-green-500/20 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-100 mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Next Meeting</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Date" value={form.date} onChange={v => setForm(f => ({ ...f, date: v }))} type="date" />
        <Field label="Time" value={form.time} onChange={v => setForm(f => ({ ...f, time: v }))} type="time" />
        <Field label="Location" value={form.location} onChange={v => setForm(f => ({ ...f, location: v }))} />
        <Field label="Duration (mins)" value={form.duration} onChange={v => setForm(f => ({ ...f, duration: v }))} />
      </div>
      <div className="mt-4"><Field label="Agenda" value={form.agenda} onChange={v => setForm(f => ({ ...f, agenda: v }))} textarea /></div>
      <div className="flex flex-wrap gap-3 mt-4">
        <button onClick={save} disabled={saving} className="px-4 py-2 bg-green-700 hover:bg-green-600 text-white rounded-lg text-sm font-medium">{saving ? 'Saving...' : 'Save Schedule'}</button>
        <button onClick={downloadICS} className="px-4 py-2 bg-green-500/15 text-green-300 border border-green-500/30 rounded-lg text-sm hover:bg-green-500/25">📅 Calendar Invite</button>
        <button onClick={emailRecap} className="px-4 py-2 bg-green-500/15 text-green-300 border border-green-500/30 rounded-lg text-sm hover:bg-green-500/25">✉ Email Recap</button>
      </div>
    </div>
  );
}

function InsightsTab({ insights, coachee, coacheeId, userId, onRefresh }: any) {
  const [refreshing, setRefreshing] = useState(false);
  async function refresh() { setRefreshing(true); await onRefresh({ coacheeId: coacheeId as any, userId: userId as any, industry: coachee.industry || 'General' }); setRefreshing(false); }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-400">Industry: <strong className="text-gray-200">{coachee.industry || 'General'}</strong></span>
        <button onClick={refresh} disabled={refreshing} className="px-3 py-1.5 bg-green-500/15 text-green-300 border border-green-500/30 rounded-lg text-sm hover:bg-green-500/25 disabled:opacity-50">
          {refreshing ? 'Refreshing...' : '↻ Refresh Insights'}
        </button>
      </div>
      {(!insights || insights.length === 0) ? (
        <p className="text-gray-500 text-center py-8">Click "Refresh Insights" to load industry trends</p>
      ) : insights.map((ins: any) => (
        <div key={ins._id} className="bg-gradient-to-br from-green-500/10 to-[#2A2A2A] border border-green-500/20 rounded-xl p-4 mb-3">
          <div className="text-[10px] uppercase tracking-wider text-green-400 font-semibold mb-1">{ins.source}</div>
          <div className="text-sm font-semibold text-gray-100 mb-1">{ins.title}</div>
          <div className="text-sm text-gray-400 leading-relaxed">{ins.summary}</div>
        </div>
      ))}
    </div>
  );
}

function Card({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-[#2A2A2A] border border-[#333] rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-[#333] flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-100" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{title}</h2>
        {action}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function Field({ label, value, onChange, type, textarea, placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; textarea?: boolean; placeholder?: string }) {
  const cls = "w-full px-3 py-2 bg-[#1E1E1E] border border-[#444] rounded-lg text-gray-200 text-sm placeholder-gray-600 focus:outline-none focus:border-green-500";
  return (
    <div>
      {label && <label className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1 block">{label}</label>}
      {textarea ? (
        <textarea value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={cls + " min-h-[80px]"} />
      ) : (
        <input type={type || 'text'} value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={cls} />
      )}
    </div>
  );
}
