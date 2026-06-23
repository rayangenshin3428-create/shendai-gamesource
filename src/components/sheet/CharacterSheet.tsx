import { motion } from 'framer-motion';
import { PALIERS } from '../../data';
import { useGame } from '../../state/game';
import { Icon, type IconName } from '../ui/Icon';
import { VolteGauge } from './VolteGauge';
import { Inventory } from './Inventory';
import { Liens } from './Liens';

// ============================================================================
// Fiche de personnage (colonne droite) : palier de la Montée, Souffle,
// vitalité, jauge de Volte, inventaire, affinités, épithète.
// ============================================================================

function StatBar({
  icon,
  label,
  value,
  color,
}: {
  icon: IconName;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-[0.6rem] uppercase tracking-[0.2em] text-text-dim">
          <Icon name={icon} size={12} style={{ color }} />
          {label}
        </span>
        <span className="text-[0.66rem] text-text-dim">{Math.round(value)}%</span>
      </div>
      <div
        className="h-2 overflow-hidden rounded-full"
        style={{ background: 'color-mix(in oklab, var(--bg) 70%, #000)' }}
      >
        <motion.div
          className="h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            background: `linear-gradient(90deg, color-mix(in oklab, ${color} 50%, transparent), ${color})`,
          }}
        />
      </div>
    </div>
  );
}

function MonteeLadder({ palier }: { palier: string }) {
  const idx = PALIERS.indexOf(palier as (typeof PALIERS)[number]);
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[0.6rem] uppercase tracking-[0.2em] text-text-dim">La Montée</span>
        <span className="font-heading text-sm font-semibold text-text">{palier}</span>
      </div>
      <div className="flex gap-1">
        {PALIERS.map((p, i) => (
          <div
            key={p}
            className="h-1.5 flex-1 rounded-full transition-colors"
            title={p}
            style={{
              background:
                i <= idx
                  ? 'linear-gradient(90deg, color-mix(in oklab, var(--gold) 50%, transparent), var(--gold))'
                  : 'color-mix(in oklab, var(--ink) 80%, transparent)',
              boxShadow: i === idx ? '0 0 8px color-mix(in oklab, var(--gold) 70%, transparent)' : 'none',
            }}
          />
        ))}
      </div>
      <div className="mt-1 flex justify-between text-[0.54rem] uppercase tracking-wider text-text-dim/60">
        <span>{PALIERS[0]}</span>
        <span>{PALIERS[PALIERS.length - 1]}</span>
      </div>
    </div>
  );
}

export function CharacterSheet() {
  const { hero } = useGame();

  return (
    <section className="panel flex h-full flex-col gap-5 overflow-y-auto rounded-lg p-4">
      {/* Identité */}
      <div className="text-center">
        <div
          className="mx-auto grid size-16 place-items-center rounded-full"
          style={{
            background:
              'radial-gradient(circle at 40% 30%, color-mix(in oklab, var(--glow-warm) 22%, transparent), color-mix(in oklab, var(--bg) 85%, transparent))',
            border: '1px solid color-mix(in oklab, var(--gold) 45%, transparent)',
          }}
        >
          <Icon name="bolt" size={28} filled className="text-glow-warm" />
        </div>
        <h2 className="mt-2 font-display text-lg tracking-wide text-text">{hero.name}</h2>
        <p className="font-heading text-sm italic" style={{ color: 'var(--accent)' }}>
          « {hero.epithet} »
        </p>
        <div className="mt-2 flex items-center justify-center gap-3 text-[0.62rem] uppercase tracking-[0.16em] text-text-dim">
          <span className="flex items-center gap-1">
            <Icon name="bolt" size={11} className="text-glow-warm" />
            Voie {hero.voie}
          </span>
          <span className="h-3 w-px bg-ink" />
          <span>{hero.age} ans</span>
        </div>
        <p className="mt-1 text-[0.66rem] italic text-text-dim/80">{hero.combat}</p>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-gold/25 to-transparent" />

      <MonteeLadder palier={hero.palier} />

      <StatBar icon="heart" label="Vitalité" value={hero.vitality} color="var(--seal)" />
      <StatBar icon="drop" label="Souffle" value={hero.souffle} color="var(--glow-cold)" />
      <StatBar icon="tent" label="Énergie" value={hero.energy} color="var(--gold)" />

      <div className="h-px bg-gradient-to-r from-transparent via-gold/25 to-transparent" />

      <VolteGauge />

      <div className="h-px bg-gradient-to-r from-transparent via-gold/25 to-transparent" />

      <Inventory />

      <div className="h-px bg-gradient-to-r from-transparent via-gold/25 to-transparent" />

      <Liens />
    </section>
  );
}
