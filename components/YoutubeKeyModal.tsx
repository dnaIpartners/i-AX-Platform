import React, { useState, useEffect } from 'react';
import { Key, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { saveYoutubeKey, getYoutubeKey, removeYoutubeKey, testYoutubeKey } from '../services/youtubeKeyService';

interface YoutubeKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const YoutubeKeyModal: React.FC<YoutubeKeyModalProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      const savedKey = getYoutubeKey();
      if (savedKey) {
        setApiKey(savedKey);
        setStatus('success');
        setMessage('저장된 API 키가 있습니다.');
      } else {
        setApiKey('');
        setStatus('idle');
        setMessage('');
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestAndSave = async () => {
    if (!apiKey.trim()) {
      setStatus('error');
      setMessage('API 키를 입력해주세요.');
      return;
    }

    setIsTesting(true);
    setStatus('idle');
    setMessage('');

    const isValid = await testYoutubeKey(apiKey);
    setIsTesting(false);

    if (isValid) {
      saveYoutubeKey(apiKey);
      setStatus('success');
      setMessage('연결 테스트 성공! 키가 로컬에 암호화되어 저장되었습니다.');
      setTimeout(() => {
        onClose();
      }, 2000);
    } else {
      setStatus('error');
      setMessage('유효하지 않은 API 키이거나 네트워크 오류입니다.');
    }
  };

  const handleRemove = () => {
    removeYoutubeKey();
    setApiKey('');
    setStatus('idle');
    setMessage('API 키가 삭제되었습니다.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-scale-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <Key className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-bold text-slate-800">YouTube API Key 설정</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          <p className="text-sm text-slate-600 mb-4">
            i-Tube Insight를 사용하려면 Google Cloud Console에서 발급받은 YouTube Data API v3 키가 필요합니다. 입력하신 키는 브라우저 로컬 스토리지에 암호화되어 안전하게 저장됩니다.
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">API Key</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-mono text-sm"
              />
            </div>

            {status !== 'idle' && (
              <div className={`flex items-center space-x-2 text-sm p-3 rounded-lg ${
                status === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}>
                {status === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span>{message}</span>
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
          <button
            onClick={handleRemove}
            className="text-sm text-slate-500 hover:text-rose-600 font-medium transition-colors"
          >
            키 삭제
          </button>
          <div className="space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleTestAndSave}
              disabled={isTesting || !apiKey.trim()}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center"
            >
              {isTesting ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> 테스트 중...</>
              ) : (
                '연결 테스트 및 저장'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
