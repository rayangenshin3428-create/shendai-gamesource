import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

// ============================================================================
// Réglages utilisateur — persistés en localStorage, appliqués au document.
// Pilotent le confort visuel et les performances (particules, grain, motion).
// ============================================================================

export type ParticleLevel = 'off' | 'low' | 'normal' | 'high';

export interface Settings {
  particles: ParticleLevel;
  reduceMotion: boolean;
  grain: boolean;
  glow: boolean;
}

const DEFAULTS: Settings = {
  particles: 'normal',
  reduceMotion: false,
  grain: true,
  glow: true,
};

export const PARTICLE_SCALE: Record<ParticleLevel, number> = {
  off: 0,
  low: 0.5,
  normal: 1,
  high: 1.5,
};

const STORAGE_KEY = 'shendai:settings';

function load(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
  return DEFAULTS;
}

interface SettingsContextValue {
  settings: Settings;
  update: (patch: Partial<Settings>) => void;
  reset: () => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(load);

  // Applique au document + persiste.
  useEffect(() => {
    const reduce =
      settings.reduceMotion ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.documentElement.dataset.reduceMotion = reduce ? 'true' : 'false';
    document.documentElement.dataset.grain = settings.grain ? 'true' : 'false';
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      /* ignore */
    }
  }, [settings]);

  const update = useCallback((patch: Partial<Settings>) => {
    setSettings((s) => ({ ...s, ...patch }));
  }, []);

  const reset = useCallback(() => setSettings(DEFAULTS), []);

  const value = useMemo(() => ({ settings, update, reset }), [settings, update, reset]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings doit être utilisé dans <SettingsProvider>');
  return ctx;
}
