import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { CommandPalette } from './components/common/CommandPalette';

import { LandingPage } from './components/landing/LandingPage';
import { UploadZone } from './components/upload/UploadZone';
import { ExecutiveDashboard } from './components/dashboard/ExecutiveDashboard';
import { InsightsCenter } from './components/insights/InsightsCenter';
import { AskYourData } from './components/chat/AskYourData';
import { WhatIfLab } from './components/simulator/WhatIfLab';
import { ForecastStudio } from './components/forecast/ForecastStudio';
import { IntelligenceViews } from './components/intelligence/IntelligenceViews';
import { RecommendationsView } from './components/recommendations/RecommendationsView';
import { ExecutiveSummary } from './components/summary/ExecutiveSummary';
import { ReportGenerator } from './components/report/ReportGenerator';
import { DataExplorer } from './components/explorer/DataExplorer';

import { fetchDatasetMetrics, fetchDatasetInsights, fetchDemoInfo } from './api/client';
import type { KPIData, TrendData, Insight, DataProfile } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [activeDatasetId, setActiveDatasetId] = useState<string>('demo');
  const [datasetName, setDatasetName] = useState<string>('Retail Business — 24 Months');

  const [kpis, setKpis] = useState<KPIData | null>(null);
  const [trends, setTrends] = useState<TrendData | null>(null);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [simParams, setSimParams] = useState<{ marketing: number; price: number; conversion: number } | null>(null);

  const handleSimulateRecommendation = (params: { marketing: number; price: number; conversion: number }) => {
    setSimParams(params);
    setActiveTab('whatif');
  };

  // Load initial demo metrics
  const loadDatasetData = async (dsId: string) => {
    setLoading(true);
    try {
      const metrics = await fetchDatasetMetrics(dsId);
      const ins = await fetchDatasetInsights(dsId);
      setKpis(metrics.kpis);
      setTrends(metrics.trends);
      setInsights(ins.insights);
    } catch (err) {
      console.error('Failed to load dataset telemetry', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDatasetData(activeDatasetId);
  }, [activeDatasetId]);

  const handleExploreDemo = () => {
    setActiveDatasetId('demo');
    setDatasetName('Retail Business — 24 Months');
    setActiveTab('dashboard');
  };

  const handleUploadSuccess = (dsId: string, filename: string, profile: DataProfile) => {
    setActiveDatasetId(dsId);
    setDatasetName(filename);
    loadDatasetData(dsId);
    setActiveTab('dashboard');
  };

  if (activeTab === 'landing') {
    return (
      <LandingPage
        onAnalyzeData={() => setActiveTab('upload')}
        onExploreDemo={handleExploreDemo}
      />
    );
  }

  return (
    <div className="min-h-screen bg-stratos-bg text-slate-100 flex font-sans selection:bg-indigo-500 selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky Glass Header */}
        <Header
          activeTab={activeTab}
          activeDatasetId={activeDatasetId}
          datasetName={datasetName}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onOpenUpload={() => setActiveTab('upload')}
          onGenerateReport={() => setActiveTab('report')}
        />

        {/* Dynamic Page Views with Subtle Slide & Fade Animation */}
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0.7, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0.7, y: -8 }}
              transition={{ duration: 0.25 }}
              className="h-full"
            >
              {activeTab === 'upload' && (
                <UploadZone
                  onUploadSuccess={handleUploadSuccess}
                  onExploreDemo={handleExploreDemo}
                />
              )}

              {activeTab === 'dashboard' && (
                kpis && trends ? (
                  <ExecutiveDashboard
                    kpis={kpis}
                    trends={trends}
                    activeDatasetId={activeDatasetId}
                    onOpenWhyModal={() => setActiveTab('insights')}
                    onNavigateTab={setActiveTab}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full min-h-[400px] space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center animate-spin">
                      <div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full" />
                    </div>
                    <p className="text-sm font-semibold text-indigo-300">Loading BUSINEX Intelligence Telemetry...</p>
                  </div>
                )
              )}

              {activeTab === 'insights' && (
                <InsightsCenter
                  insights={insights}
                  activeDatasetId={activeDatasetId}
                />
              )}

              {activeTab === 'ask' && (
                <AskYourData activeDatasetId={activeDatasetId} />
              )}

              {activeTab === 'whatif' && (
                <WhatIfLab activeDatasetId={activeDatasetId} initialParams={simParams} />
              )}

              {activeTab === 'forecast' && (
                <ForecastStudio activeDatasetId={activeDatasetId} />
              )}

              {activeTab === 'intelligence' && (
                <IntelligenceViews activeDatasetId={activeDatasetId} />
              )}

              {activeTab === 'recommendations' && (
                <RecommendationsView 
                  onNavigateTab={setActiveTab} 
                  onSimulateRecommendation={handleSimulateRecommendation}
                />
              )}

              {activeTab === 'summary' && kpis && (
                <ExecutiveSummary
                  kpis={kpis}
                  insights={insights}
                  activeDatasetId={activeDatasetId}
                  onNavigateTab={setActiveTab}
                />
              )}

              {activeTab === 'report' && (
                <ReportGenerator activeDatasetId={activeDatasetId} />
              )}

              {activeTab === 'explorer' && (
                <DataExplorer activeDatasetId={activeDatasetId} />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Ctrl + K Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectTab={setActiveTab}
      />
    </div>
  );
}

export default App;
