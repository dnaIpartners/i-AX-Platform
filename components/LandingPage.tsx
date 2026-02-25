import React, { useState } from 'react';
import { X, User, Lock, Loader2 } from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
    setError('');
    setUsername('');
    setPassword('');
  };

  const handleCloseModal = () => {
    setIsLoginModalOpen(false);
  };

  const handleSubmitLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }

    setIsLoading(true);
    
    // Simulate network request
    setTimeout(() => {
      if (username === 'pourlui' && password === '0907') {
        setIsLoading(false);
        onLogin();
      } else {
        setIsLoading(false);
        setError('아이디 또는 비밀번호가 올바르지 않습니다.');
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 flex flex-col overflow-x-hidden">
      {/* Navbar */}
      <nav className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-end relative">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center justify-center">
             <div className="flex items-center space-x-3">
                <span className="w-4 h-4 rounded-full bg-indigo-600 animate-pulse"></span>
                <span className="font-extrabold text-4xl text-slate-900 tracking-tight">
                  i-AX <span className="text-slate-400 font-normal">Platform</span>
                </span>
             </div>
          </div>
          <button 
            onClick={handleLoginClick}
            className="text-sm font-semibold text-white bg-indigo-600 px-5 py-2.5 rounded-full hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200"
          >
            LOG IN
          </button>
        </div>
      </nav>

      {/* Hero Section with AX Diagram */}
      <main className="flex-1 relative">
        {/* Background Gradients */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
           <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-50/50 rounded-full blur-3xl opacity-50 translate-x-1/3 -translate-y-1/4"></div>
           <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-50/50 rounded-full blur-3xl opacity-50 -translate-x-1/3 translate-y-1/4"></div>
           <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.2]"></div>
        </div>

        <div className="max-w-[1400px] mx-auto px-6 pt-12 pb-20 lg:pt-20 lg:pb-32 flex flex-col lg:flex-row items-center">
            
            {/* Left Column: Text */}
            <div className="flex-1 text-center lg:text-left z-10 lg:pr-16 mb-16 lg:mb-0">
                <div className="inline-flex items-center space-x-3 bg-white border border-slate-200 px-5 py-2 rounded-full mb-8 animate-fade-in-up shadow-sm">
                    <div className="w-2.5 h-2.5 bg-blue-600 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.5)]"></div>
                    <span className="text-slate-600 text-sm font-bold tracking-widest uppercase">IPARTNERS AX AGENCY</span>
                </div>
                
                <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.1] animate-fade-in-up delay-100">
                    DIGITAL EVOLUTION, <br/>
                    NOW <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">AI-DRIVEN.</span><br/>
                    THAT'S IPARTNERS.
                </h1>
                
                <p className="text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 mb-10 leading-relaxed animate-fade-in-up delay-200 text-justify break-keep">
                    아이파트너즈의 <span className="font-bold text-slate-900">AI 방법론은 <span className="border-b-4 border-indigo-600">{'\'AI-First\''}</span></span> 사고방식을 기반으로 웹사이트 구축의 전 과정을 재설계하여, 단순 자동화를 넘어 <span className="font-bold text-indigo-600">창의적 가치</span>와 <span className="font-bold text-indigo-600">완성도</span>를 극대화하는 제작 표준입니다.
                </p>
            </div>

            {/* Right Column: AX Diagram */}
            <div className="flex-1 relative w-full flex items-center justify-center lg:justify-end">
                <div className="relative w-[500px] h-[500px] md:w-[600px] md:h-[600px] scale-[0.8] sm:scale-100 select-none pointer-events-none">
                    
                    {/* Rotating Wireframes */}
                    <div className="absolute inset-0 border border-slate-200 rounded-sm animate-spin-slow-reverse" style={{ width: '75%', height: '75%', margin: 'auto' }}></div>
                    <div className="absolute inset-0 border border-slate-300 rounded-sm animate-spin-slow" style={{ width: '90%', height: '90%', margin: 'auto' }}></div>

                    {/* Connecting Lines (SVG) */}
                    <svg className="absolute inset-0 w-full h-full z-0 opacity-40">
                         {/* Top Right */}
                         <line x1="50%" y1="50%" x2="80%" y2="20%" stroke="#94a3b8" strokeWidth="1" strokeDasharray="6 4" />
                         {/* Right */}
                         <line x1="50%" y1="50%" x2="90%" y2="50%" stroke="#94a3b8" strokeWidth="1" strokeDasharray="6 4" />
                         {/* Bottom Right */}
                         <line x1="50%" y1="50%" x2="80%" y2="80%" stroke="#94a3b8" strokeWidth="1" strokeDasharray="6 4" />
                         {/* Bottom */}
                         <line x1="50%" y1="50%" x2="50%" y2="90%" stroke="#94a3b8" strokeWidth="1" strokeDasharray="6 4" />
                         {/* Bottom Left */}
                         <line x1="50%" y1="50%" x2="20%" y2="75%" stroke="#94a3b8" strokeWidth="1" strokeDasharray="6 4" />
                         {/* Left */}
                         <line x1="50%" y1="50%" x2="10%" y2="40%" stroke="#94a3b8" strokeWidth="1" strokeDasharray="6 4" />
                    </svg>

                    {/* Central Diamond */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-64 md:h-64 bg-gradient-to-br from-indigo-500 via-blue-600 to-purple-700 rotate-45 shadow-2xl shadow-indigo-500/40 z-20 flex items-center justify-center overflow-hidden border-4 border-white/10">
                         <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
                         <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/20"></div>
                         <span className="text-5xl md:text-6xl font-black text-white -rotate-45 tracking-widest drop-shadow-md">AX</span>
                    </div>

                    {/* Floating Nodes */}
                    
                    {/* I-CONSULTANT (Top Right) */}
                    <div className="absolute top-[15%] right-[10%] animate-float z-30">
                        <div className="bg-white border border-slate-100 shadow-xl px-4 py-2 rounded-lg flex items-center space-x-3 transition-transform hover:scale-110">
                             <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]"></div>
                             <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">I-CONSULTANT</span>
                        </div>
                    </div>

                    {/* I-CREATIVE (Right) */}
                    <div className="absolute top-[48%] right-[-5%] animate-float-delayed z-30">
                        <div className="bg-white border border-slate-100 shadow-xl px-4 py-2 rounded-lg flex items-center space-x-3 transition-transform hover:scale-110">
                             <div className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.6)]"></div>
                             <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">I-CREATIVE</span>
                        </div>
                    </div>

                    {/* I-INTELLIGENCE (Bottom Right) */}
                    <div className="absolute bottom-[15%] right-[10%] animate-float z-30">
                         <div className="bg-white border border-slate-100 shadow-xl px-4 py-2 rounded-lg flex items-center space-x-3 transition-transform hover:scale-110">
                             <div className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.6)]"></div>
                             <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">I-INTELLIGENCE</span>
                        </div>
                    </div>

                    {/* I-AUTODEV (Bottom) */}
                    <div className="absolute bottom-[5%] left-1/2 -translate-x-1/2 animate-float-delayed z-30">
                         <div className="bg-white border border-slate-100 shadow-xl px-4 py-2 rounded-lg flex items-center space-x-3 transition-transform hover:scale-110">
                             <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]"></div>
                             <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">I-AUTODEV</span>
                        </div>
                    </div>

                    {/* I-DATA (Bottom Left) */}
                    <div className="absolute bottom-[20%] left-[5%] animate-float z-30">
                         <div className="bg-white border border-slate-100 shadow-xl px-4 py-2 rounded-lg flex items-center space-x-3 transition-transform hover:scale-110">
                             <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.6)]"></div>
                             <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">I-DATA</span>
                        </div>
                    </div>

                    {/* I-SEARCH (Left) */}
                    <div className="absolute top-[35%] left-[-5%] animate-float-delayed z-30">
                         <div className="bg-white border border-slate-100 shadow-xl px-4 py-2 rounded-lg flex items-center space-x-3 transition-transform hover:scale-110">
                             <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)]"></div>
                             <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">I-SEARCH</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
      </main>
      
      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative animate-fade-in-up">
            <button 
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors p-1"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="p-8 pt-10">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl mb-4">
                  <User className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Sign In</h2>
                <p className="text-slate-500 text-sm mt-1">i-Partners 솔루션에 오신 것을 환영합니다.</p>
              </div>

              <form onSubmit={handleSubmitLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">아이디</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="text" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-900"
                      placeholder="아이디를 입력하세요"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">비밀번호</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-900"
                      placeholder="비밀번호를 입력하세요"
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg text-center font-medium border border-red-100 animate-pulse">
                    {error}
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 mt-4 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>로그인 중...</span>
                    </>
                  ) : (
                    <span>로그인</span>
                  )}
                </button>
              </form>
            </div>
            <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 text-center">
                <p className="text-xs text-slate-400">
                    계정 문의: support@ipartners.co.kr
                </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-slate-200 text-center">
         <p className="text-slate-500 text-sm">© 2026 IPARTNERS All rights reserved.</p>
      </footer>
    </div>
  );
};