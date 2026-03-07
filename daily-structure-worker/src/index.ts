export default {
  async fetch(request: Request, env: any) {

	// Handle CORS preflight
	if (request.method === "OPTIONS") {
	  return new Response(null, {
		headers: {
		  "Access-Control-Allow-Origin": "*",
		  "Access-Control-Allow-Methods": "POST, OPTIONS",
		  "Access-Control-Allow-Headers": "Content-Type"
		}
	  });
	}

	if (request.method !== "POST") {
	  return new Response("Method not allowed", { status: 405 });
	}

	const { input } = await request.json();

	const openaiResponse = await fetch(
	  "https://api.openai.com/v1/chat/completions",
	  {
		method: "POST",
		headers: {
		  "Content-Type": "application/json",
		  "Authorization": `Bearer ${env.OPENAI_API_KEY}`
		},
		body: JSON.stringify({
		  model: "gpt-4o-mini",
		  messages: [
			{
			  role: "system",
				content: `
				You translate information into clear daily structure.

				Rules:
				- No mysticism
				- Translate insight into action
				- Use plain human language
				- Prefer concrete behavior over abstract advice

				Return ONLY JSON in this structure:

				{
				  "anchor": "one sentence capturing the central signal",
				  "act": [
					"one concrete behavior someone could do today",
					"one small observation they should make",
					"one adjustment they could test"
				  ],
				  "avoid": "one common mistake or trap",
				  "frame": "a short reframing that clarifies the situation",
				  "reflection": "a thoughtful sentence that deepens understanding"
				}
				`
			},
			{
			  role: "user",
			  content: input
			}
		  ]
		})
	  }
	);

	const data = await openaiResponse.json();
	const content = data.choices[0].message.content;

	return new Response(content, {
	  headers: {
		"Content-Type": "application/json",
		"Access-Control-Allow-Origin": "*"
	  }
	});
  }
};
