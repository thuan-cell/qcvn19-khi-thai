import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wind, Calculator, TableProperties, Leaf, ArrowUpRight, BookOpen, Clock } from 'lucide-react';
import RegulationOverview from './components/RegulationOverview';
import EmissionCalculator from './components/EmissionCalculator';

export default function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'calculator'>('calculator');

  // Simple local timestamp string for metadata / UI reference (2026 local time context is preserved)
  const currentLocalYear = 2026;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col antialiased">
      {/* Top Banner / Navigation Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-2xs" id="app-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and App Title */}
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-teal-500 to-emerald-600 text-white rounded-xl shadow-xs flex items-center justify-center">
                <Wind size={22} className="animate-pulse" />
              </div>
              <div>
                <h1 className="text-sm md:text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
                  QCVN 19 Khí thải Công nghiệp
                  <span className="hidden sm:inline-block bg-teal-50 text-teal-700 text-[10px] font-bold px-2 py-0.5 rounded border border-teal-100">
                    2009 vs 2024
                  </span>
                </h1>
                <p className="text-[10px] md:text-xs text-slate-400 font-medium">
                  Hệ thống kiểm tra & tính quy đổi hiệu chỉnh Oxy tự động
                </p>
              </div>
            </div>

            {/* Support Links or Badges */}
            <div className="hidden md:flex items-center gap-4 text-xs">
              <a
                href="https://monre.gov.vn"
                target="_blank"
                rel="noreferrer noopener"
                className="text-slate-500 hover:text-teal-600 font-medium transition-colors flex items-center gap-1"
              >
                <span>Bộ Tài nguyên & Môi trường</span>
                <ArrowUpRight size={12} />
              </a>
              <span className="h-4 w-px bg-slate-200"></span>
              <div className="flex items-center gap-1.5 text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full font-medium">
                <Clock size={12} />
                <span>Năm áp dụng: {currentLocalYear}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Banner with Vietnamese Regulation Context */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Công cụ chuyển đổi & So sánh Khí thải Công nghiệp
            </h2>
            <p className="text-xs md:text-sm text-slate-500 leading-relaxed max-w-3xl">
              Hỗ trợ kỹ sư môi trường, cán bộ vận hành trạm quan trắc (CEMS) dễ dàng chuyển đổi nồng độ khí thải đo thô về oxy tham chiếu và so sánh trực tiếp với Quy chuẩn Kỹ thuật Quốc gia Việt Nam.
            </p>
          </div>
          
          {/* Quick Regulation Switch Indicator */}
          <div className="flex items-center gap-2 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-100 text-emerald-800 shrink-0">
            <Leaf size={16} className="text-emerald-600" />
            <div className="text-xs font-semibold">QCVN 19:2024 có hiệu lực chính thức</div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="bg-slate-200/60 p-1 rounded-xl max-w-md mx-auto grid grid-cols-2 gap-1" id="tab-switcher">
          <button
            onClick={() => setActiveTab('calculator')}
            className={`py-2.5 px-4 rounded-lg text-xs md:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'calculator'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
            }`}
          >
            <Calculator size={16} />
            <span>Tính toán khí thải</span>
          </button>
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2.5 px-4 rounded-lg text-xs md:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
            }`}
          >
            <TableProperties size={16} />
            <span>Bảng tổng quan quy chuẩn</span>
          </button>
        </div>

        {/* Tab Content Canvas with motion container */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {activeTab === 'calculator' ? (
              <motion.div
                key="calculator-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <EmissionCalculator />
              </motion.div>
            ) : (
              <motion.div
                key="overview-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <RegulationOverview />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Humble Professional Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800" id="app-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6 text-xs md:text-sm">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-white font-bold">
                <Wind size={16} className="text-teal-400" />
                <span>QCVN 19 - Công cụ hỗ trợ chuyển đổi & đối chiếu số liệu khí thải</span>
              </div>
              <p className="text-slate-400 text-xs">
                Thiết kế trực quan, tuân thủ chặt chẽ công thức toán học và bảng giới hạn của Bộ Tài nguyên và Môi trường.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-slate-500">Xem văn bản gốc:</span>
              <a
                href="https://envcomm.vn/phap-luat-moi/qcvn-19-2024-btnmt-quy-chuan-ky-thuat-quoc-gia-ve-khi-thai-cong-nghiep-nguon-on-dinh.html"
                target="_blank"
                rel="noreferrer noopener"
                className="bg-slate-800 hover:bg-slate-700 text-white hover:text-teal-300 transition-colors px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5"
              >
                <BookOpen size={12} />
                <span>Văn bản QCVN 19:2024</span>
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <p>
              © {currentLocalYear} Công cụ So sánh Khí thải QCVN 19. Hệ thống tính toán offline tại trình duyệt.
            </p>
            <div className="flex gap-4">
              <span>Được xây dựng phục vụ ngành kỹ thuật môi trường Việt Nam</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
