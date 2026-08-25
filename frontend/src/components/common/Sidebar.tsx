import React from 'react';
import {
  LayoutDashboard,
  Brain,
  MessageSquare,
  Sliders,
  TrendingUp,
  Users,
  Target,
  Clock,
  FileText,
  Database,
  Sparkles,
  ChevronRight,
  Zap,
  Layers,
  ShieldCheck
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

interface NavGroup {
  category: string;
  items: {
    id: string;
    label: string;
    icon: React.ElementType;
    badge?: string;
    badgeColor?: string;
    accentColor: string;
    activeBg: string;
  }[];
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navGroups: NavGroup[] = [
    {
      category: 'Analytics & Core',
      items: [
        {
          id: 'dashboard',
          label: 'Command Center',
          icon: LayoutDashboard,
          accentColor: 'text-[#f8f2bf]',
          activeBg: 'from-[#890304]/40 to-[#002263] border-[#890304] text-[#f8f2bf]'
        },
        {
          id: 'insights',
          label: 'BUSINEX Insights',
          icon: Brain,
          badge: 'AI',
          badgeColor: 'bg-[#890304]/40 text-[#f8f2bf] border-[#890304]',
          accentColor: 'text-[#f8f2bf]',
          activeBg: 'from-[#890304]/40 to-[#002263] border-[#890304] text-[#f8f2bf]'
        },
        {
          id: 'ask',
          label: 'Ask Your Data',
          icon: MessageSquare,
          accentColor: 'text-[#e8e5c3]',
          activeBg: 'from-[#890304]/40 to-[#002263] border-[#890304] text-[#f8f2bf]'
        },
      ]
    },
    {
      category: 'Decision & Foresight',
      items: [
        {
          id: 'whatif',
          label: 'What-If Lab',
          icon: Sliders,
          accentColor: 'text-[#f8f2bf]',
          activeBg: 'from-[#890304]/40 to-[#002263] border-[#890304] text-[#f8f2bf]'
        },
        {
          id: 'forecast',
          label: 'Forecasting',
          icon: TrendingUp,
          accentColor: 'text-[#e8e5c3]',
          activeBg: 'from-[#890304]/40 to-[#002263] border-[#890304] text-[#f8f2bf]'
        },
      ]
    },
    {
      category: 'Market & Execution',
      items: [
        {
          id: 'intelligence',
          label: 'Market Intelligence',
          icon: Users,
          accentColor: 'text-[#e8e5c3]',
          activeBg: 'from-[#890304]/40 to-[#002263] border-[#890304] text-[#f8f2bf]'
        },
        {
          id: 'recommendations',
          label: 'Next Best Actions',
          icon: Target,
          badge: 'NEW',
          badgeColor: 'bg-[#890304]/40 text-[#f8f2bf] border-[#890304]',
          accentColor: 'text-[#f8f2bf]',
          activeBg: 'from-[#890304]/40 to-[#002263] border-[#890304] text-[#f8f2bf]'
        },
      ]
    },
    {
      category: 'Reporting & Health',
      items: [
        {
          id: 'summary',
          label: '60-Sec Briefing',
          icon: Clock,
          accentColor: 'text-[#e8e5c3]',
          activeBg: 'from-[#890304]/40 to-[#002263] border-[#890304] text-[#f8f2bf]'
        },
        {
          id: 'report',
          label: 'Executive Report',
          icon: FileText,
          accentColor: 'text-[#f8f2bf]',
          activeBg: 'from-[#890304]/40 to-[#002263] border-[#890304] text-[#f8f2bf]'
        },
        {
          id: 'explorer',
          label: 'Data Quality & Health',
          icon: Database,
          accentColor: 'text-[#e8e5c3]',
          activeBg: 'from-[#890304]/40 to-[#002263] border-[#890304] text-[#f8f2bf]'
        },
      ]
    }
  ];

  return (
    <aside className="w-64 border-r border-[#002263] bg-[#00113a] flex flex-col justify-between h-screen sticky top-0 z-40 select-none shadow-2xl">
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Brand Header */}
        <div 
          className="p-5 border-b border-[#002263] flex items-center space-x-3 cursor-pointer group hover:bg-[#002263]/50 transition-all duration-300"
          onClick={() => setActiveTab('landing')}
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#890304] to-[#002263] p-0.5 shadow-lg shadow-[#890304]/30 group-hover:shadow-[#890304]/50 transition-all duration-300">
              <div className="w-full h-full bg-[#00113a] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#f8f2bf] group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#890304] rounded-full border-2 border-[#00113a]" />
          </div>
          <div>
            <div className="flex items-center space-x-1">
              <h2 className="text-lg font-black tracking-wider text-[#f8f2bf] font-sans">
                BUSINEX
              </h2>
              <span className="px-1.5 py-0.5 text-[10px] font-extrabold bg-[#890304]/30 text-[#f8f2bf] rounded border border-[#890304]/60">
                AI
              </span>
            </div>
            <p className="text-[10px] text-[#e8e5c3] font-medium tracking-tight">Enterprise Intelligence</p>
          </div>
        </div>

        {/* Categorized Navigation */}
        <nav className="p-3 space-y-5">
          {navGroups.map((group) => (
            <div key={group.category} className="space-y-1">
              <div className="px-3 text-[10px] font-bold text-[#e8e5c3]/70 uppercase tracking-widest flex items-center justify-between">
                <span>{group.category}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#890304]" />
              </div>

              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group border ${
                      isActive
                        ? `bg-gradient-to-r ${item.activeBg} shadow-md shadow-[#00113a]`
                        : 'text-[#e8e5c3] hover:text-[#f8f2bf] hover:bg-[#002263]/60 border-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-1.5 rounded-lg transition-transform duration-200 group-hover:scale-110 ${
                        isActive ? 'bg-[#890304]/30 shadow-inner' : 'bg-[#002263]/40'
                      }`}>
                        <Icon className={`w-4 h-4 ${isActive ? 'text-[#f8f2bf]' : 'text-[#e8e5c3] group-hover:text-[#f8f2bf]'}`} />
                      </div>
                      <span className={isActive ? 'font-bold text-[#f8f2bf]' : ''}>{item.label}</span>
                    </div>

                    {item.badge ? (
                      <span className={`px-1.5 py-0.5 text-[9px] font-extrabold rounded border ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    ) : isActive ? (
                      <ChevronRight className="w-3.5 h-3.5 text-[#f8f2bf] opacity-90" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Footer / Core Status Indicator */}
      <div className="p-3 border-t border-[#002263] bg-[#00113a]">
        <div className="p-2.5 rounded-xl bg-[#002263]/60 border border-[#002263] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-[#890304]" />
            <div>
              <p className="text-[11px] text-[#f8f2bf] font-bold leading-none">BUSINEX Engine</p>
              <p className="text-[9px] text-[#e8e5c3] font-medium leading-tight flex items-center space-x-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#890304] animate-pulse" />
                <span>Live Telemetry</span>
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-[#f8f2bf] bg-[#890304]/30 px-1.5 py-0.5 rounded border border-[#890304]/50">v1.2.0</span>
        </div>
      </div>
    </aside>
  );
};

