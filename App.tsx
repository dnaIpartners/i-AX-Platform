import React, { useState } from 'react';
import { Sidebar, SidebarMenuItem } from './components/Sidebar';
import { InputSection } from './components/InputSection';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { SearchOptimizerView } from './components/SearchOptimizerView';
import { GenericModuleView } from './components/GenericModuleView';
import { ChatPage } from './components/ChatPage';
import { LandingPage } from './components/LandingPage';
import { KeySettingsModal } from './components/KeySettingsModal';
import { RFPAnalysis } from './types';
import { Layers } from 'lucide-react';

// Mock Data for demonstration purposes
const MOCK_ANALYSIS_DATA: RFPAnalysis = {
  projectTitle: "Global Logistics Platform Revamp",
  clientName: "LogiTrans Worldwide",
  executiveSummary: "LogiTrans Worldwide seeks to modernize its legacy logistics management system. The goal is to build a cloud-native web application that unifies shipment tracking, fleet management, and customer portals into a single responsive platform, improving operational efficiency by 30%.",
  keyObjectives: [
    "Migrate on-premise legacy data to a cloud-based architecture",
    "Real-time fleet tracking and IoT sensor integration",
    "Unified customer dashboard for booking and tracking",
    "Automated route optimization using AI"
  ],
  recommendedTechStack: [
    "React (Frontend)",
    "Node.js / NestJS (Backend)",
    "PostgreSQL (Database)",
    "Redis (Caching)",
    "Docker & Kubernetes",
    "AWS (IoT Core, EC2, RDS)"
  ],
  functionalRequirements: [
    "User Authentication & Role-Based Access Control (RBAC)",
    "Interactive Map Interface for Fleet Tracking",
    "Automated Quoting & Billing System",
    "Driver Mobile App API Integration",
    "Real-time Notifications (WebSockets/Push)",
    "Reporting & Analytics Dashboard"
  ],
  risks: [
    {
      risk: "Legacy Data Migration Complexity",
      severity: "High",
      mitigation: "Conduct a thorough data audit and run parallel systems during a phased rollout."
    },
    {
      risk: "IoT Device Compatibility",
      severity: "Medium",
      mitigation: "Prototype early with a subset of devices to standardize communication protocols."
    },
    {
      risk: "User Adoption of New Interface",
      severity: "Low",
      mitigation: "Provide comprehensive training modules and a simplified UI mode for legacy users."
    }
  ],
  projectPhases: [
    {
      phaseName: "Discovery & Prototyping",
      duration: "4 Weeks",
      deliverables: ["Requirements Spec", "UI/UX Wireframes", "Tech Architecture Blueprint"]
    },
    {
      phaseName: "Core Platform Development",
      duration: "12 Weeks",
      deliverables: ["User Auth", "Database Setup", "Basic Tracking Module", "API Development"]
    },
    {
      phaseName: "Advanced Features & Integration",
      duration: "8 Weeks",
      deliverables: ["Route Optimization AI", "Billing Integration", "Notification System"]
    },
    {
      phaseName: "Testing & Deployment",
      duration: "4 Weeks",
      deliverables: ["UAT", "Security Audit", "Production Launch", "Documentation"]
    }
  ],
  estimatedBudgetRange: "$200,000 - $350,000"
};

const SIDEBAR_MENU: SidebarMenuItem[] = [
  { 
    id: 'consultant', 
    title: 'i-Consultant', 
    output: 'UX 진단 보고서, 전략 컨설팅 리포트',
  },
  { 
    id: 'data', 
    title: 'i-Data Insight', 
    output: '데이터 기반 성과 분석 및 UX 개선 가이드',
  },
  { 
    id: 'intelligence', 
    title: 'i-Intelligence', 
    output: '제안서 전략 파트, 서비스 기획서',
  },
  { 
    id: 'creative', 
    title: 'i-Creative Engine', 
    output: '일관된 톤앤매너 시안, 마케팅 에셋',
  },
  { 
    id: 'autodev', 
    title: 'i-AutoDev', 
    output: 'Clean Code 검수 리포트, 퍼블리싱 가이드',
  },
  { 
    id: 'search', 
    title: 'i-Search Optimizer', 
    output: 'SEO/GEO/AEO 통합 리포트, 콘텐츠 가이드',
  },
  { 
    id: 'chat', 
    title: 'i-Chat', 
    output: '실시간 AI 답변 및 솔루션 제안',
  },
];

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeModule, setActiveModule] = useState<string>('intelligence');
  const [view, setView] = useState<'input' | 'dashboard'>('input');
  const [rfpText, setRfpText] = useState<string>('');
  const [analysisData, setAnalysisData] = useState<RFPAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isKeySettingsOpen, setIsKeySettingsOpen] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setView('input');
    setRfpText('');
    setAnalysisData(null);
    setActiveModule('intelligence');
    setError(null);
  };

  const handleAnalyze = async (text: string) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      // --- DEMO MODE: Using Mock Data instead of Live API ---
      await new Promise(resolve => setTimeout(resolve, 2000));
      const result = MOCK_ANALYSIS_DATA;
      
      setRfpText(text);
      setAnalysisData(result);
      setView('dashboard');
    } catch (err: any) {
      console.error(err);
      setError("We encountered an issue analyzing the RFP. Please ensure the API key is set and try again with valid text.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setView('input');
    setRfpText('');
    setAnalysisData(null);
    setError(null);
  };

  // Helper function to render content based on active module
  const renderContent = () => {
    if (activeModule === 'chat') {
        return <ChatPage />;
    }

    if (activeModule === 'intelligence') {
      if (view === 'input') {
        return (
          <div className="h-full overflow-y-auto">
             <div className="min-h-full flex flex-col items-center justify-center p-4">
                 <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-50 to-slate-50 -z-10"></div>
                 <InputSection onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
                 {error && (
                    <div className="mt-6 p-4 bg-red-50 text-red-600 border border-red-200 rounded-lg max-w-md text-center animate-shake text-sm mx-auto">
                        {error}
                    </div>
                 )}
             </div>
          </div>
        );
      } else if (view === 'dashboard' && analysisData) {
        return (
          <AnalysisDashboard 
            data={analysisData} 
            originalText={rfpText} 
            onReset={handleReset} 
          />
        );
      }
    }

    if (activeModule === 'search') {
      return <SearchOptimizerView />;
    }

    // Default for other modules (Consultant, Data, Creative, AutoDev)
    const currentModule = SIDEBAR_MENU.find(m => m.id === activeModule);
    if (currentModule) {
      return <GenericModuleView module={currentModule} />;
    }

    // Fallback
    return (
       <div className="flex flex-col items-center justify-center h-full p-10 text-center animate-fade-in">
         <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
            <Layers className="w-10 h-10 text-slate-400" />
         </div>
         <h2 className="text-2xl font-bold text-slate-800 mb-2">Module Not Found</h2>
      </div>
    );
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
            if (id !== 'intelligence') {
               // Logic to reset state if needed
            }
        }}
        onLogoClick={() => {
            setActiveModule('intelligence');
            handleReset();
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