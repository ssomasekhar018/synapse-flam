import React, { useState, useEffect } from 'react';

export function Quiz({ quizQuestions = [] }) {
  const [questions, setQuestions] = useState(quizQuestions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setQuestions(quizQuestions);
    setCurrentIndex(0);
    setSelected(null);
    setAnswers([]);
    setDone(false);
  }, [quizQuestions]);

  if (!questions?.length) return null;

  const q = questions[currentIndex];
  const answered = selected !== null;
  const correct = answers.filter((a) => a.isCorrect).length;
  const wrong = answers.filter((a) => !a.isCorrect).length;

  const pick = (idx) => {
    if (answered) return;
    setSelected(idx);
    setAnswers((prev) => [
      ...prev,
      { question: q, selectedIndex: idx, isCorrect: idx === q.correctIndex },
    ]);
  };

  const next = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelected(null);
    } else {
      setDone(true);
    }
  };

  const restart = () => {
    setQuestions(quizQuestions);
    setCurrentIndex(0);
    setSelected(null);
    setAnswers([]);
    setDone(false);
  };

  const retryWrong = () => {
    const missed = answers.filter((a) => !a.isCorrect).map((a) => a.question);
    if (!missed.length) return;
    setQuestions(missed);
    setCurrentIndex(0);
    setSelected(null);
    setAnswers([]);
    setDone(false);
  };

  if (done) {
    const pct = Math.round((correct / questions.length) * 100);
    return (
      <div className="max-w-lg mx-auto text-center py-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-ink-faint)] mb-3">
          Results
        </p>
        <h3 className="font-display text-5xl font-extrabold mb-2">
          <span className="mark">{pct}%</span>
        </h3>
        <p className="text-sm text-[var(--color-ink-soft)] mb-8">
          {correct} correct · {wrong} missed
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {wrong > 0 && (
            <button type="button" onClick={retryWrong} className="btn-teal text-sm px-6 py-3">
              Retry {wrong} missed
            </button>
          )}
          <button type="button" onClick={restart} className="btn-ghost text-sm px-6 py-3">
            Full retake
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-baseline justify-between mb-3">
        <span className="font-mono text-xs text-[var(--color-ink-soft)]">
          Q{currentIndex + 1} / {questions.length}
        </span>
        <span className="font-mono text-xs text-[var(--color-ink-faint)]">
          Score {correct}/{answers.length}
        </span>
      </div>

      <div className="progress-rail mb-6">
        <div
          className="progress-fill"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      <h3 className="font-display text-xl sm:text-2xl font-bold leading-snug mb-6 pl-4 border-l-4 border-[var(--color-mark)]">
        {q.question}
      </h3>

      <div className="space-y-2">
        {q.options.map((opt, idx) => {
          const isSelected = selected === idx;
          const isCorrect = idx === q.correctIndex;
          let style =
            'border border-[var(--color-line)] bg-white hover:border-[var(--color-ink)] hover:bg-[var(--color-mark-soft)]';

          if (answered) {
            if (isCorrect) style = 'border border-[var(--color-teal)] bg-[var(--color-mark-soft)] font-semibold';
            else if (isSelected) style = 'border border-[var(--color-danger)] bg-[#fdf2f2]';
            else style = 'border border-[var(--color-line)] bg-[var(--color-mist)] opacity-50';
          }

          return (
            <button
              key={idx}
              type="button"
              disabled={answered}
              onClick={() => pick(idx)}
              className={`w-full text-left p-4 flex items-start gap-3 rounded-[2px] transition-colors ${style}`}
            >
              <span className="option-letter">{String.fromCharCode(65 + idx)}</span>
              <span className="text-sm leading-relaxed pt-0.5">{opt}</span>
            </button>
          );
        })}
      </div>

      {answered && (
        <div className="mt-6 flex justify-end">
          <button type="button" onClick={next} className="btn-teal text-sm px-6 py-2.5">
            {currentIndex < questions.length - 1 ? 'Next question' : 'See results'}
          </button>
        </div>
      )}
    </div>
  );
}
