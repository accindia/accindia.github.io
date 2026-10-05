import React, { useState } from 'react';
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
} from 'lucide-react';

interface LegalPagesProps {
  initialTab?: 'privacy' | 'disclaimer' | 'terms' | 'about' | 'contact' | 'description';
  onGoToRegister: () => void;
}

export const LegalPages: React.FC<LegalPagesProps> = ({
  initialTab = 'about',
  onGoToRegister,
}) => {
  const [tab, setTab] = useState<'privacy' | 'disclaimer' | 'terms' | 'about' | 'contact' | 'description'>(initialTab);

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

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Navigation Tabs - Flipkart Style */}
      <div className="flex bg-white border border-gray-200 rounded-lg p-1.5 gap-1 overflow-x-auto no-scrollbar shadow-xs">
        {[
          { id: 'about', label: 'About Us (हमारे बारे में)' },
          { id: 'description', label: 'Description (विस्तृत विवरण)' },
          { id: 'disclaimer', label: 'Disclaimer (अस्वीकरण)' },
          { id: 'privacy', label: 'Privacy Policy (गोपनीयता नीति)' },
          { id: 'terms', label: 'Terms & Conditions (नियम व शर्तें)' },
          { id: 'contact', label: 'Contact Us (संपर्क करें)' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setTab(item.id as any)}
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
                उदाहरण स्वरूप: <strong className="font-mono-acc text-[#2874f0]">ACC249SWISRK01</strong>
              </p>
              <ul className="text-xs text-slate-600 space-y-1 list-disc pl-5">
                <li><strong>ACC</strong> = Achievers Club Community</li>
                <li><strong>249</strong> = एक्टिवेशन चार्ज (₹249)</li>
                <li><strong>SWIS / TWIS</strong> = चुना गया सिस्टम (सेल्फ वर्क या टीम वर्क)</li>
                <li><strong>RK</strong> = सदस्य के नाम के इनिशियल्स (उदा. Rahul Kumar = RK, Santosh Patidar = SP)</li>
                <li><strong>01</strong> = सदस्य का क्रम संख्यांक (सीक्वेंस नंबर)</li>
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

      {/* CONTENT: Privacy Policy */}
      {tab === 'privacy' && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 space-y-4 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Privacy Policy (गोपनीयता नीति)</h2>
          <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <p>
              Achievers Club Community (ACC) आपकी व्यक्तिगत गोपनीयता का पूर्ण सम्मान करता है। यह नीति स्पष्ट करती है कि हम आपका डेटा कैसे सुरक्षित रखते हैं।
            </p>
            <p>
              <strong>1. संग्रहीत जानकारी:</strong> रजिस्ट्रेशन के दौरान हम आपका नाम, मोबाइल नंबर, व्हाट्सएप नंबर, ईमेल, शैक्षणिक योग्यता और शहर की जानकारी प्राप्त करते हैं। यह जानकारी केवल आपकी डिजिटल 🆔 तैयार करने और सपोर्ट प्रदान करने के लिए उपयोग होती है।
            </p>
            <p>
              <strong>2. डेटा सुरक्षा:</strong> आपका डेटा किसी भी तीसरे पक्ष के साथ साझा या बेचा नहीं जाता है। भुगतान संबंधी जानकारी (जैसे UTR नंबर) केवल ट्रांजैक्शन ऑडिट के लिए स्टोर की जाती है।
            </p>
            <p>
              <strong>3. अधिकार:</strong> आप कभी भी अपने खाते की जानकारी अपडेट करने या सहायता प्राप्त करने के लिए <code>santosh09patidar@gmail.com</code> पर संपर्क कर सकते हैं।
            </p>
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

      {/* CONTENT: Contact Us */}
      {tab === 'contact' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Details */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 space-y-5 shadow-sm">
            <div>
              <h2 className="text-xl font-black font-display text-slate-900">
                Contact Us (संपर्क करें)
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Achievers Club Community सपोर्ट डेस्क हमेशा आपकी सहायता के लिए तत्पर है।
              </p>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-700">
              <div className="flex items-start gap-3 bg-[#f1f2f4] p-3.5 rounded-lg border border-gray-200">
                <Mail className="w-5 h-5 text-[#2874f0] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] text-slate-500 block font-semibold">आधिकारिक ईमेल आईडी:</span>
                  <a
                    href="mailto:santosh09patidar@gmail.com"
                    className="font-bold text-[#2874f0] hover:underline"
                  >
                    santosh09patidar@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-[#f1f2f4] p-3.5 rounded-lg border border-gray-200">
                <Phone className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] text-slate-500 block font-semibold">हेल्पलाइन एवं व्हाट्सएप:</span>
                  <a
                    href="https://api.whatsapp.com/send?phone=918877490845&text=Namaste%20ACC%20Support%2C%20mujhe%20sahayata%20chahiye."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-emerald-700 hover:underline"
                  >
                    +91 8877490845 (WhatsApp Support)
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-[#f1f2f4] p-3.5 rounded-lg border border-gray-200">
                <Building2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] text-slate-500 block font-semibold">फाउंडर व मेंटर:</span>
                  <span className="font-bold text-slate-900">Rahul Kumar (ACC249SWISRK01)</span>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-[#f1f2f4] p-3.5 rounded-lg border border-gray-200">
                <MapPin className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] text-slate-500 block font-semibold">पंजीकृत कार्यालय:</span>
                  <span className="text-slate-800">Scheme No. 54, Vijay Nagar, Indore, Madhya Pradesh - 452001</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Contact Form */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Send className="w-4 h-4 text-[#2874f0]" />
              <span>सपोर्ट टीम को सीधा संदेश भेजें</span>
            </h3>

            {contactSent ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs text-center space-y-1">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-600" />
                <p className="font-bold">संदेश प्राप्त हुआ!</p>
                <p className="text-slate-600">हमारी सपोर्ट टीम santosh09patidar@gmail.com से आपसे संपर्क करेगी।</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitContact} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">आपका नाम</label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0]"
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
                      className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0]"
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
                      className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0]"
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
                    className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#2874f0] focus:ring-1 focus:ring-[#2874f0]"
                    placeholder="आप क्या सहायता चाहते हैं?"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#fb641b] hover:bg-[#e85a14] text-white font-bold text-xs rounded-sm shadow-sm transition"
                >
                  संदेश भेजें
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
