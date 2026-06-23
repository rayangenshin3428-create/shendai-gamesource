# PROMPT POUR CLAUDE CODE — UI de la plateforme « SHENDAÏ » *(refonte, focus Direction Artistique)*

> Prompt **autonome** : tout est ici, pas de fichier externe requis. On construit **uniquement le front-end (UI)**, avec **données mock** et des **branchements propres** pour brancher plus tard l'**IA narratrice** et les illustrations. L'accent de cette passe est mis sur la **DIRECTION ARTISTIQUE** : l'UI doit *être* une expérience, pas un outil.

---

## 🎯 LE PRINCIPE DE LA PLATEFORME

Shendaï est une **plateforme de jeu de rôle textuel immersif** dans un univers de **dark fantasy martiale et spirituelle** (wuxia / xianxia sombre, aucune technologie). Le joueur incarne un héros et vit une histoire **écrite par une IA narratrice** (intégrée plus tard). Autour du récit, l'interface lui donne tout pour s'immerger : une **encyclopédie** vivante des personnages/ennemis/objets, une **carte** pour se repérer, une **fiche de personnage** (puissance, jauges, inventaire), et surtout une **ambiance qui change selon le lieu** — un mélange signature de **glace et de feu** qui se décline région par région.

Le monde est **dur, dangereux, mortel** : la puissance se paie, la mort est réelle (il existe un **écran de mort**). L'UI doit faire **ressentir** ce danger en permanence, sans jamais voler la vedette au texte.

**Avant de coder, active et applique tes skills** : `brainstorming` (cadrage), `frontend-design` + `design-taste-frontend` (système visuel anti-générique — **crucial ici**), `motion-framer` (animations), `subagent-driven-development` (découpe), `systematic-debugging` (bugs). Annonce en début de travail les skills activés.

---

## 🎨 DIRECTION ARTISTIQUE *(le cœur de cette passe — soigne-la avant tout)*

### L'intention
> **Un manuscrit hanté, pas une application.** L'UI doit donner la sensation d'un vieux grimoire de guerre taché de cendre et de givre, vivant, où la lumière est rare et précieuse. **Sombre, beau, dangereux.** La beauté ne sert pas à rassurer : elle rend l'horreur plus tranchante.

### Le mood
- **Clair-obscur cinématographique** : fonds très sombres, l'image émerge de l'ombre par flaques de lumière (chaude = braise/lanterne/foudre ; froide = givre/Pilier). Vignettage, profondeur, bloom discret sur les sources de lumière.
- **Pictural, pas plat** : on veut une texture peinte (lavis d'encre, papier/soie usés, grain), pas du flat design ni du material sterile.
- **Retenue** : l'interface **encadre** le récit. Chrome calme, beaucoup de noir et d'espace, le drame est **réservé aux moments forts** (combat, forme dévoilée d'un boss, mort).
- **Tonalité émotionnelle** : mélancolie, tension, majesté funèbre. Jamais « fun/gamifié » clinquant.

### Repères visuels *(pour viser juste — à t'approprier, pas à copier)*
- La mélancolie peinte façon WLOP/Ghostblade (anges, neige, halos).
- Les concept-arts d'ARPG chinois (batailles dans les flammes, sceaux rouges « chop »).
- La sobriété d'UI de jeux comme Sekiro / Ghost of Tsushima (chrome discret, typo soignée, beaucoup de vide).
- La richesse texturée d'un Hades, mais **plus sombre et plus grave**.

### Matérialité & texture
- Surfaces de panneaux = **soie/laque/parchemin vieillis et sombres**, bordées d'un filet **or terni** ou d'un trait d'**encre**. Pas de cartes en verre glossy.
- Détails de saveur : **sceaux rouges** (style cachet chinois), **traits de pinceau**, **dorure à la feuille** pour les accents rares, **grain de papier** et léger bruit pour casser le numérique propre.
- Particules d'ambiance physiques : **braises** qui montent, **flocons** lents, **lucioles** dorées, **étincelles** de foudre, **pétales** rouges — selon le lieu.

### Couleur — la philosophie glace + feu
- **Le noir domine.** La lumière est directionnelle et rare.
- **Identité par défaut (monde)** = **fusion glace + feu** : base charbon / indigo profond, avec **accents braise chauds** ET **accents givre froids** qui coexistent dans la même image.
- Chaque région **déplace l'équilibre** de cette fusion (palettes en §thème dynamique).
- L'or terni et le rouge-sceau servent d'accents nobles, à doser.

### Typographie
- **Titres & narration** : un **display serif calligraphique** avec du caractère (évoquant le pinceau / l'encre), élégant et un peu dramatique.
- **Corps de texte & UI** : un serif raffiné lisible (ou un sans discret) pour le confort de lecture sur fond sombre.
- Hiérarchie par **contraste et espace**, pas par accumulation. Interlignage généreux pour la narration (on lit beaucoup).

### Iconographie
- Icônes **dessinées à la main / au pinceau**, esprit **sigle / sceau**, pas des icônes line génériques. Cohérentes entre elles.

### Le danger doit se voir
- Le chrome **réagit discrètement à la menace de la scène** (calme / tendu / mortel) : les bords s'assombrissent, une **braise rouge** rampe sur le cadre quand c'est « mortel », l'ambiance « grésille ».
- La **jauge de Volte** (foudre du héros) **crépite et pulse** quand elle se charge.

---

## 🌗 SYSTÈME DE THÈME DYNAMIQUE *(extension directe de la DA)*

Implémente un **système de design tokens** (variables CSS : `--bg`, `--surface`, `--ink`, `--gold`, `--glow-warm`, `--glow-cold`, `--accent`, `--text`, `--particle`…), **un thème par région**, et une **transition cinématographique** au changement de lieu (fondu simultané des couleurs, de la lueur de fond **et** du type de particules, ≈ 600–900 ms).

| Région (état) | Atmosphère | Palette (toujours sombre) | Particules |
|---|---|---|---|
| **Monde (défaut)** | glace + feu mêlés | charbon/indigo + braise chaude **et** givre froid | cendres + flocons |
| **Empire de Braise** | fournaise oppressante | braise, sang séché, or terni, charbon | braises montantes |
| **Cloître du Givre** | froid, vide, sacré | bleu glacier, blanc os, argent, indigo nuit | neige lente |
| **Steppes de la Luciole** | crépuscule, deuil | vert-de-gris sombre, or-luciole, cendre | lucioles dorées |
| **Lys Rouge** | funèbre, somptueux | cramoisi profond, noir laqué, rouge-sang, blanc lanterne | pétales rouges |
| **Côtes Foudroyées** (origine) | orage électrique | bleu électrique, violet orage, ardoise, blanc-éclair | étincelles / éclairs |
| **Pilier d'Âmes** (centre) | lumière sacrée, vertige | noir absolu + trait **blanc-or vertical** | lumière ascendante |

Particules **performantes** (CSS ou canvas léger). Prévois un **sélecteur de lieu** (via la carte) pour démontrer la bascule de thème en direct. La fusion glace/feu du thème par défaut est la **signature** — soigne-la particulièrement.

---

## 🎬 MOMENTS FORTS À TRAITER VISUELLEMENT

- **Écran de mort** : fondu au noir, le bruit s'éteint, une **luciole dorée** s'élève en silence vers la lumière du Pilier, texte sobre et glaçant (*« Ton souffle rejoint le Pilier. »*), puis options (reprendre / tenter un retour / fin). Un vrai moment, pas un « Game Over » arcade.
- **Pic de Volte** : aux instants dramatiques, un **flash d'éclair** subtil traverse l'écran et la jauge de Volte sursaute.
- **Révélation d'un boss** : une **carte de nom** dramatique (nom + épithète + une *rumeur* en exergue) ; et quand un boss passe à sa **forme dévoilée**, un effet plein cadre marque la bascule.

---

## 🖥️ LAYOUT & COMPOSANTS *(on ne change pas la structure — rappel)*

```
┌───────────────────────────────────────────────────────────────┐
│  BARRE HAUTE : lieu actuel · palier du héros · niveau de       │
│                menace · bouton Encyclopédie                    │
├───────────────┬───────────────────────────────┬───────────────┤
│  GAUCHE        │     PANNEAU NARRATIF           │  DROITE        │
│  • Carte       │     (le cœur)                 │  • Fiche perso │
│    interactive │  • Récit (IA narratrice)      │  • Jauge Volte │
│  • Lieu actuel │  • Dialogues de PNJ           │  • Inventaire  │
│    + infos     │  • Choix · saisie immersive   │  • Affinités   │
├───────────────┴───────────────────────────────┴───────────────┤
│  COUCHE D'AMBIANCE : particules selon le thème du lieu         │
└───────────────────────────────────────────────────────────────┘
```

- **Panneau narratif** : style **journal enluminé** (pas de bulles de chatbot). Distingue narration / dialogues PNJ (nom + vignette placeholder) / actions joueur / choix (boutons élégants). Champ de saisie en bas (« Que fais-tu ? »). **Architecture découplée** : une abstraction `NarrativeEngine` (`sendPlayerAction()` → message) branchée pour l'instant sur un **moteur mock** jouant la scène d'ouverture ; plus tard on y branche l'IA sans toucher l'UI.
- **Encyclopédie / Codex** (overlay plein écran) : onglets **Personnages · Objets · Lieux · Factions · Bestiaire · Ennemis · Lexique**. Sous-filtres personnages **Alliés / Ennemis / Neutres / Romance**. **Ennemis & boss** ont un traitement visuel distinct (cadre sombre, sceau rouge, mention « forme dévoilée »). Recherche + filtres. État **découvert / verrouillé** (« ??? ») pour la sensation de codex qui se révèle.
- **Carte interactive** (gauche) : mini-carte stylisée du continent + le Pilier au centre. Clic région → infos (faction, danger, résumé) + « S'y rendre ». **Se rendre quelque part change le lieu → déclenche le changement de thème** (effet immersion clé). Agrandissable en overlay.
- **Fiche perso** (droite) : **palier de la Montée** + barre, **Souffle** + vitalité, **jauge de Volte** (crépitante), **inventaire** (soins, armes, éclats de Souffle) avec tooltips, **affinités** romance, **épithète** actuel.

---

## 👥 DONNÉES MOCK (univers — utilise-les pour peupler l'UI)

**Le héros (joueur)** : 18 ans, sec et rapide, cheveux bruns, vêtements amples et élégants ; combat au **poing nu** ; Voie **Foudre / Volte d'Âme** (puissance qui lui est propre, nourrie par l'émotion, dangereuse pour lui-même) ; palier **Éveillé** ; épithète évolutif (« l'Étincelle »…).

**Système** : Voies = Foudre, Brasier, Givre, Luciole, Lys. Paliers = Dormeur → Éveillé → Conduit → Crue → Sceau → Apogée → Ascendant.

**Alliés / romances / mentor** : *Aylin* (cavalière des steppes, Voie Luciole, romance), *Shulan* (médium du Lys, romance), *Yánhóng* (Souveraine Écarlate du Lys, ambiguë, romance), *Kaïen* (prince-lame de Braise, rival/romance), *Maître Ren* (mentor, poing), *Suiyé* (figure céleste, mystère lointain).

**Boss / fléaux (avec « forme dévoilée »)** :
- *Aohan, le Bourreau aux Quatre Bras* (Braise — géant rouge à quatre bras, sans yeux).
- *Xun, le Prêtre aux Lèvres Cousues* (Lys — bouche cousue, parle par les morts).
- *Naqan, le Chasseur aux Mille Bois* (steppes — chaman aux ramures d'âmes empalées).
- *Ysul, l'Ange Gelé* (Givre — Veilleur gelé qui refuse de mourir).
- *Le Porte-Visages* (parasite qui porte les corps des autres).
- *L'Ossuaire Vivant* (colosse d'os des charniers).
- *La Veuve des Lanternes* (appât de chagrin).
- *Tiānhuo, le Brasier Couronné* (empereur-dieu, ennemi final, soleil-démon caché).

**Objets** : soins (*Pilule de Souffle*, *Baume de Cendre-Lune*, *Lotus de Braise*, *Élixir des Neuf Nuits*, *Herbe-qui-écoute*, *Talisman de scellé*), armes (*Bandages du Souffle Court* du héros, *Sabre Vermillon*…), artefacts (*Sceau Impérial de Braise*, *Sceptre des Lanternes*), monnaie (*Éclats de Souffle* terne/clair/vif). Chaque objet a une **rareté** (code couleur).

**Scène d'ouverture (mock narratif)** — *la Nuit de Braise* : le soir de ses 18 ans, à **Léïsha**, des enquêteurs de l'Empire débarquent ; la fouille tourne au carnage, le bourg s'embrase, et la **foudre du héros explose pour la première fois**. Il doit fuir. → écris 4–6 messages + 2–3 choix.

---

## 🛠️ STACK & LIVRABLES

- **React + TypeScript** (Vite), **Tailwind** + variables CSS pour les thèmes, **`motion`/Framer Motion**. Code propre, typé, composants réutilisables. Données mock centralisées dans `/data`. **Desktop-first**, propre en responsive.
- **Livrables** : layout complet ; **DA appliquée et cohérente** (texture, clair-obscur, typo, iconographie) ; **bascule de thème en direct** (≥ 4 thèmes distincts) ; encyclopédie navigable/filtrable avec traitement spécial ennemis/boss ; panneau narratif jouable (mock) ; jauge de Volte animée ; **écran de mort** soigné ; particules d'ambiance par thème ; `README` (lancement + où brancher l'IA).
- **Critère de réussite DA** : à l'écran, ça doit ressembler à un **artefact du monde**, sombre et précieux — et **changer de peau** quand on voyage du givre à la braise.

---

## 🧱 ÉTAPES SUGGÉRÉES

1. `brainstorming`. 2. **Design tokens + DA + thèmes par région** (fondation visuelle). 3. Layout + couche d'ambiance. 4. Carte + logique lieu→thème. 5. Panneau narratif + moteur mock. 6. Encyclopédie + données mock (dont boss). 7. Fiche perso (palier, Volte, inventaire, affinités). 8. Moments forts (écran de mort, révélation de boss) + polissage motion/accessibilité.

---

*L'objectif : qu'en ouvrant la plateforme, le joueur ait l'impression de tenir un grimoire vivant ; et qu'en se déplaçant dans Shendaï, il sente l'univers changer de peau autour de lui — du givre à la braise, du calme au mortel.*
