import React from 'react';
import { Circle, Settings } from 'lucide-react';

export interface SidebarMenuItem {
  id: string;
  title: string;
  output: string;
  color?: string;
}

interface SidebarProps {
  menuItems: SidebarMenuItem[];
  activeModule: string;
  onModuleChange: (id: string) => void;
  onLogoClick?: () => void;
  onOpenSettings?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ menuItems, activeModule, onModuleChange, onLogoClick, onOpenSettings }) => {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col flex-shrink-0 z-20 shadow-sm h-full font-sans">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
            <div 
              onClick={onLogoClick} 
              className="text-2xl font-black tracking-tighter cursor-pointer select-none flex items-center"
              style={{ color: '#001641' }}
            >
              NX Agent
            </div>
            <div className="flex items-center space-x-1">
                <button
                    onClick={onOpenSettings}
                    title="API Key 관리"
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all"
                >
                    <Settings className="w-4 h-4" />
                </button>
            </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-3">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = activeModule === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => onModuleChange(item.id)}
                    className={`w-full text-left px-5 py-3 transition-all relative group
                      ${isActive 
                        ? 'bg-indigo-50/60' 
                        : 'hover:bg-slate-50'
                      }
                    `}
                  >
                    {isActive && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 rounded-r-full" />
                    )}
                    <div className="flex items-center mb-1">
                        <Circle className={`w-2 h-2 mr-2 fill-current ${isActive ? 'text-indigo-600' : 'text-slate-300'}`} />
                        <span className={`font-bold text-base ${isActive ? 'text-slate-900' : 'text-slate-600'}`}>
                            {item.title}
                        </span>
                    </div>
                    <div className="pl-4">
                         <p className={`text-[10px] ${isActive ? 'text-indigo-600' : 'text-purple-600'} font-medium leading-tight`}>
                            Output : <span className="text-slate-500 font-normal">{item.output}</span>
                         </p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex-shrink-0">
            <p className="text-[10px] font-bold text-slate-900 uppercase tracking-wide mb-1">TARGET:</p>
            <p className="text-xs text-slate-600 font-medium">Next Experience Lab</p>
        </div>
      </aside>
  );
};