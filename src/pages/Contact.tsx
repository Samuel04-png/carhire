import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import type { ReactNode } from "react";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Button } from "@/components/ui/button";
import { company } from "@/data/mock";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    window.setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Your enquiry has been received.");
      event.currentTarget.reset();
    }, 700);
  };

  return (
    <div className="bg-[var(--color-gray-100)] pb-20">
      <PageHero
        eyebrow="Contact"
        title="Speak to the team behind the fleet."
        description="Call, email, WhatsApp, or send an enquiry and our team will guide you to the right vehicle and service."
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Contact" },
        ]}
        image="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80"
      />

      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-[34px] border border-[var(--color-gray-200)] bg-[var(--color-primary)] p-8 text-white shadow-[0_20px_80px_rgba(10,22,40,0.18)]">
            <SectionHeader
              eyebrow="Direct channels"
              title="Fast ways to reach us"
              description="Choose the channel that suits your timing and we will take it from there."
              className="[&>h2]:text-white [&>p]:text-white/70"
            />
            <div className="mt-8 space-y-4">
              {[
                {
                  icon: Phone,
                  label: "Phone",
                  value: company.phone,
                  href: `tel:${company.phone.replace(/\s+/g, "")}`,
                },
                {
                  icon: Mail,
                  label: "Email",
                  value: company.email,
                  href: `mailto:${company.email}`,
                },
                {
                  icon: MessageCircle,
                  label: "WhatsApp",
                  value: "Chat with Shark Car Hire",
                  href: company.whatsapp,
                },
                {
                  icon: MapPin,
                  label: "HQ",
                  value: company.address,
                  href: "https://maps.google.com/?q=Lusaka%20Zambia",
                },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.label === "WhatsApp" || item.label === "HQ" ? "_blank" : undefined}
                  rel={item.label === "WhatsApp" || item.label === "HQ" ? "noreferrer" : undefined}
                  className="flex items-start gap-4 rounded-[28px] border border-white/10 bg-white/6 p-5 transition hover:bg-white/10"
                >
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--color-accent)]/16 text-[var(--color-accent)]">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.24em] text-white/55">
                      {item.label}
                    </div>
                    <div className="mt-2 text-sm text-white/80">{item.value}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="rounded-[34px] border border-[var(--color-gray-200)] bg-white p-8 shadow-[0_20px_70px_rgba(10,22,40,0.08)]">
            <SectionHeader
              eyebrow="Enquiry form"
              title="Tell us what you need"
              description="Share your dates, city, service type, and vehicle preference. We will reply with the best options for your journey."
            />

            <form onSubmit={handleSubmit} className="mt-8 grid gap-4 md:grid-cols-2">
              <Field label="First name">
                <input className={inputClassName} required placeholder="John" />
              </Field>
              <Field label="Last name">
                <input className={inputClassName} required placeholder="Doe" />
              </Field>
              <Field label="Email">
                <input className={inputClassName} required type="email" placeholder="john@example.com" />
              </Field>
              <Field label="Phone">
                <input className={inputClassName} required placeholder="+260 97 000 0000" />
              </Field>
              <Field label="Enquiry type">
                <select className={inputClassName} defaultValue="Corporate account">
                  <option>Corporate account</option>
                  <option>Airport transfer</option>
                  <option>Wedding cars</option>
                  <option>Event hire</option>
                  <option>Self-drive booking</option>
                  <option>Long-term lease</option>
                </select>
              </Field>
              <Field label="Preferred city">
                <select className={inputClassName} defaultValue="Lusaka">
                  <option>Lusaka</option>
                  <option>Kitwe</option>
                  <option>Ndola</option>
                </select>
              </Field>
              <div className="md:col-span-2">
                <Field label="Tell us what you need">
                  <textarea
                    className={`${inputClassName} min-h-[180px] resize-none py-4`}
                    required
                    placeholder="Dates, service type, vehicle preference, group size, or special requirements."
                  />
                </Field>
              </div>
              <div className="md:col-span-2">
                <Button type="submit" className="h-14 rounded-full px-8" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Send Enquiry"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-gray-500)]">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClassName =
  "h-14 w-full rounded-2xl border border-[var(--color-gray-200)] bg-[var(--color-gray-100)] px-4 text-[var(--color-primary)] outline-none transition focus:border-[var(--color-accent)]";
