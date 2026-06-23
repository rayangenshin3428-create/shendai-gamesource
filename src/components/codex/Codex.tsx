import { useMemo, useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import {
  BESTIARY,
  CHARACTERS,
  ENEMIES,
  FACTIONS,
  ITEMS,
  LEXICON,
  RARITY_META,
  REGIONS,
  VOIES,
  type Alignment,
  type CodexTab,
} from '../../data';
import type { CodexKind } from '../../data/events';
import { useGame } from '../../state/game';
import { Icon, type IconName } from '../ui/Icon';
import { Overlay } from '../ui/Overlay';
import { Seal } from '../ui/Seal';

// ============================================================================
// Encyclopédie / Codex — overlay plein écran.
// Onglets · sous-filtres · recherche · états découvert/verrouillé ·
// traitement distinct des ennemis & boss.
// ============================================================================

const TABS: { id: CodexTab; label: string; icon: IconName }[] = [
  { id: 'personnages', label: 'Personnages', icon: 'person' },
  { id: 'objets', label: 'Objets', icon: 'gem' },
  { id: 'lieux', label: 'Lieux', icon: 'map' },
  { id: 'factions', label: 'Factions', icon: 'pillar' },
  { id: 'bestiaire', label: 'Bestiaire', icon: 'eye' },
  { id: 'ennemis', label: 'Ennemis', icon: 'skull' },
  { id: 'lexique', label: 'Lexique', icon: 'book' },
];

const ALIGN_FILTERS: { id: Alignment | 'tous'; label: string }[] = [
  { id: 'tous', label: 'Tous' },
  { id: 'allié', label: 'Alliés' },
  { id: 'ennemi', label: 'Ennemis' },
  { id: 'neutre', label: 'Neutres' },
];

/** Carte verrouillée (entrée non découverte). */
function LockedCard() {
  return (
    <div className="panel grid aspect-[4/3] place-items-center rounded-lg opacity-70">
      <div className="text-center text-text-dim">
        <Icon name="lock" size={20} className="mx-auto text-text-dim/60" />
        <div className="mt-2 font-display text-2xl tracking-widest">???</div>
        <div className="mt-1 text-[0.6rem] uppercase tracking-[0.2em]">Non découvert</div>
      </div>
    </div>
  );
}

function CardShell({
  title,
  subtitle,
  accent,
  onClick,
  children,
  enemy,
}: {
  title: string;
  subtitle?: string;
  accent?: string;
  onClick?: () => void;
  children?: ReactNode;
  enemy?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`panel group relative flex flex-col rounded-lg p-4 text-left transition-all hover:-translate-y-0.5 ${
        enemy ? 'threat-frame' : ''
      }`}
      style={
        enemy
          ? {
              borderColor: 'color-mix(in oklab, var(--seal) 40%, var(--ink))',
              background:
                'linear-gradient(180deg, color-mix(in oklab, #1a0708 80%, transparent), color-mix(in oklab, var(--bg) 92%, transparent))',
            }
          : undefined
      }
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-heading text-base font-semibold text-text">{title}</h3>
          {subtitle && (
            <p className="text-[0.7rem] italic" style={{ color: accent ?? 'var(--accent)' }}>
              {subtitle}
            </p>
          )}
        </div>
        {enemy && <Seal char="凶" size={30} />}
      </div>
      {children}
      <span className="mt-auto pt-3 text-[0.62rem] uppercase tracking-[0.18em] text-text-dim/70 opacity-0 transition-opacity group-hover:opacity-100">
        Consulter →
      </span>
    </button>
  );
}

function VoieTag({ voie }: { voie?: string }) {
  if (!voie) return null;
  return (
    <span className="rounded-full border border-gold/30 px-2 py-0.5 text-[0.6rem] uppercase tracking-wider text-text-dim">
      Voie {voie}
    </span>
  );
}

export function Codex() {
  const { codexOpen, codexTab, openCodex, closeCodex, isDiscovered } = useGame();
  const [query, setQuery] = useState('');
  const [align, setAlign] = useState<Alignment | 'tous'>('tous');
  const [selected, setSelected] = useState<string | null>(null);

  const tab = codexTab;
  const q = query.trim().toLowerCase();

  const match = (s: string) => !q || s.toLowerCase().includes(q);

  // -- Contenu de l'onglet courant -------------------------------------------
  const content = useMemo(() => {
    switch (tab) {
      case 'personnages':
        return CHARACTERS.filter((c) => (align === 'tous' ? true : c.alignment === align)).filter(
          (c) => (isDiscovered('character', c.id) ? match(c.name) || match(c.epithet) : !q),
        );
      case 'objets':
        return ITEMS.filter((i) => (isDiscovered('item', i.id) ? match(i.name) : !q));
      case 'lieux':
        return REGIONS.filter((r) => (isDiscovered('region', r.id) ? match(r.name) : !q));
      case 'factions':
        return FACTIONS.filter((f) => (isDiscovered('faction', f.id) ? match(f.name) : !q));
      case 'bestiaire':
        return BESTIARY.filter((b) => (isDiscovered('beast', b.id) ? match(b.name) : !q));
      case 'ennemis':
        return ENEMIES.filter((e) =>
          isDiscovered('enemy', e.id) ? match(e.name) || match(e.epithet) : !q,
        );
      case 'lexique':
        return LEXICON.filter((l) => match(l.term));
      default:
        return [];
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, align, q, isDiscovered]);

  const selectTab = (id: CodexTab) => {
    openCodex(id);
    setSelected(null);
    setQuery('');
    setAlign('tous');
  };

  return (
    <Overlay open={codexOpen} onClose={closeCodex} label="Codex de Shendaï" maxWidth={1280}>
      <div className="flex h-[84vh] flex-col sm:flex-row">
        {/* Rail d'onglets */}
        <nav className="flex shrink-0 gap-1 overflow-x-auto border-b border-ink/60 bg-surface/40 p-2 sm:w-52 sm:flex-col sm:overflow-visible sm:border-b-0 sm:border-r sm:p-3">
          <div className="hidden px-2 pb-3 sm:block">
            <div className="flex items-center gap-2">
              <Icon name="book" size={18} className="text-gold" />
              <span className="font-display text-sm tracking-[0.2em] text-text">CODEX</span>
            </div>
          </div>
          {TABS.map((t) => {
            const active = t.id === tab;
            return (
              <button
                key={t.id}
                onClick={() => selectTab(t.id)}
                className={`flex shrink-0 items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors ${
                  active
                    ? 'bg-gold/10 text-text'
                    : 'text-text-dim hover:bg-surface-2/50 hover:text-text'
                }`}
                style={active ? { boxShadow: 'inset 2px 0 0 var(--gold)' } : undefined}
              >
                <Icon name={t.icon} size={16} style={{ color: active ? 'var(--gold)' : undefined }} />
                <span className="font-heading tracking-wide">{t.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Corps */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Barre : recherche + sous-filtres (pr pour dégager la croix) */}
          <div className="flex flex-col gap-3 border-b border-ink/50 p-4 pr-16">
            <div className="relative">
              <Icon
                name="search"
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-dim"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Chercher dans le Codex…"
                className="w-full rounded-md border border-ink/70 bg-bg/50 py-2 pl-9 pr-3 text-sm text-text placeholder:text-text-dim/70 focus:border-gold/50 focus:outline-none"
              />
            </div>
            {tab === 'personnages' && (
              <div className="flex flex-wrap gap-2">
                {ALIGN_FILTERS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setAlign(f.id)}
                    className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                      align === f.id
                        ? 'border-gold/60 bg-gold/10 text-text'
                        : 'border-ink/70 text-text-dim hover:text-text'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Grille / détail — pas d'AnimatePresence bloquant : le contenu
              ne peut jamais être masqué par une animation de sortie figée. */}
          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            {selected ? (
                <motion.div
                  key={`detail-${selected}`}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <CodexDetail tab={tab} id={selected} onBack={() => setSelected(null)} />
                </motion.div>
              ) : (
                <motion.div
                  key={`grid-${tab}-${align}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {tab === 'lexique' ? (
                    <dl className="grid gap-3 sm:grid-cols-2">
                      {LEXICON.filter((l) => match(l.term)).map((l) => (
                        <div key={l.term} className="panel rounded-lg p-4">
                          <dt className="font-heading text-base font-semibold" style={{ color: 'var(--accent)' }}>
                            {l.term}
                          </dt>
                          <dd className="mt-1 text-sm leading-relaxed text-text/80">{l.definition}</dd>
                        </div>
                      ))}
                      <div className="panel rounded-lg p-4 sm:col-span-2">
                        <dt className="mb-2 font-display text-xs uppercase tracking-[0.2em] text-text-dim">
                          Les cinq Voies
                        </dt>
                        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                          {VOIES.map((v) => (
                            <div key={v.voie} className="rounded-md border border-ink/60 p-2.5">
                              <div className="font-heading text-sm text-text">{v.voie}</div>
                              <div className="text-[0.7rem] text-text-dim">{v.nature}</div>
                              <div className="mt-1 text-[0.66rem] italic text-text-dim/70">{v.faction}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </dl>
                  ) : content.length === 0 ? (
                    <div className="grid h-40 place-items-center text-text-dim">
                      <span className="italic">Rien ne répond à ta recherche.</span>
                    </div>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {renderGrid(tab, content, setSelected, isDiscovered)}
                    </div>
                  )}
                </motion.div>
              )}
          </div>
        </div>
      </div>
    </Overlay>
  );
}

// --- Rendu de la grille selon l'onglet -------------------------------------
function renderGrid(
  tab: CodexTab,
  content: unknown[],
  select: (id: string) => void,
  isDiscovered: (kind: CodexKind, id: string) => boolean,
) {
  if (tab === 'personnages') {
    return (CHARACTERS.filter((c) => content.includes(c))).map((c) =>
      !isDiscovered('character', c.id) ? (
        <LockedCard key={c.id} />
      ) : (
        <CardShell
          key={c.id}
          title={c.name}
          subtitle={`« ${c.epithet} »`}
          onClick={() => select(c.id)}
        >
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-text/75">{c.blurb}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <VoieTag voie={c.voie} />
          </div>
        </CardShell>
      ),
    );
  }
  if (tab === 'ennemis') {
    return (ENEMIES.filter((e) => content.includes(e))).map((e) =>
      !isDiscovered('enemy', e.id) ? (
        <LockedCard key={e.id} />
      ) : (
        <CardShell
          key={e.id}
          title={e.name}
          subtitle={e.epithet}
          accent="var(--seal)"
          enemy
          onClick={() => select(e.id)}
        >
          <p className="mt-2 line-clamp-2 text-[0.8rem] italic leading-relaxed text-text-dim">
            « {e.rumor} »
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <VoieTag voie={e.voie} />
            {e.apex && (
              <span className="rounded-full border border-seal/50 px-2 py-0.5 text-[0.6rem] uppercase tracking-wider text-seal">
                Fléau majeur
              </span>
            )}
          </div>
        </CardShell>
      ),
    );
  }
  if (tab === 'objets') {
    return (ITEMS.filter((i) => content.includes(i))).map((i) =>
      !isDiscovered('item', i.id) ? (
        <LockedCard key={i.id} />
      ) : (
        <CardShell
          key={i.id}
          title={i.name}
          subtitle={RARITY_META[i.rarity].label}
          accent={RARITY_META[i.rarity].color}
          onClick={() => select(i.id)}
        >
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-text/75">{i.effect}</p>
        </CardShell>
      ),
    );
  }
  if (tab === 'lieux') {
    return (REGIONS.filter((r) => content.includes(r))).map((r) => (
      <CardShell key={r.id} title={r.name} subtitle={r.subtitle} onClick={() => select(r.id)}>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-text/75">{r.summary}</p>
      </CardShell>
    ));
  }
  if (tab === 'factions') {
    return (FACTIONS.filter((f) => content.includes(f))).map((f) =>
      !isDiscovered('faction', f.id) ? (
        <LockedCard key={f.id} />
      ) : (
        <CardShell key={f.id} title={f.name} subtitle={`Voie ${f.voie}`} onClick={() => select(f.id)}>
          <p className="mt-2 text-sm leading-relaxed text-text/75">{f.wants}</p>
        </CardShell>
      ),
    );
  }
  if (tab === 'bestiaire') {
    return (BESTIARY.filter((b) => content.includes(b))).map((b) =>
      !isDiscovered('beast', b.id) ? (
        <LockedCard key={b.id} />
      ) : (
        <CardShell key={b.id} title={b.name} subtitle={b.threat} onClick={() => select(b.id)}>
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-text/75">{b.description}</p>
        </CardShell>
      ),
    );
  }
  return null;
}

// --- Détail d'une entrée ----------------------------------------------------
function DetailShell({
  title,
  subtitle,
  accent,
  onBack,
  children,
}: {
  title: string;
  subtitle?: string;
  accent?: string;
  onBack: () => void;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-2xl">
      <button
        onClick={onBack}
        className="mb-4 flex items-center gap-1.5 text-xs uppercase tracking-[0.18em] text-text-dim transition-colors hover:text-text"
      >
        <Icon name="chevron" size={14} className="rotate-180" /> Retour
      </button>
      <h2 className="font-display text-2xl tracking-wide text-text">{title}</h2>
      {subtitle && (
        <p className="mt-1 font-heading text-base italic" style={{ color: accent ?? 'var(--accent)' }}>
          {subtitle}
        </p>
      )}
      <div className="mt-5 space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div className="mb-1 text-[0.6rem] uppercase tracking-[0.2em] text-text-dim">{label}</div>
      <p className="text-sm leading-relaxed text-text/85">{children}</p>
    </div>
  );
}

function CodexDetail({ tab, id, onBack }: { tab: CodexTab; id: string; onBack: () => void }) {
  if (tab === 'personnages') {
    const c = CHARACTERS.find((x) => x.id === id)!;
    return (
      <DetailShell title={c.name} subtitle={`« ${c.epithet} »`} onBack={onBack}>
        <div className="flex flex-wrap gap-2">
          <VoieTag voie={c.voie} />
          {c.palier && (
            <span className="rounded-full border border-gold/30 px-2 py-0.5 text-[0.6rem] uppercase tracking-wider text-text-dim">
              {c.palier}
            </span>
          )}
          {c.faction && (
            <span className="rounded-full border border-ink/70 px-2 py-0.5 text-[0.6rem] uppercase tracking-wider text-text-dim">
              {c.faction}
            </span>
          )}
        </div>
        <Field label="En bref">{c.blurb}</Field>
        {c.appearance && <Field label="Apparence">{c.appearance}</Field>}
        {c.voice && <Field label="Manière de parler">{c.voice}</Field>}
        <Field label="Histoire">{c.detail}</Field>
        {c.goal && <Field label="Objectif">{c.goal}</Field>}
        {c.flaw && <Field label="Défaut">{c.flaw}</Field>}
      </DetailShell>
    );
  }
  if (tab === 'ennemis') {
    const e = ENEMIES.find((x) => x.id === id)!;
    return (
      <DetailShell title={e.name} subtitle={e.epithet} accent="var(--seal)" onBack={onBack}>
        <div className="flex items-center gap-3">
          <Seal char="凶" size={40} />
          <p className="flex-1 border-l-2 border-seal/40 pl-3 text-sm italic leading-relaxed text-text-dim">
            « {e.rumor} »
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <VoieTag voie={e.voie} />
          {e.palier && (
            <span className="rounded-full border border-seal/40 px-2 py-0.5 text-[0.6rem] uppercase tracking-wider text-seal">
              {e.palier}
            </span>
          )}
          {e.apex && (
            <span className="rounded-full border border-seal/50 px-2 py-0.5 text-[0.6rem] uppercase tracking-wider text-seal">
              Fléau majeur
            </span>
          )}
        </div>
        <Field label="Identité">{e.identity}</Field>
        <Field label="Histoire">{e.history}</Field>
        <div
          className="rounded-lg border p-4"
          style={{
            borderColor: 'color-mix(in oklab, var(--seal) 45%, var(--ink))',
            background: 'color-mix(in oklab, var(--seal) 8%, transparent)',
          }}
        >
          <div className="mb-1 flex items-center gap-2 text-[0.6rem] uppercase tracking-[0.2em] text-seal">
            <Icon name="skull" size={13} /> Forme dévoilée
          </div>
          <p className="text-sm leading-relaxed text-text/90">{e.revealedForm}</p>
        </div>
      </DetailShell>
    );
  }
  if (tab === 'objets') {
    const i = ITEMS.find((x) => x.id === id)!;
    const r = RARITY_META[i.rarity];
    return (
      <DetailShell title={i.name} subtitle={r.label} accent={r.color} onBack={onBack}>
        <Field label="Effet">{i.effect}</Field>
        {i.owner && <Field label="Porteur">{i.owner}</Field>}
      </DetailShell>
    );
  }
  if (tab === 'lieux') {
    const r = REGIONS.find((x) => x.id === id)!;
    return (
      <DetailShell title={r.name} subtitle={r.subtitle} onBack={onBack}>
        {r.faction && <Field label="Faction">{r.faction}</Field>}
        <Field label="Description">{r.summary}</Field>
        {r.culture && <Field label="Culture">{r.culture}</Field>}
        {r.cities && r.cities.length > 0 && (
          <Field label="Cités">{r.cities.join(' · ')}</Field>
        )}
      </DetailShell>
    );
  }
  if (tab === 'factions') {
    const f = FACTIONS.find((x) => x.id === id)!;
    return (
      <DetailShell title={f.name} subtitle={`Voie ${f.voie}`} onBack={onBack}>
        {f.history && <Field label="Histoire">{f.history}</Field>}
        <Field label="Ce qu'elle veut">{f.wants}</Field>
        <Field label="Rapport au héros">{f.stanceOnHero}</Field>
      </DetailShell>
    );
  }
  if (tab === 'bestiaire') {
    const b = BESTIARY.find((x) => x.id === id)!;
    return (
      <DetailShell title={b.name} subtitle={b.threat} onBack={onBack}>
        <Field label="Description">{b.description}</Field>
      </DetailShell>
    );
  }
  return null;
}
