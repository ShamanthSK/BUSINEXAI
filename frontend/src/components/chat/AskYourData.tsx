import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, Sparkles, Bot, User, BarChart2, PieChart, TrendingUp, Loader2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, PieChart as RePieChart, Pie, Cell, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import type { NLQueryResponse } from '../../types';
import { askDataQuestion } from '../../api/client';

interface AskYourDataProps {
  activeDatasetId: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  responsePayload?: NLQueryResponse;
}

export const AskYourData: React.FC<AskYourDataProps> = ({ activeDatasetId }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Hello! I am your STRATOS AI analytical copilot. Ask me anything about your dataset, revenue breakdown, customer segments, or product growth.',
    }
  ]);

  const presetQuestions = [
    'Show revenue by region.',
    'Which product is growing fastest?',
    'Who are our highest-value customers?',
    'Show monthly growth trajectory.'
  ];

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  const handleSend = async (qText?: string) => {
    const question = qText || input;
    if (!question.trim() || loading) return;

    const userMsg: ChatMessage = { id: `u_${Date.now()}`, sender: 'user', text: question };
    setMessages((prev) => [...prev, userMsg]);
    if (!qText) setInput('');
    setLoading(true);

    try {
      const res = await askDataQuestion(activeDatasetId, question);
      const botMsg: ChatMessage = {
        id: `b_${Date.now()}`,
        sender: 'bot',
        text: res.answer,
        responsePayload: res
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { id: `b_${Date.now()}`, sender: 'bot', text: 'Apologies, I encountered an issue querying the dataset. Please try rephrasing your question.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderChart = (payload: NLQueryResponse['chart']) => {
    if (!payload || !payload.data || payload.data.length === 0) return null;

    if (payload.type === 'bar') {
      return (
        <div className="h-60 w-full mt-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs font-bold text-slate-300 mb-3">{payload.title}</div>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={payload.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey={payload.x_key} stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${(v/1e5).toFixed(0)}L`} />
              <Tooltip formatter={(val: any) => `₹${Number(val).toLocaleString()}`} />
              <Bar dataKey={payload.y_key} fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
    } else if (payload.type === 'line') {
      return (
        <div className="h-60 w-full mt-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs font-bold text-slate-300 mb-3">{payload.title}</div>
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={payload.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey={payload.x_key} stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${(v/1e5).toFixed(0)}L`} />
              <Tooltip formatter={(val: any) => `₹${Number(val).toLocaleString()}`} />
              <Line type="monotone" dataKey={payload.y_key} stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      );
    } else if (payload.type === 'pie') {
      return (
        <div className="h-60 w-full mt-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-around">
          <div className="w-1/2 h-full">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie data={payload.data} dataKey={payload.y_key} nameKey={payload.x_key} cx="50%" cy="50%" outerRadius={70}>
                  {payload.data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: any) => `₹${Number(val).toLocaleString()}`} />
              </RePieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 text-xs">
            {payload.data.map((entry: any, idx: number) => (
              <div key={idx} className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                <span className="text-slate-300">{entry[payload.x_key]}:</span>
                <span className="font-bold text-white">₹{(entry[payload.y_key]/1e5).toFixed(1)}L</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 flex flex-col h-[calc(100vh-140px)]">
      {/* Title */}
      <div className="mb-4">
        <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-indigo-400" />
          <span>Ask Your Business Data</span>
        </h2>
        <p className="text-xs text-slate-400">
          Natural language interface powered by verifiable analytical query execution.
        </p>
      </div>

      {/* Preset Pills */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {presetQuestions.map((pq, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(pq)}
            className="px-3 py-1.5 rounded-xl glass-panel hover:border-indigo-500/50 text-xs text-indigo-300 font-medium transition-all"
          >
            {pq}
          </button>
        ))}
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4 rounded-2xl glass-panel border-indigo-500/20 mb-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'bot' && (
              <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-indigo-300" />
              </div>
            )}

            <div className={`max-w-2xl p-4 rounded-2xl text-xs leading-relaxed ${
              msg.sender === 'user'
                ? 'bg-indigo-600 text-white rounded-tr-none'
                : 'glass-panel text-slate-200 rounded-tl-none border-indigo-500/20'
            }`}>
              <div>{msg.text}</div>

              {/* Dynamic Metrics Highlights */}
              {msg.responsePayload?.metrics_highlight && (
                <div className="grid grid-cols-3 gap-2 mt-3 p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                  {msg.responsePayload.metrics_highlight.map((mh, idx) => (
                    <div key={idx} className="text-center">
                      <div className="text-[10px] text-slate-400">{mh.label}</div>
                      <div className="text-xs font-bold text-indigo-300">{mh.value}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Text to Chart Visualization */}
              {msg.responsePayload?.chart && renderChart(msg.responsePayload.chart)}
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-400/30 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-purple-300" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center space-x-2 text-xs text-indigo-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Analyzing dataset telemetry...</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        className="flex items-center space-x-3"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question (e.g. 'Why did revenue drop in North region?')..."
          className="flex-1 px-4 py-3 rounded-xl glass-input text-xs"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
        >
          <span>Ask</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
