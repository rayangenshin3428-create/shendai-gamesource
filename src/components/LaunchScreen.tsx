import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { REGIONS } from '../data';
import { useGame } from '../state/game';
import { Seal } from './ui/Seal';

// ============================================================================
// Écran de lancement — le seuil. On laisse au joueur le temps de découvrir le
// monde : un peu de contexte, puis les emblèmes des cours et régions qui se
// dévoilent lentement (visibles même sur une machine modeste). Puis « Jouer ».
// ============================================================================

const EMBLEM_ACCENT: Record<string, string> = {
  cotes: '#8aa6ff',
  braise: '#e2502a',
  givre: '#bfe3ff',
  luciole: '#e6d27a',
  lys: '#d23a44',
  pilier: '#f0e6c8',
};

// Ordre d'apparition (les cinq cours + le Pilier).
const EMBLEM_ORDER = ['cotes', 'braise', 'givre', 'luciole', 'lys', 'pilier'];
const EMBLEMS = EMBLEM_ORDER.map((id) => REGIONS.find((r) => r.id === id)!).filter(Boolean);

// Durée minimale : le temps que la séquence d'emblèmes se déroule en entier.
const SEQUENCE_MS = 2600;

export function LaunchScreen() {
  const { phase, startIntro } = useGame();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const fonts = 'fonts' in document ? document.fonts.ready : Promise.resolve();
    const min = new Promise<void>((r) => window.setTimeout(r, SEQUENCE_MS));
    let alive = true;
    Promise.all([fonts, min]).then(() => alive && setReady(true));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <AnimatePresence>
      {phase === 'launch' && (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-[#070709]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          <motion.div
            className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.45 }}
            transition={{ duration: 2.4 }}
            style={{
              width: 180,
              background:
                'linear-gradient(to top, transparent, rgba(255,240,200,0.07) 45%, rgba(210,230,255,0.14) 80%, transparent)',
              filter: 'blur(12px)',
            }}
          />

          <div className="relative z-10 flex w-full max-w-2xl flex-col items-center px-6 text-center">
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.1, ease: 'easeOut' }}
            >
              <motion.div
                animate={{
                  filter: [
                    'drop-shadow(0 0 0px rgba(207,58,42,0))',
                    'drop-shadow(0 0 20px rgba(207,58,42,0.5))',
                    'drop-shadow(0 0 0px rgba(207,58,42,0))',
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Seal char="神" size={76} />
              </motion.div>
            </motion.div>

            <motion.h1
              className="mt-6 font-display text-4xl tracking-[0.42em] text-[#ece4d2] sm:text-5xl"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              SHENDAÏ
            </motion.h1>
            <motion.p
              className="mt-3 text-[0.7rem] uppercase tracking-[0.36em] text-[#8a8474]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.55 }}
            >
              les Terres sous le Ciel Fendu
            </motion.p>

            <motion.p
              className="mt-6 max-w-md text-sm italic leading-relaxed text-[#9a9180]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.85 }}
            >
              Le ciel s'est fendu, et la puissance des dieux morts traîne dans le monde comme une
              maladie. Cinq cours se la disputent. Une foudre, pourtant, n'appartient qu'à toi.
            </motion.p>

            {/* Emblèmes des cours & régions, dévoilés lentement */}
            <div className="mt-8 flex flex-wrap items-start justify-center gap-x-6 gap-y-4">
              {EMBLEMS.map((r, i) => (
                <motion.div
                  key={r.id}
                  className="flex w-16 flex-col items-center"
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.7, delay: 1.1 + i * 0.32 }}
                >
                  <span
                    className="grid size-12 place-items-center rounded-full"
                    style={{
                      border: `1px solid color-mix(in oklab, ${EMBLEM_ACCENT[r.id]} 55%, transparent)`,
                      background: `radial-gradient(circle at 40% 30%, color-mix(in oklab, ${EMBLEM_ACCENT[r.id]} 18%, transparent), transparent)`,
                      color: EMBLEM_ACCENT[r.id],
                      fontFamily: 'var(--font-brush)',
                    }}
                  >
                    <span className="text-2xl leading-none">{r.glyph}</span>
                  </span>
                  <span className="mt-1.5 text-[0.56rem] uppercase leading-tight tracking-wider text-[#7a7468]">
                    {r.name.replace(/^(Les?|L’|La|Le) /, '')}
                  </span>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 h-12">
              {ready ? (
                <motion.button
                  onClick={startIntro}
                  className="rounded-md border px-12 py-3 font-display text-lg tracking-[0.3em] text-[#f0e7d4] transition-colors"
                  style={{
                    borderColor: 'color-mix(in oklab, #bda063 60%, transparent)',
                    background: 'color-mix(in oklab, #bda063 12%, transparent)',
                  }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    boxShadow: [
                      '0 0 0px rgba(189,160,99,0)',
                      '0 0 22px rgba(189,160,99,0.35)',
                      '0 0 0px rgba(189,160,99,0)',
                    ],
                  }}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ boxShadow: { duration: 2.4, repeat: Infinity }, opacity: { duration: 0.6 } }}
                >
                  JOUER
                </motion.button>
              ) : (
                <div className="flex h-full items-center justify-center gap-2 text-[#6f685b]">
                  <motion.span
                    className="size-1.5 rounded-full bg-[#bda063]"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.1, repeat: Infinity }}
                  />
                  <span className="text-xs italic">Le ciel s'ouvre…</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
