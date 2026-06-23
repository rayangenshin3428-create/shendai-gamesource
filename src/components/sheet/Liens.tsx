import { CHARACTER_BY_ID } from '../../data';
import { useGame } from '../../state/game';
import { Icon } from '../ui/Icon';

// ============================================================================
// Liens — un registre des relations nouées au fil du récit (mentor, alliés,
// rivaux, attaches naissantes). PAS une jauge de romance : les sentiments se
// développent naturellement dans l'histoire, jamais via un compteur affiché.
// ============================================================================

/** Traduit un lien en qualité, sans chiffre exposé. */
function bondLabel(value: number): { label: string; level: number } {
  if (value >= 80) return { label: 'Indéfectible', level: 5 };
  if (value >= 55) return { label: 'Proche', level: 4 };
  if (value >= 30) return { label: 'Confiance', level: 3 };
  if (value >= 12) return { label: 'Naissant', level: 2 };
  if (value >= 1) return { label: 'Fragile', level: 1 };
  return { label: 'Distant', level: 0 };
}

export function Liens() {
  const { hero } = useGame();

  return (
    <div>
      <div className="mb-2 flex items-center gap-1.5 text-[0.6rem] uppercase tracking-[0.2em] text-text-dim">
        <Icon name="person" size={12} className="text-gold/70" />
        Liens
      </div>

      <ul className="space-y-2">
        {hero.affinities.map((aff) => {
          const ch = CHARACTER_BY_ID[aff.characterId];
          if (!ch || !ch.discovered) return null;
          const bond = bondLabel(aff.value);
          return (
            <li key={aff.characterId} className="flex items-center gap-3">
              <span
                className="grid size-7 shrink-0 place-items-center rounded-full text-xs"
                style={{
                  background: 'color-mix(in oklab, var(--surface-2) 90%, transparent)',
                  border: '1px solid color-mix(in oklab, var(--gold) 35%, transparent)',
                  color: 'var(--gold)',
                  fontFamily: 'var(--font-brush)',
                }}
                title={ch.epithet}
              >
                {ch.name.charAt(0)}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="truncate font-heading text-sm text-text">{ch.name}</span>
                  <span className="text-[0.62rem] uppercase tracking-wider text-text-dim">
                    {bond.label}
                  </span>
                </div>
                {/* Pépites discrètes plutôt qu'une jauge chiffrée */}
                <div className="mt-1 flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className="h-1 flex-1 rounded-full"
                      style={{
                        background:
                          i < bond.level
                            ? 'color-mix(in oklab, var(--gold) 70%, transparent)'
                            : 'color-mix(in oklab, var(--ink) 80%, transparent)',
                      }}
                    />
                  ))}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
