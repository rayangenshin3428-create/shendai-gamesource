import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ENEMIES, type ThreatLevel } from '../data';
import { useGame } from '../state/game';
import { Icon } from './ui/Icon';

// ============================================================================
// Panneau de démonstration — accès direct aux « moments forts » et à la
// menace, le temps que l'IA narratrice ne pilote pas encore tout.
// (À retirer pour la version finale.)
// ============================================================================

const THREATS: ThreatLevel[] = ['calme', 'tendu', 'mortel'];
const APEX = ENEMIES.filter((e) => e.apex);

export function DemoControls() {
  const { threat, setThreat, spikeVolte, revealBoss, die } = useGame();
  const [open, setOpen] = useState(false);
  const [bossIdx, setBossIdx] = useState(0);

  const cycleThreat = () => {
    const i = THREATS.indexOf(threat);
    setThreat(THREATS[(i + 1) % THREATS.length]);
  };

  const nextBoss = () => {
    const e = APEX[bossIdx % APEX.length];
    setBossIdx((i) => i + 1);
    revealBoss(e.id);
  };

  return (
    <div className="fixed bottom-3 left-3 z-40">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            className="panel mb-2 w-56 rounded-lg p-3"
          >
            <div className="mb-2 font-display text-[0.6rem] uppercase tracking-[0.24em] text-text-dim">
              Démonstration
            </div>
            <div className="space-y-1.5 text-sm">
              <button
                onClick={cycleThreat}
                className="flex w-full items-center justify-between rounded-md border border-ink/70 px-3 py-2 text-text-dim transition-colors hover:border-gold/50 hover:text-text"
              >
                <span>Menace</span>
                <span className="font-heading capitalize text-text">{threat}</span>
              </button>
              <button
                onClick={() => spikeVolte(16)}
                className="flex w-full items-center gap-2 rounded-md border border-ink/70 px-3 py-2 text-text-dim transition-colors hover:border-glow-warm/50 hover:text-text"
              >
                <Icon name="bolt" size={14} filled className="text-glow-warm" /> Pic de Volte
              </button>
              <button
                onClick={nextBoss}
                className="flex w-full items-center gap-2 rounded-md border border-ink/70 px-3 py-2 text-text-dim transition-colors hover:border-seal/50 hover:text-text"
              >
                <Icon name="skull" size={14} className="text-seal" /> Révéler un boss
              </button>
              <button
                onClick={die}
                className="flex w-full items-center gap-2 rounded-md border border-ink/70 px-3 py-2 text-text-dim transition-colors hover:border-seal/50 hover:text-text"
              >
                <Icon name="firefly" size={14} /> Écran de mort
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full border border-gold/40 bg-surface/80 px-3 py-1.5 text-xs text-text-dim backdrop-blur-sm transition-colors hover:border-gold/70 hover:text-text"
      >
        <span style={{ color: 'var(--gold)' }}>✦</span>
        Démo
      </button>
    </div>
  );
}
