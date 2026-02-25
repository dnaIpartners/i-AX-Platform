import React, { useState, useRef } from 'react';
import { Upload, FileText, Loader2, Sparkles, X, AlertCircle } from 'lucide-react';

interface InputSectionProps {
  onAnalyze: (text: string) => void;
  isAnalyzing: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({ onAnalyze, isAnalyzing }) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (selectedFile: File) => {
    setError(null);
    // Limit file size to 5MB for this demo
    if (selectedFile.size > 5 * 1024 * 1024) {
        setError("파일 크기는 5MB를 초과할 수 없습니다.");
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const text = e.target?.result as string;
        if (!text || !text.trim()) {
            setError("파일이 비어있거나 읽을 수 없습니다.");
            return;
        }
        setFile(selectedFile);
        setFileContent(text);
    };
    reader.onerror = () => {
        setError("파일을 읽는 중 오류가 발생했습니다.");
    };
    
    // Attempt to read as text.
    reader.readAsText(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
          processFile(e.target.files[0]);
      }
  };

  const removeFile = (e: React.MouseEvent) => {
      e.stopPropagation();
      setFile(null);
      setFileContent('');
      setError(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 animate-fade-in flex flex-col justify-center h-full">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">
          i-Partners <span className="text-indigo-600">RFP AI 분석</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          제안요청서(RFP) 파일을 업로드해 주세요. AI가 핵심 요구사항을 분석하고 리스크를 진단하여 최적의 기술 스택을 제안합니다.
        </p>
      </div>

      <div 
        className={`
          relative group cursor-pointer
          rounded-2xl border-2 border-dashed transition-all duration-300
          ${isDragging 
            ? 'border-indigo-500 bg-indigo-50/50' 
            : file 
                ? 'border-indigo-200 bg-white'
                : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'
          }
          ${isAnalyzing ? 'pointer-events-none opacity-50' : ''}
          min-h-[300px] flex flex-col items-center justify-center p-8
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !file && fileInputRef.current?.click()}
      >
        <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            accept=".txt,.md,.json,.csv"
            onChange={handleFileInput}
        />

        {file ? (
            <div className="w-full max-w-md bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-center justify-between shadow-sm" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center space-x-4 overflow-hidden">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0 text-indigo-600">
                        <FileText className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">{file.name}</p>
                        <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                </div>
                <button 
                    onClick={removeFile}
                    className="p-2 hover:bg-white rounded-full text-slate-400 hover:text-red-500 transition-colors"
                    title="파일 삭제"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
        ) : (
            <>
                <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Upload className="w-10 h-10 text-indigo-500" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">
                    클릭하여 업로드하거나 파일을 드래그하세요
                </h3>
                <p className="text-slate-500 text-sm max-w-xs text-center leading-relaxed">
                    텍스트 기반 파일 지원 (TXT, MD, JSON)
                    <br/><span className="text-xs opacity-75">(PDF/DOCX 지원 예정)</span>
                </p>
            </>
        )}
      </div>
      
      {error && (
          <div className="mt-4 flex items-center justify-center space-x-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg animate-fade-in">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
          </div>
      )}

      <div className="mt-8 flex justify-center">
        <button
          onClick={() => onAnalyze(fileContent)}
          disabled={!file || isAnalyzing || !!error}
          className={`
            flex items-center space-x-3 px-8 py-4 rounded-full font-semibold text-lg transition-all transform shadow-xl
            ${!file || isAnalyzing || !!error
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105 hover:shadow-indigo-500/30'
            }
          `}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>문서 분석 중...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-6 h-6" />
              <span>분석 시작</span>
            </>
          )}
        </button>
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-center text-slate-500 text-sm">
        <div className="p-5 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <strong className="block text-slate-800 mb-2 text-base">요구사항 자동 추출</strong>
          핵심 산출물과 프로젝트 목표를 자동으로 식별합니다.
        </div>
        <div className="p-5 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <strong className="block text-slate-800 mb-2 text-base">리스크 진단</strong>
          잠재적인 일정 지연 및 모호한 요구사항을 감지합니다.
        </div>
        <div className="p-5 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <strong className="block text-slate-800 mb-2 text-base">기술 스택 제안</strong>
          프로젝트 범위에 기반한 최적의 기술을 제안합니다.
        </div>
      </div>
    </div>
  );
};