import { AnimatePresence, motion } from 'framer-motion';
import { useGame } from '../../state/game';
import { Seal } from '../ui/Seal';
import { VOLT } from '../ui/volt';

// ============================================================================
// Interlude — transition narrative plein écran, dans l'esprit de l'écran de
// mort. Pour les grands moments : changement de région, défaite, victoire,
// chapitre, découverte majeure. Écran assombri, estampille de date, texte
// narratif, puis bouton de sortie. (Piloté par showInterlude() — voir le store.)
// ============================================================================

const KIND_META: Record<
  string,
  { kicker: string; char: string; accent: string }
> = {
  region: { kicker: 'Nouvelle terre', char: '境', accent: 'var(--accent)' },
  chapter: { kicker: 'Chapitre', char: '章', accent: 'var(--gold)' },
  victory: { kicker: 'Victoire', char: '勝', accent: VOLT.amber },
  defeat: { kicker: 'Recul', char: '退', accent: VOLT.danger },
  discovery: { kicker: 'Découverte', char: '見', accent: 'var(--glow-cold)' },
};

export function Interlude() {
  const { interlude, dismissInterlude } = useGame();
  const meta = interlude ? KIND_META[interlude.kind] : null;

  return (
    <AnimatePresence>
      {interlude && meta && (
        <motion.div
          className="fixed inset-0 z-[72] grid place-items-center overflow-y-auto p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9 }}
        >
          {/* Fond : noir profond, faible halo dans la teinte du moment. */}
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at 50% 60%, color-mix(in oklab, ${meta.accent} 10%, #050608) 0%, #050608 78%)`,
            }}
            onClick={dismissInterlude}
          />

          {/* Trait de lumière vertical, lointain (écho du Pilier). */}
          <motion.div
            className="pointer-events-none absolute left-1/2 top-0 h-full w-32 -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.35 }}
            transition={{ duration: 2, delay: 0.4 }}
            style={{
              background: `linear-gradient(to top, transparent, color-mix(in oklab, ${meta.accent} 35%, transparent) 55%, transparent)`,
              filter: 'blur(14px)',
            }}
          />

          <div className="relative z-10 w-full max-w-xl py-10 text-center">
            <motion.div
              className="mx-auto mb-5 w-fit"
              initial={{ scale: 0, opacity: 0, rotate: -8 }}
              animate={{ scale: 1, opacity: 1, rotate: -4 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 180, damping: 18 }}
            >
              <Seal char={meta.char} size={54} />
            </motion.div>

            <motion.div
              className="text-[0.62rem] uppercase tracking-[0.34em]"
              style={{ color: meta.accent }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.7 }}
            >
              {meta.kicker}
            </motion.div>

            <motion.div
              className="mx-auto mt-3 h-px w-2/3"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              style={{ background: `linear-gradient(90deg, transparent, ${meta.accent}, transparent)` }}
            />

            <motion.h2
              className="mt-4 font-display text-3xl tracking-[0.12em] text-text sm:text-4xl"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              {interlude.title}
            </motion.h2>

            {interlude.subtitle && (
              <motion.p
                className="mt-2 font-heading text-base italic"
                style={{ color: meta.accent }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.75, duration: 0.8 }}
              >
                {interlude.subtitle}
              </motion.p>
            )}

            <div className="mx-auto mt-6 max-w-md space-y-3">
              {interlude.lines.map((line, i) => (
                <motion.p
                  key={i}
                  className="text-[0.98rem] leading-relaxed text-text/80"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.95 + i * 0.35, duration: 0.8 }}
                >
                  {line}
                </motion.p>
              ))}
            </div>

            {interlude.stamp && (
              <motion.div
                className="mt-7 flex items-center justify-center gap-3 text-[0.66rem] uppercase tracking-[0.28em] text-text-dim"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.05 + interlude.lines.length * 0.35, duration: 0.9 }}
              >
                <span className="h-px w-6" style={{ background: `color-mix(in oklab, ${meta.accent} 50%, transparent)` }} />
                {interlude.stamp}
                <span className="h-px w-6" style={{ background: `color-mix(in oklab, ${meta.accent} 50%, transparent)` }} />
              </motion.div>
            )}

            <motion.button
              onClick={dismissInterlude}
              className="mt-9 rounded-md border px-8 py-2.5 font-heading text-sm tracking-[0.2em] text-text transition-colors"
              style={{
                borderColor: `color-mix(in oklab, ${meta.accent} 55%, transparent)`,
                background: `color-mix(in oklab, ${meta.accent} 10%, transparent)`,
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.25 + interlude.lines.length * 0.35, duration: 0.8 }}
              whileHover={{ y: -2 }}
            >
              {interlude.cta ?? 'Continuer'}
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
