import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  POINTS_OF_INTEREST,
  REGION_BY_ID,
  REGIONS,
  ROUTES,
  SUBLOCATIONS,
  type Region,
} from '../../data';
import { useGame } from '../../state/game';
import { planTravel } from '../../systems/travel';
import { formatDuration } from '../../systems/time';
import { Icon, type IconName } from '../ui/Icon';

// ============================================================================
// Carte interactive de Shendaï. Le Pilier au centre, les régions autour.
// Clic sur une région → fiche + « S'y rendre » → change le lieu (et le thème).
// ============================================================================

const PARTICLE_ICON: Record<string, IconName> = {
  embers: 'flame',
  snow: 'snow',
  fireflies: 'firefly',
  petals: 'petal',
  sparks: 'spark',
  light: 'pillar',
  mixed: 'bolt',
};

function DangerDots({ level }: { level: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className="size-1.5 rounded-full"
          style={{
            background:
              i < level
                ? 'color-mix(in oklab, var(--seal) 85%, var(--gold))'
                : 'color-mix(in oklab, var(--ink) 80%, transparent)',
          }}
        />
      ))}
    </span>
  );
}

function RegionMarker({
  region,
  isCurrent,
  isSelected,
  hasSituation,
  onSelect,
}: {
  region: Region;
  isCurrent: boolean;
  isSelected: boolean;
  hasSituation?: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className="group absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${region.x}%`, top: `${region.y}%` }}
      aria-label={region.name}
    >
      {hasSituation && (
        <motion.span
          className="absolute -right-1 -top-1 z-10 size-2.5 rounded-full"
          style={{ background: 'var(--seal)', boxShadow: '0 0 8px var(--seal)' }}
          animate={{ opacity: [1, 0.3, 1], scale: [1, 1.25, 1] }}
          transition={{ duration: 1.6, repeat: Infinity }}
          title="Quelque chose se trame ici"
        />
      )}
      {isCurrent && (
        <motion.span
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: 34,
            height: 34,
            border: '1px solid color-mix(in oklab, var(--gold) 70%, transparent)',
          }}
          animate={{ scale: [1, 1.5], opacity: [0.7, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
        />
      )}
      <span
        className="relative grid place-items-center rounded-full transition-transform group-hover:scale-110"
        style={{
          width: 26,
          height: 26,
          background:
            'radial-gradient(circle at 35% 30%, color-mix(in oklab, var(--surface-2) 90%, transparent), color-mix(in oklab, var(--bg) 95%, transparent))',
          border: `1.5px solid ${
            isSelected || isCurrent
              ? 'color-mix(in oklab, var(--accent) 85%, var(--gold))'
              : 'color-mix(in oklab, var(--gold) 35%, var(--ink))'
          }`,
          boxShadow:
            isSelected || isCurrent
              ? '0 0 16px -2px color-mix(in oklab, var(--accent) 70%, transparent)'
              : 'none',
          color: 'var(--accent)',
        }}
      >
        <Icon name={PARTICLE_ICON[region.particle] ?? 'bolt'} size={14} />
      </span>
      <span
        className="pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap font-heading text-[0.66rem] tracking-wide transition-opacity"
        style={{
          color: isSelected || isCurrent ? 'var(--text)' : 'var(--text-dim)',
          opacity: isSelected || isCurrent ? 1 : 0.7,
        }}
      >
        {region.name.replace(/^(Les?|L’|La) /, '')}
      </span>
    </button>
  );
}

export function MapView({ size = 'compact' }: { size?: 'compact' | 'full' }) {
  const { region: current, currentPlace, journeyTo, requestMove, setMapOpen, interactionLocked, hero, worldSituations } =
    useGame();
  const [selectedId, setSelectedId] = useState<string>(current.id);
  const selected = REGIONS.find((r) => r.id === selectedId) ?? current;
  const full = size === 'full';
  const subs = SUBLOCATIONS[selected.id] ?? [];
  const here = selected.id === current.id;
  const plan = !here ? planTravel(current.id, selected.id) : null;
  const sit = worldSituations[selected.id];
  const cantAfford = !!plan && hero.energy < Math.max(8, plan.energyCost);
  const journeyDisabled = interactionLocked || cantAfford;

  return (
    <div className={full ? 'flex flex-col gap-5 lg:flex-row' : 'flex flex-col gap-3'}>
      {/* La carte */}
      <div
        className="panel parchment relative shrink-0 overflow-hidden rounded-lg"
        style={{
          aspectRatio: '1 / 1',
          width: full ? 'min(60vh, 640px)' : '100%',
        }}
      >
        {/* Landmass — lavis d'encre stylisé */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full opacity-70"
        >
          <defs>
            <radialGradient id="land" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="color-mix(in oklab, var(--gold) 12%, transparent)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
          <path
            d="M50 8 C68 10 78 20 84 36 C90 50 86 66 76 80 C64 94 40 94 26 84 C12 74 8 56 14 40 C20 22 34 8 50 8 Z"
            fill="url(#land)"
            stroke="color-mix(in oklab, var(--gold) 22%, transparent)"
            strokeWidth="0.5"
          />
          {/* Réseau de routes entre les terres */}
          {ROUTES.map((rt) => {
            const a = REGION_BY_ID[rt.from];
            const b = REGION_BY_ID[rt.to];
            if (!a || !b) return null;
            return (
              <line
                key={`${rt.from}-${rt.to}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={`color-mix(in oklab, var(--gold) ${rt.major ? 26 : 14}%, transparent)`}
                strokeWidth={rt.major ? 0.45 : 0.3}
                strokeDasharray={rt.major ? undefined : '1 1.6'}
                strokeLinecap="round"
              />
            );
          })}
        </svg>

        {/* Glyphe de la région courante — filigrane culturel */}
        <div
          className="pointer-events-none absolute bottom-1 right-3 leading-none"
          style={{
            fontFamily: 'var(--font-brush)',
            fontSize: full ? 110 : 68,
            color: 'color-mix(in oklab, var(--gold) 9%, transparent)',
          }}
        >
          {current.glyph}
        </div>

        {/* Points d'intérêt — cités, sites, carrefours, ruines */}
        {POINTS_OF_INTEREST.map((poi) => (
          <div
            key={poi.id}
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${poi.x}%`, top: `${poi.y}%` }}
          >
            <span
              className="block"
              style={{
                width: 5,
                height: 5,
                transform: 'rotate(45deg)',
                borderRadius: 1,
                background:
                  poi.kind === 'cité'
                    ? 'color-mix(in oklab, var(--gold) 55%, transparent)'
                    : 'color-mix(in oklab, var(--gold) 28%, transparent)',
                border: '0.5px solid color-mix(in oklab, var(--gold) 50%, transparent)',
              }}
            />
            {full && (
              <span className="absolute left-1/2 top-2 -translate-x-1/2 whitespace-nowrap text-[0.56rem] tracking-wide text-text-dim/80">
                {poi.name}
              </span>
            )}
          </div>
        ))}

        {/* Trait du Pilier au centre */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: 3,
            height: '64%',
            background:
              'linear-gradient(to top, transparent, color-mix(in oklab, var(--glow-cold) 60%, transparent), color-mix(in oklab, var(--accent) 70%, transparent), transparent)',
            filter: 'blur(1px)',
          }}
        />

        {REGIONS.map((r) => (
          <RegionMarker
            key={r.id}
            region={r}
            isCurrent={r.id === current.id}
            isSelected={r.id === selectedId}
            hasSituation={!!worldSituations[r.id]}
            onSelect={() => setSelectedId(r.id)}
          />
        ))}
      </div>

      {/* Fiche de la région sélectionnée */}
      <div className={full ? 'flex-1' : ''}>
        <motion.div
          key={selected.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex h-full flex-col"
        >
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-heading text-lg text-text">{selected.name}</h3>
            {selected.id === current.id && (
              <span className="rounded-full border border-gold/40 px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.2em] text-gold">
                Ici
              </span>
            )}
          </div>
          <div className="mt-0.5 text-[0.68rem] uppercase tracking-[0.2em] text-text-dim">
            {selected.subtitle}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-text-dim">
            {selected.faction && (
              <span>
                <span className="text-text-dim/70">Faction · </span>
                <span className="text-text">{selected.faction}</span>
              </span>
            )}
            <span className="flex items-center gap-2">
              <span className="text-text-dim/70">Danger</span>
              <DangerDots level={selected.danger} />
            </span>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-text/85">{selected.summary}</p>

          {sit && (
            <div className="mt-3 rounded-md border border-seal/40 bg-seal/5 p-2.5">
              <div className="flex items-center gap-1.5 text-[0.58rem] uppercase tracking-[0.2em] text-seal">
                <span className="size-1.5 rounded-full bg-seal" /> En ce moment · {sit.label}
              </div>
              <p className="mt-1 text-[0.78rem] leading-snug text-text/80">{sit.desc}</p>
            </div>
          )}

          {/* Lieux notables — cliquables pour s'y rendre quand on est sur place */}
          {subs.length > 0 && (
            <div className="mt-3">
              <div className="mb-1.5 flex items-center justify-between text-[0.6rem] uppercase tracking-[0.2em] text-text-dim/80">
                <span>Lieux notables</span>
                {here && <span className="normal-case tracking-normal text-gold/70">clique pour t’y rendre</span>}
              </div>
              <ul className={`space-y-1 ${full ? '' : 'max-h-44 overflow-y-auto pr-1'}`}>
                {(full ? subs : subs.slice(0, 5)).map((s) => {
                  const atPlace = here && currentPlace === s.name;
                  const Row = (
                    <>
                      <span
                        className="mt-1.5 size-1.5 shrink-0 rotate-45"
                        style={{
                          background: atPlace
                            ? 'var(--accent)'
                            : 'color-mix(in oklab, var(--gold) 55%, transparent)',
                        }}
                      />
                      <div className="min-w-0">
                        <div className="flex items-baseline gap-2">
                          <span className="font-heading text-[0.82rem] text-text">{s.name}</span>
                          <span className="text-[0.54rem] uppercase tracking-wider text-text-dim/70">
                            {s.kind}
                          </span>
                          {atPlace && (
                            <span className="text-[0.54rem] uppercase tracking-wider text-accent">ici</span>
                          )}
                        </div>
                        {full && <p className="text-[0.72rem] leading-snug text-text-dim">{s.note}</p>}
                      </div>
                    </>
                  );
                  return here ? (
                    <li key={s.name}>
                      <button
                        onClick={() => {
                          requestMove(s.name);
                          setMapOpen(false);
                        }}
                        disabled={atPlace || interactionLocked}
                        title={interactionLocked ? 'Termine d’abord la scène en cours' : undefined}
                        className="flex w-full gap-2 rounded-md px-1.5 py-1 text-left transition-colors hover:bg-gold/5 disabled:opacity-50"
                      >
                        {Row}
                      </button>
                    </li>
                  ) : (
                    <li key={s.name} className="flex gap-2 px-1.5 py-1">
                      {Row}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          <div className="mt-4 pt-1">
            {here ? (
              <div className="text-xs italic text-text-dim">
                Tu es ici{currentPlace ? ` — ${currentPlace}` : ''}.
              </div>
            ) : (
              <>
                {plan && (
                  <div className="mb-2 flex items-center justify-center gap-3 text-[0.7rem] text-text-dim">
                    <span className="flex items-center gap-1">
                      <Icon name="sun" size={12} className="text-gold/60" />
                      ≈ {formatDuration(plan.minutes)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="tent" size={12} className="text-gold/60" />
                      −{plan.energyCost} énergie
                    </span>
                  </div>
                )}
                <button
                  onClick={() => journeyTo(selected.id)}
                  disabled={journeyDisabled}
                  title={
                    cantAfford
                      ? 'Trop épuisé pour un tel trajet — repose-toi'
                      : interactionLocked
                        ? 'Termine d’abord la scène en cours'
                        : undefined
                  }
                  className="group flex w-full items-center justify-center gap-2 rounded-md border border-accent/50 bg-accent/10 px-4 py-2.5 font-heading text-sm font-semibold tracking-wide text-text transition-all hover:border-accent hover:bg-accent/20 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-accent/50 disabled:hover:bg-accent/10"
                  style={{ color: 'var(--text)' }}
                >
                  <span style={{ color: 'var(--accent)' }}>
                    {cantAfford ? 'Trop épuisé' : 'S’y rendre'}
                  </span>
                  <Icon name="travel" size={16} className="transition-transform group-hover:translate-x-0.5" style={{ color: 'var(--accent)' }} />
                </button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
