import { PageHero } from "@/components/shared/PageHero";

export default function TermsPage() {
  return (
    <div className="bg-[var(--color-gray-100)] pb-20">
      <PageHero
        eyebrow="Terms"
        title="Terms & Conditions"
        description="Key booking terms covering reservations, payments, documents, cancellations, and vehicle handover."
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Terms & Conditions" },
        ]}
      />
      <div className="mx-auto max-w-4xl px-4 py-20">
        <div className="space-y-6 rounded-[34px] border border-[var(--color-gray-200)] bg-white p-8 text-[var(--color-gray-600)] shadow-[0_20px_70px_rgba(10,22,40,0.08)]">
          <section>
            <h2 className="font-display text-2xl font-bold text-[var(--color-primary)]">
              Reservations
            </h2>
            <p className="mt-3">
              All bookings are subject to vehicle availability, confirmed booking details,
              and completion of any required identification or licence checks.
            </p>
          </section>
          <section>
            <h2 className="font-display text-2xl font-bold text-[var(--color-primary)]">
              Payments
            </h2>
            <p className="mt-3">
              Payment terms depend on the booking type, service mode, and account status.
              Corporate clients may be billed on approved account terms.
            </p>
          </section>
          <section>
            <h2 className="font-display text-2xl font-bold text-[var(--color-primary)]">
              Cancellations and changes
            </h2>
            <p className="mt-3">
              Date changes and cancellations depend on timing, vehicle preparation already
              completed, and availability at the time the request is made.
            </p>
          </section>
          <section>
            <h2 className="font-display text-2xl font-bold text-[var(--color-primary)]">
              Vehicle use and handover
            </h2>
            <p className="mt-3">
              Vehicles must be returned in line with the agreed booking terms, mileage
              limits, fuel expectations, and any route or driver conditions confirmed at
              handover.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
