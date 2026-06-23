import { useEffect, useRef } from 'react';
import type { ParticleKind } from '../../data';

// ============================================================================
// Couche de particules — canvas léger, un comportement par région.
// Optimisé : sprites de lueur pré-rendus (pas de shadowBlur par particule),
// DPR plafonné, densité réglable, pause quand l'onglet est masqué.
// ============================================================================

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  rot: number;
  vr: number;
  phase: number;
  freq: number;
  sub: 0 | 1;
}

interface ParticlesProps {
  kind: ParticleKind;
  color: string;
  color2: string;
  /** Multiplicateur de densité (réglages). 0 = aucune. */
  scale?: number;
}

const DENSITY: Record<ParticleKind, number> = {
  mixed: 54,
  embers: 64,
  snow: 70,
  fireflies: 40,
  petals: 42,
  sparks: 54,
  light: 62,
};

/** Sprite de lueur radiale pré-rendu (réutilisé par drawImage = peu coûteux). */
function makeGlowSprite(color: string): HTMLCanvasElement {
  const size = 32;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d')!;
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, color);
  grad.addColorStop(0.4, color);
  grad.addColorStop(1, 'transparent');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.fill();
  return c;
}

function spawn(kind: ParticleKind, w: number, h: number, fresh = false): Particle {
  const rnd = (a: number, b: number) => a + Math.random() * (b - a);
  const base: Particle = {
    x: rnd(0, w),
    y: rnd(0, h),
    vx: 0,
    vy: 0,
    r: 1.5,
    rot: rnd(0, Math.PI * 2),
    vr: rnd(-0.02, 0.02),
    phase: rnd(0, Math.PI * 2),
    freq: rnd(0.6, 1.6),
    sub: Math.random() > 0.5 ? 1 : 0,
  };

  switch (kind) {
    case 'embers':
      base.y = fresh ? rnd(h, h + 40) : base.y;
      base.vy = rnd(-0.55, -0.22);
      base.vx = rnd(-0.12, 0.12);
      base.r = rnd(0.8, 2.2);
      break;
    case 'snow':
      base.y = fresh ? rnd(-40, 0) : base.y;
      base.vy = rnd(0.18, 0.5);
      base.vx = rnd(-0.18, 0.18);
      base.r = rnd(0.9, 2.4);
      break;
    case 'fireflies':
      base.vy = rnd(-0.1, 0.1);
      base.vx = rnd(-0.1, 0.1);
      base.r = rnd(1.1, 2.2);
      break;
    case 'petals':
      base.y = fresh ? rnd(-40, 0) : base.y;
      base.vy = rnd(0.3, 0.7);
      base.vx = rnd(-0.4, 0.4);
      base.r = rnd(2.2, 4.2);
      base.vr = rnd(-0.05, 0.05);
      break;
    case 'sparks':
      base.vy = rnd(-0.3, 0.3);
      base.vx = rnd(-0.5, 0.5);
      base.r = rnd(0.6, 1.6);
      break;
    case 'light':
      base.x = w / 2 + rnd(-w * 0.28, w * 0.28);
      base.y = fresh ? rnd(h, h + 40) : base.y;
      base.vy = rnd(-0.7, -0.3);
      base.vx = rnd(-0.05, 0.05);
      base.r = rnd(0.8, 2.0);
      break;
    case 'mixed':
    default:
      if (base.sub === 1) {
        base.y = fresh ? rnd(h, h + 40) : base.y;
        base.vy = rnd(-0.45, -0.2);
        base.r = rnd(0.8, 2);
      } else {
        base.y = fresh ? rnd(-40, 0) : base.y;
        base.vy = rnd(0.16, 0.42);
        base.r = rnd(0.9, 2.2);
      }
      base.vx = rnd(-0.14, 0.14);
      break;
  }
  return base;
}

export function Particles({ kind, color, color2, scale = 1 }: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || scale <= 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let w = 0;
    let h = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let particles: Particle[] = [];
    let raf = 0;
    let t = 0;

    const sprite1 = makeGlowSprite(color);
    const sprite2 = makeGlowSprite(color2);

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      w = rect?.width ?? window.innerWidth;
      h = rect?.height ?? window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const init = () => {
      const n = Math.round((DENSITY[kind] ?? 50) * scale);
      particles = Array.from({ length: n }, () => spawn(kind, w, h));
    };

    resize();
    init();

    const draw = () => {
      t += 1;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;

        if (kind === 'snow' || kind === 'petals' || kind === 'mixed') {
          p.x += Math.sin(t * 0.01 * p.freq + p.phase) * 0.3;
        }
        if (kind === 'fireflies') {
          p.x += Math.sin(t * 0.012 * p.freq + p.phase) * 0.4;
          p.y += Math.cos(t * 0.009 * p.freq + p.phase) * 0.4;
        }
        if (kind === 'sparks') {
          p.x += Math.sin(t * 0.05 + p.phase) * 0.6;
        }

        const goesUp = p.vy < 0;
        if (goesUp && p.y < -10) Object.assign(p, spawn(kind, w, h, true));
        else if (!goesUp && p.y > h + 10) Object.assign(p, spawn(kind, w, h, true));
        if (p.x < -20) p.x = w + 18;
        else if (p.x > w + 20) p.x = -18;

        const pulse =
          kind === 'fireflies'
            ? 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t * 0.04 * p.freq + p.phase))
            : kind === 'embers' || kind === 'sparks' || kind === 'light'
              ? 0.55 + 0.45 * (0.5 + 0.5 * Math.sin(t * 0.06 + p.phase))
              : 0.7;

        ctx.globalAlpha = Math.max(0, Math.min(1, pulse)) * 0.85;

        if (kind === 'petals') {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.scale(1, 0.5);
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(0, 0, p.r, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else if (kind === 'sparks') {
          ctx.strokeStyle = color;
          ctx.lineWidth = p.r * 0.8;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.vx * 4, p.y - p.vy * 4);
          ctx.stroke();
        } else {
          const sprite = p.sub === 0 && kind === 'mixed' ? sprite2 : sprite1;
          const size = p.r * 6;
          ctx.drawImage(sprite, p.x - size / 2, p.y - size / 2, size, size);
        }
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
      raf = requestAnimationFrame(draw);
    };

    const start = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };
    const stop = () => {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    if (reduce) {
      draw();
      stop();
    } else {
      start();
    }

    // Pause quand l'onglet est masqué (économie CPU/GPU).
    const onVisibility = () => {
      if (document.hidden) stop();
      else if (!reduce) start();
    };
    const onResize = () => {
      resize();
      init();
    };
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('resize', onResize);
    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', onResize);
    };
  }, [kind, color, color2, scale]);

  if (scale <= 0) return null;
  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0" />;
}
