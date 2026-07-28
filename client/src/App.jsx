import React, { useState, useRef } from 'react';
import { InputForm } from './components/InputForm';
import { Flashcard } from './components/Flashcard';
import { Quiz } from './components/Quiz';
import { Loading } from './components/Loading';
import { ErrorMessage } from './components/ErrorMessage';
import { EmptyState } from './components/EmptyState';
import { SessionPanel } from './components/SessionPanel';
import { generateStudyMaterials } from './services/api';

export function App() {
  const [status, setStatus] = useState('idle');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('flashcards');
  const [lastSubmittedTopic, setLastSubmittedTopic] = useState('');
  const [lastDifficulty, setLastDifficulty] = useState('medium');

  const requestIdRef = useRef(0);
  const abortControllerRef = useRef(null);

  const isStudying = status === 'success' && data;
  const showInput = status === 'idle' || status === 'error';

  const handleGenerate = async ({ topic, difficulty, mockError }) => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
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

      if (currentRequestId !== requestIdRef.current) return;

      setData(result);
      setStatus('success');
      setActiveTab('flashcards');
    } catch (err) {
      if (err.name === 'AbortError') return;
      if (currentRequestId !== requestIdRef.current) return;
      setError(err.message || 'Failed to generate study materials.');
      setStatus('error');
    }
  };

  const handleCancel = () => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    setStatus('idle');
  };

  const handleRetry = () => {
    if (lastSubmittedTopic) {
      handleGenerate({ topic: lastSubmittedTopic, difficulty: lastDifficulty });
    } else {
      setStatus('idle');
    }
  };

  const handleNewTopic = () => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    setData(null);
    setError(null);
    setStatus('idle');
    setActiveTab('flashcards');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-[var(--color-line)] bg-[var(--color-surface)]/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-baseline gap-3 min-w-0">
            <h1 className="font-display text-2xl font-extrabold tracking-tight text-[var(--color-ink)]">
              Synapse
            </h1>
            <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink-faint)]">
              Study lab
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isStudying && (
              <button type="button" onClick={handleNewTopic} className="btn-ghost text-xs px-3 py-2">
                New topic
              </button>
            )}

            {import.meta.env.DEV && (
              <div className="hidden lg:flex items-center gap-1 font-mono text-[10px] text-[var(--color-ink-faint)]">
                {[
                  ['malformed', 'JSON'],
                  ['wrong_shape', 'Shape'],
                  ['slow', 'Slow'],
                ].map(([mock, label]) => (
                  <button
                    key={mock}
                    type="button"
                    onClick={() =>
                      handleGenerate({ topic: 'Test', difficulty: 'medium', mockError: mock })
                    }
                    className="px-2 py-1 border border-dashed border-[var(--color-line)] hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]"
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      <main
        className={`flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 ${
          isStudying ? 'py-6 pb-28 md:pb-10' : 'py-0'
        }`}
      >
        {!isStudying && (
          <section className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-12 items-start py-10 lg:py-14">
            <div className="lg:sticky lg:top-24">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-teal)] mb-4">
                From notes → usable tools
              </p>
              <h2 className="font-display text-4xl sm:text-5xl font-extrabold leading-[1.05] tracking-tight text-[var(--color-ink)]">
                Study like you <span className="mark mark-animate">mean it</span>
              </h2>
              <p className="mt-5 text-[var(--color-ink-soft)] text-base sm:text-lg leading-relaxed max-w-md">
                Paste a topic or lecture notes. Get index cards you can flip and a quiz that lets you
                retry what you missed — not a chat transcript.
              </p>

              {status === 'idle' && <EmptyState />}
            </div>

            <div>
              {showInput && (
                <InputForm
                  onSubmit={handleGenerate}
                  isLoading={status === 'loading'}
                  initialTopic={status === 'error' ? lastSubmittedTopic : ''}
                  initialDifficulty={lastDifficulty}
                />
              )}
              {status === 'loading' && (
                <Loading onCancel={handleCancel} topic={lastSubmittedTopic} />
              )}
              {status === 'error' && <ErrorMessage error={error} onRetry={handleRetry} />}
            </div>
          </section>
        )}

        {isStudying && (
          <div className="grid md:grid-cols-[220px_1fr] gap-6 items-start">
            <div className="hidden md:block">
              <SessionPanel
                variant="desktop"
                topic={lastSubmittedTopic}
                difficulty={lastDifficulty}
                flashcardCount={data.flashcards?.length || 0}
                quizCount={data.quiz?.length || 0}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onNewTopic={handleNewTopic}
              />
            </div>

            <div className="surface-raised p-5 sm:p-8 rise-in">
              {activeTab === 'flashcards' && <Flashcard flashcards={data.flashcards} />}
              {activeTab === 'quiz' && <Quiz quizQuestions={data.quiz} />}
            </div>
          </div>
        )}
      </main>

      {isStudying && (
        <SessionPanel
          variant="mobile"
          topic={lastSubmittedTopic}
          difficulty={lastDifficulty}
          flashcardCount={data.flashcards?.length || 0}
          quizCount={data.quiz?.length || 0}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onNewTopic={handleNewTopic}
        />
      )}

      <footer className="mt-auto border-t border-[var(--color-line)] py-5 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-ink-faint)]">
          Synapse · structured study, not chat
        </p>
      </footer>
    </div>
  );
}

export default App;
