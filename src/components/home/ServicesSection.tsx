import { Link } from "react-router-dom";
import { Plane, Building2, Heart, CalendarDays, Key, Clock, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

const SERVICES = [
  {
    id: "airport-transfers",
    title: "Airport Transfers",
    description: "Reliable pickup and drop-off at Kenneth Kaunda International Airport with flight tracking.",
    icon: Plane,
  },
  {
    id: "corporate",
    title: "Corporate Hire",
    description: "Dedicated fleet and priority service for Zambia's leading businesses with monthly invoicing.",
    icon: Building2,
  },
  {
    id: "weddings",
    title: "Wedding Cars",
    description: "Make your special day unforgettable with our decorated premium luxury vehicles.",
    icon: Heart,
  },
  {
    id: "events",
    title: "Event Hire",
    description: "Multi-vehicle coordination for conferences, summits, and large-scale events.",
    icon: CalendarDays,
  },
  {
    id: "self-drive",
    title: "Self-Drive",
    description: "Explore Zambia at your own pace with our well-maintained, fully insured vehicles.",
    icon: Key,
  },
  {
    id: "long-term",
    title: "Long Term Lease",
    description: "Cost-effective monthly rates with full maintenance and fleet management included.",
    icon: Clock,
  },
];

export function ServicesSection() {
  return (
    <section className="py-32 bg-[var(--color-primary)] text-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <motion.div 
            className="max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[var(--color-accent)] font-semibold tracking-wider uppercase text-sm mb-4 block">
              Mobility Solutions
            </span>
            <h2 className="font-display font-bold text-4xl md:text-5xl mb-6 tracking-tight text-white">
              Our Services
            </h2>
            <p className="text-[var(--color-gray-400)] text-lg md:text-xl font-light leading-relaxed">
              More than just car hire. We provide comprehensive mobility solutions 
              tailored to your specific needs, ensuring a seamless experience from start to finish.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link 
              to="/services"
              className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium transition-all duration-300 backdrop-blur-md border border-white/10"
            >
              View All Services <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service, index) => (
            <motion.div 
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 transition-all duration-500 hover:bg-white/[0.04] hover:border-white/10 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-4 group-hover:translate-x-0">
                 <ArrowRight className="w-6 h-6 text-[var(--color-accent)]" />
              </div>
              
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-8 text-[var(--color-accent)] group-hover:scale-110 transition-transform duration-500">
                <service.icon size={32} strokeWidth={1.5} />
              </div>
              <h3 className="font-display font-semibold text-2xl mb-4 text-white group-hover:text-[var(--color-accent)] transition-colors duration-300">{service.title}</h3>
              <p className="text-[var(--color-gray-400)] mb-8 leading-relaxed font-light">
                {service.description}
              </p>
              <Link 
                to={`/services#${service.id}`}
                className="absolute inset-0 z-10"
                aria-label={`Learn more about ${service.title}`}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
