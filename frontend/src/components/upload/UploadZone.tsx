import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, CheckCircle2, FileSpreadsheet, Sparkles, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { uploadDatasetFile } from '../../api/client';
import type { DataProfile } from '../../types';

interface UploadZoneProps {
  onUploadSuccess: (datasetId: string, filename: string, profile: DataProfile) => void;
  onExploreDemo: () => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onUploadSuccess, onExploreDemo }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const steps = [
    "File uploaded successfully",
    "Data schema & types detected",
    "Numeric & Categorical columns structured",
    "Performance KPIs & margins calculated",
    "Seasonal trends & velocities identified",
    "Statistical anomalies & risks flagged",
    "AI Strategic Decision Analysis Complete"
  ];

  const handleFileDrop = async (file: File) => {
    setErrorMsg(null);
    setIsProcessing(true);
    setCurrentStep(0);

    // Simulate animated processing timeline steps
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 450);

    try {
      const res = await uploadDatasetFile(file);
      setTimeout(() => {
        setIsProcessing(false);
        onUploadSuccess(res.dataset_id, res.filename, res.profile);
      }, 3200);
    } catch (err: any) {
      clearInterval(interval);
      setIsProcessing(false);
      setErrorMsg(err.message || 'Failed to process dataset file.');
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileDrop(e.dataTransfer.files[0]);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileDrop(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">
          Ingest & Scan Business Telemetry
        </h2>
        <p className="text-sm text-slate-400">
          Upload raw CSV, XLSX, or JSON datasets for instant empirical profiling and strategic AI analysis.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!isProcessing ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className={`relative rounded-3xl p-12 text-center transition-all cursor-pointer border-2 border-dashed ${
              isDragging
                ? 'border-indigo-400 bg-indigo-600/20 shadow-2xl shadow-indigo-500/30 scale-[1.01]'
                : 'border-indigo-500/30 glass-panel hover:border-indigo-500/60'
            }`}
          >
            <input
              type="file"
              accept=".csv,.xlsx,.xls,.json"
              onChange={onFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 text-indigo-400 mx-auto flex items-center justify-center mb-6 shadow-inner">
              <UploadCloud className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-white mb-2">Drop Your Business Data Here</h3>
            <p className="text-xs text-slate-400 mb-6">Supports CSV, XLSX or JSON files up to 100MB</p>

            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-600/30 text-indigo-300 border border-indigo-400/30 text-xs font-semibold">
              <FileSpreadsheet className="w-4 h-4" />
              <span>Browse Files</span>
            </div>

            {errorMsg && (
              <div className="mt-6 p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{errorMsg}</span>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="scanning"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-8 rounded-3xl glass-panel-glow text-center border-indigo-500/50"
          >
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
              <h3 className="text-xl font-bold text-gradient">BUSINEX Scanning & Analysis Pipeline</h3>
            </div>

            {/* Timeline Processing Steps */}
            <div className="max-w-md mx-auto space-y-3 text-left mb-8">
              {steps.map((step, idx) => {
                const isCompleted = idx <= currentStep;
                const isCurrent = idx === currentStep;

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: isCompleted ? 1 : 0.4, x: 0 }}
                    className="flex items-center space-x-3"
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-600 shrink-0" />
                    )}
                    <span className={`text-xs ${isCurrent ? 'text-indigo-300 font-semibold' : (isCompleted ? 'text-slate-200' : 'text-slate-500')}`}>
                      [{isCompleted ? '✓' : ' '}] {step}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Alternative Demo Mode Card */}
      <div className="mt-8 p-6 rounded-2xl glass-panel text-center flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-left">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Don't have a dataset ready?</span>
          </h4>
          <p className="text-xs text-slate-400">
            Instantly load our pre-configured 24-Month Enterprise Retail Dataset to test full platform capabilities.
          </p>
        </div>
        <button
          onClick={onExploreDemo}
          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-2 whitespace-nowrap"
        >
          <span>Explore Demo Dataset</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
