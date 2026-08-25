import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Database, ShieldCheck, Search, AlertCircle, FileSpreadsheet, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import type { DataProfile } from '../../types';
import { fetchDatasetProfile, fetchDatasetExplorer } from '../../api/client';

interface DataExplorerProps {
  activeDatasetId: string;
}

export const DataExplorer: React.FC<DataExplorerProps> = ({ activeDatasetId }) => {
  const [profile, setProfile] = useState<DataProfile | null>(null);
  const [explorerData, setExplorerData] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchDatasetProfile(activeDatasetId).then(setProfile).catch(console.error);
  }, [activeDatasetId]);

  useEffect(() => {
    fetchDatasetExplorer(activeDatasetId, page, search).then(setExplorerData).catch(console.error);
  }, [activeDatasetId, page, search]);

  return (
    <div className="space-y-8 p-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Database className="w-7 h-7 text-indigo-400" />
            <span>Data Health & Virtual Explorer</span>
          </h2>
          <p className="text-sm text-slate-400">
            Empirical data profiling, schema integrity validation, and virtualized row explorer.
          </p>
        </div>
      </div>

      {/* Health Score Overview Banner */}
      {profile && (
        <div className="p-6 rounded-2xl glass-panel-glow border-indigo-500/40 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-6">
            <div className="relative w-24 h-24 rounded-full bg-slate-900 border-4 border-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <span className="text-3xl font-extrabold text-white">{profile.health_score}</span>
              <span className="text-[10px] text-slate-400 absolute bottom-3">/100</span>
            </div>

            <div>
              <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
                Data Quality Index
              </div>
              <h3 className="text-xl font-bold text-white mb-1">
                {profile.health_score >= 85 ? 'High Telemetry Health' : 'Moderate Quality Alert'}
              </h3>
              <p className="text-xs text-slate-300">
                {profile.summary_text}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center w-full md:w-auto">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-[10px] text-slate-400">Total Records</div>
              <div className="text-sm font-bold text-white">{profile.total_rows.toLocaleString()}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-[10px] text-slate-400">Duplicates</div>
              <div className="text-sm font-bold text-emerald-400">{profile.duplicate_rows}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-[10px] text-slate-400">Missing Values</div>
              <div className="text-sm font-bold text-indigo-300">{profile.missing_cells}</div>
            </div>
          </div>
        </div>
      )}

      {/* Explorer Search & Table */}
      <div className="p-6 rounded-2xl glass-panel space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-base font-bold text-white">Virtualized Dataset Explorer</h3>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search dataset rows..."
              className="w-full pl-9 pr-4 py-2 rounded-xl glass-input text-xs"
            />
          </div>
        </div>

        {/* Table */}
        {explorerData && (
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  {explorerData.columns.map((col: string) => (
                    <th key={col} className="px-4 py-3 font-mono whitespace-nowrap">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {explorerData.rows.map((row: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                    {explorerData.columns.map((col: string) => (
                      <td key={col} className="px-4 py-2.5 whitespace-nowrap font-sans text-slate-200">
                        {String(row[col])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {explorerData && (
          <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
            <span>Showing page {explorerData.page} of {explorerData.total_pages} ({explorerData.total_rows.toLocaleString()} records)</span>
            <div className="flex items-center space-x-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="p-1.5 rounded-lg glass-panel disabled:opacity-30 hover:bg-slate-800"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page >= explorerData.total_pages}
                onClick={() => setPage((p) => p + 1)}
                className="p-1.5 rounded-lg glass-panel disabled:opacity-30 hover:bg-slate-800"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
