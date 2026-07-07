import React from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertOctagon,
  Award,
  Info,
  ShieldCheck,
  ZapOff
} from 'lucide-react';
import { SheetRowResult, RegulationType } from '../types';
import { roundTo } from '../utils';

interface EmissionSummaryProps {
  results: SheetRowResult[];
  regulationType: RegulationType;
  column: string;
  o2Value: number | null;
}

export default function EmissionSummary({
  results,
  regulationType,
  column,
  o2Value
}: EmissionSummaryProps) {
  // Filter evaluation rows that actually have a measured value
  const evaluatedRows = results.filter((r) => r.isEvaluation && r.measuredValue !== null && !r.notApplicableReason);
  
  const totalAssessed = evaluatedRows.length;
  const passedCount = evaluatedRows.filter((r) => r.isPassed === true).length;
  const failedCount = evaluatedRows.filter((r) => r.isPassed === false).length;
  const pendingCount = results.filter((r) => r.isEvaluation && r.measuredValue === null).length;
  
  const failingParams = results.filter((r) => r.isEvaluation && r.isPassed === false && !r.notApplicableReason);
  const isO2Exactly7 = o2Value !== null && roundTo(o2Value, 2) === 7.00;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6" id="emission-summary-dashboard">
      {/* 1. Header & Context badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h4 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck size={18} className="text-teal-600" />
            <span>Tóm tắt kết luận chung</span>
          </h4>
          <p className="text-slate-400 text-xs mt-0.5">
            Báo cáo đánh giá tổng hợp mức độ tuân thủ quy chuẩn bảo vệ môi trường
          </p>
        </div>
        <div className="text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 font-bold self-start sm:self-center">
          Quy chuẩn áp dụng: <span className="text-teal-700">{regulationType === 'QCVN_19_2009' ? 'QCVN 19:2009' : 'QCVN 19:2024'}</span> (Cột {column})
        </div>
      </div>

      {/* 2. Visual Outcome Cards */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
        
        {/* Compliance verdict banner */}
        <div className="md:col-span-5 flex flex-col justify-center">
          {totalAssessed === 0 ? (
            <div className="bg-slate-100 text-slate-500 rounded-xl p-5 text-center text-xs font-bold border border-slate-200 flex flex-col items-center justify-center h-full min-h-[140px]">
              <AlertOctagon size={24} className="text-slate-400 mb-2" />
              <span>CHƯA CÓ DỮ LIỆU</span>
              <p className="text-[10px] font-normal text-slate-400 mt-1">
                Vui lòng nhập kết quả đo đạc (Cđo) để hệ thống bắt đầu tính toán đánh giá.
              </p>
            </div>
          ) : failedCount > 0 ? (
            <div className="bg-rose-600 text-white rounded-xl p-5 space-y-2 shadow-xs flex flex-col justify-between h-full min-h-[140px] relative overflow-hidden">
              <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-10">
                <XCircle size={100} />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider bg-rose-700 text-rose-100 px-2 py-0.5 rounded self-start inline-block">
                  PHÂN TÍCH CHUYÊN MÔN
                </span>
                <div className="font-extrabold text-sm md:text-base flex items-center gap-1.5 pt-1">
                  <XCircle size={20} className="text-rose-100 shrink-0" />
                  <span>KẾT LUẬN: KHÔNG ĐẠT</span>
                </div>
              </div>
              <p className="text-[11px] text-rose-100 leading-relaxed font-medium">
                Hệ thống ghi nhận có <strong className="text-white font-extrabold">{failedCount} chỉ tiêu vượt mức cho phép</strong>. Cơ sở cần ngay lập tức kiểm tra hiệu suất vận hành lò và hệ thống xử lý (CEMS/scrubber).
              </p>
            </div>
          ) : (
            <div className="bg-emerald-600 text-white rounded-xl p-5 space-y-2 shadow-xs flex flex-col justify-between h-full min-h-[140px] relative overflow-hidden">
              <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-10">
                <Award size={100} />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-700 text-emerald-100 px-2 py-0.5 rounded self-start inline-block">
                  PHÂN TÍCH CHUYÊN MÔN
                </span>
                <div className="font-extrabold text-sm md:text-base flex items-center gap-1.5 pt-1">
                  <CheckCircle2 size={20} className="text-emerald-100 shrink-0" />
                  <span>KẾT LUẬN: ĐẠT QUY CHUẨN</span>
                </div>
              </div>
              <p className="text-[11px] text-emerald-100 leading-relaxed font-medium">
                Tất cả chỉ tiêu được nạp số liệu đều có nồng độ xả thải thấp hơn giới hạn cho phép. Vận hành lò đốt an toàn và thân thiện với môi trường.
              </p>
            </div>
          )}
        </div>

        {/* Quantities summary counters */}
        <div className="md:col-span-7 grid grid-cols-3 gap-3">
          {/* Passed Counter */}
          <div className="bg-emerald-50/50 rounded-xl p-3 border border-emerald-100/80 flex flex-col justify-between">
            <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">
              Chỉ tiêu Đạt
            </span>
            <div className="mt-2">
              <span className="text-2xl font-black text-emerald-600 font-mono">
                {passedCount}
              </span>
              <span className="text-[10px] text-slate-400 block font-medium mt-0.5">chỉ tiêu</span>
            </div>
          </div>

          {/* Failed Counter */}
          <div className={`rounded-xl p-3 border flex flex-col justify-between ${
            failedCount > 0 ? 'bg-rose-50/50 border-rose-100/80' : 'bg-slate-50/50 border-slate-100'
          }`}>
            <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">
              Chỉ tiêu Vượt
            </span>
            <div className="mt-2">
              <span className={`text-2xl font-black font-mono ${
                failedCount > 0 ? 'text-rose-600 animate-pulse' : 'text-slate-400'
              }`}>
                {failedCount}
              </span>
              <span className="text-[10px] text-slate-400 block font-medium mt-0.5">chỉ tiêu</span>
            </div>
          </div>

          {/* Pending Counter */}
          <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-100 flex flex-col justify-between">
            <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">
              Chờ nhập liệu
            </span>
            <div className="mt-2">
              <span className="text-2xl font-black text-slate-500 font-mono">
                {pendingCount}
              </span>
              <span className="text-[10px] text-slate-400 block font-medium mt-0.5">thông số</span>
            </div>
          </div>
        </div>

      </div>

      {/* 3. Conditional Info Alerts */}
      <div className="space-y-3" id="summary-alerts-list">
        {/* Specific O2 annotation for QCVN 19:2024 */}
        {regulationType === 'QCVN_19_2024' && (
          isO2Exactly7 ? (
            <div className="bg-teal-50 border border-teal-100/60 rounded-xl p-4 flex gap-3 text-xs text-teal-950">
              <ZapOff size={18} className="text-teal-600 shrink-0 mt-0.5" />
              <div>
                <strong>Lưu ý về Oxy tham chiếu:</strong> Không phát sinh hiệu chỉnh oxy vì O₂ đo được thô trùng khớp hoàn toàn với O₂ tham chiếu quy định trong quy chuẩn (7.0%). Nồng độ sau hiệu chỉnh (Ckq) bằng đúng kết quả phân tích phòng thử nghiệm (Cđo).
              </div>
            </div>
          ) : (
            o2Value !== null && (
              <div className="bg-sky-50 border border-sky-100/60 rounded-xl p-4 flex gap-3 text-xs text-sky-950">
                <Info size={18} className="text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Thông tin chuyển đổi Oxy:</strong> O₂ đo thực tế đạt <strong className="text-sky-800">{o2Value}%</strong>. Do khác biệt so với mức O₂ tham chiếu 7%, nồng độ phát thải thực tế đã được hiệu chỉnh quy chuẩn về điều kiện tiêu chuẩn Ckq để đảm bảo tính công bằng và chống pha loãng khí xả.
                </div>
              </div>
            )
          )
        )}

        {/* Exceedance Parameters Breakdown Checklist */}
        {failedCount > 0 && (
          <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 space-y-2 text-xs text-rose-950">
            <div className="font-extrabold text-rose-900 flex items-center gap-1.5 uppercase text-[10px] tracking-wide">
              <span>Danh sách chỉ tiêu gây vượt quy chuẩn:</span>
            </div>
            <ul className="list-disc pl-5 space-y-1 font-medium">
              {failingParams.map((item) => (
                <li key={item.paramKey}>
                  <strong className="text-rose-950">{item.label}:</strong> Vượt giới hạn{' '}
                  <strong className="text-rose-700">+{roundTo(item.exceedPercent || 0)}%</strong> (Nồng độ thực tế quy đổi: {roundTo(item.calculatedValue || 0)} so với giới hạn {regulationType === 'QCVN_19_2009' ? roundTo(item.effectiveLimit || 0) : item.referenceLimit} {item.unit})
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
