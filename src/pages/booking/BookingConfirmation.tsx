import { CheckCircle2, Download, MessageCircle } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDateOnly } from "@/lib/format";
import { useAppStore } from "@/store/use-app-store";

export default function BookingConfirmation() {
  const { ref } = useParams();
  const bookings = useAppStore((state) => state.bookings);
  const vehicles = useAppStore((state) => state.vehicles);
  const clients = useAppStore((state) => state.clients);

  const booking = bookings.find((item) => item.ref === ref);
  const vehicle = booking ? vehicles.find((item) => item.id === booking.vehicleId) : null;
  const client = booking ? clients.find((item) => item.id === booking.clientId) : null;

  const handlePrint = () => window.print();

  if (!booking || !vehicle || !client) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-32 text-center">
        <div className="font-display text-4xl font-bold text-[var(--color-primary)]">
          Booking not found
        </div>
        <div className="mt-4 text-[var(--color-gray-600)]">
          We could not find that booking reference.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-gray-100)] px-4 pb-20 pt-28">
      <div className="mx-auto max-w-4xl rounded-[36px] border border-[var(--color-gray-200)] bg-white p-8 text-center shadow-[0_20px_90px_rgba(10,22,40,0.12)] md:p-12">
        <div className="mx-auto grid h-28 w-28 place-items-center rounded-full bg-[var(--color-success)]/10 text-[var(--color-success)]">
          <CheckCircle2 className="h-14 w-14" />
        </div>
        <div className="mt-8 text-xs uppercase tracking-[0.26em] text-[var(--color-accent)]">
          Booking confirmed
        </div>
        <h1 className="mt-4 font-display text-5xl font-bold tracking-[-0.06em] text-[var(--color-primary)]">
          {booking.ref}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-[var(--color-gray-600)]">
          Your booking has been saved under this reference. Keep it close if you need
          to change dates, confirm details, or speak with our team before pickup.
        </p>

        <div className="mt-10 grid gap-4 rounded-[30px] bg-[var(--color-gray-100)] p-6 md:grid-cols-2">
          <div className="rounded-[24px] bg-white p-5 text-left">
            <div className="text-xs uppercase tracking-[0.24em] text-[var(--color-gray-500)]">
              Vehicle
            </div>
            <div className="mt-3 font-semibold text-[var(--color-primary)]">
              {vehicle.name}
            </div>
          </div>
          <div className="rounded-[24px] bg-white p-5 text-left">
            <div className="text-xs uppercase tracking-[0.24em] text-[var(--color-gray-500)]">
              Pickup details
            </div>
            <div className="mt-3 font-semibold text-[var(--color-primary)]">
              {booking.pickupLocation}
            </div>
            <div className="mt-1 text-sm text-[var(--color-gray-600)]">
              {formatDateOnly(booking.pickupDateTime)}
            </div>
          </div>
          <div className="rounded-[24px] bg-white p-5 text-left">
            <div className="text-xs uppercase tracking-[0.24em] text-[var(--color-gray-500)]">
              Total paid
            </div>
            <div className="mt-3 font-semibold text-[var(--color-primary)]">
              {formatCurrency(booking.amount)}
            </div>
          </div>
          <div className="rounded-[24px] bg-white p-5 text-left">
            <div className="text-xs uppercase tracking-[0.24em] text-[var(--color-gray-500)]">
              Status
            </div>
            <div className="mt-3 font-semibold text-[var(--color-primary)]">
              {booking.status} | {booking.paymentStatus}
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-[30px] bg-[var(--color-primary)] p-6 text-left text-white">
          <div className="font-display text-2xl font-bold tracking-[-0.04em]">
            What happens next
          </div>
          <div className="mt-5 space-y-4 text-sm text-white/72">
            <div>1. Keep your booking reference for any updates or questions.</div>
            <div>2. Our team confirms the final trip details before pickup.</div>
            <div>3. If a chauffeur is included, driver details are shared ahead of the journey.</div>
          </div>
        </div>

        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Button variant="secondary" className="rounded-full" onClick={handlePrint}>
            <Download className="mr-2 h-4 w-4" />
            Print Booking Details
          </Button>
          <Button asChild className="rounded-full">
            <Link to="/account/bookings">Manage My Booking</Link>
          </Button>
          <Button asChild variant="ghost" className="rounded-full">
            <Link to="/fleet">Book Another Vehicle</Link>
          </Button>
        </div>

        <a
          href="https://wa.me/260970000000"
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#25D366]/10 px-6 py-3 text-sm font-semibold text-[#25D366]"
        >
          <MessageCircle className="h-4 w-4" />
          Questions? Chat With Us
        </a>
      </div>
    </div>
  );
}
