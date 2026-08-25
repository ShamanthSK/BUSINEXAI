import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Cpu, BarChart3, Rocket } from 'lucide-react';

interface LandingPageProps {
  onAnalyzeData: () => void;
  onExploreDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onAnalyzeData, onExploreDemo }) => {
  return (
    <div className="relative min-h-screen bg-[#00113a] text-[#f8f2bf] overflow-hidden flex flex-col justify-between">
      {/* Background Animated Data Universe */}
      <div className="absolute inset-0 bg-glow-grid opacity-40 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#890304]/15 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-[#002263]/40 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#890304] to-[#002263] flex items-center justify-center shadow-lg shadow-[#890304]/30">
            <Sparkles className="w-6 h-6 text-[#f8f2bf]" />
          </div>
          <span className="text-xl font-extrabold tracking-wider text-[#f8f2bf]">
            BUSINEX<span className="text-[#e8e5c3] font-light ml-1">AI</span>
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={onExploreDemo}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#e8e5c3] hover:text-[#f8f2bf] glass-panel hover:bg-[#002263] transition-all border-[#e8e5c3]/20"
          >
            Explore Demo
          </button>
          <button
            onClick={onAnalyzeData}
            className="px-5 py-2 rounded-xl text-xs font-bold text-[#f8f2bf] bg-[#890304] hover:bg-[#890304]/90 shadow-lg shadow-[#890304]/40 transition-all flex items-center gap-2 border border-[#890304]"
          >
            <span>Analyze Your Data</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-16 pb-24 text-center flex-1 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full glass-panel border-[#890304]/40 text-[#f8f2bf] text-xs font-medium mb-8"
        >
          <Cpu className="w-4 h-4 text-[#e8e5c3]" />
          <span>Turn Business Data into Strategic Decisions</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl sm:text-7xl font-extrabold text-[#f8f2bf] tracking-tight leading-tight max-w-4xl"
        >
          Your Data Knows <span className="text-gradient">the Answer.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 text-lg sm:text-xl text-[#e8e5c3] max-w-2xl font-light leading-relaxed"
        >
          BUSINEX AI transforms raw business data into actionable insights, root-cause explanations, predictive forecasts, and executive recommendations.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4"
        >
          <button
            onClick={onAnalyzeData}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#890304] hover:bg-[#890304]/90 text-[#f8f2bf] font-bold text-base shadow-2xl shadow-[#890304]/50 hover:scale-105 transition-all flex items-center justify-center gap-3 border border-[#890304]"
          >
            <Rocket className="w-5 h-5 text-[#f8f2bf]" />
            <span>Analyze Your Data</span>
          </button>

          <button
            onClick={onExploreDemo}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl glass-panel hover:bg-[#002263] text-[#f8f2bf] font-semibold text-base border-[#e8e5c3]/20 transition-all flex items-center justify-center gap-2"
          >
            <BarChart3 className="w-5 h-5 text-[#e8e5c3]" />
            <span>Explore Demo (24-Month Dataset)</span>
          </button>
        </motion.div>

        {/* Feature Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full text-left"
        >
          <div className="p-6 rounded-2xl glass-panel hover:border-[#890304]/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#890304]/30 flex items-center justify-center mb-4 border border-[#890304]/50">
              <BarChart3 className="w-5 h-5 text-[#f8f2bf]" />
            </div>
            <h3 className="text-base font-bold text-[#f8f2bf] mb-1">Empirical Telemetry</h3>
            <p className="text-xs text-[#e8e5c3] leading-relaxed">
              Calculates revenue, growth, anomalies, and churn using verifiable statistical pipelines.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-panel hover:border-[#890304]/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#002263] flex items-center justify-center mb-4 border border-[#e8e5c3]/30">
              <Cpu className="w-5 h-5 text-[#f8f2bf]" />
            </div>
            <h3 className="text-base font-bold text-[#f8f2bf] mb-1">Root Cause "Why?"</h3>
            <p className="text-xs text-[#e8e5c3] leading-relaxed">
              Decomposes revenue changes into visual causal chains from regional factors to unit sales.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-panel hover:border-[#890304]/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#890304]/30 flex items-center justify-center mb-4 border border-[#890304]/50">
              <ShieldCheck className="w-5 h-5 text-[#f8f2bf]" />
            </div>
            <h3 className="text-base font-bold text-[#f8f2bf] mb-1">What-If Simulation</h3>
            <p className="text-xs text-[#e8e5c3] leading-relaxed">
              Interactively test marketing spend, pricing, and conversion assumptions with dynamic morphing.
            </p>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#002263] py-6 text-center text-xs text-[#e8e5c3]/80">
        BUSINEX AI — "Turn Business Data Into Your Next Best Decision."
      </footer>
    </div>
  );
};
