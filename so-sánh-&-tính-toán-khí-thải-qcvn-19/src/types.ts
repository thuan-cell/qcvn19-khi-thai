export type RegulationType = 'QCVN_19_2009' | 'QCVN_19_2024';

export enum Column2009 {
  A = 'A',
  B = 'B'
}

export enum Column2024 {
  A = 'A',
  B = 'B',
  C = 'C'
}

export enum ParamKey {
  DUST = 'dust',       // Bụi tổng
  CO = 'co',           // CO
  SO2 = 'so2',         // SO2
  NOX = 'nox',         // NOx quy về NO2
  O2 = 'o2',           // Hàm lượng Oxi
  FLOW = 'flow'        // Lưu lượng
}

export enum BoilerCapacity {
  BELOW_20 = 'below_20',   // < 20 tấn/giờ
  GE_20 = 'ge_20'          // >= 20 tấn/giờ
}

export interface SheetRowInput {
  paramKey: ParamKey;
  label: string;
  unit: string;
  method: string;
  measuredValue: string;
  customLimit: string; // If empty, use standard in app
}

export interface SheetRowResult {
  paramKey: ParamKey;
  label: string;
  unit: string;
  method: string;
  measuredValue: number | null;
  referenceLimit: number | null; // C
  calculatedValue: number | null; // Ckq for 2024, or Cdo for 2009
  effectiveLimit: number | null; // Cmax for 2009, or referenceLimit for 2024
  isPassed: boolean | null;
  exceedValue: number | null;
  exceedPercent: number | null;
  isEvaluation: boolean;
  notApplicableReason: string | null;
}

export interface RegulationData {
  paramKey: ParamKey;
  label: string;
  unit: string;
  qcvn2009_A: number | null;
  qcvn2009_B: number | null;
  qcvn2024_A: number | { below_20: number; ge_20: number } | null;
  qcvn2024_B: number | { below_20: number; ge_20: number } | null;
  qcvn2024_C: number | { below_20: number; ge_20: number } | null;
}
