import React from 'react';

export default function WelcomeCharacter() {
  return (
    <div className="fixed bottom-4 left-4 z-50 animate-bounce-slow">
      <div className="relative group cursor-pointer">
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          className="drop-shadow-lg"
        >
          <defs>
            <style>{`
              .wave-hand {
                animation: wave 2s ease-in-out infinite;
                transform-origin: 70px 65px;
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
              .fez-bounce {
                animation: fez-bounce 1s ease-in-out infinite;
                transform-origin: 60px 25px;
              }
              @keyframes fez-bounce {
                0%, 100% { transform: translateY(0) rotate(-5deg); }
                50% { transform: translateY(-2px) rotate(-5deg); }
              }
            `}</style>
          </defs>

          {/* Body */}
          <ellipse cx="60" cy="85" rx="28" ry="32" fill="#FFD700" />

          {/* Head */}
          <circle cx="60" cy="50" r="24" fill="#FFE4B5" />

          {/* Fez Hat */}
          <g className="fez-bounce">
            <ellipse cx="60" cy="28" rx="18" ry="4" fill="#8B0000" />
            <path d="M 42 28 Q 60 10 78 28 L 78 32 L 42 32 Z" fill="#DC143C" />
            <circle cx="60" cy="12" r="3" fill="#FFD700" />
            <line x1="60" y1="12" x2="68" y2="6" stroke="#FFD700" strokeWidth="1.5" />
          </g>

          {/* Eyes */}
          <g className="blink-eye">
            <circle cx="52" cy="48" r="3" fill="#000" />
            <circle cx="68" cy="48" r="3" fill="#000" />
            <circle cx="53" cy="47" r="1" fill="#fff" />
            <circle cx="69" cy="47" r="1" fill="#fff" />
          </g>

          {/* Smile */}
          <path d="M 50 55 Q 60 60 70 55" stroke="#000" strokeWidth="2" fill="none" strokeLinecap="round" />

          {/* Mustache */}
          <path d="M 45 53 Q 52 52 60 52" stroke="#000" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M 60 52 Q 68 52 75 53" stroke="#000" strokeWidth="2" fill="none" strokeLinecap="round" />

          {/* Arms */}
          <ellipse cx="35" cy="75" rx="6" ry="18" fill="#FFE4B5" transform="rotate(-20 35 75)" />
          <g className="wave-hand">
            <ellipse cx="85" cy="65" rx="6" ry="18" fill="#FFE4B5" transform="rotate(45 85 65)" />
            <circle cx="95" cy="58" r="5" fill="#FFE4B5" />
          </g>

          {/* Legs */}
          <ellipse cx="50" cy="108" rx="5" ry="14" fill="#4169E1" />
          <ellipse cx="70" cy="108" rx="5" ry="14" fill="#4169E1" />
        </svg>

        {/* Speech Bubble */}
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          <div className="bg-white px-4 py-2 rounded-lg shadow-lg text-sm font-semibold text-gray-800 relative">
            أهلاً وسهلاً! 👋
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-3 h-3 bg-white"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
