import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Car, User, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export function QuickBookingWidget() {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [withDriver, setWithDriver] = useState(false);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    // Navigate to fleet with query params
    const params = new URLSearchParams();
    if (location) params.append("location", location);
    if (pickupDate) params.append("pickup", pickupDate);
    if (returnDate) params.append("return", returnDate);
    if (vehicleType) params.append("type", vehicleType);
    params.append("driver", withDriver ? "yes" : "no");
    
    navigate(`/fleet?${params.toString()}`);
  };

  return (
    <section className="relative z-20 -mt-24 px-4">
      <div className="container mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] p-6 md:p-10 max-w-6xl mx-auto border border-[var(--color-gray-200)]"
        >
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-5 gap-6">
            
            {/* Location */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-[var(--color-gray-500)] uppercase tracking-wider flex items-center gap-1.5">
                <MapPin size={14} className="text-[var(--color-accent)]" /> Pickup Location
              </label>
              <select 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="h-14 px-4 rounded-xl border border-[var(--color-gray-200)] bg-[var(--color-gray-50)] focus:bg-white focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:border-[var(--color-accent)] transition-all outline-none text-[var(--color-primary)] font-medium appearance-none"
              >
                <option value="">Select Location</option>
                <option value="Lusaka Airport">Lusaka Airport</option>
                <option value="Lusaka CBD">Lusaka CBD</option>
                <option value="Kitwe">Kitwe</option>
                <option value="Ndola">Ndola</option>
              </select>
            </div>

            {/* Dates */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-[var(--color-gray-500)] uppercase tracking-wider flex items-center gap-1.5">
                <Calendar size={14} className="text-[var(--color-accent)]" /> Pickup Date
              </label>
              <input 
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="h-14 px-4 rounded-xl border border-[var(--color-gray-200)] bg-[var(--color-gray-50)] focus:bg-white focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:border-[var(--color-accent)] transition-all outline-none text-[var(--color-primary)] font-medium"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-[var(--color-gray-500)] uppercase tracking-wider flex items-center gap-1.5">
                <Calendar size={14} className="text-[var(--color-accent)]" /> Return Date
              </label>
              <input 
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                min={pickupDate || new Date().toISOString().split('T')[0]}
                className="h-14 px-4 rounded-xl border border-[var(--color-gray-200)] bg-[var(--color-gray-50)] focus:bg-white focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:border-[var(--color-accent)] transition-all outline-none text-[var(--color-primary)] font-medium"
              />
            </div>

            {/* Vehicle Type & Driver */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-[var(--color-gray-500)] uppercase tracking-wider flex items-center gap-1.5">
                <Car size={14} className="text-[var(--color-accent)]" /> Vehicle Type
              </label>
              <select 
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="h-14 px-4 rounded-xl border border-[var(--color-gray-200)] bg-[var(--color-gray-50)] focus:bg-white focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:border-[var(--color-accent)] transition-all outline-none text-[var(--color-primary)] font-medium appearance-none"
              >
                <option value="">All Types</option>
                <option value="Economy">Economy</option>
                <option value="Saloon">Saloon</option>
                <option value="SUV">SUV</option>
                <option value="Minibus">Minibus</option>
                <option value="Luxury">Luxury</option>
              </select>
            </div>

            {/* Submit */}
            <div className="flex flex-col justify-end gap-3">
              <div className="flex items-center gap-2 mb-1 px-1">
                <input 
                  type="checkbox" 
                  id="withDriver" 
                  checked={withDriver}
                  onChange={(e) => setWithDriver(e.target.checked)}
                  className="w-4 h-4 rounded border-[var(--color-gray-300)] text-[var(--color-accent)] focus:ring-[var(--color-accent)]"
                />
                <label htmlFor="withDriver" className="text-sm font-medium text-[var(--color-gray-700)] flex items-center gap-1.5 cursor-pointer select-none">
                  <User size={14} className="text-[var(--color-gray-500)]" /> With Driver
                </label>
              </div>
              <Button type="submit" className="w-full h-14 rounded-xl text-base shadow-lg shadow-[var(--color-accent)]/20 hover:shadow-[var(--color-accent)]/40 transition-all">
                Search <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>

          </form>
        </motion.div>
      </div>
    </section>
  );
}
