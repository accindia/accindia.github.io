import { Member } from '../types';

export async function downloadPremiumIdCard(member: Member): Promise<void> {
  const canvas = document.createElement('canvas');
  // High resolution 1200 x 750 for crisp printing / phone gallery
  canvas.width = 1200;
  canvas.height = 750;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

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

  // 4. Middle Section: Student Photo + Details + Seal
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
        ctx.roundRect(57, 177, 186, 226, 14);
        ctx.clip();
        ctx.drawImage(avatarImg, 57, 177, 186, 226);
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

  // Profile Link if available
  if (member.profileLink) {
    ctx.fillStyle = '#fbbf24';
    ctx.font = '700 12px sans-serif';
    ctx.fillText('PROFILE LINK: ' + member.profileLink.replace(/^https?:\/\//, ''), 280, 492);
  }

  // Right Column: Official QR Code Box
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(870, 175, 240, 240, 16);
  ctx.fill();
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  let qrDrawn = false;
  if (member.personalQrUrl) {
    try {
      const qrImg = await loadImage(member.personalQrUrl);
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
  }

  if (!qrDrawn) {
    // QR Code placeholder / verification pattern
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(900, 205, 180, 180);
    ctx.fillStyle = '#ffffff';
    // Inner matrix pattern
    ctx.fillRect(915, 220, 45, 45);
    ctx.fillRect(1020, 220, 45, 45);
    ctx.fillRect(915, 325, 45, 45);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(925, 230, 25, 25);
    ctx.fillRect(1030, 230, 25, 25);
    ctx.fillRect(925, 335, 25, 25);
    // Center ACC mini emblem in QR
    ctx.fillStyle = '#2563eb';
    ctx.beginPath();
    ctx.roundRect(970, 275, 40, 40, 8);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ACC', 990, 300);

    ctx.fillStyle = '#0f172a';
    ctx.font = '800 11px sans-serif';
    ctx.fillText('SCAN TO VERIFY 🆔', 990, 403);
  }

  // 5. Golden Hologram Seal & Signatory Box
  ctx.fillStyle = 'rgba(245, 158, 11, 0.08)';
  ctx.beginPath();
  ctx.roundRect(55, 510, 1055, 120, 14);
  ctx.fill();
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.3)';
  ctx.stroke();

  // Hologram circle
  ctx.beginPath();
  ctx.arc(120, 570, 42, 0, Math.PI * 2);
  ctx.fillStyle = '#f59e0b';
  ctx.fill();
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = '#0f172a';
  ctx.font = '900 11px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('OFFICIAL', 120, 563);
  ctx.fillText('SEAL', 120, 578);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#fef3c7';
  ctx.font = '800 14px sans-serif';
  ctx.fillText('ACHIEVERS CLUB COMMUNITY VERIFICATION PROTOCOL', 185, 550);
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '500 12px sans-serif';
  ctx.fillText('This digital ID is authentic and certifies member status in ACC SWIS & TWIS systems.', 185, 572);
  ctx.fillText('Issued by Central Administration • Non-transferable • Lifetime Validity', 185, 592);

  // Signatory
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

  // 6. Bottom Banner / Motto
  ctx.fillStyle = '#f59e0b';
  ctx.font = '900 14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('✦ START YOUNG, RETIRE YOUNG ✦ WWW.ACHIEVERSCLUB.IN ✦ SUPPORT: +91 8877490845', 600, 680);

  // Trigger Download as PNG
  const dataUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = `ACC_PREMIUM_ID_CARD_${member.accId}.png`;
  link.href = dataUrl;
  link.click();
}
