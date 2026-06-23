import type { LexiconEntry, VoieInfo } from './types';

// ============================================================================
// Lexique & référentiel des Voies.
// ============================================================================

export const LEXICON: LexiconEntry[] = [
  { term: 'Shendaï', definition: 'Le monde — les Terres sous le Ciel Fendu.' },
  { term: 'Grande Fêlure', definition: 'La déchirure du ciel, à l’origine de la puissance déversée.' },
  {
    term: 'Pilier d’Âmes',
    definition: 'Colonne de lumière verticale au centre du monde, vers laquelle dérivent les âmes.',
  },
  {
    term: 'Souffle',
    definition:
      'Énergie vitale, écho dilué de la puissance déversée — cultivée en prenant celle des autres.',
  },
  {
    term: 'Voie',
    definition: 'Affinité de pouvoir : Foudre, Brasier, Givre, Luciole, Lys. Presque toujours une seule.',
  },
  {
    term: 'La Montée',
    definition: '7 paliers : Dormeur, Éveillé, Conduit, Crue, Sceau, Apogée, Ascendant.',
  },
  {
    term: 'Volt',
    definition:
      'Rare âme née capable de conduire la foudre brute du ciel déchiré — pouvoir immense, à elle seule, qui consume qui ne la maîtrise pas. C’est ce que tu es.',
  },
  {
    term: 'Foudroyé',
    definition:
      'Vieux mot des côtes pour un Volt — comme on dit d’une maison que la foudre a frappée : un porte-malheur, une âme que le ciel a remarquée. On le murmure avec crainte, pas avec respect.',
  },
  {
    term: 'Volte d’Âme',
    definition:
      'La discipline du Volt : sa foudre gérée comme une réserve de tension — son conduit d’âme accumule une charge jusqu’à sa Capacité, puis la décharge. Charger, doser, ne pas déborder.',
  },
  {
    term: 'Soul Voltage',
    definition:
      'Le nom légendaire que le monde finira par donner à ta foudre, quand ta réputation aura grandi : la Volte d’Âme portée à son apogée. Personne ne l’a encore prononcé.',
  },
  {
    term: 'Capacité',
    definition:
      'La limite de charge que le conduit du héros peut contenir sans se rompre. Elle croît avec les paliers de la Montée.',
  },
  {
    term: 'Brûlure d’âme',
    definition:
      'Auto-destruction par surtension : forcer une décharge au-delà de la Capacité, ou retenir trop de charge. Le seul vrai coût du héros, envers lui-même.',
  },
  {
    term: 'Luciole',
    definition: 'Âme d’un défunt en transit vers le Pilier.',
  },
  {
    term: 'Éclat de Souffle',
    definition: 'Cristal-monnaie et carburant des techniques (terne / clair / vif).',
  },
  {
    term: 'Forme dévoilée',
    definition: 'L’escalade d’un boss : son apparence bascule en quelque chose de pire.',
  },
];

export const VOIES: VoieInfo[] = [
  {
    voie: 'Foudre',
    nature: 'éclair, choc, nerf, vitesse',
    temperament: 'volonté, émotion brute',
    faction: 'rarissime — héros',
  },
  {
    voie: 'Brasier',
    nature: 'feu, fournaise',
    temperament: 'domination, colère',
    faction: 'Empire de Braise',
  },
  {
    voie: 'Givre',
    nature: 'gel, ciel, lumière froide',
    temperament: 'détachement, clarté',
    faction: 'Cloître du Givre',
  },
  {
    voie: 'Luciole',
    nature: 'esprits, âmes, mémoire',
    temperament: 'deuil, liberté',
    faction: 'Clans de la Luciole',
  },
  {
    voie: 'Lys',
    nature: 'sang, mort, lanternes',
    temperament: 'sacrifice, discipline',
    faction: 'Ordre du Lys Rouge',
  },
];
