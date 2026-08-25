# STRATOS AI

### *"Turn Business Data Into Your Next Best Decision."*

Built specifically for **Track 2 — Turn Business Data into Strategic Decisions**.

STRATOS AI is a futuristic, production-quality AI business command center and strategic decision platform. It transforms raw, complex business datasets into clear executive briefings, root-cause diagnostics, predictive forecasts, interactive What-If scenario simulations, and prioritized strategic recommendations.

---

## 💡 The Value Proposition

Traditional business intelligence tools produce static, generic charts that force business owners to answer: *"What happened?"*

STRATOS AI closes the loop from raw telemetry to executive action:

$$\text{DATA} \longrightarrow \text{INSIGHT} \longrightarrow \text{EXPLANATION} \longrightarrow \text{PREDICTION} \longrightarrow \text{RECOMMENDATION} \longrightarrow \text{DECISION}$$

---

## 🚀 Key Features

1. **Futuristic Command Center (Dark-First Glassmorphism)**
   - Translucent frosted glass UI with subtle glowing borders, modern typography (`Outfit` & `Inter`), and spring animations.
   - Interactive KPI cards with sparklines, growth metrics, and count-up numbers.
   - Revenue trajectory charts with interactive zoom, hover tooltips, and sales view switchers (Product, Region, Category).

2. **Ground-Truth Statistical AI Analytics Engine**
   - **Data Profiling & Quality Index**: Calculates a 0–100 Data Health score based on completeness, uniqueness, and missingness.
   - **Categorized STRATOS Insights**: 🟢 Opportunity, 🔴 Risk, 🟡 Observation, 🔵 Trend with verifiable telemetry evidence.
   - **Root Cause "Why is this happening?"**: Decomposes revenue changes into visual causal chains from regional factors to product lines.
   - **Statistical Anomaly Detection**: Uses IQR and Z-score outlier models to flag sales contractions, cost spikes, and abnormal transactions.

3. **Conversational "Ask Your Data" Interface (Text-to-Chart)**
   - Translates natural language questions into safe pandas filter and aggregate operations.
   - Automatically renders dynamic visualizations (Bar, Line, Pie) with highlight metric cards.

4. **"What-If Lab" Strategic Scenario Simulator**
   - Interactive range sliders for Marketing Spend, Price Adjustments, and Conversion Velocity.
   - Empirical elasticity model calculates projected Revenue, Profit, Margin, Customer Count, and ROI with dynamic line morphing charts.

5. **Predictive Time-Series Forecasting**
   - 7-day, 30-day, 90-day, and 6-month forecasting horizons with 85% confidence interval bands.

6. **Customer & Product Intelligence Matrix**
   - Product classification matrix (⭐ Stars, 📈 Rising, ⚠️ Declining, 💰 High-Margin Workhorses).
   - Customer RFM segment breakdown (High-Value Enterprise, Growth SMB, At-Risk Midmarket, New Startup).

7. **"Next Best Actions" Strategic Recommendations**
   - Prioritized decision matrix ranked by business impact, confidence, evidence, and step-by-step action plans.

8. **"Your Business in 60 Seconds" & Executive Reports**
   - 1-screen visual executive summary briefing.
   - Printable PDF-ready Executive Strategic Decision Report with CSV dataset export.

9. **Data Quality Explorer & Command Palette (`Ctrl + K`)**
   - Virtualized data table preview with instant column search and row filtering.
   - Keyboard shortcut command palette (`Ctrl + K`) for instant navigation.

---

## 🏗️ Architecture & Technology Stack

```
   ┌────────────────────────────────────────────────────────┐
   │                     REACT FRONTEND                     │
   │  Vite + TypeScript + Tailwind CSS + Framer Motion      │
   │  Recharts + Lucide Icons + Glassmorphism Theme System  │
   └───────────────────────────┬────────────────────────────┘
                               │ REST APIs / JSON
   ┌───────────────────────────▼────────────────────────────┐
   │                    FASTAPI BACKEND                     │
   │   Python + Pandas + NumPy + Scikit-Learn Analytics     │
   │   Statistical Profiler + Anomaly Detector Engine       │
   │   Elasticity Simulator + Time-Series Forecaster        │
   │   Gemini LLM Provider Abstraction Layer (Fallback)     │
   └────────────────────────────────────────────────────────┘
```

---

## ⚡ Quick Start Guide

### Prerequisites
- Python 3.10+
- Node.js 18+

### 1. Run Backend Engine
```bash
cd backend
pip install -r requirements.txt
python main.py
```
*FastAPI server starts at `http://localhost:8000` (OpenAPI documentation at `http://localhost:8000/docs`).*

### 2. Run Frontend UI
```bash
cd frontend
npm install
npm run dev
```
*Vite web application starts at `http://localhost:3000`.*

---

## 🧪 Running Automated Tests

Run the full backend analytics verification test suite:

```bash
python backend/tests/test_analytics.py
```

Run frontend build verification:

```bash
cd frontend
npm run build
```

---

## 🎬 3-Minute Hackathon Demonstration Flow

1. **Launch Platform**: Click **"Explore Demo"** on the landing page to load the pre-configured 24-Month Enterprise Retail Dataset.
2. **Command Center**: Review top KPI cards, hover over revenue sparklines, and click **"Why?"** on Revenue to view the root-cause causal chain.
3. **STRATOS Insights**: Navigate to Insights to inspect flagged 🔴 Risk cards (North Region decline) and 🟢 Opportunity cards.
4. **Ask Your Data**: Type *"Show revenue by region"* or click a preset pill to generate an interactive Text-to-Chart visualization.
5. **What-If Lab**: Adjust Marketing Spend to +50% and Price to -5% to watch the outcome chart morph dynamically with projected ROI calculations.
6. **Executive Report**: Click **"Generate Report"** to inspect the printable executive decision briefing or export CSV.

---

## 🔒 Security & Data Trust

- **No Invented Numbers**: Numerical claims originate strictly from Python analytical calculations (Pandas/NumPy). The LLM layer receives verified calculated metrics rather than raw authority to generate numbers.
- **Parametric Execution**: No raw SQL or unsanitized code execution.
- **Input Validation**: Robust file validation for CSV, XLSX, and JSON files.

---

## 📄 Deployment

STRATOS AI is packaged with a multi-stage `Dockerfile`, `docker-compose.yml`, and GCP `cloudrun.yaml`. See [DEPLOYMENT.md](DEPLOYMENT.md) for full Cloud Run setup instructions.
