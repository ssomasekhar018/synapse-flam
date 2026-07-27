import React, { useState } from 'react';
import { Sparkles, BookOpen, Layers, Flame, Zap } from 'lucide-react';

const PRESET_TOPICS = [
  { label: 'Photosynthesis', difficulty: 'easy' },
  { label: 'JavaScript Async & Promises', difficulty: 'medium' },
  { label: 'Quantum Physics Principles', difficulty: 'hard' },
  { label: 'Cellular Respiration & ATP', difficulty: 'medium' },
];

export function InputForm({ onSubmit, isLoading }) {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('medium');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!topic.trim() || isLoading) return;
    onSubmit({ topic: topic.trim(), difficulty });
  };

  const handleSelectPreset = (preset) => {
    setTopic(preset.label);
    setDifficulty(preset.difficulty);
  };

  return (
    <div className="glass-panel rounded-2xl p-6 md:p-8 max-w-3xl mx-auto mb-10 transition-all duration-300">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="topic-input" className="block text-sm font-semibold text-slate-200 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              Enter Topic or Paste Notes
            </label>
            <span className="text-xs text-slate-400">
              {topic.length} characters
            </span>
          </div>
          <textarea
            id="topic-input"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Photosynthesis, Neural Networks, Docker Containerization, or paste your lecture notes here..."
            disabled={isLoading}
            rows={4}
            className="w-full bg-slate-900/80 border border-slate-700/70 rounded-xl p-4 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200 resize-y text-sm leading-relaxed"
          />
        </div>

        {/* Preset Chips */}
        <div>
          <span className="text-xs font-medium text-slate-400 block mb-2">Quick Presets:</span>
          <div className="flex flex-wrap gap-2">
            {PRESET_TOPICS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                disabled={isLoading}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300 hover:text-white transition-all duration-150 flex items-center gap-1.5 disabled:opacity-50"
              >
                <Zap className="w-3 h-3 text-amber-400" />
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2 border-t border-slate-800">
          {/* Difficulty Selector */}
          <div>
            <span className="text-xs font-semibold text-slate-300 block mb-2 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              Difficulty Level
            </span>
            <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
              {['easy', 'medium', 'hard'].map((level) => {
                const isActive = difficulty === level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setDifficulty(level)}
                    disabled={isLoading}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all duration-200 ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    } disabled:opacity-50`}
                  >
                    {level}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!topic.trim() || isLoading}
            className="self-end sm:self-auto px-6 py-3 rounded-xl font-medium text-sm bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
          >
            <Sparkles className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Generating Materials...' : 'Generate Learning Materials'}
          </button>
        </div>
      </form>
    </div>
  );
}
