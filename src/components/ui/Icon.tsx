import type { CSSProperties, ReactElement } from 'react';

// ============================================================================
// Iconographie maison — traits au pinceau, esprit sigle / sceau.
// Stroke = currentColor pour hériter de la couleur du contexte.
// ============================================================================

export type IconName =
  | 'bolt'
  | 'book'
  | 'map'
  | 'person'
  | 'flame'
  | 'snow'
  | 'firefly'
  | 'petal'
  | 'spark'
  | 'pillar'
  | 'search'
  | 'close'
  | 'travel'
  | 'skull'
  | 'drop'
  | 'heart'
  | 'lock'
  | 'coin'
  | 'sword'
  | 'vial'
  | 'gem'
  | 'eye'
  | 'expand'
  | 'settings'
  | 'sun'
  | 'moon'
  | 'dusk'
  | 'dawn'
  | 'tent'
  | 'chevron';

const PATHS: Record<IconName, ReactElement> = {
  bolt: <path d="M13 2 5 13h5l-1 9 9-12h-5l1-8Z" />,
  book: (
    <>
      <path d="M4 4.5C4 4 4.4 3.6 5 3.6c2.6 0 5 .7 7 2 2-1.3 4.4-2 7-2 .6 0 1 .4 1 1V19c0 .6-.5 1-1 1-2.4 0-4.7.6-7 1.8-2.3-1.2-4.6-1.8-7-1.8-.6 0-1-.4-1-1V4.5Z" />
      <path d="M12 5.6v15.2" />
    </>
  ),
  map: (
    <>
      <path d="M9 4 4 6v14l5-2 6 2 5-2V4l-5 2-6-2Z" />
      <path d="M9 4v14M15 6v14" />
    </>
  ),
  person: (
    <>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5.5 20c.6-3.6 3.1-5.6 6.5-5.6s5.9 2 6.5 5.6" />
    </>
  ),
  flame: (
    <path d="M12 3c.6 3-1.8 4.2-1.8 6.6 0 1 .6 1.8 1.3 2.2-.2-1.3.4-2.4 1.2-3 .1 2.2 2.6 2.9 2.6 5.6A4.4 4.4 0 0 1 12 21a4.6 4.6 0 0 1-4.6-4.6c0-3.6 3.4-4.7 3.4-8.2 0-1.6-.5-2.8 1.2-5Z" />
  ),
  snow: (
    <>
      <path d="M12 2v20M3.4 7l17.2 10M20.6 7 3.4 17" />
      <path d="M9 4l3 2 3-2M9 20l3-2 3 2M4 9.5 5 12l-1 2.5M20 9.5 19 12l1 2.5" />
    </>
  ),
  firefly: (
    <>
      <circle cx="12" cy="12" r="2.6" />
      <path d="M12 4v3M12 17v3M4 12h3M17 12h3" />
    </>
  ),
  petal: (
    <path d="M12 3c4 3 6 6 6 9a6 6 0 0 1-12 0c0-3 2-6 6-9Z" />
  ),
  spark: (
    <>
      <path d="M12 2v6M12 16v6M2 12h6M16 12h6" />
      <path d="m6 6 3 3M18 6l-3 3M6 18l3-3M18 18l-3-3" />
    </>
  ),
  pillar: (
    <>
      <path d="M12 2v20" />
      <path d="M9 5c1 2 5 2 6 0M8.5 12c1.5 2.4 5.5 2.4 7 0M9 19c1 2 5 2 6 0" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.2" />
      <path d="m20 20-3.6-3.6" />
    </>
  ),
  close: <path d="M5 5l14 14M19 5 5 19" />,
  travel: (
    <>
      <path d="M4 12h13" />
      <path d="m12 6 6 6-6 6" />
    </>
  ),
  skull: (
    <>
      <path d="M5 11a7 7 0 1 1 14 0c0 2.4-1.2 3.6-1.2 5 0 1-.8 1.4-1.8 1.4H8c-1 0-1.8-.4-1.8-1.4 0-1.4-1.2-2.6-1.2-5Z" />
      <circle cx="9" cy="11" r="1.4" />
      <circle cx="15" cy="11" r="1.4" />
      <path d="M10.5 20v-2M13.5 20v-2" />
    </>
  ),
  drop: <path d="M12 3c3 4 5.5 6.6 5.5 10A5.5 5.5 0 0 1 12 18.5 5.5 5.5 0 0 1 6.5 13C6.5 9.6 9 7 12 3Z" />,
  heart: (
    <path d="M12 20S4 14.6 4 9.4A4.4 4.4 0 0 1 12 6.6 4.4 4.4 0 0 1 20 9.4C20 14.6 12 20 12 20Z" />
  ),
  lock: (
    <>
      <rect x="5" y="10.5" width="14" height="9.5" rx="1.6" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
    </>
  ),
  coin: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v8M9.5 9.5h3.2a1.7 1.7 0 0 1 0 3.4H9.5h3.2a1.7 1.7 0 0 1 0 3.4H9.5" opacity="0.6" />
    </>
  ),
  sword: (
    <>
      <path d="m14 4 6 6-9 9-3 1 1-3 5-13Z" opacity="0.9" />
      <path d="m6 18-2 2M8 16l2 2" />
    </>
  ),
  vial: (
    <>
      <path d="M9 3h6M10 3v7l-3 6.5A2.5 2.5 0 0 0 9.3 20h5.4a2.5 2.5 0 0 0 2.3-3.5L14 10V3" />
      <path d="M8.4 14h7.2" />
    </>
  ),
  gem: (
    <>
      <path d="M6 4h12l3 5-9 11L3 9l3-5Z" />
      <path d="M3 9h18M9 4 6.5 9 12 20l5.5-11L15 4" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.6" />
    </>
  ),
  expand: (
    <>
      <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2.5v2.2M12 19.3v2.2M21.5 12h-2.2M4.7 12H2.5M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6M18.7 18.7l-1.6-1.6M6.9 6.9 5.3 5.3" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="3.6" />
      <path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M5 5l1.7 1.7M17.3 17.3 19 19M19 5l-1.7 1.7M6.7 17.3 5 19" />
    </>
  ),
  moon: <path d="M20 14.5A8 8 0 0 1 9.4 4 7 7 0 1 0 20 14.5Z" />,
  dusk: (
    <>
      <path d="M3 19h18" />
      <path d="M7.5 19a4.5 4.5 0 0 1 9 0" />
      <path d="M12 4.5V7M5.5 8 7 9.5M18.5 8 17 9.5M2.5 13.5H4M20 13.5h1.5" />
    </>
  ),
  dawn: (
    <>
      <path d="M3 19h18" />
      <path d="M7.5 19a4.5 4.5 0 0 1 9 0" />
      <path d="M12 3v3.2M9.8 5l2.2-2.2L14.2 5" />
    </>
  ),
  tent: (
    <>
      <path d="M12 4 3.5 20h17L12 4Z" />
      <path d="M12 4v16M12 20l5-7" />
    </>
  ),
  chevron: <path d="m9 6 6 6-6 6" />,
};

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
  style?: CSSProperties;
  /** Pour les glyphes pleins (flamme, pétale, goutte…). */
  filled?: boolean;
}

export function Icon({ name, size = 20, className, style, filled = false }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}
