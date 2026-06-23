import type { NarrativeEngine } from './types';
import { MockNarrativeEngine } from './MockNarrativeEngine';
import { AINarrativeEngine } from './AINarrativeEngine';

// ============================================================================
// Sélecteur de moteur narratif.
// La clé Gemini vit désormais CÔTÉ SERVEUR (GOOGLE_API_KEY, dans /api/chat) — le
// client ne peut donc pas la « voir ». On active l'IA :
//   - en PRODUCTION (sur Vercel, où /api/chat existe), par défaut ;
//   - en dev local : moteur mock (sauf si on force avec VITE_AI_ENABLED=true,
//     ex. via `vercel dev` qui sert /api/chat).
// C'est LE branchement : aucune autre partie du code ne change.
// ============================================================================

export function createEngine(): NarrativeEngine {
  const flag = (import.meta.env as Record<string, string | undefined>).VITE_AI_ENABLED;
  const useAI = flag === 'true' || (flag !== 'false' && import.meta.env.PROD);
  if (useAI) {
    try {
      return new AINarrativeEngine();
    } catch {
      // En cas de souci d'init, on retombe sur le mock plutôt que de planter.
    }
  }
  return new MockNarrativeEngine();
}
