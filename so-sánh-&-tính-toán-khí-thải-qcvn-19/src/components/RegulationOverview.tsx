import React from 'react';
import { motion } from 'motion/react';
import { FileText, ArrowRight, HelpCircle, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { REGULATIONS } from '../data';
import { ParamKey } from '../types';

export default function RegulationOverview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
      id="regulation-overview-container"
    >
      {/* Introduction Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden" id="intro-card">
        <div className="absolute right-0 bottom-0 opacity-10 translate-x-10 translate-y-10 scale-150">
          <FileText size={200} />
        </div>
        <div className="relative z-10 max-w-3xl space-y-4">
          <span className="bg-teal-500/20 text-teal-300 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            Thông tin Quy chuẩn kỹ thuật Quốc gia
          </span>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            So sánh QCVN 19:2009/BTNMT và QCVN 19:2024/BTNMT
          </h2>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            Quy chuẩn mới <strong className="text-white font-medium">QCVN 19:2024/BTNMT</strong> thay thế phiên bản cũ <strong className="text-white font-medium">QCVN 19:2009/BTNMT</strong>, mang lại những thay đổi lớn về giá trị giới hạn nghiêm ngặt hơn, đồng thời chuyển đổi phương pháp đánh giá từ việc nhân hệ số vùng/công suất (<strong className="text-white">Kp, Kv</strong>) sang phương pháp <strong className="text-white">Hiệu chỉnh Oxy tham chiếu (7%)</strong> đối với các thông số khí thải lò đốt công nghiệp.
          </p>
          <div className="flex flex-wrap gap-4 pt-2 text-xs md:text-sm text-slate-300">
            <div className="flex items-center gap-1.5 bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-700/50">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
              <span>2009: Hệ số Cmax = C × Kp × Kv</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-700/50">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400"></span>
              <span>2024: Hiệu chỉnh Oxy tham chiếu 7%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Comparative Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden" id="comparison-table-card">
        <div className="px-6 py-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Bảng so sánh giới hạn khí thải gốc</h3>
            <p className="text-slate-500 text-xs mt-0.5">Đơn vị tính: mg/Nm³ (ở điều kiện tiêu chuẩn, ngoại trừ Oxy tham chiếu)</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg">
            <span className="font-semibold text-slate-700">* Chú thích:</span>
            <span>Loại lò sinh khối (Công suất &lt; 20 t/h / Công suất &ge; 20 t/h)</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" id="comparison-table">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-semibold text-xs border-b border-slate-100">
                <th className="py-4 px-6 font-semibold text-slate-800">Thông số</th>
                <th className="py-4 px-4 text-center font-semibold text-slate-800">Đơn vị</th>
                <th className="py-4 px-4 text-center bg-blue-50/40 text-blue-900 border-x border-slate-100/50">
                  <div>QCVN 19:2009</div>
                  <div className="text-[10px] text-blue-600/80 font-normal">Cột A</div>
                </th>
                <th className="py-4 px-4 text-center bg-blue-50/40 text-blue-900">
                  <div>QCVN 19:2009</div>
                  <div className="text-[10px] text-blue-600/80 font-normal">Cột B</div>
                </th>
                <th className="py-4 px-4 text-center bg-teal-50/40 text-teal-950 border-x border-slate-100/50">
                  <div>QCVN 19:2024</div>
                  <div className="text-[10px] text-teal-700/80 font-normal">Cột A</div>
                </th>
                <th className="py-4 px-4 text-center bg-teal-50/40 text-teal-950">
                  <div>QCVN 19:2024</div>
                  <div className="text-[10px] text-teal-700/80 font-normal">Cột B</div>
                </th>
                <th className="py-4 px-4 text-center bg-teal-50/40 text-teal-950 border-l border-slate-100/50">
                  <div>QCVN 19:2024</div>
                  <div className="text-[10px] text-teal-700/80 font-normal">Cột C</div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {REGULATIONS.filter(item => [ParamKey.DUST, ParamKey.CO, ParamKey.SO2, ParamKey.NOX].includes(item.paramKey)).map((item) => {
                const isDust = item.paramKey === ParamKey.DUST;
                const isCO = item.paramKey === ParamKey.CO;

                return (
                  <tr key={item.paramKey} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 font-medium text-slate-900">
                      <div>{item.label}</div>
                      {isDust && (
                        <div className="text-[11px] font-normal text-slate-400 mt-0.5">
                          Phụ thuộc loại lò sinh khối
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center font-mono text-xs text-slate-500">
                      {item.unit}
                    </td>
                    
                    {/* 2009 Cột A */}
                    <td className="py-4 px-4 text-center bg-blue-50/10 border-x border-slate-100/50 font-semibold text-slate-700">
                      {item.qcvn2009_A !== null ? item.qcvn2009_A : (
                        <span className="text-slate-400 font-normal text-xs italic">Không quy định</span>
                      )}
                    </td>

                    {/* 2009 Cột B */}
                    <td className="py-4 px-4 text-center bg-blue-50/10 font-semibold text-slate-700">
                      {item.qcvn2009_B !== null ? item.qcvn2009_B : (
                        <span className="text-slate-400 font-normal text-xs italic">Không quy định</span>
                      )}
                    </td>

                    {/* 2024 Cột A */}
                    <td className="py-4 px-4 text-center bg-teal-50/10 border-x border-slate-100/50 text-teal-900 font-semibold">
                      {typeof item.qcvn2024_A === 'number' ? (
                        item.qcvn2024_A
                      ) : (
                        <div>
                          <div>{item.qcvn2024_A.below_20} <span className="text-[10px] text-slate-400 font-normal">&lt;20t</span></div>
                          <div className="text-[11px] text-teal-600 font-normal border-t border-dashed border-teal-100/80 mt-1 pt-0.5">
                            {item.qcvn2024_A.ge_20} <span className="text-[10px] text-slate-400 font-normal">&ge;20t</span>
                          </div>
                        </div>
                      )}
                    </td>

                    {/* 2024 Cột B */}
                    <td className="py-4 px-4 text-center bg-teal-50/10 text-teal-900 font-semibold">
                      {typeof item.qcvn2024_B === 'number' ? (
                        item.qcvn2024_B
                      ) : (
                        <div>
                          <div>{item.qcvn2024_B.below_20} <span className="text-[10px] text-slate-400 font-normal">&lt;20t</span></div>
                          <div className="text-[11px] text-teal-600 font-normal border-t border-dashed border-teal-100/80 mt-1 pt-0.5">
                            {item.qcvn2024_B.ge_20} <span className="text-[10px] text-slate-400 font-normal">&ge;20t</span>
                          </div>
                        </div>
                      )}
                    </td>

                    {/* 2024 Cột C */}
                    <td className="py-4 px-4 text-center bg-teal-50/10 border-l border-slate-100/50 text-teal-900 font-semibold">
                      {typeof item.qcvn2024_C === 'number' ? (
                        item.qcvn2024_C
                      ) : (
                        <div>
                          <div>{item.qcvn2024_C.below_20} <span className="text-[10px] text-slate-400 font-normal">&lt;20t</span></div>
                          <div className="text-[11px] text-teal-600 font-normal border-t border-dashed border-teal-100/80 mt-1 pt-0.5">
                            {item.qcvn2024_C.ge_20} <span className="text-[10px] text-slate-400 font-normal">&ge;20t</span>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}

              {/* O2 Tham Chiếu Row */}
              <tr className="bg-slate-50/30">
                <td className="py-4 px-6 font-medium text-slate-900">
                  <div>Oxy tham chiếu (O₂ tc)</div>
                  <div className="text-[11px] font-normal text-slate-400 mt-0.5">
                    Hàm lượng oxy tiêu chuẩn quy đổi
                  </div>
                </td>
                <td className="py-4 px-4 text-center font-mono text-xs text-slate-500">%</td>
                <td className="py-4 px-4 text-center bg-blue-50/10 border-x border-slate-100/50 font-semibold text-slate-600">7</td>
                <td className="py-4 px-4 text-center bg-blue-50/10 font-semibold text-slate-600">7</td>
                <td className="py-4 px-4 text-center bg-teal-50/10 border-x border-slate-100/50 text-teal-800 font-semibold">7</td>
                <td className="py-4 px-4 text-center bg-teal-50/10 text-teal-800 font-semibold">7</td>
                <td className="py-4 px-4 text-center bg-teal-50/10 border-l border-slate-100/50 text-teal-800 font-semibold">7</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Columns & Application Definition Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="guidelines-definitions-grid">
        {/* QCVN 19:2009 Columns */}
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <HelpCircle size={20} />
            </span>
            <h4 className="font-bold text-slate-900 text-sm md:text-base">Phân loại Cột QCVN 19:2009</h4>
          </div>
          <ul className="space-y-3 text-xs md:text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <span className="font-bold text-blue-600 bg-blue-50 w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5">A</span>
              <span><strong>Cơ sở hoạt động trước ngày 16/01/2007:</strong> Áp dụng các quy chuẩn cũ với mức giới hạn gốc tương đối rộng hơn, nhưng cần nhân hệ số vùng Kv và hệ số nguồn Kp.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-blue-600 bg-blue-50 w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5">B</span>
              <span><strong>Cơ sở xây dựng mới/nâng cấp sau 16/01/2007:</strong> Áp dụng từ ngày quy chuẩn 19:2009 có hiệu lực, tiêu chuẩn cơ bản có yêu cầu ngặt nghèo tương tự cột A nhưng hướng đến công nghệ bảo vệ môi trường hiện đại hơn.</span>
            </li>
          </ul>
        </div>

        {/* QCVN 19:2024 Columns */}
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-teal-50 rounded-lg text-teal-600">
              <HelpCircle size={20} />
            </span>
            <h4 className="font-bold text-slate-900 text-sm md:text-base">Phân loại Cột QCVN 19:2024</h4>
          </div>
          <ul className="space-y-3 text-xs md:text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <span className="font-bold text-teal-700 bg-teal-50 w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5">A</span>
              <span><strong>Cơ sở đang hoạt động:</strong> Áp dụng cho các nhà máy, cơ sở công nghiệp đã đi vào hoạt động trước ngày quy chuẩn 19:2024 có hiệu lực thi hành chính thức.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-teal-700 bg-teal-50 w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5">B</span>
              <span><strong>Cơ sở xây dựng mới:</strong> Áp dụng nghiêm ngặt cho dự án xây dựng mới, cải tạo hoặc mở rộng quy mô nguồn thải phát sinh sau thời điểm quy chuẩn có hiệu lực.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-teal-700 bg-teal-50 w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5">C</span>
              <span><strong>Vùng đặc thù / Khác biệt:</strong> Áp dụng đối với các cơ sở nằm trong khu vực cần bảo vệ môi trường đặc biệt hoặc theo chỉ đạo của cơ quan quản lý nhà nước tỉnh/thành phố.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Formula & Calculation Explanations */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6" id="methodology-card">
        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <ShieldAlert size={20} className="text-amber-500" />
          <span>Phương pháp tính toán chi tiết của từng quy chuẩn</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          {/* Method QCVN 19:2009 */}
          <div className="space-y-4 pb-6 md:pb-0">
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded">QCVN 19:2009/BTNMT</span>
            <h4 className="text-base font-bold text-slate-800">Phương pháp nhân hệ số vùng và công suất</h4>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
              <div className="text-xs text-slate-500">Công thức giới hạn tối đa cho phép (Cmax):</div>
              <div className="font-mono text-sm md:text-base font-bold text-blue-900 bg-blue-50/50 p-2 rounded text-center">
                Cmax = C × Kp × Kv
              </div>
            </div>
            <div className="space-y-2 text-xs md:text-sm text-slate-600">
              <p>Trong đó:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong className="text-slate-800">C:</strong> Nồng độ giới hạn gốc của các thông số khí thải trong quy chuẩn.</li>
                <li><strong className="text-slate-800">Kp:</strong> Hệ số công suất nguồn thải (quy định theo lưu lượng khí thải, mặc định là 1 nếu không quy định).</li>
                <li><strong className="text-slate-800">Kv:</strong> Hệ số vùng địa hình phát sinh khí thải (mặc định là 1).</li>
              </ul>
            </div>
          </div>

          {/* Method QCVN 19:2024 */}
          <div className="space-y-4 pt-6 md:pt-0 md:pl-8">
            <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded">QCVN 19:2024/BTNMT</span>
            <h4 className="text-base font-bold text-slate-800">Phương pháp hiệu chỉnh Oxy tham chiếu</h4>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
              <div className="text-xs text-slate-500">Công thức quy đổi nồng độ hiệu chỉnh (Ckq):</div>
              <div className="font-mono text-sm md:text-base font-bold text-teal-900 bg-teal-50/50 p-2 rounded text-center">
                Ckq = Cdo × (20.9 - O₂tc) / (20.9 - O₂do)
              </div>
            </div>
            <div className="space-y-2 text-xs md:text-sm text-slate-600">
              <p>Trong đó:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong className="text-slate-800">Ckq:</strong> Nồng độ sau hiệu chỉnh oxy để mang đi so sánh trực tiếp với giới hạn gốc.</li>
                <li><strong className="text-slate-800">Cdo:</strong> Nồng độ đo thực tế ngoài hiện trường bằng thiết bị quan trắc.</li>
                <li><strong className="text-slate-800">O₂tc:</strong> Oxy tham chiếu theo quy chuẩn = <strong className="text-teal-700 font-semibold">7%</strong>.</li>
                <li><strong className="text-slate-800">O₂do:</strong> Oxy đo được thực tế trong khí thải phát sinh (%).</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Illustrative Example Card */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100 shadow-sm" id="example-illustration-card">
        <h4 className="text-base font-bold text-emerald-950 flex items-center gap-2 mb-3">
          <CheckCircle2 className="text-emerald-600" size={20} />
          <span>Ví dụ minh họa hệ số quy đổi QCVN 19:2009</span>
        </h4>
        <p className="text-emerald-900 text-xs md:text-sm leading-relaxed mb-4">
          Khi một lò hơi áp dụng quy chuẩn cũ <strong className="font-semibold">QCVN 19:2009 Cột B</strong> có hệ số nguồn <strong className="font-semibold">Kp = 0.8</strong> và hệ số vùng <strong className="font-semibold">Kv = 0.8</strong>. Hệ số nhân tổng hợp áp dụng là: 
          <code className="bg-white/80 px-1.5 py-0.5 rounded ml-1 font-mono text-xs font-semibold">0.8 × 0.8 = 0.64</code>. 
          Giới hạn cho phép thực tế (Cmax) sẽ bị co hẹp lại đáng kể như sau:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" id="example-chips-grid">
          <div className="bg-white p-3.5 rounded-xl border border-emerald-100 shadow-xs flex justify-between items-center">
            <div>
              <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Bụi tổng</div>
              <div className="font-bold text-slate-800 text-sm mt-0.5">200 mg/Nm³</div>
            </div>
            <ArrowRight size={14} className="text-slate-300" />
            <div className="text-right">
              <div className="text-[10px] text-emerald-600 font-semibold">Cmax thực tế</div>
              <div className="font-bold text-emerald-700 text-sm mt-0.5">128 mg/Nm³</div>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-emerald-100 shadow-xs flex justify-between items-center">
            <div>
              <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Khí SO2</div>
              <div className="font-bold text-slate-800 text-sm mt-0.5">500 mg/Nm³</div>
            </div>
            <ArrowRight size={14} className="text-slate-300" />
            <div className="text-right">
              <div className="text-[10px] text-emerald-600 font-semibold">Cmax thực tế</div>
              <div className="font-bold text-emerald-700 text-sm mt-0.5">320 mg/Nm³</div>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-emerald-100 shadow-xs flex justify-between items-center">
            <div>
              <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Khí NOx</div>
              <div className="font-bold text-slate-800 text-sm mt-0.5">850 mg/Nm³</div>
            </div>
            <ArrowRight size={14} className="text-slate-300" />
            <div className="text-right">
              <div className="text-[10px] text-emerald-600 font-semibold">Cmax thực tế</div>
              <div className="font-bold text-emerald-700 text-sm mt-0.5">544 mg/Nm³</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
