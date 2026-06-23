// ============================================================================
// POINT D'ACCÈS UNIQUE POUR L'IA (interne, jamais montré au joueur).
//
// Quand tu brancheras l'IA, un seul appel — getAIPayload() — lui donne TOUT :
//   - le briefing (règles du monde, cohérence, narration, gameplay, contrat) ;
//   - le contexte du monde (lore, personnages, régions, factions, objets,
//     événements, bestiaire, lexique, Voies, paliers, héros) directement depuis
//     les données du projet (src/data) — aucun document externe à gérer.
//
// Exemple d'intégration (futur AINarrativeEngine) :
//   const { briefing, world } = getAIPayload();
//   // -> briefing = prompt système ; world = canon structuré à fournir en contexte.
// ============================================================================

import {
  BESTIARY,
  BOSS_META,
  CHARACTERS,
  ENEMIES,
  EPITHET_LADDER,
  FACTIONS,
  HERO,
  ITEMS,
  LEXICON,
  PALIERS,
  POINTS_OF_INTEREST,
  RARITY_META,
  REGIONS,
  ROUTES,
  SUBLOCATIONS,
  TRAVEL_EVENTS,
  VOIES,
  VOLTE_TECHNIQUES,
  WORLD_SITUATIONS,
} from '../data';
import { AI_BRIEFING } from './briefing';

export { AI_BRIEFING };

export interface AIWorldContext {
  hero: typeof HERO;
  epithetLadder: typeof EPITHET_LADDER;
  volteTechniques: typeof VOLTE_TECHNIQUES;
  paliers: typeof PALIERS;
  voies: typeof VOIES;
  characters: typeof CHARACTERS;
  enemies: typeof ENEMIES;
  bossMeta: typeof BOSS_META;
  factions: typeof FACTIONS;
  regions: typeof REGIONS;
  routes: typeof ROUTES;
  pointsOfInterest: typeof POINTS_OF_INTEREST;
  sublocations: typeof SUBLOCATIONS;
  items: typeof ITEMS;
  rarities: typeof RARITY_META;
  bestiary: typeof BESTIARY;
  lexicon: typeof LEXICON;
  travelEvents: typeof TRAVEL_EVENTS;
  worldSituations: typeof WORLD_SITUATIONS;
}

/** Tout le canon du monde, structuré, prêt à être fourni à l'IA en contexte. */
export function getWorldContext(): AIWorldContext {
  return {
    hero: HERO,
    epithetLadder: EPITHET_LADDER,
    volteTechniques: VOLTE_TECHNIQUES,
    paliers: PALIERS,
    voies: VOIES,
    characters: CHARACTERS,
    enemies: ENEMIES,
    bossMeta: BOSS_META,
    factions: FACTIONS,
    regions: REGIONS,
    routes: ROUTES,
    pointsOfInterest: POINTS_OF_INTEREST,
    sublocations: SUBLOCATIONS,
    items: ITEMS,
    rarities: RARITY_META,
    bestiary: BESTIARY,
    lexicon: LEXICON,
    travelEvents: TRAVEL_EVENTS,
    worldSituations: WORLD_SITUATIONS,
  };
}

/** Le briefing système (règles). */
export function getAIBriefing(): string {
  return AI_BRIEFING;
}

/** Digest texte compact du monde — pratique à injecter dans un prompt. */
export function getWorldDigest(): string {
  const lines: string[] = [];
  lines.push('# CANON DU MONDE (résumé structuré)\n');

  lines.push('## Voies');
  VOIES.forEach((v) => lines.push(`- ${v.voie} : ${v.nature} (${v.faction})`));

  lines.push('\n## Paliers de la Montée');
  lines.push(PALIERS.join(' → '));

  lines.push('\n## Régions');
  REGIONS.forEach((r) =>
    lines.push(`- ${r.name} (${r.id}) — ${r.subtitle} ; danger ${r.danger}/5. ${r.summary}`),
  );

  lines.push('\n## Factions');
  FACTIONS.forEach((f) =>
    lines.push(`- ${f.name} (Voie ${f.voie}) : veut « ${f.wants} » ; rapport au héros : ${f.stanceOnHero}`),
  );

  lines.push('\n## Personnages');
  CHARACTERS.forEach((c) => lines.push(`- ${c.name} « ${c.epithet} » [${c.id}] — ${c.blurb}`));

  lines.push('\n## Fléaux / boss');
  ENEMIES.forEach((e) => {
    const m = BOSS_META[e.id];
    lines.push(
      `- ${e.name} « ${e.epithet} » [${e.id}]${e.apex ? ' (majeur)' : ''} — rumeur : « ${e.rumor} »` +
        (m ? ` ; repaire habituel : ${m.arena.name} ; capacité : ${m.power}` : '') +
        ' (rappel : le décor du combat = le LIEU où on le croise, pas son repaire)',
    );
  });

  lines.push('\n## Bestiaire');
  BESTIARY.forEach((b) => lines.push(`- ${b.name} : ${b.threat} — ${b.description}`));

  lines.push('\n## Lexique');
  LEXICON.forEach((l) => lines.push(`- ${l.term} : ${l.definition}`));

  return lines.join('\n');
}

/** Point d'accès unique : briefing + monde (et un digest texte). */
export function getAIPayload(): { briefing: string; world: AIWorldContext; digest: string } {
  return { briefing: AI_BRIEFING, world: getWorldContext(), digest: getWorldDigest() };
}
