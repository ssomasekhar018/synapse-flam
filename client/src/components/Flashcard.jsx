import React, { useState, useEffect } from 'react';

export function Flashcard({ flashcards = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [deck, setDeck] = useState(flashcards);

  useEffect(() => {
    setDeck(flashcards);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [flashcards]);

  if (!deck?.length) return null;

  const card = deck[currentIndex];

  const go = (dir) => {
    setIsFlipped(false);
    setCurrentIndex((i) =>
      dir === 'next' ? (i + 1) % deck.length : (i - 1 + deck.length) % deck.length
    );
  };

  const shuffle = () => {
    setIsFlipped(false);
    setDeck([...deck].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
  };

  const onKeyDown = (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      setIsFlipped((f) => !f);
    } else if (e.key === 'ArrowRight') go('next');
    else if (e.key === 'ArrowLeft') go('prev');
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center justify-between gap-3 mb-4">
        <span className="font-mono text-xs text-[var(--color-ink-soft)]">
          {currentIndex + 1} / {deck.length}
        </span>
        <button
          type="button"
          onClick={shuffle}
          className="font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 border border-[var(--color-line)] hover:bg-[var(--color-mark-soft)] transition-colors rounded-[2px]"
        >
          Shuffle
        </button>
      </div>

      <div className="progress-rail mb-6">
        <div
          className="progress-fill"
          style={{ width: `${((currentIndex + 1) / deck.length) * 100}%` }}
        />
      </div>

      <div key={currentIndex} className="card-stage rise-in mb-6">
        <div
          tabIndex={0}
          role="button"
          aria-label={`Card ${currentIndex + 1}. ${isFlipped ? 'Answer' : 'Question'}. Space to flip.`}
          onClick={() => setIsFlipped((f) => !f)}
          onKeyDown={onKeyDown}
          className="perspective-1000 w-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-teal)] focus-visible:ring-offset-4"
        >
          <div
            className={`relative w-full duration-500 transform-style-3d transition-transform ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
            style={{ minHeight: '18rem' }}
          >
            <div className="absolute inset-0 backface-hidden study-card p-7 pl-10 flex flex-col">
              <div className="study-card-spine" aria-hidden="true" />
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink-faint)] mb-auto">
                Question
              </p>
              <p className="font-display text-xl sm:text-2xl font-bold text-center leading-snug px-2">
                {card.question}
              </p>
              <p className="font-mono text-[10px] text-[var(--color-ink-faint)] text-center mt-auto">
                Tap or Space to flip
              </p>
            </div>

            <div className="absolute inset-0 backface-hidden rotate-y-180 study-card p-7 pl-10 flex flex-col bg-[var(--color-surface)]">
              <div className="study-card-spine" aria-hidden="true" />
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-teal)] mb-auto">
                Answer
              </p>
              <p className="text-base sm:text-lg text-center leading-relaxed px-2 text-[var(--color-ink)]">
                {card.answer}
              </p>
              <p className="font-mono text-[10px] text-[var(--color-ink-faint)] text-center mt-auto">
                ← → to move
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between gap-3">
        <button type="button" onClick={() => go('prev')} className="btn-ghost text-sm px-5 py-2.5">
          ← Prev
        </button>
        <button type="button" onClick={() => go('next')} className="btn-teal text-sm px-5 py-2.5">
          Next →
        </button>
      </div>
    </div>
  );
}
