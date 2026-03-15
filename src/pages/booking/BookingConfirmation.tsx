import { useEffect, useState } from "react";
import { CheckCircle2, Download, LoaderCircle, MessageCircle } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { getApiUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDateOnly } from "@/lib/format";
import { useAppStore } from "@/store/use-app-store";

type PaymentStatusPayload = {
  status?: "PENDING" | "SUCCESSFUL" | "FAILED" | string;
  reason?: string;
};

export default function BookingConfirmation() {
  const { ref } = useParams();
  const bookings = useAppStore((state) => state.bookings);
  const vehicles = useAppStore((state) => state.vehicles);
  const clients = useAppStore((state) => state.clients);
  const updateBookingStatus = useAppStore((state) => state.updateBookingStatus);
  const updatePaymentStatus = useAppStore((state) => state.updatePaymentStatus);
  const [momoStatusMessage, setMomoStatusMessage] = useState<string | null>(null);

  const booking = bookings.find((item) => item.ref === ref);
  const vehicle = booking ? vehicles.find((item) => item.id === booking.vehicleId) : null;
  const client = booking ? clients.find((item) => item.id === booking.clientId) : null;
  const requiresVerification =
    booking?.paymentStatus === "Pending Payment" || booking?.status === "Pending";
  const shouldPollMtn =
    booking?.paymentMethod === "MTN Mobile Money" &&
    booking.paymentStatus === "Pending Payment" &&
    Boolean(booking.paymentReferenceId);

  const handlePrint = () => window.print();

  useEffect(() => {
    if (!booking?.paymentReferenceId || !shouldPollMtn) {
      return;
    }

    let cancelled = false;
    let timeoutId: number | null = null;
    let attempts = 0;
    const maxAttempts = 24;

    const pollPaymentStatus = async () => {
      try {
        setMomoStatusMessage("Waiting for MTN MoMo approval on your phone.");
        const response = await fetch(
          getApiUrl(`/api/payments/momo/status/${booking.paymentReferenceId}`),
        );
        const payload = (await response.json()) as PaymentStatusPayload;

        if (cancelled) {
          return;
        }

        if (!response.ok) {
          throw new Error("Unable to check payment status right now.");
        }

        if (payload.status === "SUCCESSFUL") {
          updatePaymentStatus(booking.ref, "Paid", "MTN Mobile Money");
          updateBookingStatus(booking.ref, "Confirmed");
          setMomoStatusMessage("MTN MoMo payment confirmed. Your booking is now fully confirmed.");
          return;
        }

        if (payload.status === "FAILED") {
          setMomoStatusMessage(
            payload.reason ||
              "The MTN MoMo request was not completed. You can try again or contact our team.",
          );
          return;
        }

        attempts += 1;
        if (attempts >= maxAttempts) {
          setMomoStatusMessage(
            "The MTN prompt is still pending. Keep your booking reference and contact our team if you need help.",
          );
          return;
        }

        timeoutId = window.setTimeout(pollPaymentStatus, 5000);
      } catch (error) {
        console.error("[booking][BookingConfirmation] MTN status polling failed", error);
        attempts += 1;
        if (attempts >= maxAttempts) {
          setMomoStatusMessage(
            "We could not confirm the MTN payment automatically. Keep the booking reference and contact our team.",
          );
          return;
        }
        timeoutId = window.setTimeout(pollPaymentStatus, 5000);
      }
    };

    timeoutId = window.setTimeout(pollPaymentStatus, 1500);

    return () => {
      cancelled = true;
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [
    booking?.paymentReferenceId,
    booking?.ref,
    shouldPollMtn,
    updateBookingStatus,
    updatePaymentStatus,
  ]);

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
          {requiresVerification ? "Booking received" : "Booking confirmed"}
        </div>
        <h1 className="mt-4 font-display text-5xl font-bold tracking-[-0.06em] text-[var(--color-primary)]">
          {booking.ref}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-[var(--color-gray-600)]">
          {requiresVerification
            ? "Your booking is now waiting for payment verification. Keep this reference close while our team confirms receipt and shares the final WhatsApp update."
            : "Your booking has been saved under this reference. Keep it close if you need to change dates, confirm details, or speak with our team before pickup."}
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
              {requiresVerification ? "Amount pending verification" : "Total paid"}
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

        {momoStatusMessage && (
          <div className="mt-6 rounded-[24px] border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/8 p-5 text-left text-sm leading-7 text-[var(--color-primary)]">
            <div className="flex items-start gap-3">
              {shouldPollMtn ? <LoaderCircle className="mt-1 h-5 w-5 animate-spin text-[var(--color-accent)]" /> : <CheckCircle2 className="mt-1 h-5 w-5 text-[var(--color-success)]" />}
              <div>
                <div className="font-semibold">MTN MoMo status</div>
                <div className="mt-1">{momoStatusMessage}</div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-10 rounded-[30px] bg-[var(--color-primary)] p-6 text-left text-white">
          <div className="font-display text-2xl font-bold tracking-[-0.04em]">
            What happens next
          </div>
          <div className="mt-5 space-y-4 text-sm text-white/72">
            {requiresVerification ? (
              <>
                <div>1. Keep your booking reference for any updates or questions.</div>
                <div>2. Our team verifies the payment or corporate billing instruction manually.</div>
                <div>3. You receive a WhatsApp confirmation once the booking is cleared.</div>
              </>
            ) : (
              <>
                <div>1. Keep your booking reference for any updates or questions.</div>
                <div>2. Our team confirms the final trip details before pickup.</div>
                <div>3. If a chauffeur is included, driver details are shared ahead of the journey.</div>
              </>
            )}
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
          href="https://wa.me/260972826350"
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
