import React from 'react';
import { 
  X, 
  BookOpen, 
  Download, 
  Sparkles, 
  CheckCircle2, 
  FileCheck,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { downloadPlannerPdf } from '../utils/plannerGenerator';

export default function MyLibraryModal({ 
  isOpen, 
  onClose, 
  libraryItems = [], 
  onOpenReader 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#FAF7F2] rounded-3xl shadow-2xl border border-[#E7DFD5] overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-[#FAF5F0] p-5 sm:p-6 border-b border-[#EADBCE] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-[#EFE3D8] text-[#8E6E60]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-semibold text-[#29221F]">
                My Digital Library
              </h2>
              <p className="text-xs text-[#7F6E65]">
                {libraryItems.length} purchased planners & journals • Lifetime cloud access
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#EFE4DA] text-[#63534B] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8">
          {libraryItems.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#EFE4DA] text-[#8E6E60] flex items-center justify-center mx-auto">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl font-medium text-[#29221F]">
                No planners in your library yet
              </h3>
              <p className="text-xs text-[#7F6E65] max-w-sm mx-auto">
                Purchased planners and templates are automatically added here with instant PDF download and GoodNotes sync.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {libraryItems.map((item) => (
                <div 
                  key={item.id}
                  className="p-4 rounded-2xl bg-white border border-[#E6DDD3] shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start gap-3">
                    {/* Thumbnail */}
                    <div 
                      className="w-16 h-20 rounded-xl flex items-center justify-center p-1.5 shrink-0 border border-[#EADFD5]"
                      style={{ background: item.themeColor || '#FAF3ED' }}
                    >
                      <div className="w-12 h-16 bg-[#221F1E] rounded-md p-1 shadow-xs flex flex-col justify-between">
                        <div className="h-1 bg-[#EADFD5] w-full rounded-full"></div>
                        <div className="h-1 bg-[#F5ECE5] w-2/3 rounded-full"></div>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-[#917E73]">
                        <span>{item.category}</span>
                        <span>•</span>
                        <span className="text-[#3E7C53] flex items-center gap-0.5">
                          <CheckCircle2 className="w-2.5 h-2.5" /> Licensed
                        </span>
                      </div>
                      <h4 className="font-serif text-base font-medium text-[#29221F] truncate mt-0.5">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-[#7C6C63] line-clamp-1 mt-0.5">
                        {item.shortDesc}
                      </p>
                      <span className="inline-block mt-1 font-mono text-[10px] text-[#A19086]">
                        Format: {item.format || 'Interactive PDF + GoodNotes'}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-[#F2EAE2] flex items-center gap-2">
                    <button
                      onClick={() => {
                        onClose();
                        onOpenReader(item);
                      }}
                      className="flex-1 py-2 px-3 rounded-xl bg-[#29221F] hover:bg-[#433A34] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Open Live Reader</span>
                    </button>

                    <button
                      onClick={() => downloadPlannerPdf(item)}
                      className="py-2 px-3 rounded-xl bg-white hover:bg-[#FAF4EE] border border-[#D8C7BA] text-[#4A3C35] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      title="Download PDF"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>PDF</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="bg-[#FAF5F0] p-4 border-t border-[#EADBCE] text-center text-xs text-[#827167]">
          <span>Protected DRM Digital License • Registered to your account</span>
        </div>

      </div>
    </div>
  );
}
