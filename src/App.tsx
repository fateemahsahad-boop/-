/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { UserType, Transaction, SavingsGoal, ChatMessage, NotificationAlert } from './types';
import { 
  INITIAL_PROFILE, 
  INITIAL_TRANSACTIONS, 
  INITIAL_SAVINGS_GOALS, 
  INITIAL_ALERTS, 
  calculateHealthScore 
} from './mockData';
import { Dashboard } from './components/Dashboard';
import { TransactionsPage } from './components/TransactionsPage';
import { AIAnalysisDetail } from './components/AIAnalysisDetail';
import { SavingsGoalsPanel } from './components/SavingsGoalsPanel';
import { AICoachChat } from './components/AICoachChat';
import { AlertsPanel } from './components/AlertsPanel';

import { 
  BarChart3, 
  PlusCircle, 
  BrainCircuit, 
  PiggyBank, 
  MessageSquareCode, 
  BellRing,
  Award,
  Wallet,
  Sparkles,
  Bot
} from 'lucide-react';

export default function App() {
  // Current active user stage profile
  const [userType, setUserType] = useState<UserType>('worker');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'analysis' | 'goals' | 'coach' | 'alerts'>('dashboard');

  // Multi-portfolio map mapping states to life-stages so users can switch back & forth
  const [transactionsMap, setTransactionsMap] = useState<Record<UserType, Transaction[]>>(INITIAL_TRANSACTIONS);
  const [goalsMap, setGoalsMap] = useState<Record<UserType, SavingsGoal[]>>(INITIAL_SAVINGS_GOALS);
  const [chatHistoryMap, setChatHistoryMap] = useState<Record<UserType, ChatMessage[]>>({
    student: [],
    worker: [],
    family: [],
    sme: []
  });

  // Global game state attributes
  const [coins, setCoins] = useState(150); // Start with 150 default coins
  const [unlockedItems, setUnlockedItems] = useState<string[]>([]);
  const [alerts, setAlerts] = useState<NotificationAlert[]>(INITIAL_ALERTS);

  // Active getters
  const activeTransactions = transactionsMap[userType];
  const activeGoals = goalsMap[userType];
  const activeChatHistory = chatHistoryMap[userType];

  // Recalculate health score on-the-fly based on active portfolio
  const budgetPrereq = userType === 'sme' ? 90000 : userType === 'family' ? 65000 : userType === 'student' ? 12000 : 35000;
  const healthScore = calculateHealthScore(activeTransactions, budgetPrereq);

  // Toggle user groups and keep view updated
  const handleUserTypeToggle = (type: UserType) => {
    setUserType(type);
    
    // Push mini alert noting successful segment transition
    const groupName = type === 'student' ? 'หมวดวัยเรียน' : type === 'worker' ? 'คนทำงานประจำ' : type === 'family' ? 'ครอบครัว' : 'ผู้ประกอบการ SME';
    const transitionAlert: NotificationAlert = {
      id: `trans_${Date.now()}`,
      type: 'info',
      title: 'จัดเตรียมโปรไฟล์อัจฉริยะ',
      message: `เปลี่ยนพอร์ตการออมเข้าสู่ ${groupName} สมกรอง AI และคะแนนความแข็งแรงของระบบจัดสรรให้เข้าวิถีชีวิตสเปกนี้เสร็จสมบูรณ์!`,
      date: new Date().toISOString().split('T')[0],
      resolved: false
    };
    setAlerts(prev => [transitionAlert, ...prev]);
  };

  // Transaction mutation modifiers
  const handleAddTransaction = (newTx: Omit<Transaction, 'id' | 'aiCategorized'> & { id?: string; aiCategorized?: boolean }) => {
    const tx: Transaction = {
      ...newTx,
      id: newTx.id || `tx_add_${Date.now()}`,
      aiCategorized: newTx.aiCategorized ?? false
    };

    setTransactionsMap(prev => {
      const updatedList = [tx, ...prev[userType]];
      return { ...prev, [userType]: updatedList };
    });

    // Award +5 coins for tracking discipline!
    setCoins(prev => prev + 10);

    // Auto push a beautiful success alert for tracking
    const alert: NotificationAlert = {
      id: `alt_tx_${Date.now()}`,
      type: 'success',
      title: 'บันทึกรายการเพิ่มทุนเสร็จสิ้น',
      message: `คุณเพิ่มบันทึกรายการหมวด: ${tx.category} จำนวนเงิน ${tx.amount.toLocaleString()} บาทสำเร็จ รับโบนัสรวดเร็ว +10 Coins 🪙`,
      date: tx.date,
      resolved: false
    };
    setAlerts(prev => [alert, ...prev]);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactionsMap(prev => {
      const filtered = prev[userType].filter(t => t.id !== id);
      return { ...prev, [userType]: filtered };
    });
  };

  // Savings Goal modifiers
  const handleAddGoal = (newGoal: Omit<SavingsGoal, 'id' | 'current' | 'rewardClaimed'>) => {
    const goal: SavingsGoal = {
      ...newGoal,
      id: `goal_add_${Date.now()}`,
      current: 0,
      rewardClaimed: false
    };

    setGoalsMap(prev => {
      const updatedList = [goal, ...prev[userType]];
      return { ...prev, [userType]: updatedList };
    });

    // Alert notification of target set
    const alert: NotificationAlert = {
      id: `alt_gl_${Date.now()}`,
      type: 'info',
      title: 'ริเริ่มเป้าหมายสร้างวินัย',
      message: `สร้างภารกิจประดับเหรียญแล้ว: "${goal.name}" ตั้งตารอเฉลองความสำเร็จเพื่อประดับคอลเลกชันกุนซือการเงิน!`,
      date: new Date().toISOString().split('T')[0],
      resolved: false
    };
    setAlerts(prev => [alert, ...prev]);
  };

  const handleDepositGoal = (id: string, amount: number) => {
    setGoalsMap(prev => {
      const list = prev[userType].map(g => {
        if (g.id === id) {
          const newCurrent = Math.min(g.target, g.current + amount);
          return { ...g, current: newCurrent };
        }
        return g;
      });
      return { ...prev, [userType]: list };
    });

    // If fully funded, push a triumphant warning notification
    const matchedGoal = activeGoals.find(g => g.id === id);
    if (matchedGoal && (matchedGoal.current + amount) >= matchedGoal.target) {
      const successGoalAlert: NotificationAlert = {
        id: `alt_full_${Date.now()}`,
        type: 'success',
        title: 'เป้าหมายออมเงินเต็มสมบูรณ์! 🎉',
        message: `คุณออมเงินเป้าหมาย "${matchedGoal.name}" ครบ 100% แล้ว! แวะหน้าเป้าหมายการเงินเพื่อเคลมยอดเหรียญของคุณโดยด่วน`,
        date: new Date().toISOString().split('T')[0],
        resolved: false
      };
      setAlerts(prev => [successGoalAlert, ...prev]);
    }
  };

  const handleClaimCoins = (id: string) => {
    const targetedGoal = activeGoals.find(g => g.id === id);
    if (!targetedGoal || targetedGoal.rewardClaimed) return;

    // Credit coins
    setCoins(prev => prev + targetedGoal.rewardCoins);

    // Update goal map to flagged claimed
    setGoalsMap(prev => {
      const list = prev[userType].map(g => {
        if (g.id === id) {
          return { ...g, rewardClaimed: true };
        }
        return g;
      });
      return { ...prev, [userType]: list };
    });

    const alert: NotificationAlert = {
      id: `alt_clm_${Date.now()}`,
      type: 'success',
      title: 'เคลมเหรียญทองสำเร็จเรียบร้อย',
      message: `ยินดีประดับชัยชนะ! คุณได้รับโบนัสก้อนโต +${targetedGoal.rewardCoins} Coins แวะตลาดตรารางวัลเพื่อปลดชุดของขวัญโปรดปรานยามนี้`,
      date: new Date().toISOString().split('T')[0],
      resolved: true
    };
    setAlerts(prev => [alert, ...prev]);
  };

  // Gamification redemptions store resolver
  const handleUnlockItem = (itemId: string, price: number) => {
    if (coins < price) return;
    setCoins(prev => prev - price);
    setUnlockedItems(prev => [...prev, itemId]);

    const alert: NotificationAlert = {
      id: `alt_red_${Date.now()}`,
      type: 'success',
      title: 'ปลดล็อกตราเกียรติยศใหม่สำเร็จ! 🎖️',
      message: `แลกซื้อฉายาสัญชาติเข้าเซฟกล่องของคุณสมบูรณ์ เสริมแรงส่งเสริมวินัยเก็บออมให้ทะลุกราฟ!`,
      date: new Date().toISOString().split('T')[0],
      resolved: false
    };
    setAlerts(prev => [alert, ...prev]);
  };

  // Chatbot helpers
  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `uc_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
    };

    // Update immediate history list
    setChatHistoryMap(prev => {
      const list = [...prev[userType], userMsg];
      return { ...prev, [userType]: list };
    });

    // Make POST req to backend proxying Gemini chatbot API
    const response = await fetch('/api/gemini/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: text,
        history: activeChatHistory,
        userType
      })
    });

    if (!response.ok) {
      throw new Error('ระบบเซิร์ฟเวอร์ AI ล้มเหลวไม่สามารถป้อนข้อความตอบกลับได้');
    }

    const data = await response.json();
    const botMsg: ChatMessage = {
      id: `bc_${Date.now()}`,
      sender: 'bot',
      text: data.text,
      timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistoryMap(prev => {
      const list = [...prev[userType], botMsg];
      return { ...prev, [userType]: list };
    });
  };

  const handleClearChatHistory = () => {
    setChatHistoryMap(prev => ({ ...prev, [userType]: [] }));
  };

  // Notification center modifiers
  const handleResolveAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true } : a));
  };

  const handleClearAllAlerts = () => {
    setAlerts([]);
  };

  const menuItems = [
    { id: 'dashboard', label: 'สรุปวิสัยทัศน์ แดชบอร์ด', icon: BarChart3 },
    { id: 'transactions', label: 'บันทึกบิล & สแกนสลิป', icon: PlusCircle },
    { id: 'analysis', label: 'คำแนะนำการเงิน AI', icon: BrainCircuit },
    { id: 'goals', label: 'รางวัลออมทองกิมมิก', icon: PiggyBank },
    { id: 'coach', label: 'ปรึกษา AI โค้ดห้องแชท', icon: MessageSquareCode },
    { id: 'alerts', label: 'เตือนอัจฉริยะ', icon: BellRing, badge: alerts.filter(a => !a.resolved).length }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col md:flex-row antialiased">
      
      {/* SIDEBAR NAVIGATION: Flat modern structural layout */}
      <aside className="w-full md:w-72 bg-slate-900 text-white shrink-0 md:sticky md:top-0 md:h-screen flex flex-col justify-between py-6 px-4 border-r border-slate-800 z-30">
        
        {/* Brand visual identity header */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-3">
            <div className="bg-cyan-500 p-2.5 rounded-2xl text-slate-950 shadow-md transform rotate-3">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <div className="font-display font-extrabold text-lg tracking-tight select-none">
                AI <span className="text-cyan-400">FINANCIAL</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium font-sans select-none tracking-widest uppercase">
                ผู้ช่วยการเงินอัจฉริยะ
              </p>
            </div>
          </div>

          {/* Nav links */}
          <nav className="space-y-1.5 pt-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav_btn_${item.id}`}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition duration-150 text-xs font-sans font-semibold select-none text-left ${
                    isActive 
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg' 
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-slate-900 text-cyan-400' : 'bg-rose-500 text-white animate-pulse'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer info in sidebar */}
        <div className="mt-8 border-t border-slate-800/80 pt-4 px-3 space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center p-1.5 bg-slate-800 rounded-lg text-cyan-400 shrink-0 border border-slate-700/50">
              <Bot className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-xxs text-slate-400 font-sans block leading-none">กำลังจำลองในสิทธิ์:</span>
              <span className="font-bold font-sans text-xxs text-cyan-300 block truncate">
                {userType === 'student' ? '🎓 นักเรียนนักศึกษา' : 
                 userType === 'worker' ? '💻 วัยทำงานประจำ' : 
                 userType === 'family' ? '🏠 การเงินครอบครัว' : '📦 SME / พ่อค้าแม่ค้า'}
              </span>
            </div>
          </div>
          <div className="text-[10px] text-slate-500 font-sans">
            AI Financial Assistant © 2026<br />
            Powered by Google Gemini 3.5
          </div>
        </div>

      </aside>

      {/* CONTENT AREA: Displays current reactive view block */}
      <main className="flex-1 overflow-x-hidden py-6 md:py-8 px-4 md:px-10 space-y-6">
        
        {/* Active main layouts */}
        {activeTab === 'dashboard' && (
          <Dashboard 
            userType={userType}
            setUserType={handleUserTypeToggle}
            transactions={activeTransactions}
            goals={activeGoals}
            healthScore={healthScore}
            alerts={alerts}
            onAddTransactionClick={() => setActiveTab('transactions')}
            onViewAnalysisClick={() => setActiveTab('analysis')}
            onViewGoalsClick={() => setActiveTab('goals')}
            coins={coins}
          />
        )}

        {activeTab === 'transactions' && (
          <TransactionsPage 
            transactions={activeTransactions}
            onAddTransaction={handleAddTransaction}
            onDeleteTransaction={handleDeleteTransaction}
            userType={userType}
          />
        )}

        {activeTab === 'analysis' && (
          <AIAnalysisDetail 
            transactions={activeTransactions}
            userType={userType}
            monthlyBudget={budgetPrereq}
          />
        )}

        {activeTab === 'goals' && (
          <SavingsGoalsPanel 
            goals={activeGoals}
            onAddGoal={handleAddGoal}
            onDepositGoal={handleDepositGoal}
            onClaimCoins={handleClaimCoins}
            coins={coins}
            onUnlockItem={handleUnlockItem}
            unlockedItems={unlockedItems}
          />
        )}

        {activeTab === 'coach' && (
          <AICoachChat 
            userType={userType}
            chatHistory={activeChatHistory}
            onSendMessage={handleSendMessage}
            onClearHistory={handleClearChatHistory}
          />
        )}

        {activeTab === 'alerts' && (
          <AlertsPanel 
            alerts={alerts}
            onResolveAlert={handleResolveAlert}
            onClearAllAlerts={handleClearAllAlerts}
            onViewAnalysisClick={() => setActiveTab('analysis')}
            onViewGoalsClick={() => setActiveTab('goals')}
          />
        )}

      </main>

    </div>
  );
}
