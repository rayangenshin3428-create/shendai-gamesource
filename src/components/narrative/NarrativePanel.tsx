import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { motion } from 'framer-motion';
import type { Choice, NarrativeMessage } from '../../narrative/types';
import { CHARACTER_BY_ID, type ThreatLevel } from '../../data';
import { useGame } from '../../state/game';
import { Icon } from '../ui/Icon';

// Le « chrome » réagit à la menace de la scène : une braise rouge rampe sur
// le cadre quand c'est mortel.
const THREAT_FRAME: Record<ThreatLevel, { color: string; opacity: number }> = {
  calme: { color: 'var(--glow-cold)', opacity: 0 },
  tendu: { color: 'var(--gold)', opacity: 0.28 },
  mortel: { color: 'var(--seal)', opacity: 0.6 },
};

// ============================================================================
// Panneau narratif — un journal enluminé, pas une messagerie.
// Narration · dialogues de PNJ · actions du joueur · choix · saisie immersive.
// ============================================================================

function NpcVignette({ speakerId, speaker }: { speakerId?: string; speaker?: string }) {
  const ch = speakerId ? CHARACTER_BY_ID[speakerId] : undefined;
  const initial = (speaker ?? '?').charAt(0);
  return (
    <span
      className="grid size-9 shrink-0 place-items-center rounded-full"
      style={{
        background:
          'radial-gradient(circle at 35% 30%, color-mix(in oklab, var(--surface-2) 90%, transparent), color-mix(in oklab, var(--bg) 90%, transparent))',
        border: '1px solid color-mix(in oklab, var(--gold) 40%, transparent)',
        color: 'var(--gold)',
        fontFamily: 'var(--font-brush)',
      }}
      title={ch?.epithet ?? speaker}
    >
      <span className="text-lg leading-none">{initial}</span>
    </span>
  );
}

function MessageView({ message, index }: { message: NarrativeMessage; index: number }) {
  const dropCap = message.kind === 'narration' && index === 0;

  if (message.kind === 'system') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="my-5 flex items-center gap-4"
      >
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gold/40" />
        <span className="flex items-center gap-2 text-center font-heading text-sm italic tracking-wide text-glow-warm">
          <Icon name="bolt" size={14} filled className="text-glow-warm" />
          {message.text}
        </span>
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gold/40" />
      </motion.div>
    );
  }

  if (message.kind === 'npc') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="my-4 flex gap-3"
      >
        <NpcVignette speakerId={message.speakerId} speaker={message.speaker} />
        <div className="min-w-0">
          <div className="font-heading text-sm font-semibold tracking-wide" style={{ color: 'var(--accent)' }}>
            {message.speaker}
          </div>
          <p className="mt-0.5 text-[0.98rem] italic leading-relaxed text-text/90">
            « {message.text} »
          </p>
        </div>
      </motion.div>
    );
  }

  if (message.kind === 'player') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="my-4 flex justify-end"
      >
        <div className="max-w-[85%] border-r-2 border-gold/50 pr-3 text-right">
          <div className="text-[0.6rem] uppercase tracking-[0.2em] text-text-dim">Toi</div>
          <p className="mt-0.5 text-[0.95rem] leading-relaxed text-text/80">{message.text}</p>
        </div>
      </motion.div>
    );
  }

  // narration
  return (
    <motion.p
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="my-4 text-[1.04rem] leading-[1.85] text-text/90"
    >
      {dropCap ? (
        <>
          <span
            className="float-left mr-2 mt-1 font-display leading-[0.8]"
            style={{ fontSize: '3.2rem', color: 'var(--gold)' }}
          >
            {message.text.charAt(0)}
          </span>
          {message.text.slice(1)}
        </>
      ) : (
        message.text
      )}
    </motion.p>
  );
}

function ChoiceButton({ choice, onClick, disabled }: { choice: Choice; onClick: () => void; disabled: boolean }) {
  const toneColor =
    choice.tone === 'mortel'
      ? 'var(--seal)'
      : choice.tone === 'tendu'
        ? 'var(--gold)'
        : 'var(--glow-cold)';
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={disabled ? undefined : { x: 4 }}
      className="group flex w-full items-center gap-3 rounded-md border bg-surface/40 px-4 py-3 text-left transition-colors disabled:opacity-40"
      style={{ borderColor: `color-mix(in oklab, ${toneColor} 35%, var(--ink))` }}
    >
      <span
        className="grid size-6 shrink-0 place-items-center rounded-full border transition-colors"
        style={{ borderColor: `color-mix(in oklab, ${toneColor} 55%, transparent)`, color: toneColor }}
      >
        <Icon name="chevron" size={13} />
      </span>
      <span className="font-body text-[0.97rem] leading-snug text-text/90 group-hover:text-text">
        {choice.label}
      </span>
    </motion.button>
  );
}

export function NarrativePanel() {
  const {
    narration: messages,
    choices,
    narrativeBusy: busy,
    chooseOption: choose,
    submitAction: submit,
    threat,
  } = useGame();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [draft, setDraft] = useState('');

  const frame = THREAT_FRAME[threat];
  const threatStyle = {
    '--threat-color': frame.color,
    '--threat-opacity': frame.opacity,
  } as CSSProperties;

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages, choices, busy]);

  const onSubmit = () => {
    submit(draft);
    setDraft('');
  };

  return (
    <div
      className="panel parchment threat-frame flex h-full flex-col overflow-hidden rounded-lg"
      style={threatStyle}
    >
      {/* En-tête de chapitre */}
      <div className="flex items-center justify-center gap-3 border-b border-ink/50 px-6 py-3">
        <span className="h-px w-10 bg-gradient-to-r from-transparent to-gold/40" />
        <span className="font-display text-[0.7rem] uppercase tracking-[0.34em] text-text-dim">
          La Nuit de Braise
        </span>
        <span className="h-px w-10 bg-gradient-to-l from-transparent to-gold/40" />
      </div>

      {/* Récit */}
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-6 py-5 sm:px-10">
        <div className="mx-auto max-w-2xl">
          {messages.map((m, i) => (
            <MessageView key={m.id} message={m} index={i} />
          ))}

          {busy && (
            <div className="my-4 flex items-center gap-2 text-text-dim">
              <motion.span
                className="size-1.5 rounded-full bg-gold"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
              <motion.span
                className="size-1.5 rounded-full bg-gold"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
              />
              <motion.span
                className="size-1.5 rounded-full bg-gold"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
              />
              <span className="ml-1 text-xs italic">le récit se déploie…</span>
            </div>
          )}

          {/* Choix — pas d'AnimatePresence bloquant : les choix ne peuvent
              jamais rester « collés » à l'écran si une sortie animée se fige. */}
          {choices.length > 0 && !busy && (
            <motion.div
              key={choices.map((c) => c.id).join('|')}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-5 space-y-2.5"
            >
              {choices.map((c) => (
                <ChoiceButton
                  key={c.id}
                  choice={c}
                  disabled={busy}
                  onClick={() => choose(c.id, c.label)}
                />
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Saisie immersive */}
      <div className="border-t border-ink/50 px-4 py-3 sm:px-8">
        <div className="mx-auto flex max-w-2xl items-end gap-2">
          <div className="relative flex-1">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  onSubmit();
                }
              }}
              rows={1}
              placeholder="Que fais-tu ?"
              className="max-h-28 w-full resize-none rounded-md border border-ink/70 bg-bg/50 px-4 py-2.5 font-body text-[0.97rem] text-text placeholder:text-text-dim/70 focus:border-gold/50 focus:outline-none"
            />
          </div>
          <button
            onClick={onSubmit}
            disabled={busy || !draft.trim()}
            className="grid size-11 shrink-0 place-items-center rounded-md border border-gold/40 bg-gold/10 text-gold transition-colors hover:border-gold/70 hover:bg-gold/20 disabled:opacity-30"
            aria-label="Agir"
          >
            <Icon name="travel" size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
