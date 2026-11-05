import { Member } from '../types';
import { ACC_LOGO_URL } from '../assets/logo';

// Helper to load image
const loadImage = (src: string): Promise<HTMLImageElement | null> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
};

/**
 * Draws the Portrait Front Side of the Digital ID Card on canvas.
 * Exactly matches the on-screen vertical card layout.
 * Dimensions: 840 x 1320
 */
export async function drawIdCardFront(
  ctx: CanvasRenderingContext2D,
  member: Member,
  offsetX: number = 0,
  offsetY: number = 0
): Promise<void> {
  ctx.save();
  ctx.translate(offsetX, offsetY);

  const referralLink = typeof window !== 'undefined'
    ? `${window.location.origin}/?sponsor=${member.accId}`
    : `https://achieversclub.in/?sponsor=${member.accId}`;

  const W = 840;
  const H = 1320;

  // Load Official Logo (Bundled Vite asset -> ./acc_logo.jpg -> /acc_logo.jpg)
  const logoImg = await loadImage(ACC_LOGO_URL) || await loadImage('./acc_logo.jpg') || await loadImage('/acc_logo.jpg');

  // 1. Background gradient - Deep Luxury Slate Navy
  const bgGrad = ctx.createLinearGradient(0, 0, W, H);
  bgGrad.addColorStop(0, '#090d16');
  bgGrad.addColorStop(0.5, '#0f172a');
  bgGrad.addColorStop(1, '#050811');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // Central Security Logo Watermark
  if (logoImg) {
    ctx.save();
    ctx.globalAlpha = 0.08;
    const wmSize = 420;
    ctx.drawImage(logoImg, (W - wmSize) / 2, (H - wmSize) / 2 - 30, wmSize, wmSize);
    ctx.restore();
  }

  // Subtle Guilloche Security Pattern
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.04)';
  ctx.lineWidth = 1;
  for (let i = -W; i < W * 2; i += 32) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + 500, H);
    ctx.stroke();
  }

  // 2. Outer Luxury Gold Borders
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 6;
  ctx.strokeRect(18, 18, W - 36, H - 36);

  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 2;
  ctx.strokeRect(26, 26, W - 52, H - 52);

  // Corner Ornaments
  const drawCorner = (x: number, y: number) => {
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(x - 6, y - 6, 12, 12);
  };
  drawCorner(26, 26);
  drawCorner(W - 26, 26);
  drawCorner(26, H - 26);
  drawCorner(W - 26, H - 26);

  // 3. Top Header Bar
  ctx.fillStyle = 'rgba(245, 158, 11, 0.08)';
  ctx.fillRect(36, 36, W - 72, 110);
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.25)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(36, 36, W - 72, 110);

  // Official ACC Gold & Blue 3D Circular Logo Emblem (Frameless, No Clipping)
  if (logoImg) {
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 4;
    ctx.drawImage(logoImg, 52, 48, 84, 84);
    ctx.restore();
  } else {
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.roundRect(54, 50, 80, 80, 14);
    ctx.fill();
    ctx.fillStyle = '#050811';
    ctx.font = '900 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ACC', 94, 103);
  }

  // Brand Titles
  ctx.textAlign = 'left';
  ctx.fillStyle = '#fef3c7';
  ctx.font = '900 30px sans-serif';
  ctx.fillText('ACHIEVERS CLUB', 150, 85);

  ctx.fillStyle = '#fbbf24';
  ctx.font = '700 14px sans-serif';
  ctx.fillText('COMMUNITY (ACC) • OFFICIAL DIGITAL ID', 150, 112);

  // Header Right Badge: VERIFIED
  ctx.fillStyle = '#065f46';
  ctx.beginPath();
  ctx.roundRect(W - 230, 56, 175, 36, 18);
  ctx.fill();
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = '#6ee7b7';
  ctx.font = '800 14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('✓ VERIFIED', W - 142, 80);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 12px monospace';
  ctx.fillText('MEMBERSHIP CARD', W - 142, 112);

  // 4. Slogan Pill
  ctx.fillStyle = 'rgba(245, 158, 11, 0.12)';
  ctx.beginPath();
  ctx.roundRect(W / 2 - 220, 165, 440, 36, 18);
  ctx.fill();
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.3)';
  ctx.stroke();
  ctx.fillStyle = '#fbbf24';
  ctx.font = '800 14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('✦ START YOUNG, RETIRE YOUNG ✦', W / 2, 189);

  // 5. Member Profile Section (Avatar + Info)
  // Photo Frame
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.roundRect(50, 220, 190, 210, 16);
  ctx.fill();
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 3;
  ctx.stroke();

  let avatarDrawn = false;
  if (member.avatarUrl) {
    try {
      const avatarImg = await loadImage(member.avatarUrl);
      if (avatarImg) {
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(54, 224, 182, 202, 14);
        ctx.clip();
        ctx.drawImage(avatarImg, 54, 224, 182, 202);
        ctx.restore();
        avatarDrawn = true;
      }
    } catch {
      // fallback
    }
  }

  if (!avatarDrawn) {
    ctx.fillStyle = '#f59e0b';
    ctx.font = '900 64px sans-serif';
    ctx.textAlign = 'center';
    const initials = member.fullName.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase() || 'ACC';
    ctx.fillText(initials, 145, 335);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '700 12px sans-serif';
    ctx.fillText('OFFICIAL PHOTO', 145, 375);
  }

  // Right Details Column
  ctx.textAlign = 'left';

  ctx.fillStyle = '#94a3b8';
  ctx.font = '700 13px sans-serif';
  ctx.fillText('AUTHORIZED MEMBER NAME:', 265, 245);

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 30px sans-serif';
  // Truncate name if too long
  const nameToDraw = member.fullName.length > 20 ? member.fullName.slice(0, 20) + '...' : member.fullName;
  ctx.fillText(nameToDraw, 265, 285);

  // Plan pill
  ctx.fillStyle = '#94a3b8';
  ctx.font = '700 13px sans-serif';
  ctx.fillText('SYSTEM PLAN:', 265, 325);

  const planName = member.plan === 'TWIS'
    ? 'TEAM WORK (TWIS) • ₹150'
    : member.plan === 'SWIS'
    ? 'SELF WORK (SWIS) • 3.30%'
    : 'COMBO MASTER SYSTEM';
  ctx.fillStyle = 'rgba(245, 158, 11, 0.2)';
  ctx.beginPath();
  ctx.roundRect(380, 308, 260, 26, 6);
  ctx.fill();
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
  ctx.stroke();
  ctx.fillStyle = '#fbbf24';
  ctx.font = '800 13px sans-serif';
  ctx.fillText(planName, 390, 326);

  // Mobile
  ctx.fillStyle = '#94a3b8';
  ctx.font = '700 13px sans-serif';
  ctx.fillText('REGISTERED MOBILE:', 265, 365);
  ctx.fillStyle = '#f1f5f9';
  ctx.font = '700 17px monospace';
  ctx.fillText(`+91 ${member.mobile || '8877490845'}`, 430, 365);

  // City & State
  ctx.fillStyle = '#94a3b8';
  ctx.font = '700 13px sans-serif';
  ctx.fillText('LOCATION / CITY:', 265, 405);
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '600 16px sans-serif';
  const loc = `${member.city || 'Indore'}, ${member.state || 'MP'}`;
  ctx.fillText(loc, 400, 405);

  // 6. Highlighted ACC Unique Member ID Banner
  ctx.fillStyle = '#020617';
  ctx.beginPath();
  ctx.roundRect(50, 455, W - 100, 115, 16);
  ctx.fill();
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.fillStyle = '#fbbf24';
  ctx.font = '800 13px sans-serif';
  ctx.fillText('★ OFFICIAL UNIQUE MEMBER 🆔', 75, 485);

  ctx.fillStyle = '#fef08a';
  ctx.font = '900 42px monospace';
  ctx.fillText(member.accId, 75, 532);

  // ID Footer line
  ctx.fillStyle = '#64748b';
  ctx.font = '600 12px monospace';
  ctx.fillText('ACC = Achievers Club  |  249 = Activation  |  ' + (member.plan || 'SWIS') + ' Plan', 75, 558);

  // 7. Secondary Details 4-Cell Grid
  const gridY = 595;
  const gridW = W - 100;
  const gridH = 140;

  ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
  ctx.beginPath();
  ctx.roundRect(50, gridY, gridW, gridH, 14);
  ctx.fill();
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Divider lines
  ctx.strokeStyle = '#1e293b';
  ctx.beginPath();
  ctx.moveTo(50, gridY + 70);
  ctx.lineTo(50 + gridW, gridY + 70);
  ctx.moveTo(50 + gridW / 2, gridY);
  ctx.lineTo(50 + gridW / 2, gridY + gridH);
  ctx.stroke();

  // Cell 1: Sponsor ID
  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 12px sans-serif';
  ctx.fillText('SPONSOR ID:', 70, gridY + 28);
  ctx.fillStyle = '#f8fafc';
  ctx.font = '700 15px monospace';
  ctx.fillText(member.sponsorId || 'ACC249SWISRK01', 70, gridY + 52);

  // Cell 2: Sponsor Name
  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 12px sans-serif';
  ctx.fillText('SPONSOR NAME:', 50 + gridW / 2 + 20, gridY + 28);
  ctx.fillStyle = '#f8fafc';
  ctx.font = '700 15px sans-serif';
  ctx.fillText(member.sponsorName || 'Rahul Kumar', 50 + gridW / 2 + 20, gridY + 52);

  // Cell 3: Activation Fee
  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 12px sans-serif';
  ctx.fillText('ACTIVATION FEE:', 70, gridY + 98);
  ctx.fillStyle = '#34d399';
  ctx.font = '800 15px sans-serif';
  ctx.fillText('₹249 (ONE TIME PAID)', 70, gridY + 122);

  // Cell 4: Active Date / UTR
  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 12px sans-serif';
  ctx.fillText('ACTIVE DATE / UTR:', 50 + gridW / 2 + 20, gridY + 98);
  ctx.fillStyle = '#38bdf8';
  ctx.font = '700 15px monospace';
  ctx.fillText(member.paymentDate || '10-08-2026', 50 + gridW / 2 + 20, gridY + 122);

  // 8. Footer Section: QR Code + Links + Authority Signature
  const footerY = 760;
  const footerH = 460;

  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.beginPath();
  ctx.roundRect(50, footerY, gridW, footerH, 16);
  ctx.fill();
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.3)';
  ctx.stroke();

  // QR Code Box on Left
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(75, footerY + 25, 210, 210, 12);
  ctx.fill();
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2;
  ctx.stroke();

  let qrDrawn = false;
  const qrSourceToUse = member.personalQrUrl || `https://api.qrserver.com/v1/create-qr-code/?size=210x210&data=${encodeURIComponent(referralLink)}`;

  try {
    const qrImg = await loadImage(qrSourceToUse);
    if (qrImg) {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(83, footerY + 33, 194, 194, 10);
      ctx.clip();
      ctx.drawImage(qrImg, 83, footerY + 33, 194, 194);
      ctx.restore();
      qrDrawn = true;
    }
  } catch {
    // fallback
  }

  if (!qrDrawn) {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(100, footerY + 50, 160, 160);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(115, footerY + 65, 40, 40);
    ctx.fillRect(205, footerY + 65, 40, 40);
    ctx.fillRect(115, footerY + 155, 40, 40);
  }

  ctx.fillStyle = '#fbbf24';
  ctx.font = '800 12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('SCAN REFERRAL & JOIN', 180, footerY + 258);

  // Links Column on Right of QR
  ctx.textAlign = 'left';

  ctx.fillStyle = '#fbbf24';
  ctx.font = '800 13px sans-serif';
  ctx.fillText('🔗 REFERRAL LINK (रेफरल लिंक):', 315, footerY + 50);

  ctx.fillStyle = '#e2e8f0';
  ctx.font = '600 13px monospace';
  const displayRef = referralLink.length > 36 ? referralLink.slice(0, 36) + '...' : referralLink;
  ctx.fillText(displayRef, 315, footerY + 76);

  ctx.fillStyle = '#34d399';
  ctx.font = '800 13px sans-serif';
  ctx.fillText('🌐 USER SUBMITTED LINK (यूजर प्रोफाइल लिंक):', 315, footerY + 120);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 13px monospace';
  const profLink = member.profileLink || 'Not submitted (Manage from Dashboard)';
  const displayProf = profLink.length > 36 ? profLink.slice(0, 36) + '...' : profLink;
  ctx.fillText(displayProf, 315, footerY + 144);

  // Security Seal & Signature on Right
  ctx.beginPath();
  ctx.arc(400, footerY + 225, 34, 0, Math.PI * 2);
  ctx.fillStyle = '#f59e0b';
  ctx.fill();
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.fillStyle = '#0f172a';
  ctx.font = '900 10px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('OFFICIAL', 400, footerY + 222);
  ctx.fillText('SEAL', 400, footerY + 236);

  // Signature Block
  ctx.textAlign = 'right';
  ctx.fillStyle = '#fbbf24';
  ctx.font = 'italic 700 22px "Brush Script MT", cursive, sans-serif';
  ctx.fillText('Vikas Kumar', 730, footerY + 215);

  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(560, footerY + 225);
  ctx.lineTo(730, footerY + 225);
  ctx.stroke();

  ctx.fillStyle = '#94a3b8';
  ctx.font = '700 12px sans-serif';
  ctx.fillText('CHIEF COMMUNITY ADMINISTRATOR', 730, footerY + 245);

  // Bottom Community Rule Line
  ctx.fillStyle = '#f59e0b';
  ctx.font = '800 13px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('✦ START YOUNG, RETIRE YOUNG ✦ WWW.ACHIEVERSCLUB.IN ✦', W / 2, footerY + 340);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 12px sans-serif';
  ctx.fillText('HELPLINE: newuserhelpline@gmail.com  |  TELEGRAM: @NEWUSERHELPLINE', W / 2, footerY + 375);

  ctx.restore();
}

/**
 * Draws the Portrait Back Side of the Digital ID Card on canvas.
 * Dimensions: 840 x 1320
 */
export async function drawIdCardBack(
  ctx: CanvasRenderingContext2D,
  member: Member,
  offsetX: number = 0,
  offsetY: number = 0
): Promise<void> {
  ctx.save();
  ctx.translate(offsetX, offsetY);

  const W = 840;
  const H = 1320;

  // Load Official Logo (Bundled Vite asset -> ./acc_logo.jpg -> /acc_logo.jpg)
  const logoImg = await loadImage(ACC_LOGO_URL) || await loadImage('./acc_logo.jpg') || await loadImage('/acc_logo.jpg');

  // 1. Background gradient - Deep Luxury Slate Navy
  const bgGrad = ctx.createLinearGradient(0, 0, W, H);
  bgGrad.addColorStop(0, '#050811');
  bgGrad.addColorStop(0.5, '#0b1120');
  bgGrad.addColorStop(1, '#030712');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // Central Security Logo Watermark
  if (logoImg) {
    ctx.save();
    ctx.globalAlpha = 0.07;
    const wmSize = 420;
    ctx.drawImage(logoImg, (W - wmSize) / 2, (H - wmSize) / 2 - 30, wmSize, wmSize);
    ctx.restore();
  }

  // Subtle Guilloche Security Pattern
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.04)';
  ctx.lineWidth = 1;
  for (let i = -W; i < W * 2; i += 32) {
    ctx.beginPath();
    ctx.moveTo(i, H);
    ctx.lineTo(i + 500, 0);
    ctx.stroke();
  }

  // 2. Outer Luxury Gold Borders
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 6;
  ctx.strokeRect(18, 18, W - 36, H - 36);

  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 2;
  ctx.strokeRect(26, 26, W - 52, H - 52);

  // Corner Ornaments
  const drawCorner = (x: number, y: number) => {
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(x - 6, y - 6, 12, 12);
  };
  drawCorner(26, 26);
  drawCorner(W - 26, 26);
  drawCorner(26, H - 26);
  drawCorner(W - 26, H - 26);

  // 3. Top Header Bar
  ctx.fillStyle = 'rgba(245, 158, 11, 0.08)';
  ctx.fillRect(36, 36, W - 72, 105);
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.25)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(36, 36, W - 72, 105);

  // Official ACC Gold & Blue 3D Circular Logo Emblem (Frameless, No Clipping)
  if (logoImg) {
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 4;
    ctx.drawImage(logoImg, 52, 46, 82, 82);
    ctx.restore();
  } else {
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.roundRect(54, 48, 76, 76, 12);
    ctx.fill();
    ctx.fillStyle = '#050811';
    ctx.font = '900 32px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ACC', 92, 98);
  }

  // Brand Titles
  ctx.textAlign = 'left';
  ctx.fillStyle = '#fef3c7';
  ctx.font = '900 26px sans-serif';
  ctx.fillText('ACHIEVERS CLUB COMMUNITY (ACC)', 146, 80);

  ctx.fillStyle = '#fbbf24';
  ctx.font = '700 13px sans-serif';
  ctx.fillText('TERMS, SERVICES & VERIFICATION PROTOCOL', 146, 106);

  // Member ID Stamp Right
  ctx.textAlign = 'right';
  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 12px sans-serif';
  ctx.fillText('ACC 🆔:', W - 56, 75);
  ctx.fillStyle = '#fef08a';
  ctx.font = '900 20px monospace';
  ctx.fillText(member.accId, W - 56, 102);

  // 4. Section 1: Platform Objective & Description
  const box1Y = 165;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
  ctx.beginPath();
  ctx.roundRect(50, box1Y, W - 100, 165, 14);
  ctx.fill();
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.25)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.textAlign = 'left';
  ctx.fillStyle = '#fbbf24';
  ctx.font = '900 16px sans-serif';
  ctx.fillText('1. प्लेटफॉर्म परिचय (PLATFORM DESCRIPTION)', 70, box1Y + 36);

  ctx.fillStyle = '#cbd5e1';
  ctx.font = '500 14px sans-serif';
  ctx.fillText('अचीवर्स क्लब कम्युनिटी (ACC) भारत के छात्र-छात्राओं और युवाओं का एक स्वावलंबन व', 70, box1Y + 70);
  ctx.fillText('डिजिटल स्किल डेवलपमेंट समुदाय है। यहाँ छात्र बिना पढ़ाई प्रभावित किए अपने स्मार्टफोन से', 70, box1Y + 98);
  ctx.fillText('SWIS एवं TWIS माध्यम से सुरक्षित पॉकेट मनी व स्वावलंबी आय अर्जित करते हैं।', 70, box1Y + 126);

  // 5. Section 2: Platform Core Services (4 Cards)
  const box2Y = 350;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
  ctx.beginPath();
  ctx.roundRect(50, box2Y, W - 100, 270, 14);
  ctx.fill();
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#38bdf8';
  ctx.font = '900 16px sans-serif';
  ctx.fillText('2. अधिकृत सेवाएं व लाभ (SERVICES INFORMATION)', 70, box2Y + 36);

  // 4 mini boxes
  const services = [
    { title: '⚡ SWIS रिचार्ज कमीशन:', desc: 'सभी प्रीपेड, DTH व बिल पेमेंट्स पर 3.30% फिक्स्ड कमीशन।' },
    { title: '👥 TWIS रेफरल हब:', desc: 'प्रत्येक नए एक्टिवेटेड साथी पर ₹150 सीधी रेफरल इनकम (Daily UPI)।' },
    { title: '📚 स्टूडेंट स्किल किट:', desc: 'लाइफटाइम ट्रेनिंग वीडियो, कोर्सेज व सोशल प्रमोशन टूल्स।' },
    { title: '📱 Real App एक्सेस:', desc: 'सत्यापित सदस्यों को अधिकृत Android APK डाउनलोड लिंक।' },
  ];

  services.forEach((s, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const sx = 70 + col * 350;
    const sy = box2Y + 60 + row * 90;

    ctx.fillStyle = 'rgba(2, 6, 23, 0.7)';
    ctx.beginPath();
    ctx.roundRect(sx, sy, 330, 75, 10);
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = col === 0 ? '#fbbf24' : '#34d399';
    ctx.font = '800 13px sans-serif';
    ctx.fillText(s.title, sx + 14, sy + 28);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 12px sans-serif';
    ctx.fillText(s.desc, sx + 14, sy + 52);
  });

  // 6. Section 3: Community Rules (4 Bullets)
  const box3Y = 640;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
  ctx.beginPath();
  ctx.roundRect(50, box3Y, W - 100, 240, 14);
  ctx.fill();
  ctx.strokeStyle = 'rgba(52, 211, 153, 0.25)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#34d399';
  ctx.font = '900 16px sans-serif';
  ctx.fillText('3. नियम व महत्वपूर्ण शर्तें (COMMUNITY RULES)', 70, box3Y + 36);

  const rules = [
    '• यह 🆔 कार्ड अहस्तांतरणीय (Non-transferable) है और केवल अधिकृत सदस्य हेतु मान्य है।',
    '• वॉलेट में न्यूनतम ₹100 होते ही UPI द्वारा बैंक ट्रांसफर का अनुरोध कर सकते हैं।',
    '• ₹249 सदस्यता एक्टिवेशन शुल्क एकमुश्त (One-Time) है और आजीवन वैधता प्रदान करता है।',
    '• किसी भी प्रकार की भ्रामक जानकारी या अनधिकृत प्रचार पर सदस्यता तत्काल निरस्त की जा सकती है।',
  ];

  ctx.fillStyle = '#cbd5e1';
  ctx.font = '500 13.5px sans-serif';
  rules.forEach((r, idx) => {
    ctx.fillText(r, 70, box3Y + 75 + idx * 38);
  });

  // 7. Section 4: Official Helpline & Legal Seal
  const box4Y = 900;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.beginPath();
  ctx.roundRect(50, box4Y, W - 100, 360, 16);
  ctx.fill();
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.3)';
  ctx.stroke();

  ctx.fillStyle = '#f8fafc';
  ctx.font = '800 16px sans-serif';
  ctx.fillText('आधिकारिक संपर्क एवं सहायता डेस्क:', 75, box4Y + 45);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 14px sans-serif';
  ctx.fillText('📞 हेल्पलाइन: +91 8877490845', 75, box4Y + 85);
  ctx.fillText('✉️ ईमेल: newuserhelpline@gmail.com', 75, box4Y + 115);
  ctx.fillText('💬 टेलीग्राम: https://t.me/NEWUSERHELPLINE', 75, box4Y + 145);
  ctx.fillText('🌐 पोर्टल: www.achieversclub.in', 75, box4Y + 175);

  // Authority Stamp & Signature Seal (Natural Circular Logo)
  if (logoImg) {
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 8;
    ctx.drawImage(logoImg, 630 - 45, box4Y + 95 - 45, 90, 90);
    ctx.restore();
  } else {
    ctx.beginPath();
    ctx.arc(630, box4Y + 95, 45, 0, Math.PI * 2);
    ctx.fillStyle = '#f59e0b';
    ctx.fill();
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.fillStyle = '#0f172a';
    ctx.font = '900 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ACC LEGAL', 630, box4Y + 92);
    ctx.fillText('VERIFIED', 630, box4Y + 108);
  }

  ctx.textAlign = 'center';
  ctx.fillStyle = '#fbbf24';
  ctx.font = 'italic 700 24px "Brush Script MT", cursive, sans-serif';
  ctx.fillText('Vikas Kumar', 630, box4Y + 185);

  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(500, box4Y + 195);
  ctx.lineTo(760, box4Y + 195);
  ctx.stroke();

  ctx.fillStyle = '#94a3b8';
  ctx.font = '700 13px sans-serif';
  ctx.fillText('Authorised Signatory (Admin)', 630, box4Y + 220);

  // Bottom Notice
  ctx.fillStyle = '#f59e0b';
  ctx.font = '800 13px sans-serif';
  ctx.fillText('✦ START YOUNG, RETIRE YOUNG • ACHIEVERS CLUB COMMUNITY ✦', W / 2, box4Y + 310);

  ctx.restore();
}

/**
 * Downloads Front Side HD PNG matching exact on-screen portrait card
 */
export async function downloadPremiumIdCard(member: Member): Promise<void> {
  if (member.id === 'mem-specimen-demo' || member.id === 'mem-001' || member.id === 'mem-002') {
    alert('⚠️ यह केवल एक नमूना (Sample Preview) कार्ड है। डाउनलोड केवल वास्तविक सत्यापित सदस्य के लिए उपलब्ध है।');
    return;
  }
  const canvas = document.createElement('canvas');
  canvas.width = 840;
  canvas.height = 1320;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  await drawIdCardFront(ctx, member, 0, 0);

  const dataUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = `ACC_ID_CARD_FRONT_${member.accId}.png`;
  link.href = dataUrl;
  link.click();
}

/**
 * Downloads Back Side HD PNG matching exact on-screen portrait card
 */
export async function downloadPremiumIdCardBack(member: Member): Promise<void> {
  if (member.id === 'mem-specimen-demo' || member.id === 'mem-001' || member.id === 'mem-002') {
    alert('⚠️ यह केवल एक नमूना (Sample Preview) कार्ड है। डाउनलोड केवल वास्तविक सत्यापित सदस्य के लिए उपलब्ध है।');
    return;
  }
  const canvas = document.createElement('canvas');
  canvas.width = 840;
  canvas.height = 1320;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  await drawIdCardBack(ctx, member, 0, 0);

  const dataUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = `ACC_ID_CARD_BACK_${member.accId}.png`;
  link.href = dataUrl;
  link.click();
}

/**
 * Downloads Both Sides (Front & Back) on a single high-resolution print sheet
 * Suitable for printing, PVC card creation, and lamination at cyber cafés
 */
export async function downloadBothSidesIdCard(member: Member): Promise<void> {
  if (member.id === 'mem-specimen-demo' || member.id === 'mem-001' || member.id === 'mem-002') {
    alert('⚠️ यह केवल एक नमूना (Sample Preview) कार्ड है। डाउनलोड केवल वास्तविक सत्यापित सदस्य के लिए उपलब्ध है।');
    return;
  }
  const canvas = document.createElement('canvas');
  // 1760 width x 1440 height for side-by-side portrait 2-sided sheet
  canvas.width = 1760;
  canvas.height = 1440;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Background
  ctx.fillStyle = '#0a0f1d';
  ctx.fillRect(0, 0, 1760, 1440);

  // Sheet Header
  ctx.fillStyle = '#f59e0b';
  ctx.font = '900 24px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('ACHIEVERS CLUB COMMUNITY (ACC) • OFFICIAL STUDENT DIGITAL ID CARD', 880, 42);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 14px sans-serif';
  ctx.fillText(`MEMBER: ${member.fullName} | 🆔 ${member.accId} | TWO-SIDED PRINTING & LAMINATION SHEET`, 880, 68);

  // Draw Front Card on Left (840 x 1320 at x=30, y=90)
  await drawIdCardFront(ctx, member, 30, 90);

  // Center Cut Guideline
  const lineX = 880;
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([8, 6]);
  ctx.beginPath();
  ctx.moveTo(lineX, 90);
  ctx.lineTo(lineX, 1410);
  ctx.stroke();
  ctx.setLineDash([]);

  // Draw Back Card on Right (840 x 1320 at x=890, y=90)
  await drawIdCardBack(ctx, member, 890, 90);

  const dataUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = `ACC_ID_CARD_COMPLETE_SHEET_${member.accId}.png`;
  link.href = dataUrl;
  link.click();
}
