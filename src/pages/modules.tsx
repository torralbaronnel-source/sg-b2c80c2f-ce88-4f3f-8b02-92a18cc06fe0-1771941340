import React, { useState } from "react";
import Head from "next/head";
import { motion } from "framer-motion";
import { 
  Users, 
  Clock, 
  DollarSign, 
  Truck, 
  ChevronRight, 
  CheckCircle2, 
  BarChart3, 
  ShieldCheck, 
  Smartphone, 
  Zap,
  Star,
  ArrowRight,
  Layers,
  LayoutDashboard,
  CalendarDays,
  Receipt,
  Network
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ConciergeDialog } from "@/components/Communication/ConciergeDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ModulesPage() {
  const [isConciergeOpen, setIsConciergeOpen] = useState(false);
  const [conciergeType, setConciergeType] = useState<"demo" | "consultation">("demo");

  const handleRequestAction = (type: "demo" | "consultation") => {
    setConciergeType(type);
    setIsConciergeOpen(true);
  };

  const modules = [
    {
      id: "crm",
      title: "CRM & Guest List",
      icon: Users,
      tagline: "Total Client Lifecycle Management",
      description: "From the first inquiry to the final thank you note, manage every client interaction with precision. Our guest list manager handles everything from dietary requirements to table seating with ease.",
      features: [
        "Automated Lead Capture & Inquiry Forms",
        "Digital Contract Signing & Vault",
        "Intelligent Guest RSVP Tracking",
        "Dynamic Table Seating Designer",
        "Client Milestone Tracking"
      ],
      details: "Never lose a lead again. Orchestrix CRM prioritizes high-value inquiries and automates follow-ups, allowing you to focus on the creative vision while we handle the data."
    },
    {
      id: "timeline",
      title: "Master Timeline",
      icon: Clock,
      tagline: "The Pulse of Every Production",
      description: "A minute-by-minute blueprint that keeps everyone in sync. The Master Timeline is the central source of truth for your entire production team and all external vendors.",
      features: [
        "Minute-by-Minute Program Flow",
        "Real-time Updates for All Staff",
        "Automated Vendor Arrival Reminders",
        "Custom Script & Cue Management",
        "Multi-User Collaborative Editing"
      ],
      details: "Events are living organisms. When a ceremony runs late, Orchestrix automatically adjusts subsequent cues and notifies the catering team instantly."
    },
    {
      id: "finance",
      title: "Budget & Finance",
      icon: DollarSign,
      tagline: "Transparent Fiscal Control",
      description: "Sophisticated financial tools built for high-value events. Track every cent, manage vendor payments, and provide clients with crystal-clear budget transparency.",
      features: [
        "Real-time Budget vs. Actuals",
        "Automated Installment Reminders",
        "Vendor Payment & Deposit Tracking",
        "Integrated Invoicing System",
        "Expense Categorization & ROI Analysis"
      ],
      details: "Answer the 'How much have we spent?' question instantly. Our finance module provides beautiful PDF reports for clients at the click of a button."
    },
    {
      id: "vendor",
      title: "Vendor Portal",
      icon: Truck,
      tagline: "Your Network, Orchestrated",
      description: "Break the cycle of endless WhatsApp chats and email threads. A centralized hub where vendors can view their assignments, download files, and confirm arrival times.",
      features: [
        "Vendor Responsibility Matrix",
        "Document & File Sharing Vault",
        "Arrival & Departure Check-ins",
        "Direct Messaging Integration",
        "Post-Event Performance Reviews"
      ],
      details: "Empower your vendors with the information they need. From floor plans to dietary lists, give them a professional portal that reflects your standards."
    }
  ];

  return (
    <div className="min-h-screen bg-[#FBFBF9] font-sans selection:bg-[#D4AF37]/30">
      <Head>
        <title>Modules | Orchestrix Luxury Event OS</title>
        <meta name="description" content="Explore the comprehensive modules of Orchestrix, the elite production OS." />
      </Head>

      {/* LUXURY NAVIGATION */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-[#D4AF37]/10 py-4">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tighter text-[#1A1A1A]">
              ORCHESTRIX
            </span>
            <div className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
          </div>
          <div className="hidden md:flex gap-8 text-sm font-bold uppercase tracking-widest text-[#1A1A1A]/70">
            <a href="/" className="hover:text-[#D4AF37] transition-colors">Home</a>
            <a href="#crm" className="hover:text-[#D4AF37] transition-colors">CRM</a>
            <a href="#timeline" className="hover:text-[#D4AF37] transition-colors">Timeline</a>
            <a href="#finance" className="hover:text-[#D4AF37] transition-colors">Finance</a>
          </div>
          <Button 
            className="btn-gold-master rounded-full px-6 py-2 text-xs"
            onClick={() => handleRequestAction("demo")}
          >
            Get Access
          </Button>
        </div>
      </nav>

      {/* MODULES HERO */}
      <header className="pt-48 pb-24 text-center">
        <div className="container mx-auto px-6 max-w-4xl">
          <Badge className="bg-[#D4AF37]/10 text-[#B8860B] border-[#D4AF37]/20 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6">
            The Orchestration Suite
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black text-[#1A1A1A] mb-8">
            Engineered for <span className="text-gold-gradient">Excellence.</span>
          </h1>
          <p className="text-xl text-[#1A1A1A]/60 font-medium">
            Explore the powerful modules that make Orchestrix the definitive choice for world-class production teams.
          </p>
        </div>
      </header>

      {/* DETAILED MODULE SECTIONS */}
      <main className="pb-32">
        {modules.map((module, index) => (
          <section key={module.id} id={module.id} className={`py-24 ${index % 2 === 1 ? 'bg-white' : 'section-luxury-bone'}`}>
            <div className="container mx-auto px-6">
              <div className={`flex flex-col lg:flex-row gap-20 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                <div className="lg:w-1/2 space-y-8">
                  <div className="h-16 w-16 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center">
                    <module.icon className="h-8 w-8 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black uppercase tracking-[0.3em] text-[#D4AF37] mb-2">{module.tagline}</h2>
                    <h3 className="text-4xl md:text-5xl font-black text-[#1A1A1A]">{module.title}</h3>
                  </div>
                  <p className="text-lg text-[#1A1A1A]/60 leading-relaxed">
                    {module.description}
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    {module.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-[#D4AF37] flex-shrink-0" />
                        <span className="text-sm font-bold text-[#1A1A1A]/80">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-8">
                    <p className="text-[#1A1A1A]/50 italic text-sm mb-6 border-l-2 border-[#D4AF37]/30 pl-6">
                      "{module.details}"
                    </p>
                    <Button 
                      variant="outline"
                      className="btn-white-gold rounded-full px-8 py-6 h-auto group"
                      onClick={() => handleRequestAction("demo")}
                    >
                      Request {module.title} Demo <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>

                <div className="lg:w-1/2 relative">
                  <div className="absolute -inset-10 bg-gradient-to-br from-[#D4AF37]/10 to-transparent rounded-full blur-[80px]" />
                  <motion.div 
                    whileHover={{ y: -10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="relative card-luxury p-8 aspect-square flex flex-col items-center justify-center text-center space-y-6"
                  >
                    <div className="h-24 w-24 rounded-full bg-[#D4AF37]/5 flex items-center justify-center">
                      <module.icon className="h-12 w-12 text-[#D4AF37]/40" />
                    </div>
                    <div className="text-xs font-black uppercase tracking-[0.4em] text-[#D4AF37]/30">Module Interface Preview</div>
                    <div className="w-full h-2 bg-[#D4AF37]/5 rounded-full overflow-hidden">
                      <div className="h-full bg-gold-gradient w-2/3" />
                    </div>
                    <div className="grid grid-cols-3 gap-2 w-full">
                      <div className="h-20 bg-[#D4AF37]/5 rounded-xl" />
                      <div className="h-20 bg-[#D4AF37]/5 rounded-xl" />
                      <div className="h-20 bg-[#D4AF37]/5 rounded-xl" />
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </section>
        ))}
      </main>

      {/* FINAL CALL TO ACTION */}
      <section className="py-32 bg-white text-center border-y border-[#D4AF37]/10">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-5xl md:text-6xl font-black text-[#1A1A1A] mb-8">
            The full symphony of <br /><span className="text-gold-gradient">event production.</span>
          </h2>
          <p className="text-xl text-[#1A1A1A]/60 mb-12">
            Experience the most comprehensive suite of tools ever built for the luxury event market.
          </p>
          <Button 
            size="lg" 
            className="btn-gold-master rounded-full h-16 px-16 text-lg"
            onClick={() => handleRequestAction("demo")}
          >
            Start Your Orchestration
          </Button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div>
               <span className="text-xl font-black tracking-tighter text-[#1A1A1A]">
                ORCHESTRIX
              </span>
              <p className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A]/40 mt-2">
                Luxury Event Coordination OS.
              </p>
            </div>
            <div className="flex gap-8 text-xs font-bold uppercase tracking-widest text-[#1A1A1A]/60">
              <a href="/" className="hover:text-[#D4AF37]">Home</a>
              <a href="#" className="hover:text-[#D4AF37]">Pricing</a>
              <a href="#" className="hover:text-[#D4AF37]">Terms</a>
              <a href="#" className="hover:text-[#D4AF37]">Privacy</a>
            </div>
            <div className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A]/30">
              © 2026 ORCHESTRIX PH.
            </div>
          </div>
        </div>
      </footer>

      <ConciergeDialog 
        isOpen={isConciergeOpen}
        onClose={() => setIsConciergeOpen(false)}
        type={conciergeType}
      />
    </div>
  );
}