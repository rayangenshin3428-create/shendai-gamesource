import type { Character } from './types';

// ============================================================================
// Personnages majeurs — alliés, romances, mentor, figure mythique.
// Refonte « personnages marquants » : apparence détaillée (direction artistique
// inspirée de WLOP — figures lumineuses et mélancoliques dans l'ombre), parler
// reconnaissable, objectif, défaut. De vrais êtres, pas des archétypes de RPG.
// ============================================================================

export const CHARACTERS: Character[] = [
  {
    id: 'suiye',
    name: 'Suiyé',
    epithet: 'la Séraphine aux Ailes de Cendre',
    voie: 'Givre',
    palier: 'Ascendant',
    alignment: 'neutre',
    faction: 'Cloître du Givre',
    blurb:
      'Être céleste aux longues ailes de cendre et au halo froid, d’une beauté triste à couper le souffle. Un mystère qui plane sur le monde sans jamais y descendre tout à fait.',
    appearance:
      'Immense et pâle, presque translucide. Cheveux d’argent qui flottent sans vent ; robe de soie grise qui se défait en brume à ses pieds ; de grandes ailes sombres dont les plumes tombent comme une neige noire et se dissolvent avant de toucher terre. Ses yeux restent clos — et pourtant tu jures qu’elle te regarde.',
    voice:
      'Elle ne parle presque jamais. Quand elle le fait, c’est une seule phrase, sans contexte, qui ne prend tout son sens que des jours plus tard. Aucune question, aucun ordre — seulement des constats qui résonnent comme des sentences.',
    goal:
      'Nul ne sait. Veille-t-elle sur les Volts, les juge-t-elle, ou les pleure-t-elle d’avance ? Sa présence accompagne toujours un tournant, jamais une réponse.',
    flaw:
      'Le détachement. Elle a vu tomber tant d’hommes-foudre qu’elle pourrait te laisser mourir sans ciller — non par cruauté, mais par habitude du chagrin.',
    detail:
      'Dernière, peut-être, des dieux. Enfant, le héros mourant sous l’orage a cru voir une silhouette ailée dans la foudre qui l’a ramené à la vie — souvenir, hallucination, ou veille divine ? Elle revient par bribes : un reflet dans une flaque, une voix dans le tonnerre. Elle plane sur l’histoire sans jamais la diriger.',
    discovered: true,
  },
  {
    id: 'aylin',
    name: 'Aylin',
    epithet: 'la Cavalière aux Lucioles',
    voie: 'Luciole',
    palier: 'Conduit',
    alignment: 'romance',
    romanceable: true,
    faction: 'Clans de la Luciole',
    blurb:
      'Guerrière des steppes, arc d’âmes et tresse alourdie de perles d’os. Fière, libre, sarcastique — et dévorée par un deuil qu’elle refuse de poser.',
    appearance:
      'Haute et sèche, la peau tannée par le vent des Mers d’Herbe. Longue tresse noire où dorment des lucioles captives qui s’allument quand monte sa colère. Une cicatrice pâle barre sa pommette ; les yeux ambrés et fixes d’un rapace. Fourrure de loup-de-givre sur une épaule, l’autre laissée nue pour tirer.',
    voice:
      'Parle court, par images de cavalier : « on ne pleure pas un cheval mort en pleine charge ». Le sarcasme lui sert d’armure. Tutoie tout le monde, rois compris, et n’a jamais demandé pardon de sa vie.',
    goal:
      'Traquer un à un les officiers impériaux qui ont massacré son clan, et rendre leurs âmes au vent — pour que les siens, enfin, cessent de peser dans son carquois.',
    flaw:
      'Elle confond deuil et vengeance, et ne sait plus s’arrêter. Sa peur secrète : oublier le visage des morts qu’elle porte — alors elle se les récite chaque nuit, et sacrifierait les vivants pour ne pas les trahir.',
    detail:
      'Fille d’un chef de clan massacré par l’Empire devant elle. Elle a recueilli les âmes des siens dans son carquois et chevauche depuis, de charnier en charnier. T’aimer, c’est accepter d’entrer dans une vie déjà pleine de morts — et de n’y être, peut-être, qu’un de plus.',
    discovered: true,
  },
  {
    id: 'shulan',
    name: 'Shulan',
    epithet: 'la Médium du Lys',
    voie: 'Lys',
    palier: 'Conduit',
    alignment: 'romance',
    romanceable: true,
    faction: 'Ordre du Lys Rouge',
    blurb:
      'Prêtresse-médium du Lys Rouge : elle entend les morts et tisse des fils de sang. Douce, fataliste, une révolte tenue sous le voile.',
    appearance:
      'Menue, le teint de cire, des cernes mauves de quelqu’un qui ne dort jamais tout à fait. Voile de soie noire, lèvres pâles ; à son poignet, un fil rouge noué pour chaque âme qu’elle a guidée — il y en a des centaines, et la corde s’est faite bracelet. Elle se déplace sans bruit, comme pour s’excuser d’exister.',
    voice:
      'Voix basse, polie à l’excès, qui s’efface dès qu’on la regarde. Elle dit « pardon » avant même de refuser. Mais lorsqu’un mort parle à travers elle, le timbre change d’un coup — ce n’est plus elle, et c’est terrifiant.',
    goal:
      'On l’a envoyée t’observer. Pour la première fois, elle voudrait sauver un vivant plutôt que d’escorter un mort — quitte à se dresser contre l’Ordre qui l’a élevée.',
    flaw:
      'L’obéissance. On lui a appris à tout accepter ; elle attend qu’un autre décide pour elle, et se déteste de l’attendre. Sa terreur : finir noyée dans la foule muette des voix qu’elle porte.',
    detail:
      'Vendue enfant à l’Ordre, élevée dans le renoncement et le murmure des cryptes. T’aimer, c’est la dresser contre les siens — et découvrir que la plus douce des prêtresses cache la révolte la plus tranchante.',
    discovered: false,
  },
  {
    id: 'yanhong',
    name: 'Yánhóng',
    epithet: 'la Souveraine Écarlate',
    voie: 'Lys',
    palier: 'Apogée',
    alignment: 'romance',
    romanceable: true,
    faction: 'Ordre du Lys Rouge',
    blurb:
      'Reine-prêtresse du Lys Rouge ; elle commande des milliers d’âmes scellées. Magnétique, calculatrice, d’une solitude de glace sous l’écarlate.',
    appearance:
      'Grande, le port d’une statue de temple. Longue robe écarlate qui traîne derrière elle comme une nappe de sang lent ; coiffe de lanternes minuscules où murmurent des âmes captives ; ongles laqués de noir. Belle d’une beauté qui fait baisser les yeux — parce qu’elle sait, à l’once près, ce qu’elle vaut.',
    voice:
      'Phrase ample, ourlée, jamais pressée ; chaque mot pesé comme une offrande — ou une menace. Elle te vouvoie pour mieux te posséder, et transforme une condamnation en compliment.',
    goal:
      'Refermer la Fêlure avant que les morts ne saturent le monde des vivants. Pour cela, il lui faut la foudre première d’un Volt. La tienne.',
    flaw:
      'Elle s’attache à ce qu’elle compte sacrifier. Sa tendresse est sincère — et n’arrête jamais sa main. Sa solitude est totale : on n’aime pas une reine, on la sert ou on la craint.',
    detail:
      'Elle porte une vision que nul ne croit : la Fêlure se referme lentement, et le jour où elle se scellera, les morts ne pourront plus partir — le monde se noiera dans ses propres âmes. T’aimer, c’est jouer avec une reine qui pourrait te sacrifier en t’aimant, et le pleurer ensuite, sincèrement.',
    discovered: false,
  },
  {
    id: 'ren',
    name: 'Maître Ren',
    epithet: 'le Vieux Poing',
    voie: 'Foudre',
    palier: 'Sceau',
    alignment: 'allié',
    faction: 'Bas-Pays',
    blurb:
      'Vieux maître du « Souffle Court », un bâton pour seule arme et une langue plus tranchante encore. Bourru, ironique — plus paternel qu’il ne l’avouera jamais.',
    appearance:
      'Trapu, noueux, le crâne ras et la barbe grise jaunie par la fumée. Des mains larges couvertes de vieilles brûlures. Il boite d’une jambe — ce qui ne l’empêche pas de te coucher au sol en un souffle. Sur le dos, une veste d’uniforme impérial dont il a arraché lui-même tous les insignes.',
    voice:
      'Il aboie plus qu’il ne parle. Pédagogie à coups d’insultes affectueuses (« idiot », « gamin », « tu frappes comme un comptable »). Mais une fois par jour, sans prévenir, il lâche une phrase qui te reste gravée pour la vie.',
    goal:
      'Te garder en vie assez longtemps pour que tu apprennes à tenir ta foudre — et racheter, à travers toi, le village qu’il a refusé de réduire en cendres.',
    flaw:
      'Le remords le ronge. Il se sacrifierait par culpabilité plutôt que par amour, et te mentirait sans hésiter s’il pensait te protéger. Sa peur : que tu deviennes l’arme qu’il a refusé d’être.',
    detail:
      'Ex-maître d’armes impérial, déserteur depuis le jour où il a refusé de brûler un bourg. Réfugié à Léïsha, il a reconnu chez le gamin la foudre que personne ne voyait, et l’a entraîné « à frapper avant de savoir pourquoi ». Sa dernière leçon sera la plus dure — pour lui comme pour toi.',
    discovered: true,
  },
  {
    id: 'kaien',
    name: 'Kaïen',
    epithet: 'le Prince-Lame',
    voie: 'Brasier',
    palier: 'Crue',
    alignment: 'ennemi',
    faction: 'Empire de Braise',
    blurb:
      'Jeune prince-général de Braise, sabre incandescent, presque aussi rapide que toi. Le plus beau et le plus seul de tes ennemis.',
    appearance:
      'Grand, élégant jusqu’à l’arrogance, les traits parfaits que la fatigue commence à peine à creuser. Armure de laque noire et d’or, longue chevelure rouge sombre nouée haut. Sous le col, une brûlure qu’il dissimule — la seule imperfection qu’on lui connaisse, et il y tient.',
    voice:
      'Courtois, mordant, théâtral : il parle comme on dégaine, ménageant ses silences. Il cite son père sans s’en apercevoir, puis se déteste de l’avoir fait. À toi, il s’adresse comme à un égal — ce qui, venant d’un prince, est presque une déclaration.',
    goal:
      'Prouver qu’il vaut mieux que l’ombre de son père-dieu. Capturer le Volt pour l’Empire — puis, lentement, comprendre qu’il ne le veut plus, et ne plus savoir qui il est sans cet ordre à exécuter.',
    flaw:
      'L’orgueil, doublé d’un besoin d’approbation qu’il méprise. Il sait que l’Empire a tort bien avant de se l’avouer, et continue par peur de n’être rien sans lui.',
    detail:
      'Élevé pour être parfait, écrasé par l’ombre d’un père qui veut devenir dieu. Envoyé reprendre un déserteur aux Côtes, il y a croisé un gamin de rien qui refusait de plier — un égal. Depuis, un doute s’est planté en lui, et il ne sait pas encore s’il le hait ou s’il s’y accroche.',
    discovered: true,
  },
];

export const CHARACTER_BY_ID: Record<string, Character> = Object.fromEntries(
  CHARACTERS.map((c) => [c.id, c]),
);
