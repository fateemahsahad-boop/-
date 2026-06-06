/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Transaction, SavingsGoal, NotificationAlert, UserType, FinancialHealthScore, FinancialProfile } from './types';

export const INITIAL_PROFILE: FinancialProfile = {
  userType: 'worker',
  monthlyBudget: 35000,
  incomeSource: 'เงินเดือนประจำ + งานฟรีแลนซ์'
};

// Initial transactions for workers
export const INITIAL_TRANSACTIONS: Record<UserType, Transaction[]> = {
  student: [
    {
      id: 'tx1',
      date: '2026-06-01',
      amount: 8000,
      type: 'income',
      category: 'เงินเดือน/ค่าขนม',
      note: 'เงินเดือนจากผู้ปกครอง',
      aiCategorized: false,
      paymentMethod: 'โอนผ่านธนาคาร'
    },
    {
      id: 'tx2',
      date: '2026-06-02',
      amount: 2500,
      type: 'income',
      category: 'งานเสริม/ฟรีแลนซ์',
      note: 'สอนพิเศษรายชั่วโมง',
      aiCategorized: false,
      paymentMethod: 'โอนผ่านธนาคาร'
    },
    {
      id: 'tx3',
      date: '2026-06-03',
      amount: 199,
      type: 'expense',
      category: 'ความบันเทิง',
      note: 'เติมสกินเกมออนไลน์',
      aiCategorized: true,
      paymentMethod: 'TrueMoney Wallet'
    },
    {
      id: 'tx4',
      date: '2026-06-04',
      amount: 350,
      type: 'expense',
      category: 'สังสรรค์/จัดเต็ม',
      note: 'กินชาบูบุฟเฟต์กับเพื่อนร่วมสาขา',
      aiCategorized: true,
      paymentMethod: 'สแกน QR Code'
    },
    {
      id: 'tx5',
      date: '2026-06-05',
      amount: 140,
      type: 'expense',
      category: 'เครื่องดื่ม/กาแฟ',
      note: 'ชาเขียวสตาร์บัคส์หวานปกติ',
      aiCategorized: true,
      paymentMethod: 'สแกน QR Code'
    },
    {
      id: 'tx6',
      date: '2026-06-05',
      amount: 450,
      type: 'expense',
      category: 'การเรียน/อุปกรณ์',
      note: 'หนังสือติวสอบโทอิคเล่มล่าสุด',
      aiCategorized: false,
      paymentMethod: 'เงินสด'
    }
  ],
  worker: [
    {
      id: 'tx1',
      date: '2026-06-01',
      amount: 32000,
      type: 'income',
      category: 'เงินเดือน',
      note: 'เงินเดือนประจำจากบริษัทโฆษณา',
      aiCategorized: false,
      paymentMethod: 'โอนผ่านธนาคาร'
    },
    {
      id: 'tx2',
      date: '2026-06-02',
      amount: 5500,
      type: 'income',
      category: 'งานเสริม/ฟรีแลนซ์',
      note: 'ออกแบบคีย์วิชวลลูกค้าเอเจนซี่',
      aiCategorized: true,
      paymentMethod: 'โอนผ่านธนาคาร'
    },
    {
      id: 'tx3',
      date: '2026-06-03',
      amount: 8500,
      type: 'expense',
      category: 'ที่อยู่อาศัย',
      note: 'ค่าเช่าคอนโด ประจำเดือนมิถุนายน',
      aiCategorized: false,
      paymentMethod: 'โอนผ่านธนาคาร'
    },
    {
      id: 'tx4',
      date: '2026-06-04',
      amount: 420,
      type: 'expense',
      category: 'สังสรรค์/จัดเต็ม',
      note: 'ทานส้มตำปิ้งย่างมื้อเย็น',
      aiCategorized: true,
      paymentMethod: 'สแกน QR Code'
    },
    {
      id: 'tx5',
      date: '2026-06-05',
      amount: 250,
      type: 'expense',
      category: 'ความบันเทิง',
      note: 'ค่าสมาชิก Netflix รายเดือน (แชร์กับครอบครัว)',
      aiCategorized: true,
      paymentMethod: 'บัตรเครดิต'
    },
    {
      id: 'tx6',
      date: '2026-06-05',
      amount: 1200,
      type: 'expense',
      category: 'การเดินทาง',
      note: 'เติมบัตรรถไฟฟ้า BTS 40 เที่ยว',
      aiCategorized: false,
      paymentMethod: 'สแกน QR Code'
    },
    {
      id: 'tx7',
      date: '2026-06-05',
      amount: 1100,
      type: 'expense',
      category: 'ช้อปปิ้ง',
      note: 'คูชั่นแบรนด์ดังเทศกาล 6.6 ก่อนนอน',
      aiCategorized: true,
      paymentMethod: 'บัตรเครดิต'
    }
  ],
  family: [
    {
      id: 'tx1',
      date: '2026-06-01',
      amount: 45000,
      type: 'income',
      category: 'เงินเดือน',
      note: 'เงินเดือนสามีร่วมกองกลาง',
      aiCategorized: false,
      paymentMethod: 'โอนผ่านธนาคาร'
    },
    {
      id: 'tx2',
      date: '2026-06-01',
      amount: 38000,
      type: 'income',
      category: 'เงินเดือน',
      note: 'เงินเดือนภรรยาร่วมกองกลาง',
      aiCategorized: false,
      paymentMethod: 'โอนผ่านธนาคาร'
    },
    {
      id: 'tx3',
      date: '2026-06-02',
      amount: 11000,
      type: 'expense',
      category: 'ที่อยู่อาศัย',
      note: 'ค่าผ่อนบ้าน ประจำเดือนมิถุนายน',
      aiCategorized: false,
      paymentMethod: 'โอนผ่านธนาคาร'
    },
    {
      id: 'tx4',
      date: '2026-06-03',
      amount: 2200,
      type: 'expense',
      category: 'ของใช้ส่วนตัว/ทั่วไป',
      note: 'ซื้อนมผง แพมเพิส เบบี้ wipe',
      aiCategorized: true,
      paymentMethod: 'สแกน QR Code'
    },
    {
      id: 'tx5',
      date: '2026-06-04',
      amount: 1850,
      type: 'expense',
      category: 'สาธารณูปโภค',
      note: 'ค่าน้ำค่าไฟ และเน็ตบ้านความเร็วสูง',
      aiCategorized: true,
      paymentMethod: 'บัตรเครดิต'
    },
    {
      id: 'tx6',
      date: '2026-06-05',
      amount: 3500,
      type: 'expense',
      category: 'สุขภาพ/โรงพยาบาล',
      note: 'พาลูกไปพ่นยารักษาภูมิแพ้คลินิก',
      aiCategorized: true,
      paymentMethod: 'บัตรเครดิต'
    }
  ],
  sme: [
    {
      id: 'tx1',
      date: '2026-06-01',
      amount: 120000,
      type: 'income',
      category: 'ยอดขายธุรกิจ',
      note: 'ยอดขายเสื้อผ้าแฟชั่นผ่านแพลตฟอร์มสตรีมมิ่ง',
      aiCategorized: false,
      paymentMethod: 'โอนผ่านธนาคาร'
    },
    {
      id: 'tx2',
      date: '2026-06-02',
      amount: 25000,
      type: 'expense',
      category: 'ต้นทุนสินค้า',
      note: 'สั่งผ้าตัดเย็บคุณภาพพรีเมียม ประจำล็อต',
      aiCategorized: false,
      paymentMethod: 'โอนผ่านธนาคาร'
    },
    {
      id: 'tx3',
      date: '2026-06-03',
      amount: 15000,
      type: 'expense',
      category: 'ค่าการตลาด',
      note: 'ค่าโฆษณา Facebook และ TikTok Ads ยิงกลุ่มเป้าหมาย',
      aiCategorized: true,
      paymentMethod: 'บัตรเครดิต'
    },
    {
      id: 'tx4',
      date: '2026-06-04',
      amount: 4500,
      type: 'expense',
      category: 'ค่าจัดส่ง/ขนส่ง',
      note: 'เหมาจ่ายพัสดุ Flash Express รายสัปดาห์',
      aiCategorized: true,
      paymentMethod: 'สแกน QR Code'
    },
    {
      id: 'tx5',
      date: '2026-06-05',
      amount: 1500,
      type: 'expense',
      category: 'ใช้จ่ายส่วนตัว',
      note: 'อาหารเย็นปลาดิบและของใช้ส่วนตัว (ดึงเงินร้านออกมาใช้)',
      aiCategorized: true,
      paymentMethod: 'โอนผ่านธนาคาร'
    }
  ]
};

// Initial Savings Goals for Gamification
export const INITIAL_SAVINGS_GOALS: Record<UserType, SavingsGoal[]> = {
  student: [
    {
      id: 'goal1',
      name: 'ซื้อ iPad Air สำหรับเรียนจดโน้ต',
      target: 23000,
      current: 12500,
      targetDate: '2026-08-30',
      dailyNeeded: 110,
      weeklyNeeded: 770,
      type: 'ipad',
      rewardCoins: 500,
      rewardClaimed: false
    },
    {
      id: 'goal2',
      name: 'ทริปเที่ยวพัทยากับกลุ่มเพื่อนสนิท',
      target: 6000,
      current: 3800,
      targetDate: '2026-07-15',
      dailyNeeded: 55,
      weeklyNeeded: 385,
      type: 'travel',
      rewardCoins: 150,
      rewardClaimed: false
    }
  ],
  worker: [
    {
      id: 'goal1',
      name: 'กองทุนสำรองเลี้ยงชีพฉุกเฉิน 6 เดือน',
      target: 90000,
      current: 45000,
      targetDate: '2026-12-31',
      dailyNeeded: 216,
      weeklyNeeded: 1512,
      type: 'emergency',
      rewardCoins: 1000,
      rewardClaimed: false
    },
    {
      id: 'goal2',
      name: 'ทริปดูซากุระโตเกียว ญี่ปุ่น 10 วัน',
      target: 50000,
      current: 20000,
      targetDate: '2027-04-01',
      dailyNeeded: 125,
      weeklyNeeded: 875,
      type: 'travel',
      rewardCoins: 400,
      rewardClaimed: false
    }
  ],
  family: [
    {
      id: 'goal1',
      name: 'เงินดาวน์สำรอง รถยนต์ครอบครัว SUV',
      target: 150000,
      current: 85000,
      targetDate: '2026-11-20',
      dailyNeeded: 388,
      weeklyNeeded: 2716,
      type: 'custom',
      rewardCoins: 1500,
      rewardClaimed: false
    },
    {
      id: 'goal2',
      name: 'กองทุนเริ่มพอร์ตการศึกษาของไอตัวเล็ก',
      target: 100000,
      current: 30000,
      targetDate: '2028-06-01',
      dailyNeeded: 96,
      weeklyNeeded: 672,
      type: 'retirement',
      rewardCoins: 1200,
      rewardClaimed: false
    }
  ],
  sme: [
    {
      id: 'goal1',
      name: 'เงินกระแสเงินสดสำรองสำหรับวันยอดวิกฤต',
      target: 200000,
      current: 120000,
      targetDate: '2026-10-15',
      dailyNeeded: 615,
      weeklyNeeded: 4305,
      type: 'custom',
      rewardCoins: 2000,
      rewardClaimed: false
    },
    {
      id: 'goal2',
      name: 'ซื้อกล้องโปรและชุดจัดไฟไลฟ์สด',
      target: 35000,
      current: 18000,
      targetDate: '2026-07-31',
      dailyNeeded: 309,
      weeklyNeeded: 2163,
      type: 'ipad',
      rewardCoins: 450,
      rewardClaimed: false
    }
  ]
};

// Virtual Shop Rewards (Gamification Shop)
export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  unlocked: boolean;
  type: 'avatar' | 'badge' | 'avatar_style';
  imageSlug: string;
}

export const GAMIFICATION_ITEMS: ShopItem[] = [
  {
    id: 'badge_saving_champion',
    name: 'นักออมเงินดีเด่น (Saving Champion)',
    description: 'เหรียญตราเกียรติยศสำหรับผู้ที่มีวินัยออมติดต่อกัน 7 วัน',
    price: 150,
    unlocked: false,
    type: 'badge',
    imageSlug: '🥇'
  },
  {
    id: 'badge_control_expert',
    name: 'ผู้ชนะกิเลส 6.6 (Control Expert)',
    description: 'ลดรายจ่ายฟุ่มเฟือยหมวดเครื่องดื่มและช้อปปิ้งออนไลน์ลงเกินครึ่งหนึ่ง',
    price: 300,
    unlocked: false,
    type: 'badge',
    imageSlug: '🛡️'
  },
  {
    id: 'avatar_golden_mouse',
    name: 'สติ๊กเกอร์ หนูเหมืองทอง (Golden Mouse Mascot)',
    description: 'มาสคอตหนูขุดคลังทอง คอยเชียร์ให้คุณขุดเงินสำรองฉุกเฉินได้เต็มเร็วขึ้น',
    price: 450,
    unlocked: false,
    type: 'avatar',
    imageSlug: '🐹'
  },
  {
    id: 'avatar_young_rich',
    name: 'สัญชาติ เศรษฐีใหม่ป้ายแดง (Young Billionaire Aura)',
    description: 'มาสคอตออร่าโกลว์ล้อมรอบบอร์ดยอดออม เพิ่มพลังความมั่นใจ',
    price: 800,
    unlocked: false,
    type: 'avatar_style',
    imageSlug: '✨'
  },
  {
    id: 'badge_sme_pioneer',
    name: 'ผู้ประกอบการมือทอง (SME Pioneer)',
    description: 'แยกเงินและคุมค่าโฆษณาได้สมดุล กำไรทะยานปัง',
    price: 600,
    unlocked: false,
    type: 'badge',
    imageSlug: '👑'
  }
];

// Financial Health logic calculator
export function calculateHealthScore(transactions: Transaction[], monthlyBudget: number): FinancialHealthScore {
  const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  
  if (income === 0) {
    return {
      score: 55,
      status: 'fair',
      breakdown: { savingsRate: 0, debtRatio: 50, spendingControl: 50, disciplineCount: transactions.length }
    };
  }

  const savings = income - expense;
  const savingsRate = Math.max(0, Math.floor((savings / income) * 100));
  
  // High expenses on fancy things or unlabelled expenses
  const badSpending = transactions
    .filter(t => t.type === 'expense' && (t.category === 'ช้อปปิ้ง' || t.category === 'เครื่องดื่ม/กาแฟ' || t.category === 'ความบันเทิง' || t.category === 'สังสรรค์/จัดเต็ม' || t.category === 'ใช้จ่ายส่วนตัว'))
    .reduce((sum, t) => sum + t.amount, 0);
  
  const debtRatio = Math.min(100, Math.floor((badSpending / income) * 100));
  
  const budgetRatio = Math.min(100, Math.floor((expense / monthlyBudget) * 100));
  const spendingControl = Math.max(0, 100 - budgetRatio);

  let score = 50; 
  score += Math.min(25, savingsRate * 0.5); // Max +25 from high savings rate
  score += Math.min(25, (100 - debtRatio) * 0.25); // Max +25 from low bad spending
  score += Math.min(25, spendingControl * 0.25); // Max +25 from good budget control
  score += Math.min(15, transactions.length * 2); // Max +15 from consistency

  score = Math.min(100, Math.max(10, Math.floor(score)));

  let status: 'excellent' | 'good' | 'fair' | 'poor' = 'fair';
  if (score >= 85) status = 'excellent';
  else if (score >= 70) status = 'good';
  else if (score >= 45) status = 'fair';
  else status = 'poor';

  return {
    score,
    status,
    breakdown: {
      savingsRate,
      debtRatio,
      spendingControl,
      disciplineCount: Math.min(30, transactions.length)
    }
  };
}

// Prompt suggestions for the coach based on User Segments
export const COACH_PROMPTS: Record<UserType, string[]> = {
  student: [
    'เก็บเงินซื้อ iPad Air ภายใน 2 เดือน ด้วยงบจำกัดทำยังไงได้บ้าง?',
    'ประหยัดเงินค่าบุฟเฟต์ชาบูและกาแฟสตาร์บัคส์ยังไงไม่ให้เครียด?',
    'อยากทำงานพาร์ทไทม์ออนไลน์ช่วงเรียน มีอะไรแนะนำบ้าง?',
    'เริ่มต้นวางแผนเก็บออม 1,000 บาทแรกในชีวิตมหาวิทยาลัย'
  ],
  worker: [
    'มีเงินเดือน 32,000 อยากเริ่มเก็บออมและลงทุนในประหยัดภาษี SSF/RMF เลือกรุ่นไหน?',
    'วิเคราะห์รายจ่าย Netflix บัตรเครดิต และช้อปปิ้งเทศกาล 6.6 เพื่อประหยัดเงิน',
    'วางแผนซื้อทริปเที่ยวญี่ปุ่นงบ 50,000 บาท ภายในปีนี้ คุมรายรับรายจ่ายอย่างไร?',
    'อยากหาทริกคุมค่าอาหารกลางวันและค่าเดินทาง BTS ในแต่ละเดือน'
  ],
  family: [
    'วิธีจัดสรรงบกองกลาง ผ่อนบ้าน และซื้อนมผงอ้อมกอดลูกอย่างฉลาด',
    'วางแผนสร้างกองทุนการศึกษาให้ลูกเริ่มต้นตั้งแต่วันนี้ ลงทุนอะไรดี?',
    'เงินสำรองฉุกเฉินของครอบครัว 3 คน ควรมีเท่าไหร่ และเก็บไว้ที่ไหนดีที่สุด?',
    'ปรึกษาแผนลดหนี้บัตรเครดิตและการผ่อนชำระหนี้บ้านให้หมดเร็วขึ้น'
  ],
  sme: [
    'แยกบัญชีส่วนตัวและบัญชีร้านเสื้อผ้าอย่างไรให้กำไรสุทธิชัดเจนที่สุด?',
    'ต้องการวางแผนบริหารกระแสเงินสดหมุนเวียน (Cash Flow) ยามยอดขายแผ่วลง',
    'ค่าการตลาดใน Facebook/TikTok สูงมาก มีคำแนะนำวิเคราะห์ต้นทุนและกำไรอย่างไร?',
    'อยากหักเงินสำรองเพื่อไปซื้อเซ็ตไฟและสเปกกล้องไลฟ์สด ควรรีบออมด้วยวิธีใด?'
  ]
};

// Intelligence system alerts based on user behavior
export const INITIAL_ALERTS: NotificationAlert[] = [
  {
    id: 'alt1',
    type: 'warning',
    title: 'ระวัง: ใช้จ่ายในหมวดช้อปปิ้งเกินขีดปานกลาง',
    message: 'คุณมียอดใช้จากสลีปช้อปปิ้งและสินค้าลดราคาค่อนข้างสูง คล้ายการซื้อแบบ Impulse Buy เลี่ยงแอปสีส้ม/น้ำเงินก่อนนะ!',
    date: '2026-06-05',
    actionText: 'ดูข้อเสนอแนะ AI',
    resolved: false
  },
  {
    id: 'alt2',
    type: 'info',
    title: 'ภารกิจ: รับเหรียญรางวัลพิเศษ',
    message: 'เป้าหมายและสัปดาห์ออมเงินใกล้จะเต็มเหลืออีกเพียง 10% เท่านั้น มาออมเพิ่ม 100 บาทเพื่อปลดล็อกตรา Saving Champion กันเลย!',
    date: '2026-06-04',
    actionText: 'ออมเพิ่มทันที',
    resolved: false
  },
  {
    id: 'alt3',
    type: 'success',
    title: 'สรุปพฤติกรรมการเงินสัปดาห์นี้',
    message: 'เยี่ยมยอด! เงินคงเหลือในบัญชีของคุณสูงกว่าสัปดาห์ก่อนหน้า 21% คะแนนสุขภาพทางการเงินของคุณขยับขึ้น +4 คะแนน!',
    date: '2026-06-03',
    actionText: 'ดูสถิติสัปดาห์นี้',
    resolved: false
  }
];

// Slips for Demo OCR Scanning triggering Base64 transfers.
// These are descriptive image alternatives with base64/description mock to feed the Gemini model
export const DEMO_SLIPS = [
  {
    id: 'slip_kbank_iced_latte',
    bankName: 'ธนาคารกสิกรไทย (K-Bank)',
    merchantName: 'ร้านกาแฟหอมละมุน',
    amount: 140,
    category: 'เครื่องดื่ม/กาแฟ',
    description: 'สลิปโอนเงิน โอนไป บจก.คอฟฟี่ คาเฟ่ ยอด 140 บาท ลงวันที่ 05 มิ.ย. 2026 เวลา 14:20 น.',
    note: 'บวกฟิน คาราเมล แฟรปเป้',
    imageText: `
    ======================================
              K BANk TRANSFER
    ======================================
    Date: 05 Jun 2026   Time: 14:20:10
    From: นาย เอกรินทร์ คนขยัน (X-1234)
    To: บจก. คอฟฟี่ คาเฟ่ (X-9876) (ร้านกาแฟหอมละมุน)
    
    Amount: 140.00 THB
    Fee: 0.00 THB
    
    Ref No. 20260605A8894123
    Successful Transaction
    ======================================
    `
  },
  {
    id: 'slip_scb_shabu_party',
    bankName: 'ธนาคารไทยพาณิชย์ (SCB)',
    merchantName: 'ชาบูชิ บิวตี้ฟูล',
    amount: 389,
    category: 'สังสรรค์/จัดเต็ม',
    description: 'สลิปโอนเงิน โอนไปยัง บจก.ชาบูกรุ๊ป ยอด 389 บาท วันที่ 04 มิ.ย. 2026 เวลา 19:45 น.',
    note: 'จัดเต็มชิมส้มตำ และเนื้อวากิว',
    imageText: `
    ======================================
               SCB EASY TRANSFER
    ======================================
    Date: 04 Jun 2026   Time: 19:45:32
    From: MR. EKARIN KHONYAN
    To: บูฟเฟต์ ชาบูชิ บิวตี้ (X-4567)
    
    Amount: 389.00 THB
    
    Ref: 016156194532678
    Thank you for choosing SCB Easy App
    ======================================
    `
  },
  {
    id: 'slip_ktb_sme_courier',
    bankName: 'ธนาคารกรุงไทย (Krungthai)',
    merchantName: 'แฟลช เอ็กซ์เพรส สาทร',
    amount: 1550,
    category: 'ค่าจัดส่ง/ขนส่ง',
    description: 'สลิปโอนเงิน จ่ายค่าเหมาพัสดุแม่ค้าออนไลน์ยอด 1,550 บาท วันที่ 03 มิ.ย. 2026 เวลา 11:30 น.',
    note: 'ส่งชุดชีฟองลูกค้า 20 ยูเซอร์',
    imageText: `
    ======================================
                 KRUNGTHAI LIKET
    ======================================
    Date: 03 Jun 2026   Time: 11:30:45
    บัญชีโอนออก: นาย เอกรินทร์ (X-5544)
    บัญชีปลายทาง: โคลส คูเรียร์ บจก. (X-2211)
    
    จำนวนเงิน: 1,550.00 บาท
    
    รหัสตรวจสอบสลิป: KTB-6603113045
    ทำรายการเสร็จสิ้น
    ======================================
    `
  }
];
