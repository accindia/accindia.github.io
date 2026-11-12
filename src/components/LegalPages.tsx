import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  FileCheck,
  Building2,
  Mail,
  Phone,
  MapPin,
  HelpCircle,
  Sparkles,
  Send,
  CheckCircle2,
  ExternalLink,
  MessageCircle,
  FileText,
  Info,
  Shield,
  ArrowRight,
  Copy,
  Search,
  X,
} from 'lucide-react';
import { SiteConfig } from '../types';
import { StorageService, subscribeToSync } from '../services/storage';
import { FirestoreService } from '../services/firestore';
import { FAQSection } from './FAQSection';

export type LegalTabType = 'about' | 'services' | 'faq' | 'description' | 'disclaimer' | 'privacy' | 'terms' | 'contact';

interface LegalPagesProps {
  initialTab?: LegalTabType;
  onGoToRegister: () => void;
  onTabChange?: (tab: LegalTabType) => void;
}

export const LegalPages: React.FC<LegalPagesProps> = ({
  initialTab = 'about',
  onGoToRegister,
  onTabChange,
}) => {
  const [tab, setTab] = useState<LegalTabType>(initialTab);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => StorageService.getSiteConfig());
  const [faqSearchQuery, setFaqSearchQuery] = useState<string>('');

  // Automatically update active tab whenever initialTab prop changes
  useEffect(() => {
    if (initialTab) {
      setTab(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    const unsubLocal = subscribeToSync(() => {
      setSiteConfig(StorageService.getSiteConfig());
    });
    const unsubCloud = FirestoreService.subscribeToSiteConfig((cloudCfg) => {
      if (cloudCfg) {
        setSiteConfig(cloudCfg);
        StorageService.saveSiteConfig(cloudCfg);
      }
    });
    return () => {
      unsubLocal();
      unsubCloud();
    };
  }, []);

  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactMobile, setContactMobile] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSent, setContactSent] = useState(false);

  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
    setTimeout(() => {
      setContactSent(false);
      setContactName('');
      setContactMobile('');
      setContactEmail('');
      setContactMessage('');
    }, 4000);
  };

  const cleanWhatsApp = (siteConfig.whatsappNumber || '+91 8877490845').replace(/[^0-9]/g, '');
  const cleanPhone = (siteConfig.helplinePhone || '+91 8877490845').replace(/[^0-9]/g, '');

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Navigation Tabs - Flipkart Style */}
      <div className="flex bg-white border border-gray-200 rounded-lg p-1.5 gap-1 overflow-x-auto no-scrollbar shadow-xs">
        {[
          { id: 'about', label: 'About Us (हमारे बारे में)' },
          { id: 'services', label: 'Products / Services (उत्पाद व सेवाएं)' },
          { id: 'faq', label: 'FAQ (सामान्य प्रश्न)' },
          { id: 'description', label: 'Description (विस्तृत विवरण)' },
          { id: 'disclaimer', label: 'Disclaimer (अस्वीकरण)' },
          { id: 'privacy', label: 'Privacy Policy (गोपनीयता नीति)' },
          { id: 'terms', label: 'Terms & Conditions (नियम व शर्तें)' },
          { id: 'contact', label: 'Contact Us (संपर्क करें)' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setTab(item.id as any);
              onTabChange?.(item.id as any);
            }}
            className={`px-3.5 py-2 text-xs font-bold rounded-sm whitespace-nowrap transition ${
              tab === item.id
                ? 'bg-[#2874f0] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* CONTENT: About Us */}
      {tab === 'about' && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 space-y-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-[#2874f0] text-white flex items-center justify-center font-display font-black text-xl shadow-xs">
              ACC
            </div>
            <div>
              <h2 className="text-xl font-black font-display text-slate-900">
                About Achievers Club Community (ACC)
              </h2>
              <p className="text-xs text-[#2874f0] font-semibold">
                Start Young, Retire Young • Empowering India's Youth · ACC Assured ✓
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <p>
              <strong>अचीवर्स क्लब कम्युनिटी (Achievers Club Community - ACC)</strong> भारत के महत्वाकांक्षी युवाओं और छात्रों का एक सशक्त राष्ट्रव्यापी मंच है। हमारा प्राथमिक ध्येय <em>"Start Young, Retire Young"</em> के सिद्धांत पर काम करते हुए युवाओं को कम उम्र में ही डिजिटल आत्मनिर्भरता और वित्तीय स्वतंत्रता प्रदान करना है।
            </p>

            <div className="bg-[#f1f2f4] p-4 rounded-lg border border-gray-200 space-y-2">
              <h4 className="font-bold text-slate-900">हमारा मिशन और विजन (Mission & Vision)</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                पारंपरिक शिक्षा व्यवस्था में डिग्री प्राप्त करने के उपरांत भी लाखों युवा रोजगार या अतिरिक्त आय के लिए संघर्ष करते हैं। ACC एक पारदर्शी और व्यावहारिक डिजिटल इकोसिस्टम उपलब्ध कराता है, जहां कोई भी व्यक्ति अपने स्मार्टफोन से दैनिक आवश्यक सेवाओं (रिचार्ज और बिल भुगतान) पर बचत कर सकता है और टीम वर्क से लाइफटाइम इनकम बना सकता है।
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-blue-50/60 p-4 rounded-lg border border-blue-200/70">
                <h5 className="font-bold text-[#2874f0] mb-1">1. सेल्फ वर्क इनकम सिस्टम (SWIS)</h5>
                <p className="text-xs text-slate-600">
                  हर महीने हर परिवार में मोबाइल रिचार्ज, बिजली बिल, DTH जैसे भुगतान होते हैं। SWIS के अंतर्गत 3.30% फिक्स्ड कमीशन सीधे सदस्य के वॉलेट में क्रेडिट होता है।
                </p>
              </div>

              <div className="bg-emerald-50/60 p-4 rounded-lg border border-emerald-200/70">
                <h5 className="font-bold text-emerald-700 mb-1">2. टीम वर्क इनकम सिस्टम (TWIS)</h5>
                <p className="text-xs text-slate-600">
                  टीम की शक्ति से बड़ी सफलता प्राप्त होती है। TWIS में हर सफल रेफरल पर ₹150 की सीधी इनकम प्राप्त होती है और डिजिटल लीडरशिप का अवसर मिलता है।
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONTENT: Description Page */}
      {tab === 'description' && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 space-y-5 shadow-sm">
          <h2 className="text-xl font-black font-display text-slate-900">
            विस्तृत कार्यप्रणाली एवं विवरण (System Description)
          </h2>

          <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <div className="bg-amber-50 border border-amber-300 p-4 rounded-lg">
              <h4 className="font-bold text-amber-900 text-sm mb-1">
                नो इन्वेस्टमेंट - केवल एक बार 🆔 एक्टिवेशन शुल्क (₹249)
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                यहां कोई रिस्क वाला इन्वेस्टमेंट सिस्टम वर्क नहीं है। सिर्फ सदस्य की डिजिटल 🆔 और सर्वर पोर्टल सक्रिय करने के लिए केवल <strong>₹249 ONE TIME JOINING CHARGE</strong> का भुगतान करना होता है। इसके बाद कोई मासिक शुल्क या हिडन चार्ज नहीं है।
              </p>
            </div>

            <div className="bg-[#f1f2f4] p-4 rounded-lg border border-gray-200 space-y-3">
              <h4 className="font-bold text-slate-900">यूनिक 🆔 कोड संरचना (Formula Explained)</h4>
              <p className="text-xs text-slate-600">
                आधिकारिक सेट सिस्टम फॉर्मेट: <strong className="font-mono-acc text-[#2874f0] text-sm">SWACCRK01</strong> / <strong className="font-mono-acc text-[#2874f0] text-sm">TWACCRK01</strong>
              </p>
              <ul className="text-xs text-slate-600 space-y-1 list-disc pl-5">
                <li><strong>SWACC / TWACC</strong> = सिस्टम प्लान (SWIS = Self Work Recharge, TWIS = Team Work Referral)</li>
                <li><strong>RK</strong> = सदस्य के नाम के इनिशियल्स (उदा. Rahul Kumar = RK, Santosh Patidar = SP)</li>
                <li><strong>01</strong> = सदस्य का क्रम संख्यांक (सीक्वेंस नंबर)</li>
                <li><strong>लेगेसी सपोर्ट:</strong> पूर्व आईडी कोड (उदा. ACC249SWISRK01) भी सिस्टम में समान रूप से समर्थित हैं।</li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-bold text-slate-900 mb-2">Google Pay / PhonePe बनाम ACC तुलना</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#f1f2f4] text-slate-700 border-b border-gray-200">
                    <tr>
                      <th className="p-2.5">फीचर</th>
                      <th className="p-2.5 text-red-600 font-bold">Google Pay / PhonePe</th>
                      <th className="p-2.5 text-[#2874f0] font-bold">ACC SWIS Portal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="p-2.5 font-semibold text-slate-800">प्लेटफॉर्म शुल्क</td>
                      <td className="p-2.5 text-red-600">₹1 से ₹3 एक्स्ट्रा चार्ज</td>
                      <td className="p-2.5 text-emerald-700 font-bold">₹0 (Zero Charges)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold text-slate-800">कमीशन / डिस्काउंट</td>
                      <td className="p-2.5 text-slate-500">नाम मात्र का कैशबैक (₹1-₹5)</td>
                      <td className="p-2.5 text-emerald-700 font-bold">3.30% पक्का फिक्स्ड कमीशन</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold text-slate-800">रेफरल इनकम</td>
                      <td className="p-2.5 text-slate-500">कूपन या स्क्रैच कार्ड</td>
                      <td className="p-2.5 text-[#2874f0] font-bold">₹150 प्रति रेफरल सीधा बैंक/UPI में</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONTENT: Disclaimer */}
      {tab === 'disclaimer' && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-amber-600">
            <ShieldAlert className="w-5 h-5" />
            <h2 className="text-lg font-bold text-slate-900">Disclaimer (कानूनी अस्वीकरण)</h2>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <p>
              1. <strong>कोई वित्तीय निवेश योजना नहीं:</strong> Achievers Club Community (ACC) किसी भी प्रकार की चिट-फंड, मनी सर्कुलेशन, पोंजी स्कीम, या फिक्स्ड रिटर्न देने वाली निवेश योजना नहीं है। सदस्य द्वारा दिया गया ₹249 केवल सॉफ्टवेयर पोर्टल व 🆔 एक्टिवेशन शुल्क है।
            </p>
            <p>
              2. <strong>कमीशन पर आधारित आय:</strong> SWIS में आय केवल वास्तविक यूटिलिटी बिलों और मोबाइल रिचार्ज के सफल लेन-देन पर मिलने वाले 3.30% कमीशन से होती है। TWIS में आय केवल सदस्यों द्वारा किए गए एक्टिव रेफरल्स (₹150 प्रति रेफरल) पर आधारित है।
            </p>
            <p>
              3. <strong>व्यक्तिगत प्रयास:</strong> किसी भी सदस्य की आय उनके व्यक्तिगत कार्य, टीम निर्माण, और रिचार्ज वॉल्यूम पर निर्भर करती है। ACC किसी निश्चित बिना काम किए आय की गारंटी नहीं देता।
            </p>
            <p>
              4. <strong>सत्यापन:</strong> किसी भी अनाधिकृत व्यक्ति को नकद राशि न दें। भुगतान केवल आधिकारिक UPI <code>santosh09patidar@gmail.com</code> पर ही करें।
            </p>
          </div>
        </div>
      )}

      {/* CONTENT: Products & Services (उत्पाद या सेवाएं) */}
      {tab === 'services' && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="border-b border-gray-100 pb-4">
            <span className="text-[10px] uppercase font-black bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-md border border-emerald-200">
              OFFICIAL PRODUCTS & PRICING
            </span>
            <h2 className="text-xl sm:text-2xl font-black font-display text-slate-900 mt-2">
              उत्पाद या सेवाएं (Products & Services) • पारदर्शी मूल्य व विवरण
            </h2>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Achievers Club Community (ACC) द्वारा अपने अधिकृत सदस्यों को प्रदान किए जाने वाले सभी डिजिटल उत्पादों, यूटिलिटी सेवाओं और पारदर्शी आय प्रणालियों की विस्तृत जानकारी।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Service 1: Membership Activation */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-md">
                  प्राथमिक सदस्यता (Core Product)
                </span>
                <span className="text-base sm:text-lg font-black text-amber-700 font-mono">
                  ₹249 <span className="text-[11px] font-normal text-slate-600">(One-Time)</span>
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                1. लाइफटाइम कम्युनिटी 🆔 सदस्यता (Lifetime Student Membership)
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                केवल ₹249 के एकमुश्त शुल्क में आजीवन सदस्यता। कोई वार्षिक या मासिक रिन्यूअल फीस नहीं। इसके अंतर्गत आपको तुरंत एक विशिष्ट ACC सदस्य ID (उदा. ACC249SWIS...) जारी की जाती है।
              </p>
              <ul className="text-[11px] text-slate-700 space-y-1 list-disc pl-4">
                <li>आजीवन सक्रियण (Lifetime Validity)</li>
                <li>शून्य रिन्यूअल चार्ज (Zero Renewal Fee)</li>
                <li>डिजिटल डैशबोर्ड एवं पासबुक ट्रैकिंग</li>
              </ul>
            </div>

            {/* Service 2: SWIS Recharge Utility */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md">
                  यूटिलिटी सर्विस (Utility Service)
                </span>
                <span className="text-base sm:text-lg font-black text-blue-700 font-mono">
                  3.30% <span className="text-[11px] font-normal text-slate-600">Fixed</span>
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                2. सेल्फ वर्क इनकम सिस्टम (SWIS - Recharge Commission)
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                सभी प्रमुख भारतीय टेलीकॉम ऑपरेटरों (Jio, Airtel, Vi, BSNL) एवं DTH पर 3.30% फिक्स्ड कमीशन। सदस्य स्वयं या परिवार व मित्रों का रिचार्ज कर तुरंत कमीशन सीधे वॉलेट में पाते हैं।
              </p>
              <ul className="text-[11px] text-slate-700 space-y-1 list-disc pl-4">
                <li>तुरंत कमीशन क्रेडिट (Instant Commission)</li>
                <li>सभी प्रीपेड एवं पोस्टपेड कनेक्शन समर्थित</li>
                <li>प्रति रिचार्ज ₹10 से ₹50 तक की निश्चित बचत</li>
              </ul>
            </div>

            {/* Service 3: TWIS Referral Hub */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-300 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                  रेफरल प्रोग्राम (Referral Hub)
                </span>
                <span className="text-base sm:text-lg font-black text-emerald-700 font-mono">
                  ₹150 <span className="text-[11px] font-normal text-slate-600">/ रेफरल</span>
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                3. टीम वर्क इनकम सिस्टम (TWIS - Refer & Earn)
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                प्रत्येक छात्र साथी को अपने रेफरल लिंक से जोड़ने पर ₹150 सीधी रेफरल आय। 2 मित्रों को जोड़ते ही ₹300 प्राप्त होते हैं, जिससे आपकी एक्टिवेशन लागत पहले ही दिन वसूल हो जाती है।
              </p>
              <ul className="text-[11px] text-slate-700 space-y-1 list-disc pl-4">
                <li>न्यूनतम निकासी मात्र ₹100</li>
                <li>दैनिक UPI / बैंक खाता ट्रांसफर (Daily Payout)</li>
                <li>असीमित रेफरल अवसर (No Earning Cap)</li>
              </ul>
            </div>

            {/* Service 4: Certified Digital ID Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-purple-50 to-violet-50 border-2 border-purple-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-md">
                  पहचान पत्र (Digital Identity)
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                  मुफ़्त (Free with ₹249)
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                4. प्रमाणित डिजिटल ID कार्ड (Certified QR ID Card)
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                क्यूआर कोड युक्त दोनों तरफ (Front & Back) का HD प्रिंट-रेडी डिजिटल पहचान पत्र। यह कार्ड आपकी प्रामाणिकता सिद्ध करता है और इसमें प्राइवेसी सुरक्षा फीचर्स अंतर्निहित हैं।
              </p>
              <ul className="text-[11px] text-slate-700 space-y-1 list-disc pl-4">
                <li>HD PNG डाउनलोड एवं डायरेक्ट प्रिंट विकल्प</li>
                <li>केवल कार्डधारक डाउनलोड कर सकता है (सुरक्षित)</li>
                <li>मोबाइल व ईमेल प्राइवेसी सुरक्षा टॉगल</li>
              </ul>
            </div>

            {/* Service 5: Official Android APK */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-cyan-50 to-sky-50 border-2 border-cyan-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded-md">
                  मोबाइल एप्लिकेशन (App Access)
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                  सत्यापित सदस्यों हेतु
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                5. अधिकृत Android APK डाउनलोड लिंक
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                सत्यापित सदस्यों के डैशबोर्ड में सीधे अधिकृत Android ऐप का सुरक्षित डाउनलोड लिंक उपलब्ध कराया जाता है, जिससे सदस्य 1-क्लिक में मोबाइल पर सभी सेवाएं उपयोग कर सकें।
              </p>
            </div>

            {/* Service 6: Community Chat & Helpdesk */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md">
                  कम्युनिटी नेटवर्क (Social Hub)
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                  24x7 Live
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                6. ACC MEMBER CHAT एवं सोशल हेल्प हब
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                कम्युनिटी के अन्य सक्रिय सदस्यों, स्पॉन्सर और ग्रुप एडमिन से 1-on-1 सुरक्षित बातचीत, फ़ोटो व वीडियो साझा करने का एन्क्रिप्टेड माध्यम।
              </p>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={onGoToRegister}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:brightness-110 text-slate-950 font-black text-sm rounded-xl shadow-md transition active:scale-95 cursor-pointer"
            >
              🚀 अभी सदस्यता लें — केवल ₹249 में एक्टिवेट करें
            </button>
          </div>
        </div>
      )}

      {/* CONTENT: Privacy Policy (गोपनीयता नीति) */}
      {tab === 'privacy' && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 space-y-5 shadow-sm">
          <div className="border-b border-gray-100 pb-3">
            <span className="text-[10px] uppercase font-black bg-blue-100 text-[#2874f0] px-2.5 py-0.5 rounded-md border border-blue-200">
              LEGAL & PRIVACY COMPLIANCE
            </span>
            <h2 className="text-xl sm:text-2xl font-black font-display text-slate-900 mt-1">
              गोपनीयता नीति (Privacy Policy)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              अंतिम अद्यतन: 2026 • डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम (DPDP Act) एवं Google AdSense मानकों के अनुरूप
            </p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-950">
              <strong className="block text-sm mb-1">संक्षेप में हमारी प्रतिबद्धता:</strong>
              Achievers Club Community (ACC) आपकी व्यक्तिगत जानकारी का सर्वोच्च सम्मान करता है। हम आपके डेटा को न तो बेचते हैं और न ही किसी तीसरे पक्ष के साथ अनैतिक रूप से साझा करते हैं।
            </div>

            <div className="space-y-1.5">
              <h3 className="font-bold text-slate-900 text-sm">
                1. हम कौन सा डेटा एकत्र करते हैं (Data Collection):
              </h3>
              <p>
                जब आप हमारी वेबसाइट पर रजिस्ट्रेशन करते हैं या फॉर्म भरते हैं, तो हम निम्नलिखित जानकारी सुरक्षित रूप से संग्रहीत करते हैं:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li><strong>व्यक्तिगत पहचान:</strong> आपका पूरा नाम, ईमेल आईडी, मोबाइल नंबर, व्हाट्सएप नंबर।</li>
                <li><strong>खाता विवरण:</strong> स्पॉन्सर आईडी, चयनित प्लान (SWIS / TWIS), ट्रांजैक्शन यूटीआर (UTR) संख्या।</li>
                <li><strong>स्थान व शिक्षा:</strong> शहर, राज्य, पिनकोड और शैक्षणिक योग्यता (छात्र पहचान हेतु)।</li>
                <li><strong>तकनीकी डेटा:</strong> इंटरनेट प्रोटोकॉल (IP) पता, ब्राउज़र का प्रकार, विज़िट समय और कुकीज़ (Cookies)।</li>
              </ul>
            </div>

            <div className="space-y-1.5">
              <h3 className="font-bold text-slate-900 text-sm">
                2. कुकीज़ एवं Google AdSense विज्ञापन नीति (Cookies & AdSense Compliance):
              </h3>
              <p>
                हमारी वेबसाइट उपयोगकर्ताओं के अनुभव को बेहतर बनाने और आगंतुकों के लिए प्रासंगिक सामग्री प्रदर्शित करने के लिए 'कुकीज़' (Cookies) का उपयोग कर सकती है:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li><strong>तृतीय-पक्ष विक्रेता:</strong> Google सहित तृतीय-पक्ष विक्रेता हमारी वेबसाइट पर उपयोगकर्ता के पूर्व विज़िट के आधार पर विज्ञापन (Ads) प्रदर्शित करने के लिए कुकीज़ (जैसे Google DoubleClick DART Cookie) का उपयोग कर सकते हैं।</li>
                <li><strong>उपयोगकर्ता विकल्प:</strong> उपयोगकर्ता <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold underline">Google Ad Settings</a> पर जाकर वैयक्तिकृत विज्ञापनों (Personalised Advertising) को किसी भी समय ऑप्ट-आउट कर सकते हैं।</li>
                <li><strong>लॉग फ़ाइलें:</strong> साइट विज़िट के सामान्य रुझानों का विश्लेषण करने, साइट व्यवस्थापन और सुरक्षा ऑडिट हेतु लॉग फ़ाइलें तैयार की जाती हैं।</li>
              </ul>
            </div>

            <div className="space-y-1.5">
              <h3 className="font-bold text-slate-900 text-sm">
                3. उपयोगकर्ता गोपनीयता नियंत्रण (User Privacy Controls):
              </h3>
              <p className="bg-amber-50 p-3 rounded-xl border border-amber-300 text-amber-950 font-medium">
                <strong>विशेष सुरक्षा नियम:</strong> केवल आपकी <strong>ACC सदस्य आईडी ({siteConfig.adminSignatoryName ? 'ACC249...' : 'ACC ID'})</strong> हमेशा सार्वजनिक पहचान के रूप में प्रदर्शित रहती है। बाकी सभी व्यक्तिगत विवरण (प्रोफाइल फोटो, नाम, मोबाइल नंबर, ईमेल, स्पॉन्सर आईडी, यूज़रनेम) आप अपने डैशबोर्ड व चैट प्राइवेसी सेटिंग्स से अपनी इच्छानुसार <strong>पब्लिक या मास्क/प्राइवेट</strong> रख सकते हैं।
              </p>
            </div>

            <div className="space-y-1.5">
              <h3 className="font-bold text-slate-900 text-sm">
                4. डेटा सुरक्षा व गैर-बिक्री आश्वासन (No-Sale Guarantee):
              </h3>
              <p>
                हम आपके किसी भी व्यक्तिगत या वित्तीय डेटा को विपणन या विज्ञापन उद्देश्यों के लिए किसी अन्य कंपनी को नहीं बेचते हैं। भुगतान सत्यापन के बाद आपके सभी विवरण एन्क्रिप्टेड सुरक्षित डेटाबेस में संग्रहित रहते हैं।
              </p>
            </div>

            <div className="space-y-1.5">
              <h3 className="font-bold text-slate-900 text-sm">
                5. संपर्क एवं डेटा संशोधन अनुरोध:
              </h3>
              <p>
                यदि आपके पास इस गोपनीयता नीति के संबंध में कोई प्रश्न है या आप अपने खाते की जानकारी को संशोधित अथवा हटाना चाहते हैं, तो आप हमारे आधिकारिक ईमेल <strong>{siteConfig.officialEmail || 'newuserhelpline@gmail.com'}</strong> अथवा Telegram <strong>@NEWUSERHELPLINE</strong> पर संपर्क कर सकते हैं।
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CONTENT: Terms & Conditions */}
      {tab === 'terms' && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 space-y-4 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Terms and Conditions (नियम और शर्तें)</h2>
          <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <p>
              1. <strong>पात्रता:</strong> ACC में शामिल होने के लिए सदस्य की आयु कम से कम 18 वर्ष या अभिभावक की सहमति होनी आवश्यक है।
            </p>
            <p>
              2. <strong>वन-टाइम एक्टिवेशन:</strong> ₹249 का भुगतान गैर-वापसी योग्य (Non-refundable) वन-टाइम सिस्टम एक्टिवेशन शुल्क है।
            </p>
            <p>
              3. <strong>निकासी नियम:</strong> वॉलेट से न्यूनतम निकासी सीमा ₹100 है। निकासी अनुरोध 24 से 48 व्यावसायिक घंटों के भीतर IMPS / UPI द्वारा संसाधित किए जाते हैं।
            </p>
            <p>
              4. <strong>आचार संहिता:</strong> किसी भी प्रकार की भ्रामक जानकारी, फर्जी पेमेंट रसीद या अनैतिक प्रचार पाए जाने पर सदस्य की 🆔 को बिना पूर्व सूचना के निरस्त किया जा सकता है।
            </p>
          </div>
        </div>
      )}

      {/* CONTENT: Contact Us (Help Section) */}
      {tab === 'contact' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Official Support Channels */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 space-y-5 shadow-sm">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-black bg-blue-100 text-[#2874f0] px-2.5 py-0.5 rounded-md border border-blue-200">
                  24x7 SUPPORT DESK
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
                  ✓ VERIFIED HELPDESK
                </span>
              </div>
              <h2 className="text-xl font-black font-display text-slate-900 mt-1">
                सपोर्ट हेल्पडेस्क एवं सहायता केंद्र
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Achievers Club Community (ACC) सहायता डेस्क - किसी भी समस्या या पूछताछ हेतु संपर्क करें।
              </p>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm">
              {/* 1. Official Support Email (Primary Channel) */}
              <div className="p-4 rounded-xl bg-gradient-to-b from-blue-50/80 to-indigo-50/50 border border-blue-200 shadow-[0_2px_6px_rgba(40,116,240,0.08)] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-b from-[#2874f0] to-[#1258c7] text-white flex items-center justify-center shadow-[0_2px_5px_rgba(40,116,240,0.35),inset_0_1px_0.5px_rgba(255,255,255,0.6)] shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10.5px] text-blue-900 font-bold uppercase tracking-wider block">
                        आधिकारिक सपोर्ट ईमेल (Email Support Desk):
                      </span>
                      <span className="font-mono-acc font-black text-slate-900 text-xs sm:text-sm">
                        {siteConfig.officialEmail || 'newuserhelpline@gmail.com'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <a
                    href={`mailto:${siteConfig.officialEmail || 'newuserhelpline@gmail.com'}?subject=ACC%20Support%20Help%20Request`}
                    className="flex-1 py-2 px-3 bg-gradient-to-b from-[#2874f0] to-[#1258c7] hover:from-[#1e63d8] hover:to-[#0f4bb0] text-white font-black text-xs rounded-xl shadow-[0_3px_8px_rgba(40,116,240,0.35),inset_0_1px_1px_rgba(255,255,255,0.4)] active:translate-y-0.5 flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>ईमेल भेजें (Send Mail)</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(siteConfig.officialEmail || 'newuserhelpline@gmail.com');
                      alert('ईमेल आईडी कॉपी हो गई: ' + (siteConfig.officialEmail || 'newuserhelpline@gmail.com'));
                    }}
                    className="py-2 px-3 bg-gradient-to-b from-white via-slate-50 to-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 shadow-[0_2px_4px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,1)] active:translate-y-0.5 flex items-center justify-center gap-1 transition cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5 text-blue-600" />
                    <span>कॉपी</span>
                  </button>
                </div>
              </div>

              {/* 2. Official Telegram Helpdesk (Primary Channel) */}
              <div className="p-4 rounded-xl bg-gradient-to-b from-sky-50/80 to-cyan-50/50 border border-sky-200 shadow-[0_2px_6px_rgba(34,158,217,0.08)] space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-b from-[#229ED9] to-[#1579a8] text-white flex items-center justify-center shadow-[0_2px_5px_rgba(34,158,217,0.35),inset_0_1px_0.5px_rgba(255,255,255,0.6)] shrink-0">
                    <Send className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10.5px] text-sky-900 font-bold uppercase tracking-wider block">
                      ऑफिशियल Telegram हेल्पडेस्क:
                    </span>
                    <span className="font-mono font-black text-slate-900 text-xs sm:text-sm">
                      {siteConfig.telegramLink || 'https://t.me/NEWUSERHELPLINE'}
                    </span>
                  </div>
                </div>

                <div className="pt-1">
                  <a
                    href={siteConfig.telegramLink || 'https://t.me/NEWUSERHELPLINE'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-3 bg-gradient-to-b from-[#229ED9] to-[#1579a8] hover:from-[#29aef1] hover:to-[#229ED9] text-white font-black text-xs rounded-xl shadow-[0_3px_8px_rgba(34,158,217,0.35),inset_0_1px_1px_rgba(255,255,255,0.4)] active:translate-y-0.5 flex items-center justify-center gap-2 transition cursor-pointer border border-cyan-400/40"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Telegram पर सहायता प्राप्त करें (@NEWUSERHELPLINE)</span>
                    <ExternalLink className="w-3 h-3 text-cyan-100" />
                  </a>
                </div>
              </div>

              {/* 3. WhatsApp Support - ONLY ACTIVE WHEN ADMIN ENABLES IT VIA ADMIN PANEL */}
              {siteConfig.showWhatsAppSupport ? (
                <div className="p-4 rounded-xl bg-gradient-to-b from-emerald-50/80 to-teal-50/50 border border-emerald-300 shadow-[0_2px_6px_rgba(16,185,129,0.1)] space-y-2 animate-fadeIn">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-b from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-[0_2px_5px_rgba(16,185,129,0.35),inset_0_1px_0.5px_rgba(255,255,255,0.6)] shrink-0">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10.5px] text-emerald-900 font-bold uppercase tracking-wider block">
                        WhatsApp सहायता डेस्क (Admin Verified):
                      </span>
                      <span className="font-mono-acc font-black text-slate-900 text-xs sm:text-sm">
                        {siteConfig.whatsappNumber || '+91 8877490845'}
                      </span>
                    </div>
                  </div>

                  <a
                    href={`https://api.whatsapp.com/send?phone=${cleanWhatsApp}&text=${encodeURIComponent('Namaste ACC Support, mujhe Achievers Club Community me sahayata chahiye.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-3 bg-gradient-to-b from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-xs rounded-xl shadow-[0_3px_8px_rgba(16,185,129,0.35),inset_0_1px_1px_rgba(255,255,255,0.4)] active:translate-y-0.5 flex items-center justify-center gap-1.5 transition cursor-pointer border border-emerald-400/40"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp पर चैट करें</span>
                    <ExternalLink className="w-3 h-3 text-emerald-200" />
                  </a>
                </div>
              ) : null}

              {/* 4. Phone Calling Support (Only if enabled) */}
              {(siteConfig.showCallSupport || siteConfig.showHelplineCallButton) && (
                <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-gray-200 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-b from-blue-500 to-blue-700 text-white flex items-center justify-center shrink-0">
                      <Phone className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold block">कॉलिंग हेल्पलाइन:</span>
                      <span className="font-mono-acc font-bold text-slate-800">{siteConfig.helplinePhone || '+91 8877490845'}</span>
                    </div>
                  </div>
                  <a
                    href={`tel:${cleanPhone}`}
                    className="py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-xs active:translate-y-0.5"
                  >
                    कॉल करें
                  </a>
                </div>
              )}

              {/* 5. Organization & Registered Address */}
              <div className="p-3.5 bg-slate-50/80 rounded-xl border border-gray-200 space-y-2">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-b from-indigo-500 to-indigo-700 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Building2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block font-bold">अधिकृत हस्ताक्षरकर्ता:</span>
                    <span className="font-bold text-slate-900 text-xs">
                      {siteConfig.adminSignatoryName || 'Vikas Kumar'} ({siteConfig.adminSignatoryTitle || 'Chief Administrator'})
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 pt-1 border-t border-gray-200/60">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-b from-rose-500 to-rose-700 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block font-bold">पंजीकृत कार्यालय पता:</span>
                    <span className="text-slate-800 text-xs leading-relaxed">
                      {siteConfig.officialAddress || 'Scheme No. 54, Vijay Nagar, Indore, Madhya Pradesh - 452001'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Contact Form */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-b from-[#2874f0] to-[#1258c7] text-white flex items-center justify-center shadow-xs">
                <Send className="w-3.5 h-3.5" />
              </div>
              <span>सपोर्ट टीम को सीधा संदेश भेजें</span>
            </h3>

            {contactSent ? (
              <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs text-center space-y-2 animate-fadeIn">
                <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-600" />
                <p className="font-black text-sm">संदेश प्राप्त हुआ!</p>
                <p className="text-slate-600 leading-relaxed">
                  हमारी सपोर्ट डेस्क टीम <strong>{siteConfig.officialEmail || 'newuserhelpline@gmail.com'}</strong> से जल्द आपसे संपर्क करेगी।
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitContact} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">आपका नाम</label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0]"
                    placeholder="उदा. Amit Sharma"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">मोबाइल नंबर</label>
                    <input
                      type="tel"
                      value={contactMobile}
                      onChange={(e) => setContactMobile(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0]"
                      placeholder="10 अंक"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">ईमेल</label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0]"
                      placeholder="Email"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">आपका प्रश्न / संदेश</label>
                  <textarea
                    rows={3}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0]"
                    placeholder="आप क्या सहायता चाहते हैं?"
                    required
                  />
                </div>

                {/* 3D Tactile Send Button */}
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-b from-[#fb641b] via-[#ea580c] to-[#c2410c] hover:from-[#ea580c] hover:to-[#9a3412] text-white font-black text-xs rounded-xl shadow-[0_3px_10px_rgba(251,100,27,0.35),inset_0_1.5px_1px_rgba(255,255,255,0.5)] border border-amber-300/40 active:translate-y-0.5 flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <div className="w-5 h-5 rounded-md bg-yellow-300 text-slate-950 flex items-center justify-center shrink-0 shadow-xs">
                    <Send className="w-3 h-3" />
                  </div>
                  <span>सपोर्ट संदेश भेजें (Submit Help Request)</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* CONTENT: Frequently Asked Questions (FAQ) with Client-Side Real-Time Search */}
      {tab === 'faq' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Client-Side Real-Time Search Bar Header */}
          <div className="bg-white border-2 border-blue-200/90 rounded-xl p-3.5 sm:p-4 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#2874f0] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={faqSearchQuery}
                  onChange={(e) => setFaqSearchQuery(e.target.value)}
                  placeholder="FAQ प्रश्नों में खोजें (उदा. SWIS, TWIS, 3.30%, ₹150, ₹249, पेआउट, ID कार्ड, UTR)..."
                  className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-gray-300 rounded-lg text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#2874f0] focus:ring-2 focus:ring-blue-100 focus:bg-white transition"
                  aria-label="FAQ प्रश्न खोजें"
                />
                {faqSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setFaqSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-full w-5 h-5 flex items-center justify-center text-xs transition cursor-pointer"
                    title="सर्च साफ करें"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Quick Topic Keyword Chips for Instant Real-Time Filtering */}
            <div className="flex items-center gap-1.5 flex-wrap text-xs pt-1 border-t border-gray-100 text-slate-500">
              <span className="font-semibold text-slate-600 text-[11px] shrink-0">त्वरित कीवर्ड्स:</span>
              {['SWIS', 'TWIS', '3.30%', '₹150', 'पेआउट', '₹249', 'ID कार्ड', 'माता-पिता का UPI'].map((chip) => {
                const isActive = faqSearchQuery.toLowerCase() === chip.toLowerCase();
                return (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setFaqSearchQuery(isActive ? '' : chip)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition cursor-pointer ${
                      isActive
                        ? 'bg-[#2874f0] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                    }`}
                  >
                    {chip}
                  </button>
                );
              })}
              {faqSearchQuery && (
                <button
                  type="button"
                  onClick={() => setFaqSearchQuery('')}
                  className="text-red-600 hover:text-red-700 hover:underline font-bold text-[11px] ml-auto cursor-pointer"
                >
                  रीसेट करें ✕
                </button>
              )}
            </div>
          </div>

          <FAQSection
            onGoToRegister={onGoToRegister}
            siteConfig={siteConfig}
            externalSearchQuery={faqSearchQuery}
            onSearchQueryChange={setFaqSearchQuery}
          />
        </div>
      )}
    </div>
  );
};
