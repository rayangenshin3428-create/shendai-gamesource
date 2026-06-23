import { AnimatePresence, motion } from 'framer-motion';
import { useGame } from '../../state/game';
import { PARTICLE_SCALE, useSettings } from '../../state/settings';
import { darknessAt } from '../../systems/time';
import type { ThemeId, WorldVisual } from '../../data';
import { Particles } from './Particles';

// Événements visuels du monde : teinte cohérente avec la situation en cours
// (ville en flammes, tempête, corruption, deuil, siège), par-dessus le thème.
function WorldVisualFx({ visual }: { visual: WorldVisual }) {
  switch (visual) {
    case 'fire':
      return (
        <>
          <div className="absolute inset-0" style={{ background: 'rgba(120,24,10,0.12)' }} />
          <motion.div
            className="absolute inset-0"
            animate={{ opacity: [0.18, 0.3, 0.18] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ background: 'radial-gradient(90% 60% at 50% 100%, rgba(255,70,25,0.5), transparent 65%)' }}
          />
        </>
      );
    case 'storm':
      return (
        <>
          <div className="absolute inset-0" style={{ background: 'rgba(10,14,30,0.34)' }} />
          <motion.div
            className="absolute inset-0"
            animate={{ opacity: [0, 0, 0.45, 0.04, 0.28, 0, 0, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, times: [0, 0.34, 0.36, 0.38, 0.4, 0.45, 0.7, 1] }}
            style={{ background: 'rgba(220,230,255,0.55)' }}
          />
        </>
      );
    case 'corruption':
      return (
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: [0.14, 0.24, 0.14] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            background:
              'radial-gradient(120% 100% at 28% 40%, rgba(140,40,180,0.4), transparent 55%), radial-gradient(120% 100% at 82% 82%, rgba(60,140,80,0.3), transparent 55%)',
          }}
        />
      );
    case 'mourning':
      return (
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: [0.22, 0.32, 0.22] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ background: 'linear-gradient(180deg, rgba(30,40,70,0.45), rgba(8,12,26,0.5))', mixBlendMode: 'multiply' }}
        />
      );
    case 'siege':
      return (
        <>
          <div className="absolute inset-0" style={{ background: 'rgba(20,10,8,0.4)' }} />
          <motion.div
            className="absolute inset-0"
            animate={{ opacity: [0.16, 0.26, 0.16] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ background: 'radial-gradient(100% 70% at 50% 100%, rgba(180,50,20,0.4), transparent 70%)' }}
          />
        </>
      );
    default:
      return null;
  }
}

// ============================================================================
// Couche d'ambiance plein écran : flaques de lumière chaude/froide qui
// émergent du noir + particules par région. Tout est derrière le contenu.
// ============================================================================

const PARTICLE_COLORS: Record<ThemeId, [string, string]> = {
  monde: ['#ffb066', '#b9dcff'],
  braise: ['#ff7a32', '#ffb469'],
  givre: ['#dcefff', '#9fc4e8'],
  luciole: ['#ffe69a', '#c6d89a'],
  lys: ['#ff5c6e', '#ffd0c0'],
  cotes: ['#bfe0ff', '#c8b8ff'],
  pilier: ['#fff4d6', '#dfeaff'],
};

export function AmbianceLayer() {
  const { region, clock, worldSituations } = useGame();
  const { settings } = useSettings();
  const [pc1, pc2] = PARTICLE_COLORS[region.themeId];
  const particleScale = PARTICLE_SCALE[settings.particles];
  const glowOpacity = settings.glow ? 1 : 0;
  const darkness = darknessAt(clock.totalMinutes);
  const visual = worldSituations[region.id]?.visual;

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Fond de base */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 100% at 50% 0%, var(--bg-2), var(--bg) 70%)',
        }}
      />

      {/* Flaques de lumière chaude/froide — désactivables (réglages) */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          opacity: glowOpacity,
          background:
            'radial-gradient(60% 45% at 78% 8%, color-mix(in oklab, var(--glow-cold) 26%, transparent), transparent 60%)',
        }}
      />
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          opacity: glowOpacity,
          background:
            'radial-gradient(65% 50% at 18% 100%, color-mix(in oklab, var(--glow-warm) 28%, transparent), transparent 62%)',
        }}
      />

      {/* Trait vertical du Pilier d'Âmes — visible surtout dans son thème */}
      <motion.div
        className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2"
        animate={{ opacity: region.themeId === 'pilier' ? 0.7 : 0.12 }}
        transition={{ duration: 0.9 }}
        style={{
          width: 220,
          background:
            'linear-gradient(to top, transparent, color-mix(in oklab, var(--glow-cold) 30%, transparent) 30%, color-mix(in oklab, var(--accent) 40%, transparent) 70%, transparent)',
          maskImage:
            'radial-gradient(60% 100% at 50% 50%, #000 0%, transparent 75%)',
          WebkitMaskImage:
            'radial-gradient(60% 100% at 50% 50%, #000 0%, transparent 75%)',
          filter: 'blur(8px)',
        }}
      />

      {/* Voile jour/nuit — assombrit le monde la nuit, l'éclaire le jour */}
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: darkness * 0.62 }}
        transition={{ duration: 1.2 }}
        style={{
          background:
            'radial-gradient(120% 100% at 50% 30%, rgba(6,9,20,0.5), rgba(2,3,8,0.85))',
        }}
      />

      {/* Événement visuel du monde dans la région courante */}
      {visual && <WorldVisualFx visual={visual} />}

      {/* Particules — cross-fade au changement de région */}
      <AnimatePresence mode="sync">
        <motion.div
          key={region.themeId}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9 }}
        >
          <Particles kind={region.particle} color={pc1} color2={pc2} scale={particleScale} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
