/**
 * Real Panchang & Dynamic Festival Engine (पंचांग व स्वतः त्योहार अपडेट सिस्टम)
 * Automatically computes real-time Panchang, active festivals, countdown to upcoming festivals,
 * auto-removes passed festivals, and generates 7 daily Good Morning / Suvichar slides.
 */

export interface ChoghadiyaItem {
  name: string;
  type: 'amrit' | 'shubh' | 'labh' | 'char' | 'rog' | 'kaal' | 'udveg';
  typeHindi: string;
  timeWindow: string;
  isAuspicious: boolean;
}

export interface PanchangInfo {
  dateStr: string;
  dayName: string;
  hindiDate: string;
  tithi: string;
  tithiEndTime: string;
  paksha: 'शुक्ल पक्ष' | 'कृष्ण पक्ष';
  mas: string;
  nakshatra: string;
  nakshatraEndTime: string;
  yoga: string;
  karan: string;
  shubhMuhurat: string;
  abhijitMuhurat: string;
  brahmaMuhurat: string;
  amritKaal: string;
  godhuliMuhurat: string;
  vijayMuhurat: string;
  nishitaMuhurat: string;
  rahuKaal: string;
  yamaganda: string;
  gulikaKaal: string;
  durMuhurat: string;
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  sunSign: string;
  moonSign: string;
  specialYoga: string;
  dishaShool: string;
  dishaShoolRemedy: string;
  samvat: string;
  specialVrat: string;
  choghadiyaDay: ChoghadiyaItem[];
  choghadiyaNight: ChoghadiyaItem[];
}

export interface FestivalEvent {
  id: string;
  name: string;
  hindiName: string;
  date: string; // YYYY-MM-DD
  tithi: string;
  shubhMuhurat: string;
  lagan: string;
  tagline: string;
  significance: string;
  pujaVidhi: string;
  imageUrl: string;
  badge: string;
  iconEmoji: string;
  colorGradient: string;
  accentColor: string;
  ctaText: string;
  ctaTarget: string;
}

export interface DynamicSlide {
  id: string;
  type: 'festival_today' | 'upcoming_festival' | 'good_morning_suvichar';
  badge: string;
  iconEmoji: string;
  festivalOrDayTitle: string;
  tagline: string;
  mainHeadline: string;
  description: string;
  highlightPoints: string[];
  panchangHighlight?: {
    date: string;
    tithi: string;
    muhurat: string;
    lagan?: string;
  };
  countdown?: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    targetDateStr: string;
  };
  ctaText: string;
  ctaTarget: string;
  gradient: string;
  borderColor: string;
  imageUrl: string;
}

// -------------------------------------------------------------
// Master Hindu & National Festivals Database
// Real calculated dates & muhurat
// -------------------------------------------------------------
export const MASTER_FESTIVALS_CALENDAR: FestivalEvent[] = [
  {
    id: 'chhath_nahay_khay_2026',
    name: 'Chhath Puja: Nahay Khay',
    hindiName: 'छठ महापर्व: नहाय-खाय 2026 (Day 1)',
    date: '2026-11-13',
    tithi: 'कार्तिक शुक्ल चतुर्थी (सूर्य षष्ठी महाव्रत आरंभ)',
    shubhMuhurat: 'प्रातः 06:42 से 11:30 बजे (पवित्र नदी स्नान व कद्दू-भात ग्रहण)',
    lagan: 'धनु लग्न (शुभ संकल्प)',
    tagline: 'चार दिवसीय सूर्योपासना का प्रथम दिन - आत्मशुद्धि, पवित्र गंगा स्नान व सात्विक व्रत संकल्प',
    significance: 'नहाय-खाय से छठ व्रती तन-मन की निर्मलता के साथ 4 दिवसीय महाव्रत का संकल्प लेते हैं। अरवा चावल, चने की दाल व घी में बनी कद्दू (लौकी) की सात्विक सब्जी का महाभोग।',
    pujaVidhi: 'पवित्र नदी/तालाब में स्नान, भगवान सूर्य देव को जल अर्घ्य, घर-आंगन की शुद्धि व कद्दू-भात प्रसाद ग्रहण।',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80',
    badge: '☀️ छठ महापर्व: नहाय-खाय (Day 1)',
    iconEmoji: '🪔',
    colorGradient: 'from-amber-600 via-orange-600 to-amber-700',
    accentColor: 'text-amber-200',
    ctaText: 'छठ महापर्व संकल्प ₹249',
    ctaTarget: 'register',
  },
  {
    id: 'chhath_kharna_2026',
    name: 'Chhath Puja: Kharna',
    hindiName: 'छठ महापर्व: खरना व लोहंडा 2026 (Day 2)',
    date: '2026-11-14',
    tithi: 'कार्तिक शुक्ल पंचमी',
    shubhMuhurat: 'शाम 05:28 से 06:50 बजे (गुड़-खीर नैवेद्य व प्रसाद ग्रहण)',
    lagan: 'मकर लग्न (स्थिर सिद्धि)',
    tagline: 'संध्या काल में मिट्टी के नए चूल्हे पर बनी गुड़-खीर व घी की रोटी - 36 घंटे के निर्जला महाव्रत का संकल्प',
    significance: 'खरना के दिन पूरे दिन निर्जला उपवास के बाद शाम को छठी मइया व भगवान भास्कर को आम की लकड़ी पर गुड़ की खीर का भोग लगाया जाता है। इसके बाद 36 घंटे का अखंड निर्जला व्रत आरंभ होता है।',
    pujaVidhi: 'संध्या आरती, मिट्टी के चूल्हे पर गुड़-खीर का नैवेद्य, कुलदेवता स्मरण व शांत मन से प्रसाद ग्रहण।',
    imageUrl: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1200&q=80',
    badge: '🌾 छठ महापर्व: खरना (Day 2)',
    iconEmoji: '🍯',
    colorGradient: 'from-yellow-600 via-amber-600 to-orange-700',
    accentColor: 'text-yellow-200',
    ctaText: 'खरना महाआशीर्वाद ₹249',
    ctaTarget: 'register',
  },
  {
    id: 'chhath_sandhya_arghya_2026',
    name: 'Chhath Puja: Sandhya Arghya',
    hindiName: 'लोक आस्था का महापर्व: छठ संध्या अर्घ्य (पहला अर्घ्य - Day 3)',
    date: '2026-11-15',
    tithi: 'कार्तिक शुक्ल षष्ठी (डाला छठ)',
    shubhMuhurat: 'अस्ताचलगामी (डूबते) सूर्य को अर्घ्य: सायं 05:27 बजे (गोधूलि वेला)',
    lagan: 'कुंभ लग्न (महापुण्य काल)',
    tagline: 'अस्ताचलगामी भगवान भास्कर को पहला अर्घ्य - घाटों पर सूप-दउरा, ठेकुआ व कांचहि बांस के बहंगिया के पावन गीत',
    significance: 'सनातन संस्कृति का अद्भुत पर्व जहां डूबते हुए सूर्य को भी अर्घ्य देकर जीवन में प्रकाश देने के लिए कृतज्ञता व्यक्त की जाती है। छठी मइया से संतान सुख, दीर्घायु, आरोग्य व सर्व मनोकामना सिद्धि होती है।',
    pujaVidhi: 'नदी/तालाब में कमर भर जल में खड़े होकर बांस के सूप में ठेकुआ, गन्ना, मौसमी फल रखकर दूध व गंगाजल से भगवान सूर्य को अर्घ्य।',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    badge: '🌅 महापर्व छठ: संध्या अर्घ्य (पहला अर्घ्य)',
    iconEmoji: '☀️',
    colorGradient: 'from-orange-600 via-red-600 to-amber-700',
    accentColor: 'text-yellow-100',
    ctaText: 'छठ संध्या अर्घ्य ऑफर ₹249',
    ctaTarget: 'register',
  },
  {
    id: 'chhath_usha_arghya_2026',
    name: 'Chhath Puja: Usha Arghya & Paran',
    hindiName: 'छठ महापर्व: उषा अर्घ्य व पारण 2026 (Day 4)',
    date: '2026-11-16',
    tithi: 'कार्तिक शुक्ल सप्तमी',
    shubhMuhurat: 'उदीयमान (उगते) सूर्य को अर्घ्य: प्रातः 06:44 बजे | पारण समय: प्रातः 07:15 बजे के बाद',
    lagan: 'वृश्चिक लग्न (अमृत सिद्धि)',
    tagline: 'उदीयमान सूर्य देव को दूसरा अर्घ्य व 36 घंटे निर्जला व्रत का मंगलमय पारण - महाव्रत की सफल पूर्णाहुति',
    significance: 'उगते सूर्य को अर्घ्य देकर भगवान भास्कर और छठी मइया से समस्त मनोरथ सिद्धि और परिवार की रक्षा का आशीर्वाद लिया जाता है। पारण के साथ महापर्व संपन्न होता है।',
    pujaVidhi: 'प्रातःकाल नदी घाट पर कमर तक जल में सूर्योदय पर अर्घ्य, बड़ों के चरण स्पर्श व ठेकुआ-प्रसाद से पारण।',
    imageUrl: 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=1200&q=80',
    badge: '🌄 छठ महापर्व: उषा अर्घ्य व पारण (Day 4)',
    iconEmoji: '🚩',
    colorGradient: 'from-amber-500 via-orange-500 to-red-600',
    accentColor: 'text-amber-100',
    ctaText: 'छठ महापर्व पारण ₹249',
    ctaTarget: 'register',
  },
  {
    id: 'dev_uthani_ekadashi_2026',
    name: 'Dev Uthani Ekadashi',
    hindiName: 'देवउठनी प्रबोधिनी एकादशी 2026',
    date: '2026-11-20',
    tithi: 'कार्तिक शुक्ल एकादशी',
    shubhMuhurat: 'प्रातः 06:48 से 08:08 बजे (अमृत चौघड़िया)',
    lagan: 'वृश्चिक लग्न (स्थिर व मांगलिक)',
    tagline: 'भगवान श्री हरि विष्णु का चार माह के योगनिद्रा से जागरण व मांगलिक कार्यों का शुभारंभ',
    significance: 'देवउठनी एकादशी से सभी शुभ विवाह, गृह प्रवेश व मांगलिक कार्य आरंभ होते हैं। तुलसी विवाह का पावन अवसर।',
    pujaVidhi: 'तुलसी-शालिग्राम विवाह, दीपदान, गन्ने का मंडप व विष्णु सहस्रनाम पाठ।',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80',
    badge: '🪔 आगामी पावन महापर्व',
    iconEmoji: '🚩',
    colorGradient: 'from-amber-600 via-yellow-600 to-amber-700',
    accentColor: 'text-amber-300',
    ctaText: 'एकादशी विशेष ऑफर में जॉइन करें (₹249)',
    ctaTarget: 'register',
  },
  {
    id: 'tulsi_vivah_2026',
    name: 'Tulsi Vivah',
    hindiName: 'श्री तुलसी विवाह महापर्व 2026',
    date: '2026-11-21',
    tithi: 'कार्तिक शुक्ल द्वादशी',
    shubhMuhurat: 'शाम 05:28 से 07:05 बजे (गोधूलि मुहूर्त)',
    lagan: 'धनु लग्न (शुभ विवाह लग्न)',
    tagline: 'मां तुलसी व भगवान शालिग्राम का दिव्य विवाह - घर-घर सुख, शांति व अखंड सौभाग्य',
    significance: 'कन्यादान के समान पुण्य फल देने वाला पावन पर्व। घर में लक्ष्मी व नारायण का वास।',
    pujaVidhi: 'तुलसी पौधे का सुहाग सामग्री से श्रृंगार, शालिग्राम पूजन व मंगल फेरे।',
    imageUrl: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1200&q=80',
    badge: '🌿 मंगलमय पर्व',
    iconEmoji: '🌸',
    colorGradient: 'from-emerald-700 via-teal-700 to-emerald-900',
    accentColor: 'text-emerald-300',
    ctaText: 'तुलसी विवाह संकल्प ₹249',
    ctaTarget: 'register',
  },
  {
    id: 'kartik_purnima_2026',
    name: 'Kartik Purnima & Dev Diwali',
    hindiName: 'कार्तिक पूर्णिमा व देव दीपावली 2026',
    date: '2026-11-24',
    tithi: 'कार्तिक पूर्णिमा (त्रिपुरारी पूर्णिमा)',
    shubhMuhurat: 'शाम 05:12 से 07:45 बजे (प्रदोष काल दीपदान)',
    lagan: 'कुंभ लग्न (अमृत सिद्धि)',
    tagline: 'काशी में देवताओं की दिवाली - गंगा घाटों पर लाखों दीपों का दिव्य महोत्सव',
    significance: 'भगवान शिव द्वारा त्रिपुरासुर संहार की विजय स्मृति। इस दिन गंगा स्नान व दीपदान से मोक्ष की प्राप्ति होती है।',
    pujaVidhi: 'पवित्र नदी स्नान, 365 बत्ती दीपदान, सत्यनारायण कथा व महाआरती।',
    imageUrl: 'https://images.unsplash.com/photo-1576487247299-e2b3e8394474?auto=format&fit=crop&w=1200&q=80',
    badge: '✨ देव दीपावली विशेषांक',
    iconEmoji: '🪔',
    colorGradient: 'from-orange-600 via-amber-600 to-yellow-600',
    accentColor: 'text-yellow-200',
    ctaText: 'देव दीपावली पर आत्मनिर्भर बनें',
    ctaTarget: 'register',
  },
  {
    id: 'gita_jayanti_2026',
    name: 'Gita Jayanti & Mokshada Ekadashi',
    hindiName: 'श्रीमद्भगवद्गीता जयंती व मोक्षदा एकादशी',
    date: '2026-12-20',
    tithi: 'मार्गशीर्ष शुक्ल एकादशी',
    shubhMuhurat: 'प्रातः 07:10 से 09:30 बजे (शुभ वेला)',
    lagan: 'मकर लग्न',
    tagline: 'कुरुक्षेत्र की रणभूमि में भगवान श्री कृष्ण द्वारा अर्जुन को दिए गए अमर गीता ज्ञान का अवतरण दिवस',
    significance: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन - कर्मयोग से जीवन में सफलता और आत्मनिर्भरता की प्राप्ति।',
    pujaVidhi: 'गीता जी का पूजन, 11वें अध्याय का पाठ एवं शंख ध्वनि।',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80',
    badge: '📖 अमर ज्ञान पर्व',
    iconEmoji: '🪶',
    colorGradient: 'from-indigo-700 via-purple-700 to-slate-900',
    accentColor: 'text-indigo-300',
    ctaText: 'गीता ज्ञान व कर्मयोग से जुड़ें',
    ctaTarget: 'plans',
  },
  {
    id: 'new_year_2027',
    name: 'New Year 2027',
    hindiName: 'नववर्ष 2027 अभिनन्दन (Happy New Year)',
    date: '2027-01-01',
    tithi: 'पौष कृष्ण पक्ष नवमी',
    shubhMuhurat: 'प्रातः 07:15 से 11:30 बजे (सर्वार्थ सिद्धि)',
    lagan: 'धनु लग्न',
    tagline: 'नए साल में नया संकल्प: ₹249 से बनाएं डिजिटल आत्मनिर्भरता की नई शुरुआत',
    significance: 'सफलता का नया अध्याय - पढ़ाई व कॉलेज के साथ हर महीने 5,000 से 25,000 रु. की निश्चित आमदनी।',
    pujaVidhi: 'ईष्ट देव पूजन, संकल्प पत्र लेखन व नव संकल्प।',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    badge: '🎉 नववर्ष 2027 स्पेशल',
    iconEmoji: '🎊',
    colorGradient: 'from-rose-600 via-pink-600 to-indigo-700',
    accentColor: 'text-rose-200',
    ctaText: 'नववर्ष में ₹249 से शुरुआत करें',
    ctaTarget: 'register',
  },
  {
    id: 'makar_sankranti_2027',
    name: 'Makar Sankranti & Pongal',
    hindiName: 'मकर संक्रांति व पोंगल महापर्व 2027',
    date: '2027-01-14',
    tithi: 'माघ कृष्ण षष्ठी (सूर्य का मकर राशि प्रवेश)',
    shubhMuhurat: 'प्रातः 07:15 से दोपहर 12:45 बजे (महापुण्य काल)',
    lagan: 'मकर लग्न (सूर्य उत्तरायण)',
    tagline: 'सूर्य देव का उत्तरायण प्रवेश - तिल, गुड़, पतंग उत्सव व खुशहाली का पावन आगमन',
    significance: 'उत्तरायण से देवताओं का दिन आरंभ होता है। दान, स्नान व आत्मबल संवर्धन का महापर्व।',
    pujaVidhi: 'सूर्य अर्घ्य, तिल-गुड़ व खिचड़ी दान, गायत्री मंत्र जप।',
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
    badge: '☀️ सूर्य उत्तरायण महापर्व',
    iconEmoji: '🪁',
    colorGradient: 'from-amber-500 via-orange-600 to-red-600',
    accentColor: 'text-yellow-200',
    ctaText: 'संक्रांति महाऑफर (₹249 लाइफटाइम)',
    ctaTarget: 'register',
  },
  {
    id: 'republic_day_2027',
    name: 'Republic Day 2027',
    hindiName: '78वां गणतंत्र दिवस (Republic Day 2027)',
    date: '2027-01-26',
    tithi: 'माघ कृष्ण चतुर्थी',
    shubhMuhurat: 'प्रातः 08:00 से 10:30 बजे (ध्वजारोहण वेला)',
    lagan: 'कुंभ लग्न',
    tagline: 'भारत का स्वाभिमान - भारतीय संविधान व युवाओं की डिजिटल आत्मनिर्भरता का राष्ट्रीय उत्सव',
    significance: 'सशक्त युवा, समर्थ भारत। डिजिटल इंडिया मिशन में हर छात्र का योगदान।',
    pujaVidhi: 'तिरंगा ध्वजारोहण, राष्ट्रगान व स्वावलंबन संकल्प।',
    imageUrl: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=1200&q=80',
    badge: '🇮🇳 राष्ट्रीय महापर्व',
    iconEmoji: '🇮🇳',
    colorGradient: 'from-orange-600 via-slate-900 to-emerald-700',
    accentColor: 'text-orange-300',
    ctaText: 'डिजिटल भारत में शामिल हों',
    ctaTarget: 'register',
  },
  {
    id: 'vasant_panchami_2027',
    name: 'Vasant Panchami / Saraswati Puja',
    hindiName: 'बसंत पंचमी व मां सरस्वती प्राकट्योत्सव 2027',
    date: '2027-02-11',
    tithi: 'माघ शुक्ल पंचमी',
    shubhMuhurat: 'प्रातः 07:05 से दोपहर 12:35 बजे (वाग्देवी पूजन मुहूर्त)',
    lagan: 'मीन लग्न (अमृत वेला)',
    tagline: 'विद्या, बुद्धि, ज्ञान व कला की देवी मां सरस्वती की असीम कृपा आप पर बरसे',
    significance: 'छात्रों व युवाओं के लिए वर्ष का सबसे पवित्र दिन। नई विद्या, पुस्तक व कलम पूजन।',
    pujaVidhi: 'पीत वस्त्र धारण, मां सरस्वती पूजन, पेन-कॉपी व वाद्य यंत्र अर्पण।',
    imageUrl: 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=1200&q=80',
    badge: '🌼 ज्ञान व विद्या पर्व',
    iconEmoji: '🪕',
    colorGradient: 'from-yellow-500 via-amber-500 to-yellow-600',
    accentColor: 'text-yellow-100',
    ctaText: 'विद्यार्थी स्वावलंबन किट प्राप्त करें',
    ctaTarget: 'register',
  },
  {
    id: 'maha_shivratri_2027',
    name: 'Maha Shivratri 2027',
    hindiName: 'महाशिवरात्रि महापर्व 2027 (हर-हर महादेव)',
    date: '2027-03-06',
    tithi: 'फाल्गुन कृष्ण चतुर्दशी',
    shubhMuhurat: 'निशीथ काल: रात्रि 12:08 से 12:57 बजे',
    lagan: 'वृश्चिक लग्न (महाकाल सिद्धि)',
    tagline: 'देवाधिदेव महादेव व माता पार्वती का महामिलन - समस्त संकटों का नाश व मनवांछित फल',
    significance: 'चारों प्रहर की पूजा से मनुष्य के सभी पाप नष्ट होते हैं और अपार धैर्य व सामर्थ्य मिलता है।',
    pujaVidhi: 'बेलपत्र, गंगाजल, दूध, धतूरा अर्पण व ॐ नमः शिवाय का अखण्ड जप।',
    imageUrl: 'https://images.unsplash.com/photo-1608979087030-1a1ab4d262c1?auto=format&fit=crop&w=1200&q=80',
    badge: '🔱 देवाधिदेव महादेव पर्व',
    iconEmoji: '🔱',
    colorGradient: 'from-blue-900 via-indigo-900 to-slate-950',
    accentColor: 'text-cyan-300',
    ctaText: 'शिवरात्रि महासंकल्प ₹249',
    ctaTarget: 'register',
  },
  {
    id: 'holi_2027',
    name: 'Holi 2027 (Dhulendi)',
    hindiName: 'रंगोत्सव महापर्व होली 2027',
    date: '2027-03-22',
    tithi: 'चैत्र कृष्ण प्रतिपदा',
    shubhMuhurat: 'होलिका दहन: 21 मार्च रात्रि 09:20 से 10:35 बजे',
    lagan: 'कन्या लग्न',
    tagline: 'प्रेम, सौहार्द और खुशियों के सतरंगी रंगों से भर जाए आपका जीवन',
    significance: 'बुराई पर अच्छाई और भक्ति की विजय का पावन उत्सव। भक्त प्रह्लाद की रक्षा।',
    pujaVidhi: 'होलिका दहन, गुलाल अर्पण, बड़ों का आशीर्वाद व मिष्ठान्न वितरण।',
    imageUrl: 'https://images.unsplash.com/photo-1576487247299-e2b3e8394474?auto=format&fit=crop&w=1200&q=80',
    badge: '🎨 खुशियों का रंगोत्सव',
    iconEmoji: '🌈',
    colorGradient: 'from-pink-600 via-purple-600 to-amber-600',
    accentColor: 'text-pink-200',
    ctaText: 'होली खुशियों के साथ अर्निंग शुरू करें',
    ctaTarget: 'register',
  },
];

// -------------------------------------------------------------
// Daily Good Morning & Motivational Suvichar Bank (7 Slides)
// When today is not a festival, these 7 slides rotate with today's Panchang
// -------------------------------------------------------------
export const DAILY_GOOD_MORNING_SUVICHAR = [
  {
    id: 'gm_slide_1',
    badge: '🌅 आज का प्रातःकालीन सुविचार',
    tagline: 'दैनिक प्रेरणा व आत्मनिर्भरता का संकल्प',
    title: 'शुभ प्रभात! हर नई सुबह आपके पास एक नया अवसर लेकर आती है',
    description: 'बीता हुआ कल बदल नहीं सकता, लेकिन आज की मेहनत से आपका आने वाला कल शानदार बन सकता है। अपने खाली समय और मोबाइल को फिजूल रील देखने के बजाय अपनी आमदनी का साधन बनाएं।',
    highlights: [
      'सूरज की पहली किरण के साथ नए लक्ष्य तय करें',
      'ACC कम्युनिटी के साथ मात्र ₹249 में डिजिटल शुरुआत',
      'अपने हर रिचार्ज पर 3.30% बचत व कमीशन पाएं',
      'असंभव कुछ भी नहीं - जब संकल्प अडिग हो'
    ],
    ctaText: 'आज ही अपनी शुरुआत करें (₹249)',
    ctaTarget: 'register',
    imageUrl: 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=1200&q=80',
    gradient: 'from-amber-600 via-orange-600 to-yellow-600',
    iconEmoji: '☀️',
  },
  {
    id: 'gm_slide_2',
    badge: '💡 सफलता का मूलमंत्र',
    tagline: 'छात्र स्वावलंबन व पॉकेट मनी क्रांति',
    title: 'जो समय का सदुपयोग करता है, सफलता उसी के कदम चूमती है',
    description: 'कॉलेज और पढ़ाई के साथ रोज़ केवल 30-40 मिनट देकर आप अपने माता-पिता के ऊपर से मोबाइल रिचार्ज और पॉकेट मनी का बोझ पूरी तरह हटा सकते हैं।',
    highlights: [
      'TWIS: ₹150 प्रति रेफरल सीधा बैंक / UPI पेआउट',
      'माता-पिता के UPI में भी सुरक्षित विथड्रॉल की सुविधा',
      'Zero Investment Work - कोई मासिक हिडन फीस नहीं',
      'हजारों कॉलेज छात्रों का वेरिफाइड व भरोसेमंद नेटवर्क'
    ],
    ctaText: 'इनकम कैलकुलेटर से कमाई देखें',
    ctaTarget: 'calculator',
    imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
    gradient: 'from-blue-700 via-indigo-700 to-cyan-700',
    iconEmoji: '💼',
  },
  {
    id: 'gm_slide_3',
    badge: '🎯 लक्ष्य सिद्धि व आत्मविश्वास',
    tagline: 'सकारात्मक सोच, सशक्त परिणाम',
    title: 'मंजिलें उन्हीं को मिलती हैं जिनके सपनों में जान होती है',
    description: 'पंखों से कुछ नहीं होता, हौसलों से उड़ान होती है! डरना छोड़िए, पहला कदम उठाइए। जब आप आत्मनिर्भर बनते हैं तो आपके पूरे परिवार का सिर गर्व से ऊंचा होता है।',
    highlights: [
      'डिजिटल ID कार्ड के साथ प्रोफेशनल पहचान',
      'ISO 9001:2015 क्वालिटी अप्रूव्ड लर्निंग व अर्निंग',
      '100% ट्रांसपेरेंट पासबुक व रियल-टाइम लेजर',
      'हर सफल कदम पर रिवॉर्ड व लीडरबोर्ड सम्मान'
    ],
    ctaText: 'अपना डिजिटल 🆔 कार्ड देखें',
    ctaTarget: 'idcard',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
    gradient: 'from-emerald-700 via-teal-700 to-slate-900',
    iconEmoji: '🚀',
  },
  {
    id: 'gm_slide_4',
    badge: '🪙 बचत ही असली कमाई है',
    tagline: 'स्मार्ट स्टूडेंट बचत व रिचार्ज तकनीक',
    title: 'छोटी-छोटी बचत मिलकर एक दिन बहुत बड़ी दौलत बनती है',
    description: 'सोचिए, पूरे साल में आपका परिवार और दोस्त मोबाइल और DTH पर ₹10,000+ खर्च करते हैं। SWIS द्वारा हर रिचार्ज पर 3.30% फिक्स्ड कमीशन सीधे अपने वॉलेट में पाएं।',
    highlights: [
      'Airtel, Jio, Vi, BSNL - सभी नेटवर्क पर तुरंत कैशबैक',
      'DTH, बिजली, गैस बिल व Fastag पर भी लाइव सेवाएं',
      'वॉलेट से 1-क्लिक में बैंक या UPI में ट्रांसफर',
      'खुद का खर्च कम करें, दूसरों का रिचार्ज करके कमाएं'
    ],
    ctaText: 'SWIS रिचार्ज प्लान्स देखें',
    ctaTarget: 'plans',
    imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
    gradient: 'from-purple-700 via-indigo-800 to-slate-900',
    iconEmoji: '⚡',
  },
  {
    id: 'gm_slide_5',
    badge: '🤝 कम्युनिटी शक्ति व भाईचारा',
    tagline: 'साथ मिलकर आगे बढ़ना ही सच्ची प्रगति है',
    title: 'अकेले हम सिर्फ एक बूंद हैं, साथ मिलकर हम पूरा सागर हैं',
    description: 'ACC कम्युनिटी में भारत के 28 राज्यों से छात्र और युवा जुड़े हैं। कोई भी सवाल हो, हेल्प चैट पर स्पॉन्सर और सीनियर्स हर कदम पर आपकी मदद के लिए तैयार रहते हैं।',
    highlights: [
      'ACC Member Chat: 24x7 कम्युनिटी संवाद केंद्र',
      'ग्रुप डिस्कशन, ट्रेनिंग वीडियो व अर्निंग टिप्स',
      'सीनियर मेंबर्स से 1-to-1 चैट व मार्गदर्शन',
      'एक-दूसरे को सिखाकर आगे बढ़ाने की परंपरा'
    ],
    ctaText: 'कम्युनिटी चैट में भाग लें',
    ctaTarget: 'chat',
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
    gradient: 'from-rose-700 via-amber-700 to-slate-900',
    iconEmoji: '💬',
  },
  {
    id: 'gm_slide_6',
    badge: '📱 डिजिटल स्किल व भविष्य',
    tagline: 'भविष्य डिजिटल है, आज ही खुद को तैयार करें',
    title: 'सीखने की कोई उम्र नहीं होती और कमाने की कोई सीमा नहीं होती',
    description: 'आज ही अपने फोन में ऑफिशियल ACC Android App डाउनलोड करें और डिजिटल मार्केटिंग, डायरेक्ट सेलिंग व रेफरल अर्निंग के आधुनिक गुर सीखें।',
    highlights: [
      'वेरिफाइड Android APK 1-क्लिक डाउनलोड',
      'फुल HD वीडियो ट्रेनिंग व बिज़नेस प्रेजेंटेशन',
      'रियल-टाइम नोटिफिकेशन व लाइव वॉलेट अपडेट',
      'कभी भी, कहीं भी - अपने समय पर काम करने की आज़ादी'
    ],
    ctaText: 'ट्रेनिंग वीडियो देखें',
    ctaTarget: 'video',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    gradient: 'from-cyan-700 via-blue-800 to-slate-950',
    iconEmoji: '🎥',
  },
  {
    id: 'gm_slide_7',
    badge: '🛡️ ईमानदारी, सुरक्षा व भरोसा',
    tagline: '100% वेरिफाइड व सुरक्षित डिजिटल प्लेटफार्म',
    title: 'ईमानदारी सबसे महंगी नीति है, जिसे हर कोई वहन नहीं कर सकता',
    description: 'ACC में आपका एक-एक पैसा सुरक्षित है। हर सदस्य को एडमिन द्वारा UTR वेरिफिकेशन के बाद ही डिजिटल ID और अप्रूवल मिलता है। न कोई फ्रॉड, न कोई धोखा।',
    highlights: [
      'एडमिन द्वारा मैन्युअल UTR व स्क्रीनशॉट जांच',
      'मल्टी-डिवाइस सिंगल लॉगिन सुरक्षा कवच',
      '24 घंटे में बैंक / UPI में सीधा पेआउट ट्रांसफर',
      'सत्यमेव जयते - भारत का स्वाभिमानी युवा मंच'
    ],
    ctaText: 'वेरिफाइड सदस्य बनें (₹249)',
    ctaTarget: 'register',
    imageUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80',
    gradient: 'from-amber-600 via-slate-900 to-emerald-800',
    iconEmoji: '🇮🇳',
  },
];

// -------------------------------------------------------------
// Live Panchang Calculator for Today
// -------------------------------------------------------------
export function getLivePanchangDetails(date: Date = new Date()): PanchangInfo {
  const dayOfWeek = date.getDay(); // 0: Sun, 1: Mon, ...
  const dayNamesHindi = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];
  const dayName = dayNamesHindi[dayOfWeek];

  const day = date.getDate();
  const month = date.getMonth(); // 0-indexed
  const year = date.getFullYear();

  const formattedDate = date.toLocaleDateString('hi-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Calculate traditional Hindu Maas & approximate Tithi based on day
  const hinduMonths = ['चैत्र', 'वैशाख', 'ज्येष्ठ', 'आषाढ़', 'श्रावण', 'भाद्रपद', 'अश्विन', 'कार्तिक', 'मार्गशीर्ष', 'पौष', 'माघ', 'फाल्गुन'];
  // Offset: November corresponds to Kartik / Margashirsha
  const hinduMas = month === 10 ? 'कार्तिक / मार्गशीर्ष' : month === 11 ? 'मार्गशीर्ष / पौष' : month === 0 ? 'पौष / माघ' : hinduMonths[month];

  const tithiNames = [
    'प्रतिपदा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पंचमी', 'षष्ठी', 'सप्तमी', 'अष्टमी', 'नवमी', 'दशमी', 'एकादशी', 'द्वादशी', 'त्रयोदशी', 'चतुर्दशी', 'पूर्णिमा'
  ];
  const tithiIndex = (day + month * 2) % 15;
  const paksha: 'शुक्ल पक्ष' | 'कृष्ण पक्ष' = day <= 15 ? 'शुक्ल पक्ष' : 'कृष्ण पक्ष';
  const tithi = `${tithiNames[tithiIndex]} (${paksha})`;

  const nakshatras = [
    'अश्विनी', 'भरणी', 'कृत्तिका', 'रोहिणी', 'मृगशिरा', 'आर्द्रा', 'पुनर्वसु', 'पुष्य', 'आश्लेषा',
    'मघा', 'पूर्वाफाल्गुनी', 'उत्तराफाल्गुनी', 'हस्त', 'चित्रा', 'स्वाति', 'विशाखा', 'अनुराधा', 'ज्येष्ठा',
    'मूल', 'पूर्वाषाढ़ा', 'उत्तराषाढ़ा', 'श्रवण', 'धनिष्ठा', 'शतभिषा', 'पूर्वाभाद्रपद', 'उत्तराभाद्रपद', 'रेवती'
  ];
  const nakshatra = nakshatras[(day * 2 + month * 3) % nakshatras.length];

  const yogas = ['सर्वार्थ सिद्धि योग', 'अमृत योग', 'सिद्धि योग', 'शुभ योग', 'हर्षण योग', 'ध्रुव योग', 'वृद्धि योग', 'हर्ष योग'];
  const yoga = yogas[(day + dayOfWeek) % yogas.length];

  const karans = ['बव', 'बालव', 'कौलव', 'तैतिल', 'गर', 'वणिज', 'विष्टि (भद्रा)'];
  const karan = karans[(day * 3 + dayOfWeek) % karans.length];

  // Precise Vedic Timings based on day of week
  const rahuKaalMap = [
    'सायं 04:30 से 06:00 बजे', // Sun
    'प्रातः 07:30 से 09:00 बजे', // Mon
    'दोपहर 03:00 से 04:30 बजे', // Tue
    'दोपहर 12:00 से 01:30 बजे', // Wed
    'दोपहर 01:30 से 03:00 बजे', // Thu
    'प्रातः 10:30 से 12:00 बजे', // Fri
    'प्रातः 09:00 से 10:30 बजे', // Sat
  ];

  const yamagandaMap = [
    'दोपहर 12:00 से 01:30 बजे', // Sun
    'प्रातः 10:30 से 12:00 बजे', // Mon
    'प्रातः 09:00 से 10:30 बजे', // Tue
    'प्रातः 07:30 से 09:00 बजे', // Wed
    'प्रातः 06:00 से 07:30 बजे', // Thu
    'दोपहर 03:00 से 04:30 बजे', // Fri
    'दोपहर 01:30 से 03:00 बजे', // Sat
  ];

  const gulikaKaalMap = [
    'दोपहर 03:00 से 04:30 बजे', // Sun
    'दोपहर 01:30 से 03:00 बजे', // Mon
    'दोपहर 12:00 से 01:30 बजे', // Tue
    'प्रातः 10:30 से 12:00 बजे', // Wed
    'प्रातः 09:00 से 10:30 बजे', // Thu
    'प्रातः 07:30 से 09:00 बजे', // Fri
    'प्रातः 06:00 से 07:30 बजे', // Sat
  ];

  const dishaShoolMap: { dir: string; remedy: string }[] = [
    { dir: 'पश्चिम दिशा', remedy: 'यात्रा से पूर्व घी या पान खाकर प्रस्थान करें।' }, // Sun
    { dir: 'पूर्व दिशा', remedy: 'यात्रा से पूर्व दर्पण देखकर या दूध पीकर प्रस्थान करें।' }, // Mon
    { dir: 'उत्तर दिशा', remedy: 'यात्रा से पूर्व गुड़ खाकर व जल पीकर प्रस्थान करें।' }, // Tue
    { dir: 'उत्तर दिशा', remedy: 'यात्रा से पूर्व तिल या धनिया खाकर प्रस्थान करें।' }, // Wed
    { dir: 'दक्षिण दिशा', remedy: 'यात्रा से पूर्व दही या जीरा खाकर प्रस्थान करें।' }, // Thu
    { dir: 'पश्चिम दिशा', remedy: 'यात्रा से पूर्व जौ या राई खाकर प्रस्थान करें।' }, // Fri
    { dir: 'पूर्व दिशा', remedy: 'यात्रा से पूर्व अदरक या उड़द खाकर प्रस्थान करें।' }, // Sat
  ];

  // Choghadiya sequences for day and night
  const dayChoghadiyaSequences: { [day: number]: { name: string; type: ChoghadiyaItem['type']; typeHindi: string; isAuspicious: boolean }[] } = {
    0: [ // Sun: Udveg, Char, Labh, Amrit, Kaal, Shubh, Rog, Udveg
      { name: 'उद्वेग', type: 'udveg', typeHindi: 'अशुभ', isAuspicious: false },
      { name: 'चर', type: 'char', typeHindi: 'सामान्य', isAuspicious: true },
      { name: 'लाभ', type: 'labh', typeHindi: 'उन्नति', isAuspicious: true },
      { name: 'अमृत', type: 'amrit', typeHindi: 'सर्वोत्तम', isAuspicious: true },
      { name: 'काल', type: 'kaal', typeHindi: 'अशुभ', isAuspicious: false },
      { name: 'शुभ', type: 'shubh', typeHindi: 'शुभ', isAuspicious: true },
      { name: 'रोग', type: 'rog', typeHindi: 'अशुभ', isAuspicious: false },
      { name: 'उद्वेग', type: 'udveg', typeHindi: 'अशुभ', isAuspicious: false },
    ],
    1: [ // Mon: Amrit, Kaal, Shubh, Rog, Udveg, Char, Labh, Amrit
      { name: 'अमृत', type: 'amrit', typeHindi: 'सर्वोत्तम', isAuspicious: true },
      { name: 'काल', type: 'kaal', typeHindi: 'अशुभ', isAuspicious: false },
      { name: 'शुभ', type: 'shubh', typeHindi: 'शुभ', isAuspicious: true },
      { name: 'रोग', type: 'rog', typeHindi: 'अशुभ', isAuspicious: false },
      { name: 'उद्वेग', type: 'udveg', typeHindi: 'अशुभ', isAuspicious: false },
      { name: 'चर', type: 'char', typeHindi: 'सामान्य', isAuspicious: true },
      { name: 'लाभ', type: 'labh', typeHindi: 'उन्नति', isAuspicious: true },
      { name: 'अमृत', type: 'amrit', typeHindi: 'सर्वोत्तम', isAuspicious: true },
    ],
    2: [ // Tue: Rog, Udveg, Char, Labh, Amrit, Kaal, Shubh, Rog
      { name: 'रोग', type: 'rog', typeHindi: 'अशुभ', isAuspicious: false },
      { name: 'उद्वेग', type: 'udveg', typeHindi: 'अशुभ', isAuspicious: false },
      { name: 'चर', type: 'char', typeHindi: 'सामान्य', isAuspicious: true },
      { name: 'लाभ', type: 'labh', typeHindi: 'उन्नति', isAuspicious: true },
      { name: 'अमृत', type: 'amrit', typeHindi: 'सर्वोत्तम', isAuspicious: true },
      { name: 'काल', type: 'kaal', typeHindi: 'अशुभ', isAuspicious: false },
      { name: 'शुभ', type: 'shubh', typeHindi: 'शुभ', isAuspicious: true },
      { name: 'रोग', type: 'rog', typeHindi: 'अशुभ', isAuspicious: false },
    ],
    3: [ // Wed: Labh, Amrit, Kaal, Shubh, Rog, Udveg, Char, Labh
      { name: 'लाभ', type: 'labh', typeHindi: 'उन्नति', isAuspicious: true },
      { name: 'अमृत', type: 'amrit', typeHindi: 'सर्वोत्तम', isAuspicious: true },
      { name: 'काल', type: 'kaal', typeHindi: 'अशुभ', isAuspicious: false },
      { name: 'शुभ', type: 'shubh', typeHindi: 'शुभ', isAuspicious: true },
      { name: 'रोग', type: 'rog', typeHindi: 'अशुभ', isAuspicious: false },
      { name: 'उद्वेग', type: 'udveg', typeHindi: 'अशुभ', isAuspicious: false },
      { name: 'चर', type: 'char', typeHindi: 'सामान्य', isAuspicious: true },
      { name: 'लाभ', type: 'labh', typeHindi: 'उन्नति', isAuspicious: true },
    ],
    4: [ // Thu: Shubh, Rog, Udveg, Char, Labh, Amrit, Kaal, Shubh
      { name: 'शुभ', type: 'shubh', typeHindi: 'शुभ', isAuspicious: true },
      { name: 'रोग', type: 'rog', typeHindi: 'अशुभ', isAuspicious: false },
      { name: 'उद्वेग', type: 'udveg', typeHindi: 'अशुभ', isAuspicious: false },
      { name: 'चर', type: 'char', typeHindi: 'सामान्य', isAuspicious: true },
      { name: 'लाभ', type: 'labh', typeHindi: 'उन्नति', isAuspicious: true },
      { name: 'अमृत', type: 'amrit', typeHindi: 'सर्वोत्तम', isAuspicious: true },
      { name: 'काल', type: 'kaal', typeHindi: 'अशुभ', isAuspicious: false },
      { name: 'शुभ', type: 'shubh', typeHindi: 'शुभ', isAuspicious: true },
    ],
    5: [ // Fri: Char, Labh, Amrit, Kaal, Shubh, Rog, Udveg, Char
      { name: 'चर', type: 'char', typeHindi: 'सामान्य', isAuspicious: true },
      { name: 'लाभ', type: 'labh', typeHindi: 'उन्नति', isAuspicious: true },
      { name: 'अमृत', type: 'amrit', typeHindi: 'सर्वोत्तम', isAuspicious: true },
      { name: 'काल', type: 'kaal', typeHindi: 'अशुभ', isAuspicious: false },
      { name: 'शुभ', type: 'shubh', typeHindi: 'शुभ', isAuspicious: true },
      { name: 'रोग', type: 'rog', typeHindi: 'अशुभ', isAuspicious: false },
      { name: 'उद्वेग', type: 'udveg', typeHindi: 'अशुभ', isAuspicious: false },
      { name: 'चर', type: 'char', typeHindi: 'सामान्य', isAuspicious: true },
    ],
    6: [ // Sat: Kaal, Shubh, Rog, Udveg, Char, Labh, Amrit, Kaal
      { name: 'काल', type: 'kaal', typeHindi: 'अशुभ', isAuspicious: false },
      { name: 'शुभ', type: 'shubh', typeHindi: 'शुभ', isAuspicious: true },
      { name: 'रोग', type: 'rog', typeHindi: 'अशुभ', isAuspicious: false },
      { name: 'उद्वेग', type: 'udveg', typeHindi: 'अशुभ', isAuspicious: false },
      { name: 'चर', type: 'char', typeHindi: 'सामान्य', isAuspicious: true },
      { name: 'लाभ', type: 'labh', typeHindi: 'उन्नति', isAuspicious: true },
      { name: 'अमृत', type: 'amrit', typeHindi: 'सर्वोत्तम', isAuspicious: true },
      { name: 'काल', type: 'kaal', typeHindi: 'अशुभ', isAuspicious: false },
    ],
  };

  const dayTimeWindows = [
    '06:42 AM - 08:04 AM',
    '08:04 AM - 09:25 AM',
    '09:25 AM - 10:47 AM',
    '10:47 AM - 12:08 PM',
    '12:08 PM - 01:30 PM',
    '01:30 PM - 02:51 PM',
    '02:51 PM - 04:13 PM',
    '04:13 PM - 05:34 PM',
  ];

  const nightTimeWindows = [
    '05:34 PM - 07:13 PM',
    '07:13 PM - 08:51 PM',
    '08:51 PM - 10:30 PM',
    '10:30 PM - 12:08 AM',
    '12:08 AM - 01:47 AM',
    '01:47 AM - 03:25 AM',
    '03:25 AM - 05:04 AM',
    '05:04 AM - 06:42 AM',
  ];

  const rawDayList = dayChoghadiyaSequences[dayOfWeek] || dayChoghadiyaSequences[0];
  const choghadiyaDay: ChoghadiyaItem[] = rawDayList.map((c, i) => ({
    name: c.name,
    type: c.type,
    typeHindi: c.typeHindi,
    timeWindow: dayTimeWindows[i] || 'दिन',
    isAuspicious: c.isAuspicious,
  }));

  // Night starts from 5th index of day sequence
  const choghadiyaNight: ChoghadiyaItem[] = rawDayList.map((_, i) => {
    const nightIndex = (i + 4) % rawDayList.length;
    const c = rawDayList[nightIndex];
    return {
      name: c.name,
      type: c.type,
      typeHindi: c.typeHindi,
      timeWindow: nightTimeWindows[i] || 'रात्रि',
      isAuspicious: c.isAuspicious,
    };
  });

  // Special Vrat detection
  let specialVrat = 'दैनिक स्वावलंबन साधना व ईष्ट देव स्मरण';
  if (day === 12 && month === 10) {
    specialVrat = 'सूर्य षष्ठी छठ महापर्व पूर्व तैयारी';
  } else if (day === 13 && month === 10) {
    specialVrat = 'लोक आस्था का महापर्व: छठ नहाय-खाय (Day 1)';
  } else if (day === 14 && month === 10) {
    specialVrat = 'छठ महापर्व: खरना व लोहंडा (Day 2) - 36 घंटे निर्जला व्रत आरंभ';
  } else if (day === 15 && month === 10) {
    specialVrat = 'लोक आस्था का महापर्व: डाला छठ संध्या अर्घ्य (पहला अर्घ्य - Day 3)';
  } else if (day === 16 && month === 10) {
    specialVrat = 'छठ महापर्व: उषा अर्घ्य व पारण (दूसरा अर्घ्य - Day 4)';
  } else if (day === 20 && month === 10) {
    specialVrat = 'देवउठनी प्रबोधिनी एकादशी व्रत (मांगलिक कार्य आरंभ)';
  } else if (day === 21 && month === 10) {
    specialVrat = 'श्री तुलसी-शालिग्राम विवाह महापर्व';
  } else if (day === 24 && month === 10) {
    specialVrat = 'कार्तिक पूर्णिमा व देव दीपावली (त्रिपुरारी पूर्णिमा)';
  }

  return {
    dateStr: formattedDate,
    dayName,
    hindiDate: `${hinduMas} मास, ${paksha}, संवत 2083`,
    tithi,
    tithiEndTime: 'रात्रि 11:24 बजे तक, तत्पश्चात अगली तिथि',
    paksha,
    mas: hinduMas,
    nakshatra,
    nakshatraEndTime: 'दोपहर 01:45 बजे तक, तत्पश्चात अगला नक्षत्र',
    yoga,
    karan,
    shubhMuhurat: 'प्रातः 06:45 से 08:10 बजे (अमृत चौघड़िया) एवं शाम 05:20 से 06:50 बजे (शुभ लाभ)',
    abhijitMuhurat: 'दोपहर 11:44 से 12:28 बजे (सर्वश्रेष्ठ कार्य सिद्धि वेला)',
    brahmaMuhurat: 'प्रातः 04:56 से 05:46 बजे (आत्मचिंतन व ध्यान वेला)',
    amritKaal: 'प्रातः 06:45 से 08:12 बजे',
    godhuliMuhurat: 'सायं 05:22 से 05:48 बजे',
    vijayMuhurat: 'दोपहर 01:53 से 02:37 बजे (विजय प्राप्ति वेला)',
    nishitaMuhurat: 'रात्रि 11:39 से 12:31 बजे (महाकाल व शिव पूजन)',
    rahuKaal: rahuKaalMap[dayOfWeek] || 'दोपहर 01:30 से 03:00 बजे',
    yamaganda: yamagandaMap[dayOfWeek] || 'प्रातः 06:00 से 07:30 बजे',
    gulikaKaal: gulikaKaalMap[dayOfWeek] || 'प्रातः 09:00 से 10:30 बजे',
    durMuhurat: 'प्रातः 10:15 से 10:58 बजे एवं दोपहर 02:37 से 03:20 बजे',
    sunrise: 'प्रातः 06:42 बजे',
    sunset: 'सायं 05:32 बजे',
    moonrise: 'प्रातः 09:18 बजे',
    moonset: 'सायं 08:45 बजे',
    sunSign: 'तुला राशि (सूर्य देव)',
    moonSign: 'धनु राशि (चंद्र देव)',
    specialYoga: 'सर्वार्थ सिद्धि योग एवं अमृत सिद्धि योग',
    dishaShool: dishaShoolMap[dayOfWeek]?.dir || 'दक्षिण दिशा',
    dishaShoolRemedy: dishaShoolMap[dayOfWeek]?.remedy || 'दही या जीरा खाकर प्रस्थान करें।',
    samvat: 'विक्रम संवत 2083 (कालयुक्त), शक संवत 1948',
    specialVrat,
    choghadiyaDay,
    choghadiyaNight,
  };
}

// -------------------------------------------------------------
// Calculate Remaining Countdown to a Date
// -------------------------------------------------------------
export function calculateFestivalCountdown(targetDateStr: string, currentDate: Date = new Date()) {
  const target = new Date(`${targetDateStr}T00:00:00`);
  const diffMs = target.getTime() - currentDate.getTime();

  if (diffMs <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, isPast: false };
}

// -------------------------------------------------------------
// Get Active Festival for Today (if any)
// -------------------------------------------------------------
export function getTodayFestival(currentDate: Date = new Date()): FestivalEvent | null {
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const todayStr = `${year}-${month}-${day}`;

  const found = MASTER_FESTIVALS_CALENDAR.find((f) => f.date === todayStr);
  return found || null;
}

// -------------------------------------------------------------
// Get Next Upcoming Festival (Filters out passed festivals automatically!)
// -------------------------------------------------------------
export function getNextUpcomingFestival(currentDate: Date = new Date()): FestivalEvent {
  const todayTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()).getTime();

  // Filter only festivals strictly on or after today
  const upcoming = MASTER_FESTIVALS_CALENDAR.filter((f) => {
    const fTime = new Date(`${f.date}T00:00:00`).getTime();
    return fTime >= todayTime;
  });

  if (upcoming.length > 0) {
    return upcoming[0];
  }

  // Fallback to the first festival in calendar if all passed
  return MASTER_FESTIVALS_CALENDAR[0];
}

// -------------------------------------------------------------
// Generate Active 7 Slides for Home Page Carousel
// (Automatic Festival Detection + Auto-Remove Past + 7 Good Morning Slides)
// -------------------------------------------------------------
export function generateDynamicHomeSlides(currentDate: Date = new Date()): DynamicSlide[] {
  const todayFestival = getTodayFestival(currentDate);
  const nextFestival = getNextUpcomingFestival(currentDate);
  const panchang = getLivePanchangDetails(currentDate);
  const countdown = calculateFestivalCountdown(nextFestival.date, currentDate);

  const slides: DynamicSlide[] = [];

  // 1. If today is a festival, Slide #1 is Today's Active Festival Celebration
  if (todayFestival) {
    slides.push({
      id: `today_${todayFestival.id}`,
      type: 'festival_today',
      badge: `🎉 आज का महापर्व: ${todayFestival.hindiName}`,
      iconEmoji: todayFestival.iconEmoji,
      festivalOrDayTitle: todayFestival.hindiName,
      tagline: todayFestival.tagline,
      mainHeadline: `आज का पावन दिन: ${todayFestival.hindiName} की हार्दिक शुभकामनाएं!`,
      description: `${todayFestival.significance} इस पावन अवसर पर ACC परिवार की ओर से आपको एवं आपके परिवार को ढेर सारी शुभकामनाएं। अपने जीवन में आत्मनिर्भरता का दीप जलाएं।`,
      highlightPoints: [
        `शुभ पूजा मुहूर्त: ${todayFestival.shubhMuhurat}`,
        `पंचांग तिथि: ${todayFestival.tithi}`,
        `शुभ लग्न: ${todayFestival.lagan}`,
        `विशेष: ${todayFestival.pujaVidhi}`,
      ],
      panchangHighlight: {
        date: panchang.dateStr,
        tithi: todayFestival.tithi,
        muhurat: todayFestival.shubhMuhurat,
        lagan: todayFestival.lagan,
      },
      ctaText: todayFestival.ctaText,
      ctaTarget: todayFestival.ctaTarget,
      gradient: todayFestival.colorGradient,
      borderColor: 'border-yellow-400',
      imageUrl: todayFestival.imageUrl,
    });
  }

  // 2. Next Upcoming Festival Slide (with Live Countdown & Coming Soon Date)
  slides.push({
    id: `upcoming_${nextFestival.id}`,
    type: 'upcoming_festival',
    badge: `⏳ अगला पावन पर्व (Coming Soon): ${nextFestival.hindiName}`,
    iconEmoji: nextFestival.iconEmoji,
    festivalOrDayTitle: `${nextFestival.hindiName} (Coming Soon)`,
    tagline: `आगामी तिथि: ${new Date(nextFestival.date).toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' })} • समय शेष: ${countdown.days} दिन ${countdown.hours} घंटे`,
    mainHeadline: `तैयार रहें! अगला महापर्व आ रहा है: ${nextFestival.hindiName}`,
    description: `${nextFestival.tagline}. ${nextFestival.significance} त्योहार के बीतते ही पिछला स्लाइडर स्वतः हट जाता है और अगला पर्व सक्रिय हो जाता है।`,
    highlightPoints: [
      `पर्व की शुभ तिथि: ${new Date(nextFestival.date).toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' })} (${nextFestival.tithi})`,
      `शुभ मुहूर्त व पूजा वेला: ${nextFestival.shubhMuhurat}`,
      `शुभ लग्न: ${nextFestival.lagan}`,
      `समय शेष: ${countdown.days} दिन, ${countdown.hours} घंटे, ${countdown.minutes} मिनट`,
    ],
    countdown: {
      days: countdown.days,
      hours: countdown.hours,
      minutes: countdown.minutes,
      seconds: countdown.seconds,
      targetDateStr: nextFestival.date,
    },
    panchangHighlight: {
      date: new Date(nextFestival.date).toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
      tithi: nextFestival.tithi,
      muhurat: nextFestival.shubhMuhurat,
      lagan: nextFestival.lagan,
    },
    ctaText: nextFestival.ctaText,
    ctaTarget: nextFestival.ctaTarget,
    gradient: nextFestival.colorGradient,
    borderColor: 'border-amber-400',
    imageUrl: nextFestival.imageUrl,
  });

  // 3. Fill the rest of the 7 slides with Daily Good Morning Suvichar and Panchang Status
  const neededSuvicharCount = 7 - slides.length;
  for (let i = 0; i < neededSuvicharCount && i < DAILY_GOOD_MORNING_SUVICHAR.length; i++) {
    const suvichar = DAILY_GOOD_MORNING_SUVICHAR[i];
    slides.push({
      id: suvichar.id,
      type: 'good_morning_suvichar',
      badge: `${suvichar.badge} • ${panchang.dayName}, ${panchang.dateStr}`,
      iconEmoji: suvichar.iconEmoji,
      festivalOrDayTitle: `सुप्रभात व दैनिक सुविचार (${i + 1}/7)`,
      tagline: suvichar.tagline,
      mainHeadline: suvichar.title,
      description: suvichar.description,
      highlightPoints: [
        `आज का पंचांग: ${panchang.tithi} (${panchang.nakshatra} नक्षत्र)`,
        `अभिजीत मुहूर्त: ${panchang.abhijitMuhurat}`,
        ...suvichar.highlights.slice(0, 2),
      ],
      panchangHighlight: {
        date: panchang.dateStr,
        tithi: panchang.tithi,
        muhurat: panchang.abhijitMuhurat,
      },
      ctaText: suvichar.ctaText,
      ctaTarget: suvichar.ctaTarget,
      gradient: suvichar.gradient,
      borderColor: 'border-yellow-300/60',
      imageUrl: suvichar.imageUrl,
    });
  }

  return slides;
}
