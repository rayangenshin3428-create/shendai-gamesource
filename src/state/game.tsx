import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  BEAST_BY_ID,
  BOSS_META,
  CHARACTER_BY_ID,
  ENEMY_BY_ID,
  FACTION_BY_ID,
  HERO,
  ITEM_BY_ID,
  REGION_BY_ID,
  REGIONS,
  STARTING_REGION_ID,
  SUBLOCATIONS,
  WORLD_SITUATIONS,
  type CodexTab,
  type HeroState,
  type Region,
  type ThreatLevel,
  type WorldVisual,
} from '../data';
import type { CodexKind, EventEffect, GameEvent } from '../data/events';
import type { Choice, NarrativeEffect, NarrativeMessage } from '../narrative/types';
import { createEngine } from '../narrative/engine';
import {
  clockFromMinutes,
  formatDuration,
  formatJournalLong,
  MINUTES_PER_DAY,
  type Clock,
} from '../systems/time';
import { planTravel, rollTravelEvent } from '../systems/travel';
import { applyStatDelta, CONSUMABLE_EFFECTS, isConsumable } from '../systems/inventory';

// ============================================================================
// STORE central — l'orchestrateur du RPG narratif.
// Tout ce que le joueur fait (agir, voyager, se déplacer en ville, fouiller un
// événement) passe par le MÊME journal de narration. La logique pure vit dans
// src/systems/* ; le contenu dans src/data/*. Ce fichier les relie à React.
// ============================================================================

export type GamePhase = 'launch' | 'intro' | 'playing';

/** Transition narrative plein écran (changement de région, défaite, victoire…). */
export interface Interlude {
  id: number;
  kind: 'region' | 'chapter' | 'victory' | 'defeat' | 'discovery';
  title: string;
  subtitle?: string;
  lines: string[];
  /** Estampille de date — « Jour 14 — les Cendres, an 742 ». */
  stamp?: string;
  /** Libellé du bouton de sortie (défaut : « Continuer »). */
  cta?: string;
}

interface GameContextValue {
  phase: GamePhase;
  startIntro: () => void;
  startPlay: () => void;

  region: Region;
  /** Lieu précis dans la région (sous-lieu), ou null = aux abords. */
  currentPlace: string | null;
  travelTo: (regionId: string) => void; // instantané (effets de récit)
  /** Situations en cours dans les régions (monde vivant). */
  worldSituations: Record<string, { label: string; desc: string; sinceDay: number; visual?: WorldVisual }>;

  threat: ThreatLevel;
  setThreat: (t: ThreatLevel) => void;

  hero: HeroState;
  updateHero: (patch: Partial<HeroState>) => void;
  applyEffects: (effects?: EventEffect[]) => void;

  spikeVolte: (amount?: number) => void;
  volteSpikeAt: number;
  volteSpikeAmount: number;

  // --- Temps ---
  clock: Clock;
  advanceTime: (minutes: number) => void;

  // --- Narration (le cœur) ---
  narration: NarrativeMessage[];
  choices: Choice[];
  narrativeBusy: boolean;
  /** Vrai tant qu'une scène/événement n'est pas résolu : bloque voyage/repos. */
  interactionLocked: boolean;
  chooseOption: (id: string, label: string) => void;
  submitAction: (text: string) => void;

  // --- Déplacements (narrés) ---
  journeyTo: (regionId: string) => void; // inter-régions, long
  moveTo: (placeName: string) => void; // intra-ville, court
  requestMove: (placeName: string) => void; // demande de déplacement (confirmation)
  pendingMove: string | null;
  confirmMoveYes: () => void;
  cancelMove: () => void;
  dischargeVolte: () => void;

  // --- Inventaire ---
  addItem: (itemId: string, qty?: number) => void;
  useItem: (itemId: string) => void;

  // --- Découverte (Codex dynamique) ---
  isDiscovered: (kind: CodexKind, id: string) => boolean;
  discover: (kind: CodexKind, id: string) => void;
  discoveryToast: string | null;

  // --- Overlays ---
  codexOpen: boolean;
  codexTab: CodexTab;
  openCodex: (tab?: CodexTab) => void;
  closeCodex: () => void;
  mapOpen: boolean;
  setMapOpen: (open: boolean) => void;
  settingsOpen: boolean;
  setSettingsOpen: (open: boolean) => void;

  // --- Moments forts ---
  isDead: boolean;
  die: () => void;
  revive: () => void;
  gameOver: boolean;
  endGame: () => void;
  bossRevealId: string | null;
  revealBoss: (id: string) => void;
  dismissBoss: () => void;
  bossEncounter: string | null;
  engageBoss: (id: string) => void;
  endBoss: () => void;

  // --- Transitions narratives (interludes plein écran) ---
  interlude: Interlude | null;
  showInterlude: (i: Omit<Interlude, 'id'>) => void;
  dismissInterlude: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

let msgSeq = 0;
const mid = () => `n${msgSeq++}`;
let interludeSeq = 0;
const msg = (
  text: string,
  kind: NarrativeMessage['kind'] = 'narration',
  speaker?: string,
  speakerId?: string,
): NarrativeMessage => ({ id: mid(), kind, text, speaker, speakerId });

// Au départ, presque tout est INCONNU. On ne révèle que le strict nécessaire :
// le mentor, l'Empire (suzerain de tous), la géographie, et ce qu'on porte.
// Tout le reste se débloque en jouant (rencontres, événements, combats).
function seedDiscovery(): Record<string, boolean> {
  const d: Record<string, boolean> = {};
  const reveal = (kind: CodexKind, ids: string[]) => ids.forEach((id) => (d[`${kind}:${id}`] = true));
  reveal('character', ['ren']);
  reveal('faction', ['empire']);
  reveal('region', REGIONS.map((r) => r.id)); // la géographie est connue
  reveal('item', HERO.inventory.map((s) => s.itemId)); // ce qu'on porte
  return d;
}

function discoveryName(kind: CodexKind, id: string): string {
  switch (kind) {
    case 'character':
      return CHARACTER_BY_ID[id]?.name ?? id;
    case 'enemy':
      return ENEMY_BY_ID[id]?.name ?? id;
    case 'item':
      return ITEM_BY_ID[id]?.name ?? id;
    case 'beast':
      return BEAST_BY_ID[id]?.name ?? id;
    case 'faction':
      return FACTION_BY_ID[id]?.name ?? id;
    case 'region':
      return REGION_BY_ID[id]?.name ?? id;
    default:
      return id;
  }
}

const AMBIENT_LINES = [
  'Un jour nouveau se lève sur Shendaï. Au loin, le Pilier d’Âmes luit, indifférent à ta course.',
  'La rumeur court de bourg en bourg : on aurait vu la foudre, quelque part. Les langues s’emballent.',
  'Le vent porte une odeur de cendre froide. Ailleurs, cette nuit, quelque chose a brûlé.',
  'Les routes se vident à l’approche du crépuscule. Chacun sait ce qui rôde après la tombée du jour.',
];

/** Pending d'interaction : ce que résolvent les choix / la saisie libre. */
type Pending =
  | { kind: 'engine' }
  | { kind: 'event'; ev: GameEvent; toId: string; plan: ReturnType<typeof planTravel> }
  | { kind: 'boss'; enemyId: string }
  | null;

/** Le RP commence le soir de la majorité du héros — Jour 1, 18:00. */
const STARTING_MINUTES = 18 * 60;

export function GameProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<GamePhase>('launch');
  const [regionId, setRegionId] = useState<string>(STARTING_REGION_ID);
  const [currentPlace, setCurrentPlace] = useState<string | null>(null);
  const [threat, setThreat] = useState<ThreatLevel>('tendu');
  const [hero, setHero] = useState<HeroState>(HERO);
  const [volteSpikeAt, setVolteSpikeAt] = useState(0);
  const [volteSpikeAmount, setVolteSpikeAmount] = useState(0);
  const [gameMinutes, setGameMinutes] = useState(STARTING_MINUTES);
  const [discovered, setDiscovered] = useState<Record<string, boolean>>(seedDiscovery);
  const [discoveryToast, setDiscoveryToast] = useState<string | null>(null);

  const [narration, setNarration] = useState<NarrativeMessage[]>([]);
  const [choices, setChoices] = useState<Choice[]>([]);
  const [narrativeBusy, setNarrativeBusy] = useState(false);

  const [pendingMove, setPendingMove] = useState<string | null>(null);
  const [codexOpen, setCodexOpen] = useState(false);
  const [codexTab, setCodexTab] = useState<CodexTab>('personnages');
  const [mapOpen, setMapOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isDead, setIsDead] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [bossRevealId, setBossRevealId] = useState<string | null>(null);
  const [bossEncounter, setBossEncounter] = useState<string | null>(null);
  const [interlude, setInterlude] = useState<Interlude | null>(null);
  const [worldSituations, setWorldSituations] = useState<
    Record<string, { label: string; desc: string; sinceDay: number; visual?: WorldVisual }>
  >({});

  const region = REGION_BY_ID[regionId] ?? REGION_BY_ID[STARTING_REGION_ID];
  const clock = useMemo(() => clockFromMinutes(gameMinutes), [gameMinutes]);

  const engineRef = useRef(createEngine());
  const pendingRef = useRef<Pending>(null);
  const discoveredRef = useRef(discovered);
  discoveredRef.current = discovered;
  const minutesRef = useRef(gameMinutes);
  minutesRef.current = gameMinutes;
  const heroRef = useRef(hero);
  heroRef.current = hero;
  const worldRef = useRef(worldSituations);
  worldRef.current = worldSituations;
  const lastWorldDayRef = useRef<number | null>(null);

  // Verrou d'interaction : tant qu'une scène/événement présente des choix (ou
  // que le récit se déploie), on ne peut pas voyager, se déplacer ou dormir —
  // l'événement reste actif jusqu'à sa résolution.
  const interactionLocked = narrativeBusy || choices.length > 0;

  useEffect(() => {
    document.documentElement.dataset.theme = region.themeId;
  }, [region.themeId]);

  // --- Narration : primitives ---------------------------------------------
  const narrate = useCallback(
    (text: string, kind: NarrativeMessage['kind'] = 'narration', speaker?: string, speakerId?: string) => {
      setNarration((m) => [...m, msg(text, kind, speaker, speakerId)]);
    },
    [],
  );

  // --- Transitions narratives (interludes) — déclarées tôt car utilisées par
  // arrive() et chooseOption(). ------------------------------------------------
  const showInterlude = useCallback((i: Omit<Interlude, 'id'>) => {
    setInterlude({ ...i, id: ++interludeSeq });
  }, []);
  const dismissInterlude = useCallback(() => setInterlude(null), []);

  // --- Temps ---------------------------------------------------------------
  const advanceTime = useCallback(
    (minutes: number) => {
      const prev = minutesRef.current;
      const next = prev + Math.max(0, minutes);
      minutesRef.current = next;
      setGameMinutes(next);
      // Plus de système de repos : l'énergie est une ressource d'ACTION. Elle se
      // dépense dans les combats, les voyages, les techniques — et remonte
      // doucement avec le temps (on reprend son souffle en chemin) ou via les
      // consommables. La surtension (au-delà de la Capacité) brûle l'âme.
      const h = heroRef.current;
      const overcharged = h.volte >= h.capacity && h.capacity > 0;
      const regen = Math.round((minutes / 60) * 2);
      const burn = overcharged ? Math.round((minutes / 60) * 4) : 0;
      if (regen > 0 || burn > 0) {
        setHero((hh) => ({
          ...hh,
          energy: Math.min(100, hh.energy + regen),
          vitality: Math.max(0, hh.vitality - burn),
        }));
      }
      // Le monde évolue : à chaque changement de jour, une ligne d'ambiance.
      if (Math.floor(prev / MINUTES_PER_DAY) !== Math.floor(next / MINUTES_PER_DAY)) {
        const line = AMBIENT_LINES[Math.floor(next / MINUTES_PER_DAY) % AMBIENT_LINES.length];
        narrate(line, 'system');
      }
    },
    [narrate],
  );

  // --- Découverte ----------------------------------------------------------
  const isDiscovered = useCallback(
    (kind: CodexKind, id: string) => discovered[`${kind}:${id}`] ?? false,
    [discovered],
  );
  const discover = useCallback((kind: CodexKind, id: string) => {
    const key = `${kind}:${id}`;
    if (discoveredRef.current[key]) return;
    setDiscovered((d) => ({ ...d, [key]: true }));
    setDiscoveryToast(discoveryName(kind, id));
    window.setTimeout(() => setDiscoveryToast(null), 3400);
  }, []);

  // Rencontrer quelqu'un (une réplique de PNJ) l'inscrit au Codex.
  const discoverSpeakers = useCallback(
    (msgs: NarrativeMessage[]) => {
      msgs.forEach((m) => {
        if (m.kind === 'npc' && m.speakerId) discover('character', m.speakerId);
      });
    },
    [discover],
  );

  // --- Inventaire ----------------------------------------------------------
  const addItem = useCallback((itemId: string, qty = 1) => {
    setHero((h) => {
      const inv = [...h.inventory];
      const idx = inv.findIndex((s) => s.itemId === itemId);
      if (idx >= 0) inv[idx] = { ...inv[idx], qty: inv[idx].qty + qty };
      else inv.push({ itemId, qty });
      return { ...h, inventory: inv };
    });
    if (!discoveredRef.current[`item:${itemId}`]) {
      setDiscovered((d) => ({ ...d, [`item:${itemId}`]: true }));
    }
  }, []);

  const useItem = useCallback((itemId: string) => {
    if (!isConsumable(itemId)) return;
    const eff = CONSUMABLE_EFFECTS[itemId];
    setHero((h) => {
      const idx = h.inventory.findIndex((s) => s.itemId === itemId);
      if (idx < 0 || h.inventory[idx].qty <= 0) return h;
      const inv = [...h.inventory];
      const slot = inv[idx];
      if (slot.qty <= 1) inv.splice(idx, 1);
      else inv[idx] = { ...slot, qty: slot.qty - 1 };
      return { ...h, ...applyStatDelta(h, eff), inventory: inv };
    });
  }, []);

  // --- Volte ---------------------------------------------------------------
  const spikeVolte = useCallback((amount = 14) => {
    setHero((h) => ({ ...h, volte: Math.min(100, h.volte + amount) }));
    setVolteSpikeAmount(amount);
    setVolteSpikeAt(Date.now());
  }, []);

  // --- Effets d'événement (EventEffect) ------------------------------------
  const applyEffects = useCallback(
    (effects?: EventEffect[]) => {
      if (!effects) return;
      const delta = { vitality: 0, souffle: 0, volte: 0, energy: 0 };
      let touched = false;
      effects.forEach((e) => {
        switch (e.type) {
          case 'item':
            addItem(e.itemId, e.qty);
            break;
          case 'energy':
            delta.energy += e.amount;
            touched = true;
            break;
          case 'vitality':
            delta.vitality += e.amount;
            touched = true;
            break;
          case 'souffle':
            delta.souffle += e.amount;
            touched = true;
            break;
          case 'volte':
            delta.volte += e.amount;
            touched = true;
            if (e.amount > 0) {
              setVolteSpikeAmount(e.amount);
              setVolteSpikeAt(Date.now());
            }
            break;
          case 'time':
            advanceTime(e.minutes);
            break;
          case 'threat':
            setThreat(e.level);
            break;
          case 'discover':
            discover(e.kind, e.id);
            break;
        }
      });
      if (touched) setHero((h) => ({ ...h, ...applyStatDelta(h, delta) }));
    },
    [addItem, advanceTime, discover],
  );

  // --- Effets de récit (NarrativeEffect, depuis le moteur) -----------------
  const applyNarrativeEffects = useCallback(
    (effects?: NarrativeEffect[]) => {
      effects?.forEach((e) => {
        switch (e.type) {
          case 'travel':
            setRegionId(e.regionId);
            break;
          case 'threat':
            setThreat(e.level);
            break;
          case 'volte':
            spikeVolte(e.amount);
            break;
          case 'bossReveal':
            setBossRevealId(e.enemyId);
            break;
          case 'death':
            window.setTimeout(() => setIsDead(true), 1100);
            break;
        }
      });
    },
    [spikeVolte],
  );

  // --- Arrivée (fin d'un voyage) -------------------------------------------
  const arrive = useCallback(
    (toId: string, plan: ReturnType<typeof planTravel>) => {
      advanceTime(plan.minutes);
      setHero((h) => ({ ...h, ...applyStatDelta(h, { energy: -plan.energyCost }) }));
      setRegionId(toId);
      setCurrentPlace(null);
      const dest = REGION_BY_ID[toId];
      narrate(`Après la route, ${dest.name} se dresse enfin devant toi. Le ciel y a changé de couleur.`);
      showInterlude({
        kind: 'region',
        title: dest.name,
        subtitle: dest.subtitle,
        lines: ['La route s’efface derrière toi. Devant : une terre nouvelle, et un ciel qui a déjà changé de couleur.'],
        stamp: formatJournalLong(clockFromMinutes(minutesRef.current)),
        cta: 'Entrer',
      });
    },
    [advanceTime, narrate, showInterlude],
  );

  // --- Moteur : ingestion d'une réponse ------------------------------------
  const ingestEngine = useCallback(
    (res: { messages: NarrativeMessage[]; choices?: Choice[]; effects?: NarrativeEffect[] }) => {
      setNarration((m) => [...m, ...res.messages]);
      setChoices(res.choices ?? []);
      pendingRef.current = res.choices && res.choices.length ? { kind: 'engine' } : null;
      discoverSpeakers(res.messages);
      applyNarrativeEffects(res.effects);
    },
    [applyNarrativeEffects, discoverSpeakers],
  );

  // --- Choix (récit OU événement) ------------------------------------------
  const chooseOption = useCallback(
    async (id: string, label: string) => {
      if (narrativeBusy) return;
      const p = pendingRef.current;
      setNarration((m) => [...m, msg(label, 'player')]);
      setChoices([]);
      if (p?.kind === 'engine') {
        setNarrativeBusy(true);
        const res = await engineRef.current.chooseOption(id);
        ingestEngine(res);
        setNarrativeBusy(false);
      } else if (p?.kind === 'event') {
        const idx = Number(id.replace('ev-', ''));
        const choice = p.ev.choices[idx];
        pendingRef.current = null;
        if (choice) {
          applyEffects(choice.effects);
          narrate(choice.result);
        }
        arrive(p.toId, p.plan);
      } else if (p?.kind === 'boss') {
        const e = ENEMY_BY_ID[p.enemyId];
        pendingRef.current = null;
        if (id === 'boss-strike') {
          narrate('Tu charges, poing en avant. L’échange est d’une violence inouïe.');
          // C'est LE BOSS qui décide de ne plus se retenir.
          if (e) narrate(`Alors il cesse de jouer. De lui-même, il bascule : ${e.revealedForm}`, 'system');
          narrate(
            'C’est trop pour toi, cette fois. Tu graves son visage dans ta mémoire et tu romps le combat, vivant de justesse.',
          );
          setHero((h) => ({ ...h, ...applyStatDelta(h, { vitality: -18, energy: -10 }) }));
        } else if (id === 'boss-discharge') {
          setHero((h) => ({
            ...h,
            volte: 5,
            vitality: Math.max(0, h.vitality - (h.volte >= h.capacity ? 6 : 0)),
          }));
          setVolteSpikeAmount(40);
          setVolteSpikeAt(Date.now());
          narrate('Tu ouvres les vannes : un trait blanc s’abat sur lui.');
          if (e) narrate(`La morsure le réveille pour de bon — il dévoile sa forme : ${e.revealedForm}`, 'system');
          narrate(
            'Mais l’éclair t’a ouvert une trouée. Tu plonges dans la fumée et disparais avant qu’il ne déferle.',
          );
        } else {
          narrate(
            'Tu refuses le combat. Mieux vaut un lâche vivant qu’un héros calciné. Tu te fonds dans l’ombre — et, dans ton dos, tu l’entends commencer à changer.',
          );
          setHero((h) => ({ ...h, ...applyStatDelta(h, { energy: -12 }) }));
          showInterlude({
            kind: 'defeat',
            title: 'Tu romps le combat',
            subtitle: e?.name,
            lines: [
              'Reculer devant un fléau n’est jamais gratuit : tu fuis le souffle court, une dette de peur de plus sur les épaules.',
              'Dans ton dos, tu l’entends commencer à changer. La prochaine fois, il ne jouera plus.',
            ],
            stamp: formatJournalLong(clockFromMinutes(minutesRef.current)),
          });
        }
        setBossEncounter(null);
        setThreat('tendu');
      }
    },
    [narrativeBusy, ingestEngine, applyEffects, arrive, narrate, showInterlude],
  );

  // --- Saisie libre --------------------------------------------------------
  const submitAction = useCallback(
    async (text: string) => {
      const t = text.trim();
      if (!t || narrativeBusy) return;
      const p = pendingRef.current;
      setNarration((m) => [...m, msg(t, 'player')]);

      if (p?.kind === 'event') {
        // Réponse libre à un événement de route : tu fais à ta façon.
        pendingRef.current = null;
        setChoices([]);
        narrate(
          'Tu agis à ta manière, sans suivre la voie qu’on t’offrait. La route, elle, ne juge pas — elle continue.',
        );
        arrive(p.toId, p.plan);
        return;
      }

      // Récit libre : le moteur (mock aujourd'hui, IA demain) improvise.
      setNarrativeBusy(true);
      const res = await engineRef.current.sendPlayerAction(t);
      const fresh = res.messages.filter((x) => x.kind !== 'player');
      setNarration((m) => [...m, ...fresh]);
      discoverSpeakers(fresh);
      applyNarrativeEffects(res.effects);
      setNarrativeBusy(false);
    },
    [narrativeBusy, narrate, arrive, applyNarrativeEffects, discoverSpeakers],
  );

  // --- Voyage inter-régions (narré) ----------------------------------------
  const journeyTo = useCallback(
    (toId: string) => {
      if (toId === regionId || narrativeBusy || pendingRef.current) return;
      const from = REGION_BY_ID[regionId];
      const dest = REGION_BY_ID[toId];
      if (!dest) return;
      const plan = planTravel(regionId, toId);
      // Limite du personnage : trop épuisé pour entreprendre la route.
      if (heroRef.current.energy < Math.max(8, plan.energyCost)) {
        narrate(
          'Tes jambes ne te portent plus. Une route pareille, dans cet état, te tuerait avant l’ennemi. Reprends des forces — un en-cas, un peu de temps — avant de repartir.',
          'system',
        );
        return;
      }
      setMapOpen(false);
      narrate(`Tu quittes ${from.name} et t'engages sur la longue route vers ${dest.name}.`);
      narrate(`Voyage · ≈ ${formatDuration(plan.minutes)} · −${plan.energyCost} énergie`, 'system');
      setNarrativeBusy(true);
      const phaseNow = clockFromMinutes(minutesRef.current).phase;
      window.setTimeout(() => {
        setNarrativeBusy(false);
        const ev = rollTravelEvent(plan, phaseNow);
        if (ev) {
          narrate(`Sur la route — ${ev.title}.`, 'system');
          narrate(ev.text);
          setChoices(ev.choices.map((c, i) => ({ id: `ev-${i}`, label: c.label, tone: 'tendu' })));
          pendingRef.current = { kind: 'event', ev, toId, plan };
        } else {
          arrive(toId, plan);
        }
      }, 950);
    },
    [regionId, narrativeBusy, narrate, arrive],
  );

  // --- Déplacement intra-ville (court, narré) ------------------------------
  const moveTo = useCallback(
    (placeName: string) => {
      if (narrativeBusy || pendingRef.current || placeName === currentPlace) return;
      if (heroRef.current.energy < 3) {
        narrate('Tu es à bout — même quelques pas te coûtent. Reprends d’abord des forces.', 'system');
        return;
      }
      const sub = (SUBLOCATIONS[regionId] ?? []).find((s) => s.name === placeName);
      setCurrentPlace(placeName);
      advanceTime(20);
      setHero((h) => ({ ...h, ...applyStatDelta(h, { energy: -3 }) }));
      narrate(`Tu gagnes ${placeName}.`);
      if (sub) narrate(sub.note);
    },
    [narrativeBusy, currentPlace, regionId, advanceTime, narrate],
  );

  // Confirmation simple avant un déplacement en ville.
  const requestMove = useCallback((placeName: string) => setPendingMove(placeName), []);
  const cancelMove = useCallback(() => setPendingMove(null), []);
  const confirmMoveYes = useCallback(() => {
    if (pendingMove) moveTo(pendingMove);
    setPendingMove(null);
  }, [pendingMove, moveTo]);

  // --- Décharge de Volte ---------------------------------------------------
  const dischargeVolte = useCallback(() => {
    const v = heroRef.current.volte;
    if (v < 25) {
      narrate('Ta réserve est trop maigre pour une vraie décharge — quelques étincelles, rien de plus.', 'system');
      return;
    }
    const overcharged = v >= heroRef.current.capacity;
    setHero((h) => ({
      ...h,
      volte: 5,
      energy: Math.max(0, h.energy - 8), // une grande décharge épuise le corps
      vitality: overcharged ? Math.max(0, h.vitality - 6) : h.vitality,
    }));
    setVolteSpikeAmount(40);
    setVolteSpikeAt(Date.now());
    narrate(
      'Tu ouvres les vannes : toute ta Volte jaillit d’un coup. Un éclair blanc déchire l’air, l’odeur d’orage te brûle la gorge — et ta réserve retombe à presque rien.',
    );
    if (overcharged) narrate('La surtension reflue. Ton conduit, lui, en gardera la marque.', 'system');
  }, [narrate]);

  // --- Combat de boss ------------------------------------------------------
  const engageBoss = useCallback(
    (id: string) => {
      const e = ENEMY_BY_ID[id];
      if (!e) return;
      const meta = BOSS_META[id];
      setBossRevealId(null);
      setBossEncounter(id);
      setThreat('mortel');
      discover('enemy', id);
      narrate(
        `Le piège se referme autour de toi. ${e.name} se dresse — ${e.epithet}.`,
        'system',
      );
      narrate(e.identity);
      if (meta) narrate(`Méfie-toi : il ${meta.power}.`, 'system');
      setChoices([
        { id: 'boss-strike', label: 'Le frapper de toutes tes forces', tone: 'mortel' },
        { id: 'boss-discharge', label: 'Tout libérer — décharger ta Volte', tone: 'mortel' },
        { id: 'boss-retreat', label: 'Battre en retraite', tone: 'tendu' },
      ]);
      pendingRef.current = { kind: 'boss', enemyId: id };
    },
    [narrate, discover],
  );

  const endBoss = useCallback(() => {
    setBossEncounter(null);
    setThreat('tendu');
    pendingRef.current = null;
    setChoices([]);
  }, []);

  // --- Phases --------------------------------------------------------------
  const startedRef = useRef(false);
  const startIntro = useCallback(() => setPhase('intro'), []);
  const startPlay = useCallback(async () => {
    setPhase('playing');
    if (startedRef.current) return;
    startedRef.current = true;
    setNarrativeBusy(true);
    const res = await engineRef.current.start();
    setNarration(res.messages);
    setChoices(res.choices ?? []);
    pendingRef.current = res.choices && res.choices.length ? { kind: 'engine' } : null;
    discoverSpeakers(res.messages);
    applyNarrativeEffects(res.effects);
    setNarrativeBusy(false);
  }, [applyNarrativeEffects, discoverSpeakers]);

  // --- Divers --------------------------------------------------------------
  const travelTo = useCallback((id: string) => {
    if (REGION_BY_ID[id]) {
      setRegionId(id);
      setMapOpen(false);
    }
  }, []);
  const updateHero = useCallback((patch: Partial<HeroState>) => setHero((h) => ({ ...h, ...patch })), []);
  const openCodex = useCallback((tab?: CodexTab) => {
    if (tab) setCodexTab(tab);
    setCodexOpen(true);
  }, []);
  const closeCodex = useCallback(() => setCodexOpen(false), []);
  const die = useCallback(() => setIsDead(true), []);
  const revive = useCallback(() => {
    setIsDead(false);
    setHero((h) => ({ ...h, vitality: 60, volte: 10, energy: 50 }));
  }, []);
  // Fin de partie définitive : on bascule de l'écran de mort vers l'épilogue.
  const endGame = useCallback(() => {
    setIsDead(false);
    setGameOver(true);
  }, []);
  const revealBoss = useCallback(
    (id: string) => {
      setBossRevealId(id);
      discover('enemy', id);
    },
    [discover],
  );
  const dismissBoss = useCallback(() => setBossRevealId(null), []);

  // --- Monde vivant : à chaque jour qui passe, le monde évolue ailleurs -----
  useEffect(() => {
    if (phase !== 'playing') return;
    if (lastWorldDayRef.current === null) {
      lastWorldDayRef.current = clock.day;
      return; // on n'agite pas le monde le jour même du début
    }
    if (clock.day === lastWorldDayRef.current) return;
    lastWorldDayRef.current = clock.day;

    const prev = worldRef.current;
    const next = { ...prev };
    for (const rid of Object.keys(next)) {
      if (clock.day - next[rid].sinceDay >= 2) delete next[rid]; // les situations se résolvent
    }
    const candidates = REGIONS.filter((r) => r.id !== regionId && !next[r.id]);
    let rumor: string | null = null;
    if (candidates.length && Math.random() < 0.85) {
      const r = candidates[Math.floor(Math.random() * candidates.length)];
      const pool = WORLD_SITUATIONS.filter((w) => !w.regionId || w.regionId === r.id);
      const w = pool[Math.floor(Math.random() * pool.length)];
      next[r.id] = { label: w.label, desc: w.desc, sinceDay: clock.day, visual: w.visual };
      rumor = w.rumor;
    }
    setWorldSituations(next);
    if (rumor) narrate(`Une rumeur court : ${rumor}`, 'system');
  }, [clock.day, phase, regionId, narrate]);

  const value = useMemo<GameContextValue>(
    () => ({
      phase,
      startIntro,
      startPlay,
      region,
      currentPlace,
      travelTo,
      worldSituations,
      threat,
      setThreat,
      hero,
      updateHero,
      applyEffects,
      spikeVolte,
      volteSpikeAt,
      volteSpikeAmount,
      clock,
      advanceTime,
      narration,
      choices,
      narrativeBusy,
      interactionLocked,
      chooseOption,
      submitAction,
      journeyTo,
      moveTo,
      requestMove,
      pendingMove,
      confirmMoveYes,
      cancelMove,
      dischargeVolte,
      addItem,
      useItem,
      isDiscovered,
      discover,
      discoveryToast,
      codexOpen,
      codexTab,
      openCodex,
      closeCodex,
      mapOpen,
      setMapOpen,
      settingsOpen,
      setSettingsOpen,
      isDead,
      die,
      revive,
      gameOver,
      endGame,
      bossRevealId,
      revealBoss,
      dismissBoss,
      bossEncounter,
      engageBoss,
      endBoss,
      interlude,
      showInterlude,
      dismissInterlude,
    }),
    [
      phase,
      startIntro,
      startPlay,
      region,
      currentPlace,
      travelTo,
      worldSituations,
      threat,
      hero,
      updateHero,
      applyEffects,
      spikeVolte,
      volteSpikeAt,
      volteSpikeAmount,
      clock,
      advanceTime,
      narration,
      choices,
      narrativeBusy,
      interactionLocked,
      chooseOption,
      submitAction,
      journeyTo,
      moveTo,
      requestMove,
      pendingMove,
      confirmMoveYes,
      cancelMove,
      dischargeVolte,
      addItem,
      useItem,
      isDiscovered,
      discover,
      discoveryToast,
      codexOpen,
      codexTab,
      openCodex,
      closeCodex,
      mapOpen,
      settingsOpen,
      isDead,
      die,
      revive,
      gameOver,
      endGame,
      bossRevealId,
      revealBoss,
      dismissBoss,
      bossEncounter,
      engageBoss,
      endBoss,
      interlude,
      showInterlude,
      dismissInterlude,
    ],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame doit être utilisé dans <GameProvider>');
  return ctx;
}
