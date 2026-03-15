import { motion } from "motion/react";
import { ShieldCheck, Clock, Wrench, CheckCircle2 } from "lucide-react";

const STATS = [
  { label: "Vehicles in Fleet", value: "150+" },
  { label: "Years Experience", value: "12" },
  { label: "Happy Clients", value: "10k+" },
  { label: "Cities Covered", value: "3" },
];

const PILLARS = [
  {
    icon: ShieldCheck,
    title: "Professional Drivers",
    description: "Our chauffeurs are highly trained, vetted, and experienced in defensive driving.",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "We are always available. Dedicated roadside assistance and customer service.",
  },
  {
    icon: Wrench,
    title: "Clean & Serviced Fleet",
    description: "Every vehicle undergoes a rigorous 50-point check and deep clean before handover.",
  },
  {
    icon: CheckCircle2,
    title: "Instant Confirmation",
    description: "No waiting around. Book online and receive your confirmation immediately.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-32 bg-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-[var(--color-accent)]/5 blur-[120px]" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[var(--color-primary)]/5 blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[var(--color-accent)] font-semibold tracking-wider uppercase text-sm mb-4 block">
              The Shark Difference
            </span>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-[var(--color-primary)] mb-6 tracking-tight">
              Why Choose Us
            </h2>
            <p className="text-[var(--color-gray-500)] text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
              We don't just rent cars; we deliver peace of mind. Experience the difference 
              of a truly premium service tailored to your needs.
            </p>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24">
          {STATS.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5, type: "spring", stiffness: 100 }}
              className="text-center p-6 rounded-3xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[var(--color-gray-100)]"
            >
              <div className="font-display font-bold text-5xl md:text-6xl text-[var(--color-primary)] leading-none mb-3 tracking-tighter">
                {stat.value}
              </div>
              <div className="font-medium text-[var(--color-gray-500)] uppercase tracking-wider text-xs md:text-sm">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {PILLARS.map((pillar, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="bg-white rounded-3xl p-8 border border-[var(--color-gray-200)] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-2 group"
            >
              <div className="w-16 h-16 bg-[var(--color-gray-50)] rounded-2xl flex items-center justify-center mb-8 text-[var(--color-accent)] group-hover:bg-[var(--color-accent)] group-hover:text-white transition-colors duration-500">
                <pillar.icon size={32} strokeWidth={1.5} />
              </div>
              <h3 className="font-display font-semibold text-2xl text-[var(--color-primary)] mb-4">
                {pillar.title}
              </h3>
              <p className="text-[var(--color-gray-500)] leading-relaxed font-light">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
