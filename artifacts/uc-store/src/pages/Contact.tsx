import { useLocation, useParams } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { useSubmitContact } from "@workspace/api-client-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { StepIndicator } from "@/components/StepIndicator";
import { Loader2, Phone, User } from "lucide-react";

const formSchema = z.object({
  whatsapp: z.string().min(8, "الرجاء إدخال رقم واتساب صحيح").regex(/^[0-9+]+$/, "الرقم يجب أن يحتوي على أرقام فقط"),
  name: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

export default function Contact() {
  const { id } = useParams<{ id: string }>();
  const [_, setLocation] = useLocation();

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema)
  });

  const { mutate, isPending } = useSubmitContact({
    mutation: {
      onSuccess: () => {
        setLocation(`/order/${id}/code`);
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
        <StepIndicator currentStep={2} />
        
        <div className="mt-16 bg-card/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          
          <div className="relative z-10 text-center mb-10">
            <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-primary/30 text-primary">
              <Phone className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">معلومات التواصل</h2>
            <p className="text-muted-foreground">
              يرجى إدخال رقم الواتساب الخاص بك لنتمكن من إرسال كود التفعيل ومتابعة طلبك.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="relative z-10 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-white block">رقم الواتساب <span className="text-destructive">*</span></label>
              <div className="relative">
                <input
                  type="tel"
                  dir="ltr"
                  placeholder="+964 7XX XXX XXXX"
                  {...register("whatsapp")}
                  className={`w-full bg-black/50 border ${errors.whatsapp ? 'border-destructive' : 'border-white/10 focus:border-primary'} rounded-xl px-5 py-4 text-white font-en text-lg outline-none transition-all placeholder:text-white/20 focus:ring-4 focus:ring-primary/20`}
                />
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              </div>
              {errors.whatsapp && (
                <p className="text-destructive text-sm font-semibold mt-1">{errors.whatsapp.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-white block">الاسم (اختياري)</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="كيف نحب أن نناديك؟"
                  {...register("name")}
                  className="w-full bg-black/50 border border-white/10 focus:border-primary rounded-xl px-5 py-4 text-white outline-none transition-all placeholder:text-white/20 focus:ring-4 focus:ring-primary/20"
                />
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full mt-8 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg py-4 rounded-xl transition-all shadow-lg hover:shadow-primary/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                "الاستمرار للخطوة التالية"
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </AppLayout>
  );
}
