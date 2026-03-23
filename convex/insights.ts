import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const listByCoachee = query({
  args: { coacheeId: v.id("coachees") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("insights")
      .withIndex("by_coachee", (q) => q.eq("coacheeId", args.coacheeId))
      .collect();
  },
});

export const create = mutation({
  args: {
    coacheeId: v.id("coachees"),
    source: v.string(),
    title: v.string(),
    summary: v.string(),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("insights", args);
  },
});

export const remove = mutation({
  args: { id: v.id("insights") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const refresh = mutation({
  args: {
    coacheeId: v.id("coachees"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Get the coachee to determine their industry
    const coachee = await ctx.db.get(args.coacheeId);
    if (!coachee) throw new Error("Coachee not found");

    // Clear existing insights for this coachee
    const existing = await ctx.db
      .query("insights")
      .withIndex("by_coachee", (q) => q.eq("coacheeId", args.coacheeId))
      .collect();
    for (const insight of existing) {
      await ctx.db.delete(insight._id);
    }

    // Generate hardcoded industry insights based on coachee's industry
    const industry = (coachee.industry || "general").toLowerCase();
    const insightsByIndustry: Record<string, Array<{ source: string; title: string; summary: string }>> = {
      education: [
        { source: "Industry Report", title: "EdTech Growth Trends", summary: "The education technology sector is projected to grow 16% annually, with AI-powered personalised learning leading adoption." },
        { source: "Market Analysis", title: "Remote Learning Evolution", summary: "Hybrid learning models are becoming the standard, with 73% of institutions planning permanent digital integration." },
        { source: "Leadership Insight", title: "Teacher Retention Strategies", summary: "Schools investing in professional development and mentoring programmes see 40% higher teacher retention rates." },
      ],
      logistics: [
        { source: "Industry Report", title: "Supply Chain Automation", summary: "Warehouse automation adoption has increased 25% year-over-year, with robotics and AI driving efficiency gains." },
        { source: "Market Analysis", title: "Last-Mile Delivery Innovation", summary: "Electric vehicle fleets and micro-fulfilment centres are reshaping last-mile logistics economics." },
        { source: "Leadership Insight", title: "Sustainability in Logistics", summary: "Companies with green logistics strategies report 15% cost savings and improved client retention." },
      ],
      marketing: [
        { source: "Industry Report", title: "Digital Marketing ROI Trends", summary: "Content marketing delivers 3x more leads per pound spent compared to traditional advertising channels." },
        { source: "Market Analysis", title: "AI in Marketing Automation", summary: "AI-driven personalisation is increasing conversion rates by up to 30% for early adopters." },
        { source: "Leadership Insight", title: "Brand Authenticity", summary: "92% of consumers trust brands that demonstrate genuine purpose and transparency in their communications." },
      ],
      events: [
        { source: "Industry Report", title: "Hybrid Events Growth", summary: "The hybrid events market is expected to reach $1.8B by 2027, combining in-person and virtual experiences." },
        { source: "Market Analysis", title: "Event Technology Stack", summary: "Event platforms integrating AI matchmaking and networking tools see 45% higher attendee satisfaction." },
        { source: "Leadership Insight", title: "Sustainable Events", summary: "Carbon-neutral event practices are becoming a key differentiator, with 68% of attendees preferring eco-conscious organisers." },
      ],
      technology: [
        { source: "Industry Report", title: "Managed Services Growth", summary: "The managed IT services market is growing at 12% CAGR, driven by cybersecurity and cloud migration demands." },
        { source: "Market Analysis", title: "Cybersecurity Priorities", summary: "SMEs are increasing security budgets by 20% on average, creating opportunities for managed security providers." },
        { source: "Leadership Insight", title: "Client Success Metrics", summary: "IT service providers tracking NPS and resolution times see 35% higher client lifetime value." },
      ],
      film: [
        { source: "Industry Report", title: "Commercial Production Trends", summary: "Branded content and short-form video production are growing 28% annually as brands shift media budgets." },
        { source: "Market Analysis", title: "Production Technology", summary: "Virtual production techniques are reducing costs by up to 30% while enabling more creative flexibility." },
        { source: "Leadership Insight", title: "Talent Management in Production", summary: "Production companies investing in diverse talent pipelines are winning more pitches and retaining top creatives." },
      ],
      general: [
        { source: "Industry Report", title: "Leadership Development Trends", summary: "Companies investing in executive coaching see 5.7x ROI through improved leadership effectiveness and team performance." },
        { source: "Market Analysis", title: "Business Growth Strategies", summary: "Organisations with clear strategic planning processes are 2.5x more likely to achieve above-average growth." },
        { source: "Leadership Insight", title: "Employee Engagement Impact", summary: "Businesses with highly engaged teams show 21% greater profitability and 17% higher productivity." },
      ],
    };

    const selectedInsights = insightsByIndustry[industry] || insightsByIndustry["general"];

    for (const insight of selectedInsights) {
      await ctx.db.insert("insights", {
        coacheeId: args.coacheeId,
        source: insight.source,
        title: insight.title,
        summary: insight.summary,
        userId: args.userId,
      });
    }

    return selectedInsights.length;
  },
});
