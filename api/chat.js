// ============================================================================
// api/chat.js — Route serverless (Vercel) : proxy vers l'API Gemini.
// La clé reste SECRÈTE côté serveur (process.env.GOOGLE_API_KEY) — jamais
// exposée au navigateur. Le moteur narratif (src/narrative/AINarrativeEngine.ts)
// appelle cette route avec { system, messages } et reçoit { text }.
// ============================================================================

// Modèle Gemini Flash (gratuit). Change ici si besoin (ex. 'gemini-1.5-flash').
const MODEL = 'gemini-2.0-flash';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Méthode non autorisée (POST attendu).' });
    return;
  }

  const apiKey = process.env.GOOGLE_API_KEY; // ⚙️ à définir dans Vercel → Settings → Environment Variables
  if (!apiKey) {
    res.status(500).json({ error: 'GOOGLE_API_KEY manquante côté serveur.' });
    return;
  }

  // Vercel parse le JSON automatiquement, mais on sécurise au cas où.
  let body = req.body;
  if (!body || typeof body === 'string') {
    try {
      body = JSON.parse(body || '{}');
    } catch {
      body = {};
    }
  }
  const { system, messages, prompt } = body;

  // Historique de conversation → format Gemini ("contents").
  const contents =
    Array.isArray(messages) && messages.length
      ? messages.map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: String(m.content ?? '') }],
        }))
      : [{ role: 'user', parts: [{ text: String(prompt ?? '') }] }];

  const payload = {
    contents,
    generationConfig: {
      temperature: 0.9,
      // Le moteur attend du JSON strict (messages/choices/effects) :
      responseMimeType: 'application/json',
    },
  };
  // Le « cerveau » (briefing + canon du monde) passe en instruction système.
  if (system) payload.systemInstruction = { parts: [{ text: String(system) }] };

  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
    );
    const data = await r.json();
    const text =
      data?.candidates?.[0]?.content?.parts?.map((p) => p.text).filter(Boolean).join('') ?? '';

    if (!text) {
      res.status(502).json({ error: 'Réponse vide de Gemini.', detail: data?.error ?? null });
      return;
    }
    res.status(200).json({ text });
  } catch (error) {
    res.status(500).json({ error: "L'IA ne répond pas pour le moment.", detail: String(error?.message ?? error) });
  }
}
