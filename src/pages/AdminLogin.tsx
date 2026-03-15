import type { ReactNode } from "react";
import { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/use-app-store";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const setAdminRole = useAppStore((state) => state.setAdminRole);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAdminRole("Super Admin");
    toast.success("Signed in to the admin dashboard.");
    navigate("/admin/dashboard");
  };

  return (
    <div className="min-h-screen bg-[var(--color-primary)] px-4 py-20">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[36px] bg-white/8 p-8 text-white">
          <div className="text-xs uppercase tracking-[0.3em] text-[var(--color-accent)]">
            Admin login
          </div>
          <h1 className="mt-4 font-display text-5xl font-bold tracking-[-0.06em]">
            Operations, fleet, clients, and revenue in one place.
          </h1>
          <p className="mt-6 text-white/72">
            Sign in to manage today's bookings, vehicle availability, client records,
            driver assignments, and payment follow-up.
          </p>
        </div>

        <div className="rounded-[36px] border border-white/10 bg-white p-8 shadow-[0_20px_80px_rgba(10,22,40,0.24)]">
          <div className="mb-6 inline-flex rounded-[24px] border border-[var(--color-gray-200)] bg-[var(--color-gray-100)] p-3">
            <BrandLogo variant="boxed" imageClassName="h-14 sm:h-16" />
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Email">
              <input className={inputClassName} defaultValue="admin@sharkcarhire.com" />
            </Field>
            <Field label="Password">
              <input className={inputClassName} type="password" defaultValue="password123" />
            </Field>
            <Field label="Role">
              <select className={inputClassName} defaultValue="Super Admin">
                <option>Super Admin</option>
                <option>Operations Manager</option>
                <option>Booking Agent</option>
                <option>Accountant</option>
              </select>
            </Field>
            <Button type="submit" className="mt-4 h-14 rounded-full px-8">
              Enter Dashboard
            </Button>
          </form>
        </div>
      </div>
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
      <div className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-gray-500)]">
        {label}
      </div>
      {children}
    </label>
  );
}

const inputClassName =
  "h-14 w-full rounded-2xl border border-[var(--color-gray-200)] bg-[var(--color-gray-100)] px-4 outline-none focus:border-[var(--color-accent)]";
