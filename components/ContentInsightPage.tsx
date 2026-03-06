import React, { useState, useEffect } from 'react';
import { FileText, Link as LinkIcon, Sparkles, CheckCircle2, Target, Activity, MessageSquare, Hash, Loader2, AlertCircle } from 'lucide-react';
import { analyzeContentInsight } from '../services/geminiService';

interface ContentInsightResult {
  tldr: string;
  keywords: string[];
  toneAndManner: string;
  readability: {
    score: number;
    analysis: string;
  };
  targetAudience: string[];
  actionableInsights: {
    title: string;
    description: string;
    priority: string;
  }[];
}

export const ContentInsightPage: React.FC = () => {
  const [inputType, setInputType] = useState<'url' | 'text'>('url');
  const [inputValue, setInputValue] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ContentInsightResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Loading animation states
  const loadingTexts = [
    "콘텐츠를 수집하고 있습니다...",
    "문맥과 톤앤매너를 분석 중입니다...",
    "핵심 키워드를 추출하고 있습니다...",
    "가독성 및 타깃 독자를 평가 중입니다...",
    "개선 제안 리포트를 작성 중입니다..."
  ];
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAnalyzing) {
      interval = setInterval(() => {
        setLoadingTextIndex((prev) => (prev + 1) % loadingTexts.length);
      }, 2000);
    } else {
      setLoadingTextIndex(0);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const handleAnalyze = async () => {
    if (!inputValue.trim()) return;

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeContentInsight(inputType, inputValue);
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || '콘텐츠 분석 중 오류가 발생했습니다. Gemini API 키를 확인해주세요.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      {/* Header */}
      <header className="flex-shrink-0 bg-white border-b border-slate-200 sticky top-0 z-20 px-6 py-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center text-white shadow-sm">
                <FileText className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">i-Content Insight</h1>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 md:p-10">
        <div className="max-w-5xl mx-auto space-y-8">
          
          {/* Input Section */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
            <div className="flex items-center space-x-4 mb-6">
              <button
                onClick={() => { setInputType('url'); setInputValue(''); setResult(null); setError(null); }}
                className={`px-6 py-2.5 rounded-xl font-bold transition-all flex items-center ${
                  inputType === 'url' 
                    ? 'bg-violet-100 text-violet-700' 
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
              >
                <LinkIcon className="w-4 h-4 mr-2" /> URL 입력
              </button>
              <button
                onClick={() => { setInputType('text'); setInputValue(''); setResult(null); setError(null); }}
                className={`px-6 py-2.5 rounded-xl font-bold transition-all flex items-center ${
                  inputType === 'text' 
                    ? 'bg-violet-100 text-violet-700' 
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
              >
                <FileText className="w-4 h-4 mr-2" /> 텍스트 직접 입력
              </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                {inputType === 'url' ? (
                  <input
                    type="url"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="분석할 콘텐츠의 URL을 입력하세요 (예: https://example.com/article)"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all text-slate-700"
                  />
                ) : (
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="분석할 텍스트를 여기에 붙여넣으세요..."
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all text-slate-700 min-h-[160px] resize-y"
                  />
                )}
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !inputValue.trim()}
                  className="w-full md:w-auto h-14 px-8 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl font-bold transition-all shadow-sm disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isAnalyzing ? (
                    <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> 분석 중</>
                  ) : (
                    <><Sparkles className="w-5 h-5 mr-2" /> 분석 시작</>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl flex items-start space-x-3 animate-fade-in">
              <AlertCircle className="w-6 h-6 text-rose-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-rose-800 font-bold mb-1">분석 오류</h3>
                <p className="text-rose-600 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isAnalyzing && (
            <div className="py-20 flex flex-col items-center justify-center text-center animate-fade-in">
              <div className="relative w-20 h-20 mb-8">
                <div className="absolute inset-0 border-4 border-violet-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-violet-600 rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-violet-600 animate-pulse" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">AI가 콘텐츠를 심층 분석하고 있습니다</h2>
              <p className="text-violet-600 font-medium animate-pulse h-6">{loadingTexts[loadingTextIndex]}</p>
            </div>
          )}

          {/* Result State */}
          {result && !isAnalyzing && (
            <div className="space-y-8 animate-fade-in-up">
              
              {/* Executive Summary (TL;DR) */}
              <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-3xl p-8 shadow-lg text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 opacity-10">
                  <Sparkles className="w-64 h-64" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold tracking-wider uppercase backdrop-blur-sm">
                      Executive Summary
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold leading-snug mb-6">
                    {result.tldr}
                  </h2>
                  
                  {/* Keywords */}
                  <div className="flex flex-wrap gap-2">
                    {result.keywords.map((keyword, idx) => (
                      <span key={idx} className="px-4 py-1.5 bg-white/10 hover:bg-white/20 transition-colors rounded-full text-sm font-medium flex items-center backdrop-blur-sm border border-white/10">
                        <Hash className="w-3.5 h-3.5 mr-1 opacity-70" />
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Deep Analysis Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Tone & Manner */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 flex flex-col">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">글의 톤앤매너</h3>
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-2xl font-black text-slate-900 text-center bg-blue-50 px-6 py-4 rounded-2xl border border-blue-100 w-full">
                      "{result.toneAndManner}"
                    </p>
                  </div>
                </div>

                {/* Readability */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 flex flex-col">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                      <Activity className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">가독성 점수 및 분석</h3>
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-4xl font-black text-slate-900">{result.readability.score}</span>
                      <span className="text-sm font-bold text-slate-400 mb-1">/ 100</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden relative mb-4">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${
                          result.readability.score >= 80 ? 'bg-emerald-500' : 
                          result.readability.score >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${result.readability.score}%` }}
                      ></div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-sm text-slate-600 leading-relaxed font-medium">
                        {result.readability.analysis}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Target Audience */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
                      <Target className="w-5 h-5 text-orange-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">주요 타깃 독자층</h3>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {result.targetAudience.map((target, idx) => (
                      <div key={idx} className="px-5 py-3 bg-orange-50 border border-orange-100 rounded-xl text-orange-800 font-bold text-sm flex items-center">
                        <div className="w-2 h-2 rounded-full bg-orange-400 mr-2"></div>
                        {target}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actionable Insights */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 md:col-span-2">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-violet-50 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-violet-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">콘텐츠 개선 제안 (Actionable Insights)</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.actionableInsights.map((insight, idx) => (
                      <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-violet-300 hover:shadow-md transition-all group">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-bold text-slate-800 flex items-center">
                            <CheckCircle2 className="w-5 h-5 text-violet-500 mr-2" />
                            {insight.title}
                          </h4>
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                            insight.priority === '높음' ? 'bg-rose-100 text-rose-700' :
                            insight.priority === '중간' ? 'bg-amber-100 text-amber-700' :
                            'bg-emerald-100 text-emerald-700'
                          }`}>
                            {insight.priority}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed group-hover:text-slate-700">
                          {insight.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
