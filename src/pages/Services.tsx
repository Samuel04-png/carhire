import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Button } from "@/components/ui/button";
import { services, vehicles } from "@/data/mock";

export default function ServicesPage() {
  return (
    <div className="bg-[var(--color-gray-100)] pb-20">
      <PageHero
        eyebrow="Services"
        title="Car hire services for airport, corporate, wedding, event, self-drive, and long-term needs."
        description="Choose the service that fits your journey and we will match it with the right vehicle, timing, and support."
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Services" },
        ]}
        image="https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1600&q=80"
      />

      <section className="mx-auto max-w-7xl px-4 py-20">
        <SectionHeader
          eyebrow="Offerings"
          title="Six services. One standard."
          description="From executive arrivals to project mobility, every service is run with clear timing, prepared vehicles, and direct communication."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {services.map((service) => {
            const matchingVehicles = vehicles.filter((vehicle) =>
              service.vehicleCategories.includes(vehicle.category),
            );

            return (
              <div
                key={service.slug}
                className="overflow-hidden rounded-[34px] border border-[var(--color-gray-200)] bg-white shadow-[0_20px_70px_rgba(10,22,40,0.08)]"
              >
                <div className="grid gap-0 md:grid-cols-[0.9fr_1.1fr]">
                  <img
                    src={service.heroImage}
                    alt={service.title}
                    className="h-full min-h-[260px] w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="p-8">
                    <div className="text-xs uppercase tracking-[0.26em] text-[var(--color-accent)]">
                      {service.accentLabel}
                    </div>
                    <h2 className="mt-4 font-display text-3xl font-bold tracking-[-0.05em] text-[var(--color-primary)]">
                      {service.title}
                    </h2>
                    <p className="mt-4 text-sm leading-7 text-[var(--color-gray-600)]">
                      {service.description}
                    </p>
                    <div className="mt-6 space-y-3 text-sm text-[var(--color-primary)]">
                      {service.includes.slice(0, 3).map((item) => (
                        <div key={item}>{item}</div>
                      ))}
                    </div>
                    <div className="mt-6 rounded-[24px] bg-[var(--color-gray-100)] p-4">
                      <div className="text-xs uppercase tracking-[0.22em] text-[var(--color-gray-500)]">
                        Matching categories
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {service.vehicleCategories.map((category) => (
                          <span
                            key={category}
                            className="rounded-full border border-[var(--color-gray-200)] bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)]"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                      <div className="mt-4 text-sm text-[var(--color-gray-600)]">
                        {matchingVehicles.length} vehicles suited to this service.
                      </div>
                    </div>
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                      <Button asChild className="rounded-full">
                        <Link to={`/services/${service.slug}`}>
                          Explore Service
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                      <Button asChild variant="secondary" className="rounded-full">
                        <Link to={service.ctaHref}>{service.primaryCta}</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
