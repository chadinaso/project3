import React from 'react';

export default function WalkingFarmer() {
  return (
    <div className="relative w-full h-24 overflow-hidden my-6">
      <div className="absolute animate-walk-across">
        <svg
          width="80"
          height="80"
          viewBox="0 0 200 200"
          className="drop-shadow-lg"
        >
          <defs>
            <style>{`
              @keyframes walk-leg {
                0%, 100% { transform: rotate(-20deg); }
                50% { transform: rotate(20deg); }
              }
              @keyframes walk-arm {
                0%, 100% { transform: rotate(-15deg); }
                50% { transform: rotate(30deg); }
              }
              @keyframes tool-swing {
                0%, 100% { transform: rotate(-5deg); }
                50% { transform: rotate(10deg); }
              }
              @keyframes body-bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-3px); }
              }
              .leg-left {
                animation: walk-leg 0.8s ease-in-out infinite;
                transform-origin: 70px 110px;
              }
              .leg-right {
                animation: walk-leg 0.8s ease-in-out infinite;
                animation-delay: 0.4s;
                transform-origin: 85px 110px;
              }
              .arm-left {
                animation: walk-arm 0.8s ease-in-out infinite;
                transform-origin: 65px 75px;
                animation-delay: 0.4s;
              }
              .arm-right {
                animation: walk-arm 0.8s ease-in-out infinite;
                transform-origin: 90px 75px;
              }
              .tool {
                animation: tool-swing 0.8s ease-in-out infinite;
                transform-origin: 50px 60px;
              }
              .body {
                animation: body-bounce 0.8s ease-in-out infinite;
              }
            `}</style>
          </defs>

          {/* Shadow */}
          <ellipse cx="77" cy="185" rx="30" ry="6" fill="#000" opacity="0.2" />

          {/* Legs */}
          <g className="leg-right">
            <path d="M 85 110 L 90 145" stroke="#8B7355" strokeWidth="8" strokeLinecap="round" />
            <ellipse cx="90" cy="148" rx="7" ry="4" fill="#654321" />
          </g>
          <g className="leg-left">
            <path d="M 70 110 L 65 145" stroke="#8B7355" strokeWidth="8" strokeLinecap="round" />
            <ellipse cx="65" cy="148" rx="7" ry="4" fill="#654321" />
          </g>

          {/* Body */}
          <g className="body">
            {/* Shirt */}
            <rect x="55" y="70" width="45" height="45" rx="3" fill="#87CEEB" stroke="#5F9EA0" strokeWidth="2" />

            {/* Belt */}
            <rect x="55" y="110" width="45" height="6" fill="#654321" />

            {/* Neck */}
            <rect x="70" y="55" width="15" height="12" fill="#D2B48C" />

            {/* Head */}
            <circle cx="77.5" cy="45" r="18" fill="#F4D4A8" stroke="#D2A679" strokeWidth="2" />

            {/* Straw Hat */}
            <ellipse cx="77.5" cy="28" rx="26" ry="5" fill="#DAA520" stroke="#B8860B" strokeWidth="1.5" />
            <path d="M 60 28 Q 65 18 77.5 16 Q 90 18 95 28 Z" fill="#F4C542" stroke="#B8860B" strokeWidth="1.5" />
            <ellipse cx="77.5" cy="28" rx="16" ry="2" fill="#8B4513" />

            {/* Mustache */}
            <path d="M 70 48 Q 77.5 50 85 48" stroke="#654321" strokeWidth="2" fill="none" strokeLinecap="round" />

            {/* Eyes */}
            <circle cx="70" cy="42" r="2" fill="#2c1810" />
            <circle cx="85" cy="42" r="2" fill="#2c1810" />

            {/* Smile */}
            <path d="M 70 52 Q 77.5 55 85 52" stroke="#000" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </g>

          {/* Right arm with pickaxe */}
          <g className="arm-right">
            <g className="tool">
              {/* Pickaxe handle */}
              <path d="M 55 65 L 30 40" stroke="#654321" strokeWidth="4" strokeLinecap="round" />

              {/* Pickaxe head */}
              <path d="M 25 35 L 35 45" stroke="#708090" strokeWidth="5" strokeLinecap="round" />
              <path d="M 35 35 L 25 45" stroke="#708090" strokeWidth="5" strokeLinecap="round" />

              {/* Metal shine */}
              <line x1="28" y1="38" x2="32" y2="42" stroke="#B0C4DE" strokeWidth="1.5" strokeLinecap="round" />
            </g>
            <path d="M 90 75 L 60 65" stroke="#D2B48C" strokeWidth="7" strokeLinecap="round" />
            <circle cx="58" cy="64" r="5" fill="#D2B48C" />
          </g>

          {/* Left arm */}
          <g className="arm-left">
            <path d="M 65 75 L 50 90" stroke="#D2B48C" strokeWidth="7" strokeLinecap="round" />
            <circle cx="48" cy="92" r="5" fill="#D2B48C" />
          </g>

          {/* Sweat drops (working hard!) */}
          <circle cx="90" cy="40" r="2" fill="#4FC3F7" opacity="0.7" />
          <circle cx="92" cy="36" r="1.5" fill="#4FC3F7" opacity="0.5" />
        </svg>
      </div>
    </div>
  );
}
