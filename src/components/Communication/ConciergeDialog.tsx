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
  Monitor, MessageCircle, Settings, AlertCircle, Loader2, CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";

const conciergeSchema = z.object({
  full_name: z.string().min(3, "Full name must be at least 3 characters"),
  email: z.string().email("Please provide a valid corporate email address"),
  phone: z.string().min(10, "Please provide a valid contact number"),
  company_name: z.string().optional(),
  customization_details: z.string().optional(),
  interested_modules: z.array(z.string()).optional(),
  event_count: z.string().optional(),
});

type ConciergeFormData = z.infer<typeof conciergeSchema>;

interface ConciergeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  type?: "demo" | "consultation";
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.4, 
      ease: [0.22, 1, 0.36, 1] 
    } 
  }
};

export function ConciergeDialog({ 
  isOpen, 
  onClose, 
  type = "consultation" 
}: ConciergeDialogProps) {
  const [step, setStep] = useState(1);
  const [requestType, setRequestType] = useState<ConciergeRequestType>(type === "demo" ? "Private Demo" : "Business Consultation");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ConciergeFormData>({
    resolver: zodResolver(conciergeSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      company_name: "",
      customization_details: "",
      interested_modules: [],
      event_count: ""
    }
  });

  const { control, handleSubmit, watch, setValue, trigger, formState: { errors } } = form;
  const formData = watch();

  const modules = [
    "Finances & Ledger", "Live Event Hub", "CRM & Bookings", 
    "Guest Management", "Media Vault", "White Labeling"
  ];

  const handleNextStep = async () => {
    let fieldsToValidate: Array<keyof ConciergeFormData> = [];
    
    if (step === 2) {
      fieldsToValidate = ["full_name", "email", "phone"];
    }
    
    const isValid = await trigger(fieldsToValidate);
    
    if (isValid) {
      setStep(s => s + 1);
    } else {
      toast({
        title: "Validation Error",
        description: "Please correct the highlighted fields before proceeding.",
        variant: "destructive"
      });
    }
  };

  const handleBack = () => setStep(s => s - 1);

  const toggleModule = (module: string) => {
    const current = formData.interested_modules || [];
    const next = current.includes(module)
      ? current.filter(m => m !== module)
      : [...current, module];
    setValue("interested_modules", next);
  };

  const onSubmit = async (data: ConciergeFormData) => {
    if (requestType === "Portal Customization" && !data.customization_details) {
      toast({
        title: "Details Required",
        description: "Please specify your customization requirements.",
        variant: "destructive"
      });
      return;
    }

    if (requestType === "Private Demo" && (!data.interested_modules || data.interested_modules.length === 0)) {
      toast({
        title: "Selection Required",
        description: "Please select at least one module for the demo.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await conciergeService.submitRequest({
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        company_name: data.company_name,
        customization_details: data.customization_details,
        interested_modules: data.interested_modules,
        request_type: requestType,
        status: "New",
        priority: "Medium"
      });

      toast({
        title: "Request Received",
        description: "An Orchestrix specialist will reach out to you within 24 hours.",
      });
      
      setStep(4);
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
    onClose();
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetAndClose}>
      <DialogContent className="sm:max-w-[500px] bg-white border-stone-200 p-0 overflow-hidden">
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

                <Button className="w-full mt-4 bg-stone-900 text-white hover:bg-stone-800" onClick={() => setStep(2)}>
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
                <Form {...form}>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <motion.div 
                      variants={containerVariants}
                      initial="hidden"
                      animate="show"
                      className="grid grid-cols-1 gap-6"
                    >
                      <motion.div variants={itemVariants}>
                        <FormField
                          control={control}
                          name="full_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[#1C1917] font-medium text-xs uppercase tracking-widest opacity-70">Full Name</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Regina M." 
                                  {...field} 
                                  className="bg-white/50 border-[#D6D3D1] focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 transition-all h-11"
                                />
                              </FormControl>
                              <FormMessage className="text-red-500 text-[10px]" />
                            </FormItem>
                          )}
                        />
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <FormField
                          control={control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[#1C1917] font-medium text-xs uppercase tracking-widest opacity-70">Professional Email</FormLabel>
                              <FormControl>
                                <Input 
                                  type="email"
                                  placeholder="regina@manilaevents.com" 
                                  {...field} 
                                  className="bg-white/50 border-[#D6D3D1] focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 transition-all h-11"
                                />
                              </FormControl>
                              <FormMessage className="text-red-500 text-[10px]" />
                            </FormItem>
                          )}
                        />
                      </motion.div>

                      <div className="grid grid-cols-2 gap-4">
                        <motion.div variants={itemVariants}>
                          <FormField
                            control={control}
                            name="company_name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-[#1C1917] font-medium text-xs uppercase tracking-widest opacity-70">Company</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Manila Events" 
                                    {...field} 
                                    className="bg-white/50 border-[#D6D3D1] focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 transition-all h-11"
                                  />
                                </FormControl>
                                <FormMessage className="text-red-500 text-[10px]" />
                              </FormItem>
                            )}
                          />
                        </motion.div>

                        <motion.div variants={itemVariants}>
                          <FormField
                            control={control}
                            name="event_count"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-[#1C1917] font-medium text-xs uppercase tracking-widest opacity-70">Annual Events</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="20+" 
                                    {...field} 
                                    className="bg-white/50 border-[#D6D3D1] focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 transition-all h-11"
                                  />
                                </FormControl>
                                <FormMessage className="text-red-500 text-[10px]" />
                              </FormItem>
                            )}
                          />
                        </motion.div>
                      </div>

                      <motion.div variants={itemVariants}>
                        <FormField
                          control={control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[#1C1917] font-medium text-xs uppercase tracking-widest opacity-70">Phone Number</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="+63 9xx xxx xxxx" 
                                  {...field} 
                                  className="bg-white/50 border-[#D6D3D1] focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 transition-all h-11"
                                />
                              </FormControl>
                              <FormMessage className="text-red-500 text-[10px]" />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <div className="flex gap-3 pt-4">
                        <Button variant="outline" className="flex-1" type="button" onClick={handleBack}>Back</Button>
                        <Button className="flex-[2] bg-stone-900 text-white hover:bg-stone-800" type="button" onClick={handleNextStep}>
                          Nearly There <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </motion.div>
                  </form>
                </Form>
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
                    <Controller
                      name="customization_details"
                      control={control}
                      render={({ field }) => (
                        <Textarea 
                          {...field}
                          placeholder="Tell us exactly what you'd like to see modified or added to your private portal..."
                          className="min-h-[150px] resize-none border-stone-200"
                        />
                      )}
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
                            checked={formData.interested_modules?.includes(module)}
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
                    onClick={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Processing...</span>
                      </div>
                    ) : (
                      "Submit to Concierge"
                    )}
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