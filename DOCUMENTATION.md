# 🍌 Banana Quest: Enterprise Game Architecture & Academic Documentation

**Unit Title & Code:** CIS046-3 Software For Enterprise  
**Assessment:** Assignment 1 – Artifact Submission (Code & 10-Minute Video Defense)  
**Weighting:** 60%  
**Target Grade Tier:** 70%+ (1st Class Distinction Standard)  

---

## 1. Executive Summary & Project Overview

**Banana Quest** is a distributed, web-based puzzle game engineered to address the core software paradigms required by enterprise-level applications:
1. **Version Control:** Component-oriented modular architecture, decoupled client-server repository structure, and professional git branching and tagging strategies.
2. **Event-Driven Programming:** Multi-layered event dispatching including React synthetic events, browser-level keyboard event listeners, asynchronous timer loops, dynamic Web Audio API synthesis, and Express middleware error event pipelines.
3. **Interoperability:** RESTful HTTPS integration with the external University of Bedfordshire Banana API (`https://marcconrad.com/uob/banana/api.php?out=json`), backed by an enterprise proxy pattern that secures puzzle solutions from client-side network inspection and implements automated fallback resilience.
4. **Virtual Identity:** Cryptographically secured authentication lifecycle using `bcryptjs` for salted password hashing, signed JSON Web Tokens (JWT) for stateless identity claims, HTTP-only cookie session protection, and personalized leaderboard tracking.

---

## 2. Distributed System Architecture

The project implements a classic **n-tier decoupled distributed architecture**:

```
+-------------------------------------------------------------------------+
|                         CLIENT TIER (React SPA)                         |
|  - UI Views: Login, Register, Choose Level, Game Dashboard, Leaderboard |
|  - Event Engine: Keyboard (0-9/Enter), Interval Timers, Web Audio API   |
|  - State Management: React Context API (AuthContext) & Local Storage     |
+-------------------------------------------------------------------------+
                                    ▲
                                    │ HTTP/REST (JSON, Cookies/Bearer)
                                    ▼
+-------------------------------------------------------------------------+
|                      BACKEND SERVER TIER (Node.js/Express)              |
|  - Routing: /api/auth, /api/game, /api/leaderboard                      |
|  - Controllers: authController, gameController, leaderboardController   |
|  - Middleware: authMiddleware (JWT & Cookie verification)               |
|  - Security: Bcrypt salt rounds, Hidden solution evaluation             |
+-------------------------------------------------------------------------+
        ▲                                                 ▲
        │ HTTPS REST                                      │ Persistence
        ▼                                                 ▼
+-----------------------------------+     +-------------------------------+
|     EXTERNAL WEB SERVICE TIER     |     |       PERSISTENCE LAYER       |
|  Marc Conrad's Banana API         |     |  - MongoDB (Mongoose Driver)  |
|  (https://marcconrad.com/uob/...) |     |  - Resilient JSON File Store  |
+-----------------------------------+     +-------------------------------+
```

---

## 3. The Four Core Themes: Critical Analysis & Code Mapping

### 🌟 Theme 1: Version Control & Software Architecture

#### Rubric Alignment (70%+ Standard):
> *"You critically evaluate the structure of your code and its organization into components, considering alternative approaches. You also reflect on how version control strategies, like branching, tagging, and code reviews, enhance the quality, scalability, and maintainability of your application."*

#### 1. Component Modularity & High Cohesion
The codebase avoids monolithic anti-patterns by adhering strictly to separation of concerns:
- **`server/controllers/`**: Handles request orchestration and business workflows (`authController.js`, `gameController.js`, `leaderboardController.js`).
- **`server/services/`**: Encapsulates external third-party communication (`bananaApiService.js`), decoupling network protocol details from business logic.
- **`server/models/`**: Abstract repository layer (`User.js`, `Score.js`) supporting dual data engines (MongoDB and JSON file fallback) without changing controller code.
- **`client/src/components/`**: Modular presentation components (`Navbar.jsx`, `LoginForm.jsx`, `RegisterForm.jsx`, `LevelSelect.jsx`, `GameDashboard.jsx`, `Leaderboard.jsx`).

#### 2. Version Control Strategy in Enterprise Practice
- **Git Branching Strategy (Git Flow):**
  - `main`/`master`: Production-ready release branch protected by CI/CD checks.
  - `develop`: Integration branch for aggregating finished features.
  - `feature/*` branches (e.g., `feature/auth-jwt`, `feature/banana-api-interop`, `feature/game-ui`): Isolated feature development preventing merge conflicts.
- **Commit Granularity:** Commits are atomic and structured following Conventional Commits format (`feat:`, `fix:`, `docs:`, `refactor:`).
- **Alternative Approaches Considered:** A monolithic server-side rendering architecture (e.g. standard PHP or pure EJS) was evaluated; however, a decoupled Single Page Application (SPA) with a dedicated RESTful API was selected to enable independent horizontal scaling, easier mobile client interoperability, and isolated frontend/backend version control lifecycles.

---

### ⚡ Theme 2: Event-Driven Programming

#### Rubric Alignment (70%+ Standard):
> *"You justify the approach taken when implementing events and event handlers into your software."*

#### 1. Client-Side Event Architecture
The game engine in `GameDashboard.jsx` implements multiple levels of event handling:
- **DOM & Synthetic React Events:** `onClick`, `onChange`, and `onSubmit` trigger transactional state transitions.
- **Global Keyboard Events:** `window.addEventListener('keydown')` captures digits `0`-`9` and `Enter`, enabling fast arcade-style gameplay.
- **Asynchronous Interval Events (Timer Loop):**
  ```javascript
  timerRef.current = setInterval(() => {
    if (freezeActive) {
      setFreezeSecondsLeft(prev => prev <= 1 ? (setFreezeActive(false), 0) : prev - 1);
      return;
    }
    setTimeRemaining(prev => {
      if (prev <= 1) {
        clearInterval(timerRef.current);
        handleTimeExpired(); // Event trigger
        return 0;
      }
      if (prev <= 10) sounds.playTick(); // Audio event
      return prev - 1;
    });
  }, 1000);
  ```
- **Custom Power-up Event Hooks:** Activating the "Time Freeze" power-up dispatches an asynchronous freeze event that halts the normal countdown event pipeline for 10 seconds.
- **Event-Driven Web Audio Synthesis (`SoundEffects.js`):** Sound effects are generated mathematically using the browser's `AudioContext` oscillator nodes upon specific game events (success chime, failure buzz, fanfare arpeggio, clock tick).

#### 2. Server-Side Event Pipeline
- Express handles non-blocking I/O using the Node.js libuv event loop.
- Centralized error-handling middleware (`app.use((err, req, res, next) => ... )`) listens to uncaught exception events and formats uniform JSON responses.

---

### 🌐 Theme 3: Interoperability

#### Rubric Alignment (70%+ Standard):
> *"You critically justify the approaches you have taken to include third-party software, such as a web service, into your application."*

#### 1. REST Web Service Integration
The application interoperates with Marc Conrad's external Banana API:
- **Service Endpoint:** `https://marcconrad.com/uob/banana/api.php?out=json`
- **Data Protocol:** HTTPS/TLS, JSON payload interchange.
- **Payload Schema:**
  ```json
  {
    "question": "https://www.sanfoh.com/uob/banana/data/t2d443522cdd22b41877d433a69n77.png",
    "solution": 7
  }
  ```

#### 2. Architectural Justification: Server-Side Proxy vs. Direct Client Call
A critical engineering choice was made regarding **where** the external API is called:
- **Direct Client Fetching (Flawed Alternative):** If the React client called the Banana API directly, the JSON response containing the plaintext `"solution": 7` would be visible in browser DevTools Network tab, enabling trivial cheating.
- **Server-Side Interoperability Proxy (Implemented Approach):**
  1. The Express server initiates the HTTPS request to `marcconrad.com` using `fetch()`.
  2. The server stores the numeric solution securely in the active session map (`activeSessions`).
  3. The server strips the solution and sends only the `question` image URL to the client.
  4. When the user submits an answer, the server validates it against the stored session solution.
- **Resilience & Fault Tolerance:** Network requests are bounded by `AbortController` (6-second timeout). If the university API is unreachable, a resilient fallback puzzle generator is automatically invoked, ensuring 100% uptime.

---

### 🔒 Theme 4: Virtual Identity

#### Rubric Alignment (70%+ Standard):
> *"You critically discuss the authentication mechanisms that are used by your code to establish virtual identity and the role they play to make your application secure while also considering alternative approaches."*

#### 1. Authentication & Cryptographic Security
- **Bcrypt Password Hashing:** Passwords are never stored in plaintext. In `authController.js`, `bcrypt.hash(password, 10)` generates a salted hash with 10 rounds of key stretching, mitigating brute-force and rainbow-table attacks.
- **JSON Web Tokens (JWT):** Upon successful authentication, the server signs a cryptographically verified token containing the user's virtual identity claims (`id`, `username`, `email`) using HMAC SHA-256 and an enterprise secret key.
- **Cookie & Bearer Hybrid Security:**
  - Tokens are delivered via **HTTP-only Cookies** (`res.cookie('token', token, { httpOnly: true, sameSite: 'lax' })`), shielding against Cross-Site Scripting (XSS) token theft (matching the Week 5 "Authentication & Cookies" curriculum).
  - Also accepts `Authorization: Bearer <token>` headers for mobile or cross-origin flexibility.

#### 2. Virtual Identity Customization & Persistence
- Players personalize their virtual identity by choosing from distinct avatar personas (Happy, Scholar, Superhero, Ninja, Cosmo).
- The player's identity persists across game sessions, binding their accumulated bananas, high scores, days active, and achievements to the global competitive Leaderboard.

---

## 4. How to Run the Application

### Prerequisites
- Node.js (v18 or higher recommended; verified on Node v24)
- npm (v9 or higher)

### Step 1: Start the Backend Server
```bash
cd server
npm install
npm start
```
*The server will start on `http://localhost:5000`.*

### Step 2: Start the Frontend Client
In a separate terminal window:
```bash
cd client
npm install
npm run dev
```
*The client will start on `http://localhost:5173`.*

### Step 3: Open the Game in Browser
Visit `http://localhost:5173` in any modern web browser.
- You can create a new account or click **"Quick Login as Demo User (Alex)"** for instant access.

---

## 5. Academic References & Source Acknowledgment

In accordance with University of Bedfordshire academic integrity guidelines:
1. **Banana API Web Service:** Provided by Dr. Marc Conrad, University of Bedfordshire (`https://marcconrad.com/uob/banana/doc.php`).
2. **Icons:** Lucide React icons library (`lucide-react`).
3. **Celebration Effects:** Canvas Confetti library (`canvas-confetti`).
4. **Sound Effects:** Generated natively in real-time via the W3C Web Audio API standard.
5. **AI Assistance:** Generative AI was used to assist in writing and scaffolding code components under student review, as explicitly permitted by the assignment specification ("You are allowed to use generative AI for the code of this assignment, but not for the video").
