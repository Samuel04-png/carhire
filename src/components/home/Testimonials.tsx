import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    id: 1,
    quote: "Shark Car Hire provided an exceptional service for our corporate retreat. The vehicles were immaculate and the drivers were highly professional.",
    name: "Sarah M.",
    role: "Events Director, TechCorp Zambia",
    rating: 5,
  },
  {
    id: 2,
    quote: "I always use Shark when flying into Lusaka. Their airport transfer service is flawless. The driver is always waiting, even when my flight is delayed.",
    name: "David K.",
    role: "Frequent Business Traveler",
    rating: 5,
  },
  {
    id: 3,
    quote: "We rented a 4x4 for a weekend trip to Livingstone. The vehicle handled the roads perfectly and the booking process was incredibly smooth.",
    name: "Chanda B.",
    role: "Local Tourist",
    rating: 5,
  },
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isHovered]);

  const next = () => setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);

  return (
    <section className="py-32 bg-[var(--color-gray-50)] relative overflow-hidden">
      {/* Subtle Pattern Background */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, var(--color-primary) 1px, transparent 0)', backgroundSize: '32px 32px' }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[var(--color-accent)] font-semibold tracking-wider uppercase text-sm mb-4 block">
              Client Stories
            </span>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-[var(--color-primary)] mb-6 tracking-tight">
              What Our Clients Say
            </h2>
          </motion.div>
        </div>

        <div 
          className="max-w-5xl mx-auto relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[var(--color-gray-200)] min-h-[400px] flex flex-col justify-center relative overflow-hidden">
            {/* Decorative Quote Mark */}
            <div className="absolute -top-10 -left-10 text-[var(--color-gray-100)] opacity-50 transform -scale-x-100">
              <Quote size={200} strokeWidth={1} />
            </div>
            
            <div className="p-8 md:p-16 relative z-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="text-center"
                >
                  <div className="flex justify-center gap-1 mb-10 text-[var(--color-gold)]">
                    {[...Array(TESTIMONIALS[currentIndex].rating)].map((_, i) => (
                      <Star key={i} size={24} fill="currentColor" />
                    ))}
                  </div>
                  
                  <p className="font-display font-medium text-2xl md:text-4xl text-[var(--color-primary)] leading-tight md:leading-snug mb-12 max-w-4xl mx-auto">
                    "{TESTIMONIALS[currentIndex].quote}"
                  </p>
                  
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-[var(--color-gray-100)] rounded-full flex items-center justify-center mb-4 text-[var(--color-primary)] font-bold text-lg">
                      {TESTIMONIALS[currentIndex].name.charAt(0)}
                    </div>
                    <h4 className="font-bold text-lg text-[var(--color-primary)] mb-1">
                      {TESTIMONIALS[currentIndex].name}
                    </h4>
                    <p className="text-[var(--color-gray-500)] text-sm uppercase tracking-wider font-medium">
                      {TESTIMONIALS[currentIndex].role}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-4 md:-mx-6 pointer-events-none">
            <button 
              onClick={prev}
              className="w-14 h-14 bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex items-center justify-center text-[var(--color-primary)] hover:text-[var(--color-accent)] hover:scale-110 transition-all border border-[var(--color-gray-200)] pointer-events-auto hidden md:flex"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={next}
              className="w-14 h-14 bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex items-center justify-center text-[var(--color-primary)] hover:text-[var(--color-accent)] hover:scale-110 transition-all border border-[var(--color-gray-200)] pointer-events-auto hidden md:flex"
              aria-label="Next testimonial"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-3 mt-10">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentIndex ? "bg-[var(--color-accent)] w-8" : "bg-[var(--color-gray-300)] w-2 hover:bg-[var(--color-gray-400)]"
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
