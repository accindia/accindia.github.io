import React from 'react';
import { AvatarFrameType } from '../types';

interface AvatarWith3DFrameProps {
  avatarUrl?: string;
  name: string;
  frame?: AvatarFrameType;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showBadge?: boolean;
  className?: string;
  onClick?: () => void;
}

export const AVATAR_FRAMES: {
  id: AvatarFrameType;
  name: string;
  hindiName: string;
  description: string;
  desc?: string;
  badge?: string;
  icon: string;
  gradientClass: string;
  glowClass: string;
}[] = [
  {
    id: 'fire',
    name: 'Inferno Fire Ring',
    hindiName: '🔥 अग्नि चक्र (3D Live Fire Ring)',
    description: 'चारों तरफ 360° घूमती आग की लपटें और 3D ज्वाला रिंग',
    desc: 'चारों तरफ 360° घूमती आग की लपटें और 3D ज्वाला रिंग',
    badge: '🔥 3D Live Fire',
    icon: '🔥',
    gradientClass: 'from-amber-400 via-orange-500 to-red-600',
    glowClass: 'shadow-[0_0_25px_rgba(239,68,68,0.95)] border-orange-400 ring-2 ring-orange-400/70',
  },
  {
    id: 'water',
    name: 'Ocean Wave Vortex',
    hindiName: '💧 जल चक्र (3D Water Vortex)',
    description: '360° घूमती शांत और गतिशील नीली समुद्री लहरें',
    desc: '360° घूमती शांत और गतिशील नीली समुद्री लहरें',
    badge: '💧 Ocean Wave',
    icon: '💧',
    gradientClass: 'from-cyan-300 via-sky-500 to-blue-600',
    glowClass: 'shadow-[0_0_22px_rgba(6,182,212,0.9)] border-cyan-400 ring-2 ring-cyan-400/60',
  },
  {
    id: 'work_hard',
    name: 'Work Hard / Neon Energy',
    hindiName: '⚡ वर्क हार्ड (Work Hard Neon Ring)',
    description: 'मेहनत और सफलता का 360° एनर्जेटिक इलेक्ट्रिक पल्स',
    desc: 'मेहनत और सफलता का 360° एनर्जेटिक इलेक्ट्रिक पल्स',
    badge: '⚡ Neon Energy',
    icon: '⚡',
    gradientClass: 'from-emerald-400 via-yellow-400 to-cyan-500',
    glowClass: 'shadow-[0_0_24px_rgba(250,204,21,0.95)] border-yellow-300 ring-2 ring-yellow-400/70',
  },
  {
    id: 'royal_gold',
    name: 'Royal Gold VIP',
    hindiName: '👑 शाही गोल्ड (Royal Gold Crown)',
    description: 'घूमता रॉयल मेटैलिक 3D गोल्ड और क्राउन आभा',
    desc: 'घूमता रॉयल मेटैलिक 3D गोल्ड और क्राउन आभा',
    badge: '👑 Royal VIP',
    icon: '👑',
    gradientClass: 'from-[#fff3a8] via-[#eab308] to-[#92400e]',
    glowClass: 'shadow-[0_0_26px_rgba(234,179,8,0.95)] border-yellow-300 ring-2 ring-yellow-500/80',
  },
  {
    id: 'neon_cyber',
    name: 'Diamond Cosmic Portal',
    hindiName: '💎 डायमंड कॉस्मिक (Diamond Neon)',
    description: 'फ्यूचरिस्टिक 360° बैंगनी-गुलाबी कॉस्मिक औरा',
    desc: 'फ्यूचरिस्टिक 360° बैंगनी-गुलाबी कॉस्मिक औरा',
    badge: '💎 Cosmic VIP',
    icon: '💎',
    gradientClass: 'from-fuchsia-400 via-purple-600 to-indigo-600',
    glowClass: 'shadow-[0_0_24px_rgba(192,38,211,0.9)] border-fuchsia-400 ring-2 ring-fuchsia-500/70',
  },
  {
    id: 'none',
    name: 'Classic Clean',
    hindiName: '⚪ सादा (No Frame)',
    description: 'सामान्य साफ गोल फोटो',
    desc: 'सामान्य साफ गोल फोटो',
    badge: '⚪ Classic',
    icon: '⚪',
    gradientClass: 'from-slate-200 to-slate-300',
    glowClass: 'border-white/80 shadow-sm',
  },
];

export const AvatarWith3DFrame: React.FC<AvatarWith3DFrameProps> = ({
  avatarUrl,
  name,
  frame = 'fire',
  size = 'md',
  showBadge = true,
  className = '',
  onClick,
}) => {
  const initials = (name || 'Member')
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const sizeClasses = {
    sm: 'w-10 h-10 text-xs',
    md: 'w-16 h-16 text-base',
    lg: 'w-24 h-24 text-xl',
    xl: 'w-32 h-32 text-2xl',
    '2xl': 'w-40 h-40 text-3xl',
  };

  const badgeSizes = {
    sm: 'w-4 h-4 text-[9px] -bottom-0.5 -right-0.5',
    md: 'w-5 h-5 text-xs -bottom-1 -right-1',
    lg: 'w-7 h-7 text-sm -bottom-1 -right-1',
    xl: 'w-8 h-8 text-base -bottom-1.5 -right-1.5',
    '2xl': 'w-10 h-10 text-lg -bottom-2 -right-2',
  };

  const flameOffsets = [
    { deg: 0, text: '🔥' },
    { deg: 45, text: '🔥' },
    { deg: 90, text: '🔥' },
    { deg: 135, text: '🔥' },
    { deg: 180, text: '🔥' },
    { deg: 225, text: '🔥' },
    { deg: 270, text: '🔥' },
    { deg: 315, text: '🔥' },
  ];

  const activeFrame = AVATAR_FRAMES.find((f) => f.id === frame) || AVATAR_FRAMES[0];
  const isNone = frame === 'none' || !frame;

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center select-none ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {/* ----------------------------------------------------------------- */}
      {/* 1. DYNAMIC 3D ANIMATED CIRCULAR FRAMES (FIRE, WATER, GOLD, ETC.)  */}
      {/* ----------------------------------------------------------------- */}

      {/* A. 3D LIVE FIRE FRAME: CIRCULATING 360° RING OF FIRE WITH FLAMES (GPU ACCELERATED) */}
      {frame === 'fire' && (
        <div className="absolute -inset-2 sm:-inset-2.5 rounded-full pointer-events-none z-0 animate-flame-pulse will-change-transform">
          {/* Primary 360° Fast Rotating Conic Flame Ring */}
          <div
            className="absolute -inset-0.5 rounded-full animate-spin-slow opacity-90"
            style={{
              background:
                'conic-gradient(from 0deg, #ff1a00 0%, #ff5500 20%, #ffa500 40%, #ffd700 60%, #ff3300 80%, #ff1a00 100%)',
            }}
          />

          {/* Counter-Rotating Secondary Blazing Ember Ring */}
          <div
            className="absolute -inset-1 rounded-full animate-spin-reverse-slow opacity-80"
            style={{
              background:
                'conic-gradient(from 180deg, rgba(255,69,0,0.85) 0%, rgba(255,215,0,0.7) 30%, rgba(255,0,0,0.3) 60%, rgba(255,69,0,0.85) 100%)',
            }}
          />

          {/* 4 Cardinal Flame Tongues around the 360° Perimeter */}
          <div className="absolute inset-0 rounded-full animate-spin-slow">
            {[0, 90, 180, 270].map((deg) => {
              const rad = (deg * Math.PI) / 180;
              return (
                <span
                  key={deg}
                  className="absolute text-[9px] sm:text-[10px] leading-none animate-flame-tongue select-none"
                  style={{
                    top: `${50 - 50 * Math.cos(rad)}%`,
                    left: `${50 + 50 * Math.sin(rad)}%`,
                    transform: `translate(-50%, -50%) rotate(${deg}deg)`,
                  }}
                >
                  🔥
                </span>
              );
            })}
          </div>

          {/* Golden Hot Fire Glow Border */}
          <div className="absolute inset-0 rounded-full border border-yellow-300/80 shadow-[0_0_10px_#ff6600,inset_0_0_6px_#ff2200]" />
        </div>
      )}

      {/* B. 3D LIVE WATER FRAME: CIRCULATING OCEAN WAVE VORTEX */}
      {frame === 'water' && (
        <div className="absolute -inset-2.5 sm:-inset-3 rounded-full pointer-events-none z-0">
          <div
            className="absolute -inset-1 rounded-full animate-spin-slow opacity-90 blur-[1.5px]"
            style={{
              background:
                'conic-gradient(from 0deg, #00f5d4 0%, #00bbf9 25%, #0077b6 50%, #48cae4 75%, #00f5d4 100%)',
            }}
          />
          <div
            className="absolute -inset-1.5 rounded-full animate-spin-reverse-slow opacity-80 blur-[2px]"
            style={{
              background:
                'conic-gradient(from 180deg, rgba(0,245,212,0.9) 0%, transparent 35%, rgba(0,119,182,0.95) 70%, rgba(0,245,212,0.9) 100%)',
            }}
          />
          <div className="absolute inset-0 rounded-full animate-spin-slow">
            {[0, 60, 120, 180, 240, 300].map((angle, idx) => {
              const rad = (angle * Math.PI) / 180;
              return (
                <span
                  key={idx}
                  className="absolute text-[8px] sm:text-[10px] drop-shadow-[0_0_8px_#00bbf9]"
                  style={{
                    top: `${50 - 52 * Math.cos(rad)}%`,
                    left: `${50 + 52 * Math.sin(rad)}%`,
                    transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                  }}
                >
                  💧
                </span>
              );
            })}
          </div>
          <div className="absolute inset-0 rounded-full border-2 border-cyan-300 shadow-[0_0_15px_#00bbf9,inset_0_0_8px_#0077b6]" />
        </div>
      )}

      {/* C. 3D LIVE WORK HARD FRAME: ROTATING ELECTRIC NEON PLASMA RING */}
      {frame === 'work_hard' && (
        <div className="absolute -inset-2.5 sm:-inset-3 rounded-full pointer-events-none z-0">
          <div
            className="absolute -inset-1 rounded-full animate-spin-slow opacity-95 blur-[1.5px]"
            style={{
              background:
                'conic-gradient(from 0deg, #10b981 0%, #facc15 25%, #06b6d4 50%, #eab308 75%, #10b981 100%)',
            }}
          />
          <div
            className="absolute -inset-1.5 rounded-full animate-spin-reverse-slow opacity-85 blur-[2px]"
            style={{
              background:
                'conic-gradient(from 180deg, rgba(250,204,21,0.9) 0%, rgba(16,185,129,0.9) 50%, rgba(6,182,212,0.9) 100%)',
            }}
          />
          <div className="absolute inset-0 rounded-full animate-spin-slow">
            {[0, 90, 180, 270].map((angle, idx) => {
              const rad = (angle * Math.PI) / 180;
              return (
                <span
                  key={idx}
                  className="absolute text-[8px] sm:text-[10px] drop-shadow-[0_0_10px_#facc15]"
                  style={{
                    top: `${50 - 52 * Math.cos(rad)}%`,
                    left: `${50 + 52 * Math.sin(rad)}%`,
                    transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                  }}
                >
                  ⚡
                </span>
              );
            })}
          </div>
          <div className="absolute inset-0 rounded-full border-2 border-yellow-200 shadow-[0_0_18px_#facc15]" />
        </div>
      )}

      {/* D. 3D LIVE ROYAL GOLD VIP FRAME: ROTATING IMPERIAL GOLD SUNBURST */}
      {frame === 'royal_gold' && (
        <div className="absolute -inset-2.5 sm:-inset-3 rounded-full pointer-events-none z-0">
          <div
            className="absolute -inset-1 rounded-full animate-spin-slow opacity-95 blur-[1.5px]"
            style={{
              background:
                'conic-gradient(from 0deg, #fff3a8 0%, #ffd700 20%, #b8860b 40%, #eab308 60%, #fff8bd 80%, #ffd700 100%)',
            }}
          />
          <div
            className="absolute -inset-1.5 rounded-full animate-spin-reverse-slow opacity-85 blur-[2px]"
            style={{
              background:
                'conic-gradient(from 180deg, rgba(255,215,0,0.95) 0%, rgba(184,134,11,0.9) 50%, rgba(255,243,168,0.95) 100%)',
            }}
          />
          <div className="absolute inset-0 rounded-full animate-spin-slow">
            {[0, 120, 240].map((angle, idx) => {
              const rad = (angle * Math.PI) / 180;
              return (
                <span
                  key={idx}
                  className="absolute text-[8px] sm:text-[10px] drop-shadow-[0_0_10px_#ffd700]"
                  style={{
                    top: `${50 - 52 * Math.cos(rad)}%`,
                    left: `${50 + 52 * Math.sin(rad)}%`,
                    transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                  }}
                >
                  ✨
                </span>
              );
            })}
          </div>
          <div className="absolute inset-0 rounded-full border-2 border-yellow-200 shadow-[0_0_20px_#ffd700]" />
        </div>
      )}

      {/* E. 3D LIVE NEON CYBER COSMIC PORTAL */}
      {frame === 'neon_cyber' && (
        <div className="absolute -inset-2.5 sm:-inset-3 rounded-full pointer-events-none z-0">
          <div
            className="absolute -inset-1 rounded-full animate-spin-slow opacity-95 blur-[1.5px]"
            style={{
              background:
                'conic-gradient(from 0deg, #f43f5e 0%, #a855f7 30%, #3b82f6 60%, #ec4899 85%, #f43f5e 100%)',
            }}
          />
          <div
            className="absolute -inset-1.5 rounded-full animate-spin-reverse-slow opacity-85 blur-[2px]"
            style={{
              background:
                'conic-gradient(from 180deg, rgba(236,72,153,0.9) 0%, rgba(168,85,247,0.9) 50%, rgba(59,130,246,0.9) 100%)',
            }}
          />
          <div className="absolute inset-0 rounded-full animate-spin-slow">
            {[0, 90, 180, 270].map((angle, idx) => {
              const rad = (angle * Math.PI) / 180;
              return (
                <span
                  key={idx}
                  className="absolute text-[8px] sm:text-[10px] drop-shadow-[0_0_10px_#ec4899]"
                  style={{
                    top: `${50 - 52 * Math.cos(rad)}%`,
                    left: `${50 + 52 * Math.sin(rad)}%`,
                    transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                  }}
                >
                  💎
                </span>
              );
            })}
          </div>
          <div className="absolute inset-0 rounded-full border-2 border-fuchsia-300 shadow-[0_0_20px_#c026d3]" />
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* 2. INNER AVATAR PHOTO & INITIALS CONTAINER                       */}
      {/* ----------------------------------------------------------------- */}
      <div
        className={`relative rounded-full p-1 z-10 transition-all duration-300 ${
          isNone
            ? 'p-0.5 bg-slate-300'
            : `bg-gradient-to-tr ${activeFrame.gradientClass} ${activeFrame.glowClass}`
        }`}
      >
        <div
          className={`${sizeClasses[size]} relative rounded-full overflow-hidden bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center font-bold font-display text-white border-2 border-white shadow-inner z-10`}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <span className="tracking-wider drop-shadow-sm">{initials}</span>
          )}
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* 3. 3D BADGE INDICATOR (BOTTOM CORNER)                            */}
      {/* ----------------------------------------------------------------- */}
      {showBadge && !isNone && (
        <div
          className={`absolute ${badgeSizes[size]} rounded-full bg-slate-950 border-2 border-white flex items-center justify-center shadow-lg z-20 animate-bounce`}
          style={{ animationDuration: '3s' }}
          title={activeFrame.name}
        >
          <span>{activeFrame.icon}</span>
        </div>
      )}
    </div>
  );
};
