import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGame } from '../../state/game';
import { VOLT } from '../ui/volt';

// ============================================================================
// Pic de Volte — un flash d'éclair, mais SEULEMENT lors d'une vraie surcharge
// (pas à chaque petit choix). Esthétique « SOUL VOLTTAGE » : l'arc orange
// molten déchire une nappe de fumée teal froide. Le tracé varie à chaque fois.
// Identité FIXE (couleurs VOLT), indépendante de la région.
// ============================================================================

/** Seuil au-delà duquel la décharge mérite un flash plein écran. */
const FLASH_THRESHOLD = 16;

function randomBolt(): string {
  const x0 = 18 + Math.random() * 64;
  let x = x0;
  let y = -5;
  const pts: string[] = [`${x.toFixed(0)},${y}`];
  while (y < 105) {
    y += 10 + Math.random() * 12;
    x += (Math.random() - 0.5) * 36;
    x = Math.max(4, Math.min(96, x));
    pts.push(`${x.toFixed(0)},${y.toFixed(0)}`);
  }
  return pts.join(' ');
}

/** Quelques branches secondaires qui partent du tracé principal. */
function branches(main: string): string[] {
  const pts = main.split(' ').map((p) => p.split(',').map(Number));
  const out: string[] = [];
  for (let i = 2; i < pts.length - 1; i += 2) {
    const [x, y] = pts[i];
    const bx = Math.max(2, Math.min(98, x + (Math.random() - 0.5) * 26));
    const by = Math.min(104, y + 6 + Math.random() * 10);
    out.push(`${x},${y} ${bx.toFixed(0)},${by.toFixed(0)}`);
  }
  return out;
}

export function VolteSpike() {
  const { volteSpikeAt, volteSpikeAmount } = useGame();
  const [flash, setFlash] = useState<{ key: number; bolt: string; forks: string[] } | null>(null);
  const lastAt = useRef(0);

  useEffect(() => {
    if (!volteSpikeAt || volteSpikeAt === lastAt.current) return;
    lastAt.current = volteSpikeAt;
    if (volteSpikeAmount < FLASH_THRESHOLD) return; // petite charge : pas de flash
    const bolt = randomBolt();
    setFlash({ key: volteSpikeAt, bolt, forks: branches(bolt) });
  }, [volteSpikeAt, volteSpikeAmount]);

  // Décharge majeure (Décharger / boss) = flash plus intense.
  const major = volteSpikeAmount >= 36;

  return (
    <AnimatePresence>
      {flash && (
        <motion.div
          key={flash.key}
          className="pointer-events-none fixed inset-0 z-[68] overflow-hidden"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: major ? 0.6 : 0.5, ease: 'easeOut' }}
          onAnimationComplete={() => setFlash(null)}
        >
          {/* Nappe de fumée teal froide qui se soulève (le fond de l'image). */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0.32, y: 12 }}
            animate={{ opacity: 0, y: 0 }}
            transition={{ duration: major ? 0.7 : 0.5, ease: 'easeOut' }}
            style={{
              background: `radial-gradient(120% 80% at 50% 100%, ${VOLT.smoke}55, transparent 70%)`,
              filter: 'blur(8px)',
            }}
          />
          {/* Embrasement orange chaud au cœur de la décharge. */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: major ? 0.55 : 0.4 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.33 }}
            style={{ background: `radial-gradient(90% 70% at 50% 60%, ${VOLT.orange}40, transparent 65%)` }}
          />
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="volt-bolt" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={VOLT.hot} />
                <stop offset="55%" stopColor={VOLT.amber} />
                <stop offset="100%" stopColor={VOLT.orange} />
              </linearGradient>
            </defs>
            {/* Branches secondaires, plus fines */}
            {flash.forks.map((f, i) => (
              <motion.polyline
                key={i}
                points={f}
                fill="none"
                stroke={VOLT.amber}
                strokeWidth="0.4"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: [0, 0.8, 0] }}
                transition={{ duration: 0.4, ease: 'easeOut', delay: 0.04 }}
                style={{ filter: `drop-shadow(0 0 2px ${VOLT.orange})` }}
              />
            ))}
            {/* Arc principal : cœur clair, halo orange */}
            <motion.polyline
              points={flash.bolt}
              fill="none"
              stroke="url(#volt-bolt)"
              strokeWidth={major ? 0.85 : 0.6}
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: [0, 1, 0] }}
              transition={{ duration: major ? 0.46 : 0.42, ease: 'easeOut' }}
              style={{ filter: `drop-shadow(0 0 5px ${VOLT.orange}) drop-shadow(0 0 1px ${VOLT.hot})` }}
            />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
