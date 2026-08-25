import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle2, AlertTriangle, Sparkles, Target, ArrowRight } from 'lucide-react';
import type { KPIData, Insight } from '../../types';
import { fetchExecutiveReport } from '../../api/client';

interface ExecutiveSummaryProps {
  kpis: KPIData;
  insights: Insight[];
  activeDatasetId: string;
  onNavigateTab: (tab: string) => void;
}

export const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({
  kpis,
  insights,
  activeDatasetId,
  onNavigateTab,
}) => {
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    fetchExecutiveReport(activeDatasetId).then(setReport).catch(console.error);
  }, [activeDatasetId]);

  return (
    <div className="space-y-8 p-6 max-w-5xl mx-auto">
      {/* Title */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full glass-panel border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
          <Clock className="w-3.5 h-3.5" />
          <span>SYNTHESIZED BRIEFING</span>
        </div>
        <h2 className="text-4xl font-extrabold text-white tracking-tight">
          Your Business in 60 Seconds
        </h2>
        <p className="text-sm text-slate-400 mt-2">
          Executive summary derived strictly from 24-month empirical telemetry.
        </p>
      </div>

      {report && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Top Briefing Text Box */}
          <div className="p-6 rounded-2xl glass-panel-glow border-indigo-500/40 text-center">
            <p className="text-base text-slate-200 font-light leading-relaxed">
              "{report.executive_summary.briefing_text}"
            </p>
          </div>

          {/* 4 Quadrants Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* What is going well? */}
            <div className="p-6 rounded-2xl glass-panel border-emerald-500/30">
              <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5" />
                <span>What is going well?</span>
              </h3>
              <ul className="space-y-2 text-xs text-slate-300">
                {report.executive_summary.what_is_going_well.map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What needs attention? */}
            <div className="p-6 rounded-2xl glass-panel border-rose-500/30">
              <h3 className="text-base font-bold text-rose-400 flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5" />
                <span>What needs attention?</span>
              </h3>
              <ul className="space-y-2 text-xs text-slate-300">
                {report.executive_summary.what_needs_attention.map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Biggest Opportunity */}
            <div className="p-6 rounded-2xl glass-panel border-indigo-500/30">
              <h3 className="text-base font-bold text-indigo-300 flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <span>Biggest Opportunity</span>
              </h3>
              <div className="text-lg font-bold text-white mb-1">
                {report.executive_summary.biggest_opportunity.title}
              </div>
              <div className="text-xs text-emerald-400 font-semibold mb-3">
                Value: {report.executive_summary.biggest_opportunity.impact}
              </div>
              <p className="text-xs text-slate-300">
                {report.executive_summary.biggest_opportunity.action}
              </p>
            </div>

            {/* Biggest Risk */}
            <div className="p-6 rounded-2xl glass-panel border-amber-500/30">
              <h3 className="text-base font-bold text-amber-400 flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5" />
                <span>Biggest Risk</span>
              </h3>
              <div className="text-lg font-bold text-white mb-1">
                {report.executive_summary.biggest_risk.title}
              </div>
              <div className="text-xs text-rose-400 font-semibold mb-3">
                Exposure: {report.executive_summary.biggest_risk.impact}
              </div>
              <p className="text-xs text-slate-300">
                {report.executive_summary.biggest_risk.action}
              </p>
            </div>
          </div>

          {/* Recommended Next Action */}
          <div className="p-6 rounded-2xl glass-panel-glow border-indigo-500/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center shrink-0">
                <Target className="w-6 h-6 text-indigo-300" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                  Recommended Immediate Action
                </div>
                <h4 className="text-base font-bold text-white">
                  {report.executive_summary.recommended_next_action.action}
                </h4>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('recommendations')}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all flex items-center gap-2 shrink-0 shadow-lg shadow-indigo-600/30"
            >
              <span>Explore Action Plan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
