import type { CSSProperties } from 'react';

// ============================================================================
// Sceau rouge façon cachet chinois (« chop »). Glyphe au pinceau dedans.
// ============================================================================

interface SealProps {
  char: string;
  size?: number;
  className?: string;
  style?: CSSProperties;
  title?: string;
}

export function Seal({ char, size = 44, className = '', style, title }: SealProps) {
  return (
    <span
      className={`relative inline-grid place-items-center select-none ${className}`}
      title={title}
      style={{
        width: size,
        height: size,
        borderRadius: Math.max(6, size * 0.16),
        background:
          'linear-gradient(160deg, color-mix(in oklab, var(--seal) 92%, #000), color-mix(in oklab, var(--seal) 70%, #200))',
        boxShadow:
          'inset 0 0 0 1px color-mix(in oklab, #000 35%, transparent), inset 0 0 12px color-mix(in oklab, #000 45%, transparent), 0 2px 10px -4px #000',
        color: '#f6e9da',
        ...style,
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-brush)',
          fontSize: size * 0.6,
          lineHeight: 1,
          marginTop: size * 0.02,
          textShadow: '0 1px 0 rgba(0,0,0,0.4)',
        }}
      >
        {char}
      </span>
    </span>
  );
}
