import React, { useState, useEffect } from 'react';

const STEPS = [
  'Reading your notes',
  'Marking key ideas',
  'Writing flashcards',
  'Drafting quiz items',
  'Packing your session',
];

function truncate(text, max = 40) {
  if (!text) return 'your topic';
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

export function Loading({ onCancel, topic }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setStep((s) => (s + 1) % STEPS.length), 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="surface-raised p-8 text-center">
      <div className="mx-auto mb-5 h-1.5 w-24 overflow-hidden rounded-full bg-[var(--color-mist-deep)]">
        <div
          className="h-full bg-[var(--color-teal)] transition-all duration-500"
          style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
        />
      </div>

      <h3 className="font-display text-xl font-bold mb-1">Building your session</h3>
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-faint)] mb-6">
        {truncate(topic)}
      </p>

      <p className="text-sm text-[var(--color-ink-soft)] mb-8 h-5">{STEPS[step]}…</p>

      {onCancel && (
        <button type="button" onClick={onCancel} className="btn-ghost text-xs px-5 py-2">
          Cancel
        </button>
      )}
    </div>
  );
}
