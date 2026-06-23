import { REGION_BY_ID } from '../data/locations';
import { TRAVEL_EVENTS, type GameEvent } from '../data/events';
import type { DayPhase } from './time';

// ============================================================================
// Système de VOYAGE — logique pure. Distance → temps de jeu + coût d'énergie,
// et tirage d'un événement de route.
// ============================================================================

/** ~ minutes de jeu par unité de distance sur la carte. */
const MINUTES_PER_UNIT = 14;
/** ~ énergie dépensée par unité de distance. */
const ENERGY_PER_UNIT = 0.85;
/** Probabilité qu'un voyage déclenche un événement. */
const EVENT_CHANCE = 0.62;

export interface TravelPlan {
  fromId: string;
  toId: string;
  distance: number;
  minutes: number;
  energyCost: number;
}

export function distanceBetween(aId: string, bId: string): number {
  const a = REGION_BY_ID[aId];
  const b = REGION_BY_ID[bId];
  if (!a || !b) return 0;
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function planTravel(fromId: string, toId: string): TravelPlan {
  const distance = distanceBetween(fromId, toId);
  return {
    fromId,
    toId,
    distance,
    minutes: Math.max(20, Math.round(distance * MINUTES_PER_UNIT)),
    energyCost: Math.max(4, Math.round(distance * ENERGY_PER_UNIT)),
  };
}

/** Tire un événement éligible pour ce trajet, ou null. */
export function rollTravelEvent(plan: TravelPlan, phase: DayPhase): GameEvent | null {
  if (Math.random() > EVENT_CHANCE) return null;

  const eligible = TRAVEL_EVENTS.filter((e) => {
    if (e.regions && !e.regions.includes(plan.fromId) && !e.regions.includes(plan.toId)) {
      return false;
    }
    if (e.phase && !e.phase.includes(phase)) return false;
    return true;
  });
  if (eligible.length === 0) return null;

  const totalWeight = eligible.reduce((s, e) => s + (e.weight ?? 1), 0);
  let r = Math.random() * totalWeight;
  for (const e of eligible) {
    r -= e.weight ?? 1;
    if (r <= 0) return e;
  }
  return eligible[eligible.length - 1];
}
