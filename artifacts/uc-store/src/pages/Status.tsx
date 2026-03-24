import { useParams, useLocation } from "wouter";
import { motion } from "framer-motion";
import { useGetOrderStatus } from "@workspace/api-client-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { StepIndicator } from "@/components/StepIndicator";
import { Loader2, CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { useEffect } from "react";

export default function Status() {
  const { id } = useParams<{ id: string }>();
  const [_, setLocation] = useLocation();

  const { data: order, isLoading } = useGetOrderStatus(id || "", {
    query: {
      enabled: !!id,
      // Poll every 3 seconds while pending
      refetchInterval: (query) => {
        const status = query.state.data?.status;
        return (status === "approved" || status === "rejected") ? false : 3000;
      }
    }
  });

  const status = order?.status;
  const isPending = status === "code_submitted" || status === "pending" || status === "contact_submitted";
  const isApproved = status === "approved";
  const isRejected = status === "rejected";

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl mx-auto"
      >
        <StepIndicator currentStep={4} />
        
        <div className="mt-16 bg-card/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-16 shadow-2xl relative overflow-hidden text-center min-h-[400px] flex flex-col items-center justify-center">
          
          {isLoading ? (
            <div className="flex flex-col items-center text-muted-foreground">
              <Loader2 className="w-12 h-12 animate-spin mb-4 text-primary" />
              <p>جاري تحميل حالة الطلب...</p>
            </div>
          ) : isPending ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center"
            >
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center">
                  <div className="w-16 h-16 bg-primary rounded-full animate-ping opacity-75 absolute" />
                  <Loader2 className="w-12 h-12 text-primary animate-spin relative z-10" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">جاري مراجعة الطلب</h2>
              <p className="text-muted-foreground text-lg mb-2">
                يرجى الانتظار، يتم الآن مراجعة الكود والموافقة على طلبك.
              </p>
              <p className="text-sm text-primary/80 font-bold animate-pulse">
                لا تقم بإغلاق هذه الصفحة...
              </p>
            </motion.div>
          ) : isApproved ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center"
            >
              <div className="absolute inset-0 bg-success/10 bg-mesh pointer-events-none" />
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="w-28 h-28 bg-success/20 rounded-full flex items-center justify-center mb-6 relative z-10 box-glow shadow-success/50"
              >
                <CheckCircle2 className="w-16 h-16 text-success" />
              </motion.div>
              <h2 className="text-4xl font-black text-white mb-4 relative z-10">تمت الموافقة بنجاح!</h2>
              <p className="text-lg text-muted-foreground relative z-10 max-w-md">
                تمت مراجعة الكود بنجاح. سيتم تحويل رصيد <span className="text-primary font-bold">{order.quantity} UC</span> إلى حسابك بغضون ثوانٍ.
              </p>
              
              <div className="mt-8 bg-black/40 border border-success/20 rounded-2xl p-6 w-full relative z-10 text-left">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-muted-foreground text-sm">Order ID</span>
                  <span className="text-white font-en font-bold">{order.id.slice(0,8).toUpperCase()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">Amount</span>
                  <span className="text-primary font-en font-black text-xl">{order.quantity} UC</span>
                </div>
              </div>
              
              <button
                onClick={() => setLocation("/")}
                className="mt-8 relative z-10 bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-3 rounded-xl transition-colors"
              >
                العودة للرئيسية
              </button>
            </motion.div>
          ) : isRejected ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center"
            >
              <div className="absolute inset-0 bg-destructive/10 bg-mesh pointer-events-none" />
              <motion.div 
                initial={{ rotate: -90, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring" }}
                className="w-24 h-24 bg-destructive/20 rounded-full flex items-center justify-center mb-6 relative z-10 box-glow shadow-destructive/50"
              >
                <XCircle className="w-14 h-14 text-destructive" />
              </motion.div>
              <h2 className="text-3xl font-black text-white mb-4 relative z-10">عذراً، الكود غير صحيح</h2>
              <p className="text-muted-foreground relative z-10 max-w-md">
                تم رفض الطلب بسبب أن الكود المدخل غير صحيح أو تم استخدامه مسبقاً. يرجى المحاولة مرة أخرى والتأكد من صحة الكود.
              </p>
              
              <button
                onClick={() => setLocation("/")}
                className="mt-10 relative z-10 bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold px-10 py-4 rounded-xl transition-all hover:shadow-lg hover:shadow-destructive/30 flex items-center gap-2 hover:-translate-y-1"
              >
                <RotateCcw className="w-5 h-5" />
                إعادة المحاولة من البداية
              </button>
            </motion.div>
          ) : null}
        </div>
      </motion.div>
    </AppLayout>
  );
}
