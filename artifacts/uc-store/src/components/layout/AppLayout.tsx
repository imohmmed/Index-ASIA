import { ReactNode } from "react";
import { Link } from "wouter";
import { Gamepad2, Shield, Zap } from "lucide-react";
import { motion } from "framer-motion";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground relative overflow-hidden flex flex-col">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 bg-mesh pointer-events-none" />
      <img 
        src={`${import.meta.env.BASE_URL}images/hero-bg.png`} 
        alt="Background" 
        className="fixed inset-0 w-full h-full object-cover opacity-[0.15] mix-blend-screen pointer-events-none"
      />
      <div className="fixed inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background z-0 pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 border-b border-white/5 bg-background/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all duration-300">
              <Gamepad2 className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display font-black text-2xl tracking-wider text-white group-hover:text-primary transition-colors flex items-center gap-1">
                UC <span className="text-primary group-hover:text-white transition-colors">STORE</span>
              </h1>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest font-en">Premium Game Currency</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6 font-en text-sm font-semibold tracking-wide">
            <div className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors cursor-default">
              <Zap className="w-4 h-4 text-primary" />
              <span>INSTANT DELIVERY</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors cursor-default">
              <Shield className="w-4 h-4 text-primary" />
              <span>100% SECURE</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-grow container mx-auto px-4 py-12 flex flex-col">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 bg-background/80 backdrop-blur-md py-8 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} UC Store. جميع الحقوق محفوظة.
          </p>
          <p className="text-muted-foreground/50 text-xs mt-2 font-en">
            This site is not affiliated with or endorsed by PUBG Corporation or Tencent Games.
          </p>
        </div>
      </footer>
    </div>
  );
}
