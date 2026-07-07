import React from 'react';
import {
  FileSpreadsheet,
  AlertTriangle,
  Lock,
  Unlock,
  Info
} from 'lucide-react';
import { SheetRowInput, ParamKey } from '../types';

interface EmissionInputTableProps {
  rows: SheetRowInput[];
  useManualLimits: boolean;
  errors: { [key: string]: string };
  onRowValueChange: (
    paramKey: ParamKey,
    field: 'measuredValue' | 'method' | 'customLimit',
    value: string
  ) => void;
}

export default function EmissionInputTable({
  rows,
  useManualLimits,
  errors,
  onRowValueChange
}: EmissionInputTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden" id="emission-input-table-card">
      {/* Header */}
      <div className="bg-slate-900 text-white px-6 py-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="text-teal-400" size={20} />
            <h3 className="font-bold text-sm md:text-base tracking-tight uppercase">
              Phiếu nhập số liệu quan trắc khí thải (Cđo)
            </h3>
          </div>
          <p className="text-slate-400 text-xs">
            Nhập kết quả thô đo đạc thực tế từ hiện trường hoặc từ phiếu phân tích phòng thí nghiệm
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-lg border border-slate-700 text-[11px] text-slate-300">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
          <span>Sẵn sàng nhập dữ liệu</span>
        </div>
      </div>

      {/* Desktop View Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse" id="input-table">
          <thead>
            <tr className="bg-slate-50 text-slate-700 text-[11px] uppercase font-bold border-b border-slate-200/60">
              <th className="py-3 px-4 text-center w-12">STT</th>
              <th className="py-3 px-4">Chỉ tiêu phân tích</th>
              <th className="py-3 px-3 text-center w-24">Đơn vị</th>
              <th className="py-3 px-4 w-64">Phương pháp thử</th>
              <th className="py-3 px-4 w-48">Kết quả đo được (Cđo)</th>
              {useManualLimits && (
                <th className="py-3 px-4 w-44 bg-amber-50/40 text-amber-900 border-l border-amber-100">
                  Giới hạn gốc tự nhập (C)
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {rows.map((row, index) => {
              const hasError = errors[`measured_${row.paramKey}`];
              const limitError = errors[`limit_${row.paramKey}`];
              const isO2Row = row.paramKey === ParamKey.O2;
              const isFlowRow = row.paramKey === ParamKey.FLOW;

              return (
                <tr
                  key={row.paramKey}
                  className={`hover:bg-slate-50/40 transition-colors ${
                    isO2Row || isFlowRow ? 'bg-slate-50/20' : ''
                  }`}
                >
                  {/* STT */}
                  <td className="py-4 px-4 text-center font-mono text-slate-400 font-semibold text-xs">
                    {index + 1}
                  </td>

                  {/* Chỉ tiêu */}
                  <td className="py-4 px-4">
                    <div className="font-semibold text-slate-800 text-sm">{row.label}</div>
                    {isO2Row ? (
                      <span className="text-[9px] bg-sky-50 text-sky-700 px-1.5 py-0.5 rounded font-bold mt-1 inline-block uppercase tracking-wider">
                        Thông số hiệu chỉnh
                      </span>
                    ) : isFlowRow ? (
                      <span className="text-[9px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded font-bold mt-1 inline-block uppercase tracking-wider">
                        Thông số phụ trợ
                      </span>
                    ) : (
                      <span className="text-[9px] bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded font-bold mt-1 inline-block uppercase tracking-wider">
                        Thông số kiểm soát
                      </span>
                    )}
                  </td>

                  {/* Đơn vị */}
                  <td className="py-4 px-3 text-center font-mono text-xs text-slate-500 font-semibold">
                    {row.unit}
                  </td>

                  {/* Phương pháp thử */}
                  <td className="py-4 px-4">
                    <input
                      type="text"
                      value={row.method}
                      onChange={(e) => onRowValueChange(row.paramKey, 'method', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-100 outline-none text-xs transition-all bg-white"
                      placeholder="Nhập phương pháp thử..."
                    />
                  </td>

                  {/* Kết quả đo được (Cđo) */}
                  <td className="py-4 px-4">
                    <div className="relative">
                      <input
                        type="text"
                        value={row.measuredValue}
                        onChange={(e) => onRowValueChange(row.paramKey, 'measuredValue', e.target.value)}
                        className={`w-full px-3 py-1.5 rounded-lg border text-xs font-bold outline-none transition-all ${
                          hasError
                            ? 'border-rose-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-100 bg-rose-50/15'
                            : 'border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-100 bg-white'
                        }`}
                        placeholder="Nhập giá trị..."
                      />
                    </div>
                    {hasError && (
                      <p className="text-[10px] text-rose-500 font-semibold mt-1 flex items-start gap-1 leading-tight">
                        <AlertTriangle size={11} className="shrink-0 mt-0.5" />
                        <span>{hasError}</span>
                      </p>
                    )}
                  </td>

                  {/* Giới hạn gốc tự nhập */}
                  {useManualLimits && (
                    <td className="py-4 px-4 bg-amber-50/10 border-l border-amber-100/50">
                      {!isO2Row && !isFlowRow ? (
                        <div>
                          <input
                            type="text"
                            value={row.customLimit}
                            onChange={(e) => onRowValueChange(row.paramKey, 'customLimit', e.target.value)}
                            className={`w-full px-2.5 py-1.5 rounded-lg border text-xs font-bold outline-none bg-white transition-all ${
                              limitError
                                ? 'border-rose-300 focus:border-rose-500 bg-rose-50/10'
                                : 'border-amber-200 focus:border-amber-500'
                            }`}
                            placeholder="Nhập giới hạn (C)..."
                          />
                          {limitError && (
                            <p className="text-[9px] text-rose-500 font-semibold mt-0.5">{limitError}</p>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs italic block text-center">-</span>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile View Card List */}
      <div className="block md:hidden divide-y divide-slate-100" id="input-mobile-list">
        {rows.map((row, index) => {
          const hasError = errors[`measured_${row.paramKey}`];
          const limitError = errors[`limit_${row.paramKey}`];
          const isO2Row = row.paramKey === ParamKey.O2;
          const isFlowRow = row.paramKey === ParamKey.FLOW;

          return (
            <div
              key={row.paramKey}
              className={`p-4 space-y-3.5 ${
                isO2Row || isFlowRow ? 'bg-slate-50/30' : 'bg-white'
              }`}
            >
              {/* Header inside Card */}
              <div className="flex justify-between items-start">
                <div className="flex gap-2 items-center">
                  <span className="font-mono text-xs font-bold text-slate-400 bg-slate-100 w-5 h-5 rounded-full flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="font-bold text-slate-900 text-sm">{row.label}</span>
                </div>
                <div>
                  {isO2Row ? (
                    <span className="text-[9px] bg-sky-50 text-sky-700 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                      Oxi
                    </span>
                  ) : isFlowRow ? (
                    <span className="text-[9px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                      Phụ trợ
                    </span>
                  ) : (
                    <span className="text-[9px] bg-teal-50 text-teal-800 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                      Kiểm soát
                    </span>
                  )}
                </div>
              </div>

              {/* Form inputs */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] text-slate-400 font-bold uppercase">
                    Phương pháp thử
                  </label>
                  <input
                    type="text"
                    value={row.method}
                    onChange={(e) => onRowValueChange(row.paramKey, 'method', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 outline-none text-xs bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] text-slate-400 font-bold uppercase">
                    Kết quả Cđo ({row.unit})
                  </label>
                  <input
                    type="text"
                    value={row.measuredValue}
                    onChange={(e) => onRowValueChange(row.paramKey, 'measuredValue', e.target.value)}
                    className={`w-full px-2.5 py-1.5 rounded-lg border font-bold text-xs outline-none ${
                      hasError ? 'border-rose-300 bg-rose-50/15' : 'border-slate-200 bg-white'
                    }`}
                    placeholder="Nhập số..."
                  />
                  {hasError && <p className="text-[9px] text-rose-500 font-semibold mt-1">{hasError}</p>}
                </div>
              </div>

              {/* Custom manual limits input on Mobile */}
              {useManualLimits && !isO2Row && !isFlowRow && (
                <div className="bg-amber-50/40 p-2.5 rounded-xl border border-amber-100">
                  <label className="block text-[10px] text-amber-900 font-bold uppercase mb-1">
                    Nhập giới hạn gốc tự đặt (C)
                  </label>
                  <input
                    type="text"
                    value={row.customLimit}
                    onChange={(e) => onRowValueChange(row.paramKey, 'customLimit', e.target.value)}
                    className={`w-full px-2.5 py-1.5 rounded-lg border bg-white font-bold text-xs outline-none ${
                      limitError ? 'border-rose-300' : 'border-amber-200'
                    }`}
                    placeholder="Giới hạn riêng..."
                  />
                  {limitError && <p className="text-[9px] text-rose-500 font-semibold mt-0.5">{limitError}</p>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
