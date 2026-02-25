import React, { useState } from 'react';
import { SidebarMenuItem } from './Sidebar';
import { Upload, FileText, Loader2, PlayCircle, BarChart2, Palette, Code, Briefcase } from 'lucide-react';

interface GenericModuleViewProps {
  module: SidebarMenuItem;
}

export const GenericModuleView: React.FC<GenericModuleViewProps> = ({ module }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const getIcon = () => {
    switch(module.id) {
      case 'consultant': return <Briefcase className="w-10 h-10 text-white" />;
      case 'data': return <BarChart2 className="w-10 h-10 text-white" />;
      case 'creative': return <Palette className="w-10 h-10 text-white" />;
      case 'autodev': return <Code className="w-10 h-10 text-white" />;
      default: return <FileText className="w-10 h-10 text-white" />;
    }
  };

  const getColor = () => {
     // returning tailwind classes for background
     switch(module.id) {
      case 'consultant': return 'bg-blue-600';
      case 'data': return 'bg-cyan-600';
      case 'creative': return 'bg-pink-600';
      case 'autodev': return 'bg-slate-800';
      default: return 'bg-indigo-600';
    }
  };

  const handleProcess = () => {
    setIsProcessing(true);
    setTimeout(() => {
        setIsProcessing(false);
        setIsFinished(true);
    }, 2000);
  };

  const reset = () => {
      setFile(null);
      setIsFinished(false);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-slate-50 animate-fade-in">
      {!isFinished ? (
        <div className="max-w-2xl w-full text-center">
            <div className={`w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg ${getColor()}`}>
                {getIcon()}
            </div>
            
            <h2 className="text-3xl font-bold text-slate-900 mb-2">{module.title}</h2>
            <p className="text-lg text-slate-600 mb-8">{module.output} 생성을 위한 파일을 업로드하세요.</p>
            
            <div className="border-2 border-dashed border-slate-300 rounded-xl bg-white p-10 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all cursor-pointer group"
                 onClick={() => !file && document.getElementById('module-file-upload')?.click()}
            >
                <input 
                    type="file" 
                    id="module-file-upload" 
                    className="hidden" 
                    onChange={(e) => e.target.files && setFile(e.target.files[0])} 
                />
                
                {file ? (
                    <div className="flex flex-col items-center">
                        <FileText className="w-12 h-12 text-indigo-600 mb-4" />
                        <p className="font-semibold text-slate-800 text-lg mb-1">{file.name}</p>
                        <p className="text-slate-500">{(file.size/1024).toFixed(1)} KB</p>
                        <button 
                            onClick={(e) => { e.stopPropagation(); setFile(null); }}
                            className="mt-4 text-red-500 text-sm hover:underline"
                        >
                            삭제
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center">
                        <Upload className="w-12 h-12 text-slate-300 group-hover:text-indigo-500 mb-4 transition-colors" />
                        <p className="font-semibold text-slate-700 text-lg">파일 선택 또는 드래그 앤 드롭</p>
                        <p className="text-slate-400 text-sm mt-2">관련 문서, 데이터 또는 에셋 파일</p>
                    </div>
                )}
            </div>

            <div className="mt-8">
                <button 
                    onClick={handleProcess}
                    disabled={!file || isProcessing}
                    className={`
                        px-10 py-4 rounded-full font-bold text-lg shadow-xl transition-all
                        ${!file || isProcessing 
                            ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                            : `${getColor()} text-white hover:opacity-90 hover:scale-105`
                        }
                    `}
                >
                    {isProcessing ? (
                        <div className="flex items-center space-x-2">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>분석 진행 중...</span>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-2">
                            <PlayCircle className="w-5 h-5" />
                            <span>솔루션 실행</span>
                        </div>
                    )}
                </button>
            </div>
        </div>
      ) : (
        <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-fade-in-up">
             <div className={`${getColor()} p-6 text-white flex items-center justify-between`}>
                 <div className="flex items-center space-x-4">
                     {getIcon()}
                     <div>
                         <h2 className="text-2xl font-bold">{module.title} Result</h2>
                         <p className="opacity-90 text-sm">Analysis Complete</p>
                     </div>
                 </div>
                 <button onClick={reset} className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm backdrop-blur-sm transition-colors">
                     새로운 분석
                 </button>
             </div>
             <div className="p-10 text-center">
                 <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full text-green-600 mb-6">
                     <FileText className="w-8 h-8" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-800 mb-2">결과물이 생성되었습니다</h3>
                 <p className="text-slate-600 mb-8">
                     {module.output}에 대한 분석이 완료되었습니다.<br/>
                     아래 버튼을 통해 상세 리포트를 다운로드하거나 확인하세요.
                 </p>
                 <div className="flex justify-center gap-4">
                     <button className="px-6 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 font-medium text-slate-700">
                         미리보기
                     </button>
                     <button className={`px-6 py-2 rounded-lg text-white font-medium ${getColor()}`}>
                         다운로드 (.PDF)
                     </button>
                 </div>
             </div>
        </div>
      )}
    </div>
  );
};