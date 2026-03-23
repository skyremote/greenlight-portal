import OpenAI from "openai";
import { NextRequest } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function buildSystemPrompt(context?: {
  coachees?: any[];
  actions?: any[];
  speakers?: any[];
}) {
  let contextBlock = "";

  if (context?.coachees?.length) {
    contextBlock += "\n\n## Current Coachees\n";
    for (const c of context.coachees) {
      contextBlock += `- **${c.name}**${c.jobTitle ? ` — ${c.jobTitle}` : ""}${c.company ? ` at ${c.company}` : ""}${c.bio ? ` (${c.bio})` : ""}\n`;
    }
  }

  if (context?.actions?.length) {
    const pending = context.actions.filter((a: any) => !a.done);
    const done = context.actions.filter((a: any) => a.done);
    contextBlock += `\n\n## Action Items\n`;
    contextBlock += `**Pending (${pending.length}):**\n`;
    for (const a of pending.slice(0, 20)) {
      contextBlock += `- ${a.text}${a.coacheeName ? ` (${a.coacheeName})` : ""}${a.status ? ` [${a.status}]` : ""}\n`;
    }
    contextBlock += `\n**Completed (${done.length}):**\n`;
    for (const a of done.slice(0, 10)) {
      contextBlock += `- ${a.text}${a.coacheeName ? ` (${a.coacheeName})` : ""}\n`;
    }
  }

  if (context?.speakers?.length) {
    contextBlock += `\n\n## Speaker Notes\n`;
    for (const s of context.speakers) {
      contextBlock += `- **${s.name}**${s.topic ? ` — "${s.topic}"` : ""}${s.date ? ` (${s.date})` : ""}${s.notes ? `\n  Notes: ${s.notes}` : ""}\n`;
    }
  }

  return `You are Greenlight AI, the coaching assistant built into the Greenlight Coaching Portal. You have full context of the coach's current data and can help them be more effective.

## Your Capabilities
- You know all the coach's coachees, their profiles, and pending actions
- You can suggest coaching questions, frameworks (GROW, CLEAR, OSKAR), and session prep
- You can help draft meeting recaps, emails, and action items
- You can identify coachees who may need attention (overdue actions, no recent meetings)
- You can suggest speaker topics based on coachee needs
- You can help with goal setting and accountability frameworks
- When asked to create/suggest actions, format them clearly so the coach can add them

## Important Rules
- Be warm, professional, and concise
- Use British English
- Reference specific coachees by name when relevant
- If you notice coachees with many pending actions, proactively mention it
- Keep responses focused and actionable — coaches are busy people
- Format lists and structured content with markdown
${contextBlock}`;
}

export async function POST(req: NextRequest) {
  try {
    const { messages, context } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return Response.json({ error: "Messages array required" }, { status: 400 });
    }

    const systemPrompt = buildSystemPrompt(context);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.slice(-20),
      ],
      max_tokens: 1024,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";

    return Response.json({ reply });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return Response.json(
      { error: error?.message || "Failed to get response" },
      { status: 500 }
    );
  }
}
