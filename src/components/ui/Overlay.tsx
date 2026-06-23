import { useEffect, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon } from './Icon';

// ============================================================================
// Overlay plein écran réutilisable (carte agrandie, Codex). Fond assombri,
// fermeture par Échap ou clic en dehors.
// ============================================================================

interface OverlayProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Titre lisible pour l'accessibilité. */
  label?: string;
  /** Largeur max du contenu. */
  maxWidth?: number;
}

export function Overlay({ open, onClose, children, label, maxWidth = 1100 }: OverlayProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          role="dialog"
          aria-modal="true"
          aria-label={label}
        >
          {/* Fond assombri */}
          <motion.div
            className="absolute inset-0"
            style={{ background: 'color-mix(in oklab, #000 78%, transparent)', backdropFilter: 'blur(6px)' }}
            onClick={onClose}
          />

          <motion.div
            className="panel gold-frame relative z-10 max-h-[90vh] w-full overflow-hidden rounded-xl"
            style={{ maxWidth }}
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 10 }}
            transition={{ type: 'spring', stiffness: 240, damping: 26 }}
          >
            <button
              onClick={onClose}
              className="absolute right-3 top-3 z-20 grid size-9 place-items-center rounded-md border border-ink/70 bg-bg/60 text-text-dim transition-colors hover:border-gold/50 hover:text-text"
              aria-label="Fermer"
            >
              <Icon name="close" size={16} />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
