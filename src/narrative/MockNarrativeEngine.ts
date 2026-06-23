import type {
  Choice,
  EngineResponse,
  NarrativeEngine,
  NarrativeMessage,
} from './types';

// ============================================================================
// Moteur mock — joue la scène d'ouverture « la Nuit de Braise » (Léïsha).
// Scénario scripté et branché ; remplaçable par l'IA sans toucher à l'UI.
// ============================================================================

let seq = 0;
const uid = () => `m${seq++}`;

const narr = (text: string): NarrativeMessage => ({ id: uid(), kind: 'narration', text });
const sys = (text: string): NarrativeMessage => ({ id: uid(), kind: 'system', text });
const npc = (speaker: string, text: string, speakerId?: string): NarrativeMessage => ({
  id: uid(),
  kind: 'npc',
  text,
  speaker,
  speakerId,
});

/** Petit délai pour donner la sensation d'un récit qui « respire ». */
const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

interface Beat {
  messages: NarrativeMessage[];
  choices?: Choice[];
  effects?: EngineResponse['effects'];
}

const BEATS: Record<string, Beat> = {
  start: {
    messages: [
      narr(
        'Léïsha pue le sel et la boue. Ce soir, tu as dix-huit ans — personne ne l’a fêté. Le ciel du Bas-Pays gronde, comme toujours, une promesse d’orage qui ne tient jamais.',
      ),
      npc(
        'Maître Ren',
        'Garde haute, gamin. Le ciel n’aime pas qu’on baisse les bras. Surtout pas cette nuit.',
        'ren',
      ),
      narr(
        'Des torches franchissent la digue. Pas des pêcheurs : une colonne. Armures rouges, sceau de braise. Une patrouille de l’Empire — venue pour un déserteur, une dîme de sang, l’ordinaire de leurs tournées. Ils ne savent rien de toi. Pas encore.',
      ),
      narr(
        'La fouille tourne court. Un vieux refuse d’ouvrir sa porte ; une lame s’en charge. Le feu prend une toiture, puis dix. Le bourg s’embrase. Et quelque chose, sous ta peau, se met à crépiter.',
      ),
      sys('Ta Volte d’Âme s’éveille. Pour la première fois, la foudre te répond.'),
    ],
    choices: [
      { id: 'strike', label: 'Frapper l’enquêteur le plus proche, poing en avant.', tone: 'mortel' },
      { id: 'shield', label: 'Te jeter devant Maître Ren et l’entraîner vers les ruelles.', tone: 'tendu' },
      { id: 'scream', label: 'Hurler — et laisser la foudre déborder sans la retenir.', tone: 'mortel' },
    ],
    effects: [{ type: 'threat', level: 'tendu' }],
  },

  strike: {
    messages: [
      narr(
        'Tu fends l’air. Tes Bandages claquent ; l’éclair court le long de ton bras et explose dans la cuirasse de l’homme. L’odeur de métal et de cheveux brûlés. Il ne crie pas — il n’a pas le temps.',
      ),
      sys('Un éclair foudroie le soldat. La nuit s’illumine comme un phare — et dans l’ombre, des regards se figent. Ici, à l’instant, la rumeur d’un Foudroyé vient de naître.'),
      npc('Maître Ren', 'Voilà. Tu as frappé avant de savoir pourquoi. Maintenant : cours.', 'ren'),
      narr(
        'Mais on a vu la lumière. Au bout de la rue, une silhouette s’avance dans les flammes sans les craindre — un sabre incandescent au poing.',
      ),
    ],
    choices: [
      { id: 'face-kaien', label: 'Tenir tête à la silhouette au sabre.', tone: 'mortel' },
      { id: 'flee', label: 'Saisir Ren et fuir dans la cendre.', tone: 'tendu' },
    ],
    effects: [
      { type: 'volte', amount: 22 },
      { type: 'threat', level: 'mortel' },
    ],
  },

  scream: {
    messages: [
      narr(
        'Tu n’essaies même pas de la tenir. Le cri sort, et la foudre sort avec lui — un cercle blanc qui arrache les torches, fait ployer les lances, jette les hommes au sol. Magnifique. Ingouvernable.',
      ),
      sys('Surcharge. La foudre déborde — elle frappe tes ennemis, et elle te dévore aussi. Brûlure d’âme.'),
      narr(
        'Tes nerfs hurlent. Du sang au coin de tes lèvres. Tu tiens debout par miracle — et tu sens, très clairement, que recommencer te tuerait.',
      ),
      npc('Maître Ren', 'Idiot ! Cette puissance n’est pas un cadeau, c’est une dette. Respire. RESPIRE.', 'ren'),
    ],
    choices: [
      { id: 'flee', label: 'Obéir à Ren, ravaler la foudre, et fuir.', tone: 'tendu' },
      { id: 'collapse', label: 'Pousser encore — une dernière décharge, coûte que coûte.', tone: 'mortel' },
    ],
    effects: [
      { type: 'volte', amount: 46 },
      { type: 'threat', level: 'mortel' },
    ],
  },

  shield: {
    messages: [
      narr(
        'Tu n’attaques pas — tu protèges. Ton épaule cueille le vieux maître au moment où une lance fend l’air où était sa gorge. Vous roulez ensemble dans une ruelle noire de fumée.',
      ),
      npc('Maître Ren', 'Toujours à vouloir sauver les autres avant toi. Tu vivras vieux… ou pas du tout.', 'ren'),
      narr(
        'Derrière vous, la grand-rue n’est plus qu’un mur de feu. Devant : un dédale de ruelles que toi seul connais. Mais on entend déjà des bottes ferrées vous suivre.',
      ),
    ],
    choices: [
      { id: 'flee', label: 'Filer par les toits que tu connais par cœur.', tone: 'tendu' },
      { id: 'ambush', label: 'Tendre un piège dans le noir : les attendre.', tone: 'mortel' },
    ],
    effects: [
      { type: 'volte', amount: 10 },
      { type: 'threat', level: 'tendu' },
    ],
  },

  'face-kaien': {
    messages: [
      narr(
        'Tu ne fuis pas. La silhouette s’arrête à dix pas. Jeune, beau, terrible — une armure de prince et des yeux qui ont déjà pesé ta mort. Il incline la tête, presque déçu de te trouver si maigre.',
      ),
      npc(
        'Kaïen',
        'Un Foudroyé… ici, dans ce cloaque ? (Son sabre s’abaisse d’un pouce, ses yeux brillent.) On ne m’avait rien dit. Personne ne sait encore — sauf moi, désormais. Et je n’ai pas décidé ce que j’en ferai.',
        'kaien',
      ),
    ],
    choices: [
      { id: 'defy', label: '« Viens le prendre. »', tone: 'mortel' },
      { id: 'flee', label: 'Lui jeter une gerbe d’étincelles et disparaître.', tone: 'tendu' },
    ],
    effects: [
      { type: 'threat', level: 'mortel' },
    ],
  },

  defy: {
    messages: [
      narr(
        'Tu lèves les poings. La foudre danse entre tes doigts, et pour un battement de cœur, le prince hésite — il a vu quelque chose en toi qu’il ne saura pas oublier.',
      ),
      sys('Mais tu es Éveillé, et lui est Crue. À palier d’écart, le supérieur écrase. Son sabre est déjà sur toi.'),
    ],
    choices: [
      { id: 'last-spark', label: 'Tout miser : une dernière étincelle au visage.', tone: 'mortel' },
      { id: 'flee', label: 'À la dernière seconde — plonger et fuir.', tone: 'tendu' },
    ],
    effects: [{ type: 'volte', amount: 18 }],
  },

  'last-spark': {
    messages: [
      sys('Tu frappes au-dessus de ton palier. La foudre obéit — et te brûle de l’intérieur.'),
      narr(
        'L’éclair part. Kaïen recule, aveuglé, une marque noire sur la joue. Tu as gagné un instant. Tu l’as payé de presque tout ce qui te restait. Le monde vacille, blanc puis noir.',
      ),
    ],
    effects: [
      { type: 'volte', amount: 40 },
      { type: 'death' },
    ],
  },

  collapse: {
    messages: [
      sys('Tu pousses au-delà de ce que ton âme peut tenir.'),
      narr(
        'La dernière décharge est la plus belle — et la dernière. Elle balaie la ruelle, fauche tes poursuivants… et te fauche avec eux. Tu t’effondres dans la cendre, le sourire aux lèvres, foudroyé par toi-même.',
      ),
    ],
    effects: [{ type: 'death' }],
  },

  ambush: {
    messages: [
      narr(
        'Tu coupes ton souffle et te fonds dans l’ombre d’un porche. Les bottes approchent. Un, deux, trois soldats — et tu attends le dernier pas, la foudre lovée au creux du poing comme un serpent patient.',
      ),
      npc('Maître Ren', 'Bien. Frappe une fois. Frappe juste. Puis on ne s’arrête plus.', 'ren'),
    ],
    choices: [
      { id: 'strike-clean', label: 'Frapper le premier homme, net, et percer la ligne.', tone: 'mortel' },
      { id: 'flee', label: 'Les laisser passer et s’éclipser sans un bruit.', tone: 'calme' },
    ],
    effects: [{ type: 'threat', level: 'mortel' }],
  },

  'strike-clean': {
    messages: [
      narr(
        'Un éclair. Un seul. L’homme tombe sans comprendre, les deux autres se retournent dans le vide — tu es déjà passé entre eux, Ren sur tes talons.',
      ),
      sys('Tu apprends, déjà, à doser. La foudre n’a presque pas mordu.'),
    ],
    choices: [{ id: 'flee', label: 'Disparaître vers la digue, loin du feu.', tone: 'tendu' }],
    effects: [{ type: 'volte', amount: 8 }],
  },

  flee: {
    messages: [
      narr(
        'Vous courez. Derrière vous, Léïsha brûle comme une torche plantée dans la mer. Devant, la nuit immense — et personne, encore, qui sache ton nom.',
      ),
      npc(
        'Maître Ren',
        'Écoute-moi bien, petit. Cette nuit, quelques langues t’ont vu. La rumeur va enfler, se déformer, et finir par grimper jusqu’aux cours. Le jour où elles y croiront, elles viendront — toutes. D’ici là : apprends vite, et reste une ombre.',
        'ren',
      ),
      sys('La Nuit de Braise s’achève. Quelques témoins t’ont vu — c’est déjà beaucoup trop. Le jeu commence.'),
      narr('Ouvre la carte : choisis où porter tes pas. Le givre, la braise, les steppes — chaque terre changera la couleur du ciel.'),
    ],
    effects: [{ type: 'threat', level: 'calme' }],
  },
};

/** Réponses improvisées à la saisie libre (le mock ne comprend pas le texte). */
const FREEFORM_REPLIES = [
  'Le récit retient ton geste un instant — la cendre tourbillonne, attentive. (L’IA narratrice, branchée plus tard, improvisera ici. Pour la démo, suis les options proposées.)',
  'Tes mots se perdent dans le fracas du feu. Quelque chose t’observe sans répondre. (Réponse libre simulée — choisis une option pour avancer la scène.)',
];

export class MockNarrativeEngine implements NarrativeEngine {
  private freeformIndex = 0;

  private async beat(key: string): Promise<EngineResponse> {
    await wait(420);
    const b = BEATS[key] ?? BEATS.flee;
    return { messages: b.messages, choices: b.choices, effects: b.effects };
  }

  start(): Promise<EngineResponse> {
    return this.beat('start');
  }

  chooseOption(choiceId: string): Promise<EngineResponse> {
    return this.beat(choiceId);
  }

  async sendPlayerAction(action: string): Promise<EngineResponse> {
    await wait(360);
    const reply = FREEFORM_REPLIES[this.freeformIndex % FREEFORM_REPLIES.length];
    this.freeformIndex++;
    return {
      messages: [
        { id: uid(), kind: 'player', text: action },
        narr(reply),
      ],
    };
  }
}
