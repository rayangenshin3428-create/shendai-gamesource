# Guide de contenu & d'architecture — SHENDAÏ

Ce projet est conçu pour être **facilement enrichi** (par un humain ou par une
IA). Le contenu (lore, monde, entités, événements) est **séparé** de la logique
(systèmes) et de l'affichage (composants). Pour ajouter du contenu, on touche
presque toujours **un seul fichier de données**, jamais l'UI.

## Carte du projet

```
src/
├─ data/         ← LE CONTENU (ce qu'une IA ou un game designer édite)
│   ├─ types.ts        types partagés (Region, Character, Enemy, Item…)
│   ├─ locations.ts    régions + réseau de routes + points d'intérêt
│   ├─ sublocations.ts quartiers / domaines / bâtiments / lieux-clés par région
│   ├─ characters.ts   alliés, romances, mentor, figures
│   ├─ enemies.ts      panthéon des fléaux (avec « forme dévoilée »)
│   ├─ items.ts        objets + raretés
│   ├─ factions.ts     les grandes cours
│   ├─ bestiary.ts     créatures mineures
│   ├─ lexicon.ts      glossaire + Voies
│   ├─ events.ts       ÉVÉNEMENTS de voyage (rencontres, combats, découvertes)
│   └─ hero.ts         état de départ du héros
│
├─ systems/      ← LA LOGIQUE PURE (sans React, testable, réutilisable)
│   ├─ time.ts         horloge, phases du jour, cycle jour/nuit
│   ├─ travel.ts       distance → temps + énergie, tirage d'événement
│   └─ inventory.ts    effets des consommables
│
├─ state/        ← LE STORE (branche systèmes + données à React)
│   ├─ game.tsx        état global : monde, héros, temps, voyage, découverte…
│   └─ settings.tsx    réglages utilisateur (perf, confort)
│
├─ narrative/    ← LE MOTEUR DE RÉCIT (point de branchement de l'IA)
│   ├─ types.ts        interface NarrativeEngine + EngineResponse + effets
│   ├─ MockNarrativeEngine.ts   moteur scripté (provisoire)
│   └─ useNarrative.ts hook qui applique les effets au store
│
└─ components/   ← L'AFFICHAGE (ne contient pas de contenu d'univers)
```

## Recettes — ajouter du contenu

> Après chaque ajout : `npm run build` doit rester vert.

- **Un ennemi / boss** → ajoute un objet dans `data/enemies.ts` (avec `rumor`,
  `identity`, `history`, `revealedForm`). `discovered: false` pour qu'il se
  révèle en jeu.
- **Un personnage** → `data/characters.ts`. `romanceable: true` **uniquement**
  pour des personnages féminins (héros hétéro — voir la bible §13).
- **Un objet** → `data/items.ts`. Pour le rendre **consommable**, ajoute son
  effet dans `systems/inventory.ts` (`CONSUMABLE_EFFECTS`).
- **Une région** → `data/locations.ts` (`REGIONS`), donne-lui un `themeId`
  existant (ou crée un thème dans `src/index.css`), des coords `x/y`, un
  `glyph`. Ajoute ses routes (`ROUTES`) et ses sous-lieux (`sublocations.ts`).
- **Un quartier / bâtiment** → `data/sublocations.ts`, sous l'id de la région.
- **Un événement de voyage** → `data/events.ts` (`TRAVEL_EVENTS`). Effets
  déclaratifs disponibles : `item`, `energy`, `vitality`, `souffle`, `volte`,
  `time`, `threat`, `discover`. L'événement peut être limité à des `regions`
  ou des `phase`s du jour.
- **Un point d'intérêt sur la carte** → `POINTS_OF_INTEREST` dans `locations.ts`.

## Cohérence (règle d'or)

La **bible** (`docs/Bible_Shendai_REFONTE.md`) est la source de vérité du lore.
Toute modification du lore doit y être consignée (journal §16) **et**
répercutée dans `data/`. Le contenu de `data/` ne doit jamais contredire la
bible.

## Brancher une IA plus tard

> 📑 **Le briefing complet de l'IA est intégré dans l'app : `src/ai/`.** Section
> **cachée** (jamais montrée au joueur). Un seul appel — **`getAIPayload()`**
> (`src/ai/index.ts`) — donne à l'IA *tout* : le *prompt système* (`AI_BRIEFING`
> : fonctionnement du monde, lore, règles de cohérence, gestion des personnages /
> événements / voyages / combats / boss / temps / conséquences, narration,
> **contrat de sortie**) **et** le canon structuré (`getWorldContext()`).

Trois surfaces propres, déjà prêtes :

1. **Récit** — implémente `NarrativeEngine` (voir `narrative/types.ts`) en une
   classe `AINarrativeEngine`, et remplace `new MockNarrativeEngine()` (dans
   `state/game.tsx`) par elle. L'IA renvoie des `messages`, des `choices` et des
   `effects` ; le store applique tout. L'UI ne change pas.
2. **Briefing + monde** — `src/ai/getAIPayload()` : prompt système + canon
   structuré, en un appel. Rien d'externe à gérer.
3. **Données** — `data/` est le corpus structuré et typé (lore, persos, lieux,
   events, monde vivant) que l'IA lit pour rester cohérente, ou étend en écrivant
   de nouvelles entrées dans ces mêmes fichiers.

Les **systèmes** (`time`, `travel`, `inventory`) exposent des fonctions pures :
une IA peut les appeler pour raisonner sur le monde (durée d'un trajet, effet
d'un objet) sans dépendre de React.
```
