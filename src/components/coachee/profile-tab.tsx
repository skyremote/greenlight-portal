"use client";

import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface CoacheeData {
  _id: Id<"coachees">;
  name: string;
  email: string;
  jobTitle?: string;
  company?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  industry?: string;
  specialisation?: string;
  businessProfile?: string;
  interests?: string;
  notes?: string;
}

interface ProfileTabProps {
  coachee: CoacheeData;
}

export function ProfileTab({ coachee }: ProfileTabProps) {
  const updateCoachee = useMutation(api.coachees.update);

  const [form, setForm] = useState({
    name: coachee.name ?? "",
    email: coachee.email ?? "",
    jobTitle: coachee.jobTitle ?? "",
    company: coachee.company ?? "",
    phone: coachee.phone ?? "",
    location: coachee.location ?? "",
    linkedin: coachee.linkedin ?? "",
    industry: coachee.industry ?? "",
    specialisation: coachee.specialisation ?? "",
    businessProfile: coachee.businessProfile ?? "",
    interests: coachee.interests ?? "",
    notes: coachee.notes ?? "",
  });

  useEffect(() => {
    setForm({
      name: coachee.name ?? "",
      email: coachee.email ?? "",
      jobTitle: coachee.jobTitle ?? "",
      company: coachee.company ?? "",
      phone: coachee.phone ?? "",
      location: coachee.location ?? "",
      linkedin: coachee.linkedin ?? "",
      industry: coachee.industry ?? "",
      specialisation: coachee.specialisation ?? "",
      businessProfile: coachee.businessProfile ?? "",
      interests: coachee.interests ?? "",
      notes: coachee.notes ?? "",
    });
  }, [coachee]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    await updateCoachee({
      id: coachee._id,
      name: form.name,
      email: form.email,
      jobTitle: form.jobTitle || undefined,
      company: form.company || undefined,
      phone: form.phone || undefined,
      location: form.location || undefined,
      linkedin: form.linkedin || undefined,
      industry: form.industry || undefined,
      specialisation: form.specialisation || undefined,
      businessProfile: form.businessProfile || undefined,
      interests: form.interests || undefined,
      notes: form.notes || undefined,
    });
  };

  const handleDiscard = () => {
    setForm({
      name: coachee.name ?? "",
      email: coachee.email ?? "",
      jobTitle: coachee.jobTitle ?? "",
      company: coachee.company ?? "",
      phone: coachee.phone ?? "",
      location: coachee.location ?? "",
      linkedin: coachee.linkedin ?? "",
      industry: coachee.industry ?? "",
      specialisation: coachee.specialisation ?? "",
      businessProfile: coachee.businessProfile ?? "",
      interests: coachee.interests ?? "",
      notes: coachee.notes ?? "",
    });
  };

  return (
    <div className="space-y-6">
      {/* Personal Details */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Name</label>
              <Input
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Job Title</label>
              <Input
                value={form.jobTitle}
                onChange={(e) => handleChange("jobTitle", e.target.value)}
                placeholder="e.g. Managing Director"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Company</label>
              <Input
                value={form.company}
                onChange={(e) => handleChange("company", e.target.value)}
                placeholder="e.g. Acme Ltd"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Phone</label>
              <Input
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="e.g. +44 7700 900000"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Location</label>
              <Input
                value={form.location}
                onChange={(e) => handleChange("location", e.target.value)}
                placeholder="e.g. London, UK"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Profile */}
      <Card>
        <CardHeader>
          <CardTitle>Professional Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">LinkedIn URL</label>
            <div className="flex gap-2">
              <Input
                value={form.linkedin}
                onChange={(e) => handleChange("linkedin", e.target.value)}
                placeholder="https://linkedin.com/in/..."
                className="flex-1"
              />
              <Button
                variant="secondary"
                size="sm"
                disabled={!form.linkedin}
                onClick={() => {
                  if (form.linkedin) {
                    window.open(form.linkedin, "_blank");
                  }
                }}
              >
                Populate
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Industry</label>
              <Input
                value={form.industry}
                onChange={(e) => handleChange("industry", e.target.value)}
                placeholder="e.g. Technology"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Specialisation</label>
              <Input
                value={form.specialisation}
                onChange={(e) => handleChange("specialisation", e.target.value)}
                placeholder="e.g. SaaS, B2B Sales"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Business Profile</label>
            <Textarea
              value={form.businessProfile}
              onChange={(e) => handleChange("businessProfile", e.target.value)}
              placeholder="Brief overview of their business..."
              rows={4}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Interests</label>
            <Input
              value={form.interests}
              onChange={(e) => handleChange("interests", e.target.value)}
              placeholder="e.g. Leadership, Growth Strategy"
            />
          </div>
        </CardContent>
      </Card>

      {/* Coach's Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Coach&apos;s Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={form.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
            placeholder="Private notes about this coachee..."
            rows={6}
          />
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end">
        <Button variant="ghost" onClick={handleDiscard}>
          Discard Changes
        </Button>
        <Button onClick={handleSave}>Save All Changes</Button>
      </div>
    </div>
  );
}
