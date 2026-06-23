import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CHARACTERS, ENEMIES, ITEMS } from '../../data';
import { useGame } from '../../state/game';
import { Seal } from '../ui/Seal';

// ============================================================================
// Épilogue de fin de partie (mort définitive). Résume l'aventure à partir de
// l'état réel : où le héros est tombé, ce qu'il a accompli, ce qu'il a laissé
// inachevé, le sort des proches rencontrés, et un monde qui continue sans lui.
// Puis : nouvelle partie (retour à l'écran d'accueil).
// ============================================================================

const FATES: Record<string, string> = {
  ren: 'Maître Ren — s’il a survécu à cette nuit — retournera à son silence, un vieux poing de plus que le monde a oublié.',
  aylin: 'Aylin ajoutera ta perte à ses morts ; une vengeance de plus à porter dans son carquois, jusqu’au bout des Steppes.',
  shulan: 'Shulan apprendra ta fin par les lanternes du Lys, et priera en cachette pour une âme qu’elle n’a pas su sauver.',
  yanhong: 'Yánhóng pleurera, peut-être, le Foudroyé qui aurait pu refermer la Fêlure — puis se mettra en quête d’un autre instrument.',
  kaien: 'Kaïen gardera la marque de ton éclair et le souvenir gênant d’un égal — un doute de plus, planté contre l’Empire de son père.',
  suiye: 'Et dans l’orage, une silhouette ailée se détourne, sans qu’on sache jamais si elle a veillé sur toi ou simplement jugé.',
};

function Para({ children, delay }: { children: ReactNode; delay: number }) {
  return (
    <motion.p
      className="text-[0.98rem] leading-relaxed text-[#b8b0a0]"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay }}
    >
      {children}
    </motion.p>
  );
}

export function EpilogueScreen() {
  const { gameOver, hero, region, currentPlace, clock, isDiscovered } = useGame();

  const met = CHARACTERS.filter((c) => isDiscovered('character', c.id));
  const fleaux = ENEMIES.filter((e) => isDiscovered('enemy', e.id)).length;
  const items = ITEMS.filter((i) => isDiscovered('item', i.id)).length;

  return (
    <AnimatePresence>
      {gameOver && (
        <motion.div
          className="fixed inset-0 z-[110] grid place-items-center overflow-y-auto bg-[#060608] p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
        >
          <div className="my-auto w-full max-w-2xl py-10 text-center">
            <motion.div
              className="mx-auto mb-6 w-fit"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <Seal char="終" size={56} title="Fin" />
            </motion.div>

            <motion.h2
              className="font-display text-3xl tracking-[0.18em] text-[#e9dfc7]"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              ÉPILOGUE
            </motion.h2>
            <motion.p
              className="mt-2 font-heading text-base italic text-[#8a8474]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              Ici s’achève l’histoire de {hero.name}, « {hero.epithet} ».
            </motion.p>

            <div className="mx-auto mt-8 max-w-xl space-y-4 text-left">
              <Para delay={0.9}>
                Tu es tombé à <span className="text-[#d9c79a]">{region.name}</span>
                {currentPlace ? `, ${currentPlace}` : ''}, au <span className="text-[#d9c79a]">Jour {clock.day}</span>,
                au palier {hero.palier}. La foudre que tu portais — la tienne, à toi seul — s’éteint
                avec toi.
              </Para>

              <Para delay={1.3}>
                En chemin, tu as croisé {met.length} âme{met.length > 1 ? 's' : ''}, entrevu {fleaux}{' '}
                fléau{fleaux > 1 ? 'x' : ''}, et arraché {items} secret{items > 1 ? 's' : ''} à
                l’ombre pour ton Codex. Ce n’était pas rien — ce n’était pas assez.
              </Para>

              <Para delay={1.7}>
                Le ciel, lui, reste fendu. Tiānhuo n’a pas été arrêté ; la Fêlure n’a pas été
                refermée. Ce que tu n’as pas accompli, d’autres devront le porter — ou y renoncer.
              </Para>

              {met.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 2.1 }}
                  className="space-y-2 border-l-2 border-[#bda063]/30 pl-4"
                >
                  <div className="text-[0.6rem] uppercase tracking-[0.22em] text-[#7a7468]">
                    Ceux que tu laisses derrière
                  </div>
                  {met.map((c) =>
                    FATES[c.id] ? (
                      <p key={c.id} className="text-[0.9rem] leading-relaxed text-[#a89f8e]">
                        {FATES[c.id]}
                      </p>
                    ) : null,
                  )}
                </motion.div>
              )}

              <Para delay={2.5}>
                Sans Foudroyé à siphonner, l’Empire de Braise poursuit sa conquête ; le Lys Rouge
                rallume ses lanternes ; les Clans pleurent et chevauchent ; le Cloître referme ses
                cimes. Le monde n’a pas remarqué ta chute.
              </Para>

              <Para delay={2.9}>
                Le Pilier d’Âmes luit toujours, indifférent. Une luciole de plus s’élève vers lui,
                lente, dans le silence — puis le monde, déjà, continue.
              </Para>
            </div>

            <motion.button
              onClick={() => window.location.reload()}
              className="mt-10 rounded-md border px-10 py-3 font-display text-base tracking-[0.26em] text-[#f0e7d4] transition-colors hover:bg-[#bda063]/10"
              style={{ borderColor: 'color-mix(in oklab, #bda063 55%, transparent)' }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 3.4 }}
            >
              NOUVELLE PARTIE
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
