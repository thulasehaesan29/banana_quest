# 🎬 10-Minute Video Presentation Script & Transcript

**Unit Title & Code:** CIS046-3 Software For Enterprise  
**Student Name:** [Your Name]  
**Student ID:** [Your Student ID]  
**Artifact:** Banana Quest - Enterprise Distributed Puzzle Game  
**Target Duration:** Exactly 9:30 - 9:55 minutes (under the 10-minute maximum limit)  

---

## ⏱️ Video Presentation Timeline Breakdown

| Timestamp | Section | Key Discussion & Screen Focus |
| :--- | :--- | :--- |
| **0:00 - 1:30** | **System Demonstration** | Live run: Login as Alex, Level Select, solve puzzle, audio, Leaderboard |
| **1:30 - 3:30** | **Theme 1: Version Control** | Codebase modularity, MVC separation, Git branching & commits |
| **3:30 - 5:30** | **Theme 2: Event-Driven Programming** | React state, keyboard listeners, interval countdown, Web Audio synthesis |
| **5:30 - 7:30** | **Theme 3: Interoperability** | Marc Conrad Banana REST API, JSON parsing, security proxy & fallback |
| **7:30 - 9:15** | **Theme 4: Virtual Identity** | Bcrypt hashing, JWT tokens, HTTP-only cookies, persistent profiles |
| **9:15 - 10:00** | **Conclusion & Critical Reflection** | Enterprise trade-offs, scalability, reflection on learning outcomes |

---

## 🎙️ Word-for-Word Video Script

### Part 1: Introduction & Live Demonstration (0:00 – 1:30)

**[Screen: Browser showing the Banana Quest application at `http://localhost:5173` on the Login Screen]**

> "Hello everyone. My name is [Your Name], and today I am presenting my software artifact for CIS046-3 Software For Enterprise: **Banana Quest**.
>
> Banana Quest is a distributed, web-based puzzle game engineered around four fundamental enterprise paradigms: version control, event-driven programming, interoperability, and virtual identity.
>
> To begin, I will demonstrate the fully functional application:
>
> Here on the login screen, we see our monkey mascot and authentication interface. Users can create a brand new account or, for the purpose of this demonstration, click **'Quick Login as Demo User (Alex)'**.
>
> Upon signing in, we transition to the **Choose Level** screen. Notice the personalized greeting displaying Alex's current stats: 120 total bananas, 3 days played, and a high score of 240 points. We have three difficulty options: Easy, Medium, and Hard.
>
> Let's select **'Medium'**—which requires solving two sequential puzzles with a 45-second timer.
>
> In the **Game Dashboard**, our left sidebar displays our live score, three lives, puzzle progress, and an animated countdown timer. In the center arena, the math equation you see is fetched in real time from Dr. Marc Conrad's University of Bedfordshire Banana API.
>
> Notice the interactive on-screen number pad and physical keyboard support. I can type '6' on my keyboard or click '6' on the keypad and hit Enter.
>
> *(Sound effect plays, celebration toast appears)*
>
> Our answer was validated securely on the backend, awarding points and advancing to puzzle 2! We also have power-ups on the right: toggling **'Optional Enhance AI'** queries our equation analysis engine, and clicking **'Time Freeze'** pauses the timer for 10 seconds.
>
> Finally, navigating to the **Leaderboard**, we see daily, weekly, and all-time competitive rankings with Alex's personal standing clearly highlighted."

---

### Part 2: Theme 1 – Version Control & Architecture (1:30 – 3:30)

**[Screen: Switch to VS Code / IDE displaying the project file tree (`client/` and `server/`)]**

> "Now, let us examine the first theme: **Version Control and Software Architecture**.
>
> When engineering enterprise software, version control is not merely a tool for recording code changes; it is the cornerstone of collaboration, modularity, and risk management.
>
> In our project repository, you can see a strict separation of concerns into decoupled `client` and `server` directories:
>
> On the server side:
> - `server/controllers/` isolates the application's business logic, such as `authController.js` and `gameController.js`.
> - `server/services/` encapsulates external system integrations like `bananaApiService.js`.
> - `server/models/` provides database abstraction, seamlessly supporting both MongoDB and a file-based JSON repository.
>
> On the client side, our React application is broken down into small, highly cohesive components like `Navbar`, `LoginForm`, `GameDashboard`, and `Leaderboard`.
>
> This architectural modularity directly supports our **Git branching strategy**. Following the Git Flow model:
> - The `main` branch represents tested, production-ready code.
> - Feature branches—such as `feature/banana-api-interop` or `feature/virtual-identity`—allow different developers to build authentication and external API services concurrently without stepping on each other's work or introducing merge conflicts.
> - We utilize atomic commit granularity following Conventional Commits, which ensures every commit represents a single verifiable change with clear intent.
>
> As a critical evaluation of alternative approaches: we considered a monolithic architecture using server-side rendered templates. However, a decoupled client-server architecture with version-controlled APIs was chosen because it allows independent deployments, horizontal scalability, and easier migration to future mobile clients."

---

### Part 3: Theme 2 – Event-Driven Programming (3:30 – 5:30)

**[Screen: VS Code highlighting `client/src/components/GameDashboard.jsx` and `client/src/components/SoundEffects.js`]**

> "Our second core theme is **Event-Driven Programming**.
>
> An enterprise game dashboard must be responsive, asynchronous, and non-blocking. In our code, event generation and handling operate across multiple levels:
>
> 1. **Synthetic DOM Events:** User clicks and form submissions trigger state updates through React's event dispatchers.
> 2. **Global Keyboard Listeners:** In `GameDashboard.jsx` (lines 140-165), we attach an event listener to `window.addEventListener('keydown')`. When a user types a number between 0 and 9 or presses Enter, the event is immediately captured, updating the answer input and dispatching a submission without requiring mouse movement.
> 3. **Asynchronous Timer Intervals:** The game loop uses JavaScript's `setInterval`. Every 1000 milliseconds, a timer event tick evaluates remaining time. If the 'Time Freeze' power-up has been triggered, the normal countdown is suspended while an independent freeze counter decrements. If the timer reaches zero, a custom timeout event triggers life deduction and audio feedback.
> 4. **Event-Driven Web Audio Synthesis:** Looking at `SoundEffects.js`, instead of relying on static audio files that can fail to load, we use the W3C Web Audio API. When specific game events occur—such as `playCorrect()` or `playWrong()`—the event handler dynamically instantiates oscillator and gain nodes, shaping audio frequencies into crisp acoustic feedback.
> 5. **Server Event Pipeline:** On the Express backend, the Node.js event loop handles concurrent HTTP requests asynchronously, with a centralized error-handling pipeline listening for unhandled rejections."

---

### Part 4: Theme 3 – Interoperability (5:30 – 7:30)

**[Screen: VS Code highlighting `server/services/bananaApiService.js` and `server/controllers/gameController.js`]**

> "Our third theme is **Interoperability**.
>
> Interoperability refers to the capability of different systems, architectures, and programming languages to exchange information and work together seamlessly.
>
> In our application, we interoperate with the external RESTful web service provided by Dr. Marc Conrad: `https://marcconrad.com/uob/banana/api.php?out=json`.
>
> Let's look at `server/services/bananaApiService.js`:
> Here, our server communicates with the external service using HTTPS GET requests. The university API returns a JSON payload containing a `question` image URL and a numerical `solution`.
>
> **Now, I must critically justify our architectural approach:**
> A naive implementation might have the React frontend call the Banana API directly. However, in an enterprise setting, that creates a catastrophic security vulnerability: the university API includes the plaintext `solution` right in the JSON response! Any user opening browser Developer Tools could inspect the network response and cheat effortlessly.
>
> Therefore, we implemented a **Secure Interoperability Gateway Pattern**:
> 1. Our Express backend makes the third-party API call.
> 2. The backend stores the correct solution securely in the server's session memory.
> 3. The backend strips the solution from the payload and passes *only* the puzzle image URL to the client.
> 4. When the user submits an answer, validation occurs entirely on our server.
>
> Furthermore, to handle network latency or external downtime, our service integrates an `AbortController` timeout mechanism and a curated fallback puzzle cache, ensuring fault-tolerant interoperability."

---

### Part 5: Theme 4 – Virtual Identity (7:30 – 9:15)

**[Screen: VS Code highlighting `server/controllers/authController.js` and `server/middleware/authMiddleware.js`]**

> "Our fourth theme is **Virtual Identity and Security**.
>
> In digital enterprises, a virtual identity represents a user's verified digital persona, controlling their access rights and tracking their persistent progress.
>
> In our system, establishing virtual identity involves three core mechanisms:
>
> 1. **Cryptographic Password Security:** When a player registers via `authController.js`, their password is encrypted using `bcryptjs` with 10 salt rounds. Plaintext passwords never touch our database or memory logs, protecting against dictionary and rainbow-table attacks.
> 2. **Stateless JSON Web Tokens (JWT):** Upon login, the server issues a signed JWT containing identity claims (user ID, username, email). This token is cryptographically signed using HMAC SHA-256 and an enterprise secret key.
> 3. **HTTP-Only Cookies & Bearer Tokens:** Addressing the Week 5 syllabus on Authentication and Cookies, our server sets the JWT inside an `httpOnly` cookie (`res.cookie('token', ...)`). This mitigates Cross-Site Scripting (XSS) attacks because JavaScript running in the browser cannot access or steal the token.
> 4. **Identity Persistence on the Leaderboard:** In `authMiddleware.js`, incoming requests are validated against the signature. Once verified, the player's virtual identity is linked to their accumulated bananas, high score, and rank on our competitive leaderboard, allowing players to customize their persona with unique monkey avatars."

---

### Part 6: Conclusion & Critical Reflection (9:15 – 10:00)

**[Screen: Switch back to browser showing the game dashboard and the '4-Themes Spec' modal]**

> "To conclude, **Banana Quest** successfully demonstrates the four foundational pillars of modern software enterprise:
> - **Version control** enabled clean, modular, and maintainable component separation.
> - **Event-driven programming** powered a dynamic, responsive client game loop and real-time audio synthesis.
> - **Interoperability** connected our distributed architecture to Marc Conrad's external Banana REST API with enterprise-grade proxy security and fault tolerance.
> - And **virtual identity** established tamper-proof authentication using salted bcrypt hashes, JWTs, and secure HTTP-only cookies.
>
> This complete implementation meets the highest criteria set out in the CIS046-3 specification. Thank you for your time, and I welcome any questions!"
