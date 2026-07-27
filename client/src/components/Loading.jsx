import React, { useState, useEffect } from 'react';
import { Loader2, Sparkles, Brain, XCircle } from 'lucide-react';

const LOADING_STEPS = [
  'Analyzing study topic and context...',
  'Extracting core concepts & key definitions...',
  'Generating interactive flashcard deck...',
  'Constructing validated multiple-choice quiz...',
  'Applying JSON schema integrity checks...',
];

export function Loading({ onCancel }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev + 1) % LOADING_STEPS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-panel rounded-2xl p-10 max-w-xl mx-auto my-12 text-center border border-indigo-500/20 shadow-2xl relative overflow-hidden">
      {/* Background glow animation */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-700" />

      <div className="relative z-10 flex flex-col items-center">
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 animate-bounce">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-slate-900 rounded-full p-1.5 border border-slate-700">
            <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
          </div>
        </div>

        <h3 className="text-xl font-bold text-slate-100 mb-2 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          AI Learning Engine Working
        </h3>

        <div className="h-6 overflow-hidden mb-6">
          <p className="text-sm font-medium text-indigo-300 transition-all duration-500 animate-fade-in">
            {LOADING_STEPS[currentStepIndex]}
          </p>
        </div>

        {/* Skeleton pulse preview */}
        <div className="w-full max-w-sm space-y-3 mb-8">
          <div className="h-3 bg-slate-800/80 rounded-full w-full animate-pulse" />
          <div className="h-3 bg-slate-800/60 rounded-full w-4/5 mx-auto animate-pulse delay-150" />
          <div className="h-3 bg-slate-800/40 rounded-full w-2/3 mx-auto animate-pulse delay-300" />
        </div>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-slate-300 hover:text-white border border-slate-700 transition-all duration-200"
          >
            <XCircle className="w-4 h-4 text-slate-400" />
            Cancel Generation
          </button>
        )}
      </div>
    </div>
  );
}
