import React from 'react';
import { motion } from 'framer-motion';
import { Target, Award, ShieldAlert, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

interface RecommendationsViewProps {
  onNavigateTab: (tab: string) => void;
  onSimulateRecommendation?: (params: { marketing: number; price: number; conversion: number }) => void;
}

export const RecommendationsView: React.FC<RecommendationsViewProps> = ({ onNavigateTab, onSimulateRecommendation }) => {
  const recommendations = [
    {
      rank: '01',
      title: 'Investigate & Restore North Region Pricing Allocation',
      impact: 'HIGH',
      confidence: 'HIGH',
      category: 'RISK MITIGATION',
      why: 'North region revenue dropped 14.8% (₹18.2L opportunity loss) over the last 90 days following a 15% marketing budget reallocation.',
      evidence: [
        'Revenue loss concentrated in Legacy Hardware V1 line',
        'Customer order volume down 14.8%',
        'Competitor price undercutting identified in APAC/North overlap'
      ],
      expectedImpact: '+₹14.5L Revenue Recovery within 60 days',
      action: 'Re-establish local account management team and offer bundle upgrade incentive to BUSINEX Cloud Suite.',
      simParams: { marketing: 15.0, price: 5.0, conversion: 10.0 }
    },
    {
      rank: '02',
      title: 'Scale Inventory & Marketing for BUSINEX Enterprise Suite',
      impact: 'HIGH',
      confidence: 'MEDIUM',
      category: 'GROWTH ACCELERATION',
      why: 'BUSINEX Enterprise Suite generates 52.4% of total profit with a +34.2% quarterly growth velocity.',
      evidence: [
        'Gross profit margin: 74%',
        'Surge in repeat enterprise orders (+18%)',
        'Current inventory buffer estimated below 14 days'
      ],
      expectedImpact: '+₹28.0L Projected Revenue Lift in Q4',
      action: 'Increase inventory allocation by 25% and launch targeted enterprise cross-sell ad campaigns.',
      simParams: { marketing: 35.0, price: 0.0, conversion: 15.0 }
    },
    {
      rank: '03',
      title: 'Deploy Retention Intervention for At-Risk Midmarket Accounts',
      impact: 'MEDIUM',
      confidence: 'HIGH',
      category: 'CHURN DEFENSE',
      why: 'Identified 13.5% revenue exposure concentrated in At-Risk Midmarket customer segment with elevated support ticket SLA latency.',
      evidence: [
        'Segment churn risk: 13.5%',
        'Average customer tenure: 14 months',
        'High correlation with hardware maintenance tickets'
      ],
      expectedImpact: 'Prevent ₹3.2M Annualized Recurring Revenue Churn',
      action: 'Automate customer success health checks and assign dedicated technical account managers.',
      simParams: { marketing: 10.0, price: -5.0, conversion: 20.0 }
    }
  ];

  const handleSimulateClick = (params: { marketing: number; price: number; conversion: number }) => {
    if (onSimulateRecommendation) {
      onSimulateRecommendation(params);
    } else {
      onNavigateTab('whatif');
    }
  };

  return (
    <div className="space-y-8 p-6">
      {/* Title */}
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <Target className="w-7 h-7 text-indigo-400" />
          <span>NEXT BEST STRATEGIC ACTIONS</span>
        </h2>
        <p className="text-sm text-slate-400">
          Prioritized strategic decision matrix ranked by potential business impact and statistical confidence.
        </p>
      </div>

      {/* Recommendations Cards */}
      <div className="space-y-6">
        {recommendations.map((rec, idx) => (
          <motion.div
            key={rec.rank}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.12 }}
            className="p-6 rounded-2xl glass-panel border border-indigo-500/20 hover:glass-panel-glow transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-extrabold font-mono text-gradient">
                  {rec.rank}
                </span>
                <div>
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                    {rec.category}
                  </span>
                  <h3 className="text-xl font-bold text-white">{rec.title}</h3>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-1 rounded bg-slate-800 text-[11px] font-bold text-emerald-400 border border-emerald-500/30">
                  Impact: {rec.impact}
                </span>
                <span className="px-2.5 py-1 rounded bg-slate-800 text-[11px] font-bold text-indigo-300 border border-indigo-500/30">
                  Confidence: {rec.confidence}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
              <div className="md:col-span-2 space-y-2">
                <div className="text-xs text-slate-300 font-medium">{rec.why}</div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Empirical Evidence</div>
                  {rec.evidence.map((ev, i) => (
                    <div key={i} className="text-slate-300 flex items-center gap-1.5">
                      <span className="text-indigo-400">•</span> {ev}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-bold text-indigo-300 uppercase mb-1">Expected ROI / Impact</div>
                  <div className="text-sm font-extrabold text-white mb-2">{rec.expectedImpact}</div>
                </div>
                <button
                  onClick={() => handleSimulateClick(rec.simParams)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 active:scale-95"
                >
                  <span>Simulate in What-If Lab</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
