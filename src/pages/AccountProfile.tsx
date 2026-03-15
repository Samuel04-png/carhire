import type { ReactNode } from "react";
import { AccountShell } from "@/components/account/AccountShell";
import { useAppStore } from "@/store/use-app-store";

export default function AccountProfilePage() {
  const customerSessionId = useAppStore((state) => state.customerSessionId);
  const clients = useAppStore((state) => state.clients);
  const client = clients.find((item) => item.id === customerSessionId) ?? clients[0];

  return (
    <AccountShell
      title="My Profile"
      description="Review your saved details, preferred addresses, and notification settings."
    >
      <div className="grid gap-8">
        <div className="rounded-[34px] border border-[var(--color-gray-200)] bg-white p-6 shadow-[0_20px_70px_rgba(10,22,40,0.08)]">
          <div className="grid gap-4 md:grid-cols-2">
            <Info label="Name" value={`${client?.firstName} ${client?.lastName}`} />
            <Info label="Email" value={client?.email ?? ""} />
            <Info label="Phone" value={client?.phone ?? ""} />
            <Info label="Tier" value={client?.tier ?? ""} />
            <Info label="Licence" value={client?.licenseNumber ?? "Chauffeur-only profile"} />
            <Info label="Licence expiry" value={client?.licenseExpiry ?? "N/A"} />
          </div>
        </div>

        <div className="rounded-[34px] border border-[var(--color-gray-200)] bg-white p-6 shadow-[0_20px_70px_rgba(10,22,40,0.08)]">
          <div className="font-display text-3xl font-bold tracking-[-0.04em] text-[var(--color-primary)]">
            Saved addresses
          </div>
          <div className="mt-6 space-y-3">
            {client?.savedAddresses.map((address) => (
              <div key={address} className="rounded-[22px] bg-[var(--color-gray-100)] p-4 text-[var(--color-gray-600)]">
                {address}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[34px] border border-[var(--color-gray-200)] bg-white p-6 shadow-[0_20px_70px_rgba(10,22,40,0.08)]">
          <div className="font-display text-3xl font-bold tracking-[-0.04em] text-[var(--color-primary)]">
            Notification preferences
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {client &&
              Object.entries(client.preferences).map(([key, enabled]) => (
                <div key={key} className="rounded-[22px] bg-[var(--color-gray-100)] p-4">
                  <div className="font-semibold capitalize text-[var(--color-primary)]">
                    {key}
                  </div>
                  <div className="mt-2 text-sm text-[var(--color-gray-600)]">
                    {enabled ? "Enabled" : "Disabled"}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </AccountShell>
  );
}

function Info({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-[24px] bg-[var(--color-gray-100)] p-4">
      <div className="text-xs uppercase tracking-[0.24em] text-[var(--color-gray-500)]">
        {label}
      </div>
      <div className="mt-3 text-[var(--color-primary)]">{value}</div>
    </div>
  );
}
