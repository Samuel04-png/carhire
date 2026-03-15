import { FormEvent, useMemo, useState } from "react";
import { ArrowLeft, Building2, CreditCard, Smartphone } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { bookingExtras } from "@/data/mock";
import { calculateBookingTotal, calculateDays, getVehicleById } from "@/lib/booking";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { CompactBookingMeta } from "@/pages/booking/BookingSummaryCard";
import { useAppStore } from "@/store/use-app-store";
import type { PaymentMethod } from "@/types";

const paymentOptions: Array<{
  method: PaymentMethod;
  icon: typeof Smartphone;
  note: string;
}> = [
  {
    method: "MTN Mobile Money",
    icon: Smartphone,
    note: "Primary mobile payment route for most local bookings.",
  },
  {
    method: "Airtel Money",
    icon: Smartphone,
    note: "Secondary mobile money option for fast client checkout.",
  },
  {
    method: "Bank Transfer",
    icon: Building2,
    note: "Marks the booking as pending payment until finance confirms receipt.",
  },
  {
    method: "Credit / Debit Card",
    icon: CreditCard,
    note: "Use when card payment is preferred for remote or international clients.",
  },
  {
    method: "Pay on Pickup",
    icon: Building2,
    note: "Reserved for verified corporate accounts.",
  },
];

export default function Step4Review() {
  const navigate = useNavigate();
  const draft = useAppStore((state) => state.bookingDraft);
  const updateDraft = useAppStore((state) => state.updateDraft);
  const submitBooking = useAppStore((state) => state.submitBooking);
  const customers = useAppStore((state) => state.clients);
  const customerSessionId = useAppStore((state) => state.customerSessionId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const vehicle = getVehicleById(draft.vehicleId);
  const activeCustomer = customers.find((item) => item.id === customerSessionId);
  const isCorporate = activeCustomer?.accountType === "Corporate";
  const days = calculateDays(draft);
  const total = calculateBookingTotal(draft, vehicle);
  const extras = bookingExtras.filter((extra) => draft.extras.includes(extra.id));
  const base = vehicle ? vehicle.baseDailyRate * days : 0;
  const chauffeur = vehicle && draft.withDriver ? vehicle.chauffeurRate * days : 0;
  const extraTotal = extras.reduce(
    (sum, extra) => sum + (extra.pricing === "daily" ? extra.price * days : extra.price),
    0,
  );
  const taxes = total - base - chauffeur - extraTotal;

  const isValidPaymentMethod = useMemo(() => {
    if (draft.paymentMethod === "Pay on Pickup") return isCorporate;
    return true;
  }, [draft.paymentMethod, isCorporate]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!agreed || !isValidPaymentMethod || !vehicle) return;
    setIsSubmitting(true);
    window.setTimeout(() => {
      const { ref } = submitBooking();
      navigate(`/booking/confirmation/${ref}`);
    }, 700);
  };

  if (!vehicle) {
    return <Navigate to="/book/step-1" replace />;
  }

  return (
    <div className="space-y-6 rounded-[34px] border border-[var(--color-gray-200)] bg-white p-6 shadow-[0_20px_70px_rgba(10,22,40,0.08)] md:p-8">
      <div>
        <div className="text-xs uppercase tracking-[0.26em] text-[var(--color-accent)]">Booking</div>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-[-0.05em] text-[var(--color-primary)]">
          Review & Confirm
        </h1>
        <p className="mt-3 text-[var(--color-gray-600)]">
          Check the journey, payment method, and total before you confirm your booking.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <div className="rounded-[28px] bg-[var(--color-gray-100)] p-6">
            <CompactBookingMeta />
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <SummaryBlock
                label="Pickup"
                value={formatDateTime(`${draft.pickupDate}T${draft.pickupTime}:00`)}
                sub={draft.customAddress || draft.pickupLocation}
              />
              <SummaryBlock
                label="Return"
                value={formatDateTime(`${draft.returnDate}T${draft.returnTime}:00`)}
                sub={`${days} day${days > 1 ? "s" : ""}`}
              />
              <SummaryBlock
                label="Customer"
                value={`${draft.customer.firstName} ${draft.customer.lastName}`}
                sub={`${draft.customer.countryCode} ${draft.customer.phone}`}
              />
              <SummaryBlock
                label="Trip mode"
                value={draft.withDriver ? "With Chauffeur" : "Self-Drive"}
                sub={draft.flightNumber ? `Flight ${draft.flightNumber}` : "No flight data"}
              />
            </div>
          </div>

          <div className="rounded-[28px] bg-[var(--color-gray-100)] p-6">
            <div className="text-xs uppercase tracking-[0.24em] text-[var(--color-gray-500)]">
              Payment method
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {paymentOptions.map((option) => {
                const selected = draft.paymentMethod === option.method;
                const disabled = option.method === "Pay on Pickup" && !isCorporate;
                return (
                  <button
                    key={option.method}
                    type="button"
                    disabled={disabled}
                    onClick={() =>
                      updateDraft({
                        paymentMethod: option.method,
                      })
                    }
                    className={`rounded-[26px] border p-5 text-left transition ${
                      selected
                        ? "border-[var(--color-accent)] bg-[var(--color-accent)]/8"
                        : "border-[var(--color-gray-200)] bg-white"
                    } ${disabled ? "cursor-not-allowed opacity-45" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--color-gray-100)] text-[var(--color-accent)]">
                        <option.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-[var(--color-primary)]">
                          {option.method}
                        </div>
                        <div className="mt-1 text-sm text-[var(--color-gray-600)]">
                          {option.note}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            {!isCorporate && draft.paymentMethod === "Pay on Pickup" && (
              <div className="mt-4 text-sm text-[var(--color-error)]">
                Pay on Pickup is reserved for verified corporate accounts.
              </div>
            )}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-[30px] bg-[var(--color-primary)] p-6 text-white shadow-[0_20px_70px_rgba(10,22,40,0.18)]"
        >
          <div className="text-xs uppercase tracking-[0.26em] text-[var(--color-accent)]">
            Price breakdown
          </div>
          <div className="mt-6 space-y-4 text-sm">
            <Row label={`Base hire (${days} days)`} value={formatCurrency(base)} />
            {draft.withDriver && (
              <Row label="Chauffeur service" value={formatCurrency(chauffeur)} />
            )}
            {extras.map((extra) => (
              <div key={extra.id}>
                <Row
                  label={extra.title}
                  value={formatCurrency(
                    extra.pricing === "daily" ? extra.price * days : extra.price,
                  )}
                />
              </div>
            ))}
            <Row label="Taxes & fees" value={formatCurrency(taxes)} />
          </div>
          <div className="mt-6 border-t border-white/10 pt-6">
            <div className="flex items-end justify-between">
              <div className="text-white/60">Grand total</div>
              <div className="font-display text-4xl font-bold tracking-[-0.05em]">
                {formatCurrency(total)}
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-[24px] bg-white/6 p-4 text-sm leading-7 text-white/72">
            Free cancellation up to 48 hours before pickup. Later cancellations may
            attract a service charge depending on preparation already completed.
          </div>

          <label className="mt-6 flex items-start gap-4 rounded-[24px] border border-white/10 bg-white/6 p-4">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(event) => setAgreed(event.target.checked)}
              className="mt-1 h-5 w-5 rounded border-white/20 text-[var(--color-accent)]"
            />
            <span className="text-sm text-white/72">
              I agree to the booking terms, cancellation policy, and payment handling
              rules for this reservation.
            </span>
          </label>

          <Button
            type="submit"
            className="mt-6 h-14 w-full rounded-full"
            disabled={!agreed || !isValidPaymentMethod || isSubmitting}
          >
            {isSubmitting ? "Confirming..." : "Confirm My Booking"}
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="mt-3 h-14 w-full rounded-full"
            onClick={() => navigate("/book/step-3")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </form>
      </div>
    </div>
  );
}

function SummaryBlock({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-[22px] bg-white p-4">
      <div className="text-xs uppercase tracking-[0.24em] text-[var(--color-gray-500)]">
        {label}
      </div>
      <div className="mt-2 font-semibold text-[var(--color-primary)]">{value}</div>
      <div className="mt-1 text-sm text-[var(--color-gray-600)]">{sub}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 text-white/72">
      <div>{label}</div>
      <div className="font-semibold text-white">{value}</div>
    </div>
  );
}
