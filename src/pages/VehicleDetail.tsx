import { useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Fuel,
  MapPin,
  ShieldCheck,
  Snowflake,
  Users2,
} from "lucide-react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { VehicleCard } from "@/components/fleet/VehicleCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { vehicles } from "@/data/mock";
import { formatCurrency } from "@/lib/format";
import { useAppStore } from "@/store/use-app-store";

export default function VehicleDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const updateDraft = useAppStore((state) => state.updateDraft);
  const vehicle = vehicles.find((item) => item.slug === slug);

  const [mainImage, setMainImage] = useState(vehicle?.gallery[0] ?? "");
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [pickupLocation, setPickupLocation] = useState("Kenneth Kaunda International Airport");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("10:00");
  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("10:00");
  const [withDriver, setWithDriver] = useState(false);

  const similarVehicles = useMemo(
    () =>
      vehicles
        .filter(
          (item) => item.category === vehicle?.category && item.id !== vehicle?.id,
        )
        .slice(0, 3),
    [vehicle],
  );

  if (!vehicle) {
    return <Navigate to="/fleet" replace />;
  }

  const pickup = pickupDate ? new Date(`${pickupDate}T${pickupTime}:00`) : null;
  const dropoff = returnDate ? new Date(`${returnDate}T${returnTime}:00`) : null;
  const days =
    pickup && dropoff ? Math.max(1, Math.ceil((dropoff.getTime() - pickup.getTime()) / 86400000)) : 0;
  const chauffeurCost = withDriver ? days * vehicle.chauffeurRate : 0;
  const subtotal = days > 0 ? vehicle.baseDailyRate * days + chauffeurCost : 0;
  const taxes = Math.round(subtotal * 0.08);
  const total = subtotal + taxes;

  const handleBook = () => {
    updateDraft({
      vehicleId: vehicle.id,
      pickupCity: vehicle.currentCity,
      pickupLocation,
      pickupDate,
      pickupTime,
      returnDate,
      returnTime,
      withDriver,
    });
    navigate("/book/step-1");
  };

  const statusTone =
    vehicle.status === "Available"
      ? "success"
      : vehicle.status === "Maintenance"
        ? "warning"
        : vehicle.status === "On Request"
          ? "info"
          : "neutral";

  return (
    <div className="bg-[var(--color-gray-100)] pb-16 pt-24 md:pb-20 md:pt-28">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-[var(--color-gray-500)] sm:mb-8 sm:gap-2 sm:text-sm">
          <Link to="/" className="transition hover:text-[var(--color-primary)]">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/fleet" className="transition hover:text-[var(--color-primary)]">
            Fleet
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-[var(--color-primary)]">{vehicle.name}</span>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr] lg:gap-10">
          <div className="space-y-8">
            <div className="overflow-hidden rounded-[28px] border border-[var(--color-gray-200)] bg-white shadow-[0_20px_70px_rgba(10,22,40,0.08)] sm:rounded-[34px]">
              <button
                onClick={() => setIsLightboxOpen(true)}
                className="block h-[260px] w-full overflow-hidden sm:h-[360px] lg:h-[430px]"
              >
                <img
                  src={mainImage}
                  alt={vehicle.name}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </button>
              <div className="grid grid-cols-4 gap-2 p-3 sm:gap-3 sm:p-4">
                {vehicle.gallery.map((image) => (
                  <button
                    key={image}
                    onClick={() => setMainImage(image)}
                    className={`overflow-hidden rounded-xl border-2 sm:rounded-2xl ${
                      mainImage === image
                        ? "border-[var(--color-accent)]"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={image}
                      alt=""
                      className="h-16 w-full object-cover sm:h-24"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-[var(--color-gray-200)] bg-white p-5 shadow-[0_20px_70px_rgba(10,22,40,0.08)] sm:rounded-[34px] sm:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <StatusBadge tone={statusTone}>{vehicle.status}</StatusBadge>
                <StatusBadge tone="info">{vehicle.category}</StatusBadge>
                {vehicle.featured && <StatusBadge tone="gold">Featured</StatusBadge>}
              </div>
              <div className="mt-5 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div>
                  <h1 className="font-display text-3xl font-bold tracking-[-0.05em] text-[var(--color-primary)] sm:text-4xl md:text-5xl">
                    {vehicle.name}
                  </h1>
                  <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--color-gray-600)]">
                    {vehicle.description}
                  </p>
                </div>
                <div className="rounded-[28px] bg-[var(--color-primary)] p-5 text-white">
                  <div className="text-xs uppercase tracking-[0.28em] text-white/55">
                    From
                  </div>
                  <div className="mt-2 font-display text-4xl font-bold tracking-[-0.05em]">
                    {formatCurrency(vehicle.baseDailyRate)}
                  </div>
                  <div className="text-sm text-white/70">per day</div>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-[var(--color-gray-200)] bg-white p-5 shadow-[0_20px_70px_rgba(10,22,40,0.08)] sm:rounded-[34px] sm:p-8">
              <h2 className="font-display text-2xl font-bold tracking-[-0.04em] text-[var(--color-primary)] sm:text-3xl">
                Vehicle Specifications
              </h2>
              <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {[
                  ["Make / Model", `${vehicle.make} ${vehicle.model}`],
                  ["Year", String(vehicle.year)],
                  ["Seats", String(vehicle.seats)],
                  ["Doors", String(vehicle.doors)],
                  ["Transmission", vehicle.transmission],
                  ["Fuel", vehicle.fuel],
                  ["A/C", vehicle.ac ? "Included" : "No"],
                  ["Mileage Policy", vehicle.mileagePolicy],
                  ["Insurance", vehicle.insuranceIncluded],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-[26px] bg-[var(--color-gray-100)] p-5"
                  >
                    <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-gray-500)]">
                      {label}
                    </div>
                    <div className="mt-3 text-lg font-semibold text-[var(--color-primary)]">
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              <div className="rounded-[28px] border border-[var(--color-gray-200)] bg-white p-5 shadow-[0_20px_70px_rgba(10,22,40,0.08)] sm:rounded-[34px] sm:p-8">
                <h2 className="font-display text-2xl font-bold tracking-[-0.04em] text-[var(--color-primary)] sm:text-3xl">
                  Key Features
                </h2>
                <div className="mt-6 space-y-4">
                  {vehicle.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-1 h-5 w-5 text-[var(--color-accent)]" />
                      <span className="text-[var(--color-gray-600)]">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-[28px] border border-[var(--color-gray-200)] bg-white p-5 shadow-[0_20px_70px_rgba(10,22,40,0.08)] sm:rounded-[34px] sm:p-8">
                <h2 className="font-display text-2xl font-bold tracking-[-0.04em] text-[var(--color-primary)] sm:text-3xl">
                  Ideal For
                </h2>
                <div className="mt-6 space-y-4 text-[var(--color-gray-600)]">
                  <div>Airport transfers with polished client handover</div>
                  <div>Corporate movement and executive scheduling</div>
                  <div>Multi-day travel with clear cost planning</div>
                  <div>Premium site visits and event logistics</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="rounded-[28px] border border-[var(--color-gray-200)] bg-white p-5 shadow-[0_20px_80px_rgba(10,22,40,0.12)] lg:sticky lg:top-28 lg:rounded-[34px] lg:p-8">
              <div className="mb-6 flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-[var(--color-accent)]" />
                <div>
                  <div className="font-display text-2xl font-bold tracking-[-0.04em] text-[var(--color-primary)]">
                    Reserve this vehicle
                  </div>
                  <div className="text-sm text-[var(--color-gray-500)]">
                    Choose your dates, service mode, and pickup point.
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-gray-500)]">
                    Pickup location
                  </span>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-gray-500)]" />
                    <select
                      value={pickupLocation}
                      onChange={(event) => setPickupLocation(event.target.value)}
                      className="h-14 w-full rounded-2xl border border-[var(--color-gray-200)] bg-[var(--color-gray-100)] pl-11 pr-4 outline-none focus:border-[var(--color-accent)]"
                    >
                      <option value="Kenneth Kaunda International Airport">
                        Lusaka Airport
                      </option>
                      <option value="Lusaka CBD Pickup">Lusaka CBD</option>
                      <option value="Kitwe City Pickup">Kitwe</option>
                      <option value="Ndola City Pickup">Ndola</option>
                    </select>
                  </div>
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-gray-500)]">
                      Pickup
                    </span>
                    <div className="space-y-3">
                      <input
                        type="date"
                        min={new Date().toISOString().split("T")[0]}
                        value={pickupDate}
                        onChange={(event) => setPickupDate(event.target.value)}
                        className="h-14 w-full rounded-2xl border border-[var(--color-gray-200)] bg-[var(--color-gray-100)] px-4 outline-none focus:border-[var(--color-accent)]"
                      />
                      <input
                        type="time"
                        value={pickupTime}
                        onChange={(event) => setPickupTime(event.target.value)}
                        className="h-14 w-full rounded-2xl border border-[var(--color-gray-200)] bg-[var(--color-gray-100)] px-4 outline-none focus:border-[var(--color-accent)]"
                      />
                    </div>
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-gray-500)]">
                      Return
                    </span>
                    <div className="space-y-3">
                      <input
                        type="date"
                        min={pickupDate || new Date().toISOString().split("T")[0]}
                        value={returnDate}
                        onChange={(event) => setReturnDate(event.target.value)}
                        className="h-14 w-full rounded-2xl border border-[var(--color-gray-200)] bg-[var(--color-gray-100)] px-4 outline-none focus:border-[var(--color-accent)]"
                      />
                      <input
                        type="time"
                        value={returnTime}
                        onChange={(event) => setReturnTime(event.target.value)}
                        className="h-14 w-full rounded-2xl border border-[var(--color-gray-200)] bg-[var(--color-gray-100)] px-4 outline-none focus:border-[var(--color-accent)]"
                      />
                    </div>
                  </label>
                </div>

                <button
                  type="button"
                  onClick={() => setWithDriver((value) => !value)}
                  className="flex w-full items-center justify-between rounded-[26px] border border-[var(--color-gray-200)] bg-[var(--color-gray-100)] p-4"
                >
                  <div>
                    <div className="font-semibold text-[var(--color-primary)]">
                      {withDriver ? "With chauffeur" : "Self-drive"}
                    </div>
                    <div className="text-sm text-[var(--color-gray-500)]">
                      {withDriver
                        ? `+ ${formatCurrency(vehicle.chauffeurRate)} / day`
                        : "Switch to chauffeur-assisted travel"}
                    </div>
                  </div>
                  <div
                    className={`relative h-8 w-14 rounded-full ${
                      withDriver ? "bg-[var(--color-accent)]" : "bg-[var(--color-gray-300)]"
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-6 w-6 rounded-full bg-white transition ${
                        withDriver ? "left-7" : "left-1"
                      }`}
                    />
                  </div>
                </button>
              </div>

              <div className="mt-8 rounded-[28px] bg-[var(--color-primary)] p-6 text-white">
                <div className="mb-4 flex items-center gap-2 text-white/72">
                  <CalendarDays className="h-4 w-4" />
                  {days > 0 ? `${days} day booking` : "Select dates to calculate total"}
                </div>
                <div className="space-y-4 text-sm">
                  <Row label={`${formatCurrency(vehicle.baseDailyRate)} x ${days || 0} days`} value={days ? formatCurrency(vehicle.baseDailyRate * days) : "K0"} />
                  {withDriver && (
                    <Row
                      label={`Chauffeur x ${days || 0} days`}
                      value={formatCurrency(chauffeurCost)}
                    />
                  )}
                  <Row label="Taxes & fees" value={days ? formatCurrency(taxes) : "K0"} />
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-6">
                  <div className="text-white/65">Estimated total</div>
                  <div className="font-display text-4xl font-bold tracking-[-0.05em]">
                    {days ? formatCurrency(total) : "K0"}
                  </div>
                </div>
              </div>

              <Button
                onClick={handleBook}
                disabled={!pickupDate || !returnDate}
                className="mt-6 h-14 w-full rounded-full"
              >
                Book This Vehicle
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-14 sm:mt-16">
          <h2 className="font-display text-3xl font-bold tracking-[-0.05em] text-[var(--color-primary)] sm:text-4xl">
            Similar Vehicles
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {similarVehicles.map((item) => (
              <div key={item.id}>
                <VehicleCard vehicle={item} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-[70] grid place-items-center bg-[rgba(10,22,40,0.82)] p-4 backdrop-blur"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div className="max-h-[90vh] max-w-5xl overflow-hidden rounded-[34px] border border-white/10">
            <img src={mainImage} alt={vehicle.name} className="max-h-[90vh] w-full object-cover" />
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 text-white/76">
      <div>{label}</div>
      <div className="font-semibold text-white">{value}</div>
    </div>
  );
}

