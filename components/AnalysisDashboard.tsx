import React, { useState } from 'react';
import { RFPAnalysis } from '../types';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  Clock, 
  Target, 
  ChevronLeft, 
  Code,
  DollarSign
} from 'lucide-react';
import { ChatAssistant } from './ChatAssistant';

interface AnalysisDashboardProps {
  data: RFPAnalysis;
  originalText: string;
  onReset: () => void;
}

export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ data, originalText, onReset }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'chat'>('overview');

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'bg-red-100 text-red-700 border-red-200';
      case 'Medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden relative">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 flex-shrink-0 z-10">
        <div className="px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={onReset}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
              title="Upload new RFP"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-slate-900 truncate max-w-xl">
                {data.projectTitle || "프로젝트 분석"}
              </h1>
              <p className="text-xs text-slate-500">Client: {data.clientName || "Unknown"}</p>
            </div>
          </div>
          
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                activeTab === 'overview' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                activeTab === 'details' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Details & Timeline
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all flex items-center space-x-1 ${
                activeTab === 'chat' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <span>Q&A Assistant</span>
            </button>
          </div>
        </div>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto pb-10">
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in-up">
              {/* Executive Summary */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-indigo-500" />
                  Executive Summary
                </h2>
                <p className="text-slate-600 leading-relaxed text-lg mb-6">
                  {data.executiveSummary}
                </p>
                <div className="flex flex-wrap gap-2">
                  {data.keyObjectives.map((obj, i) => (
                    <span key={i} className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      {obj}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Tech Stack */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
                  <h3 className="text-base font-semibold text-slate-800 mb-4 flex items-center">
                    <Code className="w-5 h-5 mr-2 text-blue-500" />
                    Recommended Stack
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {data.recommendedTechStack.map((tech, i) => (
                      <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded text-sm font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Budget */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
                  <h3 className="text-base font-semibold text-slate-800 mb-4 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-green-500" />
                    Est. Budget Range
                  </h3>
                  <div className="flex items-center h-full">
                    <p className="text-2xl font-bold text-slate-700">{data.estimatedBudgetRange}</p>
                  </div>
                </div>

                {/* Top Risk */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
                  <h3 className="text-base font-semibold text-slate-800 mb-4 flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2 text-amber-500" />
                    Highest Risk
                  </h3>
                  {data.risks.length > 0 ? (
                    <div className={`p-4 rounded-lg border ${getSeverityColor(data.risks[0].severity)}`}>
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold text-sm leading-tight">{data.risks[0].risk}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/50 ml-2 whitespace-nowrap">{data.risks[0].severity}</span>
                      </div>
                      <p className="text-xs opacity-90 leading-snug">{data.risks[0].mitigation}</p>
                    </div>
                  ) : (
                    <p className="text-slate-500 text-sm">No major risks identified.</p>
                  )}
                </div>
              </div>

              {/* Functional Requirements Grid */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center">
                  <Layers className="w-5 h-5 mr-2 text-purple-500" />
                  Functional Requirements
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  {data.functionalRequirements.map((req, i) => (
                    <div key={i} className="flex items-start p-4 bg-slate-50/80 rounded-lg border border-slate-100">
                      <div className="mt-1.5 min-w-[6px] h-[6px] rounded-full bg-purple-500 mr-3"></div>
                      <span className="text-slate-700 text-sm font-medium">{req}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'details' && (
            <div className="space-y-6 animate-fade-in-up">
              {/* Risk Assessment Matrix */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                  <h2 className="text-lg font-semibold text-slate-800 flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2 text-amber-500" />
                    Risk Assessment Matrix
                  </h2>
                </div>
                <div className="divide-y divide-slate-100">
                  {data.risks.map((risk, i) => (
                    <div key={i} className="p-6 sm:flex sm:items-start sm:justify-between hover:bg-slate-50 transition-colors">
                      <div className="sm:w-1/3 mb-4 sm:mb-0 pr-4">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className={`px-2.5 py-1 rounded text-xs font-bold border uppercase shadow-sm ${getSeverityColor(risk.severity)}`}>
                            {risk.severity}
                          </span>
                        </div>
                        <p className="font-bold text-slate-800 text-base">{risk.risk}</p>
                      </div>
                      <div className="sm:w-2/3 sm:border-l border-slate-100 sm:pl-6">
                        <span className="block font-semibold text-slate-500 text-xs uppercase tracking-wide mb-1">Mitigation Strategy</span>
                        <p className="text-slate-600 text-sm leading-relaxed">{risk.mitigation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                <h2 className="text-lg font-semibold text-slate-800 mb-8 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-blue-500" />
                  Project Phases & Timeline
                </h2>
                <div className="relative border-l-2 border-indigo-100 ml-3 space-y-10">
                  {data.projectPhases.map((phase, i) => (
                    <div key={i} className="relative pl-10">
                      <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-2 border-indigo-500 shadow-sm"></div>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                        <h3 className="text-lg font-bold text-slate-800">{phase.phaseName}</h3>
                        <span className="text-sm font-semibold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                          {phase.duration}
                        </span>
                      </div>
                      <ul className="space-y-2">
                        {phase.deliverables.map((item, j) => (
                          <li key={j} className="flex items-center text-sm text-slate-600 bg-slate-50 px-3 py-2 rounded">
                              <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mr-3"></div>
                              {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="h-[calc(100vh-12rem)] animate-fade-in-up">
              <ChatAssistant rfpText={originalText} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};