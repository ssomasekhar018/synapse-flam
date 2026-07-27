import React, { useState, useRef } from 'react';
import { Sparkles, Layers, HelpCircle, Bug, RefreshCw, BookOpenCheck } from 'lucide-react';
import { InputForm } from './components/InputForm';
import { Flashcard } from './components/Flashcard';
import { Quiz } from './components/Quiz';
import { Loading } from './components/Loading';
import { ErrorMessage } from './components/ErrorMessage';
import { EmptyState } from './components/EmptyState';
import { generateStudyMaterials } from './services/api';

export function App() {
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [data, setData] = useState(null); // { flashcards: [], quiz: [] }
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('flashcards'); // 'flashcards' | 'quiz'
  const [lastSubmittedTopic, setLastSubmittedTopic] = useState('');
  const [lastDifficulty, setLastDifficulty] = useState('medium');

  // Race condition guard ref & AbortController ref
  const requestIdRef = useRef(0);
  const abortControllerRef = useRef(null);

  const handleGenerate = async ({ topic, difficulty, mockError }) => {
    // 1. Race condition guard: Cancel previous pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const currentRequestId = ++requestIdRef.current;

    setStatus('loading');
    setError(null);
    setLastSubmittedTopic(topic);
    setLastDifficulty(difficulty);

    try {
      const result = await generateStudyMaterials({
        topic,
        difficulty,
        mockError,
        signal: controller.signal,
      });

      // 2. Race condition guard: Ignore stale response if a newer request was dispatched
      if (currentRequestId !== requestIdRef.current) {
        console.warn(`[Race Guard] Discarded stale response for request #${currentRequestId}`);
        return;
      }

      setData(result);
      setStatus('success');
      setActiveTab('flashcards');
    } catch (err) {
      // Ignore abort errors from race cancellation
      if (err.name === 'AbortError') {
        console.warn(`[Race Guard] Request #${currentRequestId} aborted due to newer submission.`);
        return;
      }

      if (currentRequestId !== requestIdRef.current) return;

      setError(err.message || 'Failed to generate study materials.');
      setStatus('error');
    }
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setStatus('idle');
  };

  const handleRetry = () => {
    if (lastSubmittedTopic) {
      handleGenerate({ topic: lastSubmittedTopic, difficulty: lastDifficulty });
    } else {
      setStatus('idle');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Top Header Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                Synapse
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-widest">
                  AI Study Assistant
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                Transform notes into interactive learning experiences with AI
              </p>
            </div>
          </div>

          {/* Quick Mock Testing Controls for Reviewers / Live Interview (Dev Mode Only) */}
          {import.meta.env.DEV && (
            <div className="hidden md:flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800 text-xs">
              <span className="text-[11px] text-slate-400 font-semibold px-2 flex items-center gap-1">
                <Bug className="w-3.5 h-3.5 text-amber-400" />
                Edge-Case Testing:
              </span>
              <button
                type="button"
                onClick={() => handleGenerate({ topic: 'Test Malformed', difficulty: 'medium', mockError: 'malformed' })}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition-colors"
                title="Test Malformed JSON output handling"
              >
                Malformed
              </button>
              <button
                type="button"
                onClick={() => handleGenerate({ topic: 'Test Wrong Shape', difficulty: 'medium', mockError: 'wrong_shape' })}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition-colors"
                title="Test Zod Schema rejection"
              >
                Wrong Shape
              </button>
              <button
                type="button"
                onClick={() => handleGenerate({ topic: 'Test Slow Timeout', difficulty: 'medium', mockError: 'slow' })}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition-colors"
                title="Test 20s Client Timeout"
              >
                Timeout (20s)
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 py-8 flex-1 w-full">
        {/* Input Section (Always accessible) */}
        <InputForm onSubmit={handleGenerate} isLoading={status === 'loading'} />

        {/* View Switcher based on status */}
        {status === 'idle' && <EmptyState />}

        {status === 'loading' && <Loading onCancel={handleCancel} />}

        {status === 'error' && <ErrorMessage error={error} onRetry={handleRetry} />}

        {status === 'success' && data && (
          <div className="space-y-6">
            {/* View Tab Switcher (Flashcards vs Quiz) */}
            <div className="flex justify-center mb-4">
              <div className="bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 inline-flex items-center gap-2 shadow-lg">
                <button
                  type="button"
                  onClick={() => setActiveTab('flashcards')}
                  className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 ${
                    activeTab === 'flashcards'
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  Flashcards ({data.flashcards?.length || 0})
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('quiz')}
                  className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 ${
                    activeTab === 'quiz'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <HelpCircle className="w-4 h-4" />
                  Practice Quiz ({data.quiz?.length || 0})
                </button>
              </div>
            </div>

            {/* Render Active View */}
            {activeTab === 'flashcards' && <Flashcard flashcards={data.flashcards} />}
            {activeTab === 'quiz' && <Quiz quizQuestions={data.quiz} />}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-6 text-center text-xs text-slate-500">
        <p className="flex items-center justify-center gap-1.5">
          <BookOpenCheck className="w-4 h-4 text-indigo-400" />
          Synapse AI Study Assistant • Built with React, Tailwind CSS, Zod & Gemini AI Proxy
        </p>
      </footer>
    </div>
  );
}

export default App;
