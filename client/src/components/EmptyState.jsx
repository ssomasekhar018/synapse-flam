import React from 'react';
import { Layers, HelpCircle, CheckCircle2, ShieldCheck, Cpu } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="glass-panel rounded-2xl p-8 md:p-12 max-w-3xl mx-auto my-6 text-center border border-slate-800">
      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-6">
        <Layers className="w-8 h-8" />
      </div>

      <h2 className="text-2xl font-bold text-slate-100 mb-3">
        Ready to Transform Your Notes?
      </h2>
      <p className="text-slate-400 text-sm max-w-xl mx-auto mb-8 leading-relaxed">
        Enter any subject, exam topic, or paste raw notes above. Synapse will generate interactive 3D flashcards and a self-grading practice quiz in seconds.
      </p>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left border-t border-slate-800/80 pt-8">
        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/60">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3">
            <Layers className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-semibold text-slate-200 mb-1">Interactive Flashcards</h4>
          <p className="text-xs text-slate-400">3D flip cards with question & answer breakdown.</p>
        </div>

        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/60">
          <div className="w-8 h-8 rounded-lg bg-pink-500/10 text-pink-400 flex items-center justify-center mb-3">
            <HelpCircle className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-semibold text-slate-200 mb-1">Smart Quizzes</h4>
          <p className="text-xs text-slate-400">Multiple-choice testing with instant feedback & wrong-answer retries.</p>
        </div>

        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/60">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-semibold text-slate-200 mb-1">Validated Output</h4>
          <p className="text-xs text-slate-400">Zero raw AI chat text. Pure Zod-validated structured React data.</p>
        </div>
      </div>
    </div>
  );
}
