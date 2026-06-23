// ============================================================================
// Système de TEMPS — logique pure (aucune dépendance React).
// Le temps avance en minutes de jeu. Tout dérive de `totalMinutes`.
// ============================================================================

export const MINUTES_PER_HOUR = 60;
export const MINUTES_PER_DAY = 24 * MINUTES_PER_HOUR;

// --- Calendrier de Shendaï ---------------------------------------------------
// L'aventure commence le Jour 1 de l'an 742. Quatre saisons rythment l'année ;
// l'année se compte depuis la Grande Fêlure. (Noms encore tunables.)
export const BASE_YEAR = 742;
export const DAYS_PER_SEASON = 90;
export const SEASONS_PER_YEAR = 4;
export const DAYS_PER_YEAR = DAYS_PER_SEASON * SEASONS_PER_YEAR; // 360

export type Season = 'reveil' | 'ardeur' | 'cendres' | 'gel';

export const SEASON_ORDER: Season[] = ['reveil', 'ardeur', 'cendres', 'gel'];

export const SEASON_META: Record<Season, { label: string; mood: string }> = {
  reveil: { label: 'le Réveil', mood: 'la terre dégèle, les herbes repoussent sur les charniers' },
  ardeur: { label: "l’Ardeur", mood: 'la chaleur lourde, les orages secs, les armées en marche' },
  cendres: { label: 'les Cendres', mood: 'le ciel se voile, la cendre tombe comme une neige tiède' },
  gel: { label: 'le Long Gel', mood: 'le froid mord, les morts marchent plus volontiers' },
};

export type DayPhase = 'aube' | 'jour' | 'crépuscule' | 'nuit';

export interface Clock {
  /** Jour 1, 2, 3… (jour d'aventure, cumulatif). */
  day: number;
  /** Année en cours (commence à BASE_YEAR). */
  year: number;
  /** Saison en cours. */
  season: Season;
  hour: number; // 0–23
  minute: number; // 0–59
  phase: DayPhase;
  totalMinutes: number;
}

export const PHASE_META: Record<DayPhase, { label: string; icon: 'sun' | 'moon' | 'dusk' | 'dawn' }> = {
  aube: { label: 'Aube', icon: 'dawn' },
  jour: { label: 'Jour', icon: 'sun' },
  crépuscule: { label: 'Crépuscule', icon: 'dusk' },
  nuit: { label: 'Nuit', icon: 'moon' },
};

export function phaseOf(hour: number): DayPhase {
  if (hour >= 5 && hour < 8) return 'aube';
  if (hour >= 8 && hour < 18) return 'jour';
  if (hour >= 18 && hour < 21) return 'crépuscule';
  return 'nuit';
}

export function clockFromMinutes(totalMinutes: number): Clock {
  const t = Math.max(0, Math.floor(totalMinutes));
  const day = Math.floor(t / MINUTES_PER_DAY) + 1;
  const dayMin = t % MINUTES_PER_DAY;
  const hour = Math.floor(dayMin / MINUTES_PER_HOUR);
  const minute = dayMin % MINUTES_PER_HOUR;
  const year = BASE_YEAR + Math.floor((day - 1) / DAYS_PER_YEAR);
  const season = SEASON_ORDER[Math.floor(((day - 1) % DAYS_PER_YEAR) / DAYS_PER_SEASON)];
  return { day, year, season, hour, minute, phase: phaseOf(hour), totalMinutes: t };
}

/** "Jour 1 · 18:30" */
export function formatClock(c: Clock): string {
  const hh = String(c.hour).padStart(2, '0');
  const mm = String(c.minute).padStart(2, '0');
  return `Jour ${c.day} · ${hh}:${mm}`;
}

/** Libellé de saison : "le Long Gel". */
export function seasonLabel(c: Clock): string {
  return SEASON_META[c.season].label;
}

/** Pour les transitions narratives : "Jour 14 de l'aventure — Année 742". */
export function formatJournal(c: Clock): string {
  return `Jour ${c.day} de l’aventure — Année ${c.year}`;
}

/** Variante longue, avec la saison : "Jour 14 — les Cendres, an 742". */
export function formatJournalLong(c: Clock): string {
  return `Jour ${c.day} — ${SEASON_META[c.season].label}, an ${c.year}`;
}

/** Durée lisible : "3 h", "45 min", "1 j 2 h". */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${Math.round(minutes)} min`;
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (h < 24) return m ? `${h} h ${m}` : `${h} h`;
  const d = Math.floor(h / 24);
  return `${d} j ${h % 24} h`;
}

/**
 * « Obscurité » 0 (plein jour) → 1 (nuit noire), interpolée en douceur sur
 * l'heure. Sert à teinter l'ambiance pour le cycle jour/nuit.
 */
export function darknessAt(totalMinutes: number): number {
  const dayMin = ((totalMinutes % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  const h = dayMin / MINUTES_PER_HOUR; // 0–24, fractionnaire
  // Courbe : sombre la nuit (0–5, 21–24), claire le jour (9–17), transitions douces.
  const lerp = (a: number, b: number, t: number) => a + (b - a) * Math.max(0, Math.min(1, t));
  if (h < 5) return 0.85;
  if (h < 8) return lerp(0.85, 0.05, (h - 5) / 3); // aube
  if (h < 17) return 0.05; // plein jour
  if (h < 21) return lerp(0.05, 0.85, (h - 17) / 4); // crépuscule → nuit
  return 0.85; // nuit
}
