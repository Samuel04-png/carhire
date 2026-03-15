import { AccountShell } from "@/components/account/AccountShell";
import { formatCurrency, formatDateOnly } from "@/lib/format";
import { useAppStore } from "@/store/use-app-store";

export default function AccountDashboardPage() {
  const customerSessionId = useAppStore((state) => state.customerSessionId);
  const clients = useAppStore((state) => state.clients);
  const bookings = useAppStore((state) => state.bookings);
  const vehicles = useAppStore((state) => state.vehicles);
  const client = clients.find((item) => item.id === customerSessionId) ?? clients[0];
  const customerBookings = bookings.filter((item) => item.clientId === client?.id);

  return (
    <AccountShell
      title={`Welcome back, ${client?.firstName ?? "Client"}`}
      description="See your active bookings, recent travel, loyalty balance, and account activity."
    >
      <div className="space-y-8">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Active bookings", customerBookings.filter((item) => item.status === "Active" || item.status === "Confirmed").length],
            ["Total spend", formatCurrency(client?.totalSpend ?? 0)],
            ["Loyalty points", client?.loyaltyPoints ?? 0],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-[30px] border border-[var(--color-gray-200)] bg-white p-6 shadow-[0_18px_60px_rgba(10,22,40,0.06)]"
            >
              <div className="text-xs uppercase tracking-[0.24em] text-[var(--color-gray-500)]">
                {label}
              </div>
              <div className="mt-4 font-display text-4xl font-bold tracking-[-0.05em] text-[var(--color-primary)]">
                {value}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-[34px] border border-[var(--color-gray-200)] bg-white p-6 shadow-[0_20px_70px_rgba(10,22,40,0.08)]">
          <div className="font-display text-3xl font-bold tracking-[-0.04em] text-[var(--color-primary)]">
            Upcoming bookings
          </div>
          <div className="mt-6 space-y-4">
            {customerBookings.slice(0, 3).map((booking) => {
              const vehicle = vehicles.find((item) => item.id === booking.vehicleId);
              return (
                <div key={booking.ref} className="rounded-[26px] bg-[var(--color-gray-100)] p-5">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="font-semibold text-[var(--color-primary)]">
                        {booking.ref} | {vehicle?.name}
                      </div>
                      <div className="mt-1 text-sm text-[var(--color-gray-600)]">
                        {formatDateOnly(booking.pickupDateTime)} to {" "}
                        {formatDateOnly(booking.returnDateTime)} | {booking.status}
                      </div>
                    </div>
                    <div className="font-semibold text-[var(--color-primary)]">
                      {formatCurrency(booking.amount)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AccountShell>
  );
}
