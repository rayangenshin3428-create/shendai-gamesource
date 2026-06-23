import { AnimatePresence, motion } from 'framer-motion';
import { useGame } from '../state/game';
import { Icon } from './ui/Icon';

// ============================================================================
// Petit avis lorsqu'une entrée du Codex se débloque (découverte progressive).
// ============================================================================

export function DiscoveryToast() {
  const { discoveryToast, openCodex } = useGame();

  return (
    <AnimatePresence>
      {discoveryToast && (
        <motion.button
          onClick={() => openCodex()}
          className="panel gold-frame fixed bottom-6 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-3 rounded-full px-5 py-2.5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        >
          <span style={{ color: 'var(--gold)' }}>✦</span>
          <span className="text-sm text-text">
            <span className="text-text-dim">Codex enrichi · </span>
            <span className="font-heading font-semibold">{discoveryToast}</span>
          </span>
          <Icon name="book" size={14} className="text-gold/70" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
