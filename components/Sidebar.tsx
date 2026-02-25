import React from 'react';
import { Circle, LogOut } from 'lucide-react';

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
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ menuItems, activeModule, onModuleChange, onLogoClick, onLogout }) => {
  return (
    <aside className="w-80 bg-white border-r border-slate-200 flex flex-col flex-shrink-0 z-20 shadow-sm h-full font-sans">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
            <div 
              onClick={onLogoClick} 
              className="text-2xl font-black text-slate-900 tracking-tighter cursor-pointer select-none"
            >
              IPARTNERS
            </div>
            <button
                onClick={onLogout}
                title="초기 화면으로 이동 (로그아웃)"
                className="p-2 -mr-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
            >
                <LogOut className="w-5 h-5" />
            </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = activeModule === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => onModuleChange(item.id)}
                    className={`w-full text-left px-6 py-4 transition-all relative group
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
                        <Circle className={`w-2.5 h-2.5 mr-2 fill-current ${isActive ? 'text-indigo-600' : 'text-slate-300'}`} />
                        <span className={`font-bold text-lg ${isActive ? 'text-slate-900' : 'text-slate-600'}`}>
                            {item.title}
                        </span>
                    </div>
                    <div className="pl-5">
                         <p className={`text-xs ${isActive ? 'text-indigo-600' : 'text-purple-600'} font-medium`}>
                            Output : <span className="text-slate-500 font-normal">{item.output}</span>
                         </p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex-shrink-0">
            <p className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">TARGET:</p>
            <p className="text-sm text-slate-600 font-medium">전문 수행 조직</p>
            <p className="text-xs text-slate-400">(Productivity & Quality)</p>
        </div>
      </aside>
  );
};