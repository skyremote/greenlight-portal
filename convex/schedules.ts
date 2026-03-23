import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const getByCoachee = query({
  args: { coacheeId: v.id("coachees") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("schedules")
      .withIndex("by_coachee", (q) => q.eq("coacheeId", args.coacheeId))
      .first();
  },
});

export const listByCoachee = query({
  args: { coacheeId: v.id("coachees") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("schedules")
      .withIndex("by_coachee", (q) => q.eq("coacheeId", args.coacheeId))
      .collect();
  },
});

export const listUpcoming = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    // Get all coachees for this user
    const coachees = await ctx.db
      .query("coachees")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const upcoming = [];
    const today = new Date().toISOString().split("T")[0];

    for (const coachee of coachees) {
      const schedules = await ctx.db
        .query("schedules")
        .withIndex("by_coachee", (q) => q.eq("coacheeId", coachee._id))
        .collect();

      for (const schedule of schedules) {
        if (schedule.date && schedule.date >= today) {
          upcoming.push({
            ...schedule,
            coacheeName: coachee.name,
          });
        }
      }
    }

    // Sort by date ascending
    upcoming.sort((a, b) => (a.date || "").localeCompare(b.date || ""));
    return upcoming;
  },
});

export const upsert = mutation({
  args: {
    coacheeId: v.id("coachees"),
    date: v.optional(v.string()),
    time: v.optional(v.string()),
    location: v.optional(v.string()),
    duration: v.optional(v.string()),
    agenda: v.optional(v.string()),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("schedules")
      .withIndex("by_coachee", (q) => q.eq("coacheeId", args.coacheeId))
      .first();

    if (existing) {
      const { coacheeId, userId, ...updates } = args;
      await ctx.db.patch(existing._id, updates);
      return existing._id;
    } else {
      return await ctx.db.insert("schedules", args);
    }
  },
});

export const create = mutation({
  args: {
    coacheeId: v.id("coachees"),
    date: v.optional(v.string()),
    time: v.optional(v.string()),
    location: v.optional(v.string()),
    duration: v.optional(v.string()),
    agenda: v.optional(v.string()),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("schedules", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("schedules"),
    date: v.optional(v.string()),
    time: v.optional(v.string()),
    location: v.optional(v.string()),
    duration: v.optional(v.string()),
    agenda: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const filtered: Record<string, any> = {};
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        filtered[key] = value;
      }
    }
    await ctx.db.patch(id, filtered);
  },
});

export const remove = mutation({
  args: { id: v.id("schedules") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
