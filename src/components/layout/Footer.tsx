import {
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import { Link } from "react-router-dom";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { company, offices, services } from "@/data/mock";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[var(--color-primary)] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(26,127,212,0.2),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(14,77,140,0.7),transparent_40%)]" />
      <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-20">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr_1fr_1.2fr]">
          <div className="space-y-6">
            <div>
              <div className="inline-flex rounded-[28px] border border-white/30 bg-white p-4 shadow-[0_20px_55px_rgba(10,22,40,0.18)]">
                <BrandLogo imageClassName="h-16 sm:h-20" />
              </div>
              <p className="mt-3 max-w-sm text-sm leading-7 text-white/70">
                Premium vehicles, professional service, and a digital-first booking
                experience built for business, events, airport transfers, and
                self-drive clients in Zambia.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href={`tel:${company.phone.replace(/\s+/g, "")}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-3 text-sm text-white/78 transition hover:bg-white/10 hover:text-white"
              >
                <Phone className="h-4 w-4 text-[var(--color-accent)]" />
                Call
              </a>
              <a
                href={`mailto:${company.email}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-3 text-sm text-white/78 transition hover:bg-white/10 hover:text-white"
              >
                <Mail className="h-4 w-4 text-[var(--color-accent)]" />
                Email
              </a>
              <a
                href={company.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-3 text-sm text-white/78 transition hover:bg-white/10 hover:text-white"
              >
                <MessageCircle className="h-4 w-4 text-[var(--color-accent)]" />
                WhatsApp
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-display text-lg font-semibold">Quick Links</h3>
            <div className="mt-5 space-y-3 text-sm text-white/70">
              <Link className="block transition hover:text-white" to="/fleet">
                Our Fleet
              </Link>
              <Link className="block transition hover:text-white" to="/services">
                Services
              </Link>
              <Link className="block transition hover:text-white" to="/pricing">
                Rates
              </Link>
              <Link className="block transition hover:text-white" to="/gallery">
                Gallery
              </Link>
              <Link className="block transition hover:text-white" to="/about">
                About Us
              </Link>
              <Link className="block transition hover:text-white" to="/locations">
                Locations
              </Link>
              <Link className="block transition hover:text-white" to="/faq">
                FAQ
              </Link>
              <Link className="block transition hover:text-white" to="/blog">
                Blog
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-display text-lg font-semibold">Services</h3>
            <div className="mt-5 space-y-3 text-sm text-white/70">
              {services.map((service) => (
                <Link
                  key={service.slug}
                  className="block transition hover:text-white"
                  to={`/services/${service.slug}`}
                >
                  {service.title}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-display text-lg font-semibold">Contact</h3>
            <div className="mt-5 space-y-4 text-sm text-white/70">
              <a
                href={`tel:${company.phone.replace(/\s+/g, "")}`}
                className="flex items-start gap-3 rounded-3xl border border-white/8 bg-white/6 p-4 transition hover:bg-white/8"
              >
                <Phone className="mt-1 h-4 w-4 text-[var(--color-accent)]" />
                <div>
                  <div>{company.phone}</div>
                  <div>{company.phoneAlt}</div>
                </div>
              </a>
              <a
                href={`mailto:${company.email}`}
                className="flex items-start gap-3 rounded-3xl border border-white/8 bg-white/6 p-4 transition hover:bg-white/8"
              >
                <Mail className="mt-1 h-4 w-4 text-[var(--color-accent)]" />
                <div>{company.email}</div>
              </a>
              <div className="rounded-3xl border border-white/8 bg-white/6 p-4">
                <div className="mb-3 flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-[var(--color-accent)]" />
                  <span className="font-semibold text-white">City offices</span>
                </div>
                <div className="space-y-3">
                  {offices.map((office) => (
                    <div key={office.city}>
                      <div className="font-medium text-white">{office.city}</div>
                      <div>{office.address}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
          <div>Copyright (c) {new Date().getFullYear()} Shark Car Hire Limited</div>
          <div className="flex flex-wrap gap-6">
            <Link to="/privacy" className="transition hover:text-white">
              Privacy Policy
            </Link>
            <Link to="/terms" className="transition hover:text-white">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>

      <a
        href={company.whatsapp}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_20px_60px_rgba(37,211,102,0.4)] transition hover:-translate-y-1"
        aria-label="Chat with Shark Car Hire on WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    </footer>
  );
}
