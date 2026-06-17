import { motion } from "motion/react";

interface GaugeProps {
  score: number; // 0 to 100. 50 is dead center. <50 favors Option A. >50 favors Option B.
  optionAName: string;
  optionBName: string;
  confidenceScore: number;
}

export default function Gauge({ score, optionAName, optionBName, confidenceScore }: GaugeProps) {
  // Clamp score
  const clampedScore = Math.min(Math.max(score, 0), 100);
  
  // Calculate angle for the speedometer needle (from -90deg to 90deg)
  const angle = (clampedScore / 100) * 180 - 90;

  // Determine winner name
  const isTie = Math.abs(clampedScore - 50) < 1;
  const favorText = isTie 
    ? "Perfect Tie" 
    : clampedScore < 50 
      ? `Favors: ${optionAName}` 
      : `Favors: ${optionBName}`;

  const favorMargin = Math.abs(clampedScore - 50) * 2; // Expressed as 0 to 100% margin of victory

  return (
    <div id="decision-gauge" className="relative bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col items-center">
      <div className="absolute top-4 right-4 bg-slate-800 border border-slate-700 text-[10px] uppercase font-mono tracking-wider text-slate-400 px-2 py-1 rounded-full">
        AI Confidence: {confidenceScore}%
      </div>

      <h3 className="text-slate-400 text-xs uppercase font-mono tracking-widest mb-4">
        Decision Balance Vector
      </h3>

      {/* Speedometer SVG */}
      <div className="relative w-64 h-36 overflow-hidden flex items-center justify-center">
        <svg className="w-64 h-64 absolute -bottom-28" viewBox="0 0 200 200">
          <defs>
            {/* Smooth visual gradient for background track */}
            <linearGradient id="gauge-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" /> {/* Blue / Option A */}
              <stop offset="45%" stopColor="#64748b" /> {/* Slate Gray center */}
              <stop offset="55%" stopColor="#64748b" />
              <stop offset="100%" stopColor="#14b8a6" /> {/* Teal / Option B */}
            </linearGradient>
            
            <shadow id="glow" x="-10%" y="-10%" width="120%" height="120%">
              <filter id="shadow">
                <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#090d16" />
              </filter>
            </shadow>
          </defs>

          {/* Background Outer Arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#1e293b"
            strokeWidth="16"
            strokeLinecap="round"
          />

          {/* Glowing Active Track Arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="url(#gauge-grad)"
            strokeWidth="12"
            strokeLinecap="round"
            className="opacity-90"
          />

          {/* Center Hub */}
          <circle cx="100" cy="100" r="10" fill="#f1f5f9" stroke="#0f172a" strokeWidth="3" />
          <circle cx="100" cy="100" r="4" fill="#0f172a" />

          {/* Needle Indicator */}
          <g transform={`rotate(${angle} 100 100)`}>
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="32"
              stroke="#f1f5f9"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Red tip */}
            <polygon
              points="97,35 103,35 100,22"
              fill="#ef4444"
            />
          </g>
        </svg>
      </div>

      {/* Visual Labels & Readout */}
      <div className="w-full flex justify-between text-xs px-2 mb-4 font-semibold">
        <span className="text-blue-400 max-w-[100px] truncate text-left block" title={optionAName}>
          ← {optionAName}
        </span>
        <span className="text-slate-500 font-mono">TIE</span>
        <span className="text-teal-400 max-w-[100px] truncate text-right block" title={optionBName}>
          {optionBName} →
        </span>
      </div>

      {/* Central Interactive Feedback Verdict */}
      <div className="text-center bg-slate-950/60 w-full py-3 rounded-2xl border border-slate-800/80">
        <div className={`text-base font-bold tracking-tight px-3 transition-colors duration-300 ${
          isTie ? "text-slate-200" : clampedScore < 50 ? "text-blue-400" : "text-teal-400"
        }`}>
          {favorText}
        </div>
        {!isTie && (
          <div className="text-[11px] text-slate-400 font-mono mt-0.5">
            Victory Margin: {favorMargin.toFixed(0)}%
          </div>
        )}
      </div>
    </div>
  );
}
