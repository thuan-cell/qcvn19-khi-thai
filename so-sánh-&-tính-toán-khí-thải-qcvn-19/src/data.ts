import { RegulationData, ParamKey } from './types';

export const REGULATIONS: RegulationData[] = [
  {
    paramKey: ParamKey.DUST,
    label: 'Bụi tổng',
    unit: 'mg/Nm3',
    qcvn2009_A: 200,
    qcvn2009_B: 200,
    qcvn2024_A: { below_20: 40, ge_20: 30 },
    qcvn2024_B: { below_20: 50, ge_20: 40 },
    qcvn2024_C: { below_20: 60, ge_20: 50 }
  },
  {
    paramKey: ParamKey.SO2,
    label: 'SO2 (Lưu huỳnh điôxit)',
    unit: 'mg/Nm3',
    qcvn2009_A: 500,
    qcvn2009_B: 500,
    qcvn2024_A: 130,
    qcvn2024_B: 200,
    qcvn2024_C: 250
  },
  {
    paramKey: ParamKey.NOX,
    label: 'NOx quy về NO2 (Nitơ ôxit)',
    unit: 'mg/Nm3',
    qcvn2009_A: 850,
    qcvn2009_B: 850,
    qcvn2024_A: 150,
    qcvn2024_B: 250,
    qcvn2024_C: 350
  },
  {
    paramKey: ParamKey.CO,
    label: 'CO (Cácbon mônôxit)',
    unit: 'mg/Nm3',
    qcvn2009_A: null, // Không quy định
    qcvn2009_B: null, // Không quy định
    qcvn2024_A: 200,
    qcvn2024_B: 300,
    qcvn2024_C: 350
  },
  {
    paramKey: ParamKey.O2,
    label: 'Hàm lượng Oxi (O2)',
    unit: '%',
    qcvn2009_A: null,
    qcvn2009_B: null,
    qcvn2024_A: null,
    qcvn2024_B: null,
    qcvn2024_C: null
  },
  {
    paramKey: ParamKey.FLOW,
    label: 'Lưu lượng khí thải',
    unit: 'Nm3/h',
    qcvn2009_A: null,
    qcvn2009_B: null,
    qcvn2024_A: null,
    qcvn2024_B: null,
    qcvn2024_C: null
  }
];

export interface SheetPreset {
  id: string;
  name: string;
  regulationType: 'QCVN_19_2009' | 'QCVN_19_2024';
  column: 'A' | 'B' | 'C';
  boilerCapacity: 'below_20' | 'ge_20';
  kp: string;
  kv: string;
  useManualLimits: boolean;
  values: {
    dust: string;
    co: string;
    so2: string;
    nox: string;
    o2: string;
    flow: string;
  };
  customLimits: {
    dust: string;
    co: string;
    so2: string;
    nox: string;
  };
  description: string;
}

export const SHEET_PRESETS: SheetPreset[] = [
  {
    id: 'preset-standard-2024',
    name: 'Mẫu số liệu 1: QCVN 19:2024 Cột B (Lò ≥ 20t/h)',
    regulationType: 'QCVN_19_2024',
    column: 'B',
    boilerCapacity: 'ge_20',
    kp: '1',
    kv: '1',
    useManualLimits: false,
    values: {
      dust: '112',
      co: '201',
      so2: '219',
      nox: '129',
      o2: '18.7',
      flow: '54314'
    },
    customLimits: {
      dust: '',
      co: '',
      so2: '',
      nox: ''
    },
    description: 'Số liệu quan trắc thực tế với O2 cao (18.7%). Khi quy đổi hiệu chỉnh O2 tham chiếu 7%, nồng độ thực tế sẽ bị nhân lên gấp ~6.3 lần, dẫn đến nhiều chỉ tiêu bị vượt quy chuẩn nghiêm trọng.'
  },
  {
    id: 'preset-standard-2009',
    name: 'Mẫu số liệu 2: QCVN 19:2009 Cột B (Kp=0.8, Kv=0.8)',
    regulationType: 'QCVN_19_2009',
    column: 'B',
    boilerCapacity: 'below_20',
    kp: '0.8',
    kv: '0.8',
    useManualLimits: false,
    values: {
      dust: '112',
      co: '201',
      so2: '219',
      nox: '129',
      o2: '18.7',
      flow: '54314'
    },
    customLimits: {
      dust: '',
      co: '',
      so2: '',
      nox: ''
    },
    description: 'Áp dụng hệ số vùng Kv=0.8 và hệ số nguồn Kp=0.8. Giới hạn tối đa Cmax = C × 0.64. CO không có quy chuẩn cũ nên hiển thị không đánh giá.'
  },
  {
    id: 'preset-custom-co-2009',
    name: 'Mẫu số liệu 3: QCVN 19:2009 - Nhập tay giới hạn CO = 1000',
    regulationType: 'QCVN_19_2009',
    column: 'B',
    boilerCapacity: 'below_20',
    kp: '1.0',
    kv: '1.0',
    useManualLimits: true,
    values: {
      dust: '85',
      co: '1050',
      so2: '410',
      nox: '320',
      o2: '12.5',
      flow: '35000'
    },
    customLimits: {
      dust: '',
      co: '1000',
      so2: '',
      nox: ''
    },
    description: 'Chế độ nhập tay giới hạn được kích hoạt để gán mốc CO tham chiếu là 1000 mg/Nm³ cho QCVN 19:2009. Đo được CO = 1050 (Vượt).'
  },
  {
    id: 'preset-safe-2024',
    name: 'Mẫu số liệu 4: Đạt tất cả chỉ tiêu - QCVN 19:2024 Cột A',
    regulationType: 'QCVN_19_2024',
    column: 'A',
    boilerCapacity: 'below_20',
    kp: '1',
    kv: '1',
    useManualLimits: false,
    values: {
      dust: '12',
      co: '45',
      so2: '35',
      nox: '50',
      o2: '8.2',
      flow: '42000'
    },
    customLimits: {
      dust: '',
      co: '',
      so2: '',
      nox: ''
    },
    description: 'Mẫu khí thải sạch lý tưởng. Hàm lượng oxy đo được 8.2% (gần mốc tham chiếu 7%), kết quả sau hiệu chỉnh tăng nhẹ nhưng vẫn thấp hơn nhiều so với giới hạn cột A.'
  }
];
