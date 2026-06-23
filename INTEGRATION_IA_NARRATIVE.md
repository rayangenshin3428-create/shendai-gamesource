# Shendaï — Notice d'intégration du moteur narratif IA

> Pour l'IA / le dev qui reçoit ce projet et doit y **brancher une IA narratrice**.

---

## 0. ÉTAT : DÉJÀ PRÉ-BRANCHÉ ✅ (Mistral AI via route serverless `/api/chat`)

Le branchement est **déjà fait**, avec la clé **secrète côté serveur** (idéal Vercel).

- `api/chat.js` — **route serverless** (Vercel) : proxy vers l'API Mistral
  (OpenAI-compatible). Lit la clé dans `process.env.MISTRAL_API_KEY` (jamais
  exposée au navigateur) et force un JSON strict en sortie.
- `src/narrative/AINarrativeEngine.ts` — moteur IA : appelle `/api/chat` (fetch)
  avec le « cerveau » (prompt système + tout le canon, via `getAIPayload()`) +
  l'historique de conversation. En mémoire, **pas de DB**.
- `src/narrative/engine.ts` — sélecteur : **IA en production** (Vercel), **mock en
  dev local** (override : `VITE_AI_ENABLED=true`).
- `src/state/game.tsx` — utilise déjà `createEngine()`.

**Pour activer l'IA, il suffit de :**
1. obtenir une clé sur **https://console.mistral.ai/api-keys/** (gratuit, sans CB) ;
2. la mettre dans **Vercel → Settings → Environment Variables → `MISTRAL_API_KEY`** ;
3. (re)déployer.

Le modèle est dans `api/chat.js` (`MODEL`, `mistral-small-latest`) — ajustable.
En dev local, `npm run dev` n'expose pas `/api/chat` → le jeu utilise le mock ;
pour tester l'IA en local : `vercel dev` + `MISTRAL_API_KEY` dans `.env.local`.

---

## 1. Ce qu'est ce projet

**Shendaï** est un RPG narratif textuel (dark fantasy wuxia/xianxia). Front-end
complet, jouable, **données mock** — il ne manque que le « cerveau » narratif.

**Stack réelle (à connaître)** :
- **React 19 + TypeScript + Vite** (SPA, pas de SSR), **Tailwind CSS v4**,
  **Framer Motion**. Aucune base de données. Tout l'état vit côté client.
- *(Note : si l'environnement cible est TanStack Start + Vite, le moteur ci-dessous
  est une simple classe TypeScript, totalement agnostique du framework — elle se
  porte telle quelle.)*

Lancer en dev : `npm install` puis `npm run dev`.

---

## 2. LE point de branchement (le seul)

Toute l'UI ne parle qu'à **une interface** : `NarrativeEngine`
(`src/narrative/types.ts`). Aujourd'hui elle est implémentée par un moteur
**scripté** (`MockNarrativeEngine`). Pour brancher l'IA :

1. Crée `src/narrative/AINarrativeEngine.ts` qui **implémente `NarrativeEngine`**.
2. Dans `src/state/game.tsx`, remplace **une seule ligne** :
   ```ts
   const engineRef = useRef<NarrativeEngine>(new MockNarrativeEngine());
   // ->
   const engineRef = useRef<NarrativeEngine>(new AINarrativeEngine());
   ```

**Rien d'autre dans l'UI ne change.**

### L'interface à implémenter
```ts
interface NarrativeEngine {
  start(): Promise<EngineResponse>;                     // scène d'ouverture
  sendPlayerAction(action: string): Promise<EngineResponse>; // saisie libre du joueur
  chooseOption(choiceId: string): Promise<EngineResponse>;   // clic sur un choix
}
```

### Le contrat de sortie
```ts
interface EngineResponse {
  messages: NarrativeMessage[];   // OBLIGATOIRE — voir ci-dessous
  choices?: Choice[];             // 0 à 4 options { id, label, tone? }
  effects?: NarrativeEffect[];    // effets de bord synchronisés avec l'état
}
type NarrativeMessage = {
  id: string;                     // ⚠️ chaque message DOIT avoir un id unique (clé React)
  kind: 'narration' | 'npc' | 'system';   // ('player' est géré par l'UI, ne pas l'émettre)
  text: string;
  speaker?: string;               // pour kind:'npc'
  speakerId?: string;             // id de personnage (ex: 'aylin') -> l'inscrit au Codex
};
type Choice = { id: string; label: string; tone?: 'calme' | 'tendu' | 'mortel' };
type NarrativeEffect =
  | { type: 'travel'; regionId: string }      // déplace le joueur (change la « peau » du monde)
  | { type: 'threat'; level: 'calme'|'tendu'|'mortel' }
  | { type: 'volte'; amount: number }         // charge la jauge de foudre du héros
  | { type: 'bossReveal'; enemyId: string }   // déclenche la mise en scène d'un boss
  | { type: 'death' };                        // déclenche l'écran de mort
```

> **Important** : assigne un `id` à CHAQUE message (ex. `crypto.randomUUID()`),
> sinon l'affichage casse. Garde le texte **en français**, dans le ton du monde.

---

## 3. Le « cerveau » est déjà fourni : `getAIPayload()`

Tu n'as **aucun document externe** à gérer. `src/ai/index.ts` expose
`getAIPayload()` qui renvoie, en un appel :

```ts
import { getAIPayload } from '../ai';
const { briefing, world } = getAIPayload();
// briefing : le PROMPT SYSTÈME complet (ton, lore, règles de cohérence, narration,
//            mise en scène des boss, combats, contrat de sortie). En français.
// world    : tout le canon structuré (régions, factions, personnages avec
//            apparence/parler/objectif/défaut, fléaux + entrées en scène, objets,
//            lexique, héros, Voies, paliers…). À fournir au modèle en contexte.
```

Le briefing est **interne** (jamais montré au joueur). Il contient déjà toutes les
règles d'écriture (voix « WLOP », anti-IA), de cohérence (réputation progressive,
décor de combat = lieu courant, boss mobiles), et le contrat de sortie ci-dessus.

---

## 4. Comment ça marche (le code réel est déjà en place)

Flux : **navigateur → `/api/chat` (serverless, clé secrète) → Mistral**.
Conversation en mémoire côté client, pas de DB. Tout est dans `api/chat.js` et
`src/narrative/AINarrativeEngine.ts` — rien à réécrire. En bref :

```ts
// src/narrative/AINarrativeEngine.ts (extrait)
const r = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ system, messages }), // system = briefing + canon ; messages = historique
});
const { text } = await r.json();
// → parse du JSON renvoyé en EngineResponse (messages/choices/effects), + id par message.
```

```js
// api/chat.js (extrait) — la clé ne quitte JAMAIS le serveur
const apiKey = process.env.MISTRAL_API_KEY;
// POST https://api.mistral.ai/v1/chat/completions avec
// model: 'mistral-small-latest', messages: [{role:'system',...}, ...historique],
// response_format: { type: 'json_object' }.
```

Aucune dépendance npm spéciale côté IA (juste `fetch`). La clé se règle dans
Vercel (`MISTRAL_API_KEY`). Le parseur tolère le bavardage et retombe en narration
brute en cas de souci.

---

## 5. Garde-fous (pour rester cohérent avec le jeu)

- **Émets toujours au moins un message.** N'émets jamais `kind:'player'`.
- **Quand un PNJ parle**, mets `kind:'npc'` + `speakerId` = l'id de la fiche
  (`aylin`, `ren`, `kaien`, `shulan`, `yanhong`, `suiye`…) → il s'inscrit au Codex.
- **Boss** : annonce-le par une rumeur, puis émets `effect bossReveal` ; le décor
  du combat doit refléter le **lieu courant**, jamais l'origine du boss.
- **Cohérence spatio-temporelle** : pour déplacer le joueur, passe par
  `effect travel`. Respecte le canon (le briefing détaille tout).
- Le contenu de référence (bible complète) est dans `docs/BIBLE_Shendai_REFONTE.md`.

---

*Une fois la classe écrite et la ligne de `game.tsx` changée, le jeu est piloté
par l'IA. Aucun autre fichier n'a besoin d'être touché.*
