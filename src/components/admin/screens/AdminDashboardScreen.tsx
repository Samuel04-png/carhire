import { Activity, ArrowRight, CalendarRange, CarFront, Clock3, FileBarChart, Users2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AdminShell } from "@/components/admin/AdminShell";
import { AlertTile, MetricCard, StatusPill, SurfaceCard, bookingStatusTone } from "@/components/admin/AdminUi";
import { Button } from "@/components/ui/button";
import { cities } from "@/data/site";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { useAppStore } from "@/store/use-app-store";

export function AdminDashboardScreen() {
  const bookings = useAppStore((state) => state.bookings);
  const vehicles = useAppStore((state) => state.vehicles);
  const clients = useAppStore((state) => state.clients);
  const drivers = useAppStore((state) => state.drivers);

  const todayKey = new Date().toISOString().slice(0, 10);
  const todaysBookings = bookings.filter((booking) => booking.pickupDateTime.startsWith(todayKey));
  const pendingPayments = bookings.filter((booking) => ["Pending Payment", "Partial"].includes(booking.paymentStatus));
  const vehiclesOnRoad = vehicles.filter((vehicle) => vehicle.status === "On Hire");
  const maintenanceVehicles = vehicles.filter((vehicle) => vehicle.status === "Maintenance");
  const revenueToday = todaysBookings.reduce((sum, booking) => sum + booking.amount, 0);
  const dispatchQueue = bookings.filter((booking) => ["Pending", "Confirmed", "Active"].includes(booking.status)).slice(0, 5);
  const highValueClients = [...clients].sort((a, b) => b.totalSpend - a.totalSpend).slice(0, 4);
  const revenueByCity = cities.map((city) => ({
    name: city,
    revenue: bookings.filter((booking) => booking.pickupCity === city).reduce((sum, booking) => sum + booking.amount, 0),
  }));
  const paymentMix = [
    { name: "Paid", value: bookings.filter((item) => item.paymentStatus === "Paid").length, color: "#1A7FD4" },
    { name: "Pending", value: bookings.filter((item) => item.paymentStatus === "Pending Payment").length, color: "#F59E0B" },
    { name: "Partial", value: bookings.filter((item) => item.paymentStatus === "Partial").length, color: "#0E4D8C" },
    { name: "Refunded", value: bookings.filter((item) => item.paymentStatus === "Refunded").length, color: "#CBD5E1" },
  ];

  return (
    <AdminShell
      title="Dashboard"
      description="Today's bookings, dispatch readiness, payment follow-up, and fleet pressure points in one view."
      actions={
        <div className="flex flex-wrap gap-3">
          <Button asChild className="rounded-full">
            <Link to="/admin/bookings/new">
              <CalendarRange className="mr-2 h-4 w-4" />
              New Booking
            </Link>
          </Button>
          <Button asChild variant="secondary" className="rounded-full">
            <Link to="/admin/reports/revenue">
              <ArrowRight className="mr-2 h-4 w-4" />
              Open Reports
            </Link>
          </Button>
        </div>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Today's bookings" value={String(todaysBookings.length)} icon={Clock3} accent="blue" />
        <MetricCard label="Vehicles on road" value={String(vehiclesOnRoad.length)} icon={CarFront} accent="navy" />
        <MetricCard label="Revenue today" value={formatCurrency(revenueToday)} icon={Activity} accent="green" />
        <MetricCard label="Pending payments" value={String(pendingPayments.length)} icon={FileBarChart} accent="amber" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <SurfaceCard title="Revenue by city" subtitle="Current booking value across the operating cities.">
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByCity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Bar dataKey="revenue" fill="#1A7FD4" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SurfaceCard>

        <SurfaceCard title="Control alerts" subtitle="Issues that need operational attention.">
          <div className="space-y-4">
            <AlertTile title={`${maintenanceVehicles.length} vehicles in maintenance`} description="Check return-to-service timing before confirming new allocations." tone="amber" />
            <AlertTile title={`${pendingPayments.length} bookings need payment follow-up`} description="Pending and partial payments are the highest operational risk for no-shows." tone="blue" />
            <AlertTile title={`${drivers.filter((driver) => driver.status === "Available").length} drivers available`} description="Ready to cover airport runs, executive movement, and event dispatch." tone="green" />
          </div>
        </SurfaceCard>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <SurfaceCard title="Dispatch queue" subtitle="Bookings with active operational movement.">
          <div className="space-y-4">
            {dispatchQueue.map((booking) => (
              <div key={booking.ref} className="rounded-[24px] border border-[var(--color-gray-200)] bg-[var(--color-gray-100)] p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="font-semibold text-[var(--color-primary)]">{booking.ref}</div>
                      <StatusPill label={booking.status} tone={bookingStatusTone(booking.status)} />
                    </div>
                    <div className="mt-2 text-sm text-[var(--color-gray-600)]">
                      {booking.pickupCity} | {formatDateTime(booking.pickupDateTime)}
                    </div>
                  </div>
                  <Button asChild size="sm" variant="secondary" className="rounded-full">
                    <Link to="/admin/bookings">Open bookings</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </SurfaceCard>

        <SurfaceCard title="Payment mix" subtitle="Current payment completion profile across bookings.">
          <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={paymentMix} dataKey="value" innerRadius={55} outerRadius={86}>
                    {paymentMix.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {paymentMix.map((item) => (
                <div key={item.name} className="flex items-center justify-between rounded-[20px] bg-[var(--color-gray-100)] px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm font-medium text-[var(--color-gray-600)]">{item.name}</span>
                  </div>
                  <span className="font-semibold text-[var(--color-primary)]">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </SurfaceCard>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
        <SurfaceCard title="Top clients" subtitle="Accounts driving the highest value.">
          <div className="space-y-4">
            {highValueClients.map((client) => (
              <div key={client.id} className="flex flex-col gap-3 rounded-[24px] border border-[var(--color-gray-200)] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--color-primary)] text-white">
                    <Users2 className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-[var(--color-primary)]">{client.firstName} {client.lastName}</div>
                    <div className="text-sm text-[var(--color-gray-600)]">{client.accountType}{client.companyName ? ` · ${client.companyName}` : ""}</div>
                  </div>
                </div>
                <div className="text-sm font-semibold text-[var(--color-primary)]">{formatCurrency(client.totalSpend)}</div>
              </div>
            ))}
          </div>
        </SurfaceCard>

        <SurfaceCard title="Quick actions" subtitle="Jump straight into the most-used workflows.">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { label: "New booking", href: "/admin/bookings/new", icon: CalendarRange },
              { label: "Fleet overview", href: "/admin/fleet", icon: CarFront },
              { label: "Client directory", href: "/admin/clients", icon: Users2 },
              { label: "Settings", href: "/admin/settings", icon: FileBarChart },
            ].map((item) => (
              <Link key={item.href} to={item.href} className="rounded-[26px] border border-[var(--color-gray-200)] bg-white p-5 transition hover:-translate-y-[2px] hover:shadow-[0_18px_40px_rgba(10,22,40,0.08)]">
                <item.icon className="h-5 w-5 text-[var(--color-accent)]" />
                <div className="mt-4 font-semibold text-[var(--color-primary)]">{item.label}</div>
                <div className="mt-1 text-sm text-[var(--color-gray-600)]">Open this area.</div>
              </Link>
            ))}
          </div>
        </SurfaceCard>
      </div>
    </AdminShell>
  );
}
