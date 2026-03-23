import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const listByCoachee = query({
  args: { coacheeId: v.id("coachees") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("actionItems")
      .withIndex("by_coachee", (q) => q.eq("coacheeId", args.coacheeId))
      .collect();
  },
});

export const listByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("actionItems")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

export const create = mutation({
  args: {
    coacheeId: v.id("coachees"),
    text: v.string(),
    assignee: v.optional(v.string()),
    due: v.optional(v.string()),
    done: v.boolean(),
    status: v.optional(v.string()),
    order: v.optional(v.number()),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("actionItems", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("actionItems"),
    text: v.optional(v.string()),
    assignee: v.optional(v.string()),
    due: v.optional(v.string()),
    done: v.optional(v.boolean()),
    status: v.optional(v.string()),
    order: v.optional(v.number()),
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

export const toggle = mutation({
  args: { id: v.id("actionItems") },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.id);
    if (!item) throw new Error("Action item not found");
    await ctx.db.patch(args.id, { done: !item.done });
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("actionItems"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const done = args.status === "done";
    await ctx.db.patch(args.id, { status: args.status, done });
  },
});

export const updateOrder = mutation({
  args: {
    updates: v.array(
      v.object({
        id: v.id("actionItems"),
        order: v.number(),
        status: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    for (const update of args.updates) {
      const patch: Record<string, any> = { order: update.order };
      if (update.status !== undefined) {
        patch.status = update.status;
        patch.done = update.status === "done";
      }
      await ctx.db.patch(update.id, patch);
    }
  },
});

export const remove = mutation({
  args: { id: v.id("actionItems") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
