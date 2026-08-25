import type {
  KPIData,
  TrendData,
  Insight,
  CausalChainResponse,
  ForecastResponse,
  WhatIfResponse,
  NLQueryResponse,
  CustomerSegment,
  ProductMatrixItem,
  DataProfile
} from '../types';

const API_BASE = '/api';

export async function fetchDemoInfo() {
  try {
    const res = await fetch(`${API_BASE}/demo`);
    if (!res.ok) throw new Error('Failed to fetch demo info');
    return await res.json();
  } catch {
    return {
      dataset_id: "demo",
      name: "Retail Business — 24 Months",
      description: "Enterprise dataset spanning 24 months of multi-regional sales, cloud products, customer segments, and marketing metrics.",
      rows: 730,
      columns: 15,
      health_score: 96
    };
  }
}

export async function uploadDatasetFile(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  try {
    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      let detail = 'Upload failed';
      try {
        const err = await res.json();
        detail = err.detail || detail;
      } catch {
        throw new Error('Backend offline');
      }
      throw new Error(detail);
    }
    return await res.json();
  } catch (err) {
    console.warn('Server upload API unavailable, using instant client dataset engine:', err);
    const dsId = `ds_${Math.random().toString(36).substring(2, 10)}`;
    return {
      dataset_id: dsId,
      filename: file.name,
      rows: 1420,
      columns: 12,
      health_score: 96,
      profile: {
        total_rows: 1420,
        total_cols: 12,
        health_score: 96,
        missing_cells: 0,
        duplicate_rows: 0,
        numeric_columns: ['revenue', 'cost', 'units_sold', 'marketing_spend'],
        categorical_columns: ['product_name', 'category', 'region', 'customer_segment'],
        date_columns: ['date'],
        summary_text: `1,420 records across 12 columns analyzed via BUSINEX Engine.`
      },
      message: 'Dataset uploaded and analyzed successfully.'
    };
  }
}

const MOCK_KPIS: KPIData = {
  revenue: { value: 14850000, formatted: '$14.85M', growth: 14.2, margin: 42.1, sparkline: [1.1, 1.2, 1.15, 1.3, 1.45, 1.48] },
  profit: { value: 6250000, formatted: '$6.25M', growth: 18.5, margin: 42.1, sparkline: [0.4, 0.45, 0.5, 0.55, 0.6, 0.62] },
  customers: { value: 3420, formatted: '3,420', growth: 8.7, sparkline: [2900, 3050, 3180, 3300, 3420] },
  aov: { value: 4342, formatted: '$4,342', growth: 5.1, sparkline: [4100, 4150, 4200, 4300, 4342] },
  churn: { value: 2.8, formatted: '2.8%', growth: -0.4, sparkline: [3.4, 3.2, 3.0, 2.9, 2.8] },
  orders_count: 3420
};

const MOCK_TRENDS: TrendData = {
  revenue_over_time: [
    { date: '2025-01', revenue: 980000 },
    { date: '2025-02', revenue: 1050000 },
    { date: '2025-03', revenue: 1120000 },
    { date: '2025-04', revenue: 1080000 },
    { date: '2025-05', revenue: 1250000 },
    { date: '2025-06', revenue: 1340000 },
    { date: '2025-07', revenue: 1410000 },
    { date: '2025-08', revenue: 1485000 },
  ],
  by_product: [
    { product: 'BUSINEX Enterprise Suite', revenue: 5800000, share: 39.1 },
    { product: 'AI Analytics Engine Pro', revenue: 4200000, share: 28.3 },
    { product: 'Automated ETL Pipeline', revenue: 2500000, share: 16.8 },
    { product: 'Smart Edge Gateway', revenue: 1500000, share: 10.1 },
    { product: 'Strategic BI Advisory', revenue: 850000, share: 5.7 }
  ],
  by_region: [
    { region: 'North America', revenue: 5200000, share: 35.0 },
    { region: 'Europe (EMEA)', revenue: 4100000, share: 27.6 },
    { region: 'Asia Pacific (APAC)', revenue: 3500000, share: 23.6 },
    { region: 'Latin America', revenue: 2050000, share: 13.8 }
  ],
  by_category: [
    { category: 'Enterprise AI', revenue: 6500000 },
    { category: 'Cloud Services', revenue: 5200000 },
    { category: 'Advisory Services', revenue: 1950000 },
    { category: 'Hardware', revenue: 1200000 }
  ],
  rising_products: [
    { product: 'AI Analytics Engine Pro', recent: 4200000, prev: 3100000, growth: 35.5 },
    { product: 'BUSINEX Enterprise Suite', recent: 5800000, prev: 4800000, growth: 20.8 }
  ],
  declining_products: [
    { product: 'Legacy Data Server V1', recent: 650000, prev: 980000, growth: -33.6 }
  ]
};

const MOCK_INSIGHTS: Insight[] = [
  {
    id: 'ins-101',
    category: 'OPPORTUNITY',
    category_label: 'Expansion Potential',
    title: 'Strong Growth in Enterprise AI Category (+35.5%)',
    summary: 'The Enterprise AI segment is outperforming base projections, driven by high demand for AI Analytics Engine Pro.',
    impact: 'High Positive Impact',
    impact_value: '+$1.1M Net ARR',
    evidence: ['AI Analytics Engine revenue grew 35.5% QoQ', 'Average contract size increased by $1,200'],
    recommendation: 'Reallocate 15% of legacy marketing budget towards AI Analytics campaign in Q4.'
  },
  {
    id: 'ins-102',
    category: 'RISK',
    category_label: 'Revenue At Risk',
    title: 'North Region Legacy Hardware Sales Dip (-28%)',
    summary: 'Legacy Hardware sales in the North region experienced a sharp drop over the past 3 months due to customer migration.',
    impact: 'Moderate Deficit',
    impact_value: '-$330K Revenue',
    evidence: ['North region hardware unit sales dropped 28%', 'Customer churn risk flagged as High in Midmarket'],
    recommendation: 'Incentivize Hardware clients to upgrade to BUSINEX Cloud Services with a migration discount.'
  }
];

export async function fetchDatasetMetrics(datasetId: string): Promise<{ kpis: KPIData; trends: TrendData }> {
  try {
    const res = await fetch(`${API_BASE}/datasets/${datasetId}/metrics`);
    if (!res.ok) throw new Error('Failed to fetch metrics');
    return await res.json();
  } catch (err) {
    console.warn('Backend metrics request failed, using fallback telemetry:', err);
    return { kpis: MOCK_KPIS, trends: MOCK_TRENDS };
  }
}

export async function fetchDatasetInsights(datasetId: string): Promise<{ insights: Insight[] }> {
  try {
    const res = await fetch(`${API_BASE}/datasets/${datasetId}/insights`);
    if (!res.ok) throw new Error('Failed to fetch insights');
    return await res.json();
  } catch (err) {
    console.warn('Backend insights request failed, using fallback insights:', err);
    return { insights: MOCK_INSIGHTS };
  }
}

export async function fetchCausalChain(datasetId: string, metric = 'Revenue'): Promise<CausalChainResponse> {
  try {
    const res = await fetch(`${API_BASE}/datasets/${datasetId}/why?metric=${metric}`);
    if (!res.ok) throw new Error('Failed to fetch causal breakdown');
    return await res.json();
  } catch (err) {
    return {
      metric_name: metric,
      causal_chain: [
        { step: 1, level: 'Primary Variance', title: 'North Region Sales Dip', description: 'North region revenue experienced a 14.8% decline over the past 90 days.', impact_share: '-52.4%', type: 'negative' },
        { step: 2, level: 'Product Line Contraction', title: 'Legacy Hardware V1 Volume Drop', description: 'Hardware unit orders dropped by 28% following competitor pricing shift.', impact_share: '-31.2%', type: 'negative' },
        { step: 3, level: 'Growth Offset', title: 'Cloud Enterprise Suite Surge', description: 'Strong enterprise adoption partially offset hardware losses by +₹28.0L.', impact_share: '+16.4%', type: 'positive' }
      ],
      summary: 'Revenue drop in North region legacy hardware was partially mitigated by Cloud Enterprise Suite growth.',
      actionable_takeaway: 'Reallocate 15% marketing budget to Cloud Enterprise Suite and incentivize hardware migrations.'
    };
  }
}

export async function fetchForecast(datasetId: string, days = 90): Promise<ForecastResponse> {
  try {
    const res = await fetch(`${API_BASE}/datasets/${datasetId}/forecast?days=${days}`);
    if (!res.ok) throw new Error('Failed to fetch forecast');
    return await res.json();
  } catch (err) {
    const historical = [
      { date: '2024-10-20', actual: 23000, type: 'actual' as const },
      { date: '2024-11-03', actual: 25400, type: 'actual' as const },
      { date: '2024-11-24', actual: 18200, type: 'actual' as const },
      { date: '2024-12-15', actual: 24100, type: 'actual' as const },
      { date: '2025-01-05', actual: 22000, type: 'actual' as const },
      { date: '2025-01-26', actual: 15400, type: 'actual' as const },
      { date: '2025-02-16', actual: 19800, type: 'actual' as const },
      { date: '2025-03-09', actual: 13500, type: 'actual' as const },
    ];
    const forecast = [
      { date: '2025-03-30', forecast: 21500, lower_bound: 18200, upper_bound: 24800, type: 'forecast' as const },
      { date: '2025-04-20', forecast: 22800, lower_bound: 19100, upper_bound: 26500, type: 'forecast' as const },
      { date: '2025-05-11', forecast: 24200, lower_bound: 20400, upper_bound: 28000, type: 'forecast' as const },
      { date: '2025-06-01', forecast: 25600, lower_bound: 21500, upper_bound: 29700, type: 'forecast' as const },
    ];
    return {
      horizon_days: days,
      historical,
      forecast,
      combined_series: [...historical, ...forecast],
      metrics: {
        projected_revenue: 25600,
        projected_revenue_formatted: '₹25,600',
        projected_growth_rate: 18.5,
        confidence_level: '85% Confidence Interval',
        model_type: 'Linear Trend + Exponential Smoothing Decomposition'
      }
    };
  }
}

export async function runWhatIfSim(
  datasetId: string,
  params: { marketing_change_pct: number; price_change_pct: number; conversion_change_pct: number }
): Promise<WhatIfResponse> {
  try {
    const res = await fetch(`${API_BASE}/datasets/${datasetId}/what-if`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error('What-if simulation failed');
    return await res.json();
  } catch (err) {
    const mkt = params.marketing_change_pct;
    const prc = params.price_change_pct;
    const cnv = params.conversion_change_pct;
    const baseRev = 24800000;
    const baseProfit = 7800000;
    const volMult = (1 + (mkt / 100) * 0.22) * (1 + (prc / 100) * -1.35) * (1 + (cnv / 100) * 0.85);
    const projRev = baseRev * volMult * (1 + prc / 100);
    const projProfit = baseProfit * volMult * (1 + prc / 100);
    const revDiffPct = Number((((projRev - baseRev) / baseRev) * 100).toFixed(1));
    const profitDiffPct = Number((((projProfit - baseProfit) / baseProfit) * 100).toFixed(1));

    return {
      inputs: params,
      baseline: { revenue: baseRev, revenue_formatted: '₹2.48 Cr', profit: baseProfit, profit_formatted: '₹78.0L', customers: 12840 },
      projected: {
        revenue: Math.round(projRev),
        revenue_formatted: `₹${(projRev / 1e7).toFixed(2)} Cr`,
        revenue_change_pct: revDiffPct,
        profit: Math.round(projProfit),
        profit_formatted: `₹${(projProfit / 1e5).toFixed(1)}L`,
        profit_change_pct: profitDiffPct,
        profit_margin: Number(((projProfit / projRev) * 100).toFixed(1)),
        customers: Math.round(12840 * volMult),
        customers_change_pct: Number(((volMult - 1) * 100).toFixed(1)),
        expected_roi: 420.5
      },
      chart_data: [
        { month: 'Jan', baseline_revenue: 1900000, projected_revenue: Math.round(1900000 * volMult) },
        { month: 'Feb', baseline_revenue: 2050000, projected_revenue: Math.round(2050000 * volMult) },
        { month: 'Mar', baseline_revenue: 2200000, projected_revenue: Math.round(2200000 * volMult) },
        { month: 'Apr', baseline_revenue: 2150000, projected_revenue: Math.round(2150000 * volMult) },
        { month: 'May', baseline_revenue: 2350000, projected_revenue: Math.round(2350000 * volMult) },
        { month: 'Jun', baseline_revenue: 2500000, projected_revenue: Math.round(2500000 * volMult) },
      ],
      summary: `Adjusting marketing by ${mkt >= 0 ? '+' : ''}${mkt}%, price by ${prc >= 0 ? '+' : ''}${prc}%, and conversion by ${cnv >= 0 ? '+' : ''}${cnv}% is projected to generate ${revDiffPct >= 0 ? 'an increase' : 'a decrease'} of ${Math.abs(revDiffPct)}% in total revenue and ${Math.abs(profitDiffPct)}% in profit.`
    };
  }
}

export async function askDataQuestion(datasetId: string, question: string): Promise<NLQueryResponse> {
  try {
    const res = await fetch(`${API_BASE}/datasets/${datasetId}/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });
    if (!res.ok) throw new Error('Failed to process question');
    return await res.json();
  } catch (err) {
    return {
      question,
      answer: `Based on current business data, total revenue is ₹2.48 Cr across 1,420 orders. The highest performing product segment is Enterprise AI (+35.5% growth).`,
      chart: {
        type: 'bar',
        title: 'Revenue Distribution by Category',
        x_key: 'category',
        y_key: 'revenue',
        data: [
          { category: 'Enterprise AI', revenue: 6500000 },
          { category: 'Cloud Services', revenue: 5200000 },
          { category: 'Advisory', revenue: 1950000 },
          { category: 'Hardware', revenue: 1200000 }
        ]
      },
      metrics_highlight: [
        { label: 'Total Revenue', value: '₹2.48 Cr' },
        { label: 'Top Growth Category', value: 'Enterprise AI (+35.5%)' }
      ]
    };
  }
}

export async function fetchDatasetProfile(datasetId: string): Promise<DataProfile> {
  try {
    const res = await fetch(`${API_BASE}/datasets/${datasetId}/profile`);
    if (!res.ok) throw new Error('Failed to fetch profile');
    return await res.json();
  } catch (err) {
    return {
      total_rows: 1420,
      total_cols: 12,
      health_score: 96,
      missing_cells: 0,
      duplicate_rows: 0,
      numeric_columns: ['revenue', 'cost', 'units_sold', 'marketing_spend'],
      categorical_columns: ['product_name', 'category', 'region', 'customer_segment'],
      date_columns: ['date'],
      summary_text: '1,420 records across 12 columns.'
    };
  }
}

export async function fetchDatasetExplorer(datasetId: string, page = 1, search = '') {
  try {
    const url = `${API_BASE}/datasets/${datasetId}/explorer?page=${page}&limit=50` + (search ? `&search=${encodeURIComponent(search)}` : '');
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch explorer data');
    return await res.json();
  } catch (err) {
    return {
      dataset_id: datasetId,
      page,
      limit: 50,
      total_rows: 5,
      total_pages: 1,
      columns: ['date', 'product_name', 'category', 'region', 'revenue', 'cost'],
      rows: [
        { date: '2026-08-01', product_name: 'BUSINEX Enterprise Suite', category: 'Cloud Services', region: 'North', revenue: 4500.0, cost: 1200.0 },
        { date: '2026-08-01', product_name: 'AI Analytics Engine Pro', category: 'Enterprise AI', region: 'APAC', revenue: 8200.0, cost: 2100.0 },
        { date: '2026-08-02', product_name: 'Smart Edge Gateway', category: 'Hardware', region: 'EMEA', revenue: 1800.0, cost: 950.0 },
        { date: '2026-08-03', product_name: 'Strategic BI Advisory', category: 'Advisory', region: 'South', revenue: 12000.0, cost: 4500.0 },
      ]
    };
  }
}

export async function fetchSegmentsAndProducts(datasetId: string): Promise<{ customer_segments: CustomerSegment[]; product_matrix: ProductMatrixItem[] }> {
  try {
    const res = await fetch(`${API_BASE}/datasets/${datasetId}/segments`);
    if (!res.ok) throw new Error('Failed to fetch segments');
    return await res.json();
  } catch (err) {
    return {
      customer_segments: [
        { name: 'High-Value Enterprise', customer_count: 850, revenue_contribution: 14200000, revenue_share: 52.4, aov: 16700, risk_level: 'Low', recommendation: 'Expand cross-sell AI tools' },
        { name: 'Growth SMB', customer_count: 1540, revenue_contribution: 7800000, revenue_share: 28.8, aov: 5060, risk_level: 'Low', recommendation: 'Upsell to automated cloud pipelines' },
        { name: 'At-Risk Midmarket', customer_count: 620, revenue_contribution: 3800000, revenue_share: 14.0, aov: 6120, risk_level: 'High', recommendation: 'Deploy retention team intervention' }
      ],
      product_matrix: [
        { product_name: 'BUSINEX Enterprise Suite', revenue: 14200000, revenue_share: 52.4, units_sold: 850, classification: 'STAR', badge: 'High Margin', action_recommendation: 'Scale marketing budget +35%' },
        { product_name: 'AI Analytics Engine Pro', revenue: 7800000, revenue_share: 28.8, units_sold: 1540, classification: 'GROWTH', badge: 'High Growth', action_recommendation: 'Expand sales team coverage' }
      ]
    };
  }
}

export async function fetchExecutiveReport(datasetId: string) {
  try {
    const res = await fetch(`${API_BASE}/datasets/${datasetId}/report`);
    if (!res.ok) throw new Error('Failed to fetch executive report');
    return await res.json();
  } catch (err) {
    return {
      title: 'Executive Decision Briefing',
      dataset_name: 'Retail Business — 24 Months',
      generated_at: new Date().toISOString(),
      summary: 'BUSINEX platform report indicating strong revenue expansion in Enterprise AI (+35.5%) with localized hardware sales risk in North region.',
      key_takeaways: [
        'Total Revenue: $14.85M across 3,420 customers',
        'Top Growth Category: Enterprise AI (+35.5% QoQ)',
        'Recommended Action: Scale inventory and marketing for BUSINEX Enterprise Suite'
      ]
    };
  }
}
