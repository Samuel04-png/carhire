import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import {
  BarChart3,
  BriefcaseBusiness,
  CalendarRange,
  CarFront,
  Cog,
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
    <div className="min-h-screen bg-[linear-gradient(180deg,#f7fbff_0%,#eff4f9_100%)] text-[var(--color-primary)]">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-[300px_1fr]">
        <div className="sticky top-0 z-40 border-b border-[var(--color-gray-200)] bg-white/92 px-4 py-4 backdrop-blur-lg lg:hidden">
          <div className="flex items-center justify-between gap-3">
            <BrandLogo variant="boxed" imageClassName="h-11" />
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
            "fixed inset-y-0 left-0 z-[60] flex w-[min(88vw,320px)] flex-col bg-[var(--color-primary)] px-4 py-5 text-white shadow-[0_26px_90px_rgba(10,22,40,0.4)] transition-transform lg:static lg:w-auto lg:translate-x-0 lg:border-r lg:border-white/6",
            menuOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="rounded-[30px] border border-white/10 bg-white/8 p-5">
            <BrandLogo variant="transparent" imageClassName="h-12" />
            <div className="mt-5 flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs uppercase tracking-[0.24em] text-[var(--color-accent)]">
              <ShieldCheck className="h-4 w-4" />
              {adminRole ?? "Admin"}
            </div>
            <div className="mt-4 text-2xl font-bold tracking-[-0.04em]">Shark Ops</div>
            <div className="mt-2 text-sm leading-6 text-white/68">
              Bookings, fleet, clients, dispatch, and revenue in one responsive command center.
            </div>
          </div>

          <nav className="mt-6 flex-1 space-y-2 overflow-y-auto pr-1">
            {links.map((link) => {
              const active = location.pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "flex items-center gap-3 rounded-[22px] px-4 py-4 text-sm font-medium transition",
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

          <div className="mt-6 rounded-[28px] border border-white/10 bg-white/7 p-4">
            <div className="text-xs uppercase tracking-[0.22em] text-white/45">
              Access note
            </div>
            <div className="mt-3 text-sm leading-6 text-white/72">
              Demo admin access is local-state only. Actions persist in this browser session so flows can be reviewed end to end.
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            className="mt-4 h-12 justify-center rounded-full border-white/20 text-white hover:bg-white/10"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </aside>

        <main className="min-w-0 px-4 py-6 sm:px-6 lg:px-8 xl:px-10">
          <div className="mb-8 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.28em] text-[var(--color-accent)]">
                Admin & operations
              </div>
              <h1 className="mt-3 font-display text-4xl font-bold tracking-[-0.05em] text-[var(--color-primary)] sm:text-5xl">
                {title}
              </h1>
              <p className="mt-3 max-w-3xl text-[var(--color-gray-600)]">{description}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex h-11 items-center rounded-full border border-[var(--color-gray-200)] bg-white px-4 text-sm font-medium text-[var(--color-gray-600)] shadow-[0_10px_30px_rgba(10,22,40,0.05)]">
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
