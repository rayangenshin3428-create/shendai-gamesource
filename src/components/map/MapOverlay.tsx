import { useGame } from '../../state/game';
import { Icon } from '../ui/Icon';
import { Overlay } from '../ui/Overlay';
import { MapView } from './MapView';

// ============================================================================
// Carte agrandie en overlay.
// ============================================================================

export function MapOverlay() {
  const { mapOpen, setMapOpen } = useGame();

  return (
    <Overlay open={mapOpen} onClose={() => setMapOpen(false)} label="Carte de Shendaï" maxWidth={1180}>
      <div className="parchment p-6 sm:p-8">
        <div className="mb-5 flex items-center gap-3">
          <Icon name="map" size={20} className="text-gold" />
          <div>
            <h2 className="font-display text-xl tracking-[0.24em] text-text">CARTE DE SHENDAÏ</h2>
            <p className="text-[0.66rem] uppercase tracking-[0.2em] text-text-dim">
              Choisis où porter tes pas — chaque terre change la couleur du ciel
            </p>
          </div>
        </div>
        <MapView size="full" />
      </div>
    </Overlay>
  );
}
