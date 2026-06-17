# The Tiebreaker ⚖️

An AI-powered decision-making application designed to help users evaluate complex choices through structured analytical frameworks. Built using Google AI Studio's rapid prototyping capabilities, the application processes user scenarios to instantly generate comparative breakdowns.

## 🚀 Features

* **Scenario Evaluation:** Accepts complex, real-world prompts (e.g., weighing business monetization strategies or choosing everyday options).
* **Dynamic Framework Selection:** Allows users to request analysis in three separate formats based on their strategic needs:
    * **Pros and Cons List:** A classic, direct breakdown of positive and negative factors.
    * **Comparison Table:** A structured, side-by-side metric comparison for multi-variable choices.
    * **SWOT Analysis:** A deep-dive matrix mapping out Strengths, Weaknesses, Opportunities, and Threats for high-stakes scenarios.
* **Self-Healing Architecture:** Developed utilizing Google AI Studio's logic-validation and "Auto-fix" capabilities to resolve syntax and application errors efficiently during runtime engineering.

---

## 🛠️ Technical Stack & Concepts

* **Platform:** Google AI Studio (App Builder)
* **Core Model:** Gemini (LLM)
* **Methodologies:** Prompt Engineering, Structured Data Output, Rapid App Prototyping

---

## 📋 How It Works / Usage

1.  **Input the Decision:** The user enters a scenario or choice dilemma into the main input field.
    * *Example:* `"Should I offer my software for free with paid features, or charge a flat $20/month premium plan?"*
2.  **Select Analysis Type:** Choose between *Pros and Cons List*, *Comparison Table*, or *SWOT Analysis*.
3.  **Generate Insights:** Click **Get Analysis** to receive the AI-generated, structured matrix tailored to the chosen framework.

---

## 💡 Key Engineering Takeaways & AI Architecture

Building this application provided deep, hands-on experience with modern generative AI patterns, moving beyond basic prompt-and-response mechanics into structured application development:

* **Designing Agentic Workflows:** Orchestrated complex systemic instructions to transform an LLM into an elite decision strategist. The core logic handles multiple user-selected analytical frameworks (Pros/Cons, Side-by-Side Matrix Tables, and SWOT Analysis) while strictly enforcing boundaries, scoring weights, and maintaining context across dynamic user interactions.
* **Resilient, Self-Healing Systems:** Leveraged automated evaluation and logic-validation toolchains ("Auto-fix" capabilities) to diagnose and repair runtime rendering anomalies and HTML nesting conflicts. This iterative debugging process demonstrated the power of AI-assisted code generation to dramatically accelerate the software development lifecycle (SDLC).
* **Robust Multi-Model Fallback Architecture:** Designed and implemented a dynamic, lazy-loaded server-side backend proxy utilizing the Google GenAI SDK. To ensure enterprise-grade uptime and mitigate potential rate-limiting or service spikes, the application incorporates a programmatic multi-model fallback chain (`gemini-2.5-flash` ➔ `gemini-3.5-flash` ➔ `gemini-1.5-flash`), catching server exceptions and rerouting payloads seamlessly to maintain application availability.
* **Structured Data & Markdown Serialization:** Engineered precise prompt constraints to ensure the generative model outputs complex structural data (like four-quadrant bento grids and metric comparison scoreboards) that parse cleanly into valid, user-facing UI components without breaking hydration or layout parameters.
