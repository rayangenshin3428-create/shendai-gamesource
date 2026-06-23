import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ITEM_BY_ID, RARITY_META, type ItemKind } from '../../data';
import { useGame } from '../../state/game';
import { CONSUMABLE_EFFECTS, isConsumable } from '../../systems/inventory';
import { Icon, type IconName } from '../ui/Icon';

// ============================================================================
// Inventaire — soins, armes, artefacts, monnaie. Bordure par rareté.
// Le tooltip est rendu en PORTAL et clampé au viewport : il n'est jamais
// coupé, même pour un objet collé au bord de l'écran.
// ============================================================================

const KIND_ICON: Record<ItemKind, IconName> = {
  soin: 'vial',
  arme: 'sword',
  artefact: 'gem',
  monnaie: 'coin',
};

const TIP_W = 216;

export function Inventory() {
  const { hero, useItem } = useGame();
  const [hovered, setHovered] = useState<{ itemId: string; rect: DOMRect } | null>(null);
  const closeTimer = useRef<number | null>(null);

  const open = (itemId: string, el: HTMLElement) => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setHovered({ itemId, rect: el.getBoundingClientRect() });
  };
  const scheduleClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setHovered(null), 140);
  };
  const cancelClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
  };

  useEffect(() => () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
  }, []);

  const item = hovered ? ITEM_BY_ID[hovered.itemId] : null;

  // Position clampée au viewport : au-dessus si possible, sinon en dessous.
  let tipStyle: React.CSSProperties = {};
  if (hovered) {
    const r = hovered.rect;
    const vw = window.innerWidth;
    const left = Math.min(Math.max(8, r.left + r.width / 2 - TIP_W / 2), vw - TIP_W - 8);
    const above = r.top > 180;
    tipStyle = above
      ? { left, top: r.top - 8, transform: 'translateY(-100%)' }
      : { left, top: r.bottom + 8 };
  }

  return (
    <div>
      <div className="mb-2 flex items-center gap-1.5 text-[0.6rem] uppercase tracking-[0.2em] text-text-dim">
        <Icon name="gem" size={12} className="text-gold/70" />
        Inventaire
      </div>

      <div className="grid grid-cols-5 gap-2">
        {hero.inventory.map((slot) => {
          const it = ITEM_BY_ID[slot.itemId];
          if (!it) return null;
          const r = RARITY_META[it.rarity];
          const active = hovered?.itemId === slot.itemId;
          return (
            <button
              key={slot.itemId}
              onMouseEnter={(e) => open(slot.itemId, e.currentTarget)}
              onMouseLeave={scheduleClose}
              onFocus={(e) => open(slot.itemId, e.currentTarget)}
              onBlur={scheduleClose}
              className="relative grid aspect-square w-full place-items-center rounded-md border transition-transform hover:scale-105"
              style={{
                borderColor: `color-mix(in oklab, ${r.color} 55%, var(--ink))`,
                background: `radial-gradient(circle at 50% 30%, color-mix(in oklab, ${r.color} 14%, transparent), color-mix(in oklab, var(--bg) 80%, transparent))`,
                boxShadow: active ? `0 0 14px -2px ${r.glow}` : 'none',
                color: r.color,
              }}
              aria-label={it.name}
            >
              <Icon name={KIND_ICON[it.kind]} size={18} />
              {slot.qty > 1 && (
                <span className="absolute -bottom-1 -right-1 rounded-full bg-bg px-1 text-[0.58rem] font-semibold text-text">
                  {slot.qty}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {createPortal(
        <AnimatePresence>
          {item && hovered && (
            <motion.div
              key={hovered.itemId}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.14 }}
              onMouseEnter={cancelClose}
              onMouseLeave={scheduleClose}
              className="panel fixed z-[80] rounded-md p-3 text-left"
              style={{ width: TIP_W, ...tipStyle }}
            >
              <div className="font-heading text-sm font-semibold text-text">{item.name}</div>
              <span
                className="mt-0.5 inline-block text-[0.6rem] uppercase tracking-[0.16em]"
                style={{ color: RARITY_META[item.rarity].color }}
              >
                {RARITY_META[item.rarity].label}
              </span>
              <p className="mt-1.5 text-xs leading-relaxed text-text-dim">{item.effect}</p>
              {item.owner && (
                <p className="mt-1 text-[0.66rem] italic text-text-dim/70">— {item.owner}</p>
              )}
              {isConsumable(item.id) && (
                <button
                  onClick={() => {
                    useItem(item.id);
                    setHovered(null);
                  }}
                  className="mt-2.5 w-full rounded border border-gold/40 bg-gold/10 px-2 py-1 text-xs font-semibold text-text transition-colors hover:border-gold/70 hover:bg-gold/20"
                >
                  {CONSUMABLE_EFFECTS[item.id].verb}
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </div>
  );
}
