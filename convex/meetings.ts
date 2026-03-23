import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const listByCoachee = query({
  args: { coacheeId: v.id("coachees") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("meetings")
      .withIndex("by_coachee", (q) => q.eq("coacheeId", args.coacheeId))
      .collect();
  },
});

export const create = mutation({
  args: {
    coacheeId: v.id("coachees"),
    date: v.string(),
    duration: v.optional(v.string()),
    location: v.optional(v.string()),
    notes: v.optional(v.string()),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("meetings", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("meetings"),
    date: v.optional(v.string()),
    duration: v.optional(v.string()),
    location: v.optional(v.string()),
    notes: v.optional(v.string()),
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
  args: { id: v.id("meetings") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
