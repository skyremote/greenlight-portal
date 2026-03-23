import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

export const seedCoachees = internalMutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const defaultCoachees = [
      {
        name: "Martin Knights",
        email: "martin@coaching4schools.com",
        company: "Coaching-4-Schools",
        jobTitle: "Founder",
        industry: "education",
        location: "UK",
        order: 0,
      },
      {
        name: "William Briggs",
        email: "will@hangerstorageandlogisitcs.co.uk",
        company: "Hanger Storage & Logistics",
        jobTitle: "Managing Director",
        industry: "logistics",
        location: "UK",
        order: 1,
      },
      {
        name: "Matt Laughlin",
        email: "mlaughlin@receptional.com",
        company: "Receptional",
        jobTitle: "Managing Director",
        industry: "marketing",
        location: "UK",
        order: 2,
      },
      {
        name: "Alice Russell",
        email: "ar@bondevents.com",
        company: "BOND Events",
        jobTitle: "Director",
        industry: "events",
        location: "UK",
        order: 3,
      },
      {
        name: "Bill Trim",
        email: "bill.trim@acora.com",
        company: "Acora",
        jobTitle: "CEO",
        industry: "technology",
        location: "UK",
        order: 4,
      },
      {
        name: "James Howland",
        email: "jameshowland@roguefilms.co.uk",
        company: "Rogue Films",
        jobTitle: "Managing Director",
        industry: "film",
        location: "UK",
        order: 5,
      },
      {
        name: "Kate Taylor",
        email: "Katetaylor@roguefilms.co.uk",
        company: "Rogue Films",
        jobTitle: "Executive Producer",
        industry: "film",
        location: "UK",
        order: 6,
      },
      {
        name: "Rachel O'Grady",
        email: "Rachel.ogrady@rivapartnership.co.uk",
        company: "Riva Partnership",
        jobTitle: "Director",
        industry: "general",
        location: "UK",
        order: 7,
      },
      {
        name: "Vanessa Cardwell",
        email: "vanessa@biteitmarketing.com",
        company: "Bite IT Marketing",
        jobTitle: "Managing Director",
        industry: "marketing",
        location: "UK",
        order: 8,
      },
    ];

    for (const coachee of defaultCoachees) {
      await ctx.db.insert("coachees", {
        ...coachee,
        userId: args.userId,
      });
    }
  },
});
