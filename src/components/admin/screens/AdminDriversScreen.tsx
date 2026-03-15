import { BriefcaseBusiness, CalendarRange, CheckCircle2, Clock3, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { AdminShell } from "@/components/admin/AdminShell";
import { driverStatusOptions } from "@/components/admin/admin-constants";
import { MetricCard, StatusPill, SurfaceCard, driverStatusTone, inputClassName, toPhoneHref } from "@/components/admin/AdminUi";
import { Button } from "@/components/ui/button";
import { cities } from "@/data/site";
import { useAppStore } from "@/store/use-app-store";
import type { City, DriverStatus } from "@/types";
import { useState } from "react";

export function AdminDriversScreen() {
  const drivers = useAppStore((state) => state.drivers);
  const updateDriverStatus = useAppStore((state) => state.updateDriverStatus);
  const [query, setQuery] = useState("");
  const [cityFilter, setCityFilter] = useState<City | "All">("All");
  const [statusFilter, setStatusFilter] = useState<DriverStatus | "All">("All");

  const filteredDrivers = drivers.filter((driver) => {
    const haystack = `${driver.name} ${driver.email} ${driver.phone}`.toLowerCase();
    if (query && !haystack.includes(query.trim().toLowerCase())) return false;
    if (cityFilter !== "All" && driver.city !== cityFilter) return false;
    if (statusFilter !== "All" && driver.status !== statusFilter) return false;
    return true;
  });

  return (
    <AdminShell title="Drivers" description="Manage availability, contact each driver directly, and keep dispatch status current as bookings move.">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Driver team" value={String(drivers.length)} icon={BriefcaseBusiness} accent="blue" />
        <MetricCard label="Available" value={String(drivers.filter((item) => item.status === "Available").length)} icon={CheckCircle2} accent="green" />
        <MetricCard label="On trip" value={String(drivers.filter((item) => item.status === "On Trip").length)} icon={CalendarRange} accent="navy" />
        <MetricCard label="Off duty" value={String(drivers.filter((item) => item.status === "Off Duty").length)} icon={Clock3} accent="amber" />
      </div>

      <SurfaceCard className="mt-6" title="Filter drivers" subtitle="Focus by city or current dispatch state.">
        <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <input className={inputClassName} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search drivers" />
          <select className={inputClassName} value={cityFilter} onChange={(event) => setCityFilter(event.target.value as City | "All")}><option value="All">All cities</option>{cities.map((city) => <option key={city}>{city}</option>)}</select>
          <select className={inputClassName} value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as DriverStatus | "All")}><option value="All">All statuses</option>{driverStatusOptions.map((option) => <option key={option}>{option}</option>)}</select>
        </div>
      </SurfaceCard>

      <div className="mt-6 grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
        {filteredDrivers.map((driver) => (
          <div key={driver.id} className="rounded-[30px] border border-[var(--color-gray-200)] bg-white p-6 shadow-[0_18px_60px_rgba(10,22,40,0.06)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-display text-2xl font-bold tracking-[-0.04em] text-[var(--color-primary)]">{driver.name}</div>
                <div className="mt-1 text-sm text-[var(--color-gray-600)]">{driver.city}</div>
              </div>
              <StatusPill label={driver.status} tone={driverStatusTone(driver.status)} />
            </div>
            <div className="mt-5 space-y-3 text-sm text-[var(--color-gray-600)]">
              <div>{driver.phone}</div>
              <div>{driver.email}</div>
              <div>Rating: {driver.rating.toFixed(1)}</div>
              <div>Assignment: {driver.currentAssignment}</div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">{driver.vehiclePreferences.map((preference) => <span key={preference} className="rounded-full bg-[var(--color-gray-100)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-gray-500)]">{preference}</span>)}</div>
            <div className="mt-6 grid gap-3">
              <select className={inputClassName} value={driver.status} onChange={(event) => updateDriverStatus(driver.id, event.target.value as DriverStatus)}>{driverStatusOptions.map((option) => <option key={option}>{option}</option>)}</select>
              <div className="flex flex-wrap gap-2">
                <Button asChild size="sm" variant="secondary" className="rounded-full"><a href={toPhoneHref(driver.phone)}><Phone className="mr-2 h-4 w-4" />Call</a></Button>
                <Button asChild size="sm" variant="secondary" className="rounded-full"><a href={`mailto:${driver.email}`}><Mail className="mr-2 h-4 w-4" />Email</a></Button>
                {driver.currentAssignment.startsWith("SCH-") && <Button asChild size="sm" className="rounded-full"><Link to={`/booking/confirmation/${driver.currentAssignment}`}>Open Trip</Link></Button>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
