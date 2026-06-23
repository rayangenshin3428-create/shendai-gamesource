import type { BossMeta, Enemy } from './types';

// ============================================================================
// Le Panthéon des Menaces — chaque fléau a une rumeur, une histoire, une
// « forme dévoilée » (l'escalade), et une ENTRÉE EN SCÈNE (battements
// d'ambiance joués avant la révélation : environnement → situation → atmosphère).
// ============================================================================

export const ENEMIES: Enemy[] = [
  {
    id: 'aohan',
    name: 'Aohan',
    epithet: 'le Bourreau aux Quatre Bras',
    voie: 'Brasier',
    palier: 'Apogée',
    faction: 'Empire de Braise',
    rumor: 'On ne le voit pas arriver. On voit la fumée de ce qu’il a déjà tué.',
    identity:
      'Géant rouge de trois mètres, quatre bras, peau craquelée de braise, sans yeux (brûlés), masque de fer fondu soudé au visage. Deux fauchards, une chaîne-fouet incandescente, une masse.',
    history:
      'Condamné jeté au bûcher impérial qui refusa de mourir ; brûlé tant de fois qu’il a cessé d’être un homme. L’Empire en a fait son couperet. Il ne brûle plus — il est le feu.',
    entrance: [
      'Autour de toi, tout s’est vidé d’un coup — plus un cri, plus un ordre. Reste l’odeur de viande froide et de fer qu’on rougit.',
      'Une cloche d’exécution sonne une fois, très loin, puis se tait. Quelque chose de lourd s’approche sans hâte, en traînant des chaînes.',
      'L’air devient brûlant à respirer ; tes poings se ferment d’eux-mêmes. Tu comprends, avant même de l’avoir vu, que rien de ce qu’il a croisé n’est jamais ressorti.',
    ],
    revealedForm:
      'Son torse s’ouvre comme une gueule de four ; ses quatre bras deviennent huit ; il aspire l’air alentour (asphyxie) et change la salle en crématoire.',
    apex: true,
    discovered: true,
  },
  {
    id: 'xun',
    name: 'Xun',
    epithet: 'le Prêtre aux Lèvres Cousues',
    voie: 'Lys',
    palier: 'Apogée',
    faction: 'Ordre du Lys Rouge',
    rumor: 'Il ne parle pas. Ce sont tes morts qui parlent à sa place.',
    identity:
      'Grand prêtre décharné, robe de soie noire, bouche cousue de fil rouge — pour que les âmes qu’il commande ne s’échappent pas par sa gorge. Il « parle » en faisant parler les cadavres.',
    history:
      'Médium si puissant que les morts hurlaient sans cesse à travers lui ; il s’est cousu la bouche pour ne plus être leur porte. Il porte en lui une foule muette qu’il lâche sur commande.',
    entrance: [
      'Les lumières alentour s’éteignent l’une après l’autre, en remontant droit vers toi.',
      'Dans le noir, des voix s’élèvent — celles de gens que tu as connus, morts depuis longtemps, qui récitent tes propres secrets.',
      'Un froid de crypte te prend la nuque. Une silhouette décharnée se tient là, immobile, la bouche cousue de rouge — et pourtant ce sont ses lèvres que tu crois voir remuer.',
    ],
    revealedForm:
      'Les coutures cèdent ; un torrent de voix volées jaillit en un chœur-spectre géant qui connaît tes secrets et te les chante.',
    apex: true,
    discovered: true,
  },
  {
    id: 'naqan',
    name: 'Naqan',
    epithet: 'le Chasseur aux Mille Bois',
    voie: 'Luciole',
    palier: 'Apogée',
    faction: 'Steppes (dévoyé)',
    rumor: 'Si tu entends les bois craquer la nuit dans la plaine, ne cours pas. Il aime quand on court.',
    identity:
      'Silhouette d’homme couronnée d’une ramure démesurée où sont empalées des âmes-lucioles ; suivi d’une harde de cavaliers spectraux.',
    history:
      'Pour ramener son clan d’entre les morts, il a lié trop d’âmes — elles l’ont submergé. Il chasse les vivants pour nourrir les morts qui ne le lâchent plus. Il n’en aura jamais assez.',
    entrance: [
      'Tout, autour de toi, se tait d’un coup : plus un grillon, plus un souffle, plus une bête.',
      'Quelque part, du bois craque — lentement, méthodiquement, comme une ramure qui s’étire. Puis le sol tremble sous des sabots qu’on ne voit pas.',
      'Chaque fibre de ton corps te hurle de courir — c’est exactement ce qu’il attend. Dans l’ombre, des lucioles s’allument par centaines, fichées sur une couronne d’os.',
    ],
    revealedForm:
      'Sa ramure devient une forêt d’âmes empalées sur tout l’horizon ; il se disperse en une chevauchée fantôme qui charge de partout à la fois.',
    apex: true,
    discovered: true,
  },
  {
    id: 'ysul',
    name: 'Ysul',
    epithet: 'l’Ange Gelé',
    voie: 'Givre',
    palier: 'Apogée',
    faction: 'Cloître des Veilleurs (hérésie)',
    rumor: 'Les plus vieux Veilleurs ne meurent pas. Le pire d’entre eux a simplement décidé de ne pas s’arrêter.',
    identity:
      'Veilleur Ailé d’une beauté insoutenable, figé dans la glace depuis des siècles — peau bleue, ailes de givre, larmes gelées. Magnifique et faux.',
    history:
      'Refusant la mort qu’on lui ordonnait, il s’est gelé lui-même pour durer ; les siècles l’ont vidé de toute chaleur humaine. Ses larmes gèlent l’âme, pas le corps.',
    entrance: [
      'Le froid tombe d’un coup, anormal, total ; ton souffle gèle en buée avant même de retomber.',
      'Une larme tombe quelque part, gèle avant de toucher le sol et tinte comme du cristal. Le silence, soudain, a le poids d’un linceul.',
      'Tu sens ta colère, ta peur, ton chagrin refluer un à un — non apaisés, mais volés. Devant toi, un être d’une beauté insoutenable ouvre des yeux qui n’ont plus rien d’humain.',
    ],
    revealedForm:
      'Ses ailes éclatent en un blizzard de plumes-lames ; il devient une cathédrale de givre vivante dont chaque vitrail est un mort qu’il a « apaisé ».',
    apex: true,
    discovered: true,
  },
  {
    id: 'porte-visages',
    name: 'Le Porte-Visages',
    epithet: 'le Locataire',
    rumor: 'Regarde bien les gens que tu aimes. L’un d’eux n’est peut-être plus eux.',
    identity:
      'Aucune identité en propre. Une esquille d’âme ancienne qui habite les vivants — entrée par une plaie, par les yeux d’un mourant, ou parce qu’on l’a laissée entrer. Il garde la Voie et les talents de chaque corps porté.',
    history:
      'Il plante des graines dans des victimes qui « éclosent » plus tard — le traître ignore lui-même qu’il en est un. Il peut déjà être un compagnon.',
    entrance: [
      'Autour de toi, tout est intact — un feu encore tiède, des affaires posées — mais il n’y a plus personne.',
      'Quelqu’un t’appelle par ton nom, de la voix d’un proche. Puis de la voix d’un autre. Puis de la tienne.',
      'Tu n’oses plus regarder en face ceux qui t’accompagnent. Dans l’ombre, une chose sans visage essaie les leurs, un à un.',
    ],
    revealedForm:
      'Acculé, il abandonne la peau — un nœud grouillant de tous les visages portés, parlant de mille voix, chaque bouche crachant une Voie différente.',
    discovered: false,
  },
  {
    id: 'ossuaire',
    name: 'L’Ossuaire Vivant',
    epithet: 'la Montagne d’Os',
    rumor: 'Ne laissez jamais vos morts sans sépulture. Ils se relèvent ensemble.',
    identity:
      'Colosse silencieux d’os fusionnés, né là où trop de gens meurent sans tombe ; il grandit à chaque cadavre. Lent, presque impossible à abattre.',
    history:
      'Né des charniers que personne n’a enterrés. Chaque mort sans sépulture rejoint sa masse.',
    entrance: [
      'Le sol, soudain, n’est plus qu’ossements blanchis qui crissent sous chacun de tes pas.',
      'Devant toi, une masse que tu prenais pour un tertre se met à bouger. Ce n’est pas un tertre.',
      'Une ombre énorme se redresse, lente, patiente. Tu comprends que chaque mort sans sépulture des environs est venu grossir la chose qui se dresse.',
    ],
    revealedForm:
      'Rassasié, ses crânes s’embrasent d’un feu d’âmes ; il devient une cathédrale de braise et d’os en marche, et le sol qu’il foule lui rend ses morts.',
    discovered: false,
  },
  {
    id: 'veuve',
    name: 'La Veuve des Lanternes',
    epithet: 'la Glaneuse de Chagrin',
    voie: 'Lys',
    rumor: 'Si tu pleures un mort sur la route au crépuscule, ne suis pas la lumière rouge.',
    identity:
      'Silhouette en deuil arpentant les routes funéraires, lanterne rouge au poing. Ceux que le chagrin ronge suivent la lumière sans pouvoir s’arrêter ; leur âme est aspirée dans la lanterne.',
    history:
      'Elle se nourrit de deuil. Nul ne sait qui elle pleurait la première.',
    entrance: [
      'La lumière baisse, rougeâtre ; tout près de toi, des lanternes s’allument seules, une à une.',
      'Une lueur rouge approche, portée par une silhouette en deuil qui ne marche pas — qui glisse.',
      'Une tristesse qui n’est pas la tienne te serre la gorge et t’attire vers la lumière. Sous le voile, elle te montre déjà le visage de quelqu’un que tu as perdu.',
    ],
    revealedForm:
      'Sa lanterne pleine, elle l’ouvre — un flot d’âmes hurlantes se noue en un spectre-tour qui te montre les visages de ceux que tu as perdus.',
    discovered: false,
  },
  {
    id: 'tianhuo',
    name: 'Tiānhuo',
    epithet: 'le Brasier Couronné',
    voie: 'Brasier',
    palier: 'Apogée',
    faction: 'Empire de Braise',
    rumor: 'L’Empereur n’a pas peur de la mort. Il a un plan pour la dévorer.',
    identity:
      'Géant solaire, peau cuivrée, marques rituelles rouges, chevelure de flammes ; hallebarde de feu ; trône dans un palais qui brûle sans se consumer.',
    history:
      'Simple soldat devenu empereur en brûlant tout sur sa route. Il a juré de vaincre la mortalité. Il lui manque une seule chose pour devenir dieu : siphonner la foudre première d’un Volt. Il en fait quérir partout — sans se douter qu’aux Côtes, un gamin vient à peine d’allumer la sienne.',
    entrance: [
      'La chaleur monte d’un coup, insoutenable ; autour de toi, le métal mollit et l’or se met à suinter le long des surfaces.',
      'Une pression de fournaise te plie en deux. Quelque chose d’immense, de solaire, se redresse lentement et fait taire tout le reste.',
      'Le ciel lui-même semble s’embraser, comme si le soleil se penchait pour te regarder. Tu n’es plus qu’une étincelle devant un brasier qui a juré de dévorer la mort.',
    ],
    revealedForm:
      'Sous la peau de l’empereur sommeille un soleil-démon ; s’il atteint son but, le ciel s’embrase de visages géants hurlants et il cesse d’être un homme.',
    apex: true,
    discovered: true,
  },
];

export const ENEMY_BY_ID: Record<string, Enemy> = Object.fromEntries(
  ENEMIES.map((e) => [e.id, e]),
);

// ============================================================================
// Méta de combat — arène contextuelle + capacité perturbatrice par boss.
// Sert au « mode combat de boss » (décor, ambiance, gimmick).
// ============================================================================
export const BOSS_META: Record<string, BossMeta> = {
  aohan: {
    arena: { name: 'la Caserne du Couperet', env: 'forteresse' },
    power: 'aspire l’air alentour et change la salle en crématoire',
    effect: 'inferno',
  },
  xun: {
    arena: { name: 'les Geôles d’Âmes', env: 'temple' },
    power: 'fait parler tes morts pour te désorienter',
    effect: 'voices',
  },
  naqan: {
    arena: { name: 'la Forêt des Mille Bois', env: 'foret' },
    power: 'se disperse et charge de partout à la fois',
    effect: 'hunt',
  },
  ysul: {
    arena: { name: 'la Cathédrale de Givre', env: 'givre' },
    power: 'gèle l’âme — chaque souffle te ralentit',
    effect: 'frost',
  },
  'porte-visages': {
    arena: { name: 'un campement en ruines', env: 'ruines' },
    power: 'porte le visage d’un proche pour t’égarer',
    effect: 'voices',
  },
  ossuaire: {
    arena: { name: 'les Ruines du champ sans tombes', env: 'ruines' },
    power: 'grandit à chaque mort ; ses crânes s’embrasent',
    effect: 'inferno',
  },
  veuve: {
    arena: { name: 'le Sanctuaire de la route funéraire', env: 'sanctuaire' },
    power: 'sa lumière rouge appelle ton chagrin',
    effect: 'voices',
  },
  tianhuo: {
    arena: { name: 'le Trône de Cendres', env: 'fournaise' },
    power: 'embrase le ciel de visages géants hurlants',
    effect: 'inferno',
  },
};
