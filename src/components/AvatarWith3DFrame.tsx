import React from 'react';
import { AvatarFrameType } from '../types';

interface AvatarWith3DFrameProps {
  avatarUrl?: string;
  name: string;
  frame?: AvatarFrameType;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showBadge?: boolean;
  lite?: boolean;
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
    id: 'acc_bharat_ratna',
    name: 'ACC भारत रत्न 24K डायमंड चक्र',
    hindiName: '🏆 ACC भारत रत्न 24K डायमंड चक्र (Bharat Ratna Diamond Ring)',
    description: 'सर्वोच्च 24K गोल्ड, जगमगाते प्लैटिनम डायमंड्स, 4 अशोक लाट स्टार्स और ACC BHARAT RATNA VIP 360° लाइव रोटेटिंग रिंग',
    desc: 'सर्वोच्च 24K गोल्ड, जगमगाते प्लैटिनम डायमंड्स, 4 अशोक लाट स्टार्स और ACC BHARAT RATNA VIP 360° लाइव रोटेटिंग रिंग',
    badge: '🏆 Bharat Ratna',
    icon: '🏆',
    category: 'acc',
    gradientClass: 'from-amber-200 via-yellow-400 to-amber-700',
    glowClass: 'shadow-[0_0_30px_rgba(251,191,36,1)] border-yellow-200 ring-2 ring-yellow-300',
  },
  {
    id: 'acc_golden_phoenix',
    name: 'ACC गोल्डन फीनिक्स विंग्स',
    hindiName: '🦅 ACC गोल्डन फीनिक्स विंग्स (Golden Phoenix Wings of Fire)',
    description: 'स्वर्णिम फीनिक्स के विशाल 3D पंख, सुनहरी लपटों का दिव्य हेलो और ACHIEVERS FLY HIGH का शक्तिशाली औरा',
    desc: 'स्वर्णिम फीनिक्स के विशाल 3D पंख, सुनहरी लपटों का दिव्य हेलो और ACHIEVERS FLY HIGH का शक्तिशाली औरा',
    badge: '🦅 Golden Phoenix',
    icon: '🦅',
    category: 'vip',
    gradientClass: 'from-yellow-300 via-amber-500 to-red-600',
    glowClass: 'shadow-[0_0_28px_rgba(234,88,12,0.95)] border-amber-300 ring-2 ring-orange-500',
  },
  {
    id: 'acc_galaxy_supernova',
    name: 'ACC कॉस्मिक गैलेक्सी सुपरनोवा',
    hindiName: '🌌 ACC कॉस्मिक गैलेक्सी सुपरनोवा (Cosmic Galaxy Nebula)',
    description: 'ब्रह्मांडीय नीहारिका, 360° घूमते हुए चमकीले सितारे, डीप पर्पल-इंडिगो कॉस्मिक डस्ट और START YOUNG REACH STARS',
    desc: 'ब्रह्मांडीय नीहारिका, 360° घूमते हुए चमकीले सितारे, डीप पर्पल-इंडिगो कॉस्मिक डस्ट और START YOUNG REACH STARS',
    badge: '🌌 Galaxy Nova',
    icon: '🌌',
    category: 'elements',
    gradientClass: 'from-purple-400 via-indigo-600 to-cyan-400',
    glowClass: 'shadow-[0_0_28px_rgba(147,51,234,0.95)] border-indigo-400 ring-2 ring-cyan-400',
  },
  {
    id: 'acc_tricolor_warrior',
    name: 'ACC तिरंगा योद्धा कवच शील्ड',
    hindiName: '🛡️ ACC तिरंगा योद्धा कवच शील्ड (Tiranga Warrior Shield)',
    description: 'केसरिया, सफेद व हरे रंग की देशभक्ति तलवारें, 3D गोल्ड अशोक चक्र और ACC PATRIOT CHAMPION का शौर्य चक्र',
    desc: 'केसरिया, सफेद व हरे रंग की देशभक्ति तलवारें, 3D गोल्ड अशोक चक्र और ACC PATRIOT CHAMPION का शौर्य चक्र',
    badge: '🛡️ Tiranga Warrior',
    icon: '🛡️',
    category: 'acc',
    gradientClass: 'from-orange-500 via-yellow-200 to-emerald-600',
    glowClass: 'shadow-[0_0_26px_rgba(249,115,22,0.95)] border-orange-300 ring-2 ring-emerald-400',
  },
  {
    id: 'acc_emerald_dragon',
    name: 'ACC रॉयल पन्ना एमराल्ड क्राउन',
    hindiName: '🐉 ACC रॉयल पन्ना एमराल्ड चक्र (Royal Emerald Gem Crown)',
    description: 'शुद्ध पन्ना क्रिस्टल्स, 360° रोटेटिंग एमराल्ड कट्स, गोल्ड फिलीग्री और ACC WEALTH & PROSPERITY',
    desc: 'शुद्ध पन्ना क्रिस्टल्स, 360° रोटेटिंग एमराल्ड कट्स, गोल्ड फिलीग्री और ACC WEALTH & PROSPERITY',
    badge: '🐉 Emerald Crown',
    icon: '🐉',
    category: 'vip',
    gradientClass: 'from-emerald-300 via-teal-500 to-emerald-800',
    glowClass: 'shadow-[0_0_28px_rgba(16,185,129,0.95)] border-emerald-300 ring-2 ring-emerald-500',
  },
  {
    id: 'acc_ruby_emperor',
    name: 'ACC शाही माणिक्य रूबी चक्र',
    hindiName: '💎 ACC शाही माणिक्य रूबी चक्र (Imperial Ruby Aura)',
    description: 'शाही लाल माणिक्य जेम्स, 3D गोल्ड रोसेट बीड्स, शाही विजय माला और ACC SUPREME LEADER NO.1',
    desc: 'शाही लाल माणिक्य जेम्स, 3D गोल्ड रोसेट बीड्स, शाही विजय माला और ACC SUPREME LEADER NO.1',
    badge: '💎 Ruby Emperor',
    icon: '💎',
    category: 'vip',
    gradientClass: 'from-rose-400 via-red-600 to-rose-900',
    glowClass: 'shadow-[0_0_28px_rgba(225,29,72,0.95)] border-rose-300 ring-2 ring-red-500',
  },
  {
    id: 'acc_cyber_matrix',
    name: 'ACC डिजिटल साइबर मैट्रिक्स 2026',
    hindiName: '⚡ ACC डिजिटल साइबर मैट्रिक्स 2026 (Cyber Matrix Grid)',
    description: 'फ्यूचरिस्टिक हेक्सागोनल शील्ड, डेटा पल्सेस, नियॉन ग्रीन-साइयन डिजिटल सर्किट और DIGITAL INDIA ACC TECH',
    desc: 'फ्यूचरिस्टिक हेक्सागोनल शील्ड, डेटा पल्सेस, नियॉन ग्रीन-साइयन डिजिटल सर्किट और DIGITAL INDIA ACC TECH',
    badge: '⚡ Cyber Matrix',
    icon: '⚡',
    category: 'elements',
    gradientClass: 'from-cyan-400 via-blue-600 to-emerald-400',
    glowClass: 'shadow-[0_0_28px_rgba(6,182,212,0.95)] border-cyan-300 ring-2 ring-emerald-400',
  },
  {
    id: 'acc_solar_flare',
    name: 'ACC सूर्य नमस्कार प्रभा-मंडल 3D',
    hindiName: '☀️ ACC सूर्य नमस्कार प्रभा-मंडल 3D (Surya Solar Flare)',
    description: '12 स्वर्णिम आदित्य किरणें, 3D सूर्य चक्र, दिव्य ऊर्जा और ACC SUNSHINE LEADER TEJASVI',
    desc: '12 स्वर्णिम आदित्य किरणें, 3D सूर्य चक्र, दिव्य ऊर्जा और ACC SUNSHINE LEADER TEJASVI',
    badge: '☀️ Solar Surya',
    icon: '☀️',
    category: 'elements',
    gradientClass: 'from-amber-200 via-yellow-500 to-orange-600',
    glowClass: 'shadow-[0_0_30px_rgba(245,158,11,1)] border-amber-300 ring-2 ring-yellow-400',
  },
  {
    id: 'acc_kohinoor_diamond',
    name: 'ACC कोहिनूर डायमंड 3D क्रिस्टल क्राउन',
    hindiName: '💎 ACC कोहिनूर डायमंड 3D क्रिस्टल क्राउन (Kohinoor Diamond Aura)',
    description: '360° लेजर स्पार्क्स, प्रिज्म रिफ्लेक्शन, 16 घूमते हुए चमकीले डायमंड्स और ACC CROWN JEWEL SUPREME',
    desc: '360° लेजर स्पार्क्स, प्रिज्म रिफ्लेक्शन, 16 घूमते हुए चमकीले डायमंड्स और ACC CROWN JEWEL SUPREME',
    badge: '💎 Kohinoor Supreme',
    icon: '💎',
    category: 'vip',
    gradientClass: 'from-cyan-200 via-sky-400 to-indigo-600',
    glowClass: 'shadow-[0_0_32px_rgba(56,189,248,1)] border-cyan-200 ring-2 ring-white',
  },
  {
    id: 'acc_shivaji_bhagwa',
    name: 'ACC वीर छत्रपति भगवा ध्वज एवं शौर्य चक्र',
    hindiName: '🚩 ACC वीर छत्रपति भगवा शौर्य चक्र (Swarajya Bhagwa Dhwaj)',
    description: 'केसरिया भगवा आभा, 3D सूर्य शक्ति, शौर्य भाले एवं ACC HINDAVI SWARAJYA PRIDE 1674',
    desc: 'केसरिया भगवा आभा, 3D सूर्य शक्ति, शौर्य भाले एवं ACC HINDAVI SWARAJYA PRIDE 1674',
    badge: '🚩 Swarajya Bhagwa',
    icon: '🚩',
    category: 'acc',
    gradientClass: 'from-orange-500 via-amber-400 to-red-600',
    glowClass: 'shadow-[0_0_32px_rgba(249,115,22,1)] border-orange-300 ring-2 ring-amber-400',
  },
  {
    id: 'acc_quantum_vortex',
    name: 'ACC क्वांटम टाइम वॉर्टेक्स 3D',
    hindiName: '🌀 ACC क्वांटम टाइम वॉर्टेक्स 3D (Quantum Cosmic Vortex)',
    description: 'फ्यूचरिस्टिक क्वांटम पोर्टल, लेजर आर्क, 360° इलेक्ट्रिक ऑर्बिट और ACC TIMELESS DIMENSION',
    desc: 'फ्यूचरिस्टिक क्वांटम पोर्टल, लेजर आर्क, 360° इलेक्ट्रिक ऑर्बिट और ACC TIMELESS DIMENSION',
    badge: '🌀 Quantum Vortex',
    icon: '🌀',
    category: 'elements',
    gradientClass: 'from-teal-300 via-cyan-500 to-indigo-700',
    glowClass: 'shadow-[0_0_30px_rgba(20,184,166,1)] border-cyan-300 ring-2 ring-teal-400',
  },
  {
    id: 'acc_maharaja_peacock',
    name: 'ACC शाही मयूर पंख एवं नीलम रत्न चक्र',
    hindiName: '🦚 ACC शाही मयूर पंख एवं नीलम रत्न चक्र (Royal Peacock Sapphire)',
    description: '3D मोरपंखी आभा, नीलम रत्न, शाही नक्काशीदार रोसेट और ACC ROYAL HERITAGE NOBLE',
    desc: '3D मोरपंखी आभा, नीलम रत्न, शाही नक्काशीदार रोसेट और ACC ROYAL HERITAGE NOBLE',
    badge: '🦚 Royal Peacock',
    icon: '🦚',
    category: 'vip',
    gradientClass: 'from-emerald-300 via-teal-500 to-blue-700',
    glowClass: 'shadow-[0_0_30px_rgba(13,148,136,1)] border-emerald-300 ring-2 ring-blue-500',
  },
  {
    id: 'acc_crypto_gold_blockchain',
    name: 'ACC 3D ब्लॉकचेन क्रिप्टो गोल्ड चक्र',
    hindiName: '🪙 ACC 3D ब्लॉकचेन क्रिप्टो गोल्ड चक्र (Crypto Blockchain Gold)',
    description: '3D डिजिटल गोल्ड कॉइन्स, हेक्सागोनल नोड्स, साइबर लेजर ग्रिड और ACC FINTECH WEALTH',
    desc: '3D डिजिटल गोल्ड कॉइन्स, हेक्सागोनल नोड्स, साइबर लेजर ग्रिड और ACC FINTECH WEALTH',
    badge: '🪙 Crypto Gold',
    icon: '🪙',
    category: 'vip',
    gradientClass: 'from-yellow-200 via-amber-400 to-yellow-600',
    glowClass: 'shadow-[0_0_30px_rgba(234,179,8,1)] border-yellow-200 ring-2 ring-amber-500',
  },
  {
    id: 'acc_thunder_lord',
    name: 'ACC वज्र थंडर गॉड 360° इलेक्ट्रिक',
    hindiName: '⚡ ACC वज्र थंडर गॉड 360° इलेक्ट्रिक (Thunderbolt Vajra)',
    description: '360° कड़कती बिजली, थंडरबोल्ट्स, इलेक्ट्रिक ब्लू औरा और ACC UNSTOPPABLE POWER',
    desc: '360° कड़कती बिजली, थंडरबोल्ट्स, इलेक्ट्रिक ब्लू औरा और ACC UNSTOPPABLE POWER',
    badge: '⚡ Vajra Thunder',
    icon: '⚡',
    category: 'elements',
    gradientClass: 'from-sky-300 via-blue-500 to-indigo-700',
    glowClass: 'shadow-[0_0_32px_rgba(59,130,246,1)] border-sky-300 ring-2 ring-blue-400',
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
  lite = false,
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

  const svgUid = React.useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const [imgFailed, setImgFailed] = React.useState(false);

  React.useEffect(() => {
    setImgFailed(false);
  }, [avatarUrl]);

  const activeFrame = AVATAR_FRAMES.find((f) => f.id === frame) || AVATAR_FRAMES[0];
  const isNone = frame === 'none' || !frame;
  const isShowcaseSize = size === 'lg' || size === 'xl' || size === '2xl';

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center select-none ${
        lite ? 'acc-avatar-lite' : ''
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Ambient 3D Luminous Back-Aura Halo (disabled in lite miniature mode to prevent mobile GPU OOM) */}
      {!isNone && !lite && (
        <div
          aria-hidden="true"
          className={`absolute ${
            isShowcaseSize ? '-inset-3.5' : '-inset-1.5'
          } rounded-full bg-gradient-to-tr ${activeFrame.gradientClass} opacity-45 blur-md animate-frame-aura pointer-events-none z-0`}
        />
      )}
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
              <linearGradient id={`dancingGoldGrad_${svgUid}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fff8db" />
                <stop offset="25%" stopColor="#ffd700" />
                <stop offset="50%" stopColor="#ff8c00" />
                <stop offset="75%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
              <linearGradient id={`dancingRainbowGrad_${svgUid}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ff007a" />
                <stop offset="20%" stopColor="#9d4edd" />
                <stop offset="40%" stopColor="#2563eb" />
                <stop offset="60%" stopColor="#00b4d8" />
                <stop offset="80%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#ffd700" />
              </linearGradient>
              <path id={`dancingTextOrbit_${svgUid}`} d="M 150,150 m -114,0 a 114,114 0 1,1 228,0 a 114,114 0 1,1 -228,0" fill="none" />
            </defs>

            {/* Outer Jeweled Rim */}
            <circle cx="150" cy="150" r="145" fill="none" stroke={`url(#dancingGoldGrad_${svgUid})`} strokeWidth="3.5" />
            <circle cx="150" cy="150" r="139" fill="none" stroke={`url(#dancingRainbowGrad_${svgUid})`} strokeWidth="2.5" opacity="0.9" strokeDasharray="6,4" />
            
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
              <textPath href={`#dancingTextOrbit_${svgUid}`} startOffset="0%">
                ★ ACHIEVERS CLUB COMMUNITY ★ ACC INDIA ★ 3D LIVE DANCING COIN ★
              </textPath>
            </text>

            {/* Inner Saffron-White-Green Halo Rings */}
            <circle cx="150" cy="150" r="94" fill="none" stroke="#ff9933" strokeWidth="2.5" opacity="0.9" />
            <circle cx="150" cy="150" r="91" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.9" />
            <circle cx="150" cy="150" r="88" fill="none" stroke="#138808" strokeWidth="2.5" opacity="0.9" />
            
            {/* Photo Rim 3D Bevel */}
            <circle cx="150" cy="150" r="87" fill="none" stroke={`url(#dancingGoldGrad_${svgUid})`} strokeWidth="3" />
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
              <linearGradient id={`deepakGold_${svgUid}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fff8db" />
                <stop offset="40%" stopColor="#fbbf24" />
                <stop offset="80%" stopColor="#ea580c" />
                <stop offset="100%" stopColor="#7c2d12" />
              </linearGradient>
            </defs>
            <circle cx="150" cy="150" r="144" fill="none" stroke={`url(#deepakGold_${svgUid})`} strokeWidth="3" strokeDasharray="4,6" />
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
            
            <circle cx="150" cy="150" r="88" fill="none" stroke={`url(#deepakGold_${svgUid})`} strokeWidth="3.5" />
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
              <linearGradient id={`chakraRainbow_${svgUid}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff007a" />
                <stop offset="25%" stopColor="#f59e0b" />
                <stop offset="50%" stopColor="#10b981" />
                <stop offset="75%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
            <circle cx="150" cy="150" r="144" fill="none" stroke={`url(#chakraRainbow_${svgUid})`} strokeWidth="4" />
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
              <linearGradient id={`avatarGoldGrad_${svgUid}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fff8db" />
                <stop offset="20%" stopColor="#fbbf24" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="80%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>
              <linearGradient id={`avatarSaffronGrad_${svgUid}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ff6600" />
                <stop offset="100%" stopColor="#ff9933" />
              </linearGradient>
              <linearGradient id={`avatarGreenGrad_${svgUid}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0e692a" />
                <stop offset="100%" stopColor="#138808" />
              </linearGradient>
              <path id={`avatarPathTopArch_${svgUid}`} d="M 46,150 A 104,104 0 0,1 254,150" fill="none" />
              <path id={`avatarPathBottomArch_${svgUid}`} d="M 254,150 A 104,104 0 0,1 46,150" fill="none" />
            </defs>
            {/* Outer Coin Milled Rim */}
            <circle cx="150" cy="150" r="144" fill={`url(#avatarGoldGrad_${svgUid})`} stroke="#78350f" strokeWidth="2.5" />
            <circle cx="150" cy="150" r="138" fill="none" stroke="#fffbeb" strokeWidth="1.2" opacity="0.85" />
            <circle cx="150" cy="150" r="134" fill="none" stroke="#fffbeb" strokeWidth="1.8" strokeDasharray="2,5" opacity="0.9" />
            <circle cx="150" cy="150" r="124" fill="#081836" stroke="#fbbf24" strokeWidth="1.2" />
            
            {/* Indian Tiranga Concentric Halo Ring */}
            <path d="M 54,150 A 96,96 0 0,1 246,150" fill="none" stroke={`url(#avatarSaffronGrad_${svgUid})`} strokeWidth="3.2" strokeLinecap="round" />
            <path d="M 246,150 A 96,96 0 0,1 54,150" fill="none" stroke={`url(#avatarGreenGrad_${svgUid})`} strokeWidth="3.2" strokeLinecap="round" />
            <circle cx="150" cy="150" r="92" fill="none" stroke="#ffffff" strokeWidth="1.2" opacity="0.95" />

            {/* Top Curved Engraved Text: ACHIEVERS CLUB COMMUNITY */}
            <text fontFamily="Roboto, sans-serif" fontWeight="900" fontSize="10.5" fill="#fffbeb" letterSpacing="1.8" stroke="#000000" strokeWidth="0.3" paintOrder="stroke fill">
              <textPath href={`#avatarPathTopArch_${svgUid}`} startOffset="50%" textAnchor="middle">
                ACHIEVERS CLUB COMMUNITY
              </textPath>
            </text>

            {/* Bottom Curved Engraved Text: ★ START YOUNG • RETIRE YOUNG ★ */}
            <text fontFamily="Roboto, sans-serif" fontWeight="900" fontSize="9" fill="#fef08a" letterSpacing="1.4" stroke="#000000" strokeWidth="0.3" paintOrder="stroke fill">
              <textPath href={`#avatarPathBottomArch_${svgUid}`} startOffset="50%" textAnchor="middle">
                ★ START YOUNG • RETIRE YOUNG ★
              </textPath>
            </text>

            {/* Flanking Gold Stars */}
            <g fill="#fbbf24" stroke="#78350f" strokeWidth="0.5">
              <circle cx="46" cy="150" r="3.2" />
              <circle cx="254" cy="150" r="3.2" />
            </g>

            {/* Inner Gold Bevel on photo rim */}
            <circle cx="150" cy="150" r="88" fill="none" stroke={`url(#avatarGoldGrad_${svgUid})`} strokeWidth="3.5" />
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
              <linearGradient id={`avatarSpinGold_${svgUid}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fff8db" />
                <stop offset="35%" stopColor="#fbbf24" />
                <stop offset="70%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
              <path id={`avatarSpinOrbitPath_${svgUid}`} d="M 150,150 m -112,0 a 112,112 0 1,1 224,0 a 112,112 0 1,1 -224,0" fill="none" />
            </defs>
            <circle cx="150" cy="150" r="142" fill="none" stroke={`url(#avatarSpinGold_${svgUid})`} strokeWidth="2.5" strokeDasharray="3,6" />
            <circle cx="150" cy="150" r="126" fill="none" stroke="#2563eb" strokeWidth="1.5" opacity="0.6" />
            <text fontFamily="Roboto, sans-serif" fontWeight="900" fontSize="10.5" fill="#fef08a" letterSpacing="2.2" stroke="#451a03" strokeWidth="0.6" paintOrder="stroke fill">
              <textPath href={`#avatarSpinOrbitPath_${svgUid}`} startOffset="0%">
                ★ ACHIEVERS CLUB COMMUNITY ★ ACC INDIA ★ START YOUNG RETIRE YOUNG ★
              </textPath>
            </text>
            <circle cx="150" cy="150" r="88" fill="none" stroke={`url(#avatarSpinGold_${svgUid})`} strokeWidth="3" />
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
              <linearGradient id={`tirangaSaffronHalo_${svgUid}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ff6600" />
                <stop offset="100%" stopColor="#ff9933" />
              </linearGradient>
              <linearGradient id={`tirangaGreenHalo_${svgUid}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0e692a" />
                <stop offset="100%" stopColor="#138808" />
              </linearGradient>
            </defs>
            {/* Outer Bevel */}
            <circle cx="150" cy="150" r="144" fill="none" stroke="#fbbf24" strokeWidth="3.5" />
            {/* Saffron & Green Halos */}
            <path d="M 38,150 A 112,112 0 0,1 262,150" fill="none" stroke={`url(#tirangaSaffronHalo_${svgUid})`} strokeWidth="14" strokeLinecap="round" />
            <path d="M 262,150 A 112,112 0 0,1 38,150" fill="none" stroke={`url(#tirangaGreenHalo_${svgUid})`} strokeWidth="14" strokeLinecap="round" />
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
      {/* 8B. ACC BHARAT RATNA 24K DIAMOND CHAKRA (🏆 सर्वोच्च भारत रत्न फ्रेम) */}
      {/* ----------------------------------------------------------------- */}
      {frame === 'acc_bharat_ratna' && (
        <div className="absolute -inset-4 sm:-inset-5 rounded-full pointer-events-none z-20 overflow-visible">
          <div className="absolute inset-0 rounded-full border-2 border-yellow-300 shadow-[0_0_30px_rgba(251,191,36,0.95)] animate-orbit-dance" />
          <svg viewBox="0 0 300 300" className="w-full h-full block animate-spin-slow will-change-transform drop-shadow-[0_4px_16px_rgba(0,0,0,0.7)]">
            <defs>
              <linearGradient id={`bharatGold_${svgUid}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="25%" stopColor="#ffd700" />
                <stop offset="50%" stopColor="#d97706" />
                <stop offset="75%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>
              <linearGradient id={`bharatPlatinum_${svgUid}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f8fafc" />
                <stop offset="50%" stopColor="#cbd5e1" />
                <stop offset="100%" stopColor="#94a3b8" />
              </linearGradient>
              <path id={`bharatTextOrbit_${svgUid}`} d="M 150,150 m -114,0 a 114,114 0 1,1 228,0 a 114,114 0 1,1 -228,0" fill="none" />
            </defs>
            <circle cx="150" cy="150" r="145" fill="none" stroke={`url(#bharatGold_${svgUid})`} strokeWidth="4" />
            <circle cx="150" cy="150" r="139" fill="none" stroke={`url(#bharatPlatinum_${svgUid})`} strokeWidth="2" strokeDasharray="3,5" />
            
            {/* 12 Sparkling Diamond Gemstones */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const cx = 150 + 138 * Math.cos(rad);
              const cy = 150 + 138 * Math.sin(rad);
              return (
                <g key={i}>
                  <polygon
                    points={`${cx},${cy - 5} ${cx + 4},${cy} ${cx},${cy + 5} ${cx - 4},${cy}`}
                    fill={i % 3 === 0 ? '#ffffff' : '#ffd700'}
                    stroke="#78350f"
                    strokeWidth="0.8"
                  />
                  <circle cx={cx} cy={cy} r="1.5" fill="#ffffff" />
                </g>
              );
            })}

            {/* 360 Engraved Text */}
            <text fontFamily="Roboto, sans-serif" fontWeight="900" fontSize="10" fill="#fffbeb" letterSpacing="2" stroke="#451a03" strokeWidth="0.7" paintOrder="stroke fill">
              <textPath href={`#bharatTextOrbit_${svgUid}`} startOffset="0%">
                ★ ACC BHARAT RATNA VIP ★ 24K DIAMOND CHAKRA ★ SUPREME MERIT ★
              </textPath>
            </text>

            <circle cx="150" cy="150" r="92" fill="none" stroke="#fbbf24" strokeWidth="2.5" />
            <circle cx="150" cy="150" r="88" fill="none" stroke={`url(#bharatGold_${svgUid})`} strokeWidth="3" />
          </svg>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* 8C. ACC GOLDEN PHOENIX WINGS OF FIRE (🦅 गोल्डन फीनिक्स विंग्स)     */}
      {/* ----------------------------------------------------------------- */}
      {frame === 'acc_golden_phoenix' && (
        <div className="absolute -inset-4 sm:-inset-5 rounded-full pointer-events-none z-20 overflow-visible">
          <div className="absolute inset-0 rounded-full border-2 border-orange-400 shadow-[0_0_28px_rgba(234,88,12,0.95)] animate-flame-pulse" />
          <svg viewBox="0 0 300 300" className="w-full h-full block will-change-transform">
            <defs>
              <linearGradient id={`phoenixGold_${svgUid}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fff8db" />
                <stop offset="30%" stopColor="#f59e0b" />
                <stop offset="70%" stopColor="#ea580c" />
                <stop offset="100%" stopColor="#b91c1c" />
              </linearGradient>
            </defs>

            {/* Left Majestic Phoenix Wing */}
            <g className="animate-pulse" style={{ animationDuration: '2s' }}>
              <path
                d="M 60,150 C 30,120 20,80 50,45 C 55,60 55,80 75,95 C 65,70 70,50 90,35 C 92,55 98,75 115,90 C 105,65 115,45 135,35 C 130,55 135,75 142,95 Z"
                fill={`url(#phoenixGold_${svgUid})`}
                stroke="#fff8db"
                strokeWidth="1.2"
                opacity="0.9"
              />
            </g>

            {/* Right Majestic Phoenix Wing */}
            <g className="animate-pulse" style={{ animationDuration: '2s' }}>
              <path
                d="M 240,150 C 270,120 280,80 250,45 C 245,60 245,80 225,95 C 235,70 230,50 210,35 C 208,55 202,75 185,90 C 195,65 185,45 165,35 C 170,55 165,75 158,95 Z"
                fill={`url(#phoenixGold_${svgUid})`}
                stroke="#fff8db"
                strokeWidth="1.2"
                opacity="0.9"
              />
            </g>

            {/* Rotating Flame Orbit Ring */}
            <g className="animate-spin-slow origin-center">
              <circle cx="150" cy="150" r="132" fill="none" stroke={`url(#phoenixGold_${svgUid})`} strokeWidth="3" strokeDasharray="6,8" />
              {[0, 60, 120, 180, 240, 300].map((angle, i) => {
                const rad = (angle * Math.PI) / 180;
                const cx = 150 + 132 * Math.cos(rad);
                const cy = 150 + 132 * Math.sin(rad);
                return (
                  <circle key={i} cx={cx} cy={cy} r="4" fill="#fbbf24" stroke="#ef4444" strokeWidth="1.5" />
                );
              })}
            </g>

            <circle cx="150" cy="150" r="88" fill="none" stroke={`url(#phoenixGold_${svgUid})`} strokeWidth="3.5" />
          </svg>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* 8D. ACC COSMIC GALAXY SUPERNOVA (🌌 कॉस्मिक गैलेक्सी सुपरनोवा)      */}
      {/* ----------------------------------------------------------------- */}
      {frame === 'acc_galaxy_supernova' && (
        <div className="absolute -inset-4 sm:-inset-5 rounded-full pointer-events-none z-20 overflow-visible">
          <div className="absolute inset-0 rounded-full border-2 border-indigo-400 shadow-[0_0_30px_rgba(147,51,234,0.95)] animate-orbit-dance" />
          <svg viewBox="0 0 300 300" className="w-full h-full block will-change-transform">
            <defs>
              <linearGradient id={`galaxyCosmic_${svgUid}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#c084fc" />
                <stop offset="35%" stopColor="#6366f1" />
                <stop offset="70%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
              <path id={`galaxyTextOrbit_${svgUid}`} d="M 150,150 m -114,0 a 114,114 0 1,1 228,0 a 114,114 0 1,1 -228,0" fill="none" />
            </defs>

            {/* Rotating Nebula Arm 1 */}
            <g className="animate-spin-slow origin-center">
              <circle cx="150" cy="150" r="142" fill="none" stroke={`url(#galaxyCosmic_${svgUid})`} strokeWidth="3.5" strokeDasharray="4,8" />
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                const rad = (angle * Math.PI) / 180;
                const cx = 150 + 140 * Math.cos(rad);
                const cy = 150 + 140 * Math.sin(rad);
                return (
                  <g key={i}>
                    <polygon
                      points={`${cx},${cy - 6} ${cx + 2},${cy - 2} ${cx + 6},${cy} ${cx + 2},${cy + 2} ${cx},${cy + 6} ${cx - 2},${cy + 2} ${cx - 6},${cy} ${cx - 2},${cy - 2}`}
                      fill="#ffffff"
                    />
                  </g>
                );
              })}
            </g>

            {/* Counter-Rotating Nebula Arm 2 */}
            <g className="animate-spin-reverse-slow origin-center">
              <circle cx="150" cy="150" r="126" fill="none" stroke="#38bdf8" strokeWidth="2" opacity="0.8" strokeDasharray="2,6" />
              <text fontFamily="Roboto, sans-serif" fontWeight="900" fontSize="9.5" fill="#e0e7ff" letterSpacing="1.8" stroke="#1e1b4b" strokeWidth="0.8" paintOrder="stroke fill">
                <textPath href={`#galaxyTextOrbit_${svgUid}`} startOffset="0%">
                  ★ ACC COSMIC GALAXY ★ START YOUNG REACH THE STARS ★ SUPERNOVA ★
                </textPath>
              </text>
            </g>

            <circle cx="150" cy="150" r="88" fill="none" stroke={`url(#galaxyCosmic_${svgUid})`} strokeWidth="3" />
          </svg>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* 8E. ACC TIRANGA WARRIOR SHIELD (🛡️ तिरंगा योद्धा कवच शील्ड)         */}
      {/* ----------------------------------------------------------------- */}
      {frame === 'acc_tricolor_warrior' && (
        <div className="absolute -inset-3.5 sm:-inset-4.5 rounded-full pointer-events-none z-20 overflow-visible">
          <div className="absolute inset-0 rounded-full border-2 border-orange-400 shadow-[0_0_26px_rgba(249,115,22,0.9)] animate-orbit-dance" />
          <svg viewBox="0 0 300 300" className="w-full h-full block will-change-transform">
            <defs>
              <linearGradient id={`warriorSaffron_${svgUid}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ff5500" />
                <stop offset="100%" stopColor="#ffa000" />
              </linearGradient>
              <linearGradient id={`warriorGreen_${svgUid}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0a5c22" />
                <stop offset="100%" stopColor="#16a34a" />
              </linearGradient>
              <linearGradient id={`warriorGold_${svgUid}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>
            </defs>

            {/* Saffron & Green Warrior Arcs */}
            <path d="M 40,150 A 110,110 0 0,1 260,150" fill="none" stroke={`url(#warriorSaffron_${svgUid})`} strokeWidth="12" strokeLinecap="round" />
            <path d="M 260,150 A 110,110 0 0,1 40,150" fill="none" stroke={`url(#warriorGreen_${svgUid})`} strokeWidth="12" strokeLinecap="round" />
            <circle cx="150" cy="150" r="110" fill="none" stroke="#ffffff" strokeWidth="2.5" />

            {/* 4 Corner Warrior Gold Shields */}
            {[45, 135, 225, 315].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const cx = 150 + 130 * Math.cos(rad);
              const cy = 150 + 130 * Math.sin(rad);
              return (
                <g key={i} transform={`translate(${cx}, ${cy}) rotate(${angle})`}>
                  <polygon points="0,-8 6,-2 4,6 0,9 -4,6 -6,-2" fill={`url(#warriorGold_${svgUid})`} stroke="#ffffff" strokeWidth="0.8" />
                </g>
              );
            })}

            {/* Ashoka 24 Spokes Rotation */}
            <g className="animate-spin-slow origin-center" stroke="#000080" strokeWidth="1.2" opacity="0.75">
              {[...Array(24)].map((_, i) => {
                const angle = (i * 15 * Math.PI) / 180;
                return (
                  <line
                    key={i}
                    x1={150 + 94 * Math.cos(angle)}
                    y1={150 + 94 * Math.sin(angle)}
                    x2={150 + 104 * Math.cos(angle)}
                    y2={150 + 104 * Math.sin(angle)}
                  />
                );
              })}
            </g>

            <circle cx="150" cy="150" r="88" fill="none" stroke={`url(#warriorGold_${svgUid})`} strokeWidth="3.5" />
          </svg>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* 8F. ACC ROYAL EMERALD GEM CROWN (🐉 रॉयल पन्ना एमराल्ड क्राउन)      */}
      {/* ----------------------------------------------------------------- */}
      {frame === 'acc_emerald_dragon' && (
        <div className="absolute -inset-4 sm:-inset-5 rounded-full pointer-events-none z-20 overflow-visible">
          <div className="absolute inset-0 rounded-full border-2 border-emerald-400 shadow-[0_0_28px_rgba(16,185,129,0.95)] animate-orbit-dance" />
          <svg viewBox="0 0 300 300" className="w-full h-full block animate-spin-slow will-change-transform">
            <defs>
              <linearGradient id={`emeraldGrad_${svgUid}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a7f3d0" />
                <stop offset="30%" stopColor="#34d399" />
                <stop offset="70%" stopColor="#059669" />
                <stop offset="100%" stopColor="#064e3b" />
              </linearGradient>
            </defs>
            <circle cx="150" cy="150" r="144" fill="none" stroke={`url(#emeraldGrad_${svgUid})`} strokeWidth="4" />
            <circle cx="150" cy="150" r="132" fill="none" stroke="#fcd34d" strokeWidth="1.8" strokeDasharray="4,6" />

            {/* 8 Emerald Facet Jewels */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const cx = 150 + 138 * Math.cos(rad);
              const cy = 150 + 138 * Math.sin(rad);
              return (
                <g key={i}>
                  <rect
                    x={cx - 4.5}
                    y={cy - 4.5}
                    width="9"
                    height="9"
                    transform={`rotate(45, ${cx}, ${cy})`}
                    fill={`url(#emeraldGrad_${svgUid})`}
                    stroke="#ffffff"
                    strokeWidth="1"
                  />
                  <circle cx={cx} cy={cy} r="1.5" fill="#ffffff" />
                </g>
              );
            })}

            <circle cx="150" cy="150" r="88" fill="none" stroke="#34d399" strokeWidth="3" />
          </svg>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* 8G. ACC IMPERIAL RUBY EMPEROR AURA (💎 शाही माणिक्य रूबी चक्र)      */}
      {/* ----------------------------------------------------------------- */}
      {frame === 'acc_ruby_emperor' && (
        <div className="absolute -inset-4 sm:-inset-5 rounded-full pointer-events-none z-20 overflow-visible">
          <div className="absolute inset-0 rounded-full border-2 border-rose-400 shadow-[0_0_28px_rgba(225,29,72,0.95)] animate-flame-pulse" />
          <svg viewBox="0 0 300 300" className="w-full h-full block will-change-transform">
            <defs>
              <linearGradient id={`rubyGrad_${svgUid}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fecdd3" />
                <stop offset="25%" stopColor="#fb7185" />
                <stop offset="60%" stopColor="#e11d48" />
                <stop offset="100%" stopColor="#881337" />
              </linearGradient>
            </defs>

            {/* Golden Emperor Laurel Wreath Ring */}
            <g className="animate-spin-slow origin-center">
              <circle cx="150" cy="150" r="142" fill="none" stroke="#fbbf24" strokeWidth="2.5" />
              <circle cx="150" cy="150" r="136" fill="none" stroke={`url(#rubyGrad_${svgUid})`} strokeWidth="3.5" strokeDasharray="6,6" />

              {/* 10 Ruby Heart & Teardrop Jewels */}
              {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((angle, i) => {
                const rad = (angle * Math.PI) / 180;
                const cx = 150 + 136 * Math.cos(rad);
                const cy = 150 + 136 * Math.sin(rad);
                return (
                  <g key={i}>
                    <circle cx={cx} cy={cy} r="5" fill={`url(#rubyGrad_${svgUid})`} stroke="#ffffff" strokeWidth="1" />
                    <circle cx={cx - 1.2} cy={cy - 1.2} r="1.5" fill="#ffffff" />
                  </g>
                );
              })}
            </g>

            <circle cx="150" cy="150" r="88" fill="none" stroke={`url(#rubyGrad_${svgUid})`} strokeWidth="3.5" />
          </svg>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* 8H. ACC DIGITAL CYBER MATRIX 2026 (⚡ डिजिटल साइबर मैट्रिक्स 2026)  */}
      {/* ----------------------------------------------------------------- */}
      {frame === 'acc_cyber_matrix' && (
        <div className="absolute -inset-4 sm:-inset-5 rounded-full pointer-events-none z-20 overflow-visible">
          <div className="absolute inset-0 rounded-full border-2 border-cyan-400 shadow-[0_0_28px_rgba(6,182,212,0.95)] animate-orbit-dance" />
          <svg viewBox="0 0 300 300" className="w-full h-full block will-change-transform">
            <defs>
              <linearGradient id={`cyberMatrixGrad_${svgUid}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>

            {/* Rotating Cyber Outer Ring with Nodes */}
            <g className="animate-spin-slow origin-center">
              <polygon
                points="150,10 270,80 270,220 150,290 30,220 30,80"
                fill="none"
                stroke={`url(#cyberMatrixGrad_${svgUid})`}
                strokeWidth="2.5"
                opacity="0.85"
              />
              <circle cx="150" cy="150" r="135" fill="none" stroke="#22d3ee" strokeWidth="1.8" strokeDasharray="8,6" />
              {[0, 60, 120, 180, 240, 300].map((angle, i) => {
                const rad = (angle * Math.PI) / 180;
                const cx = 150 + 135 * Math.cos(rad);
                const cy = 150 + 135 * Math.sin(rad);
                return (
                  <rect
                    key={i}
                    x={cx - 3.5}
                    y={cy - 3.5}
                    width="7"
                    height="7"
                    fill="#06b6d4"
                    stroke="#ffffff"
                    strokeWidth="1"
                  />
                );
              })}
            </g>

            {/* Counter Rotating Inner Radar Ring */}
            <g className="animate-spin-reverse-slow origin-center">
              <circle cx="150" cy="150" r="120" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4,8" />
            </g>

            <circle cx="150" cy="150" r="88" fill="none" stroke="#06b6d4" strokeWidth="3" />
          </svg>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* 8I. ACC SURYA SOLAR FLARE 3D (☀️ सूर्य नमस्कार प्रभा-मंडल 3D)       */}
      {/* ----------------------------------------------------------------- */}
      {frame === 'acc_solar_flare' && (
        <div className="absolute -inset-4 sm:-inset-5 rounded-full pointer-events-none z-20 overflow-visible">
          <div className="absolute inset-0 rounded-full border-2 border-amber-300 shadow-[0_0_30px_rgba(245,158,11,1)] animate-flame-pulse" />
          <svg viewBox="0 0 300 300" className="w-full h-full block will-change-transform">
            <defs>
              <linearGradient id={`solarFlareGrad_${svgUid}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="25%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="75%" stopColor="#ea580c" />
                <stop offset="100%" stopColor="#9a3412" />
              </linearGradient>
            </defs>

            {/* 12 Radiant Surya Sun Rays */}
            <g className="animate-spin-slow origin-center">
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => {
                const rad = (angle * Math.PI) / 180;
                const tipX = 150 + 146 * Math.cos(rad);
                const tipY = 150 + 146 * Math.sin(rad);
                const baseRad1 = ((angle - 6) * Math.PI) / 180;
                const baseRad2 = ((angle + 6) * Math.PI) / 180;
                const b1X = 150 + 128 * Math.cos(baseRad1);
                const b1Y = 150 + 128 * Math.sin(baseRad1);
                const b2X = 150 + 128 * Math.cos(baseRad2);
                const b2Y = 150 + 128 * Math.sin(baseRad2);
                return (
                  <polygon
                    key={i}
                    points={`${tipX},${tipY} ${b1X},${b1Y} ${b2X},${b2Y}`}
                    fill={`url(#solarFlareGrad_${svgUid})`}
                    stroke="#fff8db"
                    strokeWidth="0.8"
                  />
                );
              })}
              <circle cx="150" cy="150" r="128" fill="none" stroke={`url(#solarFlareGrad_${svgUid})`} strokeWidth="3" />
            </g>

            <circle cx="150" cy="150" r="88" fill="none" stroke="#f59e0b" strokeWidth="3.5" />
          </svg>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* 8J. ACC KOHINOOR DIAMOND 3D (💎 कोहिनूर डायमंड 3D क्रिस्टल क्राउन)  */}
      {/* ----------------------------------------------------------------- */}
      {frame === 'acc_kohinoor_diamond' && (
        <div className="absolute -inset-4 sm:-inset-5 rounded-full pointer-events-none z-20 overflow-visible">
          <div className="absolute inset-0 rounded-full border-2 border-cyan-300 shadow-[0_0_32px_rgba(56,189,248,1)] animate-orbit-dance" />
          <svg viewBox="0 0 300 300" className="w-full h-full block will-change-transform">
            <defs>
              <linearGradient id={`kohinoorGrad_${svgUid}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="25%" stopColor="#bae6fd" />
                <stop offset="50%" stopColor="#38bdf8" />
                <stop offset="75%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#c084fc" />
              </linearGradient>
              <path id={`kohinoorPath_${svgUid}`} d="M 150,150 m -114,0 a 114,114 0 1,1 228,0 a 114,114 0 1,1 -228,0" fill="none" />
            </defs>
            <circle cx="150" cy="150" r="144" fill="none" stroke={`url(#kohinoorGrad_${svgUid})`} strokeWidth="3.5" />
            <circle cx="150" cy="150" r="136" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="3,6" opacity="0.8" />
            
            {/* 16 Rotating Sparkling Diamonds */}
            <g className="animate-spin-slow origin-center">
              {[0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, 202.5, 225, 247.5, 270, 292.5, 315, 337.5].map((angle, i) => {
                const rad = (angle * Math.PI) / 180;
                const cx = 150 + 134 * Math.cos(rad);
                const cy = 150 + 134 * Math.sin(rad);
                return (
                  <g key={i} transform={`translate(${cx}, ${cy}) rotate(${angle})`}>
                    <polygon points="0,-4.5 4,0 0,4.5 -4,0" fill={i % 2 === 0 ? '#ffffff' : '#7dd3fc'} stroke="#0284c7" strokeWidth="0.8" />
                    <circle cx="0" cy="0" r="1" fill="#ffffff" />
                  </g>
                );
              })}
            </g>

            {/* Rotating 360 Engraved Text */}
            <g className="animate-spin-reverse-slow origin-center">
              <text fontFamily="Roboto, sans-serif" fontWeight="900" fontSize="10.5" fill="#e0f2fe" letterSpacing="2.2" stroke="#0369a1" strokeWidth="0.8" paintOrder="stroke fill">
                <textPath href={`#kohinoorPath_${svgUid}`} startOffset="0%">
                  ★ ACC KOHINOOR CROWN ★ DIAMOND SUPREME ★ ACHIEVERS CLUB ★
                </textPath>
              </text>
            </g>

            <circle cx="150" cy="150" r="88" fill="none" stroke={`url(#kohinoorGrad_${svgUid})`} strokeWidth="3.5" />
          </svg>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* 8K. ACC SHIVAJI BHAGWA CHAKRA (🚩 वीर छत्रपति भगवा शौर्य चक्र)     */}
      {/* ----------------------------------------------------------------- */}
      {frame === 'acc_shivaji_bhagwa' && (
        <div className="absolute -inset-4 sm:-inset-5 rounded-full pointer-events-none z-20 overflow-visible">
          <div className="absolute inset-0 rounded-full border-2 border-orange-500 shadow-[0_0_32px_rgba(249,115,22,1)] animate-flame-pulse" />
          <svg viewBox="0 0 300 300" className="w-full h-full block will-change-transform">
            <defs>
              <linearGradient id={`bhagwaGrad_${svgUid}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fff7ed" />
                <stop offset="30%" stopColor="#fb923c" />
                <stop offset="70%" stopColor="#ea580c" />
                <stop offset="100%" stopColor="#9a3412" />
              </linearGradient>
              <path id={`bhagwaPath_${svgUid}`} d="M 150,150 m -112,0 a 112,112 0 1,1 224,0 a 112,112 0 1,1 -224,0" fill="none" />
            </defs>

            {/* 12 Radiant Bhagwa Pennant Spears */}
            <g className="animate-spin-slow origin-center">
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => {
                const rad = (angle * Math.PI) / 180;
                const tipX = 150 + 146 * Math.cos(rad);
                const tipY = 150 + 146 * Math.sin(rad);
                const b1X = 150 + 130 * Math.cos(((angle - 7) * Math.PI) / 180);
                const b1Y = 150 + 130 * Math.sin(((angle - 7) * Math.PI) / 180);
                const b2X = 150 + 130 * Math.cos(((angle + 7) * Math.PI) / 180);
                const b2Y = 150 + 130 * Math.sin(((angle + 7) * Math.PI) / 180);
                return (
                  <polygon
                    key={i}
                    points={`${tipX},${tipY} ${b1X},${b1Y} ${b2X},${b2Y}`}
                    fill={`url(#bhagwaGrad_${svgUid})`}
                    stroke="#fef08a"
                    strokeWidth="0.8"
                  />
                );
              })}
              <circle cx="150" cy="150" r="130" fill="none" stroke={`url(#bhagwaGrad_${svgUid})`} strokeWidth="3" />
            </g>

            {/* Engraved Sanskrit Inscription Orbit */}
            <text fontFamily="Roboto, sans-serif" fontWeight="900" fontSize="10" fill="#fff7ed" letterSpacing="2" stroke="#7c2d12" strokeWidth="0.8" paintOrder="stroke fill">
              <textPath href={`#bhagwaPath_${svgUid}`} startOffset="0%">
                🚩 प्रतिपच्चंद्रलेखेव वर्धिष्णुर्विश्ववंदिता 🚩 ACC INDIA SWARAJYA 🚩
              </textPath>
            </text>

            <circle cx="150" cy="150" r="88" fill="none" stroke="#ea580c" strokeWidth="3.5" />
          </svg>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* 8L. ACC QUANTUM VORTEX 3D (🌀 क्वांटम टाइम वॉर्टेक्स 3D)          */}
      {/* ----------------------------------------------------------------- */}
      {frame === 'acc_quantum_vortex' && (
        <div className="absolute -inset-4 sm:-inset-5 rounded-full pointer-events-none z-20 overflow-visible">
          <div className="absolute inset-0 rounded-full border-2 border-teal-400 shadow-[0_0_30px_rgba(20,184,166,1)] animate-orbit-dance" />
          <svg viewBox="0 0 300 300" className="w-full h-full block will-change-transform">
            <defs>
              <linearGradient id={`quantumGrad_${svgUid}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#5eead4" />
                <stop offset="50%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
            <circle cx="150" cy="150" r="144" fill="none" stroke={`url(#quantumGrad_${svgUid})`} strokeWidth="3" strokeDasharray="12,6" className="animate-spin-slow origin-center" />
            <circle cx="150" cy="150" r="134" fill="none" stroke="#a5f3fc" strokeWidth="2" strokeDasharray="4,8" className="animate-spin-reverse-slow origin-center" />
            
            {/* 3 Elliptical Orbiting Particle Paths */}
            <g className="animate-spin-slow origin-center">
              <ellipse cx="150" cy="150" rx="140" ry="60" fill="none" stroke="#22d3ee" strokeWidth="1.5" opacity="0.7" transform="rotate(30, 150, 150)" />
              <ellipse cx="150" cy="150" rx="140" ry="60" fill="none" stroke="#38bdf8" strokeWidth="1.5" opacity="0.7" transform="rotate(90, 150, 150)" />
              <ellipse cx="150" cy="150" rx="140" ry="60" fill="none" stroke="#818cf8" strokeWidth="1.5" opacity="0.7" transform="rotate(150, 150, 150)" />
            </g>

            {/* Glowing Orbiting Quantum Quarks */}
            {[0, 60, 120, 180, 240, 300].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const cx = 150 + 130 * Math.cos(rad);
              const cy = 150 + 130 * Math.sin(rad);
              return (
                <circle key={i} cx={cx} cy={cy} r="4" fill="#67e8f9" stroke="#ffffff" strokeWidth="1" />
              );
            })}
            <circle cx="150" cy="150" r="88" fill="none" stroke="#06b6d4" strokeWidth="3.5" />
          </svg>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* 8M. ACC ROYAL PEACOCK SAPPHIRE (🦚 शाही मयूर पंख एवं नीलम रत्न)    */}
      {/* ----------------------------------------------------------------- */}
      {frame === 'acc_maharaja_peacock' && (
        <div className="absolute -inset-4 sm:-inset-5 rounded-full pointer-events-none z-20 overflow-visible">
          <div className="absolute inset-0 rounded-full border-2 border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,1)] animate-orbit-dance" />
          <svg viewBox="0 0 300 300" className="w-full h-full block will-change-transform">
            <defs>
              <linearGradient id={`peacockGrad_${svgUid}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="40%" stopColor="#06b6d4" />
                <stop offset="80%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#1e3a8a" />
              </linearGradient>
            </defs>
            <circle cx="150" cy="150" r="144" fill="none" stroke={`url(#peacockGrad_${svgUid})`} strokeWidth="3.5" />
            
            {/* 8 Royal Peacock Eyelets */}
            <g className="animate-spin-slow origin-center">
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                const rad = (angle * Math.PI) / 180;
                const cx = 150 + 132 * Math.cos(rad);
                const cy = 150 + 132 * Math.sin(rad);
                return (
                  <g key={i} transform={`translate(${cx}, ${cy}) rotate(${angle})`}>
                    <ellipse cx="0" cy="0" rx="9" ry="6" fill="#047857" stroke="#fbbf24" strokeWidth="1" />
                    <ellipse cx="0" cy="0" rx="6" ry="4" fill="#0284c7" />
                    <circle cx="0" cy="0" r="2.5" fill="#1e1b4b" stroke="#38bdf8" strokeWidth="0.8" />
                  </g>
                );
              })}
            </g>

            <circle cx="150" cy="150" r="88" fill="none" stroke="#10b981" strokeWidth="3.5" />
          </svg>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* 8N. ACC 3D BLOCKCHAIN CRYPTO GOLD (🪙 3D ब्लॉकचेन क्रिप्टो गोल्ड)   */}
      {/* ----------------------------------------------------------------- */}
      {frame === 'acc_crypto_gold_blockchain' && (
        <div className="absolute -inset-4 sm:-inset-5 rounded-full pointer-events-none z-20 overflow-visible">
          <div className="absolute inset-0 rounded-full border-2 border-yellow-400 shadow-[0_0_30px_rgba(234,179,8,1)] animate-flame-pulse" />
          <svg viewBox="0 0 300 300" className="w-full h-full block will-change-transform">
            <defs>
              <linearGradient id={`cryptoGold_${svgUid}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fffbeb" />
                <stop offset="30%" stopColor="#fde047" />
                <stop offset="70%" stopColor="#ca8a04" />
                <stop offset="100%" stopColor="#854d0e" />
              </linearGradient>
            </defs>
            <circle cx="150" cy="150" r="144" fill="none" stroke={`url(#cryptoGold_${svgUid})`} strokeWidth="3.5" />
            
            {/* Hexagonal Node Mesh */}
            <g className="animate-spin-slow origin-center">
              {[0, 60, 120, 180, 240, 300].map((angle, i) => {
                const rad = (angle * Math.PI) / 180;
                const cx = 150 + 132 * Math.cos(rad);
                const cy = 150 + 132 * Math.sin(rad);
                return (
                  <g key={i} transform={`translate(${cx}, ${cy})`}>
                    <polygon points="0,-6 5.2,-3 5.2,3 0,6 -5.2,3 -5.2,-3" fill="#ca8a04" stroke="#fef08a" strokeWidth="1" />
                    <circle cx="0" cy="0" r="2" fill="#ffffff" />
                  </g>
                );
              })}
              <circle cx="150" cy="150" r="126" fill="none" stroke="#facc15" strokeWidth="1.5" strokeDasharray="6,4" />
            </g>

            <circle cx="150" cy="150" r="88" fill="none" stroke={`url(#cryptoGold_${svgUid})`} strokeWidth="3.5" />
          </svg>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* 8O. ACC VAJRA THUNDER GOD (⚡ वज्र थंडर गॉड 360° इलेक्ट्रिक)        */}
      {/* ----------------------------------------------------------------- */}
      {frame === 'acc_thunder_lord' && (
        <div className="absolute -inset-4 sm:-inset-5 rounded-full pointer-events-none z-20 overflow-visible">
          <div className="absolute inset-0 rounded-full border-2 border-sky-400 shadow-[0_0_32px_rgba(59,130,246,1)] animate-orbit-dance" />
          <svg viewBox="0 0 300 300" className="w-full h-full block will-change-transform">
            <defs>
              <linearGradient id={`thunderGrad_${svgUid}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="30%" stopColor="#38bdf8" />
                <stop offset="70%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#1e1b4b" />
              </linearGradient>
            </defs>
            <circle cx="150" cy="150" r="144" fill="none" stroke={`url(#thunderGrad_${svgUid})`} strokeWidth="3.5" />
            
            {/* 8 Radiating Thunderbolts */}
            <g className="animate-spin-slow origin-center">
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                const rad = (angle * Math.PI) / 180;
                const cx = 150 + 132 * Math.cos(rad);
                const cy = 150 + 132 * Math.sin(rad);
                return (
                  <g key={i} transform={`translate(${cx}, ${cy}) rotate(${angle + 90})`}>
                    <polygon points="0,-8 3,-1 0,0 3,8 -3,1 0,0 -3,-8" fill="#e0f2fe" stroke="#0284c7" strokeWidth="0.8" />
                  </g>
                );
              })}
            </g>

            <circle cx="150" cy="150" r="88" fill="none" stroke="#38bdf8" strokeWidth="3.5" />
          </svg>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* 9. INNER AVATAR PHOTO & INITIALS CONTAINER + METALLIC 3D SHEEN    */}
      {/* ----------------------------------------------------------------- */}
      <div
        className={`relative rounded-full p-1 z-10 transition-all duration-300 ${
          isNone
            ? 'p-0.5 bg-slate-300'
            : `bg-gradient-to-tr ${activeFrame.gradientClass} ${activeFrame.glowClass}`
        }`}
      >
        <div
          className={`${sizeClasses[size]} relative rounded-full overflow-hidden bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center font-bold font-display text-white border-2 border-white/90 shadow-[inset_0_2px_10px_rgba(0,0,0,0.65)] z-10`}
        >
          {avatarUrl && !imgFailed ? (
            <img
              src={avatarUrl}
              alt={name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              onError={() => setImgFailed(true)}
            />
          ) : (
            <span className="tracking-wider drop-shadow-sm">{initials}</span>
          )}

          {/* Subtle Diagonal 3D Light Sheen Across Framed Portrait */}
          {!isNone && isShowcaseSize && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
            >
              <div className="w-1/2 h-[180%] -top-[40%] bg-gradient-to-r from-transparent via-white/30 to-transparent animate-frame-shimmer" />
            </div>
          )}
        </div>
      </div>

      {/* Starlight Glint Orbits on Showcase Size Frames */}
      {!isNone && isShowcaseSize && (
        <div aria-hidden="true" className="pointer-events-none absolute -inset-4 z-25">
          <span
            className="absolute top-1 left-4 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#fff] animate-frame-sparkle"
            style={{ animationDelay: '0s' }}
          />
          <span
            className="absolute bottom-3 right-2 w-1.5 h-1.5 rounded-full bg-amber-200 shadow-[0_0_8px_#fde047] animate-frame-sparkle"
            style={{ animationDelay: '0.8s' }}
          />
          <span
            className="absolute top-1/2 -left-1 w-1.5 h-1.5 rounded-full bg-cyan-200 shadow-[0_0_8px_#67e8f9] animate-frame-sparkle"
            style={{ animationDelay: '1.5s' }}
          />
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* 10. 3D BADGE INDICATOR (BOTTOM CORNER)                           */}
      {/* ----------------------------------------------------------------- */}
      {showBadge && !isNone && (
        <div
          className={`absolute ${badgeSizes[size]} rounded-full bg-slate-950 border-2 border-white flex items-center justify-center shadow-lg z-30 transition-transform duration-200`}
          title={activeFrame.name}
        >
          <span>{activeFrame.icon}</span>
        </div>
      )}
    </div>
  );
};
