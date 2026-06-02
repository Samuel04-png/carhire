import { useMemo } from "react";
import toast from "react-hot-toast";
import { Link, Navigate, useParams } from "react-router-dom";
import { CheckCircle2, FileSignature } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDateOnly } from "@/lib/format";
import { useAppStore } from "@/store/use-app-store";

const agreementTerms = [
  "The renter confirms that all booking details, driver information, and contact information are accurate.",
  "The vehicle must be returned on the agreed return date and location unless Dots Car Hire approves an extension.",
  "The renter is responsible for fuel, traffic penalties, loss, negligent damage, and any agreed excess fees during the rental period.",
  "Dots Car Hire may cancel or suspend the rental if payment, identity, or safety checks fail.",
];

export default function BookingAgreementPage() {
  const { ref } = useParams();
  const bookings = useAppStore((state) => state.bookings);
  const vehicles = useAppStore((state) => state.vehicles);
  const clients = useAppStore((state) => state.clients);
  const acceptAgreement = useAppStore((state) => state.acceptAgreement);
  const booking = bookings.find((item) => item.ref === ref);
  const vehicle = useMemo(() => vehicles.find((item) => item.id === booking?.vehicleId), [booking?.vehicleId, vehicles]);
  const client = useMemo(() => clients.find((item) => item.id === booking?.clientId), [booking?.clientId, clients]);

  if (!booking || !vehicle || !client) {
    return <Navigate to="/booking/lookup" replace />;
  }

  const clientName = `${client.firstName} ${client.lastName}`;
  const canAccept = ["Approved", "Agreement Sent"].includes(booking.status) && !booking.agreementAccepted;

  return (
    <section className="bg-[var(--color-gray-100)] px-4 py-28">
      <div className="mx-auto max-w-4xl rounded-[36px] border border-[var(--color-gray-200)] bg-white p-6 shadow-[0_24px_80px_rgba(10,22,40,0.08)] md:p-10">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--color-gray-200)] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[var(--color-gray-100)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]"><FileSignature className="h-4 w-4" />Rental Agreement</div>
            <h1 className="mt-4 text-3xl font-semibold text-[var(--color-primary)] md:text-4xl">Dots Car Hire Rental Agreement</h1>
            <p className="mt-2 text-sm text-[var(--color-gray-600)]">Booking {booking.ref} — generated after admin approval.</p>
          </div>
          <div className="rounded-2xl bg-[var(--color-primary)] px-4 py-3 text-sm font-semibold text-white">{booking.agreementAccepted ? "Accepted" : "Awaiting acceptance"}</div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Info label="Client" value={clientName} />
          <Info label="Vehicle" value={`${vehicle.name} (${vehicle.category})`} />
          <Info label="Pickup" value={`${formatDateOnly(booking.pickupDateTime)} — ${booking.pickupLocation}`} />
          <Info label="Drop-off" value={`${formatDateOnly(booking.returnDateTime)} — ${booking.dropoffLocation ?? booking.pickupLocation}`} />
          <Info label="Rental amount" value={formatCurrency(booking.amount)} />
          <Info label="Agreement status" value={booking.agreementAccepted ? `Accepted by ${booking.acceptedBy} on ${booking.acceptedAt ? formatDateOnly(booking.acceptedAt) : "recorded date"}` : "Not yet accepted"} />
        </div>

        <div className="mt-8 rounded-[28px] bg-[var(--color-gray-100)] p-5">
          <h2 className="text-lg font-semibold text-[var(--color-primary)]">Terms</h2>
          <ol className="mt-4 space-y-3 text-sm leading-6 text-[var(--color-gray-600)]">
            {agreementTerms.map((term, index) => <li key={term}><strong>{index + 1}.</strong> {term}</li>)}
          </ol>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button disabled={!canAccept} onClick={() => {
            acceptAgreement(booking.ref, clientName);
            toast.success("Agreement accepted and timestamped.");
          }} className="rounded-full">
            <CheckCircle2 className="mr-2 h-4 w-4" />I Agree / I Approve
          </Button>
          <Button asChild variant="outline" className="rounded-full"><Link to={`/booking/confirmation/${booking.ref}`}>Back to booking</Link></Button>
        </div>
      </div>
    </section>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-[var(--color-gray-200)] p-4"><div className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-gray-500)]">{label}</div><div className="mt-2 font-semibold text-[var(--color-primary)]">{value}</div></div>;
}
