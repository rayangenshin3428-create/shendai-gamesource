// ============================================================================
// Système d'INVENTAIRE — logique pure des consommables.
// Ajouter un consommable = ajouter une entrée ici (facilement extensible).
// ============================================================================

export interface StatDelta {
  vitality?: number;
  souffle?: number;
  volte?: number;
  energy?: number;
}

/** Effets des consommables utilisables depuis la fiche. */
export const CONSUMABLE_EFFECTS: Record<string, StatDelta & { verb: string }> = {
  'pilule-souffle': { souffle: 30, energy: 28, verb: 'Avaler' },
  'baume-cendre-lune': { vitality: 30, volte: -12, verb: 'Appliquer' },
  'lotus-braise': { volte: 28, vitality: -8, verb: 'Croquer' },
  'herbe-qui-ecoute': { volte: -22, verb: 'Mâcher' },
  'elixir-neuf-nuits': { vitality: 18, verb: 'Boire' },
};

export function isConsumable(itemId: string): boolean {
  return itemId in CONSUMABLE_EFFECTS;
}

const clamp = (n: number) => Math.max(0, Math.min(100, n));

/** Applique un delta de stats à des valeurs existantes (bornées 0–100). */
export function applyStatDelta(
  base: { vitality: number; souffle: number; volte: number; energy: number },
  delta: StatDelta,
) {
  return {
    vitality: clamp(base.vitality + (delta.vitality ?? 0)),
    souffle: clamp(base.souffle + (delta.souffle ?? 0)),
    volte: clamp(base.volte + (delta.volte ?? 0)),
    energy: clamp(base.energy + (delta.energy ?? 0)),
  };
}
