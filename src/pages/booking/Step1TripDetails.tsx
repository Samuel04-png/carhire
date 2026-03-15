import type { ReactNode } from "react";
import { ChangeEvent, FormEvent, useMemo } from "react";
import { ArrowRight, Plane } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BookingSummaryCard } from "@/pages/booking/BookingSummaryCard";
import { Button } from "@/components/ui/button";
import { calculateBookingTotal, calculateDays, validateTripDetails } from "@/lib/booking";
import { formatCurrency } from "@/lib/format";
import { useAppStore } from "@/store/use-app-store";

export default function Step1TripDetails() {
  const navigate = useNavigate();
  const draft = useAppStore((state) => state.bookingDraft);
  const updateDraft = useAppStore((state) => state.updateDraft);
  const vehicle = useAppStore((state) =>
    state.vehicles.find((item) => item.id === state.bookingDraft.vehicleId),
  );

  const validation = validateTripDetails(draft);
  const days = calculateDays(draft);
  const estimatedTotal = calculateBookingTotal(draft, vehicle);
  const isAirport = draft.pickupLocation.toLowerCase().includes("airport");

  const priceLabel = useMemo(() => {
    if (!vehicle || !days) return "Choose dates to calculate total";
    return `${days} day${days > 1 ? "s" : ""} | ${formatCurrency(estimatedTotal)}`;
  }, [vehicle, days, estimatedTotal]);

  const handleLocationChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    updateDraft({
      pickupLocation: value === "Custom Address" ? "" : value,
      customAddress: value === "Custom Address" ? draft.customAddress : "",
    });
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!validation.valid) return;
    navigate("/book/step-2");
  };

  return (
    <div className="space-y-6 rounded-[34px] border border-[var(--color-gray-200)] bg-white p-6 shadow-[0_20px_70px_rgba(10,22,40,0.08)] md:p-8">
      <div>
        <div className="text-xs uppercase tracking-[0.26em] text-[var(--color-accent)]">Booking</div>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-[-0.05em] text-[var(--color-primary)]">
          Your Trip Details
        </h1>
        <p className="mt-3 text-[var(--color-gray-600)]">
          Choose where and when we should meet you, then continue to the next step.
        </p>
      </div>

      <BookingSummaryCard />

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Pickup location">
            <select
              value={draft.customAddress ? "Custom Address" : draft.pickupLocation}
              onChange={handleLocationChange}
              className={inputClassName}
            >
              <option>Kenneth Kaunda International Airport</option>
              <option>Lusaka CBD Pickup</option>
              <option>Kitwe City Pickup</option>
              <option>Ndola City Pickup</option>
              <option>Custom Address</option>
            </select>
          </Field>
          <Field label="City">
            <select
              value={draft.pickupCity}
              onChange={(event) =>
                updateDraft({
                  pickupCity: event.target.value as typeof draft.pickupCity,
                })
              }
              className={inputClassName}
            >
              <option value="Lusaka">Lusaka</option>
              <option value="Kitwe">Kitwe</option>
              <option value="Ndola">Ndola</option>
            </select>
          </Field>
          {draft.pickupLocation === "" && (
            <div className="md:col-span-2">
              <Field label="Custom address">
                <input
                  value={draft.customAddress}
                  onChange={(event) => updateDraft({ customAddress: event.target.value })}
                  className={inputClassName}
                  placeholder="Hotel, office, or street address"
                />
              </Field>
            </div>
          )}
        </div>

        {isAirport && (
          <div className="grid gap-4 rounded-[28px] bg-[var(--color-gray-100)] p-5 md:grid-cols-2">
            <Field label="Flight number">
              <div className="relative">
                <Plane className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-gray-500)]" />
                <input
                  value={draft.flightNumber}
                  onChange={(event) => updateDraft({ flightNumber: event.target.value })}
                  className={`${inputClassName} pl-11`}
                  placeholder="e.g. ET877"
                />
              </div>
            </Field>
            <Field label="Trip type">
              <div className="grid grid-cols-2 gap-3">
                {["Arrival", "Departure"].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => updateDraft({ tripType: option as "Arrival" | "Departure" })}
                    className={`rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                      draft.tripType === option
                        ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                        : "border-[var(--color-gray-200)] bg-white text-[var(--color-gray-600)]"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </Field>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-4 rounded-[28px] bg-[var(--color-gray-100)] p-5">
            <div className="text-xs uppercase tracking-[0.24em] text-[var(--color-gray-500)]">
              Pickup
            </div>
            <Field label="Date">
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={draft.pickupDate}
                onChange={(event) => updateDraft({ pickupDate: event.target.value })}
                className={inputClassName}
              />
            </Field>
            <Field label="Time">
              <input
                type="time"
                value={draft.pickupTime}
                onChange={(event) => updateDraft({ pickupTime: event.target.value })}
                className={inputClassName}
              />
            </Field>
          </div>

          <div className="space-y-4 rounded-[28px] bg-[var(--color-gray-100)] p-5">
            <div className="text-xs uppercase tracking-[0.24em] text-[var(--color-gray-500)]">
              Return
            </div>
            <Field label="Date">
              <input
                type="date"
                min={draft.pickupDate || new Date().toISOString().split("T")[0]}
                value={draft.returnDate}
                onChange={(event) => updateDraft({ returnDate: event.target.value })}
                className={inputClassName}
              />
            </Field>
            <Field label="Time">
              <input
                type="time"
                value={draft.returnTime}
                onChange={(event) => updateDraft({ returnTime: event.target.value })}
                className={inputClassName}
              />
            </Field>
          </div>
        </div>

        <button
          type="button"
          onClick={() => updateDraft({ withDriver: !draft.withDriver })}
          className="flex w-full items-center justify-between rounded-[28px] border border-[var(--color-gray-200)] bg-[var(--color-gray-100)] p-5"
        >
          <div>
            <div className="font-semibold text-[var(--color-primary)]">
              {draft.withDriver ? "With Chauffeur" : "Self-Drive"}
            </div>
            <div className="mt-1 text-sm text-[var(--color-gray-600)]">
              {priceLabel}
            </div>
          </div>
          <div
            className={`relative h-8 w-14 rounded-full ${
              draft.withDriver ? "bg-[var(--color-accent)]" : "bg-[var(--color-gray-300)]"
            }`}
          >
            <span
              className={`absolute top-1 h-6 w-6 rounded-full bg-white transition ${
                draft.withDriver ? "left-7" : "left-1"
              }`}
            />
          </div>
        </button>

        {!validation.valid && (
          <div className="rounded-[24px] border border-[var(--color-error)]/20 bg-[var(--color-error)]/8 px-4 py-3 text-sm text-[var(--color-error)]">
            {validation.message}
          </div>
        )}

        <div className="flex justify-end">
          <Button type="submit" className="rounded-full px-8" disabled={!validation.valid}>
            Continue to Extras
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-gray-500)]">
        {label}
      </div>
      {children}
    </label>
  );
}

const inputClassName =
  "h-14 w-full rounded-2xl border border-[var(--color-gray-200)] bg-white px-4 outline-none focus:border-[var(--color-accent)]";
