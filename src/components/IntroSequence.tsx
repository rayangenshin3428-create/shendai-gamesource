import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGame } from '../state/game';
import { Icon, type IconName } from './ui/Icon';

// ============================================================================
// Introduction immersive — présente l'univers, le pouvoir, le danger et le
// contexte du héros avant le début du roleplay. Plonge le joueur d'emblée.
// ============================================================================

interface Beat {
  glyph: string;
  icon: IconName;
  title: string;
  body: string;
}

const BEATS: Beat[] = [
  {
    glyph: '柱',
    icon: 'pillar',
    title: 'Le Ciel Fendu',
    body: 'Le ciel était entier, autrefois. Puis il s’est déchiré — la Grande Fêlure — et la puissance des dieux morts s’est déversée sur le monde comme une pluie de poison et de feu. Depuis, le Pilier d’Âmes transperce Shendaï, de la terre aux nuages.',
  },
  {
    glyph: '雷',
    icon: 'bolt',
    title: 'La Volte d’Âme',
    body: 'La plupart ne touchent qu’un écho de cette puissance, le Souffle. Toi, tu es un Foudroyé : ton âme est un conduit vivant qui accumule la foudre première, puis la décharge. Charge ta réserve, dose tes frappes — et ne déborde jamais ta Capacité, ou la surtension te consumera.',
  },
  {
    glyph: '凶',
    icon: 'skull',
    title: 'La mort est réelle',
    body: 'Ici, la puissance se paie et la mort ne pardonne pas. PNJ comme toi peuvent mourir. Le danger d’une scène est toujours annoncé — calme, tendu, mortel. Quand il devient mortel, il l’est vraiment.',
  },
  {
    glyph: '炎',
    icon: 'flame',
    title: 'Quatre cours, un jour',
    body: 'Un empire de feu, un ordre funéraire, des clans libres, un cloître glacé. Le jour où ces puissances apprendront ce que tu es, l’une voudra te consumer, l’autre t’exploiter, une autre t’armer, la dernière te juger. Mais ce jour n’est pas encore venu : pour l’heure, aucune ne te connaît. Ta légende — ou ta condamnation — reste à écrire.',
  },
  {
    glyph: '神',
    icon: 'travel',
    title: 'Cette nuit',
    body: 'Tu as dix-huit ans ce soir, à Léïsha, un bourg de boue et de sel battu par les orages. Personne ne l’a fêté. Et dans l’ombre, des torches franchissent déjà la digue — pas pour toi : tu n’es encore personne. Voyage par la carte, agis ou réponds librement dans le récit, consulte ton Codex. Le monde t’attend.',
  },
];

export function IntroSequence() {
  const { phase, startPlay } = useGame();
  const [i, setI] = useState(0);
  const beat = BEATS[i];
  const last = i === BEATS.length - 1;

  const next = () => {
    if (last) startPlay();
    else setI((n) => n + 1);
  };

  return (
    <AnimatePresence>
      {phase === 'intro' && (
        <motion.div
          className="fixed inset-0 z-[95] grid place-items-center overflow-hidden bg-[#070709] px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(110% 90% at 50% 30%, color-mix(in oklab, var(--glow-warm) 8%, transparent), transparent 60%)',
            }}
          />

          <div className="relative z-10 w-full max-w-xl text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.5 }}
              >
                <div
                  className="mx-auto grid size-20 place-items-center rounded-full"
                  style={{
                    border: '1px solid color-mix(in oklab, var(--gold) 40%, transparent)',
                    background: 'color-mix(in oklab, var(--gold) 7%, transparent)',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-brush)', fontSize: 38, color: 'var(--gold)' }}>
                    {beat.glyph}
                  </span>
                </div>
                <h2 className="mt-6 flex items-center justify-center gap-2 font-display text-2xl tracking-[0.16em] text-[#ece4d2] sm:text-3xl">
                  <Icon name={beat.icon} size={18} className="text-gold/70" />
                  {beat.title}
                </h2>
                <p className="mx-auto mt-5 max-w-lg text-[1.02rem] leading-relaxed text-[#b8b0a0]">
                  {beat.body}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Progression */}
            <div className="mt-9 flex items-center justify-center gap-2">
              {BEATS.map((_, k) => (
                <span
                  key={k}
                  className="h-1 rounded-full transition-all"
                  style={{
                    width: k === i ? 22 : 7,
                    background: k <= i ? 'var(--gold)' : 'color-mix(in oklab, var(--ink) 80%, transparent)',
                  }}
                />
              ))}
            </div>

            <div className="mt-8 flex items-center justify-center gap-4">
              {!last && (
                <button
                  onClick={startPlay}
                  className="text-xs uppercase tracking-[0.2em] text-[#6f685b] transition-colors hover:text-[#9a9180]"
                >
                  Passer
                </button>
              )}
              <button
                onClick={next}
                className="rounded-md border px-8 py-2.5 font-display text-sm tracking-[0.24em] text-[#f0e7d4] transition-colors hover:bg-gold/10"
                style={{ borderColor: 'color-mix(in oklab, #bda063 55%, transparent)' }}
              >
                {last ? 'ENTRER DANS SHENDAÏ' : 'CONTINUER'}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
