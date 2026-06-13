// api/summarize.js
export default async function handler(req, res) {
  // Allow CORS for local dev
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { wardName, complaints, recentComplaints } = req.body;

  if (!wardName || !complaints) {
    return res.status(400).json({ error: "Missing wardName or complaints" });
  }

  const prompt = `You are a municipal AI assistant for Hyderabad city's SDG monitoring system.

Ward: ${wardName}
Complaint counts (last 7 days):
- Water: ${complaints.water || 0}
- Garbage: ${complaints.garbage || 0}
- Air quality: ${complaints.air || 0}
- Roads: ${complaints.roads || 0}
- Health: ${complaints.health || 0}

Recent complaint descriptions:
${recentComplaints?.slice(0, 5).join("\n") || "No recent descriptions available."}

Write a 3-sentence executive summary for a municipal officer. Be specific about the most critical issue.
Then suggest exactly one actionable step.
Respond ONLY in this exact JSON format, no extra text:
{"summary":"...","priority":"Low|Medium|High|Critical","suggestedAction":"..."}`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.choices[0].message.content.trim();

    // Strip markdown code fences if Groq adds them
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    return res.status(200).json(parsed);
  } catch (err) {
    console.error("Groq error:", err);
    // Graceful fallback — don't crash the demo
    return res.status(200).json({
      summary: `${wardName} requires review. AI service temporarily unavailable — showing cached report.`,
      priority: "Unknown",
      suggestedAction: "Manually review open complaints and assign field officers.",
    });
  }
}