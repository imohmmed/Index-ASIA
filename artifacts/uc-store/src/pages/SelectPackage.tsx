import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ASIACELL_PACKAGES, AsiacellPackage } from "@/hooks/use-store-data";
import { useCreateOrder } from "@workspace/api-client-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { StepIndicator } from "@/components/StepIndicator";
import { Loader2, X, ShoppingCart } from "lucide-react";

export default function Home() {
  const [_, setLocation] = useLocation();
  const [selectedPkg, setSelectedPkg] = useState<AsiacellPackage | null>(null);
  const [showModal, setShowModal] = useState(false);

  const { mutate: createOrder, isPending } = useCreateOrder({
    mutation: {
      onSuccess: (data) => {
        setLocation(`/order/${data.id}/contact`);
      },
    },
  });

  const handleSelectPackage = (pkg: AsiacellPackage) => {
    setSelectedPkg(pkg);
  };

  const handleContinue = () => {
    if (!selectedPkg) return;
    createOrder({
      data: {
        productId: selectedPkg.id,
        productName: selectedPkg.name,
        price: selectedPkg.price,
        quantity: selectedPkg.faceValue,
      },
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
            اشتري رصيدك{" "}
            <span className="text-[#E30613] text-glow">بسهولة وأمان</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            اختر الفئة المطلوبة واشتري رصيدك بأرخص الأسعار مع توصيل فوري.
          </p>
        </div>

        <div className="max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => setShowModal(true)}
            className="cursor-pointer rounded-3xl overflow-hidden border-2 border-white/10 bg-card/50 backdrop-blur-sm hover:border-[#E30613]/50 hover:bg-card/70 hover:scale-[1.02] transition-all duration-300 group"
          >
            <div className="bg-gradient-to-r from-[#E30613] to-[#c40510] p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img src={import.meta.env.BASE_URL + "asiacell-logo.png"} alt="Asiacell" className="w-14 h-14 object-contain" />
                <div>
                  <h3 className="text-white font-black text-xl">شراء رصيد فوري</h3>
                  <p className="text-white/70 text-sm">آسياسيل - Asiacell</p>
                </div>
              </div>
            </div>
            <div className="p-8 text-center">
              <p className="text-white text-lg font-semibold mb-2">
                رصيد بأسعار مخفضة
              </p>
              <p className="text-muted-foreground mb-6">
                اضغط لاختيار الفئة المناسبة
              </p>
              <div className="bg-[#E30613]/10 border border-[#E30613]/20 rounded-xl py-3 px-6 inline-block">
                <span className="text-[#E30613] font-bold">
                  ابتداءً من 4,500 IQD
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        <AnimatePresence>
          {showModal && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
                onClick={() => {
                  setShowModal(false);
                  setSelectedPkg(null);
                }}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 50 }}
                className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-md mx-auto bg-[#1a1a2e] border border-white/10 rounded-3xl z-50 overflow-hidden shadow-2xl"
              >
                <div className="flex items-center justify-between p-5 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div dir="ltr">
                      <span className="font-black text-lg text-white" style={{fontFamily: "'Arial Black', Impact, sans-serif"}}>ASIA</span>
                      <span className="font-black text-lg text-[#D4AF37]" style={{fontFamily: "'Arial Black', Impact, sans-serif"}}>MAX</span>
                    </div>
                    <p className="text-muted-foreground text-xs">
                      اختر الفئة المناسبة
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setSelectedPkg(null);
                    }}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>

                <div className="p-5 grid grid-cols-2 gap-3">
                  {ASIACELL_PACKAGES.map((pkg) => (
                    <motion.button
                      key={pkg.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSelectPackage(pkg)}
                      className={`rounded-xl border-2 p-4 text-center transition-all duration-200 ${
                        selectedPkg?.id === pkg.id
                          ? "border-[#E30613] bg-[#E30613]/15 shadow-[0_0_20px_rgba(227,6,19,0.2)]"
                          : "border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10"
                      } ${pkg.faceValue === 100000 ? "col-span-2" : ""}`}
                    >
                      <div className="text-white font-black text-xl">
                        {pkg.faceValue.toLocaleString()}
                      </div>
                      <div className="text-[#E30613] font-bold text-sm mt-1">
                        IQD {pkg.price.toLocaleString()}
                      </div>
                    </motion.button>
                  ))}
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={handleContinue}
                    disabled={!selectedPkg || isPending}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                      selectedPkg
                        ? "bg-[#E30613] text-white hover:bg-[#c40510] shadow-[0_0_30px_rgba(227,6,19,0.3)] hover:shadow-[0_0_40px_rgba(227,6,19,0.5)]"
                        : "bg-white/10 text-muted-foreground cursor-not-allowed"
                    }`}
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        جاري التحضير...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        متابعة للشراء
                      </>
                    )}
                  </button>
                </div>

                {selectedPkg && (
                  <div className="px-5 pb-5">
                    <div className="bg-black/30 rounded-xl p-4 text-center border border-white/5">
                      <div className="text-white font-black text-3xl">
                        {selectedPkg.price.toLocaleString()}
                      </div>
                      <div className="text-muted-foreground text-sm mt-1">
                        IQD
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </AppLayout>
  );
}
