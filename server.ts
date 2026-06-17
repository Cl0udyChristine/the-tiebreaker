import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded Gemini Client proxy for API safety
let aiInstance: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing. Please define it in your Secrets configuration.");
    }
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiInstance;
}

const systemInstruction = `You are "The Tiebreaker", an elite decision strategist and analytical consultant.
Your role is to help users resolve tough dilemmas, choices, or "should or should not" questions.
Analyze the provided decision with surgical precision, objectivity, and empathy.

Evaluate:
1. Short-term and long-term implications.
2. Categories of trade-offs: Financial, Career/Professional, Lifestyle/Happiness, Time/Convenience, and Emotion/Health.
3. Strategic SWOT quadrants.
4. Core key metrics comparison matrix.

For Pros and Cons:
- Provide highly descriptive, specific titles and contexts.
- Set "weight" on a scale from 1 (minor impact) to 5 (critical/pivotal impact). Make sure the weights are thoughtfully balanced.
- Limit to 3-5 high-quality pros and 3-5 cons for each option so the grid remains digestible and powerful.

For SWOT analysis:
- Strengths: internal advantages of this option.
- Weaknesses: internal disadvantages of this option.
- Opportunities: external benefits or future possibilities that open up.
- Threats: external risks or future pitfalls.

For comparisonMatrix:
- Select 3 to 5 key criteria that are absolute central pillars of this decision (e.g., "Cost Efficiency", "Stress Level", "Long-term Security", "Growth potential", "Flexibility").
- Compare them side-by-side using standard option names.
- Provide a clear, detailed metric rating text (ratingText) and a numeric score of 1 to 5 representing how favorable this choice is for that specific criterion (1 is worst, 5 is best).

Provide an elegant, encouraging AI verdict with overall confidence.
Maintain a strategic, encouraging, and highly clear tone. Make sure verdictDetail is extremely detailed (at least 2-3 paragraphs) explaining the hidden nuances, cognitive traps, and trade-offs of the options.`;

const decisionSchema = {
  type: Type.OBJECT,
  properties: {
    decisionTitle: { type: Type.STRING },
    verdictSummary: { type: Type.STRING },
    verdictDetail: { type: Type.STRING },
    recommendedOptionIndex: { type: Type.INTEGER },
    confidenceScore: { type: Type.INTEGER },
    options: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          summary: { type: Type.STRING },
          pros: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                weight: { type: Type.INTEGER },
                category: { type: Type.STRING }
              },
              required: ["title", "description", "weight", "category"]
            }
          },
          cons: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                weight: { type: Type.INTEGER },
                category: { type: Type.STRING }
              },
              required: ["title", "description", "weight", "category"]
            }
          },
          swot: {
            type: Type.OBJECT,
            properties: {
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
              opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
              threats: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["strengths", "weaknesses", "opportunities", "threats"]
          }
        },
        required: ["name", "summary", "pros", "cons", "swot"]
      }
    },
    comparisonMatrix: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          criterion: { type: Type.STRING },
          ratings: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                optionName: { type: Type.STRING },
                ratingText: { type: Type.STRING },
                score: { type: Type.INTEGER }
              },
              required: ["optionName", "ratingText", "score"]
            }
          }
        },
        required: ["criterion", "ratings"]
      }
    }
  },
  required: [
    "decisionTitle",
    "verdictSummary",
    "verdictDetail",
    "recommendedOptionIndex",
    "confidenceScore",
    "options",
    "comparisonMatrix"
  ]
};

// API routes FIRST
app.post("/api/analyze", async (req, res) => {
  try {
    const { title, context, options } = req.body;

    if (!title) {
      return res.status(400).json({ error: "A decision topic or title is required." });
    }

    const compiledOptions = options && options.length > 0
      ? options
      : ["Go / Implement Plan", "Avoid / Maintain Status Quo"];

    const promptMessage = `
Analyze this decision dilemma:
- **Decision Topic**: "${title}"
- **User's Context & Dilemma**: "${context || "None specified"}"
- **Options Under Consideration**: ${JSON.stringify(compiledOptions)}

Please generate a structured SWOT, pros & cons, comparative metrics, and the final tiebreaker decision recommendation.
`;

    const ai = getGeminiClient();
    const modelsToTry = ["gemini-2.5-flash", "gemini-3.5-flash", "gemini-1.5-flash"];
    let response = null;
    let lastError = null;

    for (const model of modelsToTry) {
      try {
        response = await ai.models.generateContent({
          model: model,
          contents: promptMessage,
          config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema: decisionSchema,
            temperature: 0.7,
          }
        });
        if (response && response.text) {
          break;
        }
      } catch (err: any) {
        console.warn(`Model ${model} failed during analysis execution:`, err.message || err);
        lastError = err;
      }
    }

    if (!response || !response.text) {
      throw new Error(lastError ? lastError.message : "All Gemini model services are currently experiencing high demand. Please retry in a moment.");
    }

    const analysisData = JSON.parse(response.text.trim());
    res.json(analysisData);

  } catch (error: any) {
    console.error("Gemini service error during analysis:", error);
    res.status(500).json({
      error: error.message || "An unexpected error occurred during AI decision evaluation."
    });
  }
});

// Vite middleware for development vs static asset delivery in production
async function main() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`The Tiebreaker server started and running on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error("Failed to start default server wrapper:", err);
  process.exit(1);
});
