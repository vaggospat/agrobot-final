export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Μόνο POST επιτρέπεται.' });
  }

  try {
    const buffers = [];
    for await (const chunk of req) {
      buffers.push(chunk);
    }
    const rawBody = Buffer.concat(buffers).toString();
    const { message } = JSON.parse(rawBody);

    console.log("➡️ Ερώτηση:", message);
    console.log("🔑 OPENAI_API_KEY υπάρχει:", !!process.env.OPENAI_API_KEY);

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Είσαι ο AgroBot, βοηθός θερμοκηπιακών καλλιεργειών." },
          { role: "user", content: message }
        ]
      })
    });

    const data = await openaiRes.json();
    console.log("📩 Απάντηση:", data);

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    return res.status(200).json({ reply: data.choices[0].message.content });

  } catch (error) {
    console.error("❌ Σφάλμα:", error);
    return res.status(500).json({ error: 'Σφάλμα στον server του AgroBot.' });
  }
}
