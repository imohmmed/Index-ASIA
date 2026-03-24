import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { UC_PACKAGES, UCPackage } from "@/hooks/use-store-data";
import { useCreateOrder } from "@workspace/api-client-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { StepIndicator } from "@/components/StepIndicator";
import { Loader2, Zap } from "lucide-react";

export default function Home() {
  const [_, setLocation] = useLocation();
  const [selectedPkg, setSelectedPkg] = useState<UCPackage | null>(null);

  const { mutate: createOrder, isPending } = useCreateOrder({
    mutation: {
      onSuccess: (data) => {
        setLocation(`/order/${data.id}/contact`);
      }
    }
  });

  const handleContinue = () => {
    if (!selectedPkg) return;
    createOrder({
      data: {
        productId: selectedPkg.id,
        productName: selectedPkg.name,
        price: selectedPkg.price,
        quantity: selectedPkg.quantity
      }
    });
  };

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="w-full"
      >
        <StepIndicator currentStep={1} />
        
        <div className="text-center mb-12 mt-16">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            اشحن حسابك <span className="text-primary text-glow">الآن</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            اختر الباقة المناسبة لك واستمتع بشحن فوري وآمن بدون الحاجة لبطاقة ائتمان.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {UC_PACKAGES.map((pkg, idx) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => setSelectedPkg(pkg)}
              className={`
                relative cursor-pointer rounded-3xl overflow-hidden transition-all duration-300
                border-2 backdrop-blur-sm
                ${selectedPkg?.id === pkg.id 
                  ? 'border-primary bg-primary/10 shadow-[0_0_30px_rgba(245,158,11,0.2)] scale-[1.02] z-10' 
                  : 'border-white/5 bg-card/40 hover:border-primary/50 hover:bg-card/60 hover:scale-[1.01]'}
              `}
            >
              {pkg.popular && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-bl-xl z-10 flex items-center gap-1">
                  <Zap className="w-3 h-3 fill-current" />
                  الأكثر مبيعاً
                </div>
              )}
              
              <div className="p-8 flex flex-col items-center text-center relative z-0">
                {/* Glow behind image */}
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full blur-3xl transition-opacity duration-300 ${selectedPkg?.id === pkg.id ? 'bg-primary/30 opacity-100' : 'bg-primary/0 opacity-0'}`} />
                
                <img 
                  src={`${import.meta.env.BASE_URL}images/uc-coin.png`} 
                  alt="UC" 
                  className={`w-32 h-32 object-contain mb-6 drop-shadow-2xl transition-transform duration-500 ${selectedPkg?.id === pkg.id ? 'scale-110' : ''}`}
                />
                
                <h3 className="font-display font-black text-4xl text-white mb-2 tracking-tight">
                  {pkg.quantity} <span className="text-primary text-2xl">UC</span>
                </h3>
                
                {pkg.bonus && (
                  <div className="text-green-400 font-bold mb-4 bg-green-400/10 px-3 py-1 rounded-full text-sm inline-block border border-green-400/20">
                    + {pkg.bonus} UC إضافي
                  </div>
                )}
                
                <div className="mt-auto w-full pt-6 border-t border-white/10">
                  <div className="flex justify-between items-end">
                    <span className="text-muted-foreground font-medium">السعر</span>
                    <span className="font-display font-black text-3xl text-white tracking-tight">
                      ${pkg.price}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Active Selection Ring */}
              <AnimatePresence>
                {selectedPkg?.id === pkg.id && (
                  <motion.div
                    layoutId="active-ring"
                    className="absolute inset-0 border-4 border-primary rounded-3xl pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 flex justify-center pb-12">
          <button
            onClick={handleContinue}
            disabled={!selectedPkg || isPending}
            className={`
              relative overflow-hidden px-12 py-5 rounded-2xl font-bold text-xl transition-all duration-300
              flex items-center gap-3 min-w-[280px] justify-center
              ${selectedPkg 
                ? 'bg-primary text-primary-foreground shadow-[0_0_40px_rgba(245,158,11,0.4)] hover:shadow-[0_0_60px_rgba(245,158,11,0.6)] hover:scale-105 active:scale-95' 
                : 'bg-secondary text-muted-foreground cursor-not-allowed'}
            `}
          >
            {isPending ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                جاري التحضير...
              </>
            ) : (
              "متابعة للشراء"
            )}
            
            {/* Button Shine Effect */}
            {selectedPkg && !isPending && (
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_2s_infinite]" />
            )}
          </button>
        </div>
      </motion.div>
    </AppLayout>
  );
}
