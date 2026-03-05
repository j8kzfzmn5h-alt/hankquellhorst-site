export default {
  async fetch(request: Request, env: any) {
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    const { input } = await request.json();

    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `Translate the passage into structured clarity.
No mysticism.
No emotional drift.
Slightly narrative tone, human but concise.
Convert abstraction into bounded action.

Return ONLY valid JSON in this format:

{
  "anchor": "...",
  "act": ["...", "...", "..."],
  "avoid": "...",
  "frame": "...",
  "reflection": "..."
}

No commentary outside JSON.`
          },
          {
            role: "user",
            content: input
          }
        ]
      })
    });

    const data = await openaiResponse.json();

console.log("OpenAI raw response:", JSON.stringify(data));

if (!data.choices) {
return new Response(JSON.stringify(data), {
headers: { "Content-Type": "application/json" },
status: 500
});
}
    return new Response(data.choices[0].message.content, {
      headers: { "Content-Type": "application/json" }
    });
  }
};
