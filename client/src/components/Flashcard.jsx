import React, { useState, useEffect } from 'react';
import { RotateCw, ChevronLeft, ChevronRight, Shuffle, Eye, EyeOff, Award } from 'lucide-react';

export function Flashcard({ flashcards = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [deck, setDeck] = useState(flashcards);

  // Sync deck if flashcards prop updates
  useEffect(() => {
    setDeck(flashcards);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [flashcards]);

  if (!deck || deck.length === 0) return null;

  const currentCard = deck[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % deck.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + deck.length) % deck.length);
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIndex(0);
  };

  const toggleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  // Accessibility keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      toggleFlip();
    } else if (e.key === 'ArrowRight') {
      handleNext();
    } else if (e.key === 'ArrowLeft') {
      handlePrev();
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-6 px-4">
      {/* Top Header / Progress */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            Card {currentIndex + 1} of {deck.length}
          </span>
          <span className="text-xs text-slate-400">
            Press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300">Space</kbd> to flip
          </span>
        </div>

        <button
          type="button"
          onClick={handleShuffle}
          className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 transition-all hover:bg-slate-800"
          title="Shuffle Deck"
        >
          <Shuffle className="w-3.5 h-3.5" />
          Shuffle
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-900 h-1.5 rounded-full mb-6 overflow-hidden">
        <div
          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / deck.length) * 100}%` }}
        />
      </div>

      {/* Interactive 3D Flip Card Container */}
      <div
        tabIndex={0}
        role="button"
        aria-label={`Flashcard ${currentIndex + 1}: ${isFlipped ? 'Answer' : 'Question'}. Click or press space to flip.`}
        onClick={toggleFlip}
        onKeyDown={handleKeyDown}
        className="perspective-1000 w-full h-80 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/50 rounded-2xl group"
      >
        <div
          className={`relative w-full h-full duration-500 transform-style-3d transition-transform ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* FRONT (Question) */}
          <div className="absolute inset-0 w-full h-full backface-hidden glass-panel rounded-2xl p-8 flex flex-col justify-between border border-indigo-500/30 group-hover:border-indigo-500/60 transition-colors shadow-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs uppercase tracking-wider font-semibold">
              <span className="flex items-center gap-1.5 text-indigo-400">
                <RotateCw className="w-3.5 h-3.5" />
                Question
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <Eye className="w-3.5 h-3.5" />
                Click to reveal answer
              </span>
            </div>

            <div className="my-auto text-center px-4">
              <h3 className="text-xl md:text-2xl font-bold text-slate-100 leading-relaxed">
                {currentCard.question}
              </h3>
            </div>

            <div className="text-center text-xs text-indigo-300 font-medium">
              Tap card to flip over ↺
            </div>
          </div>

          {/* BACK (Answer) */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 glass-panel rounded-2xl p-8 flex flex-col justify-between border border-purple-500/40 bg-slate-900/90 shadow-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs uppercase tracking-wider font-semibold">
              <span className="flex items-center gap-1.5 text-purple-400">
                <Award className="w-3.5 h-3.5" />
                Answer & Explanation
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <EyeOff className="w-3.5 h-3.5" />
                Click to flip back
              </span>
            </div>

            <div className="my-auto text-center px-4">
              <p className="text-lg md:text-xl font-medium text-purple-100 leading-relaxed">
                {currentCard.answer}
              </p>
            </div>

            <div className="text-center text-xs text-purple-300 font-medium">
              Tap card to view question ↺
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between mt-6">
        <button
          type="button"
          onClick={handlePrev}
          className="px-5 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 transition-all duration-200 flex items-center gap-2 text-sm font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        <span className="text-xs text-slate-400 font-mono">
          Use ← / → arrow keys
        </span>

        <button
          type="button"
          onClick={handleNext}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all duration-200 flex items-center gap-2 text-sm font-medium"
        >
          Next Card
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
