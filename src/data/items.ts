import type { Item, Rarity } from './types';

// ============================================================================
// Objets — soins, armes, artefacts, monnaie. Chaque rareté a un code couleur.
// ============================================================================

export const RARITY_META: Record<
  Rarity,
  { label: string; color: string; glow: string }
> = {
  commun: { label: 'Commun', color: '#9a93a4', glow: 'rgba(154,147,164,0.35)' },
  rare: { label: 'Rare', color: '#79b6ff', glow: 'rgba(121,182,255,0.45)' },
  précieux: { label: 'Précieux', color: '#d9b96e', glow: 'rgba(217,185,110,0.5)' },
  légendaire: { label: 'Légendaire', color: '#ff8a4a', glow: 'rgba(255,138,74,0.55)' },
  maudit: { label: 'Maudit', color: '#d23a44', glow: 'rgba(210,58,68,0.55)' },
};

export const ITEMS: Item[] = [
  // --- Soins / consommables ---
  {
    id: 'pilule-souffle',
    name: 'Pilule de Souffle',
    kind: 'soin',
    rarity: 'commun',
    effect: 'Restaure une part de l’énergie spirituelle (Souffle).',
    discovered: true,
  },
  {
    id: 'baume-cendre-lune',
    name: 'Baume de Cendre-Lune',
    kind: 'soin',
    rarity: 'rare',
    effect: 'Soigne plaies et brûlures ; calme la brûlure d’âme.',
    discovered: true,
  },
  {
    id: 'lotus-braise',
    name: 'Lotus de Braise',
    kind: 'soin',
    rarity: 'précieux',
    effect: 'Regain brutal de puissance — suivi d’un contrecoup sévère.',
    discovered: true,
  },
  {
    id: 'elixir-neuf-nuits',
    name: 'Élixir des Neuf Nuits',
    kind: 'soin',
    rarity: 'précieux',
    effect: 'Antidote aux poisons spirituels les plus tenaces.',
    discovered: false,
  },
  {
    id: 'herbe-qui-ecoute',
    name: 'Herbe-qui-écoute',
    kind: 'soin',
    rarity: 'rare',
    effect: 'Stabilise la foudre — réduit le risque de Surcharge.',
    discovered: true,
  },
  {
    id: 'talisman-scelle',
    name: 'Talisman de scellé',
    kind: 'soin',
    rarity: 'rare',
    effect: 'Bloque une attaque spirituelle entrante.',
    discovered: true,
  },
  // --- Armes / équipement ---
  {
    id: 'bandages-souffle-court',
    name: 'Bandages du Souffle Court',
    kind: 'arme',
    rarity: 'précieux',
    effect:
      'Bandes de main conductrices léguées par Maître Ren : canalisent la foudre sans brûler le porteur. Évolutives (sertir des éclats, ferrer en gantelets).',
    owner: 'Le héros',
    discovered: true,
  },
  {
    id: 'carquois-mille-lucioles',
    name: 'Carquois des Mille Lucioles',
    kind: 'arme',
    rarity: 'légendaire',
    effect: 'Décoche des flèches d’âmes guidées par les morts d’Aylin.',
    owner: 'Aylin',
    discovered: true,
  },
  {
    id: 'sabre-vermillon',
    name: 'Sabre Vermillon',
    kind: 'arme',
    rarity: 'légendaire',
    effect: 'Lame incandescente du Prince-Lame ; tranche et cautérise.',
    owner: 'Kaïen',
    discovered: true,
  },
  // --- Artefacts ---
  {
    id: 'sceau-imperial-braise',
    name: 'Sceau Impérial de Braise',
    kind: 'artefact',
    rarity: 'légendaire',
    effect: 'Confère l’autorité de l’Empire et une puissance de feu colossale.',
    discovered: false,
  },
  {
    id: 'sceptre-lanternes',
    name: 'Sceptre des Lanternes',
    kind: 'artefact',
    rarity: 'maudit',
    effect: 'Commande aux milliers d’âmes scellées de Yánhóng.',
    owner: 'Yánhóng',
    discovered: false,
  },
  {
    id: 'cles-pilier',
    name: 'Les Clés du Pilier',
    kind: 'artefact',
    rarity: 'maudit',
    effect:
      'Légende : objets ou êtres capables d’ouvrir ou fermer la Fêlure. Le héros en est peut-être une.',
    discovered: false,
  },
  // --- Monnaie / ressource ---
  {
    id: 'eclat-terne',
    name: 'Éclat de Souffle (terne)',
    kind: 'monnaie',
    rarity: 'commun',
    effect: 'Cristal-monnaie de base ; achète et recharge les techniques.',
    discovered: true,
  },
  {
    id: 'eclat-vif',
    name: 'Éclat de Souffle (vif)',
    kind: 'monnaie',
    rarity: 'précieux',
    effect: 'Cristal-monnaie supérieur, chargé de puissance.',
    discovered: true,
  },
];

export const ITEM_BY_ID: Record<string, Item> = Object.fromEntries(
  ITEMS.map((i) => [i.id, i]),
);
