import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { VehicleCard } from "@/components/fleet/VehicleCard";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Button } from "@/components/ui/button";
import { services, testimonials, vehicles } from "@/data/mock";

const serviceOpenings = {
  "airport-transfers": {
    title: "Flights move. Plans change. Your transfer still needs to be ready.",
    description:
      "Airport transfers depend on timing, contact, and clear pickup handling. This service is built for arrivals and departures that cannot drift.",
  },
  corporate: {
    title: "Executive travel leaves no room for guesswork.",
    description:
      "Corporate hire is about punctuality, presentation, and clear account handling for teams, visitors, and leadership travel.",
  },
  weddings: {
    title: "The day is too important for late arrivals or poor presentation.",
    description:
      "Wedding transport needs calm coordination, polished vehicles, and timing you can trust from the first pickup to the final venue stop.",
  },
  events: {
    title: "Event transport works only when every movement is clear.",
    description:
      "Guest arrivals, speaker schedules, venue changes, and group movement need a vehicle plan that stays organised under pressure.",
  },
  "self-drive": {
    title: "Your route. Your schedule. Your vehicle, ready on time.",
    description:
      "Self-drive hire should be clear, fast, and easy to trust, with the right vehicle, the right documents, and no confusion at handover.",
  },
  "long-term": {
    title: "Long-term mobility should reduce pressure, not create more of it.",
    description:
      "Long-term hire gives companies and projects dependable vehicles without the cost and distraction of ownership.",
  },
} as const;

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const service = services.find((item) => item.slug === slug);

  if (!service) {
    return <Navigate to="/services" replace />;
  }

  const matchingVehicles = vehicles.filter((vehicle) =>
    service.vehicleCategories.includes(vehicle.category),
  );
  const serviceTestimonials = testimonials.filter((testimonial) =>
    service.testimonialIds.includes(testimonial.id),
  );
  const opening = serviceOpenings[service.slug];

  return (
    <div className="bg-[var(--color-gray-100)] pb-20">
      <PageHero
        eyebrow={service.accentLabel}
        title={service.title}
        description={service.tagline}
        image={service.heroImage}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: service.title },
        ]}
      />

      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-10">
            <SectionHeader
              eyebrow="What is included"
              title={opening.title}
              description={opening.description}
            />
            <div className="grid gap-4 md:grid-cols-2">
              {service.includes.map((item) => (
                <div
                  key={item}
                  className="rounded-[28px] border border-[var(--color-gray-200)] bg-white p-5 shadow-[0_18px_60px_rgba(10,22,40,0.06)]"
                >
                  <CheckCircle2 className="h-5 w-5 text-[var(--color-accent)]" />
                  <div className="mt-4 font-semibold text-[var(--color-primary)]">
                    {item}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[34px] border border-[var(--color-gray-200)] bg-white p-8 shadow-[0_20px_70px_rgba(10,22,40,0.08)]">
            <div className="text-xs uppercase tracking-[0.26em] text-[var(--color-accent)]">
              How it works
            </div>
            <div className="mt-6 space-y-6">
              {service.process.map((step, index) => (
                <div key={step} className="flex gap-4">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[var(--color-primary)] text-sm font-semibold text-white">
                    {index + 1}
                  </div>
                  <div className="pt-1 text-[var(--color-gray-600)]">{step}</div>
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-[28px] bg-[var(--color-primary)] p-6 text-white">
              <div className="text-xs uppercase tracking-[0.26em] text-white/55">
                Pricing note
              </div>
              <div className="mt-4 text-lg leading-8">{service.pricingNote}</div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild className="rounded-full">
                  <Link to={service.ctaHref}>{service.primaryCta}</Link>
                </Button>
                <Button asChild variant="ghost" className="rounded-full">
                  <Link to="/contact">Speak to the team</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20">
        <SectionHeader
          eyebrow="Vehicle options"
          title="Vehicles suited to this service"
          description="Choose from the categories that match the route, guest profile, and service level required."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {matchingVehicles.slice(0, 6).map((vehicle) => (
            <div key={vehicle.id}>
              <VehicleCard vehicle={vehicle} />
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-[34px] border border-[var(--color-gray-200)] bg-white p-8 shadow-[0_18px_60px_rgba(10,22,40,0.06)]">
            <SectionHeader
              eyebrow="FAQ"
              title="Questions clients ask before they confirm"
              description="These are the details most clients want clarified before they book this service."
            />
            <div className="mt-8 space-y-4">
              {service.faq.map((item) => (
                <div key={item.question} className="rounded-[26px] bg-[var(--color-gray-100)] p-5">
                  <div className="font-semibold text-[var(--color-primary)]">
                    {item.question}
                  </div>
                  <div className="mt-3 text-sm leading-7 text-[var(--color-gray-600)]">
                    {item.answer}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[34px] border border-[var(--color-gray-200)] bg-white p-8 shadow-[0_18px_60px_rgba(10,22,40,0.06)]">
            <SectionHeader
              eyebrow="Testimonials"
              title="What clients say after the journey"
              description="Recent feedback from clients who booked this service."
            />
            <div className="mt-8 space-y-4">
              {serviceTestimonials.map((testimonial) => (
                <div key={testimonial.id} className="rounded-[26px] bg-[var(--color-gray-100)] p-5">
                  <div className="font-semibold text-[var(--color-primary)]">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-[var(--color-gray-500)]">
                    {testimonial.role}, {testimonial.company}
                  </div>
                  <div className="mt-4 text-sm leading-7 text-[var(--color-gray-600)]">
                    "{testimonial.quote}"
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4">
        <div className="overflow-hidden rounded-[36px] bg-[var(--color-primary)] p-8 text-white shadow-[0_20px_80px_rgba(10,22,40,0.18)]">
          <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">
                Book this service
              </div>
              <h2 className="mt-4 font-display text-4xl font-bold tracking-[-0.05em]">
                Ready to confirm {service.shortTitle.toLowerCase()}?
              </h2>
              <p className="mt-4 max-w-2xl text-white/72">
                Tell us the city, dates, and service details. We will guide you to the
                right vehicle and the next step.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Button asChild className="rounded-full">
                <Link to={service.ctaHref}>
                  {service.primaryCta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="ghost" className="rounded-full">
                <Link to="/fleet">Browse Fleet</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
