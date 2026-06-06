/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SavingsGoal, UserType } from '../types';
import { ShopItem, GAMIFICATION_ITEMS } from '../mockData';
import { 
  Award, 
  Plus, 
  Coins, 
  Check, 
  AlertCircle, 
  Sparkles,
  ShoppingBag,
  Clock,
  PiggyBank
} from 'lucide-react';

interface SavingsGoalsPanelProps {
  goals: SavingsGoal[];
  onAddGoal: (goal: Omit<SavingsGoal, 'id' | 'current' | 'rewardClaimed'>) => void;
  onDepositGoal: (id: string, amount: number) => void;
  onClaimCoins: (id: string) => void;
  coins: number;
  onUnlockItem: (itemId: string, price: number) => void;
  unlockedItems: string[];
}

export const SavingsGoalsPanel: React.FC<SavingsGoalsPanelProps> = ({
  goals,
  onAddGoal,
  onDepositGoal,
  onClaimCoins,
  coins,
  onUnlockItem,
  unlockedItems
}) => {
  // Add Goal Form states
  const [goalName, setGoalName] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalType, setGoalType] = useState<SavingsGoal['type']>('ipad');
  const [goalDate, setGoalDate] = useState('2026-12-31');

  // Input deposit funds state
  const [depositAmounts, setDepositAmounts] = useState<Record<string, string>>({});

  // Submits add goal
  const handleAddGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetVal = parseFloat(goalTarget);
    if (!goalName.trim() || isNaN(targetVal) || targetVal <= 0) {
      alert('กรุณากรอกระบุข้อมูลเป้าหมายและจำนวนเงินที่ถูกต้อง');
      return;
    }

    // Rough calculation of daily and weekly needed
    const targetDay = new Date(goalDate);
    const today = new Date();
    const diffTime = Math.abs(targetDay.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 30;

    const dailyNeeded = Math.ceil(targetVal / diffDays);
    const weeklyNeeded = Math.ceil(targetVal / (diffDays / 7)) || dailyNeeded * 7;

    // reward coins are 1-2% of the target, capped at 2000
    const rewardCoins = Math.min(2000, Math.floor(targetVal * 0.01)) || 100;

    onAddGoal({
      name: goalName,
      target: targetVal,
      targetDate: goalDate,
      dailyNeeded,
      weeklyNeeded,
      type: goalType,
      rewardCoins
    });

    // Reset fields
    setGoalName('');
    setGoalTarget('');
  };

  const handleDepositSubmit = (e: React.FormEvent, goalId: string) => {
    e.preventDefault();
    const amountStr = depositAmounts[goalId] || '';
    const amountVal = parseFloat(amountStr);

    if (isNaN(amountVal) || amountVal <= 0) {
      alert('กรุณากรอกจำนวนเงินเก็บออมให้ถูกต้อง');
      return;
    }

    onDepositGoal(goalId, amountVal);
    setDepositAmounts(prev => ({ ...prev, [goalId]: '' }));
  };

  const handleDepositInputChange = (goalId: string, value: string) => {
    setDepositAmounts(prev => ({ ...prev, [goalId]: value }));
  };

  return (
    <div id="goals_gamification_view" className="space-y-8">
      
      {/* SECTION 1: Top Hero coins score & Badges Chest */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Coins Chest Balance details */}
        <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] text-white p-6 rounded-3xl col-span-1 shadow-lg border border-slate-800 flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <h3 className="text-xs text-slate-400 font-bold uppercase font-sans tracking-widest">ธนาคารเหรียญของขวัญ</h3>
            <span className="text-[10px] text-[#EAB308] bg-[#EAB308]/10 px-2 py-0.5 rounded-full font-sans border border-[#EAB308]/20 animate-pulse">
              Level 1: วินัยเริ่มต้น 🚀
            </span>
          </div>

          <div className="my-5 flex items-center gap-4">
            <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-2xl text-amber-500">
              <Coins className="w-8 h-8 animate-bounce" />
            </div>
            <div>
              <span className="text-xxs text-slate-400 font-sans">คลังทองคำคงเหลือ</span>
              <div className="font-mono text-3.5xl font-extrabold text-amber-400 tracking-tight leading-none mt-1">
                {coins} <span className="text-sm font-sans font-medium text-slate-400">Coins</span>
              </div>
            </div>
          </div>

          <p className="text-xxs text-slate-400 font-sans leading-relaxed">
            สะสมเหรียญรางวัลทองคำโดยการป้อนยอดออมสู่เป้าหมาย หรือปิดความสำเร็จเป้าหมายครบ 100% แล้วมาเคลมรางวัลพิเศษ!
          </p>
        </div>

        {/* Owned Unlocked Badges shelf display */}
        <div className="bg-white rounded-3xl p-6 col-span-2 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Award className="w-5 h-5 text-indigo-600" />
              <h2 className="text-sm font-bold font-sans text-slate-800 uppercase tracking-wider">กล่องสะสมตราเกียรติยศ (Your Badges Chest)</h2>
            </div>
            <p className="text-xxs text-slate-400 font-sans">แสดงทักษะหรือตรารางวัลที่แลกซื้อมาจากฟาร์มเหรียญทองของคุณ</p>
          </div>

          <div className="flex flex-wrap gap-3 my-4">
            {unlockedItems.length === 0 ? (
              <div className="py-4 text-center text-slate-300 font-sans text-xxs flex items-center justify-center gap-1.5 bg-slate-50 border border-dashed rounded-2xl w-full">
                <span>🔒 คุณยังไม่มีตราเกียรติยศปลดล็อกในหีบนี้ ร่วมออมเพิ่มเพื่อแลกถ้วยรางวัลเกรดโปร!</span>
              </div>
            ) : (
              unlockedItems.map((itemId) => {
                const item = GAMIFICATION_ITEMS.find(i => i.id === itemId);
                return (
                  <div 
                    key={itemId} 
                    className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 p-2.5 rounded-2xl text-slate-800 hover:scale-105 transition duration-150 tooltip"
                    title={item?.description}
                  >
                    <span className="text-xl shrink-0">{item?.imageSlug}</span>
                    <div>
                      <div className="font-bold text-xxs font-sans leading-none">{item?.name}</div>
                      <p className="text-[9px] text-slate-500 font-sans mt-0.5 max-w-[150px] truncate">{item?.description}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <span className="text-[10px] text-slate-400 font-sans leading-relaxed flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#EAB308]" />
            สิทธิพิเศษ: ตราเกียรติยศจะเพิ่มคะแนนสุขภาพโบนัสสะสม +5 คะแนนอัตโนมัติ
          </span>
        </div>

      </div>

      {/* SECTION 2: Active Savings Goals & Form Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Submodule A: Add Savings Goal Form */}
        <div className="lg:col-span-1 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
          <div className="flex items-center gap-2">
            <PiggyBank className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold font-sans text-slate-800">ตั้งเป้าหมายการออมใหม่</h2>
          </div>

          <form onSubmit={handleAddGoalSubmit} className="space-y-4 pt-1">
            <div className="space-y-1">
              <label className="text-xs text-slate-500 font-semibold font-sans">ชื่อเป้าหมายการเงินของคุณ *</label>
              <input
                type="text"
                placeholder="เช่น ซื้อ iPad Air, เที่ยวญี่ปุ่นสิบวัน, เงินสำรองฉุกเฉิน..."
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-sans outline-none focus:bg-white focus:border-cyan-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-slate-500 font-semibold font-sans">งบเป้าหมาย (บาท) *</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={goalTarget}
                  onChange={(e) => setGoalTarget(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono font-bold outline-none focus:bg-white focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-500 font-semibold font-sans">ประเภทเป้าหมาย</label>
                <select
                  value={goalType}
                  onChange={(e) => setGoalType(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-sans outline-none focus:bg-white"
                >
                  <option value="ipad">💻 อุปกรณ์การเรียน/ทำงาน</option>
                  <option value="travel">✈️ ท่องเที่ยว/กิจกรรมผ่อนคลาย</option>
                  <option value="emergency">🛡️ สำรองเผื่อภัยฉุกเฉิน</option>
                  <option value="retirement">👴 เกษียณอายุยาวและกองทุน</option>
                  <option value="custom">🌟 กำหนดเอง / อื่นๆ</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-500 font-semibold font-sans">กำหนดเดดไลน์ที่เป้าหมายสำเร็จ</label>
              <input
                type="date"
                value={goalDate}
                onChange={(e) => setGoalDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-mono outline-none focus:bg-white focus:border-cyan-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-sans text-xs font-bold py-2.5 rounded-xl transition shadow-lg flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              สร้าเป้าหมายออมและรับเหรียญ
            </button>
          </form>
        </div>

        {/* Submodule B: Interactive Goals progression cards */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-base font-bold font-sans text-slate-800">แผงออมเงินและแลกพานิชย์ทองคำ ({goals.length} เป้าหมาย)</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.length === 0 ? (
              <div className="col-span-2 py-12 text-center text-slate-400 bg-white border border-slate-100 rounded-3xl">
                <div className="text-4xl">🎯</div>
                <div className="text-sm font-sans font-medium mt-2">ยังไม่มีเป้าหมายการออมเงินในพอร์ตของคุณ</div>
                <p className="text-xs font-sans text-slate-400 max-w-xs mx-auto">กรอกแบบฟอร์มด้านข้างเพื่อริเริ่มเป้าหมายทางการเงินและเริ่มเคลมเหรียญสะสมทอง!</p>
              </div>
            ) : (
              goals.map((g) => {
                const percent = Math.min(100, Math.floor((g.current / g.target) * 100));
                return (
                  <div key={g.id} className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-200 transition">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <span className="text-[9px] text-[#0369A1] font-bold bg-sky-50 px-2 py-0.5 rounded-full font-sans uppercase">
                            {g.type === 'ipad' ? '💻 การเรียน/ทำงาน' : 
                             g.type === 'travel' ? '✈️ เที่ยวฮอลิเดย์' : 
                             g.type === 'emergency' ? '🛡️ กองทุนฉุกเฉิน' : '👴 อนาคต/เกษียณ'}
                          </span>
                          <h3 className="font-extrabold text-slate-800 text-xs mt-1.5 font-sans leading-tight">{g.name}</h3>
                        </div>
                        
                        <div className="flex items-center gap-0.5 bg-slate-50 border p-1 rounded-lg text-[9px] font-mono text-slate-500 shrink-0 font-bold">
                          🥇 {g.rewardCoins} Coins
                        </div>
                      </div>

                      {/* Progression bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xxs font-sans text-slate-400">
                          <span>คืบหน้า {percent}%</span>
                          <span className="font-mono font-bold text-slate-700">
                            {g.current.toLocaleString()} / {g.target.toLocaleString()} บ.
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${percent}%` }} />
                        </div>
                      </div>

                      {/* Targeted weekly calculation alerts */}
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xxs space-y-1 text-slate-500 font-sans">
                        <div className="flex justify-between">
                          <span>🎯 ต้องหยอดออม/วัน:</span>
                          <strong className="text-slate-800 font-mono">{g.dailyNeeded} ฿</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>📅 ต้องหยอดออม/สัปดาห์:</span>
                          <strong className="text-slate-800 font-mono">{g.weeklyNeeded} ฿</strong>
                        </div>
                      </div>
                    </div>

                    {/* Deposit tool panel / Claim Coins zone */}
                    <div className="pt-2 border-t border-slate-100 space-y-2">
                      {percent >= 100 ? (
                        g.rewardClaimed ? (
                          <div className="w-full text-center py-2 bg-slate-50 text-slate-500 text-xxs font-sans font-semibold rounded-xl flex items-center justify-center gap-1">
                            ✔️ ภารกิจสำเร็จและรับเหรียญเรียบร้อยแล้ว!
                          </div>
                        ) : (
                          <button
                            onClick={() => onClaimCoins(g.id)}
                            className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-900 text-xxs font-bold py-2 rounded-xl transition shadow-md flex items-center justify-center gap-1 animate-pulse"
                          >
                            ⭐ เคลม {g.rewardCoins} เหรียญทองรางวัลใหญ่! ⭐
                          </button>
                        )
                      ) : (
                        <form onSubmit={(e) => handleDepositSubmit(e, g.id)} className="flex gap-2">
                          <input
                            type="number"
                            placeholder="เพิ่มเงินออม (฿)"
                            value={depositAmounts[g.id] || ''}
                            onChange={(e) => handleDepositInputChange(g.id, e.target.value)}
                            className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-mono font-semibold flex-1 outline-none focus:bg-white focus:border-emerald-500"
                          />
                          <button
                            type="submit"
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-sans text-xxs font-extrabold px-3 py-1 rounded-lg transition shrink-0"
                          >
                            หยอดออม 💰
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* SECTION 3: Gamified Rewards Store for Redemptions */}
      <div id="gamified_store" className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center gap-2 mb-4">
          <ShoppingBag className="w-5 h-5 text-amber-500" />
          <div>
            <h2 className="text-base font-bold font-sans text-slate-800">ร้านค้าพานิชย์รางวัลตราพิเศษ (Gold Redeem Shop)</h2>
            <p className="text-xs text-slate-400 font-sans">ใช้เหรียญจากการออมมาแลกซื้อฉายาสัญชาติ เพื่อประดับความมั่นใจการเงิน</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {GAMIFICATION_ITEMS.map((item) => {
            const isUnlocked = unlockedItems.includes(item.id);
            const canAfford = coins >= item.price;

            return (
              <div 
                key={item.id} 
                className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3 transition ${
                  isUnlocked 
                    ? 'bg-slate-55 bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200/80 grayscale-30 opacity-70' 
                    : 'bg-white border-slate-100 hover:border-slate-200 shadow-xs'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="text-3xl text-center py-2">{item.imageSlug}</div>
                  <h4 className="font-extrabold text-slate-800 text-xxs font-sans leading-none text-center">{item.name}</h4>
                  <p className="text-[10px] text-slate-400 font-sans text-center leading-relaxed max-w-[150px] mx-auto">
                    {item.description}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="text-center font-mono text-xs font-bold text-amber-500 flex items-center justify-center gap-0.5">
                    Coins: {item.price}
                  </div>
                  
                  {isUnlocked ? (
                    <div className="w-full text-center text-slate-500 font-bold text-xxs font-sans py-1 flex items-center justify-center gap-0.5">
                      ✔️ ปลดล็อกแล้ว
                    </div>
                  ) : (
                    <button
                      onClick={() => onUnlockItem(item.id, item.price)}
                      disabled={!canAfford}
                      className={`w-full font-sans text-xxs font-bold py-1.5 rounded-lg transition text-center ${
                        canAfford 
                          ? 'bg-amber-500 hover:bg-amber-600 text-slate-900 cursor-pointer'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      แลกปลดล็อก 🔑
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
