import { lazy, Suspense } from 'react';
import { AmbianceLayer } from './components/ambiance/AmbianceLayer';
import { TopBar } from './components/layout/TopBar';
import { WorldMap } from './components/map/WorldMap';
import { MapOverlay } from './components/map/MapOverlay';
import { NarrativePanel } from './components/narrative/NarrativePanel';
import { CharacterSheet } from './components/sheet/CharacterSheet';
import { DeathScreen } from './components/moments/DeathScreen';
import { EpilogueScreen } from './components/moments/EpilogueScreen';
import { BossReveal } from './components/moments/BossReveal';
import { Interlude } from './components/moments/Interlude';
import { BossAmbiance } from './components/boss/BossAmbiance';
import { VolteSpike } from './components/moments/VolteSpike';
import { DemoControls } from './components/DemoControls';
import { SettingsMenu } from './components/SettingsMenu';
import { ConfirmMove } from './components/ConfirmMove';
import { LaunchScreen } from './components/LaunchScreen';
import { IntroSequence } from './components/IntroSequence';
import { DiscoveryToast } from './components/DiscoveryToast';

// Le Codex est lourd (toutes les fiches) : on le charge à la demande.
const Codex = lazy(() => import('./components/codex/Codex').then((m) => ({ default: m.Codex })));

// ============================================================================
// L'écran de jeu : barre haute, grille à trois colonnes, couche d'ambiance,
// overlays et moments forts. Lancement → intro → jeu.
// ============================================================================

export default function App() {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <AmbianceLayer />

      <TopBar />

      <main className="grid min-h-0 flex-1 grid-cols-1 gap-3 p-3 lg:grid-cols-[clamp(280px,24vw,340px)_1fr_clamp(300px,24vw,360px)]">
        <div className="min-h-0 overflow-y-auto lg:order-1">
          <WorldMap />
        </div>
        <div className="order-first min-h-0 lg:order-2 lg:h-full">
          <div className="h-[60vh] lg:h-full">
            <NarrativePanel />
          </div>
        </div>
        <div className="min-h-0 lg:order-3 lg:h-full">
          <div className="lg:h-full">
            <CharacterSheet />
          </div>
        </div>
      </main>

      {/* Couches d'effet plein écran */}
      <div className="vignette" />
      <div className="grain" />

      {/* Overlays & moments forts */}
      <MapOverlay />
      <Suspense fallback={null}>
        <Codex />
      </Suspense>
      <SettingsMenu />
      <ConfirmMove />
      <BossAmbiance />
      <BossReveal />
      <Interlude />
      <VolteSpike />
      <DeathScreen />
      <EpilogueScreen />
      <DiscoveryToast />

      <DemoControls />

      {/* Seuil d'entrée : lancement puis introduction */}
      <IntroSequence />
      <LaunchScreen />
    </div>
  );
}
