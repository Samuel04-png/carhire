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
    <article className="group overflow-hidden rounded-[30px] border border-[var(--color-gray-200)] bg-white shadow-[0_20px_80px_rgba(10,22,40,0.08)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_100px_rgba(10,22,40,0.12)]">
      <div className="relative h-64 overflow-hidden">
        <img
          src={vehicle.mainImage}
          alt={vehicle.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,22,40,0.05),rgba(10,22,40,0.82))]" />
        <div className="absolute left-5 right-5 top-5 flex items-center justify-between gap-3">
          <StatusBadge tone={badgeTone}>{vehicle.status}</StatusBadge>
          <div className="inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[var(--color-primary)]">
            <Star className="h-3.5 w-3.5 fill-[var(--color-gold)] text-[var(--color-gold)]" />
            {vehicle.rating.toFixed(1)}
          </div>
        </div>
        <div className="absolute bottom-5 left-5 right-5">
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-full border border-white/15 bg-white/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur">
              {vehicle.category}
            </span>
            {vehicle.featured && <StatusBadge tone="gold">Featured</StatusBadge>}
          </div>
          <h3 className="font-display text-2xl font-bold tracking-[-0.04em] text-white">
            {vehicle.name}
          </h3>
          <p className="mt-1 text-sm text-white/75">{vehicle.heroMetric}</p>
        </div>
      </div>

      <div className="space-y-6 p-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-gray-500)]">
              From
            </p>
            <p className="font-display text-3xl font-bold tracking-[-0.05em] text-[var(--color-primary)]">
              {formatCurrency(vehicle.baseDailyRate)}
            </p>
          </div>
          <p className="text-sm font-medium text-[var(--color-gray-500)]">per day</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-[var(--color-gray-100)] p-3 text-center text-[var(--color-gray-600)]">
            <Users2 className="mx-auto mb-2 h-4 w-4 text-[var(--color-accent)]" />
            <div className="text-xs font-semibold uppercase tracking-[0.18em]">Seats</div>
            <div className="mt-1 text-sm font-semibold text-[var(--color-primary)]">
              {vehicle.seats}
            </div>
          </div>
          <div className="rounded-2xl bg-[var(--color-gray-100)] p-3 text-center text-[var(--color-gray-600)]">
            <Settings2 className="mx-auto mb-2 h-4 w-4 text-[var(--color-accent)]" />
            <div className="text-xs font-semibold uppercase tracking-[0.18em]">Gearbox</div>
            <div className="mt-1 text-sm font-semibold text-[var(--color-primary)]">
              {vehicle.transmission}
            </div>
          </div>
          <div className="rounded-2xl bg-[var(--color-gray-100)] p-3 text-center text-[var(--color-gray-600)]">
            <Snowflake className="mx-auto mb-2 h-4 w-4 text-[var(--color-accent)]" />
            <div className="text-xs font-semibold uppercase tracking-[0.18em]">A/C</div>
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
