import { motion } from 'framer-motion';
import { BOSS_META, ENEMY_BY_ID, SUBLOCATIONS } from '../../data';
import { useGame } from '../../state/game';
import { Icon } from '../ui/Icon';
import { Seal } from '../ui/Seal';

// ============================================================================
// Carte de combat = PLAN LOCAL du LIEU RÉEL où se déroule l'affrontement.
// COHÉRENCE ABSOLUE : la carte reflète la RÉGION COURANTE (sa palette de thème,
// ses vrais lieux notables), jamais le territoire d'origine du boss. Les boss
// sont mobiles : ils voyagent et chassent, donc on les croise ICI, et le décor
// reste celui d'ici. Langage visuel commun avec la carte du monde.
// ============================================================================

// Plusieurs implantations possibles : on en choisit une selon la région, pour
// que deux zones ne se ressemblent jamais (forme du terrain + placement).
interface Layout {
  blob: string;
  you: [number, number];
  boss: [number, number];
  marks: [number, number][];
}

const LAYOUTS: Layout[] = [
  {
    blob: 'M50 8 C68 10 80 22 84 38 C88 54 84 70 72 82 C58 94 38 92 24 82 C12 72 10 54 16 38 C22 22 34 8 50 8 Z',
    you: [50, 86],
    boss: [54, 20],
    marks: [[28, 64], [72, 54], [46, 36]],
  },
  {
    blob: 'M30 12 C50 8 74 14 86 30 C94 44 88 62 74 76 C58 90 34 90 22 78 C10 66 12 46 20 32 C23 23 26 15 30 12 Z',
    you: [24, 80],
    boss: [78, 26],
    marks: [[44, 64], [62, 44], [40, 34]],
  },
  {
    blob: 'M50 6 C70 8 82 24 82 44 C82 64 72 82 50 90 C28 82 18 64 18 44 C18 24 30 8 50 6 Z',
    you: [50, 85],
    boss: [50, 20],
    marks: [[30, 60], [70, 58], [50, 40]],
  },
];

function pickLayout(seed: string): Layout {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return LAYOUTS[h % LAYOUTS.length];
}

export function ArenaView() {
  const { bossEncounter, endBoss, region, currentPlace } = useGame();
  if (!bossEncounter) return null;
  const e = ENEMY_BY_ID[bossEncounter];
  const meta = BOSS_META[bossEncounter];
  if (!e) return null;

  const L = pickLayout(region.id);
  // Les lieux notables RÉELS de la région courante (hors celui où l'on se tient).
  const subs = (SUBLOCATIONS[region.id] ?? []).filter((s) => s.name !== currentPlace);
  const marks = L.marks.map((pos, i) => ({ pos, sub: subs[i] })).filter((m) => m.sub);
  const route = `M${L.you[0]},${L.you[1]} ` + marks.map((m) => `L${m.pos[0]},${m.pos[1]}`).join(' ') + ` L${L.boss[0]},${L.boss[1]}`;

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-display text-xs uppercase tracking-[0.28em]" style={{ color: 'var(--accent)' }}>
          <Icon name="map" size={14} />
          Plan du lieu
        </h2>
        <button
          onClick={endBoss}
          className="rounded-md border border-ink/70 px-2 py-1 text-[0.6rem] uppercase tracking-wider text-text-dim transition-colors hover:border-gold/50 hover:text-text"
        >
          Quitter le combat
        </button>
      </div>

      {/* Le plan — palette de la RÉGION COURANTE (tokens de thème) */}
      <motion.div
        className="panel parchment relative overflow-hidden rounded-lg"
        style={{ aspectRatio: '1 / 1', borderColor: 'color-mix(in oklab, var(--seal) 40%, var(--ink))' }}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          <defs>
            <radialGradient id="arena-land" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="color-mix(in oklab, var(--gold) 12%, transparent)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <radialGradient id="arena-threat" cx="50%" cy="50%" r="55%">
              <stop offset="0%" stopColor="color-mix(in oklab, var(--seal) 30%, transparent)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>

          {/* Terrain local — lavis d'encre stylisé (comme la carte du monde) */}
          <path
            d={L.blob}
            fill="url(#arena-land)"
            stroke="color-mix(in oklab, var(--gold) 22%, transparent)"
            strokeWidth="0.5"
          />
          {/* Halo de danger autour du fléau */}
          <circle cx={L.boss[0]} cy={L.boss[1]} r="34" fill="url(#arena-threat)" />

          {/* Chemin du héros vers le fléau, jalonné par les lieux du coin */}
          <path d={route} fill="none" stroke="color-mix(in oklab, var(--accent) 45%, transparent)" strokeWidth="0.5" strokeDasharray="1.6 2" strokeLinecap="round" />

          {/* Lieux notables RÉELS — losanges (comme les POI de la carte) */}
          {marks.map((m, i) => (
            <rect
              key={i}
              x={m.pos[0] - 2}
              y={m.pos[1] - 2}
              width="4"
              height="4"
              transform={`rotate(45 ${m.pos[0]} ${m.pos[1]})`}
              rx="0.6"
              fill="color-mix(in oklab, var(--gold) 45%, transparent)"
              stroke="color-mix(in oklab, var(--accent) 55%, transparent)"
              strokeWidth="0.4"
            />
          ))}

          {/* « Tu es ici » — anneau pulsé doré */}
          <motion.circle
            cx={L.you[0]}
            cy={L.you[1]}
            r="3"
            fill="none"
            stroke="color-mix(in oklab, var(--gold) 75%, transparent)"
            strokeWidth="0.5"
            animate={{ r: [3, 6], opacity: [0.8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
          />
          <circle cx={L.you[0]} cy={L.you[1]} r="1.7" fill="var(--gold)" />

          {/* Le fléau — losange de danger pulsé */}
          <motion.rect
            x={L.boss[0] - 2.6}
            y={L.boss[1] - 2.6}
            width="5.2"
            height="5.2"
            transform={`rotate(45 ${L.boss[0]} ${L.boss[1]})`}
            rx="0.8"
            fill="var(--seal)"
            animate={{ opacity: [1, 0.45, 1] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            style={{ filter: 'drop-shadow(0 0 3px var(--seal))' }}
          />
        </svg>

        {/* Étiquettes HTML par-dessus le SVG (lisibilité nette) */}
        {marks.map((m, i) => (
          <span
            key={i}
            className="pointer-events-none absolute -translate-x-1/2 whitespace-nowrap text-[0.56rem] tracking-wide text-text-dim/85"
            style={{ left: `${m.pos[0]}%`, top: `calc(${m.pos[1]}% + 3.5%)` }}
          >
            {m.sub!.name}
          </span>
        ))}
        <span
          className="pointer-events-none absolute -translate-x-1/2 whitespace-nowrap font-heading text-[0.6rem] tracking-wide"
          style={{ left: `${L.you[0]}%`, top: `calc(${L.you[1]}% - 7%)`, color: 'var(--gold)' }}
        >
          {currentPlace ?? 'Tu es ici'}
        </span>
        <span
          className="pointer-events-none absolute flex -translate-x-1/2 items-center gap-1 whitespace-nowrap font-heading text-[0.62rem] tracking-wide"
          style={{ left: `${L.boss[0]}%`, top: `calc(${L.boss[1]}% - 8%)`, color: 'var(--seal)' }}
        >
          <Icon name="skull" size={10} /> {e.name}
        </span>

        {/* Cartouche du lieu — la RÉGION courante */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-3 text-center">
          <div className="font-heading text-sm" style={{ color: 'var(--accent)' }}>
            {region.name}
            {currentPlace ? <span className="text-text-dim"> · {currentPlace}</span> : null}
          </div>
          <div className="text-[0.56rem] uppercase tracking-[0.22em] text-text-dim">vue du dessus · le combat se joue ici</div>
        </div>
      </motion.div>

      {/* Le fléau — fiche (nom · épithète · capacité perturbatrice) */}
      <div className="panel rounded-lg p-3">
        <div className="flex items-center gap-2">
          <Seal char="凶" size={28} />
          <div className="min-w-0">
            <div className="font-heading text-sm text-text">{e.name}</div>
            <div className="truncate text-[0.66rem] italic" style={{ color: 'var(--seal)' }}>
              {e.epithet}
            </div>
          </div>
        </div>
        {meta && (
          <div
            className="mt-2.5 rounded-md border p-2"
            style={{ borderColor: 'color-mix(in oklab, var(--seal) 30%, var(--ink))', background: 'color-mix(in oklab, var(--seal) 6%, transparent)' }}
          >
            <div className="text-[0.55rem] uppercase tracking-[0.2em]" style={{ color: 'var(--seal)' }}>
              Capacité
            </div>
            <p className="mt-0.5 text-[0.78rem] leading-snug text-text/85">Il {meta.power}.</p>
          </div>
        )}
      </div>
    </section>
  );
}
