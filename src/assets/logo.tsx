import React from 'react';

// =========================================================================
// ACHIEVERS CLUB COMMUNITY (ACC INDIA) - OFFICIAL 3D VECTOR EMBLEM MASTER LOGO
// =========================================================================
// - Authentic Indian Proud Aesthetic: Indian Tiranga (Saffron, White, Green),
//   Ashoka Chakra 24-spoke royal watermark, and bold "ACC INDIA" branding.
// - Pure Vector SVG: 0ms load time, ZERO HTTP requests, ZERO 404 risk.
// - "बिना साइड कट के": Mathematically perfect 500x500 circular bounds with zero edge clipping.
// - "बिना फ्रेम के": Borderless 3D embossed medallion design without enclosing square boxes.
// =========================================================================

export const ACC_OFFICIAL_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%" fill="none" style="display:block;">
  <defs>
    <!-- 3D Realistic Soft Drop Shadow -->
    <filter id="accEmblemShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#000000" flood-opacity="0.45" />
    </filter>

    <!-- Metallic Gold Outer Rim Linear Gradient -->
    <linearGradient id="accGoldRimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fff8db" />
      <stop offset="12%" stop-color="#f59e0b" />
      <stop offset="30%" stop-color="#fbbf24" />
      <stop offset="48%" stop-color="#fef3c7" />
      <stop offset="62%" stop-color="#d97706" />
      <stop offset="82%" stop-color="#b45309" />
      <stop offset="100%" stop-color="#78350f" />
    </linearGradient>

    <!-- Metallic Gold Rim Radial Bevel -->
    <radialGradient id="accGoldRimRadial" cx="45%" cy="38%" r="62%">
      <stop offset="68%" stop-color="#f59e0b" />
      <stop offset="85%" stop-color="#fef08a" />
      <stop offset="93%" stop-color="#d97706" />
      <stop offset="100%" stop-color="#78350f" />
    </radialGradient>

    <!-- Deep Royal Navy-to-Vibrant Blue Core Disc -->
    <radialGradient id="accCoreBlueGrad" cx="36%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#2563eb" />
      <stop offset="22%" stop-color="#1d4ed8" />
      <stop offset="52%" stop-color="#124296" />
      <stop offset="80%" stop-color="#0b235e" />
      <stop offset="100%" stop-color="#05102c" />
    </radialGradient>

    <!-- 3D Chiseled Gold Typography Gradient -->
    <linearGradient id="accTypographyGold" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="18%" stop-color="#fef08a" />
      <stop offset="48%" stop-color="#fbbf24" />
      <stop offset="78%" stop-color="#d97706" />
      <stop offset="100%" stop-color="#853609" />
    </linearGradient>

    <!-- Indian Tricolor Ribbon Gradients -->
    <linearGradient id="accTricolorSaffron" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff6600" />
      <stop offset="50%" stop-color="#ff9933" />
      <stop offset="100%" stop-color="#ff7700" />
    </linearGradient>
    <linearGradient id="accTricolorGreen" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0e692a" />
      <stop offset="50%" stop-color="#138808" />
      <stop offset="100%" stop-color="#0b5320" />
    </linearGradient>

    <!-- Curved Circular Text Paths for Engraved Perimeter -->
    <path id="accPathTopArch" d="M 68,250 A 182,182 0 0,1 432,250" fill="none" />
    <path id="accPathBottomArch" d="M 432,250 A 182,182 0 0,1 68,250" fill="none" />
  </defs>

  <!-- 1. Master Coin Outer Edge & Drop Shadow -->
  <g filter="url(#accEmblemShadow)">
    <circle cx="250" cy="250" r="238" fill="url(#accGoldRimGrad)" stroke="#78350f" stroke-width="2.5" />
    <circle cx="250" cy="250" r="230" fill="none" stroke="#fef08a" stroke-width="1.5" opacity="0.85" />
    <circle cx="250" cy="250" r="208" fill="#1e293b" />
    <circle cx="250" cy="250" r="208" fill="url(#accGoldRimRadial)" />
  </g>

  <!-- 2. Perimeter Coin Milling Studs (Beaded Ring Accent) -->
  <circle cx="250" cy="250" r="222" fill="none" stroke="#fffbeb" stroke-width="2.2" stroke-dasharray="3,8" opacity="0.75" />

  <!-- 3. Engraved Outer Ring Typography (Top Arch: ACHIEVERS CLUB COMMUNITY) -->
  <text font-family="Roboto, sans-serif" font-weight="900" font-size="19.5" fill="#451a03" letter-spacing="3.5" stroke="#fef3c7" stroke-width="0.7" paint-order="stroke fill">
    <textPath href="#accPathTopArch" startOffset="50%" text-anchor="middle">
      ACHIEVERS CLUB COMMUNITY
    </textPath>
  </text>

  <!-- Engraved Outer Ring Typography (Bottom Arch: ★ START YOUNG • RETIRE YOUNG ★) -->
  <text font-family="Roboto, sans-serif" font-weight="900" font-size="17" fill="#451a03" letter-spacing="3.2" stroke="#fef3c7" stroke-width="0.6" paint-order="stroke fill">
    <textPath href="#accPathBottomArch" startOffset="50%" text-anchor="middle">
      ★ START YOUNG • RETIRE YOUNG ★
    </textPath>
  </text>

  <!-- Flanking 5-Point Stars on Golden Rim -->
  <g fill="#451a03" stroke="#fef3c7" stroke-width="0.5">
    <path d="M 64,250 l 4,8 l 9,1 l -6.5,6.5 l 1.5,9 l -8,-4.5 l -8,4.5 l 1.5,-9 l -6.5,-6.5 l 9,-1 z" transform="translate(4, -8) scale(0.65)" />
    <path d="M 64,250 l 4,8 l 9,1 l -6.5,6.5 l 1.5,9 l -8,-4.5 l -8,4.5 l 1.5,-9 l -6.5,-6.5 l 9,-1 z" transform="translate(390, -8) scale(0.65)" />
  </g>

  <!-- 4. Indian Tricolor (Tiranga) Border Rings -->
  <!-- Top Saffron Halo Ring -->
  <path d="M 86,250 A 164,164 0 0,1 414,250" fill="none" stroke="#ff9933" stroke-width="4" stroke-linecap="round" />
  <!-- Bottom India Green Halo Ring -->
  <path d="M 414,250 A 164,164 0 0,1 86,250" fill="none" stroke="#138808" stroke-width="4" stroke-linecap="round" />
  <!-- Center White Separation Pinstripe -->
  <circle cx="250" cy="250" r="160" fill="none" stroke="#ffffff" stroke-width="1.5" opacity="0.9" />

  <!-- 5. Core Royal Navy Blue Medallion Disc -->
  <circle cx="250" cy="250" r="156" fill="url(#accCoreBlueGrad)" />

  <!-- 6. Ashoka Chakra 24-Spoke Subtle Watermark Motif in Core -->
  <g stroke="#60a5fa" stroke-width="0.8" opacity="0.25" transform="translate(250, 235)">
    <circle cx="0" cy="0" r="130" fill="none" stroke="#93c5fd" stroke-width="1.2" />
    <circle cx="0" cy="0" r="115" fill="none" stroke="#fbbf24" stroke-width="0.8" stroke-dasharray="3,5" />
    <circle cx="0" cy="0" r="28" fill="none" stroke="#93c5fd" stroke-width="1.5" />
    <circle cx="0" cy="0" r="6" fill="#fbbf24" />
    <!-- 24 Radiating Spokes of Ashoka Chakra -->
    <line x1="0" y1="0" x2="130.0" y2="0.0" />
    <line x1="0" y1="0" x2="125.6" y2="33.6" />
    <line x1="0" y1="0" x2="112.6" y2="65.0" />
    <line x1="0" y1="0" x2="91.9" y2="91.9" />
    <line x1="0" y1="0" x2="65.0" y2="112.6" />
    <line x1="0" y1="0" x2="33.6" y2="125.6" />
    <line x1="0" y1="0" x2="0.0" y2="130.0" />
    <line x1="0" y1="0" x2="-33.6" y2="125.6" />
    <line x1="0" y1="0" x2="-65.0" y2="112.6" />
    <line x1="0" y1="0" x2="-91.9" y2="91.9" />
    <line x1="0" y1="0" x2="-112.6" y2="65.0" />
    <line x1="0" y1="0" x2="-125.6" y2="33.6" />
    <line x1="0" y1="0" x2="-130.0" y2="0.0" />
    <line x1="0" y1="0" x2="-125.6" y2="-33.6" />
    <line x1="0" y1="0" x2="-112.6" y2="-65.0" />
    <line x1="0" y1="0" x2="-91.9" y2="-91.9" />
    <line x1="0" y1="0" x2="-65.0" y2="-112.6" />
    <line x1="0" y1="0" x2="-33.6" y2="-125.6" />
    <line x1="0" y1="0" x2="-0.0" y2="-130.0" />
    <line x1="0" y1="0" x2="33.6" y2="-125.6" />
    <line x1="0" y1="0" x2="65.0" y2="-112.6" />
    <line x1="0" y1="0" x2="91.9" y2="-91.9" />
    <line x1="0" y1="0" x2="112.6" y2="-65.0" />
    <line x1="0" y1="0" x2="125.6" y2="-33.6" />
  </g>

  <!-- 7. Golden Victory Laurel Branches (Flanking Core) -->
  <g fill="url(#accTypographyGold)" stroke="#78350f" stroke-width="0.4" opacity="0.95">
    <!-- Left Wreath Leaves -->
    <path d="M 148,270 c 6,-10 16,-12 20,-6 c -2,8 -10,12 -20,6 z" />
    <path d="M 142,295 c 8,-8 18,-8 20,-2 c -1,8 -10,12 -20,4 z" />
    <path d="M 148,322 c 9,-6 19,-4 20,2 c 0,8 -10,10 -20,2 z" />
    <path d="M 166,346 c 10,-4 19,0 18,7 c -3,7 -12,7 -18,-1 z" />
    <path d="M 194,364 c 10,-2 18,3 15,10 c -4,6 -13,4 -15,-3 z" />

    <!-- Right Wreath Leaves -->
    <path d="M 352,270 c -6,-10 -16,-12 -20,-6 c 2,8 10,12 20,6 z" />
    <path d="M 358,295 c -8,-8 -18,-8 -20,-2 c 1,8 10,12 20,4 z" />
    <path d="M 352,322 c -9,-6 -19,-4 -20,2 c 0,8 10,10 20,2 z" />
    <path d="M 334,346 c -10,-4 -19,0 -18,7 c 3,7 12,7 18,-1 z" />
    <path d="M 306,364 c -10,-2 -18,3 -15,10 c 4,6 13,4 15,-3 z" />
  </g>

  <!-- 8. Centerpiece 3D Monogram Typography: "ACC" -->
  <g>
    <!-- Deep Extrusion Drop Shadows -->
    <text x="250" y="234" font-family="Roboto, sans-serif" font-weight="900" font-size="96" text-anchor="middle" fill="#030a1c" letter-spacing="4">
      ACC
    </text>
    <text x="250" y="231" font-family="Roboto, sans-serif" font-weight="900" font-size="96" text-anchor="middle" fill="#78350f" letter-spacing="4">
      ACC
    </text>
    <!-- Chiseled Front Face in 3D Gold Gradient -->
    <text x="250" y="228" font-family="Roboto, sans-serif" font-weight="900" font-size="96" text-anchor="middle" fill="url(#accTypographyGold)" stroke="#fef08a" stroke-width="1.6" letter-spacing="4" paint-order="stroke fill">
      ACC
    </text>
  </g>

  <!-- 9. Proud Indian Tricolor (Tiranga) "INDIA" Badge Plaque -->
  <g transform="translate(142, 254)">
    <!-- Shield / Plaque Outer Frame in Gold -->
    <rect x="0" y="0" width="216" height="38" rx="8" fill="#ffffff" stroke="url(#accGoldRimGrad)" stroke-width="2.5" filter="url(#accEmblemShadow)" />
    
    <!-- Top Saffron Stripe -->
    <path d="M 2,2 h 212 a 6,6 0 0,1 0,0 v 11 h -212 z" fill="url(#accTricolorSaffron)" />
    
    <!-- Middle White Stripe -->
    <rect x="2" y="13" width="212" height="12" fill="#ffffff" />
    
    <!-- Bottom India Green Stripe -->
    <path d="M 2,25 h 212 v 5 a 6,6 0 0,1 -6,6 h -200 a 6,6 0 0,1 -6,-6 z" fill="url(#accTricolorGreen)" />

    <!-- Center Ashoka Blue Mini Chakra behind text -->
    <circle cx="108" cy="19" r="8.5" fill="none" stroke="#000080" stroke-width="0.8" opacity="0.3" />

    <!-- Proud Typography: "★ ACC INDIA ★" -->
    <text x="108" y="25" font-family="Roboto, sans-serif" font-weight="900" font-size="16" text-anchor="middle" fill="#000080" letter-spacing="5" stroke="#ffffff" stroke-width="0.5" paint-order="stroke fill">
      ★ ACC INDIA ★
    </text>
  </g>

  <!-- 10. Secondary National Mission Tagline: SWIS • TWIS -->
  <g transform="translate(0, 318)">
    <rect x="150" y="-12" width="200" height="20" rx="10" fill="#0b235e" stroke="url(#accGoldRimGrad)" stroke-width="1" />
    <text x="250" y="2" font-family="Roboto, sans-serif" font-weight="800" font-size="11.5" text-anchor="middle" fill="#fef08a" letter-spacing="2">
      SWIS 3.30% • TWIS ₹150
    </text>
  </g>

  <!-- Bottom National Pride Motto -->
  <text x="250" y="345" font-family="sans-serif" font-weight="800" font-size="10" text-anchor="middle" fill="#ffffff" letter-spacing="1.5" opacity="0.95">
    आत्मनिर्भर भारत • डिजिटल युवा
  </text>
</svg>`;

// Base64 Data URI for instantaneous Canvas drawing without ANY network call
export const ACC_LOGO_DATA_URI =
  typeof window !== 'undefined'
    ? `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(ACC_OFFICIAL_LOGO_SVG)))}`
    : `data:image/svg+xml;utf8,${encodeURIComponent(ACC_OFFICIAL_LOGO_SVG)}`;

// Universal logo URL (guaranteed to resolve in canvas, image tags, or offline)
export const ACC_LOGO_URL = ACC_LOGO_DATA_URI;

interface AccLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'custom';
  alt?: string;
  watermark?: boolean;
}

/**
 * Universal Official ACC INDIA 3D Medallion Logo Component
 * - Authentic Indian Aesthetic: Indian Tiranga & Ashoka Chakra with bold ACC INDIA
 * - Pure Vector SVG: Always 100% visible on ALL devices, screens, webviews, and browsers
 * - Zero HTTP Requests: Renders in 0ms with zero network or proxy dependency
 * - "बिना साइड कट के": Perfectly circular with natural 500x500 aspect ratio and no cropping
 * - "बिना फ्रेम के": Borderless coin aesthetic without square enclosing boxes
 */
export const AccLogo: React.FC<AccLogoProps> = ({
  className = '',
  size = 'md',
  alt = 'Achievers Club Community (ACC INDIA) Official Logo',
  watermark = false,
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
    '2xl': 'w-32 h-32',
    custom: '',
  }[size];

  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 select-none aspect-square transition-transform ${
        watermark ? 'opacity-15 pointer-events-none' : 'drop-shadow-[0_2px_8px_rgba(0,0,0,0.25)]'
      } ${sizeClasses} ${className}`}
      title={alt}
      aria-label={alt}
      role="img"
    >
      <svg
        viewBox="0 0 500 500"
        className="w-full h-full block"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        dangerouslySetInnerHTML={{
          __html: ACC_OFFICIAL_LOGO_SVG.replace(/^<svg[^>]*>|<\/svg>$/gi, ''),
        }}
      />
    </div>
  );
};
