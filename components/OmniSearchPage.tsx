import React, { useState } from 'react';
import { Search, CheckCircle, AlertTriangle, XCircle, Clock, Globe, Activity, Loader2 } from 'lucide-react';

// --- Types ---
type Status = 'passed' | 'warning' | 'error';

interface DetailItem {
  id: string;
  title: string;
  description: string;
  status: Status;
}

interface MetricScore {
  label: string;
  score: number;
  details: DetailItem[];
}

interface AnalysisResult {
  url: string;
  timestamp: string;
  metrics: {
    performance: MetricScore;
    accessibility: MetricScore;
    bestPractices: MetricScore;
    seo: MetricScore;
  };
}

// --- Helper Components ---
const CircularProgress = ({ score, label }: { score: number; label: string }) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let colorClass = 'text-rose-500'; // < 50
  let bgClass = 'text-rose-100';
  if (score >= 90) {
    colorClass = 'text-emerald-500';
    bgClass = 'text-emerald-100';
  } else if (score >= 50) {
    colorClass = 'text-amber-500';
    bgClass = 'text-amber-100';
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-24 h-24 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            className={bgClass}
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="50"
            cy="50"
          />
          {/* Progress circle */}
          <circle
            className={`${colorClass} transition-all duration-1000 ease-out`}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="50"
            cy="50"
          />
        </svg>
        <div className="absolute flex items-center justify-center">
          <span className={`text-2xl font-bold ${colorClass}`}>{score}</span>
        </div>
      </div>
      <span className="mt-3 text-sm font-bold text-slate-700">{label}</span>
    </div>
  );
};

const StatusIcon = ({ status }: { status: Status }) => {
  switch (status) {
    case 'passed':
      return <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />;
    case 'warning':
      return <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />;
    case 'error':
      return <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />;
  }
};

// --- Main Component ---
export const OmniSearchPage: React.FC = () => {
  const [urlInput, setUrlInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setIsAnalyzing(true);
    setResult(null);

    // Simulate network request and analysis
    setTimeout(() => {
      const mockResult: AnalysisResult = {
        url: urlInput,
        timestamp: new Date().toLocaleString('ko-KR', { 
            year: 'numeric', month: 'long', day: 'numeric', 
            hour: '2-digit', minute: '2-digit', second: '2-digit' 
        }),
        metrics: {
          performance: {
            label: '성능',
            score: 68,
            details: [
              { id: 'p1', title: '첫 콘텐츠 풀 페인트 (FCP)', description: '1.2초 (우수함) - 사용자가 화면에서 첫 번째 콘텐츠를 볼 수 있을 때까지 걸린 시간입니다.', status: 'passed' },
              { id: 'p2', title: '최대 콘텐츠 풀 페인트 (LCP)', description: '3.5초 (개선 필요) - 페이지에서 가장 큰 텍스트 블록이나 이미지 요소가 렌더링되는 데 걸린 시간입니다.', status: 'warning' },
              { id: 'p3', title: '렌더링 차단 리소스 제거', description: '스크립트 및 스타일시트가 렌더링을 지연시킵니다. 중요한 JS/CSS는 인라인으로 제공하고 나머지는 지연(defer)시키세요.', status: 'error' },
              { id: 'p4', title: '차세대 형식의 이미지 제공', description: 'WebP 및 AVIF와 같은 이미지 형식은 PNG나 JPEG보다 압축률이 높아 다운로드 속도가 빠릅니다.', status: 'warning' },
              { id: 'p5', title: '누적 레이아웃 이동 (CLS)', description: '0.05 (우수함) - 페이지가 로드되는 동안 예기치 않은 레이아웃 이동이 거의 발생하지 않았습니다.', status: 'passed' },
            ]
          },
          accessibility: {
            label: '접근성',
            score: 85,
            details: [
              { id: 'a1', title: '배경 및 전경색 대비', description: '모든 텍스트가 적절한 명도 대비를 가집니다. 시각 장애가 있는 사용자도 텍스트를 읽기 쉽습니다.', status: 'passed' },
              { id: 'a2', title: '이미지 alt 속성', description: '대부분의 이미지에 대체 텍스트가 제공됩니다. 스크린 리더 사용자가 이미지 내용을 이해할 수 있습니다.', status: 'passed' },
              { id: 'a3', title: 'ARIA 속성 유효성', description: '일부 ARIA role이 유효하지 않거나 잘못된 요소에 적용되었습니다.', status: 'warning' },
              { id: 'a4', title: '폼 요소 레이블', description: '일부 입력 폼 요소에 연결된 <label>이 없어 스크린 리더가 폼의 목적을 설명할 수 없습니다.', status: 'error' },
            ]
          },
          bestPractices: {
            label: '권장사항',
            score: 92,
            details: [
              { id: 'b1', title: 'HTTPS 사용', description: '안전한 연결을 사용 중입니다. 모든 리소스가 암호화된 채널을 통해 전송됩니다.', status: 'passed' },
              { id: 'b2', title: '안전한 교차 출처 링크', description: 'rel="noopener" 속성이 올바르게 사용되었습니다. 악의적인 페이지가 window.opener를 제어하는 것을 방지합니다.', status: 'passed' },
              { id: 'b3', title: '최신 API 사용', description: '더 이상 사용되지 않는 API가 없습니다.', status: 'passed' },
              { id: 'b4', title: '브라우저 오류 로깅', description: '콘솔에 기록된 브라우저 오류가 발견되었습니다. 네트워크 요청 실패나 JS 예외를 확인하세요.', status: 'warning' },
            ]
          },
          seo: {
            label: '검색엔진 최적화',
            score: 55,
            details: [
              { id: 's1', title: '문서에 <title> 요소 포함', description: '페이지 타이틀이 존재합니다. 검색 결과의 제목으로 사용됩니다.', status: 'passed' },
              { id: 's2', title: '메타 설명 누락', description: '검색 결과에 표시될 <meta name="description"> 태그가 없습니다. 클릭률(CTR)에 부정적인 영향을 미칠 수 있습니다.', status: 'error' },
              { id: 's3', title: '크롤링 가능한 링크', description: '일부 링크가 크롤러에 의해 추적될 수 없습니다. <a> 태그에 유효한 href 속성을 사용하세요.', status: 'warning' },
              { id: 's4', title: '모바일 친화성 (Viewport)', description: '<meta name="viewport"> 태그가 올바르게 설정되어 모바일 기기에서 화면이 적절하게 크기 조정됩니다.', status: 'passed' },
              { id: 's5', title: 'robots.txt 유효성', description: 'robots.txt 파일이 없거나 형식이 잘못되어 검색 엔진 크롤러의 접근을 제어할 수 없습니다.', status: 'error' },
              { id: 's6', title: '이미지 해상도 최적화', description: '고해상도 이미지가 모바일 환경에서 불필요하게 크게 로드되어 페이지 속도를 저하시킵니다.', status: 'warning' },
            ]
          }
        }
      };
      setResult(mockResult);
      setIsAnalyzing(false);
    }, 2500);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      {/* Header (Sticky Search Bar) */}
      <header className="flex-shrink-0 bg-white border-b border-slate-200 sticky top-0 z-20 px-6 py-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-[#001641] rounded-lg flex items-center justify-center text-white shadow-sm">
                <Globe className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-black text-[#001641] tracking-tight">i-Omni Search</h1>
        </div>
        
        <form onSubmit={handleAnalyze} className="flex-1 max-w-2xl ml-8 flex relative">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="url" 
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="분석할 웹사이트 URL을 입력하세요 (예: https://example.com)"
              className="w-full pl-12 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-[#0033FF]/20 focus:border-[#0033FF] focus:bg-white transition-all text-slate-700"
              required
            />
          </div>
          <button 
            type="submit"
            disabled={isAnalyzing || !urlInput.trim()}
            className="bg-[#0033FF] hover:bg-[#0022CC] text-white px-6 py-2.5 rounded-r-xl font-bold transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center"
          >
            {isAnalyzing ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> 분석 중...</>
            ) : (
              '분석하기'
            )}
          </button>
        </form>
      </header>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10">
        {!isAnalyzing && !result && (
          <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in text-slate-500">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
              <Search className="w-10 h-10 text-slate-300" />
            </div>
            <h2 className="text-2xl font-bold text-slate-700 mb-2">웹사이트 통합 분석</h2>
            <p className="max-w-md">상단 검색창에 URL을 입력하시면 성능, 접근성, 권장사항, SEO 지표를 종합적으로 분석해 드립니다.</p>
          </div>
        )}

        {isAnalyzing && (
          <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in">
            <Loader2 className="w-12 h-12 text-[#0033FF] animate-spin mb-6" />
            <h2 className="text-xl font-bold text-slate-700 mb-2">URL을 분석하고 있습니다...</h2>
            <p className="text-slate-500">네트워크 상태, 렌더링 성능, SEO 메타데이터를 수집 중입니다.</p>
          </div>
        )}

        {result && !isAnalyzing && (
          <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up">
            
            {/* Summary Hero */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-slate-100">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2 flex items-center">
                    <Activity className="w-6 h-6 mr-2 text-[#0033FF]" />
                    분석 요약 리포트
                  </h2>
                  <a href={result.url} target="_blank" rel="noreferrer" className="text-[#0033FF] hover:underline font-medium text-lg break-all">
                    {result.url}
                  </a>
                </div>
                <div className="mt-4 md:mt-0 flex items-center text-slate-500 text-sm bg-slate-50 px-4 py-2 rounded-lg">
                  <Clock className="w-4 h-4 mr-2" />
                  {result.timestamp}
                </div>
              </div>

              {/* Circular Progress Bars */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <CircularProgress score={result.metrics.performance.score} label={result.metrics.performance.label} />
                <CircularProgress score={result.metrics.accessibility.score} label={result.metrics.accessibility.label} />
                <CircularProgress score={result.metrics.bestPractices.score} label={result.metrics.bestPractices.label} />
                <CircularProgress score={result.metrics.seo.score} label={result.metrics.seo.label} />
              </div>
            </div>

            {/* Details List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Object.entries(result.metrics).map(([key, metric]) => (
                <div key={key} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                  <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-slate-800">{metric.label} 상세 결과</h3>
                    <span className={`font-bold text-lg ${
                      metric.score >= 90 ? 'text-emerald-500' : metric.score >= 50 ? 'text-amber-500' : 'text-rose-500'
                    }`}>
                      {metric.score}점
                    </span>
                  </div>
                  <div className="p-2 flex-1">
                    <ul className="divide-y divide-slate-100">
                      {metric.details.map((item) => (
                        <li key={item.id} className="p-4 hover:bg-slate-50 transition-colors flex items-start space-x-4 rounded-xl">
                          <div className="mt-0.5">
                            <StatusIcon status={item.status} />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-bold text-slate-800 mb-1">{item.title}</h4>
                            <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}
      </div>
    </div>
  );
};
