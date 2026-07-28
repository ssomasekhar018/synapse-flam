import React, { useState } from 'react';

const PRESETS = [
  { label: 'Photosynthesis', difficulty: 'easy' },
  { label: 'JS Promises & async', difficulty: 'medium' },
  { label: 'World War II causes', difficulty: 'medium' },
  { label: 'Quantum entanglement', difficulty: 'hard' },
];

const DIFFICULTIES = [
  { id: 'easy', label: 'Intro', hint: 'Foundations' },
  { id: 'medium', label: 'Standard', hint: 'Exam pace' },
  { id: 'hard', label: 'Deep', hint: 'Tough checks' },
];

export function InputForm({ onSubmit, isLoading, initialTopic = '', initialDifficulty = 'medium' }) {
  const [topic, setTopic] = useState(initialTopic);
  const [difficulty, setDifficulty] = useState(initialDifficulty);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!topic.trim() || isLoading) return;
    onSubmit({ topic: topic.trim(), difficulty });
  };

  return (
    <form onSubmit={handleSubmit} className="surface-raised p-6 sm:p-7 space-y-6">
      <div>
        <label htmlFor="topic-input" className="font-display text-lg font-bold block mb-3">
          What are you studying?
        </label>
        <textarea
          id="topic-input"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Paste lecture notes, a chapter summary, or type a topic…"
          disabled={isLoading}
          rows={6}
          className="w-full bg-[var(--color-mist)] border border-[var(--color-line)] rounded-[2px] px-4 py-3 text-sm leading-relaxed text-[var(--color-ink)] placeholder:text-[var(--color-ink-faint)] focus:outline-none focus:border-[var(--color-teal)] focus:ring-2 focus:ring-[var(--color-mark)] resize-y"
        />
        <p className="font-mono text-[10px] text-[var(--color-ink-faint)] mt-2 text-right">
          {topic.length} chars
        </p>
      </div>

      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-ink-faint)] mb-2">
          Quick starts
        </p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              disabled={isLoading}
              onClick={() => {
                setTopic(p.label);
                setDifficulty(p.difficulty);
              }}
              className="text-xs px-3 py-1.5 bg-white border border-[var(--color-line)] hover:border-[var(--color-ink)] hover:bg-[var(--color-mark-soft)] transition-colors disabled:opacity-40 rounded-[2px]"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-ink-faint)] mb-2">
          Difficulty
        </p>
        <div className="grid grid-cols-3 gap-2">
          {DIFFICULTIES.map(({ id, label, hint }) => {
            const active = difficulty === id;
            return (
              <button
                key={id}
                type="button"
                disabled={isLoading}
                onClick={() => setDifficulty(id)}
                className={`text-left p-3 border rounded-[2px] transition-colors disabled:opacity-40 ${
                  active
                    ? 'border-[var(--color-ink)] bg-[var(--color-mark)]'
                    : 'border-[var(--color-line)] bg-white hover:border-[var(--color-ink-soft)]'
                }`}
              >
                <span className="block text-sm font-semibold">{label}</span>
                <span className="block text-[11px] text-[var(--color-ink-faint)] mt-0.5">{hint}</span>
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="submit"
        disabled={!topic.trim() || isLoading}
        className="btn-teal w-full sm:w-auto px-7 py-3.5 text-sm"
      >
        {isLoading ? 'Building materials…' : 'Generate study materials'}
      </button>
    </form>
  );
}
