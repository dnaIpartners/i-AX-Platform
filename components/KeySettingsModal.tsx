
import React, { useState, useEffect } from 'react';
import { X, Key, Download, Upload, ShieldCheck, AlertCircle } from 'lucide-react';
import { ApiKeys, getStoredKeys, saveKeys, exportKeysToFile, importKeysFromFile } from '../services/keyService';

interface KeySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeySettingsModal: React.FC<KeySettingsModalProps> = ({ isOpen, onClose }) => {
  const [keys, setKeys] = useState<ApiKeys>({});
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setKeys(getStoredKeys());
      setStatus(null);
    }
  }, [isOpen]);

  const handleSave = () => {
    saveKeys(keys);
    setStatus({ type: 'success', message: 'API Keys saved to local storage.' });
    setTimeout(() => setStatus(null), 3000);
  };

  const handleExport = () => {
    exportKeysToFile();
    setStatus({ type: 'success', message: 'Keys exported to encrypted file.' });
    setTimeout(() => setStatus(null), 3000);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const success = await importKeysFromFile(file);
    if (success) {
      setKeys(getStoredKeys());
      setStatus({ type: 'success', message: 'Keys imported successfully.' });
    } else {
      setStatus({ type: 'error', message: 'Failed to import keys. Invalid file or format.' });
    }
    setTimeout(() => setStatus(null), 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative animate-fade-in-up border border-slate-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors p-1"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
              <Key className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">API Key Management</h2>
              <p className="text-slate-500 text-xs">Manage and backup your external API keys securely.</p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center">
                Gemini API Key
                <span className="ml-2 text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">Required</span>
              </label>
              <input 
                type="password" 
                value={keys.gemini || ''}
                onChange={(e) => setKeys({ ...keys, gemini: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono text-sm"
                placeholder="Enter your Gemini API Key"
              />
              <p className="mt-1 text-[10px] text-slate-400">If left empty, the system will use the default environment key.</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">OpenAI API Key (Optional)</label>
              <input 
                type="password" 
                value={keys.openai || ''}
                onChange={(e) => setKeys({ ...keys, openai: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono text-sm"
                placeholder="sk-..."
              />
            </div>

            {status && (
              <div className={`flex items-center space-x-2 p-3 rounded-lg text-sm font-medium ${
                status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
              }`}>
                {status.type === 'success' ? <ShieldCheck className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span>{status.message}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button 
                onClick={handleSave}
                className="bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
              >
                Save Changes
              </button>
              <button 
                onClick={handleExport}
                className="bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-all shadow-md shadow-slate-200 flex items-center justify-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Export Encrypted</span>
              </button>
            </div>

            <div className="relative pt-2">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-400 font-bold tracking-widest">Or Import Backup</span>
              </div>
            </div>

            <div className="pt-1">
              <label className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-white border-2 border-dashed border-slate-200 rounded-xl hover:border-indigo-400 hover:bg-indigo-50/30 transition-all cursor-pointer group">
                <Upload className="w-5 h-5 text-slate-400 group-hover:text-indigo-500" />
                <span className="text-sm font-bold text-slate-500 group-hover:text-indigo-600">Click to upload .enc file</span>
                <input type="file" className="hidden" accept=".enc" onChange={handleImport} />
              </label>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-50 px-8 py-4 border-t border-slate-100">
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Your keys are stored locally in your browser and are never sent to our servers. 
              The export file is encrypted using a symmetric key.
            </p>
        </div>
      </div>
    </div>
  );
};
