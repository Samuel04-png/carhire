import toast from "react-hot-toast";
import { Activity, Building2, CarFront, Download, FileBarChart } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AdminShell } from "@/components/admin/AdminShell";
import { bookingStatusOptions } from "@/components/admin/admin-constants";
import { MetricCard, SurfaceCard, bookingStatusColor, buildCsv, downloadFile } from "@/components/admin/AdminUi";
import { Button } from "@/components/ui/button";
import { cities } from "@/data/site";
import { formatCurrency } from "@/lib/format";
import { useAppStore } from "@/store/use-app-store";

export function AdminReportsScreen() {
  const bookings = useAppStore((state) => state.bookings);
  const vehicles = useAppStore((state) => state.vehicles);
  const clients = useAppStore((state) => state.clients);
  const drivers = useAppStore((state) => state.drivers);

  const revenueByCity = cities.map((city) => ({
    name: city,
    revenue: bookings.filter((booking) => booking.pickupCity === city).reduce((sum, booking) => sum + booking.amount, 0),
  }));
  const bookingMix = bookingStatusOptions.map((status) => ({
    name: status,
    value: bookings.filter((booking) => booking.status === status).length,
    color: bookingStatusColor(status),
  }));
  const topClients = [...clients].sort((a, b) => b.totalSpend - a.totalSpend).slice(0, 5).map((client) => ({ client: `${client.firstName} ${client.lastName}`, spend: client.totalSpend }));
  const outstandingValue = clients.reduce((sum, client) => sum + (client.outstandingBalance ?? 0), 0);

  const downloadRevenueCsv = () => {
    downloadFile("revenue-by-city.csv", buildCsv(revenueByCity.map((item) => ({ city: item.name, revenue: item.revenue }))), "text/csv;charset=utf-8");
    toast.success("Revenue CSV exported.");
  };

  const downloadOperationsSummary = () => {
    const lines = [
      "Shark Car Hire Operations Summary",
      `Generated: ${new Date().toLocaleString()}`,
      "",
      `Total bookings: ${bookings.length}`,
      `Paid bookings: ${bookings.filter((booking) => booking.paymentStatus === "Paid").length}`,
      `Outstanding value: ${formatCurrency(outstandingValue)}`,
      `Available vehicles: ${vehicles.filter((vehicle) => vehicle.status === "Available").length}`,
      `Drivers available: ${drivers.filter((driver) => driver.status === "Available").length}`,
    ];
    downloadFile("operations-summary.txt", lines.join("\n"), "text/plain;charset=utf-8");
    toast.success("Operations summary downloaded.");
  };

  return (
    <AdminShell
      title="Reports"
      description="Export operational summaries, review financial pressure points, and compare booking movement by city and status."
      actions={<div className="flex flex-wrap gap-3"><Button type="button" className="rounded-full" onClick={downloadRevenueCsv}><Download className="mr-2 h-4 w-4" />Export Revenue CSV</Button><Button type="button" variant="secondary" className="rounded-full" onClick={downloadOperationsSummary}><FileBarChart className="mr-2 h-4 w-4" />Download Summary</Button></div>}
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Gross booking value" value={formatCurrency(bookings.reduce((sum, booking) => sum + booking.amount, 0))} icon={Activity} accent="blue" />
        <MetricCard label="Outstanding balance" value={formatCurrency(outstandingValue)} icon={FileBarChart} accent="amber" />
        <MetricCard label="Corporate clients" value={String(clients.filter((client) => client.accountType === "Corporate").length)} icon={Building2} accent="navy" />
        <MetricCard label="Available vehicles" value={String(vehicles.filter((vehicle) => vehicle.status === "Available").length)} icon={CarFront} accent="green" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <SurfaceCard title="Revenue by city" subtitle="Current booking totals grouped by operating city.">
          <div className="h-[320px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={revenueByCity}><CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" /><XAxis dataKey="name" /><YAxis /><Tooltip formatter={(value: number) => formatCurrency(value)} /><Bar dataKey="revenue" fill="#1A7FD4" radius={[12, 12, 0, 0]} /></BarChart></ResponsiveContainer></div>
        </SurfaceCard>
        <SurfaceCard title="Booking status mix" subtitle="Operational spread across current reservation states.">
          <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div className="h-[260px]"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={bookingMix} dataKey="value" innerRadius={56} outerRadius={90}>{bookingMix.map((item) => <Cell key={item.name} fill={item.color} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></div>
            <div className="space-y-3">{bookingMix.map((item) => <div key={item.name} className="flex items-center justify-between rounded-[20px] bg-[var(--color-gray-100)] px-4 py-3"><div className="flex items-center gap-3"><span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} /><span className="text-sm font-medium text-[var(--color-gray-600)]">{item.name}</span></div><span className="font-semibold text-[var(--color-primary)]">{item.value}</span></div>)}</div>
          </div>
        </SurfaceCard>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
        <SurfaceCard title="Top clients by spend" subtitle="Current highest-value accounts.">
          <div className="space-y-4">{topClients.map((client) => <div key={client.client} className="flex items-center justify-between rounded-[24px] bg-[var(--color-gray-100)] px-4 py-4"><div className="font-semibold text-[var(--color-primary)]">{client.client}</div><div className="text-sm font-semibold text-[var(--color-primary)]">{formatCurrency(client.spend)}</div></div>)}</div>
        </SurfaceCard>
        <SurfaceCard title="Report shortcuts" subtitle="Every action below downloads a real file.">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { label: "Daily operations report", action: downloadOperationsSummary, summary: "Snapshot of bookings, driver readiness, and outstanding items." },
              { label: "Monthly revenue export", action: downloadRevenueCsv, summary: "City-level revenue CSV for finance review." },
              { label: "Fleet utilisation report", action: () => { downloadFile("fleet-utilisation.csv", buildCsv(vehicles.map((vehicle) => ({ vehicle: vehicle.name, city: vehicle.currentCity, status: vehicle.status, next_booking: vehicle.nextBookingDate }))), "text/csv;charset=utf-8"); toast.success("Fleet utilisation report exported."); }, summary: "Vehicle status, city placement, and next booking timing." },
              { label: "Client activity report", action: () => { downloadFile("client-activity.csv", buildCsv(clients.map((client) => ({ client: `${client.firstName} ${client.lastName}`, account_type: client.accountType, bookings: client.bookingCount, total_spend: client.totalSpend }))), "text/csv;charset=utf-8"); toast.success("Client activity report exported."); }, summary: "Bookings and spend by client record." },
            ].map((item) => <button key={item.label} type="button" onClick={item.action} className="rounded-[24px] border border-[var(--color-gray-200)] bg-white p-5 text-left transition hover:-translate-y-[2px] hover:shadow-[0_18px_36px_rgba(10,22,40,0.08)]"><Download className="h-5 w-5 text-[var(--color-accent)]" /><div className="mt-4 font-semibold text-[var(--color-primary)]">{item.label}</div><div className="mt-2 text-sm text-[var(--color-gray-600)]">{item.summary}</div></button>)}
          </div>
        </SurfaceCard>
      </div>
    </AdminShell>
  );
}
