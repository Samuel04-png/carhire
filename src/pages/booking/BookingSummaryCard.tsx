import { CarFront, MapPin } from "lucide-react";
import { getVehicleById } from "@/lib/booking";
import { formatCurrency } from "@/lib/format";
import { useAppStore } from "@/store/use-app-store";

export function BookingSummaryCard() {
  const draft = useAppStore((state) => state.bookingDraft);
  const vehicle = getVehicleById(draft.vehicleId);

  if (!vehicle) {
    return null;
  }

  return (
    <div className="rounded-[28px] border border-[var(--color-gray-200)] bg-[var(--color-gray-100)] p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <img
          src={vehicle.mainImage}
          alt={vehicle.name}
          className="h-24 w-full rounded-2xl object-cover sm:w-36"
          referrerPolicy="no-referrer"
        />
        <div className="flex-1">
          <div className="text-xs uppercase tracking-[0.24em] text-[var(--color-gray-500)]">
            Selected vehicle
          </div>
          <div className="mt-2 font-display text-2xl font-bold tracking-[-0.04em] text-[var(--color-primary)]">
            {vehicle.name}
          </div>
          <div className="mt-2 flex flex-wrap gap-3 text-sm text-[var(--color-gray-600)]">
            <span>{vehicle.category}</span>
            <span>{vehicle.transmission}</span>
            <span>{vehicle.seats} seats</span>
          </div>
          {draft.pickupLocation && (
            <div className="mt-3 inline-flex items-center gap-2 text-sm text-[var(--color-gray-600)]">
              <MapPin className="h-4 w-4 text-[var(--color-accent)]" />
              {draft.customAddress || draft.pickupLocation}
            </div>
          )}
        </div>
        <div className="rounded-[24px] bg-white px-4 py-3 text-right shadow-sm">
          <div className="text-xs uppercase tracking-[0.24em] text-[var(--color-gray-500)]">
            From
          </div>
          <div className="mt-1 font-display text-2xl font-bold tracking-[-0.04em] text-[var(--color-primary)]">
            {formatCurrency(vehicle.baseDailyRate)}
          </div>
          <div className="text-xs text-[var(--color-gray-500)]">per day</div>
        </div>
      </div>
    </div>
  );
}

export function CompactBookingMeta() {
  const draft = useAppStore((state) => state.bookingDraft);
  const vehicle = getVehicleById(draft.vehicleId);

  if (!vehicle) {
    return null;
  }

  return (
    <div className="flex items-center gap-3 rounded-[24px] bg-[var(--color-gray-100)] p-4">
      <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-[var(--color-accent)]">
        <CarFront className="h-5 w-5" />
      </div>
      <div>
        <div className="font-semibold text-[var(--color-primary)]">{vehicle.name}</div>
        <div className="text-sm text-[var(--color-gray-600)]">
          {vehicle.category} • {formatCurrency(vehicle.baseDailyRate)} / day
        </div>
      </div>
    </div>
  );
}
