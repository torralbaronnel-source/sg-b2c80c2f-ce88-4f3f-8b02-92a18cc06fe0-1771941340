import React, { useState } from "react";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  conciergeService, 
  ConciergeRequestType 
} from "@/services/conciergeService";
import { useToast } from "@/hooks/use-toast";
import { 
  Sparkles, ShieldCheck, Crown, 
  ArrowRight, Check, ChevronRight,
  Monitor, MessageCircle, Settings
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ConciergeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: ConciergeRequestType;
}

export function ConciergeDialog({ isOpen, onClose, initialType = "Private Demo" }: ConciergeDialogProps) {
  const [step, setStep] = useState(1);
  const [requestType, setRequestType] = useState<ConciergeRequestType>(initialType);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    company_name: "",
    customization_details: "",
    interested_modules: [] as string[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const modules = [
    "Finances & Ledger", "Live Event Hub", "CRM & Bookings", 
    "Guest Management", "Media Vault", "White Labeling"
  ];

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const toggleModule = (module: string) => {
    setFormData(prev => ({
      ...prev,
      interested_modules: prev.interested_modules.includes(module)
        ? prev.interested_modules.filter(m => m !== module)
        : [...prev.interested_modules, module]
    }));
  };

  const handleSubmit = async () => {
    if (!formData.full_name || !formData.email) {
      toast({
        title: "Missing Details",
        description: "Please provide your name and email to continue.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await conciergeService.submitRequest({
        ...formData,
        request_type: requestType,
        status: "New",
        priority: "Medium"
      });

      toast({
        title: "Request Received",
        description: "An Orchestrix specialist will reach out to you within 24 hours.",
      });
      
      setStep(4); // Success step
    } catch (error) {
      toast({
        title: "Submission Error",
        description: "We couldn't process your request. Please try again or email us directly.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setStep(1);
    setFormData({
      full_name: "",
      email: "",
      phone: "",
      company_name: "",
      customization_details: "",
      interested_modules: []
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetAndClose}>
      <DialogContent className="sm:max-w-[500px] bg-white border-stone-200 p-0 overflow-hidden">
        {/* Luxury Header */}
        <div className="h-32 bg-stone-900 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="z-10 text-center"
          >
            <Crown className="w-10 h-10 text-gold-light mx-auto mb-2" />
            <h3 className="text-gold-light font-serif text-xl tracking-widest uppercase">Concierge</h3>
          </motion.div>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="text-center mb-6">
                  <h4 className="text-xl font-serif text-stone-800 mb-1">How can we assist?</h4>
                  <p className="text-sm text-stone-500">Select the type of private engagement you require.</p>
                </div>

                <div className="grid gap-3">
                  {[
                    { id: 'Private Demo', icon: Monitor, label: 'Private Walkthrough', desc: 'Personal demo of our elite features.' },
                    { id: 'Business Consultation', icon: MessageCircle, label: 'Business Strategy', desc: 'Discuss your specific event operations.' },
                    { id: 'Portal Customization', icon: Settings, label: 'Portal Customization', desc: 'Request bespoke edits to your dashboard.' }
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setRequestType(type.id as ConciergeRequestType)}
                      className={`flex items-start gap-4 p-4 rounded-xl border transition-all text-left ${
                        requestType === type.id 
                        ? 'border-gold-dark bg-stone-50 shadow-sm' 
                        : 'border-stone-100 hover:border-stone-200'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${requestType === type.id ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-500'}`}>
                        <type.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-stone-900">{type.label}</div>
                        <div className="text-xs text-stone-500">{type.desc}</div>
                      </div>
                      {requestType === type.id && <Check className="w-5 h-5 text-gold-dark ml-auto self-center" />}
                    </button>
                  ))}
                </div>

                <Button className="w-full mt-4 bg-stone-900 text-white hover:bg-stone-800" onClick={handleNext}>
                  Continue <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input 
                      id="full_name" 
                      placeholder="Master John Doe" 
                      value={formData.full_name}
                      onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company/Organization</Label>
                    <Input 
                      id="company" 
                      placeholder="Luxury Events Ltd." 
                      value={formData.company_name}
                      onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="john@example.com" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Contact Number</Label>
                  <Input 
                    id="phone" 
                    placeholder="+63 9XX XXX XXXX" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" className="flex-1" onClick={handleBack}>Back</Button>
                  <Button className="flex-[2] bg-stone-900 text-white hover:bg-stone-800" onClick={handleNext}>
                    Nearly There <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {requestType === 'Portal Customization' ? (
                  <div className="space-y-3">
                    <Label>Bespoke Requirements</Label>
                    <Textarea 
                      placeholder="Tell us exactly what you'd like to see modified or added to your private portal..."
                      className="min-h-[150px] resize-none"
                      value={formData.customization_details}
                      onChange={(e) => setFormData({...formData, customization_details: e.target.value})}
                    />
                    <p className="text-[10px] text-stone-400 italic">Our engineering team will review these requirements for technical feasibility.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Label>Areas of Interest</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {modules.map(module => (
                        <div key={module} className="flex items-center space-x-2">
                          <Checkbox 
                            id={module} 
                            checked={formData.interested_modules.includes(module)}
                            onCheckedChange={() => toggleModule(module)}
                          />
                          <label htmlFor={module} className="text-sm text-stone-600 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {module}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" className="flex-1" onClick={handleBack}>Back</Button>
                  <Button 
                    className="flex-[2] bg-stone-900 text-white hover:bg-stone-800" 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Processing..." : "Submit to Concierge"}
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 space-y-4"
              >
                <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-10 h-10 text-gold-dark" />
                </div>
                <h4 className="text-2xl font-serif text-stone-800">Request Orchestrated</h4>
                <p className="text-stone-500 max-w-[300px] mx-auto">
                  Thank you, {formData.full_name}. A specialist has been assigned to your request and will contact you via {formData.email} shortly.
                </p>
                <Button variant="outline" className="mt-6" onClick={resetAndClose}>
                  Return to Dashboard
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="bg-stone-50 px-6 py-4 border-t border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] text-stone-400 uppercase tracking-widest font-bold">
            <ShieldCheck className="w-3 h-3" /> Secure Transmission
          </div>
          <div className="text-[10px] text-stone-300">© 2026 ORCHESTRIX PREMIER</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}