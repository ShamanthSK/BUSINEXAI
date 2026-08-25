import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, AlertCircle, TrendingUp, Sparkles, HelpCircle, X, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';
import type { Insight, CausalChainResponse } from '../../types';
import { fetchCausalChain } from '../../api/client';

interface InsightsCenterProps {
  insights: Insight[];
  activeDatasetId: string;
}

export const InsightsCenter: React.FC<InsightsCenterProps> = ({ insights, activeDatasetId }) => {
  const [filter, setFilter] = useState<string>('ALL');
  const [selectedWhy, setSelectedWhy] = useState<CausalChainResponse | null>(null);
  const [loadingWhy, setLoadingWhy] = useState(false);

  const categories = [
    { key: 'ALL', label: 'All Insights' },
    { key: 'OPPORTUNITY', label: '🟢 Opportunity' },
    { key: 'RISK', label: '🔴 Risk' },
    { key: 'OBSERVATION', label: '🟡 Observation' },
    { key: 'TREND', label: '🔵 Trend' },
  ];

  const filtered = filter === 'ALL' ? insights : insights.filter(i => i.category === filter);

  const handleOpenWhy = async (metricName = 'Revenue') => {
    setLoadingWhy(true);
    try {
      const data = await fetchCausalChain(activeDatasetId, metricName);
      setSelectedWhy(data);
    } catch (err) {
      console.error('Failed to load causal chain', err);
    } finally {
      setLoadingWhy(false);
    }
  };

  return (
    <div className="space-y-8 p-6">
      {/* Title & Filter bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Brain className="w-7 h-7 text-indigo-400" />
            <span>STRATOS AI Strategic Insights</span>
          </h2>
          <p className="text-sm text-slate-400">
            Categorized telemetry diagnostics backed strictly by ground-truth evidence.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 glass-panel p-1 rounded-xl">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setFilter(cat.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === cat.key
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence>
          {filtered.map((item, idx) => {
            const isRisk = item.category === 'RISK';
            const isOpp = item.category === 'OPPORTUNITY';
            const isTrend = item.category === 'TREND';

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className={`p-6 rounded-2xl glass-panel relative border transition-all hover:glass-panel-glow ${
                  isRisk ? 'border-rose-500/30' : (isOpp ? 'border-emerald-500/30' : 'border-indigo-500/20')
                }`}
              >
                {/* Header Category & Impact */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase ${
                    isRisk ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                    isOpp ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    isTrend ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                    'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {item.category_label}
                  </span>

                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-400">Impact:</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-slate-800 text-indigo-300 border border-indigo-500/30">
                      {item.impact} ({item.impact_value})
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">{item.summary}</p>

                {/* Evidence Section */}
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 mb-4 space-y-1.5">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Supporting Data Evidence
                  </div>
                  {item.evidence.map((ev, i) => (
                    <div key={i} className="flex items-start space-x-2 text-xs text-slate-300">
                      <span className="text-indigo-400 font-bold">•</span>
                      <span>{ev}</span>
                    </div>
                  ))}
                </div>

                {/* Recommendation Box */}
                <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-start space-x-3 mb-4">
                  <Sparkles className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                  <div className="text-xs text-indigo-200 leading-normal">
                    <strong className="font-semibold text-white">Recommended Action: </strong>
                    {item.recommendation}
                  </div>
                </div>

                {/* "Why is this happening?" Action button */}
                <div className="flex justify-end">
                  <button
                    onClick={() => handleOpenWhy(item.title)}
                    className="px-3.5 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 text-xs font-semibold transition-all flex items-center gap-1.5 border border-indigo-500/40"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Why is this happening?</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* "Why is this happening?" Causal Breakdown Modal */}
      <AnimatePresence>
        {selectedWhy && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl glass-panel-glow p-6 rounded-3xl border-indigo-500/40 relative shadow-2xl"
            >
              <div className="flex items-center justify-between pb-4 border-b border-indigo-500/20 mb-6">
                <div>
                  <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                    <Brain className="w-5 h-5 text-indigo-400" />
                    <span>Causal Chain Analysis</span>
                  </h3>
                  <p className="text-xs text-slate-400">Root-cause decomposition for "{selectedWhy.metric_name}"</p>
                </div>
                <button
                  onClick={() => setSelectedWhy(null)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Animated Causal Chain Steps */}
              <div className="space-y-4 mb-6">
                {selectedWhy.causal_chain.map((node, i) => (
                  <motion.div
                    key={node.step}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.15 }}
                    className="p-4 rounded-xl bg-slate-900/80 border border-indigo-500/20 flex items-start justify-between gap-4"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-7 h-7 rounded-lg bg-indigo-600/30 text-indigo-300 font-bold text-xs flex items-center justify-center shrink-0 border border-indigo-400/30">
                        {node.step}
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-0.5">
                          {node.level}
                        </div>
                        <h4 className="text-sm font-bold text-white mb-1">{node.title}</h4>
                        <p className="text-xs text-slate-300 leading-normal">{node.description}</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded bg-slate-800 text-[10px] font-bold text-indigo-300 border border-slate-700 whitespace-nowrap">
                      {node.impact_share}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Actionable Takeaway */}
              <div className="p-4 rounded-xl bg-indigo-950/60 border border-indigo-500/40 text-xs text-indigo-200">
                <strong className="text-white font-bold block mb-1">Executive Takeaway:</strong>
                {selectedWhy.actionable_takeaway}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
