import React from 'react';
import { Search, Sparkles, Command, FileText, Database } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  activeDatasetId: string;
  datasetName: string;
  onOpenCommandPalette: () => void;
  onOpenUpload: () => void;
  onGenerateReport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  activeDatasetId,
  datasetName,
  onOpenCommandPalette,
  onOpenUpload,
  onGenerateReport,
}) => {
  const getTitle = () => {
    switch (activeTab) {
      case 'landing': return 'BUSINEX AI Platform';
      case 'upload': return 'Data Scanning & Ingestion';
      case 'dashboard': return 'Business Intelligence Command Center';
      case 'insights': return 'BUSINEX AI Insights & Diagnostics';
      case 'ask': return 'Ask Your Business Data';
      case 'whatif': return 'What-If Strategic Scenario Lab';
      case 'forecast': return 'Predictive Revenue & Demand Forecast';
      case 'intelligence': return 'Customer & Product Intelligence';
      case 'recommendations': return 'Next Best Strategic Actions';
      case 'summary': return 'Your Business in 60 Seconds';
      case 'explorer': return 'Data Quality & Virtual Explorer';
      case 'report': return 'Executive Decision Briefing';
      default: return 'Business Intelligence Command Center';
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 border-b bg-[#00113a]/90 backdrop-blur-xl border-[#002263]">
      <div className="flex items-center space-x-4">
        <div>
          <h1 className="text-xl font-bold tracking-wide text-gradient font-sans flex items-center gap-2">
            {getTitle()}
          </h1>
          <p className="text-xs text-[#e8e5c3]">
            Dataset: <span className="text-[#f8f2bf] font-semibold">{datasetName}</span> ({activeDatasetId})
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {/* Command Palette Trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-lg glass-panel hover:border-[#890304] text-xs text-[#f8f2bf] transition-all"
        >
          <Search className="w-3.5 h-3.5 text-[#e8e5c3]" />
          <span>Quick Search...</span>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-[#002263] border border-[#e8e5c3]/30 rounded text-[#f8f2bf] flex items-center gap-1">
            <Command className="w-2.5 h-2.5" /> K
          </kbd>
        </button>

        {/* Generate Report Action */}
        <button
          onClick={onGenerateReport}
          className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-[#890304] hover:bg-[#890304]/90 text-[#f8f2bf] text-xs font-bold shadow-lg shadow-[#890304]/40 transition-all border border-[#890304]"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Generate Report</span>
        </button>

        {/* Upload New Data */}
        <button
          onClick={onOpenUpload}
          className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg glass-panel hover:bg-[#002263] text-[#f8f2bf] text-xs font-medium border-[#e8e5c3]/20 transition-all"
        >
          <Database className="w-3.5 h-3.5 text-[#e8e5c3]" />
          <span>Upload Data</span>
        </button>
      </div>
    </header>
  );
};
