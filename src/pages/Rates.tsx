import { useMemo, useState, type ReactNode } from "react";
import {
  ArrowRight,
  BadgeDollarSign,
  Building2,
  CheckCircle2,
  Clock3,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Button } from "@/components/ui/button";
import { company, services, vehicles } from "@/data/mock";
import {
  pricingAddOns,
  pricingCategoryOrder,
  pricingFaq,
  pricingInclusions,
  pricingPrinciples,
  serviceRateCards,
} from "@/data/showcase";
import { formatCurrency } from "@/lib/format";
import type { City, Vehicle } from "@/types";

const cityOptions: City[] = ["Lusaka", "Kitwe", "Ndola"];

const serviceLabels = new Map(services.map((service) => [service.slug, service.shortTitle]));

function cityRate(vehicle: Vehicle, city: City) {
  return vehicle.cityRates?.[city] ?? vehicle.baseDailyRate;
}

export default function RatesPage() {
  const [selectedCity, setSelectedCity] = useState<City>("Lusaka");

  const categoryCards = useMemo(
    () =>
      pricingCategoryOrder
        .map((category) => {
          const matches = vehicles.filter((vehicle) => vehicle.category === category);
          if (matches.length === 0) return null;

          const leadVehicle = [...matches].sort(
            (left, right) => cityRate(left, selectedCity) - cityRate(right, selectedCity),
          )[0];

          const chauffeurRates = matches
            .filter((vehicle) => vehicle.withDriverAvailable)
            .map((vehicle) => vehicle.chauffeurRate);

          return {
            category,
            leadVehicle,
            dayRate: cityRate(leadVehicle, selectedCity),
            weeklyRate: Math.min(...matches.map((vehicle) => vehicle.weeklyRate)),
            monthlyRate: Math.min(...matches.map((vehicle) => vehicle.monthlyRate)),
            chauffeurRate:
              chauffeurRates.length > 0 ? Math.min(...chauffeurRates) : null,
            cities: Array.from(new Set(matches.flatMap((vehicle) => vehicle.cities))),
            serviceMix: Array.from(
              new Set(
                matches
                  .flatMap((vehicle) => vehicle.services)
                  .map((slug) => serviceLabels.get(slug) ?? slug),
              ),
            ).slice(0, 3),
          };
        })
        .filter((card) => card !== null),
    [selectedCity],
  );

  const summary = useMemo(() => {
    const dayRates = vehicles.map((vehicle) => cityRate(vehicle, selectedCity));
    const monthlyRates = vehicles.map((vehicle) => vehicle.monthlyRate);

    return {
      dayRateFrom: Math.min(...dayRates),
      monthlyFrom: Math.min(...monthlyRates),
      chauffeurFrom: Math.min(
        ...vehicles
          .filter((vehicle) => vehicle.withDriverAvailable)
          .map((vehicle) => vehicle.chauffeurRate),
      ),
    };
  }, [selectedCity]);

  return (
    <div className="bg-[var(--color-gray-100)] pb-20">
      <PageHero
        eyebrow="Rates"
        title="Transparent public pricing for fleet, chauffeur, and repeat-use travel."
        description="Use this page to benchmark daily, weekly, and monthly hire across Shark's public fleet. Final quotes are then confirmed to your exact route, city, and service mode."
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Rates" },
        ]}
        image="https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&w=1600&q=80"
      />

      <section className="relative z-10 mx-auto -mt-10 max-w-7xl px-4">
        <div className="overflow-hidden rounded-[34px] border border-white/60 bg-white shadow-[0_28px_120px_rgba(10,22,40,0.12)]">
          <div className="grid gap-8 p-6 lg:grid-cols-[1.1fr_0.9fr] lg:p-8">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-accent)]/18 bg-[var(--color-accent)]/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--color-accent)]">
                <span className="h-2 w-2 rounded-full bg-[var(--color-accent)]" />
                Planning rates
              </div>
              <h2 className="mt-5 font-display text-3xl font-bold tracking-[-0.05em] text-[var(--color-primary)] sm:text-4xl">
                Check public guide rates by city before you lock the booking.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--color-gray-600)]">
                Daily vehicle rates shift slightly by operating city. Weekly and monthly
                pricing shown below helps clients budget airport transfers, executive
                movement, project travel, and long-term use with fewer surprises.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {cityOptions.map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => setSelectedCity(city)}
                    className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                      selectedCity === city
                        ? "bg-[var(--color-primary)] text-white shadow-[0_16px_40px_rgba(10,22,40,0.18)]"
                        : "border border-[var(--color-gray-200)] bg-[var(--color-gray-100)] text-[var(--color-gray-600)] hover:border-[var(--color-gray-300)]"
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              <StatCard
                label={`From ${selectedCity}`}
                value={formatCurrency(summary.dayRateFrom)}
                note="public day rate"
              />
              <StatCard
                label="Monthly planning"
                value={formatCurrency(summary.monthlyFrom)}
                note="long-term starting point"
              />
              <StatCard
                label="Chauffeur support"
                value={formatCurrency(summary.chauffeurFrom)}
                note="driver surcharge per day"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-20">
        <SectionHeader
          eyebrow="Pricing logic"
          title="How Shark prices public bookings"
          description="The goal is simple: let clients understand the cost structure early, then confirm the final quote against dates, route, and service conditions."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {pricingPrinciples.map((principle) => (
            <div
              key={principle.title}
              className="rounded-[30px] border border-[var(--color-gray-200)] bg-white p-6 shadow-[0_18px_70px_rgba(10,22,40,0.06)]"
            >
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="mt-5 font-display text-2xl font-bold tracking-[-0.04em] text-[var(--color-primary)]">
                {principle.title}
              </div>
              <p className="mt-3 text-sm leading-7 text-[var(--color-gray-600)]">
                {principle.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20">
        <SectionHeader
          eyebrow="Vehicle rates"
          title={`Public fleet rates for ${selectedCity}`}
          description="Choose the category that fits the route, image, and budget. Each card links to a live vehicle detail page so the pricing never floats away from the product."
        />
        <div className="mt-10 grid gap-6 xl:grid-cols-2">
          {categoryCards.map((card) => (
            <article
              key={card.category}
              className="overflow-hidden rounded-[34px] border border-[var(--color-gray-200)] bg-white shadow-[0_22px_80px_rgba(10,22,40,0.08)]"
            >
              <div className="grid gap-0 lg:grid-cols-[0.82fr_1.18fr]">
                <div className="relative min-h-[280px] overflow-hidden">
                  <img
                    src={card.leadVehicle.mainImage}
                    alt={card.leadVehicle.name}
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,22,40,0.08),rgba(10,22,40,0.86))]" />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <div className="inline-flex rounded-full border border-white/12 bg-white/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/82 backdrop-blur">
                      {card.category}
                    </div>
                    <div className="mt-3 font-display text-3xl font-bold tracking-[-0.04em]">
                      {formatCurrency(card.dayRate)}
                    </div>
                    <div className="mt-1 text-sm text-white/72">starting day rate in {selectedCity}</div>
                  </div>
                </div>

                <div className="p-6 sm:p-8">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-gray-500)]">
                    <span>{card.leadVehicle.name}</span>
                    <span className="h-1 w-1 rounded-full bg-[var(--color-gray-300)]" />
                    <span>{card.cities.join(", ")}</span>
                  </div>
                  <p className="mt-4 text-base leading-8 text-[var(--color-gray-600)]">
                    {card.leadVehicle.heroMetric}. {card.leadVehicle.description}
                  </p>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    <RateMetric label="Day" value={formatCurrency(card.dayRate)} />
                    <RateMetric label="Week" value={formatCurrency(card.weeklyRate)} />
                    <RateMetric label="Month" value={formatCurrency(card.monthlyRate)} />
                  </div>

                  <div className="mt-6 grid gap-3 md:grid-cols-2">
                    <InfoPill label="Seats" value={`${card.leadVehicle.seats}`} />
                    <InfoPill label="Transmission" value={card.leadVehicle.transmission} />
                    <InfoPill
                      label="Chauffeur"
                      value={card.chauffeurRate ? `${formatCurrency(card.chauffeurRate)} / day` : "Not offered"}
                    />
                    <InfoPill label="Insurance" value={card.leadVehicle.insuranceIncluded} />
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {card.serviceMix.map((serviceLabel) => (
                      <div
                        key={serviceLabel}
                        className="rounded-full border border-[var(--color-gray-200)] bg-[var(--color-gray-100)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gray-500)]"
                      >
                        {serviceLabel}
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Button asChild className="rounded-full px-7">
                      <Link to={`/fleet/${card.leadVehicle.slug}`}>
                        View {card.leadVehicle.name}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="secondary" className="rounded-full px-7">
                      <Link to="/book/step-1">Start Booking</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4">
        <div className="rounded-[36px] bg-[var(--color-primary)] p-6 text-white shadow-[0_24px_100px_rgba(10,22,40,0.18)] sm:p-8">
          <SectionHeader
            eyebrow="Service models"
            title="Pricing models beyond a simple day rate"
            description="Some services are quoted by route, schedule, or account structure rather than a single public tariff."
            className="text-white"
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {serviceRateCards.map((card) => (
              <div
                key={card.title}
                className="rounded-[28px] border border-white/10 bg-white/8 p-6 backdrop-blur"
              >
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-white/55">
                  {card.title}
                </div>
                <div className="mt-4 font-display text-3xl font-bold tracking-[-0.05em] text-white">
                  {card.priceLabel}
                </div>
                <p className="mt-3 text-sm leading-7 text-white/72">{card.note}</p>
                <Link
                  to={card.href}
                  className="mt-6 inline-flex items-center text-sm font-semibold text-[var(--color-accent)]"
                >
                  {card.ctaLabel}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[34px] border border-[var(--color-gray-200)] bg-white p-6 shadow-[0_18px_70px_rgba(10,22,40,0.06)] sm:p-8">
            <SectionHeader
              eyebrow="Included"
              title="What is normally built into the booking"
              description="Every confirmed booking includes a baseline service layer before any extras are added."
            />
            <div className="mt-8 space-y-4">
              {pricingInclusions.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-[24px] bg-[var(--color-gray-100)] p-4">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[var(--color-accent)]" />
                  <span className="text-[var(--color-gray-600)]">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[34px] border border-[var(--color-gray-200)] bg-white p-6 shadow-[0_18px_70px_rgba(10,22,40,0.06)] sm:p-8">
            <SectionHeader
              eyebrow="Add-ons"
              title="Optional extras priced before checkout"
              description="Useful for airport arrivals, family travel, self-drive protection, and longer road movements."
            />
            <div className="mt-8 space-y-3">
              {pricingAddOns.map((extra) => (
                <div
                  key={extra.title}
                  className="rounded-[24px] border border-[var(--color-gray-200)] bg-[var(--color-gray-100)] p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-semibold text-[var(--color-primary)]">{extra.title}</div>
                      <div className="mt-1 text-sm leading-7 text-[var(--color-gray-600)]">
                        {extra.description}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-2xl font-bold tracking-[-0.04em] text-[var(--color-primary)]">
                        {formatCurrency(extra.price)}
                      </div>
                      <div className="text-xs uppercase tracking-[0.2em] text-[var(--color-gray-500)]">
                        {extra.pricing === "daily" ? "Per day" : "Flat fee"}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4">
        <div className="overflow-hidden rounded-[34px] border border-[var(--color-gray-200)] bg-white shadow-[0_18px_70px_rgba(10,22,40,0.06)]">
          <div className="border-b border-[var(--color-gray-200)] p-6 sm:p-8">
            <SectionHeader
              eyebrow="Comparison table"
              title="Fast rate comparison by category"
              description={`All figures below are public guide rates with ${selectedCity} selected as the current city view.`}
            />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="bg-[var(--color-gray-100)] text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-gray-500)]">
                <tr>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Lead vehicle</th>
                  <th className="px-6 py-4">Day rate</th>
                  <th className="px-6 py-4">Weekly</th>
                  <th className="px-6 py-4">Monthly</th>
                  <th className="px-6 py-4">Chauffeur</th>
                </tr>
              </thead>
              <tbody>
                {categoryCards.map((card) => (
                  <tr key={card.category} className="border-t border-[var(--color-gray-200)] text-sm text-[var(--color-gray-600)]">
                    <td className="px-6 py-4 font-semibold text-[var(--color-primary)]">{card.category}</td>
                    <td className="px-6 py-4">{card.leadVehicle.name}</td>
                    <td className="px-6 py-4">{formatCurrency(card.dayRate)}</td>
                    <td className="px-6 py-4">{formatCurrency(card.weeklyRate)}</td>
                    <td className="px-6 py-4">{formatCurrency(card.monthlyRate)}</td>
                    <td className="px-6 py-4">
                      {card.chauffeurRate ? formatCurrency(card.chauffeurRate) : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="grid gap-6 lg:grid-cols-2">
          {pricingFaq.map((item) => (
            <div
              key={item.question}
              className="rounded-[30px] border border-[var(--color-gray-200)] bg-white p-6 shadow-[0_18px_70px_rgba(10,22,40,0.06)]"
            >
              <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                  <BadgeDollarSign className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-display text-2xl font-bold tracking-[-0.04em] text-[var(--color-primary)]">
                    {item.question}
                  </div>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-gray-600)]">{item.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4">
        <div className="overflow-hidden rounded-[36px] bg-[linear-gradient(150deg,#081222_0%,#0e1f3a_58%,#12345d_100%)] text-white shadow-[0_24px_100px_rgba(10,22,40,0.18)]">
          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/76">
                Ready to price properly?
              </div>
              <h2 className="mt-5 font-display text-4xl font-bold tracking-[-0.05em] sm:text-5xl">
                Send the dates. We will return the right vehicle, route, and confirmed rate.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-white/72">
                Public pricing helps with planning. The booking team then confirms the exact vehicle, city, driver requirement, and extras before payment.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild className="rounded-full px-8">
                  <Link to="/book/step-1">
                    Start Booking
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="ghost" className="rounded-full px-8">
                  <Link to="/contact">Ask For A Quote</Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <ContactCard
                icon={<Building2 className="h-5 w-5" />}
                label="Corporate accounts"
                value="Monthly invoicing, repeat-use pricing, and account handling"
              />
              <ContactCard
                icon={<Clock3 className="h-5 w-5" />}
                label="Fast response"
                value="WhatsApp and phone support for urgent movement and next-day planning"
              />
              <ContactCard
                icon={<Sparkles className="h-5 w-5" />}
                label="Direct booking team"
                value={`${company.phone} and ${company.email}`}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="rounded-[28px] border border-[var(--color-gray-200)] bg-[var(--color-gray-100)] p-5">
      <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-gray-500)]">
        {label}
      </div>
      <div className="mt-3 font-display text-3xl font-bold tracking-[-0.05em] text-[var(--color-primary)]">
        {value}
      </div>
      <div className="mt-1 text-sm text-[var(--color-gray-600)]">{note}</div>
    </div>
  );
}

function RateMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] bg-[var(--color-gray-100)] p-4">
      <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-gray-500)]">
        {label}
      </div>
      <div className="mt-2 text-lg font-semibold text-[var(--color-primary)]">{value}</div>
    </div>
  );
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-[var(--color-gray-200)] px-4 py-3">
      <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-gray-500)]">
        {label}
      </div>
      <div className="mt-1 text-sm font-medium text-[var(--color-primary)]">{value}</div>
    </div>
  );
}

function ContactCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/8 p-5 backdrop-blur">
      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--color-accent)]/16 text-[var(--color-accent)]">
        {icon}
      </div>
      <div className="mt-4 text-sm font-semibold uppercase tracking-[0.2em] text-white/56">{label}</div>
      <div className="mt-2 text-base leading-7 text-white/76">{value}</div>
    </div>
  );
}


