import { AnimatePresence, motion } from 'framer-motion';
import { useGame } from '../../state/game';

// ============================================================================
// Écran de mort — un vrai moment, pas un « Game Over ».
// Fondu au noir, le bruit du monde s'éteint, une luciole dorée s'élève en
// silence vers la lumière du Pilier. Texte sobre, puis options.
// ============================================================================

export function DeathScreen() {
  const { isDead, revive, endGame } = useGame();

  return (
    <AnimatePresence>
      {isDead && (
        <motion.div
          className="fixed inset-0 z-[70] grid place-items-center overflow-hidden bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4 }}
        >
          {/* Lumière lointaine du Pilier */}
          <motion.div
            className="absolute left-1/2 top-0 h-full w-40 -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 2, delay: 0.6 }}
            style={{
              background:
                'linear-gradient(to top, transparent, rgba(255,240,200,0.10) 40%, rgba(220,235,255,0.16) 75%, transparent)',
              filter: 'blur(10px)',
            }}
          />

          {/* La luciole dorée qui s'élève */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2"
            initial={{ bottom: '12%', opacity: 0 }}
            animate={{ bottom: '82%', opacity: [0, 1, 1, 0.2] }}
            transition={{ duration: 6, delay: 0.4, ease: 'easeInOut' }}
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#ffe9a8',
              boxShadow: '0 0 22px 6px rgba(255,220,140,0.7)',
            }}
          />

          {/* Texte */}
          <div className="relative z-10 px-6 text-center">
            <motion.h2
              className="font-display text-2xl tracking-[0.18em] text-[#e9dfc7] sm:text-3xl"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.6, delay: 1.6 }}
            >
              Ton souffle rejoint le Pilier.
            </motion.h2>
            <motion.p
              className="mx-auto mt-4 max-w-md text-sm italic leading-relaxed text-[#9a9180]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.6, delay: 2.4 }}
            >
              La foudre que tu portais s'est éteinte avec toi. Quelque part, quatre
              cours apprendront la nouvelle — et certaines en seront soulagées.
            </motion.p>

            <motion.div
              className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 3.4 }}
            >
              <button
                onClick={revive}
                className="rounded-md border border-[#bda063]/50 bg-[#bda063]/10 px-5 py-2.5 font-heading text-sm tracking-wide text-[#e9dfc7] transition-colors hover:border-[#bda063] hover:bg-[#bda063]/20"
              >
                Reprendre à un point sûr
              </button>
              <button
                onClick={revive}
                className="rounded-md border border-[#b5362f]/50 bg-[#b5362f]/10 px-5 py-2.5 font-heading text-sm tracking-wide text-[#e9c9c0] transition-colors hover:border-[#b5362f] hover:bg-[#b5362f]/20"
                title="Le Lys Rouge peut rappeler une âme — mais on revient diminué, endetté ou changé."
              >
                Tenter un retour (Lys Rouge)
              </button>
              <button
                onClick={endGame}
                className="rounded-md px-5 py-2.5 font-heading text-sm tracking-wide text-[#6f685b] transition-colors hover:text-[#9a9180]"
              >
                En finir
              </button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
