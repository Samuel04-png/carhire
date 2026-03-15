import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { PageHero } from "@/components/shared/PageHero";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { useAppStore } from "@/store/use-app-store";

export default function BookingLookupPage() {
  const bookings = useAppStore((state) => state.bookings);
  const vehicles = useAppStore((state) => state.vehicles);
  const clients = useAppStore((state) => state.clients);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const ref = String(formData.get("ref") || "").trim().toUpperCase();
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const booking = bookings.find((item) => item.ref.toUpperCase() === ref);
    const client = booking ? clients.find((item) => item.id === booking.clientId) : null;

    if (booking && client?.email.toLowerCase() === email) {
      setResult(booking.ref);
      setError("");
      return;
    }

    setResult(null);
    setError("No booking matched that reference and email combination.");
  };

  const booking = result ? bookings.find((item) => item.ref === result) : null;
  const vehicle = booking ? vehicles.find((item) => item.id === booking.vehicleId) : null;

  return (
    <div className="bg-[var(--color-gray-100)] pb-20">
      <PageHero
        eyebrow="Booking Lookup"
        title="Check a booking without logging in"
        description="Enter your booking reference and email address to view your booking details."
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Booking Lookup" },
        ]}
        image="https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1600&q=80"
      />

      <section className="mx-auto max-w-4xl px-4 py-20">
        <div className="rounded-[34px] border border-[var(--color-gray-200)] bg-white p-8 shadow-[0_20px_70px_rgba(10,22,40,0.08)]">
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-gray-500)]">
                Booking reference
              </span>
              <input
                name="ref"
                required
                className="h-14 w-full rounded-2xl border border-[var(--color-gray-200)] bg-[var(--color-gray-100)] px-4 outline-none focus:border-[var(--color-accent)]"
                placeholder="SCH-20260314-0047"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-gray-500)]">
                Email address
              </span>
              <input
                name="email"
                type="email"
                required
                className="h-14 w-full rounded-2xl border border-[var(--color-gray-200)] bg-[var(--color-gray-100)] px-4 outline-none focus:border-[var(--color-accent)]"
                placeholder="mutale.banda@example.com"
              />
            </label>
            <div className="flex items-end">
              <Button type="submit" className="h-14 rounded-full px-8">
                Find Booking
              </Button>
            </div>
          </form>

          {error && <div className="mt-6 text-sm text-[var(--color-error)]">{error}</div>}

          {booking && vehicle && (
            <div className="mt-8 rounded-[28px] bg-[var(--color-gray-100)] p-6">
              <div className="font-display text-3xl font-bold tracking-[-0.04em] text-[var(--color-primary)]">
                {booking.ref}
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div>
                  <div className="text-xs uppercase tracking-[0.24em] text-[var(--color-gray-500)]">
                    Vehicle
                  </div>
                  <div className="mt-2 font-semibold text-[var(--color-primary)]">
                    {vehicle.name}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.24em] text-[var(--color-gray-500)]">
                    Total
                  </div>
                  <div className="mt-2 font-semibold text-[var(--color-primary)]">
                    {formatCurrency(booking.amount)}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.24em] text-[var(--color-gray-500)]">
                    Pickup
                  </div>
                  <div className="mt-2 text-[var(--color-primary)]">
                    {formatDateTime(booking.pickupDateTime)}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.24em] text-[var(--color-gray-500)]">
                    Status
                  </div>
                  <div className="mt-2 text-[var(--color-primary)]">{booking.status}</div>
                </div>
              </div>
              <div className="mt-8">
                <Link to={`/booking/confirmation/${booking.ref}`} className="text-sm font-semibold text-[var(--color-accent)]">
                  Open confirmation page
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

