import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { 
  ArrowRight, 
  ChevronRight, 
  Play, 
  CheckCircle2, 
  Calendar, 
  Users, 
  CreditCard, 
  MessageSquare,
  LayoutDashboard,
  Zap,
  Shield,
  Star,
  Menu,
  X,
  Globe,
  Settings,
  Sparkles,
  Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ConciergeDialog } from "@/components/Communication/ConciergeDialog";

// Animation Variants
const fadeIn: Variants = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 }
};

const staggerContainer: Variants = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } }
};

const slideInLeft: Variants = {
  initial: { opacity: 0, x: -50 },
  whileInView: { opacity: 1, x: 0 }
};

const slideInRight: Variants = {
  initial: { opacity: 0, x: 50 },
  whileInView: { opacity: 1, x: 0 }
};

const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  whileInView: { opacity: 1, scale: 1 }
};

// Common transition
const commonTransition = { duration: 0.8, ease: "easeOut" as const };
const commonViewport = { once: false, margin: "-100px" };

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [conciergeOpen, setConciergeOpen] = useState(false);
  const [conciergeType, setConciergeType] = useState<"demo" | "consultation">("demo");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleRequestDemo = (type: "demo" | "consultation") => {
    const mappedType = type === "demo" ? "Private Demo" : "Business Consultation";
    setConciergeType(mappedType as any);
    setConciergeOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F4] text-stone-900 selection:bg-brand-primary selection:text-white font-sans overflow-x-hidden">
      <Head>
        <title>Orchestrix | The Operating System for Elite Event Production</title>
        <meta name="description" content="Total orchestration for premium wedding planners and production houses in the Philippines." />
      </Head>

      {/* Navigation */}
      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled ? "bg-white/80 backdrop-blur-xl border-b border-stone-200 py-4" : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shadow-lg shadow-brand-primary/20 group-hover:rotate-12 transition-transform duration-500">
              <Zap className="text-white w-6 h-6 fill-current" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase text-stone-950">
              Orchestrix
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-10">
            {["Features", "Modules", "Pricing"].map((item) => (
              <Link 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className="text-sm font-bold uppercase tracking-widest text-stone-600 hover:text-brand-primary transition-colors"
              >
                {item}
              </Link>
            ))}
            <Link href="/login">
              <Button variant="ghost" className="text-sm font-bold uppercase tracking-widest hover:bg-stone-100">
                Sign In
              </Button>
            </Link>
            <Button 
              onClick={() => handleRequestDemo("demo")}
              className="bg-brand-primary hover:bg-brand-primary/90 text-white px-8 py-6 rounded-full text-sm font-bold uppercase tracking-widest shadow-xl shadow-brand-primary/20"
            >
              Get Access
            </Button>
          </div>

          <button className="lg:hidden text-stone-950" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="w-8 h-8" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-[120px] -z-10 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-stone-200/50 rounded-full blur-[120px] -z-10" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div variants={fadeIn} initial="initial" whileInView="whileInView" transition={commonTransition} viewport={commonViewport}>
              <Badge className="bg-brand-primary/10 text-brand-primary border-brand-primary/20 mb-8 py-2 px-6 rounded-full text-sm font-bold tracking-widest uppercase">
                Premium Event Solutions | Philippines
              </Badge>
            </motion.div>
            
            <motion.h1 
              className="text-7xl md:text-9xl font-black tracking-tighter text-stone-950 mb-10 leading-[0.85]"
              variants={fadeIn}
              initial="initial"
              whileInView="whileInView"
              transition={{ ...commonTransition, delay: 0.1 }}
              viewport={commonViewport}
            >
              TOTAL <br />
              <span className="text-brand-primary italic font-serif font-normal lowercase tracking-normal">Orchestration.</span>
            </motion.h1>

            <motion.p 
              className="text-xl md:text-2xl text-stone-600 mb-14 leading-relaxed max-w-2xl mx-auto font-medium"
              variants={fadeIn}
              initial="initial"
              whileInView="whileInView"
              transition={{ ...commonTransition, delay: 0.2 }}
              viewport={commonViewport}
            >
              The definitive operating system for elite wedding planners and production houses. Elevate every detail from inquiry to applause.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
              variants={fadeIn}
              initial="initial"
              whileInView="whileInView"
              transition={{ ...commonTransition, delay: 0.3 }}
              viewport={commonViewport}
            >
              <Button 
                onClick={() => handleRequestDemo("consultation")}
                className="bg-brand-primary hover:bg-brand-primary/90 text-white w-full sm:w-auto px-10 py-8 rounded-full text-lg font-bold uppercase tracking-widest shadow-2xl shadow-brand-primary/20"
              >
                Request Access <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button variant="outline" className="w-full sm:w-auto px-10 py-8 rounded-full text-lg font-bold uppercase tracking-widest border-2 border-stone-200 hover:bg-stone-50">
                Watch Film <Play className="ml-2 w-5 h-5 fill-current" />
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Stats Section */}
        <motion.div 
          className="container mx-auto px-6 mt-32 border-t border-stone-200 pt-20"
          variants={fadeIn}
          initial="initial"
          whileInView="whileInView"
          transition={commonTransition}
          viewport={commonViewport}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 max-w-4xl mx-auto">
            <div className="text-center space-y-2 group">
              <div className="text-5xl font-black text-stone-950 tracking-tighter group-hover:text-brand-primary transition-colors">100+</div>
              <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-stone-400">Active Events</div>
            </div>
            <div className="text-center space-y-2 group">
              <div className="text-5xl font-black text-stone-950 tracking-tighter group-hover:text-brand-primary transition-colors">300</div>
              <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-stone-400">Elite Planners</div>
            </div>
            <div className="text-center space-y-2 group">
              <div className="text-5xl font-black text-stone-950 tracking-tighter group-hover:text-brand-primary transition-colors">₱50K+</div>
              <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-stone-400">Production Value</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Modules Section */}
      <section id="modules" className="py-32 relative bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div 
              className="space-y-8" 
              variants={slideInLeft} 
              initial="initial" 
              whileInView="whileInView" 
              transition={commonTransition} 
              viewport={commonViewport}
            >
              <Badge className="bg-brand-primary/10 text-brand-primary border-brand-primary/20 py-2 px-4 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase">
                The Core Modules
              </Badge>
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-stone-950 leading-[0.9]">
                Everything you need <br />
                <span className="text-stone-400">in one high-octane suite.</span>
              </h2>
              <p className="text-xl text-stone-600 leading-relaxed font-medium">
                Ditch the messy spreadsheets. Orchestrix brings every vendor, contract, and floor plan into a single, beautiful dashboard.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-6 pt-6">
                {[
                  { icon: <Users />, label: "CRM & Guest List" },
                  { icon: <Calendar />, label: "Master Timeline" },
                  { icon: <CreditCard />, label: "Budget & Finance" },
                  { icon: <Settings />, label: "Vendor Portal" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200 hover:border-brand-primary/30 transition-colors group">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-stone-400 group-hover:text-brand-primary transition-colors shadow-sm">
                      {item.icon}
                    </div>
                    <span className="font-bold text-stone-950 tracking-tight">{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              className="relative" 
              variants={slideInRight} 
              initial="initial" 
              whileInView="whileInView" 
              transition={commonTransition} 
              viewport={commonViewport}
            >
              <div className="aspect-square rounded-[40px] bg-gradient-to-tr from-brand-primary/20 to-stone-200 overflow-hidden relative shadow-3xl">
                <div className="absolute inset-0 bg-white/40 backdrop-blur-3xl m-8 rounded-[32px] border border-white/50 shadow-inner flex items-center justify-center p-8">
                  <div className="w-full space-y-6">
                    <div className="h-12 w-3/4 bg-stone-200/50 rounded-full animate-pulse" />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-32 bg-brand-primary/10 rounded-2xl animate-pulse" />
                      <div className="h-32 bg-stone-100 rounded-2xl animate-pulse" />
                    </div>
                    <div className="h-24 bg-stone-100 rounded-2xl animate-pulse" />
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-2xl border border-stone-100 max-w-[200px]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Live Status</span>
                </div>
                <p className="text-sm font-bold text-stone-950">Grand Ballroom Event starts in 15m</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Showcase */}
      <section id="features" className="py-32 bg-stone-50">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-24" 
            variants={fadeIn} 
            initial="initial" 
            whileInView="whileInView" 
            transition={commonTransition} 
            viewport={commonViewport}
          >
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-stone-950 mb-8 leading-[0.9]">
              Engineered for <br />
              <span className="italic font-serif font-normal text-brand-primary tracking-normal">perfection.</span>
            </h2>
            <p className="text-xl text-stone-600 font-medium">
              We've obsessed over every micro-interaction to ensure you can manage thousands of details without breaking a sweat.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: <Zap className="w-10 h-10" />, 
                title: "Real-time Sync", 
                desc: "Every update is instantly pushed to your team and vendors. No more 'outdated version' errors."
              },
              { 
                icon: <Shield className="w-10 h-10" />, 
                title: "Bank-Grade Security", 
                desc: "Your clients' sensitive data and payment information are protected by world-class encryption."
              },
              { 
                icon: <Globe className="w-10 h-10" />, 
                title: "Multi-Platform", 
                desc: "Manage the event from your desktop, tablet, or mobile. Orchestrix goes where you go."
              }
            ].map((feature, idx) => (
              <motion.div 
                key={idx} 
                className="group p-10 rounded-[32px] bg-white border border-stone-200 hover:border-brand-primary/20 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl shadow-sm"
                variants={scaleIn}
                initial="initial"
                whileInView="whileInView"
                transition={commonTransition}
                viewport={commonViewport}
              >
                <div className="mb-8 w-16 h-16 rounded-2xl bg-stone-50 flex items-center justify-center text-stone-400 group-hover:text-brand-primary group-hover:bg-brand-primary/5 transition-all duration-500">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-black tracking-tight text-stone-950 mb-4">{feature.title}</h3>
                <p className="text-stone-500 leading-relaxed font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-32 relative overflow-hidden bg-white">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-brand-primary/5 blur-[150px] -z-10" />
        <div className="container mx-auto px-6 text-center">
          <motion.div 
            variants={scaleIn} 
            initial="initial" 
            whileInView="whileInView" 
            transition={commonTransition} 
            viewport={commonViewport}
          >
            <div className="flex justify-center gap-1 mb-10">
              {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-6 h-6 fill-brand-primary text-brand-primary" />)}
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-stone-950 max-w-4xl mx-auto mb-10 leading-[1.1]">
              "Orchestrix isn't just a tool; it's our secret weapon. Our client satisfaction scores have soared since we migrated our production to this system."
            </h2>
            <div className="flex items-center justify-center gap-4">
              <div className="w-14 h-14 rounded-full bg-stone-200" />
              <div className="text-left">
                <div className="font-black text-stone-950 tracking-tight">Regina M.</div>
                <div className="text-stone-400 text-sm font-bold uppercase tracking-widest">Lead Planner, Manila Events</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 relative overflow-hidden bg-[#F5F5F4]">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-primary/10 blur-[100px] -z-10" />
        <div className="container mx-auto px-6 relative text-center">
          <motion.div 
            variants={fadeIn} 
            initial="initial" 
            whileInView="whileInView" 
            transition={commonTransition} 
            viewport={commonViewport}
          >
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-stone-950 mb-10 leading-[0.85]">
              Ready to conduct your <br />
              <span className="text-brand-primary italic font-serif font-normal tracking-normal lowercase">masterpiece?</span>
            </h2>
            <p className="text-xl md:text-2xl text-stone-600 mb-14 font-medium">
              Join the Philippines' most prestigious production teams. Experience the power of total orchestration.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button 
                onClick={() => handleRequestDemo("consultation")}
                className="bg-brand-primary hover:bg-brand-primary/90 text-white w-full sm:w-auto px-12 py-8 rounded-full text-xl font-bold uppercase tracking-widest shadow-2xl shadow-brand-primary/30"
              >
                Business Consultation
              </Button>
              <Button 
                variant="outline" 
                className="w-full sm:w-auto px-12 py-8 rounded-full text-xl font-bold uppercase tracking-widest border-2 border-stone-300 text-stone-600 hover:bg-stone-50"
              >
                Explore Modules
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-white border-t border-stone-200">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
                <Zap className="text-white w-5 h-5 fill-current" />
              </div>
              <span className="text-xl font-black tracking-tighter uppercase text-stone-950">
                Orchestrix
              </span>
            </div>
            
            <div className="flex gap-8">
              {["Features", "Modules", "Terms", "Privacy"].map((link) => (
                <Link key={link} href={`/${link.toLowerCase()}`} className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 hover:text-brand-primary transition-colors">
                  {link}
                </Link>
              ))}
            </div>

            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">
              © {new Date().getFullYear()} Orchestrix PH. Built for excellence.
            </p>
          </div>
        </div>
      </footer>

      {/* Concierge System Integration */}
      <ConciergeDialog 
        isOpen={conciergeOpen} 
        onClose={() => setConciergeOpen(false)} 
        initialType={conciergeType}
      />

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[100] bg-white p-8 flex flex-col"
          >
            <div className="flex justify-between items-center mb-16">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
                  <Zap className="text-white w-5 h-5 fill-current" />
                </div>
                <span className="text-xl font-black tracking-tighter uppercase text-stone-950">
                  Orchestrix
                </span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X className="w-8 h-8 text-stone-950" />
              </button>
            </div>

            <div className="flex flex-col gap-10">
              {["Features", "Modules", "Pricing", "Login"].map((item) => (
                <Link 
                  key={item} 
                  href={item === "Login" ? "/login" : `#${item.toLowerCase()}`} 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-4xl font-black tracking-tighter text-stone-950 hover:text-brand-primary transition-colors uppercase"
                >
                  {item}
                </Link>
              ))}
            </div>

            <div className="mt-auto">
              <Button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleRequestDemo("consultation");
                }}
                className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white py-8 rounded-full text-xl font-bold uppercase tracking-widest shadow-xl shadow-brand-primary/20"
              >
                Request Access
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}