import type { PromotionalPoster } from '../types';
import chhathPujaBannerImg from '../assets/images/chhath_puja_banner_1793965595973.jpg';
import chhathKharnaImg from '../assets/images/chhath_kharna_festival_1794642483479.jpg';
import chhathArghyaImg from '../assets/images/chhath_arghya_worship_1794642482925.jpg';
import devUthaniTulsiImg from '../assets/images/dev_uthani_tulsi_vivah_1794642484422.jpg';
import devDiwaliImg from '../assets/images/dev_diwali_kartik_purnima_1794642486151.jpg';
import makarSankrantiImg from '../assets/images/makar_sankranti_festive_1794642506856.jpg';
import studentEarningImg from '../assets/images/acc_student_earning_banner_1793965628499.jpg';
import accOfficialLogoImg from '../assets/images/acc_official_logo_1793842923620.jpg';

/**
 * Real Panchang & Dynamic Festival Engine (पंचांग व स्वतः त्योहार अपडेट सिस्टम)
 * Automatically computes real-time Panchang, active festivals, countdown to upcoming festivals,
 * auto-removes passed festivals, and generates dynamic festival + Good Morning / Suvichar slides.
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
  greetingTitle: string;
  greetingMessage: string;
  upcomingGreetingMessage: string;
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
  greetingMessage?: string;
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
    shubhMuhurat: 'प्रातः 06:42 से 11:30 बजे (पवित्र स्नान व कद्दू-भात प्रसाद)',
    lagan: 'धनु लग्न (शुभ संकल्प)',
    tagline: 'लोक आस्था के महापर्व छठ के प्रथम दिन नहाय-खाय पर पवित्र शुद्धि व सात्विक व्रत संकल्प',
    significance: 'नहाय-खाय से छठ व्रती तन-मन की निर्मलता के साथ 4 दिवसीय महाव्रत का संकल्प लेते हैं। अरवा चावल, चने की दाल व घी में बनी कद्दू की सात्विक सब्जी का महाभोग।',
    pujaVidhi: 'पवित्र नदी/तालाब में स्नान, भगवान सूर्य देव को जल अर्घ्य, घर-आंगन की शुद्धि व कद्दू-भात प्रसाद ग्रहण।',
    greetingTitle: 'नहाय-खाय के पावन अवसर पर छठ महापर्व की हार्दिक शुभकामनाएं! ☀️🪔',
    greetingMessage: 'सूर्योपासना और पवित्रता के महापर्व नहाय-खाय पर भगवान भास्कर और छठी मइया आपके जीवन को शुद्धता, उत्तम स्वास्थ्य, सुख-शांति और आत्मनिर्भर सफलता से भर दें!',
    upcomingGreetingMessage: 'लोक आस्था का महापर्व छठ नहाय-खाय आने वाला है—छठी मइया की कृपा से आपके परिवार में पवित्रता और समृद्धि का वास हो!',
    imageUrl: chhathPujaBannerImg,
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
    tagline: 'मिट्टी के चूल्हे पर बनी पावन गुड़-खीर प्रसाद व 36 घंटे के अखंड निर्जला छठ व्रत का शुभारंभ',
    significance: 'खरना के दिन पूरे दिन उपवास के बाद शाम को छठी मइया व सूर्य देव को आम की लकड़ी पर बनी गुड़ की खीर का भोग लगाकर 36 घंटे का निर्जला व्रत आरंभ किया जाता है।',
    pujaVidhi: 'संध्या आरती, मिट्टी के चूल्हे पर गुड़-खीर का नैवेद्य, कुलदेवता स्मरण व शांत मन से प्रसाद ग्रहण।',
    greetingTitle: 'छठ महापर्व ' + 'खरना व लोहंडा' + ' की मंगलमय शुभकामनाएं! 🍯🪔',
    greetingMessage: 'गुड़-खीर के मीठे प्रसाद की तरह छठी मइया आपके परिवार में मधुरता, अखंड सौभाग्य, आरोग्य और हर कार्य में सिद्धि प्रदान करें। खरना महाव्रत की हार्दिक बधाई!',
    upcomingGreetingMessage: 'आने वाला पावन दिन ' + 'छठ खरना (Day 2)' + ' है—छठी मइया और सूर्य देव के आशीर्वाद से आपका घर-आंगन सुख-समृद्धि व मधुर प्रसाद से महक उठे!',
    imageUrl: chhathKharnaImg,
    badge: '🍯 छठ महापर्व: खरना व लोहंडा (Day 2)',
    iconEmoji: '🍯',
    colorGradient: 'from-yellow-600 via-amber-600 to-orange-700',
    accentColor: 'text-yellow-200',
    ctaText: 'खरना महाआशीर्वाद ₹249',
    ctaTarget: 'register',
  },
  {
    id: 'chhath_sandhya_arghya_2026',
    name: 'Chhath Puja: Sandhya Arghya',
    hindiName: 'महापर्व छठ: संध्या अर्घ्य (पहला अर्घ्य - Day 3)',
    date: '2026-11-15',
    tithi: 'कार्तिक शुक्ल षष्ठी (डाला छठ)',
    shubhMuhurat: 'अस्ताचलगामी (डूबते) सूर्य को अर्घ्य: सायं 05:27 बजे (गोधूलि वेला)',
    lagan: 'कुंभ लग्न (महापुण्य काल)',
    tagline: 'पवित्र घाटों पर बांस के सूप, ठेकुआ, गन्ना और दीपों संग अस्ताचलगामी सूर्य देव को पहला अर्घ्य',
    significance: 'डूबते सूर्य को अर्घ्य देकर जीवन के हर पड़ाव पर कृतज्ञता सिखाने वाला अद्वितीय महापर्व। छठी मइया से संतान सुख, दीर्घायु, यश और मनवांछित सफलता प्राप्त होती है।',
    pujaVidhi: 'नदी/तालाब में कमर भर जल में खड़े होकर सूप में ठेकुआ, गन्ना व मौसमी फल रखकर दूध और गंगाजल से सूर्य को अर्घ्य।',
    greetingTitle: 'डाला छठ संध्या अर्घ्य की असीम शुभकामनाएं! 🌅☀️',
    greetingMessage: 'डूबते सूर्य की सुनहरी किरणों और छठी मइया के पावन आशीर्वाद से आपके जीवन के सभी कष्ट दूर हों, परिवार में खुशहाली आए और हर सपना साकार हो। जय छठी मइया!',
    upcomingGreetingMessage: 'आने वाला महापर्व ' + 'डाला छठ संध्या अर्घ्य' + ' है—सूप-दउरा, ठेकुआ और दीपों संग छठी मइया का आशीर्वाद आपके पूरे परिवार पर सदैव बना रहे!',
    imageUrl: chhathArghyaImg,
    badge: '🌅 डाला छठ: संध्या अर्घ्य (Day 3)',
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
    shubhMuhurat: 'उगते सूर्य को अर्घ्य: प्रातः 06:44 बजे | पारण: प्रातः 07:15 बजे के बाद',
    lagan: 'वृश्चिक लग्न (अमृत सिद्धि)',
    tagline: 'उदीयमान सूर्य देव को दूसरा अर्घ्य व 36 घंटे के निर्जला छठ महाव्रत का मंगलमय पारण',
    significance: 'उगते सूर्य की प्रथम किरणों को अर्घ्य देकर भगवान भास्कर से नव ऊर्जा, उज्ज्वल भविष्य, संतान रक्षा और संपूर्ण परिवार के मंगल की प्रार्थना की जाती है।',
    pujaVidhi: 'प्रातःकाल नदी घाट पर सूर्योदय अर्घ्य, बड़ों का आशीर्वाद व ठेकुआ-प्रसाद ग्रहण कर पारण।',
    greetingTitle: 'छठ पूजा उषा अर्घ्य एवं मंगल पारण की हार्दिक बधाई! 🌄🚩',
    greetingMessage: 'उगते सूर्य की सुनहरी आभा की तरह आपका भविष्य चमक उठे! भगवान सूर्य देव व छठी मइया की कृपा से सुख, संपत्ति, स्वास्थ्य और सफलता आपके कदम चूमे।',
    upcomingGreetingMessage: 'आने वाला पावन दिन ' + 'छठ उषा अर्घ्य व पारण' + ' है—उदीयमान सूर्य देव आपके जीवन में नई रोशनी और अपार उन्नति लेकर आएं!',
    imageUrl: chhathArghyaImg,
    badge: '🌄 छठ महापर्व: उषा अर्घ्य व पारण (Day 4)',
    iconEmoji: '🌄',
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
    shubhMuhurat: 'प्रातः 06:48 से 08:08 बजे (अमृत चौघड़िया) एवं सायं 05:30 बजे दीपदान',
    lagan: 'वृश्चिक लग्न (स्थिर व मांगलिक)',
    tagline: 'श्री हरि विष्णु का योगनिद्रा से शुभ जागरण एवं सभी मांगलिक कार्यों का महाशुभारंभ',
    significance: 'देवउठनी एकादशी से चार माह के चातुर्मास के बाद सभी शुभ विवाह, गृह प्रवेश व नवीन कार्यों का शुभारंभ होता है। गन्ने का मंडप सजाकर दीपदान किया जाता है।',
    pujaVidhi: 'गन्ने का मंडप सजाकर श्री हरि विष्णु पूजा, शंख ध्वनि, दीपदान व विष्णु सहस्रनाम पाठ।',
    greetingTitle: 'देवउठनी एकादशी की मंगलमय हार्दिक शुभकामनाएं! 🚩🪔',
    greetingMessage: 'भगवान श्री हरि विष्णु के शुभ जागरण के साथ आपके जीवन में भी हर रुका हुआ शुभ कार्य प्रारंभ हो। गन्ने के मंडप व दीपदान की तरह आपका जीवन खुशियों से जगमगाए!',
    upcomingGreetingMessage: 'आने वाला पावन पर्व ' + 'देवउठनी एकादशी' + ' है—श्री हरि की कृपा से आपके घर में मांगलिक कार्यों, समृद्धि व उन्नति के नए द्वार खुलें!',
    imageUrl: devUthaniTulsiImg,
    badge: '🪔 देवउठनी प्रबोधिनी एकादशी',
    iconEmoji: '🚩',
    colorGradient: 'from-amber-600 via-yellow-600 to-emerald-700',
    accentColor: 'text-amber-200',
    ctaText: 'शुभ शुरुआत आज ही करें (₹249)',
    ctaTarget: 'register',
  },
  {
    id: 'tulsi_vivah_2026',
    name: 'Tulsi Vivah',
    hindiName: 'श्री तुलसी-शालिग्राम विवाह महापर्व 2026',
    date: '2026-11-21',
    tithi: 'कार्तिक शुक्ल द्वादशी',
    shubhMuhurat: 'शाम 05:28 से 07:05 बजे (गोधूलि व मांगलिक विवाह लग्न)',
    lagan: 'धनु लग्न (शुभ विवाह लग्न)',
    tagline: 'मां तुलसी व भगवान शालिग्राम का दिव्य विवाह — अखंड सौभाग्य व पारिवारिक खुशहाली',
    significance: 'मां तुलसी व भगवान शालिग्राम के विवाह पूजन से कन्यादान के समान पुण्य फल मिलता है और घर में माता लक्ष्मी व नारायण का स्थायी वास होता है।',
    pujaVidhi: 'तुलसी पौधे का लाल चुनरी व सुहाग सामग्री से श्रृंगार, गन्ने का मंडप, शालिग्राम पूजन व मंगल आरती।',
    greetingTitle: 'पावन श्री तुलसी-शालिग्राम विवाह पर्व की हार्दिक शुभकामनाएं! 🌿🌸',
    greetingMessage: 'मां तुलसी और भगवान शालिग्राम का दिव्य आशीर्वाद आपके पूरे परिवार पर बरसे! आपके घर में अखंड प्रेम, पवित्रता, सुख-समृद्धि और मंगल का वास सदैव बना रहे।',
    upcomingGreetingMessage: 'आने वाला मांगलिक उत्सव ' + 'श्री तुलसी विवाह' + ' है—मां तुलसी और भगवान विष्णु की कृपा से आपका जीवन पावन खुशियों से परिपूर्ण हो!',
    imageUrl: devUthaniTulsiImg,
    badge: '🌿 मंगलमय श्री तुलसी विवाह',
    iconEmoji: '🌸',
    colorGradient: 'from-emerald-700 via-teal-700 to-emerald-900',
    accentColor: 'text-emerald-200',
    ctaText: 'तुलसी विवाह संकल्प ₹249',
    ctaTarget: 'register',
  },
  {
    id: 'kartik_purnima_2026',
    name: 'Kartik Purnima & Dev Diwali',
    hindiName: 'कार्तिक पूर्णिमा व देव दीपावली 2026',
    date: '2026-11-24',
    tithi: 'कार्तिक पूर्णिमा (त्रिपुरारी पूर्णिमा)',
    shubhMuhurat: 'शाम 05:12 से 07:45 बजे (प्रदोष काल महादीपदान वेला)',
    lagan: 'कुंभ लग्न (अमृत सिद्धि)',
    tagline: 'देवताओं की दिवाली — पावन गंगा घाटों पर असंख्य दीपों की अलौकिक छटा व महाआरती',
    significance: 'भगवान शिव द्वारा त्रिपुरासुर संहार की विजय स्मृति में स्वयं देवतागण काशी में दीप जलाते हैं। गंगा स्नान व दीपदान से जीवन अंधकार से प्रकाश की ओर बढ़ता है।',
    pujaVidhi: 'पवित्र स्नान, प्रदोष काल में दीपदान, भगवान शिव-विष्णु आरती एवं सत्यनारायण कथा।',
    greetingTitle: 'कार्तिक पूर्णिमा एवं देव दीपावली की दिव्य शुभकामनाएं! ✨🪔',
    greetingMessage: 'देव दीपावली के असंख्य दीपों की रोशनी की तरह आपका जीवन भी ज्ञान, यश, धन और आध्यात्मिक तेज से जगमगाए। महादेव व मां गंगा का आशीर्वाद सदा बना रहे!',
    upcomingGreetingMessage: 'आने वाला महापर्व ' + 'कार्तिक पूर्णिमा व देव दीपावली' + ' है—गंगा घाटों के दिव्य दीपों की भांति आपका भविष्य उज्ज्वल व खुशहाल हो!',
    imageUrl: devDiwaliImg,
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
    tagline: 'कुरुक्षेत्र में भगवान श्री कृष्ण द्वारा दिए गए अमर कर्मयोग गीता ज्ञान का पावन अवतरण दिवस',
    significance: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन — सच्चे कर्मयोग से ही जीवन में स्वावलंबन, आत्मविश्वास और स्थायी सफलता प्राप्त होती है।',
    pujaVidhi: 'गीता जी का पूजन, श्री कृष्ण आरती, 11वें व 18वें अध्याय का पाठ।',
    greetingTitle: 'श्रीमद्भगवद्गीता जयंती व मोक्षदा एकादशी की हार्दिक शुभकामनाएं! 📖🪶',
    greetingMessage: 'भगवान श्री कृष्ण का अमर गीता ज्ञान आपके जीवन से हर भ्रम व भय दूर करे और आपको कर्मयोग के पथ पर चलकर हर क्षेत्र में विजय व स्वावलंबन दिलाए!',
    upcomingGreetingMessage: 'आने वाला ज्ञान पर्व ' + 'गीता जयंती' + ' है—श्री कृष्ण की वाणी आपके जीवन को सही दिशा, आत्मबल व सफलता से आलोकित करे!',
    imageUrl: devDiwaliImg,
    badge: '📖 श्रीमद्भगवद्गीता जयंती',
    iconEmoji: '🪶',
    colorGradient: 'from-indigo-700 via-purple-700 to-slate-900',
    accentColor: 'text-indigo-200',
    ctaText: 'गीता कर्मयोग से जुड़ें (₹249)',
    ctaTarget: 'register',
  },
  {
    id: 'new_year_2027',
    name: 'New Year 2027',
    hindiName: 'नववर्ष 2027 अभिनन्दन (Happy New Year)',
    date: '2027-01-01',
    tithi: 'पौष कृष्ण पक्ष नवमी',
    shubhMuhurat: 'प्रातः 07:15 से 11:30 बजे (सर्वार्थ सिद्धि)',
    lagan: 'धनु लग्न',
    tagline: 'नववर्ष 2027 का नया संकल्प — पढ़ाई के साथ डिजिटल आत्मनिर्भरता की उड़ान',
    significance: 'नया साल, नया जोश व नया अवसर! अपने मोबाइल और खाली समय को आमदनी में बदलकर परिवार का गौरव बनें।',
    pujaVidhi: 'ईष्ट देव स्मरण, माता-पिता का आशीर्वाद व आत्मनिर्भरता संकल्प।',
    greetingTitle: 'नववर्ष 2027 की अनंत हार्दिक बधाई एवं शुभकामनाएं! 🎉🎊',
    greetingMessage: 'नया वर्ष 2027 आपके जीवन में नई उम्मीदें, उत्तम स्वास्थ्य, नई उपलब्धियां और आर्थिक स्वावलंबन लेकर आए। आपका हर दिन मंगलमय व सफल हो!',
    upcomingGreetingMessage: 'नया साल 2027 दस्तक दे रहा है—आगामी नववर्ष आपके परिवार के लिए खुशियों, प्रगति और बड़ी सफलताओं की सौगात लेकर आए!',
    imageUrl: makarSankrantiImg,
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
    tagline: 'सूर्य देव का उत्तरायण प्रवेश — तिल-गुड़ की मिठास, पतंग उत्सव व नई ऊर्जा का आगमन',
    significance: 'उत्तरायण से देवताओं का दिवस आरंभ होता है। पतंग की ऊंची उड़ान की तरह युवाओं के सपनों को नई ऊंचाई देने का पर्व।',
    pujaVidhi: 'सूर्य अर्घ्य, तिल-गुड़ व खिचड़ी दान, गायत्री मंत्र जप।',
    greetingTitle: 'मकर संक्रांति व उत्तरायण महापर्व की हार्दिक शुभकामनाएं! 🪁☀️',
    greetingMessage: 'तिल-गुड़ की मिठास और आकाश में उड़ती रंग-बिरंगी पतंगों की तरह आपका जीवन भी खुशियों और सफलता की नई ऊंचाइयों को छुए!',
    upcomingGreetingMessage: 'आने वाला महापर्व ' + 'मकर संक्रांति' + ' है—सूर्य देव का उत्तरायण आपके जीवन में मधुरता, नई ऊर्जा और अपार सुख-संपत्ति लेकर आए!',
    imageUrl: makarSankrantiImg,
    badge: '☀️ मकर संक्रांति महापर्व',
    iconEmoji: '🪁',
    colorGradient: 'from-amber-500 via-orange-600 to-red-600',
    accentColor: 'text-yellow-200',
    ctaText: 'संक्रांति महाऑफर (₹249)',
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
    tagline: 'भारत का स्वाभिमान — संविधान, तिरंगा सम्मान और आत्मनिर्भर युवा भारत का संकल्प',
    significance: 'सशक्त युवा, समर्थ भारत। डिजिटल इंडिया के साथ हर छात्र को स्वावलंबी बनाने का राष्ट्रीय पर्व।',
    pujaVidhi: 'तिरंगा ध्वजारोहण, राष्ट्रगान व देश सेवा का संकल्प।',
    greetingTitle: '78वें गणतंत्र दिवस की सभी देशवासियों को हार्दिक शुभकामनाएं! 🇮🇳🚩',
    greetingMessage: 'गर्व से लहराता तिरंगा हमें सदैव एकता, कर्तव्य और आत्मनिर्भर राष्ट्र निर्माण की प्रेरणा देता रहे। जय हिंद, वंदे मातरम!',
    upcomingGreetingMessage: 'आने वाला राष्ट्रीय महापर्व ' + 'गणतंत्र दिवस' + ' है—सशक्त युवा और आत्मनिर्भर डिजिटल भारत के निर्माण में कदम बढ़ाएं!',
    imageUrl: accOfficialLogoImg,
    badge: '🇮🇳 78वां गणतंत्र दिवस',
    iconEmoji: '🇮🇳',
    colorGradient: 'from-orange-600 via-slate-900 to-emerald-700',
    accentColor: 'text-orange-200',
    ctaText: 'डिजिटल भारत में शामिल हों',
    ctaTarget: 'register',
  },
  {
    id: 'vasant_panchami_2027',
    name: 'Vasant Panchami / Saraswati Puja',
    hindiName: 'बसंत पंचमी व मां सरस्वती पूजा 2027',
    date: '2027-02-11',
    tithi: 'माघ शुक्ल पंचमी',
    shubhMuhurat: 'प्रातः 07:05 से दोपहर 12:35 बजे (वाग्देवी पूजन मुहूर्त)',
    lagan: 'मीन लग्न (अमृत वेला)',
    tagline: 'विद्या, बुद्धि, ज्ञान व कला की देवी मां शारदा की असीम कृपा का पावन उत्सव',
    significance: 'छात्रों व युवाओं के लिए वर्ष का सबसे पवित्र दिन। नई विद्या, पुस्तक व कलम पूजन से बुद्धि प्रखर होती है।',
    pujaVidhi: 'पीत वस्त्र धारण, मां सरस्वती पूजन, पुस्तक व कलम अर्पण।',
    greetingTitle: 'बसंत पंचमी एवं मां सरस्वती पूजा की मंगल शुभकामनाएं! 🌼🪕',
    greetingMessage: 'मां वीणावादिनी सरस्वती की असीम कृपा से आपके जीवन में ज्ञान, विवेक, रचनात्मकता और विद्या-बुद्धि का प्रकाश सदैव फैला रहे!',
    upcomingGreetingMessage: 'आने वाला विद्या पर्व ' + 'बसंत पंचमी' + ' है—मां सरस्वती के आशीर्वाद से हर विद्यार्थी का भविष्य ज्ञान व सफलता से चमक उठे!',
    imageUrl: devUthaniTulsiImg,
    badge: '🌼 बसंत पंचमी व सरस्वती पूजा',
    iconEmoji: '🪕',
    colorGradient: 'from-yellow-500 via-amber-500 to-yellow-600',
    accentColor: 'text-yellow-100',
    ctaText: 'विद्यार्थी स्वावलंबन किट ₹249',
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
    tagline: 'देवाधिदेव महादेव व माता पार्वती का दिव्य मिलन — समस्त संकटों के नाश की महा-रात्रि',
    significance: 'चारों प्रहर के शिव पूजन से मनुष्य के सभी कष्ट नष्ट होते हैं और अपार धैर्य, शक्ति व सामर्थ्य की प्राप्ति होती है।',
    pujaVidhi: 'बेलपत्र, गंगाजल, कच्चा दूध अर्पण व ॐ नमः शिवाय का अखण्ड जप।',
    greetingTitle: 'महाशिवरात्रि महापर्व की हार्दिक शुभकामनाएं! हर-हर महादेव! 🔱🙏',
    greetingMessage: 'भोलेनाथ और माता पार्वती की असीम कृपा से आपके जीवन के समस्त संकट मिटें और घर में सुख, शांति, शक्ति व वैभव का वास हो। ॐ नमः शिवाय!',
    upcomingGreetingMessage: 'आने वाला पावन पर्व ' + 'महाशिवरात्रि' + ' है—देवाधिदेव महादेव आपके समस्त मनोरथ पूर्ण करें और जीवन को मंगलमय बनाएं!',
    imageUrl: devDiwaliImg,
    badge: '🔱 महाशिवरात्रि विशेषांक',
    iconEmoji: '🔱',
    colorGradient: 'from-blue-900 via-indigo-900 to-slate-950',
    accentColor: 'text-cyan-200',
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
    tagline: 'प्रेम, सौहार्द और खुशियों के सतरंगी गुलाल से खिल उठने वाला महा-रंगोत्सव',
    significance: 'बुराई पर अच्छाई और सच्ची भक्ति की विजय का पावन उत्सव जो आपसी प्रेम और भाईचारे को प्रगाढ़ करता है।',
    pujaVidhi: 'होलिका दहन, गुलाल अर्पण, बड़ों का आशीर्वाद व मिष्ठान्न वितरण।',
    greetingTitle: 'रंगों के महापर्व होली की ढेर सारी हार्दिक शुभकामनाएं! 🌈🎨',
    greetingMessage: 'होली के खूबसूरत रंगों की तरह आपका जीवन भी खुशियों, उमंग, सफलता, अच्छे स्वास्थ्य और मधुर रिश्तों से सतरंगी हो जाए! शुभ होली!',
    upcomingGreetingMessage: 'रंगों का महापर्व ' + 'होली 2027' + ' आ रहा है—प्रेम, उल्लास और सफलता के अनगिनत रंग आपके जीवन को खुशहाल बनाएं!',
    imageUrl: makarSankrantiImg,
    badge: '🎨 खुशियों का रंगोत्सव होली',
    iconEmoji: '🌈',
    colorGradient: 'from-pink-600 via-purple-600 to-amber-600',
    accentColor: 'text-pink-100',
    ctaText: 'होली संग नई शुरुआत करें (₹249)',
    ctaTarget: 'register',
  },
];

// -------------------------------------------------------------
// Daily Good Morning & Motivational Suvichar Bank (7 Slides)
// Verified local images so images never fail or show unrelated stock
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
      'असंभव कुछ भी नहीं - जब संकल्प अडिग हो',
    ],
    ctaText: 'आज ही अपनी शुरुआत करें (₹249)',
    ctaTarget: 'register',
    imageUrl: studentEarningImg,
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
      'हजारों कॉलेज छात्रों का वेरिफाइड व भरोसेमंद नेटवर्क',
    ],
    ctaText: 'इनकम कैलकुलेटर से कमाई देखें',
    ctaTarget: 'calculator',
    imageUrl: accOfficialLogoImg,
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
      'हर सफल कदम पर रिवॉर्ड व लीडरबोर्ड सम्मान',
    ],
    ctaText: 'अपना डिजिटल 🆔 कार्ड देखें',
    ctaTarget: 'idcard',
    imageUrl: studentEarningImg,
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
      'खुद का खर्च कम करें, दूसरों का रिचार्ज करके कमाएं',
    ],
    ctaText: 'SWIS रिचार्ज प्लान्स देखें',
    ctaTarget: 'plans',
    imageUrl: makarSankrantiImg,
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
      'एक-दूसरे को सिखाकर आगे बढ़ाने की परंपरा',
    ],
    ctaText: 'कम्युनिटी चैट में भाग लें',
    ctaTarget: 'chat',
    imageUrl: devDiwaliImg,
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
      'कभी भी, कहीं भी - अपने समय पर काम करने की आज़ादी',
    ],
    ctaText: 'ट्रेनिंग वीडियो देखें',
    ctaTarget: 'video',
    imageUrl: studentEarningImg,
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
      'सत्यमेव जयते - भारत का स्वाभिमानी युवा मंच',
    ],
    ctaText: 'वेरिफाइड सदस्य बनें (₹249)',
    ctaTarget: 'register',
    imageUrl: accOfficialLogoImg,
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
// Local Date String Helper (YYYY-MM-DD in User's Local Timezone)
// Prevents any UTC vs local midnight mismatch
// -------------------------------------------------------------
export function getLocalDateStr(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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
  const todayStr = getLocalDateStr(currentDate);
  const found = MASTER_FESTIVALS_CALENDAR.find((f) => f.date === todayStr);
  return found || null;
}

// -------------------------------------------------------------
// Filter Out All Passed Festivals Automatically (f.date >= todayStr)
// -------------------------------------------------------------
export function getActiveAndUpcomingFestivals(currentDate: Date = new Date()): FestivalEvent[] {
  const todayStr = getLocalDateStr(currentDate);
  return MASTER_FESTIVALS_CALENDAR.filter((f) => f.date >= todayStr);
}

// -------------------------------------------------------------
// Get Strictly Future Festivals (f.date > todayStr)
// Used for displaying Upcoming Festival cards/sliders/popups
// -------------------------------------------------------------
export function getStrictlyUpcomingFestivals(
  currentDate: Date = new Date(),
  limit: number = 3
): FestivalEvent[] {
  const todayStr = getLocalDateStr(currentDate);
  const list = MASTER_FESTIVALS_CALENDAR.filter((f) => f.date > todayStr);
  return list.slice(0, limit);
}

// -------------------------------------------------------------
// Get Next Active or Upcoming Festival (Never shows passed festivals!)
// -------------------------------------------------------------
export function getNextUpcomingFestival(currentDate: Date = new Date()): FestivalEvent {
  const upcoming = getActiveAndUpcomingFestivals(currentDate);
  if (upcoming.length > 0) {
    return upcoming[0];
  }
  return MASTER_FESTIVALS_CALENDAR[MASTER_FESTIVALS_CALENDAR.length - 1];
}

// -------------------------------------------------------------
// Get Strictly Future Festival (Whose date > todayStr)
// -------------------------------------------------------------
export function getStrictlyUpcomingFestival(currentDate: Date = new Date()): FestivalEvent {
  const strictlyFuture = getStrictlyUpcomingFestivals(currentDate, 1);
  if (strictlyFuture.length > 0) {
    return strictlyFuture[0];
  }
  return MASTER_FESTIVALS_CALENDAR[MASTER_FESTIVALS_CALENDAR.length - 1];
}

// -------------------------------------------------------------
// Get the Following Festival Right After a Given Festival ID
// -------------------------------------------------------------
export function getFestivalAfter(festivalId: string): FestivalEvent {
  const idx = MASTER_FESTIVALS_CALENDAR.findIndex((f) => f.id === festivalId);
  if (idx >= 0 && idx + 1 < MASTER_FESTIVALS_CALENDAR.length) {
    return MASTER_FESTIVALS_CALENDAR[idx + 1];
  }
  return MASTER_FESTIVALS_CALENDAR[MASTER_FESTIVALS_CALENDAR.length - 1];
}

// -------------------------------------------------------------
// Automatic Expiration Check for Promotional Posters & Popups
// Automatically removes passed festivals (Dhanteras, Diwali, Govardhan, Bhai Dooj, expired Chhath days, etc.)
// -------------------------------------------------------------
const PAST_FESTIVAL_END_DATES: { keywords: string[]; lastActiveDate: string }[] = [
  { keywords: ['dhanteras', 'धनतेरस'], lastActiveDate: '2026-11-08' },
  { keywords: ['diwali', 'deepotsav', 'दीपावली', 'दीपोत्सव', 'दिवाली'], lastActiveDate: '2026-11-10' },
  { keywords: ['govardhan', 'bhaidooj', 'bhai dooj', 'गोवर्धन', 'भाई दूज'], lastActiveDate: '2026-11-12' },
  { keywords: ['nahay_khay', 'nahay khay', 'नहाय-खाय', 'नहाय खाय'], lastActiveDate: '2026-11-13' },
  { keywords: ['kharna', 'खरना', 'लोहंडा'], lastActiveDate: '2026-11-14' },
  { keywords: ['sandhya_arghya', 'sandhya arghya', 'संध्या अर्घ्य', 'डाला छठ'], lastActiveDate: '2026-11-15' },
  { keywords: ['chhath', 'छठ'], lastActiveDate: '2026-11-16' },
  { keywords: ['dev_uthani', 'प्रबोधिनी एकादशी', 'देवउठनी'], lastActiveDate: '2026-11-20' },
  { keywords: ['tulsi_vivah', 'तुलसी विवाह'], lastActiveDate: '2026-11-21' },
  { keywords: ['kartik_purnima', 'dev_diwali', 'देव दीपावली', 'कार्तिक पूर्णिमा'], lastActiveDate: '2026-11-24' },
  { keywords: ['gita_jayanti', 'गीता जयंती'], lastActiveDate: '2026-12-20' },
  { keywords: ['new_year_2027', 'नववर्ष 2027'], lastActiveDate: '2027-01-01' },
  { keywords: ['makar_sankranti', 'मकर संक्रांति'], lastActiveDate: '2027-01-14' },
  { keywords: ['republic_day_2027', 'गणतंत्र दिवस'], lastActiveDate: '2027-01-26' },
  { keywords: ['vasant_panchami', 'बसंत पंचमी'], lastActiveDate: '2027-02-11' },
  { keywords: ['maha_shivratri', 'महाशिवरात्रि'], lastActiveDate: '2027-03-06' },
  { keywords: ['holi_2027', 'होली 2027', 'रंगोत्सव'], lastActiveDate: '2027-03-22' },
];

export function isFestivalItemExpired(
  item: {
    id?: string;
    title?: string;
    subtitle?: string;
    badge?: string;
    badgeText?: string;
    festivalDate?: string;
    expiresAt?: string;
  },
  currentDate: Date = new Date()
): boolean {
  const todayStr = getLocalDateStr(currentDate);

  if (item.expiresAt && item.expiresAt < todayStr) {
    return true;
  }
  if (item.festivalDate && item.festivalDate < todayStr) {
    return true;
  }

  const combinedText = `${item.id || ''} ${item.title || ''} ${item.badge || ''} ${item.badgeText || ''}`.toLowerCase();

  // Check auto-generated festival cards directly against MASTER_FESTIVALS_CALENDAR
  for (const fest of MASTER_FESTIVALS_CALENDAR) {
    if (item.id && (item.id.includes(fest.id) || item.id === `auto_poster_${fest.id}`)) {
      return fest.date < todayStr;
    }
  }

  // Check known festival keywords against their last active date
  for (const rule of PAST_FESTIVAL_END_DATES) {
    if (rule.keywords.some((kw) => combinedText.includes(kw.toLowerCase()))) {
      if (rule.lastActiveDate < todayStr) {
        return true;
      }
    }
  }

  return false;
}

// -------------------------------------------------------------
// Auto-Generate Active Today & Upcoming Festival Promotional Posters
// Automatically replaces expired festival cards with fresh ones
// -------------------------------------------------------------
export function getAutoDynamicFestivalPosters(currentDate: Date = new Date()): PromotionalPoster[] {
  const todayFestival = getTodayFestival(currentDate);
  const upcomingList = getStrictlyUpcomingFestivals(currentDate, todayFestival ? 1 : 2);
  const posters: PromotionalPoster[] = [];

  if (todayFestival) {
    posters.push({
      id: `auto_poster_today_${todayFestival.id}`,
      title: `🎉 आज का महापर्व: ${todayFestival.hindiName}`,
      subtitle: `${todayFestival.greetingMessage} (शुभ मुहूर्त: ${todayFestival.shubhMuhurat})`,
      imageUrl: todayFestival.imageUrl,
      ctaText: todayFestival.ctaText,
      ctaLink: todayFestival.ctaTarget,
      badge: `🎉 आज का त्यौहार • ${todayFestival.badge}`,
      isActive: true,
      createdAt: todayFestival.date,
      festivalDate: todayFestival.date,
      expiresAt: todayFestival.date,
    });
  }

  upcomingList.forEach((fest, index) => {
    const countdown = calculateFestivalCountdown(fest.date, currentDate);
    const daysAhead = countdown.days + (countdown.hours > 0 || countdown.minutes > 0 ? 1 : 0);
    const formattedDate = new Date(`${fest.date}T00:00:00`).toLocaleDateString('hi-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    posters.push({
      id: `auto_poster_upcoming_${fest.id}`,
      title: `⏳ आने वाला त्यौहार (${daysAhead} दिन शेष): ${fest.hindiName}`,
      subtitle: `📅 ${formattedDate} • ${fest.upcomingGreetingMessage || fest.greetingMessage}`,
      imageUrl: fest.imageUrl,
      ctaText: fest.ctaText,
      ctaLink: fest.ctaTarget,
      badge: index === 0 ? `⏭️ अगला आने वाला महापर्व (${daysAhead} दिन)` : `📅 आगामी महापर्व (${formattedDate})`,
      isActive: true,
      createdAt: getLocalDateStr(currentDate),
      festivalDate: fest.date,
      expiresAt: fest.date,
    });
  });

  return posters;
}

// -------------------------------------------------------------
// Generate Active 7 Slides for Home Page Carousel
// (Today's Festival + Upcoming Festivals + Clear Festival Wishes + Auto-Remove Passed Festivals)
// -------------------------------------------------------------
export function generateDynamicHomeSlides(currentDate: Date = new Date()): DynamicSlide[] {
  const todayFestival = getTodayFestival(currentDate);
  const upcomingFestivals = getStrictlyUpcomingFestivals(currentDate, todayFestival ? 2 : 3);
  const panchang = getLivePanchangDetails(currentDate);

  const slides: DynamicSlide[] = [];

  // 1. Today's Active Festival Celebration Slide (Auto-removed at midnight after festival ends)
  if (todayFestival) {
    slides.push({
      id: `today_${todayFestival.id}`,
      type: 'festival_today',
      badge: `🎉 आज का पावन त्यौहार: ${todayFestival.hindiName}`,
      iconEmoji: todayFestival.iconEmoji,
      festivalOrDayTitle: `आज: ${todayFestival.hindiName}`,
      tagline: todayFestival.tagline,
      mainHeadline: todayFestival.greetingTitle,
      greetingMessage: todayFestival.greetingMessage,
      description: `${todayFestival.significance} इस पावन पर्व पर ACC परिवार की ओर से आपको व आपके पूरे परिवार को मंगलमय शुभकामनाएं।`,
      highlightPoints: [
        `शुभ पूजा मुहूर्त: ${todayFestival.shubhMuhurat}`,
        `पंचांग तिथि: ${todayFestival.tithi}`,
        `शुभ लग्न: ${todayFestival.lagan}`,
        `पूजा विधि: ${todayFestival.pujaVidhi}`,
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

  // 2. Upcoming Festivals Slides (Auto-updated with clear wishes & matching photos)
  upcomingFestivals.forEach((nextFestival, idx) => {
    const countdown = calculateFestivalCountdown(nextFestival.date, currentDate);
    const formattedNextDate = new Date(`${nextFestival.date}T00:00:00`).toLocaleDateString('hi-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    slides.push({
      id: `upcoming_${nextFestival.id}`,
      type: 'upcoming_festival',
      badge: idx === 0
        ? `⏳ आने वाला त्यौहार: ${nextFestival.hindiName}`
        : `📅 अगला आगामी पर्व: ${nextFestival.hindiName}`,
      iconEmoji: nextFestival.iconEmoji,
      festivalOrDayTitle: `आगामी: ${nextFestival.hindiName}`,
      tagline: `शुभ तिथि: ${formattedNextDate} • ${countdown.days} दिन ${countdown.hours} घंटे शेष`,
      mainHeadline: `${nextFestival.hindiName} की अग्रिम हार्दिक शुभकामनाएं!`,
      greetingMessage: nextFestival.upcomingGreetingMessage || nextFestival.greetingMessage,
      description: `${nextFestival.tagline} — ${nextFestival.significance}`,
      highlightPoints: [
        `आगामी शुभ तिथि: ${formattedNextDate} (${nextFestival.tithi})`,
        `शुभ मुहूर्त व पूजा वेला: ${nextFestival.shubhMuhurat}`,
        `शुभ लग्न: ${nextFestival.lagan}`,
        `पूजा विधि: ${nextFestival.pujaVidhi}`,
      ],
      countdown: {
        days: countdown.days,
        hours: countdown.hours,
        minutes: countdown.minutes,
        seconds: countdown.seconds,
        targetDateStr: nextFestival.date,
      },
      panchangHighlight: {
        date: formattedNextDate,
        tithi: nextFestival.tithi,
        muhurat: nextFestival.shubhMuhurat,
        lagan: nextFestival.lagan,
      },
      ctaText: nextFestival.ctaText,
      ctaTarget: nextFestival.ctaTarget,
      gradient: nextFestival.colorGradient,
      borderColor: idx === 0 ? 'border-amber-400' : 'border-yellow-300/70',
      imageUrl: nextFestival.imageUrl,
    });
  });

  // 3. Fill remaining slides up to 7 with Daily Good Morning Suvichar and Panchang Status
  const neededSuvicharCount = Math.max(0, 7 - slides.length);
  for (let i = 0; i < neededSuvicharCount && i < DAILY_GOOD_MORNING_SUVICHAR.length; i++) {
    const suvichar = DAILY_GOOD_MORNING_SUVICHAR[i];
    slides.push({
      id: suvichar.id,
      type: 'good_morning_suvichar',
      badge: `${suvichar.badge} • ${panchang.dayName}, ${panchang.dateStr}`,
      iconEmoji: suvichar.iconEmoji,
      festivalOrDayTitle: `सुप्रभात व दैनिक सुविचार (${i + 1})`,
      tagline: suvichar.tagline,
      mainHeadline: suvichar.title,
      greetingMessage: suvichar.description,
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
