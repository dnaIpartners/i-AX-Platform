import React, { useState } from 'react';
import { Globe, Search, ArrowRight, Loader2, Gauge, Smartphone, Monitor, CheckCircle, AlertTriangle } from 'lucide-react';

export const SearchOptimizerView: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!url) return;
    setIsAnalyzing(true);
    
    // Mock API call simulation
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    setResult({
      scores: {
        performance: 82,
        accessibility: 95,
        bestPractices: 88,
        seo: 92
      },
      issues: [
        { type: 'error', text: '이미지 태그에 alt 속성이 누락되었습니다 (3건)' },
        { type: 'warning', text: '사용하지 않는 JavaScript가 로딩 시간을 지연시킵니다' },
        { type: 'success', text: 'HTTPS가 올바르게 적용되었습니다' }
      ],
      keywords: ['물류 플랫폼', '배송 추적', '클라우드 시스템', 'SCM']
    });
    
    setIsAnalyzing(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 border-green-500';
    if (score >= 50) return 'text-amber-500 border-amber-500';
    return 'text-red-500 border-red-500';
  };

  return (
    <div className="h-full overflow-y-auto p-8 animate-fade-in bg-slate-50">
      <div className="max-w-4xl mx-auto">
        
        {/* Input Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-2xl mb-4 text-purple-600">
            <Globe className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">i-Search Optimizer</h2>
          <p className="text-slate-500 mb-8">분석할 웹사이트 URL을 입력하여 SEO, 성능, 접근성을 진단하세요.</p>
          
          <div className="flex max-w-2xl mx-auto shadow-lg rounded-full overflow-hidden border border-slate-200 bg-white p-1">
            <input 
              type="url" 
              placeholder="https://www.example.com" 
              className="flex-1 px-6 py-3 outline-none text-slate-700 placeholder:text-slate-400"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
            />
            <button 
              onClick={handleAnalyze}
              disabled={!url || isAnalyzing}
              className="bg-purple-600 text-white px-8 py-3 rounded-full font-medium hover:bg-purple-700 transition-colors disabled:bg-slate-300 flex items-center"
            >
              {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Search className="w-4 h-4 mr-2" /> 분석</>}
            </button>
          </div>
        </div>

        {/* Result Section */}
        {result && (
          <div className="animate-fade-in-up space-y-6">
            {/* Score Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(result.scores).map(([key, score]: [string, any]) => (
                <div key={key} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center relative overflow-hidden">
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">{key}</h3>
                  <div className={`text-4xl font-bold ${getScoreColor(score)}`}>
                    {score}
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 mt-4 rounded-full overflow-hidden">
                     <div className={`h-full ${score >= 90 ? 'bg-green-500' : score >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${score}%` }}></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Detailed Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                  <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center">
                    <Gauge className="w-5 h-5 mr-2 text-slate-500" /> 진단 상세 리포트
                  </h3>
                  <div className="space-y-3">
                    {result.issues.map((issue: any, idx: number) => (
                      <div key={idx} className="flex items-start p-3 rounded-lg bg-slate-50">
                         {issue.type === 'error' && <AlertTriangle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />}
                         {issue.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-500 mr-3 mt-0.5 flex-shrink-0" />}
                         {issue.type === 'success' && <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />}
                         <span className="text-slate-700 text-sm">{issue.text}</span>
                      </div>
                    ))}
                  </div>
               </div>

               <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                  <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center">
                    <Search className="w-5 h-5 mr-2 text-slate-500" /> 감지된 키워드
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.keywords.map((kw: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium">
                        #{kw}
                      </span>
                    ))}
                  </div>
               </div>
            </div>
            
            <div className="flex justify-center mt-8">
               <div className="bg-slate-800 text-white rounded-xl p-4 flex items-center space-x-8">
                  <div className="text-center">
                     <Monitor className="w-6 h-6 mx-auto mb-1 text-slate-400" />
                     <span className="text-xs text-slate-400">Desktop</span>
                  </div>
                  <div className="h-8 w-px bg-slate-600"></div>
                  <div className="text-center">
                     <Smartphone className="w-6 h-6 mx-auto mb-1 text-green-400" />
                     <span className="text-xs text-green-400">Mobile Optimized</span>
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};