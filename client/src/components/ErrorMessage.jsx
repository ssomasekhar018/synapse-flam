import React from 'react';

function friendlyError(raw) {
  const msg = typeof raw === 'string' ? raw : raw?.message || 'Something went wrong.';

  if (msg.includes('404') && msg.toLowerCase().includes('model')) {
    return {
      title: 'Model not available',
      detail:
        'The configured Gemini model is unavailable for your API key. Set GEMINI_MODEL=gemini-3.6-flash in .env, then stop and restart npm start (Ctrl+C first — the server does not hot-reload).',
      technical: msg,
    };
  }
  if (msg.includes('GEMINI_API_KEY')) {
    return {
      title: 'API key missing',
      detail: 'Add GEMINI_API_KEY to study-assistant/.env, then restart the server.',
      technical: msg,
    };
  }
  if (msg.includes('timed out') || msg.includes('20s')) {
    return {
      title: 'Request timed out',
      detail: 'The model took longer than 20s. Try a shorter topic, or retry.',
      technical: msg,
    };
  }
  if (msg.includes('Malformed JSON') || msg.includes('Validation error')) {
    return {
      title: "Couldn't parse AI output",
      detail: 'The model returned invalid structure. Retry usually fixes it.',
      technical: msg,
    };
  }
  if (msg.includes('Network error') || msg.includes('Failed to fetch')) {
    return {
      title: "Can't reach server",
      detail: 'Confirm npm start is running (client :1818, proxy :1819).',
      technical: msg,
    };
  }

  return {
    title: 'Generation failed',
    detail: "We couldn't build your study materials. Try again with a shorter topic.",
    technical: msg,
  };
}

export function ErrorMessage({ error, onRetry }) {
  const { title, detail, technical } = friendlyError(error);

  return (
    <div className="surface-raised p-6 sm:p-7 border-l-4 border-l-[var(--color-danger)]">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-danger)] mb-2">
        Error
      </p>
      <h3 className="font-display text-xl font-bold mb-2">{title}</h3>
      <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed mb-5">{detail}</p>

      <details className="mb-5">
        <summary className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-ink-faint)] cursor-pointer hover:text-[var(--color-ink)]">
          Technical details
        </summary>
        <pre className="mt-2 p-3 bg-[var(--color-mist)] border border-[var(--color-line)] text-[10px] font-mono text-[var(--color-ink-soft)] overflow-x-auto whitespace-pre-wrap break-words max-h-36 overflow-y-auto">
          {technical}
        </pre>
      </details>

      {onRetry && (
        <button type="button" onClick={onRetry} className="btn-teal text-sm px-6 py-2.5">
          Try again
        </button>
      )}
    </div>
  );
}
