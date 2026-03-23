import { v } from "convex/values";
import { internalMutation, mutation } from "./_generated/server";

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
        linkedin: "https://www.linkedin.com/in/martin-knights-823b5849/",
        location: "UK",
        notes:
          "Former Royal Marine and Senior Educational Leader. Keynote speaker specialising in team culture & belonging workshops. Partners with Anderson Quigley to coach school leaders. Works nationally and internationally — Royal Marines background drives his focus on team performance and well-being. Has coached sports teams to nationally recognised successes and served as a senior leader in some of the best schools in the world.",
        order: 0,
      },
      {
        name: "William Briggs",
        email: "will@hangerstorageandlogisitcs.co.uk",
        company: "Hanger Storage & Logistics",
        jobTitle: "General Manager",
        industry: "logistics & warehousing",
        linkedin: "https://www.linkedin.com/in/william-briggs-1bb4a516a/",
        location: "UK",
        notes:
          "Based at Building 345, Heyford Park, Upper Heyford — a historic A-Type hangar originally built in 1928. Creates bespoke storage and end-to-end logistics solutions for world-renowned UK and international retailers. Site has 24/7 on-site security with vehicle tracking.",
        order: 1,
      },
      {
        name: "Matt Loughlin",
        email: "mlaughlin@receptional.com",
        company: "Receptional",
        jobTitle: "Commercial Director",
        industry: "digital marketing & igaming",
        linkedin: "https://www.linkedin.com/in/mattloughlin/",
        location: "UK",
        notes:
          "Joined Receptional in 2008 and co-led the 2017 management buyout with Justin Deaville. Has run hundreds of paid search campaigns including large-scale clients (£100k+ monthly spend) in travel, retail, finance and gaming. Member of the Chartered Institute of Marketing, AdWords/Analytics/Bing certified. Receptional has delivered over £1bn in Gross Gaming Revenue for clients and won Best PPC Campaign Large at UK Search Awards 2024.",
        order: 2,
      },
      {
        name: "Alice Russell",
        email: "ar@bondevents.com",
        company: "BOND Events",
        jobTitle: "CEO",
        industry: "architecture & design events",
        linkedin: "https://www.linkedin.com/in/alice-r-0427a321/",
        location: "UK",
        notes:
          "Appointed CEO of BOND Events in September 2024 — the most significant leadership shift in the company's 20-year history. Joined BOND in 2017 after marketing roles at Marcus Evans and Haymarket Business Media. At 38, among fewer than 10% of female senior leaders under 40 in the UK. BOND runs 8 annual 1-to-1 meetings forums globally for the architecture & design community across commercial, hospitality, residential and interiors sectors.",
        order: 3,
      },
      {
        name: "Bill Trim",
        email: "bill.trim@acora.com",
        company: "Acora",
        jobTitle: "CEO",
        industry: "IT services & cybersecurity",
        linkedin: "https://www.linkedin.com/in/billtrim/",
        location: "UK",
        notes:
          "Leading Acora through aggressive acquisition-led growth — 7 acquisitions in 5 years including Elastacloud (Data & AI), Hydras (ITSM/automation, April 2025), Secrutiny, Veber, and Computer Service Centre. Company has expanded from managed IT into cybersecurity, cloud, data & AI. Leads a team of IT project delivery experts.",
        order: 4,
      },
      {
        name: "James Howland",
        email: "jameshowland@roguefilms.co.uk",
        company: "Rogue Films",
        jobTitle: "Head of Production / Partner",
        industry: "film & media production",
        linkedin: "https://www.linkedin.com/in/james-howland/",
        location: "UK",
        notes:
          "Became joint owner of Rogue Films in early 2025 when founder Charlie Crompton stepped down. Since joining in 2019, he and Kate Taylor have signed 13 directors to the roster, increased production staff tenfold, and launched REBEL — their emerging talent platform. Rogue has funded and produced three multi-award-winning short films with a feature in development.",
        order: 5,
      },
      {
        name: "Kate Taylor",
        email: "Katetaylor@roguefilms.co.uk",
        company: "Rogue Films",
        jobTitle: "Managing Director / Executive Producer",
        industry: "film & media production",
        linkedin: "https://www.linkedin.com/in/kate-taylor-executive-producer-managing-director/",
        location: "UK",
        notes:
          "Joint owner of Rogue Films alongside James Howland since early 2025. Previously at Skunk before joining Rogue. Produced the short film 'Mrs Meitlemeihr' which won multiple international film festival awards including Best International Short Film at several Academy-qualifying festivals. Judges the Direction category at the shots Awards EMEA.",
        order: 6,
      },
      {
        name: "Rachel O'Grady",
        email: "Rachel.ogrady@rivapartnership.co.uk",
        company: "Riva Partnership",
        jobTitle: "Director",
        industry: "professional services & consulting",
        linkedin: "https://www.linkedin.com/in/rachelogradyriva/",
        location: "UK",
        notes:
          "Director at Riva Partnership, a recently established professional services and consulting firm based in the UK.",
        order: 7,
      },
      {
        name: "Vanessa Cardwell",
        email: "vanessa@biteitmarketing.com",
        company: "Bite IT Marketing",
        jobTitle: "Managing Director & CMO",
        industry: "B2B technology marketing",
        linkedin: "https://www.linkedin.com/in/vcardwell/",
        location: "UK",
        notes:
          "Founded Bite IT Marketing in January 2017 (90% shareholder). Company celebrated its 8th anniversary in 2025. Specialises in B2B marketing across cybersecurity, networking and cloud sectors. Featured in 'Influential Women in Tech' podcast by Core to Cloud. Active thought leader publishing content on AI tools and marketing strategy. Palo Alto Networks Marketing Partner of the Year 2018.",
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

// One-time migration to update existing coachees with LinkedIn URLs, industries, titles, and notes
export const migrateCoacheeProfiles = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const updates: Record<
      string,
      {
        name?: string;
        jobTitle?: string;
        industry?: string;
        linkedin?: string;
        notes?: string;
      }
    > = {
      "martin@coaching4schools.com": {
        linkedin: "https://www.linkedin.com/in/martin-knights-823b5849/",
        industry: "education",
        notes:
          "Former Royal Marine and Senior Educational Leader. Keynote speaker specialising in team culture & belonging workshops. Partners with Anderson Quigley to coach school leaders. Works nationally and internationally — Royal Marines background drives his focus on team performance and well-being. Has coached sports teams to nationally recognised successes and served as a senior leader in some of the best schools in the world.",
      },
      "will@hangerstorageandlogisitcs.co.uk": {
        jobTitle: "General Manager",
        industry: "logistics & warehousing",
        linkedin: "https://www.linkedin.com/in/william-briggs-1bb4a516a/",
        notes:
          "Based at Building 345, Heyford Park, Upper Heyford — a historic A-Type hangar originally built in 1928. Creates bespoke storage and end-to-end logistics solutions for world-renowned UK and international retailers. Site has 24/7 on-site security with vehicle tracking.",
      },
      "mlaughlin@receptional.com": {
        name: "Matt Loughlin",
        jobTitle: "Commercial Director",
        industry: "digital marketing & igaming",
        linkedin: "https://www.linkedin.com/in/mattloughlin/",
        notes:
          "Joined Receptional in 2008 and co-led the 2017 management buyout with Justin Deaville. Has run hundreds of paid search campaigns including large-scale clients (£100k+ monthly spend) in travel, retail, finance and gaming. Member of the Chartered Institute of Marketing, AdWords/Analytics/Bing certified. Receptional has delivered over £1bn in Gross Gaming Revenue for clients and won Best PPC Campaign Large at UK Search Awards 2024.",
      },
      "ar@bondevents.com": {
        jobTitle: "CEO",
        industry: "architecture & design events",
        linkedin: "https://www.linkedin.com/in/alice-r-0427a321/",
        notes:
          "Appointed CEO of BOND Events in September 2024 — the most significant leadership shift in the company's 20-year history. Joined BOND in 2017 after marketing roles at Marcus Evans and Haymarket Business Media. At 38, among fewer than 10% of female senior leaders under 40 in the UK. BOND runs 8 annual 1-to-1 meetings forums globally for the architecture & design community across commercial, hospitality, residential and interiors sectors.",
      },
      "bill.trim@acora.com": {
        industry: "IT services & cybersecurity",
        linkedin: "https://www.linkedin.com/in/billtrim/",
        notes:
          "Leading Acora through aggressive acquisition-led growth — 7 acquisitions in 5 years including Elastacloud (Data & AI), Hydras (ITSM/automation, April 2025), Secrutiny, Veber, and Computer Service Centre. Company has expanded from managed IT into cybersecurity, cloud, data & AI. Leads a team of IT project delivery experts.",
      },
      "jameshowland@roguefilms.co.uk": {
        jobTitle: "Head of Production / Partner",
        industry: "film & media production",
        linkedin: "https://www.linkedin.com/in/james-howland/",
        notes:
          "Became joint owner of Rogue Films in early 2025 when founder Charlie Crompton stepped down. Since joining in 2019, he and Kate Taylor have signed 13 directors to the roster, increased production staff tenfold, and launched REBEL — their emerging talent platform. Rogue has funded and produced three multi-award-winning short films with a feature in development.",
      },
      "Katetaylor@roguefilms.co.uk": {
        jobTitle: "Managing Director / Executive Producer",
        industry: "film & media production",
        linkedin:
          "https://www.linkedin.com/in/kate-taylor-executive-producer-managing-director/",
        notes:
          "Joint owner of Rogue Films alongside James Howland since early 2025. Previously at Skunk before joining Rogue. Produced the short film 'Mrs Meitlemeihr' which won multiple international film festival awards including Best International Short Film at several Academy-qualifying festivals. Judges the Direction category at the shots Awards EMEA.",
      },
      "Rachel.ogrady@rivapartnership.co.uk": {
        industry: "professional services & consulting",
        linkedin: "https://www.linkedin.com/in/rachelogradyriva/",
        notes:
          "Director at Riva Partnership, a recently established professional services and consulting firm based in the UK.",
      },
      "vanessa@biteitmarketing.com": {
        jobTitle: "Managing Director & CMO",
        industry: "B2B technology marketing",
        linkedin: "https://www.linkedin.com/in/vcardwell/",
        notes:
          "Founded Bite IT Marketing in January 2017 (90% shareholder). Company celebrated its 8th anniversary in 2025. Specialises in B2B marketing across cybersecurity, networking and cloud sectors. Featured in 'Influential Women in Tech' podcast by Core to Cloud. Active thought leader publishing content on AI tools and marketing strategy. Palo Alto Networks Marketing Partner of the Year 2018.",
      },
    };

    const coachees = await ctx.db
      .query("coachees")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    let updated = 0;
    for (const coachee of coachees) {
      const patch = updates[coachee.email];
      if (patch) {
        await ctx.db.patch(coachee._id, patch);
        updated++;
      }
    }

    return { updated, total: coachees.length };
  },
});
