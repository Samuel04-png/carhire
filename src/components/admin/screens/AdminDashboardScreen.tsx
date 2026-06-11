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
  const vehiclesOnRoad = vehicles.filter((vehicle) => vehicle.status === "On Hire" || vehicle.availableQuantity === 0);
  const availableCars = vehicles.reduce((sum, vehicle) => sum + vehicle.availableQuantity, 0);
  const totalFleet = vehicles.reduce((sum, vehicle) => sum + vehicle.totalQuantity, 0);
  const maintenanceVehicles = vehicles.filter((vehicle) => vehicle.status === "Maintenance");
  const revenueToday = todaysBookings.reduce((sum, booking) => sum + booking.amount, 0);
  const dispatchQueue = bookings.filter((booking) => ["Pending", "Approved", "Agreement Sent", "Agreement Accepted", "Active"].includes(booking.status)).slice(0, 5);
  const highValueClients = [...clients].sort((a, b) => b.totalSpend - a.totalSpend).slice(0, 4);
  const revenueByCity = cities.map((city) => ({
    name: city,
    revenue: bookings.filter((booking) => booking.pickupCity === city).reduce((sum, booking) => sum + booking.amount, 0),
  }));
  const leadingCity = [...revenueByCity].sort((a, b) => b.revenue - a.revenue)[0];
  const paymentMix = [
    { name: "Paid", value: bookings.filter((item) => item.paymentStatus === "Paid").length, color: "#1677d2" },
    { name: "Pending", value: bookings.filter((item) => item.paymentStatus === "Pending Payment").length, color: "#f59e0b" },
    { name: "Partial", value: bookings.filter((item) => item.paymentStatus === "Partial").length, color: "#071d33" },
    { name: "Refunded", value: bookings.filter((item) => item.paymentStatus === "Refunded").length, color: "#cbd5e1" },
  ];

  return (
    <AdminShell
      title="Dashboard"
      description="Executive view of bookings, dispatch readiness, payment follow-up, and fleet pressure points."
      actions={
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/admin/bookings/new">
              <CalendarRange className="mr-2 h-4 w-4" />
              New Booking
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/admin/reports/revenue">
              <ArrowRight className="mr-2 h-4 w-4" />
              Open Reports
            </Link>
          </Button>
        </div>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total fleet" value={String(totalFleet)} icon={CarFront} accent="blue" />
        <MetricCard label="Available cars" value={String(availableCars)} icon={CarFront} accent="green" />
        <MetricCard label="Vehicles on road" value={String(vehiclesOnRoad.length)} icon={Activity} accent="navy" />
        <MetricCard label="Pending payments" value={String(pendingPayments.length)} icon={FileBarChart} accent="amber" />
        <MetricCard label="Today's revenue" value={formatCurrency(revenueToday)} icon={FileBarChart} accent="blue" />
        <MetricCard label="Pending bookings" value={String(bookings.filter((item) => item.status === "Pending").length)} icon={Clock3} accent="amber" />
        <MetricCard label="Approved bookings" value={String(bookings.filter((item) => ["Approved", "Agreement Sent", "Agreement Accepted"].includes(item.status)).length)} icon={CalendarRange} accent="navy" />
        <MetricCard label="Completed rentals" value={String(bookings.filter((item) => item.status === "Completed").length)} icon={FileBarChart} accent="green" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <SurfaceCard title="Revenue by city" subtitle={leadingCity ? `${leadingCity.name} currently leads booking value at ${formatCurrency(leadingCity.revenue)}.` : "Current booking value across operating cities."}>
          <div className="rounded-[var(--radius-lg)] bg-[var(--bg-surface-soft)] p-4 ring-1 ring-[var(--border-subtle)]">
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueByCity} margin={{ top: 12, right: 16, left: 4, bottom: 4 }}>
                  <CartesianGrid vertical={false} stroke="#edf1f6" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#5f6f85", fontSize: 12 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: "#8a98aa", fontSize: 12 }} tickFormatter={(value) => `${Number(value) / 1000}k`} />
                  <Tooltip
                    cursor={{ fill: "rgba(22,119,210,0.07)" }}
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ borderRadius: 14, border: "1px solid #dfe7f0", boxShadow: "0 12px 35px rgba(15,23,42,0.10)" }}
                  />
                  <Bar dataKey="revenue" fill="#1677d2" radius={[12, 12, 6, 6]} barSize={48} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </SurfaceCard>

        <SurfaceCard title="Control alerts" subtitle="Issues that need operational attention.">
          <div className="space-y-3">
            <AlertTile title={`${maintenanceVehicles.length} vehicles in maintenance`} description="Check return-to-service timing before confirming new allocations." tone="amber" />
            <AlertTile title={`${pendingPayments.length} bookings need payment follow-up`} description="Pending and partial payments are the highest operational risk for no-shows." tone="blue" />
            <AlertTile title={`${drivers.filter((driver) => driver.status === "Available").length} drivers available`} description="Ready to cover airport runs, executive movement, and event dispatch." tone="green" />
          </div>
        </SurfaceCard>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <SurfaceCard title="Dispatch queue" subtitle="Bookings with active operational movement.">
          <div className="space-y-3">
            {dispatchQueue.map((booking) => (
              <div key={booking.ref} className="rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-white p-4 shadow-[var(--shadow-card)] transition-all duration-200 hover:border-[var(--brand)] hover:shadow-[var(--shadow-card)]">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="font-mono text-sm font-semibold text-[var(--text-main)]">{booking.ref}</div>
                      <StatusPill label={booking.status} tone={bookingStatusTone(booking.status)} />
                    </div>
                    <div className="mt-2 text-sm font-medium text-[var(--text-main)]">{booking.pickupCity}</div>
                    <div className="mt-1 text-sm text-[var(--text-muted)]">{formatDateTime(booking.pickupDateTime)}</div>
                  </div>
                  <Button asChild size="sm" variant="secondary">
                    <Link to="/admin/bookings">Open bookings</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </SurfaceCard>

        <SurfaceCard title="Payment mix" subtitle="Current payment completion profile across bookings.">
          <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div className="relative h-[250px] rounded-[var(--radius-lg)] bg-[var(--bg-surface-soft)] p-3 ring-1 ring-[var(--border-subtle)]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={paymentMix} dataKey="value" innerRadius={62} outerRadius={92} paddingAngle={3} cornerRadius={8}>
                    {paymentMix.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 14, border: "1px solid #dfe7f0", boxShadow: "0 12px 35px rgba(15,23,42,0.10)" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
                <div>
                  <div className="font-display text-2xl font-semibold text-[var(--text-main)]">{bookings.length}</div>
                  <div className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-soft)]">Bookings</div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {paymentMix.map((item) => (
                <div key={item.name} className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-white px-4 py-3 shadow-[var(--shadow-card)]">
                  <div className="flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full ring-4 ring-[var(--bg-surface-soft)]" style={{ backgroundColor: item.color }} />
                    <span className="text-sm font-semibold text-[var(--text-muted)]">{item.name}</span>
                  </div>
                  <span className="font-mono text-sm font-semibold text-[var(--text-main)]">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </SurfaceCard>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
        <SurfaceCard title="Top clients" subtitle="Accounts driving the highest value.">
          <div className="space-y-3">
            {highValueClients.map((client, index) => (
              <div key={client.id} className="flex flex-col gap-3 rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-white p-4 shadow-[var(--shadow-card)] sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-[var(--radius-md)] bg-[var(--bg-sidebar)] text-sm font-semibold text-white">
                    #{index + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-[var(--text-main)]">{client.firstName} {client.lastName}</div>
                    <div className="text-sm text-[var(--text-muted)]">{client.accountType}{client.companyName ? ` · ${client.companyName}` : ""}</div>
                  </div>
                </div>
                <div className="font-mono text-sm font-semibold text-[var(--text-main)]">{formatCurrency(client.totalSpend)}</div>
              </div>
            ))}
          </div>
        </SurfaceCard>

        <SurfaceCard title="Quick actions" subtitle="Jump straight into the most-used workflows.">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { label: "New booking", href: "/admin/bookings/new", icon: CalendarRange, summary: "Create a reservation" },
              { label: "Fleet overview", href: "/admin/fleet", icon: CarFront, summary: "Check vehicle readiness" },
              { label: "Client directory", href: "/admin/clients", icon: Users2, summary: "Review CRM records" },
              { label: "Settings", href: "/admin/settings", icon: FileBarChart, summary: "Update operating rules" },
            ].map((item) => (
              <Link key={item.href} to={item.href} className="group rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-white p-4 shadow-[var(--shadow-card)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--brand)] hover:shadow-[var(--shadow-card-hover)]">
                <div className="grid h-10 w-10 place-items-center rounded-[var(--radius-md)] bg-[var(--brand-soft)] text-[var(--brand)] transition group-hover:bg-[var(--brand)] group-hover:text-white">
                  <item.icon className="h-5 w-5" />
                </div>
                <div className="mt-4 font-semibold text-[var(--text-main)]">{item.label}</div>
                <div className="mt-1 text-sm text-[var(--text-muted)]">{item.summary}</div>
              </Link>
            ))}
          </div>
        </SurfaceCard>
      </div>
    </AdminShell>
  );
}
