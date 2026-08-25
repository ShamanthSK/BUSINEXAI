import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  DollarSign,
  Users,
  ShoppingBag,
  AlertTriangle,
  HelpCircle,
  BarChart2,
  Filter,
  Layers
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import type { KPIData, TrendData } from '../../types';

interface ExecutiveDashboardProps {
  kpis: KPIData;
  trends: TrendData;
  onOpenWhyModal: (metricName: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  kpis,
  trends,
  onOpenWhyModal,
  onNavigateTab,
}) => {
  const [salesView, setSalesView] = useState<'region' | 'product' | 'category'>('product');
  const [chartType, setChartType] = useState<'curve' | 'bar'>('curve');

  const getSalesChartData = () => {
    switch (salesView) {
      case 'product': return trends.by_product.map(p => ({ key: p.product, revenue: p.revenue }));
      case 'region': return trends.by_region.map(r => ({ key: r.region, revenue: r.revenue }));
      case 'category': return trends.by_category.map(c => ({ key: c.category, revenue: c.revenue }));
      default: return [];
    }
  };

  return (
    <div className="space-y-8 p-6">
      {/* Title & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Business Intelligence Command Center
          </h2>
          <p className="text-sm text-slate-400">
            Here's what your business telemetry is telling you.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigateTab('insights')}
            className="px-4 py-2 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 text-xs font-semibold transition-all flex items-center gap-2"
          >
            <span>View AI Insights</span>
            <TrendingUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Revenue KPI Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="p-5 rounded-2xl glass-panel hover:glass-panel-glow transition-all relative overflow-hidden group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Total Gross Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white mb-2">
            {kpis.revenue.formatted}
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +{kpis.revenue.growth}%
            </span>
            <button
              onClick={() => onOpenWhyModal('Revenue')}
              className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold hover:underline"
            >
              <HelpCircle className="w-3 h-3" /> Why?
            </button>
          </div>
        </motion.div>

        {/* Net Profit Margin Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="p-5 rounded-2xl glass-panel hover:glass-panel-glow transition-all relative overflow-hidden group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Net Profit Margin</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <BarChart2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white mb-2">
            {kpis.profit.margin}%
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Net Profit: {kpis.profit.formatted}</span>
            <button
              onClick={() => onOpenWhyModal('Profit Margin')}
              className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold hover:underline"
            >
              <HelpCircle className="w-3 h-3" /> Why?
            </button>
          </div>
        </motion.div>

        {/* Active Customer Count */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="p-5 rounded-2xl glass-panel hover:glass-panel-glow transition-all relative overflow-hidden group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Active Accounts</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white mb-2">
            {kpis.customers.formatted}
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-emerald-400 font-semibold">+8.1% account growth</span>
            <span className="text-slate-500">AOV: {kpis.aov.formatted}</span>
          </div>
        </motion.div>

        {/* Estimated Churn Risk */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="p-5 rounded-2xl glass-panel hover:glass-panel-glow transition-all relative overflow-hidden group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Estimated Churn Exposure</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-rose-400 mb-2">
            {kpis.churn.formatted}
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-rose-300 font-semibold">Requires Intervention</span>
            <button
              onClick={() => onNavigateTab('intelligence')}
              className="text-indigo-400 hover:text-indigo-300 font-semibold hover:underline"
            >
              Details
            </button>
          </div>
        </motion.div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trajectory Chart (2 Cols) */}
        <div className="lg:col-span-2 p-6 rounded-2xl glass-panel flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-400" />
                <span>Monthly Revenue Trajectory</span>
              </h3>
              <p className="text-xs text-slate-400">Historical revenue telemetry over time</p>
            </div>

            {/* Chart Type Selector: Curve Graph vs Bar Graph */}
            <div className="flex items-center space-x-1.5 glass-panel p-1 rounded-xl">
              <button
                onClick={() => setChartType('curve')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  chartType === 'curve'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Curve Graph</span>
              </button>
              <button
                onClick={() => setChartType('bar')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  chartType === 'bar'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span>Bar Graph</span>
              </button>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'curve' ? (
                <AreaChart data={trends.revenue_over_time}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${(v/1e5).toFixed(0)}L`} />
                  <Tooltip
                    formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, 'Revenue']}
                    contentStyle={{ backgroundColor: 'rgba(15,23,42,0.95)', borderColor: 'rgba(99,102,241,0.3)', borderRadius: '8px' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              ) : (
                <BarChart data={trends.revenue_over_time}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${(v/1e5).toFixed(0)}L`} />
                  <Tooltip
                    formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, 'Revenue']}
                    contentStyle={{ backgroundColor: 'rgba(15,23,42,0.95)', borderColor: 'rgba(99,102,241,0.3)', borderRadius: '8px' }}
                  />
                  <Bar dataKey="revenue" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales Breakdown Chart (1 Col) */}
        <div className="p-6 rounded-2xl glass-panel flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Sales Distribution</span>
            </h3>
            <div className="flex bg-slate-900/80 rounded-lg p-1 border border-slate-800 text-[10px]">
              <button
                onClick={() => setSalesView('product')}
                className={`px-2 py-1 rounded-md font-semibold transition-all ${salesView === 'product' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
              >
                Product
              </button>
              <button
                onClick={() => setSalesView('region')}
                className={`px-2 py-1 rounded-md font-semibold transition-all ${salesView === 'region' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
              >
                Region
              </button>
              <button
                onClick={() => setSalesView('category')}
                className={`px-2 py-1 rounded-md font-semibold transition-all ${salesView === 'category' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
              >
                Category
              </button>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getSalesChartData().slice(0, 6)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" stroke="#94a3b8" fontSize={10} tickFormatter={(v) => `₹${(v/1e5).toFixed(0)}L`} />
                <YAxis dataKey="key" type="category" stroke="#94a3b8" fontSize={10} width={90} tickLine={false} />
                <Tooltip
                  formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, 'Revenue']}
                  contentStyle={{ backgroundColor: 'rgba(15,23,42,0.95)', borderColor: 'rgba(99,102,241,0.3)', borderRadius: '8px' }}
                />
                <Bar dataKey="revenue" fill="#10b981" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
