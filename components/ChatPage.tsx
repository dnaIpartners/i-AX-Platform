import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Loader2, Sparkles, MessageSquare } from 'lucide-react';
import { chatWithRFP } from '../services/geminiService';
import { ChatMessage } from '../types';

export const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      role: 'model',
      text: "안녕하세요! i-Chat입니다. 무엇을 도와드릴까요? 프로젝트 전략, UX 분석, 기술 스택 등 궁금한 점을 자유롭게 물어보세요.",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      // Pass empty string for rfpText for general chat
      const responseText = await chatWithRFP('', history, userMsg.text);

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText || "죄송합니다. 답변을 생성할 수 없습니다.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("Chat Error:", error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Header */}
      <div className="flex-shrink-0 h-16 border-b border-slate-100 flex items-center justify-between px-6 bg-white/80 backdrop-blur-md z-10">
         <div className="flex items-center space-x-3">
             <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-sm">
                 <MessageSquare className="w-5 h-5" />
             </div>
             <h1 className="text-xl font-bold text-slate-900">i-Chat</h1>
         </div>
         <div className="text-sm text-slate-500 font-medium bg-slate-100 px-3 py-1 rounded-full">
             AI Assistant
         </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 scroll-smooth bg-slate-50">
          <div className="max-w-3xl mx-auto space-y-8 pb-4">
              {messages.map((msg) => (
                  <div key={msg.id} className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-fade-in-up`}>
                      <div className={`
                          w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm
                          ${msg.role === 'user' ? 'bg-slate-800' : 'bg-gradient-to-br from-indigo-500 to-purple-600'}
                      `}>
                          {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Sparkles className="w-5 h-5 text-white" />}
                      </div>
                      
                      <div className={`flex flex-col max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                          <div className={`
                              px-6 py-4 rounded-2xl text-base leading-relaxed shadow-sm
                              ${msg.role === 'user' 
                                  ? 'bg-slate-800 text-white rounded-tr-none' 
                                  : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
                              }
                          `}>
                              <div className="whitespace-pre-wrap">{msg.text}</div>
                          </div>
                          <span className="text-xs text-slate-400 mt-2 px-1">
                              {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                      </div>
                  </div>
              ))}
              
              {loading && (
                  <div className="flex items-start gap-4 animate-fade-in">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                          <Loader2 className="w-5 h-5 text-white animate-spin" />
                      </div>
                      <div className="bg-white border border-slate-200 px-6 py-4 rounded-2xl rounded-tl-none shadow-sm text-slate-500">
                          <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-75"></div>
                              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
                          </div>
                      </div>
                  </div>
              )}
              <div ref={messagesEndRef} />
          </div>
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 p-6 bg-white border-t border-slate-200">
          <div className="max-w-3xl mx-auto relative">
              <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="메시지를 입력하세요..."
                  className="w-full pl-6 pr-14 py-4 bg-white border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none text-base shadow-sm max-h-48 text-slate-800 placeholder:text-slate-400"
                  rows={1}
                  style={{ minHeight: '60px' }}
              />
              <button
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  className="absolute right-3 bottom-3 p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-300 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                  <Send className="w-5 h-5" />
              </button>
          </div>
          <p className="text-center text-xs text-slate-400 mt-3">
              i-Chat은 실수를 할 수 있습니다. 중요한 정보는 확인이 필요합니다.
          </p>
      </div>
    </div>
  );
};