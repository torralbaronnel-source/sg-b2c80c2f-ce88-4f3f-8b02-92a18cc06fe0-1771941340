import React, { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { 
  Users, 
  Calendar, 
  Wallet, 
  ClipboardCheck, 
  MapPin, 
  Heart, 
  MessageSquare, 
  FileText, 
  ShieldCheck, 
  Clock, 
  Star, 
  Layers,
  ArrowRight,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
  CheckCircle2,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Twitter,
  LayoutDashboard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useInView } from "react-intersection-observer";
import { SEO } from "@/components/SEO";
import { ConciergeDialog } from "@/components/Communication/ConciergeDialog";
import { ConciergeRequestType } from "@/services/conciergeService";

// Types
interface Module {
  id: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  category: "Planning" | "Client" | "Finance" | "Logistics";
  deliverables: string[];
}

// Data
const modules: Module[] = [
  {
    id: "crm",
    title: "Client CRM",
    desc: "Intelligent lead capture and relationship management designed for elite event production.",
    icon: <Users />,
    category: "Client",
    deliverables: ["Lead Tracking", "Contact History", "Client Portals"]
  },
  {
    id: "timeline",
    title: "Master Timeline",
    desc: "A minute-by-minute orchestration engine for flawless event execution and vendor sync.",
    icon: <Clock />,
    category: "Planning",
    deliverables: ["Real-time Sync", "Vendor Cue Sheets", "Milestone Tracking"]
  },
  {
    id: "budget",
    title: "Wealth Tracker",
    desc: "Sophisticated budget management with deposit tracking and automated balance reminders.",
    icon: <Wallet />,
    category: "Finance",
    deliverables: ["Expense Analysis", "Payment Schedule", "ROI Reporting"]
  },
  {
    id: "rsvp",
    title: "RSVP Concierge",
    desc: "Advanced guest management with meal preferences, seating charts, and automated follow-ups.",
    icon: <ClipboardCheck />,
    category: "Logistics",
    deliverables: ["Digital Invitations", "Seating AI", "Dietary Matrix"]
  },
  {
    id: "vendors",
    title: "Vendor Hub",
    desc: "Centralized contract management and communication portal for your entire production team.",
    icon: <Star />,
    category: "Planning",
    deliverables: ["Contract Archiving", "Performance Ratings", "Arrival Tracking"]
  },
  {
    id: "seating",
    title: "Spatial Designer",
    desc: "Interactive floor plan builder and VIP seating arrangement with real-time venue mapping.",
    icon: <MapPin />,
    category: "Logistics",
    deliverables: ["3D Floor Plans", "VIP Placement", "Table Analytics"]
  },
  {
    id: "comm",
    title: "Comm Center",
    desc: "Unified communication hub for clients, vendors, and internal coordination teams.",
    icon: <MessageSquare />,
    category: "Client",
    deliverables: ["Internal Chat", "Broadcasts", "File Sharing"]
  },
  {
    id: "contracts",
    title: "Legal Vault",
    desc: "Digital signature workflow and contract management for iron-clad event agreements.",
    icon: <FileText />,
    category: "Finance",
    deliverables: ["E-Signatures", "Version Control", "Legal Templates"]
  },
  {
    id: "on-day",
    title: "On-Day Engine",
    desc: "The heartbeat of the event. Live updates, emergency tasks, and staff coordination.",
    icon: <Zap />,
    category: "Logistics",
    deliverables: ["Staff Comms", "Emergency Protocol", "Live Schedule"]
  },
  {
    id: "registry",
    title: "Registry Sync",
    desc: "Seamless gift and registry management integrated directly with your guest list.",
    icon: <Heart />,
    category: "Planning",
    deliverables: ["Gift Tracking", "Thank You Notes", "Multi-platform Sync"]
  },
  {
    id: "security",
    title: "Access Shield",
    desc: "Manage security teams, access points, and VIP protection protocols for high-stakes events.",
    icon: <ShieldCheck />,
    category: "Logistics",
    deliverables: ["QR Check-in", "Access Levels", "Security Logs"]
  },
  {
    id: "portal",
    title: "Admin Portal",
    desc: "Comprehensive dashboard for internal teams to manage multi-event production pipelines.",
    icon: <Layers />,
    category: "Planning",
    deliverables: ["Multi-Event View", "Team Roles", "Agency Analytics"]
  }
];

// Sub-components
function FeatureCard({ module, index, onOpenDetails }: { module: Module; index: number; onOpenDetails: () => void }) {
  // HOOKS MUST BE DECLARED AT THE TOP - NEVER CONDITIONALLY
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: "50px"
  });

  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);
  
  // Create a combined transformation for the spotlight to avoid multiple hooks
  const spotlightStyle = {
    background: useTransform(
      [mouseXSpring, mouseYSpring],
      ([mx, my]: any[]) => {
        // Map normalized -0.5 to 0.5 back to 0% to 100%
        const xPos = (mx + 0.5) * 100;
        const yPos = (my + 0.5) * 100;
        return `radial-gradient(600px circle at ${xPos}% ${yPos}%, rgba(212, 175, 55, 0.08), transparent 40%)`;
      }
    )
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = (mouseX / width) - 0.5;
    const yPct = (mouseY / height) - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // The check for inView happens AFTER hooks are declared
  return (
    <div ref={ref} className="h-full">
      <AnimatePresence mode="wait">
        {inView ? (
          <motion.div 
            layout
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            whileHover={{ 
              y: -8,
              transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
            }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            transition={{ 
              type: "spring", 
              stiffness: 100, 
              damping: 20,
              delay: (index % 3) * 0.1
            }}
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={onOpenDetails}
            style={{ 
              rotateX, 
              rotateY, 
              transformStyle: "preserve-3d",
              perspective: "1000px"
            }}
            className="luxury-card p-8 rounded-[2rem] flex flex-col gap-6 group cursor-pointer h-full will-change-transform relative overflow-hidden bg-white/50 backdrop-blur-sm border border-stone-100 shadow-sm"
          >
            {/* Spotlight Gradient - Using the stable useTransform value */}
            <motion.div 
              className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={spotlightStyle}
            />

            <motion.div 
              style={{ transform: "translateZ(50px)" }} 
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-12 h-12 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white group-hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all duration-500 shadow-sm"
            >
              {React.cloneElement(module.icon as React.ReactElement, { size: 24 })}
            </motion.div>

            <div style={{ transform: "translateZ(30px)" }} className="space-y-3 flex-1 relative z-10">
              <h3 className="text-xl font-bold text-brand-accent group-hover:text-brand-primary transition-colors duration-300">
                {module.title}
              </h3>
              <p className="text-stone-500 text-sm leading-relaxed font-medium">
                {module.desc}
              </p>
            </div>
            
            <motion.div 
              style={{ transform: "translateZ(20px)" }} 
              className="pt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-primary opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-[-10px] group-hover:translate-x-0"
            >
              Explore Module <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </motion.div>

            {/* Subtle Border Glow */}
            <div className="absolute inset-0 border border-transparent group-hover:border-brand-primary/20 rounded-[2rem] transition-colors duration-500 pointer-events-none" />
          </motion.div>
        ) : (
          <div className="luxury-card p-8 rounded-[2rem] opacity-0 h-full min-h-[300px]" />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [showConcierge, setShowConcierge] = useState(false);
  const [conciergeType, setConciergeType] = useState<ConciergeRequestType>("Private Demo");
  const cardsPerPage = 6;

  // Filter and search logic
  const filteredModules = useMemo(() => {
    return modules.filter(m => {
      const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            m.desc.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === "All" || m.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  // Pagination logic
  const totalPages = Math.ceil(filteredModules.length / cardsPerPage);
  const currentModules = filteredModules.slice((currentPage - 1) * cardsPerPage, currentPage * cardsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeCategory]);

  const scrollToGrid = () => {
    const grid = document.getElementById("feature-grid");
    if (grid) grid.scrollIntoView({ behavior: "smooth" });
  };

  const handleRequestDemo = (type: ConciergeRequestType = "Private Demo") => {
    setConciergeType(type);
    setShowConcierge(true);
  };

  const categories = ["All", "Planning", "Client", "Finance", "Logistics"];

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-brand-accent selection:bg-brand-primary/10 font-sans overflow-x-hidden">
      <SEO title="Orchestrix | Elite Event Production Management" />
      
      {/* Premium Navbar */}
      <nav className="fixed top-0 w-full z-[100] transition-all duration-500 bg-white/70 backdrop-blur-xl border-b border-stone-100">
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform duration-500">
              <Sparkles size={20} />
            </div>
            <div>
              <span className="text-xl font-black tracking-tighter uppercase text-brand-accent group-hover:text-brand-primary transition-colors">Orchestrix</span>
              <div className="h-0.5 w-0 group-hover:w-full bg-brand-primary transition-all duration-500" />
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-stone-500">
            <a href="#features" className="hover:text-brand-primary transition-colors">Experience</a>
            <a href="#about" className="hover:text-brand-primary transition-colors">Philosophy</a>
            <a href="#contact" className="hover:text-brand-primary transition-colors">Concierge</a>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-[11px] font-black uppercase tracking-widest hover:text-brand-primary">
                Portal
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="luxury-button rounded-full px-8 bg-brand-primary text-white hover:shadow-[0_10px_30px_rgba(212,175,55,0.4)]">
                Acquire Suite
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative pt-40 pb-32 px-6 overflow-hidden min-h-screen flex items-center">
          <div className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-30">
            <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-brand-primary/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-[10%] left-[-10%] w-[40%] h-[40%] bg-brand-primary/10 rounded-full blur-[100px]" />
          </div>

          <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-20 items-center relative z-10">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <Badge variant="outline" className="px-6 py-2 border-brand-primary/20 text-brand-primary rounded-full font-black uppercase tracking-[0.3em] text-[10px] bg-brand-primary/5">
                The Standard in Event Production
              </Badge>
              
              <h1 className="text-6xl md:text-8xl font-black text-brand-accent leading-[0.95] tracking-tighter">
                Orchestrate <br />
                <span className="text-brand-primary italic">Perfection.</span>
              </h1>
              
              <p className="text-xl text-stone-500 max-w-xl leading-relaxed font-medium">
                The comprehensive command center for elite wedding planners and luxury event producers. 
                Where every detail is synchronized and every moment is masterfully conducted.
              </p>

              <div className="flex flex-wrap gap-6 pt-4">
                <Button className="luxury-button h-16 px-10 rounded-2xl bg-brand-primary text-white shadow-xl hover:shadow-brand-primary/30 text-lg font-bold">
                  Start Your Production
                </Button>
                <Button 
                  variant="outline" 
                  className="h-16 px-10 rounded-2xl border-stone-200 text-brand-accent text-lg font-bold hover:bg-stone-50"
                  onClick={() => handleRequestDemo("Business Consultation")}
                >
                  Business Consultation
                </Button>
              </div>

              <div className="pt-12 grid grid-cols-3 gap-8">
                {[
                  { label: "Active Events", val: "500+" },
                  { label: "Elite Planners", val: "1.2k" },
                  { label: "Production Value", val: "$4B+" }
                ].map((stat, i) => (
                  <div key={i} className="space-y-1">
                    <div className="text-2xl font-black text-brand-accent">{stat.val}</div>
                    <div className="text-[10px] uppercase font-black tracking-widest text-stone-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10 rounded-[3rem] overflow-hidden border border-white/50 shadow-[0_50px_100px_rgba(0,0,0,0.1)] aspect-[4/3] bg-stone-100">
                <img 
                  src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=2000" 
                  alt="Luxury Event" 
                  className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-1000 scale-105 hover:scale-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                <div className="absolute bottom-10 left-10 right-10 flex items-center justify-between">
                  <div className="flex -space-x-4">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-12 h-12 rounded-full border-4 border-white overflow-hidden shadow-lg">
                        <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                  <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/30 text-white flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-sm font-bold tracking-tight">124 Live Orchestrations</span>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-primary/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-brand-primary/10 rounded-full blur-3xl" />
            </motion.div>
          </div>
        </section>

        {/* Discovery & Search Section */}
        <section id="features" className="py-20 px-6 bg-stone-50/50">
          <div className="max-w-[1400px] mx-auto space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="space-y-4">
                <Badge className="bg-brand-primary/10 text-brand-primary border-none font-black uppercase tracking-widest text-[10px]">Production Modules</Badge>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight text-brand-accent italic">Explore the Suite</h2>
              </div>

              {/* Advanced Filter & Search */}
              <div className="flex flex-col gap-4 w-full md:w-auto">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                  <Input 
                    placeholder="Search production modules..." 
                    className="pl-12 h-14 w-full md:w-[400px] rounded-2xl border-stone-200 focus:border-brand-primary focus:ring-brand-primary/10 bg-white transition-all shadow-sm focus:shadow-md"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 border ${
                        activeCategory === cat 
                        ? "bg-brand-primary text-white border-brand-primary shadow-lg shadow-brand-primary/20 scale-105" 
                        : "bg-white text-stone-500 border-stone-200 hover:border-brand-primary/40"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modules Grid */}
            <div id="feature-grid" className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[600px]">
              <AnimatePresence mode="popLayout">
                {currentModules.length > 0 ? (
                  currentModules.map((module, i) => (
                    <FeatureCard 
                      key={module.id} 
                      module={module} 
                      index={i} 
                      onOpenDetails={() => console.log("Open", module.id)}
                    />
                  ))
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="col-span-full py-20 text-center space-y-4"
                  >
                    <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-300">
                      <Search size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-stone-400">The vault is quiet.</h3>
                    <p className="text-stone-400">No modules match your search query.</p>
                    <Button 
                      variant="link" 
                      onClick={() => {setSearchQuery(""); setActiveCategory("All")}}
                      className="text-brand-primary font-bold"
                    >
                      Reset Gallery
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Premium Pagination */}
            {totalPages > 1 && (
              <div className="pt-12 flex items-center justify-center gap-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setCurrentPage(p => Math.max(1, p - 1));
                    scrollToGrid();
                  }}
                  disabled={currentPage === 1}
                  className="rounded-xl border-stone-200 hover:text-brand-primary disabled:opacity-30 h-12 w-12 p-0"
                >
                  <ChevronLeft />
                </Button>

                <div className="flex gap-2">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setCurrentPage(i + 1);
                        scrollToGrid();
                      }}
                      className={`w-3 h-3 rounded-full transition-all duration-500 ${
                        currentPage === i + 1 
                        ? "bg-brand-primary w-10 shadow-[0_0_10px_rgba(212,175,55,0.4)]" 
                        : "bg-stone-200 hover:bg-stone-300"
                      }`}
                    />
                  ))}
                </div>

                <Button
                  variant="outline"
                  onClick={() => {
                    setCurrentPage(p => Math.min(totalPages, p + 1));
                    scrollToGrid();
                  }}
                  disabled={currentPage === totalPages}
                  className="rounded-xl border-stone-200 hover:text-brand-primary disabled:opacity-30 h-12 w-12 p-0"
                >
                  <ChevronRight />
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Brand Philosophy */}
        <section id="about" className="py-32 px-6">
          <div className="max-w-[1400px] mx-auto text-center space-y-16">
            <div className="max-w-3xl mx-auto space-y-6">
              <h2 className="text-5xl md:text-6xl font-black tracking-tight leading-[1.1] italic">
                Precision is the ultimate luxury.
              </h2>
              <p className="text-xl text-stone-500 font-medium leading-relaxed">
                Orchestrix was born from a simple belief: high-stakes events deserve high-performance tools. We combine Italian design principles with Swiss engineering logic to create the world's most sophisticated production suite.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12">
              {[
                { title: "Synchronized", desc: "Real-time updates across all vendor channels and client portals instantly." },
                { title: "Automated", desc: "Machine learning budget tracking and automated guest follow-ups." },
                { title: "Indestructible", desc: "Enterprise-grade security and reliability for events that only happen once." }
              ].map((item, i) => (
                <div key={i} className="space-y-4 group p-8 rounded-[2rem] hover:bg-stone-50 transition-colors">
                  <div className="w-16 h-16 bg-brand-primary/5 rounded-2xl flex items-center justify-center mx-auto text-brand-primary group-hover:scale-110 transition-transform">
                    {i === 0 ? <Zap /> : i === 1 ? <CheckCircle2 /> : <ShieldCheck />}
                  </div>
                  <h3 className="text-2xl font-bold uppercase tracking-tighter text-brand-accent italic">{item.title}</h3>
                  <p className="text-stone-500 font-medium leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="contact" className="py-32 px-6 bg-brand-accent relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-[-20%] right-[-10%] w-full h-full bg-brand-primary rounded-full blur-[150px]" />
          </div>
          
          <div className="max-w-[1000px] mx-auto text-center space-y-12 relative z-10">
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter italic">
              Ready to conduct your <br />
              <span className="text-brand-primary">masterpiece?</span>
            </h2>
            <p className="text-xl text-stone-300 max-w-2xl mx-auto leading-relaxed font-medium">
              Join the world's most prestigious production teams. Experience the power of total orchestration.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-stone-900 hover:bg-stone-800 text-stone-100 px-8 py-6 text-lg rounded-none transition-all duration-300 border border-stone-800"
                onClick={() => handleRequestDemo("Business Consultation")}
              >
                Business Consultation
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-stone-300 text-stone-700 px-8 py-6 text-lg rounded-none hover:bg-stone-50 transition-all duration-300"
                onClick={() => {
                  const el = document.getElementById("feature-grid");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Explore Modules
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-stone-100 py-20 px-6">
        <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 mb-20">
          <div className="col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-white">
                <Sparkles size={16} />
              </div>
              <span className="text-lg font-black tracking-tighter uppercase text-brand-accent">Orchestrix</span>
            </div>
            <p className="text-stone-400 text-sm max-w-xs font-medium leading-relaxed">
              Redefining the standard of luxury event production through digital orchestration and elite engineering.
            </p>
            <div className="flex gap-4">
              <button className="w-10 h-10 rounded-full border border-stone-100 flex items-center justify-center text-stone-400 hover:text-brand-primary hover:border-brand-primary transition-all">
                <Instagram size={18} />
              </button>
              <button className="w-10 h-10 rounded-full border border-stone-100 flex items-center justify-center text-stone-400 hover:text-brand-primary hover:border-brand-primary transition-all">
                <Twitter size={18} />
              </button>
              <button className="w-10 h-10 rounded-full border border-stone-100 flex items-center justify-center text-stone-400 hover:text-brand-primary hover:border-brand-primary transition-all">
                <Facebook size={18} />
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-accent">Suite</h4>
            <ul className="space-y-4 text-sm font-medium text-stone-500">
              <li><a href="#" className="hover:text-brand-primary transition-colors">Master CRM</a></li>
              <li><a href="#" className="hover:text-brand-primary transition-colors">Wealth Engine</a></li>
              <li><a href="#" className="hover:text-brand-primary transition-colors">Spatial Designer</a></li>
              <li><a href="#" className="hover:text-brand-primary transition-colors">RSVP Concierge</a></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-accent">Agency</h4>
            <ul className="space-y-4 text-sm font-medium text-stone-500">
              <li><a href="#" className="hover:text-brand-primary transition-colors">Our Philosophy</a></li>
              <li><a href="#" className="hover:text-brand-primary transition-colors">Brand Assets</a></li>
              <li><a href="#" className="hover:text-brand-primary transition-colors">Career Protocol</a></li>
              <li><a href="#" className="hover:text-brand-primary transition-colors">Global Network</a></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-accent">Support</h4>
            <ul className="space-y-4 text-sm font-medium text-stone-500">
              <li><a href="#" className="hover:text-brand-primary transition-colors">Concierge Desk</a></li>
              <li><a href="#" className="hover:text-brand-primary transition-colors">API Blueprint</a></li>
              <li><a href="#" className="hover:text-brand-primary transition-colors">Security Audit</a></li>
              <li><a href="#" className="hover:text-brand-primary transition-colors">Status Core</a></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-accent">Contact</h4>
            <ul className="space-y-4 text-sm font-medium text-stone-500">
              <li className="flex items-center gap-2"><Mail size={14} /> torralba.ronnel@gmail.com</li>
              <li className="flex items-center gap-2"><Phone size={14} /> (+63) 9544274350</li>
              <li className="flex items-center gap-2"><MapPin size={14} /> Quezon City, Philippines</li>
            </ul>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto pt-10 border-t border-stone-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">
            © {new Date().getFullYear()} Orchestrix Global Operations. All rights reserved.
          </p>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-stone-400">
            <Link href="/privacy" className="hover:text-brand-primary transition-colors">Privacy Protocol</Link>
            <Link href="/terms" className="hover:text-brand-primary transition-colors">Service Agreement</Link>
            <a href="#" className="hover:text-brand-primary transition-colors">Cookie Policy</a>
          </div>
        </div>
      </footer>

      <ConciergeDialog 
        isOpen={showConcierge} 
        onClose={() => setShowConcierge(false)} 
        initialType={conciergeType}
      />
    </div>
  );
}