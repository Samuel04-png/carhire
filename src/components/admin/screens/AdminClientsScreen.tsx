import { Building2, FileBarChart, Mail, Phone, ShieldCheck, Users2 } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { MetricCard, StatusPill, SurfaceCard, inputClassName, toPhoneHref, toWhatsAppHref } from "@/components/admin/AdminUi";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import { useAppStore } from "@/store/use-app-store";
import { useLocation } from "react-router-dom";
import { useState } from "react";

export function AdminClientsScreen() {
  const location = useLocation();
  const clients = useAppStore((state) => state.clients);
  const bookings = useAppStore((state) => state.bookings);
  const corporateOnly = location.pathname.includes("/corporate");
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"All" | "Individual" | "Corporate">(corporateOnly ? "Corporate" : "All");

  const filteredClients = clients.filter((client) => {
    const haystack = `${client.firstName} ${client.lastName} ${client.email} ${client.companyName ?? ""}`.toLowerCase();
    if (query && !haystack.includes(query.trim().toLowerCase())) return false;
    if (typeFilter !== "All" && client.accountType !== typeFilter) return false;
    return true;
  });

  return (
    <AdminShell title={corporateOnly ? "Corporate Accounts" : "Client Directory"} description="View client value, contact routes, loyalty level, and outstanding balance without leaving the admin workspace.">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total clients" value={String(clients.length)} icon={Users2} accent="blue" />
        <MetricCard label="Corporate" value={String(clients.filter((item) => item.accountType === "Corporate").length)} icon={Building2} accent="navy" />
        <MetricCard label="Gold or better" value={String(clients.filter((item) => ["Gold", "Platinum"].includes(item.tier)).length)} icon={ShieldCheck} accent="green" />
        <MetricCard label="Outstanding" value={formatCurrency(clients.reduce((sum, client) => sum + (client.outstandingBalance ?? 0), 0))} icon={FileBarChart} accent="amber" />
      </div>

      <SurfaceCard className="mt-6" title="Filter clients" subtitle="Search by name, email, or company.">
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <input className={inputClassName} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search clients" />
          <select className={inputClassName} value={typeFilter} onChange={(event) => setTypeFilter(event.target.value as "All" | "Individual" | "Corporate")}>
            <option value="All">All account types</option>
            <option value="Individual">Individual</option>
            <option value="Corporate">Corporate</option>
          </select>
        </div>
      </SurfaceCard>

      <div className="mt-6 grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
        {filteredClients.map((client) => {
          const clientBookings = bookings.filter((booking) => booking.clientId === client.id);
          return (
            <div key={client.id} className="rounded-[30px] border border-[var(--color-gray-200)] bg-white p-6 shadow-[0_18px_60px_rgba(10,22,40,0.06)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-semibold text-[var(--color-primary)]">{client.firstName} {client.lastName}</div>
                  <div className="text-sm text-[var(--color-gray-600)]">{client.accountType} · {client.tier}</div>
                </div>
                {client.outstandingBalance ? <StatusPill label="Balance due" tone="amber" /> : <StatusPill label="Clear" tone="green" />}
              </div>
              <div className="mt-5 space-y-3 text-sm text-[var(--color-gray-600)]">
                <div>{client.email}</div>
                <div>{client.phone}</div>
                {client.companyName && <div>Company: {client.companyName}</div>}
                <div>Total spend: {formatCurrency(client.totalSpend)}</div>
                <div>Bookings: {clientBookings.length}</div>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                <Button asChild size="sm" variant="secondary" className="rounded-full"><a href={`mailto:${client.email}`}><Mail className="mr-2 h-4 w-4" />Email</a></Button>
                <Button asChild size="sm" variant="secondary" className="rounded-full"><a href={toPhoneHref(client.phone)}><Phone className="mr-2 h-4 w-4" />Call</a></Button>
                <Button asChild size="sm" className="rounded-full"><a href={toWhatsAppHref(client.phone)} target="_blank" rel="noreferrer">WhatsApp</a></Button>
              </div>
            </div>
          );
        })}
      </div>
    </AdminShell>
  );
}
