import { AnimatePresence, motion } from 'framer-motion';
import { ENEMY_BY_ID } from '../../data';
import { useGame } from '../../state/game';
import { Icon } from '../ui/Icon';

// ============================================================================
// Mode COMBAT DE BOSS — une vraie bascule d'interface, pas trois lueurs.
// Tout se teinte de la couleur de DANGER de la ZONE COURANTE (--seal du thème
// de région : cohérent avec l'endroit, jamais un orange plaqué) : vignette
// lourde, liseré pulsé tout autour de l'écran, voile bas qui « respire », et une
// bannière de combat. Le joueur sent immédiatement qu'un événement majeur a
// commencé.
// ============================================================================

export function BossAmbiance() {
  const { bossEncounter, region } = useGame();
  const e = bossEncounter ? ENEMY_BY_ID[bossEncounter] : null;

  return (
    <AnimatePresence>
      {e && (
        <>
          {/* Assombrissement lourd des bords — on cadre l'affrontement. */}
          <motion.div
            className="pointer-events-none fixed inset-0 z-[57]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            style={{ boxShadow: 'inset 0 0 280px 90px rgba(0,0,0,0.78)' }}
          />

          {/* Liseré de danger pulsé, tout autour de l'écran (teinte de la zone). */}
          <motion.div
            className="pointer-events-none fixed inset-0 z-[58]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="absolute inset-0"
              animate={{
                boxShadow: [
                  'inset 0 0 60px -10px color-mix(in oklab, var(--seal) 35%, transparent)',
                  'inset 0 0 110px 0px color-mix(in oklab, var(--seal) 70%, transparent)',
                  'inset 0 0 60px -10px color-mix(in oklab, var(--seal) 35%, transparent)',
                ],
              }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>

          {/* Voile bas qui « respire », dans la couleur de la zone. */}
          <motion.div
            className="pointer-events-none fixed inset-x-0 bottom-0 z-[57] h-2/5"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.12, 0.22, 0.12] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            style={{ background: 'radial-gradient(80% 100% at 50% 100%, var(--seal), transparent 70%)' }}
          />

          {/* Bannière de combat — sobre, teintée par la zone. */}
          <motion.div
            className="pointer-events-none fixed left-1/2 top-[68px] z-[59] -translate-x-1/2"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ type: 'spring', stiffness: 200, damping: 24 }}
          >
            <div
              className="flex items-center gap-3 rounded-full border px-5 py-2 backdrop-blur-sm"
              style={{
                borderColor: 'color-mix(in oklab, var(--seal) 55%, transparent)',
                background: 'color-mix(in oklab, #000 74%, transparent)',
                boxShadow: '0 0 30px -8px color-mix(in oklab, var(--seal) 60%, transparent)',
              }}
            >
              <motion.span
                style={{ color: 'var(--seal)' }}
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 1.4, repeat: Infinity }}
              >
                <Icon name="skull" size={16} />
              </motion.span>
              <div className="text-center leading-tight">
                <div className="text-[0.55rem] uppercase tracking-[0.3em]" style={{ color: 'var(--seal)' }}>
                  Combat · {region.name}
                </div>
                <div className="font-display text-sm tracking-wide text-text">
                  {e.name} <span className="text-text-dim">— {e.epithet}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
