/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, UserType } from '../types';
import { COACH_PROMPTS } from '../mockData';
import { 
  Sparkles, 
  Send, 
  RefreshCw, 
  HelpCircle, 
  MessageSquare,
  Bot,
  User,
  AlertCircle
} from 'lucide-react';

interface AICoachChatProps {
  userType: UserType;
  chatHistory: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  onClearHistory: () => void;
}

export const AICoachChat: React.FC<AICoachChatProps> = ({
  userType,
  chatHistory,
  onSendMessage,
  onClearHistory
}) => {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to lowest message whenever history changes or loading occurs
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, loading]);

  const handleSendSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = inputText.trim();
    if (!query) return;

    setInputText('');
    setLoading(true);
    setError(null);

    try {
      await onSendMessage(query);
    } catch (err: any) {
      setError(err.message || 'การตอบรับแชทกับ AI ล้มเหลว กรุณาลองตรวจสอบใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = async (prompt: string) => {
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      await onSendMessage(prompt);
    } catch (err: any) {
      setError(err.message || 'การเรียกใช้ AI ล้มเหลว');
    } finally {
      setLoading(false);
    }
  };

  // Get current life-stage presets
  const suggestions = COACH_PROMPTS[userType] || [];

  return (
    <div id="ai_coach_view" className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[650px]">
      
      {/* Sidebar tips & quick suggestions */}
      <div className="lg:col-span-1 bg-white rounded-3xl p-5 border border-slate-100 flex flex-col justify-between h-full">
        <div className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-sm font-bold font-sans text-slate-800 flex items-center gap-1">
              <HelpCircle className="w-4 h-4 text-cyan-600" />
              คำถามแนะนำกลุ่มเฉพาะ
            </h2>
            <p className="text-[10px] text-slate-400 font-sans leading-normal">
              หัวข้อคำถามทางการเงินที่คำนวณแยกตามสไตล์โปรไฟล์ที่ใช้งานอยู่
            </p>
          </div>

          <div className="space-y-2.5">
            {suggestions.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(prompt)}
                disabled={loading}
                className="w-full text-left p-3 bg-slate-50 border border-slate-200/50 hover:bg-slate-100 rounded-xl text-xxs font-sans font-medium text-slate-600 leading-relaxed hover:border-slate-300 transition duration-150 disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Clear conversations section */}
        <div className="pt-4 border-t border-slate-100 flex flex-col space-y-2">
          <div className="text-[9px] text-slate-400 font-sans text-center">
            ระบบจัดวางความจำการสนทนาอย่างต่อเนื่องด้วยแบบจำลอง Gemini Fast
          </div>
          <button
            onClick={onClearHistory}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 text-xxs font-bold py-2 rounded-xl transition font-sans flex items-center justify-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            ล้างประวัติการแชททั้งหมด
          </button>
        </div>
      </div>

      {/* Main chat UI panels */}
      <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-100 flex flex-col h-full overflow-hidden justify-between shadow-sm">
        
        {/* Chat header */}
        <div className="bg-slate-950 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-cyan-500/20 p-2.5 border border-cyan-500/10 rounded-2xl text-cyan-400">
              <Bot className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm font-sans tracking-tight">AI โค้ชการเงินส่วนตัว (Financial Coach)</h3>
                <span className="text-[9px] text-cyan-400 bg-cyan-900/30 px-2 py-0.5 rounded-full font-sans uppercase font-bold">
                  Online ⚡
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-sans mt-0.5">
                ตอบคำถามเรื่องภาษี หนี้ บัญชีแยกเป้าหมาย และแผนการออมเงิน
              </p>
            </div>
          </div>
        </div>

        {/* Messages list container */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-6 py-5 space-y-4 bg-slate-50/50"
        >
          {chatHistory.length === 0 ? (
            <div className="py-16 text-center space-y-3 max-w-sm mx-auto select-none">
              <div className="text-4xl">💬🤖</div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-slate-800 text-sm font-sans">เริ่มคุยปัญหาการเงินกับ AI วันนี้</h4>
                <p className="text-slate-400 text-xs font-sans leading-relaxed">
                  ถามได้หมดทุกปัญหาการจัดสรรงบ! เช่น การดึงเงินทุนร้านค้าไปซื้อบุฟเฟต์, วิธีเก็บเพื่อซื้อ iPad หรือไอเดียออมเงินสำรอง 6 เดือน
                </p>
              </div>
            </div>
          ) : (
            chatHistory.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div 
                  key={msg.id} 
                  className={`flex gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                >
                  {/* Micro Avatars */}
                  <div className={`p-2 rounded-xl text-xs shrink-0 h-9 w-9 flex items-center justify-center border ${
                    isUser 
                      ? 'bg-slate-900 border-slate-800 text-white' 
                      : 'bg-cyan-50 border-cyan-100 text-cyan-600'
                  }`}>
                    {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  {/* Text bubble */}
                  <div className={`p-4 rounded-2xl leading-relaxed text-xs font-sans ${
                    isUser 
                      ? 'bg-slate-900 text-white rounded-tr-none' 
                      : 'bg-white text-slate-800 rounded-tl-none border border-slate-100 shadow-xs'
                  }`}>
                    {/* Render raw string easily with formatted lines */}
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    
                    <div className={`text-[9px] mt-2 text-right ${isUser ? 'text-slate-400' : 'text-slate-400'}`}>
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* Typing dynamic indicator */}
          {loading && (
            <div className="flex gap-3 mr-auto max-w-[80%]">
              <div className="p-2 rounded-xl text-xs shrink-0 h-9 w-9 flex items-center justify-center border bg-cyan-50 border-cyan-100 text-cyan-600">
                <Bot className="w-4 h-4 animate-bounce" />
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs rounded-tl-none flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 text-xxs font-sans rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Input box form */}
        <div className="px-6 py-4 border-t border-slate-100 bg-white shrink-0">
          <form onSubmit={handleSendSubmit} className="flex gap-3">
            <input
              type="text"
              placeholder="พิมพ์คำถามทางการเงินกับ AI โค้ดตรงนี้..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={loading}
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-sans flex-1 outline-none focus:bg-white focus:border-cyan-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !inputText.trim()}
              className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white rounded-xl px-4 py-2.5 transition flex items-center justify-center shrink-0 disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
