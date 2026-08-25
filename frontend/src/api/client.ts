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
  const res = await fetch(`${API_BASE}/demo`);
  if (!res.ok) throw new Error('Failed to fetch demo info');
  return res.json();
}

export async function uploadDatasetFile(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Upload failed');
  }
  return res.json();
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
  const res = await fetch(`${API_BASE}/datasets/${datasetId}/why?metric=${metric}`);
  if (!res.ok) throw new Error('Failed to fetch causal breakdown');
  return res.json();
}

export async function fetchForecast(datasetId: string, days = 90): Promise<ForecastResponse> {
  const res = await fetch(`${API_BASE}/datasets/${datasetId}/forecast?days=${days}`);
  if (!res.ok) throw new Error('Failed to fetch forecast');
  return res.json();
}

export async function runWhatIfSim(
  datasetId: string,
  params: { marketing_change_pct: number; price_change_pct: number; conversion_change_pct: number }
): Promise<WhatIfResponse> {
  const res = await fetch(`${API_BASE}/datasets/${datasetId}/what-if`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error('What-if simulation failed');
  return res.json();
}

export async function askDataQuestion(datasetId: string, question: string): Promise<NLQueryResponse> {
  const res = await fetch(`${API_BASE}/datasets/${datasetId}/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question }),
  });
  if (!res.ok) throw new Error('Failed to process question');
  return res.json();
}

export async function fetchDatasetProfile(datasetId: string): Promise<DataProfile> {
  const res = await fetch(`${API_BASE}/datasets/${datasetId}/profile`);
  if (!res.ok) throw new Error('Failed to fetch profile');
  return res.json();
}

export async function fetchDatasetExplorer(datasetId: string, page = 1, search = '') {
  const url = `${API_BASE}/datasets/${datasetId}/explorer?page=${page}&limit=50` + (search ? `&search=${encodeURIComponent(search)}` : '');
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch explorer data');
  return res.json();
}

export async function fetchSegmentsAndProducts(datasetId: string): Promise<{ customer_segments: CustomerSegment[]; product_matrix: ProductMatrixItem[] }> {
  const res = await fetch(`${API_BASE}/datasets/${datasetId}/segments`);
  if (!res.ok) throw new Error('Failed to fetch segments');
  return res.json();
}

export async function fetchExecutiveReport(datasetId: string) {
  const res = await fetch(`${API_BASE}/datasets/${datasetId}/report`);
  if (!res.ok) throw new Error('Failed to fetch executive report');
  return res.json();
}
