import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const steps = [
    { num: 1, title: "اختيار الباقة" },
    { num: 2, title: "معلومات التواصل" },
    { num: 3, title: "تفعيل الكود" },
    { num: 4, title: "اكتمال الطلب" }
  ];

  return (
    <div className="w-full max-w-3xl mx-auto mb-12">
      <div className="flex items-center justify-between relative">
        {/* Progress Bar Background */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-white/5 rounded-full z-0" />
        
        {/* Active Progress Bar */}
        <motion.div 
          className="absolute right-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-l from-primary to-orange-600 rounded-full z-0"
          initial={{ width: "0%" }}
          animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />

        {steps.map((step, idx) => {
          const isActive = currentStep === step.num;
          const isPast = currentStep > step.num;
          
          return (
            <div key={step.num} className="relative z-10 flex flex-col items-center gap-3">
              <motion.div 
                initial={false}
                animate={{
                  backgroundColor: isActive || isPast ? "hsl(var(--primary))" : "hsl(var(--secondary))",
                  borderColor: isActive ? "hsl(var(--primary))" : isPast ? "transparent" : "hsla(0,0%,100%,0.1)",
                  scale: isActive ? 1.2 : 1,
                  color: isActive || isPast ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))"
                }}
                className="w-10 h-10 rounded-full border-2 flex items-center justify-center font-display font-bold text-lg shadow-lg"
              >
                {isPast ? <Check className="w-5 h-5" /> : step.num}
              </motion.div>
              <span className={`text-sm md:text-base font-semibold transition-colors duration-300 absolute -bottom-8 whitespace-nowrap ${isActive ? "text-primary text-glow" : isPast ? "text-white" : "text-muted-foreground"}`}>
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
