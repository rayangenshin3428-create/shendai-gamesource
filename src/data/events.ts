import type { ThreatLevel } from './types';
import type { DayPhase } from '../systems/time';

// ============================================================================
// ÉVÉNEMENTS — rencontres, dialogues, combats, découvertes qui surviennent
// en voyage. Conçus pour être facilement étendus (ajouter une entrée suffit).
// Les effets sont déclaratifs : l'UI/les systèmes les appliquent.
// ============================================================================

export type CodexKind = 'enemy' | 'character' | 'item' | 'beast' | 'faction' | 'region';

export type EventEffect =
  | { type: 'item'; itemId: string; qty: number }
  | { type: 'energy'; amount: number }
  | { type: 'vitality'; amount: number }
  | { type: 'souffle'; amount: number }
  | { type: 'volte'; amount: number }
  | { type: 'time'; minutes: number }
  | { type: 'threat'; level: ThreatLevel }
  | { type: 'discover'; kind: CodexKind; id: string };

export interface EventChoice {
  label: string;
  /** Texte d'issue affiché après le choix. */
  result: string;
  effects?: EventEffect[];
}

export interface GameEvent {
  id: string;
  title: string;
  text: string;
  /** Si défini : l'événement ne peut survenir que si le départ OU l'arrivée en fait partie. */
  regions?: string[];
  /** Si défini : seulement pendant ces phases du jour. */
  phase?: DayPhase[];
  /** Poids de tirage (défaut 1). */
  weight?: number;
  choices: EventChoice[];
}

export const TRAVEL_EVENTS: GameEvent[] = [
  {
    id: 'patrouille-braise',
    title: 'Patrouille de Braise',
    text: 'Une colonne d’armures rouges barre la piste. Un officier lève la main : « Tes papiers, ou ta tête. » Ils cherchent un Foudroyé. Ils cherchent toi.',
    regions: ['braise', 'cotes', 'pilier'],
    weight: 2,
    choices: [
      {
        label: 'Te fondre dans la foule et filer.',
        result: 'Tu baisses la tête et te glisses entre deux charrettes. Le cœur battant, tu les laisses derrière — mais la course t’a épuisé.',
        effects: [
          { type: 'energy', amount: -14 },
          { type: 'time', minutes: 40 },
        ],
      },
      {
        label: 'Frapper le premier, percer la ligne.',
        result: 'Un éclair, un cri, la ligne se rompt. Tu passes — mais on a vu la foudre, et la nouvelle court déjà.',
        effects: [
          { type: 'volte', amount: 18 },
          { type: 'threat', level: 'mortel' },
          { type: 'item', itemId: 'eclat-terne', qty: 2 },
        ],
      },
    ],
  },
  {
    id: 'marchand-errant',
    title: 'Le colporteur des chemins',
    text: 'Un vieil homme pousse une carriole bringuebalante, lanternes éteintes, sourire fendu. « Pilules, baumes, rumeurs… pour un visage honnête, c’est presque donné. »',
    weight: 2,
    choices: [
      {
        label: 'Échanger contre une Pilule de Souffle.',
        result: 'Tu cèdes quelques éclats. La pilule disparaît dans ta manche, tiède comme une braise apprivoisée.',
        effects: [{ type: 'item', itemId: 'pilule-souffle', qty: 1 }],
      },
      {
        label: 'Lui soutirer des nouvelles du Lys Rouge.',
        result: 'Il parle, à mots couverts, d’une Souveraine Écarlate et d’une Fêlure qui se referme. Tu en sais plus, désormais.',
        effects: [
          { type: 'discover', kind: 'character', id: 'yanhong' },
          { type: 'time', minutes: 20 },
        ],
      },
    ],
  },
  {
    id: 'sanctuaire-luciole',
    title: 'Un cairn de lucioles',
    text: 'Au bord de la route, un petit autel de pierres ; des lucioles dorées y tournent lentement, comme en prière. On dit qu’y veiller un moment apaise l’âme.',
    regions: ['luciole', 'pilier'],
    choices: [
      {
        label: 'T’asseoir et reprendre ton souffle.',
        result: 'Tu fermes les yeux. Le temps coule. Quand tu repars, tes membres sont plus légers — mais la nuit a avancé.',
        effects: [
          { type: 'energy', amount: 30 },
          { type: 'vitality', amount: 12 },
          { type: 'time', minutes: 90 },
        ],
      },
      {
        label: 'Murmurer un nom à une luciole.',
        result: 'Elle se pose sur ton doigt, palpite, puis s’envole vers le Pilier. Tu ignores si elle a entendu. Tu repars, le cœur étrange.',
        effects: [{ type: 'discover', kind: 'beast', id: 'retenus' }],
      },
    ],
  },
  {
    id: 'charnier-ossuaire',
    title: 'Le champ sans tombes',
    text: 'La piste traverse un ancien champ de bataille que nul n’a enseveli. Les os affleurent. Au loin, une masse pâle bouge — trop grande pour un homme.',
    weight: 1,
    choices: [
      {
        label: 'Contourner en silence.',
        result: 'Tu retiens ton souffle et fais un large détour. La chose ne te suit pas — cette fois. Mais tu n’oublieras pas sa silhouette.',
        effects: [
          { type: 'discover', kind: 'enemy', id: 'ossuaire' },
          { type: 'energy', amount: -10 },
          { type: 'time', minutes: 50 },
        ],
      },
      {
        label: 'Fouiller les morts pour des éclats.',
        result: 'Tu trouves quelques éclats ternes parmi les côtes — et la masse pâle, soudain, se tourne vers toi.',
        effects: [
          { type: 'item', itemId: 'eclat-terne', qty: 3 },
          { type: 'discover', kind: 'enemy', id: 'ossuaire' },
          { type: 'threat', level: 'mortel' },
        ],
      },
    ],
  },
  {
    id: 'orage-cotes',
    title: 'Le ciel qui appelle',
    text: 'L’orage descend bas, électrique, et ta peau se hérisse. La foudre te reconnaît. Tu pourrais t’ouvrir à elle — et te charger.',
    regions: ['cotes', 'pilier'],
    phase: ['crépuscule', 'nuit'],
    weight: 2,
    choices: [
      {
        label: 'Lever les bras et conduire la foudre.',
        result: 'L’éclair te traverse sans te briser. Ta réserve déborde presque — grisant, dangereux.',
        effects: [{ type: 'volte', amount: 28 }],
      },
      {
        label: 'Te couvrir et laisser passer l’orage.',
        result: 'Tu t’abrites sous un surplomb. La tempête rugit, puis s’éloigne. Tu as perdu du temps, gagné en prudence.',
        effects: [{ type: 'time', minutes: 60 }],
      },
    ],
  },
  {
    id: 'veuve-lanternes',
    title: 'Une lumière rouge sur la route',
    text: 'Au crépuscule, une silhouette en deuil avance vers toi, lanterne écarlate au poing. Une douceur terrible émane d’elle. Tu sens qu’il ne faut pas suivre la lumière.',
    phase: ['crépuscule', 'nuit'],
    weight: 1,
    choices: [
      {
        label: 'Détourner les yeux et passer vite.',
        result: 'Tu fixes tes pieds et accélères. La lueur rouge s’attarde dans ton dos, puis s’éteint. Tu sauras la reconnaître.',
        effects: [
          { type: 'discover', kind: 'enemy', id: 'veuve' },
          { type: 'energy', amount: -8 },
        ],
      },
      {
        label: 'Lui adresser la parole.',
        result: 'Elle lève la lanterne ; des visages aimés y flottent. Tu recules juste à temps — le chagrin a un goût de piège.',
        effects: [
          { type: 'discover', kind: 'enemy', id: 'veuve' },
          { type: 'vitality', amount: -10 },
          { type: 'threat', level: 'tendu' },
        ],
      },
    ],
  },
  {
    id: 'pelerin-lys',
    title: 'Le pèlerin aux mille lanternes',
    text: 'Un prêtre encapuchonné chemine seul, une lanterne d’âme à la ceinture. Il s’arrête, te dévisage longuement. « Tu portes la foudre. L’Ordre t’attend, qu’il te plaise ou non. »',
    regions: ['lys', 'pilier'],
    choices: [
      {
        label: 'L’interroger sur le Lys Rouge.',
        result: 'Il parle des morts qui ne partent plus, du sang qui scelle, d’une médium qui t’observe. Tu retiens chaque mot.',
        effects: [
          { type: 'discover', kind: 'faction', id: 'lys' },
          { type: 'discover', kind: 'character', id: 'shulan' },
          { type: 'time', minutes: 25 },
        ],
      },
      {
        label: 'Le congédier d’un mot sec.',
        result: 'Il s’incline, trop poliment. « Comme tu voudras. Les morts, eux, sont patients. » Son regard te suit longtemps.',
        effects: [{ type: 'threat', level: 'tendu' }],
      },
    ],
  },
  {
    id: 'campement-cendres',
    title: 'Un feu de camp abandonné',
    text: 'Des braises tièdes, une gamelle renversée, des traces de lutte. Quelqu’un est parti vite — ou n’est pas parti. Un baume oublié luit dans l’herbe.',
    choices: [
      {
        label: 'Récupérer ce qui traîne et te reposer.',
        result: 'Tu ranimes le feu, recouds tes forces. Le baume rejoint ta besace.',
        effects: [
          { type: 'item', itemId: 'baume-cendre-lune', qty: 1 },
          { type: 'energy', amount: 18 },
          { type: 'time', minutes: 70 },
        ],
      },
      {
        label: 'Ne pas t’attarder — c’est peut-être un piège.',
        result: 'Tu prends le baume au vol et repars sans ralentir. La prudence, encore. Toujours.',
        effects: [{ type: 'item', itemId: 'baume-cendre-lune', qty: 1 }],
      },
    ],
  },
];

export const EVENT_BY_ID: Record<string, GameEvent> = Object.fromEntries(
  TRAVEL_EVENTS.map((e) => [e.id, e]),
);
