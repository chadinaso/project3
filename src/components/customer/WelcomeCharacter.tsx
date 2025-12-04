import React from 'react';

export default function WelcomeCharacter() {
  return (
    <div className="relative group cursor-pointer">
      <div className="relative">
        <svg
          width="80"
          height="60"
          viewBox="0 0 220 180"
          className="drop-shadow-xl"
        >
          <defs>
            <style>{`
              .pick-fruit {
                animation: pick 3s ease-in-out infinite;
                transform-origin: 120px 70px;
              }
              @keyframes pick {
                0%, 100% { transform: translateY(0) rotate(20deg); }
                50% { transform: translateY(-8px) rotate(25deg); }
              }
              .blink-eye {
                animation: blink 4s infinite;
              }
              @keyframes blink {
                0%, 48%, 52%, 100% { opacity: 1; }
                50% { opacity: 0; }
              }
              .hat-wobble {
                animation: wobble 3s ease-in-out infinite;
                transform-origin: 80px 30px;
              }
              @keyframes wobble {
                0%, 100% { transform: rotate(-2deg); }
                50% { transform: rotate(2deg); }
              }
              .fruit-float {
                animation: float 2s ease-in-out infinite;
              }
              @keyframes float {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-3px); }
              }
              .tree-sway {
                animation: sway 4s ease-in-out infinite;
                transform-origin: 170px 130px;
              }
              @keyframes sway {
                0%, 100% { transform: rotate(-1deg); }
                50% { transform: rotate(1deg); }
              }
              .leaf-rustle {
                animation: rustle 3s ease-in-out infinite;
              }
              @keyframes rustle {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.02); }
              }
            `}</style>
            <filter id="sketch">
              <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" />
            </filter>
          </defs>

          {/* Apple Tree */}
          <g className="tree-sway">
            {/* Tree trunk */}
            <path d="M 165 130 Q 168 110 170 90 Q 172 110 175 130" fill="#654321" stroke="#4a3520" strokeWidth="2" filter="url(#sketch)" />

            {/* Branches */}
            <path d="M 170 100 Q 160 95 155 92" stroke="#654321" strokeWidth="2" fill="none" filter="url(#sketch)" />
            <path d="M 170 105 Q 180 100 185 97" stroke="#654321" strokeWidth="2" fill="none" filter="url(#sketch)" />

            {/* Tree foliage - multiple circles for leaves */}
            <g className="leaf-rustle">
              <circle cx="170" cy="70" r="28" fill="#2F9E44" stroke="#1E7A32" strokeWidth="2" filter="url(#sketch)" opacity="0.9" />
              <circle cx="150" cy="80" r="22" fill="#37B24D" stroke="#2F9E44" strokeWidth="1.5" filter="url(#sketch)" opacity="0.85" />
              <circle cx="190" cy="82" r="22" fill="#37B24D" stroke="#2F9E44" strokeWidth="1.5" filter="url(#sketch)" opacity="0.85" />
              <circle cx="170" cy="88" r="20" fill="#40C057" stroke="#37B24D" strokeWidth="1.5" filter="url(#sketch)" opacity="0.8" />
            </g>

            {/* Apples on tree */}
            <circle cx="158" cy="75" r="4.5" fill="#FF6B6B" stroke="#C92A2A" strokeWidth="1" filter="url(#sketch)" />
            <circle cx="182" cy="72" r="4.5" fill="#FF6B6B" stroke="#C92A2A" strokeWidth="1" filter="url(#sketch)" />
            <circle cx="175" cy="82" r="4.5" fill="#FF6B6B" stroke="#C92A2A" strokeWidth="1" filter="url(#sketch)" />
            <circle cx="163" cy="88" r="4.5" fill="#FF6B6B" stroke="#C92A2A" strokeWidth="1" filter="url(#sketch)" />
            <circle cx="170" cy="66" r="4.5" fill="#FF6B6B" stroke="#C92A2A" strokeWidth="1" filter="url(#sketch)" />

            {/* Small leaves details */}
            <path d="M 168 68 Q 170 66 172 68" fill="#2F9E44" stroke="none" />
            <path d="M 180 78 Q 182 76 184 78" fill="#2F9E44" stroke="none" />
            <path d="M 160 82 Q 162 80 164 82" fill="#2F9E44" stroke="none" />
          </g>

          {/* Shadow */}
          <ellipse cx="80" cy="172" rx="35" ry="5" fill="#000" opacity="0.2" />
          <ellipse cx="170" cy="172" rx="22" ry="4" fill="#000" opacity="0.15" />

          {/* Legs - sketch style */}
          <path d="M 63 135 Q 64 150 65 168" stroke="#4a3520" strokeWidth="12" fill="none" strokeLinecap="round" filter="url(#sketch)" />
          <path d="M 88 135 Q 89 150 90 168" stroke="#4a3520" strokeWidth="12" fill="none" strokeLinecap="round" filter="url(#sketch)" />

          {/* Simple shoes */}
          <ellipse cx="65" cy="170" rx="8" ry="4" fill="#3d2817" filter="url(#sketch)" />
          <ellipse cx="90" cy="170" rx="8" ry="4" fill="#3d2817" filter="url(#sketch)" />

          {/* Body - Simple farmer shirt */}
          <path d="M 50 88 L 48 135 L 112 135 L 110 88 Z" fill="#8B7355" stroke="#654321" strokeWidth="2" filter="url(#sketch)" />

          {/* Shirt wrinkles - sketch lines */}
          <line x1="70" y1="95" x2="68" y2="125" stroke="#654321" strokeWidth="1" opacity="0.3" />
          <line x1="90" y1="95" x2="92" y2="125" stroke="#654321" strokeWidth="1" opacity="0.3" />

          {/* Belt */}
          <rect x="48" y="130" width="64" height="6" fill="#654321" filter="url(#sketch)" />

          {/* Left arm down */}
          <path d="M 48 95 Q 35 105 32 120" stroke="#D2B48C" strokeWidth="10" fill="none" strokeLinecap="round" filter="url(#sketch)" />
          <circle cx="32" cy="123" r="6" fill="#D2B48C" filter="url(#sketch)" />

          {/* Right arm up - picking fruit */}
          <g className="pick-fruit">
            <path d="M 110 95 Q 118 75 125 65" stroke="#D2B48C" strokeWidth="10" fill="none" strokeLinecap="round" filter="url(#sketch)" />
            <circle cx="127" cy="62" r="6" fill="#D2B48C" filter="url(#sketch)" />

            {/* Hand holding fruit */}
            <g className="fruit-float">
              <circle cx="135" cy="55" r="6" fill="#FF6B6B" stroke="#C92A2A" strokeWidth="1.5" filter="url(#sketch)" />
              <line x1="135" y1="49" x2="135" y2="46" stroke="#2F9E44" strokeWidth="2" strokeLinecap="round" />
              <path d="M 135 46 Q 133 44 131 45" fill="#2F9E44" stroke="none" />
            </g>
          </g>

          {/* Neck */}
          <rect x="73" y="70" width="14" height="13" fill="#D2B48C" filter="url(#sketch)" />

          {/* Head - sketch circle */}
          <circle cx="80" cy="55" r="25" fill="#F4D4A8" stroke="#D2A679" strokeWidth="2" filter="url(#sketch)" />

          {/* Ears */}
          <ellipse cx="55" cy="55" rx="4" ry="7" fill="#E6C199" filter="url(#sketch)" />
          <ellipse cx="105" cy="55" rx="4" ry="7" fill="#E6C199" filter="url(#sketch)" />

          {/* Straw hat */}
          <g className="hat-wobble">
            {/* Hat brim */}
            <ellipse cx="80" cy="35" rx="32" ry="8" fill="#DAA520" stroke="#B8860B" strokeWidth="2" filter="url(#sketch)" />
            {/* Hat top */}
            <path d="M 60 35 Q 65 22 80 20 Q 95 22 100 35 Z" fill="#F4C542" stroke="#B8860B" strokeWidth="2" filter="url(#sketch)" />
            {/* Hat band */}
            <ellipse cx="80" cy="35" rx="20" ry="3" fill="#8B4513" />
            {/* Sketch lines on hat */}
            <path d="M 60 30 Q 80 28 100 30" stroke="#B8860B" strokeWidth="1" fill="none" opacity="0.5" />
          </g>

          {/* Eyebrows - thick sketch */}
          <path d="M 62 45 Q 68 43 73 44" stroke="#5D4E37" strokeWidth="2.5" fill="none" strokeLinecap="round" filter="url(#sketch)" />
          <path d="M 87 44 Q 92 43 98 45" stroke="#5D4E37" strokeWidth="2.5" fill="none" strokeLinecap="round" filter="url(#sketch)" />

          {/* Eyes */}
          <g className="blink-eye">
            <circle cx="68" cy="52" r="3" fill="#2c1810" />
            <circle cx="92" cy="52" r="3" fill="#2c1810" />
            <circle cx="69" cy="51" r="1" fill="#fff" />
            <circle cx="93" cy="51" r="1" fill="#fff" />
          </g>

          {/* Nose - simple sketch */}
          <path d="M 80 52 L 80 60 Q 78 61 76 60" stroke="#C9A87C" strokeWidth="2" fill="none" strokeLinecap="round" />

          {/* Cheerful smile */}
          <path d="M 67 63 Q 80 69 93 63" stroke="#000" strokeWidth="2.5" fill="none" strokeLinecap="round" filter="url(#sketch)" />

          {/* Rosy cheeks */}
          <circle cx="60" cy="58" r="4" fill="#FF8C94" opacity="0.4" />
          <circle cx="100" cy="58" r="4" fill="#FF8C94" opacity="0.4" />

          {/* Some fruits on ground */}
          <circle cx="25" cy="165" r="4" fill="#FF6B6B" opacity="0.6" filter="url(#sketch)" />
          <circle cx="35" cy="167" r="4" fill="#FFA94D" opacity="0.6" filter="url(#sketch)" />
        </svg>

        {/* Speech Bubble */}
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-50">
          <div className="bg-white px-4 py-2 rounded-xl shadow-2xl text-sm font-bold text-gray-800 relative border-2 border-green-500">
            منتجات طازجة من المزرعة!
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45 w-3 h-3 bg-white border-l-2 border-t-2 border-green-500"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
