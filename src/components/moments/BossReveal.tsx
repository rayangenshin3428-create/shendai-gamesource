import { AnimatePresence, motion } from 'framer-motion';
import { ENEMY_BY_ID } from '../../data';
import { useGame } from '../../state/game';
import { Seal } from '../ui/Seal';
import { Icon } from '../ui/Icon';

// ============================================================================
// Révélation d'un boss — une vraie ENTRÉE EN SCÈNE, façon écran de mort.
// L'écran s'assombrit, puis la narration INSTALLE l'ambiance battement par
// battement (environnement → situation → atmosphère) AVANT de révéler le nom,
// l'épithète, la rumeur (le danger) et le lieu (les enjeux). Enfin, le choix —
// le joueur ne décide que de SES actions (Affronter / Reculer, qui a un prix).
// La forme dévoilée appartient au boss : elle se révèle d'elle-même au combat.
// ============================================================================

export function BossReveal() {
  const { bossRevealId, dismissBoss, engageBoss, region, currentPlace } = useGame();
  const enemy = bossRevealId ? ENEMY_BY_ID[bossRevealId] : null;
  // L'ambiance prend la couleur de DANGER de la ZONE COURANTE (cohérence absolue).
  const accent = 'var(--seal)';

  const beats = enemy?.entrance ?? [];
  // Le nom n'apparaît qu'après que l'ambiance a été posée.
  const base = 0.3 + beats.length * 0.85;

  return (
    <AnimatePresence>
      {enemy && (
        <motion.div
          className="fixed inset-0 z-[66] grid place-items-center overflow-y-auto p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Écran assombri : le monde s'efface, on ne voit plus que la menace. */}
          <motion.div
            className="absolute inset-0"
            style={{ background: `radial-gradient(circle at 50% 52%, color-mix(in oklab, ${accent} 13%, #000) 0%, #000 82%)` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            onClick={dismissBoss}
          />
          {/* Lueur basse, lente, qui « respire » sous la scène. */}
          <motion.div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
            style={{ background: `radial-gradient(70% 100% at 50% 100%, ${accent}, transparent 70%)` }}
          />

          <div className="relative z-10 w-full max-w-xl py-10 text-center">
            {/* 1) L'ambiance s'installe, battement par battement. */}
            {beats.length > 0 && (
              <div className="mx-auto mb-7 max-w-md space-y-3">
                {beats.map((b, i) => (
                  <motion.p
                    key={i}
                    className="text-[0.95rem] italic leading-relaxed text-text/70"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.85, duration: 0.9 }}
                  >
                    {b}
                  </motion.p>
                ))}
              </div>
            )}

            {/* 2) Puis le danger se nomme. */}
            <motion.div
              className="flex items-center justify-center gap-2 text-[0.62rem] uppercase tracking-[0.34em]"
              style={{ color: accent }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: base, duration: 0.7 }}
            >
              <Icon name="skull" size={13} />
              {enemy.apex ? 'Menace majeure' : 'Une présence se dresse'}
            </motion.div>

            <motion.div
              initial={{ scale: 0, rotate: -12 }}
              animate={{ scale: 1, rotate: -6 }}
              transition={{ delay: base + 0.15, type: 'spring', stiffness: 180, damping: 16 }}
              className="mx-auto my-4 w-fit"
            >
              <Seal char="凶" size={64} />
            </motion.div>

            <motion.div
              className="mx-auto mb-3 h-px w-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: base + 0.1, duration: 0.6 }}
              style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
            />

            <motion.h2
              className="font-display text-4xl tracking-[0.1em] text-text sm:text-5xl"
              initial={{ opacity: 0, y: 14, letterSpacing: '0.3em' }}
              animate={{ opacity: 1, y: 0, letterSpacing: '0.1em' }}
              transition={{ delay: base + 0.35, duration: 0.8 }}
            >
              {enemy.name}
            </motion.h2>
            <motion.p
              className="mt-2 font-heading text-xl italic"
              style={{ color: accent }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: base + 0.55, duration: 0.7 }}
            >
              {enemy.epithet}
            </motion.p>

            <motion.div
              className="mx-auto mt-3 h-px w-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: base + 0.5, duration: 0.6 }}
              style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
            />

            {/* La légende qu'on en colporte (le danger). */}
            <motion.p
              className="mx-auto mt-5 max-w-md text-sm italic leading-relaxed text-text-dim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: base + 0.8, duration: 0.8 }}
            >
              « {enemy.rumor} »
            </motion.p>

            {/* Le lieu (les enjeux) — l'endroit RÉEL où l'on se trouve. */}
            <motion.p
              className="mx-auto mt-4 max-w-md text-[0.7rem] uppercase tracking-[0.2em] text-text-dim/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: base + 1.0, duration: 0.8 }}
            >
              {region.name}{currentPlace ? ` · ${currentPlace}` : ''}
            </motion.p>

            {/* 3) Le choix — n'engage que les actions du héros. */}
            <motion.div
              className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: base + 1.3, duration: 0.6 }}
            >
              {enemy.apex ? (
                <>
                  <motion.button
                    onClick={() => engageBoss(enemy.id)}
                    className="rounded-md border px-7 py-2.5 font-heading text-sm tracking-wide text-text"
                    style={{
                      borderColor: `color-mix(in oklab, ${accent} 65%, transparent)`,
                      background: `color-mix(in oklab, ${accent} 15%, transparent)`,
                    }}
                    whileHover={{ y: -2, boxShadow: `0 0 22px -4px ${accent}` }}
                    whileTap={{ scale: 0.97 }}
                  >
                    L’affronter
                  </motion.button>
                  <motion.button
                    onClick={dismissBoss}
                    className="group rounded-md border border-ink/70 px-7 py-2.5 font-heading text-sm tracking-wide text-text-dim transition-colors hover:border-gold/50 hover:text-text"
                    whileTap={{ scale: 0.97 }}
                    title="Fuir n'est jamais gratuit : blessure, poursuite, occasion perdue…"
                  >
                    Reculer
                    <span className="mt-0.5 block text-[0.56rem] uppercase tracking-[0.18em] text-text-dim/60 group-hover:text-text-dim">
                      fuir a un prix
                    </span>
                  </motion.button>
                </>
              ) : (
                <motion.button
                  onClick={dismissBoss}
                  className="rounded-md border border-ink/70 px-7 py-2.5 font-heading text-sm tracking-wide text-text transition-colors hover:border-gold/50"
                  whileTap={{ scale: 0.97 }}
                >
                  Continuer
                </motion.button>
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
