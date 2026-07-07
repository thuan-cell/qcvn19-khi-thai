import {
  RegulationType,
  Column2009,
  Column2024,
  ParamKey,
  BoilerCapacity,
  SheetRowInput,
  SheetRowResult,
} from './types';
import { REGULATIONS } from './data';

/**
 * Rounds a number to a specific number of decimal places
 */
export function roundTo(num: number, decimals: number = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round((num + Number.EPSILON) * factor) / factor;
}

/**
 * Validates the raw input values from the user.
 * Returns a dictionary of errors.
 */
export function validateInputs(
  regulationType: RegulationType,
  rows: SheetRowInput[],
  kpStr: string,
  kvStr: string
): { [key: string]: string } {
  const errors: { [key: string]: string } = {};

  // Validate Kp & Kv for 2009
  if (regulationType === 'QCVN_19_2009') {
    const kpVal = parseFloat(kpStr);
    if (!kpStr.trim()) {
      errors.kp = 'Hệ số Kp không được để trống.';
    } else if (isNaN(kpVal)) {
      errors.kp = 'Hệ số Kp phải là số.';
    } else if (kpVal <= 0) {
      errors.kp = 'Hệ số Kp phải lớn hơn 0.';
    }

    const kvVal = parseFloat(kvStr);
    if (!kvStr.trim()) {
      errors.kv = 'Hệ số Kv không được để trống.';
    } else if (isNaN(kvVal)) {
      errors.kv = 'Hệ số Kv phải là số.';
    } else if (kvVal <= 0) {
      errors.kv = 'Hệ số Kv phải lớn hơn 0.';
    }
  }

  // Find Oxygen row
  const o2Row = rows.find((r) => r.paramKey === ParamKey.O2);
  const o2ValStr = o2Row?.measuredValue || '';

  if (regulationType === 'QCVN_19_2024') {
    if (!o2ValStr.trim()) {
      errors[`measured_${ParamKey.O2}`] = 'Cần nhập Hàm lượng Oxi (%) để tính hiệu chỉnh O2 quy chuẩn.';
    } else {
      const o2Val = parseFloat(o2ValStr);
      if (isNaN(o2Val)) {
        errors[`measured_${ParamKey.O2}`] = 'Oxi phải là số hợp lệ.';
      } else if (o2Val < 0) {
        errors[`measured_${ParamKey.O2}`] = 'Hàm lượng Oxi không được bé hơn 0%.';
      } else if (o2Val >= 20.9) {
        errors[`measured_${ParamKey.O2}`] = 'Oxi đo thực tế phải bé hơn 20.9% để tránh chia cho 0.';
      }
    }
  }

  // Validate other rows
  rows.forEach((row) => {
    const valStr = row.measuredValue.trim();
    if (valStr !== '') {
      const val = parseFloat(valStr);
      if (isNaN(val)) {
        errors[`measured_${row.paramKey}`] = 'Giá trị phải là số.';
      } else if (val < 0) {
        errors[`measured_${row.paramKey}`] = 'Giá trị không được âm.';
      }
    }

    // Validate custom limit if manual mode is enabled
    const limitStr = row.customLimit.trim();
    if (limitStr !== '') {
      const limitVal = parseFloat(limitStr);
      if (isNaN(limitVal)) {
        errors[`limit_${row.paramKey}`] = 'Giới hạn phải là số.';
      } else if (limitVal < 0) {
        errors[`limit_${row.paramKey}`] = 'Giới hạn không được âm.';
      }
    }
  });

  return errors;
}

/**
 * Core calculation for the 6 rows under QCVN 19:2009 or QCVN 19:2024.
 */
export function calculateSheet(
  regulationType: RegulationType,
  column: Column2009 | Column2024,
  rows: SheetRowInput[],
  kpValue: number,
  kvValue: number,
  boilerCapacity: BoilerCapacity,
  useManualLimits: boolean
): SheetRowResult[] {
  // Extract O2 measured value
  const o2Row = rows.find((r) => r.paramKey === ParamKey.O2);
  const o2Value = o2Row ? parseFloat(o2Row.measuredValue) : 0;
  const validO2 = !isNaN(o2Value) && o2Value >= 0 && o2Value < 20.9;

  return rows.map((row) => {
    const reg = REGULATIONS.find((r) => r.paramKey === row.paramKey);
    const measuredVal = row.measuredValue.trim() !== '' ? parseFloat(row.measuredValue) : null;

    // Default result object template
    const result: SheetRowResult = {
      paramKey: row.paramKey,
      label: row.label,
      unit: row.unit,
      method: row.method,
      measuredValue: measuredVal,
      referenceLimit: null,
      calculatedValue: null,
      effectiveLimit: null,
      isPassed: null,
      exceedValue: null,
      exceedPercent: null,
      isEvaluation: false,
      notApplicableReason: null,
    };

    // Determine if this is an evaluation row (Dust, CO, SO2, NOx)
    const isEvalParam = [ParamKey.DUST, ParamKey.CO, ParamKey.SO2, ParamKey.NOX].includes(row.paramKey);

    if (!isEvalParam) {
      // O2 and Flow rate are operating parameters, not evaluated for compliance limits
      result.isEvaluation = false;
      result.notApplicableReason = 'Thông số vận hành';
      return result;
    }

    // Determine base standard limit (C)
    let baseLimit: number | null = null;

    if (useManualLimits && row.customLimit.trim() !== '') {
      const parsedCustom = parseFloat(row.customLimit);
      if (!isNaN(parsedCustom) && parsedCustom >= 0) {
        baseLimit = parsedCustom;
      }
    }

    // Fallback to official standard values if no manual override is provided
    if (baseLimit === null && reg) {
      if (regulationType === 'QCVN_19_2009') {
        baseLimit = column === Column2009.A ? reg.qcvn2009_A : reg.qcvn2009_B;
      } else {
        // QCVN 19:2024
        let baseObj: number | { below_20: number; ge_20: number } | null = null;
        if (column === Column2024.A) {
          baseObj = reg.qcvn2024_A;
        } else if (column === Column2024.B) {
          baseObj = reg.qcvn2024_B;
        } else {
          baseObj = reg.qcvn2024_C;
        }

        if (baseObj !== null) {
          if (typeof baseObj === 'number') {
            baseLimit = baseObj;
          } else {
            // Dust dependent on boiler capacity
            baseLimit = boilerCapacity === BoilerCapacity.BELOW_20 ? baseObj.below_20 : baseObj.ge_20;
          }
        }
      }
    }

    result.referenceLimit = baseLimit;

    // If measured value is empty, we cannot calculate compliance
    if (measuredVal === null) {
      result.isEvaluation = true;
      result.notApplicableReason = 'Chờ số liệu đo thực tế';
      return result;
    }

    if (regulationType === 'QCVN_19_2009') {
      // --- QCVN 19:2009 Logic ---
      if (baseLimit === null) {
        // For CO under standard 2009
        result.isEvaluation = true;
        result.notApplicableReason = 'Không quy định trong QCVN 19:2009';
        return result;
      }

      result.isEvaluation = true;
      const effectiveLimit = baseLimit * kpValue * kvValue;
      result.effectiveLimit = effectiveLimit;
      result.calculatedValue = measuredVal; // No O2 correction under 2009

      const isPassed = measuredVal <= effectiveLimit;
      result.isPassed = isPassed;

      if (!isPassed) {
        result.exceedValue = measuredVal - effectiveLimit;
        result.exceedPercent = (result.exceedValue / effectiveLimit) * 100;
      } else {
        result.exceedValue = 0;
        result.exceedPercent = 0;
      }
    } else {
      // --- QCVN 19:2024 Logic ---
      result.isEvaluation = true;

      if (baseLimit === null) {
        result.notApplicableReason = 'Chưa ban hành giới hạn';
        return result;
      }

      if (!validO2) {
        result.notApplicableReason = 'Cần hàm lượng O2 đo hợp lệ';
        return result;
      }

      // Formula: Ckq = Cdo * (20.9 - 7) / (20.9 - O2do)
      const denominator = 20.9 - o2Value;
      const correctedValue = measuredVal * (20.9 - 7) / denominator;

      result.calculatedValue = correctedValue;
      result.effectiveLimit = baseLimit; // No Kp/Kv in 2024, effective limit is base limit itself

      const isPassed = correctedValue <= baseLimit;
      result.isPassed = isPassed;

      if (!isPassed) {
        result.exceedValue = correctedValue - baseLimit;
        result.exceedPercent = (result.exceedValue / baseLimit) * 100;
      } else {
        result.exceedValue = 0;
        result.exceedPercent = 0;
      }
    }

    return result;
  });
}
