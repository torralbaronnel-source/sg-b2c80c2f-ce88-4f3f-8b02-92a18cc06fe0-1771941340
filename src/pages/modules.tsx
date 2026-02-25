import React, { useState, useMemo, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  LineChart, 
  Smartphone, 
  Users, 
  MessageSquare, 
  Calendar, 
  CreditCard, 
  Zap,
  ChevronRight,
  Home,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SEO } from "@/components/SEO";
import { ModuleLightbox } from "@/components/Modules/ModuleLightbox";

const categories = ["All", "Operations", "Experience", "Intelligence", "Finance"];

const modules = [
  {
    id: "crm",
    title: "Client Intelligence CRM",
    category: "Experience",
    description: "Beyond contact management. Track client preferences, history, and emotional journey milestones with predictive AI.",
    features: ["Sentiment Analysis", "Milestone Tracking", "Automated Follow-ups"],
    icon: Users,
    color: "from-blue-500/20 to-indigo-500/20",
    gradient: "group-hover:shadow-blue-500/20",
  },
  {
    id: "timeline",
    title: "Dynamic Event Architect",
    category: "Operations",
    description: "Real-time master timelines that adapt to day-of changes. Instant sync across all vendor teams.",
    features: ["Live Sync", "Conflict Detection", "Vendor Portals"],
    icon: Calendar,
    color: "from-amber-500/20 to-orange-500/20",
    gradient: "group-hover:shadow-amber-500/20",
  },
  {
    id: "concierge",
    title: "White-Label Concierge",
    category: "Experience",
    description: "A private, AI-powered communication hub for your clients. Branded entirely to your business.",
    features: ["Instant Chat", "Document Vault", "RSVP Management"],
    icon: MessageSquare,
    color: "from-emerald-500/20 to-teal-500/20",
    gradient: "group-hover:shadow-emerald-500/20",
  },
  {
    id: "finance",
    title: "Revenue Operations",
    category: "Finance",
    description: "Precision budgeting, automated invoicing, and profit analysis designed for high-scale events.",
    features: ["Auto-Invoicing", "Tax Automation", "Profit Forecasting"],
    icon: CreditCard,
    color: "from-purple-500/20 to-pink-500/20",
    gradient: "group-hover:shadow-purple-500/20",
  },
  {
    id: "analytics",
    title: "Business Intelligence",
    category: "Intelligence",
    description: "Data-driven insights into your agency's performance. Track conversion rates and vendor efficiency.",
    features: ["KPI Dashboards", "Vendor Scoring", "Conversion Tracking"],
    icon: LineChart,
    color: "from-cyan-500/20 to-blue-500/20",
    gradient: "group-hover:shadow-cyan-500/20",
  },
  {
    id: "workflow",
    title: "Automated Workflows",
    category: "Operations",
    description: "Standardize excellence. Automate complex task sequences from inquiry to post-event delivery.",
    features: ["Logic-Based Tasks", "Template Library", "Team Assignment"],
    icon: Zap,
    color: "from-rose-500/20 to-red-500/20",
    gradient: "group-hover:shadow-rose-500/20",
  }
];

export default function ModulesPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedModule, setSelectedModule] = useState<any>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const itemsPerPage = 2;

  const filteredModules = useMemo(() => {
    return activeCategory === "All" 
      ? modules 
      : modules.filter(m => m.category === activeCategory);
  }, [activeCategory]);

  const totalPages = Math.ceil(filteredModules.length / itemsPerPage);
  
  const currentModules = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredModules.slice(start, start + itemsPerPage);
  }, [filteredModules, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory]);

  const handleOpenLightbox = (module: any) => {
    setSelectedModule(module);
    setIsLightboxOpen(true);
  };

  return (
    <div className="min-h-screen bg-neutral-50 font-sans selection:bg-[#D4AF37]/30">
      <SEO 
        title="Modules | Orchestrix OS" 
        description="Explore the comprehensive suite of tools designed for elite wedding and event professionals."
      />

      {/* Luxury Top Bar Panel */}
      <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-neutral-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between py-4 gap-4">
            {/* Branding & Breadcrumbs */}
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center group">
                <div className="w-10 h-10 bg-[#D4AF37] rounded-xl flex items-center justify-center shadow-lg shadow-[#D4AF37]/20 group-hover:scale-105 transition-transform duration-300">
                  <span className="text-white font-bold text-xl">O</span>
                </div>
                <div className="ml-3 hidden sm:block">
                  <h1 className="text-lg font-semibold text-neutral-900 tracking-tight">Orchestrix</h1>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Operating System</p>
                </div>
              </Link>
              
              <div className="hidden sm:flex items-center text-neutral-300 mx-2">
                <ChevronRight size={16} />
              </div>
              
              <div className="flex items-center text-sm font-medium text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full">
                <Home size={14} className="mr-1.5" />
                <span>Modules Directory</span>
              </div>
            </div>

            {/* Filter Pills in Top Bar */}
            <div className="flex items-center overflow-x-auto no-scrollbar pb-1 md:pb-0">
              <div className="flex items-center p-1 bg-neutral-100 rounded-full border border-neutral-200">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`
                      px-5 py-1.5 text-xs font-semibold rounded-full transition-all duration-300 whitespace-nowrap
                      ${activeCategory === cat 
                        ? "bg-white text-[#D4AF37] shadow-sm ring-1 ring-black/5" 
                        : "text-neutral-500 hover:text-neutral-900"}
                    `}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Support/Contact Button */}
            <div className="hidden lg:block">
              <Button 
                variant="outline" 
                className="rounded-full border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/5 px-6"
                onClick={() => window.location.href = "mailto:concierge@orchestrix.com"}
              >
                Request Consultation
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header Section */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-2 mb-4"
          >
            <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            <span className="text-sm font-bold tracking-widest text-[#D4AF37] uppercase">The Suite</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-light text-neutral-900 mb-6"
          >
            Operational <span className="font-semibold italic">Excellence</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-neutral-600 max-w-2xl leading-relaxed"
          >
            Every tool in the Orchestrix suite is crafted for high-performance event production. 
            Automate the mundane, amplify your creativity, and scale your agency.
          </motion.p>
        </div>

        {/* Dynamic Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 min-h-[600px]">
          <AnimatePresence mode="wait">
            {currentModules.length > 0 ? (
              currentModules.map((module, index) => (
                <motion.div
                  key={module.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative bg-white rounded-3xl p-1 border border-neutral-200 hover:border-[#D4AF37]/40 transition-all duration-500 hover:shadow-2xl hover:shadow-[#D4AF37]/10"
                >
                  <div className="relative overflow-hidden rounded-[22px] bg-white p-8 md:p-10 h-full flex flex-col">
                    {/* Module Icon & Label */}
                    <div className="flex items-start justify-between mb-8">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${module.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                        <module.icon className="w-8 h-8 text-neutral-800" />
                      </div>
                      <Badge variant="outline" className="border-[#D4AF37]/20 text-[#D4AF37] uppercase tracking-tighter font-bold px-3">
                        {module.category}
                      </Badge>
                    </div>

                    {/* Content */}
                    <div className="flex-grow">
                      <h3 className="text-2xl font-semibold text-neutral-900 mb-4 group-hover:text-[#D4AF37] transition-colors">{module.title}</h3>
                      <p className="text-neutral-600 leading-relaxed mb-8">
                        {module.description}
                      </p>

                      {/* Micro-interface Preview */}
                      <div className="relative h-40 bg-neutral-50 rounded-2xl border border-neutral-100 overflow-hidden p-4 mb-8">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/80 z-10" />
                        <div className="space-y-3 opacity-60 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-700">
                          <div className="h-4 w-3/4 bg-neutral-200 rounded-full animate-pulse" />
                          <div className="h-4 w-1/2 bg-neutral-100 rounded-full" />
                          <div className="grid grid-cols-3 gap-2">
                            <div className="h-8 bg-[#D4AF37]/10 rounded-lg" />
                            <div className="h-8 bg-neutral-100 rounded-lg" />
                            <div className="h-8 bg-neutral-100 rounded-lg" />
                          </div>
                        </div>
                        {/* Interactive Sparkle */}
                        <div className="absolute top-4 right-4 text-[#D4AF37] opacity-0 group-hover:opacity-100 group-hover:rotate-12 transition-all duration-500">
                          <Sparkles className="w-5 h-5" />
                        </div>
                      </div>

                      {/* Feature Bullet Points */}
                      <ul className="space-y-3 mb-10">
                        {module.features.map((feature, i) => (
                          <li key={i} className="flex items-center text-sm text-neutral-500 group-hover:text-neutral-700 transition-colors">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mr-3 opacity-40 group-hover:opacity-100" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action */}
                    <div className="mt-auto">
                      <Button 
                        onClick={() => handleOpenLightbox(module)}
                        className="w-full py-6 rounded-xl bg-neutral-900 text-white hover:bg-[#D4AF37] transition-all duration-300 group/btn"
                      >
                        Explore Interface
                        <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-20 text-center"
              >
                <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <X className="text-neutral-400" />
                </div>
                <h3 className="text-xl font-medium text-neutral-900 mb-2">No modules found</h3>
                <p className="text-neutral-500 mb-8">Refine your selection to explore our suite.</p>
                <Button variant="outline" onClick={() => setActiveCategory("All")}>Clear All Filters</Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Luxury Pagination Footer */}
        {totalPages > 1 && (
          <div className="mt-20 flex flex-col items-center">
            <div className="flex items-center space-x-2 p-2 bg-white rounded-full border border-neutral-200 shadow-sm">
              <Button
                variant="ghost"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="rounded-full hover:bg-neutral-100 disabled:opacity-30"
              >
                Prev
              </Button>
              <div className="flex px-4 items-center space-x-4">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`
                      w-2 h-2 rounded-full transition-all duration-500
                      ${currentPage === i + 1 ? "bg-[#D4AF37] w-8 shadow-[0_0_10px_rgba(212,175,55,0.4)]" : "bg-neutral-200 hover:bg-neutral-400"}
                    `}
                  />
                ))}
              </div>
              <Button
                variant="ghost"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="rounded-full hover:bg-neutral-100 disabled:opacity-30"
              >
                Next
              </Button>
            </div>
            <p className="mt-4 text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-400">
              Page {currentPage} of {totalPages} — Orchestrix Intelligence
            </p>
          </div>
        )}
      </main>

      {/* Security & Support Footer */}
      <footer className="bg-white border-t border-neutral-200 mt-20 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
            <ShieldCheck size={24} />
            <div className="h-4 w-px bg-neutral-300" />
            <span className="text-xs font-bold uppercase tracking-widest">Enterprise Grade Security</span>
            <div className="h-4 w-px bg-neutral-300" />
            <Smartphone size={24} />
          </div>
        </div>
      </footer>

      {/* Lightbox for Immersive Preview */}
      <ModuleLightbox 
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        module={selectedModule}
      />
    </div>
  );
}