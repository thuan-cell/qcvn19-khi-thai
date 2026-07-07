import React from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  Layers,
  Gauge,
  HelpCircle,
  TrendingUp
} from 'lucide-react';
import { SheetRowResult, ParamKey, RegulationType } from '../types';
import { roundTo } from '../utils';

interface EmissionEvaluationPanelProps {
  results: SheetRowResult[];
  regulationType: RegulationType;
  kp: string;
  kv: string;
  o2Value: number | null;
  flowValue: number | null;
}

export default function EmissionEvaluationPanel({
  results,
  regulationType,
  kp,
  kv,
  o2Value,
  flowValue
}: EmissionEvaluationPanelProps) {
  // Filter only evaluation parameters (Dust, CO, SO2, NOx)
  const evalParams = results.filter((r) =>
    [ParamKey.DUST, ParamKey.CO, ParamKey.SO2, ParamKey.NOX].includes(r.paramKey)
  );

  const parsedKp = parseFloat(kp) || 1.0;
  const parsedKv = parseFloat(kv) || 1.0;
  const isO2Exactly7 = o2Value !== null && roundTo(o2Value, 2) === 7.00;

  // Correction multiplier factor for QCVN 19:2024
  let correctionFactorStr = '';
  if (regulationType === 'QCVN_19_2024' && o2Value !== null && o2Value >= 0 && o2Value < 20.9) {
    const factor = (20.9 - 7) / (20.9 - o2Value);
    correctionFactorStr = roundTo(factor, 3).toString();
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden h-full flex flex-col justify-between" id="emission-evaluation-panel-card">
      <div>
        {/* Header */}
        <div className="bg-teal-950 text-white px-5 py-4 border-b border-teal-800">
          <div className="flex items-center gap-2">
            <Layers className="text-teal-400" size={18} />
            <h3 className="font-extrabold text-sm uppercase tracking-wider">
              Kết quả tính toán &amp; Đánh giá
            </h3>
          </div>
          <p className="text-[11px] text-teal-300 mt-0.5 leading-snug">
            So sánh nồng độ xả thải thực tế (sau quy đổi nếu có) với quy chuẩn quốc gia
          </p>
        </div>

        {/* Content list */}
        <div className="p-5 space-y-4" id="evaluation-list-container">
          {evalParams.map((item) => {
            const hasValue = item.measuredValue !== null;

            return (
              <div
                key={item.paramKey}
                className={`rounded-xl p-4 border transition-all ${
                  !hasValue
                    ? 'bg-slate-50/50 border-slate-200/60 text-slate-400'
                    : item.notApplicableReason
                    ? 'bg-slate-50 border-slate-200 text-slate-500'
                    : item.isPassed
                    ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950 hover:shadow-2xs'
                    : 'bg-rose-50/60 border-rose-200 text-rose-950 hover:shadow-2xs'
                }`}
              >
                {/* 1. Item Header & Name */}
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h4 className="font-bold text-sm tracking-tight text-slate-900">
                      {item.label}
                    </h4>
                    <span className="text-[10px] text-slate-500 font-medium">
                      Đơn vị quy chuẩn: {item.unit}
                    </span>
                  </div>

                  {/* Badges for Compliance status */}
                  <div>
                    {!hasValue ? (
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full">
                        Chưa nhập số liệu
                      </span>
                    ) : item.notApplicableReason ? (
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2.5 py-0.5 rounded-full">
                        Không áp dụng
                      </span>
                    ) : item.isPassed ? (
                      <span className="inline-flex items-center gap-1 bg-emerald-500 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-2xs">
                        <CheckCircle2 size={12} />
                        <span>ĐẠT CHUẨN</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-rose-600 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-2xs animate-pulse">
                        <XCircle size={12} />
                        <span>VƯỢT CHUẨN</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* 2. Primary Metrics Display */}
                {hasValue && !item.notApplicableReason && (
                  <div className="mt-3.5 grid grid-cols-3 gap-2 border-t border-slate-100 pt-3.5 text-xs">
                    {/* Measured raw Cdo */}
                    <div className="space-y-0.5">
                      <span className="text-slate-500 text-[10px] block font-bold uppercase tracking-wider">
                        Đo thực tế (Cđo)
                      </span>
                      <span className="font-mono font-bold text-slate-800 text-sm">
                        {item.measuredValue} <span className="text-[10px] text-slate-500 font-normal">{item.unit}</span>
                      </span>
                    </div>

                    {/* Calculated Value (Ckq or Cmax) */}
                    {regulationType === 'QCVN_19_2024' ? (
                      /* QCVN 19:2024 - Smart O2 adjustment display */
                      <div className="space-y-0.5 col-span-1">
                        <span className="text-slate-500 text-[10px] block font-bold uppercase tracking-wider">
                          Hiệu chỉnh (Ckq)
                        </span>
                        {isO2Exactly7 ? (
                          <div className="flex flex-col">
                            <span className="font-mono font-bold text-teal-800 text-sm">
                              {roundTo(item.calculatedValue || 0)} <span className="text-[10px] font-normal">{item.unit}</span>
                            </span>
                            <span className="text-[9px] text-teal-600 font-semibold leading-tight mt-0.5">
                              (Ckq = Cđo)
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col">
                            <span className="font-mono font-extrabold text-teal-900 text-sm">
                              {roundTo(item.calculatedValue || 0)} <span className="text-[10px] font-normal">{item.unit}</span>
                            </span>
                            <span className="text-[9px] text-slate-400 font-semibold mt-0.5">
                              (Cđo × {correctionFactorStr})
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* QCVN 19:2009 - No O2 correction, show base limit instead */
                      <div className="space-y-0.5">
                        <span className="text-slate-500 text-[10px] block font-bold uppercase tracking-wider">
                          Nồng độ tính toán
                        </span>
                        <span className="font-mono font-bold text-blue-900 text-sm">
                          {item.measuredValue} <span className="text-[10px] font-normal">{item.unit}</span>
                        </span>
                      </div>
                    )}

                    {/* Limit to compare against */}
                    <div className="space-y-0.5 text-right">
                      <span className="text-slate-500 text-[10px] block font-bold uppercase tracking-wider">
                        {regulationType === 'QCVN_19_2009' ? 'Giới hạn Cmax' : 'Giới hạn cho phép (C)'}
                      </span>
                      {regulationType === 'QCVN_19_2009' ? (
                        <div className="flex flex-col items-end">
                          <span className="font-mono font-extrabold text-slate-800 text-sm">
                            {roundTo(item.effectiveLimit || 0)} <span className="text-[10px] font-normal">{item.unit}</span>
                          </span>
                          <span className="text-[9px] text-slate-400 font-semibold mt-0.5">
                            ({item.referenceLimit} × {roundTo(parsedKp * parsedKv, 2)})
                          </span>
                        </div>
                      ) : (
                        <span className="font-mono font-extrabold text-slate-800 text-sm">
                          {item.referenceLimit} <span className="text-[10px] font-normal">{item.unit}</span>
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* 3. Detailed Explanations, Exceptions or Violation Data */}
                {hasValue && (
                  <div className="mt-2.5 pt-2 border-t border-slate-100/50">
                    {item.notApplicableReason ? (
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md">
                        <Info size={13} className="text-slate-400 shrink-0" />
                        <span>{item.notApplicableReason}</span>
                      </p>
                    ) : item.isPassed ? (
                      /* Successful evaluation */
                      regulationType === 'QCVN_19_2024' && isO2Exactly7 ? (
                        <p className="text-[10px] text-emerald-700 italic bg-emerald-500/5 px-2 py-1 rounded-md">
                          O₂ đo được trùng O₂ tham chiếu (7.0%), không phát sinh hệ số hiệu chỉnh. Nồng độ đạt chuẩn.
                        </p>
                      ) : regulationType === 'QCVN_19_2024' ? (
                        <p className="text-[10px] text-slate-500 bg-slate-100/40 px-2 py-1 rounded-md">
                          Nồng độ sau hiệu chỉnh <strong className="text-slate-700">{roundTo(item.calculatedValue || 0)}</strong> nhỏ hơn giới hạn <strong className="text-slate-700">{item.referenceLimit} {item.unit}</strong>.
                        </p>
                      ) : (
                        <p className="text-[10px] text-slate-500 bg-slate-100/40 px-2 py-1 rounded-md">
                          Nồng độ đo thực tế nhỏ hơn giới hạn áp dụng Cmax = {roundTo(item.effectiveLimit || 0)} {item.unit}.
                        </p>
                      )
                    ) : (
                      /* VIOLATION - Exceeding limits */
                      <div className="bg-rose-100/40 text-rose-900 px-3 py-2 rounded-lg border border-rose-100 flex items-start gap-1.5 text-[11px]">
                        <AlertTriangle size={14} className="text-rose-600 shrink-0 mt-0.5 animate-bounce" />
                        <div className="space-y-0.5">
                          <span className="font-extrabold text-rose-950 block uppercase text-[10px] tracking-wide">
                            Phát hiện vượt quy chuẩn!
                          </span>
                          <span>
                            Vượt quá giới hạn tối đa cho phép <strong className="text-rose-700">+{roundTo(item.exceedPercent || 0)}%</strong> (tương đương vượt <strong className="text-rose-700">+{roundTo(item.exceedValue || 0)} mg/Nm³</strong>).
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Auxiliary Operational Values Panel (Box at bottom) */}
      <div className="bg-slate-50 p-4 border-t border-slate-200/80 grid grid-cols-2 gap-4 text-xs font-medium text-slate-600">
        <div className="flex items-center gap-2 bg-white rounded-xl p-2.5 border border-slate-100 shadow-3xs">
          <TrendingUp size={16} className="text-sky-500 shrink-0" />
          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-400 block uppercase font-bold leading-none">O₂ hiệu chỉnh</span>
            <span className="font-bold text-slate-800">
              {o2Value !== null ? `${o2Value} %` : 'Chưa nhập'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white rounded-xl p-2.5 border border-slate-100 shadow-3xs">
          <Gauge size={16} className="text-amber-500 shrink-0" />
          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-400 block uppercase font-bold leading-none">Lưu lượng tổng</span>
            <span className="font-bold text-slate-800">
              {flowValue !== null ? `${flowValue.toLocaleString()} Nm³/h` : 'Chưa nhập'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
