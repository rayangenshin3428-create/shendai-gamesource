// ============================================================================
// SHENDAÏ — Types du domaine (univers mock)
// ============================================================================

export type ThemeId =
  | 'monde'
  | 'braise'
  | 'givre'
  | 'luciole'
  | 'lys'
  | 'cotes'
  | 'pilier';

export type ParticleKind =
  | 'mixed' // cendres + flocons (monde)
  | 'embers' // braises montantes
  | 'snow' // neige lente
  | 'fireflies' // lucioles dorées
  | 'petals' // pétales rouges
  | 'sparks' // étincelles / éclairs
  | 'light'; // lumière ascendante (Pilier)

/** Niveau de menace de la scène — pilote la réaction du « chrome ». */
export type ThreatLevel = 'calme' | 'tendu' | 'mortel';

/** Les cinq Voies (affinités). */
export type Voie = 'Foudre' | 'Brasier' | 'Givre' | 'Luciole' | 'Lys';

/** Les 7 paliers de la Montée. */
export type Palier =
  | 'Dormeur'
  | 'Éveillé'
  | 'Conduit'
  | 'Crue'
  | 'Sceau'
  | 'Apogée'
  | 'Ascendant';

export const PALIERS: Palier[] = [
  'Dormeur',
  'Éveillé',
  'Conduit',
  'Crue',
  'Sceau',
  'Apogée',
  'Ascendant',
];

/** Rareté à code couleur, partagée objets / entités. */
export type Rarity = 'commun' | 'rare' | 'précieux' | 'légendaire' | 'maudit';

/** Onglets du Codex. */
export type CodexTab =
  | 'personnages'
  | 'objets'
  | 'lieux'
  | 'factions'
  | 'bestiaire'
  | 'ennemis'
  | 'lexique';

/** Alignement d'un personnage (sous-filtres du Codex). */
export type Alignment = 'allié' | 'ennemi' | 'neutre' | 'romance';

// --- Régions / lieux ---------------------------------------------------------

export interface Region {
  id: string;
  themeId: ThemeId;
  name: string;
  subtitle: string;
  /** Glyphe au pinceau — identité culturelle de la région. */
  glyph: string;
  faction?: string;
  voie?: Voie;
  /** 1 (sûr) → 5 (mortel). */
  danger: number;
  particle: ParticleKind;
  /** Position sur la carte stylisée, en pourcentage du conteneur. */
  x: number;
  y: number;
  summary: string;
  /** Identité culturelle profonde (au-delà de l'élément) : mœurs, parler, tensions. */
  culture?: string;
  cities?: string[];
  discovered: boolean;
}

/** Une route entre deux régions (réseau de la carte). */
export interface Route {
  from: string;
  to: string;
  /** Route principale (plus visible) vs sente discrète. */
  major?: boolean;
}

/** Point d'intérêt sur la carte (cité, gué, sanctuaire…). */
export interface PointOfInterest {
  id: string;
  name: string;
  kind: 'cité' | 'site' | 'carrefour' | 'ruine';
  x: number;
  y: number;
}

// --- Personnages -------------------------------------------------------------

export interface Character {
  id: string;
  name: string;
  epithet: string;
  voie?: Voie;
  palier?: Palier;
  alignment: Alignment;
  romanceable?: boolean;
  faction?: string;
  blurb: string;
  detail: string;
  /** Description physique détaillée (direction artistique WLOP). */
  appearance?: string;
  /** Manière de parler reconnaissable. */
  voice?: string;
  /** Objectif / ambition moteur. */
  goal?: string;
  /** Défaut majeur (et, en filigrane, sa peur). */
  flaw?: string;
  discovered: boolean;
}

// --- Ennemis & boss (avec forme dévoilée) -----------------------------------

/** Type d'environnement d'arène (pilote le décor contextuel du combat). */
export type ArenaEnv =
  | 'temple'
  | 'foret'
  | 'ruines'
  | 'forteresse'
  | 'montagne'
  | 'sanctuaire'
  | 'fournaise'
  | 'givre';

/** Effet d'ambiance/perturbation d'un boss pendant le combat. */
export type BossEffect = 'inferno' | 'frost' | 'voices' | 'hunt';

export interface BossMeta {
  arena: { name: string; env: ArenaEnv };
  /** Capacité perturbatrice, en une phrase. */
  power: string;
  effect: BossEffect;
}

export interface Enemy {
  id: string;
  name: string;
  epithet: string;
  voie?: Voie;
  palier?: Palier;
  faction?: string;
  rumor: string;
  identity: string;
  history: string;
  /** L'escalade : ce que le boss devient quand il bascule. */
  revealedForm: string;
  /** Entrée en scène : 3-4 battements d'ambiance joués AVANT la révélation
   *  du nom (environnement → situation → protagoniste → atmosphère). */
  entrance?: string[];
  /** Boss majeur vs fléau errant — pilote l'intensité du traitement visuel. */
  apex?: boolean;
  discovered: boolean;
}

// --- Objets ------------------------------------------------------------------

export type ItemKind = 'soin' | 'arme' | 'artefact' | 'monnaie';

export interface Item {
  id: string;
  name: string;
  kind: ItemKind;
  rarity: Rarity;
  effect: string;
  owner?: string;
  discovered: boolean;
}

// --- Factions ----------------------------------------------------------------

export interface Faction {
  id: string;
  name: string;
  voie: Voie | 'mixte';
  wants: string;
  stanceOnHero: string;
  /** Histoire / identité culturelle de la faction. */
  history?: string;
  themeId: ThemeId;
  discovered: boolean;
}

// --- Bestiaire ---------------------------------------------------------------

export interface Beast {
  id: string;
  name: string;
  threat: string;
  description: string;
  discovered: boolean;
}

// --- Lexique -----------------------------------------------------------------

export interface LexiconEntry {
  term: string;
  definition: string;
}

// --- Voies (référentiel) -----------------------------------------------------

export interface VoieInfo {
  voie: Voie;
  nature: string;
  temperament: string;
  faction: string;
}

// --- Inventaire & affinités (état joueur) -----------------------------------

export interface InventorySlot {
  itemId: string;
  qty: number;
}

export interface Affinity {
  characterId: string;
  /** 0 → 100. */
  value: number;
}
