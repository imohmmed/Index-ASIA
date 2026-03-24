import { AppLayout } from "@/components/layout/AppLayout";
import { Link } from "wouter";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <AlertCircle className="w-24 h-24 text-destructive mb-8 opacity-80" />
        <h1 className="text-5xl font-black text-white mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">عذراً، الصفحة التي تبحث عنها غير موجودة.</p>
        <Link href="/" className="bg-primary text-primary-foreground font-bold px-8 py-4 rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
          العودة للصفحة الرئيسية
        </Link>
      </div>
    </AppLayout>
  );
}
