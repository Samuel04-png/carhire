import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { company, offices, services } from "@/data/mock";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Our Fleet", href: "/fleet" },
  { label: "Pricing", href: "/pricing" },
  { label: "Gallery", href: "/gallery" },
  { label: "Services", href: "/services", children: services },
  { label: "About", href: "/about" },
  { label: "Locations", href: "/locations", children: offices },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setIsOpen(false), [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const navTone = useMemo(() => {
    if (isHome && !isScrolled) {
      return "bg-transparent";
    }
    return "bg-[rgba(10,22,40,0.86)] border-b border-white/8 shadow-[0_12px_60px_rgba(10,22,40,0.28)] backdrop-blur-xl";
  }, [isHome, isScrolled]);

  return (
    <header className={cn("fixed inset-x-0 top-0 z-50 transition-all duration-500", navTone)}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:py-4">
        <BrandLogo
          priority
          className="shrink-0 rounded-[24px] border border-white/50 bg-white/96 px-3 py-2 shadow-[0_18px_45px_rgba(10,22,40,0.16)] transition hover:bg-white"
          imageClassName="h-8 max-w-[150px] sm:h-9 sm:max-w-[175px] lg:h-10 lg:max-w-[205px]"
        />

        <nav className="hidden items-center gap-2 lg:flex">
          {navLinks.map((item) => (
            <div key={item.label} className="group relative">
              <Link
                to={item.href}
                className={cn(
                  "flex items-center gap-1 rounded-full px-4 py-3 text-sm font-medium text-white/72 transition hover:bg-white/6 hover:text-white",
                  location.pathname === item.href && "text-white",
                )}
              >
                {item.label}
                {item.children && <ChevronDown className="h-4 w-4 text-white/55" />}
              </Link>
              {location.pathname === item.href && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 -z-10 rounded-full border border-white/10 bg-white/6"
                />
              )}
              {item.children && (
                <div className="pointer-events-none absolute left-0 top-full mt-3 w-72 rounded-3xl border border-white/10 bg-[rgba(10,22,40,0.96)] p-3 opacity-0 shadow-[0_20px_80px_rgba(10,22,40,0.35)] transition duration-200 group-hover:pointer-events-auto group-hover:opacity-100">
                  {item.children.map((child) => (
                    <Link
                      key={"slug" in child ? child.slug : child.city}
                      to={
                        "slug" in child
                          ? `/services/${child.slug}`
                          : `/locations#${child.city.toLowerCase()}`
                      }
                      className="block rounded-2xl px-4 py-3 text-sm text-white/70 transition hover:bg-white/6 hover:text-white"
                    >
                      {"title" in child ? child.title : child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <a
            href={`tel:${company.phone.replace(/\s+/g, "")}`}
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-3 text-sm font-medium text-white/78 backdrop-blur transition hover:text-white"
          >
            <Phone className="h-4 w-4 text-[var(--color-accent)]" />
            {company.phone}
          </a>
          <Button asChild className="rounded-full px-6">
            <Link to="/book/step-1">Book Now</Link>
          </Button>
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/10 text-white lg:hidden sm:h-12 sm:w-12"
          onClick={() => setIsOpen(true)}
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-[rgba(10,22,40,0.72)] backdrop-blur-sm lg:hidden"
            onClick={() => setIsOpen(false)}
          >
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="ml-auto flex h-[100dvh] w-full max-w-sm flex-col overflow-hidden border-l border-white/10 bg-[var(--color-primary)] px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-[calc(1rem+env(safe-area-inset-top))] shadow-[-20px_0_80px_rgba(10,22,40,0.4)] sm:px-5"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <BrandLogo
                  priority
                  className="max-w-[210px] rounded-[24px] border border-white/40 bg-white px-3 py-2 shadow-[0_14px_32px_rgba(10,22,40,0.18)]"
                  imageClassName="h-10 max-w-full sm:h-12"
                />
                <button
                  className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/6 text-white sm:h-12 sm:w-12"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close navigation"
                >
                  <X className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>

              <div className="mt-6 min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
                {navLinks.map((item) => (
                  <div key={item.label} className="rounded-3xl border border-white/8 bg-white/5 p-2">
                    <Link
                      to={item.href}
                      className="block rounded-2xl px-4 py-4 text-base font-medium text-white sm:text-lg"
                    >
                      {item.label}
                    </Link>
                    {item.children && (
                      <div className="px-2 pb-2">
                        {item.children.map((child) => (
                          <Link
                            key={"slug" in child ? child.slug : child.city}
                            to={
                              "slug" in child
                                ? `/services/${child.slug}`
                                : `/locations#${child.city.toLowerCase()}`
                            }
                            className="block rounded-2xl px-4 py-3 text-sm text-white/70"
                          >
                            {"title" in child ? child.title : child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 shrink-0 space-y-4 border-t border-white/10 pt-5">
                <a
                  href={`tel:${company.phone.replace(/\s+/g, "")}`}
                  className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/6 px-4 py-4 text-white"
                >
                  <Phone className="h-5 w-5 text-[var(--color-accent)]" />
                  {company.phone}
                </a>
                <Button asChild className="h-14 w-full rounded-full">
                  <Link to="/book/step-1">Book Now</Link>
                </Button>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
