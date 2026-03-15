import { Award, Building2, ShieldCheck, Users2 } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { company, services, vehicles } from "@/data/mock";

const values = [
  {
    icon: ShieldCheck,
    title: "On Time, Every Time",
    description:
      "Punctuality is part of the service. Your vehicle and driver are prepared for the time you booked.",
  },
  {
    icon: Users2,
    title: "Prepared Before You Ask",
    description:
      "Flight details, collection points, and special instructions are confirmed before the journey begins.",
  },
  {
    icon: Building2,
    title: "Zambian Roads, Global Standards",
    description:
      "We know Lusaka, Kitwe, and Ndola well, and we hold every booking to a premium service standard.",
  },
  {
    icon: Award,
    title: "People Behind The Journey",
    description:
      "Technology makes booking faster. A disciplined team keeps the journey calm, clear, and professional.",
  },
];

export default function AboutPage() {
  const yearsInOperation = new Date().getFullYear() - company.founded;

  return (
    <div className="bg-[var(--color-gray-100)] pb-20">
      <PageHero
        eyebrow="About Shark"
        title="A Zambian car hire team built around punctuality, presentation, and trust."
        description={`Founded in ${company.founded}, Shark Car Hire serves Lusaka, Kitwe, and Ndola with premium vehicles, confirmed drivers, and direct support for every booking.`}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "About" },
        ]}
        image="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80"
      />

      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-[34px] border border-[var(--color-gray-200)] bg-white p-8 shadow-[0_20px_70px_rgba(10,22,40,0.08)]">
            <SectionHeader
              eyebrow="The story"
              title="Why clients trust Shark Car Hire with important journeys."
              description="When timing matters and presentation matters, clients need more than a vehicle. They need a team that is prepared before the journey starts."
            />
            <div className="mt-8 space-y-5 text-[var(--color-gray-600)]">
              <p>
                Shark Car Hire was built for travellers, companies, event planners, and
                families who cannot afford guesswork on the day of travel. Every booking
                is handled with clear timing, prepared vehicles, and direct communication.
              </p>
              <p>
                From airport arrivals and executive movement to wedding cars and long-term
                fleet support, the standard stays the same across Lusaka, Kitwe, and Ndola:
                clean vehicles, confirmed routes, and people who respect your schedule.
              </p>
              <p>
                The business has grown by staying dependable. Clients return because the
                handover is clear, the driver is ready, and the journey feels organised from
                first contact to final return.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              [String(vehicles.length), "Vehicles in the current fleet"],
              [String(yearsInOperation), "Years in operation"],
              ["3", "Cities served"],
              [String(services.length), "Core service lines"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-[30px] border border-[var(--color-gray-200)] bg-white p-6 shadow-[0_18px_60px_rgba(10,22,40,0.06)]"
              >
                <div className="font-display text-4xl font-bold tracking-[-0.05em] text-[var(--color-primary)]">
                  {value}
                </div>
                <div className="mt-2 text-sm text-[var(--color-gray-600)]">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4">
        <SectionHeader
          eyebrow="Values"
          title="The standards we protect on every booking."
          description="These are the working standards clients feel when the vehicle arrives, the driver calls, and the journey begins."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {values.map((value) => (
            <div
              key={value.title}
              className="rounded-[30px] border border-[var(--color-gray-200)] bg-white p-6 shadow-[0_18px_60px_rgba(10,22,40,0.06)]"
            >
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                <value.icon className="h-6 w-6" />
              </div>
              <div className="mt-5 font-display text-2xl font-bold tracking-[-0.04em] text-[var(--color-primary)]">
                {value.title}
              </div>
              <p className="mt-4 text-sm leading-7 text-[var(--color-gray-600)]">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
