import { PageHero } from "@/components/shared/PageHero";

export default function PrivacyPage() {
  return (
    <div className="bg-[var(--color-gray-100)] pb-20">
      <PageHero
        eyebrow="Privacy"
        title="Privacy Policy"
        description="How Shark Car Hire collects, uses, and protects your booking and contact information."
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Privacy Policy" },
        ]}
      />
      <div className="mx-auto max-w-4xl px-4 py-20">
        <div className="space-y-6 rounded-[34px] border border-[var(--color-gray-200)] bg-white p-8 text-[var(--color-gray-600)] shadow-[0_20px_70px_rgba(10,22,40,0.08)]">
          <section>
            <h2 className="font-display text-2xl font-bold text-[var(--color-primary)]">
              Information we collect
            </h2>
            <p className="mt-3">
              We collect the details needed to manage your booking, including your name,
              contact information, identification details, pickup and return information,
              and payment-related records.
            </p>
          </section>
          <section>
            <h2 className="font-display text-2xl font-bold text-[var(--color-primary)]">
              How we use your information
            </h2>
            <p className="mt-3">
              Your information is used to confirm bookings, assign vehicles or drivers,
              contact you about your journey, process payments, and support your account.
            </p>
          </section>
          <section>
            <h2 className="font-display text-2xl font-bold text-[var(--color-primary)]">
              Sharing and retention
            </h2>
            <p className="mt-3">
              We share information only where necessary to deliver the service, meet legal
              obligations, or process payments. Records are retained for booking history,
              service support, and compliance requirements.
            </p>
          </section>
          <section>
            <h2 className="font-display text-2xl font-bold text-[var(--color-primary)]">
              Your choices
            </h2>
            <p className="mt-3">
              You may request an update to your contact details or ask questions about how
              your information is handled by contacting Shark Car Hire directly.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
