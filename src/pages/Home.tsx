import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarClock,
  CarFront,
  ChevronDown,
  Headset,
  ShieldCheck,
  Star,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { company, services, testimonials, vehicles } from "@/data/mock";
import { VehicleCard } from "@/components/fleet/VehicleCard";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
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

const corporateBenefits = [
  {
    icon: BriefcaseBusiness,
    title: "Priority reservation desk",
    description:
      "Fast repeat booking for company users, site teams, and recurring executive travel.",
  },
  {
    icon: CalendarClock,
    title: "Monthly invoicing",
    description:
      "Clear statements, payment follow-up, and cleaner internal approvals for account teams.",
  },
  {
    icon: Headset,
    title: "Responsive account support",
    description:
      "Dispatch support for schedule changes, arrival delays, and event movement updates.",
  },
  {
    icon: ShieldCheck,
    title: "Presentation standards",
    description:
      "Vehicles are cleaned, checked, and released with the level of polish clients expect.",
  },
];

const heroVideo =
  "https://player.vimeo.com/external/434045526.sd.mp4?s=66db1f9ec0f9e7ebcf0d753f9d47d37e2b2fc90a&profile_id=139&oauth2_token_id=57447761";

export default function HomePage() {
  const navigate = useNavigate();
  const { bookingDraft, updateDraft } = useAppStore();
  const [isVideoReady, setIsVideoReady] = useState(true);
  const [pickupCity, setPickupCity] = useState(bookingDraft.pickupCity);
  const [pickupDate, setPickupDate] = useState(bookingDraft.pickupDate);
  const [returnDate, setReturnDate] = useState(bookingDraft.returnDate);
  const [vehicleType, setVehicleType] = useState("All");
  const [withDriver, setWithDriver] = useState(bookingDraft.withDriver);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveTestimonial((current) => (current + 1) % testimonials.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, []);

  const featuredVehicles = useMemo(
    () => vehicles.filter((vehicle) => vehicle.featured).slice(0, 6),
    [],
  );
  const yearsInOperation = new Date().getFullYear() - company.founded;
  const averageRating = (
    testimonials.reduce((sum, testimonial) => sum + testimonial.rating, 0) /
    testimonials.length
  ).toFixed(1);
  const stats = [
    { label: "Vehicles in fleet", value: String(vehicles.length) },
    { label: "Years in operation", value: String(yearsInOperation) },
    { label: "Cities served", value: "3" },
    { label: "Average client rating", value: `${averageRating}/5` },
  ];

  const handleSearch = () => {
    updateDraft({
      pickupCity,
      pickupLocation:
        pickupCity === "Lusaka"
          ? "Kenneth Kaunda International Airport"
          : `${pickupCity} City Pickup`,
      pickupDate,
      returnDate,
      withDriver,
    });

    const params = new URLSearchParams();
    if (vehicleType !== "All") params.set("category", vehicleType);
    if (withDriver) params.set("driverMode", "Chauffeur");
    params.set("city", pickupCity);
    if (pickupDate) params.set("pickupDate", pickupDate);
    if (returnDate) params.set("returnDate", returnDate);
    navigate(`/fleet?${params.toString()}`);
  };

  return (
    <div className="bg-[var(--color-gray-100)]">
      <section className="relative min-h-screen overflow-hidden bg-[var(--color-primary)] text-white">
        <div className="absolute inset-0">
          {isVideoReady ? (
            <video
              className="h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80"
              onError={() => setIsVideoReady(false)}
            >
              <source src={heroVideo} type="video/mp4" />
            </video>
          ) : (
            <img
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80"
              alt=""
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
          )}
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,22,40,0.15),rgba(10,22,40,0.86))]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(26,127,212,0.28),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(14,77,140,0.72),transparent_42%)]" />

        <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 pb-16 pt-32">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <div className="mb-6 inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/80 backdrop-blur">
              Executive car hire across Lusaka, Kitwe, and Ndola
            </div>
            <h1 className="font-display text-5xl font-extrabold tracking-[-0.06em] md:text-7xl lg:text-[5.2rem] lg:leading-[1]">
              Premium Car Hire For Zambia's Business Hubs
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/78 md:text-xl">
              Book a serviced vehicle or confirmed chauffeur in minutes for airport
              transfers, corporate travel, events, weddings, and self-drive journeys.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg" className="rounded-full px-8">
                <Link to="/book/step-1">
                  Book a Vehicle
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="lg" className="rounded-full px-8">
                <Link to="/fleet">View Our Fleet</Link>
              </Button>
            </div>
          </motion.div>

          <div className="mt-16 grid gap-4 md:grid-cols-3 lg:max-w-4xl">
            {featuredVehicles.slice(0, 3).map((vehicle) => (
              <div
                key={vehicle.id}
                className="rounded-[28px] border border-white/10 bg-white/8 p-5 backdrop-blur-xl"
              >
                <div className="text-xs uppercase tracking-[0.26em] text-white/55">
                  {vehicle.category}
                </div>
                <div className="mt-2 font-display text-2xl font-bold tracking-[-0.04em]">
                  {vehicle.name}
                </div>
                <div className="mt-3 text-sm text-white/65">{vehicle.heroMetric}</div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="font-semibold text-white">
                    {formatCurrency(vehicle.baseDailyRate)}
                  </div>
                  <Link
                    to={`/fleet/${vehicle.slug}`}
                    className="text-sm font-semibold text-[var(--color-accent)]"
                  >
                    Details
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-12 flex justify-center"
          >
            <ChevronDown className="h-8 w-8 animate-bounce text-white/60" />
          </motion.div>
        </div>
      </section>

      <section className="-mt-14 relative z-10 mx-auto max-w-7xl px-4">
        <div className="rounded-[32px] border border-white/60 bg-white p-6 shadow-[0_24px_100px_rgba(10,22,40,0.12)] md:p-8">
          <SectionHeader
            eyebrow="Quick booking"
            title="Check availability in seconds"
            description="Choose your city, dates, vehicle type, and service mode. We will take you straight to the best matches."
          />
          <div className="mt-8 grid gap-4 lg:grid-cols-[1.1fr_1fr_1fr_1fr_auto]">
            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-gray-500)]">
                Pickup location
              </span>
              <select
                value={pickupCity}
                onChange={(event) => setPickupCity(event.target.value as typeof pickupCity)}
                className="h-14 w-full rounded-2xl border border-[var(--color-gray-200)] bg-[var(--color-gray-100)] px-4 text-[var(--color-primary)] outline-none transition focus:border-[var(--color-accent)]"
              >
                <option value="Lusaka">Lusaka Airport</option>
                <option value="Kitwe">Kitwe</option>
                <option value="Ndola">Ndola</option>
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-gray-500)]">
                Pickup date
              </span>
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={pickupDate}
                onChange={(event) => setPickupDate(event.target.value)}
                className="h-14 w-full rounded-2xl border border-[var(--color-gray-200)] bg-[var(--color-gray-100)] px-4 text-[var(--color-primary)] outline-none transition focus:border-[var(--color-accent)]"
              />
            </label>
            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-gray-500)]">
                Return date
              </span>
              <input
                type="date"
                min={pickupDate || new Date().toISOString().split("T")[0]}
                value={returnDate}
                onChange={(event) => setReturnDate(event.target.value)}
                className="h-14 w-full rounded-2xl border border-[var(--color-gray-200)] bg-[var(--color-gray-100)] px-4 text-[var(--color-primary)] outline-none transition focus:border-[var(--color-accent)]"
              />
            </label>
            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-gray-500)]">
                Vehicle type
              </span>
              <select
                value={vehicleType}
                onChange={(event) => setVehicleType(event.target.value)}
                className="h-14 w-full rounded-2xl border border-[var(--color-gray-200)] bg-[var(--color-gray-100)] px-4 text-[var(--color-primary)] outline-none transition focus:border-[var(--color-accent)]"
              >
                <option value="All">All categories</option>
                <option value="Economy">Economy</option>
                <option value="Saloon">Saloon</option>
                <option value="SUV">SUV</option>
                <option value="Minibus">Minibus</option>
                <option value="Luxury">Luxury</option>
                <option value="Pickup">Pickup</option>
              </select>
            </label>
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-gray-500)]">
                Driver
              </span>
              <div className="flex h-14 items-center justify-between rounded-2xl border border-[var(--color-gray-200)] bg-[var(--color-gray-100)] px-4">
                <span className="text-sm font-medium text-[var(--color-primary)]">
                  {withDriver ? "With chauffeur" : "Self-drive"}
                </span>
                <button
                  type="button"
                  onClick={() => setWithDriver((value) => !value)}
                  className={`relative h-8 w-14 rounded-full transition ${
                    withDriver ? "bg-[var(--color-accent)]" : "bg-[var(--color-gray-300)]"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-6 w-6 rounded-full bg-white transition ${
                      withDriver ? "left-7" : "left-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
          <Button onClick={handleSearch} className="mt-6 h-14 w-full rounded-full md:w-auto">
            Search Available Vehicles
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20">
        <SectionHeader
          eyebrow="Featured fleet"
          title="Vehicles that feel premium before you even step in"
          description="A shortlist of vehicles selected for executive travel, airport movement, events, and self-drive bookings."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {featuredVehicles.map((vehicle) => (
            <div key={vehicle.id}>
              <VehicleCard vehicle={vehicle} />
            </div>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Button asChild variant="secondary" className="rounded-full px-8">
            <Link to="/fleet">View Full Fleet</Link>
          </Button>
        </div>
      </section>

      <section className="bg-[var(--color-primary)] py-20 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeader
            eyebrow="Services"
            title="A service mix built for executive travel, events, and repeat business."
            description="Choose the service that fits your journey and we will match it with the right vehicle, route, and support."
            className="[&>h2]:text-white [&>p]:text-white/70"
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <Link
                key={service.slug}
                to={`/services/${service.slug}`}
                className="rounded-[30px] border border-white/10 bg-[rgba(255,255,255,0.05)] p-6 backdrop-blur transition hover:border-white/20 hover:bg-[rgba(255,255,255,0.08)]"
              >
                <div className="text-xs uppercase tracking-[0.26em] text-[var(--color-accent)]">
                  {service.accentLabel}
                </div>
                <div className="mt-4 font-display text-2xl font-bold tracking-[-0.04em]">
                  {service.title}
                </div>
                <p className="mt-3 text-sm leading-7 text-white/70">
                  {service.description}
                </p>
                <div className="mt-6 inline-flex items-center text-sm font-semibold text-white">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20">
        <SectionHeader
          eyebrow="Why choose Shark"
          title="Trust signals that matter in a premium car hire business."
          description="When timing matters, presentation matters, and plans can change, details decide the journey."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-[28px] border border-[var(--color-gray-200)] bg-white p-6 shadow-[0_18px_60px_rgba(10,22,40,0.06)]"
            >
              <div className="font-display text-4xl font-bold tracking-[-0.05em] text-[var(--color-primary)]">
                {stat.value}
              </div>
              <div className="mt-2 text-sm text-[var(--color-gray-600)]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-4">
          {trustPillars.map((pillar) => (
            <div
              key={pillar.title}
              className="rounded-[28px] border border-[var(--color-gray-200)] bg-white p-6"
            >
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                <pillar.icon className="h-6 w-6" />
              </div>
              <div className="mt-5 font-display text-2xl font-bold tracking-[-0.04em] text-[var(--color-primary)]">
                {pillar.title}
              </div>
              <p className="mt-3 text-sm leading-7 text-[var(--color-gray-600)]">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20">
        <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <div className="rounded-[34px] border border-[var(--color-gray-200)] bg-white p-6 shadow-[0_18px_70px_rgba(10,22,40,0.08)] sm:p-8">
            <SectionHeader
              eyebrow="Testimonials"
              title="Trusted by business teams, event planners, and private clients."
              description="Clients return when the vehicle is ready, the driver is prepared, and the handover is clear."
            />
            <div className="mt-6 flex flex-wrap gap-2">
              {["Corporate teams", "Event planners", "Airport clients"].map((label) => (
                <div
                  key={label}
                  className="rounded-full border border-[var(--color-gray-200)] bg-[var(--color-gray-100)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-gray-500)]"
                >
                  {label}
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-[30px] bg-[linear-gradient(180deg,#f6f8fb,#edf2f9)] p-6">
              <div className="mb-5 flex gap-1 text-[var(--color-gold)]">
                {Array.from({ length: testimonials[activeTestimonial].rating }).map(
                  (_, index) => (
                    <Star key={index} className="h-5 w-5 fill-current" />
                  ),
                )}
              </div>
              <p className="text-lg leading-8 text-[var(--color-primary)]">
                "{testimonials[activeTestimonial].quote}"
              </p>
              <div className="mt-6">
                <div className="font-semibold text-[var(--color-primary)]">
                  {testimonials[activeTestimonial].name}
                </div>
                <div className="text-sm text-[var(--color-gray-600)]">
                  {testimonials[activeTestimonial].role}, {testimonials[activeTestimonial].company}
                </div>
              </div>
              <div className="mt-6 flex gap-2">
                {testimonials.map((testimonial, index) => (
                  <button
                    key={testimonial.id}
                    className={`h-2.5 rounded-full transition ${
                      index === activeTestimonial
                        ? "w-10 bg-[var(--color-accent)]"
                        : "w-2.5 bg-[var(--color-gray-300)]"
                    }`}
                    onClick={() => setActiveTestimonial(index)}
                    aria-label={`Show testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                { value: "5.0/5", label: "Average testimonial rating" },
                { value: "3 Cities", label: "Lusaka, Kitwe, Ndola coverage" },
                { value: "24/7", label: "WhatsApp booking support" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-[24px] border border-[var(--color-gray-200)] bg-[var(--color-gray-100)] px-5 py-4"
                >
                  <div className="font-display text-2xl font-bold tracking-[-0.04em] text-[var(--color-primary)]">
                    {item.value}
                  </div>
                  <div className="mt-1 text-sm text-[var(--color-gray-600)]">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[34px] bg-[linear-gradient(160deg,#081222_0%,#0b1730_55%,#10213d_100%)] text-white shadow-[0_18px_70px_rgba(10,22,40,0.16)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(26,127,212,0.22),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(212,168,90,0.12),transparent_24%)]" />
            <div className="absolute inset-y-0 right-0 hidden w-[34%] border-l border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] xl:block" />
            <div className="relative h-full p-6 sm:p-8">
              <div className="max-w-2xl">
                <div className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/72">
                  Corporate accounts
                </div>
                <h3 className="mt-5 max-w-3xl font-display text-3xl font-bold tracking-[-0.05em] sm:text-4xl xl:text-[3.2rem] xl:leading-[1.02]">
                  Dedicated fleet. Monthly invoicing. Priority service for repeat-use travel.
                </h3>
                <p className="mt-4 max-w-2xl text-base leading-7 text-white/70 sm:text-lg">
                  Open one account for airport transfers, executive travel, site
                  visits, and event transport across Lusaka, Kitwe, and Ndola.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button asChild size="lg" className="rounded-full px-8">
                    <Link to="/contact">Open a Corporate Account</Link>
                  </Button>
                  <Button asChild variant="ghost" size="lg" className="rounded-full px-8">
                    <Link to="/services/corporate">See Corporate Service</Link>
                  </Button>
                </div>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {corporateBenefits.map((benefit) => (
                  <div
                    key={benefit.title}
                    className="rounded-[26px] border border-white/10 bg-white/6 p-5 backdrop-blur"
                  >
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--color-accent)]/16 text-[var(--color-accent)]">
                      <benefit.icon className="h-6 w-6" />
                    </div>
                    <div className="mt-5 text-lg font-semibold text-white">{benefit.title}</div>
                    <p className="mt-2 text-sm leading-7 text-white/68">{benefit.description}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-3">
                {[
                  { value: "3", label: "Operating cities" },
                  { value: "Fast", label: "Repeat-booking turnaround" },
                  { value: "Clear", label: "Monthly account statements" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[24px] border border-white/10 bg-black/16 px-5 py-4"
                  >
                    <div className="font-display text-3xl font-bold tracking-[-0.04em] text-white">
                      {item.value}
                    </div>
                    <div className="mt-1 text-sm text-white/62">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
