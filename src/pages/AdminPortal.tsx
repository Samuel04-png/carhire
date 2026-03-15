import type { ReactNode } from "react";
import { useMemo } from "react";
import {
  Activity,
  ArrowRight,
  CarFront,
  Clock3,
  FileBarChart,
  Plus,
  UserRound,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDateOnly, relativeDate } from "@/lib/format";
import { useAppStore } from "@/store/use-app-store";
import type { BookingStatus, PaymentStatus, VehicleStatus } from "@/types";

export default function AdminPortalPage() {
  const location = useLocation();
  const vehicles = useAppStore((state) => state.vehicles);
  const bookings = useAppStore((state) => state.bookings);
  const clients = useAppStore((state) => state.clients);
  const drivers = useAppStore((state) => state.drivers);
  const updateBookingStatus = useAppStore((state) => state.updateBookingStatus);
  const updatePaymentStatus = useAppStore((state) => state.updatePaymentStatus);
  const assignDriver = useAppStore((state) => state.assignDriver);
  const updateVehicleStatus = useAppStore((state) => state.updateVehicleStatus);

  const path = location.pathname;

  const revenueByCity = useMemo(() => {
    return ["Lusaka", "Kitwe", "Ndola"].map((city) => ({
      name: city,
      revenue: bookings
        .filter((booking) => booking.pickupCity === city)
        .reduce((sum, booking) => sum + booking.amount, 0),
    }));
  }, [bookings]);

  const serviceBreakdown = [
    { name: "Corporate", value: 38, color: "#1A7FD4" },
    { name: "Airport", value: 24, color: "#0A1628" },
    { name: "Events", value: 18, color: "#0E4D8C" },
    { name: "Self-Drive", value: 20, color: "#22C55E" },
  ];

  if (path.includes("/admin/bookings")) {
    return (
      <AdminShell
        title={path.endsWith("/new") ? "New Booking" : "Bookings"}
        description="View bookings, update status, record payment, and assign drivers."
        actions={
          <Button asChild className="rounded-full">
            <Link to="/admin/bookings/new">
              <Plus className="mr-2 h-4 w-4" />
              New Booking
            </Link>
          </Button>
        }
      >
        {path.endsWith("/new") ? (
          <AdminNewBooking />
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const vehicle = vehicles.find((item) => item.id === booking.vehicleId);
              const client = clients.find((item) => item.id === booking.clientId);
              return (
                <div
                  key={booking.ref}
                  className="rounded-[30px] border border-[var(--color-gray-200)] bg-white p-5 shadow-[0_18px_60px_rgba(10,22,40,0.06)]"
                >
                  <div className="grid gap-4 xl:grid-cols-[1.3fr_0.8fr_0.8fr_0.9fr_auto_auto_auto] xl:items-center">
                    <div>
                      <div className="font-semibold text-[var(--color-primary)]">
                        {booking.ref}
                      </div>
                      <div className="mt-1 text-sm text-[var(--color-gray-600)]">
                        {client?.firstName} {client?.lastName} | {vehicle?.name}
                      </div>
                      <div className="mt-1 text-xs uppercase tracking-[0.22em] text-[var(--color-gray-500)]">
                        {formatDateOnly(booking.pickupDateTime)} to{" "}
                        {formatDateOnly(booking.returnDateTime)}
                      </div>
                    </div>
                    <div className="text-sm text-[var(--color-gray-600)]">
                      <div className="font-semibold text-[var(--color-primary)]">
                        {booking.pickupCity}
                      </div>
                      <div>{booking.source}</div>
                    </div>
                    <div className="font-semibold text-[var(--color-primary)]">
                      {formatCurrency(booking.amount)}
                    </div>
                    <StatusSelect
                      value={booking.status}
                      options={[
                        "Pending",
                        "Confirmed",
                        "Active",
                        "Completed",
                        "Cancelled",
                      ]}
                      onChange={(value) =>
                        updateBookingStatus(value.ref, value.status as BookingStatus)
                      }
                      refValue={booking.ref}
                    />
                    <StatusSelect
                      value={booking.paymentStatus}
                      options={[
                        "Pending Payment",
                        "Paid",
                        "Partial",
                        "Refunded",
                      ]}
                      onChange={(value) =>
                        updatePaymentStatus(
                          value.ref,
                          value.status as PaymentStatus,
                        )
                      }
                      refValue={booking.ref}
                    />
                    <select
                      value={booking.assignedDriverId ?? ""}
                      onChange={(event) =>
                        event.target.value && assignDriver(booking.ref, event.target.value)
                      }
                      className="h-11 rounded-full border border-[var(--color-gray-200)] bg-[var(--color-gray-100)] px-4 text-sm"
                    >
                      <option value="">Assign driver</option>
                      {drivers.map((driver) => (
                        <option key={driver.id} value={driver.id}>
                          {driver.name}
                        </option>
                      ))}
                    </select>
                    <Link
                      to={`/booking/confirmation/${booking.ref}`}
                      className="text-sm font-semibold text-[var(--color-accent)]"
                    >
                      Open
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </AdminShell>
    );
  }

  if (path.includes("/admin/fleet")) {
    return (
      <AdminShell
        title="Fleet"
        description="See vehicle status, city, next booking, and daily rate."
        actions={
          <Button className="rounded-full">
            <Plus className="mr-2 h-4 w-4" />
            Add Vehicle
          </Button>
        }
      >
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="rounded-[30px] border border-[var(--color-gray-200)] bg-white p-5 shadow-[0_18px_60px_rgba(10,22,40,0.06)]"
            >
              <img
                src={vehicle.mainImage}
                alt={vehicle.name}
                className="h-44 w-full rounded-[24px] object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="mt-5 flex items-start justify-between gap-3">
                <div>
                  <div className="font-display text-2xl font-bold tracking-[-0.04em] text-[var(--color-primary)]">
                    {vehicle.name}
                  </div>
                  <div className="mt-1 text-sm text-[var(--color-gray-600)]">
                    {vehicle.regPlate} | {vehicle.currentCity}
                  </div>
                </div>
                <select
                  value={vehicle.status}
                  onChange={(event) =>
                    updateVehicleStatus(vehicle.id, event.target.value as VehicleStatus)
                  }
                  className="h-11 rounded-full border border-[var(--color-gray-200)] bg-[var(--color-gray-100)] px-4 text-sm"
                >
                  <option>Available</option>
                  <option>On Hire</option>
                  <option>Maintenance</option>
                  <option>Retired</option>
                  <option>On Request</option>
                </select>
              </div>
              <div className="mt-5 grid gap-3 text-sm text-[var(--color-gray-600)]">
                <div>Category: {vehicle.category}</div>
                <div>Next booking: {formatDateOnly(vehicle.nextBookingDate)}</div>
                <div>Daily rate: {formatCurrency(vehicle.baseDailyRate)}</div>
              </div>
            </div>
          ))}
        </div>
      </AdminShell>
    );
  }

  if (path.includes("/admin/clients")) {
    const corporateOnly = path.includes("/corporate");
    const visibleClients = corporateOnly
      ? clients.filter((client) => client.accountType === "Corporate")
      : clients;
    return (
      <AdminShell
        title={corporateOnly ? "Corporate Accounts" : "Client Directory"}
        description="View clients, account type, spend, and booking history."
      >
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {visibleClients.map((client) => (
            <div
              key={client.id}
              className="rounded-[30px] border border-[var(--color-gray-200)] bg-white p-6 shadow-[0_18px_60px_rgba(10,22,40,0.06)]"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--color-primary)] text-white">
                  <UserRound className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold text-[var(--color-primary)]">
                    {client.firstName} {client.lastName}
                  </div>
                  <div className="text-sm text-[var(--color-gray-600)]">
                    {client.accountType} | {client.tier}
                  </div>
                </div>
              </div>
              <div className="mt-5 space-y-3 text-sm text-[var(--color-gray-600)]">
                <div>{client.email}</div>
                <div>{client.phone}</div>
                <div>Total spend: {formatCurrency(client.totalSpend)}</div>
                <div>Bookings: {client.bookingCount}</div>
                {client.companyName && <div>Company: {client.companyName}</div>}
              </div>
            </div>
          ))}
        </div>
      </AdminShell>
    );
  }

  if (path.includes("/admin/drivers")) {
    return (
      <AdminShell
        title="Drivers"
        description="See driver status, city, rating, and current assignment."
      >
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {drivers.map((driver) => (
            <div
              key={driver.id}
              className="rounded-[30px] border border-[var(--color-gray-200)] bg-white p-6 shadow-[0_18px_60px_rgba(10,22,40,0.06)]"
            >
              <div className="font-display text-2xl font-bold tracking-[-0.04em] text-[var(--color-primary)]">
                {driver.name}
              </div>
              <div className="mt-2 text-sm text-[var(--color-gray-600)]">
                {driver.city} | {driver.status}
              </div>
              <div className="mt-5 space-y-3 text-sm text-[var(--color-gray-600)]">
                <div>{driver.phone}</div>
                <div>{driver.email}</div>
                <div>Rating: {driver.rating.toFixed(1)}</div>
                <div>Current: {driver.currentAssignment}</div>
              </div>
            </div>
          ))}
        </div>
      </AdminShell>
    );
  }

  if (path.includes("/admin/reports")) {
    return (
      <AdminShell
        title={path.includes("/revenue") ? "Revenue" : "Reports"}
        description="Revenue and booking activity by city and service type."
      >
        <div className="grid gap-6 xl:grid-cols-2">
          <ChartCard title="Revenue by city">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueByCity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#1A7FD4" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard title="Service breakdown">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={serviceBreakdown} dataKey="value" outerRadius={100} innerRadius={55}>
                  {serviceBreakdown.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
          <div className="rounded-[30px] border border-[var(--color-gray-200)] bg-white p-6 shadow-[0_18px_60px_rgba(10,22,40,0.06)] xl:col-span-2">
            <div className="font-display text-3xl font-bold tracking-[-0.04em] text-[var(--color-primary)]">
              Report shortcuts
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[
                "Daily Operations Report",
                "Monthly Revenue Report",
                "Fleet Utilisation Report",
                "Client Activity Report",
                "Maintenance Schedule Report",
                "Driver Performance Report",
              ].map((label) => (
                <div key={label} className="rounded-[24px] bg-[var(--color-gray-100)] p-5">
                  <FileBarChart className="h-5 w-5 text-[var(--color-accent)]" />
                  <div className="mt-4 font-semibold text-[var(--color-primary)]">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AdminShell>
    );
  }

  if (path.includes("/admin/settings")) {
    return (
      <AdminShell
        title="Settings"
        description="Manage business details, pricing rules, notifications, payment settings, and website content."
      >
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[
            "Company Settings",
            "Pricing Rules",
            "Booking Rules",
            "Notification Templates",
            "Payment Settings",
            "User Management",
            "CMS - Fleet Content",
            "CMS - Website Content",
            "Integrations",
          ].map((label) => (
            <div
              key={label}
              className="rounded-[30px] border border-[var(--color-gray-200)] bg-white p-6 shadow-[0_18px_60px_rgba(10,22,40,0.06)]"
            >
              <div className="font-semibold text-[var(--color-primary)]">{label}</div>
              <div className="mt-3 text-sm text-[var(--color-gray-600)]">
                Open this settings area.
              </div>
            </div>
          ))}
        </div>
      </AdminShell>
    );
  }

  const todaysBookings = bookings.filter((booking) =>
    booking.pickupDateTime.startsWith(new Date().toISOString().slice(0, 10)),
  ).length;
  const activeVehicles = vehicles.filter((vehicle) => vehicle.status === "On Hire").length;
  const pendingPayments = bookings.filter(
    (booking) => booking.paymentStatus === "Pending Payment",
  ).length;
  const revenueToday = bookings
    .filter((booking) => booking.pickupDateTime.startsWith(new Date().toISOString().slice(0, 10)))
    .reduce((sum, booking) => sum + booking.amount, 0);

  return (
    <AdminShell
      title="Dashboard"
      description="Today's bookings, vehicles on road, payments due, and recent activity."
      actions={
        <div className="flex flex-wrap gap-3">
          <Button asChild className="rounded-full">
            <Link to="/admin/bookings/new">
              <Plus className="mr-2 h-4 w-4" />
              New Booking
            </Link>
          </Button>
          <Button asChild variant="secondary" className="rounded-full">
            <Link to="/admin/reports/revenue">
              <ArrowRight className="mr-2 h-4 w-4" />
              Generate Report
            </Link>
          </Button>
        </div>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Today's bookings" value={String(todaysBookings)} icon={Clock3} />
        <MetricCard label="Vehicles on road" value={String(activeVehicles)} icon={CarFront} />
        <MetricCard label="Revenue today" value={formatCurrency(revenueToday)} icon={Activity} />
        <MetricCard label="Pending payments" value={String(pendingPayments)} icon={FileBarChart} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <ChartCard title="Revenue by city">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={revenueByCity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#1A7FD4" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <div className="rounded-[30px] border border-[var(--color-gray-200)] bg-white p-6 shadow-[0_18px_60px_rgba(10,22,40,0.06)]">
          <div className="font-display text-3xl font-bold tracking-[-0.04em] text-[var(--color-primary)]">
            Alerts
          </div>
          <div className="mt-6 space-y-4">
            {[
              `${vehicles.filter((vehicle) => vehicle.status === "Maintenance").length} vehicles in maintenance`,
              `${pendingPayments} bookings pending payment follow-up`,
              `${drivers.filter((driver) => driver.status === "Available").length} drivers available for assignment`,
            ].map((item) => (
              <div key={item} className="rounded-[22px] bg-[var(--color-gray-100)] p-4 text-sm text-[var(--color-gray-600)]">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
        <div className="rounded-[30px] border border-[var(--color-gray-200)] bg-white p-6 shadow-[0_18px_60px_rgba(10,22,40,0.06)]">
          <div className="font-display text-3xl font-bold tracking-[-0.04em] text-[var(--color-primary)]">
            Recent bookings
          </div>
          <div className="mt-6 space-y-4">
            {bookings.slice(0, 5).map((booking) => (
              <div key={booking.ref} className="rounded-[22px] bg-[var(--color-gray-100)] p-4">
                <div className="font-semibold text-[var(--color-primary)]">{booking.ref}</div>
                <div className="mt-1 text-sm text-[var(--color-gray-600)]">
                  {booking.status} | {booking.paymentStatus}
                </div>
                <div className="mt-1 text-xs uppercase tracking-[0.22em] text-[var(--color-gray-500)]">
                  {relativeDate(booking.createdAt)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[30px] border border-[var(--color-gray-200)] bg-white p-6 shadow-[0_18px_60px_rgba(10,22,40,0.06)]">
          <div className="font-display text-3xl font-bold tracking-[-0.04em] text-[var(--color-primary)]">
            Quick actions
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              { label: "New Booking", href: "/admin/bookings/new" },
              { label: "Fleet Overview", href: "/admin/fleet" },
              { label: "Client Directory", href: "/admin/clients" },
              { label: "Revenue Dashboard", href: "/admin/reports/revenue" },
            ].map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="rounded-[24px] bg-[var(--color-gray-100)] p-5 text-[var(--color-primary)] transition hover:bg-[var(--color-gray-200)]"
              >
                <div className="font-semibold">{item.label}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

function MetricCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof Activity;
}) {
  return (
    <div className="rounded-[30px] border border-[var(--color-gray-200)] bg-white p-6 shadow-[0_18px_60px_rgba(10,22,40,0.06)]">
      <div className="flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
          <Icon className="h-5 w-5" />
        </div>
        <div className="text-xs uppercase tracking-[0.22em] text-[var(--color-gray-500)]">
          {label}
        </div>
      </div>
      <div className="mt-6 font-display text-4xl font-bold tracking-[-0.05em] text-[var(--color-primary)]">
        {value}
      </div>
    </div>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-[30px] border border-[var(--color-gray-200)] bg-white p-6 shadow-[0_18px_60px_rgba(10,22,40,0.06)]">
      <div className="font-display text-3xl font-bold tracking-[-0.04em] text-[var(--color-primary)]">
        {title}
      </div>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function StatusSelect({
  value,
  options,
  onChange,
  refValue,
}: {
  value: string;
  options: string[];
  onChange: (value: { ref: string; status: string }) => void;
  refValue: string;
}) {
  return (
    <select
      value={value}
      onChange={(event) =>
        onChange({
          ref: refValue,
          status: event.target.value,
        })
      }
      className="h-11 rounded-full border border-[var(--color-gray-200)] bg-[var(--color-gray-100)] px-4 text-sm"
    >
      {options.map((option) => (
        <option key={option}>{option}</option>
      ))}
    </select>
  );
}

function AdminNewBooking() {
  return (
    <div className="rounded-[30px] border border-[var(--color-gray-200)] bg-white p-6 shadow-[0_18px_60px_rgba(10,22,40,0.06)]">
      <div className="grid gap-4 md:grid-cols-2">
        {[
          "Client lookup",
          "Pickup city",
          "Pickup location",
          "Vehicle selection",
          "Payment source",
          "Booking source",
        ].map((label) => (
          <label key={label} className="block">
            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-gray-500)]">
              {label}
            </div>
            <input
              className="h-14 w-full rounded-2xl border border-[var(--color-gray-200)] bg-[var(--color-gray-100)] px-4"
              placeholder={label}
            />
          </label>
        ))}
      </div>
      <div className="mt-6 flex gap-3">
        <Button className="rounded-full">Confirm Booking</Button>
        <Button variant="secondary" className="rounded-full">
          Save Draft
        </Button>
      </div>
    </div>
  );
}

