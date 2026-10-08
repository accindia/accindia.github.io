import { Member } from '../types';

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
 * Draws the Front Side of the Digital ID Card on a given canvas context at (offsetX, offsetY)
 * Canvas dimension: 1200 x 750
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

  // 1. Background gradient - Deep Luxury Slate Navy
  const bgGrad = ctx.createLinearGradient(0, 0, 1200, 750);
  bgGrad.addColorStop(0, '#090d16');
  bgGrad.addColorStop(0.5, '#0f172a');
  bgGrad.addColorStop(1, '#050811');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1200, 750);

  // Subtle Guilloche / Geometric Security Pattern
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.04)';
  ctx.lineWidth = 1;
  for (let i = -300; i < 1500; i += 30) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + 400, 750);
    ctx.stroke();
  }

  // 2. Outer Luxury Gold Border
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 6;
  ctx.strokeRect(20, 20, 1160, 710);

  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 2;
  ctx.strokeRect(28, 28, 1144, 694);

  // Corner Ornaments
  const drawCorner = (x: number, y: number) => {
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(x - 5, y - 5, 10, 10);
  };
  drawCorner(28, 28);
  drawCorner(1172, 28);
  drawCorner(28, 722);
  drawCorner(1172, 722);

  // 3. Top Header Bar
  ctx.fillStyle = 'rgba(245, 158, 11, 0.1)';
  ctx.fillRect(30, 30, 1140, 115);
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.3)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(30, 30, 1140, 115);

  // ACC Gold Logo Emblem
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.roundRect(55, 45, 80, 80, 12);
  ctx.fill();
  ctx.fillStyle = '#050811';
  ctx.font = '900 36px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('ACC', 95, 98);

  // Brand Titles
  ctx.textAlign = 'left';
  ctx.fillStyle = '#fef3c7';
  ctx.font = '900 34px sans-serif';
  ctx.fillText('ACHIEVERS CLUB COMMUNITY', 155, 80);

  ctx.fillStyle = '#fbbf24';
  ctx.font = '700 15px sans-serif';
  ctx.fillText('GOVT. RECOGNIZED MSME & SKILL DEVELOPMENT COMMUNITY • OFFICIAL ID', 155, 108);

  // Header Right Badge: VERIFIED
  ctx.fillStyle = '#065f46';
  ctx.beginPath();
  ctx.roundRect(980, 55, 160, 36, 18);
  ctx.fill();
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = '#6ee7b7';
  ctx.font = '800 14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('✓ VERIFIED MEMBER', 1060, 78);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 12px monospace';
  ctx.fillText('LIFETIME VALIDITY', 1060, 106);

  // 4. Middle Section: Student Photo + Details
  // Photo Frame
  ctx.save();
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.roundRect(55, 175, 190, 230, 16);
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
        ctx.roundRect(58, 178, 184, 224, 14);
        ctx.clip();
        ctx.drawImage(avatarImg, 58, 178, 184, 224);
        ctx.restore();
        avatarDrawn = true;
      }
    } catch {
      // fallback
    }
  }

  // Draw Initials if no avatar photo
  if (!avatarDrawn) {
    ctx.fillStyle = '#f59e0b';
    ctx.font = '900 64px sans-serif';
    ctx.textAlign = 'center';
    const initials = member.fullName.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase() || 'ST';
    ctx.fillText(initials, 150, 305);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '700 12px sans-serif';
    ctx.fillText('OFFICIAL PHOTO', 150, 345);
  }
  ctx.restore();

  // Details Column
  ctx.textAlign = 'left';

  // Student Name
  ctx.fillStyle = '#94a3b8';
  ctx.font = '700 13px sans-serif';
  ctx.fillText('AUTHORIZED STUDENT NAME:', 280, 195);
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 32px sans-serif';
  ctx.fillText(member.fullName.toUpperCase(), 280, 235);

  // ACC ID Highlight Box
  ctx.fillStyle = '#020617';
  ctx.beginPath();
  ctx.roundRect(280, 255, 460, 85, 12);
  ctx.fill();
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#fbbf24';
  ctx.font = '800 12px sans-serif';
  ctx.fillText('OFFICIAL UNIQUE ACC MEMBER 🆔', 300, 280);
  ctx.fillStyle = '#fef08a';
  ctx.font = '900 36px monospace';
  ctx.fillText(member.accId, 300, 322);

  // Details Row 1: Plan & Mobile
  ctx.fillStyle = '#94a3b8';
  ctx.font = '700 13px sans-serif';
  ctx.fillText('SYSTEM PLAN:', 280, 375);
  ctx.fillStyle = '#38bdf8';
  ctx.font = '800 18px sans-serif';
  const planText = member.plan === 'TWIS' 
    ? 'TEAM WORK (TWIS) • ₹150 REFERRAL' 
    : member.plan === 'SWIS' 
    ? 'SELF WORK (SWIS) • 3.30% RECHARGE' 
    : 'COMBO MASTER SYSTEM';
  ctx.fillText(planText, 280, 400);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '700 13px sans-serif';
  ctx.fillText('REGISTERED MOBILE:', 620, 375);
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 18px monospace';
  ctx.fillText('+91 ' + member.mobile, 620, 400);

  // Details Row 2: Location & UTR
  ctx.fillStyle = '#94a3b8';
  ctx.font = '700 13px sans-serif';
  ctx.fillText('LOCATION / CITY:', 280, 440);
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 16px sans-serif';
  ctx.fillText(`${member.city || 'Indore'}, ${member.state || 'MP'} (${member.pincode || '452001'})`, 280, 465);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '700 13px sans-serif';
  ctx.fillText('PAYMENT UTR (₹249 PAID):', 620, 440);
  ctx.fillStyle = '#34d399';
  ctx.font = '700 16px monospace';
  ctx.fillText(member.utrNumber || 'CONFIRMED', 620, 465);

  // Right Column: Official Scannable QR Code Box (Referral or Personal)
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(870, 175, 240, 240, 16);
  ctx.fill();
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  let qrDrawn = false;
  const qrSourceToUse = member.personalQrUrl || `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(referralLink)}`;

  try {
    const qrImg = await loadImage(qrSourceToUse);
    if (qrImg) {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(880, 185, 220, 220, 12);
      ctx.clip();
      ctx.drawImage(qrImg, 880, 185, 220, 220);
      ctx.restore();
      qrDrawn = true;
    }
  } catch {
    // fallback
  }

  if (!qrDrawn) {
    // Fallback QR pattern
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(900, 205, 180, 180);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(915, 220, 45, 45);
    ctx.fillRect(1020, 220, 45, 45);
    ctx.fillRect(915, 325, 45, 45);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(925, 230, 25, 25);
    ctx.fillRect(1030, 230, 25, 25);
    ctx.fillRect(925, 335, 25, 25);
    ctx.fillStyle = '#2563eb';
    ctx.beginPath();
    ctx.roundRect(970, 275, 40, 40, 8);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ACC', 990, 300);
  }

  ctx.fillStyle = '#f59e0b';
  ctx.font = '800 12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(member.personalQrUrl ? 'SCAN PERSONAL / PAY QR' : 'SCAN REFERRAL & JOIN 🆔', 990, 435);

  // 5. Bottom Section: Left Corner Links + Right Signatory
  ctx.fillStyle = 'rgba(245, 158, 11, 0.08)';
  ctx.beginPath();
  ctx.roundRect(55, 500, 1055, 140, 14);
  ctx.fill();
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.3)';
  ctx.stroke();

  // Left Corner: Referral Link & User Submitted Link
  ctx.textAlign = 'left';
  ctx.fillStyle = '#fbbf24';
  ctx.font = '800 13px sans-serif';
  ctx.fillText('🔗 REFERRAL LINK (रेफरल लिंक):', 80, 532);
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '600 13px monospace';
  ctx.fillText(referralLink, 80, 554);

  ctx.fillStyle = '#34d399';
  ctx.font = '800 13px sans-serif';
  ctx.fillText('🌐 USER SUBMITTED LINK (यूजर प्रोफाइल लिंक):', 80, 586);
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '600 13px monospace';
  const profileLinkDisplay = member.profileLink || 'Not submitted yet (Manage from Dashboard)';
  ctx.fillText(profileLinkDisplay, 80, 608);

  // Signatory & Seal on Right
  ctx.beginPath();
  ctx.arc(880, 570, 36, 0, Math.PI * 2);
  ctx.fillStyle = '#f59e0b';
  ctx.fill();
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.fillStyle = '#0f172a';
  ctx.font = '900 10px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('OFFICIAL', 880, 566);
  ctx.fillText('SEAL', 880, 580);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#f59e0b';
  ctx.font = 'italic 700 20px "Brush Script MT", cursive, sans-serif';
  ctx.fillText('Vikas Kumar', 1080, 560);
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(960, 575);
  ctx.lineTo(1080, 575);
  ctx.stroke();
  ctx.fillStyle = '#94a3b8';
  ctx.font = '700 11px sans-serif';
  ctx.fillText('CHIEF COMMUNITY ADMINISTRATOR', 1080, 595);

  // 6. Bottom Motto Banner
  ctx.fillStyle = '#f59e0b';
  ctx.font = '900 14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('✦ START YOUNG, RETIRE YOUNG ✦ WWW.ACHIEVERSCLUB.IN ✦ SUPPORT: +91 8877490845', 600, 680);

  ctx.restore();
}

/**
 * Draws the Back Side of the Digital ID Card on a given canvas context at (offsetX, offsetY)
 * Canvas dimension: 1200 x 750
 */
export async function drawIdCardBack(
  ctx: CanvasRenderingContext2D,
  member: Member,
  offsetX: number = 0,
  offsetY: number = 0
): Promise<void> {
  ctx.save();
  ctx.translate(offsetX, offsetY);

  // 1. Background gradient - Deep Luxury Slate Navy
  const bgGrad = ctx.createLinearGradient(0, 0, 1200, 750);
  bgGrad.addColorStop(0, '#050811');
  bgGrad.addColorStop(0.5, '#0b1120');
  bgGrad.addColorStop(1, '#030712');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1200, 750);

  // Subtle Guilloche Security Pattern
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.04)';
  ctx.lineWidth = 1;
  for (let i = -300; i < 1500; i += 30) {
    ctx.beginPath();
    ctx.moveTo(i, 750);
    ctx.lineTo(i + 400, 0);
    ctx.stroke();
  }

  // 2. Outer Luxury Gold Border
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 6;
  ctx.strokeRect(20, 20, 1160, 710);

  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 2;
  ctx.strokeRect(28, 28, 1144, 694);

  // Corner Ornaments
  const drawCorner = (x: number, y: number) => {
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(x - 5, y - 5, 10, 10);
  };
  drawCorner(28, 28);
  drawCorner(1172, 28);
  drawCorner(28, 722);
  drawCorner(1172, 722);

  // 3. Top Header Bar
  ctx.fillStyle = 'rgba(245, 158, 11, 0.09)';
  ctx.fillRect(30, 30, 1140, 100);
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.25)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(30, 30, 1140, 100);

  // ACC Gold Logo Emblem
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.roundRect(50, 42, 74, 74, 10);
  ctx.fill();
  ctx.fillStyle = '#050811';
  ctx.font = '900 32px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('ACC', 87, 90);

  // Brand Titles
  ctx.textAlign = 'left';
  ctx.fillStyle = '#fef3c7';
  ctx.font = '900 28px sans-serif';
  ctx.fillText('ACHIEVERS CLUB COMMUNITY (ACC)', 140, 72);

  ctx.fillStyle = '#fbbf24';
  ctx.font = '700 14px sans-serif';
  ctx.fillText('OFFICIAL MEMBERSHIP PROTOCOL • RULES, SERVICES & VERIFICATION GUIDELINES', 140, 98);

  // Member ID Stamp Right
  ctx.textAlign = 'right';
  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 12px sans-serif';
  ctx.fillText('MEMBER ACC 🆔:', 1140, 65);
  ctx.fillStyle = '#fef08a';
  ctx.font = '900 22px monospace';
  ctx.fillText(member.accId, 1140, 95);

  // 4. Two Main Content Cards (Left: About & Services | Right: Rules & Helpline)
  
  // LEFT BOX: About ACC & Services
  ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
  ctx.beginPath();
  ctx.roundRect(45, 145, 535, 410, 12);
  ctx.fill();
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.2)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Left Box Header
  ctx.textAlign = 'left';
  ctx.fillStyle = '#38bdf8';
  ctx.font = '900 16px sans-serif';
  ctx.fillText('1. प्लेटफॉर्म परिचय एवं मुख्य सेवाएं (SERVICES)', 65, 178);

  ctx.fillStyle = '#cbd5e1';
  ctx.font = '500 12.5px sans-serif';
  ctx.fillText('अचीवर्स क्लब कम्युनिटी (ACC) भारत के छात्रों व युवाओं का एक प्रामाणिक', 65, 208);
  ctx.fillText('स्किल डेवलपमेंट व पार्ट-टाइम अर्निंग प्लेटफॉर्म है। इसका लक्ष्य युवाओं को', 65, 228);
  ctx.fillText('बिना किसी इन्वेस्टमेंट के आत्मनिर्भर (Financially Independent) बनाना है।', 65, 248);

  // Bullet Services
  const services = [
    { label: '⚡ SWIS रिचार्ज सेवाएं:', text: 'सभी प्रीपेड/पोस्टपेड रिचार्ज व बिल भुगतान पर 3.30% फिक्स्ड कमीशन' },
    { label: '👥 TWIS रेफरल मॉडल:', text: 'प्रत्येक नए एक्टिवेटेड साथी पर ₹150 सीधी रेफरल इनकम (Daily UPI)' },
    { label: '📚 स्टूडेंट स्किल अकेडमी:', text: 'लाइफटाइम ट्रेनिंग किट, वीडियो मॉड्यूल्स, मेंटरशिप और सोशल टूल्स' },
    { label: '📱 Real App डिलीवरी:', text: 'वेरिफाइड सदस्यों को सीधे ऑफिशियल ACC Android APK एक्सेस' },
    { label: '💳 लाइफटाइम डिजिटल 🆔:', text: 'पहचान पत्र के साथ लाइफटाइम मान्यता व सुरक्षित वॉलेट प्रणाली' },
  ];

  let leftY = 280;
  services.forEach((s) => {
    ctx.fillStyle = '#fbbf24';
    ctx.font = '800 12px sans-serif';
    ctx.fillText(s.label, 65, leftY);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 11.5px sans-serif';
    ctx.fillText(s.text, 65, leftY + 18);
    leftY += 38;
  });

  // RIGHT BOX: Community Rules & Regulations (नियम व शर्तें)
  ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
  ctx.beginPath();
  ctx.roundRect(615, 145, 540, 410, 12);
  ctx.fill();
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.2)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Right Box Header
  ctx.fillStyle = '#34d399';
  ctx.font = '900 16px sans-serif';
  ctx.fillText('2. नियम व महत्वपूर्ण दिशा-निर्देश (RULES & TERMS)', 635, 178);

  const rules = [
    '१. अहस्तांतरणीय (Non-Transferable): यह 🆔 कार्ड केवल अधिकृत सदस्य हेतु वैध है।',
    '२. न्यूनतम निकासी सीमा: वॉलेट में न्यूनतम ₹100 होते ही UPI द्वारा बैंक ट्रांसफर संभव है।',
    '३. एकमुश्त शुल्क: ₹249 🆔 एक्टिवेशन शुल्क वन-टाइम एवं नॉन-रिफंडेबल है।',
    '४. रेफरल नीति: केवल अधिकृत सामग्री व सही जानकारी देकर ही नए सदस्यों को आमंत्रित करें।',
    '५. सुरक्षा व अनुशासन: भ्रामक UTR या गलत दावों की स्थिति में सदस्यता निरस्त हो जाएगी।',
    '६. सपोर्ट सुविधा: किसी भी तकनीकी समस्या हेतु 24x7 हेल्पलाइन व व्हाट्सएप उपलब्ध है।',
  ];

  let rightY = 210;
  rules.forEach((r) => {
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '500 12px sans-serif';
    ctx.fillText(r, 635, rightY);
    rightY += 30;
  });

  // Official Helpline Box inside Right Box
  ctx.fillStyle = 'rgba(245, 158, 11, 0.08)';
  ctx.beginPath();
  ctx.roundRect(635, 400, 500, 135, 8);
  ctx.fill();
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.25)';
  ctx.stroke();

  ctx.fillStyle = '#fef08a';
  ctx.font = '800 13px sans-serif';
  ctx.fillText('📞 आधिकारिक सपोर्ट हेल्पडेस्क (OFFICIAL HELPLINE):', 650, 425);
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '600 12px sans-serif';
  ctx.fillText('• 24x7 हेल्पलाइन / WhatsApp: +91 8877490845', 650, 450);
  ctx.fillText('• आधिकारिक ईमेल: santosh09patidar@gmail.com', 650, 472);
  ctx.fillText('• वेब पोर्टल: www.achieversclub.in | इंदौर, मध्य प्रदेश (452001)', 650, 494);
  ctx.fillText('• भारत सरकार एमएसमे पंजीकृत कम्युनिटी प्रोटोकॉल', 650, 516);

  // 5. Golden Hologram Seal & Signatory Box Bottom
  ctx.fillStyle = 'rgba(245, 158, 11, 0.08)';
  ctx.beginPath();
  ctx.roundRect(45, 570, 1110, 85, 10);
  ctx.fill();
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.25)';
  ctx.stroke();

  // Hologram circle
  ctx.beginPath();
  ctx.arc(95, 612, 32, 0, Math.PI * 2);
  ctx.fillStyle = '#f59e0b';
  ctx.fill();
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.fillStyle = '#0f172a';
  ctx.font = '900 10px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('LEGAL', 95, 608);
  ctx.fillText('VALID', 95, 622);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#fef3c7';
  ctx.font = '800 13px sans-serif';
  ctx.fillText('ACHIEVERS COMMUNITY VERIFIED LEGAL IDENTITY PROTOCOL', 145, 602);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 11.5px sans-serif';
  ctx.fillText('This document certifies valid active membership under SWIS & TWIS models with non-transferable rights.', 145, 624);

  // Signatory
  ctx.textAlign = 'right';
  ctx.fillStyle = '#f59e0b';
  ctx.font = 'italic 700 18px "Brush Script MT", cursive, sans-serif';
  ctx.fillText('Vikas Kumar', 1130, 602);
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(1020, 614);
  ctx.lineTo(1130, 614);
  ctx.stroke();
  ctx.fillStyle = '#94a3b8';
  ctx.font = '700 10.5px sans-serif';
  ctx.fillText('CHIEF COMMUNITY ADMINISTRATOR', 1130, 630);

  // 6. Bottom Banner / Motto
  ctx.fillStyle = '#f59e0b';
  ctx.font = '900 13px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('✦ START YOUNG, RETIRE YOUNG ✦ WWW.ACHIEVERSCLUB.IN ✦ SUPPORT: +91 8877490845', 600, 688);

  ctx.restore();
}

/**
 * Downloads Front Side HD PNG (1200 x 750)
 */
export async function downloadPremiumIdCard(member: Member): Promise<void> {
  if (member.id === 'mem-specimen-demo' || member.id === 'mem-001' || member.id === 'mem-002') {
    alert('⚠️ यह केवल एक नमूना (Sample Preview) कार्ड है। डाउनलोड केवल वास्तविक सत्यापित सदस्य के लिए उपलब्ध है।');
    return;
  }
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 750;
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
 * Downloads Back Side HD PNG (1200 x 750)
 */
export async function downloadPremiumIdCardBack(member: Member): Promise<void> {
  if (member.id === 'mem-specimen-demo' || member.id === 'mem-001' || member.id === 'mem-002') {
    alert('⚠️ यह केवल एक नमूना (Sample Preview) कार्ड है। डाउनलोड केवल वास्तविक सत्यापित सदस्य के लिए उपलब्ध है।');
    return;
  }
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 750;
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
  // 1240 width x 1600 height for complete 2-sided sheet
  canvas.width = 1240;
  canvas.height = 1600;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Background
  ctx.fillStyle = '#0a0f1d';
  ctx.fillRect(0, 0, 1240, 1600);

  // Sheet Header
  ctx.fillStyle = '#f59e0b';
  ctx.font = '900 24px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('ACHIEVERS CLUB COMMUNITY (ACC) • OFFICIAL STUDENT DIGITAL ID CARD', 620, 36);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 13px sans-serif';
  ctx.fillText(`MEMBER: ${member.fullName} | 🆔 ${member.accId} | TWO-SIDED PRINTING & LAMINATION SHEET`, 620, 56);

  // Draw Front Card at top (1200 x 750 centered at x=20, y=70)
  await drawIdCardFront(ctx, member, 20, 70);

  // Center Cut & Fold Guideline
  const lineY = 845;
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([8, 6]);
  ctx.beginPath();
  ctx.moveTo(20, lineY);
  ctx.lineTo(1220, lineY);
  ctx.stroke();
  ctx.setLineDash([]);

  // Scissors & Cut Label
  ctx.fillStyle = '#fbbf24';
  ctx.font = '800 13px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('✂------------- CUT & FOLD HERE FOR STANDARD PVC CARD / LAMINATION -------------✂', 620, lineY - 8);

  // Draw Back Card at bottom (1200 x 750 centered at x=20, y=865)
  await drawIdCardBack(ctx, member, 20, 865);

  // Footer Note
  ctx.fillStyle = '#64748b';
  ctx.font = '600 11px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Official Digital Identity of Achievers Club Community | Lifetime Validity | Verification: www.achieversclub.in', 620, 1630);

  const dataUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = `ACC_ID_CARD_COMPLETE_SHEET_${member.accId}.png`;
  link.href = dataUrl;
  link.click();
}
