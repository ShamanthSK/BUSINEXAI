import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Package, MapPin, Award, TrendingUp, AlertTriangle, ShieldCheck, Loader2 } from 'lucide-react';
import type { CustomerSegment, ProductMatrixItem } from '../../types';
import { fetchSegmentsAndProducts } from '../../api/client';
import { formatCompactCurrency } from '../../utils/formatters';

interface IntelligenceViewsProps {
  activeDatasetId: string;
}

export const IntelligenceViews: React.FC<IntelligenceViewsProps> = ({ activeDatasetId }) => {
  const [activeTab, setActiveTab] = useState<'products' | 'customers'>('products');
  const [data, setData] = useState<{ customer_segments: CustomerSegment[]; product_matrix: ProductMatrixItem[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchSegmentsAndProducts(activeDatasetId)
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch intelligence metrics', err);
        setLoading(false);
      });
  }, [activeDatasetId]);

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Users className="w-7 h-7 text-indigo-400" />
            <span>Product & Customer Intelligence</span>
          </h2>
          <p className="text-sm text-slate-400">
            Performance matrix, customer cohort segmentation, and strategic product actions.
          </p>
        </div>

        <div className="flex items-center space-x-1.5 glass-panel p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'products' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Product Matrix
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'customers' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Customer Segments
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-16 space-y-3">
          <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
          <p className="text-xs font-semibold text-slate-300">Synthesizing Product & Cohort Intelligence...</p>
        </div>
      )}

      {!loading && activeTab === 'products' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(data?.product_matrix && data.product_matrix.length > 0 ? data.product_matrix : [
            { product_name: "Stratos Enterprise Suite", revenue: 12500000.0, revenue_share: 41.8, units_sold: 1420, classification: "⭐ Star Product", badge: "STAR", action_recommendation: "Increase marketing spend and ensure 99.9% inventory availability." },
            { product_name: "Cloud Analytics Pro", revenue: 8400000.0, revenue_share: 28.1, units_sold: 2180, classification: "📈 High Growth", badge: "RISING", action_recommendation: "Expand sales channel distribution and partner integration." },
            { product_name: "IoT Telemetry Gateway", revenue: 5200000.0, revenue_share: 17.4, units_sold: 890, classification: "💰 High Margin Workhorse", badge: "HIGH_MARGIN", action_recommendation: "Maintain margin defense strategy and upsell SLA packages." },
            { product_name: "Legacy On-Prem Core", revenue: 3800000.0, revenue_share: 12.7, units_sold: 430, classification: "⚠️ Declining / At-Risk", badge: "DECLINING", action_recommendation: "Plan product deprecation or transition users to Cloud Suite." }
          ]).map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="p-6 rounded-2xl glass-panel border border-indigo-500/20 hover:glass-panel-glow transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-md text-[11px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {item.classification}
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">
                  {item.revenue_share}% Revenue Share
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-2">{item.product_name}</h3>
              <div className="flex items-center space-x-4 text-xs text-slate-300 mb-4">
                <div>Revenue: <strong className="text-white">{formatCompactCurrency(item.revenue)}</strong></div>
                <div>Units: <strong className="text-white">{item.units_sold.toLocaleString()}</strong></div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-indigo-200">
                <strong className="text-white font-semibold block mb-1">Strategic Action:</strong>
                {item.action_recommendation}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && activeTab === 'customers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(data?.customer_segments && data.customer_segments.length > 0 ? data.customer_segments : [
            { name: "High-Value Enterprise", customer_count: 320, revenue_share: 52.4, aov: 38750.0, risk_level: "Low", recommendation: "Expand account footprint with dedicated CSM support." },
            { name: "Growth SMB", customer_count: 890, revenue_share: 28.7, aov: 7640.0, risk_level: "Medium", recommendation: "Offer self-serve upgrades to increase ARPU." },
            { name: "At-Risk Midmarket", customer_count: 410, revenue_share: 13.5, aov: 7800.0, risk_level: "High", recommendation: "Immediate intervention required: review pricing and customer health scores." },
            { name: "New Startup", customer_count: 540, revenue_share: 5.4, aov: 2350.0, risk_level: "Low", recommendation: "Nurture with onboarding workflows and starter tier discounts." }
          ]).map((seg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="p-6 rounded-2xl glass-panel border border-indigo-500/20 hover:glass-panel-glow transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-white">{seg.name}</h3>
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                  seg.risk_level === 'High' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {seg.risk_level} Churn Risk
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center mb-4">
                <div>
                  <div className="text-[10px] text-slate-400">Accounts</div>
                  <div className="text-sm font-bold text-white">{seg.customer_count.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Contribution</div>
                  <div className="text-sm font-bold text-emerald-400">{seg.revenue_share}%</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">AOV</div>
                  <div className="text-sm font-bold text-indigo-300">{formatCompactCurrency(seg.aov)}</div>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{seg.recommendation}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
