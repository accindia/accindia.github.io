import React, { useState } from 'react';
import {
  Calculator,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Zap,
  PhoneCall,
  Tv,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

interface CommissionCalculatorProps {
  onGoToRegister: () => void;
}

export const CommissionCalculator: React.FC<CommissionCalculatorProps> = ({ onGoToRegister }) => {
  const [mobileExpense, setMobileExpense] = useState<number>(1500);
  const [electricityBill, setElectricityBill] = useState<number>(3000);
  const [dthExpense, setDthExpense] = useState<number>(500);
  const [otherBills, setOtherBills] = useState<number>(1500);
  const [referralsCount, setReferralsCount] = useState<number>(10);

  // SWIS Math
  const totalBillsMonthly = mobileExpense + electricityBill + dthExpense + otherBills;
  const swisMonthlyCommission = Number((totalBillsMonthly * 0.033).toFixed(2));
  const swisYearlyCommission = Number((swisMonthlyCommission * 12).toFixed(2));

  // TWIS Math
  const twisReferralIncome = referralsCount * 150;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div className="text-center">
        <div className="inline-flex items-center gap-1.5 text-xs text-[#2874f0] bg-blue-50 border border-blue-200 px-3 py-1 rounded-sm font-bold mb-2">
          <Calculator className="w-3.5 h-3.5" />
          <span>लाइव इनकम एवं बचत कैलकुलेटर · ACC ASSURED</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-900">
          अपनी मासिक बचत एवं SWIS / TWIS इनकम चेक करें
        </h2>
        <p className="text-xs text-slate-500 mt-1 max-w-xl mx-auto">
          देखिए कैसे केवल ₹249 के वन-टाइम एक्टिवेशन से आप और आपका परिवार हर महीने हजारों रुपए की बचत और कमाई कर सकते हैं।
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sliders Input Column */}
        <div className="lg:col-span-7 bg-white border border-gray-200 rounded-xl p-5 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-[#2874f0] flex items-center gap-2 border-b border-gray-100 pb-2">
            <Zap className="w-4 h-4 fill-[#2874f0]" />
            मासिक बिल व रिचार्ज खर्च (Monthly Expenses)
          </h3>

          {/* Mobile Recharge Slider */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-800 font-semibold flex items-center gap-1">
                <PhoneCall className="w-3.5 h-3.5 text-[#2874f0]" /> मोबाइल रिचार्ज (खुद + परिवार + दोस्त)
              </span>
              <span className="font-mono-acc font-bold text-[#2874f0]">₹{mobileExpense} / माह</span>
            </div>
            <input
              type="range"
              min={200}
              max={10000}
              step={100}
              value={mobileExpense}
              onChange={(e) => setMobileExpense(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#2874f0]"
            />
          </div>

          {/* Electricity Bill Slider */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-800 font-semibold">
                बिजली बिल (Electricity Bill)
              </span>
              <span className="font-mono-acc font-bold text-[#2874f0]">₹{electricityBill} / माह</span>
            </div>
            <input
              type="range"
              min={500}
              max={20000}
              step={200}
              value={electricityBill}
              onChange={(e) => setElectricityBill(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#2874f0]"
            />
          </div>

          {/* DTH Slider */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-800 font-semibold flex items-center gap-1">
                <Tv className="w-3.5 h-3.5 text-[#2874f0]" /> DTH रिचार्ज (Tata Play, Airtel, Dish)
              </span>
              <span className="font-mono-acc font-bold text-[#2874f0]">₹{dthExpense} / माह</span>
            </div>
            <input
              type="range"
              min={200}
              max={3000}
              step={50}
              value={dthExpense}
              onChange={(e) => setDthExpense(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#2874f0]"
            />
          </div>

          {/* Other Bills */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-800 font-semibold">
                गैस सिलेंडर / फास्टैग / ब्रॉडबैंड बिल
              </span>
              <span className="font-mono-acc font-bold text-[#2874f0]">₹{otherBills} / माह</span>
            </div>
            <input
              type="range"
              min={500}
              max={10000}
              step={100}
              value={otherBills}
              onChange={(e) => setOtherBills(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#2874f0]"
            />
          </div>

          {/* TWIS Referrals Slider */}
          <div className="pt-3 border-t border-gray-100">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-emerald-700 font-bold">
                TWIS डायरेक्ट टीम रेफरल सदस्य (₹150 प्रति रेफरल)
              </span>
              <span className="font-mono-acc font-bold text-emerald-700">{referralsCount} लोग</span>
            </div>
            <input
              type="range"
              min={0}
              max={50}
              step={1}
              value={referralsCount}
              onChange={(e) => setReferralsCount(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
          </div>
        </div>

        {/* Results Comparison Column */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-4">
          {/* ACC Earnings Card */}
          <div className="bg-white border-2 border-[#2874f0] rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
              <span className="text-xs font-bold text-[#2874f0] uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> ACC शुद्ध कमाई व बचत
              </span>
              <span className="text-[10px] bg-green-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                3.30% FIXED
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-xs text-slate-500 block">मासिक SWIS रिचार्ज कमीशन</span>
                <span className="font-mono-acc font-black text-2xl text-emerald-600">
                  +₹{swisMonthlyCommission.toLocaleString()}
                </span>
                <span className="text-[11px] text-slate-500 block">
                  (कुल बिल ₹{totalBillsMonthly.toLocaleString()} पर 3.30%)
                </span>
              </div>

              <div>
                <span className="text-xs text-slate-500 block">TWIS टीम रेफरल इनकम ({referralsCount} × ₹150)</span>
                <span className="font-mono-acc font-bold text-xl text-[#2874f0]">
                  +₹{twisReferralIncome.toLocaleString()}
                </span>
              </div>

              <div className="bg-[#f1f2f4] p-3 rounded-lg border border-gray-200">
                <span className="text-[11px] text-slate-600 block">वार्षिक संभावित शुद्ध बचत एवं लाभ:</span>
                <span className="font-mono-acc font-black text-2xl text-slate-900">
                  ₹{(swisYearlyCommission + twisReferralIncome).toLocaleString()} / वर्ष
                </span>
                <span className="text-[10px] text-emerald-700 block mt-0.5 font-bold">
                  सिर्फ ₹249 One-Time खर्च पर लाइफटाइम इनकम!
                </span>
              </div>
            </div>
          </div>

          {/* Comparison with Google Pay / PhonePe */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 text-xs space-y-2 shadow-xs">
            <h4 className="font-bold text-slate-900">Google Pay / PhonePe से सीधा अंतर:</h4>
            
            <div className="flex items-start gap-2 text-red-700">
              <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>GPay / PhonePe: हर रिचार्ज पर ₹1 से ₹3 एक्स्ट्रा प्लेटफॉर्म फीस कटती है, कोई फिक्स छूट नहीं।</span>
            </div>

            <div className="flex items-start gap-2 text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>ACC SWIS: 0 एक्स्ट्रा फीस और हर ट्रांजैक्शन पर 3.30% सीधा आपके वॉलेट में वापस!</span>
            </div>
          </div>

          <button
            onClick={onGoToRegister}
            className="w-full py-3 bg-[#fb641b] hover:bg-[#e85a14] text-white font-bold rounded-sm text-sm shadow-md flex items-center justify-center gap-2 transition"
          >
            <span>आज ही एक्टिवेट करें (मात्र ₹249)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
