import { ExternalLink, FileSignature } from "lucide-react";
import { Link } from "react-router-dom";
import { AdminShell } from "@/components/admin/AdminShell";
import { EmptyState, StatusPill, SurfaceCard, bookingStatusTone } from "@/components/admin/AdminUi";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDateOnly } from "@/lib/format";
import { useAppStore } from "@/store/use-app-store";

export function AdminAgreementsScreen() {
  const bookings = useAppStore((state) => state.bookings);
  const vehicles = useAppStore((state) => state.vehicles);
  const clients = useAppStore((state) => state.clients);
  const agreementBookings = bookings.filter((booking) => ["Agreement Sent", "Agreement Accepted", "Active", "Completed"].includes(booking.status) || booking.agreementStatus !== "Not Sent");

  return (
    <AdminShell title="Agreements" description="Rental agreements generated after admin approval, including client digital acceptance status and timestamp.">
      <div className="grid gap-4 md:grid-cols-3">
        <SurfaceCard title="Sent" subtitle={String(agreementBookings.filter((item) => item.agreementStatus === "Sent").length)}><div /></SurfaceCard>
        <SurfaceCard title="Accepted" subtitle={String(agreementBookings.filter((item) => item.agreementAccepted).length)}><div /></SurfaceCard>
        <SurfaceCard title="Pending signature" subtitle={String(agreementBookings.filter((item) => !item.agreementAccepted).length)}><div /></SurfaceCard>
      </div>
      <div className="mt-6 space-y-4">
        {agreementBookings.map((booking) => {
          const vehicle = vehicles.find((item) => item.id === booking.vehicleId);
          const client = clients.find((item) => item.id === booking.clientId);
          return (
            <div key={booking.ref} className="rounded-xl border border-[var(--color-gray-200)] bg-white p-5 shadow-sm">
              <div className="grid gap-5 lg:grid-cols-[1fr_1fr_auto] lg:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-2"><FileSignature className="h-4 w-4 text-[var(--color-accent)]" /><span className="font-semibold text-[var(--color-primary)]">{booking.ref}</span><StatusPill label={booking.status} tone={bookingStatusTone(booking.status)} /></div>
                  <div className="mt-2 text-sm text-[var(--color-gray-600)]">{client?.firstName} {client?.lastName} — {vehicle?.name}</div>
                </div>
                <div className="text-sm text-[var(--color-gray-600)]">
                  <div>Agreement: <strong>{booking.agreementAccepted ? "Accepted" : booking.agreementStatus ?? "Not Sent"}</strong></div>
                  <div>Accepted by: {booking.acceptedBy ?? "Awaiting client"}</div>
                  <div>Accepted at: {booking.acceptedAt ? formatDateOnly(booking.acceptedAt) : "—"}</div>
                  <div>Amount: {formatCurrency(booking.amount)}</div>
                </div>
                <Button asChild className="rounded-full"><Link to={`/booking/agreement/${booking.ref}`}><ExternalLink className="mr-2 h-4 w-4" />Open agreement</Link></Button>
              </div>
            </div>
          );
        })}
        {agreementBookings.length === 0 && <EmptyState title="No agreements yet" description="Approve a pending booking to generate a client rental agreement." />}
      </div>
    </AdminShell>
  );
}
