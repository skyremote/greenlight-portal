import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("coachees")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

export const get = query({
  args: { id: v.id("coachees") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("coachees", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("coachees"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
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
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    // Filter out undefined values
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
  args: { id: v.id("coachees") },
  handler: async (ctx, args) => {
    // Delete related records first
    const meetings = await ctx.db
      .query("meetings")
      .withIndex("by_coachee", (q) => q.eq("coacheeId", args.id))
      .collect();
    for (const m of meetings) {
      await ctx.db.delete(m._id);
    }

    const actionItems = await ctx.db
      .query("actionItems")
      .withIndex("by_coachee", (q) => q.eq("coacheeId", args.id))
      .collect();
    for (const a of actionItems) {
      await ctx.db.delete(a._id);
    }

    const schedules = await ctx.db
      .query("schedules")
      .withIndex("by_coachee", (q) => q.eq("coacheeId", args.id))
      .collect();
    for (const s of schedules) {
      await ctx.db.delete(s._id);
    }

    const insights = await ctx.db
      .query("insights")
      .withIndex("by_coachee", (q) => q.eq("coacheeId", args.id))
      .collect();
    for (const i of insights) {
      await ctx.db.delete(i._id);
    }

    await ctx.db.delete(args.id);
  },
});

export const updateOrder = mutation({
  args: {
    updates: v.array(
      v.object({
        id: v.id("coachees"),
        order: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    for (const update of args.updates) {
      await ctx.db.patch(update.id, { order: update.order });
    }
  },
});
