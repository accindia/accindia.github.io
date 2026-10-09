import React, { useState, useEffect, useRef } from 'react';
import {
  Share2,
  Download,
  Printer,
  Copy,
  CheckCircle2,
  Check,
  Sparkles,
  Smartphone,
  QrCode,
  CreditCard,
  Building2,
  User,
  Phone,
  MessageCircle,
  MapPin,
  Mail,
  Award,
  Zap,
  ShieldCheck,
  Megaphone,
  Eye,
  Palette,
  RefreshCw,
  Star,
  Layers,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Image as ImageIcon,
  Sliders,
} from 'lucide-react';
import { Member } from '../types';
import { StorageService } from '../services/storage';

interface PromotionBrandingHubProps {
  currentUser: Member | null;
  referralSponsor?: Member | null;
  onGoToRegister: () => void;
  onGoToIdCard: () => void;
}

type BrandingType = 'visiting_card' | 'poster' | 'whatsapp_templates';
type CardTheme = 'airtel_mitra' | 'spice_money_gold' | 'jio_pos_blue' | 'fintech_emerald';
type PosterType = 'recharge_shop' | 'student_earn' | 'activation_249' | 'status_square';

export const PromotionBrandingHub: React.FC<PromotionBrandingHubProps> = ({
  currentUser,
  referralSponsor,
  onGoToRegister,
  onGoToIdCard,
}) => {
  const siteConfig = StorageService.getSiteConfig();

  // Detect active sponsor from URL or session storage if not logged in
  const detectedSponsorId = (() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      return p.get('sponsor') || p.get('ref') || sessionStorage.getItem('acc_active_sponsor_ref') || '';
    }
    return '';
  })();

  // Agent Customization Form State
  const [partnerId, setPartnerId] = useState<string>(
    currentUser?.accId || referralSponsor?.accId || detectedSponsorId || 'SWACCRA01'
  );
  const [partnerName, setPartnerName] = useState<string>(
    currentUser?.fullName || referralSponsor?.fullName || 'राहुल शर्मा'
  );
  const [partnerMobile, setPartnerMobile] = useState<string>(
    currentUser?.mobile || referralSponsor?.mobile || siteConfig.helplinePhone?.replace(/[^0-9]/g, '').slice(-10) || '8877490845'
  );
  const [partnerWhatsapp, setPartnerWhatsapp] = useState<string>(
    currentUser?.whatsapp || currentUser?.mobile || referralSponsor?.whatsapp || referralSponsor?.mobile || '8877490845'
  );
  const [partnerEmail, setPartnerEmail] = useState<string>(
    currentUser?.email || referralSponsor?.email || 'partner@achieversclub.in'
  );
  const [partnerCity, setPartnerCity] = useState<string>(
    currentUser?.city ? `${currentUser.city}, ${currentUser.state}` : referralSponsor?.city ? `${referralSponsor.city}, ${referralSponsor.state}` : 'इंदौर, मध्य प्रदेश'
  );
  const [shopName, setShopName] = useState<string>(
    'राहुल डिजिटल ऑनलाइन केंद्र'
  );
  const [customTagline, setCustomTagline] = useState<string>(
    'सभी मोबाइल & DTH रिचार्ज पर 3.30% फिक्स कैशबैक'
  );

  // Active Navigation & Themes
  const [activeTab, setActiveTab] = useState<BrandingType>('visiting_card');
  const [cardTheme, setCardTheme] = useState<CardTheme>('airtel_mitra');
  const [activePosterType, setActivePosterType] = useState<PosterType>('recharge_shop');

  // Action status indicators
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Canvas Refs for Rendering
  const cardCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const posterCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Base Website Referral URL
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://www.achieversclub.in';
  const cleanSponsorId = (partnerId || 'ACC249').trim().toUpperCase();
  const referralUrl = `${baseUrl}/?sponsor=${cleanSponsorId}`;

  // Keep state synced if user logs in
  useEffect(() => {
    if (currentUser) {
      setPartnerId(currentUser.accId);
      setPartnerName(currentUser.fullName);
      setPartnerMobile(currentUser.mobile);
      setPartnerWhatsapp(currentUser.whatsapp || currentUser.mobile);
      setPartnerEmail(currentUser.email);
      setPartnerCity(`${currentUser.city || 'शहर'}, ${currentUser.state || 'राज्य'}`);
    }
  }, [currentUser]);

  // QR Code URL via reliable high-speed QR rendering API
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
    referralUrl
  )}&margin=4&bgcolor=ffffff&color=000000`;

  // Handle Copy Referral Link
  const handleCopyReferralLink = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // WhatsApp Share Handler
  const handleShareToWhatsapp = (customMsg?: string) => {
    const textToShare =
      customMsg ||
      `🔥 *Achievers Club Community (ACC) - अधिकृत बिजनेस पार्टनर*\n\n` +
        `नमस्ते! मैं *${partnerName}* (ID: *${cleanSponsorId}*), Achievers Club का अधिकृत पार्टनर हूँ।\n\n` +
        `⚡ *हमारी प्रमुख सेवाएं व ऑफर:*\n` +
        `✓ सभी मोबाइल व DTH रिचार्ज पर *3.30% फिक्स्ड कमीशन*\n` +
        `✓ TWIS टीम रेफरल पर *₹150 डायरेक्ट पेआउट* सीधा बैंक/UPI में\n` +
        `✓ माता-पिता का UPI व बैंक खाता 100% मान्य\n` +
        `✓ प्रमाणित डिजिटल 🆔 कार्ड व लाइफटाइम सपोर्ट\n\n` +
        `👉 *मेरे साथ सीधे जॉइन करने के लिए नीचे दिए गए लिंक पर क्लिक करें:*\n` +
        `${referralUrl}\n\n` +
        `📞 *संपर्क / WhatsApp:* +91 ${partnerMobile}\n` +
        `_Start Young, Retire Young!_`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(textToShare)}`, '_blank');
  };

  // Web Share API fallback
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Achievers Club Community - ${partnerName}`,
          text: `जुड़ें Achievers Club Community से और पाएं 3.30% रिचार्ज कमीशन + ₹150 रेफरल बोनस। स्पॉन्सर: ${partnerName} (ID: ${cleanSponsorId})`,
          url: referralUrl,
        });
      } catch (e) {
        handleShareToWhatsapp();
      }
    } else {
      handleShareToWhatsapp();
    }
  };

  // 1-Click Print Handler
  const handlePrint = () => {
    window.print();
  };

  // Canvas Image Exporter for Crisp Offline PNG Download
  const handleDownloadCardImage = () => {
    setIsDownloading(true);
    const canvas = document.createElement('canvas');
    canvas.width = 1050; // Standard 3.5" x 2" at 300 DPI
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsDownloading(false);
      return;
    }

    // 1. Background Fill according to selected theme
    if (cardTheme === 'airtel_mitra') {
      // Royal Corporate Blue Gradient
      const grad = ctx.createLinearGradient(0, 0, 1050, 600);
      grad.addColorStop(0, '#1a4bb0');
      grad.addColorStop(0.5, '#2874f0');
      grad.addColorStop(1, '#0c2d7a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1050, 600);

      // Top Header White/Yellow Band
      ctx.fillStyle = '#ffe500';
      ctx.fillRect(0, 0, 1050, 16);
    } else if (cardTheme === 'spice_money_gold') {
      // Luxury Metallic Gold & Deep Navy
      const grad = ctx.createLinearGradient(0, 0, 1050, 600);
      grad.addColorStop(0, '#0c111d');
      grad.addColorStop(0.6, '#151c2e');
      grad.addColorStop(1, '#080c14');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1050, 600);

      // Gold Metallic Border
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 14;
      ctx.strokeRect(7, 7, 1036, 586);
    } else if (cardTheme === 'jio_pos_blue') {
      // Jio POS Lite Bright Blue
      const grad = ctx.createLinearGradient(0, 0, 1050, 600);
      grad.addColorStop(0, '#0057b8');
      grad.addColorStop(1, '#002f6c');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1050, 600);

      ctx.fillStyle = '#eb1c24'; // Red accent
      ctx.fillRect(0, 0, 1050, 16);
    } else {
      // Emerald FinTech
      const grad = ctx.createLinearGradient(0, 0, 1050, 600);
      grad.addColorStop(0, '#064e3b');
      grad.addColorStop(1, '#022c22');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1050, 600);

      ctx.fillStyle = '#10b981';
      ctx.fillRect(0, 0, 1050, 16);
    }

    // 2. Company Brand Logo & Header
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px "Segoe UI", Roboto, sans-serif';
    ctx.fillText('ACHIEVERS CLUB COMMUNITY', 50, 75);

    ctx.fillStyle = cardTheme === 'spice_money_gold' ? '#d4af37' : '#ffe500';
    ctx.font = 'bold 20px "Segoe UI", Roboto, sans-serif';
    ctx.fillText('★ OFFICIAL AUTHORIZED BUSINESS ASSOCIATE ★', 50, 110);

    // Subtle divider
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, 130);
    ctx.lineTo(1000, 130);
    ctx.stroke();

    // 3. Partner Name & Details
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 44px "Segoe UI", Roboto, sans-serif';
    ctx.fillText(partnerName, 50, 200);

    // Shop/Business Sub-Title
    ctx.fillStyle = cardTheme === 'spice_money_gold' ? '#fbbf24' : '#93c5fd';
    ctx.font = '600 24px "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`${shopName} • अधिकृत डिस्ट्रीब्यूटर`, 50, 240);

    // Unique Agent ID Box
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fillRect(50, 265, 380, 55);
    ctx.strokeStyle = cardTheme === 'spice_money_gold' ? '#d4af37' : '#ffe500';
    ctx.lineWidth = 2;
    ctx.strokeRect(50, 265, 380, 55);

    ctx.fillStyle = cardTheme === 'spice_money_gold' ? '#ffe500' : '#ffffff';
    ctx.font = 'bold 26px "Courier New", monospace';
    ctx.fillText(`AGENT 🆔: ${cleanSponsorId}`, 70, 303);

    // 4. Contact Details
    ctx.fillStyle = '#f1f5f9';
    ctx.font = '22px "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`📱 मोबाइल: +91 ${partnerMobile}`, 50, 365);
    ctx.fillText(`💬 WhatsApp: +91 ${partnerWhatsapp}`, 50, 405);
    ctx.fillText(`📍 शहर: ${partnerCity}`, 50, 445);
    ctx.fillText(`⚡ सेवा: 3.30% फिक्स्ड रिचार्ज + ₹150 रेफरल बोनस`, 50, 485);

    // 5. Load and Draw QR Code onto Canvas
    const qrImg = new Image();
    qrImg.crossOrigin = 'anonymous';
    qrImg.src = qrCodeImageUrl;
    qrImg.onload = () => {
      // Draw white card for QR
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(720, 160, 260, 320);
      ctx.drawImage(qrImg, 740, 180, 220, 220);

      // QR label
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 18px "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('स्कैन करके जॉइन करें', 850, 430);

      ctx.fillStyle = '#2874f0';
      ctx.font = 'bold 15px "Courier New", monospace';
      ctx.fillText(`ID: ${cleanSponsorId}`, 850, 455);
      ctx.textAlign = 'left';

      // 6. Footer Disclaimer & Trust Mark
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = '16px "Segoe UI", Roboto, sans-serif';
      ctx.fillText('✓ ISO 9001:2015 CERTIFIED • START YOUNG RETIRE YOUNG • WWW.ACHIEVERSCLUB.IN', 50, 555);

      // Trigger Instant Download
      const link = document.createElement('a');
      link.download = `ACC-Visiting-Card-${cleanSponsorId}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      setIsDownloading(false);
    };

    qrImg.onerror = () => {
      // Fallback without waiting for external QR
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(720, 160, 260, 320);
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 20px "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('ACC PARTNER QR', 850, 300);
      ctx.fillText(`ID: ${cleanSponsorId}`, 850, 340);
      ctx.textAlign = 'left';

      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = '16px "Segoe UI", Roboto, sans-serif';
      ctx.fillText('✓ ISO 9001:2015 CERTIFIED • START YOUNG RETIRE YOUNG • WWW.ACHIEVERSCLUB.IN', 50, 555);

      const link = document.createElement('a');
      link.download = `ACC-Visiting-Card-${cleanSponsorId}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      setIsDownloading(false);
    };
  };

  // Canvas Poster Exporter (1080x1350 HD Social Poster)
  const handleDownloadPosterImage = () => {
    setIsDownloading(true);
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1350; // Instagram portrait / WhatsApp status standard
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsDownloading(false);
      return;
    }

    // 1. Poster Gradient Background
    if (activePosterType === 'recharge_shop') {
      const grad = ctx.createLinearGradient(0, 0, 1080, 1350);
      grad.addColorStop(0, '#0a2540');
      grad.addColorStop(0.3, '#1c52b8');
      grad.addColorStop(0.7, '#2874f0');
      grad.addColorStop(1, '#0b1d3a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1080, 1350);
    } else if (activePosterType === 'student_earn') {
      const grad = ctx.createLinearGradient(0, 0, 1080, 1350);
      grad.addColorStop(0, '#312e81');
      grad.addColorStop(0.4, '#4338ca');
      grad.addColorStop(0.8, '#1e1b4b');
      grad.addColorStop(1, '#0f172a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1080, 1350);
    } else if (activePosterType === 'activation_249') {
      const grad = ctx.createLinearGradient(0, 0, 1080, 1350);
      grad.addColorStop(0, '#7c2d12');
      grad.addColorStop(0.35, '#ea580c');
      grad.addColorStop(0.7, '#c2410c');
      grad.addColorStop(1, '#431407');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1080, 1350);
    } else {
      const grad = ctx.createLinearGradient(0, 0, 1080, 1350);
      grad.addColorStop(0, '#042f2e');
      grad.addColorStop(0.5, '#0d9488');
      grad.addColorStop(1, '#115e59');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1080, 1350);
    }

    // 2. Decorative Top Ribbon
    ctx.fillStyle = '#ffe500';
    ctx.fillRect(0, 0, 1080, 24);

    // Header Branding
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 42px "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ACHIEVERS CLUB COMMUNITY (ACC)', 540, 95);

    ctx.fillStyle = '#ffe500';
    ctx.font = 'bold 24px "Segoe UI", Roboto, sans-serif';
    ctx.fillText('★ भारत का सबसे भरोसेमंद युवा अर्निंग एवं डिजिटल सेवा पोर्टल ★', 540, 140);

    // 3. Central Big Offer Box
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.fillRect(60, 180, 960, 480);
    ctx.strokeStyle = '#ffe500';
    ctx.lineWidth = 4;
    ctx.strokeRect(60, 180, 960, 480);

    if (activePosterType === 'recharge_shop') {
      ctx.fillStyle = '#ffe500';
      ctx.font = 'bold 54px "Segoe UI", Roboto, sans-serif';
      ctx.fillText('⚡ सभी मोबाइल व DTH रिचार्ज ⚡', 540, 260);

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 70px "Segoe UI", Roboto, sans-serif';
      ctx.fillText('3.30% फिक्स्ड कमीशन', 540, 345);

      ctx.fillStyle = '#93c5fd';
      ctx.font = 'bold 32px "Segoe UI", Roboto, sans-serif';
      ctx.fillText('JIO • AIRTEL • VI • BSNL • TATA PLAY • DISH TV', 540, 415);

      ctx.fillStyle = '#ffffff';
      ctx.font = '28px "Segoe UI", Roboto, sans-serif';
      ctx.fillText('✓ कोई अतिरिक्त सुविधा शुल्क नहीं (₹0 Platform Fee)', 540, 480);
      ctx.fillText('✓ तुरंत 1-सेकंड रिचार्ज डिलीवरी • 100% सक्सेस गारंटी', 540, 530);
      ctx.fillText('✓ घर बैठे अपने मोबाइल से रिचार्ज करवाएं या खुद करें', 540, 580);
    } else if (activePosterType === 'student_earn') {
      ctx.fillStyle = '#ffe500';
      ctx.font = 'bold 52px "Segoe UI", Roboto, sans-serif';
      ctx.fillText('🎓 कॉलेज व पढ़ाई के साथ कमाई 🎓', 540, 260);

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 68px "Segoe UI", Roboto, sans-serif';
      ctx.fillText('₹15,000 - ₹25,000 / महीना', 540, 345);

      ctx.fillStyle = '#93c5fd';
      ctx.font = 'bold 34px "Segoe UI", Roboto, sans-serif';
      ctx.fillText('TWIS टीम रेफरल: ₹150 प्रति दोस्त सीधा बैंक में', 540, 415);

      ctx.fillStyle = '#ffffff';
      ctx.font = '28px "Segoe UI", Roboto, sans-serif';
      ctx.fillText('✓ केवल 1-2 घंटे रोज स्मार्टफोन पर कार्य', 540, 480);
      ctx.fillText('✓ माता-पिता का बैंक / UPI खाता मान्य (पेरेंट्स सपोर्ट)', 540, 530);
      ctx.fillText('✓ लाइफटाइम डिजिटल 🆔 कार्ड व वीडियो ट्रेनिंग किट', 540, 580);
    } else {
      ctx.fillStyle = '#ffe500';
      ctx.font = 'bold 52px "Segoe UI", Roboto, sans-serif';
      ctx.fillText('🔥 ZERO INVESTMENT WORK 🔥', 540, 260);

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 68px "Segoe UI", Roboto, sans-serif';
      ctx.fillText('मात्र ₹249 लाइफटाइम 🆔 फीस', 540, 345);

      ctx.fillStyle = '#fed7aa';
      ctx.font = 'bold 34px "Segoe UI", Roboto, sans-serif';
      ctx.fillText('SWIS 3.30% रिचार्ज + TWIS ₹150 रेफरल बोनस', 540, 415);

      ctx.fillStyle = '#ffffff';
      ctx.font = '28px "Segoe UI", Roboto, sans-serif';
      ctx.fillText('✓ कोई लैपटॉप नहीं, केवल आपका मोबाइल फोन', 540, 480);
      ctx.fillText('✓ ऑफिशियल Real App APK डिलीवरी एक्सेस', 540, 530);
      ctx.fillText('✓ स्टार्ट यंग, रिटायर यंग - आज ही जुड़ें!', 540, 580);
    }

    // 4. Middle Trust Highlights
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px "Segoe UI", Roboto, sans-serif';
    ctx.fillText('🌟 अधिकृत पार्टनर द्वारा सत्यापित सेवा 🌟', 540, 720);

    // 5. Agent Footer Card (High Contrast White Card at bottom)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(60, 770, 960, 490);
    ctx.strokeStyle = '#2874f0';
    ctx.lineWidth = 6;
    ctx.strokeRect(60, 770, 960, 490);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 44px "Segoe UI", Roboto, sans-serif';
    ctx.fillText(partnerName, 100, 845);

    ctx.fillStyle = '#2563eb';
    ctx.font = 'bold 28px "Segoe UI", Roboto, sans-serif';
    ctx.fillText(shopName, 100, 895);

    // Agent ID badge
    ctx.fillStyle = '#eff6ff';
    ctx.fillRect(100, 925, 480, 60);
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 2;
    ctx.strokeRect(100, 925, 480, 60);

    ctx.fillStyle = '#1e40af';
    ctx.font = 'bold 30px "Courier New", monospace';
    ctx.fillText(`रेफरल 🆔: ${cleanSponsorId}`, 120, 968);

    ctx.fillStyle = '#334155';
    ctx.font = 'bold 28px "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`📞 कॉल: +91 ${partnerMobile}`, 100, 1040);
    ctx.fillText(`💬 WhatsApp: +91 ${partnerWhatsapp}`, 100, 1090);
    ctx.fillText(`📍 पता: ${partnerCity}`, 100, 1140);
    ctx.fillText(`🌐 लिंक: ${referralUrl}`, 100, 1190);

    // QR Image Load
    const qrImg = new Image();
    qrImg.crossOrigin = 'anonymous';
    qrImg.src = qrCodeImageUrl;
    qrImg.onload = () => {
      ctx.drawImage(qrImg, 670, 830, 310, 310);
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 22px "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('स्कैन करके तुरंत जुड़ें', 825, 1175);
      ctx.font = 'bold 18px "Courier New", monospace';
      ctx.fillText(`SPONSOR: ${cleanSponsorId}`, 825, 1205);

      const link = document.createElement('a');
      link.download = `ACC-Poster-${cleanSponsorId}-${activePosterType}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      setIsDownloading(false);
    };

    qrImg.onerror = () => {
      const link = document.createElement('a');
      link.download = `ACC-Poster-${cleanSponsorId}-${activePosterType}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      setIsDownloading(false);
    };
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn pb-12">
      {/* Hero Header Banner - Flipkart Royal Blue & Gold Style */}
      <div className="bg-gradient-to-r from-[#2874f0] via-[#1c52b8] to-[#124296] text-white p-5 sm:p-7 rounded-2xl shadow-md border border-blue-400/20 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-black text-[#ffe500] bg-blue-900/60 px-3 py-1 rounded-full border border-blue-400/30">
              <Megaphone className="w-3.5 h-3.5 text-[#ffe500]" />
              <span>ACC POSTER • अचीवर्स क्लब अधिकृत डिजिटल ब्रांडिंग किट</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black font-display text-white tracking-tight">
              आपका व्यक्तिगत प्रचार पोस्टर व विजिटिंग कार्ड हब
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed font-normal">
              अपनी स्पॉन्सर 🆔 (<strong className="text-[#ffe500] font-mono-acc">{cleanSponsorId}</strong>) और 
              दुकान/नाम के साथ हाई-डेफिनिशन <strong>विजिटिंग कार्ड</strong>, <strong>दुकान कैनोपी बैनर</strong> और <strong>सोशल मीडिया पोस्टर्स</strong> बनाएं 
              और 1-क्लिक में WhatsApp पर शेयर या डाउनलोड करें!
            </p>
          </div>

          {/* Quick Action Badges */}
          <div className="flex flex-wrap md:flex-col gap-2 shrink-0 w-full md:w-auto">
            <button
              onClick={handleCopyReferralLink}
              className="flex-1 md:flex-none px-4 py-2.5 bg-[#ffe500] hover:bg-yellow-400 text-[#212121] font-bold text-xs rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition"
            >
              {copiedLink ? <CheckCircle2 className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? 'रेफरल लिंक कॉपी हो गया!' : 'रेफरल लिंक कॉपी करें'}</span>
            </button>

            <button
              onClick={() => handleShareToWhatsapp()}
              className="flex-1 md:flex-none px-4 py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp पर शेयर करें</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="bg-white border border-gray-200 rounded-xl p-1.5 shadow-xs flex items-center gap-1 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('visiting_card')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
            activeTab === 'visiting_card'
              ? 'bg-[#2874f0] text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>1. मर्चेंट विजिटिंग कार्ड (Business Card)</span>
        </button>

        <button
          onClick={() => setActiveTab('poster')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
            activeTab === 'poster'
              ? 'bg-[#2874f0] text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>2. प्रचार पोस्टर्स व दुकान बैनर (Promo Posters)</span>
        </button>

        <button
          onClick={() => setActiveTab('whatsapp_templates')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
            activeTab === 'whatsapp_templates'
              ? 'bg-[#2874f0] text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          <span>3. रेडीमेड WhatsApp मैसेज व स्टेटस टेक्स्ट</span>
        </button>
      </div>

      {/* 2-COLUMN WORKSPACE: Real-time Editor Form on Left, Live Canvas/Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ========================================================================= */}
        {/* LEFT COLUMN: REAL-TIME DETAILS CUSTOMIZER FORM */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 bg-white border border-gray-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Sliders className="w-4 h-4 text-[#2874f0]" />
              <span>कस्टम विवरण दर्ज करें (Real-time Customizer)</span>
            </div>
            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              लाइव ऑटो-अपडेट ✓
            </span>
          </div>

          <div className="space-y-3 text-xs">
            {/* Sponsor ID Input */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                आपकी स्पॉन्सर 🆔 / एजेंट कोड (Sponsor ACC ID):
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={partnerId}
                  onChange={(e) => setPartnerId(e.target.value.toUpperCase())}
                  placeholder="उदा. SWACCRA01 या ACC249SWISRK01"
                  className="w-full bg-slate-50 border border-gray-300 rounded-lg px-3 py-2 text-xs font-mono font-black text-[#2874f0] uppercase focus:bg-white focus:outline-none focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0]"
                />
              </div>
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                QR कोड व रेफरल लिंक इसी स्पॉन्सर 🆔 से ऑटो-कनेक्ट होंगे।
              </span>
            </div>

            {/* Partner Name & Shop Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  आपका नाम (Partner Name):
                </label>
                <input
                  type="text"
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  placeholder="उदा. राहुल शर्मा"
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#2874f0]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  दुकान / केंद्र का नाम (Shop/Center):
                </label>
                <input
                  type="text"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  placeholder="उदा. राहुल डिजिटल ऑनलाइन सेवा"
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#2874f0]"
                />
              </div>
            </div>

            {/* Mobile & WhatsApp Numbers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  मोबाइल नंबर (Mobile No):
                </label>
                <input
                  type="text"
                  value={partnerMobile}
                  onChange={(e) => setPartnerMobile(e.target.value)}
                  placeholder="8877490845"
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-[#2874f0]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  WhatsApp नंबर:
                </label>
                <input
                  type="text"
                  value={partnerWhatsapp}
                  onChange={(e) => setPartnerWhatsapp(e.target.value)}
                  placeholder="8877490845"
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-[#2874f0]"
                />
              </div>
            </div>

            {/* City & Address */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                शहर व राज्य (City, State):
              </label>
              <input
                type="text"
                value={partnerCity}
                onChange={(e) => setPartnerCity(e.target.value)}
                placeholder="उदा. इंदौर, मध्य प्रदेश"
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#2874f0]"
              />
            </div>

            {/* Visiting Card Theme Selector */}
            {activeTab === 'visiting_card' && (
              <div className="pt-2 border-t border-gray-100">
                <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-[#2874f0]" />
                  <span>विजिटिंग कार्ड थीम चुनें (Style Selector):</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCardTheme('airtel_mitra')}
                    className={`p-2 rounded-lg text-left border text-[11px] font-bold flex items-center gap-2 transition ${
                      cardTheme === 'airtel_mitra'
                        ? 'border-[#2874f0] bg-blue-50/70 text-[#2874f0] ring-1 ring-[#2874f0]'
                        : 'border-gray-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full bg-[#2874f0] shrink-0" />
                    <span>ACC Poster Royal Blue</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCardTheme('spice_money_gold')}
                    className={`p-2 rounded-lg text-left border text-[11px] font-bold flex items-center gap-2 transition ${
                      cardTheme === 'spice_money_gold'
                        ? 'border-amber-500 bg-amber-50/70 text-amber-900 ring-1 ring-amber-500'
                        : 'border-gray-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full bg-[#d4af37] shrink-0" />
                    <span>ACC Poster Gold Elite</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCardTheme('jio_pos_blue')}
                    className={`p-2 rounded-lg text-left border text-[11px] font-bold flex items-center gap-2 transition ${
                      cardTheme === 'jio_pos_blue'
                        ? 'border-blue-600 bg-blue-50/70 text-blue-800 ring-1 ring-blue-600'
                        : 'border-gray-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full bg-[#0057b8] shrink-0" />
                    <span>ACC Poster Classic Blue</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCardTheme('fintech_emerald')}
                    className={`p-2 rounded-lg text-left border text-[11px] font-bold flex items-center gap-2 transition ${
                      cardTheme === 'fintech_emerald'
                        ? 'border-emerald-500 bg-emerald-50/70 text-emerald-900 ring-1 ring-emerald-500'
                        : 'border-gray-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full bg-emerald-600 shrink-0" />
                    <span>ACC Poster Emerald Modern</span>
                  </button>
                </div>
              </div>
            )}

            {/* Poster Type Selector */}
            {activeTab === 'poster' && (
              <div className="pt-2 border-t border-gray-100">
                <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-orange-600" />
                  <span>प्रमोशन पोस्टर प्रकार चुनें:</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setActivePosterType('recharge_shop')}
                    className={`p-2 rounded-lg text-left border text-[11px] font-bold flex items-center gap-2 transition ${
                      activePosterType === 'recharge_shop'
                        ? 'border-[#2874f0] bg-blue-50 text-[#2874f0] ring-1 ring-[#2874f0]'
                        : 'border-gray-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>1. ऑल-इन-वन रिचार्ज शॉप पोस्टर</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActivePosterType('student_earn')}
                    className={`p-2 rounded-lg text-left border text-[11px] font-bold flex items-center gap-2 transition ${
                      activePosterType === 'student_earn'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600'
                        : 'border-gray-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Award className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>2. कॉलेज स्टूडेंट वर्क-फ्रॉम-होम</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActivePosterType('activation_249')}
                    className={`p-2 rounded-lg text-left border text-[11px] font-bold flex items-center gap-2 transition ${
                      activePosterType === 'activation_249'
                        ? 'border-orange-600 bg-orange-50 text-orange-700 ring-1 ring-orange-600'
                        : 'border-gray-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                    <span>3. ₹249 डिजिटल बिजनेस किट ऑफर</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActivePosterType('status_square')}
                    className={`p-2 rounded-lg text-left border text-[11px] font-bold flex items-center gap-2 transition ${
                      activePosterType === 'status_square'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-600'
                        : 'border-gray-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>4. WhatsApp स्टेटस 1:1 स्क्वायर</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Share Link Box */}
          <div className="bg-slate-50 p-3 rounded-xl border border-gray-200 space-y-1.5 text-xs">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">
              आपका आधिकारिक रेफरल जॉइनिंग लिंक:
            </span>
            <div className="flex items-center justify-between gap-1 bg-white p-2 rounded-lg border border-gray-200">
              <span className="font-mono text-[11px] text-[#2874f0] font-bold truncate max-w-[220px]">
                {referralUrl}
              </span>
              <button
                type="button"
                onClick={handleCopyReferralLink}
                className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-[#2874f0] font-bold text-[10px] rounded transition shrink-0"
              >
                {copiedLink ? 'कॉपी हो गया' : 'कॉपी'}
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: LIVE HD VISUAL PREVIEW & INSTANT ACTION ENGINE */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 space-y-5">
          {/* TAB 1: VISITING CARD VISUAL PREVIEW */}
          {activeTab === 'visiting_card' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#2874f0]" />
                    <span>मर्चेंट विजिटिंग कार्ड (Live HD Specimen)</span>
                  </h3>
                  <span className="text-xs text-slate-500">
                    ACC पोस्टर स्टाइल में स्टैंडर्ड 3.5" x 2" रेशियो
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleDownloadCardImage}
                    disabled={isDownloading}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-1.5 transition disabled:opacity-50"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isDownloading ? 'तैयार हो रहा है...' : 'कार्ड डाउनलोड (PNG)'}</span>
                  </button>
                  <button
                    onClick={() => handleShareToWhatsapp()}
                    className="px-3.5 py-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-1.5 transition"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">WhatsApp शेयर</span>
                  </button>
                </div>
              </div>

              {/* CARD PREVIEW CONTAINER */}
              <div className="p-3 sm:p-5 bg-slate-200/60 rounded-2xl border border-gray-300 flex items-center justify-center">
                <div
                  className={`w-full max-w-[620px] aspect-[1.75/1] rounded-2xl p-4 sm:p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between text-white transition-all ${
                    cardTheme === 'airtel_mitra'
                      ? 'bg-gradient-to-br from-[#1a4bb0] via-[#2874f0] to-[#0c2d7a] border-2 border-blue-300/40'
                      : cardTheme === 'spice_money_gold'
                      ? 'bg-gradient-to-br from-[#0c111d] via-[#151c2e] to-[#080c14] border-4 border-[#d4af37] shadow-amber-900/20'
                      : cardTheme === 'jio_pos_blue'
                      ? 'bg-gradient-to-br from-[#0057b8] via-[#00479e] to-[#002f6c] border-2 border-blue-400/50'
                      : 'bg-gradient-to-br from-[#064e3b] via-[#047857] to-[#022c22] border-2 border-emerald-400/40'
                  }`}
                >
                  {/* Top Header Row */}
                  <div className="flex items-center justify-between border-b border-white/20 pb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#ffe500] text-[#2874f0] flex items-center justify-center font-black text-xs shadow-xs">
                        ACC
                      </div>
                      <div>
                        <span className="font-black text-xs sm:text-sm tracking-tight text-white block leading-tight">
                          ACHIEVERS CLUB COMMUNITY
                        </span>
                        <span className={`text-[9px] sm:text-[10px] font-bold block ${
                          cardTheme === 'spice_money_gold' ? 'text-[#d4af37]' : 'text-[#ffe500]'
                        }`}>
                          ★ OFFICIAL BUSINESS ASSOCIATE PARTNER ★
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[9px] sm:text-[10px] bg-white/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider block">
                        ISO 9001:2015 ✓
                      </span>
                    </div>
                  </div>

                  {/* Middle Content: Partner Details & Live QR */}
                  <div className="grid grid-cols-12 gap-3 items-center my-auto py-1">
                    {/* Left details (8 cols) */}
                    <div className="col-span-8 space-y-1.5 min-w-0">
                      <div>
                        <h4 className="font-black text-lg sm:text-2xl text-white tracking-tight truncate drop-shadow-xs">
                          {partnerName}
                        </h4>
                        <p className={`text-[11px] sm:text-xs font-semibold truncate ${
                          cardTheme === 'spice_money_gold' ? 'text-amber-300' : 'text-blue-200'
                        }`}>
                          {shopName} • अधिकृत डिस्ट्रीब्यूटर
                        </p>
                      </div>

                      {/* Sponsor ID Badge */}
                      <div className="inline-flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded border border-white/30 text-white font-mono font-bold text-xs">
                        <span className="text-[10px] text-yellow-300">AGENT 🆔:</span>
                        <span className="tracking-wider">{cleanSponsorId}</span>
                      </div>

                      {/* Contacts list */}
                      <div className="space-y-0.5 text-[10px] sm:text-[11px] text-slate-100 font-medium pt-1">
                        <p className="flex items-center gap-1.5 truncate">
                          <Phone className="w-3 h-3 text-[#ffe500] shrink-0" />
                          <span>+91 {partnerMobile}</span>
                        </p>
                        <p className="flex items-center gap-1.5 truncate">
                          <MessageCircle className="w-3 h-3 text-[#25D366] shrink-0" />
                          <span>WhatsApp: +91 {partnerWhatsapp}</span>
                        </p>
                        <p className="flex items-center gap-1.5 truncate">
                          <MapPin className="w-3 h-3 text-rose-300 shrink-0" />
                          <span>{partnerCity}</span>
                        </p>
                      </div>
                    </div>

                    {/* Right side: Live Dynamic QR code (4 cols) */}
                    <div className="col-span-4 flex flex-col items-center justify-center text-center">
                      <div className="bg-white p-1.5 rounded-xl shadow-lg border border-white/60">
                        <img
                          src={qrCodeImageUrl}
                          alt="Referral QR"
                          className="w-20 h-20 sm:w-28 sm:h-28 object-contain"
                        />
                      </div>
                      <span className="text-[9px] sm:text-[10px] font-bold text-white mt-1 leading-tight block">
                        स्कैन करके सीधे जॉइन करें
                      </span>
                    </div>
                  </div>

                  {/* Bottom Footer Row */}
                  <div className="border-t border-white/20 pt-1.5 flex items-center justify-between text-[9px] sm:text-[10px] text-blue-100 font-semibold">
                    <span>⚡ SWIS 3.30% रिचार्ज • 👥 TWIS ₹150 रेफरल</span>
                    <span className="font-mono text-white">WWW.ACHIEVERSCLUB.IN</span>
                  </div>
                </div>
              </div>

              {/* Action Toolbar Below Card */}
              <div className="bg-white p-3.5 rounded-xl border border-gray-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>300 DPI प्रिंटेबल बिजनेस कार्ड रेडी • 100% ओरिजिनल</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrint}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg border border-gray-300 flex items-center gap-1 transition"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>प्रिंट करें</span>
                  </button>
                  <button
                    onClick={handleDownloadCardImage}
                    className="px-4 py-1.5 bg-[#2874f0] hover:bg-[#1258c7] text-white font-bold rounded-lg shadow-sm flex items-center gap-1 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>डाउनलोड (PNG)</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROMOTIONAL POSTERS VISUAL PREVIEW */}
          {activeTab === 'poster' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-orange-600" />
                    <span>प्रचार पोस्टर प्रिव्यू (ACC Poster & Shop Canopy)</span>
                  </h3>
                  <span className="text-xs text-slate-500">
                    आपकी दुकान, सोशल मीडिया व WhatsApp स्टेटस पर शेयर करने के लिए रेडी
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleDownloadPosterImage}
                    disabled={isDownloading}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-1.5 transition disabled:opacity-50"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isDownloading ? 'तैयार हो रहा है...' : 'पोस्टर डाउनलोड (PNG)'}</span>
                  </button>
                  <button
                    onClick={() => handleShareToWhatsapp()}
                    className="px-3.5 py-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-1.5 transition"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp स्टेटस शेयर</span>
                  </button>
                </div>
              </div>

              {/* POSTER PREVIEW CARD */}
              <div className="p-4 sm:p-6 bg-slate-200/60 rounded-2xl border border-gray-300 flex items-center justify-center">
                <div
                  className={`w-full max-w-[560px] rounded-2xl p-5 sm:p-7 shadow-2xl relative overflow-hidden flex flex-col justify-between text-white border-4 border-yellow-400 ${
                    activePosterType === 'recharge_shop'
                      ? 'bg-gradient-to-b from-[#0a2540] via-[#1c52b8] to-[#0b1d3a]'
                      : activePosterType === 'student_earn'
                      ? 'bg-gradient-to-b from-[#312e81] via-[#4338ca] to-[#0f172a]'
                      : activePosterType === 'activation_249'
                      ? 'bg-gradient-to-b from-[#7c2d12] via-[#ea580c] to-[#431407]'
                      : 'bg-gradient-to-b from-[#042f2e] via-[#0d9488] to-[#115e59]'
                  }`}
                >
                  {/* Poster Header */}
                  <div className="text-center space-y-1 border-b border-white/20 pb-3">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-yellow-400 text-slate-900 px-3 py-0.5 rounded-full inline-block">
                      ★ भारत सरकार मान्यता प्राप्त MSME पार्टनर ★
                    </span>
                    <h3 className="text-lg sm:text-2xl font-black text-white">
                      ACHIEVERS CLUB COMMUNITY
                    </h3>
                  </div>

                  {/* Main Poster Content Banner */}
                  <div className="my-5 p-4 sm:p-5 bg-white/10 backdrop-blur-xs rounded-xl border-2 border-yellow-300 text-center space-y-3">
                    {activePosterType === 'recharge_shop' ? (
                      <>
                        <span className="text-xs sm:text-sm font-extrabold text-yellow-300 block">
                          ⚡ यहाँ सभी मोबाइल व DTH रिचार्ज उपलब्ध हैं ⚡
                        </span>
                        <h2 className="text-2xl sm:text-4xl font-black text-white drop-shadow-md">
                          3.30% फिक्स्ड कमीशन
                        </h2>
                        <div className="bg-black/30 p-2 rounded-lg text-xs font-bold text-blue-100 flex flex-wrap items-center justify-center gap-2">
                          <span>Jio</span> • <span>Airtel</span> • <span>Vi</span> • <span>BSNL</span> • <span>Tata Play</span> • <span>Dish TV</span>
                        </div>
                        <p className="text-[11px] sm:text-xs text-slate-100 font-medium">
                          ✓ ₹0 अतिरिक्त शुल्क • 1 सेकंड में सुपरफास्ट रिचार्ज • 100% पक्की रसीद
                        </p>
                      </>
                    ) : activePosterType === 'student_earn' ? (
                      <>
                        <span className="text-xs sm:text-sm font-extrabold text-yellow-300 block">
                          🎓 कॉलेज व पढ़ाई के साथ घर बैठे कमाई 🎓
                        </span>
                        <h2 className="text-2xl sm:text-4xl font-black text-white drop-shadow-md">
                          ₹15,000 - ₹25,000 / महीना
                        </h2>
                        <div className="bg-black/30 p-2 rounded-lg text-xs font-bold text-blue-100">
                          TWIS डायरेक्ट रेफरल: प्रति दोस्त ₹150 सीधा बैंक / UPI में
                        </div>
                        <p className="text-[11px] sm:text-xs text-slate-100 font-medium">
                          ✓ कोई लैपटॉप नहीं, केवल मोबाइल फोन • माता-पिता का UPI मान्य
                        </p>
                      </>
                    ) : (
                      <>
                        <span className="text-xs sm:text-sm font-extrabold text-yellow-300 block">
                          🔥 ZERO INVESTMENT WORK OFFER 🔥
                        </span>
                        <h2 className="text-2xl sm:text-4xl font-black text-white drop-shadow-md">
                          मात्र ₹249 लाइफटाइम एक्टिवेशन
                        </h2>
                        <div className="bg-black/30 p-2 rounded-lg text-xs font-bold text-amber-100">
                          SWIS 3.30% रिचार्ज + TWIS ₹150 रेफरल + प्रमाणित डिजिटल 🆔 कार्ड
                        </div>
                        <p className="text-[11px] sm:text-xs text-slate-100 font-medium">
                          ✓ अधिकृत Android APK लिंक • लाइफटाइम फ्री ट्रेनिंग किट
                        </p>
                      </>
                    )}
                  </div>

                  {/* Agent Identification Footer Box */}
                  <div className="bg-white text-slate-900 rounded-xl p-3.5 sm:p-4 shadow-xl border-2 border-[#2874f0] flex items-center justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">
                        अधिकृत पार्टनर संपर्क विवरण:
                      </span>
                      <h4 className="font-black text-sm sm:text-lg text-slate-900 truncate">
                        {partnerName}
                      </h4>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] bg-blue-100 text-[#2874f0] font-mono font-bold px-2 py-0.5 rounded">
                          🆔 {cleanSponsorId}
                        </span>
                        <span className="text-[10px] font-bold text-slate-700">
                          📞 {partnerMobile}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 truncate">
                        📍 {partnerCity}
                      </p>
                    </div>

                    {/* QR Code */}
                    <div className="shrink-0 text-center">
                      <img
                        src={qrCodeImageUrl}
                        alt="QR Code"
                        className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded border border-gray-200"
                      />
                      <span className="text-[9px] font-bold text-[#2874f0] block mt-0.5">
                        स्कैन करके जुड़ें
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="bg-white p-3.5 rounded-xl border border-gray-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <Sparkles className="w-4 h-4 text-orange-600" />
                  <span>दुकान कैनोपी, फ्लेक्स प्रिंटिंग व WhatsApp स्टेटस हेतु उत्तम</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadPosterImage}
                    className="px-4 py-1.5 bg-[#fb641b] hover:bg-[#e85a14] text-white font-bold rounded-lg shadow-sm flex items-center gap-1 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>पोस्टर डाउनलोड (PNG)</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: READYMADE WHATSAPP TEMPLATES */}
          {activeTab === 'whatsapp_templates' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>रेडीमेड WhatsApp मैसेज व स्टेटस इनविटेशन</span>
                  </h3>
                  <span className="text-xs text-slate-500">
                    आपकी स्पॉन्सर 🆔 और इनविटेशन लिंक के साथ तैयार 1-क्लिक शेयर मैसेज
                  </span>
                </div>
              </div>

              {/* TEMPLATE 1: Recharge Cashback Message */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-2 shadow-xs">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>टेम्पलेट 1: 3.30% रिचार्ज बचत व इनकम मैसेज</span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        const msg = `⚡ *सभी मोबाइल & DTH रिचार्ज पर 3.30% फिक्स्ड कमीशन पाएं!*\n\nक्या आप Google Pay, PhonePe पर ₹2-₹3 एक्स्ट्रा प्लेटफॉर्म फीस देकर थक चुके हैं?\nAchievers Club Community (ACC) में पाएँ:\n✓ हर Jio, Airtel, Vi, BSNL रिचार्ज पर 3.30% पक्की बचत\n✓ कोई एक्स्ट्रा चार्ज नहीं\n\n👉 मेरे लिंक से अभी शुरू करें:\n${referralUrl}\nस्पॉन्सर 🆔: *${cleanSponsorId}*\nसंपर्क: *${partnerName}* (Mob: ${partnerMobile})`;
                        navigator.clipboard.writeText(msg);
                        setCopiedText(true);
                        setTimeout(() => setCopiedText(false), 2000);
                      }}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] rounded"
                    >
                      {copiedText ? 'कॉपी हो गया' : 'कॉपी करें'}
                    </button>
                    <button
                      onClick={() => {
                        const msg = `⚡ *सभी मोबाइल & DTH रिचार्ज पर 3.30% फिक्स्ड कमीशन पाएं!*\n\nक्या आप Google Pay, PhonePe पर ₹2-₹3 एक्स्ट्रा प्लेटफॉर्म फीस देकर थक चुके हैं?\nAchievers Club Community (ACC) में पाएँ:\n✓ हर Jio, Airtel, Vi, BSNL रिचार्ज पर 3.30% पक्की बचत\n✓ कोई एक्स्ट्रा चार्ज नहीं\n\n👉 मेरे लिंक से अभी शुरू करें:\n${referralUrl}\nस्पॉन्सर 🆔: *${cleanSponsorId}*\nसंपर्क: *${partnerName}* (Mob: ${partnerMobile})`;
                        handleShareToWhatsapp(msg);
                      }}
                      className="px-2.5 py-1 bg-[#25D366] text-white font-bold text-[10px] rounded flex items-center gap-1"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>WhatsApp भेजें</span>
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg font-sans whitespace-pre-line leading-relaxed">
                  {`⚡ सभी मोबाइल & DTH रिचार्ज पर 3.30% फिक्स्ड कमीशन पाएं!\n\nक्या आप Google Pay, PhonePe पर ₹2-₹3 एक्स्ट्रा प्लेटफॉर्म फीस देकर थक चुके हैं?\nAchievers Club Community (ACC) में पाएँ:\n✓ हर Jio, Airtel, Vi, BSNL रिचार्ज पर 3.30% पक्की बचत\n✓ कोई एक्स्ट्रा चार्ज नहीं\n\n👉 मेरे लिंक से अभी शुरू करें:\n${referralUrl}\nस्पॉन्सर 🆔: ${cleanSponsorId}\nसंपर्क: ${partnerName} (Mob: ${partnerMobile})`}
                </p>
              </div>

              {/* TEMPLATE 2: Student Pocket Money Invitation */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-2 shadow-xs">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-indigo-600" />
                    <span>टेम्पलेट 2: कॉलेज स्टूडेंट पॉकेट मनी इनविटेशन</span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        const msg = `🎓 *कॉलेज व पढ़ाई के साथ रोज ₹500 - ₹1500 कमाएं!*\n\nनमस्ते दोस्त! Achievers Club Community (ACC) में छात्र अपने स्मार्टफोन से घर बैठे कमा रहे हैं:\n✓ TWIS रेफरल पर ₹150 डायरेक्ट पेआउट (Daily Payout)\n✓ माता-पिता का UPI व बैंक खाता मान्य\n✓ मात्र ₹249 एक बार का एक्टिवेशन चार्ज\n\n👉 तुरंत रजिस्टर करें:\n${referralUrl}\nरेफरल कोड: *${cleanSponsorId}*\nगाइडेंस के लिए संपर्क करें: *${partnerName}* (+91 ${partnerMobile})`;
                        navigator.clipboard.writeText(msg);
                        setCopiedText(true);
                        setTimeout(() => setCopiedText(false), 2000);
                      }}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] rounded"
                    >
                      {copiedText ? 'कॉपी हो गया' : 'कॉपी करें'}
                    </button>
                    <button
                      onClick={() => {
                        const msg = `🎓 *कॉलेज व पढ़ाई के साथ रोज ₹500 - ₹1500 कमाएं!*\n\nनमस्ते दोस्त! Achievers Club Community (ACC) में छात्र अपने स्मार्टफोन से घर बैठे कमा रहे हैं:\n✓ TWIS रेफरल पर ₹150 डायरेक्ट पेआउट (Daily Payout)\n✓ माता-पिता का UPI व बैंक खाता मान्य\n✓ मात्र ₹249 एक बार का एक्टिवेशन चार्ज\n\n👉 तुरंत रजिस्टर करें:\n${referralUrl}\nरेफरल कोड: *${cleanSponsorId}*\nगाइडेंस के लिए संपर्क करें: *${partnerName}* (+91 ${partnerMobile})`;
                        handleShareToWhatsapp(msg);
                      }}
                      className="px-2.5 py-1 bg-[#25D366] text-white font-bold text-[10px] rounded flex items-center gap-1"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>WhatsApp भेजें</span>
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg font-sans whitespace-pre-line leading-relaxed">
                  {`🎓 कॉलेज व पढ़ाई के साथ रोज ₹500 - ₹1500 कमाएं!\n\nनमस्ते दोस्त! Achievers Club Community (ACC) में छात्र अपने स्मार्टफोन से घर बैठे कमा रहे हैं:\n✓ TWIS रेफरल पर ₹150 डायरेक्ट पेआउट (Daily Payout)\n✓ माता-पिता का UPI व बैंक खाता मान्य\n✓ मात्र ₹249 एक बार का एक्टिवेशन चार्ज\n\n👉 तुरंत रजिस्टर करें:\n${referralUrl}\nरेफरल कोड: ${cleanSponsorId}\nगाइडेंस के लिए संपर्क करें: ${partnerName} (+91 ${partnerMobile})`}
                </p>
              </div>

              {/* TEMPLATE 3: WhatsApp Status 1-Liner */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-2 shadow-xs">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>टेम्पलेट 3: WhatsApp स्टेटस 1-लाइनर कैप्शन</span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        const msg = `🔥 Start Young, Retire Young! मोबाइल से 3.30% रिचार्ज कमीशन + ₹150 रेफरल बोनस कमाने के लिए अभी जॉइन करें: ${referralUrl} (ID: ${cleanSponsorId})`;
                        navigator.clipboard.writeText(msg);
                        setCopiedText(true);
                        setTimeout(() => setCopiedText(false), 2000);
                      }}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] rounded"
                    >
                      {copiedText ? 'कॉपी हो गया' : 'कॉपी करें'}
                    </button>
                    <button
                      onClick={() => {
                        const msg = `🔥 Start Young, Retire Young! मोबाइल से 3.30% रिचार्ज कमीशन + ₹150 रेफरल बोनस कमाने के लिए अभी जॉइन करें: ${referralUrl} (ID: ${cleanSponsorId})`;
                        handleShareToWhatsapp(msg);
                      }}
                      className="px-2.5 py-1 bg-[#25D366] text-white font-bold text-[10px] rounded flex items-center gap-1"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>WhatsApp स्टेटस</span>
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg font-sans leading-relaxed">
                  {`🔥 Start Young, Retire Young! मोबाइल से 3.30% रिचार्ज कमीशन + ₹150 रेफरल बोनस कमाने के लिए अभी जॉइन करें: ${referralUrl} (ID: ${cleanSponsorId})`}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
