import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Printer, ShieldCheck, Sparkles, CheckCircle2, FileSpreadsheet } from 'lucide-react';
import { fetchExecutiveReport, fetchDatasetExplorer, downloadDatasetExcel } from '../../api/client';

interface ReportGeneratorProps {
  activeDatasetId: string;
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({ activeDatasetId }) => {
  const [report, setReport] = useState<any>(null);
  const [isExportingExcel, setIsExportingExcel] = useState(false);

  useEffect(() => {
    fetchExecutiveReport(activeDatasetId).then(setReport).catch(console.error);
  }, [activeDatasetId]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportExcel = async () => {
    setIsExportingExcel(true);
    try {
      await downloadDatasetExcel(activeDatasetId);
    } finally {
      setIsExportingExcel(false);
    }
  };

  if (!report) return <div className="p-8 text-center text-xs text-slate-400">Generating Executive Briefing...</div>;

  return (
    <div className="space-y-8 p-6 max-w-4xl mx-auto">
      {/* Header & Actions */}
      <div className="flex items-center justify-between no-print">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-400" />
            <span>Executive Strategic Decision Report</span>
          </h2>
          <p className="text-xs text-slate-400">Formal PDF-ready executive decision briefing with embedded Excel charts export.</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportExcel}
            disabled={isExportingExcel}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-xs text-white font-semibold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-200" />
            <span>{isExportingExcel ? 'Generating Excel...' : 'Export Excel (.xlsx)'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all flex items-center gap-2"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print to PDF</span>
          </button>
        </div>
      </div>


      {/* Printable Styled Report Document */}
      <div className="p-10 rounded-3xl glass-panel-glow border-indigo-500/40 text-slate-200 space-y-8 bg-slate-950/90 shadow-2xl">
        {/* Document Header */}
        <div className="flex justify-between items-start border-b border-slate-800 pb-6">
          <div>
            <div className="text-xs font-extrabold text-indigo-400 tracking-wider uppercase mb-1">
              STRATOS AI PLATFORM • TRACK 2 STRATEGIC DECISION ENGINE
            </div>
            <h1 className="text-3xl font-extrabold text-white">{report.title}</h1>
            <p className="text-xs text-slate-400 mt-1">Generated: {report.generated_at} | Dataset: {report.dataset_name}</p>
          </div>
          <div className="text-right">
            <span className="px-3 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-mono font-bold">
              CONFIDENTIAL
            </span>
          </div>
        </div>

        {/* Section 1: Executive Summary */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider text-indigo-300">1. Executive Summary</h3>
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            {report.executive_summary.briefing_text}
          </p>
        </div>

        {/* Section 2: Key Financial Telemetry */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider text-indigo-300">2. Financial Performance Metrics</h3>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-[10px] text-slate-400">Gross Revenue</div>
              <div className="text-base font-extrabold text-white">{report.kpis.revenue.formatted}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-[10px] text-slate-400">Net Profit Margin</div>
              <div className="text-base font-extrabold text-emerald-400">{report.kpis.profit.margin}%</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-[10px] text-slate-400">Active Accounts</div>
              <div className="text-base font-extrabold text-white">{report.kpis.customers.formatted}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-[10px] text-slate-400">Estimated Churn</div>
              <div className="text-base font-extrabold text-rose-400">{report.kpis.churn.formatted}</div>
            </div>
          </div>
        </div>

        {/* Section 3: Strategic Recommendations */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider text-indigo-300">3. Prioritized Strategic Next Best Actions</h3>
          <div className="space-y-3">
            {report.recommendations.map((rec: any) => (
              <div key={rec.rank} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-bold text-white">{rec.rank}. {rec.title}</h4>
                  <span className="text-[10px] text-indigo-300 font-mono font-bold">Impact: {rec.impact}</span>
                </div>
                <p className="text-slate-300 mb-2">{rec.action}</p>
                <div className="text-[11px] text-slate-400 italic">Evidence: {rec.evidence}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Methodology */}
        <div className="border-t border-slate-800 pt-4 text-[10px] text-slate-500 flex justify-between">
          <span>{report.methodology}</span>
          <span>STRATOS AI Strategic Decision Briefing</span>
        </div>
      </div>
    </div>
  );
};
