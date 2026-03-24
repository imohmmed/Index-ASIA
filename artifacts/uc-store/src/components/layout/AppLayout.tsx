import { ReactNode } from "react";
import { Link } from "wouter";
import { Shield, Zap } from "lucide-react";
import { AsiacellLogo } from "@/components/AsiacellLogo";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground relative overflow-hidden flex flex-col">
      <div className="fixed inset-0 z-0 bg-mesh pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-b from-[#E30613]/5 via-background to-background z-0 pointer-events-none" />

      <header className="relative z-10 border-b border-white/5 bg-background/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <AsiacellLogo className="w-12 h-12 group-hover:scale-110 transition-transform" />
            <div>
              <h1 className="font-black text-2xl tracking-wider text-white group-hover:text-[#E30613] transition-colors">
                آسياسيل
              </h1>
              <p className="text-xs text-muted-foreground font-medium">شراء رصيد فوري</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm font-semibold tracking-wide">
            <div className="flex items-center gap-2 text-muted-foreground cursor-default">
              <Zap className="w-4 h-4 text-[#E30613]" />
              <span>توصيل فوري</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground cursor-default">
              <Shield className="w-4 h-4 text-[#E30613]" />
              <span>آمن 100%</span>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-grow container mx-auto px-4 py-12 flex flex-col">
        {children}
      </main>

      <footer className="relative z-10 border-t border-white/5 bg-background/80 backdrop-blur-md py-8 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} آسياسيل ستور. جميع الحقوق محفوظة.
          </p>
        </div>
      </footer>
    </div>
  );
}
