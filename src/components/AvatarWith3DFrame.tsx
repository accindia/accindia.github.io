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

export interface AvatarFrameInfo {
  id: AvatarFrameType;
  name: string;
  hindiName: string;
  description: string;
  desc?: string;
  badge?: string;
  icon: string;
  category: 'acc' | 'elements' | 'vip' | 'classic';
  gradientClass: string;
  glowClass: string;
}

export const AVATAR_FRAMES: AvatarFrameInfo[] = [
  {
    id: 'acc_dancing_circle',
    name: 'ACC 3D नाचता हुआ सर्कुलर गोल्ड रिंग',
    hindiName: '✨ ACC 3D नाचता हुआ सर्कुलर गोल्ड रिंग (Dancing Gyro Orbit)',
    description: '3D नाचता हुआ रोटेटिंग रिंग, ऑर्बिटिंग गोल्ड बीड्स, तिरंगा प्रभा-मंडल और डायनेमिक गोल्ड स्पार्कल',
    desc: '3D नाचता हुआ रोटेटिंग रिंग, ऑर्बिटिंग गोल्ड बीड्स, तिरंगा प्रभा-मंडल और डायनेमिक गोल्ड स्पार्कल',
    badge: '✨ ACC 3D Dancing',
    icon: '✨',
    category: 'acc',
    gradientClass: 'from-amber-300 via-yellow-400 to-amber-600',
    glowClass: 'shadow-[0_0_28px_rgba(245,158,11,1)] border-amber-300 ring-2 ring-yellow-400',
  },
  {
    id: 'acc_medallion',
    name: 'ACC 3D गोल्ड मेडैलियन',
    hindiName: '🎖️ ACC 3D गोल्ड मेडैलियन (Official Coin Frame)',
    description: 'सर्कुलर 3D गोल्ड सिक्का फ्रेम, नक्काशीदार टेक्स्ट ACHIEVERS CLUB COMMUNITY एवं तिरंगा रिंग्स',
    desc: 'सर्कुलर 3D गोल्ड सिक्का फ्रेम, नक्काशीदार टेक्स्ट ACHIEVERS CLUB COMMUNITY एवं तिरंगा रिंग्स',
    badge: '🎖️ ACC Official',
    icon: '🎖️',
    category: 'acc',
    gradientClass: 'from-amber-300 via-yellow-500 to-amber-700',
    glowClass: 'shadow-[0_0_22px_rgba(245,158,11,0.95)] border-amber-400 ring-2 ring-yellow-400/80',
  },
  {
    id: 'acc_spinning_text',
    name: 'ACC 360° लाइव रोटेटिंग टेक्स्ट',
    hindiName: '💫 ACC 360° लाइव रोटेटिंग टेक्स्ट रिंग (Orbiting Ring)',
    description: 'चारों तरफ 360° घूमता हुआ नक्काशीदार टेक्स्ट ACHIEVERS CLUB COMMUNITY ★ ACC INDIA',
    desc: 'चारों तरफ 360° घूमता हुआ नक्काशीदार टेक्स्ट ACHIEVERS CLUB COMMUNITY ★ ACC INDIA',
    badge: '💫 Live 360° Text',
    icon: '💫',
    category: 'acc',
    gradientClass: 'from-yellow-300 via-amber-500 to-orange-600',
    glowClass: 'shadow-[0_0_24px_rgba(251,191,36,0.95)] border-amber-300 ring-2 ring-amber-400/80',
  },
  {
    id: 'acc_diwali_deepak',
    name: '3D दिवाली दीपोत्सव एवं कुबेर स्वर्ण',
    hindiName: '🪔 3D दिवाली दीपोत्सव एवं कुबेर स्वर्ण (Festive Deepak Aura)',
    description: 'चारों ओर प्रज्वलित 3D दीये, कुबेर स्वर्ण कांति और मां लक्ष्मी का शुभ आशीर्वाद',
    desc: 'चारों ओर प्रज्वलित 3D दीये, कुबेर स्वर्ण कांति और मां लक्ष्मी का शुभ आशीर्वाद',
    badge: '🪔 Diwali Deepak',
    icon: '🪔',
    category: 'elements',
    gradientClass: 'from-yellow-400 via-amber-500 to-rose-600',
    glowClass: 'shadow-[0_0_28px_rgba(245,158,11,0.95)] border-amber-400 ring-2 ring-rose-500/80',
  },
  {
    id: 'acc_royal_chakra',
    name: '3D नवरत्न रेनबो चक्र VIP',
    hindiName: '🌈 3D नवरत्न रेनबो चक्र VIP (Navratna Rainbow Crown)',
    description: 'इंद्रधनुषी नवरत्न, 360° घूमता प्रिज्म रिंग और शाही 3D गोल्ड डायमंड्स',
    desc: 'इंद्रधनुषी नवरत्न, 360° घूमता प्रिज्म रिंग और शाही 3D गोल्ड डायमंड्स',
    badge: '🌈 Rainbow VIP',
    icon: '🌈',
    category: 'vip',
    gradientClass: 'from-pink-500 via-yellow-400 to-cyan-400',
    glowClass: 'shadow-[0_0_28px_rgba(236,72,153,0.95)] border-yellow-300 ring-2 ring-pink-500/80',
  },
  {
    id: 'tiranga_chakra',
    name: 'तिरंगा एवं अशोक चक्र',
    hindiName: '🇮🇳 भारतीय तिरंगा एवं अशोक चक्र (Tiranga Pride)',
    description: 'केसरिया, श्वेत व हरे रंग का देशभक्ति हेलो और बैकग्राउंड में 24 तीलियों वाला शाही अशोक चक्र',
    desc: 'केसरिया, श्वेत व हरे रंग का देशभक्ति हेलो और बैकग्राउंड में 24 तीलियों वाला शाही अशोक चक्र',
    badge: '🇮🇳 Tiranga Pride',
    icon: '🇮🇳',
    category: 'acc',
    gradientClass: 'from-orange-500 via-white to-emerald-600',
    glowClass: 'shadow-[0_0_22px_rgba(249,115,22,0.85)] border-orange-400 ring-2 ring-emerald-400/60',
  },
  {
    id: 'fire',
    name: 'Inferno Fire Ring',
    hindiName: '🔥 3D लाइव अग्नि चक्र (Live 360° Ring of Fire)',
    description: 'चारों तरफ 360° घूमती आग की लपटें, दहकते अंगारे और 3D ज्वाला रिंग',
    desc: 'चारों तरफ 360° घूमती आग की लपटें, दहकते अंगारे और 3D ज्वाला रिंग',
    badge: '🔥 3D Live Fire',
    icon: '🔥',
    category: 'elements',
    gradientClass: 'from-amber-400 via-orange-500 to-red-600',
    glowClass: 'shadow-[0_0_25px_rgba(239,68,68,0.95)] border-orange-400 ring-2 ring-orange-400/70',
  },
  {
    id: 'royal_gold',
    name: 'Royal Gold VIP Crown',
    hindiName: '👑 शाही 24K गोल्ड क्राउन (Imperial Gold)',
    description: '24 कैरेट गोल्ड की स्वर्णिम विजय माला, क्राउन और हीरों की शाही चमक',
    desc: '24 कैरेट गोल्ड की स्वर्णिम विजय माला, क्राउन और हीरों की शाही चमक',
    badge: '👑 Royal VIP',
    icon: '👑',
    category: 'vip',
    gradientClass: 'from-[#fff3a8] via-[#eab308] to-[#92400e]',
    glowClass: 'shadow-[0_0_26px_rgba(234,179,8,0.95)] border-yellow-300 ring-2 ring-yellow-500/80',
  },
  {
    id: 'neon_cyber',
    name: 'Diamond Cosmic Portal',
    hindiName: '💎 डायमंड कॉस्मिक रेनबो (Cyber Rainbow)',
    description: 'फ्यूचरिस्टिक 360° रेनबो लेजर लाइट और हीरों का कॉस्मिक औरा',
    desc: 'फ्यूचरिस्टिक 360° रेनबो लेजर लाइट और हीरों का कॉस्मिक औरा',
    badge: '💎 Cosmic VIP',
    icon: '💎',
    category: 'vip',
    gradientClass: 'from-fuchsia-400 via-purple-600 to-indigo-600',
    glowClass: 'shadow-[0_0_24px_rgba(192,38,211,0.9)] border-fuchsia-400 ring-2 ring-fuchsia-500/70',
  },
  {
    id: 'water',
    name: 'Ocean Wave Vortex',
    hindiName: '💧 जल चक्र (3D Water Vortex)',
    description: '360° घूमती शांत और गतिशील नीली समुद्री लहरें',
    desc: '360° घूमती शांत और गतिशील नीली समुद्री लहरें',
    badge: '💧 Ocean Wave',
    icon: '💧',
    category: 'elements',
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
    category: 'elements',
    gradientClass: 'from-emerald-400 via-yellow-400 to-cyan-500',
    glowClass: 'shadow-[0_0_24px_rgba(250,204,21,0.95)] border-yellow-300 ring-2 ring-yellow-400/70',
  },
  {
    id: 'none',
    name: 'Classic Clean',
    hindiName: '⚪ सादा (No Frame)',
    description: 'सामान्य साफ गोल फोटो',
    desc: 'सामान्य साफ गोल फोटो',
    badge: '⚪ Classic',
    icon: '⚪',
    category: 'classic',
    gradientClass: 'from-slate-200 to-slate-300',
    glowClass: 'border-white/80 shadow-sm',
  },
];

export const AvatarWith3DFrame: React.FC<AvatarWith3DFrameProps> = ({
  avatarUrl,
  name,
  frame = 'acc_medallion',
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
      {/* 0. ACC 3D NACHTA HUA CIRCULAR GOLD RING (DANCING GYRO ORBIT FRAME) */}
      {/* ----------------------------------------------------------------- */}
      {frame === 'acc_dancing_circle' && (
        <div className="absolute -inset-4 sm:-inset-5 rounded-full pointer-events-none z-20 overflow-visible">
          {/* Dynamic Dancing Multi-Hue Outer Aura */}
          <div className="absolute inset-0 rounded-full border-2 border-amber-300/80 shadow-[0_0_26px_rgba(255,215,0,0.85)] animate-orbit-dance" />

          {/* SVG Dancing Gyro Ring with Orbiting Beads & Curved Text */}
          <svg viewBox="0 0 300 300" className="w-full h-full block animate-spin-slow will-change-transform drop-shadow-[0_4px_16px_rgba(0,0,0,0.7)]">
            <defs>
              <linearGradient id="dancingGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fff8db" />
                <stop offset="25%" stopColor="#ffd700" />
                <stop offset="50%" stopColor="#ff8c00" />
                <stop offset="75%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
              <linearGradient id="dancingRainbowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ff007a" />
                <stop offset="20%" stopColor="#9d4edd" />
                <stop offset="40%" stopColor="#2563eb" />
                <stop offset="60%" stopColor="#00b4d8" />
                <stop offset="80%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#ffd700" />
              </linearGradient>
              <path id="dancingTextOrbit" d="M 150,150 m -114,0 a 114,114 0 1,1 228,0 a 114,114 0 1,1 -228,0" fill="none" />
            </defs>

            {/* Outer Jeweled Rim */}
            <circle cx="150" cy="150" r="145" fill="none" stroke="url(#dancingGoldGrad)" strokeWidth="3.5" />
            <circle cx="150" cy="150" r="139" fill="none" stroke="url(#dancingRainbowGrad)" strokeWidth="2.5" opacity="0.9" strokeDasharray="6,4" />
            
            {/* 8 Dancing Orbiting Gems / Beads */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const cx = 150 + 138 * Math.cos(rad);
              const cy = 150 + 138 * Math.sin(rad);
              return (
                <g key={i}>
                  <circle cx={cx} cy={cy} r="5" fill={i % 2 === 0 ? '#ffd700' : '#00f2fe'} stroke="#ffffff" strokeWidth="1.2" />
                  <circle cx={cx} cy={cy} r="2" fill="#ffffff" />
                </g>
              );
            })}

            {/* Rotating 360 Engraved Text */}
            <text fontFamily="Roboto, sans-serif" fontWeight="900" fontSize="10.5" fill="#fffbeb" letterSpacing="2.2" stroke="#451a03" strokeWidth="0.8" paintOrder="stroke fill">
              <textPath href="#dancingTextOrbit" startOffset="0%">
                ★ ACHIEVERS CLUB COMMUNITY ★ ACC INDIA ★ 3D LIVE DANCING COIN ★
              </textPath>
            </text>

            {/* Inner Saffron-White-Green Halo Rings */}
            <circle cx="150" cy="150" r="94" fill="none" stroke="#ff9933" strokeWidth="2.5" opacity="0.9" />
            <circle cx="150" cy="150" r="91" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.9" />
            <circle cx="150" cy="150" r="88" fill="none" stroke="#138808" strokeWidth="2.5" opacity="0.9" />
            
            {/* Photo Rim 3D Bevel */}
            <circle cx="150" cy="150" r="87" fill="none" stroke="url(#dancingGoldGrad)" strokeWidth="3" />
          </svg>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* 0B. 3D DIWALI DEEPAK & KUBER GOLDEN FRAME (🪔 दीपोत्सव एवं कुबेर स्वर्ण) */}
      {/* ----------------------------------------------------------------- */}
      {frame === 'acc_diwali_deepak' && (
        <div className="absolute -inset-4 sm:-inset-5 rounded-full pointer-events-none z-20 overflow-visible">
          <div className="absolute inset-0 rounded-full border-2 border-amber-400 shadow-[0_0_24px_rgba(245,158,11,0.95)] animate-flame-pulse" />
          
          <svg viewBox="0 0 300 300" className="w-full h-full block animate-spin-slow will-change-transform">
            <defs>
              <linearGradient id="deepakGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fff8db" />
                <stop offset="40%" stopColor="#fbbf24" />
                <stop offset="80%" stopColor="#ea580c" />
                <stop offset="100%" stopColor="#7c2d12" />
              </linearGradient>
            </defs>
            <circle cx="150" cy="150" r="144" fill="none" stroke="url(#deepakGold)" strokeWidth="3" strokeDasharray="4,6" />
            <circle cx="150" cy="150" r="128" fill="none" stroke="#f59e0b" strokeWidth="2" opacity="0.75" />
            
            {/* 6 Radiant Golden Diyas with Flames */}
            {[0, 60, 120, 180, 240, 300].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const cx = 150 + 130 * Math.cos(rad);
              const cy = 150 + 130 * Math.sin(rad);
              return (
                <g key={i} transform={`translate(${cx}, ${cy})`}>
                  <ellipse cx="0" cy="2" rx="7" ry="4" fill="#d97706" stroke="#fbbf24" strokeWidth="1" />
                  <path d="M -3,0 Q 0,-8 0,-11 Q 0,-8 3,0 Z" fill="#ffd700" stroke="#ef4444" strokeWidth="0.8" />
                  <circle cx="0" cy="-4" r="1.5" fill="#ffffff" />
                </g>
              );
            })}
            
            <circle cx="150" cy="150" r="88" fill="none" stroke="url(#deepakGold)" strokeWidth="3.5" />
          </svg>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* 0C. 3D NAVRATNA RAINBOW CHAKRA VIP (🌈 नवरत्न रेनबो चक्र VIP) */}
      {/* ----------------------------------------------------------------- */}
      {frame === 'acc_royal_chakra' && (
        <div className="absolute -inset-4 sm:-inset-5 rounded-full pointer-events-none z-20 overflow-visible">
          <div className="absolute inset-0 rounded-full border-2 border-fuchsia-400 shadow-[0_0_24px_rgba(217,70,239,0.85)] animate-orbit-dance" />
          
          <svg viewBox="0 0 300 300" className="w-full h-full block animate-spin-reverse-slow will-change-transform">
            <defs>
              <linearGradient id="chakraRainbow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff007a" />
                <stop offset="25%" stopColor="#f59e0b" />
                <stop offset="50%" stopColor="#10b981" />
                <stop offset="75%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
            <circle cx="150" cy="150" r="144" fill="none" stroke="url(#chakraRainbow)" strokeWidth="4" />
            <circle cx="150" cy="150" r="130" fill="none" stroke="#fbbf24" strokeWidth="2" strokeDasharray="3,5" />
            
            {/* 9 Navratna Gemstones Orbiting */}
            {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const colors = ['#ef4444', '#f59e0b', '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#ffffff', '#ffd700'];
              const cx = 150 + 130 * Math.cos(rad);
              const cy = 150 + 130 * Math.sin(rad);
              return (
                <g key={i}>
                  <circle cx={cx} cy={cy} r="5" fill={colors[i]} stroke="#ffffff" strokeWidth="1.2" />
                  <circle cx={cx - 1.2} cy={cy - 1.2} r="1.5" fill="#ffffff" opacity="0.9" />
                </g>
              );
            })}
            
            <circle cx="150" cy="150" r="88" fill="none" stroke="#ffd700" strokeWidth="3" />
          </svg>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* 1. ACC 3D GOLD MEDALLION COIN FRAME (OFFICIAL MINTED COIN DESIGN) */}
      {/* ----------------------------------------------------------------- */}
      {frame === 'acc_medallion' && (
        <div className="absolute -inset-3 sm:-inset-4 rounded-full pointer-events-none z-20 overflow-visible">
          <svg viewBox="0 0 300 300" className="w-full h-full block drop-shadow-[0_4px_12px_rgba(0,0,0,0.55)]">
            <defs>
              <linearGradient id="avatarGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fff8db" />
                <stop offset="20%" stopColor="#fbbf24" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="80%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>
              <linearGradient id="avatarSaffronGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ff6600" />
                <stop offset="100%" stopColor="#ff9933" />
              </linearGradient>
              <linearGradient id="avatarGreenGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0e692a" />
                <stop offset="100%" stopColor="#138808" />
              </linearGradient>
              <path id="avatarPathTopArch" d="M 46,150 A 104,104 0 0,1 254,150" fill="none" />
              <path id="avatarPathBottomArch" d="M 254,150 A 104,104 0 0,1 46,150" fill="none" />
            </defs>
            {/* Outer Coin Milled Rim */}
            <circle cx="150" cy="150" r="144" fill="url(#avatarGoldGrad)" stroke="#78350f" strokeWidth="2.5" />
            <circle cx="150" cy="150" r="138" fill="none" stroke="#fffbeb" strokeWidth="1.2" opacity="0.85" />
            <circle cx="150" cy="150" r="134" fill="none" stroke="#fffbeb" strokeWidth="1.8" strokeDasharray="2,5" opacity="0.9" />
            <circle cx="150" cy="150" r="124" fill="#081836" stroke="#fbbf24" strokeWidth="1.2" />
            
            {/* Indian Tiranga Concentric Halo Ring */}
            <path d="M 54,150 A 96,96 0 0,1 246,150" fill="none" stroke="url(#avatarSaffronGrad)" strokeWidth="3.2" strokeLinecap="round" />
            <path d="M 246,150 A 96,96 0 0,1 54,150" fill="none" stroke="url(#avatarGreenGrad)" strokeWidth="3.2" strokeLinecap="round" />
            <circle cx="150" cy="150" r="92" fill="none" stroke="#ffffff" strokeWidth="1.2" opacity="0.95" />

            {/* Top Curved Engraved Text: ACHIEVERS CLUB COMMUNITY */}
            <text fontFamily="Roboto, sans-serif" fontWeight="900" fontSize="10.5" fill="#fffbeb" letterSpacing="1.8" stroke="#000000" strokeWidth="0.3" paintOrder="stroke fill">
              <textPath href="#avatarPathTopArch" startOffset="50%" textAnchor="middle">
                ACHIEVERS CLUB COMMUNITY
              </textPath>
            </text>

            {/* Bottom Curved Engraved Text: ★ START YOUNG • RETIRE YOUNG ★ */}
            <text fontFamily="Roboto, sans-serif" fontWeight="900" fontSize="9" fill="#fef08a" letterSpacing="1.4" stroke="#000000" strokeWidth="0.3" paintOrder="stroke fill">
              <textPath href="#avatarPathBottomArch" startOffset="50%" textAnchor="middle">
                ★ START YOUNG • RETIRE YOUNG ★
              </textPath>
            </text>

            {/* Flanking Gold Stars */}
            <g fill="#fbbf24" stroke="#78350f" strokeWidth="0.5">
              <circle cx="46" cy="150" r="3.2" />
              <circle cx="254" cy="150" r="3.2" />
            </g>

            {/* Inner Gold Bevel on photo rim */}
            <circle cx="150" cy="150" r="88" fill="none" stroke="url(#avatarGoldGrad)" strokeWidth="3.5" />
          </svg>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* 2. ACC 360° LIVE ORBITING TEXT RING (360° घूमता नक्काशीदार टेक्स्ट) */}
      {/* ----------------------------------------------------------------- */}
      {frame === 'acc_spinning_text' && (
        <div className="absolute -inset-4 sm:-inset-5 rounded-full pointer-events-none z-20 overflow-visible">
          {/* Outer Gold Bevel & Glow Pulse */}
          <div className="absolute inset-0 rounded-full border-2 border-amber-400 shadow-[0_0_22px_rgba(245,158,11,0.85)] animate-flame-pulse" />
          
          {/* Smooth 360° Orbiting SVG Text Ring */}
          <svg viewBox="0 0 300 300" className="w-full h-full block animate-spin-slow will-change-transform">
            <defs>
              <linearGradient id="avatarSpinGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fff8db" />
                <stop offset="35%" stopColor="#fbbf24" />
                <stop offset="70%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
              <path id="avatarSpinOrbitPath" d="M 150,150 m -112,0 a 112,112 0 1,1 224,0 a 112,112 0 1,1 -224,0" fill="none" />
            </defs>
            <circle cx="150" cy="150" r="142" fill="none" stroke="url(#avatarSpinGold)" strokeWidth="2.5" strokeDasharray="3,6" />
            <circle cx="150" cy="150" r="126" fill="none" stroke="#2563eb" strokeWidth="1.5" opacity="0.6" />
            <text fontFamily="Roboto, sans-serif" fontWeight="900" fontSize="10.5" fill="#fef08a" letterSpacing="2.2" stroke="#451a03" strokeWidth="0.6" paintOrder="stroke fill">
              <textPath href="#avatarSpinOrbitPath" startOffset="0%">
                ★ ACHIEVERS CLUB COMMUNITY ★ ACC INDIA ★ START YOUNG RETIRE YOUNG ★
              </textPath>
            </text>
            <circle cx="150" cy="150" r="88" fill="none" stroke="url(#avatarSpinGold)" strokeWidth="3" />
          </svg>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* 3. TIRANGA & ASHOKA CHAKRA PATRIOTIC HALO (तिरंगा एवं अशोक चक्र)  */}
      {/* ----------------------------------------------------------------- */}
      {frame === 'tiranga_chakra' && (
        <div className="absolute -inset-3.5 sm:-inset-4.5 rounded-full pointer-events-none z-20 overflow-visible">
          <svg viewBox="0 0 300 300" className="w-full h-full block drop-shadow-[0_4px_14px_rgba(0,0,0,0.5)]">
            <defs>
              <linearGradient id="tirangaSaffronHalo" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ff6600" />
                <stop offset="100%" stopColor="#ff9933" />
              </linearGradient>
              <linearGradient id="tirangaGreenHalo" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0e692a" />
                <stop offset="100%" stopColor="#138808" />
              </linearGradient>
            </defs>
            {/* Outer Bevel */}
            <circle cx="150" cy="150" r="144" fill="none" stroke="#fbbf24" strokeWidth="3.5" />
            {/* Saffron & Green Halos */}
            <path d="M 38,150 A 112,112 0 0,1 262,150" fill="none" stroke="url(#tirangaSaffronHalo)" strokeWidth="14" strokeLinecap="round" />
            <path d="M 262,150 A 112,112 0 0,1 38,150" fill="none" stroke="url(#tirangaGreenHalo)" strokeWidth="14" strokeLinecap="round" />
            <circle cx="150" cy="150" r="112" fill="none" stroke="#ffffff" strokeWidth="2.5" />
            
            {/* 24-spoke Ashoka Chakra Watermark Lines */}
            <g stroke="#000080" strokeWidth="1.2" opacity="0.65">
              {[...Array(24)].map((_, i) => {
                const angle = (i * 15 * Math.PI) / 180;
                return (
                  <line
                    key={i}
                    x1={150 + 94 * Math.cos(angle)}
                    y1={150 + 94 * Math.sin(angle)}
                    x2={150 + 106 * Math.cos(angle)}
                    y2={150 + 106 * Math.sin(angle)}
                  />
                );
              })}
            </g>

            {/* Inner Gold Bevel on photo rim */}
            <circle cx="150" cy="150" r="88" fill="none" stroke="#fbbf24" strokeWidth="3.5" />
          </svg>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* 4. 3D LIVE FIRE FRAME: CIRCULATING 360° RING OF FIRE WITH FLAMES  */}
      {/* ----------------------------------------------------------------- */}
      {frame === 'fire' && (
        <div className="absolute -inset-2.5 sm:-inset-3.5 rounded-full pointer-events-none z-0 animate-flame-pulse will-change-transform">
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

      {/* ----------------------------------------------------------------- */}
      {/* 5. 3D LIVE WATER FRAME: CIRCULATING OCEAN WAVE VORTEX             */}
      {/* ----------------------------------------------------------------- */}
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

      {/* ----------------------------------------------------------------- */}
      {/* 6. 3D LIVE WORK HARD FRAME: ROTATING ELECTRIC NEON PLASMA RING    */}
      {/* ----------------------------------------------------------------- */}
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

      {/* ----------------------------------------------------------------- */}
      {/* 7. 3D LIVE ROYAL GOLD VIP FRAME: ROTATING IMPERIAL GOLD SUNBURST  */}
      {/* ----------------------------------------------------------------- */}
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
                  👑
                </span>
              );
            })}
          </div>
          <div className="absolute inset-0 rounded-full border-2 border-yellow-200 shadow-[0_0_20px_#ffd700]" />
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* 8. 3D LIVE NEON CYBER COSMIC PORTAL                              */}
      {/* ----------------------------------------------------------------- */}
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
      {/* 9. INNER AVATAR PHOTO & INITIALS CONTAINER                       */}
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
      {/* 10. 3D BADGE INDICATOR (BOTTOM CORNER)                           */}
      {/* ----------------------------------------------------------------- */}
      {showBadge && !isNone && (
        <div
          className={`absolute ${badgeSizes[size]} rounded-full bg-slate-950 border-2 border-white flex items-center justify-center shadow-lg z-30 animate-bounce`}
          style={{ animationDuration: '3s' }}
          title={activeFrame.name}
        >
          <span>{activeFrame.icon}</span>
        </div>
      )}
    </div>
  );
};
