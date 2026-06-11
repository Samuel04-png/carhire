import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import {
  BarChart3,
  BriefcaseBusiness,
  CalendarRange,
  CarFront,
  CircleDot,
  Cog,
  FileBarChart,
  LayoutDashboard,
  LogOut,
  Menu,
  Users2,
  X,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/use-app-store";

const navGroups = [
  {
    label: "Main",
    links: [{ href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Operations",
    links: [
      { href: "/admin/bookings", label: "Bookings", icon: CalendarRange },
      { href: "/admin/agreements", label: "Agreements", icon: BarChart3 },
      { href: "/admin/fleet", label: "Fleet", icon: CarFront },
      { href: "/admin/clients", label: "Clients", icon: Users2 },
      { href: "/admin/drivers", label: "Drivers", icon: BriefcaseBusiness },
      { href: "/admin/reports", label: "Reports", icon: FileBarChart },
    ],
  },
  {
    label: "Admin",
    links: [
      { href: "/admin/users", label: "Users", icon: Users2 },
      { href: "/admin/settings", label: "Settings", icon: Cog },
    ],
  },
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
    <div className="min-h-dvh bg-[var(--bg-app)] text-[var(--text-main)] lg:h-dvh lg:overflow-hidden">
      <div className="flex min-h-dvh flex-col lg:h-dvh lg:flex-row lg:overflow-hidden">
        <div className="sticky top-0 z-40 border-b border-[var(--border-subtle)] bg-white/90 px-4 py-3 backdrop-blur-xl lg:hidden">
          <div className="flex items-center justify-between gap-3">
            <div className="rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-white px-2.5 py-1.5 shadow-[var(--shadow-card)]">
              <BrandLogo variant="boxed" imageClassName="h-9" />
            </div>
            <button
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              className="grid h-11 w-11 place-items-center rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--bg-surface-soft)] text-[var(--text-main)] transition-all duration-200 hover:bg-white"
              aria-label={menuOpen ? "Close admin menu" : "Open admin menu"}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div
          className={cn(
            "fixed inset-0 z-50 bg-[rgba(7,20,38,0.58)] backdrop-blur-sm transition lg:hidden",
            menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
          )}
          onClick={() => setMenuOpen(false)}
        />

        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-[60] flex h-dvh w-[min(88vw,270px)] flex-col overflow-hidden bg-[var(--bg-sidebar)] px-4 py-5 text-white shadow-[0_24px_80px_rgba(7,20,38,0.38)] transition-transform lg:sticky lg:top-0 lg:z-30 lg:w-[264px] lg:min-w-[264px] lg:translate-x-0 lg:border-r lg:border-white/10 lg:shadow-none",
            menuOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="shrink-0">
            <div className="rounded-[var(--radius-lg)] border border-white/10 bg-white/[0.06] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
              <div className="inline-flex rounded-[var(--radius-md)] bg-white p-2 shadow-[var(--shadow-card)]">
                <BrandLogo variant="boxed" imageClassName="h-10" />
              </div>
              <div className="mt-4">
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">Dots Admin</div>
                <div className="mt-1 text-base font-semibold tracking-[-0.01em] text-white">Operations</div>
              </div>
            </div>
          </div>

          <nav className="mt-5 min-h-0 flex-1 overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="space-y-5">
              {navGroups.map((group) => (
                <div key={group.label}>
                  <div className="mb-2 px-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">
                    {group.label}
                  </div>
                  <div className="space-y-1">
                    {group.links.map((link) => {
                      const active = location.pathname.startsWith(link.href);
                      return (
                        <Link
                          key={link.href}
                          to={link.href}
                          className={cn(
                            "group flex min-h-10 items-center gap-3 rounded-full px-3 py-2.5 text-sm font-semibold transition-all duration-200",
                            active
                              ? "bg-[var(--bg-sidebar-active)] text-[var(--bg-sidebar)] shadow-[0_10px_22px_rgba(0,0,0,0.16)]"
                              : "text-white/68 hover:bg-[var(--bg-sidebar-hover)] hover:text-white",
                          )}
                        >
                          <link.icon className={cn("h-4 w-4 shrink-0", active ? "text-[var(--brand)]" : "text-white/55 group-hover:text-white/85")} />
                          <span>{link.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </nav>

          <div className="mt-5 shrink-0 rounded-[var(--radius-lg)] border border-white/10 bg-white/[0.06] p-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">Local admin session</div>
                <div className="mt-1 flex items-center gap-2 text-sm font-semibold text-white/86">
                  <CircleDot className="h-3.5 w-3.5 fill-[var(--success-ui)] text-[var(--success-ui)]" />
                  Active
                </div>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              className="mt-3 h-10 w-full justify-center rounded-full border border-white/15 text-white hover:bg-white/10"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </aside>

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:h-dvh lg:min-h-0 lg:overflow-y-auto lg:px-8 xl:px-10">
          <div className="mx-auto w-full max-w-[1360px]">
            <div className="mb-7 rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-white/78 p-5 shadow-[var(--shadow-card)] backdrop-blur-xl sm:p-6">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--brand)]">
                    Admin operations
                  </div>
                  <h1 className="mt-2 font-display text-3xl font-semibold tracking-[-0.04em] text-[var(--text-main)] sm:text-4xl">
                    {title}
                  </h1>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--text-muted)]">{description}</p>
                </div>
                {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
              </div>
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
