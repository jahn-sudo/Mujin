import Anthropic from "@anthropic-ai/sdk";

let _client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!_client) {
    _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return _client;
}

const SYSTEM_PROMPT = `You are an assessment tool for a venture scholarship program.
Your job is to evaluate student monthly reflections and determine if they are meaningful.

A reflection is MEANINGFUL if it meets ALL of the following criteria:
1. At least 50 words
2. Coherent prose (not gibberish, filler, or copy-paste)
3. Topically relevant — discusses at least one of: venture progress, business struggles, personal learnings, or observations about peers

A reflection is NOT_MEANINGFUL if it:
- Is under 50 words
- Is incoherent or clearly filler text (e.g. "lorem ipsum", repeated words, random characters)
- Has no relevance to the student's venture or the program

Respond ONLY with valid JSON in this exact format:
{"result": "MEANINGFUL"}
or
{"result": "NOT_MEANINGFUL"}

No other text.`;

export async function assessReflection(
  text: string
): Promise<"MEANINGFUL" | "NOT_MEANINGFUL"> {
  try {
    const message = await getClient().messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 50,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Please assess this student reflection:\n\n${text}`,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== "text") return "NOT_MEANINGFUL";

    const parsed = JSON.parse(content.text.trim());
    if (parsed.result === "MEANINGFUL" || parsed.result === "NOT_MEANINGFUL") {
      return parsed.result;
    }
    return "NOT_MEANINGFUL";
  } catch {
    // Default to NOT_MEANINGFUL on any error (parse failure, API error, etc.)
    return "NOT_MEANINGFUL";
  }
}
