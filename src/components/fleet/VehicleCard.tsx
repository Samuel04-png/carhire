import { Link } from "react-router-dom";
import { ArrowRight, Settings2, Snowflake, Star, Users2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatCurrency } from "@/lib/format";
import type { Vehicle } from "@/types";

type Props = {
  vehicle: Vehicle;
};

export function VehicleCard({ vehicle }: Props) {
  const badgeTone =
    vehicle.status === "Available"
      ? "success"
      : vehicle.status === "Maintenance"
        ? "warning"
        : vehicle.status === "On Request"
          ? "info"
          : "neutral";

  return (
    <article className="group overflow-hidden rounded-xl border border-[var(--color-gray-200)] bg-white shadow-sm transition-shadow duration-200 hover:shadow-md">
      <div className="relative h-56 overflow-hidden bg-[var(--color-gray-100)]">
        <img
          src={vehicle.mainImage}
          alt={vehicle.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,31,53,0.02),rgba(8,31,53,0.68))]" />
        <div className="absolute left-4 right-4 top-4 flex items-center justify-between gap-3">
          <StatusBadge tone={badgeTone}>{vehicle.status}</StatusBadge>
          <div className="inline-flex items-center gap-1 rounded-md bg-white/92 px-2.5 py-1 text-xs font-semibold text-[var(--color-primary)]">
            <Star className="h-3.5 w-3.5 fill-[var(--color-gold)] text-[var(--color-gold)]" />
            {vehicle.rating.toFixed(1)}
          </div>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-md border border-white/20 bg-white/12 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur">
              {vehicle.category}
            </span>
          </div>
          <h3 className="font-display text-xl font-semibold tracking-[-0.025em] text-white">
            {vehicle.name}
          </h3>
          <p className="mt-1 text-sm text-white/78">{vehicle.heroMetric}</p>
        </div>
      </div>

      <div className="space-y-5 p-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-gray-500)]">
              From
            </p>
            <p className="font-display text-2xl font-semibold tracking-[-0.03em] text-[var(--color-primary)]">
              {formatCurrency(vehicle.baseDailyRate)}
            </p>
          </div>
          <p className="text-sm font-medium text-[var(--color-gray-500)]">per day</p>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          <div className="rounded-lg bg-[var(--color-gray-100)] p-3 text-center text-[var(--color-gray-600)]">
            <Users2 className="mx-auto mb-2 h-4 w-4 text-[var(--color-accent)]" />
            <div className="text-[11px] font-semibold uppercase tracking-[0.12em]">Seats</div>
            <div className="mt-1 text-sm font-semibold text-[var(--color-primary)]">
              {vehicle.seats}
            </div>
          </div>
          <div className="rounded-lg bg-[var(--color-gray-100)] p-3 text-center text-[var(--color-gray-600)]">
            <Settings2 className="mx-auto mb-2 h-4 w-4 text-[var(--color-accent)]" />
            <div className="text-[11px] font-semibold uppercase tracking-[0.12em]">Gearbox</div>
            <div className="mt-1 text-sm font-semibold text-[var(--color-primary)]">
              {vehicle.transmission}
            </div>
          </div>
          <div className="rounded-lg bg-[var(--color-gray-100)] p-3 text-center text-[var(--color-gray-600)]">
            <Snowflake className="mx-auto mb-2 h-4 w-4 text-[var(--color-accent)]" />
            <div className="text-[11px] font-semibold uppercase tracking-[0.12em]">A/C</div>
            <div className="mt-1 text-sm font-semibold text-[var(--color-primary)]">
              {vehicle.ac ? "Included" : "No"}
            </div>
          </div>
        </div>

        <Button asChild className="w-full rounded-full">
          <Link to={`/fleet/${vehicle.slug}`}>
            View Details
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </article>
  );
}
