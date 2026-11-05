import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { TrendingUp, Users, Award, Calendar, BarChart2, Activity } from 'lucide-react';
import { ReferralRecord } from '../types';

interface ReferralTrendChartProps {
  referrals: ReferralRecord[];
  className?: string;
}

interface DailyReferralPoint {
  dateKey: string;     // YYYY-MM-DD
  dateLabel: string;   // DD MMM (e.g. 05 Nov)
  dayName: string;    // Mon, Tue...
  count: number;       // successful referrals on this day
  cumulative: number;  // running cumulative sum
  earnings: number;    // count * 150
}

export const ReferralTrendChart: React.FC<ReferralTrendChartProps> = ({
  referrals,
  className = '',
}) => {
  const [chartType, setChartType] = useState<'area' | 'bar'>('area');

  // Compute last 30 days data
  const { chartData, totalLast30Days, earningsLast30Days, peakDay, peakCount } = useMemo(() => {
    const now = new Date();
    const days: DailyReferralPoint[] = [];

    // Filter to successful / credited referrals
    const successfulRefs = referrals.filter(
      (r) => !r.status || r.status === 'credited' || (r as any).status === 'active'
    );

    // Map by date (YYYY-MM-DD)
    const countByDate = new Map<string, number>();
    successfulRefs.forEach((r) => {
      let dStr = '';
      if (r.date) {
        // Handle ISO strings, YYYY-MM-DD, or DD/MM/YYYY
        if (r.date.includes('T')) {
          dStr = r.date.split('T')[0];
        } else if (r.date.includes('-')) {
          dStr = r.date.trim();
        } else if (r.date.includes('/')) {
          const parts = r.date.split('/');
          if (parts.length === 3) {
            // assume DD/MM/YYYY
            dStr = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
          }
        }
      }
      if (dStr) {
        countByDate.set(dStr, (countByDate.get(dStr) || 0) + 1);
      }
    });

    let runningTotal = 0;
    let maxCount = 0;
    let maxDayLabel = '-';
    let total30d = 0;

    // Generate 30 continuous calendar days backwards
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);

      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const key = `${yyyy}-${mm}-${dd}`;

      const monthNames = ['जन', 'फर', 'मार्च', 'अप्रै', 'मई', 'जून', 'जुला', 'अग', 'सितं', 'अक्टू', 'नव', 'दिसं'];
      const label = `${dd} ${monthNames[d.getMonth()]}`;
      const dayNames = ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'];
      const dayName = dayNames[d.getDay()];

      const dayCount = countByDate.get(key) || 0;
      total30d += dayCount;
      runningTotal += dayCount;

      if (dayCount > maxCount) {
        maxCount = dayCount;
        maxDayLabel = `${label} (${dayCount} रेफरल)`;
      }

      days.push({
        dateKey: key,
        dateLabel: label,
        dayName,
        count: dayCount,
        cumulative: runningTotal,
        earnings: dayCount * 150,
      });
    }

    return {
      chartData: days,
      totalLast30Days: total30d,
      earningsLast30Days: total30d * 150,
      peakDay: maxDayLabel,
      peakCount: maxCount,
    };
  }, [referrals]);

  return (
    <div className={`bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-4 ${className}`}>
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-50 text-[#2874f0] border border-blue-100">
              <TrendingUp className="w-4 h-4" />
            </span>
            <h3 className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-1.5">
              <span>पिछले 30 दिनों का सफल रेफरल ट्रेंड</span>
              <span className="text-[10px] bg-blue-100 text-[#2874f0] font-black px-2 py-0.5 rounded-full font-mono-acc">
                30D ANALYTICS
              </span>
            </h3>
          </div>
          <p className="text-xs text-slate-500 pl-8">
            सफल सदस्य रेफरल (₹150 प्रति स्टूडेंट) की दैनिक प्रगति व वृद्धि ग्राफ
          </p>
        </div>

        {/* View Switcher (Area Curve vs Bar Graph) */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 shrink-0 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => setChartType('area')}
            className={`px-2.5 py-1 text-xs font-bold rounded-md flex items-center gap-1 transition ${
              chartType === 'area'
                ? 'bg-white text-[#2874f0] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>ट्रेंड कर्व</span>
          </button>
          <button
            type="button"
            onClick={() => setChartType('bar')}
            className={`px-2.5 py-1 text-xs font-bold rounded-md flex items-center gap-1 transition ${
              chartType === 'bar'
                ? 'bg-white text-[#2874f0] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>दैनिक बार</span>
          </button>
        </div>
      </div>

      {/* 30-Day Quick Metric Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-blue-50/80 border border-blue-200/80 rounded-lg p-2.5">
          <div className="flex items-center justify-between text-[11px] text-blue-700 font-semibold mb-1">
            <span>30 दिन के रेफरल</span>
            <Users className="w-3.5 h-3.5 opacity-70" />
          </div>
          <div className="font-mono-acc font-black text-lg sm:text-xl text-[#2874f0]">
            {totalLast30Days} <span className="text-xs font-sans font-normal text-slate-600">सदस्य</span>
          </div>
        </div>

        <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-lg p-2.5">
          <div className="flex items-center justify-between text-[11px] text-emerald-700 font-semibold mb-1">
            <span>30 दिन की TWIS आय</span>
            <Award className="w-3.5 h-3.5 opacity-70" />
          </div>
          <div className="font-mono-acc font-black text-lg sm:text-xl text-emerald-700">
            ₹{earningsLast30Days.toFixed(2)}
          </div>
        </div>

        <div className="bg-amber-50/80 border border-amber-200/80 rounded-lg p-2.5">
          <div className="flex items-center justify-between text-[11px] text-amber-800 font-semibold mb-1">
            <span>उच्चतम एकदिवसीय</span>
            <Calendar className="w-3.5 h-3.5 opacity-70" />
          </div>
          <div className="font-mono-acc font-bold text-xs sm:text-sm text-amber-900 truncate" title={peakDay}>
            {peakCount > 0 ? peakDay : '0 रेफरल'}
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5">
          <div className="flex items-center justify-between text-[11px] text-slate-600 font-semibold mb-1">
            <span>कुल लाइफटाइम टीम</span>
            <TrendingUp className="w-3.5 h-3.5 opacity-70" />
          </div>
          <div className="font-mono-acc font-black text-lg sm:text-xl text-slate-900">
            {referrals.length} <span className="text-xs font-sans font-normal text-slate-600">छात्र</span>
          </div>
        </div>
      </div>

      {/* Recharts Canvas Container */}
      <div className="w-full h-64 pt-2 select-none">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="referralGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2874f0" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#2874f0" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="cumGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="dateLabel"
                interval={4}
                tick={{ fontSize: 10, fill: '#64748b' }}
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 10, fill: '#64748b' }}
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="count"
                name="दैनिक रेफरल"
                stroke="#2874f0"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#referralGrad)"
                activeDot={{ r: 5, fill: '#2874f0', stroke: '#ffffff', strokeWidth: 2 }}
              />
            </AreaChart>
          ) : (
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="dateLabel"
                interval={4}
                tick={{ fontSize: 10, fill: '#64748b' }}
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 10, fill: '#64748b' }}
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="count"
                name="दैनिक रेफरल"
                fill="#2874f0"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Chart Footer Note */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-gray-100 text-[11px] text-slate-500">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#2874f0]"></span>
          <span>दैनिक सफल रेफरल संख्या (सक्रिय सदस्य ₹249 एक्टिवेटेड)</span>
        </div>
        <span className="text-slate-400 font-mono-acc">
          अपडेट: आज तक (30 दिन रोलिंग विंडो)
        </span>
      </div>
    </div>
  );
};

// Custom Tooltip component for Recharts
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data: DailyReferralPoint = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white rounded-lg p-2.5 shadow-xl border border-slate-700 text-xs space-y-1.5 min-w-[170px] select-none">
        <div className="flex items-center justify-between border-b border-slate-700/80 pb-1">
          <span className="font-bold text-yellow-300 font-mono-acc">{data.dateLabel}</span>
          <span className="text-[10px] text-slate-400">({data.dayName})</span>
        </div>
        <div className="flex items-center justify-between text-slate-200">
          <span>सफल रेफरल:</span>
          <span className="font-mono-acc font-black text-blue-400 text-sm">
            {data.count}
          </span>
        </div>
        <div className="flex items-center justify-between text-slate-200">
          <span>TWIS बोनस:</span>
          <span className="font-mono-acc font-bold text-emerald-400">
            ₹{data.earnings}
          </span>
        </div>
        <div className="flex items-center justify-between text-slate-400 text-[10px] pt-1 border-t border-slate-800">
          <span>30D संचयी:</span>
          <span className="font-mono-acc text-slate-300 font-semibold">{data.cumulative} सदस्य</span>
        </div>
      </div>
    );
  }
  return null;
};
