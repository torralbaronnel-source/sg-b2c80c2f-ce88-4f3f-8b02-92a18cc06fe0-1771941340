import React, { useState } from "react";
import Head from "next/head";
import { motion } from "framer-motion";
import { 
  Users, 
  Calendar, 
  CreditCard, 
  Briefcase, 
  ArrowRight, 
  CheckCircle2, 
  Search, 
  Layout, 
  Maximize2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConciergeDialog } from "@/components/Communication/ConciergeDialog";
import { ModuleLightbox } from "@/components/Modules/ModuleLightbox";

const modules = [
  {
    id: "crm",
    title: "CRM & Inquiry Engine",
    description: "Capture, nurture, and convert high-value leads with a specialized event management workflow.",
    icon: Users,
    features: [
      "Automated Inquiry Capture",
      "Lead Scoring & Prioritization",
      "Custom Contract Generation",
      "Client Communication Portal"
    ]
  },
  {
    id: "timeline",
    title: "Master Timeline",
    description: "The central nervous system of your event. Orchestrate every second with surgical precision.",
    icon: Calendar,
    features: [
      "Drag-and-Drop Scheduling",
      "Vendor Call-Sheet Automation",
      "Real-time Program Sync",
      "Milestone Tracking"
    ]
  },
  {
    id: "finance",
    title: "Budget & Finance",
    description: "Crystal clear financial oversight. Track every cent from downpayment to final settlement.",
    icon: CreditCard,
    features: [
      "Automated Invoicing",
      "Payment Schedule Reminders",
      "Vendor Payout Tracking",
      "Expense Analytics"
    ]
  },
  {
    id: "vendor",
    title: "Vendor Portal",
    description: "Seamlessly coordinate with external partners. One source of truth for every provider.",
    icon: Briefcase,
    features: [
      "Digital Contract Signing",
      "Arrival & Duty Tracking",
      "Resource Requirement Lists",
      "Performance Ratings"
    ]
  }
];

export default function ModulesPage() {
  const [isConciergeOpen, setIsConciergeOpen] = useState(false);
  const [conciergeType, setConciergeType] = useState<"demo" | "consultation">("demo");
  const [selectedModule, setSelectedModule] = useState<typeof modules[0] | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const handleOpenLightbox = (module: typeof modules[0]) => {
    setSelectedModule(module);
    setIsLightboxOpen(true);
  };

  const handleRequestAction = (type: "demo" | "consultation") => {
    setConciergeType(type);
    setIsConciergeOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FBFBF9] text-[#2D2D2D] font-sans selection:bg-[#D4AF37]/30">
      <Head>
        <title>Modules | Orchestrix - Professional Event Coordination</title>
      </Head>

      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FBFBF9]/80 backdrop-blur-md border-b border-[#D4AF37]/10 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.href = "/"}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#B8860B]" />
            <span className="font-bold tracking-tighter text-xl">ORCHESTRIX</span>
          </div>
          <div className="flex items-center gap-6">
            <Button variant="ghost" onClick={() => window.location.href = "/"} className="text-sm font-semibold hover:text-[#D4AF37] transition-colors">Home</Button>
            <Button 
              onClick={() => handleRequestAction("demo")}
              className="bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white hover:shadow-lg transition-all font-semibold rounded-full px-6"
            >
              Get Access
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
            <span className="text-xs font-bold text-[#D4AF37] tracking-[0.2em] uppercase">Core Architecture</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-8"
          >
            Everything you need in one <br />
            <span className="bg-gradient-to-r from-[#D4AF37] via-[#B8860B] to-[#D4AF37] bg-clip-text text-transparent">high-octane suite.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-[#2D2D2D]/70 max-w-3xl mx-auto mb-12"
          >
            Ditch the messy spreadsheets. Orchestrix brings every vendor, contract, and floor plan into a single, beautiful dashboard designed for total event mastery.
          </motion.p>
        </div>
      </section>

      {/* Modules Detailed Sections */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto space-y-32">
          {modules.map((module, idx) => (
            <motion.div 
              key={module.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`flex flex-col ${idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-12 items-center`}
            >
              {/* Content Side */}
              <div className="flex-1 space-y-6">
                <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
                  <module.icon size={28} />
                </div>
                <h2 className="text-4xl font-bold tracking-tight">{module.title}</h2>
                <p className="text-lg text-[#2D2D2D]/70 leading-relaxed">
                  {module.description}
                </p>
                <div className="space-y-4 pt-4">
                  {module.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <CheckCircle2 className="text-[#D4AF37]" size={20} />
                      <span className="font-semibold">{feature}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-8">
                  <Button 
                    onClick={() => handleRequestAction("consultation")}
                    className="group border-2 border-[#D4AF37] bg-transparent text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white transition-all font-bold rounded-full px-8 py-6 h-auto"
                  >
                    Request Feature Walkthrough
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>

              {/* Interface Preview Side */}
              <div className="flex-1 w-full">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleOpenLightbox(module)}
                  className="relative aspect-video rounded-2xl bg-white border border-[#D4AF37]/20 shadow-xl overflow-hidden cursor-pointer group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FBFBF9] to-white" />
                  
                  {/* Conceptual UI Placeholder */}
                  <div className="absolute inset-4 rounded-xl bg-[#F5F5F4] border border-[#D4AF37]/10 overflow-hidden">
                    <div className="h-8 bg-[#D4AF37]/5 border-b border-[#D4AF37]/10 flex items-center px-4 gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#D4AF37]/30" />
                      <div className="w-2 h-2 rounded-full bg-[#D4AF37]/30" />
                      <div className="w-2 h-2 rounded-full bg-[#D4AF37]/30" />
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="h-4 bg-[#D4AF37]/10 rounded-full w-3/4" />
                      <div className="h-24 bg-[#D4AF37]/5 rounded-xl w-full" />
                      <div className="grid grid-cols-2 gap-4">
                        <div className="h-12 bg-[#D4AF37]/5 rounded-xl w-full" />
                        <div className="h-12 bg-[#D4AF37]/5 rounded-xl w-full" />
                      </div>
                    </div>
                  </div>

                  {/* Lightbox Trigger Overlay */}
                  <div className="absolute inset-0 bg-[#D4AF37]/0 group-hover:bg-[#D4AF37]/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="p-4 rounded-full bg-white/90 shadow-lg text-[#D4AF37] backdrop-blur-sm">
                      <Maximize2 size={24} />
                    </div>
                  </div>

                  <div className="absolute bottom-6 right-6">
                    <p className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.3em] opacity-40">Orchestrix Preview</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-32 px-4 bg-white border-t border-[#D4AF37]/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-8">Ready to witness the full orchestration?</h2>
          <p className="text-xl text-[#2D2D2D]/70 mb-12">
            Experience the system designed for the Philippines' most prestigious production teams.
          </p>
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <Button 
              onClick={() => handleRequestAction("demo")}
              className="bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white px-10 py-7 text-lg font-bold rounded-full shadow-xl hover:shadow-2xl transition-all"
            >
              Request Access
            </Button>
            <Button 
              variant="outline"
              onClick={() => handleRequestAction("consultation")}
              className="border-[#D4AF37] text-[#D4AF37] px-10 py-7 text-lg font-bold rounded-full hover:bg-[#D4AF37]/5"
            >
              Talk to a Consultant
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-[#FBFBF9] border-t border-[#D4AF37]/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#D4AF37]" />
            <span className="font-bold tracking-tighter">ORCHESTRIX</span>
          </div>
          <div className="flex gap-8 text-xs font-bold text-[#D4AF37]/60 tracking-widest uppercase">
            <a href="/terms" className="hover:text-[#D4AF37] transition-colors">Terms</a>
            <a href="/privacy" className="hover:text-[#D4AF37] transition-colors">Privacy</a>
          </div>
          <p className="text-xs font-medium text-[#2D2D2D]/40">
            © 2026 ORCHESTRIX PH. BUILT FOR EXCELLENCE.
          </p>
        </div>
      </footer>

      <ConciergeDialog 
        isOpen={isConciergeOpen} 
        onClose={() => setIsConciergeOpen(false)}
        type={conciergeType}
      />

      <ModuleLightbox 
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        module={selectedModule}
      />
    </div>
  );
}