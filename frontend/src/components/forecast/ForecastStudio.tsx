import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Calendar, ShieldCheck, Cpu } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import type { ForecastResponse } from '../../types';
import { fetchForecast } from '../../api/client';
import { formatCompactCurrency } from '../../utils/formatters';

interface ForecastStudioProps {
  activeDatasetId: string;
}

export const ForecastStudio: React.FC<ForecastStudioProps> = ({ activeDatasetId }) => {
  const [horizon, setHorizon] = useState<number>(90);
  const [forecastData, setForecastData] = useState<ForecastResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const horizons = [
    { days: 7, label: '7 Days' },
    { days: 30, label: '30 Days' },
    { days: 90, label: '90 Days' },
    { days: 180, label: '6 Months' },
  ];

  useEffect(() => {
    const loadForecast = async () => {
      setLoading(true);
      try {
        const res = await fetchForecast(activeDatasetId, horizon);
        setForecastData(res);
      } catch (err) {
        console.error('Failed to load forecast', err);
      } finally {
        setLoading(false);
      }
    };
    loadForecast();
  }, [horizon, activeDatasetId]);

  return (
    <div className="space-y-8 p-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <TrendingUp className="w-7 h-7 text-indigo-400" />
            <span>Predictive Demand & Revenue Forecasting</span>
          </h2>
          <p className="text-sm text-slate-400">
            Time-series trend regression with confidence interval bands.
          </p>
        </div>

        {/* Horizon Selector Buttons */}
        <div className="flex items-center space-x-1.5 glass-panel p-1 rounded-xl">
          {horizons.map((h) => (
            <button
              key={h.days}
              onClick={() => setHorizon(h.days)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                horizon === h.days
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {h.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Banner */}
      {forecastData && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl glass-panel text-center">
            <div className="text-[11px] text-slate-400 mb-1">Projected {horizon}-Day Revenue</div>
            <div className="text-xl font-extrabold text-white">{forecastData.metrics.projected_revenue_formatted}</div>
            <div className="text-xs font-bold text-emerald-400">+{forecastData.metrics.projected_growth_rate}% vs History</div>
          </div>

          <div className="p-4 rounded-xl glass-panel text-center">
            <div className="text-[11px] text-slate-400 mb-1">Confidence Interval</div>
            <div className="text-xl font-extrabold text-indigo-400">{forecastData.metrics.confidence_level}</div>
            <div className="text-xs text-slate-400">Statistical Variance Band</div>
          </div>

          <div className="p-4 rounded-xl glass-panel text-center">
            <div className="text-[11px] text-slate-400 mb-1">Forecasting Horizon</div>
            <div className="text-xl font-extrabold text-white">{horizon} Days</div>
            <div className="text-xs text-slate-400">{forecastData.forecast.length} weekly steps</div>
          </div>

          <div className="p-4 rounded-xl glass-panel text-center">
            <div className="text-[11px] text-slate-400 mb-1">Algorithm Model</div>
            <div className="text-sm font-bold text-purple-300 mt-1">{forecastData.metrics.model_type}</div>
          </div>
        </div>
      )}

      {/* Main Forecast Chart */}
      <div className="p-6 rounded-2xl glass-panel">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-white">Historical Telemetry vs. Projected Horizon</h3>
            <p className="text-xs text-slate-400">Solid line indicates ground-truth actuals; dashed area indicates predicted bounds.</p>
          </div>
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-indigo-500" />
              <span className="text-slate-300">Actual History</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="text-slate-300">Predicted Forecast</span>
            </div>
          </div>
        </div>

        <div className="h-80 w-full">
          {forecastData && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData.combined_series}>
                <defs>
                  <linearGradient id="colorFc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorAct" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={formatCompactCurrency} />
                <Tooltip formatter={(val: any) => val ? `₹${Number(val).toLocaleString()}` : '-'} />
                <Area type="monotone" name="Upper Confidence" dataKey="upper_bound" stroke="none" fill="#10b981" fillOpacity={0.1} />
                <Area type="monotone" name="Actual Revenue" dataKey="actual" stroke="#6366f1" strokeWidth={3} fill="url(#colorAct)" />
                <Area type="monotone" name="Predicted Revenue" dataKey="forecast" stroke="#10b981" strokeDasharray="4 4" strokeWidth={3} fill="url(#colorFc)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};
