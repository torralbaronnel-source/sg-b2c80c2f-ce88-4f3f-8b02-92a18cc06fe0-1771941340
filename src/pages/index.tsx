import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Globe, 
  Zap, 
  Users, 
  Calendar, 
  CreditCard, 
  LineChart, 
  MessageSquare,
  ChevronRight,
  Menu,
  X,
  LogIn,
  Layers,
  Crown,
  Lock,
  Target,
  Rocket
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { ConciergeDialog } from "@/components/Communication/ConciergeDialog";

export default function LandingPage() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isConciergeOpen, setIsConciergeOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    const handleRouteChange = () => setIsMobileMenuOpen(false);
    router.events.on('routeChangeStart', handleRouteChange);
    return () => router.events.off('routeChangeStart', handleRouteChange);
  }, [router]);

  const navLinks = [
    { name: "Modules", href: "/modules", icon: Layers },
    { name: "Experience", href: "#experience", icon: Sparkles },
    { name: "Intelligence", href: "#intelligence", icon: LineChart },
    { name: "Contact", href: "#contact", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#D4AF37]/30 overflow-x-hidden">
      <SEO 
        title="Orchestrix | Elite Event Operating System" 
        description="The definitive operating system for high-scale wedding and event production agencies."
      />

      {/* Navigation Header */}
      <header 
        className={`fixed top-0 w-full z-[100] transition-all duration-500 ${
          isScrolled ? "bg-white/90 backdrop-blur-xl border-b border-neutral-200/50 py-3" : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-[#D4AF37] rounded-xl flex items-center justify-center shadow-lg shadow-[#D4AF37]/20 group-hover:scale-105 transition-transform duration-300">
              <span className="text-white font-bold text-xl">O</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-neutral-900 tracking-tight leading-none">Orchestrix</h1>
              <p className="text-[10px] text-[#D4AF37] uppercase tracking-widest font-black mt-0.5">Operating System</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className="text-sm font-semibold text-neutral-600 hover:text-[#D4AF37] transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <div className="h-4 w-px bg-neutral-200 mx-2" />
            <Link href="/login" className="text-sm font-bold text-neutral-900 hover:text-[#D4AF37] transition-colors">
              Login
            </Link>
            <Button 
              onClick={() => router.push("/signup")}
              className="bg-neutral-900 text-white hover:bg-[#D4AF37] rounded-full px-8 py-6 text-sm font-bold transition-all duration-300 shadow-xl shadow-black/5"
            >
              Get Started
            </Button>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-neutral-900 hover:text-[#D4AF37] transition-colors"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {/* Dedicated Luxury Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[90] md:hidden bg-white flex flex-col pt-24 pb-12 px-8 overflow-y-auto"
          >
            <div className="flex-grow space-y-8">
              <div className="space-y-4">
                <p className="text-[10px] uppercase tracking-[0.3em] font-black text-[#D4AF37]">Explore Platform</p>
                <div className="grid gap-2">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link 
                        href={link.href}
                        className="flex items-center justify-between p-4 rounded-2xl bg-neutral-50 border border-neutral-100 active:bg-[#D4AF37]/5 active:border-[#D4AF37]/20 transition-all"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#D4AF37] shadow-sm">
                            <link.icon size={20} />
                          </div>
                          <span className="text-lg font-bold text-neutral-900">{link.name}</span>
                        </div>
                        <ChevronRight size={20} className="text-neutral-300" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <p className="text-[10px] uppercase tracking-[0.3em] font-black text-[#D4AF37]">Access Portal</p>
                <div className="grid grid-cols-2 gap-4">
                  <Link 
                    href="/login"
                    className="flex flex-col items-center justify-center p-6 rounded-3xl bg-neutral-50 border border-neutral-100 active:scale-95 transition-transform"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-neutral-900 shadow-sm mb-3">
                      <LogIn size={24} />
                    </div>
                    <span className="font-bold text-neutral-900">Login</span>
                  </Link>
                  <Link 
                    href="/signup"
                    className="flex flex-col items-center justify-center p-6 rounded-3xl bg-neutral-900 border border-neutral-900 active:scale-95 transition-transform shadow-lg shadow-black/10"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white mb-3">
                      <Zap size={24} />
                    </div>
                    <span className="font-bold text-white">Join Now</span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-neutral-100 flex items-center justify-between text-neutral-400">
              <p className="text-xs font-medium italic">Empowering Elite Event Production</p>
              <div className="flex space-x-4">
                <Globe size={18} />
                <ShieldCheck size={18} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {/* Hero Section */}
        <section className="relative pt-40 pb-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center space-x-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-full px-4 py-2 mb-8"
            >
              <Sparkles size={14} className="text-[#D4AF37]" />
              <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">Version 2.0 Now Live</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-8xl font-light text-neutral-900 tracking-tight leading-[1.1] mb-8"
            >
              The Operating <br /> System for <span className="font-semibold italic">Elite</span> Events.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-neutral-500 max-w-2xl mx-auto mb-12 leading-relaxed"
            >
              Transform your agency into a high-performance production house. Orchestrix synchronizes 
              every moving part of high-scale event logistics into one unified interface.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
            >
              <Button 
                onClick={() => router.push("/modules")}
                className="w-full sm:w-auto bg-neutral-900 text-white hover:bg-[#D4AF37] rounded-full px-10 py-8 text-lg font-bold transition-all duration-500 shadow-2xl shadow-black/20 group"
              >
                Explore Modules
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                onClick={() => setIsConciergeOpen(true)}
                variant="outline" 
                className="w-full sm:w-auto border-neutral-200 text-neutral-900 hover:bg-neutral-50 rounded-full px-10 py-8 text-lg font-bold"
              >
                Request Access
              </Button>
            </motion.div>
          </div>

          {/* Background Decorative Elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-[#D4AF37]/5 rounded-full blur-[120px] -z-10" />
        </section>

        {/* Intelligence Showcase (Restored) */}
        <section id="intelligence" className="py-32 bg-neutral-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-20 text-center max-w-3xl mx-auto">
              <h3 className="text-sm font-black uppercase tracking-[0.4em] text-[#D4AF37] mb-4">Operational Intelligence</h3>
              <p className="text-4xl font-light text-neutral-900 leading-tight">Elite systems designed for the <span className="font-semibold italic">world's most complex</span> event productions.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { 
                  title: "Dynamic CRM", 
                  desc: "Predictive client intelligence and lead scoring for luxury wedding agencies.", 
                  icon: Users,
                  tag: "Intelligence"
                },
                { 
                  title: "Live Timelines", 
                  desc: "Sub-second synchronization across all vendor teams, from catering to videography.", 
                  icon: Calendar,
                  tag: "Operations"
                },
                { 
                  title: "Revenue Ops", 
                  desc: "Automated high-scale financial production with installment and deposit tracking.", 
                  icon: CreditCard,
                  tag: "Finance"
                }
              ].map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white p-10 rounded-[40px] border border-neutral-200/60 hover:shadow-xl transition-all duration-500 group relative overflow-hidden"
                >
                  <div className="absolute top-6 right-8 text-[10px] font-black uppercase tracking-widest text-neutral-300 group-hover:text-[#D4AF37] transition-colors">{feature.tag}</div>
                  <div className="w-14 h-14 bg-neutral-50 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-[#D4AF37]/10 transition-all duration-500">
                    <feature.icon className="text-[#D4AF37]" size={28} />
                  </div>
                  <h4 className="text-xl font-bold text-neutral-900 mb-4">{feature.title}</h4>
                  <p className="text-neutral-500 leading-relaxed mb-6">{feature.desc}</p>
                  <div className="flex items-center text-[#D4AF37] font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    View Specs <ChevronRight size={16} className="ml-1" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Infrastructure Section (Restored) */}
        <section id="experience" className="py-32 bg-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div>
                <h3 className="text-sm font-black uppercase tracking-[0.4em] text-[#D4AF37] mb-6">Advanced Infrastructure</h3>
                <h2 className="text-5xl font-light text-neutral-900 mb-8 leading-tight">Scale your agency <span className="font-semibold italic">without the friction</span> of legacy tools.</h2>
                <div className="space-y-6">
                  {[
                    { title: "Military-Grade Security", desc: "Enterprise RLS policies protect your elite client data.", icon: ShieldCheck },
                    { title: "Global Coordination", desc: "Real-time sync across time zones and vendor locations.", icon: Globe },
                    { title: "Sub-Second Latency", desc: "React-powered interfaces for lightning-fast logistics.", icon: Zap }
                  ].map((item, i) => (
                    <div key={i} className="flex space-x-4">
                      <div className="mt-1 w-6 h-6 rounded-full bg-[#D4AF37]/10 flex items-center justify-center flex-shrink-0">
                        <item.icon size={12} className="text-[#D4AF37]" />
                      </div>
                      <div>
                        <h4 className="font-bold text-neutral-900">{item.title}</h4>
                        <p className="text-sm text-neutral-500">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square bg-neutral-50 rounded-[60px] border border-neutral-100 overflow-hidden relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2/3 space-y-4">
                      <div className="h-4 w-1/2 bg-neutral-200 rounded-full animate-pulse" />
                      <div className="h-24 w-full bg-white rounded-3xl shadow-sm border border-neutral-100 p-4 flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10" />
                        <div className="flex-grow space-y-2">
                          <div className="h-3 w-1/3 bg-neutral-200 rounded-full" />
                          <div className="h-2 w-full bg-neutral-100 rounded-full" />
                        </div>
                      </div>
                      <div className="h-24 w-full bg-white rounded-3xl shadow-lg border border-neutral-100 p-4 translate-x-12 flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full bg-neutral-900" />
                        <div className="flex-grow space-y-2">
                          <div className="h-3 w-1/2 bg-neutral-200 rounded-full" />
                          <div className="h-2 w-full bg-neutral-100 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Floating Stats */}
                <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-3xl shadow-2xl shadow-black/5 border border-neutral-100 hidden md:block">
                  <div className="text-3xl font-bold text-neutral-900">99.9%</div>
                  <div className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest">Uptime Precision</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Global Access Section (Restored) */}
        <section id="contact" className="py-32 bg-neutral-900 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-[60px] p-12 md:p-24 border border-neutral-700/50 text-center">
              <h3 className="text-sm font-black uppercase tracking-[0.4em] text-[#D4AF37] mb-8">Access the OS</h3>
              <h2 className="text-4xl md:text-6xl font-light text-white mb-12">Elite Production <br /> <span className="font-semibold italic">Starts Here.</span></h2>
              <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
                <Button 
                  onClick={() => setIsConciergeOpen(true)}
                  className="w-full md:w-auto bg-[#D4AF37] text-white hover:bg-white hover:text-neutral-900 rounded-full px-12 py-8 text-lg font-bold transition-all duration-500"
                >
                  Consult Concierge
                </Button>
                <Button 
                  onClick={() => router.push("/modules")}
                  variant="outline" 
                  className="w-full md:w-auto border-neutral-600 text-white hover:bg-neutral-800 rounded-full px-12 py-8 text-lg font-bold"
                >
                  Browse Directory
                </Button>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[#D4AF37]/5 blur-[120px] -z-0" />
        </section>
      </main>

      {/* Footer */}
      <footer className="py-20 bg-white border-t border-neutral-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-[#D4AF37] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">O</span>
                </div>
                <span className="font-bold tracking-tight text-xl">ORCHESTRIX</span>
              </div>
              <p className="text-neutral-500 max-w-sm">The definitive operating system for high-scale wedding and event production agencies worldwide.</p>
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-neutral-900 mb-6">Platform</h4>
              <div className="flex flex-col space-y-4">
                <Link href="/modules" className="text-sm text-neutral-500 hover:text-[#D4AF37]">Modules</Link>
                <Link href="/login" className="text-sm text-neutral-500 hover:text-[#D4AF37]">Enterprise Login</Link>
                <Link href="/signup" className="text-sm text-neutral-500 hover:text-[#D4AF37]">Request Access</Link>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-neutral-900 mb-6">Legal</h4>
              <div className="flex flex-col space-y-4">
                <Link href="/terms" className="text-sm text-neutral-500 hover:text-[#D4AF37]">Terms of Service</Link>
                <Link href="/privacy" className="text-sm text-neutral-500 hover:text-[#D4AF37]">Privacy Policy</Link>
                <Link href="#" className="text-sm text-neutral-500 hover:text-[#D4AF37]">Security</Link>
              </div>
            </div>
          </div>
          <div className="pt-12 border-t border-neutral-100 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">© {new Date().getFullYear()} Orchestrix Intelligence Group. All rights reserved.</p>
            <div className="flex space-x-6">
              <div className="flex items-center space-x-2 grayscale opacity-50">
                <Globe size={14} />
                <span className="text-[10px] font-bold">GLOBAL OS</span>
              </div>
              <div className="flex items-center space-x-2 grayscale opacity-50">
                <ShieldCheck size={14} />
                <span className="text-[10px] font-bold">SECURE INFRA</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Concierge Dialog */}
      <ConciergeDialog open={isConciergeOpen} onOpenChange={setIsConciergeOpen} />
    </div>
  );
}