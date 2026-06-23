import { AnimatePresence, motion } from 'framer-motion';
import { useGame } from '../state/game';
import { Icon } from './ui/Icon';

// ============================================================================
// Confirmation simple avant un déplacement en ville.
// ============================================================================

export function ConfirmMove() {
  const { pendingMove, confirmMoveYes, cancelMove } = useGame();

  return (
    <AnimatePresence>
      {pendingMove && (
        <motion.div
          className="fixed inset-0 z-[72] grid place-items-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div
            className="absolute inset-0"
            style={{ background: 'color-mix(in oklab, #000 70%, transparent)' }}
            onClick={cancelMove}
          />
          <motion.div
            className="panel gold-frame relative z-10 w-full max-w-sm rounded-xl p-6 text-center"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          >
            <Icon name="travel" size={22} className="mx-auto text-gold" />
            <p className="mt-3 text-sm text-text-dim">Voulez-vous vous rendre à</p>
            <h3 className="mt-0.5 font-heading text-lg text-text">{pendingMove} ?</h3>
            <div className="mt-5 flex gap-3">
              <button
                onClick={cancelMove}
                className="flex-1 rounded-md border border-ink/70 px-4 py-2 text-sm text-text-dim transition-colors hover:text-text"
              >
                Non
              </button>
              <button
                onClick={confirmMoveYes}
                className="flex-1 rounded-md border border-accent/50 bg-accent/10 px-4 py-2 font-heading text-sm font-semibold tracking-wide text-text transition-colors hover:border-accent hover:bg-accent/20"
              >
                Oui, m’y rendre
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
