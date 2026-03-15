import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BookingSummaryCard } from "@/pages/booking/BookingSummaryCard";
import { Button } from "@/components/ui/button";
import { calculateBookingTotal, calculateDays, getVehicleById } from "@/lib/booking";
import { formatCurrency } from "@/lib/format";
import { getAvailableExtras, useAppStore } from "@/store/use-app-store";

export default function Step2Extras() {
  const navigate = useNavigate();
  const draft = useAppStore((state) => state.bookingDraft);
  const toggleExtra = useAppStore((state) => state.toggleDraftExtra);
  const availableExtras = getAvailableExtras(draft);
  const vehicle = getVehicleById(draft.vehicleId);
  const days = calculateDays(draft);
  const total = calculateBookingTotal(draft, vehicle);

  return (
    <div className="space-y-6 rounded-[34px] border border-[var(--color-gray-200)] bg-white p-6 shadow-[0_20px_70px_rgba(10,22,40,0.08)] md:p-8">
      <div>
        <div className="text-xs uppercase tracking-[0.26em] text-[var(--color-accent)]">Booking</div>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-[-0.05em] text-[var(--color-primary)]">
          Your Extras
        </h1>
        <p className="mt-3 text-[var(--color-gray-600)]">
          Add the extras you want before you confirm the booking.
        </p>
      </div>

      <BookingSummaryCard />

      <div className="grid gap-4 md:grid-cols-2">
        {availableExtras.map((extra) => {
          const isSelected = draft.extras.includes(extra.id);
          return (
            <button
              key={extra.id}
              type="button"
              onClick={() => toggleExtra(extra.id)}
              className={`rounded-[28px] border p-6 text-left transition ${
                isSelected
                  ? "border-[var(--color-accent)] bg-[var(--color-accent)]/8"
                  : "border-[var(--color-gray-200)] bg-[var(--color-gray-100)] hover:border-[var(--color-gray-300)]"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-display text-2xl font-bold tracking-[-0.04em] text-[var(--color-primary)]">
                    {extra.title}
                  </div>
                  <div className="mt-3 text-sm leading-7 text-[var(--color-gray-600)]">
                    {extra.description}
                  </div>
                </div>
                <div
                  className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] ${
                    isSelected
                      ? "bg-[var(--color-accent)] text-white"
                      : "bg-white text-[var(--color-primary)]"
                  }`}
                >
                  {formatCurrency(extra.price)} {extra.pricing === "daily" ? "/ day" : "flat"}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="rounded-[30px] bg-[var(--color-primary)] p-6 text-white">
        <div className="flex items-center gap-3 text-white/70">
          <ShieldCheck className="h-5 w-5 text-[var(--color-accent)]" />
          <span>{days} day booking | extras are included in your final total.</span>
        </div>
        <div className="mt-6 flex items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.24em] text-white/55">
              Running total
            </div>
            <div className="mt-2 font-display text-4xl font-bold tracking-[-0.05em]">
              {formatCurrency(total)}
            </div>
          </div>
          <div className="text-right text-sm text-white/70">
            Includes base rate, chauffeur if selected, extras, and taxes.
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse justify-between gap-3 sm:flex-row">
        <Button variant="secondary" className="rounded-full" onClick={() => navigate("/book/step-1")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
        <Button className="rounded-full" onClick={() => navigate("/book/step-3")}>
          Continue to Your Details
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
