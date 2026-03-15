import type { ReactNode } from "react";
import { LayoutDashboard, UserRound, WalletCards } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const links = [
  { href: "/account/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/account/bookings", label: "My Bookings", icon: WalletCards },
  { href: "/account/profile", label: "Profile", icon: UserRound },
];

export function AccountShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  const location = useLocation();

  return (
    <div className="bg-[var(--color-gray-100)] pb-20 pt-28">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8">
          <div className="text-xs uppercase tracking-[0.28em] text-[var(--color-accent)]">
            Customer Portal
          </div>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-[-0.05em] text-[var(--color-primary)]">
            {title}
          </h1>
          <p className="mt-3 text-[var(--color-gray-600)]">{description}</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="rounded-[32px] border border-[var(--color-gray-200)] bg-white p-4 shadow-[0_20px_70px_rgba(10,22,40,0.08)]">
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "mb-2 flex items-center gap-3 rounded-[24px] px-4 py-4 text-sm font-medium transition",
                  location.pathname === link.href
                    ? "bg-[var(--color-primary)] text-white"
                    : "text-[var(--color-gray-600)] hover:bg-[var(--color-gray-100)]",
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
          </aside>
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
