import React from 'react';

/**
 * Animated Vector Monkey Mascot
 * Variants: 'happy', 'glasses', 'super', 'ninja', 'space'
 */
export default function Mascot({ variant = 'happy', size = 160, className = '' }) {
  return (
    <div
      className={`mascot-container ${className}`}
      style={{ width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        className="mascot-svg"
      >
        <defs>
          <linearGradient id="monkeyFur" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A0522D" />
            <stop offset="100%" stopColor="#6E2C00" />
          </linearGradient>
          <linearGradient id="monkeyFace" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD39B" />
            <stop offset="100%" stopColor="#EEA768" />
          </linearGradient>
          <linearGradient id="bananaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF200" />
            <stop offset="100%" stopColor="#FFB300" />
          </linearGradient>
          <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* Super Monkey Cape */}
        {variant === 'super' && (
          <path
            d="M 50,110 Q 20,180 40,195 Q 100,185 160,195 Q 180,180 150,110 Z"
            fill="#E53935"
            stroke="#B71C1C"
            strokeWidth="3"
          />
        )}

        {/* Ears */}
        {/* Left Ear */}
        <circle cx="45" cy="95" r="28" fill="url(#monkeyFur)" filter="url(#shadow)" />
        <circle cx="45" cy="95" r="16" fill="url(#monkeyFace)" />
        {/* Right Ear */}
        <circle cx="155" cy="95" r="28" fill="url(#monkeyFur)" filter="url(#shadow)" />
        <circle cx="155" cy="95" r="16" fill="url(#monkeyFace)" />

        {/* Head */}
        <circle cx="100" cy="100" r="58" fill="url(#monkeyFur)" filter="url(#shadow)" />

        {/* Face plate (heart-shaped muzzles) */}
        <path
          d="M 100,80 Q 75,65 62,85 Q 52,105 70,125 Q 100,145 100,145 Q 100,145 130,125 Q 148,105 138,85 Q 125,65 100,80 Z"
          fill="url(#monkeyFace)"
        />

        {/* Eyes */}
        <ellipse cx="82" cy="95" rx="8" ry="11" fill="#FFFFFF" />
        <ellipse cx="118" cy="95" rx="8" ry="11" fill="#FFFFFF" />

        <circle cx="84" cy="96" r="5" fill="#2E1C0C" />
        <circle cx="116" cy="96" r="5" fill="#2E1C0C" />
        <circle cx="86" cy="93" r="2" fill="#FFFFFF" />
        <circle cx="118" cy="93" r="2" fill="#FFFFFF" />

        {/* Snout & Nose */}
        <ellipse cx="100" cy="120" rx="6" ry="3.5" fill="#5D4037" />

        {/* Big Happy Smile */}
        <path
          d="M 85,125 Q 100,142 115,125"
          fill="none"
          stroke="#4E342E"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Rosy Cheeks */}
        <circle cx="70" cy="116" r="6" fill="#FF8A80" opacity="0.6" />
        <circle cx="130" cy="116" r="6" fill="#FF8A80" opacity="0.6" />

        {/* VARIANT DETAILS */}
        {/* 1. Glasses Monkey */}
        {variant === 'glasses' && (
          <g id="glasses">
            <circle cx="82" cy="95" r="14" fill="none" stroke="#212121" strokeWidth="4" />
            <circle cx="118" cy="95" r="14" fill="none" stroke="#212121" strokeWidth="4" />
            <line x1="96" y1="95" x2="104" y2="95" stroke="#212121" strokeWidth="4" />
            <line x1="68" y1="95" x2="52" y2="92" stroke="#212121" strokeWidth="3" />
            <line x1="132" y1="95" x2="148" y2="92" stroke="#212121" strokeWidth="3" />
          </g>
        )}

        {/* 2. Superhero Monkey Mask & Emblem */}
        {variant === 'super' && (
          <g id="super-gear">
            <path
              d="M 64,88 Q 100,82 136,88 Q 132,106 100,103 Q 68,106 64,88 Z"
              fill="#FFC107"
              stroke="#FFA000"
              strokeWidth="2"
            />
            {/* Superhero Star */}
            <polygon
              points="100,52 103,60 111,60 105,65 107,73 100,68 93,73 95,65 89,60 97,60"
              fill="#FFD700"
              stroke="#E65100"
              strokeWidth="1.5"
            />
          </g>
        )}

        {/* 3. Ninja Monkey Bandana */}
        {variant === 'ninja' && (
          <g id="ninja-bandana">
            <path
              d="M 52,65 Q 100,55 148,65 Q 146,80 100,75 Q 54,80 52,65 Z"
              fill="#263238"
            />
            <circle cx="100" cy="68" r="4" fill="#E53935" />
            <path d="M 46,65 L 30,70 L 35,82 L 48,72 Z" fill="#263238" />
          </g>
        )}

        {/* 4. Space Monkey Helmet Ring */}
        {variant === 'space' && (
          <circle
            cx="100"
            cy="100"
            r="66"
            fill="none"
            stroke="#00E5FF"
            strokeWidth="3.5"
            strokeDasharray="6,4"
            opacity="0.85"
          />
        )}

        {/* Banana in Hand (Bottom Right) */}
        <g id="hand-and-banana" className="banana-float">
          {/* Banana */}
          <path
            d="M 125,135 Q 170,120 185,155 Q 165,175 125,150 Z"
            fill="url(#bananaGrad)"
            stroke="#F57F17"
            strokeWidth="2"
            filter="url(#shadow)"
          />
          {/* Banana Stem */}
          <path d="M 183,153 L 192,156 L 190,161 L 182,158 Z" fill="#5D4037" />
          {/* Banana Curve Highlight */}
          <path
            d="M 135,142 Q 165,133 175,152"
            fill="none"
            stroke="#FFFDE7"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Paw Holding Banana */}
          <circle cx="140" cy="148" r="10" fill="url(#monkeyFur)" />
          <circle cx="138" cy="148" r="6" fill="url(#monkeyFace)" />
        </g>
      </svg>
    </div>
  );
}
