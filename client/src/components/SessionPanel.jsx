import React from 'react';

const DIFFICULTY_LABEL = { easy: 'Intro', medium: 'Standard', hard: 'Deep' };

function truncate(text, max = 40) {
  if (!text) return 'Untitled session';
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

export function SessionPanel({
  topic,
  difficulty,
  flashcardCount,
  quizCount,
  activeTab,
  onTabChange,
  onNewTopic,
  variant = 'desktop',
}) {
  const tabs = [
    { id: 'flashcards', label: 'Cards', count: flashcardCount },
    { id: 'quiz', label: 'Quiz', count: quizCount },
  ];

  if (variant === 'mobile') {
    return (
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t border-[var(--color-line)] bg-[var(--color-surface)]/95 backdrop-blur-sm pb-[env(safe-area-inset-bottom)]"
        aria-label="Study modes"
      >
        <div className="flex">
          {tabs.map(({ id, label, count }) => (
            <button
              key={id}
              type="button"
              onClick={() => onTabChange(id)}
              className={`flex-1 py-3.5 text-center transition-colors ${
                activeTab === id
                  ? 'bg-[var(--color-mark)] font-bold text-[var(--color-ink)]'
                  : 'text-[var(--color-ink-soft)]'
              }`}
            >
              <span className="block text-xs">{label}</span>
              <span className="font-mono text-[10px] text-[var(--color-ink-faint)]">{count}</span>
            </button>
          ))}
          <button
            type="button"
            onClick={onNewTopic}
            className="px-5 py-3.5 text-xs font-semibold border-l border-[var(--color-line)] text-[var(--color-teal)]"
          >
            New
          </button>
        </div>
      </nav>
    );
  }

  return (
    <aside className="surface-raised p-4 sticky top-24">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-ink-faint)] mb-2">
        Session
      </p>
      <h2 className="font-display text-base font-bold leading-snug mb-2">{truncate(topic)}</h2>
      <span className="inline-block font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 bg-[var(--color-mist)] border border-[var(--color-line)] mb-5">
        {DIFFICULTY_LABEL[difficulty] || difficulty}
      </span>

      <div className="grid grid-cols-2 gap-2 mb-5">
        <div className="bg-[var(--color-mist)] p-3 border border-[var(--color-line)]">
          <p className="font-display text-2xl font-extrabold text-[var(--color-teal)]">{flashcardCount}</p>
          <p className="font-mono text-[9px] uppercase tracking-wider text-[var(--color-ink-faint)]">cards</p>
        </div>
        <div className="bg-[var(--color-mist)] p-3 border border-[var(--color-line)]">
          <p className="font-display text-2xl font-extrabold text-[var(--color-ink)]">{quizCount}</p>
          <p className="font-mono text-[9px] uppercase tracking-wider text-[var(--color-ink-faint)]">quiz</p>
        </div>
      </div>

      <div className="flex flex-col gap-1 mb-4">
        {tabs.map(({ id, label, count }) => (
          <button
            key={id}
            type="button"
            onClick={() => onTabChange(id)}
            className={`flex items-center justify-between px-3 py-2.5 text-sm rounded-[2px] transition-colors ${
              activeTab === id
                ? 'bg-[var(--color-teal)] text-white font-semibold'
                : 'text-[var(--color-ink-soft)] hover:bg-[var(--color-mist)]'
            }`}
          >
            <span>{label}</span>
            <span className="font-mono text-[10px] opacity-80">{count}</span>
          </button>
        ))}
      </div>

      <button type="button" onClick={onNewTopic} className="btn-ghost w-full text-xs py-2.5">
        + New topic
      </button>
    </aside>
  );
}
