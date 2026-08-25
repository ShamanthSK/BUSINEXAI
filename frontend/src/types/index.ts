export interface KPIMetric {
  value: number;
  formatted: string;
  growth?: number;
  margin?: number;
  sparkline?: number[];
}

export interface KPIData {
  revenue: KPIMetric;
  profit: KPIMetric;
  customers: KPIMetric;
  aov: KPIMetric;
  churn: KPIMetric;
  orders_count: number;
}

export interface TrendData {
  revenue_over_time: { date: string; revenue: number }[];
  by_product: { product: string; revenue: number; share: number }[];
  by_region: { region: string; revenue: number; share: number }[];
  by_category: { category: string; revenue: number }[];
  rising_products: { product: string; recent: number; prev: number; growth: number }[];
  declining_products: { product: string; recent: number; prev: number; growth: number }[];
}

export interface Insight {
  id: string;
  category: 'OPPORTUNITY' | 'RISK' | 'OBSERVATION' | 'TREND';
  category_label: string;
  title: string;
  summary: string;
  impact: string;
  impact_value: string;
  evidence: string[];
  recommendation: string;
  why_target?: string;
}

export interface CausalNode {
  step: number;
  level: string;
  title: string;
  description: string;
  impact_share: string;
  type: string;
}

export interface CausalChainResponse {
  metric_name: string;
  causal_chain: CausalNode[];
  summary: string;
  actionable_takeaway: string;
}

export interface ForecastPoint {
  date: string;
  actual?: number | null;
  forecast?: number | null;
  lower_bound?: number | null;
  upper_bound?: number | null;
  type: 'actual' | 'forecast';
}

export interface ForecastResponse {
  horizon_days: number;
  historical: ForecastPoint[];
  forecast: ForecastPoint[];
  combined_series: ForecastPoint[];
  metrics: {
    projected_revenue: number;
    projected_revenue_formatted: string;
    projected_growth_rate: number;
    confidence_level: string;
    model_type: string;
  };
}

export interface WhatIfResponse {
  inputs: {
    marketing_change_pct: number;
    price_change_pct: number;
    conversion_change_pct: number;
  };
  baseline: {
    revenue: number;
    revenue_formatted: string;
    profit: number;
    profit_formatted: string;
    customers: number;
  };
  projected: {
    revenue: number;
    revenue_formatted: string;
    revenue_change_pct: number;
    profit: number;
    profit_formatted: string;
    profit_change_pct: number;
    profit_margin: number;
    customers: number;
    customers_change_pct: number;
    expected_roi: number;
  };
  chart_data: { month: string; baseline_revenue: number; projected_revenue: number }[];
  summary: string;
}

export interface NLQueryResponse {
  question: string;
  answer: string;
  chart: {
    type: 'bar' | 'line' | 'pie' | 'area';
    title: string;
    x_key: string;
    y_key: string;
    data: any[];
  };
  metrics_highlight: { label: string; value: string }[];
}

export interface CustomerSegment {
  name: string;
  customer_count: number;
  revenue_contribution: number;
  revenue_share: number;
  aov: number;
  risk_level: string;
  recommendation: string;
}

export interface ProductMatrixItem {
  product_name: string;
  revenue: number;
  revenue_share: number;
  units_sold: number;
  classification: string;
  badge: string;
  action_recommendation: string;
}

export interface DataProfile {
  total_rows: number;
  total_cols: number;
  health_score: number;
  missing_cells: number;
  duplicate_rows: number;
  numeric_columns: string[];
  categorical_columns: string[];
  date_columns: string[];
  summary_text: string;
}
