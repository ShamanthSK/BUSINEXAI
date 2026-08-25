import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Package, MapPin, Award, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react';
import type { CustomerSegment, ProductMatrixItem } from '../../types';
import { fetchSegmentsAndProducts } from '../../api/client';

interface IntelligenceViewsProps {
  activeDatasetId: string;
}

export const IntelligenceViews: React.FC<IntelligenceViewsProps> = ({ activeDatasetId }) => {
  const [activeTab, setActiveTab] = useState<'products' | 'customers'>('products');
  const [data, setData] = useState<{ customer_segments: CustomerSegment[]; product_matrix: ProductMatrixItem[] } | null>(null);

  useEffect(() => {
    fetchSegmentsAndProducts(activeDatasetId).then(setData).catch(console.error);
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
              activeTab === 'products' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Product Matrix
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'customers' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Customer Segments
          </button>
        </div>
      </div>

      {activeTab === 'products' && data?.product_matrix && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.product_matrix.map((item, idx) => (
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
                <div>Revenue: <strong className="text-white">₹{item.revenue.toLocaleString()}</strong></div>
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

      {activeTab === 'customers' && data?.customer_segments && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.customer_segments.map((seg, idx) => (
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
                  <div className="text-sm font-bold text-indigo-300">₹{seg.aov.toLocaleString()}</div>
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
