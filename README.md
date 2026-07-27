# Synapse — AI Interactive Study Assistant

![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-Validation-3E67B1?logo=zod&logoColor=white)
![Express](https://img.shields.io/badge/Express-Backend-000000?logo=express&logoColor=white)
![Gemini API](https://img.shields.io/badge/Gemini_API-Proxy-8E75B2?logo=google&logoColor=white)

Turn any study topic or lecture notes into structured flashcards and quizzes using AI.

Synapse is a React application built for the Flam Frontend Internship assignment. The project focuses on one core problem: **safely converting unpredictable AI responses into reliable, interactive UI**.

Instead of rendering raw LLM output, every response is:
- Generated through a secure backend proxy
- Parsed defensively
- Validated with Zod
- Rendered only after passing schema validation

Built with an emphasis on:
- **Reliability**
- **Error handling**
- **Maintainability**
- **Defensive parsing**

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

## 📸 Screenshots & Demo

### Screenshots

#### Home / Input Form
![Home Screen](https://raw.githubusercontent.com/placeholder/home.png)

#### Interactive 3D Flashcards
![Flashcards View](https://raw.githubusercontent.com/placeholder/flashcards.png)

#### Practice Quiz Engine
![Quiz View](https://raw.githubusercontent.com/placeholder/quiz.png)

#### Graceful Error Handling
![Error Handling](https://raw.githubusercontent.com/placeholder/error.png)

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
PORT=1819
```

### 3. Run Development Server

```bash
# Run Express proxy server & Vite client concurrently:
npm run dev
```

- **Client App**: `http://localhost:1818`
- **Backend Proxy**: `http://localhost:1819`

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

- Streaming AI responses
- Session history persistence (IndexedDB / LocalStorage)
- User authentication
- Export flashcards (PDF / Anki format)
- AI-powered study recommendations

---

## ⏱️ Development Timeline

**Development Period:**  
26 July 2026 – 29 July 2026

The project was developed incrementally over three days, with multiple iterations focused on architecture, defensive error handling, UI refinement, testing, and documentation.

### Task Breakdown (~7 Hours Total)
- **Scaffolding & Server Proxy setup**: 1 hr
- **Zod Schema & Parser validation**: 1 hr
- **Input Flow & Loading states**: 1 hr
- **Interactive 3D Flashcards**: 1 hr
- **Quiz Engine with Wrong-Answer Retry**: 1 hr
- **Race Condition Guard & Timeout Safety**: 1 hr
- **Testing & Documentation**: 1 hr
