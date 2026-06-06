/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Transaction, SavingsGoal, FinancialHealthScore, UserType, NotificationAlert } from '../types';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  AlertTriangle, 
  Activity, 
  Award,
  ChevronRight,
  ShieldAlert,
  Sparkles,
  RefreshCw,
  Coins
} from 'lucide-react';

interface DashboardProps {
  userType: UserType;
  setUserType: (type: UserType) => void;
  transactions: Transaction[];
  goals: SavingsGoal[];
  healthScore: FinancialHealthScore;
  alerts: NotificationAlert[];
  onAddTransactionClick: () => void;
  onViewAnalysisClick: () => void;
  onViewGoalsClick: () => void;
  coins: number;
}

export const Dashboard: React.FC<DashboardProps> = ({
  userType,
  setUserType,
  transactions,
  goals,
  healthScore,
  alerts,
  onAddTransactionClick,
  onViewAnalysisClick,
  onViewGoalsClick,
  coins
}) => {
  // Aggregate balance
  const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = income - expense;

  // Group expenses by category
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const sortedCategories = Object.entries(expensesByCategory)
    .map(([category, amount]) => ({ category, amount: amount as number }))
    .sort((a, b) => b.amount - a.amount);

  // Health Score UI settings
  const getScoreColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'good': return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
      case 'fair': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      default: return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
    }
  };

  const getStrokeColor = (status: string) => {
    switch (status) {
      case 'excellent': return '#10B981';
      case 'good': return '#0EA5E9';
      case 'fair': return '#F59E0B';
      default: return '#EF4444';
    }
  };

  const profileOptions: { value: UserType; label: string; desc: string; emoji: string }[] = [
    { value: 'student', label: 'นักเรียน/นักศึกษา', desc: 'คุมงบร้านของหวาน ชาบู และสะสมเป้าหมายอุปกรณ์การเรียน', emoji: '🎓' },
    { value: 'worker', label: 'วัยทำงานประจำ', desc: 'สร้างเงินสำรอง คุมงบกินดื่ม-ช้อปปิ้งออนไลน์ช่วงดึก', emoji: '💻' },
    { value: 'family', label: 'การเงินครอบครัว', desc: 'วางแผนหนี้ผ่อนบ้าน นมเด็กอ่อน และแบ่งงบกองกลาง', emoji: '🏠' },
    { value: 'sme', label: 'SME / แม่ค้าออนไลน์', desc: 'เน้นแยกกระเป๋าเงินธุรกิจกับเงินส่วนตัว และคำนวณกำไรสุทธิ', emoji: '📦' }
  ];

  return (
    <div id="dashboard_view" className="space-y-6">
      {/* 1. Header Profile Selector */}
      <div id="profile_banner" className="bg-[#0B0D11] text-white rounded-3xl p-6 md:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute left-1/3 bottom-0 w-40 h-40 bg-emerald-500/5 rounded-full blur-2xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-[#14171D] border border-slate-800 px-3 py-1 rounded-full text-xs text-cyan-400 font-medium">
              <Sparkles className="w-3.5 h-3.5 animate-pulse-slow" />
              <span>AI Financial Engine v2.5</span>
            </div>
            <h1 className="text-2xl md:text-3.5xl font-display font-bold tracking-tight text-white">
              สแกน ยืนยัน วิเคราะห์การเงิน <span className="text-cyan-400">อัจฉริยะ</span>
            </h1>
            <p className="text-slate-300 text-sm md:text-base max-w-2xl font-sans">
              แพลตฟอร์มวิเคราะห์สุขภาพการเงิน ผสาน AI วิเคราะห์รูปสลิป, แจ้งคุณทันทีเมื่อมีพฤติกรรมฟุ่มเฟือย, พร้อมสะสมเหรียญเป็นรางวัลเพื่อสร้างวินัย!
            </p>
          </div>
          
          {/* Virtual Coins Reward Panel */}
          <div className="flex items-center gap-3 bg-[#14171D] border border-slate-800 p-4 rounded-2xl self-start md:self-center">
            <div className="bg-amber-500/20 p-2.5 rounded-xl text-amber-400">
              <Coins className="w-6 h-6 animate-spin-slow" style={{ animationDuration: '4s' }} />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-sans">เหรียญสะสมรางวัล</div>
              <div className="font-mono text-xl font-bold text-amber-400">{coins} <span className="text-xs text-slate-400">Coins</span></div>
            </div>
          </div>
        </div>

        {/* Life-Stage Segment Switcher tabs */}
        <div id="segment_tabs" className="mt-8 border-t border-slate-800/80 pt-6">
          <div className="text-xs text-slate-400 font-sans tracking-wider uppercase mb-3 font-semibold">
            ทดลองเปลี่ยนสไตล์กลุ่มผู้ใช้เพื่อรับคำวิเคราะห์แบบแตกต่าง:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {profileOptions.map((opt) => (
              <button
                key={opt.value}
                id={`profile_btn_${opt.value}`}
                onClick={() => setUserType(opt.value)}
                className={`text-left p-3.5 rounded-2xl transition-all duration-300 border ${
                  userType === opt.value
                    ? 'bg-slate-800/75 border-cyan-500 shadow-lg text-white'
                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{opt.emoji}</span>
                  <span className="font-medium font-sans text-sm text-white">{opt.label}</span>
                </div>
                <p className={`text-xs mt-1 leading-relaxed ${userType === opt.value ? 'text-cyan-300' : 'text-slate-450'}`}>
                  {opt.desc}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Key Summary Cards Column with Health Gauge */}
      <div id="key_metrics_row" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Health Gauge Box */}
        <div id="health_card" className="bg-[#14171D] rounded-3xl p-6 shadow-xl border border-slate-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-200 font-sans">คะแนนสุขภาพทางการเงิน</h2>
            <div className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getScoreColor(healthScore.status)}`}>
              {healthScore.status === 'excellent' ? 'ดีเลิศ ✨' : 
               healthScore.status === 'good' ? 'ดีเยี่ยม 👍' : 
               healthScore.status === 'fair' ? 'พอใช้ได้ 🌟' : 'แย่/ต้องปรับปรุง ⚠️'}
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 my-2">
            {/* Visual Gauge Circle */}
            <div className="relative w-32 h-32">
              <svg className="w-full h-full radial-progress-bar">
                <circle 
                  cx="64" cy="64" r="54" 
                  className="stroke-slate-800" 
                  strokeWidth="8" 
                  fill="transparent" 
                />
                <circle 
                  cx="64" cy="64" r="54" 
                  className="transition-all duration-1000 ease-out-back" 
                  strokeWidth="8" 
                  fill="transparent" 
                  stroke={getStrokeColor(healthScore.status)}
                  strokeDasharray={`${2 * Math.PI * 54}`}
                  strokeDashoffset={`${2 * Math.PI * 54 * (1 - healthScore.score / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3.5xl font-display font-extrabold text-white tracking-tight leading-none">
                  {healthScore.score}
                </span>
                <span className="text-xxs text-slate-450 font-medium font-sans uppercase mt-1">จาก 100 คะแนน</span>
              </div>
            </div>

            {/* Health Score Bullets */}
            <div className="space-y-2 flex-1">
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-400">
                  <span className="font-sans">อัตราการออม</span>
                  <span className="font-mono font-medium text-slate-200">{healthScore.breakdown.savingsRate}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${healthScore.breakdown.savingsRate}%` }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-400">
                  <span className="font-sans">คุมรายจ่ายฟุ่มเฟือย</span>
                  <span className="font-mono font-medium text-slate-200">{Math.max(0, 100 - healthScore.breakdown.debtRatio)}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-orange-500 h-full rounded-full" style={{ width: `${Math.max(0, 100 - healthScore.breakdown.debtRatio)}%` }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-400">
                  <span className="font-sans">วินัยคุมงบประมาณ</span>
                  <span className="font-mono font-medium text-slate-200">{healthScore.breakdown.spendingControl}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-sky-500 h-full rounded-full" style={{ width: `${healthScore.breakdown.spendingControl}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex justify-between items-center text-xs text-slate-450 font-sans">
            <span className="flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-slate-450" />
              อัปเดตจากธุรกรรมถัดไปแบบอัตโนมัติ
            </span>
            <span className="font-mono font-semibold text-slate-300 bg-slate-900/40 px-2 py-0.5 rounded-full border border-slate-800">
              บันทึกแล้ว {healthScore.breakdown.disciplineCount} รายการ
            </span>
          </div>
        </div>

        {/* Balance and Income/Expense Cards */}
        <div id="balance_details" className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Card 1: Balance */}
          <div id="card_balance" className="bg-[#0B0D11] rounded-3xl p-6 shadow-xl border border-slate-800 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute right-0 top-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex justify-between items-start relative z-10">
              <div className="bg-cyan-500/10 p-3 rounded-2xl text-cyan-400 border border-cyan-500/20">
                <Wallet className="w-6 h-6" />
              </div>
              <span className="text-xxs font-bold text-cyan-400 bg-cyan-950 border border-cyan-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider font-sans">
                เงินคงเหลือสุทธิ
              </span>
            </div>
            <div className="space-y-1 my-4 relative z-10">
              <div className="text-xxs text-slate-450 font-sans">คงเหลือสำหรับใช้สอยและออม</div>
              <div className="font-mono text-2.5xl md:text-3xl font-bold text-white tracking-tight">
                {balance.toLocaleString('th-TH')} <span className="text-sm font-sans font-medium text-slate-400">บาท</span>
              </div>
            </div>
            <div className="text-xs text-cyan-400 bg-cyan-950/40 border border-cyan-500/20 px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-medium font-sans relative z-10 animate-pulse-slow">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              ปลอดภัยในการบริหารแผนชำระ
            </div>
          </div>

          {/* Card 2: Income */}
          <div id="card_income" className="bg-[#14171D] rounded-3xl p-6 shadow-xl border border-slate-800/80 flex flex-col justify-between hover:border-slate-700/80 transition-all">
            <div className="flex justify-between items-start">
              <div className="bg-emerald-500/10 p-3 rounded-2xl text-emerald-400 border border-emerald-500/20">
                <TrendingUp className="w-6 h-6" />
              </div>
              <button 
                onClick={onAddTransactionClick}
                className="text-xxs font-semibold text-emerald-400 hover:underline flex items-center gap-0.5 font-sans"
              >
                เพิ่มรายร้บ +
              </button>
            </div>
            <div className="space-y-1 my-4">
              <div className="text-xxs text-slate-450 font-sans">รายรับรวมยอด</div>
              <div className="font-mono text-2.5xl md:text-3xl font-bold text-white tracking-tight">
                {income.toLocaleString('th-TH')} <span className="text-sm font-sans font-medium text-slate-400">บาท</span>
              </div>
            </div>
            <div className="text-xs text-slate-300 bg-slate-900/40 px-3 py-1.5 rounded-xl border border-slate-800 flex items-center justify-between font-sans">
              <span>เงินโอน/ยอดขายที่บันทึก</span>
              <span className="font-mono font-bold text-emerald-400">
                +{transactions.filter(t => t.type === 'income').length} รายการ
              </span>
            </div>
          </div>

          {/* Card 3: Expense */}
          <div id="card_expense" className="bg-[#14171D] rounded-3xl p-6 shadow-xl border border-slate-800/80 flex flex-col justify-between hover:border-slate-700/80 transition-all">
            <div className="flex justify-between items-start">
              <div className="bg-rose-500/10 p-3 rounded-2xl text-rose-450 border border-rose-500/20">
                <TrendingDown className="w-6 h-6" />
              </div>
              <button 
                onClick={onAddTransactionClick}
                className="text-xxs font-semibold text-rose-450 hover:underline flex items-center gap-0.5 font-sans"
              >
                เพิ่มรายจ่าย +
              </button>
            </div>
            <div className="space-y-1 my-4">
              <div className="text-xxs text-slate-450 font-sans">รายจ่ายรวมยอด</div>
              <div className="font-mono text-2.5xl md:text-3xl font-bold text-white tracking-tight">
                {expense.toLocaleString('th-TH')} <span className="text-sm font-sans font-medium text-slate-400">บาท</span>
              </div>
            </div>
            <div className="text-xs text-slate-300 bg-slate-900/40 px-3 py-1.5 rounded-xl border border-slate-800 flex items-center justify-between font-sans">
              <span>บิลและสลิปที่ใช้</span>
              <span className="font-mono font-bold text-rose-450">
                -{transactions.filter(t => t.type === 'expense').length} รายการ
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* 3. Deep Analysis and Goals Overview Grid */}
      <div id="analytics_goals_grid" className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Left Side: Dynamic Spending Categories Custom Chart */}
        <div id="dashboard_chart_section" className="bg-[#14171D] rounded-3xl p-6 shadow-xl border border-slate-800/80">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold font-sans text-white">สถิติพฤติกรรมการใช้จ่ายล่าสุด</h2>
              <p className="text-xs text-slate-450 font-sans select-none">สกัดและจำแนกหมวดหมู่อัตโนมัติด้วย AI</p>
            </div>
            <button 
              onClick={onViewAnalysisClick}
              className="text-xs font-semibold text-cyan-400 px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 rounded-xl flex items-center gap-0.5 font-sans transition-all border border-cyan-500/10"
            >
              เจาะลึกวิเคราะห์ AI <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {sortedCategories.length === 0 ? (
              <div className="py-12 text-center text-slate-500 space-y-2">
                <div className="text-4xl">🧾</div>
                <div className="text-sm font-sans">คุณยังไม่ได้บันทึกพฤติกรรมการใช้จ่ายใดๆ</div>
                <p className="text-xs font-sans text-slate-500 max-w-sm mx-auto">ลองจำลองอัปโหลดสลิปที่แผงเพิ่มธุรกรรมเพื่อดูผลวิเคราะห์</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Custom Stack Bar Visualization */}
                <div id="visual_spending_stack" className="space-y-2">
                  <div className="text-xs font-semibold text-slate-400 font-sans mb-1">สัดส่วนเปอร์เซ็นต์รายจ่าย:</div>
                  <div className="w-full bg-slate-800/80 h-6 rounded-2xl overflow-hidden flex">
                    {sortedCategories.slice(0, 4).map((item, idx) => {
                      const percentage = Math.floor((item.amount / expense) * 100);
                      const colors = ['bg-indigo-600', 'bg-cyan-500', 'bg-amber-500', 'bg-emerald-500', 'bg-pink-500'];
                      return (
                        <div 
                          key={item.category} 
                          className={`${colors[idx % colors.length]} h-full tooltip text-center text-white text-[9px] font-bold flex items-center justify-center transition-all`}
                          style={{ width: `${percentage}%` }}
                          title={`${item.category}: ${percentage}%`}
                        >
                          {percentage > 10 ? `${percentage}%` : ''}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Progress bars of detailed categories */}
                <div id="detailed_categories_list" className="space-y-3.5 mt-4">
                  {sortedCategories.map((item, index) => {
                    const percentage = Math.floor((item.amount / expense) * 100);
                    const getBarColor = (cat: string) => {
                      if (cat.includes('สังสรรค์') || cat.includes('ช้อปปิ้ง')) return 'bg-rose-500';
                      if (cat.includes('กาแฟ') || cat.includes('อาหาร')) return 'bg-amber-500';
                      if (cat.includes('ต้นทุน') || cat.includes('ค่าการตลาด')) return 'bg-purple-500';
                      return 'bg-slate-500';
                    };

                    return (
                      <div key={item.category} className="space-y-1">
                        <div className="flex justify-between items-center text-xs font-sans">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                            <span className="font-semibold text-slate-300">{item.category}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-mono font-bold text-white">{item.amount.toLocaleString()}</span>
                            <span className="text-slate-450 ml-1">บาท ({percentage}%)</span>
                          </div>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${getBarColor(item.category)}`} style={{ width: `${percentage}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Goals Progress Dashboard View */}
        <div id="dashboard_goals_section" className="bg-[#14171D] rounded-3xl p-6 shadow-xl border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-bold font-sans text-white">เป้าหมายทางการเงินและรางวัล</h2>
                <p className="text-xs text-slate-450 font-sans">สะสมยอดออมเพื่อปลดรางวัลพิเศษ</p>
              </div>
              <button 
                onClick={onViewGoalsClick}
                className="text-xs font-semibold text-cyan-400 px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 rounded-xl flex items-center gap-0.5 font-sans transition-all border border-cyan-500/10"
              >
                ดูและเคลมเหรียญ <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-4">
              {goals.length === 0 ? (
                <div className="py-8 text-center text-slate-500 space-y-2">
                  <div className="text-4xl">🎯</div>
                  <div className="text-sm font-sans">ไม่มีเป้าหมายออมเงินระบุในกลุ่มนี้</div>
                  <button 
                    onClick={onViewGoalsClick}
                    className="text-xs bg-slate-800 text-white px-3 py-1.5 rounded-xl font-sans"
                  >
                    เริ่มตั้งเป้าหมายแรก
                  </button>
                </div>
              ) : (
                <div className="space-y-4.5">
                  {goals.map((g) => {
                    const percent = Math.min(100, Math.floor((g.current / g.target) * 100));
                    return (
                      <div key={g.id} className="p-4 bg-[#0B0D11]/55 rounded-2xl border border-slate-800/60 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] text-cyan-400 font-bold bg-cyan-950/80 border border-cyan-500/20 px-2 py-0.5 rounded-full font-sans uppercase">
                              {g.type === 'ipad' ? '💻 อุปกรณ์ทำงาน/เรียน' : 
                               g.type === 'travel' ? '✈️ ท่องเที่ยวพักผ่อน' : 
                               g.type === 'emergency' ? '🛡️ สำรองฉุกเฉิน' : '👵 วางแผนอนาคต/เกษียณ'}
                            </span>
                            <h3 className="font-bold text-slate-200 text-sm mt-1 font-sans">{g.name}</h3>
                          </div>
                          <div className="flex items-center gap-1 font-mono text-xs font-bold text-slate-300 bg-slate-800 px-2 py-1 rounded-xl shadow-xs border border-slate-700/45">
                            <span className="text-amber-500">🏆</span>
                            <span>{g.rewardCoins} Coins</span>
                          </div>
                        </div>

                        <div className="space-y-1 pt-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-400 font-sans">คืบหน้า {percent}%</span>
                            <span className="font-semibold text-slate-300 font-mono">
                              {g.current.toLocaleString()} / {g.target.toLocaleString()} บาท
                            </span>
                          </div>
                          <div className="w-full bg-slate-800/80 h-2.5 rounded-full overflow-hidden">
                            <div className="bg-sky-500 h-full rounded-full transition-all duration-700" style={{ width: `${percent}%` }} />
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-xs text-slate-450 pt-1 font-sans">
                          <span>ต้องการออมต่อสัปดาห์: <strong className="font-mono text-slate-300 font-bold">{g.weeklyNeeded} บาท</strong></span>
                          {percent === 100 && !g.rewardClaimed ? (
                            <span className="text-xxs font-bold text-[#EAB308] bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full animate-bounce">
                              พร้อมรับเหรียญ ⭐️
                            </span>
                          ) : g.rewardClaimed ? (
                            <span className="text-xxs font-semibold text-slate-400 flex items-center gap-0.5">
                              ✔️ รับเหรียญแล้ว
                            </span>
                          ) : (
                            <span>เป้าหมายเดดไลน์: {g.targetDate}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="bg-[#0B0D11]/55 border border-slate-800/60 p-3.5 rounded-2xl flex items-center gap-3 text-xs mt-4 font-sans text-slate-400 leading-relaxed">
            <span className="text-lg">🎁</span>
            <div>
              <strong className="text-slate-200">เกมสะสมคะแนนวิถีคนขยัน:</strong> ออมดีเด่นปลดล็อกเหรียญตรา แลกรับเป็นสัญชาติเศรษฐีใหม่ และมาสคอตน่ารักคอยช่วยให้คำปรึกษา!
            </div>
          </div>
        </div>

      </div>

      {/* 4. Mini alert slider / Notification rail */}
      <div id="brief_alerts_row" className="bg-[#14171D] rounded-3xl p-6 shadow-xl border border-slate-800/80">
        <div className="flex items-center gap-2 mb-4">
          <ShieldAlert className="text-rose-500 w-5 h-5" />
          <h2 className="text-base font-bold font-sans text-white">กิจกรรมและคำเตือนอัจฉริยะจาก AI</h2>
        </div>
        <div className="divide-y divide-slate-800/60">
          {alerts.filter(a => !a.resolved).slice(0, 3).map((a) => (
            <div key={a.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 first:pt-0 last:pb-0 transition-colors">
              <div className="flex gap-3 items-start">
                <span className={`p-2 rounded-xl text-sm ${
                  a.type === 'warning' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 
                  a.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                  'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                }`}>
                  {a.type === 'warning' ? '⚠️' : a.type === 'success' ? '✅' : 'ℹ️'}
                </span>
                <div>
                  <h4 className="font-bold text-slate-200 text-sm font-sans">{a.title}</h4>
                  <p className="text-slate-400 text-xs mt-0.5 font-sans leading-relaxed">{a.message}</p>
                </div>
              </div>
              <div className="text-xxs font-sans text-slate-450 whitespace-nowrap self-end sm:sm:self-center">
                {a.date}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
