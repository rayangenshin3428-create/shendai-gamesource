import { getAIPayload } from '../ai';
import type { Choice, EngineResponse, NarrativeEngine, NarrativeMessage } from './types';

// ============================================================================
// Moteur narratif IA — appelle la route serverless /api/chat (proxy Gemini).
// La clé reste SECRÈTE côté serveur (cf. api/chat.js + GOOGLE_API_KEY sur Vercel).
// Implémente NarrativeEngine : l'UI ne voit aucune différence avec le mock.
// Conversation EN MÉMOIRE côté client (aucune DB pour la V1).
//
// Le « cerveau » (prompt système + tout le canon du monde) vient de
// getAIPayload() (src/ai) et est envoyé comme instruction système à chaque tour.
// ============================================================================

// Format de sortie attendu (le briefing le décrit déjà ; on le re-cadre ici pour
// garantir un JSON strictement parseable — la route force aussi le JSON).
const FORMAT = `
Tu réponds STRICTEMENT par un seul objet JSON valide, et RIEN d'autre (aucun
texte autour, pas de balises de code). Forme exacte :
{
  "messages": [ { "kind": "narration" | "npc" | "system", "text": "…", "speaker"?: "Nom du PNJ", "speakerId"?: "id_codex" } ],
  "choices"?: [ { "id": "slug-court", "label": "texte du choix", "tone"?: "calme" | "tendu" | "mortel" } ],
  "effects"?: [ { "type": "threat", "level": "calme"|"tendu"|"mortel" } | { "type": "volte", "amount": 0-100 } | { "type": "travel", "regionId": "cotes"|"braise"|"givre"|"luciole"|"lys"|"pilier" } | { "type": "bossReveal", "enemyId": "id" } | { "type": "death" } ]
}
RÈGLES : 1 à 5 messages par tour ; n'émets JAMAIS "kind":"player" ; "choices"
est OPTIONNEL — n'en mets que pour un vrai embranchement (typiquement un boss :
Affronter / Reculer), sinon laisse le joueur écrire librement ; tout le texte est
en FRANÇAIS, dans le ton du monde.`;

/** Point d'accès à la route serverless (proxy Gemini). */
const API_URL = '/api/chat';

function uid(): string {
  const c = globalThis.crypto as Crypto | undefined;
  return c?.randomUUID ? c.randomUUID() : `m${Math.random().toString(36).slice(2)}`;
}

/** Parse robuste : tolère le bavardage autour du JSON ; repli en narration brute. */
function parse(raw: string): EngineResponse {
  let txt = raw.trim();
  const fence = txt.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) txt = fence[1].trim();
  const a = txt.indexOf('{');
  const b = txt.lastIndexOf('}');
  if (a >= 0 && b > a) txt = txt.slice(a, b + 1);
  try {
    const obj = JSON.parse(txt) as {
      messages?: { kind?: string; text?: string; speaker?: string; speakerId?: string }[];
      choices?: { id?: string; label?: string; tone?: string }[];
      effects?: unknown[];
    };
    const messages: NarrativeMessage[] = (obj.messages ?? [])
      .filter((m) => m && typeof m.text === 'string' && m.kind !== 'player')
      .map((m) => ({
        id: uid(),
        kind: (m.kind as NarrativeMessage['kind']) ?? 'narration',
        text: m.text as string,
        speaker: m.speaker,
        speakerId: m.speakerId,
      }));
    if (messages.length === 0) throw new Error('aucun message');
    const choices: Choice[] | undefined =
      Array.isArray(obj.choices) && obj.choices.length
        ? obj.choices.map((c, i) => ({
            id: String(c.id ?? `c${i}`),
            label: String(c.label ?? '—'),
            tone: c.tone as Choice['tone'],
          }))
        : undefined;
    const effects = Array.isArray(obj.effects) ? (obj.effects as EngineResponse['effects']) : undefined;
    return { messages, choices, effects };
  } catch {
    return { messages: [{ id: uid(), kind: 'narration', text: raw.trim() || '…' }] };
  }
}

export class AINarrativeEngine implements NarrativeEngine {
  private system: string;
  private history: { role: 'user' | 'assistant'; content: string }[] = [];
  private lastChoices: Choice[] = [];

  constructor() {
    const { briefing, world } = getAIPayload();
    this.system =
      `${briefing}\n\n# CONTRAT DE SORTIE (JSON STRICT)${FORMAT}\n\n` +
      `# CANON (données du monde — à respecter, ne jamais contredire)\n${JSON.stringify(world)}`;
  }

  private async turn(input: string): Promise<EngineResponse> {
    this.history.push({ role: 'user', content: input });
    let res: EngineResponse;
    try {
      const r = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ system: this.system, messages: this.history }),
      });
      const data = (await r.json()) as { text?: string; error?: string; detail?: unknown };
      if (!r.ok || !data.text) {
        const detail = data.detail ? ` — ${JSON.stringify(data.detail)}` : '';
        throw new Error((data.error || `HTTP ${r.status}`) + detail);
      }
      this.history.push({ role: 'assistant', content: data.text });
      res = parse(data.text);
    } catch (err) {
      res = {
        messages: [
          {
            id: uid(),
            kind: 'system',
            text: `(Le narrateur reste muet — la connexion à l'IA a échoué. ${String((err as Error)?.message ?? '')})`,
          },
        ],
      };
    }
    this.lastChoices = res.choices ?? [];
    return res;
  }

  start(): Promise<EngineResponse> {
    return this.turn(
      "[Démarre la partie : joue la scène d'ouverture « la Nuit de Braise » à Léïsha (Côtes Foudroyées), le soir des 18 ans du héros. Pose l'ambiance, présente Maître Ren, fais débarquer la patrouille de l'Empire, et laisse la foudre du héros s'éveiller pour la première fois. Termine en rendant la main au joueur.]",
    );
  }

  sendPlayerAction(action: string): Promise<EngineResponse> {
    return this.turn(action);
  }

  chooseOption(choiceId: string): Promise<EngineResponse> {
    const chosen = this.lastChoices.find((c) => c.id === choiceId);
    return this.turn(`[Le joueur choisit : « ${chosen?.label ?? choiceId} »]`);
  }
}
