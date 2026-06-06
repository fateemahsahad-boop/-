/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Transaction, UserType } from '../types';
import { DEMO_SLIPS } from '../mockData';
import { 
  Plus, 
  Trash2, 
  FileText, 
  Upload, 
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface TransactionsPageProps {
  transactions: Transaction[];
  onAddTransaction: (tx: Omit<Transaction, 'id' | 'aiCategorized'> & { id?: string; aiCategorized?: boolean }) => void;
  onDeleteTransaction: (id: string) => void;
  userType: UserType;
}

export const TransactionsPage: React.FC<TransactionsPageProps> = ({
  transactions,
  onAddTransaction,
  onDeleteTransaction,
  userType
}) => {
  // Manual transaction form state
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState('อาหาร');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('สแกน QR Code');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // UI filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterCategory, setFilterCategory] = useState('all');

  // OCR state
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrResult, setOcrResult] = useState<any>(null);
  const [ocrError, setOcrError] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    'เงินเดือน', 'งานเสริม/ฟรีแลนซ์', 'ยอดขายธุรกิจ', // Incomes
    'ที่อยู่อาศัย', 'อาหาร', 'เครื่องดื่ม/กาแฟ', 'ความบันเทิง', 'สังสรรค์/จัดเต็ม', // Expenses
    'การเดินทาง', 'ช้อปปิ้ง', 'การเรียน/อุปกรณ์', 'สาธารณูปโภค', 'สุขภาพ/โรงพยาบาล',
    'ค่าการตลาด', 'ต้นทุนสินค้า', 'ค่าจัดส่ง/ขนส่ง', 'ใช้จ่ายส่วนตัว'
  ];

  // OCR calling backend helper
  const triggerOcrBackend = async (payload: { imageBase64?: string; simulatedSlipText?: string }) => {
    setOcrLoading(true);
    setOcrError(null);
    setOcrResult(null);

    try {
      const response = await fetch('/api/gemini/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('การประมวลผล OCR ของ AI ขัดข้อง กรุณาลองใหม่อีกครั้ง');
      }

      const result = await response.json();
      setOcrResult(result);
      
      // Auto-populate the manual form with AI categorizations for user approval
      setAmount(result.amount.toString());
      setType('expense');
      setCategory(result.category);
      setNote(`${result.merchantName} (${result.note})`);
    } catch (err: any) {
      setOcrError(err.message || 'เกิดข้อผิดพลาดในการวิเคราะห์สลิป');
    } finally {
      setOcrLoading(false);
    }
  };

  // 1. Trigger OCR via preset mock slips
  const handleSimulateSlipClick = (slipId: string) => {
    const slip = DEMO_SLIPS.find(s => s.id === slipId);
    if (slip) {
      triggerOcrBackend({
        simulatedSlipText: `${slip.bankName}\n${slip.description}\n${slip.imageText}`
      });
    }
  };

  // 2. Drag & Drop or manual file upload
  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setOcrError('กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น (.png, .jpeg, .jpg)');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      triggerOcrBackend({ imageBase64: base64 });
    };
    reader.onerror = () => {
      setOcrError('ไม่สามารถอ่านไฟล์ภาพได้');
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave" || e.type === "drop") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const onUploadAreaClick = () => {
    fileInputRef.current?.click();
  };

  // Submit Add Transaction (Form payload)
  const handleSubmitManual = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('กรุณากรอกจำนวนเงินให้ถูกต้อง');
      return;
    }

    onAddTransaction({
      date,
      amount: parsedAmount,
      type,
      category,
      note: note.trim() || `${type === 'income' ? 'รับเงินเข้า' : 'จ่ายเงินเข้า'} (${category})`,
      paymentMethod,
      aiCategorized: ocrResult ? true : false,
    });

    // Reset manual form
    setAmount('');
    setNote('');
    // Clear OCR state
    setOcrResult(null);
  };

  // Filter transactions based on UI state inputs
  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.note.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || t.type === filterType;
    const matchesCategory = filterCategory === 'all' || t.category === filterCategory;
    return matchesSearch && matchesType && matchesCategory;
  });

  return (
    <div id="transactions_view" className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      
      {/* LEFT COLUMN: Add New Transaction Form & Slip Scanner */}
      <div className="lg:col-span-1.5 xl:col-span-1.5 space-y-6 lg:col-span-2">
        
        {/* Module A: AI Receipt/Slip OCR Scanner */}
        <div id="ocr_scanner_card" className="bg-[#14171D] rounded-3xl p-6 shadow-xl border border-slate-800/80 space-y-4">
          <div className="flex items-center gap-2">
            <div className="bg-cyan-500/10 p-2 rounded-xl text-cyan-400 border border-cyan-500/20">
              <Sparkles className="w-5 h-5 animate-pulse-slow" />
            </div>
            <div>
              <h2 className="text-base font-bold font-sans text-white">เครื่องสแกนสลิปอัจฉริยะ (AI OCR)</h2>
              <p className="text-xxs text-slate-450 font-sans">ลากสลิปธนาคารเพื่อวิเคราะห์คัดแยกหมวดอัตโนมัติ</p>
            </div>
          </div>

          {/* Interactive Drag and Drop Container */}
          <div 
            id="slip_drag_drop_area"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={onUploadAreaClick}
            className={`relative border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
              isDragActive 
                ? 'border-cyan-500 bg-cyan-950/40' 
                : 'border-slate-800 hover:border-slate-700 bg-[#0B0D11]/45'
            }`}
          >
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileInputChange}
              className="hidden" 
              accept="image/*"
            />
            {ocrLoading ? (
              <div className="space-y-3 py-4 flex flex-col items-center">
                <div className="w-10 h-10 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-sans text-cyan-400 font-semibold animate-pulse">Gemini กำลังอ่านรายละเอียดสลิป...</p>
              </div>
            ) : (
              <div className="space-y-2 py-2">
                <div className="bg-slate-800 hover:bg-slate-750 p-3 rounded-full inline-flex text-slate-300 transition border border-slate-700/60">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="text-xs font-semibold text-slate-300 font-sans">
                  วางไฟล์รูปสลิป หรือคลิกเพื่ออัปโหลด
                </div>
                <p className="text-[10px] text-slate-500 font-sans">รองรับภาพโอนเงิน KBank, SCB, Krungthai</p>
              </div>
            )}
          </div>

          {/* Error and OCR results block */}
          {ocrError && (
            <div className="bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl flex items-center gap-2 text-rose-400 text-xs font-sans">
              <XCircle className="w-4 h-4 shrink-0" />
              <span>{ocrError}</span>
            </div>
          )}

          {ocrResult && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-3.5 rounded-xl space-y-1 text-emerald-400 text-xs font-sans">
              <div className="font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>AI ถอดความสำเร็จ! กรอกลงฟอร์มให้คุณแล้ว:</span>
              </div>
              <ul className="list-disc pl-4 space-y-0.5 mt-1 text-slate-300">
                <li>ร้านค้า: <strong className="text-white">{ocrResult.merchantName}</strong></li>
                <li>จำนวนเงิน: <strong className="text-emerald-400">{ocrResult.amount.toLocaleString()} บาท</strong></li>
                <li>หมวดจำแนก: <strong className="text-cyan-400">{ocrResult.category}</strong></li>
              </ul>
            </div>
          )}

          {/* Preset Buttons for Interactive Demo */}
          <div id="mock_slips_presets" className="space-y-2 pt-2 border-t border-slate-800/80">
            <div className="text-[10px] font-semibold text-slate-455 font-sans uppercase">
              หรือคลิกเพื่อสแกนสลิปโอนเงินจำลอง:
            </div>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => handleSimulateSlipClick('slip_kbank_iced_latte')}
                className="text-left p-2.5 bg-[#0B0D11]/55 border border-slate-800/85 hover:bg-slate-800/40 rounded-xl flex items-center justify-between text-xs transition"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">🍵</span>
                  <div>
                    <div className="font-bold text-slate-300">K-Bank: สลิปซื้อลาเต้เย็น</div>
                    <div className="text-[10px] text-slate-550">140 บาท • หมวดเครื่องดื่ม</div>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-cyan-400 bg-cyan-950 border border-cyan-500/30 px-2 py-0.5 rounded-lg">สแกน ⚡</span>
              </button>

              <button
                type="button"
                onClick={() => handleSimulateSlipClick('slip_scb_shabu_party')}
                className="text-left p-2.5 bg-[#0B0D11]/55 border border-slate-800/85 hover:bg-slate-800/40 rounded-xl flex items-center justify-between text-xs transition"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">🥩</span>
                  <div>
                    <div className="font-bold text-slate-300">SCB: สลิปปาร์ตี้หมูปิ้งบาบู</div>
                    <div className="text-[10px] text-slate-550">389 บาท • หมวดสังสรรค์</div>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-cyan-400 bg-cyan-950 border border-cyan-500/30 px-2 py-0.5 rounded-lg">สแกน ⚡</span>
              </button>

              <button
                type="button"
                onClick={() => handleSimulateSlipClick('slip_ktb_sme_courier')}
                className="text-left p-2.5 bg-[#0B0D11]/55 border border-slate-800/85 hover:bg-slate-800/40 rounded-xl flex items-center justify-between text-xs transition"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">📦</span>
                  <div>
                    <div className="font-bold text-slate-300">KTB: สลิปเหมาส่งพัสดุด่วน</div>
                    <div className="text-[10px] text-slate-550">1,550 บาท • หมวด SME ขนส่ง</div>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-cyan-400 bg-cyan-950 border border-cyan-500/30 px-2 py-0.5 rounded-lg">สแกน ⚡</span>
              </button>
            </div>
          </div>
        </div>

        {/* Module B: Manual Form Builder */}
        <div id="manual_form_card" className="bg-[#14171D] rounded-3xl p-6 shadow-xl border border-slate-800/80">
          <h2 className="text-base font-bold font-sans text-white mb-4 flex items-center gap-1.5">
            <Plus className="w-5 h-5 text-slate-300 animate-pulse-slow" />
            เพิ่มบันทึกการเงิน
          </h2>

          <form onSubmit={handleSubmitManual} className="space-y-4">
            {/* Type tabs button */}
            <div className="grid grid-cols-2 gap-2 bg-[#0B0D11] p-1 rounded-xl border border-slate-800/50">
              <button
                type="button"
                onClick={() => setType('expense')}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold font-sans transition flex items-center justify-center gap-1 cursor-pointer ${
                  type === 'expense' ? 'bg-slate-800 text-white shadow-md border border-slate-700/50' : 'text-slate-550'
                }`}
              >
                <TrendingDown className="w-3.5 h-3.5 text-rose-450" />
                รายจ่าย (Expense)
              </button>
              <button
                type="button"
                onClick={() => setType('income')}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold font-sans transition flex items-center justify-center gap-1 cursor-pointer ${
                  type === 'income' ? 'bg-slate-800 text-white shadow-md border border-slate-700/50' : 'text-slate-550'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                รายรับ (Income)
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-1">
              <label className="text-xs text-slate-450 font-semibold font-sans">จำนวนเงิน (บาท) *</label>
              <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full bg-[#0B0D11] border border-slate-800 rounded-xl px-3.5 py-2 text-sm font-mono font-bold text-white focus:bg-[#0F1115] focus:border-cyan-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-slate-450 font-semibold font-sans">หมวดหมู่</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#0B0D11] border border-slate-800 rounded-xl px-3 py-2 text-xs font-sans text-slate-300 outline-none focus:bg-[#0F1115]"
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-450 font-semibold font-sans">ช่องทางชำระ</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full bg-[#0B0D11] border border-slate-800 rounded-xl px-3 py-2 text-xs font-sans text-slate-300 outline-none focus:bg-[#0F1115]"
                >
                  <option value="สแกน QR Code">สแกน QR Code</option>
                  <option value="โอนผ่านธนาคาร">โอนผ่านธนาคาร</option>
                  <option value="บัตรเครดิต">บัตรเครดิต</option>
                  <option value="TrueMoney Wallet">TrueMoney Wallet</option>
                  <option value="เงินสด">เงินสด</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1 col-span-2">
                <label className="text-xs text-slate-450 font-semibold font-sans">วันที่ทำรายการ</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-[#0B0D11] border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-300 outline-none focus:bg-[#0F1115]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-455 font-semibold font-sans">บันทึกเพิ่มเติม</label>
              <input
                type="text"
                placeholder="ระบุ เช่น ติวหนังสือชาบู ยิงแอดธุรกิจ 6.6..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full bg-[#0B0D11] border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-sans text-slate-200 outline-none focus:bg-[#0F1115]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-sans text-xs font-bold py-2.5 rounded-xl transition shadow-lg flex items-center justify-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              บันทึกรายการ {type === 'income' ? 'รายรับ' : 'รายจ่าย'}
            </button>
          </form>
        </div>

      </div>

      {/* RIGHT COLUMN: Interactive Transaction List & Detailed Filter */}
      <div className="lg:col-span-2.5 xl:col-span-2.5 bg-[#14171D] rounded-3xl p-6 shadow-xl border border-slate-800/80 flex flex-col justify-between lg:col-span-2">
        
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
            <div>
              <h2 className="text-lg font-bold font-sans text-white">รายการธุรกรรมครอบคลุม</h2>
              <p className="text-xs text-slate-450 font-sans">กรอง ค้นหา และวิเคราะห์รายรับ/รายจ่ายในพอร์ต</p>
            </div>

            {/* Smart mini stats */}
            <div className="flex items-center gap-2">
              <span className="text-xxs font-mono text-slate-400 bg-slate-900 border border-slate-800/80 px-2 py-1 rounded-lg">
                ค้นพบ {filteredTransactions.length} จาก {transactions.length} รายการ
              </span>
            </div>
          </div>

          {/* Filtering Layout Row */}
          <div id="table_filters" className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="พิมพ์ค้นหาบันทึก..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#0B0D11] border border-slate-800/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 outline-none focus:bg-[#0F1115] focus:border-slate-700 font-sans"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="w-full bg-[#0B0D11] border border-slate-800/80 rounded-xl px-2 py-1.5 text-xs font-sans text-slate-300 outline-none focus:bg-[#0F1115]"
              >
                <option value="all">ทุกประเภทธุรกรรม</option>
                <option value="income">เฉพาะรายรับ</option>
                <option value="expense">เฉพาะรายจ่าย</option>
              </select>
            </div>

            <div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full bg-[#0B0D11] border border-slate-800/80 rounded-xl px-2 py-1.5 text-xs font-sans text-slate-300 outline-none focus:bg-[#0F1115]"
              >
                <option value="all">ทุกหมวดหมู่การเงิน</option>
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Core Table View */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800/80 text-xxs text-slate-455 uppercase tracking-wider font-sans font-bold">
                  <th className="pb-3 pt-1">ประเภท / หมวดหมู่</th>
                  <th className="pb-3 pt-1">บันทึกช่วยจำ</th>
                  <th className="pb-3 pt-1">ช่องทางโอน</th>
                  <th className="pb-3 pt-1 text-right">จำนวนเงิน</th>
                  <th className="pb-3 pt-1 text-center font-semibold text-slate-455">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-500">
                      <div className="text-3xl">🧩</div>
                      <div className="text-xs font-sans font-medium mt-2">ไม่พบธุรกรรมตามเกณฑ์ที่คุณกรองไว้</div>
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((t) => (
                    <tr key={t.id} className="text-xs whitespace-nowrap hover:bg-slate-800/20 transition duration-155">
                      <td className="py-3 items-center">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${t.type === 'income' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          <div>
                            <div className="font-semibold text-white font-sans">{t.category}</div>
                            <div className="text-[10px] text-slate-505 font-mono">{t.date}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 font-sans text-slate-300 max-w-xs truncate" title={t.note}>
                        <div className="flex items-center gap-1">
                          {t.aiCategorized && (
                            <span className="text-[9px] font-bold text-cyan-400 bg-cyan-950/80 border border-cyan-800/40 px-1.5 py-0.2 rounded-md uppercase shrink-0">
                              🤖 AI
                            </span>
                          )}
                          <span>{t.note}</span>
                        </div>
                      </td>

                      <td className="py-3 font-sans text-slate-400">
                        {t.paymentMethod}
                      </td>

                      <td className={`py-3 text-right font-mono font-bold ${
                        t.type === 'income' ? 'text-emerald-400' : 'text-slate-300'
                      }`}>
                        {t.type === 'income' ? '+' : '-'}
                        {t.amount.toLocaleString()} ฿
                      </td>

                      <td className="py-3 text-center">
                        <button
                          onClick={() => onDeleteTransaction(t.id)}
                          className="text-slate-500 hover:text-rose-450 p-1 rounded-lg transition cursor-pointer"
                          title="ลบรายการนี้"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Informative Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-center gap-4 text-xxs text-slate-455 font-sans">
          <span>
            เคล็ดลับ: บันทึกข้อมูลอย่างสม่ำเสมอพฤติกรรมการเงินรายจ่ายจะส่งไปวิเคราะห์ AI แบบออร์แกนิก
          </span>
          <span className="flex items-center gap-1 font-semibold text-cyan-400 font-sans">
            <Sparkles className="w-3 h-3 animate-pulse" />
            ตัวอัปสเกลสลิปด้วย OCR ขยายการจำแนกค่าสถิติทันที
          </span>
        </div>

      </div>

    </div>
  );
};
