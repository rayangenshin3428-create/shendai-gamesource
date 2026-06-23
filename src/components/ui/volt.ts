// ============================================================================
// IDENTITÉ DU VOLT — couleurs de marque FIXES (calées sur « SOUL VOLTTAGE » +
// direction artistique WLOP). Le système Volt garde son identité PARTOUT, quelle
// que soit la région.
//
// Nouvelle direction (l'orange est abandonné, jugé moins élégant) :
//   - éclair : BLANC ÉLECTRIQUE + OR ÉNERGÉTIQUE (cœur incandescent presque blanc)
//   - froid  : BLEU ÉLECTRIQUE DISCRET (la brume, le contraste)
//   - le rouge n'est gardé que pour la SURTENSION (la brûlure d'âme — un danger).
// (Les clés historiques sont conservées pour ne pas casser les composants ;
//  seules les valeurs changent.)
// ============================================================================

export const VOLT = {
  /** Cœur incandescent de l'éclair — blanc chaud, presque or. */
  hot: '#fff6e0',
  /** Or énergétique — l'accent signature. */
  amber: '#ffd76a',
  /** Or électrique (corps de l'arc). */
  orange: '#f3c64f',
  /** Or profond (retombée de la décharge). */
  ember: '#c9a23a',
  /** Surtension — la brûlure d'âme (rouge brûlant, le seul rouge). */
  danger: '#ff5a3a',
  /** Bleu électrique discret — la brume, le froid de la scène. */
  smoke: '#86c6e0',
} as const;
