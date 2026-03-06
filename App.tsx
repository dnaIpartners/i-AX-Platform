import React, { useState } from 'react';
import { Sidebar, SidebarMenuItem } from './components/Sidebar';
import { ChatPage } from './components/ChatPage';
import { OmniSearchPage } from './components/OmniSearchPage';
import { TubeInsightPage } from './components/TubeInsightPage';
import { ContentInsightPage } from './components/ContentInsightPage';
import { LandingPage } from './components/LandingPage';
import { KeySettingsModal } from './components/KeySettingsModal';

const SIDEBAR_MENU: SidebarMenuItem[] = [
  { 
    id: 'omni-search', 
    title: 'i-Omni Search', 
    output: '웹 성능 및 SEO 통합 분석 리포트',
  },
  { 
    id: 'tube-insight', 
    title: 'i-Tube Insight', 
    output: '유튜브 채널 분석 및 운영 전략',
  },
  { 
    id: 'content-insight', 
    title: 'i-Content Insight', 
    output: '콘텐츠 문맥 분석 및 개선 제안',
  },
  { 
    id: 'chat', 
    title: 'i-Chat', 
    output: '실시간 AI 답변 및 솔루션 제안',
  },
];

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeModule, setActiveModule] = useState<string>('omni-search');
  const [isKeySettingsOpen, setIsKeySettingsOpen] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveModule('omni-search');
  };

  // Helper function to render content based on active module
  const renderContent = () => {
    if (activeModule === 'chat') {
        return <ChatPage />;
    }
    if (activeModule === 'omni-search') {
        return <OmniSearchPage />;
    }
    if (activeModule === 'tube-insight') {
        return <TubeInsightPage />;
    }
    if (activeModule === 'content-insight') {
        return <ContentInsightPage />;
    }
    return null;
  };

  // Login Flow
  if (!isAuthenticated) {
    return <LandingPage onLogin={handleLogin} />;
  }

  // Main Application Flow
  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-hidden">
      
      <Sidebar 
        menuItems={SIDEBAR_MENU} 
        activeModule={activeModule} 
        onModuleChange={(id) => {
            setActiveModule(id);
        }}
        onLogoClick={() => {
            setActiveModule('omni-search');
        }}
        onLogout={handleLogout}
        onOpenSettings={() => setIsKeySettingsOpen(true)}
      />

      <main className="flex-1 h-full overflow-hidden relative">
        {renderContent()}
      </main>

      <KeySettingsModal 
        isOpen={isKeySettingsOpen} 
        onClose={() => setIsKeySettingsOpen(false)} 
      />
    </div>
  );
};

export default App;