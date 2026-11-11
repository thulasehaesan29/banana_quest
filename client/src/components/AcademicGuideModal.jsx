import React, { useState } from 'react';
import { BookOpen, GitBranch, Zap, Globe, Shield, X, Copy, Check } from 'lucide-react';

export default function AcademicGuideModal({ onClose }) {
  const [activeTab, setActiveTab] = useState('vc'); // 'vc' | 'events' | 'interop' | 'identity'
  const [copied, setCopied] = useState(false);

  const handleCopySummary = () => {
    const text = `Banana Quest - CIS046-3 Four Themes Presentation Guide:
1. Version Control: Modular client/server architecture, separated controllers, services, and models.
2. Event-Driven: React state handlers, keydown listeners, setInterval countdown, Web Audio synthesis.
3. Interoperability: Marc Conrad Banana REST API integration, backend proxy validation, AbortController timeouts.
4. Virtual Identity: Bcrypt password hashing, JWT token authentication, HTTP-only cookies, leaderboard profiles.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content academic-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-row">
            <BookOpen size={24} className="trophy-gold" />
            <div>
              <h2>CIS046-3 4-Theme Video Presentation Guide</h2>
              <span className="academic-sub">10-Minute Video Defense Reference & Code Alignment</span>
            </div>
          </div>
          <button className="close-modal-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="academic-tabs">
          <button
            className={`academic-tab-btn ${activeTab === 'vc' ? 'active' : ''}`}
            onClick={() => setActiveTab('vc')}
          >
            <GitBranch size={16} />
            <span>1. Version Control</span>
          </button>
          <button
            className={`academic-tab-btn ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            <Zap size={16} />
            <span>2. Event-Driven</span>
          </button>
          <button
            className={`academic-tab-btn ${activeTab === 'interop' ? 'active' : ''}`}
            onClick={() => setActiveTab('interop')}
          >
            <Globe size={16} />
            <span>3. Interoperability</span>
          </button>
          <button
            className={`academic-tab-btn ${activeTab === 'identity' ? 'active' : ''}`}
            onClick={() => setActiveTab('identity')}
          >
            <Shield size={16} />
            <span>4. Virtual Identity</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="academic-body">
          {activeTab === 'vc' && (
            <div className="theme-content">
              <h3>📁 Theme 1: Version Control & Architecture (70%+ Standard)</h3>
              <p>
                <strong>Marking Criteria Justification:</strong> Demonstrates high modularity, component isolation, and clean separation of concerns.
              </p>
              <div className="code-point-card">
                <strong>Project Structure & Separation of Concerns:</strong>
                <ul>
                  <li><code>server/controllers/</code>: Decoupled business logic (Auth, Game, Leaderboard).</li>
                  <li><code>server/services/</code>: Isolated external integrations (Banana REST service client).</li>
                  <li><code>server/models/</code>: Persistence layer with database abstraction (Mongoose + JSON fallback).</li>
                  <li><code>client/src/components/</code>: Reusable UI widgets (Navbar, Mascot, Keypad, Modals).</li>
                  <li><code>client/src/context/</code>: Centralized state management via React Context API.</li>
                </ul>
              </div>
              <div className="presentation-tip">
                💡 <strong>Video Talking Point:</strong> "By organizing our project into client and server repositories with modular controllers and reusable UI components, Git version control allows multiple developers to work independently on game mechanics, authentication, and styling without merge conflicts."
              </div>
            </div>
          )}

          {activeTab === 'events' && (
            <div className="theme-content">
              <h3>⚡ Theme 2: Event-Driven Programming (70%+ Standard)</h3>
              <p>
                <strong>Marking Criteria Justification:</strong> Explains how events are generated, dispatched, and handled asynchronously across client and server.
              </p>
              <div className="code-point-card">
                <strong>Key Event Mechanisms in Code:</strong>
                <ul>
                  <li><strong>DOM & Synthetic Events:</strong> <code>onClick</code>, <code>onChange</code>, <code>onSubmit</code> handlers for gameplay and forms.</li>
                  <li><strong>Global Keyboard Listeners:</strong> <code>window.addEventListener('keydown')</code> in <code>GameDashboard.jsx</code> enabling rapid number-key entry (0-9) and instant Enter-to-submit.</li>
                  <li><strong>Asynchronous Timer Intervals:</strong> <code>setInterval</code> in <code>GameDashboard.jsx</code> driving the 60s/45s/30s countdown and freezing the loop when the Time Freeze power-up is activated.</li>
                  <li><strong>Audio Synthesis Events:</strong> Event-driven Web Audio API in <code>SoundEffects.js</code> generating real-time dynamic sound waves on success, error, and timeout.</li>
                  <li><strong>Express Server Event Pipeline:</strong> Non-blocking event loop handling concurrent HTTP requests and middleware error pipelines.</li>
                </ul>
              </div>
              <div className="presentation-tip">
                💡 <strong>Video Talking Point:</strong> "Our game is purely event-driven: user inputs dispatch React state changes, an interval timer drives real-time countdown events, and custom event listeners trigger celebratory confetti and Web Audio synthesizers."
              </div>
            </div>
          )}

          {activeTab === 'interop' && (
            <div className="theme-content">
              <h3>🌐 Theme 3: Interoperability (70%+ Standard)</h3>
              <p>
                <strong>Marking Criteria Justification:</strong> Critically justifies the integration of third-party web services and data interchange.
              </p>
              <div className="code-point-card">
                <strong>Third-Party Integration Details:</strong>
                <ul>
                  <li><strong>Target Service:</strong> Marc Conrad's University of Bedfordshire Banana API (<code>https://marcconrad.com/uob/banana/api.php?out=json</code>).</li>
                  <li><strong>Service Client (<code>services/bananaApiService.js</code>):</strong> Communicates over HTTPS/TLS, validates JSON payloads, and implements timeout protection via <code>AbortController</code>.</li>
                  <li><strong>Security & Enterprise Architecture Justification:</strong> Instead of having the frontend call the Banana API directly (which exposes the raw <code>solution</code> in client DevTools), our Express server proxies the request, hides the solution securely in the session, and serves only the puzzle image to the browser.</li>
                  <li><strong>Fault Tolerance & High Availability:</strong> Built-in fallback cache ensures the game continues even if university network maintenance occurs.</li>
                </ul>
              </div>
              <div className="presentation-tip">
                💡 <strong>Video Talking Point:</strong> "Rather than relying on client-side requests where answers could be intercepted in DevTools, our server handles interoperability securely: fetching the puzzle from the university's REST service, validating payloads, and verifying answers server-side."
              </div>
            </div>
          )}

          {activeTab === 'identity' && (
            <div className="theme-content">
              <h3>🔒 Theme 4: Virtual Identity & Security (70%+ Standard)</h3>
              <p>
                <strong>Marking Criteria Justification:</strong> Evaluates authentication mechanisms, password hashing, and token-based identity persistence.
              </p>
              <div className="code-point-card">
                <strong>Authentication & Identity Mechanics:</strong>
                <ul>
                  <li><strong>Password Security:</strong> Cryptographic password hashing using <code>bcryptjs</code> with 10 salt rounds (passwords are never saved in plain text).</li>
                  <li><strong>Stateless JWT Tokens:</strong> <code>jsonwebtoken</code> signs tamper-proof identity claims containing user ID and username.</li>
                  <li><strong>Cookies & Bearer Tokens:</strong> Supports both HTTP-only Cookies and Authorization Bearer headers (Week 5: Authentication & Cookies).</li>
                  <li><strong>Virtual Persona Customization:</strong> Customizable monkey avatars, user handles, total bananas collected, and personal leaderboard positions.</li>
                  <li><strong>Session Protection:</strong> <code>authMiddleware.js</code> guards protected endpoints and preserves player identity state across refreshes.</li>
                </ul>
              </div>
              <div className="presentation-tip">
                💡 <strong>Video Talking Point:</strong> "A player's virtual identity is secured using bcrypt hashing and signed JWT tokens delivered via HTTP-only cookies. Each identity tracks high scores, collected bananas, and unlocked achievements on the competitive leaderboard."
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="academic-footer">
          <button className="secondary-btn" onClick={handleCopySummary}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Summary Notes'}</span>
          </button>
          <button className="primary-btn" onClick={onClose}>
            Back to Game
          </button>
        </div>
      </div>
    </div>
  );
}
