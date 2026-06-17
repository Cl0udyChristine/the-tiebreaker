import { OptionAnalysis, ProCon } from "../types";
import { CheckCircle2, XCircle, DollarSign, Heart, Clock, Briefcase, Sparkles, Scale, Info } from "lucide-react";

interface ProsConsSheetProps {
  options: OptionAnalysis[];
  onOptionsUpdated: (updated: OptionAnalysis[]) => void;
}

// Maps categories to high-quality visual icons
function CategoryIcon({ category, className = "w-4 h-4" }: { category: string; className?: string }) {
  const norm = category.toLowerCase();
  if (norm.includes("finance") || norm.includes("money") || norm.includes("cost") || norm.includes("pay")) {
    return <DollarSign className={`${className} text-emerald-600`} />;
  }
  if (norm.includes("emotion") || norm.includes("health") || norm.includes("mental") || norm.includes("stress")) {
    return <Heart className={`${className} text-rose-600`} />;
  }
  if (norm.includes("time") || norm.includes("schedule") || norm.includes("convenience") || norm.includes("duration")) {
    return <Clock className={`${className} text-amber-600`} />;
  }
  if (norm.includes("career") || norm.includes("job") || norm.includes("work") || norm.includes("professional") || norm.includes("learn")) {
    return <Briefcase className={`${className} text-indigo-600`} />;
  }
  return <Sparkles className={`${className} text-sky-600`} />;
}

export default function ProsConsSheet({ options, onOptionsUpdated }: ProsConsSheetProps) {

  const handleProToggle = (optIdx: number, proIdx: number) => {
    const fresh = JSON.parse(JSON.stringify(options)) as OptionAnalysis[];
    const isEnabled = fresh[optIdx].pros[proIdx].isEnabled !== false; // Default true if undefined
    fresh[optIdx].pros[proIdx].isEnabled = !isEnabled;
    onOptionsUpdated(fresh);
  };

  const handleConToggle = (optIdx: number, conIdx: number) => {
    const fresh = JSON.parse(JSON.stringify(options)) as OptionAnalysis[];
    const isEnabled = fresh[optIdx].cons[conIdx].isEnabled !== false;
    fresh[optIdx].cons[conIdx].isEnabled = !isEnabled;
    onOptionsUpdated(fresh);
  };

  const handleProWeightChange = (optIdx: number, proIdx: number, val: number) => {
    const fresh = JSON.parse(JSON.stringify(options)) as OptionAnalysis[];
    fresh[optIdx].pros[proIdx].customWeight = val;
    onOptionsUpdated(fresh);
  };

  const handleConWeightChange = (optIdx: number, conIdx: number, val: number) => {
    const fresh = JSON.parse(JSON.stringify(options)) as OptionAnalysis[];
    fresh[optIdx].cons[conIdx].customWeight = val;
    onOptionsUpdated(fresh);
  };

  // Compute active score indicator for visualizer column sums
  const getColumnScoreStats = (optIdx: number) => {
    const opt = options[optIdx];
    let net = 0;
    
    opt.pros.forEach(p => {
      if (p.isEnabled !== false) {
        net += p.customWeight ?? p.weight;
      }
    });

    opt.cons.forEach(c => {
      if (c.isEnabled !== false) {
        net -= c.customWeight ?? c.weight;
      }
    });

    return net;
  };

  return (
    <div className="space-y-8">
      {/* Dynamic Weight Tuning Notice */}
      <div className="bg-amber-50 border border-amber-200/60 rounded-2xl p-4 flex gap-3 text-slate-700 text-xs font-medium leading-relaxed">
        <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-amber-900">Interactive Sandbox Mode Active:</span> Toggle the items on or off, or slide the importance ranks to see the impact in real-time. The Tiebreaker vector gauge above automatically recalculates ratios as you customize your values!
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {options.map((option, optIdx) => {
          const scoreStats = getColumnScoreStats(optIdx);

          return (
            <div key={optIdx} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
              <div>
                {/* Header */}
                <div className="flex justify-between items-start pb-4 border-b border-slate-100 mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-950 truncate max-w-[280px]" title={option.name}>
                      {option.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {option.summary}
                    </p>
                  </div>
                  {/* Option Net Impact Rating Score */}
                  <div className="text-right">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block tracking-wider">
                      Net Index
                    </span>
                    <span className={`text-xl font-extrabold font-mono ${
                      scoreStats > 0 ? "text-emerald-600" : scoreStats < 0 ? "text-rose-600" : "text-slate-500"
                    }`}>
                      {scoreStats > 0 ? `+${scoreStats}` : scoreStats}
                    </span>
                  </div>
                </div>

                {/* Pros List */}
                <div className="mb-8">
                  <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 font-mono mb-4">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 block" />
                    Pros (Benefits & Drivers)
                  </h4>
                  
                  {option.pros.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No positive factors generated.</p>
                  ) : (
                    <div className="space-y-4">
                      {option.pros.map((pro, pIdx) => {
                        const isEnabled = pro.isEnabled !== false;
                        const weight = pro.customWeight ?? pro.weight;

                        return (
                          <div
                            key={pIdx}
                            className={`p-4 rounded-xl border transition-all ${
                              isEnabled
                                ? "bg-emerald-50/10 border-slate-200 text-slate-900"
                                : "bg-slate-50 border-slate-100 text-slate-400 opacity-60"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              {/* Toggle Checkbox */}
                              <button
                                type="button"
                                onClick={() => handleProToggle(optIdx, pIdx)}
                                className="mt-0.5 text-slate-400 hover:text-emerald-500 transition-colors shrink-0 cursor-pointer"
                              >
                                {isEnabled ? (
                                  <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                                ) : (
                                  <div className="w-5 h-5 rounded-full border-2 border-slate-300 bg-white" />
                                )}
                              </button>

                              {/* Title + Desc */}
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h5 className={`text-sm font-semibold truncate ${isEnabled ? "text-slate-950" : "text-slate-400 font-normal line-through"}`}>
                                    {pro.title}
                                  </h5>
                                  <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 border border-slate-200/50 text-[10px] px-1.5 py-0.5 rounded-md font-mono">
                                    <CategoryIcon category={pro.category} className="w-3 h-3" />
                                    {pro.category}
                                  </span>
                                </div>
                                <p className={`text-xs mt-1 leading-relaxed ${isEnabled ? "text-slate-600" : "text-slate-400"}`}>
                                  {pro.description}
                                </p>

                                {/* Interactive Weight Range Slider */}
                                {isEnabled && (
                                  <div className="mt-3 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 flex items-center justify-between gap-4">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider shrink-0">
                                      Importance: {weight} / 5
                                    </span>
                                    <input
                                      type="range"
                                      min="1"
                                      max="5"
                                      value={weight}
                                      onChange={(e) => handleProWeightChange(optIdx, pIdx, parseInt(e.target.value))}
                                      className="w-28 accent-emerald-600 h-1 bg-slate-200 rounded-lg cursor-pointer appearance-none shrink-0"
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Cons List */}
                <div>
                  <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-700 font-mono mb-4">
                    <span className="w-2 h-2 rounded-full bg-rose-500 block" />
                    Cons (Risks & Liabilities)
                  </h4>
                  
                  {option.cons.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No negative factors generated.</p>
                  ) : (
                    <div className="space-y-4">
                      {option.cons.map((con, cIdx) => {
                        const isEnabled = con.isEnabled !== false;
                        const weight = con.customWeight ?? con.weight;

                        return (
                          <div
                            key={cIdx}
                            className={`p-4 rounded-xl border transition-all ${
                              isEnabled
                                ? "bg-rose-50/10 border-slate-200 text-slate-900"
                                : "bg-slate-50 border-slate-100 text-slate-400 opacity-60"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              {/* Toggle Checkbox */}
                              <button
                                type="button"
                                onClick={() => handleConToggle(optIdx, cIdx)}
                                className="mt-0.5 text-slate-400 hover:text-rose-500 transition-colors shrink-0 cursor-pointer"
                              >
                                {isEnabled ? (
                                  <XCircle className="w-5 h-5 text-rose-600 fill-rose-100" />
                                ) : (
                                  <div className="w-5 h-5 rounded-full border-2 border-slate-300 bg-white" />
                                )}
                              </button>

                              {/* Title + Desc */}
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h5 className={`text-sm font-semibold truncate ${isEnabled ? "text-slate-950" : "text-slate-400 font-normal line-through"}`}>
                                    {con.title}
                                  </h5>
                                  <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 border border-slate-200/50 text-[10px] px-1.5 py-0.5 rounded-md font-mono">
                                    <CategoryIcon category={con.category} className="w-3 h-3" />
                                    {con.category}
                                  </span>
                                </div>
                                <p className={`text-xs mt-1 leading-relaxed ${isEnabled ? "text-slate-600" : "text-slate-400"}`}>
                                  {con.description}
                                </p>

                                {/* Interactive Weight Range Slider */}
                                {isEnabled && (
                                  <div className="mt-3 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 flex items-center justify-between gap-4">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider shrink-0">
                                      Liability Rank: {weight} / 5
                                    </span>
                                    <input
                                      type="range"
                                      min="1"
                                      max="5"
                                      value={weight}
                                      onChange={(e) => handleConWeightChange(optIdx, cIdx, parseInt(e.target.value))}
                                      className="w-28 accent-rose-600 h-1 bg-slate-200 rounded-lg cursor-pointer appearance-none shrink-0"
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
