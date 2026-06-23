import type { ThreatLevel } from '../data';

// ============================================================================
// Contrat du moteur narratif.
// L'UI ne parle qu'à cette interface — jamais au moteur concret.
// Aujourd'hui : un moteur mock scripté. Demain : l'IA narratrice, même forme.
//
// 🤖 POUR BRANCHER L'IA : implémente `AINarrativeEngine implements NarrativeEngine`,
//    puis appelle `getAIPayload()` depuis `src/ai/` : il fournit en UN SEUL appel
//    le briefing (monde, lore, règles de cohérence et de narration, systèmes de
//    jeu, et le CONTRAT DE SORTIE ci-dessous) ET tout le canon du monde structuré.
//    Cette section est interne (jamais montrée au joueur). Remplace ensuite
//    `new MockNarrativeEngine()` (dans src/state/game.tsx) par ton moteur IA.
// ============================================================================

export type MessageKind = 'narration' | 'npc' | 'player' | 'system';

export interface NarrativeMessage {
  id: string;
  kind: MessageKind;
  text: string;
  /** Pour les répliques de PNJ. */
  speaker?: string;
  /** Lien vers une fiche du Codex (vignette). */
  speakerId?: string;
}

export interface Choice {
  id: string;
  label: string;
  /** Indice d'intensité, pour teinter le bouton. */
  tone?: 'calme' | 'tendu' | 'mortel';
}

/** Effets de bord qu'une réponse peut demander à l'UI de jouer. */
export type NarrativeEffect =
  | { type: 'travel'; regionId: string }
  | { type: 'threat'; level: ThreatLevel }
  | { type: 'volte'; amount: number }
  | { type: 'death' }
  | { type: 'bossReveal'; enemyId: string };

export interface EngineResponse {
  messages: NarrativeMessage[];
  choices?: Choice[];
  effects?: NarrativeEffect[];
}

export interface NarrativeEngine {
  /** Scène d'ouverture. */
  start(): Promise<EngineResponse>;
  /** Saisie libre du joueur (« Que fais-tu ? »). */
  sendPlayerAction(action: string): Promise<EngineResponse>;
  /** Choix parmi les options proposées. */
  chooseOption(choiceId: string): Promise<EngineResponse>;
}
