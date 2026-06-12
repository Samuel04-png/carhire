import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarClock,
  CarFront,
  Headset,
  ShieldCheck,
  Star,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { company, services, testimonials } from "@/data/mock";
import { VehicleCard } from "@/components/fleet/VehicleCard";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/use-app-store";

const trustPillars = [
  {
    icon: ShieldCheck,
    title: "Clean & serviced fleet",
    description:
      "Every vehicle is presented with a premium finish and readiness checks before handover.",
  },
  {
    icon: Headset,
    title: "Responsive support",
    description:
      "Booking teams and dispatch remain reachable when schedules shift or details change.",
  },
  {
    icon: CarFront,
    title: "Professional drivers",
    description:
      "Chauffeurs are assigned with city knowledge, service discipline, and guest confidence in mind.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Corporate-ready accounts",
    description:
      "Fast repeat bookings, monthly invoicing, and clear account handling for business travel.",
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { bookingDraft, updateDraft } = useAppStore();
  const vehicles = useAppStore((state) => state.vehicles);
  const [pickupCity, setPickupCity] = useState(bookingDraft.pickupCity);
  const [pickupLocation, setPickupLocation] = useState(bookingDraft.pickupLocation);
  const [dropoffLocation, setDropoffLocation] = useState(bookingDraft.dropoffLocation || bookingDraft.pickupLocation);
  const [pickupDate, setPickupDate] = useState(bookingDraft.pickupDate);
  const [returnDate, setReturnDate] = useState(bookingDraft.returnDate);
  const [vehicleType, setVehicleType] = useState("All");
  const [vehicleModel, setVehicleModel] = useState("");
  const [withDriver, setWithDriver] = useState(bookingDraft.withDriver);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [activeHero, setActiveHero] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveTestimonial((current) => (current + 1) % testimonials.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveHero((current) => (current + 1) % 4);
    }, 6000);
    return () => window.clearInterval(timer);
  }, []);

  const featuredVehicles = useMemo(
    () => vehicles.filter((vehicle) => vehicle.featured).slice(0, 6),
    [vehicles],
  );
  const availabilityResults = useMemo(
    () =>
      vehicles
        .filter((vehicle) => vehicle.availableQuantity > 0 && vehicle.status !== "Maintenance" && vehicle.status !== "Retired" && vehicle.status !== "Inactive")
        .filter((vehicle) => (vehicleType === "All" ? true : vehicle.category === vehicleType))
        .filter((vehicle) => (vehicleModel.trim() ? `${vehicle.name} ${vehicle.make} ${vehicle.model}`.toLowerCase().includes(vehicleModel.trim().toLowerCase()) : true))
        .filter((vehicle) => vehicle.cities.includes(pickupCity))
        .slice(0, 4),
    [pickupCity, vehicleModel, vehicleType, vehicles],
  );
  const yearsInOperation = new Date().getFullYear() - company.founded;
  const averageRating = (
    testimonials.reduce((sum, testimonial) => sum + testimonial.rating, 0) /
    testimonials.length
  ).toFixed(1);
  const stats = [
    { label: "Vehicles in fleet", value: String(vehicles.length) },
    { label: "Years in operation", value: String(yearsInOperation) },
    { label: "Branches", value: "2" },
    { label: "Average client rating", value: `${averageRating}/5` },
  ];

  const handleSearch = () => {
    updateDraft({
      pickupCity,
      pickupLocation,
      dropoffLocation,
      pickupDate,
      returnDate,
      withDriver,
    });

    const params = new URLSearchParams();
    if (vehicleType !== "All") params.set("category", vehicleType);
    if (vehicleModel.trim()) params.set("search", vehicleModel.trim());
    if (withDriver) params.set("driverMode", "Chauffeur");
    params.set("city", pickupCity);
    if (pickupDate) params.set("pickupDate", pickupDate);
    if (returnDate) params.set("returnDate", returnDate);
    navigate(`/fleet?${params.toString()}`);
  };

  return (
    <div className="bg-[var(--color-gray-100)]">
      {/* HERO — Search-first */}
      <section className="relative overflow-hidden bg-[#071827] text-white">
        {/* Background image slideshow */}
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-[2000ms] ease-in-out"
            style={{
              backgroundImage: `url('/brand/dots/${
                [
                  "hero-d23de043d3ea",
                  "hero-20e1afe17472", 
                  "hero-261b4629a9e3",
                  "hero-8ed9cd128f11",
                ][index]
              }.jpg')`,
              opacity: activeHero === index ? 1 : 0,
            }}
          />
        ))}
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(8,31,53,0.88),rgba(11,49,87,0.78),rgba(26,127,212,0.58))]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(180deg,transparent,rgba(248,250,252,0.16))]" />

        <div className="relative mx-auto max-w-7xl px-4 py-14 pt-28 lg:py-20 lg:pt-32">
          {/* Header text — compact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-2xl text-center"
          >
            <h1 className="font-display text-3xl font-semibold tracking-[-0.025em] md:text-4xl">
              Car hire in Lusaka and Ndola
            </h1>
            <p className="mt-3 text-sm leading-6 text-white/76 md:text-base">
              Airport transfers, business travel, events, and self-drive bookings with clean vehicles and reliable support.
            </p>
          </motion.div>

          {/* Search card — the first thing people see */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="mx-auto mt-7 max-w-3xl rounded-xl border border-white/20 bg-white/95 p-4 text-[var(--color-primary)] shadow-[0_18px_60px_rgba(0,0,0,0.22)] sm:p-5"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="text-base font-semibold text-[var(--color-primary)]">Search available cars</div>
              <div className="hidden text-sm text-[var(--color-gray-500)] sm:block">Lusaka · Ndola</div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1">
                <span className="text-xs font-medium uppercase tracking-[0.15em] text-[var(--color-gray-500)]">Pickup city</span>
                <select
                  value={pickupCity}
                  onChange={(event) => {
                    const nextCity = event.target.value as typeof pickupCity;
                    setPickupCity(nextCity);
                    const defaultLocation = nextCity === "Lusaka" ? "Kenneth Kaunda International Airport" : "Ndola City Pickup";
                    setPickupLocation(defaultLocation);
                    setDropoffLocation(defaultLocation);
                  }}
                  className="h-12 w-full rounded-xl border border-[var(--color-gray-200)] bg-[var(--color-gray-100)] px-3 text-sm text-[var(--color-primary)] outline-none transition focus:border-[var(--color-accent)]"
                >
                  <option value="Lusaka">Lusaka</option>
                  <option value="Ndola">Ndola</option>
                </select>
              </label>
              <label className="space-y-1">
                <span className="text-xs font-medium uppercase tracking-[0.15em] text-[var(--color-gray-500)]">Pickup location</span>
                <input value={pickupLocation} onChange={(event) => setPickupLocation(event.target.value)} className="h-12 w-full rounded-xl border border-[var(--color-gray-200)] bg-[var(--color-gray-100)] px-3 text-sm text-[var(--color-primary)] outline-none transition focus:border-[var(--color-accent)]" placeholder="Airport, hotel, or address" />
              </label>
              <label className="space-y-1">
                <span className="text-xs font-medium uppercase tracking-[0.15em] text-[var(--color-gray-500)]">Pickup date</span>
                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={pickupDate}
                  onChange={(event) => setPickupDate(event.target.value)}
                  className="h-12 w-full rounded-xl border border-[var(--color-gray-200)] bg-[var(--color-gray-100)] px-3 text-sm text-[var(--color-primary)] outline-none transition focus:border-[var(--color-accent)]"
                />
              </label>
              <label className="space-y-1">
                <span className="text-xs font-medium uppercase tracking-[0.15em] text-[var(--color-gray-500)]">Return date</span>
                <input
                  type="date"
                  min={pickupDate || new Date().toISOString().split("T")[0]}
                  value={returnDate}
                  onChange={(event) => setReturnDate(event.target.value)}
                  className="h-12 w-full rounded-xl border border-[var(--color-gray-200)] bg-[var(--color-gray-100)] px-3 text-sm text-[var(--color-primary)] outline-none transition focus:border-[var(--color-accent)]"
                />
              </label>
              <label className="space-y-1">
                <span className="text-xs font-medium uppercase tracking-[0.15em] text-[var(--color-gray-500)]">Vehicle type</span>
                <select
                  value={vehicleType}
                  onChange={(event) => setVehicleType(event.target.value)}
                  className="h-12 w-full rounded-xl border border-[var(--color-gray-200)] bg-[var(--color-gray-100)] px-3 text-sm text-[var(--color-primary)] outline-none transition focus:border-[var(--color-accent)]"
                >
                  <option value="All">All types</option>
                  <option value="Economy">Economy</option>
                  <option value="Saloon">Saloon</option>
                  <option value="SUV">SUV</option>
                  <option value="Minibus">Minibus</option>
                  <option value="Luxury">Luxury</option>
                  <option value="Pickup">Pickup</option>
                </select>
              </label>
              <label className="space-y-1">
                <span className="text-xs font-medium uppercase tracking-[0.15em] text-[var(--color-gray-500)]">Driver</span>
                <div className="flex h-12 items-center justify-between rounded-xl border border-[var(--color-gray-200)] bg-[var(--color-gray-100)] px-3">
                  <span className="text-sm text-[var(--color-primary)]">{withDriver ? "With chauffeur" : "Self-drive"}</span>
                  <button
                    type="button"
                    onClick={() => setWithDriver((value) => !value)}
                    className={`relative h-7 w-12 rounded-full transition ${withDriver ? "bg-[var(--color-accent)]" : "bg-[var(--color-gray-300)]"}`}
                    aria-label="Toggle chauffeur option"
                  >
                    <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white transition ${withDriver ? "left-[22px]" : "left-0.5"}`} />
                  </button>
                </div>
              </label>
            </div>

            {/* Live availability */}
            {availabilityResults.length > 0 && (
              <div className="mt-4 rounded-xl border border-[var(--color-gray-200)] bg-[var(--color-gray-100)] p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-[var(--color-gray-500)]">{availabilityResults.length} vehicle{availabilityResults.length !== 1 ? 's' : ''} available</span>
                </div>
                <div className="mt-2 grid gap-1.5">
                  {availabilityResults.slice(0, 3).map((vehicle) => (
                    <button key={vehicle.id} type="button" onClick={() => updateDraft({ vehicleId: vehicle.id })} className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-left text-sm transition hover:shadow-sm">
                      <span className="font-medium text-[var(--color-primary)]">{vehicle.name}</span>
                      <span className="text-xs text-[var(--color-accent)]">{vehicle.availableQuantity} avail.</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search button — underneath everything */}
            <Button onClick={handleSearch} className="mt-4 h-12 w-full rounded-xl text-sm">
              Search Available Vehicles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Featured Fleet */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <SectionHeader
          eyebrow="Our fleet"
          title="Vehicles ready for your journey"
          description="A curated selection available for airport transfers, business travel, and self-drive."
        />
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {featuredVehicles.map((vehicle) => (
            <div key={vehicle.id}>
              <VehicleCard vehicle={vehicle} />
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Button asChild variant="secondary" className="rounded-full px-6">
            <Link to="/fleet">View Full Fleet</Link>
          </Button>
        </div>
      </section>

      {/* Services */}
      <section className="bg-[var(--color-primary)] py-14 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeader
            eyebrow="Services"
            title="Built for business, events, and every journey in between"
            description="Choose the service that fits your trip — we'll match the right vehicle and support."
            className="[&>h2]:text-white [&>p]:text-white/70"
          />
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <Link
                key={service.slug}
                to={`/services/${service.slug}`}
                className="rounded-xl border border-white/10 bg-[rgba(255,255,255,0.05)] p-5 backdrop-blur transition hover:border-white/20 hover:bg-[rgba(255,255,255,0.08)]"
              >
                <div className="font-display text-lg font-semibold tracking-[-0.02em]">
                  {service.title}
                </div>
                <p className="mt-2 text-sm leading-6 text-white/70">
                  {service.description}
                </p>
                <div className="mt-4 inline-flex items-center text-sm font-medium text-white">
                  Learn More
                  <ArrowRight className="ml-2 h-3.5 w-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust section */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <SectionHeader
          eyebrow="Why choose Dots"
          title="Trust signals that matter in premium car hire"
          description="When timing matters and plans can change, the details decide the journey."
        />
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-[var(--color-gray-200)] bg-white p-5"
            >
              <div className="font-display text-xl font-semibold tracking-[-0.03em] text-[var(--color-primary)]">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-[var(--color-gray-600)]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {trustPillars.map((pillar) => (
            <div
              key={pillar.title}
              className="rounded-xl border border-[var(--color-gray-200)] bg-white p-5"
            >
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                <pillar.icon className="h-5 w-5" />
              </div>
              <div className="mt-4 font-semibold text-[var(--color-primary)]">
                {pillar.title}
              </div>
              <p className="mt-2 text-sm leading-6 text-[var(--color-gray-600)]">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 pb-14">
        <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <div className="rounded-xl border border-[var(--color-gray-200)] bg-white p-6 sm:p-8">
            <SectionHeader
              eyebrow="Testimonials"
              title="Trusted by business teams and private clients"
              description="Clients return when the vehicle is ready and the handover is clear."
            />
            <div className="mt-6 rounded-xl bg-[linear-gradient(180deg,#f6f8fb,#edf2f9)] p-5">
              <div className="mb-3 flex gap-1 text-[var(--color-gold)]">
                {Array.from({ length: testimonials[activeTestimonial].rating }).map(
                  (_, index) => (
                    <Star key={index} className="h-4 w-4 fill-current" />
                  ),
                )}
              </div>
              <p className="text-base leading-7 text-[var(--color-primary)]">
                "{testimonials[activeTestimonial].quote}"
              </p>
              <div className="mt-4">
                <div className="font-semibold text-[var(--color-primary)]">
                  {testimonials[activeTestimonial].name}
                </div>
                <div className="text-sm text-[var(--color-gray-600)]">
                  {testimonials[activeTestimonial].role}, {testimonials[activeTestimonial].company}
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                {testimonials.map((testimonial, index) => (
                  <button
                    key={testimonial.id}
                    className={`h-2 rounded-full transition ${
                      index === activeTestimonial
                        ? "w-8 bg-[var(--color-accent)]"
                        : "w-2 bg-[var(--color-gray-300)]"
                    }`}
                    onClick={() => setActiveTestimonial(index)}
                    aria-label={`Show testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Why choose summary */}
          <div className="rounded-xl border border-[var(--color-gray-200)] bg-[var(--color-primary)] p-6 text-white sm:p-8">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
              The Dots difference
            </div>
            <div className="mt-4 font-display text-xl font-semibold tracking-[-0.03em]">
              Premium car hire, simplified
            </div>
            <p className="mt-3 text-sm leading-6 text-white/70">
              From booking to handover, every step is designed for reliability. Clean vehicles, clear pricing, and support that's reachable when plans change.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                { value: "5.0/5", label: "Client rating" },
                { value: "2", label: "Branches" },
                { value: "24/7", label: "Support" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-white/10 bg-white/8 px-4 py-3"
                >
                  <div className="font-display text-xl font-bold tracking-[-0.03em]">
                    {item.value}
                  </div>
                  <div className="mt-1 text-xs text-white/60">{item.label}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button asChild className="rounded-full">
                <Link to="/book/step-1">
                  Book a Vehicle
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="ghost" className="rounded-full text-white hover:bg-white/10 hover:text-white">
                <Link to="/fleet">View Fleet</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
