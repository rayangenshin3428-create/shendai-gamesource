// ============================================================================
// MONDE VIVANT — situations qui surviennent dans les régions au fil du temps,
// sans intervention du joueur. Elles apparaissent sur la carte et lui parviennent
// sous forme de rumeurs. Extensible : ajoute une entrée.
// ============================================================================

/** Modifie l'ambiance visuelle de la région concernée quand on s'y trouve. */
export type WorldVisual = 'fire' | 'storm' | 'corruption' | 'mourning' | 'siege';

export interface WorldSituation {
  /** Si défini : ne survient que dans cette région ; sinon, partout. */
  regionId?: string;
  /** Étiquette courte (carte / fiche région). */
  label: string;
  /** Description (fiche région). */
  desc: string;
  /** Rumeur narrée quand la situation apparaît. */
  rumor: string;
  /** Effet visuel sur l'ambiance de la zone (si on s'y rend). */
  visual?: WorldVisual;
}

export const WORLD_SITUATIONS: WorldSituation[] = [
  {
    regionId: 'braise',
    label: 'Levée d’armée',
    desc: 'L’Empire enrôle de force dans les villages ; les routes du sud se hérissent de patrouilles.',
    rumor: 'l’Empire de Braise lève une nouvelle armée — voyager près de ses terres devient périlleux.',
    visual: 'siege',
  },
  {
    regionId: 'luciole',
    label: 'Deuil des clans',
    desc: 'Un chef est tombé ; les Steppes grondent de vengeance et les Tentes-Noires se déplacent.',
    rumor: 'les Clans de la Luciole pleurent un des leurs — la plaine n’aime pas les étrangers en ce moment.',
    visual: 'mourning',
  },
  {
    regionId: 'lys',
    label: 'Procession des lanternes',
    desc: 'Mille lanternes se sont allumées d’un coup à Hóngmén ; l’Ordre prépare un grand rite.',
    rumor: 'à Hóngmén, l’Ordre du Lys Rouge allume ses mille lanternes — on parle d’une âme de poids à rappeler.',
    visual: 'fire',
  },
  {
    regionId: 'givre',
    label: 'Cimes scellées',
    desc: 'Le Cloître a fermé ses portes ; nul n’entre ni ne sort des Cimes Blanches.',
    rumor: 'le Cloître du Givre a scellé ses cimes — les Veilleurs auraient vu quelque chose dans le ciel.',
    visual: 'storm',
  },
  {
    regionId: 'cotes',
    label: 'Tempête monstre',
    desc: 'Un orage titanesque ravage le Bas-Pays. On murmure qu’un autre Foudroyé s’y est éveillé.',
    rumor: 'un orage monstrueux ravage les Côtes Foudroyées — peut-être un Foudroyé de plus, peut-être un appât.',
    visual: 'storm',
  },
  {
    label: 'Fléau errant',
    desc: 'Une chose rôde sur les routes ; les voyageurs disparaissent au crépuscule.',
    rumor: 'des voyageurs disparaissent sur les routes au crépuscule — un fléau errant rôde quelque part.',
    visual: 'corruption',
  },
  {
    label: 'Marché noir',
    desc: 'Pilules, reliques et esclaves changent de mains en secret ; l’argent attire les rapaces.',
    rumor: 'un marché noir florissant attire les rapaces — pilules et reliques s’y échangent à bas prix.',
  },
  {
    label: 'Bêtes dévoyées',
    desc: 'Des Bêtes-de-Souffle ont trop dévoré ; elles descendent vers les pistes des hommes.',
    rumor: 'des Bêtes-de-Souffle dévoyées rôdent près des pistes — mieux vaut ne pas voyager seul.',
    visual: 'corruption',
  },
];
