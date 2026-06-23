import type { Affinity, InventorySlot, Palier, Voie } from './types';

// ============================================================================
// Le héros — avatar du joueur. État de départ (mock).
// ============================================================================

export interface HeroState {
  name: string;
  epithet: string;
  age: number;
  voie: Voie;
  palier: Palier;
  combat: string;
  /** Vitalité 0–100. */
  vitality: number;
  /** Souffle (énergie spirituelle) 0–100. */
  souffle: number;
  /** Énergie / vigueur physique 0–100 : entamée par le voyage et l'effort. */
  energy: number;
  /** Réserve de Volte 0–100 : la charge actuelle du conduit. */
  volte: number;
  /** Seuil de saturation (0–100) : au-delà, c'est la surtension → brûlure d'âme. Croît avec les paliers. */
  capacity: number;
  inventory: InventorySlot[];
  /** Liens noués au fil du récit (pas une jauge de romance). */
  affinities: Affinity[];
}

export const HERO: HeroState = {
  name: 'Sans-nom',
  epithet: 'l’Étincelle',
  age: 18,
  voie: 'Foudre',
  palier: 'Éveillé',
  combat: 'Poing nu — école du « Souffle Court »',
  vitality: 82,
  souffle: 40,
  energy: 76,
  volte: 22,
  capacity: 78,
  inventory: [
    { itemId: 'bandages-souffle-court', qty: 1 },
    { itemId: 'pilule-souffle', qty: 3 },
    { itemId: 'baume-cendre-lune', qty: 1 },
    { itemId: 'herbe-qui-ecoute', qty: 2 },
    { itemId: 'talisman-scelle', qty: 1 },
    { itemId: 'eclat-terne', qty: 12 },
    { itemId: 'eclat-vif', qty: 1 },
  ],
  affinities: [
    { characterId: 'ren', value: 72 },
    { characterId: 'aylin', value: 12 },
    { characterId: 'shulan', value: 5 },
    { characterId: 'kaien', value: 8 },
  ],
};

/** Épithètes au fil de la Montée — le monde te nomme à mesure que tu montes.
 *  « Soul Voltage » est le nom de ta foudre, pas de toi : il s'impose tout à la fin. */
export const EPITHET_LADDER = [
  'l’Étincelle',
  'le Volt',
  'le Garçon-Orage',
  'celui qui Refend le Ciel',
];

/** Techniques de Volte par palier (pour la fiche / tooltips). */
export const VOLTE_TECHNIQUES: Record<Palier, string[]> = {
  Dormeur: [],
  Éveillé: ['Étincelle', 'Nerf-Vif', 'Surcharge (débordement)'],
  Conduit: ['Poing Foudroyant', 'Pas d’Arc', 'Décharge'],
  Crue: ['Salve', 'Ferrage', 'Course sur l’Onde'],
  Sceau: ['Orage Intérieur', 'Sceau de Foudre', 'Cœur Surtension'],
  Apogée: ['Couronne d’Orage', 'Jugement'],
  Ascendant: ['Foudre Blanche', 'Refente'],
};
