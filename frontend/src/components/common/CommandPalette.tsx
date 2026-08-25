import React, { useState, useEffect } from 'react';
import { Search, LayoutDashboard, Brain, MessageSquare, Sliders, TrendingUp, FileText, Database, X } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onSelectTab }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        isOpen ? onClose() : null;
      }
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const commands = [
    { id: 'dashboard', title: 'Open Command Center Overview', category: 'Navigation', icon: LayoutDashboard },
    { id: 'insights', title: 'View AI Strategic Insights & Risks', category: 'Analytics', icon: Brain },
    { id: 'ask', title: 'Ask Your Data (Conversational Query)', category: 'AI Tools', icon: MessageSquare },
    { id: 'whatif', title: 'Open What-If Strategic Scenario Lab', category: 'Simulator', icon: Sliders },
    { id: 'forecast', title: 'View 90-Day Revenue Forecast', category: 'Predictions', icon: TrendingUp },
    { id: 'report', title: 'Generate Executive Decision Report', category: 'Reports', icon: FileText },
    { id: 'explorer', title: 'Inspect Data Health & Explorer Table', category: 'Data', icon: Database },
    { id: 'upload', title: 'Upload New Business Dataset', category: 'Data', icon: Database },
  ];

  const filtered = commands.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-xl glass-panel-glow overflow-hidden shadow-2xl rounded-2xl border border-indigo-500/40">
        <div className="flex items-center px-4 py-3 border-b border-indigo-500/20 bg-slate-900/60">
          <Search className="w-4 h-4 text-indigo-400 mr-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search action..."
            className="w-full bg-transparent text-white placeholder-slate-400 text-sm focus:outline-none"
            autoFocus
          />
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded text-slate-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-2 max-h-80 overflow-y-auto space-y-1">
          {filtered.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-400">No matching commands found.</div>
          ) : (
            filtered.map((cmd) => {
              const Icon = cmd.icon;
              return (
                <button
                  key={cmd.id}
                  onClick={() => {
                    onSelectTab(cmd.id);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-indigo-600/20 text-slate-200 hover:text-white transition-all text-left group"
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-medium">{cmd.title}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                    {cmd.category}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
