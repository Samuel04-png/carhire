import { Clock3, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { offices } from "@/data/mock";

export default function LocationsPage() {
  return (
    <div className="bg-[var(--color-gray-100)] pb-20">
      <PageHero
        eyebrow="Locations"
        title="Lusaka, Kitwe, and Ndola"
        description="Book with the same standard of service across Lusaka, Kitwe, and Ndola."
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Locations" },
        ]}
        image="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80"
      />

      <section className="mx-auto max-w-7xl px-4 py-20">
        <SectionHeader
          eyebrow="Coverage"
          title="Three cities. One clear service standard."
          description="Find the nearest office, call directly, or get directions before your booking or collection."
        />
        <div className="mt-10 space-y-8">
          {offices.map((office) => (
            <div
              key={office.city}
              id={office.city.toLowerCase()}
              className="grid gap-0 overflow-hidden rounded-[34px] border border-[var(--color-gray-200)] bg-white shadow-[0_20px_70px_rgba(10,22,40,0.08)] lg:grid-cols-[0.9fr_1.1fr]"
            >
              <iframe
                title={`${office.city} map`}
                src={office.mapEmbed}
                className="min-h-[320px] w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="p-8">
                <div className="text-xs uppercase tracking-[0.28em] text-[var(--color-accent)]">
                  {office.label}
                </div>
                <h2 className="mt-4 font-display text-4xl font-bold tracking-[-0.05em] text-[var(--color-primary)]">
                  {office.city}
                </h2>
                <p className="mt-4 max-w-xl text-[var(--color-gray-600)]">
                  {office.summary}
                </p>

                <div className="mt-8 grid gap-4 md:grid-cols-3">
                  <div className="rounded-[24px] bg-[var(--color-gray-100)] p-4">
                    <MapPin className="h-5 w-5 text-[var(--color-accent)]" />
                    <div className="mt-3 text-sm text-[var(--color-gray-600)]">
                      {office.address}
                    </div>
                  </div>
                  <div className="rounded-[24px] bg-[var(--color-gray-100)] p-4">
                    <Phone className="h-5 w-5 text-[var(--color-accent)]" />
                    <div className="mt-3 text-sm text-[var(--color-gray-600)]">
                      {office.phone}
                    </div>
                  </div>
                  <div className="rounded-[24px] bg-[var(--color-gray-100)] p-4">
                    <Clock3 className="h-5 w-5 text-[var(--color-accent)]" />
                    <div className="mt-3 text-sm text-[var(--color-gray-600)]">
                      {office.hours}
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <a
                    href={office.directionsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-12 items-center justify-center rounded-full bg-[var(--color-accent)] px-6 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(26,127,212,0.4)]"
                  >
                    Get Directions
                  </a>
                  <a
                    href={`tel:${office.phone.replace(/\s+/g, "")}`}
                    className="inline-flex h-12 items-center justify-center rounded-full border-2 border-[var(--color-accent)] px-6 text-sm font-semibold text-[var(--color-accent)]"
                  >
                    Call This Office
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
