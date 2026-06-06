/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserType = 'student' | 'worker' | 'family' | 'sme';

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  note: string;
  aiCategorized: boolean;
  paymentMethod: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  current: number;
  targetDate: string;
  dailyNeeded: number;
  weeklyNeeded: number;
  type: 'ipad' | 'travel' | 'emergency' | 'retirement' | 'custom';
  rewardCoins: number;
  rewardClaimed: boolean;
}

export interface FinancialHealthScore {
  score: number;
  status: 'excellent' | 'good' | 'fair' | 'poor';
  breakdown: {
    savingsRate: number;      // % of income saved
    debtRatio: number;        // % of income on debt/unnecessary expenses
    spendingControl: number;  // 0-100 rating
    disciplineCount: number;  // days tracked consistently
  };
}

export interface UnnecessaryExpense {
  id: string;
  name: string;
  category: string;
  amount: number;
  potentialSaving: string;
}

export interface SpendingAnalysis {
  summary: string;
  topCategories: { category: string; amount: number; percentage: number }[];
  unnecessaryExpenses: UnnecessaryExpense[];
  costReductionAdvice: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export interface NotificationAlert {
  id: string;
  type: 'warning' | 'info' | 'success';
  title: string;
  message: string;
  date: string;
  actionText?: string;
  resolved: boolean;
}

export interface FinancialProfile {
  userType: UserType;
  monthlyBudget: number;
  incomeSource: string;
}
