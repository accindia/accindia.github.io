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
import { IdCardAccessGate } from './components/IdCardAccessGate';
import { PromotionBrandingHub } from './components/PromotionBrandingHub';
import { LockedFooterBar } from './components/LockedFooterBar';
import { UserGuidelines } from './components/UserGuidelines';
import { ReferAndEarnModal } from './components/ReferAndEarnModal';
import { SponsorRegisterMemberModal } from './components/SponsorRegisterMemberModal';
import { MandatoryPasswordUpdateModal } from './components/MandatoryPasswordUpdateModal';
import { AccChatAndHelpHub } from './components/AccChatAndHelpHub';
import { DeviceKickoutAlertModal } from './components/DeviceKickoutAlertModal';
import { ForgotCredentialsModal } from './components/ForgotCredentialsModal';
import { CelebrationPopupModal, resolveActiveCelebrationPopups } from './components/CelebrationPopupModal';
import { ActiveWindow, Member, SiteConfig } from './types';
import { StorageService, subscribeToSync } from './services/storage';
import { FirestoreService } from './services/firestore';
import {
  FileText,
  Users,
  UserPlus,
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
  FileCheck,
  ShieldAlert,
  HelpCircle,
  Lock,
  ArrowRight,
  Megaphone,
  BookOpen,
  Send,
  Zap,
} from 'lucide-react';

export default function App() {
  const [globalCelebrationOpen, setGlobalCelebrationOpen] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<Member | null>(() => {
    const user = StorageService.getCurrentUser();
    if (user && user.id !== 'mem-001' && user.id !== 'mem-002' && user.id !== 'mem-003') {
      return user;
    }
    return null;
  });
  const [activeWindow, setActiveWindow] = useState<ActiveWindow>(() => {
    const user = StorageService.getCurrentUser();
    if (user && user.id !== 'mem-001' && user.id !== 'mem-002' && user.id !== 'mem-003') {
      return 'dashboard';
    }
    return 'home';
  });
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => StorageService.getSiteConfig());
  const [referralSponsor, setReferralSponsor] = useState<Member | null>(null);
  const [deviceKickoutAlertOpen, setDeviceKickoutAlertOpen] = useState(false);
  const [showForgotCredentialsModal, setShowForgotCredentialsModal] = useState(false);

  const globalCelebrationItems = resolveActiveCelebrationPopups(siteConfig, 'other', Boolean(currentUser));
  const globalCelebrationSig =
    globalCelebrationItems.map((p) => `${p.id}:${p.title}:${p.imageUrl || ''}`).join('|') +
    `::${siteConfig.celebrationPopupTarget || 'all'}`;

  useEffect(() => {
    if (globalCelebrationItems.length > 0) {
      setGlobalCelebrationOpen(true);
    }
  }, [globalCelebrationSig]);

  // When a user logs in for the first time or from outside, default to dashboard if on login/register
  useEffect(() => {
    if (currentUser && (activeWindow === 'login' || activeWindow === 'register')) {
      setActiveWindow('dashboard');
    }
  }, [currentUser, activeWindow]);

  // Detect ?sponsor= or ?ref= parameter from URL or sessionStorage
  useEffect(() => {
    const detectSponsor = async () => {
      try {
        if (typeof window !== 'undefined') {
          const params = new URLSearchParams(window.location.search);
          let sId = params.get('sponsor') || params.get('ref');
          try {
            if (sId && sId.trim()) {
              sessionStorage.setItem('acc_active_sponsor_ref', sId.trim());
            } else {
              sId = sessionStorage.getItem('acc_active_sponsor_ref');
            }
          } catch {
            // ignore restricted storage
          }

          if (sId && sId.trim()) {
            const cleanId = sId.trim().toUpperCase();
            const members = StorageService.getMembers();
            let found = members.find((m) => m.accId.toUpperCase() === cleanId);
            if (!found) {
              const cloudMembers = await FirestoreService.getMembers();
              found = cloudMembers.find((m) => m.accId.toUpperCase() === cleanId);
            }
            if (found) {
              setReferralSponsor(found);
            }
          }
        }
      } catch (err) {
        console.warn('Sponsor detection err:', err);
      }
    };

    detectSponsor();
  }, []);

  // Load initial user & subscribe to sync across tabs/windows & Firestore multi-device
  useEffect(() => {
    const isSeedUser = (u: Member | null) =>
      !u || u.id === 'mem-001' || u.id === 'mem-002' || u.id === 'mem-003';

    const safeUpdateCurrentUser = (nextUser: Member) => {
      setCurrentUser((prev) => {
        if (
          prev &&
          prev.accId === nextUser.accId &&
          prev.status === nextUser.status &&
          prev.walletBalance === nextUser.walletBalance &&
          prev.totalEarnings === nextUser.totalEarnings &&
          prev.avatarFrame === nextUser.avatarFrame &&
          prev.avatarUrl === nextUser.avatarUrl &&
          prev.realAppLink === nextUser.realAppLink &&
          prev.realAppLinkApproved === nextUser.realAppLinkApproved &&
          prev.activeSessionId === nextUser.activeSessionId &&
          prev.lastEditedAt === nextUser.lastEditedAt &&
          prev.isActive === nextUser.isActive
        ) {
          return prev;
        }
        return nextUser;
      });
    };

    // 1. Initial background sync with Firestore
    StorageService.initFirestoreSync().then(() => {
      const user = StorageService.getCurrentUser();
      if (!isSeedUser(user)) {
        safeUpdateCurrentUser(user!);
      }
    });

    const initialUser = StorageService.getCurrentUser();
    if (!isSeedUser(initialUser)) {
      safeUpdateCurrentUser(initialUser!);
    } else if (initialUser) {
      StorageService.setCurrentUser(null, true);
      setCurrentUser(null);
    }

    // 2. Real-time multi-device Firestore synchronization for members
    const unsubscribeFirestore = FirestoreService.subscribeToMembers((cloudMembers) => {
      if (cloudMembers && cloudMembers.length > 0) {
        StorageService.mergeMembersWithCloud(cloudMembers, true);
      }
      StorageService.syncUnsyncedLocalMembersToCloud(cloudMembers).catch(() => {});
      const current = StorageService.getCurrentUser();
      if (current) {
        const found = cloudMembers.find((m) => m.accId.toUpperCase() === current.accId.toUpperCase());
        if (found) {
          const localSessionId = StorageService.getLocalSessionId();
          const localSessTs = StorageService.parseSessionTimestamp(localSessionId);
          const cloudSessTs = StorageService.parseSessionTimestamp(found.activeSessionId);

          // ONLY kick out if another device created a STRICTLY NEWER session (>2s newer) and cloud writes aren't paused
          if (
            found.activeSessionId &&
            localSessionId &&
            found.activeSessionId !== localSessionId &&
            cloudSessTs > localSessTs + 2000 &&
            !FirestoreService.isWriteQuotaPaused()
          ) {
            StorageService.clearSession();
            setCurrentUser(null);
            setDeviceKickoutAlertOpen(true);
            return;
          }

          // Protect newer local session / edits from being overwritten by stale Firestore snapshots
          const localEditTs = current.lastEditedAt ? Date.parse(current.lastEditedAt) || 0 : 0;
          const cloudEditTs = found.lastEditedAt ? Date.parse(found.lastEditedAt) || 0 : 0;
          const keepLocalEdits = localEditTs > cloudEditTs;
          const keepLocalSession = localSessTs >= cloudSessTs && Boolean(localSessionId);

          const mergedUser: Member = {
            ...found,
            ...(keepLocalEdits ? current : {}),
            avatarUrl: (keepLocalEdits ? current.avatarUrl : found.avatarUrl) || current.avatarUrl || found.avatarUrl,
            activeSessionId: keepLocalSession ? localSessionId! : (found.activeSessionId || current.activeSessionId),
            lastLoginAt: keepLocalSession ? (current.lastLoginAt || found.lastLoginAt) : (found.lastLoginAt || current.lastLoginAt),
          };

          StorageService.setCurrentUser(mergedUser, true);
          safeUpdateCurrentUser(mergedUser);
        }
      }
      // Also sync referral sponsor if stored
      let storedSponsorId: string | null = null;
      try {
        storedSponsorId = typeof window !== 'undefined' ? sessionStorage.getItem('acc_active_sponsor_ref') : null;
      } catch {
        // ignore
      }
      if (storedSponsorId) {
        const sponsorFound = cloudMembers.find((m) => m.accId.toUpperCase() === storedSponsorId!.trim().toUpperCase());
        if (sponsorFound) {
          setReferralSponsor(sponsorFound);
        }
      }
    });

    // 3. Real-time multi-device Firestore synchronization for site config
    const unsubscribeConfig = FirestoreService.subscribeToSiteConfig((cloudCfg) => {
      if (cloudCfg && StorageService.applyCloudSiteConfigIfNewer(cloudCfg)) {
        setSiteConfig(StorageService.getSiteConfig());
      }
    });

    // 4. Tab-level synchronization
    const unsubscribeSync = subscribeToSync(() => {
      const refreshedUser = StorageService.getCurrentUser();
      if (!isSeedUser(refreshedUser)) {
        const localSessionId = StorageService.getLocalSessionId();
        const localSessTs = StorageService.parseSessionTimestamp(localSessionId);
        const refreshedSessTs = StorageService.parseSessionTimestamp(refreshedUser!.activeSessionId);
        if (
          refreshedUser!.activeSessionId &&
          localSessionId &&
          refreshedUser!.activeSessionId !== localSessionId &&
          refreshedSessTs > localSessTs + 2000
        ) {
          StorageService.clearSession();
          setCurrentUser(null);
          setDeviceKickoutAlertOpen(true);
          return;
        }
        safeUpdateCurrentUser(refreshedUser!);
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

  // Scroll to top helper to bring user directly to the opened section/window right below header
  const scrollToTopSection = (smooth: boolean = false) => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: smooth ? 'smooth' : 'instant' });
    }
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
    const root = document.getElementById('root');
    if (root) root.scrollTop = 0;
  };

  const handleNavigateWithScroll = (windowName: ActiveWindow) => {
    // If user is already logged in, redirect auth forms
    if (currentUser) {
      if (windowName === 'login') {
        setActiveWindow('dashboard');
        scrollToTopSection(false);
        return;
      }
      if (windowName === 'register') {
        setActiveWindow('add-member');
        scrollToTopSection(false);
        return;
      }
    }
    setActiveWindow(windowName);
    scrollToTopSection(false);
  };

  // Automatically scroll to top when returning to home
  useEffect(() => {
    if (activeWindow === 'home') {
      scrollToTopSection();
    }
  }, [activeWindow]);

  const handleLogout = () => {
    StorageService.setCurrentUser(null);
    setCurrentUser(null);
    handleNavigateWithScroll('home');
  };

  const handleLoginSuccess = (member: Member) => {
    setCurrentUser(member);
    handleNavigateWithScroll('dashboard');
  };

  const handleRegistrationSuccess = (member: Member) => {
    setCurrentUser(member);
    handleNavigateWithScroll('dashboard');
  };

  // Dedicated navigation for ID card:
  // Always opens the ID Card portal ('idcard'):
  // - If logged in: shows user's own card
  // - If visited with sponsor: shows sponsor's certified card
  // - If visitor without sponsor: opens IdCardAccessGate with sponsor verification, rejection, and direct company registration
  const handleNavigateToIdCard = () => {
    handleNavigateWithScroll('idcard');
  };

  return (
    <div className="min-h-screen bg-[#f1f2f4] text-slate-800 flex flex-col selection:bg-[#2874f0] selection:text-white font-sans w-full max-w-[100vw] overflow-x-hidden">
      {/* Official Top Bar & Live IOIS-Style Realtime Clock Header (Fixed Rock-Solid) */}
      <Header
        activeWindow={activeWindow}
        setActiveWindow={handleNavigateWithScroll}
        currentUser={currentUser}
        onLogout={handleLogout}
        referralSponsor={referralSponsor}
        onNavigateToIdCard={handleNavigateToIdCard}
      />

      {/* Spacer ensuring page content starts completely below the permanently locked header on any screen */}
      <div
        className="w-full shrink-0 pointer-events-none transition-all duration-150 min-h-[148px] xs:min-h-[155px] sm:min-h-[130px] md:min-h-[125px]"
        style={{ height: 'var(--acc-header-height, 155px)' }}
        aria-hidden="true"
      />

      {/* Main Container - 100% Mobile Fluid Fit with Zero Header Overlap */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-2 sm:p-4 md:p-6 pb-24 overflow-x-hidden pt-1 sm:pt-2">
        {/* VIEW: HOME - Accessible to all (visitors and members/admin preview) */}
        {activeWindow === 'home' && (
          <HomeView
            siteConfig={siteConfig}
            onNavigate={(view) => {
              if (view === 'idcard') {
                handleNavigateToIdCard();
              } else {
                handleNavigateWithScroll(view);
              }
            }}
            currentUser={currentUser}
            referralSponsor={referralSponsor}
            onNavigateToIdCard={handleNavigateToIdCard}
          />
        )}

        {/* VIEW: VIDEO TRAINING */}
        {activeWindow === 'video' && (
          <WindowFrame
            title="ACC ट्रेनिंग वीडियो व बिजनेस प्लान (YouTube Full Video)"
            subtitle="Start Young Retire Young • SWIS & TWIS Complete Walkthrough"
            icon={<Video className="w-4 h-4 text-rose-400" />}
            onClose={() => setActiveWindow(currentUser ? 'dashboard' : 'home')}
          >
            <VideoTrainingModal
              onGoToRegister={() => setActiveWindow('register')}
              onGoToContact={() => setActiveWindow('contact')}
              currentUser={currentUser}
              onGoToDashboard={() => setActiveWindow('dashboard')}
            />
          </WindowFrame>
        )}

        {/* VIEW: REGISTRATION FORM (Only for non-logged in visitors) */}
        {activeWindow === 'register' && !currentUser && (
          <WindowFrame
            title="ACC नवीन सदस्यता 🆔 रजिस्ट्रेशन फॉर्म (ACC Official Registration Portal)"
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

        {/* VIEW: LOGIN (Only for non-logged in visitors) */}
        {activeWindow === 'login' && !currentUser && (
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

        {/* VIEW: SPONSOR DIRECT MEMBER ENROLLMENT (Exclusive for Logged in Sponsor) */}
        {activeWindow === 'add-member' && currentUser && (
          <WindowFrame
            title={`अपने नीचे नया सदस्य जोड़ें (Sponsor: ${currentUser.accId})`}
            subtitle="डायरेक्ट डाउनलाइन सदस्य रजिस्ट्रेशन • ₹150 रेफरल पेआउट • अनिवार्य पासवर्ड सुरक्षा नियम"
            icon={<UserPlus className="w-4 h-4 text-orange-400" />}
            onClose={() => setActiveWindow('dashboard')}
          >
            <SponsorRegisterMemberModal
              currentUser={currentUser}
              onSuccess={() => {
                // Handled inside modal with digital receipt
              }}
              onClose={() => setActiveWindow('dashboard')}
            />
          </WindowFrame>
        )}

        {/* VIEW: COMMISSION CALCULATOR */}
        {activeWindow === 'calculator' && (
          <WindowFrame
            title="लाइव कमीशन एवं बचत कैलकुलेटर (SWIS 3.30% vs Google Pay / PhonePe)"
            subtitle="कैलकुलेट करें अपनी और परिवार के बिलों पर मासिक व वार्षिक बचत"
            icon={<Calculator className="w-4 h-4 text-emerald-400" />}
            onClose={() => setActiveWindow(currentUser ? 'dashboard' : 'home')}
          >
            <CommissionCalculator
              onGoToRegister={() => setActiveWindow('register')}
              currentUser={currentUser}
              onGoToDashboard={() => setActiveWindow('dashboard')}
            />
          </WindowFrame>
        )}

        {/* VIEW: DIGITAL ID CARD */}
        {activeWindow === 'idcard' && (
          <WindowFrame
            title={
              currentUser
                ? `डिजिटल ACC पहचान पत्र (${currentUser.fullName})`
                : referralSponsor
                ? `स्पॉन्सर डिजिटल पहचान पत्र (${referralSponsor.fullName})`
                : 'ऑफिशियल डिजिटल ACC पहचान पत्र (Live Specimen Preview)'
            }
            subtitle={
              currentUser
                ? `यूनिक 🆔: ${currentUser.accId} • Certified Lifetime Digital Identity`
                : referralSponsor
                ? `रेफरल स्पॉन्सर 🆔: ${referralSponsor.accId} • इनके साथ जुड़ें और ₹150 रेफरल + 3.30% SWIS पाएं`
                : 'देखें कि ₹249 रजिस्ट्रेशन के बाद आपका डिजिटल 🆔 कार्ड कैसा दिखेगा • लाइव प्रिव्यू व तुरंत रजिस्ट्रेशन'
            }
            icon={<CreditCard className="w-4 h-4 text-cyan-400" />}
            onClose={() => setActiveWindow('home')}
          >
            {currentUser ? (
              <DigitalIdCard
                member={currentUser}
                onClose={() => setActiveWindow(currentUser ? 'dashboard' : 'home')}
                onUpdateMember={(updated) => setCurrentUser(updated)}
              />
            ) : referralSponsor ? (
              <div className="space-y-4">
                {/* Prominent Referral Sponsor Banner */}
                <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white p-4 sm:p-5 rounded-xl shadow-md border border-amber-400 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white text-orange-600 flex items-center justify-center font-black text-sm shadow-xs shrink-0 border-2 border-white">
                      ACC
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-black bg-black/25 px-2 py-0.5 rounded text-yellow-200">
                          🌟 आपके रेफरल स्पॉन्सर (Invited By)
                        </span>
                        <span className="text-[10px] bg-emerald-700/80 text-white px-2 py-0.5 rounded font-bold">
                          ✓ अधिकृत सदस्य
                        </span>
                      </div>
                      <h3 className="font-bold text-base sm:text-lg mt-1 text-white">
                        {referralSponsor.fullName} ({referralSponsor.accId})
                      </h3>
                      <p className="text-xs text-amber-100 mt-0.5">
                        आप इनके अधिकृत इनविटेशन लिंक से जुड़े हैं। नीचे इनका प्रमाणित डिजिटल पहचान पत्र देखें और इनके साथ ज्वाइन करें।
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveWindow('register')}
                    className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-slate-100 text-[#fb641b] font-black text-xs sm:text-sm rounded-sm shadow-md flex items-center justify-center gap-2 transition shrink-0 group"
                  >
                    <Sparkles className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
                    <span>इनके साथ ₹{siteConfig.activationFee || 249} में रजिस्ट्रेशन करें</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <DigitalIdCard
                  member={referralSponsor}
                  isSponsorCard={true}
                  onClose={() => setActiveWindow('home')}
                />
              </div>
            ) : (
              <IdCardAccessGate
                onGoToLogin={() => handleNavigateWithScroll('login')}
                onGoToRegister={() => handleNavigateWithScroll('register')}
                onSelectSponsor={(sponsor) => setReferralSponsor(sponsor)}
              />
            )}
          </WindowFrame>
        )}

        {/* VIEW: REFER & EARN (TWIS Referral & Promotion Kit Hub) */}
        {activeWindow === 'refer' && (
          <WindowFrame
            title={currentUser ? `रेफर & कमाएं हब (${currentUser.fullName})` : 'रेफर & कमाएं हब (TWIS Refer & Earn)'}
            subtitle="प्रति रेफरल ₹150 तुरंत पेआउट बैंक/UPI में • लाइफटाइम 3.30% रिचार्ज कमीशन • प्रचार किट व स्टेटस"
            icon={<Users className="w-4 h-4 text-orange-500" />}
            onClose={() => handleNavigateWithScroll(currentUser ? 'dashboard' : 'home')}
          >
            {currentUser ? (
              <ReferAndEarnModal
                currentUser={currentUser}
                onClose={() => handleNavigateWithScroll(currentUser ? 'dashboard' : 'home')}
                onGoToPromotions={() => handleNavigateWithScroll('promotions')}
                onGoToIdCard={() => handleNavigateWithScroll('idcard')}
                onGoToAddMember={() => handleNavigateWithScroll('add-member')}
              />
            ) : (
              <StudentPortalGate
                onLoginSuccess={handleLoginSuccess}
                onGoToRegister={() => handleNavigateWithScroll('register')}
                onCancel={() => handleNavigateWithScroll('home')}
              />
            )}
          </WindowFrame>
        )}

        {/* VIEW: USER DASHBOARD (Direct Digital Command Center for Logged-In Members) */}
        {currentUser && activeWindow === 'dashboard' && (
          <UserDashboard
            currentUser={currentUser}
            onUpdateUser={(updated) => setCurrentUser(updated)}
            onNavigateToPromotions={() => setActiveWindow('promotions')}
            onNavigateToChat={() => handleNavigateWithScroll('chat')}
          />
        )}

        {/* VIEW: VISITOR STUDENT PORTAL GATE (For Non-Logged-in Users) */}
        {!currentUser && activeWindow === 'dashboard' && (
          <WindowFrame
            title="विद्यार्थी सदस्य पोर्टल (Student Portal)"
            subtitle="अपने विद्यार्थी 🆔 या मोबाइल नंबर से लॉगिन करें अथवा नया ₹249 रजिस्ट्रेशन करें"
            icon={<LayoutDashboard className="w-4 h-4 text-indigo-400" />}
            onClose={() => setActiveWindow('home')}
          >
            <StudentPortalGate
              onLoginSuccess={handleLoginSuccess}
              onGoToRegister={() => setActiveWindow('register')}
              onCancel={() => setActiveWindow('home')}
            />
          </WindowFrame>
        )}

        {/* VIEW: ACC CHAT & HELP (Complete Facebook-like Social System) */}
        {activeWindow === 'chat' && (
          currentUser ? (
            <div className="fixed inset-0 z-[60] bg-slate-950 overflow-hidden animate-fadeIn">
              <AccChatAndHelpHub
                currentUser={currentUser}
                onClose={() => handleNavigateWithScroll('dashboard')}
                onNavigateToDashboard={() => handleNavigateWithScroll('dashboard')}
              />
            </div>
          ) : (
            <WindowFrame
              title="ACC MEMBER CHAT (कम्युनिटी सोशल व संवाद केंद्र)"
              subtitle="स्पॉन्सर चैट, कम्युनिटी ग्रुप्स, फोटो/वीडियो शेयरिंग एवं मित्र नेटवर्क"
              icon={<MessageCircle className="w-4 h-4 text-amber-400" />}
              onClose={() => handleNavigateWithScroll('home')}
            >
              <div className="py-12 px-4 max-w-md mx-auto text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-3xl mx-auto shadow-inner">
                  💬
                </div>
                <h3 className="text-lg font-black text-slate-900">
                  ACC MEMBER CHAT में प्रवेश करें
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  स्पॉन्सर से 1-क्लिक सीधी बातचीत, कम्युनिटी ग्रुप्स और अपने साथियों के साथ फोटो, वीडियो व लिंक शेयर करने के लिए कृपया अपने ACC खाते से लॉगिन करें।
                </p>
                <div className="pt-2 flex gap-3">
                  <button
                    onClick={() => handleNavigateWithScroll('login')}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold text-xs shadow-md hover:brightness-110"
                  >
                    सदस्य लॉगिन करें
                  </button>
                  <button
                    onClick={() => handleNavigateWithScroll('register')}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs shadow-md hover:brightness-110"
                  >
                    रजिस्ट्रेशन (₹249)
                  </button>
                </div>
              </div>
            </WindowFrame>
          )
        )}

        {/* VIEW: ADMIN PANEL */}
        {activeWindow === 'admin' && (
          <WindowFrame
            title="केंद्रीय एडमिन पैनल (Root Admin Management)"
            subtitle="यूजर रजिस्ट्रेशन रिकॉर्ड, 🆔 एक्टिवेशन सत्यापन एवं निकासी प्रबंधन"
            icon={<ShieldCheck className="w-4 h-4 text-red-400" />}
            onClose={() => setActiveWindow(currentUser ? 'dashboard' : 'home')}
          >
            <AdminPanel
              onRefresh={() => {
                const cur = StorageService.getCurrentUser();
                if (cur) setCurrentUser(cur);
              }}
              onNavigate={handleNavigateWithScroll}
            />
          </WindowFrame>
        )}

        {/* VIEW: PROMOTIONAL POSTERS & VISITING CARDS (ACC Poster & Branding Hub) */}
        {activeWindow === 'promotions' && (
          <WindowFrame
            title="प्रचार किट, विजिटिंग कार्ड व सोशल मीडिया पोस्टर्स (Branding & Promotion Hub)"
            subtitle="ACC पोस्टर स्टाइल में अपने नाम व स्पॉन्सर 🆔 का आधिकारिक विजिटिंग कार्ड और पोस्टर बनाएं"
            icon={<Megaphone className="w-4 h-4 text-amber-500" />}
            onClose={() => setActiveWindow(currentUser ? 'dashboard' : 'home')}
          >
            <PromotionBrandingHub
              currentUser={currentUser}
              referralSponsor={referralSponsor}
              onGoToRegister={() => setActiveWindow('register')}
              onGoToIdCard={handleNavigateToIdCard}
            />
          </WindowFrame>
        )}

        {/* VIEW: USER GUIDELINES HUB (New, Pending, Verified & Helpdesk Guide) */}
        {activeWindow === 'guidelines' && (
          <WindowFrame
            title="विद्यार्थी उपयोगकर्ता मार्गदर्शन केंद्र (User Guidelines & Help Center)"
            subtitle="नए सदस्य, पेंडिंग वेरिफिकेशन, एक्टिव मेंबर्स एवं सपोर्ट हेल्पडेस्क की सम्पूर्ण गाइड"
            icon={<BookOpen className="w-4 h-4 text-emerald-400" />}
            onClose={() => setActiveWindow(currentUser ? 'dashboard' : 'home')}
          >
            <UserGuidelines
              currentUser={currentUser}
              onGoToRegister={() => handleNavigateWithScroll('register')}
              onGoToLogin={() => handleNavigateWithScroll('login')}
              onGoToDashboard={() => handleNavigateWithScroll('dashboard')}
              onGoToCalculator={() => handleNavigateWithScroll('calculator')}
            />
          </WindowFrame>
        )}

        {/* VIEW: LEGAL PAGES (About, Services, Privacy, Disclaimer, Terms, Contact, FAQ) */}
        {(activeWindow === 'about' ||
          activeWindow === 'services' ||
          activeWindow === 'privacy' ||
          activeWindow === 'disclaimer' ||
          activeWindow === 'terms' ||
          activeWindow === 'contact' ||
          activeWindow === 'faq') && (
          <WindowFrame
            key={activeWindow}
            title={
              activeWindow === 'faq'
                ? 'सामान्य प्रश्न (Frequently Asked Questions - FAQ)'
                : activeWindow === 'about'
                ? 'हमारे बारे में (About Achievers Club Community)'
                : activeWindow === 'services'
                ? 'उत्पाद या सेवाएं (Products & Services - ₹249 One-Time)'
                : activeWindow === 'terms'
                ? 'नियम एवं शर्तें (Terms & Conditions)'
                : activeWindow === 'privacy'
                ? 'गोपनीयता नीति (Privacy Policy - 100% Data Protection)'
                : activeWindow === 'disclaimer'
                ? 'कानूनी अस्वीकरण (Legal Disclaimer & Transparency)'
                : 'सपोर्ट हेल्पडेस्क एवं संपर्क (Contact Us & Support)'
            }
            subtitle={
              activeWindow === 'faq'
                ? 'SWIS 3.30% रिचार्ज कमीशन, TWIS ₹150 रेफरल बोनस, रजिस्ट्रेशन व त्वरित पेआउट संबंधित सवाल'
                : activeWindow === 'about'
                ? 'ACC कम्युनिटी विजन, मिशन और युवाओं के लिए जीरो-इन्वेस्टमेंट मॉडल'
                : activeWindow === 'services'
                ? 'SWIS 3.30% रिचार्ज कमीशन, TWIS ₹150 रेफरल प्रोग्राम एवं डिजिटल ID कार्ड विवरण'
                : activeWindow === 'terms'
                ? 'सदस्यता दिशानिर्देश, 3.30% रिचार्ज कमीशन व ₹150 रेफरल नियम'
                : activeWindow === 'privacy'
                ? 'उपयोगकर्ता डेटा सुरक्षा, एन्क्रिप्शन और प्राइवेसी नीतियां'
                : activeWindow === 'disclaimer'
                ? 'पारदर्शिता, स्पष्टीकरण और कानूनी अनुपालन विवरण'
                : '24x7 सहायता, व्हाट्सएप सपोर्ट और अधिकृत कार्यालय पता'
            }
            icon={
              activeWindow === 'faq' ? (
                <HelpCircle className="w-4 h-4 text-yellow-400" />
              ) : activeWindow === 'about' ? (
                <Building2 className="w-4 h-4 text-amber-400" />
              ) : activeWindow === 'services' ? (
                <Zap className="w-4 h-4 text-emerald-400" />
              ) : activeWindow === 'terms' ? (
                <FileCheck className="w-4 h-4 text-emerald-400" />
              ) : activeWindow === 'privacy' ? (
                <ShieldAlert className="w-4 h-4 text-cyan-400" />
              ) : activeWindow === 'disclaimer' ? (
                <HelpCircle className="w-4 h-4 text-rose-400" />
              ) : (
                <Phone className="w-4 h-4 text-blue-400" />
              )
            }
            onClose={() => handleNavigateWithScroll(currentUser ? 'dashboard' : 'home')}
          >
            <LegalPages
              key={activeWindow}
              initialTab={activeWindow}
              onGoToRegister={() => handleNavigateWithScroll('register')}
              onTabChange={(newTab) => {
                if (newTab !== 'description') {
                  setActiveWindow(newTab as ActiveWindow);
                }
              }}
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
                <button
                  type="button"
                  onClick={() => handleNavigateWithScroll(currentUser ? 'dashboard' : 'home')}
                  className="hover:text-white transition cursor-pointer text-left block w-full py-0.5"
                >
                  {currentUser ? 'विद्यार्थी डैशबोर्ड (Dashboard)' : 'होम पेज (Home)'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavigateWithScroll('video')}
                  className="hover:text-white transition cursor-pointer text-left block w-full py-0.5"
                >
                  ट्रेनिंग वीडियो व प्लान
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavigateWithScroll('calculator')}
                  className="hover:text-white transition cursor-pointer text-left block w-full py-0.5"
                >
                  पॉकेट मनी कैलकुलेटर
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavigateWithScroll('dashboard')}
                  className="hover:text-white transition cursor-pointer text-left block w-full py-0.5"
                >
                  विद्यार्थी सदस्य डैशबोर्ड
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavigateWithScroll('guidelines')}
                  className="hover:text-emerald-300 font-bold transition cursor-pointer text-left block w-full py-0.5 text-emerald-400"
                >
                  📖 उपयोगकर्ता गाइड केंद्र (Guidelines)
                </button>
              </li>
              <li>
                {currentUser ? (
                  <button
                    type="button"
                    onClick={() => handleNavigateWithScroll('idcard')}
                    className="hover:text-white transition cursor-pointer text-left block w-full py-0.5"
                  >
                    मेरा डिजिटल 🆔 कार्ड
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleNavigateWithScroll('register')}
                    className="hover:text-[#ffe500] font-semibold transition cursor-pointer text-left block w-full py-0.5"
                  >
                    नया रजिस्ट्रेशन (₹{siteConfig.activationFee || 249} One-Time)
                  </button>
                )}
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider text-slate-400">नीति एवं सहायता</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => handleNavigateWithScroll('about')}
                  className="hover:text-white transition cursor-pointer text-left block w-full py-0.5"
                >
                  हमारे बारे में (About Us)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavigateWithScroll('services')}
                  className="hover:text-white transition cursor-pointer text-left block w-full py-0.5 text-amber-300 font-bold"
                >
                  उत्पाद या सेवाएं (Products & Services)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavigateWithScroll('terms')}
                  className="hover:text-white transition cursor-pointer text-left block w-full py-0.5"
                >
                  नियम एवं शर्तें (Terms & Conditions)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavigateWithScroll('privacy')}
                  className="hover:text-white transition cursor-pointer text-left block w-full py-0.5"
                >
                  गोपनीयता नीति (Privacy Policy)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavigateWithScroll('disclaimer')}
                  className="hover:text-white transition cursor-pointer text-left block w-full py-0.5"
                >
                  कानूनी अस्वीकरण (Disclaimer)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavigateWithScroll('contact')}
                  className="hover:text-white transition cursor-pointer text-left block w-full py-0.5"
                >
                  सपोर्ट हेल्पडेस्क (Contact Us)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNavigateWithScroll('faq')}
                  className="hover:text-yellow-300 font-semibold transition cursor-pointer text-left block w-full py-0.5 text-yellow-400"
                >
                  सामान्य प्रश्न (FAQ - सवाल-जवाब)
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider text-slate-400">संपर्क व सहायता</h4>
            <div className="text-slate-400 text-[11px] space-y-1">
              {siteConfig.showCallSupport !== false && (
                <p>
                  हेल्पलाइन:{' '}
                  <a
                    href={`tel:${(siteConfig.helplinePhone || '+91 8877490845').replace(/[^0-9]/g, '')}`}
                    className="text-emerald-400 font-bold hover:underline"
                  >
                    {siteConfig.helplinePhone || '+91 8877490845'}
                  </a>
                </p>
              )}
              {siteConfig.showWhatsAppSupport === true && (
                <p>
                  WhatsApp:{' '}
                  <a
                    href={`https://api.whatsapp.com/send?phone=${(siteConfig.whatsappNumber || '+91 8877490845').replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 font-bold hover:underline"
                  >
                    {siteConfig.whatsappNumber || '+91 8877490845'}
                  </a>
                </p>
              )}
              {siteConfig.showTelegramSupport !== false && (
                <p>
                  Telegram:{' '}
                  <a
                    href={siteConfig.telegramLink || 'https://t.me/NEWUSERHELPLINE'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-400 font-bold hover:underline"
                  >
                    @NEWUSERHELPLINE
                  </a>
                </p>
              )}
              {siteConfig.showEmailSupport !== false && (
                <p>
                  Full Support Desk:{' '}
                  <a
                    href={`mailto:${siteConfig.officialEmail || 'newuserhelpline@gmail.com'}`}
                    className="text-yellow-300 font-bold hover:underline"
                  >
                    {siteConfig.officialEmail || 'newuserhelpline@gmail.com'}
                  </a>
                </p>
              )}
              <p>
                कार्यालय: {siteConfig.officialAddress || 'Scheme No. 54, Vijay Nagar, Indore (M.P.) - 452001'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#0f172a] py-3 px-4 border-t border-slate-800 text-center text-[11px] text-slate-500 mb-20 sm:mb-16">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>© {new Date().getFullYear()} Achievers Club Community (ACC). All Rights Reserved.</span>
            <span className="text-slate-400">
              Powered by SWIS (3.30% Commission) & TWIS (₹150 Refer & Earn) · 🆔 ₹{siteConfig.activationFee || 249}
            </span>
          </div>
        </div>
      </footer>

      {/* Permanently Locked Bottom Action Dock with Distinct Dynamic Options */}
      <LockedFooterBar
        currentUser={currentUser}
        referralSponsor={referralSponsor}
        siteConfig={siteConfig}
        activeWindow={activeWindow}
        setActiveWindow={handleNavigateWithScroll}
      />

      {/* MANDATORY PASSWORD UPDATE MODAL (When registered by sponsor) */}
      {currentUser && currentUser.mustUpdatePassword && (
        <MandatoryPasswordUpdateModal
          currentUser={currentUser}
          onPasswordUpdated={(updatedMember) => {
            setCurrentUser(updatedMember);
          }}
        />
      )}

      {/* MULTI-DEVICE SECURITY KICKOUT ALERT MODAL */}
      <DeviceKickoutAlertModal
        isOpen={deviceKickoutAlertOpen}
        onClose={() => setDeviceKickoutAlertOpen(false)}
        onGoToResetPassword={() => {
          setDeviceKickoutAlertOpen(false);
          setShowForgotCredentialsModal(true);
        }}
      />

      {/* FORGOT CREDENTIALS / PASSWORD RESET MODAL */}
      {showForgotCredentialsModal && (
        <ForgotCredentialsModal
          onClose={() => setShowForgotCredentialsModal(false)}
          onSuccessLogin={(member) => {
            setShowForgotCredentialsModal(false);
            handleLoginSuccess(member);
          }}
        />
      )}

      {/* GLOBAL CELEBRATION POPUP WHEN ADMIN SELECTS 'all' PAGES (Non-Home, Non-Dashboard, Non-Admin Views) */}
      {activeWindow !== 'home' &&
        activeWindow !== 'dashboard' &&
        activeWindow !== 'admin' &&
        (() => {
          const items = resolveActiveCelebrationPopups(siteConfig, 'other', Boolean(currentUser));
          if (items.length === 0) return null;
          return (
            <CelebrationPopupModal
              items={items}
              isOpen={globalCelebrationOpen}
              onClose={() => setGlobalCelebrationOpen(false)}
              onNavigate={(target) => handleNavigateWithScroll(target as ActiveWindow)}
            />
          );
        })()}
    </div>
  );
}
