/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { NotificationAlert } from '../types';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Trash2, 
  Sparkles,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface AlertsPanelProps {
  alerts: NotificationAlert[];
  onResolveAlert: (id: string) => void;
  onClearAllAlerts: () => void;
  onViewAnalysisClick: () => void;
  onViewGoalsClick: () => void;
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({
  alerts,
  onResolveAlert,
  onClearAllAlerts,
  onViewAnalysisClick,
  onViewGoalsClick
}) => {
  const unresolvedAlerts = alerts.filter(a => !a.resolved);
  const resolvedAlerts = alerts.filter(a => a.resolved);

  const handleActionClick = (alert: NotificationAlert) => {
    onResolveAlert(alert.id);
    if (alert.actionText?.includes('AI')) {
      onViewAnalysisClick();
    } else {
      onViewGoalsClick();
    }
  };

  return (
    <div id="alerts_notification_panel_view" className="space-y-6">
      
      {/* Overview stats header */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-orange-100 p-3 rounded-2xl text-orange-500">
            <Bell className="w-6 h-6 animate-swing" style={{ transformOrigin: 'top center' }} />
          </div>
          <div>
            <h1 className="text-lg font-bold font-sans text-slate-800">หน้าแจ้งเตือนอัจฉริยะ (AI Warning Center)</h1>
            <p className="text-xs text-slate-400 font-sans">รับคำเตือนเรื่องแผนการผ่อนชำระ ความเสี่ยงเมื่อเริ่มใช้งบเกิน หรือทริกประหยัดเงินด่วน</p>
          </div>
        </div>

        <button
          onClick={onClearAllAlerts}
          className="text-xs text-slate-500 hover:text-rose-600 bg-slate-50 hover:bg-slate-100 border border-slate-200/50 px-3.5 py-1.5 rounded-xl font-sans font-semibold transition"
        >
          ล้างแจ้งเตือนทั้งหมด
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Unresolved / Live warnings list (Col span 2) */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-bold text-slate-800 font-sans tracking-wide uppercase">แจ้งเตือนยังไม่ได้แก้ไข ({unresolvedAlerts.length})</h2>
          
          {unresolvedAlerts.length === 0 ? (
            <div className="py-16 text-center text-slate-400 bg-white border border-slate-100 rounded-3xl space-y-3">
              <div className="text-4xl">🕊️✨</div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-800 text-sm font-sans">คลังสุขภาพการเงินเงียบสงบ ไร้ปัญหา!</h4>
                <p className="text-slate-400 text-xs font-sans max-w-sm mx-auto">
                  คะแนนสุขภาพการเงินของคุณควบคุมได้อย่างดีเยี่ยม ไม่มีบิลล่าช้าหรือยอดช้อปฉุกเฉินสะสมค้างสะท้อนสติ
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {unresolvedAlerts.map((a) => (
                <div key={a.id} className={`p-5 bg-white rounded-3xl border shadow-xs transition duration-150 relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
                  a.type === 'warning' ? 'border-orange-100 bg-gradient-to-r from-orange-50/20 to-white' : 
                  a.type === 'success' ? 'border-emerald-100 bg-gradient-to-r from-emerald-50/20 to-white' :
                  'border-blue-100 bg-gradient-to-r from-blue-50/20 to-white'
                }`}>
                  <div className="flex gap-4 items-start">
                    <span className={`p-3 rounded-2xl text-base shrink-0 ${
                      a.type === 'warning' ? 'bg-orange-100 text-orange-600' : 
                      a.type === 'success' ? 'bg-emerald-100 text-emerald-600' : 
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {a.type === 'warning' ? <AlertTriangle className="w-5 h-5 animate-pulse" /> : 
                       a.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : 
                       <Info className="w-5 h-5" />}
                    </span>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-slate-800 text-sm font-sans leading-none">{a.title}</h3>
                        <span className="text-[9px] text-slate-400 font-mono">{a.date}</span>
                      </div>
                      <p className="text-slate-600 text-xs font-sans leading-relaxed">
                        {a.message}
                      </p>
                    </div>
                  </div>

                  {a.actionText && (
                    <button
                      onClick={() => handleActionClick(a)}
                      className="px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 text-xxs font-bold font-sans rounded-xl shadow-xs transition duration-150 shrink-0 self-end sm:self-center flex items-center gap-0.5"
                    >
                      <span>{a.actionText}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Resolved list sidebar / Informational hints */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-800 font-sans tracking-wide uppercase">จัดการแก้ไขเสร็จสิ้น ({resolvedAlerts.length})</h2>
          
          <div className="bg-white rounded-3xl p-5 border border-slate-100 space-y-4">
            {resolvedAlerts.length === 0 ? (
              <p className="text-xxs text-slate-400 font-sans text-center py-6">
                ไม่มีประวัติแจ้งเตือนที่ได้รับการแก้ไขในเซสชันนี้
              </p>
            ) : (
              <div className="space-y-2.5 max-h-[250px] overflow-y-auto pr-1">
                {resolvedAlerts.map((a) => (
                  <div key={a.id} className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between text-xxs font-sans text-slate-500">
                    <span className="font-semibold truncate max-w-[150px]">{a.title}</span>
                    <span className="text-[#10B981] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                      ✔️ สำเร็จ
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="p-4 bg-slate-50 border border-slate-200/50 rounded-2xl space-y-2 text-slate-500 leading-normal text-xxs font-sans">
              <strong className="text-slate-700 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                ความปลอดภัยและความเสี่ยงการล่ม
              </strong>
              <span>
                เมื่อมีการบันทึกรายจ่ายหมวดเครื่องดื่ม การช้อปสะสม หรือบุฟเฟต์เกิน 3 รายการขึ้นไป AI จะทำหน้าที่ลั่นเสียงแจ้งเตือนอัตโนมัติ เพื่อคุมสภาพงบให้คุณทันทีก่อนจ่ายซ้ำ
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
