import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("speakers")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

export const get = query({
  args: { id: v.id("speakers") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    topic: v.optional(v.string()),
    date: v.optional(v.string()),
    profile: v.optional(v.string()),
    bio: v.optional(v.string()),
    notes: v.optional(v.string()),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("speakers", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("speakers"),
    name: v.optional(v.string()),
    topic: v.optional(v.string()),
    date: v.optional(v.string()),
    profile: v.optional(v.string()),
    bio: v.optional(v.string()),
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
  args: { id: v.id("speakers") },
  handler: async (ctx, args) => {
    // Delete related ratings first
    const ratings = await ctx.db
      .query("speakerRatings")
      .withIndex("by_speaker", (q) => q.eq("speakerId", args.id))
      .collect();
    for (const r of ratings) {
      await ctx.db.delete(r._id);
    }
    await ctx.db.delete(args.id);
  },
});

// Speaker Ratings

export const getRatings = query({
  args: { speakerId: v.id("speakers") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("speakerRatings")
      .withIndex("by_speaker", (q) => q.eq("speakerId", args.speakerId))
      .collect();
  },
});

export const rate = mutation({
  args: {
    speakerId: v.id("speakers"),
    coacheeId: v.id("coachees"),
    score: v.number(),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Check if a rating already exists for this speaker/coachee pair
    const existing = await ctx.db
      .query("speakerRatings")
      .withIndex("by_speaker", (q) => q.eq("speakerId", args.speakerId))
      .collect();

    const existingRating = existing.find((r) => r.coacheeId === args.coacheeId);

    if (existingRating) {
      await ctx.db.patch(existingRating._id, { score: args.score });
      return existingRating._id;
    } else {
      return await ctx.db.insert("speakerRatings", args);
    }
  },
});

export const getAverageRating = query({
  args: { speakerId: v.id("speakers") },
  handler: async (ctx, args) => {
    const ratings = await ctx.db
      .query("speakerRatings")
      .withIndex("by_speaker", (q) => q.eq("speakerId", args.speakerId))
      .collect();

    if (ratings.length === 0) return { average: 0, count: 0 };

    const total = ratings.reduce((sum, r) => sum + r.score, 0);
    return {
      average: Math.round((total / ratings.length) * 10) / 10,
      count: ratings.length,
    };
  },
});
