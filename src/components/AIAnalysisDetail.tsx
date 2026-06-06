/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Transaction, SpendingAnalysis, UserType } from '../types';
import { 
  Sparkles, 
  BrainCircuit, 
  ShieldCheck, 
  TrendingDown, 
  AlertTriangle,
  Lightbulb,
  DollarSign,
  ChevronRight,
  UserCheck
} from 'lucide-react';

interface AIAnalysisDetailProps {
  transactions: Transaction[];
  userType: UserType;
  monthlyBudget: number;
  initialAnalysis?: SpendingAnalysis;
}

export const AIAnalysisDetail: React.FC<AIAnalysisDetailProps> = ({
  transactions,
  userType,
  monthlyBudget,
  initialAnalysis
}) => {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<SpendingAnalysis | null>(initialAnalysis || null);
  const [error, setError] = useState<string | null>(null);

  // Group transaction incomes to see total capacity
  const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

  // Call the backend to trigger real-time spending behavior analysis
  const handleTriggerAnalysis = async () => {
    if (transactions.length === 0) {
      setError('คุณจำเป็นต้องบันทึกธุรกรรมอย่างน้อย 1 รายการเพื่อส่งไปประเมิน AI');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactions,
          userType,
          monthlyBudget
        })
      });

      if (!response.ok) {
        throw new Error('ระบบ AI ขัดข้องในขณะรวบรวมพฤติกรรม กรุณาลองใหม่อีกครั้ง');
      }

      const result = await response.json();
      setAnalysis(result);
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการวิเคราะห์พฤติกรรมการเงิน');
    } finally {
      setLoading(false);
    }
  };

  const getProfileSpecificTitle = (type: UserType) => {
    switch (type) {
      case 'student': return 'สมุดวิเคราะห์งบวัยเรียนและนักศึกษา';
      case 'worker': return 'บทประเมินเสถียรภาพการเงินของมนุษย์เงินเดือน';
      case 'family': return 'แผนวิเคราะห์งบส่วนกลางและกองทุนครอบครัว';
      case 'sme': return 'รายงานวิเคราะห์กำไรสุทธิตัวแทนผู้ประกอบการ SME';
    }
  };

  return (
    <div id="ai_analysis_view" className="space-y-6">
      
      {/* 1. Feature intro block */}
      <div id="analysis_banner" className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase font-sans">
              <BrainCircuit className="w-3.5 h-3.5 animate-pulse" />
              <span>กุนซือการเงินส่วนตัว (Personal AI Advisor)</span>
            </div>
            <h1 className="text-xl md:text-2xl font-display font-bold">
              {getProfileSpecificTitle(userType)}
            </h1>
            <p className="text-slate-300 text-xs md:text-sm font-sans max-w-xl">
              คลิกเพื่อประมวลคำแนะนำอัจฉริยะ Gemini วิเคราะห์หมวดใช้เงินเยอะ คัดกรองเศษค่าใช้จ่ายฟุ่มเฟือยซ้ำซาก พร้อมคำนวณเงินออมคืนชีวิตคุณ!
            </p>
          </div>

          <button
            onClick={handleTriggerAnalysis}
            disabled={loading}
            className={`px-5 py-3 rounded-2xl font-sans text-xs font-bold transition shadow-xl shrink-0 flex items-center justify-center gap-2 ${
              loading 
                ? 'bg-indigo-900 text-indigo-300 cursor-not-allowed'
                : 'bg-white text-indigo-950 hover:bg-slate-100'
            }`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-indigo-300 border-t-transparent rounded-full animate-spin" />
                <span>AI กำลังถอดแบบพฤติกรรม...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
                <span>วิเคราะห์ด้วย Gemini AI ✨</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error statement banner */}
      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-2xl text-xs flex items-center gap-2 font-sans">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 2. Main analytical layout content */}
      {!analysis && !loading ? (
        // Empty state showing trigger prompting
        <div id="analysis_empty_state" className="bg-slate-50 border border-slate-200/60 rounded-3xl p-12 text-center max-w-3xl mx-auto space-y-4">
          <div className="text-5xl">🧠⏳</div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-800 text-base font-sans">พร้อมส่งพฤติกรรมของคุณไปตรวจสอบ?</h3>
            <p className="text-slate-500 text-xs font-sans max-w-md mx-auto">
              ระบบวิเคราะห์ข้อมูลจะดึงรายจ่ายทั้งหมด {transactions.length} รายการที่บันทึกไว้ นำไปประมวลหาจุดรั่วไหลทางการเงินอย่างรวดเร็ว
            </p>
          </div>
          <button
            onClick={handleTriggerAnalysis}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold font-sans py-2.5 px-6 rounded-xl shadow-lg transition"
          >
            วิเคราะห์ตอนนี้
          </button>
        </div>
      ) : loading ? (
        // Premium Skeleton Loader while loading response
        <div id="analysis_skeleton" className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
          <div className="md:col-span-2 bg-slate-50 border border-slate-200/50 rounded-3xl p-6 space-y-4">
            <div className="h-4 bg-slate-200 w-1/3 rounded-lg" />
            <div className="h-2.5 bg-slate-200 w-full rounded-lg" />
            <div className="h-2.5 bg-slate-200 w-5/6 rounded-lg" />
            <div className="h-2.5 bg-slate-200 w-4/5 rounded-lg" />

            <div className="h-4 bg-slate-200 w-1/4 rounded-lg pt-4" />
            <div className="grid grid-cols-2 gap-3">
              <div className="h-16 bg-slate-200 rounded-2xl" />
              <div className="h-16 bg-slate-200 rounded-2xl" />
            </div>
          </div>
          <div className="bg-slate-50 border border-slate-200/50 rounded-3xl p-6 space-y-4">
            <div className="h-4 bg-slate-200 w-1/2 rounded-lg" />
            <div className="h-5 bg-slate-200 w-full rounded-lg" />
            <div className="h-5 bg-slate-200 w-full rounded-lg" />
            <div className="h-5 bg-slate-200 w-full rounded-lg" />
          </div>
        </div>
      ) : (
        // Actual analytical details layout computed
        <div id="analysis_panel_results" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Main detailed blocks (Col span 2) */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Box 1: Analysis Summary paragraph */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-800 text-sm font-sans uppercase tracking-wider">บทสรุปและวิเคราะห์จุดรั่วทางการเงิน</h3>
              </div>
              <p className="text-slate-600 text-xs md:text-sm leading-relaxed font-sans bg-slate-50 p-4 rounded-2xl border border-slate-100">
                {analysis?.summary}
              </p>
            </div>

            {/* Box 2: Identifying unnecessary expenditures */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-rose-500" />
                  <h3 className="font-bold text-slate-800 text-sm font-sans">รายจ่ายที่ไม่จำเป็นหรือพอระงับได้ (Unnecessary Expenses)</h3>
                </div>
                <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full font-sans uppercase">
                  ลดด่วน 🚨
                </span>
              </div>

              {!analysis?.unnecessaryExpenses || analysis.unnecessaryExpenses.length === 0 ? (
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-xs font-sans text-emerald-800 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>สุดยอดมากๆ! AI พิจารณาพฤติกรรมของคุณแล้ว ไม่พบสัญชาติรายจ่ายฟุ่มเฟือยที่เป็นจุดอ่อนร้ายแรง</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {analysis?.unnecessaryExpenses.map((un, index) => (
                    <div key={un.id || index} className="p-4 bg-slate-50 hover:bg-slate-100/50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row justify-between gap-4 transition">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xxs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full font-sans">
                            {un.category}
                          </span>
                          <h4 className="font-bold text-slate-800 text-xs font-sans">{un.name}</h4>
                        </div>
                        <p className="text-slate-500 text-xxs font-sans leading-relaxed">
                          <strong className="text-indigo-600">วิถีประหยัด:</strong> {un.potentialSaving}
                        </p>
                      </div>
                      
                      <div className="text-left sm:text-right shrink-0">
                        <span className="text-slate-400 text-xxs font-sans font-medium">มูลค่าฟุ่มเฟือยโดยประมาณ</span>
                        <div className="font-mono text-base font-extrabold text-rose-600">
                          -{un.amount.toLocaleString()} <span className="text-[10px] font-sans font-medium text-slate-500">฿/เดือน</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Sidebar strategies column */}
          <div className="space-y-6">
            
            {/* Box 3: Strategic Actionable Tips */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-slate-800 text-sm font-sans">คำแนะนำกลยุทธ์กอบกู้เงินออม</h3>
              </div>

              <div className="space-y-3.5">
                {analysis?.costReductionAdvice.map((adv, index) => (
                  <div key={index} className="flex gap-2.5 items-start">
                    <span className="bg-amber-50 border border-amber-200 text-amber-600 p-1.5 rounded-xl text-xxs shrink-0 font-bold">
                      {index + 1}
                    </span>
                    <p className="text-slate-600 text-xs leading-relaxed font-sans pt-0.5">
                      {adv}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* User Segment Information Card */}
            <div className="p-5 bg-gradient-to-br from-indigo-50 to-cyan-50/50 rounded-3xl border border-indigo-100 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-indigo-600" />
                  <h4 className="font-bold text-slate-800 text-xs font-sans">โปรไฟล์และระบบคัดกรอง</h4>
                </div>
                <p className="text-slate-500 text-xxs leading-relaxed font-sans">
                  สูตรสมการสุขภาพและชุดเครื่องกรองคำปรึกษา AI ของเรา จะผันแปรตามสัญชาติโปรไฟล์ของผู้ใช้ทันทีที่คุณเปลี่ยนความถนัดในหน้าแดชบอร์ดหลัก
                </p>
              </div>

              <div className="p-3 bg-white border border-indigo-100/50 rounded-2xl flex items-center justify-between text-xs font-sans mt-2">
                <span className="text-slate-400">โปรไฟล์ที่ใช้วิเคราะห์เบื้องต้น:</span>
                <span className="font-bold text-indigo-600 capitalize">
                  {userType === 'student' ? '🎓 นักศึกษา' : 
                   userType === 'worker' ? '💻 คนทำงานประจำ' : 
                   userType === 'family' ? '🏠 ครอบครัวคู่รัก' : '📦 ผู้รับเหมา / SME'}
                </span>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
