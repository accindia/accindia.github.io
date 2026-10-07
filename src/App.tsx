import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { WindowFrame } from './components/WindowFrame';
import { HomeView } from './components/HomeView';
import { RegistrationModal } from './components/RegistrationModal';
import { LoginModal } from './components/LoginModal';
import { VideoTrainingModal } from './components/VideoTrainingModal';
import { UserDashboard } from './components/UserDashboard';
import { DigitalIdCard } from './components/DigitalIdCard';
import { CommissionCalculator } from './components/CommissionCalculator';
import { AdminPanel } from './components/AdminPanel';
import { LegalPages } from './components/LegalPages';
import { StudentPortalGate } from './components/StudentPortalGate';
import { ActiveWindow, Member, SiteConfig } from './types';
import { StorageService, subscribeToSync } from './services/storage';
import { FirestoreService } from './services/firestore';
import {
  FileText,
  Video,
  CreditCard,
  LayoutDashboard,
  ShieldCheck,
  Calculator,
  Phone,
  Sparkles,
  MessageCircle,
  ExternalLink,
  Info,
  Building2,
  Lock,
} from 'lucide-react';

export default function App() {
  const [activeWindow, setActiveWindow] = useState<ActiveWindow>('home');
  const [currentUser, setCurrentUser] = useState<Member | null>(null);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => StorageService.getSiteConfig());

  // Load initial user & subscribe to sync across tabs/windows & Firestore multi-device
  useEffect(() => {
    // 1. Initial background sync with Firestore
    StorageService.initFirestoreSync().then(() => {
      const user = StorageService.getCurrentUser();
      if (user && user.id !== 'mem-001' && user.id !== 'mem-002' && user.id !== 'mem-003') {
        setCurrentUser(user);
      }
    });

    const user = StorageService.getCurrentUser();
    // Do NOT auto-login as fake/dummy seed users (mem-001 / mem-002 / mem-003)
    if (user && user.id !== 'mem-001' && user.id !== 'mem-002' && user.id !== 'mem-003') {
      setCurrentUser(user);
    } else {
      StorageService.setCurrentUser(null);
      setCurrentUser(null);
    }

    // 2. Real-time multi-device Firestore synchronization for members
    const unsubscribeFirestore = FirestoreService.subscribeToMembers((cloudMembers) => {
      const current = StorageService.getCurrentUser();
      if (current) {
        const found = cloudMembers.find((m) => m.accId.toUpperCase() === current.accId.toUpperCase());
        if (found) {
          StorageService.setCurrentUser(found);
          setCurrentUser(found);
        }
      }
    });

    // 3. Real-time multi-device Firestore synchronization for site config
    const unsubscribeConfig = FirestoreService.subscribeToSiteConfig((cloudCfg) => {
      if (cloudCfg) {
        setSiteConfig(cloudCfg);
        StorageService.saveSiteConfig(cloudCfg);
      }
    });

    // 4. Tab-level synchronization
    const unsubscribeSync = subscribeToSync(() => {
      const refreshedUser = StorageService.getCurrentUser();
      if (refreshedUser && refreshedUser.id !== 'mem-001' && refreshedUser.id !== 'mem-002') {
        setCurrentUser(refreshedUser);
      } else {
        setCurrentUser(null);
      }
      setSiteConfig(StorageService.getSiteConfig());
    });

    return () => {
      unsubscribeFirestore();
      unsubscribeConfig();
      unsubscribeSync();
    };
  }, []);

  const handleLogout = () => {
    StorageService.setCurrentUser(null);
    setCurrentUser(null);
    setActiveWindow('home');
  };

  const handleLoginSuccess = (member: Member) => {
    setCurrentUser(member);
    setActiveWindow('dashboard');
  };

  const handleRegistrationSuccess = (member: Member) => {
    setCurrentUser(member);
    setActiveWindow('dashboard');
  };

  // Get active member for ID card (either current user or default founder)
  const idCardMember = currentUser || StorageService.getMembers()[0];

  return (
    <div className="min-h-screen bg-[#f1f2f4] text-slate-800 flex flex-col selection:bg-[#2874f0] selection:text-white font-sans w-full max-w-[100vw] overflow-x-hidden">
      {/* Official Top Bar & Live IOIS-Style Realtime Clock Header */}
      <Header
        activeWindow={activeWindow}
        setActiveWindow={setActiveWindow}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Container - 100% Mobile Fluid Fit */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-2 sm:p-4 md:p-6 pb-24 overflow-x-hidden">
        {/* VIEW: HOME */}
        {activeWindow === 'home' && (
          <HomeView
            onNavigate={(view) => setActiveWindow(view)}
            currentUser={currentUser}
          />
        )}

        {/* VIEW: VIDEO TRAINING */}
        {activeWindow === 'video' && (
          <WindowFrame
            title="ACC ट्रेनिंग वीडियो व बिजनेस प्लान (YouTube Full Video)"
            subtitle="Start Young Retire Young • SWIS & TWIS Complete Walkthrough"
            icon={<Video className="w-4 h-4 text-rose-400" />}
            onClose={() => setActiveWindow('home')}
          >
            <VideoTrainingModal
              onGoToRegister={() => setActiveWindow('register')}
              onGoToContact={() => setActiveWindow('contact')}
            />
          </WindowFrame>
        )}

        {/* VIEW: REGISTRATION FORM */}
        {activeWindow === 'register' && (
          <WindowFrame
            title="ACC नवीन सदस्यता 🆔 रजिस्ट्रेशन फॉर्म (Google Form Style)"
            subtitle="₹249 One-Time Joining Fee • SWIS & TWIS Activation"
            icon={<FileText className="w-4 h-4 text-amber-400" />}
            onClose={() => setActiveWindow('home')}
          >
            <RegistrationModal
              onSuccess={handleRegistrationSuccess}
              onCancel={() => setActiveWindow('home')}
              onGoToLogin={() => setActiveWindow('login')}
            />
          </WindowFrame>
        )}

        {/* VIEW: LOGIN */}
        {activeWindow === 'login' && (
          <WindowFrame
            title="ACC सदस्य लॉगिन (Member Portal Login)"
            subtitle="Unique ACC 🆔 या मोबाइल नंबर से प्रवेश करें"
            icon={<Sparkles className="w-4 h-4 text-amber-400" />}
            onClose={() => setActiveWindow('home')}
          >
            <LoginModal
              onLoginSuccess={handleLoginSuccess}
              onGoToRegister={() => setActiveWindow('register')}
              onCancel={() => setActiveWindow('home')}
            />
          </WindowFrame>
        )}

        {/* VIEW: COMMISSION CALCULATOR */}
        {activeWindow === 'calculator' && (
          <WindowFrame
            title="लाइव कमीशन एवं बचत कैलकुलेटर (SWIS 3.30% vs Google Pay / PhonePe)"
            subtitle="कैलकुलेट करें अपनी और परिवार के बिलों पर मासिक व वार्षिक बचत"
            icon={<Calculator className="w-4 h-4 text-emerald-400" />}
            onClose={() => setActiveWindow('home')}
          >
            <CommissionCalculator
              onGoToRegister={() => setActiveWindow('register')}
            />
          </WindowFrame>
        )}

        {/* VIEW: DIGITAL ID CARD */}
        {activeWindow === 'idcard' && (
          <WindowFrame
            title="डिजिटल ACC पहचान पत्र (Official Member ID Card)"
            subtitle="Certified Lifetime Digital Identity • Achievers Club Community"
            icon={<CreditCard className="w-4 h-4 text-cyan-400" />}
            onClose={() => setActiveWindow('home')}
          >
            <DigitalIdCard
              member={idCardMember}
              onClose={() => setActiveWindow('home')}
            />
          </WindowFrame>
        )}

        {/* VIEW: USER DASHBOARD */}
        {activeWindow === 'dashboard' && (
          <WindowFrame
            title={currentUser ? `विद्यार्थी डैशबोर्ड (${currentUser.fullName})` : "विद्यार्थी सदस्य पोर्टल (Student Portal)"}
            subtitle={currentUser ? `यूनिक 🆔: ${currentUser.accId} • SWIS रिचार्ज 3.30% • TWIS रेफरल ₹150` : "अपने विद्यार्थी 🆔 या मोबाइल नंबर से लॉगिन करें अथवा नया ₹249 रजिस्ट्रेशन करें"}
            icon={<LayoutDashboard className="w-4 h-4 text-indigo-400" />}
            onClose={() => setActiveWindow('home')}
          >
            {currentUser ? (
              <UserDashboard
                currentUser={currentUser}
                onUpdateUser={(updated) => setCurrentUser(updated)}
              />
            ) : (
              <StudentPortalGate
                onLoginSuccess={handleLoginSuccess}
                onGoToRegister={() => setActiveWindow('register')}
                onCancel={() => setActiveWindow('home')}
              />
            )}
          </WindowFrame>
        )}

        {/* VIEW: ADMIN PANEL */}
        {activeWindow === 'admin' && (
          <WindowFrame
            title="केंद्रीय एडमिन पैनल (Root Admin Management)"
            subtitle="यूजर रजिस्ट्रेशन रिकॉर्ड, 🆔 एक्टिवेशन सत्यापन एवं निकासी प्रबंधन"
            icon={<ShieldCheck className="w-4 h-4 text-red-400" />}
            onClose={() => setActiveWindow('home')}
          >
            <AdminPanel
              onRefresh={() => {
                const cur = StorageService.getCurrentUser();
                if (cur) setCurrentUser(cur);
              }}
            />
          </WindowFrame>
        )}

        {/* VIEW: LEGAL PAGES (About, Privacy, Disclaimer, Terms, Contact) */}
        {(activeWindow === 'about' ||
          activeWindow === 'privacy' ||
          activeWindow === 'disclaimer' ||
          activeWindow === 'terms' ||
          activeWindow === 'contact') && (
          <WindowFrame
            title="कानूनी नीतियां एवं संस्थागत जानकारी (Legal & Policy)"
            subtitle="Achievers Club Community • Start Young, Retire Young"
            icon={<Phone className="w-4 h-4 text-blue-400" />}
            onClose={() => setActiveWindow('home')}
          >
            <LegalPages
              initialTab={activeWindow}
              onGoToRegister={() => setActiveWindow('register')}
            />
          </WindowFrame>
        )}
      </main>

      {/* Official Footer - Flipkart Style */}
      <footer className="mt-auto bg-[#172337] text-slate-300 text-xs border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-[#ffe500] text-[#2874f0] flex items-center justify-center font-black text-sm">
                ACC
              </div>
              <span className="font-bold text-white text-sm">Achievers Club Community</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Start Young, Retire Young • भारत के छात्रों एवं युवाओं के लिए शून्य निवेश (Zero Investment) पार्ट-टाइम कमाई व डिजिटल 🆔 एक्टिवेशन पोर्टल।
            </p>
            <span className="inline-block text-[10px] text-[#ffe500] font-bold">
              ✓ ACC ASSURED RECHARGE & REFERRAL PORTAL
            </span>
          </div>

          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider text-slate-400">महत्वपूर्ण लिंक्स</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <button onClick={() => setActiveWindow('home')} className="hover:text-white transition">
                  होम पेज (Home)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveWindow('video')} className="hover:text-white transition">
                  ट्रेनिंग वीडियो व प्लान
                </button>
              </li>
              <li>
                <button onClick={() => setActiveWindow('calculator')} className="hover:text-white transition">
                  पॉकेट मनी कैलकुलेटर
                </button>
              </li>
              <li>
                <button onClick={() => setActiveWindow('dashboard')} className="hover:text-white transition">
                  विद्यार्थी सदस्य डैशबोर्ड
                </button>
              </li>
              <li>
                <button onClick={() => setActiveWindow('register')} className="hover:text-[#ffe500] font-semibold transition">
                  नया रजिस्ट्रेशन (₹249 One-Time)
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider text-slate-400">नीति एवं सहायता</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <button onClick={() => setActiveWindow('about')} className="hover:text-white transition">
                  हमारे बारे में (About Us)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveWindow('terms')} className="hover:text-white transition">
                  नियम एवं शर्तें (Terms & Conditions)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveWindow('privacy')} className="hover:text-white transition">
                  गोपनीयता नीति (Privacy Policy)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveWindow('disclaimer')} className="hover:text-white transition">
                  कानूनी अस्वीकरण (Disclaimer)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveWindow('contact')} className="hover:text-white transition">
                  सपोर्ट हेल्पडेस्क (Contact Us)
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider text-slate-400">संपर्क व सहायता</h4>
            <div className="text-slate-400 text-[11px] space-y-1">
              <p>
                हेल्पलाइन:{' '}
                <a
                  href={`tel:${(siteConfig.helplinePhone || '+91 8877490845').replace(/[^0-9]/g, '')}`}
                  className="text-emerald-400 font-bold hover:underline"
                >
                  {siteConfig.helplinePhone || '+91 8877490845'}
                </a>
              </p>
              <p>
                ईमेल:{' '}
                <a
                  href={`mailto:${siteConfig.officialEmail || 'santosh09patidar@gmail.com'}`}
                  className="text-slate-300 hover:underline"
                >
                  {siteConfig.officialEmail || 'santosh09patidar@gmail.com'}
                </a>
              </p>
              <p>
                कार्यालय: {siteConfig.officialAddress || 'Scheme No. 54, Vijay Nagar, Indore (M.P.) - 452001'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#0f172a] py-3 px-4 border-t border-slate-800 text-center text-[11px] text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>© {new Date().getFullYear()} Achievers Club Community (ACC). All Rights Reserved.</span>
            <span className="text-slate-400">
              Powered by SWIS (3.30% Commission) & TWIS (₹150 Refer & Earn) · 🆔 ₹{siteConfig.activationFee || 249}
            </span>
          </div>
        </div>
      </footer>

      {/* Floating Bottom Quick Bar for Mobile & WhatsApp quick support */}
      <div className="fixed bottom-3 right-3 z-30 flex items-center gap-2">
        {siteConfig.showHelplineCallButton !== false && (
          <a
            href={`tel:${(siteConfig.helplinePhone || '+91 8877490845').replace(/[^0-9]/g, '')}`}
            className="bg-[#2874f0] hover:bg-[#1258c7] text-white font-bold text-xs p-2.5 sm:px-3.5 sm:py-2.5 rounded-full shadow-lg flex items-center gap-1.5 hover:scale-105 transition"
            title="हेल्पलाइन पर कॉल करें"
          >
            <Phone className="w-4 h-4 text-white" />
            <span className="hidden sm:inline">कॉल: {siteConfig.helplinePhone || '+91 8877490845'}</span>
          </a>
        )}

        {siteConfig.showHelplineWhatsAppButton !== false && (
          <a
            href={`https://api.whatsapp.com/send?phone=${(siteConfig.whatsappNumber || '+91 8877490845').replace(/[^0-9]/g, '')}&text=${encodeURIComponent(
              'Namaste ACC Support, mujhe Achievers Club Community ke SWIS TWIS system ke bare me jankari chahiye.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs p-2.5 sm:px-3.5 sm:py-2.5 rounded-full shadow-lg flex items-center gap-1.5 hover:scale-105 transition"
            title="WhatsApp चैट सपोर्ट"
          >
            <MessageCircle className="w-4 h-4 text-white" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
        )}

        <button
          onClick={() => setActiveWindow('register')}
          className="bg-[#fb641b] hover:bg-[#e85a14] text-white font-bold text-xs px-3.5 py-2.5 sm:px-4 sm:py-2.5 rounded-full shadow-lg flex items-center gap-1.5 hover:scale-105 transition"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#ffe500]" />
          <span>रजिस्टर ₹{siteConfig.activationFee || 249}</span>
        </button>
      </div>
    </div>
  );
}
