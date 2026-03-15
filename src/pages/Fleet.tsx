import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Filter, Search, SlidersHorizontal, X } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { VehicleCard } from "@/components/fleet/VehicleCard";
import { PageHero } from "@/components/shared/PageHero";
import { Button } from "@/components/ui/button";
import { defaultFleetFilters, filterVehicles } from "@/lib/booking";
import { cn } from "@/lib/utils";

const categories = ["All", "Economy", "Saloon", "SUV", "Minibus", "Luxury", "Pickup"];
const transmissions = ["Any", "Manual", "Automatic"];
const seatOptions = ["Any", "2-4", "5", "6-7", "8+"] as const;
const driverModes = ["Any", "Self-Drive", "Chauffeur"] as const;
const cities = ["All", "Lusaka", "Kitwe", "Ndola"] as const;
const sorts = ["Most Popular", "Newest", "Price Low-High", "Price High-Low"] as const;

export default function FleetPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filters = {
    ...defaultFleetFilters,
    category: (searchParams.get("category") as typeof defaultFleetFilters.category) ?? "All",
    transmission:
      (searchParams.get("transmission") as typeof defaultFleetFilters.transmission) ??
      "Any",
    seats: (searchParams.get("seats") as typeof defaultFleetFilters.seats) ?? "Any",
    driverMode:
      (searchParams.get("driverMode") as typeof defaultFleetFilters.driverMode) ?? "Any",
    city: (searchParams.get("city") as typeof defaultFleetFilters.city) ?? "All",
    minPrice: Number(searchParams.get("minPrice") ?? defaultFleetFilters.minPrice),
    maxPrice: Number(searchParams.get("maxPrice") ?? defaultFleetFilters.maxPrice),
    sort: (searchParams.get("sort") as typeof defaultFleetFilters.sort) ?? "Most Popular",
    search: searchParams.get("search") ?? "",
  };

  const filteredVehicles = useMemo(() => filterVehicles(filters), [filters]);

  const updateFilter = (key: string, value: string | number) => {
    const next = new URLSearchParams(searchParams);
    if (
      value === "All" ||
      value === "Any" ||
      value === "Most Popular" ||
      value === 0 ||
      value === 5000 ||
      value === ""
    ) {
      next.delete(key);
    } else {
      next.set(key, String(value));
    }
    setSearchParams(next);
  };

  const clearFilters = () => setSearchParams({});

  const filterPanel = (
    <div className="space-y-8">
      <div className="flex items-center justify-between lg:hidden">
        <h3 className="font-display text-2xl font-bold tracking-[-0.04em] text-[var(--color-primary)]">
          Filters
        </h3>
        <button
          onClick={() => setIsFilterOpen(false)}
          className="grid h-12 w-12 place-items-center rounded-2xl border border-[var(--color-gray-200)]"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

        <div className="rounded-[30px] border border-[var(--color-gray-200)] bg-white p-6 shadow-[0_20px_70px_rgba(10,22,40,0.06)]">
          <div className="mb-5 flex items-center gap-3">
            <Filter className="h-5 w-5 text-[var(--color-accent)]" />
            <div>
              <div className="font-semibold text-[var(--color-primary)]">Filter Fleet</div>
              <div className="text-sm text-[var(--color-gray-500)]">
                Narrow the list by city, service mode, seats, price, and transmission.
              </div>
            </div>
          </div>

        <div className="space-y-6">
          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-gray-500)]">
              Search
            </span>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-gray-500)]" />
              <input
                value={filters.search}
                onChange={(event) => updateFilter("search", event.target.value)}
                className="h-12 w-full rounded-2xl border border-[var(--color-gray-200)] bg-[var(--color-gray-100)] pl-11 pr-4 outline-none focus:border-[var(--color-accent)]"
                placeholder="Vehicle, make, category..."
              />
            </div>
          </label>

          <RadioGroup
            label="Category"
            options={categories}
            value={filters.category}
            onChange={(value) => updateFilter("category", value)}
          />
          <RadioGroup
            label="Transmission"
            options={transmissions}
            value={filters.transmission}
            onChange={(value) => updateFilter("transmission", value)}
          />
          <RadioGroup
            label="Seats"
            options={[...seatOptions]}
            value={filters.seats}
            onChange={(value) => updateFilter("seats", value)}
          />
          <RadioGroup
            label="Driver Mode"
            options={[...driverModes]}
            value={filters.driverMode}
            onChange={(value) => updateFilter("driverMode", value)}
          />
          <RadioGroup
            label="City Availability"
            options={[...cities]}
            value={filters.city}
            onChange={(value) => updateFilter("city", value)}
          />

          <div>
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-gray-500)]">
              Price Range
            </div>
            <div className="space-y-4">
              <input
                type="range"
                min={0}
                max={5000}
                step={100}
                value={filters.minPrice}
                onChange={(event) => updateFilter("minPrice", Number(event.target.value))}
                className="w-full accent-[var(--color-accent)]"
              />
              <input
                type="range"
                min={0}
                max={5000}
                step={100}
                value={filters.maxPrice}
                onChange={(event) => updateFilter("maxPrice", Number(event.target.value))}
                className="w-full accent-[var(--color-accent)]"
              />
              <div className="flex items-center justify-between text-sm font-medium text-[var(--color-primary)]">
                <span>K{filters.minPrice}</span>
                <span>K{filters.maxPrice}</span>
              </div>
            </div>
          </div>

          <Button variant="secondary" className="w-full rounded-full" onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-[var(--color-gray-100)] pb-20">
      <PageHero
        eyebrow="Fleet"
        title="Our Fleet"
        description="Explore the full fleet, compare categories, and find the right vehicle for your route, city, and service type."
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Fleet" },
        ]}
        image="https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1600&q=80"
      />

      <div className="mx-auto mt-10 flex max-w-7xl gap-8 px-4">
        <div className="hidden w-[320px] shrink-0 lg:block">{filterPanel}</div>

        <div className="min-w-0 flex-1">
          <div className="mb-6 flex flex-col gap-4 rounded-[30px] border border-[var(--color-gray-200)] bg-white p-5 shadow-[0_20px_70px_rgba(10,22,40,0.06)] md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-sm font-medium text-[var(--color-gray-500)]">
                Showing{" "}
                <span className="font-semibold text-[var(--color-primary)]">
                  {filteredVehicles.length}
                </span>{" "}
                vehicles
              </div>
              <div className="mt-1 text-xs uppercase tracking-[0.22em] text-[var(--color-gray-500)]">
                Updated to match your filters
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                variant="secondary"
                className="rounded-full lg:hidden"
                onClick={() => setIsFilterOpen(true)}
              >
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters
              </Button>
              <label className="relative">
                <select
                  value={filters.sort}
                  onChange={(event) => updateFilter("sort", event.target.value)}
                  className="h-12 min-w-[220px] rounded-full border border-[var(--color-gray-200)] bg-[var(--color-gray-100)] px-4 pr-10 text-sm font-medium text-[var(--color-primary)] outline-none"
                >
                  {sorts.map((sort) => (
                    <option key={sort} value={sort}>
                      {sort}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {filteredVehicles.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredVehicles.map((vehicle) => (
                <div key={vehicle.id}>
                  <VehicleCard vehicle={vehicle} />
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-[32px] border border-dashed border-[var(--color-gray-300)] bg-white p-12 text-center shadow-[0_20px_70px_rgba(10,22,40,0.06)]">
              <div className="font-display text-3xl font-bold tracking-[-0.04em] text-[var(--color-primary)]">
                No vehicles match this view.
              </div>
              <p className="mx-auto mt-4 max-w-xl text-[var(--color-gray-600)]">
                No vehicles match these filters right now. Clear the filters or call us
                for alternatives in Lusaka, Kitwe, or Ndola.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Button onClick={clearFilters} className="rounded-full">
                  Clear Filters
                </Button>
                <Button asChild variant="secondary" className="rounded-full">
                  <a href="https://wa.me/260972826350" target="_blank" rel="noreferrer">
                    Call Us on WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-[rgba(10,22,40,0.45)] backdrop-blur-sm lg:hidden"
            onClick={() => setIsFilterOpen(false)}
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                "h-full w-[90%] max-w-sm overflow-y-auto bg-[var(--color-gray-100)] p-4",
              )}
              onClick={(event) => event.stopPropagation()}
            >
              {filterPanel}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

type RadioGroupProps = {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
};

function RadioGroup({ label, options, value, onChange }: RadioGroupProps) {
  return (
    <div>
      <div className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-gray-500)]">
        {label}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`rounded-2xl border px-3 py-3 text-left text-sm font-medium transition ${
              value === option
                ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                : "border-[var(--color-gray-200)] bg-[var(--color-gray-100)] text-[var(--color-gray-600)] hover:border-[var(--color-gray-300)]"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
