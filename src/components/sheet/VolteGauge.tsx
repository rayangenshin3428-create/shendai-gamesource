import { useEffect, useState } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import { useGame } from '../../state/game';
import { Icon } from '../ui/Icon';
import { VOLT } from '../ui/volt';

// ============================================================================
// La jauge de Volte — le pouvoir signature du héros.
// Crépite et pulse à mesure qu'elle se charge ; à haute charge, elle menace
// la brûlure d'âme (auto-destruction).
// ============================================================================

export function VolteGauge() {
  const { hero, volteSpikeAt, spikeVolte, dischargeVolte } = useGame();
  const value = hero.volte;
  const capacity = hero.capacity;
  const danger = value >= capacity;
  const controls = useAnimationControls();
  const [crackleSeed, setCrackleSeed] = useState(0);

  // Réaction au « pic de Volte » : sursaut + nouvelle décharge graphique.
  useEffect(() => {
    if (!volteSpikeAt) return;
    setCrackleSeed((s) => s + 1);
    controls.start({
      scale: [1, 1.04, 1],
      transition: { duration: 0.5, ease: 'easeOut' },
    });
  }, [volteSpikeAt, controls]);

  // Crépitement régulier qui s'intensifie avec la charge.
  useEffect(() => {
    const interval = Math.max(420, 1600 - value * 14);
    const id = window.setInterval(() => setCrackleSeed((s) => s + 1), interval);
    return () => window.clearInterval(id);
  }, [value]);

  // Identité FIXE du Volt : orange molten (cf. SOUL VOLTTAGE), rouge en surtension.
  const color = danger ? VOLT.danger : VOLT.orange;

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-[0.6rem] uppercase tracking-[0.2em] text-text-dim">
          <Icon name="bolt" size={12} filled style={{ color }} />
          Volte d’Âme
        </span>
        <span className="font-heading text-sm font-semibold" style={{ color }}>
          {Math.round(value)}
          <span className="text-text-dim/60"> / {capacity}</span>
        </span>
      </div>

      <motion.div
        animate={controls}
        className="relative h-5 overflow-hidden rounded-full border"
        style={{
          borderColor: `color-mix(in oklab, ${color} 40%, var(--ink))`,
          background: 'color-mix(in oklab, var(--bg) 70%, #000)',
        }}
      >
        {/* Remplissage */}
        <motion.div
          className="absolute inset-y-0 left-0"
          animate={{ width: `${value}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 18 }}
          style={{
            background: `linear-gradient(90deg, color-mix(in oklab, ${color} 55%, transparent), ${color})`,
            boxShadow: `0 0 18px color-mix(in oklab, ${color} 70%, transparent)`,
          }}
        />

        {/* Pulsation de lueur, plus rapide à haute charge */}
        <motion.div
          className="absolute inset-y-0 left-0"
          style={{ width: `${value}%`, background: color, mixBlendMode: 'screen' }}
          animate={{ opacity: [0.15, 0.4, 0.15] }}
          transition={{ duration: Math.max(0.5, 1.6 - value / 100), repeat: Infinity }}
        />

        {/* Crépitement : éclair zigzag qui parcourt la jauge */}
        <svg
          key={crackleSeed}
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 20"
          preserveAspectRatio="none"
        >
          <motion.polyline
            points="2,10 10,5 16,13 24,6 32,12 40,7 48,11 56,6 64,13 72,8 80,12 88,7 96,10"
            fill="none"
            stroke="#fff"
            strokeWidth={danger ? 1.1 : 0.8}
            strokeLinejoin="round"
            initial={{ opacity: 0, pathLength: 0 }}
            animate={{ opacity: [0, 0.9, 0], pathLength: [0, 1, 1] }}
            transition={{ duration: 0.45 }}
            style={{
              filter: `drop-shadow(0 0 3px ${color})`,
              clipPath: `inset(0 ${100 - value}% 0 0)`,
            }}
          />
        </svg>

        {/* Seuil de saturation : au-delà, c'est la surtension */}
        <div
          className="absolute inset-y-0"
          style={{
            left: `${capacity}%`,
            width: 2,
            background: `color-mix(in oklab, ${VOLT.danger} 80%, #fff)`,
            boxShadow: `0 0 6px ${VOLT.danger}`,
            opacity: 0.9,
          }}
          title="Seuil de saturation"
        />
      </motion.div>

      {/* Statut */}
      <div className="mt-1.5 flex min-h-[1rem] items-center text-[0.66rem]">
        {danger ? (
          <motion.span
            className="flex items-center gap-1 font-semibold"
            style={{ color: 'var(--seal)' }}
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <Icon name="skull" size={12} /> Surtension — la brûlure d’âme te ronge (perte de vitalité)
          </motion.span>
        ) : (
          <span className="text-text-dim/70 italic">
            Accumule la charge ; au-delà du seuil, ton conduit brûle.
          </span>
        )}
      </div>

      {/* Actions de Volte */}
      <div className="mt-2 grid grid-cols-2 gap-1.5">
        <button
          onClick={() => spikeVolte(12)}
          className="rounded border border-ink/70 px-2 py-1 text-[0.66rem] text-text-dim transition-colors hover:border-gold/50 hover:text-text"
          title="Canaliser la foudre ambiante pour charger ta réserve."
        >
          Canaliser +
        </button>
        <button
          onClick={dischargeVolte}
          disabled={value < 25}
          className="rounded border px-2 py-1 text-[0.66rem] font-semibold transition-colors disabled:opacity-40"
          style={{
            borderColor: `color-mix(in oklab, ${VOLT.orange} 50%, var(--ink))`,
            color: VOLT.orange,
          }}
          title="Libérer toute la réserve en une frappe dévastatrice (vide la jauge)."
        >
          Décharger ⚡
        </button>
      </div>

      <p className="mt-2 text-[0.62rem] leading-snug text-text-dim/70">
        La Volte est ta réserve de foudre : elle se charge au combat et sous l’orage, se dépense en
        techniques, et se libère d’un coup avec <span style={{ color: VOLT.orange }}>Décharger</span>.
        Déborder la <span className="text-text">Capacité</span> ({capacity}) = surtension.
      </p>
    </div>
  );
}
