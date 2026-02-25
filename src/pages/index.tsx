import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { 
  Shield, 
  Layout, 
  MessageSquare, 
  Calendar, 
  BarChart3, 
  ArrowRight, 
  CheckCircle2, 
  Globe, 
  Users, 
  Zap,
  Play,
  Star,
  ChevronRight,
  Menu,
  X,
  CreditCard,
  Target,
  Workflow
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SEO } from "@/components/SEO";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { ConciergeDialog } from "@/components/Communication/ConciergeDialog";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

// Animation Variants
const fadeIn: Variants = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: false, margin: "-100px" },
  transition: { duration: 0.8, ease: "easeOut" }
};

const staggerContainer: Variants = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } }
};

const slideInLeft: Variants = {
  initial: { opacity: 0, x: -50 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: false },
  transition: { duration: 0.8, ease: "easeOut" }
};

const slideInRight: Variants = {
  initial: { opacity: 0, x: 50 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: false },
  transition: { duration: 0.8, ease: "easeOut" }
};

const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: false },
  transition: { duration: 0.8, ease: "easeOut" }
};

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("planning");
  const [conciergeOpen, setConciergeOpen] = useState(false);
  const [conciergeType, setConciergeType] = useState<"Business Consultation" | "Private Demo" | "Portal Customization">("Business Consultation");
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleRequestDemo = (type: "Business Consultation" | "Private Demo" | "Portal Customization" = "Private Demo") => {
    setConciergeType(type);
    setConciergeOpen(true);
  };

  const modules = [
    {
      id: "planning",
      title: "Orchestration Hub",
      description: "Master wedding timelines, ceremony flows, and reception programs in a single synchronized dashboard.",
      icon: Calendar,
      features: ["Live Timeline Sync", "Milestone Tracking", "Task Assignments", "Vendor Cueing"],
      color: "from-amber-500/20 to-amber-600/20"
    },
    {
      id: "finance",
      title: "Wealth & Budget",
      description: "Precise tracking of total budgets, paid vs unpaid vendors, and real-time expense categories in PHP.",
      icon: CreditCard,
      features: ["PHP Denomination", "Deposit Tracking", "Remaining Balance", "Expense Reports"],
      color: "from-emerald-500/20 to-emerald-600/20"
    },
    {
      id: "crm",
      title: "Client Synergy",
      description: "Complete lead management, contract signing, and invoice tracking for elite event planners.",
      icon: Users,
      features: ["Inquiry Capture", "Contract Signing", "Payment Tracking", "Client Portal"],
      color: "from-blue-500/20 to-blue-600/20"
    }
  ];

  return (
    <div className="min-h-screen bg-stone-950 text-white font-sans selection:bg-brand-primary selection:text-white overflow-x-hidden">
      <SEO />
      
      {/* Navigation */}
      <nav 
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled ? "bg-stone-950/80 backdrop-blur-xl border-b border-white/5 py-4" : "bg-transparent py-6"
        )}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shadow-lg shadow-brand-primary/20 group-hover:scale-110 transition-transform duration-500">
              <Zap className="w-6 h-6 text-stone-950 fill-current" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase italic">Orchestrix</span>
          </Link>

          <div className="hidden lg:flex items-center gap-12">
            <div className="flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-stone-400">
              <Link href="#features" className="hover:text-brand-primary transition-colors">Features</Link>
              <Link href="#modules" className="hover:text-brand-primary transition-colors">Modules</Link>
              <Link href="#pricing" className="hover:text-brand-primary transition-colors">Pricing</Link>
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <Link href="/dashboard">
                  <Button className="bg-white text-stone-950 hover:bg-stone-200 font-bold rounded-full px-8">Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link href="/login" className="text-sm font-bold uppercase tracking-widest hover:text-brand-primary transition-colors mr-4">Sign In</Link>
                  <Button 
                    className="bg-brand-primary hover:bg-brand-primary/90 text-stone-950 font-bold rounded-full px-8 shadow-lg shadow-brand-primary/10"
                    onClick={() => handleRequestDemo()}
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>

          <button className="lg:hidden text-white" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="w-8 h-8" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 lg:pt-60 lg:pb-52 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-primary/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div {...fadeIn}>
              <Badge className="bg-brand-primary/10 text-brand-primary border-brand-primary/20 mb-8 py-2 px-6 rounded-full text-sm font-bold tracking-widest uppercase">
                Now Live: Next-Gen Event Production
              </Badge>
            </motion.div>
            
            <motion.h1 
              className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.9] mb-12 uppercase"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              Total <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-amber-200 to-brand-primary animate-gradient italic">Orchestration</span>
            </motion.h1>
            
            <motion.p 
              className="text-stone-400 text-xl md:text-2xl max-w-2xl mx-auto mb-16 font-medium leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              The definitive operating system for elite wedding planners and production houses. Elevate every detail from inquiry to applause.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Button 
                size="lg" 
                className="bg-brand-primary hover:bg-brand-primary/90 text-stone-950 font-black px-12 py-8 text-xl rounded-full shadow-2xl shadow-brand-primary/20 transition-all hover:scale-105 active:scale-95 group"
                onClick={() => handleRequestDemo()}
              >
                Request Access <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white/10 hover:bg-white/5 px-12 py-8 text-xl rounded-full font-bold backdrop-blur-sm"
              >
                Watch Film <Play className="ml-2 fill-current w-4 h-4" />
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Stats Section */}
        <motion.div 
          className="container mx-auto px-6 mt-32 border-t border-white/5 pt-20"
          {...fadeIn}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 max-w-4xl mx-auto">
            <div className="text-center space-y-2 group">
              <div className="text-4xl md:text-6xl font-black text-white group-hover:text-brand-primary transition-colors">100+</div>
              <div className="text-xs uppercase tracking-[0.3em] font-bold text-stone-500">Active Events</div>
            </div>
            <div className="text-center space-y-2 group">
              <div className="text-4xl md:text-6xl font-black text-white group-hover:text-brand-primary transition-colors">300</div>
              <div className="text-xs uppercase tracking-[0.3em] font-bold text-stone-500">Elite Planners</div>
            </div>
            <div className="text-center space-y-2 group col-span-2 md:col-span-1">
              <div className="text-4xl md:text-6xl font-black text-white group-hover:text-brand-primary transition-colors">₱50K+</div>
              <div className="text-xs uppercase tracking-[0.3em] font-bold text-stone-500">Production Value</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Trust Section */}
      <section className="py-24 bg-stone-900/30">
        <div className="container mx-auto px-6">
          <motion.p 
            className="text-center text-stone-500 text-sm font-bold uppercase tracking-[0.4em] mb-12"
            {...fadeIn}
          >
            Trusted by the World's Leading Production Teams
          </motion.p>
          <motion.div 
            className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all duration-700"
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: false }}
          >
            {["VOGUE", "HARPER'S", "BRIDES", "THE KNOT", "TATLER"].map((brand) => (
              <motion.span key={brand} className="text-3xl font-black tracking-tighter italic" variants={fadeIn}>
                {brand}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Modules Section */}
      <section id="modules" className="py-32 relative">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div className="space-y-8" variants={slideInLeft} initial="initial" whileInView="whileInView" viewport={{ once: false }}>
              <div className="w-16 h-1 bg-brand-primary" />
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-tight">
                One System. <br />
                <span className="italic font-serif normal-case text-brand-primary">Total Control.</span>
              </h2>
              <p className="text-stone-400 text-xl font-medium leading-relaxed">
                Orchestrix centralizes every aspect of luxury event management into a single, high-performance interface. No more fragmented tools.
              </p>
              
              <div className="space-y-4 pt-8">
                {modules.map((module) => (
                  <button
                    key={module.id}
                    onClick={() => setActiveTab(module.id)}
                    className={cn(
                      "w-full flex items-center gap-6 p-6 rounded-2xl transition-all duration-500 border text-left",
                      activeTab === module.id 
                        ? "bg-white/5 border-white/10 translate-x-4 shadow-xl" 
                        : "border-transparent text-stone-500 hover:text-white"
                    )}
                  >
                    <module.icon className={cn("w-6 h-6", activeTab === module.id ? "text-brand-primary" : "")} />
                    <span className="text-xl font-bold tracking-tight uppercase">{module.title}</span>
                    {activeTab === module.id && <ChevronRight className="ml-auto w-5 h-5 text-brand-primary" />}
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div className="relative" variants={slideInRight} initial="initial" whileInView="whileInView" viewport={{ once: false }}>
              <AnimatePresence mode="wait">
                {modules.map((module) => module.id === activeTab && (
                  <motion.div
                    key={module.id}
                    initial={{ opacity: 0, scale: 0.95, x: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95, x: -20 }}
                    transition={{ duration: 0.5 }}
                    className="relative group"
                  >
                    <div className={cn("absolute inset-0 bg-gradient-to-br rounded-[40px] blur-3xl opacity-20 -z-10", module.color)} />
                    <Card className="bg-stone-900/80 border-white/5 rounded-[40px] overflow-hidden backdrop-blur-xl shadow-2xl">
                      <CardContent className="p-12">
                        <div className="w-20 h-20 bg-brand-primary/10 rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500">
                          <module.icon className="w-10 h-10 text-brand-primary" />
                        </div>
                        <h3 className="text-4xl font-black text-white mb-6 uppercase tracking-tight">{module.title}</h3>
                        <p className="text-stone-400 text-lg mb-10 leading-relaxed font-medium">{module.description}</p>
                        <div className="grid grid-cols-2 gap-6">
                          {module.features.map((feature) => (
                            <div key={feature} className="flex items-center gap-3">
                              <CheckCircle2 className="w-5 h-5 text-brand-primary flex-shrink-0" />
                              <span className="text-stone-300 font-bold text-sm tracking-wide uppercase">{feature}</span>
                            </div>
                          ))}
                        </div>
                        <Button className="w-full mt-12 bg-white text-stone-950 hover:bg-stone-200 font-black rounded-2xl py-8 text-lg uppercase tracking-widest">
                          Explore Module
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Showcase */}
      <section id="features" className="py-32 bg-stone-900/20">
        <div className="container mx-auto px-6">
          <motion.div className="text-center max-w-3xl mx-auto mb-24" {...fadeIn}>
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8 leading-none">
              Built for <br />
              <span className="italic font-serif normal-case text-brand-primary">Uncompromising</span> Standards
            </h2>
            <p className="text-stone-400 text-xl font-medium">
              Every detail matters. We've engineered Orchestrix to handle the pressure of live production.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                icon: Shield, 
                title: "Bank-Grade Security", 
                desc: "Your client data is protected by the same security protocols used by global financial institutions." 
              },
              { 
                icon: Globe, 
                title: "Real-time Synergy", 
                desc: "Every change syncs instantly across your entire team. No more outdated timelines or miscommunications." 
              },
              { 
                icon: Workflow, 
                title: "Process Automation", 
                desc: "Automate contract generation, invoicing, and reminders so you can focus on the creative vision." 
              },
              { 
                icon: Target, 
                title: "Precision Execution", 
                desc: "Master minute-by-minute cues with a dashboard designed for the intensity of live event calls." 
              },
              { 
                icon: MessageSquare, 
                title: "Concierge Support", 
                desc: "Dedicated account managers who understand the event industry and your unique production needs." 
              },
              { 
                icon: BarChart3, 
                title: "Analytics Suite", 
                desc: "Insightful reporting on your business performance, from conversion rates to financial growth." 
              }
            ].map((feature, idx) => (
              <motion.div 
                key={idx} 
                className="group p-10 rounded-[32px] bg-stone-900/50 border border-white/5 hover:border-brand-primary/20 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-primary/5"
                variants={scaleIn}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: false }}
              >
                <div className="w-16 h-16 bg-brand-primary/5 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 group-hover:bg-brand-primary/10">
                  <feature.icon className="w-8 h-8 text-brand-primary" />
                </div>
                <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tight group-hover:text-brand-primary transition-colors">{feature.title}</h3>
                <p className="text-stone-500 group-hover:text-stone-400 transition-colors leading-relaxed font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-brand-primary/5 blur-[150px] -z-10" />
        <div className="container mx-auto px-6 text-center">
          <motion.div variants={scaleIn} initial="initial" whileInView="whileInView" viewport={{ once: false }}>
            <div className="flex justify-center gap-1 mb-10 text-brand-primary">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-8 h-8 fill-current" />)}
            </div>
            <h3 className="text-4xl md:text-6xl font-serif italic text-white leading-tight max-w-5xl mx-auto mb-16">
              "Orchestrix has fundamentally changed how we operate. It's the difference between managing an event and conducting a masterpiece."
            </h3>
            <div className="flex items-center justify-center gap-6">
              <div className="w-20 h-20 rounded-full bg-stone-800 border-2 border-brand-primary p-1">
                <div className="w-full h-full rounded-full bg-stone-700 flex items-center justify-center font-black text-2xl">SA</div>
              </div>
              <div className="text-left">
                <div className="text-2xl font-black uppercase text-white tracking-tight">Sofia Alexander</div>
                <div className="text-stone-500 font-bold uppercase tracking-widest text-sm">Founder, Aura Events Global</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 relative overflow-hidden bg-[#F5F5F4]">
        <motion.div 
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brand-accent/20 via-transparent to-transparent opacity-60" 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.6 }}
          transition={{ duration: 1.5 }}
        />
        
        <div className="container mx-auto px-6 relative text-center">
          <motion.div variants={fadeIn} initial="initial" whileInView="whileInView" viewport={{ once: false }}>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 text-stone-900 leading-tight">
              Ready to conduct your <br />
              <span className="italic font-serif text-brand-primary">masterpiece?</span>
            </h2>
            <p className="text-stone-600 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-medium">
              Join the world's most prestigious production teams. Experience the power of total orchestration.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-brand-primary hover:bg-brand-primary/90 text-white font-bold px-10 py-7 text-lg rounded-full shadow-xl transition-all hover:scale-105 active:scale-95"
                onClick={() => handleRequestDemo("Business Consultation")}
              >
                Business Consultation
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-stone-300 text-stone-900 hover:bg-white px-10 py-7 text-lg rounded-full backdrop-blur-sm transition-all hover:border-brand-primary"
                onClick={() => document.getElementById("modules")?.scrollIntoView({ behavior: "smooth" })}
              >
                Explore Modules
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-stone-950 border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
            <div className="col-span-2 lg:col-span-2 space-y-8">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-stone-950 fill-current" />
                </div>
                <span className="text-2xl font-black tracking-tighter uppercase italic">Orchestrix</span>
              </Link>
              <p className="text-stone-500 max-w-sm font-medium leading-relaxed">
                The world's most powerful platform for luxury event orchestration and production management.
              </p>
              <div className="flex gap-4">
                {["Twitter", "LinkedIn", "Instagram"].map((social) => (
                  <button key={social} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-stone-500 hover:text-white hover:bg-brand-primary/20 transition-all border border-transparent hover:border-brand-primary/20">
                    <Globe className="w-5 h-5" />
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-white font-black uppercase tracking-widest text-sm">Platform</h4>
              <ul className="space-y-4 text-stone-500 font-bold text-sm tracking-wide uppercase">
                <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#modules" className="hover:text-white transition-colors">Modules</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Integrations</Link></li>
              </ul>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-white font-black uppercase tracking-widest text-sm">Resources</h4>
              <ul className="space-y-4 text-stone-500 font-bold text-sm tracking-wide uppercase">
                <li><Link href="#" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Support</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">API Status</Link></li>
              </ul>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-white font-black uppercase tracking-widest text-sm">Legal</h4>
              <ul className="space-y-4 text-stone-500 font-bold text-sm tracking-wide uppercase">
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Cookies</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-stone-600 text-sm font-bold uppercase tracking-widest">
              © {new Date().getFullYear()} Orchestrix. All rights reserved.
            </p>
            <div className="flex items-center gap-8 text-xs font-bold uppercase tracking-[0.2em] text-stone-600">
              <Link href="#" className="hover:text-white">English (PH)</Link>
              <Link href="#" className="hover:text-white">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Concierge Manager Dialog */}
      <ConciergeDialog 
        isOpen={conciergeOpen} 
        onClose={() => setConciergeOpen(false)} 
        initialType={conciergeType}
      />

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="fixed inset-0 z-[100] bg-stone-950 p-6 flex flex-col"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className="flex justify-between items-center mb-16">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-stone-950 fill-current" />
                </div>
                <span className="text-2xl font-black tracking-tighter uppercase italic">Orchestrix</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X className="w-8 h-8" />
              </button>
            </div>
            
            <div className="flex flex-col gap-8 text-4xl font-black uppercase tracking-tighter">
              <Link href="#features" onClick={() => setMobileMenuOpen(false)}>Features</Link>
              <Link href="#modules" onClick={() => setMobileMenuOpen(false)}>Modules</Link>
              <Link href="#pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
              <div className="h-px bg-white/10 my-4" />
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
            </div>
            
            <Button 
              className="mt-auto bg-brand-primary text-stone-950 font-black py-8 text-xl rounded-2xl"
              onClick={() => {
                setMobileMenuOpen(false);
                handleRequestDemo();
              }}
            >
              Get Started
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}