import React from 'react';

export default function WelcomeCharacter() {
  return (
    <div className="relative group cursor-pointer hidden md:block">
      <div className="relative">
        <svg
          width="60"
          height="60"
          viewBox="0 0 160 180"
          className="drop-shadow-xl"
        >
          <defs>
            <style>{`
              .wave-hand {
                animation: wave 2s ease-in-out infinite;
                transform-origin: 115px 85px;
              }
              @keyframes wave {
                0%, 100% { transform: rotate(0deg); }
                10%, 30% { transform: rotate(14deg); }
                20%, 40% { transform: rotate(-8deg); }
                50% { transform: rotate(0deg); }
              }
              .blink-eye {
                animation: blink 4s infinite;
              }
              @keyframes blink {
                0%, 48%, 52%, 100% { opacity: 1; }
                50% { opacity: 0; }
              }
              .fez-tilt {
                animation: fez-tilt 3s ease-in-out infinite;
                transform-origin: 80px 35px;
              }
              @keyframes fez-tilt {
                0%, 100% { transform: rotate(-5deg); }
                50% { transform: rotate(2deg); }
              }
              .tassel-swing {
                animation: tassel-swing 2s ease-in-out infinite;
                transform-origin: 80px 20px;
              }
              @keyframes tassel-swing {
                0%, 100% { transform: rotate(-15deg); }
                50% { transform: rotate(15deg); }
              }
            `}</style>
            <linearGradient id="fezGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8B0000" />
              <stop offset="100%" stopColor="#DC143C" />
            </linearGradient>
            <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1e40af" />
              <stop offset="100%" stopColor="#1e3a8a" />
            </linearGradient>
            <linearGradient id="skinGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFE4C4" />
              <stop offset="100%" stopColor="#FFD7A8" />
            </linearGradient>
          </defs>

          {/* Shadow */}
          <ellipse cx="80" cy="172" rx="40" ry="6" fill="#000" opacity="0.15" />

          {/* Legs */}
          <rect x="60" y="135" width="15" height="35" rx="7" fill="#1e3a8a" />
          <rect x="85" y="135" width="15" height="35" rx="7" fill="#1e3a8a" />

          {/* Shoes */}
          <ellipse cx="67.5" cy="170" rx="10" ry="5" fill="#2c1810" />
          <ellipse cx="92.5" cy="170" rx="10" ry="5" fill="#2c1810" />

          {/* Body - Traditional Lebanese Vest */}
          <path d="M 50 90 Q 50 85 55 85 L 105 85 Q 110 85 110 90 L 110 135 Q 110 140 105 140 L 55 140 Q 50 140 50 135 Z" fill="url(#bodyGradient)" />

          {/* Vest Details */}
          <line x1="80" y1="85" x2="80" y2="140" stroke="#FFD700" strokeWidth="2" />
          <circle cx="80" cy="95" r="3" fill="#FFD700" />
          <circle cx="80" cy="107" r="3" fill="#FFD700" />
          <circle cx="80" cy="119" r="3" fill="#FFD700" />
          <circle cx="80" cy="131" r="3" fill="#FFD700" />

          {/* White Shirt */}
          <path d="M 60 85 L 60 95 Q 60 100 65 100 L 95 100 Q 100 100 100 95 L 100 85" fill="#ffffff" />

          {/* Arms */}
          <ellipse cx="40" cy="100" rx="10" ry="25" fill="url(#skinGradient)" transform="rotate(-15 40 100)" />

          {/* Waving Arm */}
          <g className="wave-hand">
            <ellipse cx="120" cy="95" rx="10" ry="25" fill="url(#skinGradient)" transform="rotate(45 120 95)" />
            <circle cx="130" cy="80" r="8" fill="url(#skinGradient)" />
          </g>

          {/* Neck */}
          <rect x="72" y="70" width="16" height="15" fill="url(#skinGradient)" />

          {/* Head */}
          <ellipse cx="80" cy="55" rx="28" ry="32" fill="url(#skinGradient)" />

          {/* Ears */}
          <ellipse cx="52" cy="55" rx="5" ry="8" fill="#FFD7A8" />
          <ellipse cx="108" cy="55" rx="5" ry="8" fill="#FFD7A8" />

          {/* Lebanese Tarboush (Fez) */}
          <g className="fez-tilt">
            {/* Base of tarboush */}
            <ellipse cx="80" cy="35" rx="24" ry="6" fill="#8B0000" />
            {/* Main cone */}
            <path d="M 56 35 Q 80 10 104 35 L 104 40 L 56 40 Z" fill="url(#fezGradient)" />
            {/* Top circle */}
            <ellipse cx="80" cy="40" rx="24" ry="5" fill="#DC143C" />
            {/* Tassel */}
            <g className="tassel-swing">
              <line x1="80" y1="20" x2="90" y2="5" stroke="#FFD700" strokeWidth="1.5" />
              <circle cx="90" cy="5" r="2.5" fill="#FFD700" />
              <circle cx="90" cy="8" r="1.5" fill="#FFA500" />
              <circle cx="89" cy="11" r="1.5" fill="#FFD700" />
              <circle cx="91" cy="11" r="1.5" fill="#FFA500" />
            </g>
          </g>

          {/* Eyebrows */}
          <path d="M 60 45 Q 65 43 70 44" stroke="#000" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M 90 44 Q 95 43 100 45" stroke="#000" strokeWidth="2" fill="none" strokeLinecap="round" />

          {/* Eyes */}
          <g className="blink-eye">
            <ellipse cx="65" cy="52" rx="5" ry="6" fill="#fff" />
            <ellipse cx="95" cy="52" rx="5" ry="6" fill="#fff" />
            <circle cx="65" cy="53" r="3.5" fill="#2c1810" />
            <circle cx="95" cy="53" r="3.5" fill="#2c1810" />
            <circle cx="66" cy="52" r="1.5" fill="#fff" />
            <circle cx="96" cy="52" r="1.5" fill="#fff" />
          </g>

          {/* Nose */}
          <path d="M 80 55 L 80 62 M 80 62 Q 78 63 76 62" stroke="#D4A574" strokeWidth="2" fill="none" strokeLinecap="round" />

          {/* Mustache - Lebanese Style */}
          <path d="M 60 63 Q 70 61 80 62" stroke="#2c1810" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 80 62 Q 90 61 100 63" stroke="#2c1810" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 56 64 Q 60 65 64 65" stroke="#2c1810" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M 96 65 Q 100 65 104 64" stroke="#2c1810" strokeWidth="2.5" fill="none" strokeLinecap="round" />

          {/* Big Smile */}
          <path d="M 65 68 Q 80 75 95 68" stroke="#000" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M 65 68 Q 80 73 95 68" fill="#FFF" opacity="0.3" />
        </svg>

        {/* Speech Bubble */}
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-50">
          <div className="bg-white px-4 py-2 rounded-xl shadow-2xl text-sm font-bold text-gray-800 relative border-2 border-green-500">
            أهلاً وسهلاً! 🇱🇧
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45 w-3 h-3 bg-white border-l-2 border-t-2 border-green-500"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
