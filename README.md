# 🍌 Banana Quest: Enterprise Game Architecture

> **University of Bedfordshire** | **CIS046-3 Software For Enterprise**  
> Complete working implementation addressing the Four Core Themes:  
> **1. Version Control** | **2. Event-Driven Programming** | **3. Interoperability** | **4. Virtual Identity**

---

## 🚀 Quick Start Guide

### 1. Install & Run Backend Server
```bash
cd server
npm install
npm start
```
*Server runs on [http://localhost:5000](http://localhost:5000)*

### 2. Install & Run Frontend Client
In a second terminal window:
```bash
cd client
npm install
npm run dev
```
*Client runs on [http://localhost:5173](http://localhost:5173)*

### 3. Open Game in Browser
Open `http://localhost:5173`. You can immediately:
- Click **"Quick Login as Demo User (Alex)"** to start playing with pre-seeded bananas and achievements.
- Or click **"Create Account"** to create a custom Virtual Identity.

---

## 🎮 UI Screens Implemented

1. **Screen 1: Login Form UI**
   - Playful vector Monkey Mascot with animated holding banana.
   - Email & Password fields with real-time format validation and visibility toggle.
   - Quick 1-click Demo Login for effortless grading and defense.
   - "Forgot password?" modal and "Create Account" navigation.

2. **Screen 2: User Registration Form**
   - Full Name, Email, Username, Password, Confirm Password, and Terms checkbox.
   - Interactive Monkey Avatar Persona selector (Happy, Scholar, Superhero, Ninja, Cosmo).
   - Secure server-side validation and password encryption.

3. **Screen 3: Choose Level Form UI**
   - Personalized greeting: *"Hello, Alex! 👋"*
   - User statistics overview: Total Bananas, Days Played, High Score, Player Tier.
   - 3 Difficulty Cards with animated hover effects:
     - **Easy:** 1 puzzle • 10 points • 60s timer (Nature Green)
     - **Medium:** 2 puzzles • 20 points • 45s timer (Sky Blue)
     - **Hard:** 3 puzzles • 40 points • 30s timer (Warm Orange)

4. **Screen 4: Game Dashboard (Gameplay)**
   - **Left Sidebar:** Live Score (Trophy), 3 Hearts/Lives (animated pulsing hearts), Level progress dots, and real-time Timer with urgency threshold and audio warnings.
   - **Center Arena:** Displays equation images fetched from Marc Conrad's external Banana REST API (`https://marcconrad.com/uob/banana/api.php?out=json`), interactive on-screen number pad (0-9, Clear, Enter), physical keyboard shortcuts (0-9 + Enter), and image zoom.
   - **Right Sidebar:** Active bonuses, Power-ups (**"Optional Enhance AI"** toggle for equation hints, **"Time Freeze"** +10s ice pause), and a live event audit log.
   - **Victory & Game Over Modals:** Confetti explosion via `canvas-confetti` and dynamic Web Audio synthesis fanfare.

5. **Screen 5: Leaderboard UI**
   - Time-sliced ranking: **Daily**, **Weekly**, and **All Time** tabs.
   - Table columns: Rank (Gold 🥇, Silver 🥈, Bronze 🥉 badges), Player with avatar, Level, Difficulty, and Points.
   - **Right Sidebar (Personal Stats):** Displays current user's rank (#5, etc.), Total Bananas, High Score, and motivational text.

6. **Academic 4-Themes Spec Modal**
   - Accessible via the **"4-Themes Guide"** button on the navbar or floating bottom-right trigger.
   - Provides full code and conceptual breakdown for the 10-minute video presentation.

---

## 📚 Deliverables Included in this Project

1. **Working Full-Stack Source Code:**
   - React + Vite SPA frontend (`client/`)
   - Node.js + Express backend server (`server/`)
2. **Academic Documentation ([`DOCUMENTATION.md`](file:///c:/Users/MY%20PC/OneDrive/Desktop/Banana%20Game/DOCUMENTATION.md)):** Detailed technical report covering architectural justifications, distributed systems, and the 4 Core Themes targeting 70%+ (1st Class).
3. **10-Minute Video Presentation Script ([`VIDEO_TRANSCRIPT_SCRIPT.md`](file:///c:/Users/MY%20PC/OneDrive/Desktop/Banana%20Game/VIDEO_TRANSCRIPT_SCRIPT.md)):** Word-for-word transcript with timestamps matching the 10-minute maximum video limit.
