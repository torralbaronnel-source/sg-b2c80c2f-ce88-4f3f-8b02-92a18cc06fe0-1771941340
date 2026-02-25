import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, Layout, Calendar, CreditCard, Users } from "lucide-react";

interface ModuleLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  module: {
    title: string;
    description: string;
    features: string[];
    icon: any;
  } | null;
}

export function ModuleLightbox({ isOpen, onClose, module }: ModuleLightboxProps) {
  if (!module) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#FBFBF9]/95 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-6xl aspect-[16/10] bg-white rounded-2xl shadow-2xl border border-[#D4AF37]/20 overflow-hidden flex flex-col md:flex-row"
          >
            {/* Conceptual UI Sidebar */}
            <div className="w-full md:w-64 bg-[#F5F5F4] border-r border-[#D4AF37]/10 p-6 flex flex-col gap-8">
              <div className="flex items-center gap-3 text-[#D4AF37]">
                <module.icon size={24} />
                <span className="font-bold tracking-tight">ORCHESTRIX</span>
              </div>
              
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-2 bg-[#D4AF37]/10 rounded-full w-full" />
                ))}
              </div>
            </div>

            {/* Conceptual UI Content Area */}
            <div className="flex-1 p-8 md:p-12 overflow-y-auto">
              <div className="flex justify-between items-start mb-12">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#D4AF37] via-[#B8860B] to-[#D4AF37] bg-clip-text text-transparent mb-4">
                    {module.title}
                  </h2>
                  <p className="text-xl text-[#2D2D2D]/70 max-w-2xl">
                    {module.description}
                  </p>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-[#D4AF37]/10 rounded-full transition-colors text-[#D4AF37]"
                >
                  <X size={32} />
                </button>
              </div>

              {/* Grid of conceptual "Features" in the lightbox */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {module.features.map((feature, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start gap-4 p-6 rounded-xl bg-[#FBFBF9] border border-[#D4AF37]/5 shadow-sm"
                  >
                    <div className="mt-1 p-1 bg-[#D4AF37]/10 rounded text-[#D4AF37]">
                      <ChevronRight size={16} />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#2D2D2D] mb-1">{feature}</h4>
                      <div className="h-1.5 w-12 bg-[#D4AF37]/20 rounded-full" />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Bottom "Interface Simulation" */}
              <div className="mt-12 p-8 rounded-2xl bg-[#F5F5F4] border border-dashed border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]/40">
                <p className="font-medium uppercase tracking-[0.2em] text-sm">Conceptual System Preview Layer</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}