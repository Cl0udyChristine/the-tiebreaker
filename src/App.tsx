import React, { useState, useEffect } from "react";
import { 
  SavedDecision, 
  DecisionAnalysisResponse, 
  OptionAnalysis 
} from "./types";
import DecisionForm from "./components/DecisionForm";
import Gauge from "./components/Gauge";
import ProsConsSheet from "./components/ProsConsSheet";
import SWOTPanel from "./components/SWOTPanel";
import MatrixTable from "./components/MatrixTable";
import { 
  History, 
  Plus, 
  Trash2, 
  Calendar, 
  RotateCcw, 
  Copy, 
  Check, 
  HelpCircle, 
  Scale, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Brain,
  Info
} from "lucide-react";

// Pre-seeded high-quality demo decision to showcase capability immediately
const DEMO_DECISION: SavedDecision = {
  id: "demo-career",
  createdAt: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
  userContext: "I have a stellar offer in New York on the East Coast. I absolutely love my deep-rooted social circle and mild climate in San Francisco, but NYC offers a highly-leveraged career propellant. I value growth but fear high burnout.",
  baselineData: {
    decisionTitle: "Move to New York vs stay in San Francisco",
    verdictSummary: "Move to New York with high-leverage defined time horizons",
    verdictDetail: "While San Francisco provides an optimal mental baseline and a cohesive support circle with high comfort, the New York City offer is a professional propellant you cannot afford to ignore at this stage of your cycle. The high-density competitive ecosystem will massively expand your career trajectory. To mitigate extreme burnout risks and weather shifts, establish a defined 2-year horizon with quarterly retreats to the West coast, treating the relocation as a short-term leverage phase rather than a permanent compromise of physical comfort.",
    recommendedOptionIndex: 0,
    confidenceScore: 88,
    options: [
      {
        name: "Move to New York City",
        summary: "Accept the high-growth opportunity, relocate, and plug into the intense East Coast ecosystem.",
        pros: [
          { title: "Exponential Network density", description: "Direct daily collisions with high-level founders, operators, and strategic allocators.", weight: 5, category: "Career", isEnabled: true },
          { title: "Compensation leverage", description: "Higher package resets your salary benchmark, amplifying your potential earnings curve.", weight: 4, category: "Financial", isEnabled: true },
          { title: "Cultural immersion", description: "Incredible walkability and immediate access to global theater, dining, and artistic circles.", weight: 4, category: "Lifestyle", isEnabled: true }
        ],
        cons: [
          { title: "Severe cost inflation", description: "High local tax load and steep luxury rental costs will squeeze your early liquid margin.", weight: 4, category: "Financial", isEnabled: true },
          { title: "Burnout environment", description: "Pervasive status-focused social circles may deplete your sleep quality and peace of mind.", weight: 3, category: "Emotional", isEnabled: true }
        ],
        swot: {
          strengths: ["Immediate decision-maker density", "Top tier investment networks", "Higher initial package benchmark"],
          weaknesses: ["Harsh winter seasonality", "Competitive, expensive apartment markets", "Lack of outdoor-nature proximity"],
          opportunities: ["Rapid spin-out company potential", "Global finance & corporate integration", "Unparalleled social diversity"],
          threats: ["Chronic lifestyle exhaustion", "Depletion of savings on baseline rent", "Diminishing health and exercise habits"]
        }
      },
      {
        name: "Stay in San Francisco",
        summary: "Decline the East Coast offer, stay on the West Coast enjoying established comfort.",
        pros: [
          { title: "Unmatched health & outdoors", description: "Mild year-round microclimates and instant access to hikes, surf, and fitness communities.", weight: 5, category: "Lifestyle", isEnabled: true },
          { title: "Established support circle", description: "Deep relational capital provides solid mental backing and safety net.", weight: 4, category: "Emotional", isEnabled: true }
        ],
        cons: [
          { title: "Career velocity slowdown", description: "Maintaining comfort might result in professional plateauing or missing industry momentum.", weight: 4, category: "Career", isEnabled: true },
          { title: "Geographical monoculture", description: "Overwhelmingly tech-obsessed social structures can limit personal viewpoints and networks.", weight: 3, category: "Lifestyle", isEnabled: true }
        ],
        swot: {
          strengths: ["Deep local relational capital", "Mild microclimates and nature", "Slightly more relaxed lifestyle pacing"],
          weaknesses: ["Exposure to hyper-concentrated local fluctuations", "High cost for medium density urban hubs", "Relational bubble effect"],
          opportunities: ["Niche specialized interest group leadership", "Relational deepening", "Prioritizing longevity and wellness routines"],
          threats: ["Career velocity plateaus", "Monocultural tech burnout", "Loss of urgency and adaptive capability"]
        }
      }
    ],
    comparisonMatrix: [
      {
        criterion: "Professional Growth Speed",
        ratings: [
          { optionName: "Move to New York City", ratingText: "Fast-tracked ecosystem with higher visibility.", score: 5 },
          { optionName: "Stay in San Francisco", "ratingText": "Conservative growth, highly familiar benchmarks.", score: 3 }
        ]
      },
      {
        criterion: "Relational Circle Comfort",
        ratings: [
          { optionName: "Move to New York City", "ratingText": "Requires full rebuild; transient social networks.", score: 2 },
          { optionName: "Stay in San Francisco", "ratingText": "Deep support system; strong baseline safety net.", score: 5 }
        ]
      },
      {
        criterion: "Health & Climatic Quality",
        ratings: [
          { optionName: "Move to New York City", "ratingText": "Vicious winters, dense pollution, hectic transit.", score: 2 },
          { optionName: "Stay in San Francisco", "ratingText": "Pristine nature access, temperate weather year-round.", score: 5 }
        ]
      }
    ]
  }
};

export default function App() {
  const [history, setHistory] = useState<SavedDecision[]>([]);
  const [activeDecisionId, setActiveDecisionId] = useState<string | null>("demo-career");
  const [isFormVisible, setIsFormVisible] = useState(false);
  
  // Loading & Error States
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Tabs for analysis results
  const [activeViewTab, setActiveViewTab] = useState<"proscons" | "swot" | "matrix">("proscons");
  
  // Action Feedback state
  const [copied, setCopied] = useState(false);

  // Initialize history with preloaded demo if empty
  useEffect(() => {
    const saved = localStorage.getItem("tiebreaker_history");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as SavedDecision[];
        if (parsed.length === 0) {
          setHistory([DEMO_DECISION]);
          localStorage.setItem("tiebreaker_history", JSON.stringify([DEMO_DECISION]));
        } else {
          setHistory(parsed);
          // Auto-load the first item from history if we have one
          if (parsed.length > 0) {
            setActiveDecisionId(parsed[0].id);
          }
        }
      } catch (e) {
        setHistory([DEMO_DECISION]);
      }
    } else {
      setHistory([DEMO_DECISION]);
      localStorage.setItem("tiebreaker_history", JSON.stringify([DEMO_DECISION]));
    }
  }, []);

  // Sync back history changes to localStorage
  const saveHistoryToWebStorage = (freshHistory: SavedDecision[]) => {
    setHistory(freshHistory);
    localStorage.setItem("tiebreaker_history", JSON.stringify(freshHistory));
  };

  // Find active decision item
  const activeDecision = history.find(item => item.id === activeDecisionId);

  // Handle new analysis generation
  const handleAnalyzeDecision = async (title: string, userContext: string, options: string[]) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, context: userContext, options })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "An error occurred during evaluation.");
      }

      // Add deep default attributes (isEnabled: true) to make pros/cons interactive immediately
      const parsedData = data as DecisionAnalysisResponse;
      parsedData.options = parsedData.options.map(opt => ({
        ...opt,
        pros: opt.pros.map(p => ({ ...p, isEnabled: true })),
        cons: opt.cons.map(c => ({ ...c, isEnabled: true }))
      }));

      const newSavedItem: SavedDecision = {
        id: `dec-${Date.now()}`,
        createdAt: new Date().toISOString(),
        userContext,
        baselineData: parsedData
      };

      const revisedHistory = [newSavedItem, ...history];
      saveHistoryToWebStorage(revisedHistory);
      setActiveDecisionId(newSavedItem.id);
      setIsFormVisible(false);
      setActiveViewTab("proscons");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to contact analysis server. Please check your network connection.");
    } finally {
      setIsLoading(false);
    }
  };

  // Callback from proscons component when weight sliders or toggles adjust
  const handleOptionStateUpdate = (revisedOptions: OptionAnalysis[]) => {
    if (!activeDecision) return;
    
    const revisedHistory = history.map(item => {
      if (item.id === activeDecision.id) {
        return {
          ...item,
          baselineData: {
            ...item.baselineData,
            options: revisedOptions
          }
        };
      }
      return item;
    });

    saveHistoryToWebStorage(revisedHistory);
  };

  // Reset sliders and enabled states back to initial AI baseline
  const resetSliderSettings = () => {
    if (!activeDecision) return;
    
    const freshOptions = activeDecision.baselineData.options.map(opt => ({
      ...opt,
      pros: opt.pros.map(p => ({ ...p, isEnabled: true, customWeight: undefined })),
      cons: opt.cons.map(c => ({ ...c, isEnabled: true, customWeight: undefined }))
    }));

    const revisedHistory = history.map(item => {
      if (item.id === activeDecision.id) {
        return {
          ...item,
          baselineData: {
            ...item.baselineData,
            options: freshOptions
          }
        };
      }
      return item;
    });

    saveHistoryToWebStorage(revisedHistory);
  };

  // Delete an individual decision history item
  const handleDeleteDecision = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid click triggers
    const updated = history.filter(item => item.id !== id);
    saveHistoryToWebStorage(updated);
    
    if (activeDecisionId === id) {
      if (updated.length > 0) {
        setActiveDecisionId(updated[0].id);
      } else {
        setActiveDecisionId(null);
        setIsFormVisible(true);
      }
    }
  };

  // Prepare simple text copy formatting of the decision Analysis
  const handleCopySummary = () => {
    if (!activeDecision) return;
    const { decisionTitle, verdictSummary, verdictDetail, options } = activeDecision.baselineData;
    
    let summaryText = `--- THE TIEBREAKER REPORT ---\n`;
    summaryText += `Topic: ${decisionTitle}\n`;
    summaryText += `Context: ${activeDecision.userContext || "None specified"}\n\n`;
    summaryText += `AI VERDICT: ${verdictSummary}\n`;
    summaryText += `Recommendation Strategy:\n${verdictDetail}\n\n`;
    
    options.forEach(opt => {
      summaryText += `[Option: ${opt.name}]\n`;
      summaryText += `Summary: ${opt.summary}\n`;
      summaryText += `Pros:\n`;
      opt.pros.forEach(p => {
        if (p.isEnabled !== false) {
          summaryText += `  - ${p.title} (Weight: ${p.customWeight ?? p.weight}/5): ${p.description}\n`;
        }
      });
      summaryText += `Cons:\n`;
      opt.cons.forEach(c => {
        if (c.isEnabled !== false) {
          summaryText += `  - ${conSymbolForText(c.title)} (Weight: ${c.customWeight ?? c.weight}/5): ${c.description}\n`;
        }
      });
      summaryText += `\n`;
    });

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const conSymbolForText = (title: string) => title;

  // Real-time calculation of Option A vs Option B scores to drive the needle on the Gauge
  const getActiveBalancePercent = (): number => {
    if (!activeDecision || activeDecision.baselineData.options.length < 2) return 50;
    const optA = activeDecision.baselineData.options[0];
    const optB = activeDecision.baselineData.options[1];

    const getNetScore = (opt: OptionAnalysis) => {
      const prosSum = opt.pros.reduce((sum, p) => sum + (p.isEnabled !== false ? (p.customWeight ?? p.weight) : 0), 0);
      const consSum = opt.cons.reduce((sum, c) => sum + (c.isEnabled !== false ? (c.customWeight ?? c.weight) : 0), 0);
      return prosSum - consSum;
    };

    const netA = getNetScore(optA);
    const netB = getNetScore(optB);

    const diff = netB - netA;
    
    // Smooth factor shifts needle. 50 is center (tie). 
    // Shift is 3.5% per aggregate point of option weight delta.
    let balance = 50 + diff * 4;
    return Math.min(Math.max(balance, 5), 95);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Prime Header Nav Row */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-40 px-6 py-4.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="bg-slate-950 text-white rounded-xl p-2 font-black font-display text-sm flex items-center justify-center tracking-tight shadow-md">
            TB
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-950 tracking-tight font-display">
              The Tiebreaker
            </h1>
            <p className="text-[10px] text-slate-500 font-mono tracking-wider uppercase">
              Interactive Decision Studio
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setIsFormVisible(true);
              setActiveDecisionId(null);
            }}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            New Decision
          </button>
        </div>
      </header>

      {/* Main Grid Layout containing Sidebar and Core workspace */}
      <div className="flex-1 max-w-[1550px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-0 relative">
        
        {/* Left Sidebar Pane: History logs */}
        <aside className="lg:col-span-3 border-r border-slate-200/80 bg-white p-5 flex flex-col gap-6 select-none shrink-0">
          <div>
            <h3 className="text-xs font-bold font-mono tracking-widest text-slate-400 uppercase mb-3 flex items-center gap-1.5">
              <History className="w-3.5 h-3.5" />
              Decision History
            </h3>

            {history.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-slate-100 rounded-2xl">
                <p className="text-xs text-slate-400 italic">No historical evaluations found.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[300px] lg:max-h-[500px] overflow-y-auto pr-1">
                {history.map((item) => {
                  const isActive = item.id === activeDecisionId;
                  const opts = item.baselineData.options;
                  const winner = opts[item.baselineData.recommendedOptionIndex]?.name || "Winner";

                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setActiveDecisionId(item.id);
                        setIsFormVisible(false);
                      }}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all relative flex flex-col gap-2 cursor-pointer ${
                        isActive
                          ? "bg-slate-950 border-slate-950 text-white shadow-xs"
                          : "bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-800"
                      }`}
                    >
                      <div className="flex justify-between items-center w-full min-w-0">
                        <span className={`text-[10px] font-mono flex items-center gap-1 ${isActive ? "text-slate-400" : "text-slate-400"}`}>
                          <Calendar className="w-3 h-3" />
                          {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                        
                        <button
                          type="button"
                          title="Delete session"
                          onClick={(e) => handleDeleteDecision(item.id, e)}
                          className={`hover:scale-105 transition-transform p-1 rounded-md shrink-0 cursor-pointer ${
                            isActive 
                              ? "text-slate-400 hover:text-red-400 hover:bg-slate-900" 
                              : "text-slate-400 hover:text-red-500 hover:bg-slate-200/50"
                          }`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="font-semibold text-xs truncate max-w-[180px] leading-tight">
                        {item.baselineData.decisionTitle}
                      </div>

                      <div className={`text-[9px] font-medium font-mono uppercase tracking-wider truncate py-0.5 px-2 rounded-md border text-center ${
                        isActive
                          ? "bg-indigo-900/60 border-indigo-700/50 text-indigo-200"
                          : "bg-indigo-50 border-indigo-100 text-indigo-700"
                      }`}>
                        Winner: {winner}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Informational Guide */}
          <div className="mt-auto bg-indigo-50/50 border border-indigo-100/50 rounded-2xl p-4 flex flex-col gap-2">
            <h4 className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
              <Brain className="w-4 h-4 text-indigo-600" />
              Strategic Consultant
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              We structure your core trade-offs, compute weighted balance scores, map internal/external opportunities via SWOT analysis, and let you sandbox scenarios with sliders.
            </p>
          </div>
        </aside>

        {/* Right workspace panel */}
        <main className="lg:col-span-9 p-6 md:p-8 flex flex-col gap-8">
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-900 rounded-2xl p-4 text-sm font-semibold flex items-center justify-between shadow-xs">
              <span>{error}</span>
              <button onClick={() => setError(null)} className="text-xs font-bold font-mono text-red-500 hover:text-red-700 pl-4">DISMISS</button>
            </div>
          )}

          {/* Render input form if selected or if history is dry and has no loaded session */}
          {isFormVisible || !activeDecision ? (
            <div className="max-w-3xl mx-auto w-full">
              <DecisionForm onAnalyze={handleAnalyzeDecision} isLoading={isLoading} />
            </div>
          ) : (
            /* Results Presentation Workspace */
            <div className="space-y-8">
              
              {/* Header block with actions */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold font-display text-slate-950 flex items-center gap-2">
                    <Scale className="w-5 h-5 text-indigo-600 shrink-0" />
                    {activeDecision.baselineData.decisionTitle}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 max-w-[500px] truncate" title={activeDecision.userContext}>
                    Context: {activeDecision.userContext || "No additional context specified."}
                  </p>
                </div>

                {/* Relational Action Bar */}
                <div className="flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    onClick={resetSliderSettings}
                    title="Restore AI initial default settings"
                    className="bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset Sliders
                  </button>

                  <button
                    type="button"
                    onClick={handleCopySummary}
                    className="bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        Copied Report!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy Brief
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Upper Section: Gauge and AI Verdict */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                
                {/* Score balance SVG needle gauge */}
                <div className="md:col-span-5">
                  <Gauge 
                    score={getActiveBalancePercent()} 
                    optionAName={activeDecision.baselineData.options[0]?.name || "Option A"} 
                    optionBName={activeDecision.baselineData.options[1]?.name || "Option B"} 
                    confidenceScore={activeDecision.baselineData.confidenceScore}
                  />
                </div>

                {/* Cohesive Recommended Outcome Details */}
                <div className="md:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between self-stretch">
                  <div>
                    <span className="text-[10px] font-bold font-mono tracking-widest text-indigo-600 uppercase block mb-1.5">
                      Decision Recommendation Verdict
                    </span>
                    <h3 className="text-base md:text-lg font-bold text-slate-950 font-display mb-3">
                      {activeDecision.baselineData.verdictSummary}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal whitespace-pre-line">
                      {activeDecision.baselineData.verdictDetail}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>Decider version: Gemini 3.5 Flash</span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                      Analytical calibration locked
                    </span>
                  </div>
                </div>
              </div>

              {/* Middle Section: Tab Switchers */}
              <div className="border-b border-slate-200/80 flex gap-1 bg-slate-100 p-1 rounded-2xl max-w-lg">
                <button
                  type="button"
                  onClick={() => setActiveViewTab("proscons")}
                  className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeViewTab === "proscons"
                      ? "bg-white text-slate-950 shadow-xs border border-slate-200/50 font-extrabold"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  📊 Pros & Cons Sheet
                </button>
                <button
                  type="button"
                  onClick={() => setActiveViewTab("swot")}
                  className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeViewTab === "swot"
                      ? "bg-white text-slate-950 shadow-xs border border-slate-200/50 font-extrabold"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  📈 SWOT quadrants
                </button>
                <button
                  type="button"
                  onClick={() => setActiveViewTab("matrix")}
                  className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeViewTab === "matrix"
                      ? "bg-white text-slate-950 shadow-xs border border-slate-200/50 font-extrabold"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  🆚 Comparison Matrix
                </button>
              </div>

              {/* Lower Section: Render active strategic view tab */}
              <div className="min-h-[300px]">
                {activeViewTab === "proscons" && (
                  <ProsConsSheet 
                    options={activeDecision.baselineData.options} 
                    onOptionsUpdated={handleOptionStateUpdate} 
                  />
                )}
                {activeViewTab === "swot" && (
                  <SWOTPanel 
                    options={activeDecision.baselineData.options} 
                  />
                )}
                {activeViewTab === "matrix" && (
                  <MatrixTable 
                    matrix={activeDecision.baselineData.comparisonMatrix} 
                  />
                )}
              </div>

            </div>
          )}

        </main>
      </div>

      <footer className="border-t border-slate-200 bg-white py-6 px-6 text-center text-[10px] font-mono text-slate-400 mt-auto">
        THE TIEBREAKER decision support matrix - Powered by server-side Gemini AI. All analytical weights sandbox fully offline.
      </footer>
    </div>
  );
}
