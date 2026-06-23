import { useGame } from '../../state/game';
import { Icon } from '../ui/Icon';
import { MapView } from './MapView';
import { ArenaView } from '../boss/ArenaView';

// ============================================================================
// Colonne gauche : la carte du monde — ou l'arène pendant un combat de boss.
// ============================================================================

export function WorldMap() {
  const { setMapOpen, bossEncounter } = useGame();

  // En plein combat de boss, la carte cède la place à l'arène contextuelle.
  if (bossEncounter) return <ArenaView />;

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-display text-xs uppercase tracking-[0.28em] text-text-dim">
          <Icon name="map" size={14} className="text-gold/70" />
          Carte de Shendaï
        </h2>
        <button
          onClick={() => setMapOpen(true)}
          className="rounded-md border border-ink/70 p-1.5 text-text-dim transition-colors hover:border-gold/50 hover:text-text"
          aria-label="Agrandir la carte"
          title="Agrandir"
        >
          <Icon name="expand" size={14} />
        </button>
      </div>

      <MapView size="compact" />
    </section>
  );
}
