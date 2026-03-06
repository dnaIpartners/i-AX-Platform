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
    <div className="min-h-screen bg-[#000510] font-sans text-[#E2E2E2] selection:bg-[#0033FF]/30 selection:text-white flex flex-col overflow-x-hidden relative">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Deep background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#000000] via-[#000510] to-[#001641]"></div>
        
        {/* Star Particles */}
        <div className="absolute inset-0 opacity-40">
           <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at center, #E2E2E2 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
           <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at center, #E2E2E2 1.5px, transparent 1.5px)', backgroundSize: '150px 150px', transform: 'translate(30px, 30px)', opacity: 0.5 }}></div>
        </div>

        {/* Complex Blue Particle Sphere Simulation */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] md:w-[1200px] md:h-[1200px] opacity-80 mix-blend-screen flex items-center justify-center pointer-events-none">
            {/* Core Glow */}
            <div className="absolute w-[400px] h-[400px] bg-[#0033FF] rounded-full blur-[150px] opacity-30 animate-pulse"></div>
            
            {/* Concentric dotted rings to simulate the 3D wave */}
            <div className="absolute w-full h-full animate-spin-slow" style={{ perspective: '1000px' }}>
                {[...Array(20)].map((_, i) => (
                    <div 
                        key={`ring1-${i}`}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#0033FF]"
                        style={{
                            width: `${100 - i * 4}%`,
                            height: `${100 - i * 4}%`,
                            borderStyle: 'dotted',
                            borderWidth: '3px',
                            transform: `translate(-50%, -50%) rotateX(${60 + i * 1.5}deg) rotateY(${i * 3}deg) translateZ(${i * 10}px)`,
                            opacity: 0.1 + (i * 0.04),
                            boxShadow: '0 0 10px rgba(0, 51, 255, 0.5)'
                        }}
                    ></div>
                ))}
            </div>
            <div className="absolute w-[90%] h-[90%] animate-spin-slow-reverse" style={{ perspective: '1000px' }}>
                {[...Array(15)].map((_, i) => (
                    <div 
                        key={`ring2-${i}`}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#0033FF]"
                        style={{
                            width: `${100 - i * 5}%`,
                            height: `${100 - i * 5}%`,
                            borderStyle: 'dashed',
                            borderWidth: '2px',
                            transform: `translate(-50%, -50%) rotateX(${40 + i * 2}deg) rotateY(${-i * 4}deg) translateZ(${-i * 5}px)`,
                            opacity: 0.2 + (i * 0.05),
                            boxShadow: '0 0 8px rgba(0, 51, 255, 0.4)'
                        }}
                    ></div>
                ))}
            </div>
        </div>
      </div>

      {/* Navbar */}
      <nav className="border-b border-white/5 bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between relative">
          <div className="flex items-center space-x-3">
            <span className="w-3 h-3 rounded-full bg-[#0033FF] animate-pulse shadow-[0_0_10px_rgba(0,51,255,0.8)]"></span>
            <span className="font-extrabold text-2xl text-[#E2E2E2] tracking-tight">
              i-PIE <span className="text-[#E2E2E2]/50 font-normal">AX Platform</span>
            </span>
          </div>
          <button 
            onClick={handleLoginClick}
            className="text-sm font-semibold text-[#E2E2E2] bg-white/5 border border-white/10 px-5 py-2 rounded-full hover:bg-[#0033FF]/20 hover:border-[#0033FF]/50 transition-all"
          >
            LOG IN
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 relative flex flex-col items-center justify-center px-6 z-10 py-20 min-h-[calc(100vh-64px)]">
        <div className="w-full max-w-6xl mx-auto relative flex-1 flex flex-col justify-center text-center md:text-left">
          
          <div className="z-20 mt-10 md:mt-0 relative">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-[#E2E2E2] tracking-tight leading-[1.3] mb-8 animate-fade-in-up drop-shadow-2xl" style={{ wordBreak: 'keep-all' }}>
              AI는 사람을 대신하는 것이 아니라,<br />
              <span className="text-[#3366FF] drop-shadow-[0_0_25px_rgba(0,51,255,0.8)]">
                역량을 한 단계 위로
              </span><br />
              끌어올리는 것입니다.
            </h1>
            
            <p className="text-xl md:text-2xl text-[#E2E2E2]/90 font-medium tracking-wide animate-fade-in-up delay-100 mt-6" style={{ wordBreak: 'keep-all' }}>
              1년차가 5년차의 시야를 갖고, 5년차가 10년차의 깊이를 갖습니다.
            </p>

            <div className="mt-16 animate-fade-in-up delay-200 flex justify-center md:justify-start">
              <button 
                onClick={handleLoginClick} 
                className="group relative inline-flex items-center justify-center px-10 py-4 font-bold text-lg text-white bg-[#0033FF] rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(0,51,255,0.6)] border border-[#0033FF]/50"
              >
                <span className="relative z-10 flex items-center">
                  플랫폼 시작하기
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
                <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
              </button>
            </div>
          </div>
        </div>
      </main>
      
      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#000510] border border-[#0033FF]/20 rounded-3xl shadow-[0_0_50px_rgba(0,51,255,0.15)] w-full max-w-md overflow-hidden relative animate-fade-in-up">
            <button 
              onClick={handleCloseModal}
              className="absolute top-5 right-5 text-[#E2E2E2]/40 hover:text-[#E2E2E2] transition-colors p-1 bg-white/5 rounded-full hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="p-8 pt-12">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-[#0033FF]/10 text-[#0033FF] rounded-2xl mb-5 border border-[#0033FF]/20 shadow-[0_0_20px_rgba(0,51,255,0.2)]">
                  <User className="w-7 h-7" />
                </div>
                <h2 className="text-3xl font-bold text-[#E2E2E2] tracking-tight">Sign In</h2>
                <p className="text-[#E2E2E2]/50 text-sm mt-2">i-PIE AX 플랫폼에 오신 것을 환영합니다.</p>
              </div>

              <form onSubmit={handleSubmitLogin} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-[#E2E2E2]/70 mb-2">아이디</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#E2E2E2]/30" />
                    <input 
                      type="text" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-black/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0033FF]/50 focus:border-[#0033FF] transition-all font-medium text-[#E2E2E2] placeholder-[#E2E2E2]/20"
                      placeholder="아이디를 입력하세요"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#E2E2E2]/70 mb-2">비밀번호</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#E2E2E2]/30" />
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-black/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0033FF]/50 focus:border-[#0033FF] transition-all font-medium text-[#E2E2E2] placeholder-[#E2E2E2]/20"
                      placeholder="비밀번호를 입력하세요"
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-500/10 text-red-400 text-sm p-3.5 rounded-xl text-center font-medium border border-red-500/20 animate-pulse">
                    {error}
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#0033FF] text-white font-bold py-4 rounded-xl hover:bg-[#0022CC] transition-all shadow-[0_0_20px_rgba(0,51,255,0.4)] hover:shadow-[0_0_30px_rgba(0,51,255,0.6)] mt-6 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
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
            <div className="bg-white/5 px-8 py-5 border-t border-white/5 text-center">
                <p className="text-xs text-[#E2E2E2]/40">
                    계정 문의: support@ipartners.co.kr
                </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-transparent py-8 text-center relative z-10 border-t border-white/5">
         <p className="text-[#E2E2E2]/30 text-xs">© 2026 IPARTNERS All rights reserved.</p>
      </footer>
    </div>
  );
};
