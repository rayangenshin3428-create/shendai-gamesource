import type { Faction } from './types';

// ============================================================================
// Les grandes cours — quatre puissances qui se haïssent. Aucune ne traque
// encore le héros : leur intérêt pour un Volt est une disposition générale qui
// ne deviendra personnelle que lorsque la rumeur aura grandi.
// ============================================================================

export const FACTIONS: Faction[] = [
  {
    id: 'empire',
    name: 'Empire de Braise',
    voie: 'Brasier',
    wants:
      'Conquérir Shendaï, et offrir à l’Empereur la dernière marche vers la divinité : siphonner la foudre première d’un Volt.',
    stanceOnHero:
      'Consumerait un Volt sans hésiter pour en faire un dieu — mais ignore encore qu’une étincelle s’est allumée aux Côtes.',
    history:
      'Né d’un simple soldat, Tiānhuo, qui a brûlé cent royaumes pour cimenter le sien. La cour fonctionne comme un bûcher ordonné : on s’y élève en réduisant ses rivaux en cendres. La vieille noblesse supplantée hait l’Empereur autant qu’elle le craint, et l’armée ne tient que par une promesse d’ascension qui réclame un carburant qu’on n’a pas encore.',
    themeId: 'braise',
    discovered: true,
  },
  {
    id: 'lys',
    name: 'Ordre du Lys Rouge',
    voie: 'Lys',
    wants:
      'Régir le passage des morts. Au sommet, une seule obsession : empêcher la Fêlure de se refermer, avant que les âmes ne noient les vivants.',
    stanceOnHero:
      'Verrait dans un Volt l’instrument capable de rouvrir ou de sceller la Fêlure — à employer, à aimer, puis à sacrifier.',
    history:
      'Théocratie funéraire née du trafic des âmes retenues. On y scelle les morts dans des lanternes pour les faire travailler ; le deuil est une liturgie, le sacrifice une vertu. Sous la Souveraine Écarlate, l’Ordre porte une vérité que nul ne croit : le ciel se referme par le haut, et le jour où il se scellera, plus aucune âme ne pourra partir.',
    themeId: 'lys',
    discovered: true,
  },
  {
    id: 'clans',
    name: 'Clans de la Luciole',
    voie: 'Luciole',
    wants:
      'Rester libres sur les Mers d’Herbe, et venger leurs morts sur l’Empire — sur trois générations s’il le faut.',
    stanceOnHero:
      'Pourrait armer un Volt et le lancer contre Braise : alliés naturels, à condition de respecter leurs morts.',
    history:
      'Confédération de clans cavaliers qui n’enterrent pas leurs défunts mais les portent en lucioles. Insaisissables — leur camp ne dort jamais deux fois au même endroit. L’Empire a rasé plusieurs clans et déporté leurs survivants ; depuis, la steppe entière entretient une dette de sang que personne n’a l’intention d’oublier.',
    themeId: 'luciole',
    discovered: true,
  },
  {
    id: 'cloitre',
    name: 'Cloître des Veilleurs Ailés',
    voie: 'Givre',
    wants:
      'Surveiller la Fêlure et les Volts ; empêcher, à tout prix, une seconde déchirure du ciel.',
    stanceOnHero:
      'Observe les Volts de loin et finirait par venir — non pour tuer, mais pour juger : guide, geôlier, ou exécuteur, selon ce qu’il lit en toi.',
    history:
      'Ordre monastique reclus au toit du monde, voué au silence depuis la Grande Fêlure. Ses plus anciens membres refusent la mort en se laissant prendre par le givre, jusqu’à devenir des statues qu’on consulte encore. À force de veiller sur la catastrophe, certains ont cessé de distinguer prévention et cruauté.',
    themeId: 'givre',
    discovered: true,
  },
  {
    id: 'rebellion',
    name: 'Les Sans-Cendres',
    voie: 'mixte',
    wants:
      'Briser l’Empire de Braise — refuser d’être le combustible de l’ascension d’un autre.',
    stanceOnHero:
      'Une étincelle éparse, encore sans tête ni nom officiel. Un Volt pourrait en devenir l’étendard — ou en allumer la flamme.',
    history:
      'Pas encore une faction : une rumeur, un mot griffonné sur les murs des forge-cités. « Sans-Cendres » — ceux qui refusent de brûler pour qu’un autre s’élève. Déserteurs, esclaves évadés, clans saignés, prêtres défroqués : tous ceux que l’Empire a voulu réduire en poussière et qui ont décidé de ne pas tomber.',
    themeId: 'monde',
    discovered: false,
  },
];

export const FACTION_BY_ID: Record<string, Faction> = Object.fromEntries(
  FACTIONS.map((f) => [f.id, f]),
);
