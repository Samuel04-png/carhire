import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import {
  BarChart3,
  BriefcaseBusiness,
  CalendarRange,
  CarFront,
  Cog,
  FileBarChart,
  LayoutDashboard,
  LogOut,
  Menu,
  ShieldCheck,
  Users2,
  X,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/use-app-store";

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarRange },
  { href: "/admin/agreements", label: "Agreements", icon: BarChart3 },
  { href: "/admin/fleet", label: "Fleet", icon: CarFront },
  { href: "/admin/clients", label: "Clients", icon: Users2 },
  { href: "/admin/drivers", label: "Drivers", icon: BriefcaseBusiness },
  { href: "/admin/reports", label: "Reports", icon: FileBarChart },
  { href: "/admin/users", label: "Users", icon: Users2 },
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
  const navigate = useNavigate();
  const adminRole = useAppStore((state) => state.adminRole);
  const setAdminRole = useAppStore((state) => state.setAdminRole);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleSignOut = () => {
    setAdminRole(null);
    navigate("/admin");
  };

  return (
    <div className="min-h-dvh bg-[#f6f8fb] text-[var(--color-primary)] lg:h-dvh lg:overflow-hidden">
      <div className="flex min-h-dvh flex-col lg:h-dvh lg:flex-row lg:overflow-hidden">
        <div className="sticky top-0 z-40 border-b border-[var(--color-gray-200)] bg-white px-4 py-3 lg:hidden">
          <div className="flex items-center justify-between gap-3">
            <div className="rounded-lg border border-[var(--color-gray-200)] bg-white px-2 py-1.5 shadow-sm">
              <BrandLogo variant="boxed" imageClassName="h-10" />
            </div>
            <button
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              className="grid h-11 w-11 place-items-center rounded-2xl border border-[var(--color-gray-200)] bg-[var(--color-gray-100)]"
              aria-label={menuOpen ? "Close admin menu" : "Open admin menu"}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div
          className={cn(
            "fixed inset-0 z-50 bg-[rgba(10,22,40,0.54)] transition lg:hidden",
            menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
          )}
          onClick={() => setMenuOpen(false)}
        />

        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-[60] flex h-dvh w-[min(88vw,300px)] flex-col overflow-hidden bg-[var(--color-primary)] px-4 py-5 text-white shadow-[0_24px_80px_rgba(8,31,53,0.32)] transition-transform lg:sticky lg:top-0 lg:z-30 lg:w-[264px] lg:min-w-[264px] lg:translate-x-0 lg:border-r lg:border-white/8 lg:shadow-none",
            menuOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="shrink-0 rounded-xl border border-white/10 bg-white/[0.04] p-4">
            <div className="inline-flex rounded-lg bg-white p-2 shadow-sm">
              <BrandLogo variant="boxed" imageClassName="h-11" />
            </div>
            <div className="mt-4 flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.05] px-3 py-2 text-[11px] uppercase tracking-[0.16em] text-white/70">
              <ShieldCheck className="h-4 w-4 text-[var(--color-accent)]" />
              {adminRole ?? "Admin"}
            </div>
            <div className="mt-4 text-lg font-semibold tracking-[-0.02em]">Operations</div>
            <div className="mt-2 text-sm leading-6 text-white/64">
              Manage bookings, fleet availability, clients, drivers, and reports.
            </div>
          </div>

          <nav className="mt-6 min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
            {links.map((link) => {
              const active = location.pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors",
                    active
                      ? "bg-white text-[var(--color-primary)] shadow-[0_16px_36px_rgba(255,255,255,0.08)]"
                      : "text-white/72 hover:bg-white/8 hover:text-white",
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-6 shrink-0">
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
              <div className="text-[11px] uppercase tracking-[0.16em] text-white/45">
                Access note
              </div>
              <div className="mt-2 text-sm leading-6 text-white/66">
                Admin access is stored locally so client review flows can be tested end to end.
              </div>
            </div>

            <Button
              type="button"
              variant="ghost"
              className="mt-4 h-12 w-full justify-center rounded-md border-white/20 text-white hover:bg-white/10"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:h-dvh lg:min-h-0 lg:overflow-y-auto lg:px-8 xl:px-10">
          <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-accent)]">
                Admin operations
              </div>
              <h1 className="mt-2 font-display text-2xl font-semibold tracking-[-0.025em] text-[var(--color-primary)] sm:text-3xl">
                {title}
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--color-gray-600)]">{description}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex h-10 items-center rounded-md border border-[var(--color-gray-200)] bg-white px-3 text-sm font-medium text-[var(--color-gray-600)] shadow-sm">
                {adminRole ?? "Admin"} access
              </div>
              {actions}
            </div>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
