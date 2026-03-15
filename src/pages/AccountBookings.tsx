import { Link } from "react-router-dom";
import { AccountShell } from "@/components/account/AccountShell";
import { formatCurrency, formatDateOnly } from "@/lib/format";
import { useAppStore } from "@/store/use-app-store";

export default function AccountBookingsPage() {
  const customerSessionId = useAppStore((state) => state.customerSessionId);
  const bookings = useAppStore((state) => state.bookings);
  const vehicles = useAppStore((state) => state.vehicles);

  const customerBookings = bookings.filter((item) => item.clientId === customerSessionId);

  return (
    <AccountShell
      title="My Bookings"
      description="View upcoming, active, and completed bookings in one place."
    >
      <div className="rounded-[34px] border border-[var(--color-gray-200)] bg-white p-6 shadow-[0_20px_70px_rgba(10,22,40,0.08)]">
        <div className="space-y-4">
          {customerBookings.map((booking) => {
            const vehicle = vehicles.find((item) => item.id === booking.vehicleId);
            return (
              <div key={booking.ref} className="rounded-[28px] bg-[var(--color-gray-100)] p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="font-semibold text-[var(--color-primary)]">
                      {booking.ref}
                    </div>
                    <div className="mt-1 text-sm text-[var(--color-gray-600)]">
                      {vehicle?.name} | {formatDateOnly(booking.pickupDateTime)} to {" "}
                      {formatDateOnly(booking.returnDateTime)}
                    </div>
                  </div>
                  <div className="text-sm text-[var(--color-gray-600)]">
                    {booking.status} | {booking.paymentStatus}
                  </div>
                  <div className="font-semibold text-[var(--color-primary)]">
                    {formatCurrency(booking.amount)}
                  </div>
                  <Link
                    to={`/booking/confirmation/${booking.ref}`}
                    className="text-sm font-semibold text-[var(--color-accent)]"
                  >
                    View
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AccountShell>
  );
}
