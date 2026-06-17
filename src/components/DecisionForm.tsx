import React, { useState } from "react";
import { Sparkles, ArrowRight, HelpCircle, Lightbulb } from "lucide-react";

interface DecisionFormProps {
  onAnalyze: (title: string, context: string, options: string[]) => void;
  isLoading: boolean;
}

// In-app scenario templates to lower cognitive friction
const SCENARIOS = [
  {
    title: "Move to New York vs stay in San Francisco",
    context: "I have a high-paying job offer in NYC. I love my friends and cozy lifestyle in San Francisco, but NYC offers incredible career growth. I value professional growth but fear burnout and high costs.",
    options: ["Move to New York City", "Stay in San Francisco"],
    badge: "Career Crossroad"
  },
  {
    title: "Buy a Plug-in Hybrid vs Full Battery EV",
    context: "Buying a new daily commuter vehicle. I keep cars for 8+ years. I commute 40 miles roundtrip daily but occasionally take statewide road trips. I don't have a reliable fast charger at work, only standard outlet.",
    options: ["Plug-In Hybrid (PHEV)", "Full Electric Vehicle (EV)"],
    badge: "Automotive"
  },
  {
    title: "Rent a downtown apartment vs buy a suburban home",
    context: "Evaluating living situations for the next 5 years. I am single, work remotely 3 days/week, and love urban walkability. My parents want me to build equity in a suburban townhouse.",
    options: ["Rent Downtown Apartment", "Buy Suburban Townhome"],
    badge: "Real Estate"
  },
  {
    title: "Learn Rust or master Golang for backend engineering",
    context: "I want to maximize my software engineer career value in the next 18 months, focusing on cloud services and distributed systems performance.",
    options: ["Learn Golang", "Learn Rust"],
    badge: "Skill Path"
  }
];

export default function DecisionForm({ onAnalyze, isLoading }: DecisionFormProps) {
  const [mode, setMode] = useState<"compare" | "action">("compare");
  const [title, setTitle] = useState("");
  const [context, setContext] = useState("");
  const [options, setOptions] = useState<string[]>(["Option A", "Option B"]);

  const [activeStepMessages, setActiveStepMessages] = useState<string>("");

  const handleScenarioSelect = (scen: typeof SCENARIOS[0]) => {
    setTitle(scen.title);
    setContext(scen.context);
    setOptions([...scen.options]);
    setMode("compare");
  };

  const setSingleActionMode = () => {
    setMode("action");
    setOptions(["Implement Action Plans", "Maintain Status Quo / Defer"]);
  };

  const setCompareMode = () => {
    setMode("compare");
    setOptions(["Option A", "Option B"]);
  };

  const handleOptionChange = (idx: number, newVal: string) => {
    const updated = [...options];
    updated[idx] = newVal;
    setOptions(updated);
  };

  const addOption = () => {
    if (options.length < 3) {
      setOptions([...options, `Option ${String.fromCharCode(65 + options.length)}`]);
    }
  };

  const removeOption = (idx: number) => {
    if (options.length > 2) {
      const updated = options.filter((_, i) => i !== idx);
      setOptions(updated);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    // Clean option strings
    const cleanedOptions = options.map(o => o.trim()).filter(o => o !== "");
    onAnalyze(title.trim(), context.trim(), cleanedOptions);
  };

  return (
    <div id="decision-form-container" className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-100 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-950 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500 fill-indigo-200" />
            Set Up Your Decision
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            State your dilemma and define the exact paths to compare.
          </p>
        </div>

        {/* Comparison Mode Selector */}
        <div className="flex bg-slate-100 p-1 rounded-xl mt-4 md:mt-0 text-xs font-medium border border-slate-200">
          <button
            type="button"
            onClick={setCompareMode}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              mode === "compare"
                ? "bg-white text-slate-900 shadow-xs ring-1 ring-slate-100"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Compare Alternatives
          </button>
          <button
            type="button"
            onClick={setSingleActionMode}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              mode === "action"
                ? "bg-white text-slate-900 shadow-xs ring-1 ring-slate-100"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Go / No-Go Choice
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Input */}
        <div>
          <label htmlFor="decision-title" className="block text-sm font-semibold text-slate-950 mb-1.5">
            What decision are you trying to make? <span className="text-indigo-500">*</span>
          </label>
          <input
            id="decision-title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Should I move to New York vs stay in San Francisco?"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium"
          />
        </div>

        {/* Context Input */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="decision-context" className="block text-sm font-semibold text-slate-950">
              Provide Context & Priorities <span className="text-xs text-slate-400 font-normal">(Optional but highly recommended)</span>
            </label>
            <span className="text-[10px] bg-slate-100 text-slate-500 font-mono code px-1.5 py-0.5 rounded-sm">AI context depth</span>
          </div>
          <textarea
            id="decision-context"
            rows={4}
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Describe your current situation, budget limits, core values, work preferences, personal timeline, or key fears. The more context you provide, the deeper the analysis will align to you."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium leading-relaxed resize-none"
          />
        </div>

        {/* Options Setup */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold text-slate-950">
              {mode === "compare" ? "Configure Options to Compare" : "Predefined Action Paths"}
            </label>
            
            {mode === "compare" && options.length < 3 && (
              <button
                type="button"
                onClick={addOption}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 flex items-center gap-1 cursor-pointer"
              >
                + Add Option C
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {options.map((opt, idx) => (
              <div key={idx} className="relative group bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col gap-1.5 focus-within:ring-2 focus-within:ring-indigo-500/10 focus-within:border-indigo-500 transition-all">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>Option {String.fromCharCode(65 + idx)}</span>
                  {mode === "compare" && options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(idx)}
                      className="text-red-500 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      Delete
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  required
                  disabled={mode === "action"}
                  value={opt}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold text-slate-900 border-none p-0 focus:ring-0 focus:outline-hidden disabled:text-slate-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Analyze Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading || !title.trim()}
            className="w-full bg-slate-950 hover:bg-slate-900 text-white font-semibold rounded-2xl py-4 flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Evaluating Trade-offs with AI...
              </span>
            ) : (
              <>
                Let's Break the Tie <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Scenario Blueprint Helpers */}
      <div className="mt-8 pt-6 border-t border-slate-100">
        <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-3">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          Or Start with a Blueprint Scenario
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SCENARIOS.map((scen, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleScenarioSelect(scen)}
              className="text-left bg-slate-50 hover:bg-indigo-50/50 hover:border-indigo-200 border border-slate-100 rounded-xl p-3.5 transition-all group pointer"
            >
              <div className="flex justify-between items-center text-[9px] font-bold font-mono text-indigo-600 uppercase tracking-wider">
                <span>{scen.badge}</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
              <h4 className="text-sm font-semibold text-slate-950 mt-1 truncate" title={scen.title}>
                {scen.title}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                {scen.context}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
