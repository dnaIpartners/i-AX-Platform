import React, { useState } from 'react';
import { Youtube, Search, Loader2, PlayCircle, ThumbsUp, MessageCircle, Eye, Filter, BarChart2, Sparkles } from 'lucide-react';
import { analyzeChannel, ChannelAnalysisResult, YoutubeVideo } from '../services/youtubeService';
import { YoutubeKeyModal } from './YoutubeKeyModal';
import { getYoutubeKey } from '../services/youtubeKeyService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { generateYoutubeInsight } from '../services/geminiService';
import Markdown from 'react-markdown';

export const TubeInsightPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ChannelAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  
  // Insight Report State
  const [insightReport, setInsightReport] = useState<string | null>(null);
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);
  const [insightError, setInsightError] = useState<string | null>(null);

  // Filters
  const [filterType, setFilterType] = useState<'all' | 'normal' | 'shorts'>('all');
  const [filterLang, setFilterLang] = useState<'all' | 'kr' | 'foreign'>('all');

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const key = getYoutubeKey();
    if (!key) {
      setIsKeyModalOpen(true);
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);
    setInsightReport(null);
    setInsightError(null);

    try {
      const data = await analyzeChannel(query);
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || '채널 분석 중 오류가 발생했습니다.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateInsight = async () => {
    if (!result) return;
    
    setIsGeneratingInsight(true);
    setInsightError(null);
    
    try {
      const report = await generateYoutubeInsight(result.channel, result.videos);
      setInsightReport(report);
    } catch (err: any) {
      console.error(err);
      setInsightError(err.message || '인사이트 리포트 생성 중 오류가 발생했습니다. Gemini API 키를 확인해주세요.');
    } finally {
      setIsGeneratingInsight(false);
    }
  };

  const filteredVideos = result?.videos.filter(v => {
    if (filterType === 'normal' && v.isShorts) return false;
    if (filterType === 'shorts' && !v.isShorts) return false;
    if (filterLang === 'kr' && !v.isKorean) return false;
    if (filterLang === 'foreign' && v.isKorean) return false;
    return true;
  }) || [];

  const chartData = filteredVideos.slice(0, 10).map(v => ({
    name: v.title.substring(0, 15) + '...',
    조회수: v.viewCount,
    좋아요: v.likeCount,
    댓글: v.commentCount,
  }));

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      {/* Header */}
      <header className="flex-shrink-0 bg-white border-b border-slate-200 sticky top-0 z-20 px-6 py-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white shadow-sm">
                <Youtube className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">i-Tube Insight</h1>
        </div>
        
        <form onSubmit={handleAnalyze} className="flex-1 max-w-2xl ml-8 flex relative">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="유튜브 채널명 또는 URL을 입력하세요"
              className="w-full pl-12 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:bg-white transition-all text-slate-700"
              required
            />
          </div>
          <button 
            type="submit"
            disabled={isAnalyzing || !query.trim()}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-r-xl font-bold transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center"
          >
            {isAnalyzing ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> 분석 중...</>
            ) : (
              '채널 분석'
            )}
          </button>
        </form>

        <button 
          onClick={() => setIsKeyModalOpen(true)}
          className="ml-4 px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
        >
          API 키 설정
        </button>
      </header>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10">
        {!isAnalyzing && !result && !error && (
          <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in text-slate-500">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
              <Youtube className="w-12 h-12 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-700 mb-2">유튜브 채널 컨설팅 분석</h2>
            <p className="max-w-md">채널명을 검색하여 최근 50개 영상의 조회수, 좋아요, 댓글을 분석하고 인기도 점수 및 운영 전략을 확인하세요.</p>
          </div>
        )}

        {isAnalyzing && (
          <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in">
            <Loader2 className="w-12 h-12 text-red-600 animate-spin mb-6" />
            <h2 className="text-xl font-bold text-slate-700 mb-2">채널 데이터를 수집하고 있습니다...</h2>
            <p className="text-slate-500">최근 50개 영상의 통계 및 해시태그를 분석 중입니다.</p>
          </div>
        )}

        {error && (
          <div className="max-w-2xl mx-auto mt-10 p-6 bg-rose-50 border border-rose-200 rounded-2xl text-center">
            <h3 className="text-lg font-bold text-rose-700 mb-2">분석 오류</h3>
            <p className="text-rose-600">{error}</p>
            <button 
              onClick={() => setIsKeyModalOpen(true)}
              className="mt-4 px-6 py-2 bg-white border border-rose-200 text-rose-600 rounded-lg font-medium hover:bg-rose-50 transition-colors"
            >
              API 키 확인하기
            </button>
          </div>
        )}

        {result && !isAnalyzing && (
          <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up">
            
            {/* Channel Profile */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 flex flex-col md:flex-row items-center md:items-start gap-8">
              <img 
                src={result.channel.thumbnailUrl} 
                alt={result.channel.title} 
                className="w-32 h-32 rounded-full shadow-md object-cover"
              />
              <div className="flex-1 text-center md:text-left w-full">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-4">
                  <h2 className="text-3xl font-black text-slate-900">{result.channel.title}</h2>
                  <button
                    onClick={handleGenerateInsight}
                    disabled={isGeneratingInsight}
                    className="flex items-center justify-center px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-sm disabled:bg-indigo-300 disabled:cursor-not-allowed"
                  >
                    {isGeneratingInsight ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> AI 분석 중...</>
                    ) : (
                      <><Sparkles className="w-4 h-4 mr-2" /> AI 전략 컨설팅 리포트 생성</>
                    )}
                  </button>
                </div>
                <p className="text-slate-500 text-sm mb-6 line-clamp-2">{result.channel.description}</p>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-6">
                  <div className="text-center md:text-left">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">구독자</p>
                    <p className="text-xl font-bold text-slate-800">{(result.channel.subscriberCount / 10000).toFixed(1)}만</p>
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">총 조회수</p>
                    <p className="text-xl font-bold text-slate-800">{(result.channel.viewCount / 10000).toFixed(1)}만</p>
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">영상 수</p>
                    <p className="text-xl font-bold text-slate-800">{result.channel.videoCount}개</p>
                  </div>
                  <div className="text-center md:text-left pl-6 border-l border-slate-200">
                    <p className="text-xs font-bold text-red-500 uppercase tracking-wider mb-1">채널 인기도 점수</p>
                    <p className="text-3xl font-black text-red-600">{result.popularityScore}<span className="text-lg text-slate-400 font-medium">/100</span></p>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Insight Report Section */}
            {insightError && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm">
                {insightError}
              </div>
            )}
            
            {insightReport && (
              <div className="bg-gradient-to-br from-indigo-50 to-white rounded-3xl p-8 shadow-sm border border-indigo-100 animate-fade-in-up">
                <h3 className="text-2xl font-black text-indigo-900 mb-6 flex items-center">
                  <Sparkles className="w-6 h-6 mr-2 text-indigo-600" />
                  AI 채널 분석 및 전략 컨설팅 리포트
                </h3>
                <div className="prose prose-indigo max-w-none prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-p:text-slate-700 prose-li:text-slate-700">
                  <Markdown>{insightReport}</Markdown>
                </div>
              </div>
            )}

            {/* Chart Section */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
              <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                <BarChart2 className="w-6 h-6 mr-2 text-red-500" />
                최근 영상 성과 분석 (Top 10)
              </h3>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" tick={{fontSize: 12}} tickMargin={10} />
                    <YAxis yAxisId="left" orientation="left" stroke="#ef4444" />
                    <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" />
                    <Tooltip cursor={{fill: '#F8FAFC'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                    <Legend />
                    <Bar yAxisId="left" dataKey="조회수" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <Bar yAxisId="right" dataKey="좋아요" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Video List & Filters */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                <h3 className="text-xl font-bold text-slate-800 flex items-center">
                  <PlayCircle className="w-6 h-6 mr-2 text-red-500" />
                  분석된 영상 목록 ({filteredVideos.length}개)
                </h3>
                
                <div className="flex items-center space-x-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                  <Filter className="w-4 h-4 text-slate-400 ml-2" />
                  <select 
                    value={filterType} 
                    onChange={(e) => setFilterType(e.target.value as any)}
                    className="bg-transparent text-sm font-medium text-slate-700 focus:outline-none px-2 py-1 cursor-pointer"
                  >
                    <option value="all">전체 영상</option>
                    <option value="normal">일반 영상 (3분 이상)</option>
                    <option value="shorts">쇼츠 (3분 미만)</option>
                  </select>
                  <div className="w-px h-4 bg-slate-300 mx-1"></div>
                  <select 
                    value={filterLang} 
                    onChange={(e) => setFilterLang(e.target.value as any)}
                    className="bg-transparent text-sm font-medium text-slate-700 focus:outline-none px-2 py-1 cursor-pointer"
                  >
                    <option value="all">전체 언어</option>
                    <option value="kr">한국어</option>
                    <option value="foreign">해외 언어</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {filteredVideos.map((video) => (
                  <div key={video.id} className="group rounded-2xl border border-slate-100 overflow-hidden hover:shadow-md transition-all bg-white">
                    <div className="relative aspect-video overflow-hidden bg-slate-100">
                      <img 
                        src={video.thumbnailUrl} 
                        alt={video.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded-md backdrop-blur-sm">
                        {video.isShorts ? 'Shorts' : 'Video'}
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-slate-800 text-sm line-clamp-2 mb-3 leading-snug group-hover:text-red-600 transition-colors">
                        {video.title}
                      </h4>
                      <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                        <div className="flex items-center space-x-3">
                          <span className="flex items-center"><Eye className="w-3.5 h-3.5 mr-1" /> {(video.viewCount / 10000).toFixed(1)}만</span>
                          <span className="flex items-center"><ThumbsUp className="w-3.5 h-3.5 mr-1" /> {video.likeCount}</span>
                          <span className="flex items-center"><MessageCircle className="w-3.5 h-3.5 mr-1" /> {video.commentCount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredVideos.length === 0 && (
                  <div className="col-span-full py-12 text-center text-slate-500">
                    조건에 맞는 영상이 없습니다.
                  </div>
                )}
              </div>
            </div>

          </div>
        )}
      </div>

      <YoutubeKeyModal isOpen={isKeyModalOpen} onClose={() => setIsKeyModalOpen(false)} />
    </div>
  );
};
