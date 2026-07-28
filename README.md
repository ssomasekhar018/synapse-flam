# 🧠 Synapse — AI Interactive Study Assistant

> Transform notes into interactive flashcards and quizzes with AI.

[![React](https://img.shields.io/badge/React-19-blue?logo=react)]()
[![Vite](https://img.shields.io/badge/Vite-8-purple?logo=vite)]()
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38BDF8?logo=tailwindcss)]()
[![Gemini](https://img.shields.io/badge/Gemini-3.6_Flash-orange)]()
[![Zod](https://img.shields.io/badge/Zod-Validation-3E67B1)]()

## 🔗 Live Demo

🌐 **Production:** [https://synapse-flam-two.vercel.app/](https://synapse-flam-two.vercel.app/)

📦 **Repository:** [https://github.com/ssomasekhar018/synapse-flam](https://github.com/ssomasekhar018/synapse-flam)

---

## 📖 Overview

Synapse is an AI-powered study assistant that converts topics or lecture notes into interactive flashcards and self-grading quizzes.

Unlike a traditional AI chatbot, Synapse **never renders raw LLM output directly**. Every response is routed through a secure backend proxy, parsed, validated using Zod, and only then rendered as structured React components.

The project focuses on reliability, defensive programming, and robust frontend architecture.

---

## ✨ Features

- 🤖 **AI-Powered Material Generation**: Generates contextual flashcards and quizzes via Gemini API.
- 📚 **Interactive Flashcards**: 3D flip card deck with question front and answer back, complete with keyboard controls.
- 📝 **Multiple-Choice Quiz Engine**: Self-grading quiz interface with immediate choice feedback and score tracking.
- 🔄 **Retry Wrong Answers Only**: Dynamically filter and re-quiz only questions missed during the previous attempt.
- ⚡ **Fast React + Vite Frontend**: Rapid component-driven state updates.
- 🔒 **Backend API Proxy**: Server-side proxy hides `GEMINI_API_KEY` from client bundles.
- ✅ **Strict Zod Validation**: Enforces exact JSON shape and bounds (`0 <= correctIndex < options.length`).
- 🛡 **Graceful Malformed Output Handling**: Strips fences, catches parse errors, and displays user-friendly error UI with retries.
- ⏱ **Client-Side Timeout Protection**: 20-second `AbortSignal` timeout prevents indefinite hanging.
- 🚦 **Race-Condition Protection**: Request counter + `AbortController` cancels out-of-order response overwrites.
- 📱 **Responsive & Accessible**: Works seamlessly across mobile viewports with keyboard navigation support.

---

## 🔄 Data Flow

```
User Input
    │
    ▼
InputForm Component
    │
    ▼
API Service (with AbortController & 20s timeout)
    │
    ▼
Express API Proxy (/api/generate)
    │
    ▼
Gemini API (Server-Side Key)
    │
    ▼
Raw Model Payload
    │
    ▼
Defensive JSON Parser (Strip fences)
    │
    ▼
Zod Schema Validation
    │
    ▼
React Application State
    ├──► Flashcards (3D Flip Deck)
    └──► Practice Quiz (Self-Grading & Retry Flow)
```

---

## 🧠 Design Decisions

### 1. Backend API Proxy (`server/api/generate.js`)
- **API Key Protection**: The `GEMINI_API_KEY` stays on the server backend and is never exposed to browser bundles.
- **Vercel / Express Compatibility**: Written with standard `(req, res)` signature compatible both as a Vercel Serverless Function and locally via Express.

### 2. Strict Zod Schema Contract (`client/src/utils/validateResponse.js`)
- Enforces JSON payload shape:
  ```json
  {
    "flashcards": [{ "question": "string", "answer": "string" }],
    "quiz": [{ "question": "string", "options": ["a", "b", "c", "d"], "correctIndex": 0 }]
  }
  ```
- Validates semantic bounds: `correctIndex` must be an integer between `0` and `options.length - 1`.

### 3. Defensive Response Parser (`client/src/utils/parseAIResponse.js`)
- Strips accidental markdown fences (` ```json `), extracts raw JSON boundaries, parses JSON strings, and validates through Zod.
- Invalid responses trigger a clean error state UI with retry options instead of crashing the app.

### 4. Network Race-Condition Safety (`client/src/App.jsx`)
- Uses request tracking (`requestIdRef`) combined with `AbortController`.
- Submitting a new topic aborts active requests and discards out-of-order network responses.

### 5. 20-Second Timeout Limit (`client/src/services/api.js`)
- Enforces a 20s client timeout using `AbortSignal`. On timeout, the app degrades gracefully with a clear message.

---

## 💡 Why These Technologies?

- **React**: Component-based UI and reactive state management.
- **Zod**: Runtime schema validation of unpredictable LLM responses.
- **Express**: Keeps the Gemini API key securely on the server side.
- **AbortController**: Prevents stale responses from overwriting current UI.
- **Tailwind CSS**: Rapid utility-first styling with custom glassmorphism and 3D card flips.

---

## 📸 Screenshots

#### Home / Input Form
![Home Screen](https://raw.githubusercontent.com/ssomasekhar018/synapse-flam/main/client/src/assets/hero.png)

---

## 📁 Project Structure

```
study-assistant/
├── api/
│   └── generate.js             # Root Vercel serverless function entrypoint
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── SessionPanel.jsx    # Folder-tab session nav + mobile bar
│   │   │   ├── Flashcard.jsx       # 3D flip card deck with stack + slide transitions
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
│   │   └── generate.js             # Express middleware handler
│   └── index.js                    # Local Express server runner
├── vercel.json                     # Vercel deployment configuration
├── README.md
├── .env.example
└── package.json
```

---

## 🚀 Quick Start & Setup

### Prerequisites
- Node.js (v18 or higher)
- Gemini API Key ([Get a free key from Google AI Studio](https://aistudio.google.com/))

### 1. Install Dependencies

```bash
cd study-assistant

# Install server dependencies
npm install

# Install client dependencies
cd client && npm install && cd ..
```

### 2. Environment Setup

Create a `.env` file in `study-assistant/`:

```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
GEMINI_MODEL=gemini-3.6-flash
PORT=1819
```

> **Note:** Bare `gemini-2.5-flash` returns 404 for many new API keys. Use `gemini-3.6-flash` or let the server auto-fallback. **Restart the server** after changing `.env` — backend code does not hot-reload.

### 3. Run the App

From the `study-assistant/` directory:

```bash
npm install && npm start
```

This installs root + client dependencies and starts both the Express proxy and Vite dev server.

- **Client App**: `http://localhost:1818`
- **Backend Proxy**: `http://localhost:1819`

For development, `npm run dev` is an alias for `npm start`.

---

## 🧪 Edge-Case Testing

Synapse includes an **Edge-Case Testing Toolbar** in the header (during dev) to verify error handling:

1. **Malformed JSON Test**: Server returns malformed JSON syntax.
2. **Wrong Shape Test**: Server returns `{ correctIndex: 99 }`.
3. **Slow Timeout Test**: Server delays response by 25s.
4. **Race Condition Test**: Rapidly submit topics back-to-back.
5. **Offline Network Failure**: Disconnect network in browser DevTools.

---

## 🤖 AI Usage

AI assistants were used during development for:
- Brainstorming component structure
- Reviewing architectural decisions
- Generating boilerplate
- Discussing edge-case handling

All application logic, validation flow, state management, and architectural decisions were reviewed and understood before being incorporated into the project.

I can explain and modify every part of the codebase during review.

---

## ⚠️ Known Limitations

1. **Gemini Free Tier Rate Limits**: Subject to requests-per-minute limits.
2. **No Persistent Study History**: Materials reset on page refresh.
3. **No User Authentication**: Built as a single-session client application.
4. **Generated Content Quality**: Output quality depends on LLM response prompt clarity.
5. **Single Active Study Session**: Supports one topic generation at a time.

---

## 🔮 Future Improvements

- User authentication
- Study history & persistence (IndexedDB / LocalStorage)
- Spaced repetition scheduling
- PDF import & extraction
- Image-based notes OCR
- Multi-language support
- Progress analytics & recommendations

---

## ⏱️ Development Timeline

**Development Period:**  
26 July 2026 – 29 July 2026

The project was developed incrementally over three days, with multiple iterations focused on architecture, defensive error handling, UI refinement, testing, and documentation.

---

## 👨‍💻 Developer

**Somasekhara Srinivas Sannapaneni**  
GitHub: [https://github.com/ssomasekhar018](https://github.com/ssomasekhar018)

---

### ⭐ If you found this project interesting, consider giving it a star!
