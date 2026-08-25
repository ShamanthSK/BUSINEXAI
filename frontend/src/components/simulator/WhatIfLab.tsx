import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sliders, TrendingUp, DollarSign, Users, Award, RotateCcw, Download, FileSpreadsheet } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import type { WhatIfResponse } from '../../types';
import { runWhatIfSim } from '../../api/client';

interface WhatIfLabProps {
  activeDatasetId: string;
  initialParams?: { marketing: number; price: number; conversion: number } | null;
}

export const WhatIfLab: React.FC<WhatIfLabProps> = ({ activeDatasetId, initialParams }) => {
  const [marketingChange, setMarketingChange] = useState(50.0);
  const [priceChange, setPriceChange] = useState(-5.0);
  const [conversionChange, setConversionChange] = useState(25.0);
  const [simResult, setSimResult] = useState<WhatIfResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialParams) {
      setMarketingChange(initialParams.marketing);
      setPriceChange(initialParams.price);
      setConversionChange(initialParams.conversion);
    }
  }, [initialParams]);

  const fetchSimulation = async () => {
    setLoading(true);
    try {
      const res = await runWhatIfSim(activeDatasetId, {
        marketing_change_pct: marketingChange,
        price_change_pct: priceChange,
        conversion_change_pct: conversionChange
      });
      setSimResult(res);
    } catch (err) {
      console.error('What-if sim failed', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSimulation();
  }, [marketingChange, priceChange, conversionChange, activeDatasetId]);

  const handleReset = () => {
    setMarketingChange(0.0);
    setPriceChange(0.0);
    setConversionChange(0.0);
  };

  const handleDownloadReport = () => {
    if (!simResult) return;
    const lines = [
      'BUSINEX AI STRATEGIC WHAT-IF SIMULATION REPORT',
      `Generated Date,${new Date().toLocaleString()}`,
      `Dataset ID,${activeDatasetId}`,
      '',
      '--- SIMULATED ASSUMPTIONS ---',
      `Marketing Spend Shift (%),${marketingChange}% (${estMktRupees >= 0 ? '+' : ''}₹${estMktRupees.toLocaleString('en-IN')}/mo)`,
      `Price Adjustment (%),${priceChange}%`,
      `Conversion Velocity Change (%),${conversionChange}%`,
      '',
      '--- SCENARIO OUTCOME SUMMARY ---',
      `Baseline Revenue,${simResult.baseline.revenue_formatted}`,
      `Projected Revenue,${simResult.projected.revenue_formatted} (${simResult.projected.revenue_change_pct >= 0 ? '+' : ''}${simResult.projected.revenue_change_pct}%)`,
      `Baseline Profit,${simResult.baseline.profit_formatted}`,
      `Projected Profit,${simResult.projected.profit_formatted} (${simResult.projected.profit_change_pct >= 0 ? '+' : ''}${simResult.projected.profit_change_pct}%)`,
      `Projected Net Profit Margin,${simResult.projected.profit_margin}%`,
      `Projected Customers / Accounts,${simResult.projected.customers}`,
      `Expected Marketing ROI,${simResult.projected.expected_roi}%`,
      '',
      '--- MONTHLY TRAJECTORY BREAKDOWN ---',
      'Month,Baseline Revenue (INR),Simulated Projected Revenue (INR),Revenue Delta (INR)'
    ];

    simResult.chart_data.forEach((row: any) => {
      const delta = row.projected_revenue - row.baseline_revenue;
      lines.push(`${row.month},${row.baseline_revenue},${row.projected_revenue},${delta}`);
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + lines.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `BUSINEX_WhatIf_Simulation_Report_${activeDatasetId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper for rupee spend estimation
  const estMktRupees = (marketingChange / 100) * 1000000;

  return (
    <div className="space-y-8 p-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Sliders className="w-7 h-7 text-indigo-400" />
            <span>WHAT-IF STRATEGIC SCENARIO LAB</span>
          </h2>
          <p className="text-sm text-slate-400">
            Interactive elasticity simulator for exact price adjustments (₹ / %), marketing spend, and conversion optimization.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleDownloadReport}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/30 transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download Simulation Report (CSV)</span>
          </button>

          <button
            onClick={handleReset}
            className="px-3.5 py-2 rounded-xl glass-panel hover:bg-slate-800 text-xs text-slate-300 font-semibold transition-all flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Sliders Control Panel & Output Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sliders Panel (1 Col) */}
        <div className="p-6 rounded-2xl glass-panel space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white">
              Simulated Assumptions
            </h3>
            <span className="text-[10px] font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
              ₹ Precision Mode
            </span>
          </div>

          {/* Input 1: Marketing Spend */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-semibold">Marketing Spend Shift</span>
              <div className="flex items-center space-x-1.5">
                <input
                  type="number"
                  step="0.1"
                  value={marketingChange}
                  onChange={(e) => setMarketingChange(parseFloat(e.target.value) || 0)}
                  className="w-20 px-2 py-1 bg-slate-900 border border-indigo-500/40 rounded text-right text-xs font-mono font-extrabold text-indigo-300 focus:outline-none focus:border-indigo-400"
                />
                <span className="text-xs text-indigo-400 font-mono font-bold">%</span>
              </div>
            </div>
            <input
              type="range"
              min="-50"
              max="100"
              step="0.1"
              value={marketingChange}
              onChange={(e) => setMarketingChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>-50%</span>
              <span className="text-indigo-300 font-semibold">
                {estMktRupees >= 0 ? `+₹${Math.abs(estMktRupees).toLocaleString('en-IN')}` : `-₹${Math.abs(estMktRupees).toLocaleString('en-IN')}`} / mo
              </span>
              <span>+100%</span>
            </div>
          </div>

          {/* Input 2: Price Adjustment */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-semibold">Price Adjustment</span>
              <div className="flex items-center space-x-1.5">
                <input
                  type="number"
                  step="0.1"
                  value={priceChange}
                  onChange={(e) => setPriceChange(parseFloat(e.target.value) || 0)}
                  className="w-20 px-2 py-1 bg-slate-900 border border-emerald-500/40 rounded text-right text-xs font-mono font-extrabold text-emerald-300 focus:outline-none focus:border-emerald-400"
                />
                <span className="text-xs text-emerald-400 font-mono font-bold">%</span>
              </div>
            </div>
            <input
              type="range"
              min="-20"
              max="20"
              step="0.1"
              value={priceChange}
              onChange={(e) => setPriceChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>-20% Discount</span>
              <span className="text-emerald-300 font-semibold">
                {priceChange >= 0 ? `+${priceChange}% Premium` : `${priceChange}% Discount`}
              </span>
              <span>+20% Premium</span>
            </div>
          </div>

          {/* Input 3: Conversion Velocity */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-semibold">Conversion Velocity</span>
              <div className="flex items-center space-x-1.5">
                <input
                  type="number"
                  step="0.1"
                  value={conversionChange}
                  onChange={(e) => setConversionChange(parseFloat(e.target.value) || 0)}
                  className="w-20 px-2 py-1 bg-slate-900 border border-purple-500/40 rounded text-right text-xs font-mono font-extrabold text-purple-300 focus:outline-none focus:border-purple-400"
                />
                <span className="text-xs text-purple-400 font-mono font-bold">%</span>
              </div>
            </div>
            <input
              type="range"
              min="-30"
              max="50"
              step="0.1"
              value={conversionChange}
              onChange={(e) => setConversionChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>-30%</span>
              <span className="text-purple-300 font-semibold">
                Baseline CR → {(3.2 * (1 + conversionChange / 100)).toFixed(2)}%
              </span>
              <span>+50%</span>
            </div>
          </div>
        </div>

        {/* Projected Outcome Cards & Dynamic Morphing Chart (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Projected KPI Highlights */}
          {simResult && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl glass-panel text-center border-indigo-500/30">
                <div className="text-[11px] text-slate-400 mb-1">Projected Revenue</div>
                <div className="text-xl font-extrabold text-white">{simResult.projected.revenue_formatted}</div>
                <div className={`text-xs font-bold ${simResult.projected.revenue_change_pct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {simResult.projected.revenue_change_pct >= 0 ? '+' : ''}{simResult.projected.revenue_change_pct}%
                </div>
              </div>

              <div className="p-4 rounded-xl glass-panel text-center border-emerald-500/30">
                <div className="text-[11px] text-slate-400 mb-1">Projected Net Profit</div>
                <div className="text-xl font-extrabold text-emerald-400">{simResult.projected.profit_formatted}</div>
                <div className="text-xs font-bold text-slate-300">{simResult.projected.profit_margin}% Margin</div>
              </div>

              <div className="p-4 rounded-xl glass-panel text-center border-purple-500/30">
                <div className="text-[11px] text-slate-400 mb-1">Projected Accounts</div>
                <div className="text-xl font-extrabold text-white">{simResult.projected.customers.toLocaleString()}</div>
                <div className="text-xs font-bold text-purple-300">+{simResult.projected.customers_change_pct}%</div>
              </div>

              <div className="p-4 rounded-xl glass-panel text-center border-amber-500/30">
                <div className="text-[11px] text-slate-400 mb-1">Marketing ROI</div>
                <div className="text-xl font-extrabold text-amber-400">{simResult.projected.expected_roi}%</div>
                <div className="text-xs font-bold text-slate-400">Return on Spend</div>
              </div>
            </div>
          )}

          {/* Morphing Chart Visualization */}
          <div className="p-6 rounded-2xl glass-panel">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-400" />
                <span>Baseline vs. Simulated Trajectory Morphing</span>
              </h3>
            </div>

            <div className="h-64 w-full">
              {simResult && (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={simResult.chart_data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${(v/1e5).toFixed(0)}L`} />
                    <Tooltip formatter={(val: any) => `₹${Number(val).toLocaleString()}`} />
                    <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
                    <Line type="monotone" name="Baseline Trajectory" dataKey="baseline_revenue" stroke="#94a3b8" strokeDasharray="4 4" strokeWidth={2} dot={false} />
                    <Line type="monotone" name="Simulated Outcome" dataKey="projected_revenue" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            {simResult && (
              <div className="mt-4 p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200 leading-relaxed">
                <strong className="font-semibold text-white">Simulation Insight: </strong>
                {simResult.summary}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
