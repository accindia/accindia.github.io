import React, { useState, useMemo, useEffect } from 'react';
import {
  HelpCircle,
  Search,
  ChevronDown,
  Zap,
  Users,
  CreditCard,
  Wallet,
  ShieldCheck,
  Sparkles,
  Phone,
  MessageCircle,
  ArrowRight,
  CheckCircle2,
  FileText,
  Clock,
  ExternalLink,
  Mail,
  Send,
} from 'lucide-react';
import { SiteConfig } from '../types';

export interface FAQItem {
  id: string;
  category: 'swis' | 'twis' | 'registration' | 'payout' | 'security';
  categoryLabel: string;
  question: string;
  questionEn: string;
  answer: string;
  highlights?: string[];
  tips?: string;
}

interface FAQSectionProps {
  onGoToRegister?: () => void;
  siteConfig?: SiteConfig;
  externalSearchQuery?: string;
  onSearchQueryChange?: (q: string) => void;
}

export const FAQ_DATA: FAQItem[] = [
  // --- SWIS QUESTIONS ---
  {
    id: 'swis-1',
    category: 'swis',
    categoryLabel: 'SWIS (सेल्फ वर्क)',
    question: 'SWIS (सेल्फ वर्क इनकम सिस्टम) क्या है और 3.30% कमीशन कैसे मिलता है?',
    questionEn: 'What is SWIS and how do I get 3.30% recharge cashback?',
    answer:
      'SWIS (Self Working Income System) ACC का दैनिक बचत एवं यूटिलिटी कैशबैक मॉडल है। जब आप अपने या अपने परिवार, दोस्तों व पड़ोसियों के किसी भी मोबाइल नंबर (Jio, Airtel, Vi, BSNL) या DTH का रिचार्ज करते हैं, तो आपको हर सफल ट्रांजैक्शन पर फ्लैट 3.30% फिक्स्ड कमीशन सीधे आपके ACC वॉलेट में तुरंत क्रेडिट कर दिया जाता है।',
    highlights: [
      'सभी टेलीकॉम ऑपरेटरों (Jio, Airtel, Vi, BSNL) पर फ्लैट 3.30% कमीशन',
      'DTH रिचार्ज (Tata Play, Dish TV, Sun Direct, Airtel) पर समान लाभ',
      'कैशबैक सेकंड्स में आपके डिजिटल वॉलेट में आ जाता है',
      'सालाना ₹2,000 से ₹6,000 तक की सीधी घरेलू बचत',
    ],
    tips: 'उदाहरण: ₹299 के रिचार्ज पर लगभग ₹10 तथा ₹1000 के मासिक रिचार्ज पर ₹33 की सीधी शुद्ध बचत होती है।',
  },
  {
    id: 'swis-2',
    category: 'swis',
    categoryLabel: 'SWIS (सेल्फ वर्क)',
    question: 'SWIS में किन-किन सेवाओं पर कमीशन मिलता है?',
    questionEn: 'Which services are covered under the SWIS cashback system?',
    answer:
      'SWIS के तहत दैनिक उपयोग की सभी प्रमुख डिजिटल बिलिंग सेवाएं शामिल हैं: मोबाइल प्रीपेड रिचार्ज, मोबाइल पोस्टपेड बिल, DTH रिचार्ज (सभी ऑपरेटर), बिजली बिल भुगतान, फास्टैग (FASTag) रिचार्ज, गैस सिलेंडर बुकिंग, पानी का बिल एवं ब्रॉडबैंड इंटरनेट बिल।',
    highlights: [
      'मोबाइल प्रीपेड & पोस्टपेड',
      'DTH & केबल टीवी रिचार्ज',
      'बिजली एवं पानी बिल भुगतान',
      'फास्टैग & ब्रॉडबैंड सेवाएं',
    ],
  },
  {
    id: 'swis-3',
    category: 'swis',
    categoryLabel: 'SWIS (सेल्फ वर्क)',
    question: 'क्या SWIS में रिचार्ज करने के लिए कोई अलग से छुपा हुआ चार्ज या शुल्क कटता है?',
    questionEn: 'Are there any hidden fees or convenience charges for recharging?',
    answer:
      'बिल्कुल नहीं! PhonePe, Paytm या Google Pay जैसे अन्य ऐप्स अब मोबाइल रिचार्ज पर ₹1 से ₹3 तक प्लेटफॉर्म फीस लेते हैं। इसके विपरीत ACC में कोई प्लेटफॉर्म फीस या सरचार्ज नहीं लिया जाता, बल्कि आपको 3.30% की अतिरिक्त बचत/कमीशन दिया जाता है।',
    highlights: [
      'शून्य प्लेटफॉर्म फीस (Zero Platform Fee)',
      'कोई छिपा हुआ शुल्क (Zero Hidden Surcharges) नहीं',
      'हर बार 100% पारदर्शी कैशबैक',
    ],
  },

  // --- TWIS QUESTIONS ---
  {
    id: 'twis-1',
    category: 'twis',
    categoryLabel: 'TWIS (टीम वर्क)',
    question: 'TWIS (टीम वर्क इनकम सिस्टम) क्या है और इससे बड़ी कमाई कैसे होती है?',
    questionEn: 'What is TWIS and how does the team referral model work?',
    answer:
      'TWIS (Team Working Income System) युवाओं और कॉलेज छात्रों के लिए बिना पूंजी के नेटवर्क बनाकर पार्ट-टाइम कमाई का अवसर है। जब आप अपने किसी मित्र या परिचित को अपने स्पॉन्सर आईडी/रेफरल लिंक से ACC में जोड़ते हैं, तो आपको तुरंत ₹150 प्रति डायरेक्ट रेफरल स्पॉन्सर बोनस मिलता है। साथ ही आपकी टीम द्वारा किए जाने वाले रिचार्ज और बिल पेमेंट्स पर भी आपको लाइफटाइम टीम इंसेंटिव प्राप्त होता है।',
    highlights: [
      'प्रति डायरेक्ट रेफरल ₹150 का फ्लैट स्पॉन्सर बोनस',
      'असीमित डायरेक्ट रेफरल (Unlimited Direct Sponsoring)',
      'टीम द्वारा किए गए रिचार्ज पर लाइफटाइम पैसिव इनकम',
      'विद्यार्थियों के लिए पढ़ाई के साथ-साथ आत्मनिर्भर बनने का जरिया',
    ],
    tips: 'यदि आप महीने में सिर्फ 20 नए साथियों को भी रेफर करते हैं, तो आप ₹3,000+ केवल स्पॉन्सर बोनस से कमा लेते हैं।',
  },
  {
    id: 'twis-2',
    category: 'twis',
    categoryLabel: 'TWIS (टीम वर्क)',
    question: 'प्रति रेफरल ₹150 का स्पॉन्सर बोनस कब और कैसे क्रेडिट होता है?',
    questionEn: 'When is the ₹150 referral bonus credited?',
    answer:
      'जैसे ही आपका आमंत्रित मित्र रजिस्ट्रेशन फॉर्म भरकर ₹249 का एक्टिवेशन शुल्क सफलतापूर्वक जमा करता है और उनकी आईडी वेरिफाई होती है, सिस्टम ऑटोमैटिकली आपके वॉलेट में ₹150 स्पॉन्सर कमीशन क्रेडिट कर देता है। इसकी रसीद और एंट्री आपके डैशबोर्ड के "रेफरल रिकॉर्ड" सेक्शन में लाइव दिखती है।',
    highlights: [
      'आईडी एक्टिवेशन के साथ तुरंत बोनस क्रेडिट',
      'डैशबोर्ड में पारदर्शी रेफरल हिस्ट्री और UTR स्टेटस',
      'क्रेडिट होते ही वॉलेट बैलेंस में तत्काल बढ़ोतरी',
    ],
  },
  {
    id: 'twis-3',
    category: 'twis',
    categoryLabel: 'TWIS (टीम वर्क)',
    question: 'क्या टीम बनाने या रेफरल करने का कोई अनिवार्य मासिक टारगेट है?',
    questionEn: 'Is there any monthly target or mandatory referral pressure?',
    answer:
      'नहीं, ACC कम्युनिटी में किसी प्रकार का कोई मासिक टारगेट या सेल्स प्रेशर नहीं होता। आप अपनी इच्छा और सुविधानुसार जब चाहें रेफर कर सकते हैं। यदि आप किसी को रेफर नहीं भी करते हैं, तो भी आप SWIS के तहत अपने व्यक्तिगत रिचार्ज पर 3.30% कमीशन जीवनभर लेते रह सकते हैं। आपकी सदस्यता कभी लैप्स नहीं होती।',
    highlights: [
      'कोई अनिवार्य मासिक टारगेट नहीं',
      'कोई आईडी एक्सपायरी या डिमोशन नहीं',
      'अपनी गति और समय के अनुसार काम करने की पूरी आजादी',
    ],
  },

  // --- REGISTRATION & ID QUESTIONS ---
  {
    id: 'reg-1',
    category: 'registration',
    categoryLabel: 'पंजीकरण & 🆔 कार्ड',
    question: 'ACC में रजिस्ट्रेशन कैसे करें और ₹249 की वन-टाइम फीस क्यों है?',
    questionEn: 'How to register on ACC and what is the ₹249 one-time activation fee for?',
    answer:
      'रजिस्ट्रेशन के लिए होमपेज पर "नया रजिस्ट्रेशन" बटन दबाएं। अपना पूरा नाम, व्हाट्सएप नंबर, ईमेल, राज्य और स्पॉन्सर आईडी भरें। आधिकारिक UPI QR कोड स्कैन करके ₹249 का भुगतान करें और 12 अंकों का UTR नंबर दर्ज करके सबमिट करें। यह ₹249 वन-टाइम लाइफटाइम एक्टिवेशन चार्ज है, जिसमें आपको आधिकारिक यूनिक डिजिटल 🆔 कार्ड, ट्रेनिंग वीडियो पोर्टल, वॉलेट खाता और 24x7 हेल्पलाइन का स्थायी एक्सेस मिलता है। इसके बाद कभी कोई रिन्यूअल फीस नहीं देनी होती।',
    highlights: [
      'सिर्फ एक बार ₹249 का लाइफटाइम एक्टिवेशन शुल्क',
      'कोई मासिक या वार्षिक रिन्यूअल फीस नहीं (No Renewal Fee)',
      'तुरंत आधिकारिक डिजिटल पहचान पत्र (Digital ID Card)',
      'वीडियो ट्रेनिंग मॉड्यूल व असीमित यूटिलिटी सर्विसेज एक्सेस',
    ],
  },
  {
    id: 'reg-2',
    category: 'registration',
    categoryLabel: 'पंजीकरण & 🆔 कार्ड',
    question: 'यूनिक ACC ID (Unique Member ID) का फॉर्मेट क्या है और यह कैसे बनती है?',
    questionEn: 'What is the format of the Unique ACC ID and how is it generated?',
    answer:
      'ACC की हर सदस्य आईडी एक विशेष सुरक्षित फॉर्मेट में जनरेट होती है: "ACC" + एक्टिवेशन फीस ("249") + प्लान कोड ("SWIS" / "TWIS" / "COMBO") + आपके नाम के 2 आद्यक्षर (Initials) + यूनिक सीरियल नंबर (उदा. ACC249SWISRK01)। यह आईडी राष्ट्रीय स्तर पर आपकी विशिष्ट डिजिटल पहचान होती है।',
    highlights: [
      'मानकीकृत फॉर्मेट: ACC249[PLAN][INITIALS][SERIAL]',
      'डुप्लीकेशन-प्रूफ और 100% सुरक्षित सिस्टम',
      'आईडी कार्ड, लॉगिन और रेफरल लिंक में एक समान उपयोग',
    ],
  },
  {
    id: 'reg-3',
    category: 'registration',
    categoryLabel: 'पंजीकरण & 🆔 कार्ड',
    question: 'डिजिटल ID कार्ड कैसे डाउनलोड करें और उस पर लगे QR कोड का क्या उपयोग है?',
    questionEn: 'How to download the digital ID card and what is the QR code for?',
    answer:
      'सफल रजिस्ट्रेशन के बाद आप "मेरा डिजिटल 🆔 कार्ड" विंडो खोलकर अपना फुल-कलर हाई-डेफिनिशन आईडी कार्ड देख सकते हैं और 1-क्लिक में PDF/PNG के रूप में डाउनलोड कर सकते हैं। कार्ड पर आपका विशेष QR कोड होता है, जिसे कोई भी फोन कैमरा से स्कैन करके आपकी आधिकारिक सदस्यता, नाम और एक्टिव स्टेटस तुरंत ऑनलाइन जांच सकता है।',
    highlights: [
      '1-क्लिक हाई-रेजोल्यूशन कार्ड डाउनलोड',
      'डायनामिक वेरिफिकेशन क्यूआर कोड (Instant Verification)',
      'व्यक्तिगत प्राइवेसी सेटिंग्स (मोबाइल नंबर व पता छिपाने की सुविधा)',
    ],
  },

  // --- PAYOUT & WALLET QUESTIONS ---
  {
    id: 'payout-1',
    category: 'payout',
    categoryLabel: 'पेआउट & वॉलेट',
    question: 'वॉलेट से कमाई अपने बैंक खाते या UPI में कैसे निकालें (Withdrawal Process)?',
    questionEn: 'How to withdraw earnings from wallet to bank account or UPI?',
    answer:
      'अपनी कमाई निकालना बेहद आसान है: अपने "विद्यार्थी डैशबोर्ड" में लॉगिन करें और "पेआउट / निकासी" टैब पर जाएं। आप जिस माध्यम में पैसा चाहते हैं (UPI आईडी जैसे GPay/PhonePe या बैंक खाता नंबर + IFSC कोड) दर्ज करें, निकासी राशि लिखें और "अनुरोध सबमिट करें" पर क्लिक करें।',
    highlights: [
      'UPI (PhonePe, Google Pay, Paytm, BHIM) के माध्यम से ट्रांसफर',
      'सीधे किसी भी राष्ट्रीयकृत/प्राइवेट बैंक खाते में NEFT/IMPS',
      'पारदर्शी ट्रांजैक्शन स्टेटस और UTR अपडेट',
    ],
  },
  {
    id: 'payout-2',
    category: 'payout',
    categoryLabel: 'पेआउट & वॉलेट',
    question: 'न्यूनतम निकासी सीमा (Minimum Withdrawal Limit) कितनी है?',
    questionEn: 'What is the minimum withdrawal threshold?',
    answer:
      'ACC में न्यूनतम निकासी सीमा मात्र ₹100 रखी गई है ताकि छात्रों और नए सदस्यों को अपनी छोटी-सी कमाई निकालने के लिए भी लंबा इंतजार न करना पड़े। जैसे ही आपके वॉलेट में ₹100 या उससे अधिक जमा होते हैं, आप तुरंत निकासी अनुरोध लगा सकते हैं।',
    highlights: [
      'मात्र ₹100 की न्यूनतम निकासी सीमा (Minimum ₹100)',
      'छात्रों के लिए सबसे सुविधाजनक और आसान सीमा',
      'निकासी पर कोई अस्वाभाविक होल्ड या लॉक-इन नहीं',
    ],
  },
  {
    id: 'payout-3',
    category: 'payout',
    categoryLabel: 'पेआउट & वॉलेट',
    question: 'विड्रॉल रिक्वेस्ट के बाद पैसा बैंक या UPI में आने में कितना समय लगता है?',
    questionEn: 'How long does it take for the payout to reach my bank account?',
    answer:
      'निकासी अनुरोध सबमिट होने के बाद हमारे अधिकृत वित्तीय व्यवस्थापक द्वारा सत्यापन किया जाता है और सामान्यतः 2 से 24 कार्य घंटों (Working Hours) के भीतर राशि सीधे आपके बैंक खाते या UPI में क्रेडिट हो जाती है। पेमेंट ट्रांसफर होने के बाद UTR नंबर आपके डैशबोर्ड में प्रदर्शित हो जाता है।',
    highlights: [
      '2 से 24 घंटे में तेज ट्रांसफर (Fast Settlement)',
      'प्रत्येक ट्रांसफर का आधिकारिक UTR संदर्भ रिकॉर्ड',
      'संडे व अवकाश के दिन भी नियमित प्रोसेसिंग',
    ],
  },
  {
    id: 'payout-4',
    category: 'payout',
    categoryLabel: 'पेआउट & वॉलेट',
    question: 'क्या पेआउट निकासी पर कोई डिडक्शन या प्रोसेसिंग चार्ज काटा जाता है?',
    questionEn: 'Are there any deductions or processing fees on payouts?',
    answer:
      'ACC अपने सदस्यों की पूरी कमाई सुरक्षित रखने के लिए प्रतिबद्ध है। हमारी ओर से निकासी पर कोई छिपा हुआ कमीशन या मेंटेनेंस शुल्क नहीं काटा जाता। आपकी मेहनत की 100% अर्जित राशि आपके खाते में भेजी जाती है।',
    highlights: [
      'शून्य हिडन चार्ज (No Hidden Charges)',
      'पूरी अर्जित राशि का 100% ट्रांसफर',
    ],
  },

  // --- SECURITY & SUPPORT QUESTIONS ---
  {
    id: 'sec-1',
    category: 'security',
    categoryLabel: 'सुरक्षा & सपोर्ट',
    question: 'क्या ACC कम्युनिटी वैध, सुरक्षित और कानूनी रूप से सही है?',
    questionEn: 'Is Achievers Club Community (ACC) legal and safe?',
    answer:
      'हाँ, Achievers Club Community एक पारदर्शी, नैतिक और डिजिटल यूटिलिटी डिस्काउंट एवं एफिलिएट मॉडल पर आधारित मंच है। यहाँ कोई भी फेक इनवेस्टमेंट, ब्याज या पोंजी स्कीम नहीं चलाई जाती। सदस्य ₹249 का वैध यूटिलिटी चार्ज देकर डिजिटल टूल्स, आईडी कार्ड और वास्तविक कैशबैक सेवाएं प्राप्त करते हैं। सभी लेन-देन बैंकिंग चैनलों (UPI व बैंक ट्रांसफर) के माध्यम से पारदर्शी रूप से संपन्न होते हैं।',
    highlights: [
      'कोई पोंजी या इनवेस्टमेंट स्कीम नहीं (Real Utility Platform)',
      'बैंकिंग व UPI चैनल से 100% ऑडिटेबल लेन-देन',
      'छात्रों के कौशल व आत्मनिर्भरता को समर्पित मंच',
    ],
  },
  {
    id: 'sec-2',
    category: 'security',
    categoryLabel: 'सुरक्षा & सपोर्ट',
    question: 'यदि रजिस्ट्रेशन या पेआउट में कोई समस्या आए तो सहायता कैसे लें?',
    questionEn: 'How do I contact customer support if I face any issue?',
    answer:
      'हमारी समर्पित सपोर्ट टीम आपकी सहायता के लिए सदैव उपलब्ध है। आप हमारे हेल्पलाइन नंबर पर कॉल कर सकते हैं, सीधे व्हाट्सएप चैट पर संदेश भेज सकते हैं, या वेबसाइट के "संपर्क करें" फॉर्म में अपना प्रश्न लिखकर भेज सकते हैं। हमारी टीम सामान्यतः 30 मिनट से 2 घंटे में समाधान उपलब्ध कराती है।',
    highlights: [
      'व्हाट्सएप हेल्पलाइन: 24x7 संदेश सहायता',
      'कॉल सपोर्ट: सुबह 9:00 बजे से शाम 8:00 बजे तक',
      'ईमेल सपोर्ट व शिकायत निवारण प्रकोष्ठ',
    ],
  },
];

export const FAQSection: React.FC<FAQSectionProps> = ({
  onGoToRegister,
  siteConfig,
  externalSearchQuery,
  onSearchQueryChange,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [internalSearchQuery, setInternalSearchQuery] = useState<string>('');

  const searchQuery = externalSearchQuery !== undefined ? externalSearchQuery : internalSearchQuery;
  const handleSearchChange = (q: string) => {
    if (externalSearchQuery !== undefined && onSearchQueryChange) {
      onSearchQueryChange(q);
    } else {
      setInternalSearchQuery(q);
    }
  };

  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    'swis-1': true, // Open first SWIS question by default
    'twis-1': true, // Open first TWIS question by default
  });

  const toggleAccordion = (id: string) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const expandAll = () => {
    const allOpen: Record<string, boolean> = {};
    FAQ_DATA.forEach((item) => {
      allOpen[item.id] = true;
    });
    setOpenIds(allOpen);
  };

  const collapseAll = () => {
    setOpenIds({});
  };

  // Filter items by category and search
  const filteredFAQs = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return FAQ_DATA.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      if (!matchesCategory) return false;

      if (!q) return true;
      return (
        item.question.toLowerCase().includes(q) ||
        item.questionEn.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        (item.tips && item.tips.toLowerCase().includes(q)) ||
        (item.highlights && item.highlights.some((h) => h.toLowerCase().includes(q)))
      );
    });
  }, [activeCategory, searchQuery]);

  // Auto-expand all matching questions when user types a search query
  useEffect(() => {
    if (searchQuery.trim()) {
      const allMatching: Record<string, boolean> = {};
      filteredFAQs.forEach((item) => {
        allMatching[item.id] = true;
      });
      setOpenIds(allMatching);
    }
  }, [searchQuery, filteredFAQs]);

  const categories = [
    { id: 'all', label: 'सभी सवाल (All)', count: FAQ_DATA.length, icon: <HelpCircle className="w-3.5 h-3.5" /> },
    {
      id: 'swis',
      label: '⚡ SWIS (3.30% रिचार्ज)',
      count: FAQ_DATA.filter((i) => i.category === 'swis').length,
      icon: <Zap className="w-3.5 h-3.5 text-amber-500" />,
    },
    {
      id: 'twis',
      label: '👥 TWIS (टीम & ₹150 रेफरल)',
      count: FAQ_DATA.filter((i) => i.category === 'twis').length,
      icon: <Users className="w-3.5 h-3.5 text-blue-500" />,
    },
    {
      id: 'registration',
      label: '📝 रजिस्ट्रेशन & 🆔 कार्ड',
      count: FAQ_DATA.filter((i) => i.category === 'registration').length,
      icon: <CreditCard className="w-3.5 h-3.5 text-indigo-500" />,
    },
    {
      id: 'payout',
      label: '💳 पेआउट & वॉलेट (₹100)',
      count: FAQ_DATA.filter((i) => i.category === 'payout').length,
      icon: <Wallet className="w-3.5 h-3.5 text-emerald-500" />,
    },
    {
      id: 'security',
      label: '🔒 सुरक्षा & सपोर्ट',
      count: FAQ_DATA.filter((i) => i.category === 'security').length,
      icon: <ShieldCheck className="w-3.5 h-3.5 text-rose-500" />,
    },
  ];

  const helpline = siteConfig?.helplinePhone || '+91 8877490845';
  const whatsapp = siteConfig?.whatsappNumber || '+91 8877490845';
  const cleanWhatsApp = whatsapp.replace(/[^0-9]/g, '');
  const cleanPhone = helpline.replace(/[^0-9]/g, '');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#2874f0] to-[#1c52b8] text-white rounded-xl p-5 sm:p-7 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-6">
          <HelpCircle className="w-64 h-64 text-white" />
        </div>
        <div className="relative z-10 max-w-2xl space-y-2.5">
          <div className="inline-flex items-center gap-1.5 bg-yellow-400 text-slate-900 text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-xs uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-slate-900 fill-slate-900" />
            <span>ACC नॉलेज बेस • Frequently Asked Questions</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight text-white">
            अक्सर पूछे जाने वाले सवाल (FAQ)
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            SWIS 3.30% रिचार्ज कैशबैक, TWIS ₹150 रेफरल बोनस, ₹249 वन-टाइम रजिस्ट्रेशन, डिजिटल ID कार्ड और त्वरित पेआउट संबंधी सभी प्रश्नों के संपूर्ण और आधिकारिक उत्तर।
          </p>
        </div>

        {/* Quick Highlights Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4 mt-2 border-t border-blue-400/30">
          <div className="bg-white/10 backdrop-blur-xs rounded-lg p-2.5 text-center">
            <p className="text-[10px] text-blue-200 uppercase font-semibold">SWIS कैशबैक</p>
            <p className="text-base sm:text-lg font-black text-yellow-300">3.30% फिक्स</p>
          </div>
          <div className="bg-white/10 backdrop-blur-xs rounded-lg p-2.5 text-center">
            <p className="text-[10px] text-blue-200 uppercase font-semibold">TWIS रेफरल</p>
            <p className="text-base sm:text-lg font-black text-emerald-300">₹150 प्रति सदस्य</p>
          </div>
          <div className="bg-white/10 backdrop-blur-xs rounded-lg p-2.5 text-center">
            <p className="text-[10px] text-blue-200 uppercase font-semibold">न्यूनतम निकासी</p>
            <p className="text-base sm:text-lg font-black text-cyan-200">मात्र ₹100</p>
          </div>
          <div className="bg-white/10 backdrop-blur-xs rounded-lg p-2.5 text-center">
            <p className="text-[10px] text-blue-200 uppercase font-semibold">पेआउट समय</p>
            <p className="text-base sm:text-lg font-black text-white">2 - 24 घंटे</p>
          </div>
        </div>
      </div>

      {/* Search and Category Filter Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="अपने प्रश्न या कीवर्ड से खोजें (उदा. SWIS, TWIS, 3.30%, ₹150, पेआउट, UTR, ID कार्ड)..."
            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-gray-300 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#2874f0] focus:ring-2 focus:ring-blue-100 transition"
          />
          {searchQuery && (
            <button
              onClick={() => handleSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-700 bg-slate-200 rounded-full w-5 h-5 flex items-center justify-center cursor-pointer"
              title="सर्च साफ करें"
            >
              ×
            </button>
          )}
        </div>

        {/* Category Pills & Bulk Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-gray-100">
          <div className="flex flex-wrap gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {categories.map((cat) => {
              const isSelected = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'bg-[#2874f0] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  {cat.icon}
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 ml-auto">
            <button
              onClick={expandAll}
              className="hover:text-[#2874f0] hover:underline font-semibold cursor-pointer py-1"
            >
              सभी खोलें
            </button>
            <span>•</span>
            <button
              onClick={collapseAll}
              className="hover:text-[#2874f0] hover:underline font-semibold cursor-pointer py-1"
            >
              सभी बंद करें
            </button>
          </div>
        </div>
      </div>

      {/* Results Count & Query Notice */}
      {searchQuery && (
        <div className="flex items-center justify-between text-xs text-slate-600 px-1">
          <span>
            सर्च परिणाम: <strong>"{searchQuery}"</strong> के लिए <strong>{filteredFAQs.length}</strong> सवाल मिले
          </span>
          <button
            onClick={() => handleSearchChange('')}
            className="text-[#2874f0] font-bold hover:underline cursor-pointer"
          >
            सभी दिखाएँ
          </button>
        </div>
      )}

      {/* FAQ Accordion List */}
      <div className="space-y-3">
        {filteredFAQs.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-10 text-center space-y-3 shadow-xs">
            <HelpCircle className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-sm sm:text-base">
              आपके खोजे गए शब्द से कोई प्रश्न नहीं मिला
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              कृपया अन्य कीवर्ड का उपयोग करें या सीधे हमारे हेल्पलाइन सपोर्ट नंबर पर संपर्क करके अपनी शंका का समाधान करें।
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => {
                  handleSearchChange('');
                  setActiveCategory('all');
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-lg transition cursor-pointer"
              >
                सभी प्रश्न देखें
              </button>
              <a
                href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent('नमस्ते ACC सपोर्ट, मुझे जानकारी चाहिए: ' + searchQuery)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition inline-flex items-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>व्हाट्सएप पर पूछें</span>
              </a>
            </div>
          </div>
        ) : (
          filteredFAQs.map((item, index) => {
            const isOpen = !!openIds[item.id];
            return (
              <div
                key={item.id}
                className={`bg-white border rounded-xl overflow-hidden transition-all duration-200 shadow-xs ${
                  isOpen ? 'border-[#2874f0]/60 ring-1 ring-blue-100' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {/* Accordion Question Header */}
                <button
                  type="button"
                  onClick={() => toggleAccordion(item.id)}
                  className="w-full text-left p-4 sm:p-4.5 flex items-start justify-between gap-3 cursor-pointer group"
                  aria-expanded={isOpen}
                >
                  <div className="space-y-1.5 pr-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-50 text-[#2874f0] border border-blue-200/60 font-mono">
                        Q{index + 1} • {item.categoryLabel}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-[#2874f0] transition-colors leading-snug">
                      {item.question}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {item.questionEn}
                    </p>
                  </div>

                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? 'bg-blue-100 text-[#2874f0] rotate-180' : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {/* Accordion Answer Content */}
                {isOpen && (
                  <div className="px-4 pb-4 sm:px-4.5 sm:pb-4.5 pt-1 border-t border-slate-100 text-xs sm:text-sm text-slate-700 space-y-3.5 bg-slate-50/50">
                    <p className="leading-relaxed text-slate-800">
                      {item.answer}
                    </p>

                    {/* Highlights bullet points */}
                    {item.highlights && item.highlights.length > 0 && (
                      <div className="bg-white border border-gray-200/80 rounded-lg p-3 space-y-2">
                        <p className="text-[11px] font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5 text-blue-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>मुख्य विशेषताएं व लाभ (Key Takeaways):</span>
                        </p>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-700">
                          {item.highlights.map((highlight, hIdx) => (
                            <li key={hIdx} className="flex items-start gap-1.5">
                              <span className="text-emerald-600 font-bold shrink-0 mt-0.5">✓</span>
                              <span className="leading-snug">{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Pro Tip note */}
                    {item.tips && (
                      <div className="bg-amber-50/80 border border-amber-200 rounded-lg p-2.5 text-xs text-amber-900 flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="font-bold">अचीवर्स क्लब टिप: </strong>
                          <span>{item.tips}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Bottom CTA Card: Still Have Questions or Ready to Join? */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="space-y-1.5 text-center md:text-left">
          <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>24x7 अधिकृत सहायता डेस्क उपलब्ध</span>
          </div>
          <h4 className="text-base sm:text-lg font-black text-slate-900">
            क्या आपके मन में कोई अन्य सवाल है?
          </h4>
          <p className="text-xs text-slate-600 max-w-lg">
            हमारी सपोर्ट टीम आपकी मदद के लिए हमेशा तत्पर है। आप व्हाट्सएप पर चैट कर सकते हैं या सीधे हेल्पलाइन नंबर पर संपर्क कर सकते हैं।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0 justify-center">
          {/* Telegram Support Button */}
          {siteConfig?.showTelegramSupport !== false && (
            <a
              href={siteConfig?.telegramLink || 'https://t.me/NEWUSERHELPLINE'}
              target="_blank"
              rel="noopener noreferrer"
              className="relative inline-flex items-center gap-2 px-3.5 py-2.5 bg-gradient-to-b from-[#229ed9] via-[#0088cc] to-[#006699] hover:from-[#2eb0ee] hover:to-[#005580] text-white font-black text-xs rounded-xl shadow-[0_3px_0_#004466,0_6px_12px_rgba(0,136,204,0.3)] active:translate-y-0.5 active:shadow-[0_1px_0_#004466] transition-all cursor-pointer whitespace-nowrap"
            >
              <div className="w-5 h-5 rounded-md bg-white/20 border-t border-white/40 flex items-center justify-center shadow-inner">
                <Send className="w-3.5 h-3.5 text-white" />
              </div>
              <span>टेलीग्राम सहायता</span>
            </a>
          )}

          {/* Email Support Button */}
          {siteConfig?.showEmailSupport !== false && (
            <a
              href={`mailto:${siteConfig?.officialEmail || 'newuserhelpline@gmail.com'}`}
              className="relative inline-flex items-center gap-2 px-3.5 py-2.5 bg-gradient-to-b from-[#2874f0] via-[#1a65dc] to-[#0f4eb8] hover:from-[#367ff5] hover:to-[#1258c7] text-white font-black text-xs rounded-xl shadow-[0_3px_0_#0a3782,0_6px_12px_rgba(40,116,240,0.3)] active:translate-y-0.5 active:shadow-[0_1px_0_#0a3782] transition-all cursor-pointer whitespace-nowrap"
            >
              <div className="w-5 h-5 rounded-md bg-white/20 border-t border-white/40 flex items-center justify-center shadow-inner">
                <Mail className="w-3.5 h-3.5 text-white" />
              </div>
              <span>ईमेल हेल्प</span>
            </a>
          )}

          {/* WhatsApp Support Button - only if enabled in Admin Panel */}
          {siteConfig?.showWhatsAppSupport === true && (
            <a
              href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent('नमस्ते ACC सपोर्ट टीम, मुझे प्लान व सिस्टम के बारे में जानकारी चाहिए।')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="relative inline-flex items-center gap-2 px-3.5 py-2.5 bg-gradient-to-b from-[#25D366] via-[#1ebe5b] to-[#128C7E] hover:from-[#2be66f] hover:to-[#0f7267] text-white font-black text-xs rounded-xl shadow-[0_3px_0_#075E54,0_6px_12px_rgba(37,211,102,0.3)] active:translate-y-0.5 active:shadow-[0_1px_0_#075E54] transition-all cursor-pointer whitespace-nowrap"
            >
              <div className="w-5 h-5 rounded-md bg-white/20 border-t border-white/40 flex items-center justify-center shadow-inner">
                <MessageCircle className="w-3.5 h-3.5 text-white fill-white" />
              </div>
              <span>व्हाट्सएप</span>
            </a>
          )}

          {/* Helpline Phone Button */}
          {siteConfig?.showCallSupport !== false && (
            <a
              href={`tel:${cleanPhone}`}
              className="relative inline-flex items-center gap-2 px-3.5 py-2.5 bg-gradient-to-b from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 text-slate-800 font-black text-xs rounded-xl border border-gray-300 shadow-[0_2px_0_#cbd5e1] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer whitespace-nowrap"
            >
              <div className="w-5 h-5 rounded-md bg-slate-300/60 flex items-center justify-center">
                <Phone className="w-3.5 h-3.5 text-slate-700" />
              </div>
              <span>{helpline}</span>
            </a>
          )}

          {onGoToRegister && (
            <button
              type="button"
              onClick={onGoToRegister}
              className="relative inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-b from-[#fb641b] via-[#ea580c] to-[#c2410c] hover:from-[#ff752b] hover:to-[#b03608] text-white font-black text-xs rounded-xl shadow-[0_3px_0_#7c2d12,0_6px_12px_rgba(251,100,27,0.35)] active:translate-y-0.5 active:shadow-[0_1px_0_#7c2d12] transition-all cursor-pointer whitespace-nowrap"
            >
              <div className="w-5 h-5 rounded-md bg-white/20 border-t border-white/40 flex items-center justify-center shadow-inner">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              </div>
              <span>रजिस्ट्रेशन करें (₹{siteConfig?.activationFee || 249})</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
