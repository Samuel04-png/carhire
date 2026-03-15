import { useState } from "react";
import toast from "react-hot-toast";
import { CarFront, CheckCircle2, ExternalLink, Plus, Search, Settings2 } from "lucide-react";
import { Link } from "react-router-dom";
import { AdminShell } from "@/components/admin/AdminShell";
import { transmissionOptions, vehicleCategoryOptions, vehicleStatusOptions } from "@/components/admin/admin-constants";
import { MetricCard, StatusPill, SurfaceCard, TextField, inputClassName, vehicleStatusTone } from "@/components/admin/AdminUi";
import { Button } from "@/components/ui/button";
import { cities } from "@/data/site";
import { formatCurrency, formatDateOnly } from "@/lib/format";
import { useAppStore } from "@/store/use-app-store";
import type { AdminVehicleInput, City, Transmission, VehicleCategory, VehicleStatus } from "@/types";

export function AdminFleetScreen() {
  const vehicles = useAppStore((state) => state.vehicles);
  const updateVehicleStatus = useAppStore((state) => state.updateVehicleStatus);
  const addVehicle = useAppStore((state) => state.addVehicle);

  const [query, setQuery] = useState("");
  const [cityFilter, setCityFilter] = useState<City | "All">("All");
  const [statusFilter, setStatusFilter] = useState<VehicleStatus | "All">("All");
  const [categoryFilter, setCategoryFilter] = useState<VehicleCategory | "All">("All");
  const [showForm, setShowForm] = useState(false);
  const [vehicleDraft, setVehicleDraft] = useState({
    name: "",
    make: "",
    model: "",
    year: new Date().getFullYear(),
    regPlate: "",
    color: "",
    category: "SUV" as VehicleCategory,
    transmission: "Automatic" as Transmission,
    fuel: "Petrol",
    seats: 5,
    doors: 5,
    baseDailyRate: 1850,
    chauffeurRate: 700,
    currentCity: "Lusaka" as City,
    cities: ["Lusaka"] as City[],
    status: "Available" as VehicleStatus,
    mainImage: "",
    description: "",
    withDriverAvailable: true,
    mileagePolicy: "250 km daily allowance",
    insuranceIncluded: "Comprehensive included",
    featuresText: "Air Conditioning, Bluetooth, Reverse Camera",
  });

  const filteredVehicles = vehicles.filter((vehicle) => {
    const haystack = `${vehicle.name} ${vehicle.make} ${vehicle.model} ${vehicle.regPlate}`.toLowerCase();
    if (query && !haystack.includes(query.trim().toLowerCase())) return false;
    if (cityFilter !== "All" && !vehicle.cities.includes(cityFilter)) return false;
    if (statusFilter !== "All" && vehicle.status !== statusFilter) return false;
    if (categoryFilter !== "All" && vehicle.category !== categoryFilter) return false;
    return true;
  });

  const submitVehicle = () => {
    if (!vehicleDraft.name.trim() || !vehicleDraft.make.trim() || !vehicleDraft.model.trim() || !vehicleDraft.regPlate.trim() || !vehicleDraft.mainImage.trim()) {
      toast.error("Complete the vehicle profile before saving.");
      return;
    }
    if (vehicleDraft.cities.length === 0) {
      toast.error("Assign at least one operating city.");
      return;
    }
    const created = addVehicle({
      name: vehicleDraft.name,
      make: vehicleDraft.make,
      model: vehicleDraft.model,
      year: Number(vehicleDraft.year),
      regPlate: vehicleDraft.regPlate,
      color: vehicleDraft.color,
      category: vehicleDraft.category,
      transmission: vehicleDraft.transmission,
      fuel: vehicleDraft.fuel,
      seats: Number(vehicleDraft.seats),
      doors: Number(vehicleDraft.doors),
      baseDailyRate: Number(vehicleDraft.baseDailyRate),
      chauffeurRate: Number(vehicleDraft.chauffeurRate),
      currentCity: vehicleDraft.currentCity,
      cities: vehicleDraft.cities,
      status: vehicleDraft.status,
      mainImage: vehicleDraft.mainImage,
      description: vehicleDraft.description,
      withDriverAvailable: vehicleDraft.withDriverAvailable,
      mileagePolicy: vehicleDraft.mileagePolicy,
      insuranceIncluded: vehicleDraft.insuranceIncluded,
      features: vehicleDraft.featuresText.split(",").map((item) => item.trim()).filter(Boolean),
    } satisfies AdminVehicleInput);
    toast.success(`${created.name} added to fleet.`);
    setShowForm(false);
  };

  return (
    <AdminShell
      title="Fleet"
      description="Track availability, city placement, and daily pricing. Add new vehicles directly into the live public fleet state."
      actions={<Button type="button" className="rounded-full" onClick={() => setShowForm((value) => !value)}><Plus className="mr-2 h-4 w-4" />{showForm ? "Close Form" : "Add Vehicle"}</Button>}
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Fleet size" value={String(vehicles.length)} icon={CarFront} accent="blue" />
        <MetricCard label="Available" value={String(vehicles.filter((item) => item.status === "Available").length)} icon={CheckCircle2} accent="green" />
        <MetricCard label="On hire" value={String(vehicles.filter((item) => item.status === "On Hire").length)} icon={CarFront} accent="navy" />
        <MetricCard label="Maintenance" value={String(vehicles.filter((item) => item.status === "Maintenance").length)} icon={Settings2} accent="amber" />
      </div>

      {showForm && (
        <SurfaceCard className="mt-6" title="Add vehicle" subtitle="Create a new fleet record with enough detail to render on both admin and public pages.">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <TextField label="Vehicle name" value={vehicleDraft.name} onChange={(value) => setVehicleDraft((current) => ({ ...current, name: value }))} />
            <TextField label="Make" value={vehicleDraft.make} onChange={(value) => setVehicleDraft((current) => ({ ...current, make: value }))} />
            <TextField label="Model" value={vehicleDraft.model} onChange={(value) => setVehicleDraft((current) => ({ ...current, model: value }))} />
            <TextField label="Year" type="number" value={String(vehicleDraft.year)} onChange={(value) => setVehicleDraft((current) => ({ ...current, year: Number(value) }))} />
            <TextField label="Registration" value={vehicleDraft.regPlate} onChange={(value) => setVehicleDraft((current) => ({ ...current, regPlate: value }))} />
            <TextField label="Color" value={vehicleDraft.color} onChange={(value) => setVehicleDraft((current) => ({ ...current, color: value }))} />
            <label><div className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-gray-500)]">Category</div><select className={inputClassName} value={vehicleDraft.category} onChange={(event) => setVehicleDraft((current) => ({ ...current, category: event.target.value as VehicleCategory }))}>{vehicleCategoryOptions.map((option) => <option key={option}>{option}</option>)}</select></label>
            <label><div className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-gray-500)]">Transmission</div><select className={inputClassName} value={vehicleDraft.transmission} onChange={(event) => setVehicleDraft((current) => ({ ...current, transmission: event.target.value as Transmission }))}>{transmissionOptions.map((option) => <option key={option}>{option}</option>)}</select></label>
            <TextField label="Fuel" value={vehicleDraft.fuel} onChange={(value) => setVehicleDraft((current) => ({ ...current, fuel: value }))} />
            <TextField label="Seats" type="number" value={String(vehicleDraft.seats)} onChange={(value) => setVehicleDraft((current) => ({ ...current, seats: Number(value) }))} />
            <TextField label="Doors" type="number" value={String(vehicleDraft.doors)} onChange={(value) => setVehicleDraft((current) => ({ ...current, doors: Number(value) }))} />
            <TextField label="Base daily rate" type="number" value={String(vehicleDraft.baseDailyRate)} onChange={(value) => setVehicleDraft((current) => ({ ...current, baseDailyRate: Number(value) }))} />
            <TextField label="Chauffeur rate" type="number" value={String(vehicleDraft.chauffeurRate)} onChange={(value) => setVehicleDraft((current) => ({ ...current, chauffeurRate: Number(value) }))} />
            <label><div className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-gray-500)]">Current city</div><select className={inputClassName} value={vehicleDraft.currentCity} onChange={(event) => setVehicleDraft((current) => ({ ...current, currentCity: event.target.value as City }))}>{cities.map((city) => <option key={city}>{city}</option>)}</select></label>
            <label><div className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-gray-500)]">Status</div><select className={inputClassName} value={vehicleDraft.status} onChange={(event) => setVehicleDraft((current) => ({ ...current, status: event.target.value as VehicleStatus }))}>{vehicleStatusOptions.map((option) => <option key={option}>{option}</option>)}</select></label>
            <TextField label="Main image URL" value={vehicleDraft.mainImage} onChange={(value) => setVehicleDraft((current) => ({ ...current, mainImage: value }))} />
            <TextField label="Mileage policy" value={vehicleDraft.mileagePolicy} onChange={(value) => setVehicleDraft((current) => ({ ...current, mileagePolicy: value }))} />
            <TextField label="Insurance" value={vehicleDraft.insuranceIncluded} onChange={(value) => setVehicleDraft((current) => ({ ...current, insuranceIncluded: value }))} />
            <label className="xl:col-span-3">
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-gray-500)]">Operating cities</div>
              <div className="flex flex-wrap gap-2">{cities.map((city) => <button key={city} type="button" className={`rounded-full px-4 py-2 text-sm font-medium ${vehicleDraft.cities.includes(city) ? "bg-[var(--color-accent)] text-white" : "border border-[var(--color-gray-200)] bg-white text-[var(--color-gray-600)]"}`} onClick={() => setVehicleDraft((current) => ({ ...current, cities: current.cities.includes(city) ? current.cities.filter((item) => item !== city) : [...current.cities, city] }))}>{city}</button>)}</div>
            </label>
            <label className="xl:col-span-3"><div className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-gray-500)]">Description</div><textarea className="min-h-[120px] w-full rounded-[24px] border border-[var(--color-gray-200)] bg-[var(--color-gray-100)] px-4 py-3 text-sm outline-none transition focus:border-[var(--color-accent)]" value={vehicleDraft.description} onChange={(event) => setVehicleDraft((current) => ({ ...current, description: event.target.value }))} /></label>
            <label className="xl:col-span-3"><div className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-gray-500)]">Features</div><textarea className="min-h-[120px] w-full rounded-[24px] border border-[var(--color-gray-200)] bg-[var(--color-gray-100)] px-4 py-3 text-sm outline-none transition focus:border-[var(--color-accent)]" value={vehicleDraft.featuresText} onChange={(event) => setVehicleDraft((current) => ({ ...current, featuresText: event.target.value }))} /></label>
          </div>
          <div className="mt-6 flex flex-wrap gap-3"><Button type="button" className="rounded-full" onClick={submitVehicle}>Save Vehicle</Button><Button type="button" variant="secondary" className="rounded-full" onClick={() => setShowForm(false)}>Cancel</Button></div>
        </SurfaceCard>
      )}

      <SurfaceCard className="mt-6" title="Filter fleet" subtitle="Narrow by city, status, or category.">
        <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
          <label className="relative block"><Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-gray-500)]" /><input className={`${inputClassName} pl-11`} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by model or plate" /></label>
          <select className={inputClassName} value={cityFilter} onChange={(event) => setCityFilter(event.target.value as City | "All")}><option value="All">All cities</option>{cities.map((city) => <option key={city}>{city}</option>)}</select>
          <select className={inputClassName} value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as VehicleStatus | "All")}><option value="All">All statuses</option>{vehicleStatusOptions.map((option) => <option key={option}>{option}</option>)}</select>
          <select className={inputClassName} value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value as VehicleCategory | "All")}><option value="All">All categories</option>{vehicleCategoryOptions.map((option) => <option key={option}>{option}</option>)}</select>
        </div>
      </SurfaceCard>

      <div className="mt-6 grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
        {filteredVehicles.map((vehicle) => (
          <div key={vehicle.id} className="overflow-hidden rounded-[32px] border border-[var(--color-gray-200)] bg-white shadow-[0_18px_60px_rgba(10,22,40,0.06)]">
            <img src={vehicle.mainImage} alt={vehicle.name} className="h-52 w-full object-cover" referrerPolicy="no-referrer" />
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-display text-2xl font-bold tracking-[-0.04em] text-[var(--color-primary)]">{vehicle.name}</div>
                  <div className="mt-1 text-sm text-[var(--color-gray-600)]">{vehicle.regPlate} · {vehicle.currentCity}</div>
                </div>
                <StatusPill label={vehicle.status} tone={vehicleStatusTone(vehicle.status)} />
              </div>
              <div className="mt-4 grid gap-2 text-sm text-[var(--color-gray-600)]">
                <div>Category: {vehicle.category}</div>
                <div>Daily rate: {formatCurrency(vehicle.baseDailyRate)}</div>
                <div>Next booking: {formatDateOnly(vehicle.nextBookingDate)}</div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">{vehicle.cities.map((city) => <span key={city} className="rounded-full bg-[var(--color-gray-100)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-gray-500)]">{city}</span>)}</div>
              <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                <select className={inputClassName} value={vehicle.status} onChange={(event) => updateVehicleStatus(vehicle.id, event.target.value as VehicleStatus)}>{vehicleStatusOptions.map((option) => <option key={option}>{option}</option>)}</select>
                <Button asChild variant="secondary" className="rounded-full"><Link to={`/fleet/${vehicle.slug}`}>View Page<ExternalLink className="ml-2 h-4 w-4" /></Link></Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
