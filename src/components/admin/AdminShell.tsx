import type { ReactNode } from "react";
import {
  BarChart3,
  BriefcaseBusiness,
  CalendarRange,
  CarFront,
  Cog,
  LayoutDashboard,
  Users2,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarRange },
  { href: "/admin/fleet", label: "Fleet", icon: CarFront },
  { href: "/admin/clients", label: "Clients", icon: Users2 },
  { href: "/admin/drivers", label: "Drivers", icon: BriefcaseBusiness },
  { href: "/admin/reports/revenue", label: "Revenue", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Cog },
];

export function AdminShell({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[var(--color-gray-100)]">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-r border-[var(--color-gray-200)] bg-white px-4 py-6 shadow-[0_20px_70px_rgba(10,22,40,0.05)]">
          <div className="rounded-[28px] bg-[var(--color-primary)] p-5 text-white">
            <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">
              Admin console
            </div>
            <div className="mt-3 font-display text-2xl font-bold tracking-[-0.04em]">
              Shark Ops
            </div>
            <div className="mt-2 text-sm text-white/70">
              Operational command centre for bookings, fleet, drivers, and revenue.
            </div>
          </div>

          <nav className="mt-6 space-y-2">
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-[22px] px-4 py-4 text-sm font-medium transition",
                  location.pathname.startsWith(link.href)
                    ? "bg-[var(--color-primary)] text-white"
                    : "text-[var(--color-gray-600)] hover:bg-[var(--color-gray-100)]",
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="px-4 py-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.28em] text-[var(--color-accent)]">
                Admin & operations
              </div>
              <h1 className="mt-3 font-display text-4xl font-bold tracking-[-0.05em] text-[var(--color-primary)]">
                {title}
              </h1>
              <p className="mt-3 text-[var(--color-gray-600)]">{description}</p>
            </div>
            {actions}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
