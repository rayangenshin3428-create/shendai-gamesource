# SHENDAÏ — *les Terres sous le Ciel Fendu*

Front-end de la plateforme de **jeu de rôle textuel immersif** Shendaï : une
**dark fantasy martiale et spirituelle** (wuxia / xianxia sombre). Le joueur
incarne un Foudroyé et vit une histoire qui, à terme, sera **écrite par une IA
narratrice**. Cette première passe est **100 % front-end**, peuplée de **données
mock**, avec des **branchements propres** pour connecter l'IA et les
illustrations plus tard.

> Intention de direction artistique : **« un manuscrit hanté, pas une
> application »**. Sombre, beau, dangereux — la beauté rend l'horreur plus
> tranchante.

---

## Lancer le projet

Prérequis : **Node ≥ 20**.

```bash
npm install
npm run dev      # serveur de dev (http://localhost:5173)
npm run build    # build de production (tsc + vite)
npm run preview  # prévisualiser le build
```

Stack : **React 19 + TypeScript + Vite**, **Tailwind v4** (+ variables CSS pour
les thèmes), **Framer Motion**.

---

## Ce qu'on voit

- **Barre haute** : lieu actuel · palier du héros · niveau de menace · Codex.
- **Colonne gauche — la carte** : le Pilier d'Âmes au centre, les régions
  autour. Sélectionner une région puis **« S'y rendre »** change le lieu et
  **déclenche la bascule de thème** (la « peau » du monde fond, ≈ 800 ms).
- **Colonne centrale — le récit** : panneau façon **journal enluminé**
  (narration, dialogues de PNJ, actions du joueur, choix, saisie « Que
  fais-tu ? »). Joue la scène d'ouverture **la Nuit de Braise**.
- **Colonne droite — la fiche** : palier de la Montée, vitalité, Souffle,
  **jauge de Volte** (réserve de tension : charge / Capacité / surtension),
  inventaire (tooltips + rareté), et **Liens** (relations nouées au fil du récit).
- **Écran de chargement** au lancement + **menu de paramètres** (icône ⚙ en haut) :
  densité de particules, réduction des animations, grain, lueurs — persistés.
- **Codex** (overlay plein écran) : Personnages · Objets · Lieux · Factions ·
  Bestiaire · Ennemis · Lexique. Sous-filtres, recherche, états
  **découvert / verrouillé (???)**, traitement distinct des **ennemis & boss**
  (sceau rouge, « forme dévoilée »).
- **Moments forts** : **écran de mort** (luciole dorée vers le Pilier),
  **révélation de boss** (carte de nom + forme dévoilée), **pic de Volte**
  (flash d'éclair).
- **Panneau « Démo »** (bas-gauche) : déclenche menace / pic de Volte / boss /
  mort à la demande. *À retirer pour la version finale.*

---

## Le système de thème (la signature glace + feu)

Chaque région a sa **« peau »**. Les couleurs sont des **design tokens** (variables
CSS) déclarés via `@property` pour pouvoir **transiter en fondu** quand on voyage.

| Thème (`data-theme`) | Atmosphère | Particules |
|---|---|---|
| `monde` (défaut) | glace + feu mêlés | cendres + flocons |
| `braise` | fournaise oppressante | braises montantes |
| `givre` | froid, vide, sacré | neige lente |
| `luciole` | crépuscule, deuil | lucioles dorées |
| `lys` | funèbre, somptueux | pétales rouges |
| `cotes` | orage électrique (origine) | étincelles / éclairs |
| `pilier` | lumière sacrée, vertige | lumière ascendante |

Le thème s'applique en posant `document.documentElement.dataset.theme = …`
(géré par `state/game.tsx`). Les tokens vivent dans `src/index.css`.

---

## 🔌 Où brancher l'IA narratrice

> 📑 **Briefing complet de l'IA** : intégré dans l'app — `src/ai/`. Appelle
> **`getAIPayload()`** (`src/ai/index.ts`) : en un seul appel, tu obtiens le
> *prompt système* (`AI_BRIEFING` : monde, lore, cohérence, personnages,
> événements, voyages, combats, boss, temps, conséquences, narration, contrat de
> sortie) **et** tout le canon structuré (`getWorldContext()`). Section interne,
> jamais montrée au joueur. Aucun document externe à gérer.

Tout passe par **une seule interface** : `NarrativeEngine`
(`src/narrative/types.ts`).

```ts
interface NarrativeEngine {
  start(): Promise<EngineResponse>;                       // scène d'ouverture
  sendPlayerAction(action: string): Promise<EngineResponse>; // saisie libre
  chooseOption(choiceId: string): Promise<EngineResponse>;   // choix
}
```

Une `EngineResponse` renvoie des **messages**, d'éventuels **choix**, et des
**effets** que l'UI sait jouer (`travel`, `threat`, `volte`, `bossReveal`,
`death`). L'UI ne parle **jamais** au moteur concret — seulement à l'interface.

Aujourd'hui, c'est `MockNarrativeEngine` (scénario scripté de la Nuit de Braise)
qui est instancié, **à un seul endroit** :

```ts
// src/narrative/useNarrative.ts
const engineRef = useRef<NarrativeEngine>(new MockNarrativeEngine());
```

**Pour brancher l'IA** : créer une classe `AINarrativeEngine implements
NarrativeEngine` (qui appelle l'API et renvoie le même `EngineResponse`), puis
remplacer cette seule ligne :

```ts
const engineRef = useRef<NarrativeEngine>(new AINarrativeEngine(/* … */));
```

Rien d'autre dans l'UI ne change. Les **illustrations** se branchent de la même
manière : les fiches du Codex et les vignettes de PNJ utilisent des
emplacements (placeholders) prêts à recevoir des images.

---

## Structure

```
src/
├─ index.css            tokens + 7 thèmes + textures + transitions
├─ data/                données mock (héros, persos, boss, objets, lieux, …)
├─ narrative/           NarrativeEngine (interface) + moteur mock + hook
├─ state/game.tsx       état global (lieu→thème, menace, héros, overlays)
└─ components/
   ├─ ambiance/         couche de lumière + particules par région
   ├─ layout/           barre haute
   ├─ map/              carte interactive (lieu → thème)
   ├─ narrative/        panneau narratif (journal enluminé)
   ├─ sheet/            fiche perso (Volte, inventaire, affinités)
   ├─ codex/            encyclopédie overlay
   ├─ moments/          écran de mort, révélation de boss, pic de Volte
   └─ ui/               primitives (Icon, Seal, Overlay)
```

---

## Système de pouvoir (réserve de Volte)

Le héros n'est **plus mû par l'émotion**. Son âme est un **conduit** qui
**accumule une réserve de Volte** (charge) jusqu'à une **Capacité**, puis la
**décharge**. Le risque est la **surtension** (déborder la Capacité) → **brûlure
d'âme**. Inspiration assumée d'un système de réserve d'énergie (proche de
*Kashimo*, JJK), propre à Shendaï. La jauge de Volte montre la charge, le seuil
de saturation et l'alerte de surtension. *(Lore consigné dans `docs/Bible_Shendai_REFONTE.md`, §3.4 + journal §16.)*

## Romance

**Pas d'onglet ni de jauge de romance.** Les liens se développent
**naturellement** dans le récit. Héros **hétéro** → prétendantes **féminines
uniquement** (Aylin, Shulan, Yánhóng).

## Le monde vivant (systèmes)

- **Entrée** : écran de lancement avec bouton **Jouer** → **introduction
  immersive** (univers, pouvoir, danger, contexte) → début du RP.
- **Tout passe par la narration** : les **déplacements** (inter-régions et
  intra-ville), les **événements** et les changements de lieu apparaissent dans
  le récit. Tu peux répondre par les **choix** proposés **ou librement** au
  clavier (la réponse libre résout aussi les événements de route).
- **Temps** : horloge (heures, jours) + **cycle jour/nuit** qui assombrit le
  monde la nuit. **Repos à durée choisie** (⛺) — pas de sommeil gratuit en
  boucle, le temps passe vraiment et le monde évolue (lignes d'ambiance).
- **Voyage chronométré** : se déplacer **coûte du temps et de l'énergie** selon
  la distance ; les **trajets courts en ville** ne coûtent presque rien.
- **Événements de route** : rencontres, dialogues, combats, découvertes — avec
  conséquences (objet gagné, énergie, menace, **révélation Codex**).
- **Inventaire fonctionnel** : objets ramassés ajoutés à l'inventaire,
  **consommables utilisables** (effets sur vitalité/Souffle/Volte/énergie).
- **Découverte progressive** : les entrées du Codex se débloquent en jeu.

Toute la logique vit dans `src/systems/` (pur, testable, AI-ready) et le contenu
dans `src/data/`. Voir **`CONTENT_GUIDE.md`** pour étendre le monde facilement.

### Encore à venir
Approfondir l'impact de la fatigue, des quêtes multi-étapes, une vraie
résolution de combat — tout se branche sur les systèmes et données existants.

## Accessibilité

`prefers-reduced-motion` est respecté : les transitions de thème, les
particules (canvas) et les animations Framer sont fortement réduites pour les
personnes sensibles au mouvement.
