import React from 'react';

const STEPS = [
  { n: '01', title: 'Drop notes', body: 'Syllabus, messy lecture paste, or one clear topic.' },
  { n: '02', title: 'Flip cards', body: 'Question on front, answer on back — Space to flip.' },
  { n: '03', title: 'Quiz & retry', body: 'Instant feedback, then re-test only what you missed.' },
];

export function EmptyState() {
  return (
    <ol className="mt-10 space-y-0 border-t border-[var(--color-line)]">
      {STEPS.map(({ n, title, body }) => (
        <li
          key={n}
          className="grid grid-cols-[3rem_1fr] gap-3 py-4 border-b border-[var(--color-line)]"
        >
          <span className="font-mono text-sm text-[var(--color-teal)] pt-0.5">{n}</span>
          <div>
            <h3 className="font-display font-bold text-[var(--color-ink)]">{title}</h3>
            <p className="text-sm text-[var(--color-ink-soft)] mt-1 leading-relaxed">{body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
