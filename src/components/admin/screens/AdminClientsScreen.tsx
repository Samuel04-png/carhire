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
            <article key={client.id} className="rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-white p-5 shadow-[var(--shadow-card)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--brand)] hover:shadow-[var(--shadow-card-hover)]">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-display text-xl font-semibold tracking-[-0.035em] text-[var(--text-main)]">{client.firstName} {client.lastName}</div>
                  <div className="mt-1 text-sm text-[var(--text-muted)]">{client.accountType} · {client.tier}</div>
                </div>
                {client.outstandingBalance ? <StatusPill label="Balance due" tone="amber" /> : <StatusPill label="Clear" tone="green" />}
              </div>
              <div className="mt-5 rounded-[var(--radius-lg)] bg-[var(--bg-surface-soft)] p-4 ring-1 ring-[var(--border-subtle)]">
                <div className="grid gap-3 text-sm text-[var(--text-muted)]">
                  <div className="truncate">{client.email}</div>
                  <div>{client.phone}</div>
                  {client.companyName && <div>Company: <strong className="text-[var(--text-main)]">{client.companyName}</strong></div>}
                  <div className="flex justify-between gap-3"><span>Total spend</span><strong className="font-mono text-[var(--text-main)]">{formatCurrency(client.totalSpend)}</strong></div>
                  <div className="flex justify-between gap-3"><span>Bookings</span><strong className="text-[var(--text-main)]">{clientBookings.length}</strong></div>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                <Button asChild size="sm" variant="secondary"><a href={`mailto:${client.email}`}><Mail className="mr-2 h-4 w-4" />Email</a></Button>
                <Button asChild size="sm" variant="secondary"><a href={toPhoneHref(client.phone)}><Phone className="mr-2 h-4 w-4" />Call</a></Button>
                <Button asChild size="sm"><a href={toWhatsAppHref(client.phone)} target="_blank" rel="noreferrer">WhatsApp</a></Button>
              </div>
            </article>
          );
        })}
      </div>
    </AdminShell>
  );
}
