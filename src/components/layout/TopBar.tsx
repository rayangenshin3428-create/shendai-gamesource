import { motion } from 'framer-motion';
import { useGame } from '../../state/game';
import type { ThreatLevel } from '../../data';
import { PHASE_META } from '../../systems/time';
import { Icon } from '../ui/Icon';
import { Seal } from '../ui/Seal';

// ============================================================================
// Barre haute : marque · lieu actuel · palier du héros · niveau de menace ·
// bouton Encyclopédie.
// ============================================================================

const THREAT_META: Record<ThreatLevel, { label: string; color: string }> = {
  calme: { label: 'Calme', color: 'var(--glow-cold)' },
  tendu: { label: 'Tendu', color: 'var(--gold)' },
  mortel: { label: 'Mortel', color: 'var(--seal)' },
};

function ThreatPill({ level }: { level: ThreatLevel }) {
  const meta = THREAT_META[level];
  const deadly = level === 'mortel';
  return (
    <div className="flex items-center gap-2">
      <span className="text-[0.62rem] uppercase tracking-[0.22em] text-text-dim">
        Menace
      </span>
      <motion.div
        className="flex items-center gap-2 rounded-full border px-3 py-1"
        style={{
          borderColor: `color-mix(in oklab, ${meta.color} 45%, transparent)`,
          background: `color-mix(in oklab, ${meta.color} 12%, transparent)`,
        }}
        animate={
          deadly
            ? { boxShadow: [
                `0 0 0px ${meta.color}00`,
                `0 0 16px color-mix(in oklab, ${meta.color} 55%, transparent)`,
                `0 0 0px ${meta.color}00`,
              ] }
            : { boxShadow: 'none' }
        }
        transition={{ duration: 1.6, repeat: deadly ? Infinity : 0 }}
      >
        <motion.span
          className="size-2 rounded-full"
          style={{ background: meta.color }}
          animate={deadly ? { opacity: [1, 0.3, 1] } : { opacity: 1 }}
          transition={{ duration: 1.2, repeat: deadly ? Infinity : 0 }}
        />
        <span
          className="font-heading text-sm font-semibold tracking-wide"
          style={{ color: meta.color }}
        >
          {meta.label}
        </span>
      </motion.div>
    </div>
  );
}

export function TopBar() {
  const { region, hero, threat, clock, openCodex, setSettingsOpen } = useGame();

  return (
    <header className="relative z-20 flex items-center justify-between gap-4 border-b border-ink/60 bg-gradient-to-b from-surface/80 to-surface/20 px-5 py-3 backdrop-blur-sm">
      {/* Marque */}
      <div className="flex items-center gap-3">
        <Seal char="神" size={40} title="Shendaï" />
        <div className="leading-none">
          <div className="font-display text-lg tracking-[0.32em] text-text">
            SHENDAÏ
          </div>
          <div className="mt-1 text-[0.6rem] uppercase tracking-[0.28em] text-text-dim">
            les Terres sous le Ciel Fendu
          </div>
        </div>
      </div>

      {/* Lieu actuel */}
      <div className="hidden min-w-0 flex-1 items-center justify-center gap-3 md:flex">
        <span
          className="grid size-9 shrink-0 place-items-center rounded-full transition-colors"
          style={{
            border: '1px solid color-mix(in oklab, var(--accent) 45%, transparent)',
            background: 'color-mix(in oklab, var(--accent) 8%, transparent)',
            color: 'var(--accent)',
            fontFamily: 'var(--font-brush)',
          }}
          title={region.name}
        >
          <span className="text-xl leading-none">{region.glyph}</span>
        </span>
        <div className="min-w-0 text-center">
          <div className="truncate font-heading text-base text-text">
            {region.name}
          </div>
          <div className="truncate text-[0.66rem] uppercase tracking-[0.2em] text-text-dim">
            {region.subtitle}
          </div>
        </div>
      </div>

      {/* Temps · Palier · Menace · Codex */}
      <div className="flex items-center gap-5">
        {/* Horloge + repos */}
        <div className="hidden items-center gap-2 md:flex">
          <Icon name={PHASE_META[clock.phase].icon} size={16} className="text-gold/80" />
          <div className="leading-none">
            <div className="text-[0.6rem] uppercase tracking-[0.2em] text-text-dim">
              {PHASE_META[clock.phase].label} · An {clock.year}
            </div>
            <div className="font-heading text-sm text-text">
              Jour {clock.day} · {String(clock.hour).padStart(2, '0')}:
              {String(clock.minute).padStart(2, '0')}
            </div>
          </div>
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <Icon name="bolt" size={15} filled className="text-glow-warm" />
          <div className="leading-none">
            <div className="text-[0.6rem] uppercase tracking-[0.2em] text-text-dim">
              Palier
            </div>
            <div className="font-heading text-sm font-semibold text-text">
              {hero.palier}
            </div>
          </div>
        </div>

        <ThreatPill level={threat} />

        <button
          onClick={() => openCodex()}
          className="group flex items-center gap-2 rounded-md border border-gold/35 bg-gold/5 px-3 py-2 text-sm text-text transition-colors hover:border-gold/70 hover:bg-gold/10"
        >
          <Icon name="book" size={16} className="text-gold transition-transform group-hover:scale-110" />
          <span className="font-heading font-semibold tracking-wide">Codex</span>
        </button>

        <button
          onClick={() => setSettingsOpen(true)}
          className="grid size-10 place-items-center rounded-md border border-ink/70 text-text-dim transition-colors hover:border-gold/50 hover:text-text"
          aria-label="Paramètres"
          title="Paramètres"
        >
          <Icon name="settings" size={17} />
        </button>
      </div>
    </header>
  );
}
