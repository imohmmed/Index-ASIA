import { useLocation, useParams } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { useSubmitCode } from "@workspace/api-client-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { StepIndicator } from "@/components/StepIndicator";
import { Loader2, KeyRound } from "lucide-react";

const formSchema = z.object({
  code: z.string().min(4, "الكود غير مكتمل")
});

type FormValues = z.infer<typeof formSchema>;

export default function Code() {
  const { id } = useParams<{ id: string }>();
  const [_, setLocation] = useLocation();

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema)
  });

  const { mutate, isPending } = useSubmitCode({
    mutation: {
      onSuccess: () => {
        setLocation(`/order/${id}/status`);
      }
    }
  });

  const onSubmit = (data: FormValues) => {
    if (!id) return;
    mutate({
      orderId: id,
      data
    });
  };

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="w-full max-w-2xl mx-auto"
      >
        <StepIndicator currentStep={3} />
        
        <div className="mt-16 bg-card/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden text-center">
          <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
          
          <div className="relative z-10 mb-8">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-primary border-dashed animate-[spin_10s_linear_infinite]">
              <div className="animate-[spin_10s_linear_infinite_reverse]">
                <KeyRound className="w-10 h-10 text-primary" />
              </div>
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-4">إدخال كود التفعيل</h2>
            <div className="bg-secondary/50 border border-white/5 rounded-xl p-4 inline-block mx-auto">
              <p className="text-muted-foreground leading-relaxed">
                لقد قمنا بإرسال رسالة إليك عبر الواتساب تحتوي على الكود الخاص بك.<br/>
                <strong className="text-white mt-1 block">يرجى نسخ الكود ولصقه هنا لإتمام الطلب.</strong>
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="relative z-10 max-w-sm mx-auto">
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  dir="ltr"
                  placeholder="XXXX-XXXX-XXXX"
                  {...register("code")}
                  className={`w-full bg-black/80 border-2 ${errors.code ? 'border-destructive' : 'border-primary/50 focus:border-primary'} rounded-xl px-5 py-5 text-white font-en text-2xl text-center tracking-[0.2em] outline-none transition-all placeholder:text-white/10 focus:ring-4 focus:ring-primary/20 uppercase`}
                />
              </div>
              {errors.code && (
                <p className="text-destructive text-sm font-bold">{errors.code.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full mt-8 bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 text-primary-foreground font-black text-xl py-5 rounded-xl transition-all shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:shadow-[0_0_40px_rgba(245,158,11,0.5)] flex items-center justify-center gap-3 hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  جاري التحقق...
                </>
              ) : (
                "تأكيد الكود"
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </AppLayout>
  );
}
