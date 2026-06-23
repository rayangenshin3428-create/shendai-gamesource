// ============================================================================
// SOUS-LIEUX — quartiers, domaines, bâtiments notables et lieux-clés par
// région. Rendent le monde crédible ; affichés au clic sur une région.
// Extensible : ajoute une entrée dans le tableau de la région concernée.
// ============================================================================

export type SubKind = 'quartier' | 'domaine' | 'bâtiment' | 'lieu-clé' | 'village' | 'monument';

export interface SubLocation {
  name: string;
  kind: SubKind;
  note: string;
}

export const SUBLOCATIONS: Record<string, SubLocation[]> = {
  cotes: [
    {
      name: 'La Pierre Foudroyée',
      kind: 'monument',
      note: 'Menhir noir fendu par un éclair antique. On y mène les nouveau-nés du Bas-Pays : si la pierre crépite à leur approche, l’enfant est un Foudroyé. La tienne, murmure-t-on, a chanté.',
    },
    { name: 'Léïsha', kind: 'village', note: 'Bourg portuaire boueux où tout le monde survit, personne ne vit. Le foyer du héros.' },
    { name: 'L’échoppe de Maître Ren', kind: 'bâtiment', note: 'Une salle basse qui sent le sel et l’huile : le dojo clandestin du « Souffle Court ».' },
    { name: 'La Digue Battue', kind: 'lieu-clé', note: 'Long môle où l’orage frappe en premier. On y voit venir les voiles de l’Empire.' },
    { name: 'Les Salines', kind: 'domaine', note: 'Marais de sel exploités à mains nues. Les Foudroyés y naissent plus souvent qu’ailleurs.' },
  ],
  braise: [
    {
      name: 'L’Obélisque des Cent Rois',
      kind: 'monument',
      note: 'Colonne de bronze gravée des noms de tous les souverains que Tiānhuo a brûlés pour monter sur le trône. La dernière ligne, polie d’avance, attend encore un nom.',
    },
    { name: 'Vermillon (Zhūchéng)', kind: 'quartier', note: 'Capitale de bois rouge et d’or sur des terrasses. Le Sceau Impérial y dort.' },
    { name: 'Le Trône de Cendres', kind: 'domaine', note: 'Palais qui brûle sans se consumer ; là siège Tiānhuo, le Brasier Couronné.' },
    { name: 'Hóshan, la Forge-Cité', kind: 'bâtiment', note: 'Académie martiale et fosses d’épreuve où l’on brise les corps pour forger des armes.' },
    { name: 'Lúgang, le port aux cent voiles', kind: 'lieu-clé', note: 'Marché d’esclaves et de pilules. Tout s’y achète, surtout les gens.' },
    { name: 'La Caserne du Couperet', kind: 'bâtiment', note: 'Quartier des bourreaux impériaux. C’est d’ici que sort Aohan.' },
  ],
  givre: [
    {
      name: 'La Cloche Muette',
      kind: 'monument',
      note: 'Cloche de glace que nul son n’a jamais quittée. La légende dit qu’elle sonnera le jour d’une seconde Fêlure. Les Veilleurs la fixent, en silence, depuis mille ans.',
    },
    { name: 'Báichán', kind: 'bâtiment', note: 'Monastère des Cimes Blanches, accroché à la falaise nord. Halos froids, capes sombres.' },
    { name: 'Le Vitrail des Veilleurs', kind: 'lieu-clé', note: 'Nef de glace où dorment les plus vieux Veilleurs. On murmure que l’un d’eux refuse de mourir.' },
    { name: 'Le Belvédère du Ciel Fendu', kind: 'lieu-clé', note: 'Terrasse d’où l’on surveille la Fêlure depuis des siècles.' },
    { name: 'Les Cellules de Givre', kind: 'domaine', note: 'On y « juge » les Foudroyés — c’est-à-dire qu’on les enferme jusqu’à ce qu’ils cèdent.' },
  ],
  luciole: [
    {
      name: 'L’Arbre aux Mille Noms',
      kind: 'monument',
      note: 'Orme géant où chaque clan grave le nom de ses morts. Les lucioles y dorment le jour. Y passer une nuit, dit-on, montre le visage de ceux qu’on a perdus — pour le meilleur ou le pire.',
    },
    { name: 'La Vallée des Lucioles', kind: 'lieu-clé', note: 'Site sacré où les âmes des ancêtres tournoient en nuées dorées.' },
    { name: 'Les Tentes-Noires', kind: 'village', note: 'Camp mouvant des clans. Jamais deux fois au même endroit ; impossible à assiéger.' },
    { name: 'Le Tertre des Ancêtres', kind: 'domaine', note: 'Colline funéraire des chefs de clan. Aylin y a enterré les siens — ou ce qu’il en restait.' },
    { name: 'Le Gué aux Chevaux', kind: 'lieu-clé', note: 'Passage à gué des Mers d’Herbe ; carrefour des routes cavalières.' },
  ],
  lys: [
    {
      name: 'Le Grand Miroir Lunaire',
      kind: 'monument',
      note: 'Disque de jade poli dressé sous le Pilier. Qui s’y mire voit, paraît-il, l’instant de sa propre mort. Shulan a appris très tôt à en détourner les yeux.',
    },
    { name: 'Hóngmén', kind: 'quartier', note: 'Cité-Temple aux Mille Lanternes. Chaque lanterne est une âme scellée qui veille.' },
    { name: 'Le Sanctuaire du Miroir Lunaire', kind: 'lieu-clé', note: 'Sous le Pilier ; on y lit l’avenir des morts. Shulan y a grandi.' },
    { name: 'Les Jardins de Lys', kind: 'domaine', note: 'Le lys rouge y pousse où passent les âmes. Domaine de la Souveraine Écarlate.' },
    { name: 'Les Geôles d’Âmes', kind: 'bâtiment', note: 'Cryptes où l’Ordre retient les morts les plus dangereux. Le Prêtre aux Lèvres Cousues en est le geôlier.' },
  ],
  pilier: [
    {
      name: 'Les Marches sans Fin',
      kind: 'monument',
      note: 'Escalier de lumière qui monte dans le Pilier. Nul n’en a vu le sommet et n’en est revenu. Une seule légende le nomme : « le chemin des dieux qui ont eu tort ».',
    },
    { name: 'Le Socle', kind: 'lieu-clé', note: 'Base de la colonne de lumière. La pression y broie les âmes faibles.' },
    { name: 'Les Marches de Lumière', kind: 'lieu-clé', note: 'Degrés de pierre qui montent dans le trait vertical. Nul n’en a vu le sommet et n’en est revenu.' },
    { name: 'Le Seuil des Gardiens', kind: 'domaine', note: 'Là veillent des entités sans nom. Tous les pouvoirs y convergent en secret.' },
  ],
};
