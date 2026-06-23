import type { ReactNode } from 'react';
import { useGame } from '../state/game';
import { useSettings, type ParticleLevel } from '../state/settings';
import { Icon } from './ui/Icon';
import { Overlay } from './ui/Overlay';

// ============================================================================
// Menu de paramètres — confort visuel & performances. Simple et propre.
// ============================================================================

function Row({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="min-w-0">
        <div className="font-heading text-sm text-text">{title}</div>
        {hint && <div className="text-[0.7rem] text-text-dim">{hint}</div>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      role="switch"
      aria-checked={on}
      className="relative h-6 w-11 rounded-full border transition-colors"
      style={{
        borderColor: on ? 'color-mix(in oklab, var(--gold) 60%, transparent)' : 'var(--ink)',
        background: on ? 'color-mix(in oklab, var(--gold) 22%, transparent)' : 'color-mix(in oklab, var(--bg) 60%, #000)',
      }}
    >
      <span
        className="absolute top-1/2 size-4 -translate-y-1/2 rounded-full transition-all"
        style={{
          left: on ? 'calc(100% - 1.15rem)' : '0.15rem',
          background: on ? 'var(--gold)' : 'var(--text-dim)',
          boxShadow: on ? '0 0 8px color-mix(in oklab, var(--gold) 70%, transparent)' : 'none',
        }}
      />
    </button>
  );
}

const PARTICLE_OPTS: { id: ParticleLevel; label: string }[] = [
  { id: 'off', label: 'Aucune' },
  { id: 'low', label: 'Faible' },
  { id: 'normal', label: 'Normal' },
  { id: 'high', label: 'Élevé' },
];

export function SettingsMenu() {
  const { settingsOpen, setSettingsOpen } = useGame();
  const { settings, update, reset } = useSettings();

  return (
    <Overlay open={settingsOpen} onClose={() => setSettingsOpen(false)} label="Paramètres" maxWidth={520}>
      <div className="parchment p-6 sm:p-8">
        <div className="mb-5 flex items-center gap-3">
          <Icon name="bolt" size={18} className="text-gold" />
          <div>
            <h2 className="font-display text-xl tracking-[0.22em] text-text">PARAMÈTRES</h2>
            <p className="text-[0.66rem] uppercase tracking-[0.2em] text-text-dim">
              Confort visuel & performances
            </p>
          </div>
        </div>

        <div className="divide-y divide-ink/50">
          <Row title="Particules d'ambiance" hint="Braises, neige, lucioles… Réduis-les pour gagner en fluidité.">
            <div className="flex gap-1 rounded-md border border-ink/70 p-1">
              {PARTICLE_OPTS.map((o) => (
                <button
                  key={o.id}
                  onClick={() => update({ particles: o.id })}
                  className="rounded px-2.5 py-1 text-xs transition-colors"
                  style={{
                    background:
                      settings.particles === o.id ? 'color-mix(in oklab, var(--gold) 18%, transparent)' : 'transparent',
                    color: settings.particles === o.id ? 'var(--text)' : 'var(--text-dim)',
                  }}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </Row>

          <Row title="Réduire les animations" hint="Coupe les mouvements continus (accessibilité, perfs).">
            <Toggle on={settings.reduceMotion} onChange={(v) => update({ reduceMotion: v })} />
          </Row>

          <Row title="Grain & texture" hint="Le voile de papier vieilli sur l'image.">
            <Toggle on={settings.grain} onChange={(v) => update({ grain: v })} />
          </Row>

          <Row title="Lueurs d'ambiance" hint="Les flaques de lumière chaude et froide du fond.">
            <Toggle on={settings.glow} onChange={(v) => update({ glow: v })} />
          </Row>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={reset}
            className="text-xs uppercase tracking-[0.18em] text-text-dim transition-colors hover:text-text"
          >
            Réinitialiser
          </button>
          <button
            onClick={() => setSettingsOpen(false)}
            className="rounded-md border border-gold/40 bg-gold/10 px-5 py-2 font-heading text-sm tracking-wide text-text transition-colors hover:border-gold/70 hover:bg-gold/20"
          >
            Fermer
          </button>
        </div>
      </div>
    </Overlay>
  );
}
