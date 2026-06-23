import type { PointOfInterest, Region, Route } from './types';

// ============================================================================
// Les régions de Shendaï, organisées autour du Pilier d'Âmes (centre).
// Refonte « culture d'abord » : chaque terre se définit par ses mœurs, son
// parler, ses tensions internes — l'élément n'est qu'un symbole parmi d'autres.
// Chaque région porte son thème (« peau »), son glyphe et ses particules.
// ============================================================================

export const REGIONS: Region[] = [
  {
    id: 'cotes',
    themeId: 'cotes',
    name: 'Les Côtes Foudroyées',
    subtitle: 'le Bas-Pays — terre d’origine',
    glyph: '雷',
    faction: 'Vassale de l’Empire',
    voie: 'Foudre',
    danger: 2,
    particle: 'sparks',
    x: 16,
    y: 74,
    summary:
      'Une marge pauvre et méprisée, plantée dans la vase des marées, où le ciel gronde sans répit. On y survit du sel et de l’épave, sous la dîme de l’Empire. C’est ici, à Léïsha, que ta foudre s’est éveillée pour la première fois.',
    culture:
      'On y vit sous l’orage comme sous un créancier : il finit toujours par encaisser. On ne prie pas pour être protégé, mais pour être oublié du ciel ; une maison frappée par la foudre est dite maudite, et l’on pose du sel à sa porte. Salut : « Reste sec. — Et toi, debout. » ; on jure « par le sel » et l’on compte son âge en orages, pas en années. Misère têtue, contrebande vers les Clans, et partout les Aiguilles — vieilles flèches de fer noir plantées dans les hauts-fonds, que nul n’a vu dresser et que tous entretiennent par terreur.',
    cities: ['Léïsha (bourg portuaire)'],
    discovered: true,
  },
  {
    id: 'braise',
    themeId: 'braise',
    name: 'L’Empire de Braise',
    subtitle: 'Zhūyán — la cour qui monte en brûlant',
    glyph: '炎',
    faction: 'Empire de Braise',
    voie: 'Brasier',
    danger: 5,
    particle: 'embers',
    x: 30,
    y: 56,
    summary:
      'La puissance dominante : militaire, somptueuse, expansionniste. Ses armées brûlent ce qu’elles ne soumettent pas, et sa cour dévore les siens pour s’élever. Le trône y rêve de devenir un dieu.',
    culture:
      'On s’y élève en brûlant ce qui est sous soi : la mortalité est une impureté à consumer, l’Empereur un soleil en devenir. Le rang s’affiche par la hauteur des terrasses ; on n’y refuse jamais en face — on « offre sa cendre ». On n’obtient un grade qu’en présentant les cendres d’un rival vaincu (la Montée des Cendres), et les exécutions publiques sont des fêtes civiques. Politesse-lame, encens lourd jeté par-dessus l’odeur des marchés d’esclaves de Lúgang.',
    cities: ['Vermillon (Zhūchéng)', 'Hóshan la Forge-Cité', 'Lúgang'],
    discovered: true,
  },
  {
    id: 'givre',
    themeId: 'givre',
    name: 'Les Cimes Blanches',
    subtitle: 'le Cloître des Veilleurs — toit du monde',
    glyph: '霜',
    faction: 'Cloître des Veilleurs Ailés',
    voie: 'Givre',
    danger: 4,
    particle: 'snow',
    x: 54,
    y: 14,
    summary:
      'Au toit du monde, un ordre monastique veille sur la Fêlure depuis mille ans, par vœu de silence. Détachés, lucides, parfois cruels par devoir. Ils ne haïssent pas les Volts : ils les jugent.',
    culture:
      'Ici, on mesure le temps en patience, pas en jours ; parler fort est une faute, pleurer un luxe, et l’on répond toujours à une question par une autre. Les plus anciens Veilleurs ne meurent pas : ils se laissent prendre par le givre jusqu’à devenir des statues qu’on consulte encore. Beauté glacée et cruauté tranquille de ceux qui ont cessé de ressentir — la chaleur humaine y passe pour une faiblesse à corriger.',
    cities: ['Báichán, le Monastère des Cimes'],
    discovered: true,
  },
  {
    id: 'luciole',
    themeId: 'luciole',
    name: 'Les Steppes de la Luciole',
    subtitle: 'les Mers d’Herbe — clans cavaliers',
    glyph: '螢',
    faction: 'Clans de la Luciole',
    voie: 'Luciole',
    danger: 3,
    particle: 'fireflies',
    x: 82,
    y: 42,
    summary:
      'Une mer d’herbe sans fin, parcourue par des clans cavaliers libres qui n’enterrent pas leurs morts : ils les portent. Ennemis jurés de l’Empire, ils pourraient bien armer un Volt.',
    culture:
      'On n’y enterre pas les morts, on les emmène : chaque luciole est l’âme d’un ancêtre, et l’on grave les noms des défunts sur l’Arbre aux Mille Noms. Deux choses y sont sacrées — l’hospitalité et la vendetta : on partage son feu avec l’étranger, et l’on poursuit une dette de sang sur trois générations. Le camp se déplace sans cesse (« une tente plantée deux fois est une tombe »), ce qui rend les clans insaisissables pour l’Empire qu’ils méprisent.',
    cities: ['La Vallée des Lucioles', 'Les Tentes-Noires'],
    discovered: true,
  },
  {
    id: 'lys',
    themeId: 'lys',
    name: 'La Frontière des Morts',
    subtitle: 'Hónglián — le royaume du Lys Rouge',
    glyph: '蓮',
    faction: 'Ordre du Lys Rouge',
    voie: 'Lys',
    danger: 4,
    particle: 'petals',
    x: 60,
    y: 82,
    summary:
      'Une théocratie funéraire, mi-temple mi-secte, qui règne sur le passage des âmes. Mille lanternes, autant de morts qui veillent. Elle ne te tuerait pas : elle voudrait t’employer.',
    culture:
      'La mort n’y est pas une fin mais une administration : on scelle les défunts dans des lanternes et on les fait travailler — témoigner, garder, prédire. Le deuil est une liturgie, le sacrifice une vertu, le sang une encre. On parle bas, en formules, et l’on offre toujours du thé à un mort avant de lui adresser la parole. Le lys rouge pousse partout où une âme a passé — la cité tout entière en est rouge.',
    cities: ['Hóngmén, la Cité aux Mille Lanternes', 'le Sanctuaire du Miroir Lunaire'],
    discovered: true,
  },
  {
    id: 'pilier',
    themeId: 'pilier',
    name: 'Le Pilier d’Âmes',
    subtitle: 'le cœur du monde — l’interdit',
    glyph: '柱',
    danger: 5,
    particle: 'light',
    x: 50,
    y: 48,
    summary:
      'La colonne de lumière qui transperce Shendaï de la terre aux nuages. Vertige, gardiens sans nom, pression mortelle. Nul n’y vit ; toutes les puissances s’y rendent en secret, et toutes le nient.',
    culture:
      'Le centre du monde, et son interdit : on y monte en pèlerinage ou en folie, jamais pour y vivre. La pression de la colonne broie les âmes faibles ; ceux qui en reviennent ne parlent plus tout à fait pareil, quand ils parlent encore. La seule loi y est le silence des gardiens sans nom — et la rumeur que la Fêlure se referme, lentement, par le haut.',
    discovered: true,
  },
];

export const REGION_BY_ID: Record<string, Region> = Object.fromEntries(
  REGIONS.map((r) => [r.id, r]),
);

// Le réseau de routes — relie les terres entre elles, pas seulement au Pilier.
export const ROUTES: Route[] = [
  { from: 'cotes', to: 'braise', major: true },
  { from: 'braise', to: 'pilier', major: true },
  { from: 'braise', to: 'givre' },
  { from: 'givre', to: 'pilier', major: true },
  { from: 'luciole', to: 'pilier', major: true },
  { from: 'luciole', to: 'braise' },
  { from: 'lys', to: 'pilier', major: true },
  { from: 'lys', to: 'luciole' },
  { from: 'cotes', to: 'lys' },
];

// Points d'intérêt — cités, sites sacrés, carrefours, ruines. Donnent vie à la carte.
export const POINTS_OF_INTEREST: PointOfInterest[] = [
  { id: 'leisha', name: 'Léïsha', kind: 'cité', x: 11, y: 83 },
  { id: 'vermillon', name: 'Vermillon', kind: 'cité', x: 23, y: 49 },
  { id: 'hoshan', name: 'Hóshan, la Forge-Cité', kind: 'cité', x: 39, y: 63 },
  { id: 'baichan', name: 'Báichán', kind: 'site', x: 59, y: 7 },
  { id: 'vallee-lucioles', name: 'Vallée des Lucioles', kind: 'site', x: 91, y: 35 },
  { id: 'hongmen', name: 'Hóngmén', kind: 'cité', x: 67, y: 90 },
  { id: 'miroir-lunaire', name: 'Sanctuaire du Miroir Lunaire', kind: 'site', x: 53, y: 66 },
  { id: 'gue-cendres', name: 'le Gué des Cendres', kind: 'carrefour', x: 22, y: 65 },
  { id: 'pont-des-os', name: 'le Pont des Os', kind: 'ruine', x: 73, y: 63 },
];

/** Lieu de départ du RP. */
export const STARTING_REGION_ID = 'cotes';
