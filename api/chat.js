// ============================================================================
// api/chat.js — Route serverless (Vercel) : proxy vers l'API Mistral (OpenAI-compatible).
// La clé reste SECRÈTE côté serveur (process.env.MISTRAL_API_KEY) — jamais
// exposée au navigateur. Le moteur narratif (src/narrative/AINarrativeEngine.ts)
// appelle cette route avec { system, messages } et reçoit { text }.
// ============================================================================

// Modèle Mistral Small via Mistral (gratuit, inscription par email).
const MODEL = 'mistral-small-latest';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Méthode non autorisée (POST attendu).' });
    return;
  }

  const apiKey = process.env.MISTRAL_API_KEY; // ⚙️ à définir dans Vercel → Settings → Environment Variables
  if (!apiKey) {
    res.status(500).json({ error: 'MISTRAL_API_KEY manquante côté serveur.' });
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

  // Historique de conversation → format OpenAI-compatible ("messages").
  const chatMessages = [];
  if (system) chatMessages.push({ role: 'system', content: String(system) });
  if (Array.isArray(messages) && messages.length) {
    for (const m of messages) {
      chatMessages.push({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: String(m.content ?? ''),
      });
    }
  } else if (prompt) {
    chatMessages.push({ role: 'user', content: String(prompt) });
  }

  const payload = {
    model: MODEL,
    messages: chatMessages,
    temperature: 0.9,
    // Le moteur attend du JSON strict (messages/choices/effects) :
    response_format: { type: 'json_object' },
  };

  try {
    const r = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await r.json();
    const text = data?.choices?.[0]?.message?.content ?? '';

    if (!text) {
      res.status(502).json({ error: 'Réponse vide de Mistral.', detail: data?.error ?? data?.message ?? null });
      return;
    }
    res.status(200).json({ text });
  } catch (error) {
    res.status(500).json({ error: "L'IA ne répond pas pour le moment.", detail: String(error?.message ?? error) });
  }
}
