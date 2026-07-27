# Synapse — AI Interactive Study Assistant

> Transform notes into interactive learning experiences with AI.

Synapse is a production-quality, interview-ready React application that converts study notes or topics into interactive 3D flashcards and multiple-choice quizzes. Built with strict defensive architectural principles, **Synapse never renders raw AI chat text directly**. All model responses are routed through a secure backend proxy server and validated via Zod schema enforcement on the client before entering React state.

---

## 🏗️ Architecture & Key Engineering Decisions

### 1. Secure Serverless Backend Proxy (`server/api/generate.js`)
- **API Key Protection**: The `GEMINI_API_KEY` is maintained strictly within server-side environment variables and is never exposed to browser bundles.
- **Vercel / Express Compatibility**: Written with standard `(req, res)` signature compatible both as a Vercel Serverless Function and locally via Express.

### 2. Strict Zod Response Contract (`client/src/utils/validateResponse.js`)
- Enforces JSON payload shape:
  ```json
  {
    "flashcards": [{ "question": "string", "answer": "string" }],
    "quiz": [{ "question": "string", "options": ["a", "b", "c", "d"], "correctIndex": 0 }]
  }
  ```
- Validates semantic integrity: `correctIndex` must be an integer within bounds (`0 <= correctIndex < options.length`).

### 3. Sanitization & Defensive Parsing (`client/src/utils/parseAIResponse.js`)
- Automatically strips accidental markdown fences (` ```json `), extracts clean JSON bounds, parses string into JSON, and passes payload through Zod validation.
- Failed parses or schema violations trigger a clean `ErrorMessage` UI with actionable retry triggers instead of application crashes.

### 4. Network Race-Condition Safety (`client/src/App.jsx`)
- Uses request tracking (`requestIdRef`) combined with `AbortController`.
- If a user rapidly submits a new topic before an older request resolves, the older network request is aborted and out-of-order responses are safely discarded.

### 5. 20-Second Client Timeout (`client/src/services/api.js`)
- Enforces a 20s timeout limit using `AbortSignal`. On timeout, the app degrades gracefully with a "taking longer than expected" notification.

---

## 📁 Project Structure

```
study-assistant/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Flashcard.jsx       # 3D Flip Card component with keyboard nav
│   │   │   ├── Quiz.jsx            # Dynamic quiz engine with wrong-answer retry
│   │   │   ├── InputForm.jsx       # Topic input form, difficulty badges & presets
│   │   │   ├── Loading.jsx         # Step-based animated loading state
│   │   │   ├── ErrorMessage.jsx    # Graceful error handler & retry trigger
│   │   │   └── EmptyState.jsx      # Feature landing state
│   │   ├── services/
│   │   │   └── api.js              # Network service with timeout & AbortController
│   │   ├── utils/
│   │   │   ├── parseAIResponse.js  # Fence stripping & defensive parser
│   │   │   └── validateResponse.js # Zod schema enforcement
│   │   ├── App.jsx                 # Application state container & race guard
│   │   └── main.jsx                # Vite React entry point
│   └── package.json
├── server/
│   ├── api/
│   │   └── generate.js             # Vercel serverless / Express proxy handler
│   └── index.js                    # Local Express server runner
├── README.md
├── .env.example
└── package.json
```

---

## 🚀 Quick Start & Setup

### Prerequisites
- Node.js (v18 or higher recommended)
- Gemini API Key (Get a free key at [Google AI Studio](https://aistudio.google.com/))

### 1. Clone & Install Dependencies

```bash
cd study-assistant

# Install root & server dependencies
npm install

# Install client dependencies
cd client && npm install && cd ..
```

### 2. Environment Setup

Create a `.env` file in the root `study-assistant/` directory (or use `.env.example` as reference):

```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
PORT=3001
```

### 3. Run Development Server

```bash
# Run Express proxy server & Vite client concurrently:
npm run dev
```

- **Client App**: Runs on `http://localhost:5173`
- **Backend Proxy**: Runs on `http://localhost:3001` (Vite automatically proxies `/api/generate` to port 3001)

---

## 🧪 Edge-Case & Verification Testing

Synapse includes an interactive **Edge-Case Testing Toolbar** directly in the UI header (visible in development) to test and verify defensive error handling:

1. **Malformed JSON Test**: Server returns malformed JSON syntax. Verified: `ErrorMessage.jsx` displays parse error badge and Retry button.
2. **Wrong Shape / Out-of-Bounds Test**: Server returns `{ correctIndex: 99 }`. Verified: Zod schema rejects payload, app prevents partial rendering.
3. **Slow Timeout Test**: Server delays response by 25s. Verified: Client 20s `AbortSignal` triggers timeout message.
4. **Race Condition Test**: Rapidly submit 3 topics back-to-back. Verified: `AbortController` cancels previous requests, and only the latest request's output renders.
5. **Offline Network Failure**: Disconnect network in browser DevTools. Verified: Network error caught cleanly without crashing React tree.

---

## 🤖 Honest AI-Usage Disclosure

During the development of Synapse:
- **AI Tools Used**: Gemini 3.6 Flash (High) via Antigravity IDE for scaffolding component boilerplate, drafting Zod schema rules, refining Tailwind CSS glassmorphic utility classes, and structuring edge-case unit test scenarios.
- **Human Guidance & Review**: All architectural patterns (backend proxying, request ID race guards, step-by-step state machine, Zod validation bounds) were designed and verified to ensure live interview quality.

---

## ⚠️ Known Limitations

1. **Gemini Free Tier Rate Limits**: Free tier keys are subject to requests-per-minute limits. Rate limit responses are caught by `ErrorMessage.jsx`.
2. **Local Cors / Proxying**: In local development, Express listens on port 3001 with Vite proxying. For Vercel production deployments, Vercel natively serves `/api/generate.js` as a serverless route alongside static Vite assets.

---

## ⏱️ Time Spent Breakdown (~6.5 Hours Total)

- **Scaffolding & Server Proxy setup**: 45 mins
- **Zod Schema & Parser validation**: 45 mins
- **Input Flow & Loading states**: 1 hour
- **Interactive 3D Flashcards**: 1.25 hours
- **Quiz Engine with Retry Wrong Answers**: 1.25 hours
- **Race Condition Guard & Timeout Safety**: 45 mins
- **Testing Pass & README Documentation**: 45 mins
