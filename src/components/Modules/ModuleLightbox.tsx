import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, Layout, Activity, Settings, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ModuleDetail {
  id: string;
  title: string;
  tagline: string;
  description: string;
  features: string[];
  interfaceTitle: string;
}

interface ModuleLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  module: ModuleDetail | null;
}

export function ModuleLightbox({ isOpen, onClose, module }: ModuleLightboxProps) {
  if (!module) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#2D2D2D]/90 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-6xl max-h-[90vh] bg-[#FBFBF9] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-[#D4AF37]/30"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 text-[#2D2D2D] backdrop-blur-sm transition-colors border border-[#D4AF37]/20"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Left Side: Descriptive Content */}
            <div className="w-full md:w-1/3 p-8 md:p-12 border-b md:border-b-0 md:border-r border-[#D4AF37]/10 flex flex-col justify-center bg-white">
              <div className="flex items-center gap-3 text-[#D4AF37] mb-6">
                <div className="p-2 rounded-lg bg-[#D4AF37]/10">
                  <Info className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold tracking-[0.2em] uppercase">Module Deep Dive</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-serif text-[#2D2D2D] mb-4">
                {module.title}
              </h2>
              <p className="text-[#D4AF37] font-medium mb-6 italic">
                {module.tagline}
              </p>
              <p className="text-[#666666] leading-relaxed mb-8">
                {module.description}
              </p>

              <div className="space-y-4">
                <p className="text-sm font-bold text-[#2D2D2D] uppercase tracking-wider mb-4">Included Capabilities</p>
                {module.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3 group">
                    <CheckCircle2 className="w-5 h-5 text-[#D4AF37] mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="text-sm text-[#444444] leading-tight">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-12 pt-8 border-t border-[#D4AF37]/10">
                <Button 
                  className="w-full bg-[#D4AF37] hover:bg-[#B8962E] text-white rounded-xl py-6 h-auto text-lg font-semibold"
                  onClick={onClose}
                >
                  Close Preview
                </Button>
              </div>
            </div>

            {/* Right Side: Conceptual UI Preview */}
            <div className="w-full md:w-2/3 bg-[#F0F0EB] relative p-8 md:p-12 flex items-center justify-center overflow-hidden">
              {/* Background Glows */}
              <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#D4AF37]/10 blur-[120px] rounded-full" />
              <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#D4AF37]/5 blur-[120px] rounded-full" />

              {/* Interface Window */}
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#D4AF37]/20 overflow-hidden"
              >
                {/* Window Header */}
                <div className="bg-[#2D2D2D] p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-amber-400" />
                      <div className="w-3 h-3 rounded-full bg-emerald-400" />
                    </div>
                    <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-medium hidden sm:block">
                      {module.interfaceTitle}
                    </span>
                  </div>
                  <div className="flex gap-4">
                    <Activity className="w-4 h-4 text-[#D4AF37]/50" />
                    <Settings className="w-4 h-4 text-white/20" />
                  </div>
                </div>

                {/* Window Body (Conceptual Content) */}
                <div className="p-8 space-y-8">
                  <div className="flex justify-between items-end">
                    <div className="space-y-2">
                      <div className="h-2 w-24 bg-[#D4AF37]/20 rounded" />
                      <div className="h-6 w-48 bg-[#2D2D2D] rounded" />
                    </div>
                    <div className="h-10 w-10 bg-[#D4AF37]/10 rounded-full border border-[#D4AF37]/20" />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="aspect-video bg-gray-50 rounded-lg border border-gray-100 flex flex-col p-4 justify-between">
                        <div className="h-1.5 w-full bg-gray-200 rounded" />
                        <div className="h-4 w-1/2 bg-[#D4AF37]/40 rounded" />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <div className="flex gap-4 items-center">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg shrink-0" />
                      <div className="space-y-2 flex-1">
                        <div className="h-2 w-1/3 bg-gray-200 rounded" />
                        <div className="h-2 w-1/2 bg-gray-100 rounded" />
                      </div>
                    </div>
                    <div className="h-[120px] w-full bg-[#FBFBF9] border border-dashed border-[#D4AF37]/30 rounded-xl flex items-center justify-center">
                      <Layout className="w-8 h-8 text-[#D4AF37]/20" />
                    </div>
                  </div>
                </div>

                {/* Status Bar */}
                <div className="bg-gray-50 border-t border-gray-100 p-3 flex justify-between">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
                    <div className="h-2 w-16 bg-gray-200 rounded" />
                  </div>
                  <div className="h-2 w-24 bg-gray-200 rounded" />
                </div>
              </motion.div>

              {/* Caption Overlay */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full border border-[#D4AF37]/20 shadow-lg"
              >
                <p className="text-[10px] text-[#2D2D2D] font-bold uppercase tracking-[0.2em] whitespace-nowrap">
                  Conceptual System Preview • High Fidelity
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}