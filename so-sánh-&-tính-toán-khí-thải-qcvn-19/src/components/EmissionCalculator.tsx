import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  RotateCcw,
  Sliders,
  Settings,
  Flame,
  Sparkles,
  Lock,
  Unlock,
  Info
} from 'lucide-react';
import {
  RegulationType,
  Column2009,
  Column2024,
  ParamKey,
  BoilerCapacity,
  SheetRowInput,
  SheetRowResult
} from '../types';
import { SHEET_PRESETS } from '../data';
import { validateInputs, calculateSheet } from '../utils';

import EmissionInputTable from './EmissionInputTable';
import EmissionEvaluationPanel from './EmissionEvaluationPanel';
import EmissionSummary from './EmissionSummary';

export default function EmissionCalculator() {
  // Global configurations
  const [regulationType, setRegulationType] = useState<RegulationType>('QCVN_19_2024');
  const [column2009, setColumn2009] = useState<Column2009>(Column2009.B);
  const [column2024, setColumn2024] = useState<Column2024>(Column2024.B);
  const [boilerCapacity, setBoilerCapacity] = useState<BoilerCapacity>(BoilerCapacity.BELOW_20);
  const [kp, setKp] = useState<string>('1.0');
  const [kv, setKv] = useState<string>('1.0');
  const [useManualLimits, setUseManualLimits] = useState<boolean>(false);

  // Rows of inputs
  const [rows, setRows] = useState<SheetRowInput[]>([
    {
      paramKey: ParamKey.DUST,
      label: 'Bụi tổng',
      unit: 'mg/Nm3',
      method: 'US EPA Method 05',
      measuredValue: '112',
      customLimit: ''
    },
    {
      paramKey: ParamKey.CO,
      label: 'CO (Cácbon mônôxit)',
      unit: 'mg/Nm3',
      method: 'QT.KT.02.TEST0350',
      measuredValue: '201',
      customLimit: ''
    },
    {
      paramKey: ParamKey.SO2,
      label: 'SO2 (Lưu huỳnh điôxit)',
      unit: 'mg/Nm3',
      method: 'QT.KT.02.TEST0350',
      measuredValue: '219',
      customLimit: ''
    },
    {
      paramKey: ParamKey.NOX,
      label: 'NOx quy về NO2 (Nitơ ôxit)',
      unit: 'mg/Nm3',
      method: 'QT.KT.02.TEST0350',
      measuredValue: '129',
      customLimit: ''
    },
    {
      paramKey: ParamKey.O2,
      label: 'Hàm lượng Oxi (O2)',
      unit: '%',
      method: 'QT.KT.02.TEST0350',
      measuredValue: '18.7',
      customLimit: ''
    },
    {
      paramKey: ParamKey.FLOW,
      label: 'Lưu lượng khí thải',
      unit: 'Nm3/h',
      method: 'QT.KT.02.TEST0350',
      measuredValue: '54314',
      customLimit: ''
    }
  ]);

  // Calculations states
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [results, setResults] = useState<SheetRowResult[]>([]);

  // Automatically recalculate whenever inputs change
  useEffect(() => {
    handleCalculate();
  }, [regulationType, column2009, column2024, boilerCapacity, kp, kv, useManualLimits, rows]);

  // Handler to run core calculation logic
  const handleCalculate = () => {
    const validationErrors = validateInputs(regulationType, rows, kp, kv);
    setErrors(validationErrors);

    const kpVal = parseFloat(kp) || 1.0;
    const kvVal = parseFloat(kv) || 1.0;
    const activeColumn = regulationType === 'QCVN_19_2024' ? column2024 : column2009;

    const computedResults = calculateSheet(
      regulationType,
      activeColumn,
      rows,
      kpVal,
      kvVal,
      boilerCapacity,
      useManualLimits
    );

    setResults(computedResults);
  };

  // Handler to load quick presets
  const handleLoadPreset = (presetId: string) => {
    const preset = SHEET_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    setRegulationType(preset.regulationType);
    if (preset.regulationType === 'QCVN_19_2009') {
      setColumn2009(preset.column as Column2009);
    } else {
      setColumn2024(preset.column as Column2024);
    }
    setBoilerCapacity(preset.boilerCapacity as BoilerCapacity);
    setKp(preset.kp);
    setKv(preset.kv);
    setUseManualLimits(preset.useManualLimits);

    setRows([
      {
        paramKey: ParamKey.DUST,
        label: 'Bụi tổng',
        unit: 'mg/Nm3',
        method: 'US EPA Method 05',
        measuredValue: preset.values.dust,
        customLimit: preset.customLimits.dust
      },
      {
        paramKey: ParamKey.CO,
        label: 'CO (Cácbon mônôxit)',
        unit: 'mg/Nm3',
        method: 'QT.KT.02.TEST0350',
        measuredValue: preset.values.co,
        customLimit: preset.customLimits.co
      },
      {
        paramKey: ParamKey.SO2,
        label: 'SO2 (Lưu huỳnh điôxit)',
        unit: 'mg/Nm3',
        method: 'QT.KT.02.TEST0350',
        measuredValue: preset.values.so2,
        customLimit: preset.customLimits.so2
      },
      {
        paramKey: ParamKey.NOX,
        label: 'NOx quy về NO2 (Nitơ ôxit)',
        unit: 'mg/Nm3',
        method: 'QT.KT.02.TEST0350',
        measuredValue: preset.values.nox,
        customLimit: preset.customLimits.nox
      },
      {
        paramKey: ParamKey.O2,
        label: 'Hàm lượng Oxi (O2)',
        unit: '%',
        method: 'QT.KT.02.TEST0350',
        measuredValue: preset.values.o2,
        customLimit: ''
      },
      {
        paramKey: ParamKey.FLOW,
        label: 'Lưu lượng khí thải',
        unit: 'Nm3/h',
        method: 'QT.KT.02.TEST0350',
        measuredValue: preset.values.flow,
        customLimit: ''
      }
    ]);

    setErrors({});
  };

  // Handler to clear and reset fields
  const handleReset = () => {
    setRegulationType('QCVN_19_2024');
    setColumn2024(Column2024.B);
    setColumn2009(Column2009.B);
    setBoilerCapacity(BoilerCapacity.BELOW_20);
    setKp('1.0');
    setKv('1.0');
    setUseManualLimits(false);

    setRows([
      {
        paramKey: ParamKey.DUST,
        label: 'Bụi tổng',
        unit: 'mg/Nm3',
        method: 'US EPA Method 05',
        measuredValue: '',
        customLimit: ''
      },
      {
        paramKey: ParamKey.CO,
        label: 'CO (Cácbon mônôxit)',
        unit: 'mg/Nm3',
        method: 'QT.KT.02.TEST0350',
        measuredValue: '',
        customLimit: ''
      },
      {
        paramKey: ParamKey.SO2,
        label: 'SO2 (Lưu huỳnh điôxit)',
        unit: 'mg/Nm3',
        method: 'QT.KT.02.TEST0350',
        measuredValue: '',
        customLimit: ''
      },
      {
        paramKey: ParamKey.NOX,
        label: 'NOx quy về NO2 (Nitơ ôxit)',
        unit: 'mg/Nm3',
        method: 'QT.KT.02.TEST0350',
        measuredValue: '',
        customLimit: ''
      },
      {
        paramKey: ParamKey.O2,
        label: 'Hàm lượng Oxi (O2)',
        unit: '%',
        method: 'QT.KT.02.TEST0350',
        measuredValue: '',
        customLimit: ''
      },
      {
        paramKey: ParamKey.FLOW,
        label: 'Lưu lượng khí thải',
        unit: 'Nm3/h',
        method: 'QT.KT.02.TEST0350',
        measuredValue: '',
        customLimit: ''
      }
    ]);
    setErrors({});
  };

  // Update specific field in row inputs
  const handleRowValueChange = (
    paramKey: ParamKey,
    field: 'measuredValue' | 'method' | 'customLimit',
    value: string
  ) => {
    setRows((prevRows) =>
      prevRows.map((row) => (row.paramKey === paramKey ? { ...row, [field]: value } : row))
    );
  };

  // Extract variables for passing to subcomponents
  const o2Row = rows.find((r) => r.paramKey === ParamKey.O2);
  const rawO2Val = o2Row?.measuredValue.trim() !== '' ? parseFloat(o2Row?.measuredValue || '') : null;

  const flowRow = rows.find((r) => r.paramKey === ParamKey.FLOW);
  const rawFlowVal = flowRow?.measuredValue.trim() !== '' ? parseFloat(flowRow?.measuredValue || '') : null;

  const activeColumn = regulationType === 'QCVN_19_2024' ? column2024 : column2009;

  return (
    <div className="space-y-6" id="emission-calculator-main">
      
      {/* Block A: Presets Loader Bar */}
      <div className="bg-gradient-to-r from-teal-500/10 via-sky-500/5 to-slate-500/5 rounded-2xl p-5 border border-teal-500/20 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-teal-950 font-extrabold text-sm">
            <Sparkles size={18} className="text-teal-600 animate-pulse" />
            <span>Nạp nhanh số liệu mẫu theo phiếu thực tế</span>
          </div>
          <button
            onClick={handleReset}
            className="text-xs font-bold text-rose-600 hover:text-white bg-white hover:bg-rose-600 border border-rose-200 hover:border-rose-600 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 self-start cursor-pointer shadow-3xs"
          >
            <RotateCcw size={13} />
            <span>Xóa sạch bảng số liệu</span>
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs" id="presets-buttons-grid">
          {SHEET_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleLoadPreset(preset.id)}
              className="text-left p-3.5 rounded-xl bg-white hover:bg-slate-50/80 border border-slate-200 hover:border-teal-500 hover:shadow-2xs transition-all flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <span className="text-[11px] font-black text-slate-800 group-hover:text-teal-700 block transition-colors leading-snug">
                  {preset.name}
                </span>
                <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {preset.description}
                </p>
              </div>
              <div className="mt-2 text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-bold uppercase self-start">
                {preset.regulationType === 'QCVN_19_2009' ? 'QCVN 19:2009' : 'QCVN 19:2024'}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid Layout: left inputs, right evaluation results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left column: Controls + Input table */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6 flex flex-col justify-between">
          
          {/* Block 1: Config Application Info */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-5" id="metadata-settings-card">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Settings size={18} className="text-slate-500" />
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                Cấu hình điều kiện áp dụng quy chuẩn
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5" id="metadata-grid">
              
              {/* Select QCVN type */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  1. Quy chuẩn áp dụng
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setRegulationType('QCVN_19_2024')}
                    className={`py-2 px-1 rounded-lg text-[11px] font-black border transition-all cursor-pointer ${
                      regulationType === 'QCVN_19_2024'
                        ? 'bg-teal-600 text-white border-teal-600 shadow-2xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    19:2024
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegulationType('QCVN_19_2009')}
                    className={`py-2 px-1 rounded-lg text-[11px] font-black border transition-all cursor-pointer ${
                      regulationType === 'QCVN_19_2009'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    19:2009
                  </button>
                </div>
              </div>

              {/* Select Column A, B, C */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  2. Phân loại Cột
                </label>
                {regulationType === 'QCVN_19_2024' ? (
                  <div className="grid grid-cols-3 gap-1">
                    {(['A', 'B', 'C'] as Column2024[]).map((col) => (
                      <button
                        key={col}
                        type="button"
                        onClick={() => setColumn2024(col)}
                        className={`py-2 rounded-lg text-[11px] font-black border transition-all cursor-pointer ${
                          column2024 === col
                            ? 'bg-teal-50 text-teal-700 border-teal-300 shadow-3xs'
                            : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        Cột {col}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-1.5">
                    {(['A', 'B'] as Column2009[]).map((col) => (
                      <button
                        key={col}
                        type="button"
                        onClick={() => setColumn2009(col)}
                        className={`py-2 rounded-lg text-[11px] font-black border transition-all cursor-pointer ${
                          column2009 === col
                            ? 'bg-blue-50 text-blue-700 border-blue-300 shadow-3xs'
                            : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        Cột {col}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* QCVN 19:2024 Boiler Capacity or QCVN 19:2009 Kp/Kv coefficients */}
              {regulationType === 'QCVN_19_2024' ? (
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Flame size={13} className="text-amber-500 animate-pulse" />
                    <span>3. Quy mô lò sinh khối (cho chỉ tiêu Bụi)</span>
                  </label>
                  <div className="grid grid-cols-2 gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200/60">
                    <button
                      type="button"
                      onClick={() => setBoilerCapacity(BoilerCapacity.BELOW_20)}
                      className={`py-1.5 px-1.5 rounded-md text-[10px] font-black transition-all cursor-pointer leading-tight ${
                        boilerCapacity === BoilerCapacity.BELOW_20
                          ? 'bg-white text-teal-800 shadow-3xs border border-slate-200'
                          : 'bg-transparent text-slate-500 hover:text-slate-800 border border-transparent'
                      }`}
                    >
                      Công suất &lt; 20t/h
                    </button>
                    <button
                      type="button"
                      onClick={() => setBoilerCapacity(BoilerCapacity.GE_20)}
                      className={`py-1.5 px-1.5 rounded-md text-[10px] font-black transition-all cursor-pointer leading-tight ${
                        boilerCapacity === BoilerCapacity.GE_20
                          ? 'bg-white text-teal-800 shadow-3xs border border-slate-200'
                          : 'bg-transparent text-slate-500 hover:text-slate-800 border border-transparent'
                      }`}
                    >
                      Công suất &ge; 20t/h
                    </button>
                  </div>
                </div>
              ) : (
                <React.Fragment>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-700">3a. Hệ số nguồn Kp</label>
                    <input
                      type="text"
                      value={kp}
                      onChange={(e) => setKp(e.target.value)}
                      className={`w-full px-2.5 py-1.5 rounded-lg border text-xs font-bold focus:ring-2 outline-none transition-all bg-white ${
                        errors.kp
                          ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-100 bg-rose-50/10'
                          : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
                      }`}
                      placeholder="Mặc định: 1.0"
                    />
                    {errors.kp && <p className="text-[9px] font-bold text-rose-500">{errors.kp}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-700">3b. Hệ số vùng Kv</label>
                    <input
                      type="text"
                      value={kv}
                      onChange={(e) => setKv(e.target.value)}
                      className={`w-full px-2.5 py-1.5 rounded-lg border text-xs font-bold focus:ring-2 outline-none transition-all bg-white ${
                        errors.kv
                          ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-100 bg-rose-50/10'
                          : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
                      }`}
                      placeholder="Mặc định: 1.0"
                    />
                    {errors.kv && <p className="text-[9px] font-bold text-rose-500">{errors.kv}</p>}
                  </div>
                </React.Fragment>
              )}
            </div>

            {/* Toggle custom manually-overridden limit mode */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  {useManualLimits ? (
                    <span className="p-1 bg-amber-500/10 text-amber-700 rounded-md">
                      <Unlock size={14} />
                    </span>
                  ) : (
                    <span className="p-1 bg-slate-200 text-slate-600 rounded-md">
                      <Lock size={14} />
                    </span>
                  )}
                  <h4 className="font-bold text-slate-800">
                    Chế độ nhập tay giá trị quy chuẩn tham chiếu
                  </h4>
                </div>
                <p className="text-[10px] text-slate-400 leading-normal">
                  Kích hoạt để tự gán mốc giới hạn (C) riêng theo một số yêu cầu đặc biệt của địa phương hoặc dự án.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setUseManualLimits(!useManualLimits)}
                className={`font-bold px-3 py-2 rounded-lg border transition-all cursor-pointer shrink-0 text-center ${
                  useManualLimits
                    ? 'bg-amber-500 text-white border-amber-500 hover:bg-amber-600 shadow-3xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {useManualLimits ? '🔓 Đang bật nhập tay' : '🔒 Đang khóa (Dùng chuẩn gốc)'}
              </button>
            </div>
          </div>

          {/* Block 2: EmissionInputTable */}
          <EmissionInputTable
            rows={rows}
            useManualLimits={useManualLimits}
            errors={errors}
            onRowValueChange={handleRowValueChange}
          />
        </div>

        {/* Right column: Block 3 - EmissionEvaluationPanel */}
        <div className="lg:col-span-5 xl:col-span-4">
          <EmissionEvaluationPanel
            results={results}
            regulationType={regulationType}
            kp={kp}
            kv={kv}
            o2Value={rawO2Val}
            flowValue={rawFlowVal}
          />
        </div>

      </div>

      {/* Block 4: EmissionSummary - full width below the grids */}
      <EmissionSummary
        results={results}
        regulationType={regulationType}
        column={activeColumn}
        o2Value={rawO2Val}
      />

    </div>
  );
}
