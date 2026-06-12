import { Link } from "react-router-dom";
import { Users, Settings, Wind, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { SafeVehicleImage } from "@/components/fleet/SafeVehicleImage";
import { Button } from "@/components/ui/button";
import { vehicles } from "@/data/mock";
import { formatCurrency } from "@/lib/format";

export function FleetPreview() {
  const featuredVehicles = vehicles.slice(0, 6);

  return (
    <section className="py-24 bg-[var(--color-gray-50)]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="font-display font-bold text-4xl md:text-5xl text-[var(--color-primary)] mb-4 tracking-tight">
              Featured Fleet
            </h2>
            <p className="text-[var(--color-gray-600)] text-lg font-light">
              From economical city cars to rugged 4x4s and premium luxury vehicles,
              we have the perfect vehicle for your journey.
            </p>
          </div>
          <Button asChild variant="outline" className="shrink-0 rounded-full h-12 px-6 border-[var(--color-gray-300)] hover:bg-[var(--color-gray-100)]">
            <Link to="/fleet">View Full Fleet <ArrowRight className="ml-2 w-4 h-4" /></Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredVehicles.map((vehicle, index) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[var(--color-gray-200)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] group flex flex-col"
            >
              <div className="relative h-56 overflow-hidden bg-[var(--color-gray-100)]">
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <SafeVehicleImage
                  src={vehicle.mainImage}
                  alt={vehicle.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 z-20">
                  <span className="bg-white/90 backdrop-blur-md text-[var(--color-primary)] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                    {vehicle.category}
                  </span>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="font-display font-bold text-xl text-[var(--color-primary)] leading-tight group-hover:text-[var(--color-accent)] transition-colors">
                    {vehicle.name}
                  </h3>
                  <div className="text-right shrink-0 ml-4">
                    <span className="block text-[var(--color-primary)] font-bold text-2xl leading-none">
                      {formatCurrency(vehicle.baseDailyRate)}
                    </span>
                    <span className="text-[13px] text-[var(--color-gray-500)] font-medium">/ day</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 py-5 border-y border-[var(--color-gray-100)] mb-6 mt-auto">
                  <div className="flex flex-col items-center gap-2 text-[var(--color-gray-500)]">
                    <div className="p-2 bg-[var(--color-gray-50)] rounded-full group-hover:bg-[var(--color-accent)]/10 group-hover:text-[var(--color-accent)] transition-colors">
                      <Users size={18} />
                    </div>
                    <span className="text-[13px] font-medium">{vehicle.seats} Seats</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 text-[var(--color-gray-500)]">
                    <div className="p-2 bg-[var(--color-gray-50)] rounded-full group-hover:bg-[var(--color-accent)]/10 group-hover:text-[var(--color-accent)] transition-colors">
                      <Settings size={18} />
                    </div>
                    <span className="text-[13px] font-medium">{vehicle.transmission}</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 text-[var(--color-gray-500)]">
                    <div className="p-2 bg-[var(--color-gray-50)] rounded-full group-hover:bg-[var(--color-accent)]/10 group-hover:text-[var(--color-accent)] transition-colors">
                      <Wind size={18} />
                    </div>
                    <span className="text-[13px] font-medium">{vehicle.ac ? "A/C" : "No A/C"}</span>
                  </div>
                </div>

                <Button asChild className="w-full rounded-full h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all group/btn" variant="default">
                  <Link to={`/fleet/${vehicle.slug}`} className="flex items-center justify-center gap-2">
                    View Details
                    <ArrowRight size={18} className="transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
