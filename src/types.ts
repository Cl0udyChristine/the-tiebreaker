export interface ProCon {
  id?: string; // Client-side unique key
  title: string;
  description: string;
  weight: number; // Baseline rating 1-5
  category: string;
  isEnabled?: boolean; // Interactive state toggle
  customWeight?: number; // User adjusted weight
}

export interface SWOT {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface OptionAnalysis {
  name: string;
  summary: string;
  pros: ProCon[];
  cons: ProCon[];
  swot: SWOT;
}

export interface MatrixCriterionRating {
  optionName: string;
  ratingText: string;
  score: number; // 1 to 5
}

export interface MatrixCriterion {
  criterion: string;
  ratings: MatrixCriterionRating[];
}

export interface DecisionAnalysisResponse {
  decisionTitle: string;
  verdictSummary: string;
  verdictDetail: string;
  recommendedOptionIndex: number;
  confidenceScore: number;
  options: OptionAnalysis[];
  comparisonMatrix: MatrixCriterion[];
}

export interface SavedDecision {
  id: string;
  createdAt: string;
  userContext?: string;
  baselineData: DecisionAnalysisResponse;
  // Allows restoring customized weights and triggers
  userOverrides?: {
    optionOverrides: {
      optionIndex: number;
      pros: { title: string; weight: number; isEnabled: boolean }[];
      cons: { title: string; weight: number; isEnabled: boolean }[];
    }[];
  };
}
