import { useState } from "react";
import { OptionAnalysis } from "../types";
import { ShieldAlert, TrendingUp, AlertOctagon, HelpCircle, Flame } from "lucide-react";

interface SWOTPanelProps {
  options: OptionAnalysis[];
}

export default function SWOTPanel({ options }: SWOTPanelProps) {
  const [activeTab, setActiveTab] = useState(0);

  if (!options || options.length === 0) return null;
  const currentOption = options[activeTab] || options[0];
  const { swot } = currentOption;

  return (
    <div id="swot-panel-container" className="space-y-6">
      {/* Option Navigation Tabs */}
      <div className="flex border-b border-slate-200">
        {options.map((opt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setActiveTab(idx)}
            className={`px-4 py-2.5 font-semibold text-sm -mb-px transition-all border-b-2 cursor-pointer ${
              activeTab === idx
                ? "border-slate-900 text-slate-900"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {opt.name} SWOT Profile
          </button>
        ))}
      </div>

      <div className="text-center md:text-left py-2">
        <p className="text-xs text-slate-500 font-mono">
          Strategic matrix for evaluating internal attributes (Strengths/Weaknesses) vs. external factors (Opportunities/Threats) regarding <span className="font-semibold text-slate-700">"{currentOption.name}"</span>.
        </p>
      </div>

      {/* 4 Quadrants Bento-Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Strengths */}
        <div className="bg-emerald-50/20 border border-emerald-100 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3 text-emerald-900">
            <div className="p-1.5 bg-emerald-100 rounded-lg">
              <TrendingUp className="w-4 h-4 text-emerald-700" />
            </div>
            <h4 className="text-sm font-bold uppercase tracking-wider font-mono">
              [S] Strengths
            </h4>
          </div>
          <ul className="space-y-2.5">
            {swot.strengths.map((str, idx) => (
              <li key={idx} className="flex gap-2.5 text-xs text-slate-700 leading-relaxed">
                <span className="text-emerald-500 font-bold select-none shrink-0">✓</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="bg-rose-50/20 border border-rose-100 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3 text-rose-900">
            <div className="p-1.5 bg-rose-100 rounded-lg">
              <ShieldAlert className="w-4 h-4 text-rose-700" />
            </div>
            <h4 className="text-sm font-bold uppercase tracking-wider font-mono">
              [W] Weaknesses
            </h4>
          </div>
          <ul className="space-y-2.5">
            {swot.weaknesses.map((weak, idx) => (
              <li key={idx} className="flex gap-2.5 text-xs text-slate-700 leading-relaxed">
                <span className="text-rose-500 font-bold select-none shrink-0">⚠</span>
                <span>{weak}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Opportunities */}
        <div className="bg-indigo-50/20 border border-indigo-100 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3 text-indigo-900">
            <div className="p-1.5 bg-indigo-100 rounded-lg">
              <HelpCircle className="w-4 h-4 text-indigo-700" />
            </div>
            <h4 className="text-sm font-bold uppercase tracking-wider font-mono">
              [O] Opportunities
            </h4>
          </div>
          <ul className="space-y-2.5">
            {swot.opportunities.map((opp, idx) => (
              <li key={idx} className="flex gap-2.5 text-xs text-slate-700 leading-relaxed">
                <span className="text-indigo-500 font-bold select-none shrink-0">✦</span>
                <span>{opp}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Threats */}
        <div className="bg-amber-50/20 border border-amber-100 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3 text-amber-900">
            <div className="p-1.5 bg-amber-100 rounded-lg">
              <Flame className="w-4 h-4 text-amber-700" />
            </div>
            <h4 className="text-sm font-bold uppercase tracking-wider font-mono">
              [T] Threats
            </h4>
          </div>
          <ul className="space-y-2.5">
            {swot.threats.map((threat, idx) => (
              <li key={idx} className="flex gap-2.5 text-xs text-slate-700 leading-relaxed">
                <span className="text-amber-500 font-bold select-none shrink-0">⚡</span>
                <span>{threat}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
    </div>
  );
}
