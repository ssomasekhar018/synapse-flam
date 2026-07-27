import React from 'react';
import { AlertTriangle, RefreshCw, AlertCircle, ShieldAlert } from 'lucide-react';

export function ErrorMessage({ error, onRetry }) {
  const errorMessage = typeof error === 'string' ? error : error?.message || 'An unexpected error occurred.';

  return (
    <div className="glass-panel rounded-2xl p-8 max-w-xl mx-auto my-8 border border-rose-500/30 bg-rose-950/20 shadow-2xl relative overflow-hidden">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-100 mb-1 flex items-center gap-2">
            Generation Error
          </h3>
          <p className="text-xs text-rose-300 font-medium mb-3">
            The AI response could not be transformed into valid study materials.
          </p>

          <div className="bg-slate-950/80 p-3 rounded-lg border border-rose-900/40 text-xs font-mono text-slate-300 mb-4 break-words leading-relaxed max-h-36 overflow-y-auto">
            {errorMessage}
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              Raw AI text blocked for safety
            </span>

            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-rose-600/20 transition-all duration-200 flex items-center gap-1.5 active:scale-95"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retry Generation
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
