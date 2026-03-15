import { useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import ManualPaymentSection from "@/components/booking/ManualPaymentSection";
import { getApiUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { bookingExtras } from "@/data/mock";
import { calculateBookingTotal, calculateDays, getVehicleById } from "@/lib/booking";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { CompactBookingMeta } from "@/pages/booking/BookingSummaryCard";
import { useAppStore } from "@/store/use-app-store";
import type { PaymentMethod } from "@/types";

export default function Step4Review() {
  const navigate = useNavigate();
  const draft = useAppStore((state) => state.bookingDraft);
  const updateDraft = useAppStore((state) => state.updateDraft);
  const submitBooking = useAppStore((state) => state.submitBooking);
  const customers = useAppStore((state) => state.clients);
  const customerSessionId = useAppStore((state) => state.customerSessionId);

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

  const customerName = useMemo(() => {
    const fullName = `${draft.customer.firstName} ${draft.customer.lastName}`.trim();
    return fullName || activeCustomer?.firstName || "Shark Car Hire client";
  }, [activeCustomer?.firstName, draft.customer.firstName, draft.customer.lastName]);

  const bookingRefPreview = useMemo(() => {
    const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const suffix = Math.floor(1000 + Math.random() * 8999);
    return `SCH-${stamp}-${suffix}`;
  }, []);

  const handlePaymentConfirmed = async (method: string) => {
    if (method === "MTN Mobile Money") {
      const phoneNumber = `${draft.customer.countryCode}${draft.customer.phone}`.replace(/\s+/g, "");
      const response = await fetch(getApiUrl("/api/payments/momo"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: total,
          phoneNumber,
          bookingRef: bookingRefPreview,
          customerName,
        }),
      });

      const payload = (await response.json()) as {
        success?: boolean;
        error?: string;
        message?: string;
        referenceId?: string;
        status?: string;
      };

      if (!response.ok || !payload.success || !payload.referenceId) {
        throw new Error(payload.error || "Payment request failed");
      }

      const { ref } = submitBooking({
        referenceOverride: bookingRefPreview,
        paymentReferenceId: payload.referenceId,
      });
      navigate(`/booking/confirmation/${ref}`);
      return;
    }

    window.setTimeout(() => {
      const { ref } = submitBooking({
        referenceOverride: bookingRefPreview,
      });
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
          Check the journey, review the total, and follow the manual payment instructions below.
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
                value={customerName}
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
              Payment
            </div>
            <div className="mt-3 text-sm leading-7 text-[var(--color-gray-600)]">
              Use MTN for an instant mobile prompt, or follow the manual instructions for Airtel, Zamtel, bank transfer, and corporate billing. Use <span className="font-semibold text-[var(--color-primary)]">{bookingRefPreview}</span> as the payment reference whenever a manual reference is required.
            </div>
            {!isCorporate && (
              <div className="mt-4 rounded-[22px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
                Pay on Pickup is intended for verified corporate accounts. If you choose it, our team will still confirm account eligibility manually before release.
              </div>
            )}
            <div className="mt-6">
              <ManualPaymentSection
                amount={total}
                bookingRef={bookingRefPreview}
                customerName={customerName}
                onPaymentMethodSelected={(method) => {
                  const paymentMethod = method as PaymentMethod;
                  const mobileMoneyNetwork =
                    paymentMethod === "MTN Mobile Money"
                      ? "MTN"
                      : paymentMethod === "Airtel Money"
                        ? "Airtel"
                        : paymentMethod === "Zamtel Money"
                          ? "Zamtel"
                          : draft.mobileMoneyNetwork;

                  updateDraft({ paymentMethod, mobileMoneyNetwork });
                }}
                onPaymentConfirmed={handlePaymentConfirmed}
              />
            </div>
          </div>
        </div>

        <div className="rounded-[30px] bg-[var(--color-primary)] p-6 text-white shadow-[0_20px_70px_rgba(10,22,40,0.18)]">
          <div className="text-xs uppercase tracking-[0.26em] text-[var(--color-accent)]">
            Price breakdown
          </div>
          <div className="mt-6 space-y-4 text-sm">
            <Row label={`Base hire (${days} days)`} value={formatCurrency(base)} />
            {draft.withDriver && <Row label="Chauffeur service" value={formatCurrency(chauffeur)} />}
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
            Your booking will remain in a pending review state until our team verifies payment or confirms your corporate account billing terms.
          </div>

          <div className="mt-4 rounded-[24px] bg-white/6 p-4 text-sm leading-7 text-white/72">
            Free cancellation up to 48 hours before pickup. Later cancellations may attract a service charge depending on preparation already completed.
          </div>

          <Button
            type="button"
            variant="ghost"
            className="mt-6 h-14 w-full rounded-full"
            onClick={() => navigate("/book/step-3")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
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
