import React from "react";
import Head from "next/head";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Users, 
  Calendar, 
  DollarSign, 
  Truck, 
  MessageSquare, 
  ShieldCheck, 
  Smartphone, 
  Zap,
  Star,
  CheckCircle2,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ConciergeDialog } from "@/components/Communication/ConciergeDialog";
import { useState } from "react";
import Link from "next/link";

export default function LandingPage() {
  const [isConciergeOpen, setIsConciergeOpen] = useState(false);
  const [conciergeType, setConciergeType] = useState<"demo" | "consultation">("demo");

  const handleRequestAction = (type: "demo" | "consultation") => {
    setConciergeType(type);
    setIsConciergeOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FBFBF9] text-[#2D2D2D] font-sans selection:bg-[#D4AF37]/30">
      <Head>
        <title>Orchestrix | Luxury Event Coordination OS</title>
        <meta name="description" content="The premier operating system for high-end wedding and event production professionals." />
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
            <a href="#features" className="hover:text-[#D4AF37] transition-colors">Features</a>
            <a href="#modules" className="hover:text-[#D4AF37] transition-colors">Modules</a>
            <a href="#pricing" className="hover:text-[#D4AF37] transition-colors">Pricing</a>
          </div>
          <div className="flex gap-4 items-center">
            <button className="text-sm font-bold uppercase tracking-widest text-[#1A1A1A] hover:text-[#D4AF37] transition-colors">Sign In</button>
            <Button 
              className="btn-gold-master rounded-full px-6 py-2 text-xs"
              onClick={() => handleRequestAction("demo")}
            >
              Get Access
            </Button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION - GOLD & BONE */}
      <header className="relative pt-40 pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#D4AF37]/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-[#D4AF37]/10 rounded-full blur-[100px]" />
        </div>
        
        <div className="container relative z-10 mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <Badge className="bg-[#D4AF37]/10 text-[#B8860B] border-[#D4AF37]/20 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4">
              The Gold Standard of Production
            </Badge>
            <h1 className="text-6xl md:text-8xl font-black tracking-tight text-[#1A1A1A] leading-[0.9]">
              Redefining <span className="text-gold-gradient">Luxury</span><br />
              Event Orchestration
            </h1>
            <p className="text-xl md:text-2xl text-[#1A1A1A]/60 max-w-2xl mx-auto font-medium leading-relaxed">
              The elite operating system designed for world-class wedding planners and event architects.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-10">
              <Button 
                size="lg" 
                className="btn-gold-master rounded-full h-16 px-12 text-lg"
                onClick={() => handleRequestAction("demo")}
              >
                Request Access <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="btn-white-gold rounded-full h-16 px-12 text-lg"
                onClick={() => handleRequestAction("consultation")}
              >
                Business Consultation
              </Button>
            </div>
          </motion.div>
        </div>
      </header>

      {/* STATS SECTION */}
      <section className="bg-white border-y border-[#D4AF37]/10 py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {[
              { label: "Active Events", value: "100+", icon: Star },
              { label: "Elite Planners", value: "300+", icon: Users },
              { label: "Production Value", value: "₱50M+", icon: DollarSign }
            ].map((stat, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-center mb-4">
                  <stat.icon className="h-8 w-8 text-[#D4AF37]" />
                </div>
                <div className="text-5xl font-black text-[#1A1A1A]">{stat.value}</div>
                <div className="text-sm font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/40">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MODULES SECTION - REIMAGINED IN GOLD */}
      <section id="modules" className="py-32 section-luxury-bone">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-[#D4AF37]">The Core Modules</h2>
            <h3 className="text-5xl font-black text-[#1A1A1A]">Everything you need in <br /><span className="text-gold-gradient">one elite suite.</span></h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "CRM & Guest List", icon: Users, desc: "End-to-end client lifecycle and meticulous guest tracking." },
              { title: "Master Timeline", icon: Clock, desc: "Minute-by-minute execution plans with real-time sync." },
              { title: "Budget & Finance", icon: DollarSign, desc: "Sophisticated expense tracking and automated invoicing." },
              { title: "Vendor Portal", icon: Truck, desc: "Direct collaboration with your entire vendor network." }
            ].map((module, i) => (
              <div key={i} className="card-luxury p-8 group">
                <div className="h-14 w-14 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center mb-6 group-hover:bg-[#D4AF37] transition-all duration-500">
                  <module.icon className="h-6 w-6 text-[#D4AF37] group-hover:text-white transition-colors" />
                </div>
                <h4 className="text-xl font-bold text-[#1A1A1A] mb-3">{module.title}</h4>
                <p className="text-[#1A1A1A]/60 leading-relaxed text-sm">{module.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <div className="lg:w-1/2 space-y-8">
              <h2 className="text-5xl font-black text-[#1A1A1A] leading-tight">
                Engineered for <br /><span className="text-gold-gradient">Perfection.</span>
              </h2>
              <p className="text-lg text-[#1A1A1A]/60 leading-relaxed">
                We've obsessed over every micro-interaction to ensure you can manage thousands of details without breaking a sweat.
              </p>
              
              <div className="space-y-6">
                {[
                  { title: "Real-time Sync", icon: Zap, text: "Every update is instantly pushed to your team and vendors." },
                  { title: "Bank-Grade Security", icon: ShieldCheck, text: "Your client's sensitive data is protected by world-class encryption." },
                  { title: "Multi-Platform", icon: Smartphone, text: "Manage events from desktop, tablet, or mobile seamlessly." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="mt-1 h-6 w-6 rounded-full bg-[#D4AF37]/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="h-4 w-4 text-[#D4AF37]" />
                    </div>
                    <div>
                      <h5 className="font-bold text-[#1A1A1A]">{item.title}</h5>
                      <p className="text-sm text-[#1A1A1A]/50">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-[#D4AF37]/20 to-transparent rounded-3xl blur-2xl" />
              <div className="relative card-luxury p-4 aspect-video flex items-center justify-center">
                 <div className="text-[#D4AF37]/30 font-black text-2xl uppercase tracking-[0.5em]">Dashboard Preview</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-32 section-luxury-bone text-center border-t border-[#D4AF37]/10">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-6xl font-black text-[#1A1A1A] mb-8">
            Ready to conduct your <br /><span className="text-gold-gradient">masterpiece?</span>
          </h2>
          <p className="text-xl text-[#1A1A1A]/60 mb-12 max-w-2xl mx-auto">
            Join the Philippines' most prestigious production teams. Experience the power of total orchestration.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg" 
              className="btn-gold-master rounded-full h-16 px-16 text-lg"
              onClick={() => handleRequestAction("demo")}
            >
              Request Access
            </Button>
            <Link href="/modules">
              <Button 
                variant="outline" 
                size="lg" 
                className="btn-white-gold rounded-full h-16 px-12 text-lg"
              >
                Explore Modules
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* LUXURY FOOTER */}
      <footer className="bg-white py-20 border-t border-[#D4AF37]/10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div>
               <span className="text-xl font-black tracking-tighter text-[#1A1A1A]">
                ORCHESTRIX
              </span>
              <p className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A]/40 mt-2">
                Built for Excellence.
              </p>
            </div>
            <div className="flex gap-8 text-xs font-bold uppercase tracking-widest text-[#1A1A1A]/60">
              <a href="#" className="hover:text-[#D4AF37]">Features</a>
              <a href="#" className="hover:text-[#D4AF37]">Modules</a>
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