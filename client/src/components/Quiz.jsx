import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, HelpCircle, Trophy, RefreshCw, ChevronRight, RotateCcw } from 'lucide-react';

export function Quiz({ quizQuestions = [] }) {
  const [questions, setQuestions] = useState(quizQuestions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState([]); // [{ questionIndex, selectedIndex, isCorrect }]
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    setQuestions(quizQuestions);
    setCurrentIndex(0);
    setSelectedOption(null);
    setAnswers([]);
    setIsCompleted(false);
  }, [quizQuestions]);

  if (!questions || questions.length === 0) return null;

  const currentQ = questions[currentIndex];

  const handleSelectOption = (index) => {
    if (selectedOption !== null) return; // Prevent changing answer after selection
    setSelectedOption(index);

    const isCorrect = index === currentQ.correctIndex;
    setAnswers((prev) => [
      ...prev,
      {
        question: currentQ,
        selectedIndex: index,
        isCorrect,
      },
    ]);
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestartFullQuiz = () => {
    setQuestions(quizQuestions);
    setCurrentIndex(0);
    setSelectedOption(null);
    setAnswers([]);
    setIsCompleted(false);
  };

  const handleRetryWrongAnswers = () => {
    const wrongQuestions = answers.filter((a) => !a.isCorrect).map((a) => a.question);
    if (wrongQuestions.length === 0) return;
    setQuestions(wrongQuestions);
    setCurrentIndex(0);
    setSelectedOption(null);
    setAnswers([]);
    setIsCompleted(false);
  };

  const scoreCount = answers.filter((a) => a.isCorrect).length;
  const wrongCount = answers.filter((a) => !a.isCorrect).length;
  const scorePercentage = Math.round((scoreCount / questions.length) * 100);

  // SUMMARY SCREEN AT END OF QUIZ
  if (isCompleted) {
    return (
      <div className="glass-panel rounded-2xl p-8 max-w-xl mx-auto my-6 border border-slate-800 text-center shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-indigo-500 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/20">
          <Trophy className="w-8 h-8" />
        </div>

        <h3 className="text-2xl font-bold text-slate-100 mb-1">Quiz Completed!</h3>
        <p className="text-xs text-slate-400 mb-6">Here is your performance summary:</p>

        {/* Score Ring / Badge */}
        <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 mb-6 flex items-center justify-around">
          <div>
            <span className="text-3xl font-extrabold text-indigo-400">{scorePercentage}%</span>
            <span className="block text-xs text-slate-400 mt-1">Final Score</span>
          </div>
          <div className="h-10 w-px bg-slate-800" />
          <div>
            <span className="text-xl font-bold text-emerald-400">{scoreCount}</span>
            <span className="block text-xs text-slate-400 mt-1">Correct</span>
          </div>
          <div className="h-10 w-px bg-slate-800" />
          <div>
            <span className="text-xl font-bold text-rose-400">{wrongCount}</span>
            <span className="block text-xs text-slate-400 mt-1">Incorrect</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {wrongCount > 0 && (
            <button
              type="button"
              onClick={handleRetryWrongAnswers}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white text-xs font-semibold shadow-lg shadow-rose-600/20 transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry {wrongCount} Wrong Answer{wrongCount > 1 ? 's' : ''} Only
            </button>
          )}

          <button
            type="button"
            onClick={handleRestartFullQuiz}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restart Full Quiz
          </button>
        </div>
      </div>
    );
  }

  // ACTIVE QUESTION SCREEN
  const isAnswered = selectedOption !== null;

  return (
    <div className="max-w-2xl mx-auto my-6 px-4">
      {/* Quiz Progress */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
          Question {currentIndex + 1} of {questions.length}
        </span>

        <span className="text-xs text-slate-400 font-mono">
          Score: {answers.filter((a) => a.isCorrect).length} / {answers.length}
        </span>
      </div>

      <div className="w-full bg-slate-900 h-1.5 rounded-full mb-6 overflow-hidden">
        <div
          className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="glass-panel rounded-2xl p-6 md:p-8 border border-slate-800 mb-6 shadow-xl">
        <h3 className="text-lg md:text-xl font-semibold text-slate-100 mb-6 leading-relaxed flex items-start gap-3">
          <HelpCircle className="w-6 h-6 text-purple-400 shrink-0 mt-0.5" />
          {currentQ.question}
        </h3>

        {/* Options List */}
        <div className="space-y-3">
          {currentQ.options.map((optionText, optIdx) => {
            const isSelected = selectedOption === optIdx;
            const isCorrect = optIdx === currentQ.correctIndex;

            let optionStyle = 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-indigo-500/50 hover:bg-slate-800/80';
            let icon = null;

            if (isAnswered) {
              if (isCorrect) {
                optionStyle = 'bg-emerald-950/60 border-emerald-500/80 text-emerald-200 font-semibold shadow-md shadow-emerald-500/10';
                icon = <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
              } else if (isSelected && !isCorrect) {
                optionStyle = 'bg-rose-950/60 border-rose-500/80 text-rose-200 font-semibold shadow-md shadow-rose-500/10';
                icon = <XCircle className="w-5 h-5 text-rose-400 shrink-0" />;
              } else {
                optionStyle = 'bg-slate-900/40 border-slate-800/60 text-slate-500 opacity-60';
              }
            }

            return (
              <button
                key={optIdx}
                type="button"
                onClick={() => handleSelectOption(optIdx)}
                disabled={isAnswered}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center justify-between gap-3 text-sm ${optionStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-400 text-xs font-mono flex items-center justify-center border border-slate-700 shrink-0">
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span>{optionText}</span>
                </div>
                {icon}
              </button>
            );
          })}
        </div>

        {/* Next Question Navigation */}
        {isAnswered && (
          <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="button"
              onClick={handleNextQuestion}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2"
            >
              {currentIndex < questions.length - 1 ? 'Next Question' : 'View Results'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
