import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    username: v.string(),
    passwordHash: v.string(),
  }).index("by_username", ["username"]),

  sessions: defineTable({
    token: v.string(),
    userId: v.id("users"),
    expiresAt: v.number(),
  }).index("by_token", ["token"]),

  coachees: defineTable({
    name: v.string(),
    email: v.string(),
    linkedin: v.optional(v.string()),
    businessProfile: v.optional(v.string()),
    notes: v.optional(v.string()),
    industry: v.optional(v.string()),
    interests: v.optional(v.string()),
    photo: v.optional(v.string()),
    jobTitle: v.optional(v.string()),
    company: v.optional(v.string()),
    specialisation: v.optional(v.string()),
    phone: v.optional(v.string()),
    location: v.optional(v.string()),
    order: v.number(),
    userId: v.id("users"),
  }).index("by_user", ["userId"]),

  meetings: defineTable({
    coacheeId: v.id("coachees"),
    date: v.string(),
    duration: v.optional(v.string()),
    location: v.optional(v.string()),
    notes: v.optional(v.string()),
    userId: v.id("users"),
  }).index("by_coachee", ["coacheeId"]),

  actionItems: defineTable({
    coacheeId: v.id("coachees"),
    text: v.string(),
    assignee: v.optional(v.string()),
    due: v.optional(v.string()),
    done: v.boolean(),
    status: v.optional(v.string()),
    order: v.optional(v.number()),
    userId: v.id("users"),
  }).index("by_coachee", ["coacheeId"]).index("by_user", ["userId"]),

  schedules: defineTable({
    coacheeId: v.id("coachees"),
    date: v.optional(v.string()),
    time: v.optional(v.string()),
    location: v.optional(v.string()),
    duration: v.optional(v.string()),
    agenda: v.optional(v.string()),
    userId: v.id("users"),
  }).index("by_coachee", ["coacheeId"]),

  insights: defineTable({
    coacheeId: v.id("coachees"),
    source: v.string(),
    title: v.string(),
    summary: v.string(),
    userId: v.id("users"),
  }).index("by_coachee", ["coacheeId"]),

  speakers: defineTable({
    name: v.string(),
    topic: v.optional(v.string()),
    date: v.optional(v.string()),
    profile: v.optional(v.string()),
    bio: v.optional(v.string()),
    notes: v.optional(v.string()),
    userId: v.id("users"),
  }).index("by_user", ["userId"]),

  speakerRatings: defineTable({
    speakerId: v.id("speakers"),
    coacheeId: v.id("coachees"),
    score: v.number(),
    userId: v.id("users"),
  }).index("by_speaker", ["speakerId"]),

  settings: defineTable({
    userId: v.id("users"),
    key: v.string(),
    value: v.string(),
  }).index("by_user_key", ["userId", "key"]),
});
