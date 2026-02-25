export interface Risk {
  risk: string;
  severity: 'High' | 'Medium' | 'Low';
  mitigation: string;
}

export interface Phase {
  phaseName: string;
  duration: string;
  deliverables: string[];
}

export interface RFPAnalysis {
  projectTitle: string;
  clientName: string;
  executiveSummary: string;
  keyObjectives: string[];
  recommendedTechStack: string[];
  functionalRequirements: string[];
  risks: Risk[];
  projectPhases: Phase[];
  estimatedBudgetRange: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}