import type { ArenaEnv } from '../../data';

// ============================================================================
// Palettes & zones d'arène — partagées par ArenaView (le décor) et
// BossAmbiance (la teinte d'ambiance), pour rester COHÉRENT avec le lieu.
// ============================================================================

export interface EnvDef {
  label: string;
  sky: [string, string];
  structure: string;
  accent: string;
  zones: string[];
}

export const ARENA_ENV: Record<ArenaEnv, EnvDef> = {
  temple: {
    label: 'Temple ancien',
    sky: ['#180a10', '#241016'],
    structure: '#3a2028',
    accent: '#d23a44',
    zones: ['Le Parvis', 'La Nef', 'Le Sanctuaire'],
  },
  foret: {
    label: 'Forêt sacrée',
    sky: ['#0a1410', '#0f1c14'],
    structure: '#1a2c1f',
    accent: '#e6d27a',
    zones: ['La Lisière', 'La Clairière', 'Le Cœur sacré'],
  },
  ruines: {
    label: 'Cité en ruines',
    sky: ['#0e0e12', '#15140f'],
    structure: '#2a271d',
    accent: '#b8ad96',
    zones: ['Les Décombres', 'La Grand-Place', 'La Crypte'],
  },
  forteresse: {
    label: 'Forteresse',
    sky: ['#140b0a', '#1e120c'],
    structure: '#2e1d15',
    accent: '#cf6a2a',
    zones: ['La Herse', 'La Cour', 'Le Donjon'],
  },
  montagne: {
    label: 'Cime battue',
    sky: ['#0b0f16', '#141a22'],
    structure: '#28313c',
    accent: '#9fb6c9',
    zones: ['Le Sentier', 'La Corniche', 'Le Sommet'],
  },
  sanctuaire: {
    label: 'Sanctuaire',
    sky: ['#120810', '#1b0a14'],
    structure: '#2a1222',
    accent: '#ff5c6e',
    zones: ['Le Seuil', 'L’Allée des Lanternes', 'L’Autel'],
  },
  fournaise: {
    label: 'Palais ardent',
    sky: ['#160805', '#220d07'],
    structure: '#321408',
    accent: '#ff6326',
    zones: ['Les Terrasses', 'La Salle du Trône', 'Le Brasier'],
  },
  givre: {
    label: 'Cathédrale de givre',
    sky: ['#06101c', '#0c1826'],
    structure: '#1a2c44',
    accent: '#9fd2ff',
    zones: ['Le Porche Gelé', 'La Nef de Glace', 'Le Chœur'],
  },
};
