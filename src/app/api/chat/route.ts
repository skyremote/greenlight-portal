import OpenAI from "openai";
import { NextRequest } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are Greenlight AI, a helpful coaching assistant built into the Greenlight Coaching Portal. You help coaches with:

- Preparing for coaching sessions
- Suggesting coaching questions and frameworks
- Drafting meeting recaps and action items
- Providing leadership development insights
- Offering advice on coaching methodologies (GROW, CLEAR, OSKAR, etc.)
- Helping with goal setting and accountability frameworks

You are warm, professional, and concise. Use British English. Keep responses focused and actionable. If asked about something outside coaching, politely redirect to coaching topics.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return Response.json({ error: "Messages array required" }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.slice(-20), // Keep last 20 messages for context
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
