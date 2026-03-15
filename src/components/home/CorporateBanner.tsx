import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building2, Phone, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export function CorporateBanner() {
  return (
    <section className="relative py-32 bg-[var(--color-primary)] overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070"
          alt="City skyline"
          className="w-full h-full object-cover opacity-20 mix-blend-overlay"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-primary)]/90 to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-[var(--color-accent)] font-semibold text-xs tracking-widest uppercase mb-8 border border-white/10">
              <Building2 size={16} /> Business Solutions
            </div>
            
            <h2 className="font-display font-bold text-4xl md:text-6xl text-white leading-tight mb-6 tracking-tight">
              Corporate & <br className="hidden md:block" />Business Accounts
            </h2>
            
            <p className="text-lg md:text-xl text-[var(--color-gray-300)] mb-10 leading-relaxed max-w-2xl font-light">
              Dedicated fleet. Monthly invoicing. Priority service for Zambia's leading businesses. 
              Streamline your company's transportation needs with a Shark Corporate Account.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="rounded-full h-14 px-8 text-base shadow-[0_8px_30px_rgb(0,0,0,0.12)]" asChild>
                <Link to="/services#corporate">Open a Corporate Account <ArrowRight className="ml-2 w-5 h-5" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full h-14 px-8 text-base bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white backdrop-blur-sm" asChild>
                <Link to="/contact" className="flex items-center gap-2">
                  <Phone size={18} /> Speak to Corporate Team
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
