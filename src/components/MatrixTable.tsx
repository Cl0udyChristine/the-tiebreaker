import { MatrixCriterion } from "../types";
import { Star } from "lucide-react";

interface MatrixTableProps {
  matrix: MatrixCriterion[];
}

export default function MatrixTable({ matrix }: MatrixTableProps) {
  if (!matrix || matrix.length === 0) {
    return (
      <div className="text-center py-6 text-xs text-slate-400 italic">
        No comparative matrix metrics were generated.
      </div>
    );
  }

  // Get options present in the ratings list
  const optionNames = matrix[0]?.ratings.map((r) => r.optionName) || [];

  return (
    <div id="matrix-table-container" className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
      <div className="p-5 border-b border-slate-100 bg-slate-50/50">
        <h4 className="text-sm font-bold text-slate-950 font-sans">
          Side-By-Side Criteria Scoreboard
        </h4>
        <p className="text-xs text-slate-500 mt-1">
          Direct structural comparison across standardized qualitative and quantitative evaluation criteria.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-100/40 text-[11px] font-bold font-mono tracking-wider text-slate-500 uppercase">
              <th className="py-4 px-6 w-1/4">Criterion</th>
              {optionNames.map((name, idx) => (
                <th key={idx} className="py-4 px-6 w-[37.5%]">
                  {name} Evaluation
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {matrix.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-slate-50/70 transition-colors">
                {/* Criterion label */}
                <td className="py-4.5 px-6 font-semibold text-xs text-slate-800">
                  {row.criterion}
                </td>

                {/* Option columns */}
                {row.ratings.map((rateObj, oIdx) => (
                  <td key={oIdx} className="py-4.5 px-6">
                    <div className="space-y-1.5">
                      {/* Star score display */}
                      <div className="flex gap-0.5 items-center">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= rateObj.score
                                ? "text-amber-500 fill-amber-400"
                                : "text-slate-200 fill-slate-100"
                            }`}
                          />
                        ))}
                        <span className="text-[10px] font-bold font-mono text-slate-500 ml-1.5 bg-slate-100 px-1.5 py-0.2 rounded-sm">
                          {rateObj.score}/5
                        </span>
                      </div>
                      {/* Detail Text */}
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        {rateObj.ratingText}
                      </p>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
